// 1. นำเข้าฟังก์ชัน createApp จาก Vue เพื่อใช้สร้างตัวแปรแอปพลิเคชันหลัก
import { createApp } from 'vue'

// 2. นำเข้า Component หลักของแอป (App.vue) ซึ่งเป็นเหมือนหน้ากากและโครงร่างหลักของเว็บ
import App from './App.vue'

// 3. นำเข้าตัวจัดการเส้นทาง (Router) ที่กำหนดเส้นทาง URL ต่าง ๆ ในหน้าเว็บ
import router from './router'

import axios from 'axios'
// ตั้งค่า Base URL ดึงจากไฟล์ .env (ถ้าไม่มีให้ใช้ localhost:3000 สำหรับตอนทำในเครื่อง)
axios.defaults.baseURL = process.env.VUE_APP_API_URL || 'http://localhost:3000'

// 4. นำเข้า CSS ของ Bootstrap สำหรับดีไซน์และ Grid Layout
import 'bootstrap/dist/css/bootstrap.min.css'

// 5. นำเข้า JS ของ Bootstrap สำหรับพวก Dropdown, Modal และ Interactive Component ต่าง ๆ
import "bootstrap/dist/js/bootstrap.bundle.js"

// 6. สร้าง Instance ของแอปพลิเคชันจาก App.vue
const app = createApp(App)

// 7. สั่งให้แอปพลิเคชันใช้ Router เพื่อเปิดใช้งานระบบเปลี่ยนหน้าเว็บโดยไม่โหลดหน้าใหม่ (Single Page Application)
app.use(router)

// 8. เชื่อมต่อตัวแอปพลิเคชันเข้ากับ Tag HTML ที่มี ID เป็น #app ในไฟล์ public/index.html เพื่อแสดงผลขึ้นหน้าจอ
app.mount('#app')

