<template>
  <div class="page-wrapper">
    <!-- Glowing Background -->
    <div class="glowing-bg">
      <div class="blob blob-cyan"></div>
      <div class="blob blob-blue"></div>
      <div class="blob blob-purple"></div>
    </div>

    <KakaNavbar />

    <div class="container py-5 content-container">
      <!-- Premium E-Commerce Carousel Banner -->
      <div class="carousel-section-container mb-4 animate-fade-in" @mouseenter="pauseAutoSlide" @mouseleave="startAutoSlide">
        <div class="carousel-inner-custom">
          <!-- Slide 1: May Day May Sale -->
          <div class="carousel-slide-custom" :class="{ 'active': currentSlide === 0 }">
            <div class="slide-content row align-items-center g-4 p-4 p-md-5">
              <div class="col-lg-7 col-md-12 text-start text-white slide-text-col">
                <div class="brand-badge-main mb-2">
                  <span class="badge bg-danger text-uppercase fw-bold px-3 py-1.5 fs-9"><i class="bi bi-cpu-fill me-1"></i> TECHGEAR STORES V2</span>
                </div>
                <h1 class="slide-title fw-black text-white text-uppercase tracking-tight leading-none mb-3">
                  MAY DAY <br/><span class="text-warning">MAY SALE!</span>
                </h1>
                <p class="slide-subtitle text-warning-subtle fw-semibold mb-4">
                  <i class="bi bi-calendar-event me-2"></i>3 May 2026 - 26 May 2026
                </p>
                <div class="d-flex align-items-center gap-3">
                  <router-link to="/computer-set" class="btn btn-warning px-4 py-2.5 rounded-pill fw-bold shadow-lg hover-scale">
                    Shop Now!
                  </router-link>
                  <span class="fs-9 text-white-50">*เงื่อนไขเป็นไปตามที่บริษัทกำหนด</span>
                </div>
              </div>
              <div class="col-lg-5 col-md-12 text-center position-relative slide-graphics-col d-none d-lg-block">
                <!-- SVG Graphic for Lenovo / iHAVECPU Style -->
                <svg viewBox="0 0 300 240" class="slide-svg-graphic">
                  <defs>
                    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stop-color="#f59e0b" />
                      <stop offset="100%" stop-color="#d97706" />
                    </linearGradient>
                    <linearGradient id="neonRedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stop-color="#ef4444" />
                      <stop offset="100%" stop-color="#b91c1c" />
                    </linearGradient>
                  </defs>
                  <!-- Neon Ring Background -->
                  <circle cx="150" cy="120" r="85" fill="none" stroke="#f59e0b" stroke-width="4" opacity="0.6" stroke-dasharray="8 4" class="anim-spin" />
                  <circle cx="150" cy="120" r="95" fill="none" stroke="#ef4444" stroke-width="2" opacity="0.4" />
                  
                  <!-- Stylized Monitor -->
                  <rect x="75" y="55" width="150" height="95" rx="8" fill="rgba(15, 23, 42, 0.9)" stroke="url(#goldGrad)" stroke-width="2.5" />
                  <rect x="80" y="60" width="140" height="85" rx="4" fill="#000" />
                  <!-- Monitor Screen Content -->
                  <path d="M90 100 L110 80 L130 110 L160 70 L210 120" fill="none" stroke="#ef4444" stroke-width="2" />
                  <circle cx="160" cy="70" r="4" fill="#f59e0b" />

                  <!-- Monitor Stand -->
                  <path d="M135 150 L165 150 L170 180 L130 180 Z" fill="url(#goldGrad)" opacity="0.9" />
                  
                  <!-- Stylized Laptop Overlay -->
                  <g transform="translate(180, 110) scale(0.65)">
                    <rect x="0" y="0" width="120" height="80" rx="6" fill="rgba(15, 23, 42, 0.9)" stroke="#ef4444" stroke-width="3" />
                    <rect x="5" y="5" width="110" height="70" rx="2" fill="#05050a" />
                    <path d="M -15 80 L 135 80 L 140 86 L -20 86 Z" fill="#888" />
                  </g>

                  <!-- Stylized Present Boxes -->
                  <g class="anim-float" transform="translate(30, 150) scale(0.8)">
                    <rect x="0" y="10" width="35" height="35" rx="4" fill="url(#neonRedGrad)" stroke="#f59e0b" stroke-width="1.5" />
                    <rect x="15" y="10" width="5" height="35" fill="#f59e0b" />
                    <rect x="0" y="25" width="35" height="5" fill="#f59e0b" />
                    <!-- Ribbon Bow -->
                    <path d="M 10 10 Q 17.5 0 17.5 10 Q 17.5 0 25 10 Z" fill="#f59e0b" />
                  </g>

                  <g class="anim-float-reverse" transform="translate(240, 40) scale(0.7)">
                    <rect x="0" y="10" width="35" height="35" rx="4" fill="url(#goldGrad)" stroke="#ef4444" stroke-width="1.5" />
                    <rect x="15" y="10" width="5" height="35" fill="#ef4444" />
                    <rect x="0" y="25" width="35" height="5" fill="#ef4444" />
                    <!-- Ribbon Bow -->
                    <path d="M 10 10 Q 17.5 0 17.5 10 Q 17.5 0 25 10 Z" fill="#ef4444" />
                  </g>

                  <!-- Sparkles/Stars -->
                  <path d="M 230 150 L 233 156 L 240 156 L 235 160 L 237 166 L 230 162 L 223 166 L 225 160 L 220 156 L 227 156 Z" fill="#f59e0b" class="anim-pulse" />
                  <path d="M 50 50 L 52 54 L 57 54 L 53 57 L 55 62 L 50 59 L 45 62 L 47 57 L 43 54 L 48 54 Z" fill="#fff" class="anim-pulse" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Slide 2: Custom Build PC -->
          <div class="carousel-slide-custom bg-slide-2" :class="{ 'active': currentSlide === 1 }">
            <div class="slide-content row align-items-center g-4 p-4 p-md-5">
              <div class="col-lg-7 col-md-12 text-start text-white slide-text-col">
                <div class="brand-badge-main mb-2">
                  <span class="badge bg-info text-uppercase fw-bold px-3 py-1.5 fs-9"><i class="bi bi-sliders me-1"></i> CUSTOM BUILD CONFIGURATOR</span>
                </div>
                <h1 class="slide-title fw-black text-white text-uppercase tracking-tight leading-none mb-3">
                  BUILD YOUR <br/><span class="text-cyan-glow">DREAM BEAST!</span>
                </h1>
                <p class="slide-subtitle text-cyan-subtle fw-semibold mb-4">
                  <i class="bi bi-cpu-fill me-2"></i>เลือกชิ้นส่วนที่ใช่ สเปกที่ชอบ ประกอบสำเร็จโดยมืออาชีพ
                </p>
                <div class="d-flex align-items-center gap-3">
                  <router-link to="/build" class="btn btn-info text-white px-4 py-2.5 rounded-pill fw-bold shadow-lg hover-scale">
                    จัดสเปกคอมเลย <i class="bi bi-chevron-right ms-1"></i>
                  </router-link>
                  <span class="fs-9 text-white-50">รับประกันอะไหล่แท้ 100%</span>
                </div>
              </div>
              <div class="col-lg-5 col-md-12 text-center position-relative slide-graphics-col d-none d-lg-block">
                <!-- SVG Custom PC Chassis Graphic -->
                <svg viewBox="0 0 300 240" class="slide-svg-graphic">
                  <defs>
                    <linearGradient id="neonCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stop-color="#0ea5e9" />
                      <stop offset="100%" stop-color="#2563eb" />
                    </linearGradient>
                    <linearGradient id="purpleGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stop-color="#a855f7" />
                      <stop offset="100%" stop-color="#6366f1" />
                    </linearGradient>
                  </defs>
                  <!-- Cyber Background Grid -->
                  <path d="M 0 40 L 300 40 M 0 80 L 300 80 M 0 120 L 300 120 M 0 160 L 300 160 M 0 200 L 300 200" fill="none" stroke="rgba(14,165,233,0.06)" stroke-width="1" />
                  <path d="M 50 0 L 50 240 M 100 0 L 100 240 M 150 0 L 150 240 M 200 0 L 200 240 M 250 0 L 250 240" fill="none" stroke="rgba(14,165,233,0.06)" stroke-width="1" />
                  
                  <!-- Outer Case Chassis -->
                  <rect x="80" y="30" width="140" height="180" rx="12" fill="rgba(15, 23, 42, 0.85)" stroke="url(#neonCyanGrad)" stroke-width="3" />
                  <rect x="88" y="38" width="124" height="164" rx="8" fill="none" stroke="rgba(255, 255, 255, 0.05)" />
                  
                  <!-- Inside Components -->
                  <!-- Liquid Cooler / CPU Water Block -->
                  <g transform="translate(130, 80)">
                    <rect x="0" y="0" width="40" height="40" rx="6" fill="rgba(6, 11, 19, 0.9)" stroke="url(#purpleGlow)" stroke-width="2" />
                    <circle cx="20" cy="20" r="12" fill="none" stroke="url(#neonCyanGrad)" stroke-width="1.5" class="anim-pulse" />
                  </g>
                  
                  <!-- RAM Slots -->
                  <g transform="translate(180, 65)">
                    <rect x="0" y="0" width="4" height="30" rx="1" fill="#0ea5e9" class="anim-pulse" />
                    <rect x="8" y="0" width="4" height="30" rx="1" fill="#0ea5e9" class="anim-pulse" style="animation-delay: 0.2s" />
                    <rect x="16" y="0" width="4" height="30" rx="1" fill="#a855f7" class="anim-pulse" style="animation-delay: 0.4s" />
                  </g>

                  <!-- Graphics Card (GPU) -->
                  <g transform="translate(92, 125)">
                    <rect x="0" y="0" width="105" height="28" rx="4" fill="rgba(255,255,255,0.05)" stroke="url(#neonCyanGrad)" stroke-width="1.5" />
                    <circle cx="30" cy="14" r="9" fill="none" stroke="#a855f7" stroke-width="1.5" class="anim-spin" />
                    <circle cx="75" cy="14" r="9" fill="none" stroke="#a855f7" stroke-width="1.5" class="anim-spin" />
                    <text x="10" y="-4" fill="#0ea5e9" font-size="6" font-family="Courier, monospace" font-weight="bold">RTX OVERDRIVE</text>
                  </g>

                  <!-- Front RGB Fans -->
                  <g transform="translate(70, 60)" opacity="0.3">
                    <circle cx="0" cy="0" r="16" fill="none" stroke="#0ea5e9" stroke-width="2" />
                    <circle cx="0" cy="65" r="16" fill="none" stroke="#a855f7" stroke-width="2" />
                  </g>
                </svg>
              </div>
            </div>
          </div>

          <!-- Slide 3: Gaming Gear Special -->
          <div class="carousel-slide-custom bg-slide-3" :class="{ 'active': currentSlide === 2 }">
            <div class="slide-content row align-items-center g-4 p-4 p-md-5">
              <div class="col-lg-7 col-md-12 text-start text-white slide-text-col">
                <div class="brand-badge-main mb-2">
                  <span class="badge bg-violet text-uppercase fw-bold px-3 py-1.5 fs-9"><i class="bi bi-gamepad me-1"></i> GAMING GEAR DEALS</span>
                </div>
                <h1 class="slide-title fw-black text-white text-uppercase tracking-tight leading-none mb-3">
                  PRO GAMING<br/><span class="text-pink-glow">GEAR DEALS!</span>
                </h1>
                <p class="slide-subtitle text-pink-subtle fw-semibold mb-4">
                  <i class="bi bi-lightning-charge-fill me-2"></i>อัปเกรดเซตเกมมิ่ง เมาส์ หูฟัง คีย์บอร์ด ลดแรงสูงสุด 50%
                </p>
                <div class="d-flex align-items-center gap-3">
                  <router-link to="/build" class="btn btn-pink px-4 py-2.5 rounded-pill fw-bold shadow-lg hover-scale">
                    เลือกชมเกมมิ่งเกียร์ <i class="bi bi-cart-fill ms-1"></i>
                  </router-link>
                  <span class="fs-9 text-white-50">สินค้าแบรนด์ดังระดับโลก</span>
                </div>
              </div>
              <div class="col-lg-5 col-md-12 text-center position-relative slide-graphics-col d-none d-lg-block">
                <!-- SVG Keyboard and Mouse Graphic -->
                <svg viewBox="0 0 300 240" class="slide-svg-graphic">
                  <defs>
                    <linearGradient id="neonPinkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stop-color="#ec4899" />
                      <stop offset="100%" stop-color="#8b5cf6" />
                    </linearGradient>
                  </defs>
                  
                  <!-- Glowing Background Circle -->
                  <circle cx="150" cy="120" r="75" fill="rgba(236, 72, 153, 0.05)" stroke="url(#neonPinkGrad)" stroke-width="1.5" stroke-dasharray="6 6" />

                  <!-- Stylized Gaming Keyboard -->
                  <g transform="translate(60, 95)">
                    <rect x="0" y="0" width="165" height="55" rx="8" fill="rgba(15, 23, 42, 0.9)" stroke="url(#neonPinkGrad)" stroke-width="2" />
                    <!-- Keyboard Keys -->
                    <rect x="6" y="6" width="12" height="10" rx="2" fill="#ec4899" opacity="0.8" />
                    <rect x="22" y="6" width="12" height="10" rx="2" fill="#8b5cf6" opacity="0.6" />
                    <rect x="38" y="6" width="12" height="10" rx="2" fill="rgba(255,255,255,0.1)" />
                    <rect x="54" y="6" width="12" height="10" rx="2" fill="rgba(255,255,255,0.1)" />
                    <rect x="70" y="6" width="12" height="10" rx="2" fill="rgba(255,255,255,0.1)" />
                    <rect x="86" y="6" width="12" height="10" rx="2" fill="rgba(255,255,255,0.1)" />
                    <rect x="102" y="6" width="12" height="10" rx="2" fill="rgba(255,255,255,0.1)" />
                    <rect x="118" y="6" width="12" height="10" rx="2" fill="rgba(255,255,255,0.1)" />
                    <rect x="134" y="6" width="24" height="10" rx="2" fill="rgba(255,255,255,0.1)" />
                    
                    <rect x="6" y="20" width="18" height="10" rx="2" fill="rgba(255,255,255,0.1)" />
                    <rect x="28" y="20" width="12" height="10" rx="2" fill="#ec4899" />
                    <rect x="44" y="20" width="12" height="10" rx="2" fill="#ec4899" />
                    <circle cx="66" cy="25" r="4" fill="#ec4899" />
                    <rect x="76" y="20" width="12" height="10" rx="2" fill="rgba(255,255,255,0.1)" />
                    <rect x="92" y="20" width="12" height="10" rx="2" fill="rgba(255,255,255,0.1)" />
                    <rect x="108" y="20" width="12" height="10" rx="2" fill="rgba(255,255,255,0.1)" />
                    <rect x="124" y="20" width="34" height="10" rx="2" fill="#8b5cf6" opacity="0.8" />
                    
                    <rect x="6" y="34" width="24" height="10" rx="2" fill="rgba(255,255,255,0.1)" />
                    <rect x="34" y="34" width="90" height="10" rx="2" fill="url(#neonPinkGrad)" />
                    <rect x="128" y="34" width="30" height="10" rx="2" fill="rgba(255,255,255,0.1)" />
                  </g>

                  <!-- Stylized Gaming Mouse -->
                  <g transform="translate(235, 100) scale(0.85)">
                    <rect x="0" y="0" width="36" height="60" rx="18" fill="rgba(15, 23, 42, 0.9)" stroke="url(#neonPinkGrad)" stroke-width="2" />
                    <line x1="18" y1="0" x2="18" y2="24" stroke="url(#neonPinkGrad)" stroke-width="1.5" />
                    <!-- Mouse Wheel -->
                    <rect x="16" y="10" width="4" height="8" rx="2" fill="#ec4899" class="anim-pulse" />
                    <!-- Glowing side stripes -->
                    <path d="M 3 35 Q 8 45 18 45 Q 28 45 33 35" fill="none" stroke="#8b5cf6" stroke-width="1" stroke-dasharray="2 2" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Carousel Navigation Controls -->
        <button class="carousel-arrow arrow-prev" @click="prevSlide">
          <i class="bi bi-chevron-left"></i>
        </button>
        <button class="carousel-arrow arrow-next" @click="nextSlide">
          <i class="bi bi-chevron-right"></i>
        </button>

        <!-- Carousel Pagination Dots -->
        <div class="dots-container">
          <span 
            v-for="index in 3" 
            :key="index" 
            class="dot-indicator" 
            :class="{ 'active': currentSlide === index - 1 }"
            @click="goToSlide(index - 1)"
          ></span>
        </div>
      </div>

      <!-- Promotional Sub-Banners Grid -->
      <div class="row g-4 mb-5 promo-grid-row">
        <!-- Card 1: สินค้าแยกชิ้น (Individual Parts) -->
        <div class="col-lg-4 col-md-12 col-12">
          <div class="promo-card bg-promo-1 h-100 position-relative overflow-hidden p-4 rounded-4 shadow-sm">
            <div class="promo-card-grid"></div>
            <div class="promo-card-content position-relative text-white text-start">
              <span class="badge bg-black bg-opacity-40 text-warning px-2.5 py-1 mb-2 fs-9 tracking-wider text-uppercase fw-bold">TECHGEAR STORE</span>
              <h3 class="fw-black h2 text-white mb-2 leading-tight">สินค้าแยกชิ้น</h3>
              <p class="fs-7 fw-bold text-white-50 mb-3"><i class="bi bi-truck me-1"></i> ส่งด่วนได้แล้ววันนี้!</p>
              
              <div class="mb-4 promo-tag-box">
                <div class="d-flex align-items-center gap-2 mb-3">
                  <span class="promo-tag bg-warning text-dark font-extrabold fs-9 px-2 py-0.5 rounded">จัดส่งฟรี!</span>
                  <span class="fs-9 text-white-80">สินค้ามูลค่ามากกว่า 5,000 บาท</span>
                </div>
                <div class="d-flex align-items-center gap-2">
                  <span class="promo-tag bg-white text-danger font-extrabold fs-9 px-2 py-0.5 rounded">ค่าจัดส่ง</span>
                  <span class="fs-9 text-white-80">สินค้าต่ำกว่า 5,000 บาท (เริ่ม 50 บาท)</span>
                </div>
              </div>

              <!-- Social Admin Contact Button -->
              <a href="https://line.me" target="_blank" class="btn btn-light rounded-pill btn-sm fw-bold px-3 py-1.5 d-inline-flex align-items-center gap-2 social-contact-btn hover-scale no-decoration">
                <i class="bi bi-line text-success fs-7"></i> ติดต่อแอดมิน <span class="badge bg-success text-white text-uppercase fs-10 px-1.5">@techgear</span>
              </a>
            </div>
            
            <!-- Graphic Overlay -->
            <div class="promo-graphic-svg position-absolute d-none d-sm-block" style="bottom: -20px; right: -20px; opacity: 0.15;">
              <svg viewBox="0 0 100 100" width="110" height="110">
                <rect x="20" y="20" width="60" height="60" rx="6" fill="none" stroke="#fff" stroke-width="4" />
                <circle cx="50" cy="50" r="18" fill="none" stroke="#fff" stroke-width="2" />
                <path d="M20 50 H80 M50 20 V80" stroke="#fff" stroke-width="1.5" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Card 2: ผ่อน 0% Notebook -->
        <div class="col-lg-4 col-md-12 col-12">
          <div class="promo-card bg-promo-2 h-100 position-relative overflow-hidden p-4 rounded-4 shadow-sm">
            <div class="promo-card-grid"></div>
            <div class="promo-card-content position-relative text-white text-start">
              <span class="badge bg-black bg-opacity-40 text-cyan-glow px-2.5 py-1 mb-2 fs-9 tracking-wider text-uppercase fw-bold">NOTEBOOK ZONE</span>
              <h3 class="fw-black h2 text-white mb-2 leading-tight">ผ่อน 0%</h3>
              <p class="fs-7 fw-bold text-white mb-3">NOTEBOOK รุ่นยอดนิยม</p>
              
              <div class="huge-accent-text mb-4">
                <span class="fs-8 fw-bold text-cyan-glow text-uppercase">ผ่อนนานสูงสุด</span>
                <div class="d-flex align-items-baseline gap-1 mt-0">
                  <span class="display-3 fw-black text-white lh-1">6</span>
                  <span class="h4 fw-bold text-white mb-0">เดือน</span>
                </div>
              </div>

              <!-- Brand Badges -->
              <div class="d-flex flex-wrap gap-1.5">
                <span class="badge bg-white bg-opacity-15 text-white fs-10 px-2.5 py-1 rounded">Lenovo</span>
                <span class="badge bg-white bg-opacity-15 text-white fs-10 px-2.5 py-1 rounded">GIGABYTE</span>
                <span class="badge bg-white bg-opacity-15 text-white fs-10 px-2.5 py-1 rounded">MSI</span>
                <span class="badge bg-white bg-opacity-15 text-white fs-10 px-2.5 py-1 rounded">HP</span>
              </div>
            </div>

            <!-- Laptop Graphic Overlay -->
            <div class="promo-graphic-svg position-absolute d-none d-sm-block" style="bottom: -15px; right: -15px; opacity: 0.12;">
              <svg viewBox="0 0 100 100" width="120" height="120">
                <rect x="15" y="25" width="70" height="48" rx="4" fill="none" stroke="#fff" stroke-width="4" />
                <path d="M 5 73 L 95 73 L 90 79 L 10 79 Z" fill="#fff" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Card 3: ช้อปง่าย สบายกระเป๋า -->
        <div class="col-lg-4 col-md-12 col-12">
          <div class="promo-card bg-promo-3 h-100 position-relative overflow-hidden p-4 rounded-4 shadow-sm">
            <div class="promo-card-grid"></div>
            <div class="promo-card-content position-relative text-white text-start">
              <span class="badge bg-black bg-opacity-40 text-warning px-2.5 py-1 mb-2 fs-9 tracking-wider text-uppercase fw-bold">EASY PAYMENT</span>
              <h3 class="fw-black h2 text-white mb-2 leading-tight">ช้อปง่าย สบายกระเป๋า</h3>
              <p class="fs-7 fw-bold text-white-50 mb-3"><i class="bi bi-wallet2 me-1"></i> บริการผ่อนชำระหลากหลายบัตรเครดิต</p>
              
              <div class="huge-accent-text mb-4">
                <span class="fs-8 fw-bold text-warning text-uppercase">ผ่อนนานสูงสุด</span>
                <div class="d-flex align-items-baseline gap-1 mt-0">
                  <span class="display-3 fw-black text-white lh-1">10</span>
                  <span class="h4 fw-bold text-white mb-0">เดือน</span>
                </div>
              </div>

              <!-- Domain link text matching standard banner -->
              <div class="promo-domain-link bg-black bg-opacity-40 rounded-pill d-inline-flex align-items-center" style="padding: 4px 14px;">
                <span class="bg-success rounded-circle anim-pulse" style="width: 6px; height: 6px; display: inline-block; background-color: #10b981 !important; box-shadow: 0 0 6px #10b981; margin-right: 10px;"></span>
                <span class="fs-9 font-monospace text-white-80">www.techgear.com</span>
              </div>
            </div>

            <!-- Card Graphic Overlay -->
            <div class="promo-graphic-svg position-absolute d-none d-sm-block" style="bottom: -10px; right: -15px; opacity: 0.15;">
              <svg viewBox="0 0 100 100" width="120" height="120">
                <rect x="15" y="30" width="70" height="44" rx="6" fill="none" stroke="#fff" stroke-width="4" />
                <rect x="15" y="40" width="70" height="8" fill="#fff" />
                <rect x="25" y="56" width="15" height="8" rx="1" fill="#fff" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Hero Section -->
      <div class="text-center mb-5 hero-section">
        <h1 class="fw-bold title-gradient mb-2 mt-2 animate-fade-in">คอมเซตสำเร็จรูปจัดสเปค & อุปกรณ์ไอทีระดับโปร</h1>
        <p class="text-muted-custom fs-6 max-w-2xl mx-auto animate-fade-in">
          สัมผัสขีดสุดของความแรงและดีไซน์ล้ำสมัยด้วยชุดคอมพิวเตอร์ประกอบสำเร็จรูปจัดสเปกโดยผู้เชี่ยวชาญ และชิ้นส่วนไอทีระดับเวิลด์คลาส
        </p>
      </div>

      <!-- Quick Action Buttons -->
      <div class="d-flex justify-content-center gap-3 mb-5 flex-wrap animate-fade-in">
        <router-link to="/computer-set" class="btn btn-action-gradient px-4 py-2.5 rounded-pill shadow-sm">
          <i class="bi bi-pc-display-horizontal me-2"></i> เลือกชมคอมพิวเตอร์เซตทั้งหมด
        </router-link>
        <router-link to="/build" class="btn btn-outline-gradient px-4 py-2.5 rounded-pill shadow-sm">
          <i class="bi bi-sliders me-2"></i> ออกแบบจัดสเปกคอมเอง
        </router-link>
      </div>

      <!-- SECTION 1: คอมพิวเตอร์เซตสำเร็จรูปจัดสเปกพิเศษ (TechGear Recommended PC Sets) -->
      <div class="section-container mb-5 animate-fade-in">
        <div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
          <div class="d-flex align-items-center gap-3">
            <div class="header-icon-circle"><i class="bi bi-fire text-danger"></i></div>
            <div>
              <h2 class="fw-bold text-dark h3 m-0">คอมพิวเตอร์เซตประกอบสำเร็จรูปสุดแรง</h2>
              <p class="text-muted-custom fs-8 m-0">รวมเซตคอมประกอบประกอบเข้าชุด ลงตัวทั้งความสวยงาม ประสิทธิภาพ และการรับประกัน</p>
            </div>
          </div>
          <router-link to="/computer-set" class="btn-view-all no-decoration">
            ดูทั้งหมด <i class="bi bi-chevron-right"></i>
          </router-link>
        </div>

        <!-- PC Sets Grid -->
        <div v-if="filteredPcSets.length > 0" class="row g-4">
          <div v-for="pcSet in filteredPcSets.slice(0, 3)" :key="pcSet.id" class="col-lg-4 col-md-6 col-12">
            <div class="glass-card pc-set-card h-100 d-flex flex-column justify-content-between">
              
              <!-- Blueprint visual chasis -->
              <div class="pc-set-graphic-container cursor-pointer animate-hover-pulse" @click="openReviews(pcSet.id, pcSet.name)" title="คลิกเพื่อดูรายละเอียดสินค้าและรีวิว">
                <div class="cyber-grid"></div>
                <span class="badge-set-tag" :class="'badge-' + pcSet.badgeType">{{ pcSet.badgeText }}</span>

                <!-- Inline Responsive SVG Blueprint of a Gaming PC (No external image files) -->
                <svg viewBox="0 0 200 220" class="pc-blueprint-svg">
                  <defs>
                    <linearGradient id="neonGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stop-color="#0ea5e9" stop-opacity="0.8" />
                      <stop offset="50%" stop-color="#2563eb" stop-opacity="0.8" />
                      <stop offset="100%" stop-color="#a855f7" stop-opacity="0.8" />
                    </linearGradient>
                    <linearGradient id="blueprintLines" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stop-color="rgba(14, 165, 233, 0.4)" />
                      <stop offset="100%" stop-color="rgba(37, 99, 235, 0.1)" />
                    </linearGradient>
                  </defs>
                  <path d="M 0,20 L 200,20 M 0,40 L 200,40 M 0,60 L 200,60 M 0,80 L 200,80 M 0,100 L 200,100 M 0,120 L 200,120 M 0,140 L 200,140 M 0,160 L 200,160 M 0,180 L 200,180 M 0,200 L 200,200" fill="none" stroke="rgba(14,165,233,0.04)" stroke-width="1" />
                  <path d="M 20,0 L 20,220 M 40,0 L 40,220 M 60,0 L 60,220 M 80,0 L 80,220 M 100,0 L 100,220 M 120,0 L 120,220 M 140,0 L 140,220 M 160,0 L 160,220 M 180,0 L 180,220" fill="none" stroke="rgba(14,165,233,0.04)" stroke-width="1" />
                  <rect x="40" y="30" width="120" height="160" rx="10" fill="url(#blueprintLines)" stroke="url(#neonGlow)" stroke-width="2" />
                  <rect x="48" y="38" width="104" height="134" rx="6" fill="none" stroke="rgba(14, 165, 233, 0.2)" stroke-width="1" stroke-dasharray="4 2" />
                  <rect x="54" y="44" width="70" height="85" rx="3" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1" />
                  <g transform="translate(89, 65)">
                    <rect x="-20" y="-20" width="40" height="40" rx="5" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1" />
                    <circle cx="0" cy="0" r="14" fill="none" stroke="url(#neonGlow)" stroke-width="1.5" />
                    <path d="M -10,-10 L 10,10 M -10,10 L 10,-10" stroke="rgba(255,255,255,0.3)" stroke-width="1" />
                  </g>
                  <g transform="translate(116, 48)">
                    <rect x="0" y="0" width="3" height="22" rx="1" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="1" />
                    <rect x="5" y="0" width="3" height="22" rx="1" fill="none" stroke="#2563eb" stroke-width="1" />
                    <rect x="10" y="0" width="3" height="22" rx="1" fill="none" stroke="#0ea5e9" stroke-width="1" />
                  </g>
                  <g transform="translate(50, 105)">
                    <rect x="0" y="0" width="85" height="22" rx="4" fill="rgba(6, 11, 19, 0.6)" stroke="url(#neonGlow)" stroke-width="1.5" />
                    <text x="8" y="14" fill="#ffffff" font-size="6" font-family="'Courier New', monospace" font-weight="bold" opacity="0.8">GEFORCE RTX</text>
                    <circle cx="58" cy="11" r="7" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="1" />
                    <circle cx="74" cy="11" r="7" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="1" />
                  </g>
                  <rect x="40" y="150" width="120" height="40" rx="4" fill="rgba(6, 11, 19, 0.4)" stroke="rgba(14, 165, 233, 0.3)" stroke-width="1" />
                  <path d="M 40,150 L 160,150" stroke="rgba(14, 165, 233, 0.5)" stroke-width="1" />
                  <line x1="55" y1="160" x2="55" y2="180" stroke="rgba(255,255,255,0.15)" stroke-width="1" />
                  <line x1="60" y1="160" x2="60" y2="180" stroke="rgba(255,255,255,0.15)" stroke-width="1" />
                  <line x1="65" y1="160" x2="65" y2="180" stroke="rgba(255,255,255,0.15)" stroke-width="1" />
                  <line x1="70" y1="160" x2="70" y2="180" stroke="rgba(255,255,255,0.15)" stroke-width="1" />
                  <text x="90" y="174" fill="rgba(255,255,255,0.2)" font-size="8" font-family="'Kanit', sans-serif" font-weight="bold">TechGear</text>
                </svg>
              </div>

              <!-- PC Set Body Details -->
              <div class="card-body-custom p-4 d-flex flex-column justify-content-between flex-grow-1">
                <div>
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <div class="platform-chip d-flex align-items-center gap-1" :class="pcSet.cpuBrand === 'Intel' ? 'bg-intel-subtle' : 'bg-amd-subtle'">
                      <i class="bi bi-cpu-fill" :class="pcSet.cpuBrand === 'Intel' ? 'text-intel' : 'text-amd'"></i>
                      <span :class="pcSet.cpuBrand === 'Intel' ? 'text-intel' : 'text-amd'">{{ pcSet.cpuBrand }} Platform</span>
                    </div>
                    <span class="warranty-badge fs-9 fw-semibold"><i class="bi bi-shield-check me-1"></i> ประกัน 3 ปีเต็ม</span>
                  </div>

                  <!-- Reviews & Ratings Badge -->
                  <div class="d-flex align-items-center gap-2 mb-2 cursor-pointer hover-scale-small" @click="openReviews(pcSet.id, pcSet.name)" title="คลิกเพื่อดูรีวิว">
                    <div class="rating-badge-small d-inline-flex align-items-center gap-1 bg-warning-subtle text-warning px-2.5 py-0.5 rounded-pill fs-9 fw-bold">
                      <i class="bi bi-star-fill text-warning animate-pulse"></i>
                      <span>{{ reviewsStats[pcSet.id]?.avgRating || '5.0' }}</span>
                    </div>
                    <span class="text-secondary fs-9 fw-semibold">({{ reviewsStats[pcSet.id]?.totalReviews || 0 }} รีวิว)</span>
                  </div>

                  <h4 class="card-title-custom fw-bold text-dark mb-1 cursor-pointer hover-text-cyan-neon transition-colors" @click="openReviews(pcSet.id, pcSet.name)" title="คลิกเพื่อดูรายละเอียดสินค้าและรีวิว">{{ pcSet.name }}</h4>
                  <p class="set-purpose-text text-muted-custom fs-8 mb-3">{{ pcSet.purpose }}</p>

                  <!-- Expandable PC parts checklist -->
                  <div class="specs-accordion mb-4">
                    <div 
                      class="specs-accordion-header py-2 px-2 border border-dashed d-flex justify-content-between align-items-center" 
                      :class="{ 'is-expanded': activeSpecsViews[pcSet.id] }"
                      @click="toggleSpecs(pcSet.id)"
                    >
                      <span class="fs-8 fw-semibold text-secondary d-flex align-items-center gap-2">
                        <i class="bi bi-hdd-network-fill text-cyan"></i> คลิกดูอุปกรณ์ในชุดคอมเซ็ต
                      </span>
                      <i class="bi" :class="activeSpecsViews[pcSet.id] ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
                    </div>
                    
                    <transition name="accordion-slide">
                      <div v-show="activeSpecsViews[pcSet.id]" class="specs-list-container my-2 py-2 px-3 bg-light rounded-3">
                        <div v-for="part in pcSet.partsList" :key="part.label" class="spec-part-row d-flex align-items-center justify-content-between py-1.5 fs-9">
                          <span class="text-secondary">{{ part.label }}:</span>
                          <span class="text-dark fw-semibold text-truncate ms-2" style="max-width: 170px;" :title="part.name">{{ part.name }}</span>
                        </div>
                      </div>
                    </transition>
                  </div>
                </div>

                <div class="mt-auto">
                  <div class="d-flex justify-content-between align-items-baseline mb-3">
                    <div>
                      <span v-if="(pcSet.original_price || pcSet.originalPrice || 0) > (pcSet.price || 0)" class="fs-9 text-muted d-block text-decoration-line-through">฿{{ (pcSet.original_price || pcSet.originalPrice || 0).toLocaleString('th-TH') }}</span>
                      <span class="h4 fw-bold text-danger">฿{{ (pcSet.price || 0).toLocaleString('th-TH') }}</span>
                    </div>
                    <span v-if="(pcSet.original_price || pcSet.originalPrice || 0) > (pcSet.price || 0)" class="badge bg-danger-subtle text-danger rounded-pill px-2 py-1 fs-9 fw-bold">
                      ประหยัด ฿{{ ((pcSet.original_price || pcSet.originalPrice || 0) - (pcSet.price || 0)).toLocaleString('th-TH') }}
                    </span>
                  </div>

                  <div class="d-grid gap-2">
                    <button class="btn btn-action-cyan w-100 rounded-pill fw-bold" @click="addSetToCart(pcSet)">
                      <i class="bi bi-cart-plus-fill me-2"></i>หยิบใส่ตะกร้าทั้งชุด
                    </button>
                    <button class="btn btn-action-outline w-100 rounded-pill fw-bold" @click="customizeSetInBuilder(pcSet)">
                      <i class="bi bi-sliders me-2"></i>ปรับแต่งต่อ (จัดสเปกเอง)
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
        <div v-else class="text-center py-5 glass-card border-glow-cyan max-w-2xl mx-auto p-5">
          <i class="bi bi-search fs-1 text-muted d-block mb-3"></i>
          <h4 class="fw-bold">ไม่พบชุดคอมพิวเตอร์เซตที่ค้นหา</h4>
          <p class="text-muted-custom">ลองค้นหาด้วยคำอื่น หรือล้างตัวกรองสินค้า</p>
        </div>
      </div>

      <!-- SECTION 2: อุปกรณ์จัดสเปคคอมพิวเตอร์ยอดนิยม (PC Parts/Products Showcase) -->
      <div id="it-parts-showcase" class="section-container mb-5 animate-fade-in">
        <div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
          <div class="d-flex align-items-center gap-3">
            <div class="header-icon-circle"><i class="bi bi-cpu-fill text-cyan"></i></div>
            <div>
              <h2 class="fw-bold text-dark h3 m-0">อุปกรณ์ไอทีและอะไหล่จัดสเปกยอดฮิต</h2>
              <p class="text-muted-custom fs-8 m-0">ชิ้นส่วนคอมพิวเตอร์ระดับพรีเมียมผ่านการคัดสรรสเปกและประสิทธิภาพการใช้งานจริง</p>
            </div>
          </div>
          <router-link to="/build" class="btn-view-all no-decoration">
            จัดสเปกทั้งหมด <i class="bi bi-chevron-right"></i>
          </router-link>
        </div>

        <!-- Horizontal Category Flex Container -->
        <div class="category-tabs-wrapper mb-4 overflow-x-auto pb-2" @wheel="handleWheelScroll">
          <div class="d-flex gap-2">
            <button 
              class="btn-category-pill"
              :class="{ 'active': activePartCategory === 'all' }"
              @click="selectLocalCategory('all')"
            >
              <i class="bi bi-grid-fill me-1"></i> ทั้งหมด
            </button>
            <button 
              v-for="cat in partCategories" 
              :key="cat.id" 
              class="btn-category-pill"
              :class="{ 'active': activePartCategory === cat.id }"
              @click="selectLocalCategory(cat.id)"
            >
              <i :class="cat.icon" class="me-1"></i> {{ cat.name }}
            </button>
          </div>
        </div>

        <!-- PC Parts Grid -->
        <div v-if="filteredPcParts.length > 0" class="row g-3">
          <div v-for="prod in filteredPcParts.slice(0, 8)" :key="prod.id" class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12">
            <div class="product-item-card h-100 d-flex flex-column justify-content-between p-3 border rounded-4 bg-white shadow-sm hover-grow">
              <div>
                <!-- SVG Blueprint icon placeholder -->
                <div class="blueprint-img-placeholder mb-3 cursor-pointer" @click="openReviews(prod.id, prod.name)" title="คลิกเพื่อดูรายละเอียดสินค้าและรีวิว">
                  <div class="blueprint-inner d-flex flex-column align-items-center justify-content-center">
                    <i :class="getCategoryIconClass(prod.category)" class="blueprint-icon mb-1"></i>
                    <span class="blueprint-text">{{ prod.brand }} TECH</span>
                  </div>
                  <span class="badge-brand-item bg-dark text-white">{{ prod.brand }}</span>
                </div>

                <div class="d-flex justify-content-between align-items-center mb-1">
                  <span class="text-danger fw-bold fs-9 text-uppercase">{{ prod.category }}</span>
                  <span v-if="prod.socket" class="badge-socket bg-light text-secondary fs-9">{{ prod.socket }}</span>
                </div>

                <div class="mb-2 d-flex align-items-center gap-2 flex-wrap">
                  <span class="badge bg-success-subtle text-success fs-9 rounded-pill px-2.5 py-0.5 fw-semibold d-inline-flex align-items-center gap-1">
                    <i class="bi bi-check-circle-fill"></i> มีสินค้าพร้อมส่ง
                  </span>
                  <span class="rating-badge-small d-inline-flex align-items-center gap-1 cursor-pointer bg-warning-subtle text-warning px-2.5 py-0.5 rounded-pill fs-10 fw-bold hover-scale-small" @click="openReviews(prod.id, prod.name)" title="คลิกเพื่อดูรีวิว">
                    <i class="bi bi-star-fill text-warning"></i>
                    <span>{{ reviewsStats[prod.id]?.avgRating || '5.0' }}</span>
                    <span class="text-secondary fw-semibold">({{ reviewsStats[prod.id]?.totalReviews || 0 }})</span>
                  </span>
                </div>

                <h5 class="product-card-title fw-bold text-dark fs-8 mb-2 text-truncate-2 cursor-pointer hover-text-cyan-neon transition-colors" :title="`${prod.name} (คลิกเพื่อดูรายละเอียดและรีวิว)`" @click="openReviews(prod.id, prod.name)">{{ prod.name }}</h5>
                <p class="product-card-specs text-muted fs-9 mb-3 text-truncate-2">{{ prod.specs }}</p>
              </div>

              <div class="d-flex justify-content-between align-items-center pt-2 border-top">
                <span class="fw-bold price-text fs-7 text-danger">฿{{ parseFloat(prod.price).toLocaleString('th-TH') }}</span>
                <div class="d-flex gap-1">
                  <button 
                    @click="buyPartProduct(prod)" 
                    class="btn btn-sm btn-gradient-sm-circle d-flex align-items-center justify-content-center"
                    title="หยิบใส่ตะกร้า"
                  >
                    <i class="bi bi-cart-fill fs-8"></i>
                  </button>
                  <button 
                    @click="goToBuilderWithPart(prod)" 
                    class="btn btn-sm btn-outline-secondary-circle d-flex align-items-center justify-content-center"
                    title="ไปหน้าจัดสเปกคอม"
                  >
                    <i class="bi bi-sliders fs-8"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-5 glass-card border-glow-cyan max-w-2xl mx-auto p-4">
          <i class="bi bi-inbox-fill fs-1 text-muted d-block mb-2"></i>
          <h4 class="fw-bold">ไม่พบชิ้นส่วนคอมพิวเตอร์ที่ค้นหา</h4>
          <p class="text-muted-custom">ลองค้นหาด้วยคำอื่น หรือล้างตัวกรองสินค้า</p>
        </div>
      </div>

      <!-- Admin Control Panel Link -->
      <div v-if="isLoggedIn && userRole === 'admin'" class="row mb-5 animate-fade-in">
        <div class="col-12">
          <div class="glass-card p-4 border-glow-cyan">
            <div class="d-flex align-items-center mb-3">
              <div class="header-icon-circle me-3"><i class="bi bi-gear-fill text-cyan"></i></div>
              <h4 class="fw-bold m-0 text-dark">ระบบจัดการและเชื่อมต่อคลังข้อมูลหลังร้าน</h4>
            </div>
            <p class="text-muted-custom mb-3 lh-lg">
              แคตตาล็อกหน้าบ้านนี้เชื่อมต่อโดยตรงกับฐานข้อมูล <span class="text-cyan-glow fw-bold">MySQL</span> ของเซิร์ฟเวอร์หลังบ้าน <span class="text-cyan-glow fw-bold">Express API</span> คุณสามารถเข้าสู่หน้าระบบจัดการข้อมูลสินค้าทั่วไป หรือจัดชุดคอมเซ็ตหลังร้านเพื่อทำการอัปเดตแบบเรียลไทม์ได้ทันที!
            </p>
            <div class="d-flex flex-wrap gap-2 mt-2">
              <router-link to="/product" class="btn-navigate-crud">
                <i class="bi bi-tools me-1"></i> จัดการข้อมูลสินค้าหลังร้าน
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- SECTION 3: ข่าวสารวงการ IT ล่าสุด (Latest IT News Portal Preview) -->
      <div class="section-container mb-5 animate-fade-in">
        <div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
          <div class="d-flex align-items-center gap-3">
            <div class="header-icon-circle"><i class="bi bi-newspaper text-cyan"></i></div>
            <div>
              <h2 class="fw-bold text-dark h3 m-0">ข่าวสารวงการ IT ล่าสุด</h2>
              <p class="text-muted-custom fs-8 m-0">อัปเดตเทรนด์เทคโนโลยี นวัตกรรมชิปประมวลผล และข่าวเด่นในแวดวงคอมพิวเตอร์</p>
            </div>
          </div>
          <router-link to="/apipost" class="btn-view-all no-decoration">
            ดูบทความทั้งหมด <i class="bi bi-chevron-right"></i>
          </router-link>
        </div>

        <div class="row g-4">
          <div v-for="news in latestNews" :key="news.id" class="col-lg-4 col-md-6 col-12">
            <div class="glass-card news-card h-100 p-0 rounded-4 overflow-hidden d-flex flex-column hover-scale border">
              <div class="news-image-box position-relative overflow-hidden" style="height: 180px;">
                <img :src="news.image" :alt="news.title" class="w-100 h-100 object-fit-cover transition-transform duration-500">
                <span class="position-absolute top-0 start-0 m-3 px-3 py-1 bg-white bg-opacity-95 rounded-pill shadow-sm fs-9 fw-bold text-dark">
                  {{ news.categoryName }}
                </span>
              </div>
              <div class="p-4 d-flex flex-column flex-grow-1 text-start">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <span class="badge bg-light text-secondary border px-2.5 py-1 fs-9 rounded"><i class="bi bi-calendar3 me-1"></i> {{ news.date }}</span>
                  <span class="fs-9 text-muted fw-semibold"><i class="bi bi-clock-fill me-1"></i> {{ news.readTime }}</span>
                </div>
                <h5 class="fw-bold text-dark mb-2 fs-8 leading-normal text-line-clamp-2">{{ news.title }}</h5>
                <p class="text-muted fs-9 mb-4 text-line-clamp-2">{{ news.summary }}</p>
                <div class="mt-auto pt-3 border-top d-flex justify-content-end">
                  <router-link to="/apipost" class="btn-read-more text-cyan-glow fw-bold text-decoration-none fs-8 d-flex align-items-center gap-1">
                    อ่านข่าวเต็ม <i class="bi bi-chevron-right fs-9"></i>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <KakaFooter />

    <!-- Premium Toast Alert -->
    <div class="toast-container position-fixed bottom-0 end-0 p-4" style="z-index: 1080;">
      <transition name="toast-fade">
        <div v-if="toast.show" class="toast-custom d-flex align-items-center p-3 border-0 rounded-4 shadow-lg" :class="'toast-' + toast.type" role="alert">
          <div class="toast-icon-wrapper me-3">
            <i class="bi bi-check-circle-fill text-success fs-4" :class="{ 'text-danger bi-exclamation-triangle-fill': toast.type === 'danger' }"></i>
          </div>
          <div class="toast-content me-3">
            <div class="toast-title fw-bold text-dark fs-7">{{ toast.title }}</div>
            <div class="toast-msg text-muted fs-8">{{ toast.message }}</div>
          </div>
          <button @click="toast.show = false" type="button" class="btn-close-custom ms-auto shadow-none">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
      </transition>
    </div>

    <!-- Premium Reviews Modal -->
    <KakaReviewsModal
      :show="showReviewsModal"
      :product-id="activeProductId"
      :product-name="activeProductName"
      @close="showReviewsModal = false"
      @review-submitted="updateLocalReviewStats"
    />
  </div>
</template>

<script setup>
// 1. นำเข้าฟังก์ชันพื้นฐานจาก Vue.js สำหรับจัดการ State, Lifecycle และ Computed Properties
import { ref, onMounted, onUnmounted, reactive, computed, watch } from 'vue'
// 2. นำเข้าโมดูลสำหรับจัดการเส้นทาง (Routing) ของแอปพลิเคชัน
import { useRouter, useRoute } from 'vue-router'
// 3. นำเข้า axios สำหรับใช้ยิง API ไปยังเซิร์ฟเวอร์หลังบ้าน (Backend)
import axios from 'axios'

// นำเข้าคอมโพเนนต์ย่อยที่ใช้ร่วมในหน้าหลัก (Navbar, Footer, Modal รีวิว)
import KakaNavbar from './KakaNavbar.vue'
import KakaFooter from './KakaFooter.vue'
import KakaReviewsModal from './KakaReviewsModal.vue'

// 4. นำเข้าภาพประกอบสำหรับส่วนแสดงข่าวสารไอที (IT News)
import aiNewsImg from '../assets/tech_ai_news.png'
import hardwareNewsImg from '../assets/tech_hardware.png'
import cybersecNewsImg from '../assets/tech_cybersec.png'

const latestNews = [
  {
    id: 1,
    categoryName: 'AI & นวัตกรรม',
    title: 'NVIDIA เปิดตัวสถาปัตยกรรม Blackwell ปฏิวัติวงการ AI และการประมวลผลขนาดใหญ่',
    summary: 'เจาะลึกชิปสถาปัตยกรรม Blackwell ยุคใหม่จาก NVIDIA ที่มีทรานซิสเตอร์สูงถึง 2.08 แสนล้านตัว มอบประสิทธิภาพการคำนวณและการเทรน AI สูงขึ้นกว่าเดิมถึง 30 เท่า',
    image: aiNewsImg,
    date: '20 พ.ค. 2026',
    readTime: '5 นาที'
  },
  {
    id: 2,
    categoryName: 'ฮาร์ดแวร์',
    title: 'เจาะลึกชิปประมวลผล Apple M4 ซีรีส์ พลังรัน AI เหนือระดับ บนโน้ตบุ๊กรุ่นใหม่ล่าสุด',
    summary: 'วิเคราะห์โครงสร้างชิป Apple M4, M4 Pro และ M4 Max ที่มาพร้อมสถาปัตยกรรม 3 นาโนเมตรรุ่นที่ 2 และ Neural Engine ความเร็วสูงถึง 38 ล้านล้านครั้งต่อวินาที',
    image: hardwareNewsImg,
    date: '18 พ.ค. 2026',
    readTime: '4 นาที'
  },
  {
    id: 5,
    categoryName: 'ความปลอดภัยไซเบอร์',
    title: 'แจ้งเตือนด่วน! พบช่องโหว่ระลอกใหม่ Zero-Day บนเว็บเบราว์เซอร์ยอดนิยม แนะนำให้อัปเดตทันที',
    summary: 'หน่วยงานความมั่นคงปลอดภัยไซเบอร์ระดับชาติออกโรงแจ้งเตือนช่องโหว่ความปลอดภัยระดับวิกฤตที่เปิดช่องให้แฮกเกอร์โจมตีคอมพิวเตอร์ระยะไกล',
    image: cybersecNewsImg,
    date: '10 พ.ค. 2026',
    readTime: '3 นาที'
  }
]

const router = useRouter() // ตัวแปรสำหรับสั่งเปลี่ยนหน้าเว็บ

// ตัวแปร Reactive สำหรับเก็บข้อมูลสินค้าคอมพิวเตอร์เซตและชิ้นส่วนคอมพิวเตอร์ที่ดึงมาจาก API
const pcSets = ref([]) // เก็บรายการคอมประกอบสำเร็จรูป
const pcParts = ref([]) // เก็บรายการชิ้นส่วนคอมพิวเตอร์

// ตัวแปรควบคุมระบบสไลเดอร์แบนเนอร์ (Carousel Banner)
const currentSlide = ref(0) // ตำแหน่งสไลด์ปัจจุบัน (เริ่มต้นที่ 0)
const totalSlides = 3 // จำนวนสไลด์ทั้งหมดที่มีในระบบ
let autoSlideInterval = null // ตัวแปรเก็บ ID ของ Interval เพื่อใช้สั่งหยุดหรือเล่นสไลด์อัตโนมัติ

const startAutoSlide = () => {
  if (autoSlideInterval) clearInterval(autoSlideInterval)
  autoSlideInterval = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % totalSlides
  }, 5000)
}

const pauseAutoSlide = () => {
  if (autoSlideInterval) {
    clearInterval(autoSlideInterval)
    autoSlideInterval = null
  }
}

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % totalSlides
}

const prevSlide = () => {
  currentSlide.value = (currentSlide.value + totalSlides - 1) % totalSlides
}

const goToSlide = (idx) => {
  currentSlide.value = idx
}

const route = useRoute() // ตัวแปรสำหรับอ่านข้อมูล URL ปัจจุบัน (เช่น Query Parameter)

// State สำหรับจัดการระบบค้นหาและกรองสินค้า
const searchQuery = ref('') // คำค้นหาที่ผู้ใช้พิมพ์
const selectedCategory = ref('') // หมวดหมู่สินค้าที่ถูกเลือกผ่าน Navbar (ส่งมาเป็น URL Query)
const activePartCategory = ref('all') // หมวดหมู่สินค้าที่ถูกเลือกผ่านแถบเมนูในหน้าปัจจุบัน (Local Tab)

// Handle mouse scroll wheel to scroll horizontally
const handleWheelScroll = (event) => {
  if (event.deltaY !== 0) {
    event.preventDefault();
    const container = event.currentTarget;
    container.scrollLeft += event.deltaY;
  }
}

// Function to select local category and clear the navbar category query param
const selectLocalCategory = (catId) => {
  activePartCategory.value = catId
  if (route.query.category) {
    router.push({ path: '/', query: { category: undefined } })
  }
}

// Function to smoothly scroll to products showcase
const scrollToProducts = () => {
  setTimeout(() => {
    const el = document.getElementById('it-parts-showcase')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, 150)
}

// Watch for URL category query parameter to filter & scroll
watch(() => route.query.category, (newCat) => {
  if (newCat !== undefined) {
    selectedCategory.value = newCat || ''
    if (newCat) {
      activePartCategory.value = 'all' // Clear conflicting local tabs
      scrollToProducts()
    }
  } else {
    selectedCategory.value = ''
  }
}, { immediate: true })

// State จัดการข้อมูลผู้ใช้งาน
const isLoggedIn = ref(false) // สถานะการเข้าสู่ระบบ
const userRole = ref('user') // บทบาทของผู้ใช้ (เช่น 'user' หรือ 'admin')

// State สำหรับจัดเก็บสถานะการเปิด/ปิดดูรายละเอียดสเปกของแต่ละคอมเซต (Accordion)
const activeSpecsViews = ref({}) // เก็บค่า boolean โดยใช้ ID ของคอมเซตเป็น Key

// Part categories list
const partCategories = [
  { id: 'cpu', name: 'หน่วยประมวลผล (CPU)', icon: 'bi-cpu' },
  { id: 'motherboard', name: 'เมนบอร์ด (Mainboard)', icon: 'bi-layout-three-columns' },
  { id: 'gpu', name: 'การ์ดจอ (GPU)', icon: 'bi-gpu-card' },
  { id: 'ram', name: 'แรม (RAM)', icon: 'bi-memory' },
  { id: 'ssd', name: 'โซลิดสเตต (SSD)', icon: 'bi-device-ssd' },
  { id: 'm2', name: 'การ์ด M.2 (M.2 NVMe)', icon: 'bi-lightning-charge' },
  { id: 'psu', name: 'พาวเวอร์ซัพพลาย (PSU)', icon: 'bi-plug' },
  { id: 'case', name: 'เคสคอมพิวเตอร์ (Case)', icon: 'bi-box' },
  { id: 'monitor', name: 'จอมอนิเตอร์ (Monitor)', icon: 'bi-display' }
]

const checkLoginStatus = () => {
  isLoggedIn.value = localStorage.getItem('isLoggedIn') === 'true'
  userRole.value = localStorage.getItem('userRole') || 'user'
}

// Toast Notifications state
const toast = reactive({
  show: false,
  title: '',
  message: '',
  type: 'success'
})

const showToast = (title, message, type = 'success') => {
  toast.title = title
  toast.message = message
  toast.type = type
  toast.show = true
  setTimeout(() => {
    toast.show = false
  }, 4000)
}

// Reviews Modal State
const showReviewsModal = ref(false)
const activeProductId = ref('')
const activeProductName = ref('')
const reviewsStats = ref({})

const openReviews = (id, name) => {
  activeProductId.value = id
  activeProductName.value = name
  showReviewsModal.value = true
}

const updateLocalReviewStats = (event) => {
  reviewsStats.value[event.productId] = {
    avgRating: event.avgRating,
    totalReviews: event.totalReviews
  }
}

// ฟังก์ชันสำหรับดึงข้อมูลสินค้าทั้งหมดจากฐานข้อมูลผ่าน API (Fetch Data)
const fetchData = async () => {
  try {
    // ใช้ Promise.all เพื่อดึงข้อมูล 3 API พร้อมกัน ช่วยลดระยะเวลาในการรอข้อมูล
    const [setsRes, partsRes, statsRes] = await Promise.all([
      axios.get('/api/pc-sets'),
      axios.get('/api/pc-parts'),
      axios.get('/api/reviews-stats')
    ])
    pcSets.value = setsRes.data
    pcParts.value = partsRes.data
    if (statsRes.data && statsRes.data.success) {
      reviewsStats.value = statsRes.data.stats || {}
    }
  } catch (error) {
    console.error('Failed to fetch data from API:', error)
    showToast(
      'ดึงข้อมูลล้มเหลว',
      'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์หลังบ้านเพื่อดึงข้อมูลอุปกรณ์ได้',
      'danger'
    )
  }
}

// Add Set to Cart
const addSetToCart = (pcSet) => {
  showToast(
    'เพิ่มลงตะกร้าแล้ว!',
    `ได้ทำการหยิบชุดคอมเซ็ต ${pcSet.name} มูลค่า ฿${parseFloat(pcSet.price).toLocaleString('th-TH')} ใส่ตะกร้าแล้ว`,
    'success'
  )
  window.dispatchEvent(new CustomEvent('add-to-cart', { 
    detail: {
      name: `[PC Set] ${pcSet.name}`,
      price: pcSet.price
    } 
  }))
}

// Buy Part Product
const buyPartProduct = (prod) => {
  showToast(
    'เพิ่มลงตะกร้าแล้ว!',
    `ได้ทำการหยิบ ${prod.name} มูลค่า ฿${parseFloat(prod.price).toLocaleString('th-TH')} ใส่ตะกร้าแล้ว`,
    'success'
  )
  window.dispatchEvent(new CustomEvent('add-to-cart', { 
    detail: {
      name: prod.name,
      price: prod.price
    } 
  }))
}

// Go to Spec Builder with Part
const goToBuilderWithPart = (prod) => {
  const customBuildData = {
    cpu: null,
    motherboard: null,
    gpu: null,
    ram: null,
    hdd: null,
    ssd: null,
    m2: null,
    psu: null,
    case: null,
    liquid_cooler: null,
    cpu_cooler: null,
    case_fan: null,
    mouse: null,
    keyboard: null,
    monitor: null,
    accessories: null,
    gaming_gear: null,
    software: null
  }

  // Check saved build
  const savedBuild = localStorage.getItem('myCustomBuild')
  if (savedBuild) {
    try {
      Object.assign(customBuildData, JSON.parse(savedBuild))
    } catch (e) {
      console.error(e)
    }
  }

  // Slotted category mapping
  let slotKey = prod.category
  if (slotKey === 'liquid_cooler') slotKey = 'liquid_cooler'
  else if (slotKey === 'cpu_cooler') slotKey = 'cpu_cooler'
  else if (slotKey === 'case_fan') slotKey = 'case_fan'

  if (slotKey in customBuildData) {
    customBuildData[slotKey] = prod
  }

  localStorage.setItem('myCustomBuild', JSON.stringify(customBuildData))
  showToast(
    'เพิ่มชิ้นส่วนเข้าหน้าจัดสเปก!',
    `เพิ่ม ${prod.name} เข้าสเปกคอมแล้ว กำลังพาคุณไปยังหน้าจัดสเปก...`,
    'success'
  )

  setTimeout(() => {
    router.push('/build')
  }, 1000)
}

// Customize PC Set inside Custom Builder (KakaBuild.vue)
const customizeSetInBuilder = (pcSet) => {
  const customBuildData = {
    cpu: null,
    motherboard: null,
    gpu: null,
    ram: null,
    hdd: null,
    ssd: null,
    m2: null,
    psu: null,
    case: null,
    liquid_cooler: null,
    cpu_cooler: null,
    case_fan: null,
    mouse: null,
    keyboard: null,
    monitor: null,
    accessories: null,
    gaming_gear: null,
    software: null
  }

  if (pcSet.partsList) {
    pcSet.partsList.forEach(part => {
      let slotKey = ''
      if (part.id.startsWith('cpu')) slotKey = 'cpu'
      else if (part.id.startsWith('mb')) slotKey = 'motherboard'
      else if (part.id.startsWith('gpu')) slotKey = 'gpu'
      else if (part.id.startsWith('ram')) slotKey = 'ram'
      else if (part.id.startsWith('m2')) slotKey = 'm2'
      else if (part.id.startsWith('psu')) slotKey = 'psu'
      else if (part.id.startsWith('case')) slotKey = 'case'
      else if (part.id.startsWith('lc')) slotKey = 'liquid_cooler'
      else if (part.id.startsWith('cc')) slotKey = 'cpu_cooler'

      if (slotKey) {
        const dbPart = pcParts.value.find(p => p.id === part.id)
        const partPrice = dbPart ? dbPart.price : 0
        const partSpecs = dbPart ? dbPart.specs : (part.name + ' อุปกรณ์คุณภาพสูงรับประกันศูนย์ไทย')

        customBuildData[slotKey] = {
          id: part.id,
          category: slotKey === 'motherboard' ? 'motherboard' : (slotKey === 'liquid_cooler' ? 'liquid_cooler' : (slotKey === 'cpu_cooler' ? 'cpu_cooler' : slotKey)),
          brand: part.name.split(' ')[0] || '',
          name: part.name,
          price: partPrice,
          specs: partSpecs
        }
      }
    })
  }

  localStorage.setItem('myCustomBuild', JSON.stringify(customBuildData))
  showToast(
    'กำลังเปิดเครื่องมือจัดสเปก...',
    `นำเข้าสเปกคอมจากเซต ${pcSet.name} เรียบร้อยแล้ว สามารถเข้าปรับแต่งชิ้นส่วนต่อได้ทันที!`,
    'success'
  )
  
  setTimeout(() => {
    router.push('/build')
  }, 1000)
}

// Accordion Toggle
const toggleSpecs = (id) => {
  activeSpecsViews.value[id] = !activeSpecsViews.value[id]
}

// Helpers for Category classes and icons
const getCategoryIconClass = (catId = '') => {
  const found = partCategories.find(c => c.id === catId)
  return found ? found.icon : 'bi-cpu-fill'
}

// Search and Category filters handlers
const handleSearchQuery = (event) => {
  searchQuery.value = event.detail
}

const handleCategoryFilter = (event) => {
  selectedCategory.value = event.detail
}

// Computed Property สำหรับกรองรายการคอมพิวเตอร์เซตที่ใช้แสดงผลบนหน้าจอ
const filteredPcSets = computed(() => {
  return pcSets.value.filter(s => {
    const q = searchQuery.value.toLowerCase() // ทำคำค้นหาให้เป็นพิมพ์เล็กทั้งหมดเพื่อไม่ให้สนใจตัวพิมพ์เล็กใหญ่
    // ตรวจสอบว่าชื่อหรือรายละเอียดของเซตมีคำค้นหาอยู่หรือไม่
    const matchesSearch = s.name.toLowerCase().includes(q) || 
                          s.purpose.toLowerCase().includes(q)
    return matchesSearch
  })
})

// Filtered PC Parts logic
const filteredPcParts = computed(() => {
  return pcParts.value.filter(p => {
    // 1. Search filter
    const q = searchQuery.value.toLowerCase()
    const matchesSearch = p.name.toLowerCase().includes(q) || 
                          (p.specs && p.specs.toLowerCase().includes(q)) ||
                          p.brand.toLowerCase().includes(q)
    
    // 2. Local tabs category filter
    const matchesLocalCategory = activePartCategory.value === 'all' || 
                                 p.category === activePartCategory.value

    // 3. Navbar global category filter
    let matchesNavbarCategory = true
    if (selectedCategory.value) {
      const navCat = selectedCategory.value.toLowerCase()
      if (navCat === 'cpu') {
        matchesNavbarCategory = p.category === 'cpu'
      } else if (navCat === 'graphics card') {
        matchesNavbarCategory = p.category === 'gpu'
      } else if (navCat === 'memory') {
        matchesNavbarCategory = p.category === 'ram'
      } else if (navCat === 'storage') {
        matchesNavbarCategory = ['ssd', 'hdd', 'm2'].includes(p.category)
      } else if (navCat === 'motherboard') {
        matchesNavbarCategory = p.category === 'motherboard'
      } else if (navCat === 'monitor') {
        matchesNavbarCategory = p.category === 'monitor'
      } else if (navCat === 'psu') {
        matchesNavbarCategory = p.category === 'psu'
      } else if (navCat === 'case') {
        matchesNavbarCategory = p.category === 'case'
      } else if (navCat === 'cooling') {
        matchesNavbarCategory = ['liquid_cooler', 'cpu_cooler', 'case_fan'].includes(p.category)
      }
    }

    return matchesSearch && matchesLocalCategory && matchesNavbarCategory
  })
})

onMounted(() => {
  checkLoginStatus()
  window.addEventListener('auth-change', checkLoginStatus)
  fetchData()
  window.addEventListener('search-query', handleSearchQuery)
  window.addEventListener('category-filter', handleCategoryFilter)
  startAutoSlide()
})

onUnmounted(() => {
  window.removeEventListener('auth-change', checkLoginStatus)
  window.removeEventListener('search-query', handleSearchQuery)
  window.removeEventListener('category-filter', handleCategoryFilter)
  pauseAutoSlide()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Kanit:wght@200;300;400;500;600;700;800;900&display=swap');
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css");

.page-wrapper {
  position: relative;
  min-height: 100vh;
  font-family: 'Kanit', sans-serif;
  overflow-x: hidden;
  background: #f8fafc;
  color: #1e293b;
}


/* Glowing background elements for premium feel */
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
  opacity: 0.035;
  mix-blend-mode: multiply;
  animation: float-blob-sets 22s infinite alternate ease-in-out;
}

.blob-cyan {
  top: 10%;
  left: 10%;
  width: 450px;
  height: 450px;
  background: #0ea5e9;
}

.blob-blue {
  bottom: 10%;
  right: 10%;
  width: 500px;
  height: 500px;
  background: #2563eb;
  animation-delay: -5s;
}

.blob-purple {
  top: 45%;
  left: 45%;
  width: 350px;
  height: 350px;
  background: #8b5cf6;
  animation-delay: -10s;
}

@keyframes float-blob-sets {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(50px, -70px) scale(1.15); }
  100% { transform: translate(-40px, 50px) scale(0.9); }
}

.content-container {
  position: relative;
  z-index: 1;
}

.hero-section {
  padding: 1.5rem 0 0.5rem 0;
}

.badge-premium {
  background: #e0f2fe;
  border: 1px solid #bae6fd;
  color: #0ea5e9;
  border-radius: 2rem;
  font-weight: 700;
  font-size: 0.75rem;
  letter-spacing: 1.5px;
  text-transform: uppercase;
}

.fw-bold {
  font-weight: 900;
}

.title-gradient {
  background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 50%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 2.6rem;
  letter-spacing: -0.5px;
}

.text-muted-custom {
  color: #64748b;
  font-weight: 400;
  line-height: 1.6;
}

.text-cyan-glow {
  color: #0ea5e9;
}

.max-w-2xl {
  max-width: 42rem;
}

/* Glassmorphic Cards */
.glass-card {
  background: #ffffff !important;
  border: 1px solid #e2e8f0 !important;
  border-radius: 1.5rem !important;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.03) !important;
}

.pc-set-card:hover {
  transform: translateY(-8px);
  border-color: #bae6fd !important;
  box-shadow: 0 20px 40px rgba(14, 165, 233, 0.08) !important;
}

/* PC Set Blueprint Chassis graphic styles */
.pc-set-graphic-container {
  height: 220px;
  background: #060b13;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.cyber-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
  background-size: 15px 15px;
}

.badge-set-tag {
  position: absolute;
  top: 1.2rem;
  left: 1.2rem;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.35rem 0.85rem;
  border-radius: 0.5rem;
  color: white;
  z-index: 2;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.badge-hot {
  background: linear-gradient(135deg, #f59e0b, #ef4444);
  box-shadow: 0 4px 10px rgba(239, 68, 68, 0.3);
}

.badge-popular {
  background: linear-gradient(135deg, #10b981, #059669);
  box-shadow: 0 4px 10px rgba(16, 185, 129, 0.3);
}

.badge-special {
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  box-shadow: 0 4px 10px rgba(99, 102, 241, 0.3);
}

.badge-premium {
  background: linear-gradient(135deg, #0ea5e9, #2563eb);
  box-shadow: 0 4px 10px rgba(14, 165, 233, 0.3);
}

.badge-overkill {
  background: linear-gradient(135deg, #d946ef, #a855f7);
  box-shadow: 0 4px 10px rgba(217, 70, 239, 0.3);
}

.pc-blueprint-svg {
  width: 100%;
  height: 100%;
  max-height: 200px;
  z-index: 1;
}

.platform-chip {
  padding: 0.25rem 0.65rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
}

.bg-intel-subtle {
  background-color: #e0f2fe;
}
.text-intel {
  color: #0068b5;
}

.bg-amd-subtle {
  background-color: #ffedd5;
}
.text-amd {
  color: #f26522;
}

.warranty-badge {
  color: #10b981;
  background-color: #ecfdf5;
  border: 1px solid #a7f3d0;
  padding: 0.2rem 0.5rem;
  border-radius: 0.5rem;
}

.card-title-custom {
  font-weight: 800;
  color: #1e293b;
  font-size: 1.15rem;
  line-height: 1.4;
}

.set-purpose-text {
  min-height: 2.5rem;
  line-height: 1.5;
  font-size: 0.85rem;
}

/* Accordion parts dropdown */
.specs-accordion-header {
  cursor: pointer;
  background-color: transparent;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  border-radius: 0.5rem;
  border-color: rgba(226, 232, 240, 0.8) !important;
}

.specs-accordion-header:hover {
  background-color: rgba(14, 165, 233, 0.04);
}

.specs-accordion-header.is-expanded {
  background-color: rgba(14, 165, 233, 0.06);
  border-color: rgba(14, 165, 233, 0.3) !important;
}

.specs-accordion-header span {
  transition: color 0.3s ease;
}

.specs-accordion-header:hover span,
.specs-accordion-header.is-expanded span {
  color: #0ea5e9 !important;
}

.chevron-icon {
  font-size: 0.85rem;
  color: #64748b;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.specs-list-container {
  background: rgba(248, 250, 252, 0.65);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 1rem;
  box-shadow: inset 0 2px 8px rgba(15, 23, 42, 0.02), 0 4px 12px rgba(15, 23, 42, 0.01);
  transition: all 0.3s ease;
}

.spec-part-row {
  border-bottom: 1px solid rgba(241, 245, 249, 0.8);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  border-radius: 0.5rem;
  padding: 0.5rem 0.35rem;
}

.spec-part-row:last-child {
  border-bottom: none;
}

.spec-part-row:hover {
  background-color: rgba(255, 255, 255, 0.9);
  padding-left: 0.6rem;
  transform: translateX(2px);
}

.text-cyan {
  color: #0ea5e9 !important;
}

.border-dashed {
  border-style: dashed !important;
}

/* Accordion Animation */
.accordion-slide-enter-active,
.accordion-slide-leave-active {
  transition: all 0.3s ease-out;
  max-height: 350px;
  overflow: hidden;
}

.accordion-slide-enter-from,
.accordion-slide-leave-to {
  max-height: 0;
  opacity: 0;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

/* Action Buttons */
.btn-action-cyan {
  background: linear-gradient(135deg, #0ea5e9, #2563eb);
  color: white;
  border: none;
  padding: 0.65rem;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(14, 165, 233, 0.2);
}

.btn-action-cyan:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(14, 165, 233, 0.3);
  background: linear-gradient(135deg, #0284c7, #1d4ed8);
  color: white;
}

.btn-action-outline {
  background: transparent;
  border: 1px solid #bae6fd;
  color: #0ea5e9;
  padding: 0.6rem;
  font-size: 0.85rem;
  transition: all 0.3s ease;
}

.btn-action-outline:hover {
  background: #f0f9ff;
  border-color: #0ea5e9;
  color: #0284c7;
  transform: translateY(-1px);
}

/* Flex Category horizontal pills */
.category-tabs-wrapper::-webkit-scrollbar {
  height: 5px;
}
.category-tabs-wrapper::-webkit-scrollbar-track {
  background: transparent;
}
.category-tabs-wrapper::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.btn-category-pill {
  background: white;
  border: 1px solid #cbd5e1;
  color: #475569;
  font-weight: 600;
  border-radius: 50px;
  padding: 0.5rem 1.25rem;
  font-size: 0.85rem;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  white-space: nowrap;
  cursor: pointer;
}

.btn-category-pill:hover {
  color: #0ea5e9;
  border-color: #0ea5e9;
  transform: translateY(-1px);
}

.btn-category-pill.active {
  background: linear-gradient(135deg, #0ea5e9, #2563eb);
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.25);
}

/* PC Parts cards stylings */
.product-item-card {
  transition: all 0.3s ease;
  border-color: #e2e8f0 !important;
}

.product-item-card:hover {
  border-color: #bae6fd !important;
  box-shadow: 0 15px 35px rgba(14, 165, 233, 0.08) !important;
}

.hover-grow:hover {
  transform: translateY(-5px);
}

.blueprint-img-placeholder {
  height: 140px;
  background-color: #0c1424;
  border-radius: 1rem;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.blueprint-inner {
  z-index: 1;
}

.blueprint-icon {
  font-size: 2.2rem;
  color: #0ea5e9;
  filter: drop-shadow(0 0 8px rgba(14, 165, 233, 0.4));
}

.blueprint-text {
  font-size: 0.6rem;
  color: rgba(255, 255, 255, 0.25);
  font-family: 'Courier New', monospace;
  font-weight: bold;
  letter-spacing: 1px;
}

.badge-brand-item {
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.2rem 0.5rem;
  border-radius: 0.35rem;
}

.badge-socket {
  background-color: #f1f5f9;
  border: 1px solid #e2e8f0;
  padding: 0.15rem 0.4rem;
  border-radius: 0.35rem;
}

.product-card-title {
  min-height: 2.4rem;
  font-size: 0.95rem;
  line-height: 1.35;
}

.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-card-specs {
  font-size: 0.8rem;
  line-height: 1.4;
  min-height: 2.2rem;
}

/* Action Circle Buttons */
.btn-gradient-sm-circle {
  background: linear-gradient(135deg, #0ea5e9, #2563eb);
  color: white;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.btn-gradient-sm-circle:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 10px rgba(14, 165, 233, 0.3);
}

.btn-outline-secondary-circle {
  background: transparent;
  border: 1px solid #cbd5e1;
  color: #475569;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.btn-outline-secondary-circle:hover {
  background: #f1f5f9;
  color: #0f172a;
  border-color: #475569;
  transform: scale(1.1);
}

.price-text {
  color: #0284c7;
  font-weight: 800;
}

.btn-view-all {
  color: #0ea5e9;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}
.btn-view-all:hover {
  color: #0284c7;
  transform: translateX(3px);
}

/* Navigate Crud Link Button */
.btn-navigate-crud {
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  color: #0ea5e9;
  border-radius: 0.75rem;
  padding: 0.5rem 1.25rem;
  font-weight: 600;
  font-size: 0.85rem;
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
}

.btn-navigate-crud:hover {
  background: #e0f2fe;
  color: #0284c7;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.1);
}

.header-icon-circle {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #f0f9ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.btn-action-gradient {
  background: linear-gradient(135deg, #0ea5e9, #2563eb);
  color: white !important;
  border: none;
  font-weight: 600;
  transition: all 0.3s ease;
  text-decoration: none;
}

.btn-action-gradient:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(14, 165, 233, 0.3);
}

.btn-outline-gradient {
  background: transparent;
  border: 1.5px solid #0ea5e9;
  color: #0ea5e9 !important;
  font-weight: 600;
  transition: all 0.3s ease;
  text-decoration: none;
}

.btn-outline-gradient:hover {
  background: #f0f9ff;
  color: #0284c7 !important;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(14, 165, 233, 0.1);
}

/* Toast Premium Styling */
.toast-custom {
  background: rgba(255, 255, 255, 0.85) !important;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.4) !important;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15) !important;
  max-width: 380px;
  width: 100%;
}

.toast-success {
  border-left: 5px solid #10b981 !important;
}

.toast-danger {
  border-left: 5px solid #ef4444 !important;
}

.toast-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.toast-content {
  flex-grow: 1;
}

.toast-title {
  color: #0f172a;
}

.toast-msg {
  color: #475569;
}

.btn-close-custom {
  background: transparent;
  border: none;
  color: #64748b;
  font-size: 0.85rem;
  transition: color 0.3s ease;
  cursor: pointer;
}

.btn-close-custom:hover {
  color: #0f172a;
}

/* Animations */
.animate-fade-in {
  animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-fade-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

/* ==========================================
   Carousel Banner & Promotional Cards Scoped Styles
   ========================================== */
.carousel-section-container {
  position: relative;
  border-radius: 1.5rem;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(15, 23, 42, 0.1);
  background: #09090b;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.carousel-inner-custom {
  position: relative;
  width: 100%;
  height: auto;
  min-height: 280px;
}

.carousel-slide-custom {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), 
              visibility 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 1;
  background: linear-gradient(135deg, #180303 0%, #450a0a 50%, #7f1d1d 100%);
  display: flex;
  align-items: center;
}

.carousel-slide-custom.active {
  position: relative;
  opacity: 1;
  visibility: visible;
  z-index: 2;
}

.bg-slide-2 {
  background: linear-gradient(135deg, #020617 0%, #0b1528 50%, #1e1b4b 100%) !important;
}

.bg-slide-3 {
  background: linear-gradient(135deg, #090514 0%, #1e113a 50%, #3b0764 100%) !important;
}

/* Animations for slide inner text */
.carousel-slide-custom.active .slide-title {
  animation: slideTextIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: 0.1s;
}

.carousel-slide-custom.active .slide-subtitle {
  animation: slideTextIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: 0.25s;
}

.carousel-slide-custom.active .btn,
.carousel-slide-custom.active .slide-text-col span {
  animation: slideTextIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: 0.4s;
}

.carousel-slide-custom.active .slide-svg-graphic {
  animation: slideGraphicIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: 0.2s;
}

@keyframes slideTextIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideGraphicIn {
  from { opacity: 0; transform: scale(0.9) translateX(30px); }
  to { opacity: 1; transform: scale(1) translateX(0); }
}

.slide-title {
  font-family: 'Kanit', sans-serif;
  font-size: 3rem;
  letter-spacing: -1px;
  line-height: 0.95;
  opacity: 0;
}

.fw-black {
  font-weight: 900;
}

.slide-subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.7);
  opacity: 0;
}

.btn-warning {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  border: none;
  color: #1e1b4b !important;
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
  transition: all 0.3s ease;
}

.btn-warning:hover {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4);
}

.btn-info {
  background: linear-gradient(135deg, #0ea5e9, #2563eb);
  border: none;
  color: white !important;
  box-shadow: 0 4px 15px rgba(14, 165, 233, 0.3);
  transition: all 0.3s ease;
}

.btn-info:hover {
  background: linear-gradient(135deg, #0284c7, #1d4ed8);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(14, 165, 233, 0.4);
}

.btn-pink {
  background: linear-gradient(135deg, #ec4899, #db2777);
  border: none;
  color: white !important;
  box-shadow: 0 4px 15px rgba(236, 72, 153, 0.3);
  transition: all 0.3s ease;
}

.btn-pink:hover {
  background: linear-gradient(135deg, #db2777, #be185d);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(236, 72, 153, 0.4);
}

.text-warning-subtle {
  color: #fef08a;
}

.text-cyan-subtle {
  color: #bae6fd;
}

.text-pink-subtle {
  color: #fbcfe8;
}

.text-pink-glow {
  color: #f472b6;
  text-shadow: 0 0 15px rgba(236, 72, 153, 0.5);
}

.bg-violet {
  background: linear-gradient(135deg, #7c3aed, #6d28d9);
  box-shadow: 0 4px 10px rgba(124, 58, 237, 0.3);
}

/* Carousel side navigation controls */
.carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  opacity: 0;
}

.carousel-section-container:hover .carousel-arrow {
  opacity: 1;
}

.carousel-arrow:hover {
  background: rgba(15, 23, 42, 0.85);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-50%) scale(1.05);
}

.arrow-prev {
  left: 1.5rem;
}

.arrow-next {
  right: 1.5rem;
}

/* Slider indicators/dots */
.dots-container {
  position: absolute;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
  z-index: 10;
}

.dot-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.dot-indicator.active {
  width: 28px;
  border-radius: 6px;
  background: white;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
}

/* SVG graphics styling & micro-animations */
.slide-svg-graphic {
  width: 100%;
  max-width: 320px;
  height: auto;
  overflow: visible;
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3));
}

.anim-float {
  animation: svgFloat 4s ease-in-out infinite alternate;
}

.anim-float-reverse {
  animation: svgFloatReverse 4s ease-in-out infinite alternate;
}

.anim-spin {
  animation: svgSpin 25s linear infinite;
  transform-origin: 150px 120px;
}

/* If local spin elements inside groups need specific origins */
g.anim-spin circle {
  transform-origin: center;
  animation: svgSpin 12s linear infinite;
}

.anim-pulse {
  animation: svgPulse 2s ease-in-out infinite alternate;
}

@keyframes svgFloat {
  0% { transform: translateY(0); }
  100% { transform: translateY(-10px); }
}

@keyframes svgFloatReverse {
  0% { transform: translateY(-10px); }
  100% { transform: translateY(0); }
}

@keyframes svgSpin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes svgPulse {
  0% { opacity: 0.4; filter: brightness(0.8); }
  100% { opacity: 1; filter: brightness(1.2) drop-shadow(0 0 8px currentColor); }
}

/* ==========================================
   Promotional Sub-Banners Styles
   ========================================== */
.promo-card {
  position: relative;
  background: #18181b;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.03);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  min-height: 210px;
}

.promo-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
  border-color: rgba(255, 255, 255, 0.15);
}

.bg-promo-1 {
  background: linear-gradient(135deg, #1e0a0a 0%, #580d0d 50%, #991b1b 100%) !important;
}

.bg-promo-2 {
  background: linear-gradient(135deg, #090924 0%, #1e1b4b 50%, #312e81 100%) !important;
}

.bg-promo-3 {
  background: linear-gradient(135deg, #1e1202 0%, #78350f 50%, #b45309 100%) !important;
}

/* Inner card styling details */
.promo-card-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
  background-size: 16px 16px;
  pointer-events: none;
}

.huge-accent-text {
  margin-top: -0.25rem;
}

.promo-tag-box {
  line-height: 1.4;
}

.promo-tag {
  font-weight: 850;
  letter-spacing: 0.5px;
}

.text-white-80 {
  color: rgba(255, 255, 255, 0.85);
}

.text-white-50 {
  color: rgba(255, 255, 255, 0.5);
}

.fs-10 {
  font-size: 0.65rem;
}

.social-contact-btn {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  border: none;
}

.social-contact-btn:hover {
  background-color: #fff !important;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
}

.promo-domain-link {
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.font-extrabold {
  font-weight: 800;
}

.no-decoration {
  text-decoration: none !important;
}

.hover-scale {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease;
}

.hover-scale:hover {
  transform: scale(1.03);
}

.tracking-tight {
  letter-spacing: -1.5px;
}

/* Responsiveness adjustments for smaller devices */
@media (max-width: 991px) {
  .slide-title {
    font-size: 2.2rem;
  }
  .carousel-inner-custom {
    min-height: 250px;
  }
}

@media (max-width: 575px) {
  .slide-title {
    font-size: 1.8rem;
  }
  .slide-subtitle {
    font-size: 0.9rem;
  }
  .carousel-inner-custom {
    min-height: 220px;
  }
  .carousel-arrow {
    width: 38px;
    height: 38px;
    font-size: 1rem;
  }
  .arrow-prev {
    left: 0.5rem;
  }
  .arrow-next {
    right: 0.5rem;
  }
}

/* Latest IT News Section styles */
.news-card {
  background: #ffffff;
  border-radius: 1.5rem !important;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.03) !important;
  border-color: #e2e8f0 !important;
}

.news-card:hover {
  transform: translateY(-6px);
  border-color: #bae6fd !important;
  box-shadow: 0 20px 40px rgba(14, 165, 233, 0.08) !important;
}

.news-image-box img {
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.news-card:hover .news-image-box img {
  transform: scale(1.04);
}

.btn-read-more {
  color: #0ea5e9 !important;
  transition: all 0.2s ease;
}

.btn-read-more:hover {
  color: #2563eb !important;
  transform: translateX(3px);
}

.text-line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.6; /* Generous line-height so Thai vowels and tone marks never cut off */
}

/* Reviews and rating style overrides */
.cursor-pointer {
  cursor: pointer !important;
  user-select: none;
}
.hover-scale-small {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.hover-scale-small:hover {
  transform: scale(1.02);
  opacity: 0.9;
}
.rating-badge-small {
  background: rgba(245, 158, 11, 0.15) !important;
  color: #d97706 !important;
}
.animate-pulse {
  animation: pulse-glow 2s infinite;
}
@keyframes pulse-glow {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.15);
  }
}
.hover-text-cyan-neon {
  transition: color 0.3s ease, text-shadow 0.3s ease;
}
.hover-text-cyan-neon:hover {
  color: #0ea5e9 !important;
  text-shadow: 0 0 8px rgba(14, 165, 233, 0.3);
}
.animate-hover-pulse {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.animate-hover-pulse:hover {
  transform: translateY(-2px) scale(1.005);
  box-shadow: 0 12px 30px rgba(14, 165, 233, 0.15) !important;
}
</style>