// 1. นำเข้าโมดูลที่จำเป็นสำหรับการทำงานหลังบ้าน
require('dotenv').config();
const express = require('express'); // Express Framework สำหรับสร้าง API endpoints และจัดการ Routing
const cors = require('cors');       // CORS Middleware สำหรับอนุญาตให้หน้าบ้านต่างพอร์ต (เช่น Vue running on port 8080) เชื่อมต่อ API ได้
const mysql = require('mysql2/promise'); // ไลบรารี MySQL client รองรับระบบ Promise เพื่อเขียนแบบ async/await ได้ง่ายขึ้น

// 2. สร้างแอปพลิเคชัน Express
const app = express();
app.use(cors());         // อนุญาตให้หน้าบ้าน Vue ยิงข้ามพอร์ตมาคุยได้
app.use(express.json()); // สั่งให้เซิร์ฟเวอร์อ่านค่า JSON ที่หน้าบ้านส่งมาให้ได้

// 3. ตั้งค่าการเชื่อมต่อไปยังฐานข้อมูล MySQL
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'rootpassword',
    database: process.env.DB_NAME || 'store_db',
    port: process.env.DB_PORT || 3306
};

// เพิ่มการตั้งค่า SSL หากเชื่อมต่อกับ TiDB Cloud หรือคลาวด์อื่นๆ ที่บังคับใช้ SSL
if (dbConfig.host.includes('tidbcloud.com') || dbConfig.host.includes('aivencloud.com')) {
    dbConfig.ssl = {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true
    };
}

// ==========================================
// --- API สำหรับจัดการสินค้าทั่วไป (PRODUCT CRUD) ---
// ==========================================

// 1. [READ] ดึงข้อมูลสินค้าทั้งหมดจากตาราง products
app.get('/api/products', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig); // สร้างช่องทางเชื่อมฐานข้อมูล
        const [rows] = await connection.query('SELECT * FROM products ORDER BY id DESC'); // รัน SQL ค้นหาสินค้าทั้งหมด เรียงจากล่าสุด
        await connection.end(); // ปิดช่องเชื่อมต่อเพื่อป้องกันการรั่วไหล (Leak)
        res.json(rows); // ส่งข้อมูลผลลัพธ์กลับไปให้ฝั่งหน้าบ้านแบบ JSON
    } catch (error) {
        res.status(500).json({ error: error.message }); // ส่ง Error 500 กลับไปหากระบบฐานข้อมูลขัดข้อง
    }
});

// 2. [CREATE] เพิ่มสินค้าชิ้นใหม่ลงตาราง products
app.post('/api/products', async (req, res) => {
    try {
        const { name, price } = req.body; // รับค่าชื่อสินค้าและราคาจาก Request Body ที่หน้าบ้านส่งมา
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.query('INSERT INTO products (name, price) VALUES (?, ?)', [name, price]);
        await connection.end();
        res.json({ success: true, id: result.insertId }); // ส่ง ID สินค้าที่เพิ่งถูกบันทึกกลับไป
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 3. [DELETE] ลบสินค้าออกจากฐานข้อมูลตามรหัส (ID)
app.delete('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params; // รับค่า ID จาก URL Parameter
        const connection = await mysql.createConnection(dbConfig);
        await connection.query('DELETE FROM products WHERE id = ?', [id]);
        await connection.end();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 4. [READ SINGLE] ดึงรายละเอียดของสินค้าชิ้นเดียวตาม ID
app.get('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.query('SELECT * FROM products WHERE id = ?', [id]);
        await connection.end();
        
        if (rows.length > 0) {
            res.json(rows[0]); // ส่งข้อมูลตัวสินค้ากลับไป
        } else {
            res.status(404).json({ message: 'ไม่พบข้อมูลสินค้านี้' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 5. [UPDATE] อัปเดตข้อมูลของสินค้าที่มีอยู่เดิมตาม ID
app.put('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price } = req.body; // รับชื่อและราคาที่ผ่านการอัปเดตเข้ามา
        const connection = await mysql.createConnection(dbConfig);
        await connection.query('UPDATE products SET name = ?, price = ? WHERE id = ?', [name, price, id]);
        await connection.end();
        
        res.json({ success: true, message: 'อัปเดตข้อมูลสำเร็จ' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==========================================
// --- API สำหรับระบบสมัครสมาชิกและเข้าสู่ระบบ (AUTH) ---
// ==========================================

// [REGISTER] สมัครสมาชิก
app.post('/api/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const connection = await mysql.createConnection(dbConfig);
        
        // เช็คว่ามีอีเมลนี้ซ้ำในตาราง users หรือยัง
        const [existingUser] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            await connection.end();
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }

        // หากยังไม่มี ให้เพิ่มบัญชีผู้ใช้ใหม่ลงในฐานข้อมูล (กำหนด Role เริ่มต้นเป็น 'user')
        const [result] = await connection.query('INSERT INTO users (email, password, role) VALUES (?, ?, ?)', [email, password, 'user']);
        await connection.end();
        
        res.json({ success: true, message: 'User registered successfully', userId: result.insertId });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// [LOGIN] เข้าสู่ระบบ
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const connection = await mysql.createConnection(dbConfig);
        
        const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
        const queryParams = [email, password];

        const [users] = await connection.query(query, queryParams);
        await connection.end();
        
        if (users.length > 0) {
            // หากเข้าสู่ระบบสำเร็จ ส่งข้อมูลอีเมลและบทบาทการทำงาน (Role) กลับไปเก็บที่ LocalStorage หน้าร้าน
            res.json({ 
                success: true, 
                message: 'Login successful', 
                user: { 
                    id: users[0].id, 
                    email: users[0].email,
                    role: users[0].role || 'user'
                } 
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// [GOOGLE LOGIN] ล็อกอินหรือสมัครสมาชิกด้วย Google
app.post('/api/auth/google', async (req, res) => {
    try {
        const { token, email, name, picture } = req.body;
        
        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required from Google' });
        }

        const connection = await mysql.createConnection(dbConfig);
        
        // เช็คว่ามีผู้ใช้นี้ในระบบหรือยัง
        const [existingUser] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
        
        let user;
        if (existingUser.length > 0) {
            // ถ้ามีแล้วก็ล็อกอินเลย
            user = existingUser[0];
            
            // อัปเดตข้อมูลบางอย่างถ้าต้องการ (เช่น รูป)
            // await connection.query('UPDATE users SET ... WHERE id = ?', [user.id]);
        } else {
            // ถ้ายังไม่มี ให้สมัครสมาชิกใหม่
            const [result] = await connection.query(
                'INSERT INTO users (email, password, role, first_name) VALUES (?, ?, ?, ?)',
                [email, 'google_oauth_dummy_pass', 'user', name]
            );
            user = {
                id: result.insertId,
                email: email,
                role: 'user'
            };
        }
        
        await connection.end();
        
        res.json({ 
            success: true, 
            message: 'Google login successful', 
            user: { 
                id: user.id, 
                email: user.email,
                role: user.role || 'user'
            } 
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// [FACEBOOK LOGIN] ล็อกอินหรือสมัครสมาชิกด้วย Facebook
app.post('/api/auth/facebook', async (req, res) => {
    try {
        const { token, email, name, picture } = req.body;
        
        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required from Facebook' });
        }

        const connection = await mysql.createConnection(dbConfig);
        
        // เช็คว่ามีผู้ใช้นี้ในระบบหรือยัง
        const [existingUser] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
        
        let user;
        if (existingUser.length > 0) {
            // ถ้ามีแล้วก็ล็อกอินเลย
            user = existingUser[0];
        } else {
            // ถ้ายังไม่มี ให้สมัครสมาชิกใหม่
            const [result] = await connection.query(
                'INSERT INTO users (email, password, role, first_name) VALUES (?, ?, ?, ?)',
                [email, 'facebook_oauth_dummy_pass', 'user', name]
            );
            user = {
                id: result.insertId,
                email: email,
                role: 'user'
            };
        }
        
        await connection.end();
        
        res.json({ 
            success: true, 
            message: 'Facebook login successful', 
            user: { 
                id: user.id, 
                email: user.email,
                role: user.role || 'user'
            } 
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// [GET PROFILE] ดึงข้อมูลส่วนตัวของผู้ใช้

app.get('/api/profile', async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }
        
        const connection = await mysql.createConnection(dbConfig);
        const [users] = await connection.query('SELECT email, first_name, last_name, phone, gender, birthday, line_id, facebook FROM users WHERE email = ?', [email]);
        await connection.end();
        
        if (users.length > 0) {
            const user = users[0];
            res.json({
                success: true,
                profile: {
                    email: user.email,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    phone: user.phone,
                    gender: user.gender,
                    birthday: user.birthday,
                    lineId: user.line_id,
                    facebook: user.facebook
                }
            });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// [UPDATE PROFILE] อัปเดตข้อมูลส่วนตัวของผู้ใช้
app.post('/api/profile', async (req, res) => {
    try {
        const { email, firstName, lastName, phone, gender, birthday, lineId, facebook } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }
        
        const connection = await mysql.createConnection(dbConfig);
        
        // เช็คว่ามีผู้ใช้นี้อยู่จริงหรือไม่
        const [users] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            await connection.end();
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const formattedBirthday = birthday ? birthday : null;

        await connection.query(
            'UPDATE users SET first_name = ?, last_name = ?, phone = ?, gender = ?, birthday = ?, line_id = ?, facebook = ? WHERE email = ?',
            [firstName, lastName, phone, gender, formattedBirthday, lineId, facebook, email]
        );
        await connection.end();
        
        res.json({ success: true, message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==========================================
// --- PC PARTS CRUD APIs (จัดสเปกคอม) ---
// ==========================================

// 1. [READ ALL] ดึงชิ้นส่วนคอมพิวเตอร์ทั้งหมด
app.get('/api/pc-parts', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.query('SELECT * FROM pc_parts ORDER BY db_id DESC');
        await connection.end();
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. [READ SINGLE] ดึงข้อมูลชิ้นส่วนชิ้นเดียว
app.get('/api/pc-parts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.query('SELECT * FROM pc_parts WHERE id = ? OR db_id = ?', [id, id]);
        await connection.end();
        
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ message: 'ไม่พบข้อมูลชิ้นส่วนนี้' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. [CREATE] เพิ่มชิ้นส่วนใหม่
app.post('/api/pc-parts', async (req, res) => {
    try {
        const { category, brand, series, name, price, specs, socket } = req.body;
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.query(
            'INSERT INTO pc_parts (category, brand, series, name, price, specs, socket) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [category, brand, series || '', name, parseFloat(price), specs || '', socket || '']
        );
        const insertId = result.insertId;
        
        // กำหนดรหัส ID อุปกรณ์เลียนแบบชิ้นส่วนเดิม
        const shortCodes = {
            'cpu': 'cpu', 'motherboard': 'mb', 'gpu': 'gpu', 'ram': 'ram',
            'hdd': 'hdd', 'ssd': 'ssd', 'm2': 'm2', 'psu': 'psu', 'case': 'case',
            'liquid_cooler': 'lc', 'cpu_cooler': 'cc', 'case_fan': 'cf',
            'mouse': 'ms', 'keyboard': 'kb', 'monitor': 'mn', 'accessories': 'ac',
            'gaming_gear': 'gg', 'software': 'sw'
        };
        const code = shortCodes[category] || 'part';
        const generatedId = `${code}-${insertId}`;
        
        await connection.query('UPDATE pc_parts SET id = ? WHERE db_id = ?', [generatedId, insertId]);
        await connection.end();
        
        res.json({ success: true, id: generatedId, db_id: insertId });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 4. [UPDATE] อัปเดตข้อมูลชิ้นส่วนเดิม
app.put('/api/pc-parts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { category, brand, series, name, price, specs, socket } = req.body;
        const connection = await mysql.createConnection(dbConfig);
        
        await connection.query(
            'UPDATE pc_parts SET category = ?, brand = ?, series = ?, name = ?, price = ?, specs = ?, socket = ? WHERE id = ? OR db_id = ?',
            [category, brand, series || '', name, parseFloat(price), specs || '', socket || '', id, id]
        );
        await connection.end();
        res.json({ success: true, message: 'อัปเดตข้อมูลชิ้นส่วนสำเร็จ' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 5. [DELETE] ลบชิ้นส่วนออก
app.delete('/api/pc-parts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await mysql.createConnection(dbConfig);
        await connection.query('DELETE FROM pc_parts WHERE id = ? OR db_id = ?', [id, id]);
        await connection.end();
        res.json({ success: true, message: 'ลบชิ้นส่วนคอมพิวเตอร์สำเร็จ' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});


// ==========================================
// --- PC SETS CRUD APIs (คอมพิวเตอร์เซต) ---
// ==========================================

// 1. [READ ALL] ดึงคอมพิวเตอร์เซตทั้งหมด
app.get('/api/pc-sets', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.query('SELECT * FROM pc_sets ORDER BY db_id DESC');
        await connection.end();
        
        const parsedRows = rows.map(row => {
            try {
                row.partsList = JSON.parse(row.parts_list);
            } catch (e) {
                row.partsList = [];
            }
            return row;
        });
        res.json(parsedRows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. [READ SINGLE] ดึงข้อมูลคอมพิวเตอร์เซตเครื่องเดียว
app.get('/api/pc-sets/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.query('SELECT * FROM pc_sets WHERE id = ? OR db_id = ?', [id, id]);
        await connection.end();
        
        if (rows.length > 0) {
            const row = rows[0];
            try {
                row.partsList = JSON.parse(row.parts_list);
            } catch (e) {
                row.partsList = [];
            }
            res.json(row);
        } else {
            res.status(404).json({ message: 'ไม่พบข้อมูลคอมพิวเตอร์เซตนี้' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. [CREATE] เพิ่มคอมพิวเตอร์เซตใหม่
app.post('/api/pc-sets', async (req, res) => {
    try {
        const { name, purpose, category, cpu_brand, badge_type, badge_text, original_price, price, parts_list } = req.body;
        const connection = await mysql.createConnection(dbConfig);
        
        const [result] = await connection.query(
            'INSERT INTO pc_sets (name, purpose, category, cpu_brand, badge_type, badge_text, original_price, price, parts_list) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [name, purpose, category, cpu_brand, badge_type, badge_text, parseFloat(original_price), parseFloat(price), typeof parts_list === 'string' ? parts_list : JSON.stringify(parts_list)]
        );
        const insertId = result.insertId;
        const generatedId = `set-${insertId}`;
        
        await connection.query('UPDATE pc_sets SET id = ? WHERE db_id = ?', [generatedId, insertId]);
        await connection.end();
        
        res.json({ success: true, id: generatedId, db_id: insertId });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 4. [UPDATE] อัปเดตข้อมูลคอมพิวเตอร์เซตเดิม
app.put('/api/pc-sets/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, purpose, category, cpu_brand, badge_type, badge_text, original_price, price, parts_list } = req.body;
        const connection = await mysql.createConnection(dbConfig);
        
        await connection.query(
            'UPDATE pc_sets SET name = ?, purpose = ?, category = ?, cpu_brand = ?, badge_type = ?, badge_text = ?, original_price = ?, price = ?, parts_list = ? WHERE id = ? OR db_id = ?',
            [name, purpose, category, cpu_brand, badge_type, badge_text, parseFloat(original_price), parseFloat(price), typeof parts_list === 'string' ? parts_list : JSON.stringify(parts_list), id, id]
        );
        await connection.end();
        res.json({ success: true, message: 'อัปเดตข้อมูลคอมพิวเตอร์เซตสำเร็จ' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 5. [DELETE] ลบคอมพิวเตอร์เซตออก
app.delete('/api/pc-sets/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await mysql.createConnection(dbConfig);
        await connection.query('DELETE FROM pc_sets WHERE id = ? OR db_id = ?', [id, id]);
        await connection.end();
        res.json({ success: true, message: 'ลบคอมพิวเตอร์เซตสำเร็จ' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==========================================
// --- PRODUCT REVIEWS APIs (ระบบรีวิวสินค้า) ---
// ==========================================

// 0. [READ STATS] ดึงคะแนนเฉลี่ยและจำนวนรีวิวรวมของสินค้าทั้งหมด
app.get('/api/reviews-stats', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.query(
            'SELECT product_id, COUNT(*) as totalReviews, ROUND(AVG(rating), 1) as avgRating FROM product_reviews GROUP BY product_id'
        );
        await connection.end();
        
        const stats = {};
        rows.forEach(row => {
            stats[row.product_id] = {
                totalReviews: parseInt(row.totalReviews),
                avgRating: parseFloat(row.avgRating)
            };
        });
        
        res.json({ success: true, stats });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 1. [READ] ดึงข้อมูลรีวิวของสินค้าพร้อมสถิติ rating
app.get('/api/reviews/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.query(
            'SELECT id, product_id, product_name, user_email, rating, comment, DATE_FORMAT(created_at, "%Y-%m-%d %H:%i") as date FROM product_reviews WHERE product_id = ? ORDER BY id DESC', 
            [productId]
        );
        await connection.end();
        
        let avgRating = 0;
        let totalReviews = rows.length;
        let ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        
        if (totalReviews > 0) {
            const sum = rows.reduce((acc, row) => {
                const r = Math.min(5, Math.max(1, parseInt(row.rating)));
                ratingDistribution[r] = (ratingDistribution[r] || 0) + 1;
                return acc + r;
            }, 0);
            avgRating = parseFloat((sum / totalReviews).toFixed(1));
        }
        
        res.json({
            success: true,
            productId,
            totalReviews,
            avgRating,
            ratingDistribution,
            reviews: rows
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 2. [CREATE] ส่งรีวิวใหม่
app.post('/api/reviews', async (req, res) => {
    try {
        const { product_id, product_name, user_email, rating, comment } = req.body;
        
        if (!product_id || !product_name || !user_email || !rating || !comment) {
            return res.status(400).json({ success: false, message: 'กรุณากรอกข้อมูลรีวิวให้ครบถ้วน!' });
        }
        
        const parsedRating = parseInt(rating);
        if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
            return res.status(400).json({ success: false, message: 'คะแนนรีวิวต้องอยู่ระหว่าง 1 ถึง 5 ดาว!' });
        }
        
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.query(
            'INSERT INTO product_reviews (product_id, product_name, user_email, rating, comment) VALUES (?, ?, ?, ?, ?)',
            [product_id, product_name, user_email, parsedRating, comment]
        );
        await connection.end();
        
        res.json({
            success: true,
            message: 'ส่งรีวิวสำเร็จ ขอบคุณสำหรับความคิดเห็นของคุณ!',
            reviewId: result.insertId
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 3. [READ ALL REVIEWS] ดึงข้อมูลรีวิวทั้งหมดของร้าน
app.get('/api/reviews', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.query(
            'SELECT id, product_id, product_name, user_email, rating, comment, DATE_FORMAT(created_at, "%Y-%m-%d %H:%i") as date FROM product_reviews ORDER BY id DESC'
        );
        await connection.end();
        res.json({ success: true, reviews: rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});


// ==========================================
// --- ORDER MANAGEMENT APIs (ระบบสั่งซื้อ) ---
// ==========================================

// 1. [CREATE ORDER] บันทึกใบสั่งซื้อและสินค้าลงในฐานข้อมูล
app.post('/api/orders', async (req, res) => {
    try {
        const { userEmail, shipping, payment, items, totalDiscount, finalTotal, orderNumber } = req.body;
        
        if (!shipping || !items || items.length === 0 || !orderNumber) {
            return res.status(400).json({ success: false, message: 'กรุณากรอกข้อมูลและสินค้าสั่งซื้อให้ครบถ้วน!' });
        }

        const connection = await mysql.createConnection(dbConfig);
        await connection.beginTransaction();

        try {
            // บันทึกลงตาราง orders
            const [orderResult] = await connection.query(`
                INSERT INTO orders (
                    order_number, user_email, full_name, phone, email, 
                    shipping_method, address, pickup_branch, 
                    payment_method, payment_bank, payment_term, 
                    discount, total_amount, status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                orderNumber,
                userEmail || shipping.email || '',
                shipping.fullName,
                shipping.phone,
                shipping.email,
                shipping.method,
                shipping.method === 'delivery' ? shipping.address : null,
                shipping.method === 'pickup' ? shipping.pickupBranch : null,
                payment.method,
                payment.installmentBank || null,
                payment.installmentTerm || null,
                totalDiscount || 0.00,
                finalTotal,
                'pending'
            ]);

            const orderId = orderResult.insertId;

            // บันทึกรายการสินค้าลง order_items
            for (const item of items) {
                await connection.query(`
                    INSERT INTO order_items (order_id, product_name, price, qty)
                    VALUES (?, ?, ?, ?)
                `, [orderId, item.name, item.price, item.qty]);
            }

            await connection.commit();
            await connection.end();
            
            res.json({ success: true, message: 'บันทึกใบสั่งซื้อเสร็จสมบูรณ์!', orderId });
        } catch (dbError) {
            await connection.rollback();
            await connection.end();
            throw dbError;
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 2. [READ ORDERS] ดึงประวัติคำสั่งซื้อของผู้ใช้
app.get('/api/orders', async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) {
            return res.status(400).json({ success: false, message: 'กรุณาระบุอีเมลเพื่อดึงข้อมูลประวัติสั่งซื้อ!' });
        }

        const connection = await mysql.createConnection(dbConfig);
        
        // ดึงใบสั่งซื้อทั้งหมดของอีเมลนี้ เรียงจากล่าสุดไปเก่าสุด
        const [orders] = await connection.query(
            'SELECT * FROM orders WHERE user_email = ? OR email = ? ORDER BY id DESC',
            [email, email]
        );

        const ordersWithItems = [];
        for (const order of orders) {
            const [items] = await connection.query(
                'SELECT * FROM order_items WHERE order_id = ?',
                [order.id]
            );
            ordersWithItems.push({
                ...order,
                items: items
            });
        }

        await connection.end();
        res.json({ success: true, orders: ordersWithItems });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==========================================
// --- API สำหรับการจัดการที่อยู่และช่องทางการชำระเงิน (ADDRESS & PAYMENT METHOD) ---
// ==========================================

// 1. [GET ADDRESSES] ดึงข้อมูลที่อยู่ของผู้ใช้
app.get('/api/addresses', async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) {
            return res.status(400).json({ success: false, message: 'กรุณาระบุอีเมลเพื่อดึงข้อมูลที่อยู่!' });
        }
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.query(
            'SELECT * FROM user_addresses WHERE user_email = ? ORDER BY is_default DESC, id DESC',
            [email]
        );
        await connection.end();
        res.json({ success: true, addresses: rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 2. [POST ADDRESS (ADD/EDIT)] เพิ่มหรือแก้ไขข้อมูลที่อยู่
app.post('/api/addresses', async (req, res) => {
    try {
        const { id, userEmail, type, fullName, phone, addressLine, taxId, isDefault } = req.body;
        if (!userEmail || !type || !fullName || !phone || !addressLine) {
            return res.status(400).json({ success: false, message: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน!' });
        }

        const connection = await mysql.createConnection(dbConfig);
        
        let addressId = id;
        const defaultFlag = isDefault ? 1 : 0;

        if (id) {
            // แก้ไขข้อมูลเดิม (Edit existing)
            await connection.query(`
                UPDATE user_addresses 
                SET type = ?, full_name = ?, phone = ?, address_line = ?, tax_id = ?, is_default = ? 
                WHERE id = ? AND user_email = ?
            `, [type, fullName, phone, addressLine, taxId || null, defaultFlag, id, userEmail]);
        } else {
            // เพิ่มข้อมูลใหม่ (Add new)
            // ตรวจสอบว่านี่เป็นที่อยู่แรกของประเภทนี้สำหรับผู้ใช้นี้หรือไม่
            const [existing] = await connection.query(
                'SELECT id FROM user_addresses WHERE user_email = ? AND type = ?',
                [userEmail, type]
            );
            
            // หากเป็นที่อยู่แรก ให้บังคับตั้งเป็นค่าเริ่มต้นอัตโนมัติ
            const finalDefaultFlag = existing.length === 0 ? 1 : defaultFlag;

            const [result] = await connection.query(`
                INSERT INTO user_addresses (user_email, type, full_name, phone, address_line, tax_id, is_default)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `, [userEmail, type, fullName, phone, addressLine, taxId || null, finalDefaultFlag]);
            addressId = result.insertId;
        }

        // หากตั้งที่อยู่นี้เป็นค่าเริ่มต้น ให้ยกเลิกค่าเริ่มต้นของที่อยู่อื่นๆ ในประเภทเดียวกันของผู้ใช้นี้
        if (defaultFlag === 1) {
            await connection.query(
                'UPDATE user_addresses SET is_default = 0 WHERE user_email = ? AND type = ? AND id != ?',
                [userEmail, type, addressId]
            );
        }

        await connection.end();
        res.json({ success: true, message: 'บันทึกที่อยู่เรียบร้อยแล้ว!', id: addressId });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});


// ==========================================
// 3. API สำหรับตั้งค่าที่อยู่ให้เป็นค่าเริ่มต้น (Set Address Default)
// ==========================================
// ใช้สำหรับระบุว่าที่อยู่ ID นี้จะเป็นที่อยู่หลักในการจัดส่งหรือออกใบกำกับภาษี
app.put('/api/addresses/:id/default', async (req, res) => {
    try {
        const { id } = req.params; // รับ ID ของที่อยู่จาก URL Parameter
        const connection = await mysql.createConnection(dbConfig); // เชื่อมต่อฐานข้อมูล
        
        // ค้นหาข้อมูลที่อยู่ปัจจุบันเพื่อดูอีเมลเจ้าของและประเภท (จัดส่ง/ใบเสร็จ)
        const [rows] = await connection.query('SELECT user_email, type FROM user_addresses WHERE id = ?', [id]);
        if (rows.length === 0) {
            await connection.end();
            return res.status(404).json({ success: false, message: 'ไม่พบที่อยู่นี้' });
        }
        
        const { user_email, type } = rows[0];
        
        // เริ่มต้น Transaction เพื่อป้องกันการอัปเดตไม่สมบูรณ์
        await connection.beginTransaction();
        try {
            // 1. ตั้งค่าที่อยู่อื่นๆ ทั้งหมดของผู้ใช้ในประเภทเดียวกันนี้ให้ไม่ใช่ค่าเริ่มต้น (is_default = 0)
            await connection.query('UPDATE user_addresses SET is_default = 0 WHERE user_email = ? AND type = ?', [user_email, type]);
            // 2. ตั้งค่าที่อยู่ชิ้นที่ต้องการให้เป็นค่าเริ่มต้นหลัก (is_default = 1)
            await connection.query('UPDATE user_addresses SET is_default = 1 WHERE id = ?', [id]);
            await connection.commit(); // ยืนยันการทำธุรกรรม
        } catch (txErr) {
            await connection.rollback(); // ย้อนกลับหากเกิดข้อผิดพลาด
            throw txErr;
        }
        
        await connection.end(); // ปิดการเชื่อมต่อ
        res.json({ success: true, message: 'ตั้งค่าที่อยู่เริ่มต้นสำเร็จ!' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==========================================
// 4. API สำหรับลบที่อยู่ของผู้ใช้งาน (Delete Address)
// ==========================================
// ใช้ในการลบข้อมูลที่อยู่ออกจากระบบ และอัปเดตค่าเริ่มต้นใหม่หากที่อยู่เดิมถูกลบ
app.delete('/api/addresses/:id', async (req, res) => {
    try {
        const { id } = req.params; // รับ ID ที่อยู่จาก URL Parameter
        const connection = await mysql.createConnection(dbConfig);
        
        // ค้นหาข้อมูลที่อยู่ก่อนลบเพื่อตรวจสอบว่าเป็นที่อยู่หลัก (Default) หรือไม่
        const [rows] = await connection.query('SELECT user_email, type, is_default FROM user_addresses WHERE id = ?', [id]);
        if (rows.length === 0) {
            await connection.end();
            return res.status(404).json({ success: false, message: 'ไม่พบที่อยู่นี้' });
        }
        
        const { user_email, type, is_default } = rows[0];
        
        // ทำการลบที่อยู่ออกจากฐานข้อมูล
        await connection.query('DELETE FROM user_addresses WHERE id = ?', [id]);
        
        // หากที่อยู่ที่ลบไปเป็นค่าเริ่มต้นหลัก ให้ค้นหาที่อยู่อื่นที่เหลือมาตั้งเป็นค่าเริ่มต้นทดแทน
        if (is_default === 1) {
            const [others] = await connection.query(
                'SELECT id FROM user_addresses WHERE user_email = ? AND type = ? ORDER BY id DESC LIMIT 1',
                [user_email, type]
            );
            // ถ้ายังมีที่อยู่อื่นเหลืออยู่ ให้ตั้งตัวที่เหลือล่าสุดเป็นค่าเริ่มต้นหลักตัวใหม่
            if (others.length > 0) {
                await connection.query('UPDATE user_addresses SET is_default = 1 WHERE id = ?', [others[0].id]);
            }
        }
        
        await connection.end();
        res.json({ success: true, message: 'ลบที่อยู่สำเร็จ!' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==========================================
// 5. API สำหรับดึงรายการช่องทางชำระเงิน (Get Payment Methods)
// ==========================================
// ใช้ดึงรายการข้อมูลบัตรเครดิต/เดบิตที่บันทึกไว้ของแต่ละผู้ใช้งาน เรียงตามบัตรหลักก่อน
app.get('/api/payment-methods', async (req, res) => {
    try {
        const { email } = req.query; // รับอีเมลผู้ใช้งานจาก Query String
        if (!email) {
            return res.status(400).json({ success: false, message: 'กรุณาระบุอีเมล!' });
        }
        const connection = await mysql.createConnection(dbConfig);
        
        // ดึงช่องทางการชำระเงิน โดยเรียงบัตรที่เป็นค่าเริ่มต้น (is_default = 1) ขึ้นก่อน และเรียงตามลำดับล่าสุด
        const [rows] = await connection.query(
            'SELECT * FROM user_payment_methods WHERE user_email = ? ORDER BY is_default DESC, id DESC',
            [email]
        );
        await connection.end();
        res.json({ success: true, paymentMethods: rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==========================================
// 6. API สำหรับเพิ่มช่องทางการชำระเงิน (Post Payment Method)
// ==========================================
// ใช้เพื่อบันทึกข้อมูลบัตรเครดิต/เดบิตใบใหม่ของผู้ใช้งานลงในระบบ
app.post('/api/payment-methods', async (req, res) => {
    try {
        const { userEmail, cardNumber, cardHolder, expiryDate, cardProvider, isDefault } = req.body;
        // ตรวจสอบความถูกต้องของข้อมูลที่ส่งเข้ามา
        if (!userEmail || !cardNumber || !cardHolder || !expiryDate || !cardProvider) {
            return res.status(400).json({ success: false, message: 'กรุณากรอกข้อมูลบัตรให้ครบถ้วน!' });
        }

        const cleanCardNumber = cardNumber.replace(/\s+/g, ''); // ลบช่องว่างในเลขบัตรออกให้เหลือแต่ตัวเลขล้วน
        const connection = await mysql.createConnection(dbConfig);
        
        const defaultFlag = isDefault ? 1 : 0; // แปลงสถานะ Boolean เป็น 1 หรือ 0 สำหรับ MySQL
        
        // ตรวจสอบว่านี่เป็นบัตรใบแรกที่ลงทะเบียนหรือไม่
        const [existing] = await connection.query(
            'SELECT id FROM user_payment_methods WHERE user_email = ?',
            [userEmail]
        );
        
        // หากยังไม่เคยมีบัตรบันทึกในระบบเลย ให้ตั้งบัตรใบนี้เป็นบัตรเริ่มต้นโดยอัตโนมัติ (Default)
        const finalDefaultFlag = existing.length === 0 ? 1 : defaultFlag;

        // บันทึกข้อมูลบัตรเครดิตลงในฐานข้อมูล
        const [result] = await connection.query(`
            INSERT INTO user_payment_methods (user_email, card_number, card_holder, expiry_date, card_provider, is_default)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [userEmail, cleanCardNumber, cardHolder.toUpperCase(), expiryDate, cardProvider, finalDefaultFlag]);
        
        const cardId = result.insertId; // รับ ID ของบัตรที่เพิ่งบันทึกสำเร็จ

        // หากบัตรนี้ถูกตั้งค่าเป็นค่าเริ่มต้นหลัก ให้ยกเลิกสถานะเริ่มต้นของบัตรใบอื่นๆ ทั้งหมด
        if (finalDefaultFlag === 1) {
            await connection.query(
                'UPDATE user_payment_methods SET is_default = 0 WHERE user_email = ? AND id != ?',
                [userEmail, cardId]
            );
        }

        await connection.end();
        res.json({ success: true, message: 'บันทึกช่องทางชำระเงินสำเร็จ!', id: cardId });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==========================================
// 7. API สำหรับตั้งค่าบัตรหลักเริ่มต้น (Set Payment Method Default)
// ==========================================
// ใช้เพื่อระบุให้บัตรใบนี้เป็นตัวเลือกเริ่มต้นในการจ่ายเงินของผู้ใช้งาน
app.put('/api/payment-methods/:id/default', async (req, res) => {
    try {
        const { id } = req.params; // รับ ID ของบัตรจาก URL Parameter
        const connection = await mysql.createConnection(dbConfig);
        
        // ค้นหาอีเมลเจ้าของบัตร
        const [rows] = await connection.query('SELECT user_email FROM user_payment_methods WHERE id = ?', [id]);
        if (rows.length === 0) {
            await connection.end();
            return res.status(404).json({ success: false, message: 'ไม่พบช่องทางชำระเงินนี้' });
        }
        
        const { user_email } = rows[0];
        
        // เริ่มต้น Transaction ในการตั้งค่าบัตรเริ่มต้น
        await connection.beginTransaction();
        try {
            // ยกเลิกสถานะเริ่มต้นจากบัตรทุกใบของผู้ใช้นี้
            await connection.query('UPDATE user_payment_methods SET is_default = 0 WHERE user_email = ?', [user_email]);
            // อัปเดตบัตรปัจจุบันที่เลือกให้เป็นบัตรหลัก (Default)
            await connection.query('UPDATE user_payment_methods SET is_default = 1 WHERE id = ?', [id]);
            await connection.commit();
        } catch (txErr) {
            await connection.rollback();
            throw txErr;
        }
        
        await connection.end();
        res.json({ success: true, message: 'ตั้งค่าช่องชำระเงินเริ่มต้นสำเร็จ!' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==========================================
// 8. API สำหรับลบช่องทางการชำระเงิน (Delete Payment Method)
// ==========================================
// ใช้ลบข้อมูลบัตรเครดิตออกจากระบบ และหาบัตรใบอื่นที่เหลือมาเป็นบัตรเริ่มต้นหากบัตรหลักถูกลบ
app.delete('/api/payment-methods/:id', async (req, res) => {
    try {
        const { id } = req.params; // รับ ID บัตรที่จะลบ
        const connection = await mysql.createConnection(dbConfig);
        
        // ตรวจสอบข้อมูลบัตรและเช็คสถานะว่าบัตรที่จะลบเป็นบัตรหลักหรือไม่
        const [rows] = await connection.query('SELECT user_email, is_default FROM user_payment_methods WHERE id = ?', [id]);
        if (rows.length === 0) {
            await connection.end();
            return res.status(404).json({ success: false, message: 'ไม่พบช่องทางชำระเงินนี้' });
        }
        
        const { user_email, is_default } = rows[0];
        
        // ลบข้อมูลบัตร
        await connection.query('DELETE FROM user_payment_methods WHERE id = ?', [id]);
        
        // หากบัตรหลักถูกลบไป ให้สลับบัตรใบที่เหลือใบอื่นมาทำหน้าที่เป็นบัตรหลักแทนโดยอัตโนมัติ
        if (is_default === 1) {
            const [others] = await connection.query(
                'SELECT id FROM user_payment_methods WHERE user_email = ? ORDER BY id DESC LIMIT 1',
                [user_email]
            );
            if (others.length > 0) {
                await connection.query('UPDATE user_payment_methods SET is_default = 1 WHERE id = ?', [others[0].id]);
            }
        }
        
        await connection.end();
        res.json({ success: true, message: 'ลบช่องชำระเงินสำเร็จ!' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});




// ฟังก์ชันสำหรับเตรียมข้อมูลและสร้างตารางอัตโนมัติ (Database Auto-initialization)
async function initializeDatabase() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        
        // 1. สร้างตาราง products หากยังไม่มีอยู่
        await connection.query(`
            CREATE TABLE IF NOT EXISTS products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                price DECIMAL(10, 2) NOT NULL
            )
        `);
        console.log('Database table "products" checked/created successfully.');

        // สร้างตาราง users
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(50) NOT NULL DEFAULT 'user',
                first_name VARCHAR(255) NULL,
                last_name VARCHAR(255) NULL,
                phone VARCHAR(20) NULL,
                gender VARCHAR(10) NULL,
                birthday DATE NULL,
                line_id VARCHAR(255) NULL,
                facebook VARCHAR(255) NULL
            )
        `);
        console.log('Database table "users" checked/created successfully.');

        // สร้างตาราง pc_parts
        await connection.query(`
            CREATE TABLE IF NOT EXISTS pc_parts (
                db_id INT AUTO_INCREMENT PRIMARY KEY,
                id VARCHAR(50) UNIQUE,
                category VARCHAR(50) NOT NULL,
                brand VARCHAR(100) NOT NULL,
                series VARCHAR(100) NULL,
                name VARCHAR(255) NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                specs TEXT NOT NULL,
                socket VARCHAR(100) NULL
            )
        `);
        console.log('Database table "pc_parts" checked/created successfully.');

        // สร้างตาราง pc_sets
        await connection.query(`
            CREATE TABLE IF NOT EXISTS pc_sets (
                db_id INT AUTO_INCREMENT PRIMARY KEY,
                id VARCHAR(50) UNIQUE,
                name VARCHAR(255) NOT NULL,
                purpose TEXT NOT NULL,
                category VARCHAR(50) NOT NULL,
                cpu_brand VARCHAR(50) NOT NULL,
                badge_type VARCHAR(50) NOT NULL,
                badge_text VARCHAR(100) NOT NULL,
                original_price DECIMAL(10, 2) NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                parts_list TEXT NOT NULL
            )
        `);
        console.log('Database table "pc_sets" checked/created successfully.');

        // เพิ่มคอลัมน์ในตาราง users กรณีตารางมีอยู่แล้วแต่ยังไม่มีคอลัมน์เพิ่มเติมเหล่านี้
        try {
            const [columns] = await connection.query("SHOW COLUMNS FROM users");
            const colNames = columns.map(c => c.Field);
            if (!colNames.includes('role')) {
                await connection.query("ALTER TABLE users ADD COLUMN role VARCHAR(50) NOT NULL DEFAULT 'user'");
            }
            if (!colNames.includes('first_name')) {
                await connection.query("ALTER TABLE users ADD COLUMN first_name VARCHAR(255) NULL");
            }
            if (!colNames.includes('last_name')) {
                await connection.query("ALTER TABLE users ADD COLUMN last_name VARCHAR(255) NULL");
            }
            if (!colNames.includes('phone')) {
                await connection.query("ALTER TABLE users ADD COLUMN phone VARCHAR(20) NULL");
            }
            if (!colNames.includes('gender')) {
                await connection.query("ALTER TABLE users ADD COLUMN gender VARCHAR(10) NULL");
            }
            if (!colNames.includes('birthday')) {
                await connection.query("ALTER TABLE users ADD COLUMN birthday DATE NULL");
            }
            if (!colNames.includes('line_id')) {
                await connection.query("ALTER TABLE users ADD COLUMN line_id VARCHAR(255) NULL");
            }
            if (!colNames.includes('facebook')) {
                await connection.query("ALTER TABLE users ADD COLUMN facebook VARCHAR(255) NULL");
            }
            console.log('User profile columns checked/added successfully.');
        } catch (alterError) {
            console.error('Failed to add profile columns dynamically to users table:', alterError.message);
        }

        // เพิ่มผู้ใช้เริ่มต้น
        const [existingUser] = await connection.query('SELECT * FROM users WHERE email = ?', ['user@example.com']);
        if (existingUser.length === 0) {
            await connection.query('INSERT INTO users (email, password, role) VALUES (?, ?, ?)', ['user@example.com', 'password123', 'user']);
            console.log('Added default user: user@example.com');
        } else {
            await connection.query("UPDATE users SET role = 'user' WHERE email = 'user@example.com'");
        }

        // เพิ่มแอดมินเริ่มต้น
        const [existingAdmin] = await connection.query('SELECT * FROM users WHERE email = ?', ['admin@example.com']);
        if (existingAdmin.length === 0) {
            await connection.query('INSERT INTO users (email, password, role) VALUES (?, ?, ?)', ['admin@example.com', 'admin123', 'admin']);
            console.log('Added default admin: admin@example.com');
        } else {
            await connection.query("UPDATE users SET role = 'admin' WHERE email = 'admin@example.com'");
        }

        // ตรวจสอบและเคลียร์สินค้าโมเดลจำลองเก่า เพื่อเตรียมอัปเดตเป็นสินค้าแบรนด์จริงระดับพรีเมียม
        const [oldProducts] = await connection.query("SELECT * FROM products WHERE name IN ('CPU Intel Core i7', 'RAM DDR5 32GB', 'SSD M.2 1TB')");
        if (oldProducts.length > 0) {
            await connection.query('TRUNCATE TABLE products');
            console.log('Cleared old generic products to initialize real-world premium products.');
        }
        
        // 2. ข้อมูลสินค้าและอุปกรณ์คอมพิวเตอร์ระดับ High-End ของจริงพร้อมราคากลางในตลาดไทย
        const sampleProducts = [
            { name: 'Intel Core i9-14900K Processor', price: 21900.00 },
            { name: 'ASUS ROG Strix GeForce RTX 4090 OC 24GB', price: 75900.00 },
            { name: 'Corsair Dominator Titanium DDR5 32GB 6000MHz', price: 6890.00 },
            { name: 'Samsung 990 PRO M.2 NVMe SSD 2TB', price: 6490.00 },
            { name: 'ASUS ROG Maximus Z790 Dark Hero', price: 24900.00 },
            { name: 'Corsair RM1000x Shift 80+ Gold Fully Modular', price: 7290.00 },
            { name: 'Lian Li O11 Dynamic EVO RGB Black', price: 6290.00 },
            { name: 'ASUS ROG Swift OLED PG27AQDM Gaming Monitor', price: 32900.00 },
            { name: 'Logitech G Pro X Superlight 2 Wireless', price: 4990.00 },
            { name: 'ASUS ROG Azoth Wireless Mechanical Keyboard', price: 8990.00 }
        ];

        // วนลูปเช็คว่าสินค้าแต่ละตัวมีอยู่ในฐานข้อมูลหรือยัง ถ้ายังไม่มีให้ทำการเพิ่มข้อมูล
        for (const product of sampleProducts) {
            const [existing] = await connection.query('SELECT * FROM products WHERE name = ?', [product.name]);
            if (existing.length === 0) {
                await connection.query('INSERT INTO products (name, price) VALUES (?, ?)', [product.name, product.price]);
                console.log(`Added real-world product: ${product.name} (${product.price} Baht)`);
            }
        }

        // ดึงชิ้นส่วนคอมเริ่มต้น
        const [partsCount] = await connection.query('SELECT COUNT(*) as count FROM pc_parts');
        if (partsCount[0].count === 0) {
            const sampleParts = [
                // --- CPU ---
                { id: 'cpu-1', category: 'cpu', brand: 'AMD', series: 'Ryzen 5', name: 'CPU AMD AM4 RYZEN 5 5500 3.6GHz 6C 12T', price: 3190.00, specs: 'AM4 / 6 Cores 12 Threads / 3.6 GHz (Up to 4.2GHz) / TDP 65W', socket: 'Socket AM4' },
                { id: 'cpu-2', category: 'cpu', brand: 'AMD', series: 'Ryzen 5', name: 'CPU AMD AM5 RYZEN 5 8400F 4.2GHz 6C 12T (MPK)', price: 3990.00, specs: 'AM5 / 6 Cores 12 Threads / 4.2 GHz (Up to 4.7GHz) / TDP 65W', socket: 'Socket AM5' },
                { id: 'cpu-3', category: 'cpu', brand: 'AMD', series: 'Ryzen 5', name: 'CPU AMD AM4 RYZEN 5 5500GT 3.6GHz 6C 12T (MPK)', price: 4290.00, specs: 'AM4 / 6 Cores 12 Threads / 3.6 GHz (Up to 4.4GHz) / Radeon Graphics / TDP 65W', socket: 'Socket AM4' },
                { id: 'cpu-4', category: 'cpu', brand: 'AMD', series: 'Ryzen 5', name: 'CPU AMD AM4 RYZEN 5 5600 3.5GHz 6C 12T', price: 4390.00, specs: 'AM4 / 6 Cores 12 Threads / 3.5 GHz (Up to 4.4GHz) / TDP 65W', socket: 'Socket AM4' },
                { id: 'cpu-5', category: 'cpu', brand: 'Intel', series: 'Core i5', name: 'CPU INTEL 1700 CORE I5-12400F 2.5GHz 6C 12T (TRAY)', price: 4790.00, specs: 'LGA1700 / 6 Cores (6 P-cores) 12 Threads / 2.5 GHz / TDP 65W / No Integrated Graphics', socket: 'Socket LGA1700' },
                { id: 'cpu-6', category: 'cpu', brand: 'Intel', series: 'Core i5', name: 'CPU INTEL 1700 CORE I5-12400F 2.5GHz 6C 12T', price: 4990.00, specs: 'LGA1700 / 6 Cores 12 Threads / 2.5 GHz (Up to 4.4GHz) / Boxed Retail / TDP 65W', socket: 'Socket LGA1700' },
                { id: 'cpu-7', category: 'cpu', brand: 'Intel', series: 'Core Ultra 5', name: 'CPU INTEL 1851 CORE ULTRA 5 225F 3.3GHz 10C 10T', price: 4990.00, specs: 'LGA1851 / 10 Cores (6 P-cores + 4 E-cores) 10 Threads / 3.3 GHz / Arrow Lake / TDP 65W', socket: 'Socket LGA1851' },
                { id: 'cpu-8', category: 'cpu', brand: 'AMD', series: 'Ryzen 5', name: 'CPU AMD AM5 RYZEN 5 7500F 3.7GHz 6C 12T (MPK)', price: 5090.00, specs: 'AM5 / 6 Cores 12 Threads / 3.7 GHz (Up to 5.0GHz) / TDP 65W / No Integrated Graphics', socket: 'Socket AM5' },
                { id: 'cpu-9', category: 'cpu', brand: 'Intel', series: 'Core i7', name: 'CPU INTEL 1700 CORE I7-14700K 3.4GHz 20C 28T', price: 14900.00, specs: 'LGA1700 / 20 Cores (8 P-cores + 12 E-cores) 28 Threads / 3.4 GHz / TDP 125W', socket: 'Socket LGA1700' },
                // --- Motherboard ---
                { id: 'mb-1', category: 'motherboard', brand: 'ASUS', series: '', name: 'ASUS PRIME H610M-K DDR4', price: 2290.00, specs: 'H610 / LGA1700 / Micro ATX / 2x DDR4 DIMM / PCIe 4.0 / M.2 Slot', socket: 'Socket LGA1700' },
                { id: 'mb-2', category: 'motherboard', brand: 'Gigabyte', series: '', name: 'GIGABYTE H610M H V2 DDR4', price: 2390.00, specs: 'H610 / LGA1700 / Micro ATX / 2x DDR4 / Ultra Durable Protection', socket: 'Socket LGA1700' },
                { id: 'mb-3', category: 'motherboard', brand: 'MSI', series: '', name: 'MSI PRO H610M-E DDR4', price: 2450.00, specs: 'H610 / LGA1700 / Micro ATX / DDR4 Boost / Core Boost Technology', socket: 'Socket LGA1700' },
                { id: 'mb-4', category: 'motherboard', brand: 'ASRock', series: '', name: 'ASRock B760M-HDV/M.2 D4', price: 3190.00, specs: 'B760 / LGA1700 / Micro ATX / Dual PCIe M.2 Slots / USB-C Gen 1', socket: 'Socket LGA1700' },
                { id: 'mb-5', category: 'motherboard', brand: 'ASUS', series: '', name: 'ASUS PRIME B760M-A WIFI DDR5', price: 4790.00, specs: 'B760 / LGA1700 / Micro ATX / 4x DDR5 / Wi-Fi 6 + Bluetooth / Dual M.2 PCIe 4.0', socket: 'Socket LGA1700' },
                { id: 'mb-6', category: 'motherboard', brand: 'MSI', series: '', name: 'MSI MAG B760M MORTAR WIFI DDR5', price: 5990.00, specs: 'B760 / LGA1700 / Micro ATX / 12+1+1 Duet Rail VRM / Wi-Fi 6E / Premium Heat Shield', socket: 'Socket LGA1700' },
                { id: 'mb-7', category: 'motherboard', brand: 'ASUS', series: '', name: 'ASUS ROG STRIX Z790-F GAMING WIFI II', price: 12900.00, specs: 'Z790 / LGA1700 / ATX / DDR5 / Wi-Fi 7 / 5x M.2 Slots / ROG SupremeFX Audio', socket: 'Socket LGA1700' },
                // --- Graphics Card ---
                { id: 'gpu-1', category: 'gpu', brand: 'Gigabyte', series: 'GTX 1650', name: 'GIGABYTE GeForce GTX 1650 D6 OC 4G', price: 4390.00, specs: 'NVIDIA GeForce GTX 1650 / 4GB GDDR6 / 128-bit / Dual Fan / Windforce 2X', socket: 'PCIe x16' },
                { id: 'gpu-2', category: 'gpu', brand: 'ASUS', series: 'RX 6600', name: 'ASUS DUAL Radeon RX 6600 V2 8G', price: 6990.00, specs: 'AMD Radeon RX 6600 / 8GB GDDR6 / 128-bit / Compact Dual Fan Design / Axial-tech fans', socket: 'PCIe x16' },
                { id: 'gpu-3', category: 'gpu', brand: 'MSI', series: 'RTX 3050', name: 'MSI GeForce RTX 3050 VENTUS 2X XS 8G OC', price: 7290.00, specs: 'NVIDIA GeForce RTX 3050 / 8GB GDDR6 / 128-bit / Ray Tracing / DLSS / Ventus Dual Fan', socket: 'PCIe x16' },
                { id: 'gpu-4', category: 'gpu', brand: 'Gigabyte', series: 'RTX 4060', name: 'GIGABYTE GeForce RTX 4060 EAGLE OC 8G', price: 10900.00, specs: 'NVIDIA GeForce RTX 4060 / 8GB GDDR6 / 128-bit / DLSS 3 / Ray Tracing / Windforce 3X Fans', socket: 'PCIe x16' },
                { id: 'gpu-5', category: 'gpu', brand: 'ASUS', series: 'RTX 4060 Ti', name: 'ASUS DUAL GeForce RTX 4060 Ti OC 8G', price: 14900.00, specs: 'NVIDIA GeForce RTX 4060 Ti / 8GB GDDR6 / 128-bit / DLSS 3 / Axial-tech Dual Fan / 2.5-Slot', socket: 'PCIe x16' },
                { id: 'gpu-6', category: 'gpu', brand: 'MSI', series: 'RTX 4070 SUPER', name: 'MSI GeForce RTX 4070 SUPER VENTUS 2X OC 12G', price: 23900.00, specs: 'NVIDIA GeForce RTX 4070 Super / 12GB GDDR6X / 192-bit / Torx Fan 4.0 / Metal Backplate', socket: 'PCIe x16' },
                { id: 'gpu-7', category: 'gpu', brand: 'ASUS', series: 'RTX 4090', name: 'ASUS ROG STRIX GeForce RTX 4090 O24G GAMING', price: 74900.00, specs: 'NVIDIA GeForce RTX 4090 / 24GB GDDR6X / 384-bit / Triple axial-tech fans / Vapor chamber cooling / Flagship Performance', socket: 'PCIe x16' },
                // --- RAM ---
                { id: 'ram-1', category: 'ram', brand: 'Kingston', series: '', name: 'KINGSTON FURY BEAST 16GB (8GBx2) DDR4 3200MHz', price: 1390.00, specs: 'DDR4 16GB Kit / 3200 MHz / CL16 / Low Profile Black Heat Spreader', socket: '' },
                { id: 'ram-2', category: 'ram', brand: 'Corsair', series: '', name: 'CORSAIR VENGEANCE LPX 16GB (8GBx2) DDR4 3200MHz', price: 1490.00, specs: 'DDR4 16GB Kit / 3200 MHz / CL16 / Aluminum Heat Spreader for XMP 2.0', socket: '' },
                { id: 'ram-3', category: 'ram', brand: 'G.Skill', series: '', name: 'G.SKILL RIPJAWS V 32GB (16GBx2) DDR4 3200MHz', price: 2790.00, specs: 'DDR4 32GB Kit / 3200 MHz / CL16 / High Performance Gaming RAM', socket: '' },
                { id: 'ram-4', category: 'ram', brand: 'Kingston', series: '', name: 'KINGSTON FURY BEAST RGB 32GB (16GBx2) DDR5 5600MHz', price: 3990.00, specs: 'DDR5 32GB Kit / 5600 MHz / CL36 / Stunning RGB Customizable Lighting', socket: '' },
                { id: 'ram-5', category: 'ram', brand: 'Corsair', series: '', name: 'CORSAIR VENGEANCE RGB 32GB (16GBx2) DDR5 6000MHz', price: 4590.00, specs: 'DDR5 32GB Kit / 6000 MHz / CL36 / iCUE Compatible Dynamically Addressed RGB', socket: '' },
                { id: 'ram-6', category: 'ram', brand: 'G.Skill', series: '', name: 'G.SKILL TRIDENT Z5 RGB 32GB (16GBx2) DDR5 6400MHz', price: 5290.00, specs: 'DDR5 32GB Kit / 6400 MHz / CL32 / Premium Brushed Aluminum and RGB Bar', socket: '' },
                // --- HDD ---
                { id: 'hdd-1', category: 'hdd', brand: 'WD', series: '', name: 'WD BLUE 1TB WD10EZEX SATA 3 (7200RPM)', price: 1290.00, specs: '3.5" HDD / 1TB / SATA III / 64MB Cache / 7200 RPM / Everyday Computing', socket: '' },
                { id: 'hdd-2', category: 'hdd', brand: 'Seagate', series: '', name: 'SEAGATE BARRACUDA 1TB ST1000DM010', price: 1350.00, specs: '3.5" HDD / 1TB / SATA III / 64MB Cache / 7200 RPM / Multi-Tier Caching Technology', socket: '' },
                { id: 'hdd-3', category: 'hdd', brand: 'WD', series: '', name: 'WD BLUE 2TB WD20EZBX SATA 3 (7200RPM)', price: 1890.00, specs: '3.5" HDD / 2TB / SATA III / 256MB Cache / 7200 RPM / High Capacity', socket: '' },
                { id: 'hdd-4', category: 'hdd', brand: 'Seagate', series: '', name: 'SEAGATE BARRACUDA 2TB ST2000DM008', price: 1950.00, specs: '3.5" HDD / 2TB / SATA III / 256MB Cache / 7200 RPM / High Performance Storage', socket: '' },
                // --- SSD ---
                { id: 'ssd-1', category: 'ssd', brand: 'Kingston', series: '', name: 'KINGSTON A400 480GB SATA 3', price: 1090.00, specs: '2.5" SSD / 480GB / SATA III / Read up to 500MB/s, Write up to 450MB/s', socket: '' },
                { id: 'ssd-2', category: 'ssd', brand: 'WD', series: '', name: 'WD GREEN 480GB SATA 3', price: 1190.00, specs: '2.5" SSD / 480GB / SATA III / Read up to 545MB/s / Low Power Consumption', socket: '' },
                { id: 'ssd-3', category: 'ssd', brand: 'Samsung', series: '', name: 'SAMSUNG 870 EVO 500GB SATA 3', price: 1890.00, specs: '2.5" SSD / 500GB / SATA III / V-NAND Technology / Read 560MB/s, Write 530MB/s', socket: '' },
                { id: 'ssd-4', category: 'ssd', brand: 'Samsung', series: '', name: 'SAMSUNG 870 EVO 1TB SATA 3', price: 3190.00, specs: '2.5" SSD / 1TB / SATA III / Industry-leading reliability / V-NAND', socket: '' },
                // --- M.2 SSD ---
                { id: 'm2-1', category: 'm2', brand: 'Kingston', series: '', name: 'KINGSTON NV2 500GB PCIe 4.0 NVMe M.2', price: 1290.00, specs: 'M.2 2280 NVMe / 500GB / PCIe Gen4x4 / Read up to 3500MB/s, Write up to 2100MB/s', socket: '' },
                { id: 'm2-2', category: 'm2', brand: 'WD', series: '', name: 'WD BLUE SN580 500GB PCIe 4.0 NVMe M.2', price: 1490.00, specs: 'M.2 2280 NVMe / 500GB / PCIe Gen4x4 / nCache 4.0 / Read up to 4000MB/s', socket: '' },
                { id: 'm2-3', category: 'm2', brand: 'Kingston', series: '', name: 'KINGSTON NV2 1TB PCIe 4.0 NVMe M.2', price: 2190.00, specs: 'M.2 2280 NVMe / 1TB / PCIe Gen4x4 / Read up to 3500MB/s, Write up to 2800MB/s', socket: '' },
                { id: 'm2-4', category: 'm2', brand: 'Samsung', series: '', name: 'SAMSUNG 980 1TB PCIe 3.0 NVMe M.2', price: 2690.00, specs: 'M.2 2280 NVMe / 1TB / PCIe Gen3x4 / DRAMless design / Read up to 3500MB/s', socket: '' },
                { id: 'm2-5', category: 'm2', brand: 'WD', series: '', name: 'WD BLACK SN850X 1TB PCIe 4.0 NVMe M.2', price: 3490.00, specs: 'M.2 2280 NVMe / 1TB / PCIe Gen4x4 / Game Mode 2.0 / Read up to 7300MB/s / Heatsink Optional', socket: '' },
                { id: 'm2-6', category: 'm2', brand: 'Samsung', series: '', name: 'SAMSUNG 990 PRO 1TB PCIe 4.0 NVMe M.2', price: 3990.00, specs: 'M.2 2280 NVMe / 1TB / PCIe Gen4x4 / 1GB LPDDR4 DRAM / Read up to 7450MB/s, Write 6900MB/s', socket: '' },
                // --- PSU ---
                { id: 'psu-1', category: 'psu', brand: 'Aerocool', series: '', name: 'AEROCOOL LUX RGB 550W 80+ BRONZE', price: 1290.00, specs: '550 Watts / 80 Plus Bronze / RGB cooling fan with 13 modes / Standard cables', socket: '' },
                { id: 'psu-2', category: 'psu', brand: 'Deepcool', series: '', name: 'DEEPCOOL DN500 500W 80+ Standard', price: 1390.00, specs: '500 Watts / 80 Plus Standard / Silent 120mm Fan / High reliability', socket: '' },
                { id: 'psu-3', category: 'psu', brand: 'Corsair', series: '', name: 'CORSAIR CV650 650W 80+ BRONZE', price: 1990.00, specs: '650 Watts / 80 Plus Bronze / Compact 125mm length / Sleeved black cables', socket: '' },
                { id: 'psu-4', category: 'psu', brand: 'MSI', series: '', name: 'MSI MAG A650BN 650W 80+ BRONZE', price: 2090.00, specs: '650 Watts / 80 Plus Bronze / DC-to-DC circuit design / 120mm low-noise fan', socket: '' },
                { id: 'psu-5', category: 'psu', brand: 'Corsair', series: '', name: 'CORSAIR RM850e 850W 80+ GOLD ATX 3.0', price: 4490.00, specs: '850 Watts / 80 Plus Gold / Fully Modular / ATX 3.0 & PCIe 5.0 Ready / Japanese capacitors', socket: '' },
                // --- Case ---
                { id: 'case-1', category: 'case', brand: 'Tsunami', series: '', name: 'TSUNAMI GALAXY G15 Neo RGB', price: 1290.00, specs: 'Mid Tower ATX / Tempered Glass Panel / 4x 120mm ARGB Fans preinstalled / Front Mesh', socket: '' },
                { id: 'case-2', category: 'case', brand: 'Montech', series: '', name: 'MONTECH AIR 903 BASE Black', price: 1590.00, specs: 'Mid Tower ATX / High airflow mesh front / 3x 140mm HP140 PWM fans / USB Type-C support', socket: '' },
                { id: 'case-3', category: 'case', brand: 'NZXT', series: '', name: 'NZXT H5 FLOW Black', price: 3190.00, specs: 'Mid Tower ATX / Perforated front panel / GPU-dedicated angled bottom fan / Tempered Glass', socket: '' },
                { id: 'case-4', category: 'case', brand: 'Corsair', series: '', name: 'CORSAIR 4000D AIRFLOW Tempered Glass', price: 3390.00, specs: 'Mid Tower ATX / High-airflow mesh front panel / RapidRoute cable management / 2x 120mm fans', socket: '' },
                { id: 'case-5', category: 'case', brand: 'Lian Li', series: '', name: 'LIAN LI O11 DYNAMIC EVO Glass', price: 5290.00, specs: 'Dual Chamber ATX / Modular dual glass design / Support up to 3x 360mm radiators / Ultimate Watercool base', socket: '' },
                // --- Liquid Cooler ---
                { id: 'lc-1', category: 'liquid_cooler', brand: 'Deepcool', series: '', name: 'DEEPCOOL LE520 (240mm) Liquid Cooler', price: 2190.00, specs: '240mm Radiator / Dual ARGB PWM Fans / Anti-Leak technology / Compatible with AM5 & LGA1700', socket: '' },
                { id: 'lc-2', category: 'liquid_cooler', brand: 'MSI', series: '', name: 'MSI MAG CORELIQUID M360 ARGB (360mm)', price: 3290.00, specs: '360mm Radiator / 3x ARGB Fans / Curve radiator split flow / LGA1700 bracket included', socket: '' },
                { id: 'lc-3', category: 'liquid_cooler', brand: 'NZXT', series: '', name: 'NZXT KRAKEN ELITE 360 RGB Black', price: 10900.00, specs: '360mm Radiator / 3x F120 RGB Core Fans / 2.36" Wide-angle LCD screen / CAM customizable', socket: '' },
                // --- CPU Air Cooler ---
                { id: 'cc-1', category: 'cpu_cooler', brand: 'Intel', series: '', name: 'INTEL STOCK COOLER LGA1700', price: 0.00, specs: 'Bundled Intel stock heatsink for LGA1700 CPU / Basic cooling', socket: '' },
                { id: 'cc-2', category: 'cpu_cooler', brand: 'AMD', series: '', name: 'AMD WRAITH STEALTH AM4/AM5', price: 0.00, specs: 'Bundled AMD stock cooler / Compact layout / Near-silent', socket: '' },
                { id: 'cc-3', category: 'cpu_cooler', brand: 'Deepcool', series: '', name: 'DEEPCOOL AG400 CPU Air Cooler', price: 690.00, specs: 'Single tower 120mm fan / 4 copper heat pipes / Direct contact technology / up to 220W TDP', socket: '' },
                { id: 'cc-4', category: 'cpu_cooler', brand: 'Thermalright', series: '', name: 'THERMALRIGHT PEERLESS ASSASSIN 120 SE', price: 1390.00, specs: 'Dual tower air cooler / 6x 6mm heat pipes / Dual TL-C12C 120mm PWM fans / 155mm height', socket: '' },
                // --- Case Fan ---
                { id: 'cf-1', category: 'case_fan', brand: 'Tsunami', series: '', name: 'TSUNAMI RGB 12cm Single Cooling Fan', price: 190.00, specs: '120mm Fan / Rainbow RGB fixed lighting / 1200 RPM / Hydraulic Bearing / Molex interface', socket: '' },
                { id: 'cf-2', category: 'case_fan', brand: 'Corsair', series: '', name: 'CORSAIR AF120 SLIM PWM Fan', price: 690.00, specs: '120mm Fan / 15mm Slim thickness / PWM Controlled 600-2000 RPM / High airflow low noise', socket: '' },
                { id: 'cf-3', category: 'case_fan', brand: 'Lian Li', series: '', name: 'LIAN LI UNI FAN SL-INFINITY 120 (Single)', price: 1090.00, specs: '120mm Fan / Infinite mirror RGB styling / Slide-in daisy chain design / Fluid Dynamic Bearing', socket: '' },
                // --- Mouse ---
                { id: 'ms-1', category: 'mouse', brand: 'Logitech', series: '', name: 'LOGITECH G102 LIGHTSYNC Gaming Mouse', price: 590.00, specs: 'Wired Gaming Mouse / 8,000 DPI Sensor / 6 Programmable Buttons / Lightsync RGB', socket: '' },
                { id: 'ms-2', category: 'mouse', brand: 'Razer', series: '', name: 'RAZER DEATHADDER ESSENTIAL Black', price: 690.00, specs: 'Wired Gaming Mouse / 6,400 DPI Optical Sensor / 5 Hyperesponse Buttons / Ergonomic shape', socket: '' },
                { id: 'ms-3', category: 'mouse', brand: 'Logitech', series: '', name: 'LOGITECH G PRO X SUPERLIGHT 2 Wireless', price: 5290.00, specs: 'Wireless Gaming Mouse / HERO 2 32K Sensor / Ultra-lightweight 60 grams / LIGHTSPEED Wireless', socket: '' },
                // --- Keyboard ---
                { id: 'kb-1', category: 'keyboard', brand: 'Logitech', series: '', name: 'LOGITECH K120 USB Keyboard', price: 290.00, specs: 'Wired Standard Office Keyboard / Spill-resistant design / Low-profile keys / Durable keys', socket: '' },
                { id: 'kb-2', category: 'keyboard', brand: 'Razer', series: '', name: 'RAZER CYNOSA LITE Gaming Keyboard', price: 990.00, specs: 'Wired Membrane Keyboard / Single-zone Razer Chroma RGB / Spill-resistant / Fully programmable', socket: '' },
                { id: 'kb-3', category: 'keyboard', brand: 'ASUS', series: '', name: 'ASUS ROG AZOTH WIRELESS Gaming Keyboard', price: 8900.00, specs: 'Wireless 75% Mechanical Keyboard / ROG NX pre-lubed switches / OLED Display / Gasket mount / Hot-swappable', socket: '' },
                // --- Monitor ---
                { id: 'mn-1', category: 'monitor', brand: 'Xiaomi', series: '', name: 'XIAOMI REDMI MONITOR A22 21.5" 75Hz', price: 1990.00, specs: '21.5-inch / Full HD (1080p) / VA Panel / 75Hz Refresh / HDMI & VGA / Slim bezel', socket: '' },
                { id: 'mn-2', category: 'monitor', brand: 'Samsung', series: '', name: 'SAMSUNG ODYSSEY G3 24" 144Hz', price: 3790.00, specs: '24-inch / Full HD (1080p) / VA Panel / 144Hz Refresh / 1ms Response / HAS stand / AMD FreeSync', socket: '' },
                { id: 'mn-3', category: 'monitor', brand: 'ASUS', series: '', name: 'ASUS ROG SWIFT PG27AQDM 27" OLED 240Hz', price: 32900.00, specs: '26.5-inch / QHD (1440p) OLED / 240Hz / 0.03ms Response / anti-glare custom heatsink / G-Sync compatible', socket: '' },
                // --- Accessories ---
                { id: 'ac-1', category: 'accessories', brand: 'Generic', series: '', name: 'HDMI Cable v2.0 Gold-Plated 2M', price: 190.00, specs: 'HDMI 2.0 / Supports 4K @ 60Hz / Double Shielded / Gold Plated Connectors', socket: '' },
                { id: 'ac-2', category: 'accessories', brand: 'Orico', series: '', name: 'ORICO USB HUB 4 Ports USB 3.0', price: 290.00, specs: '4-port USB 3.0 adapter / High speed 5Gbps / LED indicator / Compact ABS shell', socket: '' },
                // --- Gaming Gear ---
                { id: 'gg-1', category: 'gaming_gear', brand: 'Razer', series: '', name: 'RAZER BLACKSHARK V2 X Gaming Headset', price: 1490.00, specs: 'Wired Gaming Headset / TriForce 50mm Drivers / HyperClear Cardioid Mic / 7.1 Surround / Multiplatform', socket: '' },
                { id: 'gg-2', category: 'gaming_gear', brand: 'Logitech', series: '', name: 'LOGITECH G435 LIGHTSPEED Wireless Headset', price: 2290.00, specs: 'Wireless Gaming Headset / Lightspeed + Bluetooth / Extremely lightweight 165g / Dual beamforming mics', socket: '' },
                // --- Software ---
                { id: 'sw-1', category: 'software', brand: 'Microsoft', series: '', name: 'Windows 11 Home 64-bit OEM DVD', price: 3890.00, specs: 'Genuine Windows 11 Home license / Single PC install / OEM edition / English packaging', socket: '' },
                { id: 'sw-2', category: 'software', brand: 'Microsoft', series: '', name: 'Windows 11 Pro 64-bit OEM DVD', price: 5290.00, specs: 'Genuine Windows 11 Pro license / Domain join, BitLocker, Remote Desktop support / OEM edition', socket: '' }
            ];

            for (const part of sampleParts) {
                await connection.query(
                    'INSERT INTO pc_parts (id, category, brand, series, name, price, specs, socket) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                    [part.id, part.category, part.brand, part.series || '', part.name, part.price, part.specs, part.socket || '']
                );
            }
            console.log('Database table "pc_parts" pre-populated with default parts.');
        }

        // --- ตรวจสอบให้แน่ใจว่ามีชิ้นส่วนระดับพรีเมียม 10 รายการอยู่ในตาราง pc_parts เสมอ ---
        const premiumParts = [
            { id: 'cpu-10', category: 'cpu', brand: 'Intel', series: 'Core i9', name: 'CPU INTEL 1700 CORE I9-14900K 3.2GHz 24C 32T', price: 21900.00, specs: 'LGA1700 / 24 Cores (8 P-cores + 16 E-cores) 32 Threads / 3.2 GHz (Up to 6.0GHz) / TDP 125W / Intel UHD Graphics 770 / Unlocked for Overclocking', socket: 'Socket LGA1700' },
            { id: 'gpu-8', category: 'gpu', brand: 'ASUS', series: 'RTX 4090', name: 'ASUS ROG STRIX GeForce RTX 4090 O24G GAMING OC', price: 75900.00, specs: 'NVIDIA GeForce RTX 4090 / 24GB GDDR6X / 384-bit / Triple Axial-tech Fans / Patented Vapor Chamber / DLSS 3 / AURA Sync RGB', socket: 'PCIe x16' },
            { id: 'ram-7', category: 'ram', brand: 'Corsair', series: 'Dominator', name: 'CORSAIR DOMINATOR TITANIUM RGB 32GB (16GBx2) DDR5 6000MHz Black', price: 6890.00, specs: 'DDR5 32GB Kit (16GBx2) / 6000 MHz / CL30 / DHX Cooling Technology / Dynamic RGB LED Bar / Intel XMP 3.0 / High-Performance ICs', socket: '' },
            { id: 'm2-7', category: 'm2', brand: 'Samsung', series: '990 PRO', name: 'SAMSUNG 990 PRO M.2 NVMe SSD 2TB', price: 6490.00, specs: 'M.2 2280 NVMe / 2TB / PCIe Gen4x4 / 2GB LPDDR4 DRAM / Read up to 7450MB/s, Write up to 6900MB/s / V-NAND 3-bit MLC', socket: '' },
            { id: 'mb-8', category: 'motherboard', brand: 'ASUS', series: 'ROG Maximus', name: 'ASUS ROG MAXIMUS Z790 DARK HERO', price: 24900.00, specs: 'Z790 / LGA1700 / ATX / 4x DDR5 DIMM / Wi-Fi 7 + Bluetooth / Dual M.2 PCIe 5.0 / 20+1+2 Power Stages / SupremeFX Audio', socket: 'Socket LGA1700' },
            { id: 'psu-6', category: 'psu', brand: 'Corsair', series: 'RMx Shift', name: 'CORSAIR RM1000x SHIFT 80+ GOLD Fully Modular', price: 7290.00, specs: '1000 Watts / 80 Plus Gold / Side Interface Connectors / ATX 3.0 & PCIe 5.0 Ready / 140mm FDB Fan / Japanese 105°C Capacitors', socket: '' },
            { id: 'case-6', category: 'case', brand: 'Lian Li', series: 'O11 Dynamic', name: 'LIAN LI O11 Dynamic EVO RGB Black', price: 6290.00, specs: 'Dual Chamber ATX / Premium Tempered Glass Panels / Dual ARGB Lighting Strips / Support up to 3x 360mm Radiators / Highly Modular Chassis', socket: '' },
            { id: 'mn-4', category: 'monitor', brand: 'ASUS', series: 'ROG Swift', name: 'ASUS ROG SWIFT OLED PG27AQDM Gaming Monitor 27" 240Hz', price: 32900.00, specs: '26.5-inch / QHD (2560x1440) OLED / 240Hz Refresh / 0.03ms Response / Custom Heatsink Cooling / G-Sync Compatible / Anti-glare coating', socket: '' },
            { id: 'ms-4', category: 'mouse', brand: 'Logitech', series: 'G Pro', name: 'LOGITECH G PRO X SUPERLIGHT 2 Lightspeed Wireless', price: 4990.00, specs: 'Wireless Gaming Mouse / HERO 2 32K Sensor / 60g Ultra-lightweight / 95 Hours Battery Life / LIGHTSPEED Hybrid Switches / USB-C', socket: '' },
            { id: 'kb-4', category: 'keyboard', brand: 'ASUS', series: 'ROG Azoth', name: 'ASUS ROG AZOTH WIRELESS Custom Mechanical Keyboard', price: 8990.00, specs: 'Wireless 75% Mechanical / Hot-swappable ROG NX switches / 2-inch OLED Display / Gasket mount / Tri-mode connectivity (2.4G/BT/Wired)', socket: '' }
        ];

        for (const part of premiumParts) {
            const [existing] = await connection.query('SELECT * FROM pc_parts WHERE id = ? OR name = ?', [part.id, part.name]);
            if (existing.length === 0) {
                await connection.query(
                    'INSERT INTO pc_parts (id, category, brand, series, name, price, specs, socket) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                    [part.id, part.category, part.brand, part.series || '', part.name, part.price, part.specs, part.socket || '']
                );
                console.log(`Added premium PC part: ${part.name}`);
            }
        }

        // ดึงคอมพิวเตอร์เซตเริ่มต้น
        const [setsCount] = await connection.query('SELECT COUNT(*) as count FROM pc_sets');
        if (setsCount[0].count === 0) {
            const sampleSets = [
                {
                    id: 'set-1',
                    name: 'TechGear Starter Gaming Core',
                    purpose: 'เซตเล่นเกมยอดฮิตราคาคุ้มค่า เล่น Valorant, GTA V, SF ได้ลื่นไหล พร้อมทำงานเอกสารและเรียนออนไลน์',
                    category: 'budget',
                    cpu_brand: 'AMD',
                    badge_type: 'hot',
                    badge_text: 'คุ้มค่าที่สุด',
                    original_price: 17900.00,
                    price: 15820.00,
                    parts_list: JSON.stringify([
                        { label: 'ซีพียู (CPU)', name: 'AMD RYZEN 5 5500 3.6GHz 6C/12T', icon: 'bi-cpu', id: 'cpu-1' },
                        { label: 'การ์ดจอ (GPU)', name: 'GIGABYTE GTX 1650 D6 OC 4G', icon: 'bi-gpu-card', id: 'gpu-1' },
                        { label: 'เมนบอร์ด (MB)', name: 'ASUS PRIME H610M-K DDR4', icon: 'bi-layout-three-columns', id: 'mb-1' },
                        { label: 'หน่วยความจำ (RAM)', name: 'KINGSTON FURY BEAST 16GB (8GBx2) DDR4 3200MHz', icon: 'bi-memory', id: 'ram-1' },
                        { label: 'สตอเรจ (SSD)', name: 'KINGSTON NV2 500GB PCIe 4.0 NVMe M.2', icon: 'bi-device-ssd', id: 'm2-1' },
                        { label: 'พาวเวอร์ (PSU)', name: 'AEROCOOL LUX RGB 550W 80+ BRONZE', icon: 'bi-plug', id: 'psu-1' },
                        { label: 'เคสคอม (CASE)', name: 'TSUNAMI GALAXY G15 Neo RGB Black', icon: 'bi-box', id: 'case-1' },
                        { label: 'ระบบระบายความร้อน', name: 'DEEPCOOL AG400 CPU Air Cooler', icon: 'bi-fan', id: 'cc-3' }
                    ])
                },
                {
                    id: 'set-2',
                    name: 'TechGear Fighter RTX 4060',
                    purpose: 'เซตขวัญใจมหาชน แรงขึ้นมาด้วยการ์ดจอเจนล่าสุด RTX 4060 เล่นเกมระดับ AAA ปรับ Ultra 1080p ได้สบาย',
                    category: 'gaming',
                    cpu_brand: 'Intel',
                    badge_type: 'popular',
                    badge_text: 'ขายดีอันดับ 1',
                    original_price: 32900.00,
                    price: 28630.00,
                    parts_list: JSON.stringify([
                        { label: 'ซีพียู (CPU)', name: 'Intel Core i5-12400F 2.5GHz 6C/12T', icon: 'bi-cpu', id: 'cpu-6' },
                        { label: 'การ์ดจอ (GPU)', name: 'GIGABYTE GeForce RTX 4060 EAGLE OC 8G', icon: 'bi-gpu-card', id: 'gpu-4' },
                        { label: 'เมนบอร์ด (MB)', name: 'ASRock B760M-HDV/M.2 D4', icon: 'bi-layout-three-columns', id: 'mb-4' },
                        { label: 'หน่วยความจำ (RAM)', name: 'KINGSTON FURY BEAST 16GB (8GBx2) DDR4 3200MHz', icon: 'bi-memory', id: 'ram-1' },
                        { label: 'สตอเรจ (SSD)', name: 'KINGSTON NV2 1TB PCIe 4.0 NVMe M.2', icon: 'bi-device-ssd', id: 'm2-3' },
                        { label: 'พาวเวอร์ (PSU)', name: 'MSI MAG A650BN 650W 80+ BRONZE', icon: 'bi-plug', id: 'psu-4' },
                        { label: 'เคสคอม (CASE)', name: 'NZXT H5 FLOW Black Premium Case', icon: 'bi-box', id: 'case-3' },
                        { label: 'ระบบระบายความร้อน', name: 'DEEPCOOL AG400 CPU Air Cooler', icon: 'bi-fan', id: 'cc-3' }
                    ])
                },
                {
                    id: 'set-3',
                    name: 'TechGear Streamer Ryzen 5',
                    purpose: 'เซตเล่นเกมยุคใหม่แพลตฟอร์ม AM5 พลังแรงสูง รองรับการสตรีมเกมความละเอียด Full HD ไปพร้อมกับการเล่นได้อย่างลื่นไหล',
                    category: 'streaming',
                    cpu_brand: 'AMD',
                    badge_type: 'special',
                    badge_text: 'สำหรับสตรีมเมอร์',
                    original_price: 43900.00,
                    price: 38430.00,
                    parts_list: JSON.stringify([
                        { label: 'ซีพียู (CPU)', name: 'AMD AM5 RYZEN 5 7500F 3.7GHz 6C/12T', icon: 'bi-cpu', id: 'cpu-8' },
                        { label: 'การ์ดจอ (GPU)', name: 'ASUS DUAL GeForce RTX 4060 Ti OC 8G', icon: 'bi-gpu-card', id: 'gpu-5' },
                        { label: 'เมนบอร์ด (MB)', name: 'ASUS PRIME B760M-A WIFI DDR5', icon: 'bi-layout-three-columns', id: 'mb-5' },
                        { label: 'หน่วยความจำ (RAM)', name: 'KINGSTON FURY BEAST RGB 32GB (16GBx2) DDR5 5600MHz', icon: 'bi-memory', id: 'ram-4' },
                        { label: 'สตอเรจ (SSD)', name: 'KINGSTON NV2 1TB PCIe 4.0 NVMe M.2', icon: 'bi-device-ssd', id: 'm2-3' },
                        { label: 'พาวเวอร์ (PSU)', name: 'MSI MAG A650BN 650W 80+ BRONZE', icon: 'bi-plug', id: 'psu-4' },
                        { label: 'เคสคอม (CASE)', name: 'NZXT H5 FLOW Black Premium Case', icon: 'bi-box', id: 'case-3' },
                        { label: 'ระบบระบายความร้อน', name: 'DEEPCOOL LE520 (240mm) Liquid Cooler', icon: 'bi-fan', id: 'lc-1' }
                    ])
                },
                {
                    id: 'set-4',
                    name: 'TechGear Elite Creator i7',
                    purpose: 'คอมพิวเตอร์ระดับโปรสำหรับครีเอเตอร์ ตัดต่อวิดีโอ 4K ทำงานกราฟิก 3D เรนเดอร์รวดเร็ว และตอบโจทย์การทำงานหนัก',
                    category: 'streaming',
                    cpu_brand: 'Intel',
                    badge_type: 'premium',
                    badge_text: 'ขุมพลังครีเอเตอร์',
                    original_price: 77900.00,
                    price: 69550.00,
                    parts_list: JSON.stringify([
                        { label: 'ซีพียู (CPU)', name: 'Intel Core i7-14700K 3.4GHz 20C/28T', icon: 'bi-cpu', id: 'cpu-9' },
                        { label: 'การ์ดจอ (GPU)', name: 'MSI GeForce RTX 4070 SUPER VENTUS 2X OC 12G', icon: 'bi-gpu-card', id: 'gpu-6' },
                        { label: 'เมนบอร์ด (MB)', name: 'ASUS ROG STRIX Z790-F GAMING WIFI II', icon: 'bi-layout-three-columns', id: 'mb-7' },
                        { label: 'หน่วยความจำ (RAM)', name: 'KINGSTON FURY BEAST RGB 32GB (16GBx2) DDR5 5600MHz', icon: 'bi-memory', id: 'ram-4' },
                        { label: 'สตอเรจ (SSD)', name: 'SAMSUNG 990 PRO 1TB PCIe 4.0 NVMe M.2', icon: 'bi-device-ssd', id: 'm2-6' },
                        { label: 'พาวเวอร์ (PSU)', name: 'CORSAIR RM850e 850W 80+ GOLD ATX 3.0', icon: 'bi-plug', id: 'psu-5' },
                        { label: 'เคสคอม (CASE)', name: 'NZXT H5 FLOW Black Premium Case', icon: 'bi-box', id: 'case-3' },
                        { label: 'ระบบระบายความร้อน', name: 'DEEPCOOL LE520 (240mm) Liquid Cooler', icon: 'bi-fan', id: 'lc-1' }
                    ])
                },
                {
                    id: 'set-5',
                    name: 'TechGear Overkill RTX 4090 Monster',
                    purpose: 'ที่สุดแห่งความเหนือชั้น สเปกสุดอลังการด้วยการ์ดจอระดับราชา RTX 4090 เคสกระจกหรู และระบบน้ำปิด 3 ตอนเต็มระบบ',
                    category: 'high-end',
                    cpu_brand: 'Intel',
                    badge_type: 'overkill',
                    badge_text: 'ขีดสุดความแรง',
                    original_price: 145000.00,
                    price: 132660.00,
                    parts_list: JSON.stringify([
                        { label: 'ซีพียู (CPU)', name: 'Intel Core i7-14700K 3.4GHz 20C/28T', icon: 'bi-cpu', id: 'cpu-9' },
                        { label: 'การ์ดจอ (GPU)', name: 'ASUS ROG STRIX GeForce RTX 4090 O24G GAMING', icon: 'bi-gpu-card', id: 'gpu-7' },
                        { label: 'เมนบอร์ด (MB)', name: 'ASUS ROG STRIX Z790-F GAMING WIFI II', icon: 'bi-layout-three-columns', id: 'mb-7' },
                        { label: 'หน่วยความจำ (RAM)', name: 'G.SKILL TRIDENT Z5 RGB 32GB (16GBx2) DDR5 6400MHz', icon: 'bi-memory', id: 'ram-6' },
                        { label: 'สตอเรจ (SSD)', name: 'SAMSUNG 990 PRO 1TB PCIe 4.0 NVMe M.2', icon: 'bi-device-ssd', id: 'm2-6' },
                        { label: 'พาวเวอร์ (PSU)', name: 'CORSAIR RM850e 850W 80+ GOLD ATX 3.0', icon: 'bi-plug', id: 'psu-5' },
                        { label: 'เคสคอม (CASE)', name: 'LIAN LI O11 DYNAMIC EVO Glass Premium Case', icon: 'bi-box', id: 'case-5' },
                        { label: 'ระบบระบายความร้อน', name: 'NZXT KRAKEN ELITE 360 RGB Liquid Cooler', icon: 'bi-fan', id: 'lc-3' }
                    ])
                }
            ];

            for (const pcSet of sampleSets) {
                await connection.query(
                    'INSERT INTO pc_sets (id, name, purpose, category, cpu_brand, badge_type, badge_text, original_price, price, parts_list) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [pcSet.id, pcSet.name, pcSet.purpose, pcSet.category, pcSet.cpu_brand, pcSet.badge_type, pcSet.badge_text, pcSet.original_price, pcSet.price, pcSet.parts_list]
                );
            }
            console.log('Database table "pc_sets" pre-populated with default sets.');
        }

        // 5. สร้างตาราง product_reviews หากยังไม่มี
        await connection.query(`
            CREATE TABLE IF NOT EXISTS product_reviews (
                id INT AUTO_INCREMENT PRIMARY KEY,
                product_id VARCHAR(50) NOT NULL,
                product_name VARCHAR(255) NOT NULL,
                user_email VARCHAR(255) NOT NULL,
                rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
                comment TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Database table "product_reviews" checked/created successfully.');

        // เพิ่มรีวิวเริ่มต้นจำลอง (Sample Reviews) หากยังไม่มี
        const [reviewsCount] = await connection.query('SELECT COUNT(*) as count FROM product_reviews');
        if (reviewsCount[0].count === 0) {
            const sampleReviews = [
                {
                    product_id: 'set-1',
                    product_name: 'TechGear Entry Gamer i3',
                    user_email: 'gamer_boy@example.com',
                    rating: 5,
                    comment: 'ราคาคุ้มค่ามากครับ เล่น Valorant ลื่นหัวแตกเลย ดีไซน์สวยงามมาก แอดมินแนะนำดี'
                },
                {
                    product_id: 'set-2',
                    product_name: 'TechGear Midrange AMD R5',
                    user_email: 'somchai_it@example.com',
                    rating: 4,
                    comment: 'ประสิทธิภาพดีมากครับ เอามาเล่น Cyberpunk ปรับ Medium-High ลื่นไหลดีมาก คุ้มราคาที่สุด'
                },
                {
                    product_id: 'cpu-9',
                    product_name: 'CPU INTEL 1700 CORE I7-14700K 3.4GHz 20C 28T',
                    user_email: 'vfx_creator@example.com',
                    rating: 5,
                    comment: 'แรงจัดจ้าน เรนเดอร์ 3D เร็วมากครับ แต่ต้องใช้ชุดน้ำปิด 3 ตอนดีๆ หน่อยครับ ไม่งั้นเอาไม่อยู่'
                },
                {
                    product_id: 'gpu-7',
                    product_name: 'ASUS ROG STRIX GeForce RTX 4090 O24G GAMING',
                    user_email: 'whaleshark@example.com',
                    rating: 5,
                    comment: 'ราชาแห่งการ์ดจออย่างแท้จริง แรงเหลือล้น เล่นได้ทุกเกมในโลกแบบ 4K 144Hz สบายๆ ดีไซน์พรีเมียมสมชื่อ ROG'
                },
                {
                    product_id: 'set-5',
                    product_name: 'TechGear Overkill RTX 4090 Monster',
                    user_email: 'richguy99@example.com',
                    rating: 5,
                    comment: 'ที่สุดของเครื่องเล่นเกมเลยครับ สวยงามอลังการมาก เล่นเกมหนักๆ ชิวๆ เลยครับ คุ้มค่าเงินที่จ่ายไปมาก'
                }
            ];
            for (const r of sampleReviews) {
                await connection.query(
                    'INSERT INTO product_reviews (product_id, product_name, user_email, rating, comment) VALUES (?, ?, ?, ?, ?)',
                    [r.product_id, r.product_name, r.user_email, r.rating, r.comment]
                );
            }
            console.log('Database table "product_reviews" pre-populated with sample reviews.');
        }


        // 6. สร้างตารางเก็บข้อมูลคำสั่งซื้อ (Orders Table) หากยังไม่มีในฐานข้อมูล
        await connection.query(`
            CREATE TABLE IF NOT EXISTS orders (
                id INT AUTO_INCREMENT PRIMARY KEY, -- ไอดีคำสั่งซื้อ (รันอัตโนมัติ)
                order_number VARCHAR(50) NOT NULL UNIQUE, -- หมายเลขคำสั่งซื้อแบบไม่ซ้ำกัน (เช่น TALAY-XXXXX)
                user_email VARCHAR(255) NOT NULL, -- อีเมลผู้สั่งซื้อที่เป็นสมาชิก
                full_name VARCHAR(255) NOT NULL, -- ชื่อ-นามสกุลจริงของผู้รับสินค้า
                phone VARCHAR(50) NOT NULL, -- เบอร์โทรศัพท์สำหรับติดต่อจัดส่ง
                email VARCHAR(255) NOT NULL, -- อีเมลติดต่อจัดส่ง
                shipping_method VARCHAR(50) NOT NULL, -- วิธีการจัดส่ง (เช่น delivery = จัดส่งถึงที่, pickup = รับที่สาขา)
                address TEXT NULL, -- ที่อยู่ปลายทางสำหรับจัดส่ง
                pickup_branch VARCHAR(255) NULL, -- สาขาที่ไปรับสินค้า (ถ้าเลือก pickup)
                payment_method VARCHAR(50) NOT NULL, -- ช่องทางการจ่ายเงิน (เช่น transfer = โอนเงิน, card = บัตรเครดิต, installment = ผ่อนชำระ)
                payment_bank VARCHAR(100) NULL, -- ธนาคารที่เลือกชำระเงิน
                payment_term INT NULL, -- ระยะเวลาผ่อนชำระเป็นจำนวนเดือน (เช่น 3, 6, 10 เดือน)
                discount DECIMAL(10, 2) NOT NULL DEFAULT 0.00, -- ส่วนลดที่ได้รับ (บาท)
                total_amount DECIMAL(10, 2) NOT NULL, -- ยอดรวมสุทธิที่ต้องชำระ (บาท)
                status VARCHAR(50) NOT NULL DEFAULT 'pending', -- สถานะการสั่งซื้อ (เช่น pending = รอชำระเงิน, processing = เตรียมจัดส่ง, shipped = จัดส่งแล้ว)
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- วันเวลาที่สร้างรายการสั่งซื้อ
            )
        `);
        console.log('Database table "orders" checked/created successfully.');

        // 7. สร้างตารางรายการสินค้าภายในคำสั่งซื้อ (Order Items Table)
        // ใช้เก็บรายละเอียดสินค้าแยกแต่ละชิ้นของแต่ละ Order
        await connection.query(`
            CREATE TABLE IF NOT EXISTS order_items (
                id INT AUTO_INCREMENT PRIMARY KEY, -- ไอดีรายการย่อย
                order_id INT NOT NULL, -- ไอดีอ้างอิงกลับไปยังตารางหลัก orders
                product_name VARCHAR(255) NOT NULL, -- ชื่อสินค้า ณ ตอนที่สั่งซื้อ
                price DECIMAL(10, 2) NOT NULL, -- ราคาสินค้าต่อหน่วย ณ ตอนที่สั่งซื้อ
                qty INT NOT NULL, -- จำนวนชิ้นที่สั่งซื้อ
                FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE -- ตั้งเงื่อนไขลบข้อมูลเชื่อมโยงหากออเดอร์หลักถูกลบ
            )
        `);
        console.log('Database table "order_items" checked/created successfully.');

        // 8. สร้างตารางสมุดที่อยู่ผู้ใช้งาน (User Addresses Table)
        // สำหรับเก็บข้อมูลที่อยู่จัดส่งและที่อยู่ออกใบกำกับภาษีของผู้ใช้งานแต่ละคน
        await connection.query(`
            CREATE TABLE IF NOT EXISTS user_addresses (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_email VARCHAR(255) NOT NULL, -- อีเมลเจ้าของที่อยู่
                type VARCHAR(50) NOT NULL, -- ประเภทที่อยู่ (shipping = ที่อยู่จัดส่ง, billing = ที่อยู่ออกใบเสร็จ/ใบกำกับภาษี)
                full_name VARCHAR(255) NOT NULL, -- ชื่อผู้รับ
                phone VARCHAR(50) NOT NULL, -- เบอร์ติดต่อ
                address_line TEXT NOT NULL, -- รายละเอียดที่อยู่ (บ้านเลขที่, ถนน, ตำบล, อำเภอ, จังหวัด, รหัสไปรษณีย์)
                tax_id VARCHAR(50) NULL, -- เลขประจำตัวผู้เสียภาษี (มีเฉพาะประเภท billing)
                is_default TINYINT(1) NOT NULL DEFAULT 0, -- สถานะที่อยู่หลักเริ่มต้น (1 = ใช่, 0 = ไม่ใช่)
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Database table "user_addresses" checked/created successfully.');

        // 9. สร้างตารางข้อมูลช่องทางชำระเงิน/บัตรเครดิต (User Payment Methods Table)
        await connection.query(`
            CREATE TABLE IF NOT EXISTS user_payment_methods (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_email VARCHAR(255) NOT NULL, -- อีเมลเจ้าของบัตร
                card_number VARCHAR(50) NOT NULL, -- หมายเลขบัตรเครดิต 16 หลัก
                card_holder VARCHAR(255) NOT NULL, -- ชื่อผู้ถือบัตรภาษาอังกฤษตัวใหญ่
                expiry_date VARCHAR(10) NOT NULL, -- วันหมดอายุบัตร (เช่น 12/29)
                card_provider VARCHAR(50) NOT NULL, -- ผู้ให้บริการบัตร (เช่น Visa, Mastercard, JCB)
                is_default TINYINT(1) NOT NULL DEFAULT 0, -- สถานะบัตรหลักเริ่มต้น (1 = ใช่, 0 = ไม่ใช่)
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Database table "user_payment_methods" checked/created successfully.');

        // 10. ทำการเพิ่มข้อมูลที่อยู่อีเมลทดสอบจำลอง (Seed User Addresses) หากตารางยังว่างอยู่
        const [addressesCount] = await connection.query('SELECT COUNT(*) as count FROM user_addresses');
        if (addressesCount[0].count === 0) {
            const [users] = await connection.query('SELECT email FROM users WHERE email IN (?, ?)', ['user@example.com', 'phswatphothisri504@gmail.com']);
            const emailsToSeed = users.map(u => u.email);
            if (emailsToSeed.length === 0) {
                emailsToSeed.push('user@example.com');
            }
            for (const email of emailsToSeed) {
                // บันทึกที่อยู่จัดส่งตัวอย่าง (Shipping Address)
                await connection.query(`
                    INSERT INTO user_addresses (user_email, type, full_name, phone, address_line, tax_id, is_default)
                    VALUES (?, 'shipping', 'พศวัต บัวจีน', '0812345678', '123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพมหานคร 10110', NULL, 1)
                `, [email]);
                // บันทึกที่อยู่ใบกำกับภาษีตัวอย่าง (Billing Address)
                await connection.query(`
                    INSERT INTO user_addresses (user_email, type, full_name, phone, address_line, tax_id, is_default)
                    VALUES (?, 'billing', 'บริษัท ทะเล ไอที จำกัด (มหาชน)', '026600123', '999 ถนนวิภาวดีรังสิต แขวงจอมพล เขตจตุจักร กรุงเทพมหานคร 10900', '0105566000123', 1)
                `, [email]);
            }
            console.log('Database table "user_addresses" pre-populated with sample addresses.');
        }

        // 11. ทำการเพิ่มบัตรเครดิตจำลอง (Seed Payment Methods) หากตารางยังว่างอยู่
        const [paymentMethodsCount] = await connection.query('SELECT COUNT(*) as count FROM user_payment_methods');
        if (paymentMethodsCount[0].count === 0) {
            const [users] = await connection.query('SELECT email FROM users WHERE email IN (?, ?)', ['user@example.com', 'phswatphothisri504@gmail.com']);
            const emailsToSeed = users.map(u => u.email);
            if (emailsToSeed.length === 0) {
                emailsToSeed.push('user@example.com');
            }
            for (const email of emailsToSeed) {
                await connection.query(`
                    INSERT INTO user_payment_methods (user_email, card_number, card_holder, expiry_date, card_provider, is_default)
                    VALUES (?, '4321567890124321', 'PHASAWAT BUACHIN', '12/29', 'Visa', 1)
                `, [email]);
            }
            console.log('Database table "user_payment_methods" pre-populated with sample payment methods.');
        }

        // 12. ทำการเพิ่มคำสั่งซื้อเริ่มต้นจำลอง (Seed Sample Orders) เพื่อให้เห็นประวัติในแดชบอร์ด
        const [ordersCount] = await connection.query('SELECT COUNT(*) as count FROM orders');
        if (ordersCount[0].count === 0) {
            const [users] = await connection.query('SELECT email FROM users WHERE email IN (?, ?)', ['user@example.com', 'phswatphothisri504@gmail.com']);
            const emailsToSeed = users.map(u => u.email);
            if (emailsToSeed.length === 0) {
                emailsToSeed.push('user@example.com');
            }

            for (const email of emailsToSeed) {
                // เพิ่มข้อมูลคำสั่งซื้อหลัก
                const [orderResult] = await connection.query(`
                    INSERT INTO orders (order_number, user_email, full_name, phone, email, shipping_method, address, payment_method, discount, total_amount, status)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `, [
                    'TALAY-98745',
                    email,
                    'พศวัต บัวจีน',
                    '0812345678',
                    email,
                    'delivery',
                    '123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพมหานคร 10110',
                    'card',
                    0.00,
                    75900.00,
                    'shipped'
                ]);
                const orderId = orderResult.insertId;

                // เพิ่มสินค้าชิ้นส่วนในคำสั่งซื้อ (เช่น การ์ดจอ RTX 4090 สุดแรง)
                await connection.query(`
                    INSERT INTO order_items (order_id, product_name, price, qty)
                    VALUES (?, ?, ?, ?)
                `, [
                    orderId,
                    'ASUS ROG Strix GeForce RTX 4090 OC 24GB',
                    75900.00,
                    1
                ]);
            }
            console.log('Database table "orders" pre-populated with sample orders.');
        }

        await connection.end(); // ปิดการเชื่อมต่อฐานข้อมูลตัวเริ่มต้น
    } catch (error) {
        console.error('Failed to initialize database:', error.message);
    }
}

// ==========================================
// สั่งรันเซิร์ฟเวอร์หลังบ้าน Express.js ไว้ที่ Port ที่กำหนด
// ==========================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`Backend server is running on port ${PORT}`);
    await initializeDatabase(); // รันฟังก์ชันเตรียมตารางฐานข้อมูลและข้อมูลจำลองเมื่อเซิร์ฟเวอร์เริ่มทำงานสำเร็จ
});


