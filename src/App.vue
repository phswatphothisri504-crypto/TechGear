<template>
  <!-- <router-view> ทำหน้าที่เป็นจุดแสดงผลของคอมโพเนนต์ต่าง ๆ ที่เปลี่ยนไปตามเส้นทาง URL ที่ถูกเลือกใน Router -->
  <router-view></router-view>
</template>

<script>
// กำหนดโครงสร้าง Script ของ App Component
export default {
  name: 'App', // ชื่อ Component หลักของระบบเว็บ
}
</script>

<style>
/* นำเข้าฟอนต์ 'Kanit' จาก Google Fonts เพื่อใช้แสดงผลภาษาไทยให้สวยงาม */
@import url('https://fonts.googleapis.com/css2?family=Kanit:wght@200;300;400;500;600;700&display=swap');

/* กำหนดคุณสมบัติเริ่มต้นของระบบ CSS บนกรอบครอบแอปพลิเคชันหลัก (#app) */
#app {
  -webkit-font-smoothing: antialiased; /* ทำให้ฟอนต์ดูเรียบเนียนขึ้นในเบราว์เซอร์ตระกูล WebKit */
  -moz-osx-font-smoothing: grayscale;   /* ทำให้ฟอนต์ดูเรียบเนียนขึ้นในเบราว์เซอร์ Firefox */
  font-family: 'Kanit', sans-serif !important; /* กำหนดให้แอปทั้งหน้าใช้ฟอนต์ Kanit เป็นหลัก */
}

/* กำหนดพื้นหลังและสีอักษรเริ่มต้นของเว็บ */
body {
  font-family: 'Kanit', sans-serif !important;
  background-color: #f8fafc; /* พื้นหลังโทนสว่าง ออกโทนสีฟ้านวลเทาเล็กน้อย */
  color: #1e293b;            /* ตัวอักษรสีเทาเข้มเกือบดำเพื่อถนอมสายตา */
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* --- ระบบ Dark Mode (โหมดกลางคืน) --- */
[data-bs-theme="dark"] body {
  background-color: #121212 !important;
  color: #e0e0e0 !important;
}

[data-bs-theme="dark"] .bg-white {
  background-color: #1e1e1e !important;
  color: #e0e0e0 !important;
}

[data-bs-theme="dark"] .text-dark {
  color: #f8f9fa !important;
}

[data-bs-theme="dark"] .text-muted,
[data-bs-theme="dark"] .text-secondary {
  color: #a0aab5 !important;
}

[data-bs-theme="dark"] .border-top,
[data-bs-theme="dark"] .border-bottom,
[data-bs-theme="dark"] .border-start,
[data-bs-theme="dark"] .border-end,
[data-bs-theme="dark"] .border {
  border-color: #333333 !important;
}

[data-bs-theme="dark"] .shadow,
[data-bs-theme="dark"] .shadow-sm {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4) !important;
}

[data-bs-theme="dark"] .form-control {
  background-color: #2a2a2a !important;
  color: #e0e0e0 !important;
  border-color: #444 !important;
}

[data-bs-theme="dark"] .form-control:focus {
  background-color: #2a2a2a !important;
  color: #fff !important;
  border-color: #0ea5e9 !important;
}

/* คลาสพิเศษสำหรับห่อหุ้มหน้าเพจ ป้องกันไม่ให้เนื้อหาล้นออกด้านขวาของจอ (แก้ปัญหาระบบจอมือถือเพี้ยน) */
.page-wrapper {
  overflow-x: clip !important;
}
</style>

