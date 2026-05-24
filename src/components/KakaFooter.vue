<template>
  <footer class="techgear-footer">
    <div class="container py-5">
      <div class="row g-4 justify-content-between">
        <!-- Column 1: Logo & Slogan -->
        <div class="col-lg-4 col-md-6 col-12 footer-brand-col">
          <router-link to="/" class="footer-logo text-decoration-none d-flex align-items-center gap-2 mb-3">
            <i class="bi bi-layers footer-logo-icon"></i>
            <span class="footer-logo-text">TechGear</span>
          </router-link>
          
          <p class="footer-desc mb-4">
            ถ้าคุณชอบคอมพิวเตอร์ เราคือเพื่อนกัน TechGear ร้านจำหน่ายอุปกรณ์คอมพิวเตอร์ โน๊ตบุ๊ค อุปกรณ์ต่อพ่วง เกมมิ่งเกียร์ รับประกันทุกชิ้น บริการจัดสเปกคอมพิวเตอร์ ตามการใช้งานในงบประมาณที่ลูกค้าเลือกได้เอง
          </p>
          
          <!-- Trust Badge / Registered Icon -->
          <div class="trust-badge-container">
            <div class="custom-dbd-badge d-flex align-items-center gap-2">
              <div class="dbd-icon-box">
                <i class="bi bi-shield-check-fill text-primary"></i>
              </div>
              <div class="dbd-text-box">
                <span class="dbd-title">DBD Registered</span>
                <span class="dbd-subtitle">ช้อปมั่นใจ ปลอดภัย 100%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Column 2: About Us Links -->
        <div class="col-lg-2 col-md-6 col-6 footer-links-col">
          <h5 class="footer-title mb-3">เกี่ยวกับเรา</h5>
          <ul class="list-unstyled footer-menu">
            <li><router-link to="/contact">ติดต่อเรา</router-link></li>
            <li><router-link to="/about">เกี่ยวกับเรา</router-link></li>
            <li><router-link to="/terms">ข้อกำหนดและเงื่อนไข</router-link></li>
            <li><router-link to="/privacy">นโยบายความเป็นส่วนตัว</router-link></li>
          </ul>
        </div>

        <!-- Column 3: Customer Service Links -->
        <div class="col-lg-2 col-md-6 col-6 footer-links-col">
          <h5 class="footer-title mb-3">บริการลูกค้า</h5>
          <ul class="list-unstyled footer-menu">
            <li><router-link to="/shipping">การจัดส่งสินค้า</router-link></li>
            <li><router-link to="/warranty">การรับประกันสินค้า</router-link></li>
            <li><router-link to="/cancellation">การยกเลิกการสั่งซื้อสินค้า</router-link></li>
            <li><router-link to="/refund">การคืนสินค้าและการคืนเงิน</router-link></li>
            <li><a href="#" @click.prevent="comingSoon('เช็คสถานะการจัดส่ง')">เช็คสถานะการจัดส่ง</a></li>
          </ul>
        </div>

        <!-- Column 4: Contact Us & Socials -->
        <div class="col-lg-3 col-md-6 col-12 footer-contact-col">
          <h5 class="footer-title mb-3">ติดต่อเรา</h5>
          <p class="contact-info mb-2 text-white-50">
            เลขที่ 222 หมู่ 6 ตำบลหนองงูเห่า อำเภอเมือง จังหวัดนครนายก 26000
          </p>
          <p class="contact-info mb-2 text-white-50">
            โทรศัพท์: <a href="tel:0620500065" class="text-white-50 text-decoration-none hover-white">0620500065</a>
          </p>
          <p class="contact-info mb-4 text-white-50">
            อีเมล: <a href="mailto:info@techgearcom" class="text-white-50 text-decoration-none hover-white">info@techgearcom</a>
          </p>
          
          <!-- Social Icons -->
          <div class="social-icons d-flex gap-3">
            <a href="https://facebook.com" target="_blank" class="social-icon-btn" aria-label="Facebook">
              <i class="bi bi-facebook"></i>
            </a>
            <a href="https://line.me" target="_blank" class="social-icon-btn" aria-label="Line">
              <i class="bi bi-chat-fill"></i>
            </a>
            <a href="https://youtube.com" target="_blank" class="social-icon-btn" aria-label="YouTube">
              <i class="bi bi-youtube"></i>
            </a>
            <a href="https://tiktok.com" target="_blank" class="social-icon-btn" aria-label="TikTok">
              <i class="bi bi-tiktok"></i>
            </a>
            <a href="https://instagram.com" target="_blank" class="social-icon-btn" aria-label="Instagram">
              <i class="bi bi-instagram"></i>
            </a>
          </div>
        </div>
      </div>

      <!-- Divider -->
      <hr class="footer-divider my-4" />

      <!-- Bottom Bar -->
      <div class="footer-bottom d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
        <div class="copyright text-white-50 text-center text-md-start">
          Copyright © 2026 <router-link to="/" class="text-white text-decoration-none hover-cyan">www.techgear.com</router-link> All rights reserved.
        </div>
        <div class="footer-legal d-flex flex-wrap justify-content-center gap-3 text-white-50">
          <router-link to="/terms" class="hover-white">ข้อกำหนดและเงื่อนไข</router-link>
          <span class="divider-pipe">|</span>
          <router-link to="/privacy" class="hover-white">นโยบายความเป็นส่วนตัว</router-link>
          <span class="divider-pipe">|</span>
          <a href="#" @click.prevent="comingSoon('การจัดการ Cookies')" class="hover-white">การจัดการ Cookies</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
const comingSoon = (title) => {
  alert(`ฟังก์ชัน "${title}" กำลังอยู่ในระหว่างพัฒนา จะเปิดให้บริการเร็วๆ นี้!`)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Kanit:wght@200;300;400;500;600;700&display=swap');
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css");

.techgear-footer {
  background-color: #060b13;
  color: #f8fafc;
  font-family: 'Kanit', sans-serif;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 0.9rem;
  position: relative;
  z-index: 10;
}

/* Column 1 Styling */
.footer-logo {
  font-size: 1.6rem;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  transition: transform 0.2s ease;
}

.footer-logo:hover {
  transform: scale(1.02);
}

.footer-logo-icon {
  font-size: 1.8rem;
  background: linear-gradient(135deg, #0ea5e9, #2563eb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.footer-logo-text {
  font-weight: 800;
  background: linear-gradient(135deg, #0ea5e9, #2563eb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.footer-desc {
  color: #94a3b8;
  font-size: 0.85rem;
  line-height: 1.6;
  text-align: justify;
}

/* Trust Badge Styling */
.custom-dbd-badge {
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  display: inline-flex;
  width: max-content;
  max-width: 100%;
}

.dbd-icon-box {
  font-size: 1.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dbd-icon-box i {
  background: linear-gradient(135deg, #0ea5e9, #2563eb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.dbd-text-box {
  display: flex;
  flex-direction: column;
}

.dbd-title {
  font-weight: 700;
  font-size: 0.85rem;
  color: #f8fafc;
}

.dbd-subtitle {
  font-size: 0.7rem;
  color: #64748b;
}

/* Column 2 & 3 Link List Styling */
.footer-title {
  color: #ffffff;
  font-weight: 700;
  position: relative;
  padding-bottom: 0.5rem;
}

.footer-title::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 30px;
  height: 2px;
  background: linear-gradient(90deg, #0ea5e9, #2563eb);
  border-radius: 2px;
}

.footer-menu li {
  margin-bottom: 0.75rem;
}

.footer-menu a {
  color: #94a3b8;
  text-decoration: none;
  font-weight: 400;
  font-size: 0.85rem;
  transition: all 0.2s ease;
  display: inline-block;
}

.footer-menu a:hover {
  color: #0ea5e9;
  transform: translateX(3px);
}

/* Column 4 Styling */
.contact-info {
  font-size: 0.85rem;
  line-height: 1.6;
}

.hover-white:hover {
  color: #ffffff !important;
}

/* Social Buttons */
.social-icons {
  display: flex;
  flex-wrap: wrap;
}

.social-icon-btn {
  width: 36px;
  height: 36px;
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  font-size: 1rem;
  transition: all 0.3s ease;
  text-decoration: none;
}

.social-icon-btn:hover {
  background-color: #0ea5e9;
  color: #ffffff;
  border-color: #0ea5e9;
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
}

/* Bottom Bar Styling */
.footer-divider {
  border-color: rgba(255, 255, 255, 0.08);
}

.footer-bottom {
  font-size: 0.8rem;
}

.hover-cyan:hover {
  color: #0ea5e9 !important;
}

.footer-legal a {
  color: #94a3b8;
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-legal a:hover {
  color: #0ea5e9;
}

.divider-pipe {
  color: rgba(255, 255, 255, 0.1);
}

@media (max-width: 768px) {
  .custom-dbd-badge {
    margin-bottom: 1.5rem;
  }
}
</style>
