<template>
  <div class="page-wrapper">
    <!-- Glowing background elements for premium feel -->
    <div class="glowing-bg">
      <div class="blob blob-purple"></div>
      <div class="blob blob-pink"></div>
      <div class="blob blob-blue"></div>
    </div>

    <!-- Navigation Bar -->
    <KakaNavbar />

    <div class="container py-5 content-container">
      <!-- Breadcrumb navigation -->
      <nav aria-label="breadcrumb" class="mb-4 animate-fade-in">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><router-link to="/" class="text-decoration-none">หน้าแรก</router-link></li>
          <li class="breadcrumb-item active" aria-current="page">ข้อกำหนดและเงื่อนไข</li>
        </ol>
      </nav>

      <div class="row g-4">
        <!-- Left Sidebar Column -->
        <div class="col-lg-3 col-md-4 col-12 animate-slide-right">
          <div class="sidebar-card">
            <!-- Section 1: เกี่ยวกับเรา -->
            <div class="sidebar-section">
              <span class="section-title">เกี่ยวกับเรา</span>
              <ul class="sidebar-menu list-unstyled mb-0">
                <li>
                  <router-link to="/contact" class="menu-link">
                    <span class="indicator"></span>
                    <i class="bi bi-headset me-2"></i>
                    ติดต่อเรา
                  </router-link>
                </li>
                <li>
                  <router-link to="/about" class="menu-link">
                    <span class="indicator"></span>
                    <i class="bi bi-info-circle me-2"></i>
                    เกี่ยวกับเรา
                  </router-link>
                </li>
                <li>
                  <router-link to="/reviews" class="menu-link">
                    <span class="indicator"></span>
                    <i class="bi bi-star me-2"></i>
                    รีวิวจากลูกค้า
                  </router-link>
                </li>
                <li class="active">
                  <router-link to="/terms" class="menu-link">
                    <span class="indicator"></span>
                    <i class="bi bi-file-earmark-text me-2 icon-active"></i>
                    ข้อกำหนดและเงื่อนไข
                  </router-link>
                </li>
                <li>
                  <router-link to="/privacy" class="menu-link">
                    <span class="indicator"></span>
                    <i class="bi bi-shield-lock me-2"></i>
                    นโยบายความเป็นส่วนตัว
                  </router-link>
                </li>
              </ul>
            </div>

            <!-- Section 2: บริการลูกค้า -->
            <div class="sidebar-section border-top pt-3">
              <span class="section-title">บริการลูกค้า</span>
              <ul class="sidebar-menu list-unstyled mb-0">
                <li>
                  <router-link to="/shipping" class="menu-link">
                    <span class="indicator"></span>
                    <i class="bi bi-truck me-2"></i>
                    การจัดส่งสินค้า
                  </router-link>
                </li>
                <li>
                  <router-link to="/warranty" class="menu-link">
                    <span class="indicator"></span>
                    <i class="bi bi-patch-check me-2"></i>
                    การรับประกันสินค้า
                  </router-link>
                </li>
                <li>
                  <router-link to="/cancellation" class="menu-link">
                    <span class="indicator"></span>
                    <i class="bi bi-x-circle me-2"></i>
                    การยกเลิกการสั่งซื้อสินค้า
                  </router-link>
                </li>
                <li>
                  <router-link to="/refund" class="menu-link">
                    <span class="indicator"></span>
                    <i class="bi bi-arrow-counterclockwise me-2"></i>
                    การคืนสินค้าและการคืนเงิน
                  </router-link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Right Content Column -->
        <div class="col-lg-9 col-md-8 col-12 animate-slide-left">
          <div class="content-card">
            <!-- Header section -->
            <div class="card-header-custom d-flex align-items-center gap-2 mb-4 pb-3 border-bottom">
              <i class="bi bi-file-earmark-text header-icon"></i>
              <h1 class="h3 fw-bold m-0 text-dark">ข้อกำหนดและเงื่อนไข</h1>
            </div>

            <!-- Content Details -->
            <div class="terms-details mt-4">
              <div class="badge-premium px-3 py-2 mb-4 d-inline-flex align-items-center gap-2 shadow-sm">
                <i class="bi bi-shield-check"></i> TERMS & CONDITIONS
              </div>

              <div class="info-group mb-4">
                <h3 class="group-title">1. ข้อตกลงการใช้บริการ</h3>
                <p class="text-muted-custom fs-6 lh-lg ps-3">
                  ยินดีต้อนรับสู่ **TechGear Store** การเข้าถึงและใช้งานเว็บไซต์นี้แสดงว่าท่านตกลงที่จะปฏิบัติตามและผูกพันภายใต้ข้อกำหนดและเงื่อนไขการใช้บริการเหล่านี้ หากท่านไม่ตกลงในข้อกำหนดใดๆ ขอความกรุณายุติการใช้งานเว็บไซต์นี้โดยทันที
                </p>
              </div>

              <div class="info-group mb-4">
                <h3 class="group-title">2. การลงทะเบียนบัญชีผู้ใช้</h3>
                <p class="text-muted-custom fs-6 lh-lg ps-3">
                  ในการใช้งานฟังก์ชันการสั่งซื้อสินค้าและจัดสเปกคอมพิวเตอร์ ท่านจำเป็นต้องสมัครสมาชิกและให้ข้อมูลที่เป็นจริง ถูกต้อง และเป็นปัจจุบัน หากตรวจพบข้อมูลอันเป็นเท็จหรือแอบอ้างสิทธิ์ของผู้อื่น ทางร้านขอสงวนสิทธิ์ในการระงับหรือยกเลิกบัญชีของท่านทันทีโดยไม่ต้องแจ้งให้ทราบล่วงหน้า
                </p>
              </div>

              <div class="info-group mb-4">
                <h3 class="group-title">3. นโยบายราคาและการชำระเงิน</h3>
                <p class="text-muted-custom fs-6 lh-lg ps-3">
                  ราคาสินค้าทั้งหมดที่แสดงบนเว็บไซต์เป็นสกุลเงินบาท (THB) และอาจมีการเปลี่ยนแปลงโดยไม่ต้องแจ้งให้ทราบล่วงหน้า การสั่งซื้อจะเสร็จสมบูรณ์ต่อเมื่อท่านทำการชำระเงินผ่านช่องทางที่ระบุและได้รับการยืนยันรายการชำระเงินจากระบบเรียบร้อยแล้วเท่านั้น
                </p>
              </div>

              <div class="info-group mb-4">
                <h3 class="group-title">4. ทรัพย์สินทางปัญญา</h3>
                <p class="text-muted-custom fs-6 lh-lg ps-3">
                  เนื้อหา รูปภาพ โลโก้ ซอร์สโค้ด และข้อมูลการจัดสเปกคอมพิวเตอร์ทั้งหมดบนเว็บไซต์นี้ เป็นทรัพย์สินทางปัญญาของ **TechGear Store** ห้ามมิให้ผู้ใดคัดลอก ดัดแปลง เผยแพร่ หรือนำไปใช้ในเชิงพาณิชย์โดยไม่ได้รับอนุญาตเป็นลายลักษณ์อักษรจากเรา
                </p>
              </div>

              <div class="info-group mb-4">
                <h3 class="group-title">5. ข้อจำกัดความรับผิดชอบ</h3>
                <p class="text-muted-custom fs-6 lh-lg ps-3">
                  เรามุ่งมั่นที่จะให้ข้อมูลสินค้าและสต็อกสินค้าที่ถูกต้องที่สุด อย่างไรก็ดี หากเกิดข้อผิดพลาดในการแสดงผลราคาหรือรายละเอียดผลิตภัณฑ์ ทางเราขอสงวนสิทธิ์ในการยกเลิกคำสั่งซื้อที่มีข้อผิดพลาดดังกล่าว และจะดำเนินการคืนเงินให้แก่ท่านอย่างเต็มจำนวน
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <KakaFooter />
  </div>
</template>

<script setup>
import KakaNavbar from './KakaNavbar.vue'
import KakaFooter from './KakaFooter.vue'
</script>

<script>
export default {
  name: 'KakaTerms'
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Kanit:wght@200;300;400;500;600;700;800;900&display=swap');
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css");

.page-wrapper {
  position: relative;
  min-height: 100vh;
  font-family: 'Kanit', sans-serif;
  overflow-x: hidden;
  background: #f4f6f9;
  color: #1e293b;
}

/* Glowing background elements */
.glowing-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.03;
  mix-blend-mode: multiply;
  animation: float-blob 20s infinite alternate ease-in-out;
}

.blob-purple {
  top: 10%;
  left: 15%;
  width: 450px;
  height: 450px;
  background: #0ea5e9;
}

.blob-pink {
  bottom: 10%;
  right: 15%;
  width: 500px;
  height: 500px;
  background: #3b82f6;
  animation-delay: -5s;
}

.blob-blue {
  top: 40%;
  right: 35%;
  width: 350px;
  height: 350px;
  background: #0ea5e9;
  animation-delay: -10s;
}

@keyframes float-blob {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(40px, -60px) scale(1.1); }
  100% { transform: translate(-30px, 40px) scale(0.9); }
}

.content-container {
  position: relative;
  z-index: 1;
}

/* Breadcrumbs */
.breadcrumb {
  background: transparent;
  padding: 0;
}
.breadcrumb-item a {
  color: #64748b;
  font-weight: 500;
  transition: color 0.2s ease;
}
.breadcrumb-item a:hover {
  color: #0ea5e9;
}
.breadcrumb-item.active {
  color: #0ea5e9;
  font-weight: 600;
}

/* Sidebar Styling */
.sidebar-card {
  background: #ffffff;
  border: 1px solid #eef2f6;
  border-radius: 1.25rem;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.02);
  padding: 1.5rem 0;
  transition: all 0.3s ease;
}

.sidebar-section {
  margin-bottom: 1rem;
}
.sidebar-section:last-child {
  margin-bottom: 0;
}

.section-title {
  display: block;
  font-size: 0.85rem;
  font-weight: 700;
  color: #94a3b8;
  padding: 0 1.5rem 0.5rem 1.5rem;
  letter-spacing: 0.5px;
}

.sidebar-menu li {
  position: relative;
}

.menu-link {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  color: #475569;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  border-left: 3px solid transparent;
  transition: all 0.25s ease;
}

.menu-link i {
  font-size: 1.1rem;
  color: #94a3b8;
  transition: color 0.25s ease;
}

.menu-link:hover {
  color: #0ea5e9;
  background-color: #f0f9ff;
  border-left-color: #0ea5e9;
}

.menu-link:hover i {
  color: #0ea5e9;
}

.sidebar-menu li.active .menu-link {
  color: #0ea5e9;
  font-weight: 600;
  border-left-color: #0ea5e9;
  background-color: #f0f9ff;
}

.sidebar-menu li.active .menu-link i {
  color: #0ea5e9;
}

/* Content Card Styling */
.content-card {
  background: #ffffff;
  border: 1px solid #eef2f6;
  border-radius: 1.25rem;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.02);
  padding: 2.5rem;
  min-height: 500px;
  transition: all 0.3s ease;
}

.card-header-custom {
  border-bottom: 1px solid #f1f5f9 !important;
}

.header-icon {
  font-size: 2rem;
  color: #0ea5e9;
  display: flex;
  align-items: center;
  animation: pulse-blue 2s infinite;
}

@keyframes pulse-blue {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.text-muted-custom {
  color: #475569;
}

.badge-premium {
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  color: #0284c7;
  border-radius: 2rem;
  font-weight: 600;
  font-size: 0.75rem;
  letter-spacing: 1px;
  text-transform: uppercase;
}

/* Info Group Styling */
.info-group {
  margin-bottom: 2.25rem;
  animation: fadeInUp 0.5s ease both;
}

.group-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.75rem;
  position: relative;
  padding-left: 0.75rem;
}

.group-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 18px;
  background-color: #0ea5e9;
  border-radius: 2px;
}

/* Animations */
.animate-fade-in {
  animation: fadeIn 0.4s ease both;
}
.animate-slide-right {
  animation: slideInRight 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
}
.animate-slide-left {
  animation: slideInLeft 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Responsive Overrides */
@media (max-width: 767px) {
  .content-card {
    padding: 1.5rem;
  }
}
</style>
