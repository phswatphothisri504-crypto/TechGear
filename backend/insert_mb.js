const mysql = require('mysql2/promise');

async function run() {
  const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'rootpassword',
    database: 'store_db',
    port: 3306
  };

  try {
    const conn = await mysql.createConnection(dbConfig);
    
    await conn.query('INSERT INTO pc_parts (category, brand, series, name, price, specs, socket) VALUES (?, ?, ?, ?, ?, ?, ?)', 
      ['motherboard', 'GIGABYTE', 'A520', 'GIGABYTE A520M K V2 DDR4', 1890.00, 'Micro-ATX, 2x DDR4 5100(OC)MHz, 1x M.2, 4x SATA3', 'Socket AM4']
    );
    await conn.query('UPDATE pc_parts SET id = CONCAT("mb-", db_id) WHERE id IS NULL OR id = ""');
    console.log("Inserted GIGABYTE A520M K V2");

    await conn.query('INSERT INTO pc_parts (category, brand, series, name, price, specs, socket) VALUES (?, ?, ?, ?, ?, ?, ?)', 
      ['motherboard', 'ASUS', 'B450', 'ASUS PRIME B450M-A II DDR4', 2390.00, 'Micro-ATX, 4x DDR4 4400(OC)MHz, 1x M.2, 6x SATA3', 'Socket AM4']
    );
    await conn.query('UPDATE pc_parts SET id = CONCAT("mb-", db_id) WHERE id IS NULL OR id = ""');
    console.log("Inserted ASUS PRIME B450M-A II");

    await conn.query('INSERT INTO pc_parts (category, brand, series, name, price, specs, socket) VALUES (?, ?, ?, ?, ?, ?, ?)', 
      ['motherboard', 'MSI', 'B550', 'MSI B550M PRO-VDH WIFI DDR4', 3950.00, 'Micro-ATX, 4x DDR4 4400(OC)MHz, 2x M.2, Wi-Fi 5', 'Socket AM4']
    );
    await conn.query('UPDATE pc_parts SET id = CONCAT("mb-", db_id) WHERE id IS NULL OR id = ""');
    console.log("Inserted MSI B550M PRO-VDH WIFI");

    await conn.end();
    console.log("Done inserting AM4 motherboards.");
  } catch (error) {
    console.error("Error:", error.message);
  }
}

run();
