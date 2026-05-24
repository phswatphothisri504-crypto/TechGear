// 1. นำเข้าฟังก์ชันสร้าง Router และระบบประวัติเบราว์เซอร์จากแพ็กเกจ vue-router
import { createRouter, createWebHistory } from 'vue-router'

// 2. นำเข้าคอมโพเนนต์หน้าแรก (Home) แบบทันที (Eager Loading) เพื่อความรวดเร็วในการเปิดหน้าเว็บครั้งแรก
import Home from '../components/KakaHome.vue'

// 3. ใช้เทคนิค Lazy Loading ในการดาวน์โหลดคอมโพเนนต์อื่น ๆ เมื่อมีการกดเข้าลิงก์หน้านั้น ๆ เท่านั้น (ช่วยลดขนาดหน้าเว็บหลักตอนเปิดครั้งแรก)
const About = () => import('../components/KakaAbout.vue')           // เกี่ยวกับเรา
const Contact = () => import('../components/KakaContact.vue')       // ติดต่อเรา
const Build = () => import('../components/KakaBuild.vue')           // จัดสเปกคอมพิวเตอร์
const PcSet = () => import('../components/KakaPcSet.vue')           // คอมพิวเตอร์เซตจัดชุดสำเร็จ
const Cart = () => import('../components/KakaCart.vue')             // ตะกร้าสินค้าและการชำระเงิน

// คอมโพเนนต์ด้านระบบสมาชิกและการจัดการสินค้า
const Apipost = () => import('../components/KakaPostList.vue')      // หน้าดึงโพสต์ทดสอบ API
const ProductCrud = () => import('../components/ProductCrud.vue')    // หน้าระบบจัดการสินค้าของ Admin
const Login = () => import('../components/KakaLogin.vue')           // หน้าเข้าสู่ระบบ
const Register = () => import('../components/KakaRegister.vue')        // หน้าสมัครสมาชิก
const Profile = () => import('../components/KakaProfile.vue')         // หน้าข้อมูลโปรไฟล์สมาชิก

// คอมโพเนนต์หน้ารายละเอียดและข้อกำหนดทางกฎหมาย/นโยบาย
const Terms = () => import('../components/KakaTerms.vue')           // ข้อตกลงและเงื่อนไขการใช้งาน
const Privacy = () => import('../components/KakaPrivacy.vue')       // นโยบายความเป็นส่วนตัว
const Shipping = () => import('../components/KakaShipping.vue')     // เงื่อนไขการจัดส่งสินค้า
const Warranty = () => import('../components/KakaWarranty.vue')     // เงื่อนไขการรับประกันสินค้า
const Cancellation = () => import('../components/KakaCancellation.vue') // นโยบายการยกเลิกคำสั่งซื้อ
const Refund = () => import('../components/KakaRefund.vue')         // นโยบายการคืนเงินและคืนสินค้า
const AllReviews = () => import('../components/KakaAllReviews.vue') // หน้ารีวิวรวมของทางร้าน

// 4. กำหนดตารางเส้นทางลิงก์ (Routes Configuration) ของหน้าเว็บทั้งหมด
const routes = [
  { path: '/', component: Home }, // หน้าหลักของระบบ
  { path: '/about', component: About },
  { path: '/contact', component: Contact, name: 'Contact' },
  { path: '/build', component: Build, name: 'Build' },
  { path: '/computer-set', component: PcSet, name: 'PcSets' },
  { path: '/cart', component: Cart, name: 'Cart' },

  { path: '/apipost', component: Apipost, name: 'Apipost' },
  { path: '/product', component: ProductCrud, name: 'ProductCrud' },
  { path: '/login', component: Login, name: 'Login' },
  { path: '/register', component: Register, name: 'Register' },
  { path: '/profile', component: Profile, name: 'Profile' },

  { path: '/terms', component: Terms, name: 'Terms' },
  { path: '/privacy', component: Privacy, name: 'Privacy' },
  { path: '/shipping', component: Shipping, name: 'Shipping' },
  { path: '/warranty', component: Warranty, name: 'Warranty' },
  { path: '/cancellation', component: Cancellation, name: 'Cancellation' },
  { path: '/refund', component: Refund, name: 'Refund' },
  { path: '/reviews', component: AllReviews, name: 'AllReviews' },
]

// 5. สร้างตัวแปร Router หลักของระบบ
const router = createRouter({
  history: createWebHistory(), // ใช้ประวัติเบราว์เซอร์แบบ HTML5 Web History เพื่อให้ URL ดูปกติ ไม่มีเครื่องหมาย #
  routes                      // กำหนดชุดเส้นทางที่ทำไว้ด้านบน
})

// 6. ระบบความปลอดภัยการเข้าถึงหน้าเว็บ (Route Guards) ทำงานทุกครั้งที่มีการเปลี่ยนหน้า
router.beforeEach((to, from, next) => {
  // ดึงสถานะการล็อกอินและบทบาทผู้ใช้จาก LocalStorage
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
  const userRole = localStorage.getItem('userRole') || 'user'

  // ตรวจสอบความปลอดภัย: หน้าระบบจัดการสินค้าของ Admin (/product)
  if (to.path === '/product') {
    // หากยังไม่ได้ล็อกอิน หรือมีบทบาทที่ไม่ใช่ admin ให้เด้งไปหน้าแรกทันที
    if (!isLoggedIn || userRole !== 'admin') {
      alert('เข้าถึงไม่ได้: หน้านี้สำหรับผู้ดูแลระบบ (Admin) เท่านั้น!')
      return next('/')
    }
  }

  // ตรวจสอบความปลอดภัย: หน้าโปรไฟล์ส่วนตัวของผู้ใช้ (/profile)
  if (to.path === '/profile') {
    // หากยังไม่ได้ล็อกอิน ให้บังคับไปที่หน้าเข้าสู่ระบบก่อน
    if (!isLoggedIn) {
      alert('กรุณาเข้าสู่ระบบก่อนเข้าหน้านี้!')
      return next('/login')
    }
  }

  // หากผ่านเงื่อนไขความปลอดภัยทั้งหมด ให้ทำงานสลับหน้าต่อไปตามปกติ
  next()
})

// ส่งออกตัวแปร router ไปใช้ใน main.js
export default router
