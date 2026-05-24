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

    <div class="container py-5 content-container print-content">
      <!-- Breadcrumb navigation (Hidden in Print) -->
      <nav aria-label="breadcrumb" class="mb-4 animate-fade-in no-print">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><router-link to="/" class="text-decoration-none">หน้าแรก</router-link></li>
          <li class="breadcrumb-item active" aria-current="page">จัดสเปกคอม</li>
        </ol>
      </nav>

      <!-- Page Header (Hidden in Print, except stylized title) -->
      <div class="mb-4 no-print animate-fade-in">
        <h1 class="h2 fw-bold text-dark mb-1">จัดสเปกคอม เล่นเกม ทำงาน ประกอบคอมสุดเทพโดย TechGear ราคาดี</h1>
        <p class="text-muted-custom fs-8 lh-base">
          เรื่องประกอบคอมพิวเตอร์ ทำคอมพิวเตอร์สำหรับเล่นเกม ทำงาน เครื่องไม่อืด ทำงานได้เร็ว ไว้ใจเราที่ <span class="fw-semibold text-primary-custom">TechGear</span> เรารับจัดสเปกคอมแรง ๆ ทำคอมประกอบให้เหมาะสมแต่ละผู้ใช้งาน จัดสรรคอมพิวเตอร์ประกอบชุด และจัดสเปกคอมเล่นเกม อยากได้อุปกรณ์ครบชุด ซีพียูตัวแรง ฟังก์ชันครบครัน ต้องมาที่ <span class="fw-semibold text-primary-custom">TechGear</span> นอกจากนี้เรายังมีเมนบอร์ด การ์ดจอรุ่นท็อป ให้เลือกช้อปกันด้วย มีทีมผู้เชี่ยวชาญให้คำแนะนำ
        </p>
      </div>

      <!-- AI PC Builder Assistant (Glassmorphism & Neon Glow) -->
      <div class="card bg-cyber-assistant border-glow-pink p-4 rounded-4 mb-4 no-print animate-fade-in position-relative">
        <div class="assistant-neon-bg"></div>
        <div class="row align-items-center g-3 position-relative" style="z-index: 10;">
          <!-- AI Icon / Avatar -->
          <div class="col-auto">
            <div class="ai-avatar-glow">
              <i class="bi bi-robot text-cyan fs-4"></i>
            </div>
          </div>
          <!-- Title & Tagline -->
          <div class="col">
            <h4 class="h5 fw-bold text-white mb-1 d-flex align-items-center gap-2">
              <span>ระบบช่วยจัดสเปกคอมพิวเตอร์อัจฉริยะด้วย AI</span>
              <span class="badge bg-danger fs-10 px-2.5 py-1 rounded-pill animate-pulse">BETA</span>
            </h4>
            <p class="text-white-80 fs-8 m-0">เพียงระบุงบประมาณและจุดประสงค์การใช้งาน AI จะช่วยกรองชิ้นส่วนที่เข้ากันได้และดีที่สุดให้ทันที!</p>
          </div>
          <!-- Inputs / Form -->
          <div class="col-xl-6 col-lg-7 col-12">
            <div class="row g-2 align-items-center justify-content-lg-end">
              <!-- Budget Input -->
              <div class="col-sm-5 col-12">
                <label class="form-label text-white-80 fs-9 fw-semibold mb-1">งบประมาณที่ต้องการ</label>
                
                <!-- Custom Budget Input -->
                <div v-if="isCustomBudget" class="position-relative w-100">
                  <input 
                    v-model.number="customBudgetVal"
                    type="number"
                    min="1000"
                    max="1000000"
                    step="1000"
                    class="form-control dark-select w-100 rounded-3 py-2 shadow-none ps-5 pe-5" 
                    placeholder="ระบุงบประมาณ (บาท)..."
                    @input="updateCustomBudget"
                  >
                  <i class="bi bi-pencil-square position-absolute top-50 start-0 translate-middle-y ms-3 text-cyan"></i>
                  <button 
                    type="button" 
                    class="btn btn-sm text-cyan position-absolute top-50 end-0 translate-middle-y me-2 border-0 bg-transparent p-0 d-flex align-items-center justify-content-center"
                    style="width: 24px; height: 24px;"
                    title="กลับไปเลือกราคาปกติ"
                    @click="disableCustomBudget"
                  >
                    <i class="bi bi-arrow-left-right fs-7"></i>
                  </button>
                </div>

                <!-- Regular Dropdown Selection -->
                <div v-else class="dropdown custom-dropdown w-100 position-relative">
                  <button 
                    class="btn btn-outline-light dropdown-toggle w-100 dark-select text-start d-flex align-items-center justify-content-between rounded-3 py-2 shadow-none" 
                    type="button" 
                    @click="toggleBudgetDropdown"
                    @blur="closeBudgetDropdown"
                  >
                    <span class="d-flex align-items-center gap-2">
                      <i :class="getBudgetIcon(aiBudget)" class="text-cyan"></i>
                      <span>{{ getBudgetLabel(aiBudget) }}</span>
                    </span>
                  </button>
                  <ul class="dropdown-menu dropdown-menu-dark w-100 custom-dropdown-menu rounded-3 p-1 position-absolute end-0" :class="{ show: showBudgetDropdown }" style="background-color: #0f172a; border: 1px solid rgba(255, 255, 255, 0.15); z-index: 1000;">
                    <li>
                      <button type="button" class="dropdown-item d-flex align-items-center gap-2 py-2 text-white" @mousedown="selectBudget('15000')">
                        <i class="bi bi-wallet2 text-cyan"></i>
                        <span>฿15,000 (ราคาประหยัด)</span>
                      </button>
                    </li>
                    <li>
                      <button type="button" class="dropdown-item d-flex align-items-center gap-2 py-2 text-white" @mousedown="selectBudget('30000')">
                        <i class="bi bi-cash-coin text-cyan"></i>
                        <span>฿30,000 (ระดับเริ่มต้น-กลาง)</span>
                      </button>
                    </li>
                    <li>
                      <button type="button" class="dropdown-item d-flex align-items-center gap-2 py-2 text-white" @mousedown="selectBudget('50000')">
                        <i class="bi bi-piggy-bank text-cyan"></i>
                        <span>฿50,000 (ระดับกลาง-สูง)</span>
                      </button>
                    </li>
                    <li>
                      <button type="button" class="dropdown-item d-flex align-items-center gap-2 py-2 text-white" @mousedown="selectBudget('75000')">
                        <i class="bi bi-gem text-cyan"></i>
                        <span>฿75,000 (ระดับไฮเอนด์)</span>
                      </button>
                    </li>
                    <li>
                      <button type="button" class="dropdown-item d-flex align-items-center gap-2 py-2 text-white" @mousedown="selectBudget('100000')">
                        <i class="bi bi-rocket-takeoff text-cyan"></i>
                        <span>฿100,000+ (สุดตาราง/ไม่มีอั้น)</span>
                      </button>
                    </li>
                    <li class="border-top border-secondary border-opacity-25 mt-1 pt-1">
                      <button type="button" class="dropdown-item d-flex align-items-center gap-2 py-2 text-white fw-bold" @mousedown="enableCustomBudget">
                        <i class="bi bi-pencil-square text-cyan"></i>
                        <span class="text-cyan">ระบุงบประมาณเอง (Custom Price)...</span>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
              <!-- Purpose Input -->
              <div class="col-sm-4 col-12">
                <label class="form-label text-white-80 fs-9 fw-semibold mb-1">วัตถุประสงค์หลัก</label>
                <div class="dropdown custom-dropdown w-100 position-relative">
                  <button 
                    class="btn btn-outline-light dropdown-toggle w-100 dark-select text-start d-flex align-items-center justify-content-between rounded-3 py-2 shadow-none" 
                    type="button" 
                    @click="togglePurposeDropdown"
                    @blur="closePurposeDropdown"
                  >
                    <span class="d-flex align-items-center gap-2">
                      <i :class="getPurposeIcon(aiPurpose)" class="text-cyan"></i>
                      <span>{{ getPurposeLabel(aiPurpose) }}</span>
                    </span>
                  </button>
                  <ul class="dropdown-menu dropdown-menu-dark w-100 custom-dropdown-menu rounded-3 p-1 position-absolute end-0" :class="{ show: showPurposeDropdown }" style="background-color: #0f172a; border: 1px solid rgba(255, 255, 255, 0.15); z-index: 1000;">
                    <li>
                      <button type="button" class="dropdown-item d-flex align-items-center gap-2 py-2 text-white" @mousedown="selectPurpose('gaming')">
                        <i class="bi bi-controller text-cyan"></i>
                        <span>เล่นเกม (Gaming)</span>
                      </button>
                    </li>
                    <li>
                      <button type="button" class="dropdown-item d-flex align-items-center gap-2 py-2 text-white" @mousedown="selectPurpose('work')">
                        <i class="bi bi-briefcase text-cyan"></i>
                        <span>ทำงานกราฟิก/โค้ด (Work)</span>
                      </button>
                    </li>
                    <li>
                      <button type="button" class="dropdown-item d-flex align-items-center gap-2 py-2 text-white" @mousedown="selectPurpose('office')">
                        <i class="bi bi-building text-cyan"></i>
                        <span>งานทั่วไป/ออฟฟิศ (Office)</span>
                      </button>
                    </li>
                    <li>
                      <button type="button" class="dropdown-item d-flex align-items-center gap-2 py-2 text-white" @mousedown="selectPurpose('streaming')">
                        <i class="bi bi-camera-video text-cyan"></i>
                        <span>เล่นเกม+สตรีม (Streaming)</span>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
              <!-- Action Button -->
              <div class="col-sm-3 col-12 align-self-end mt-3 mt-sm-0">
                <button 
                  @click="generateAiBuild" 
                  class="btn btn-primary-custom w-100 py-2.5 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2 border-0 shadow-sm"
                  :disabled="aiLoading"
                >
                  <span v-if="aiLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  <i v-else class="bi bi-stars"></i>
                  <span>{{ aiLoading ? 'กำลังจัดสเปก...' : 'เริ่มจัดสเปก' }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- AI Recommendation Summary Box -->
        <transition name="slide-fade">
          <div v-if="aiRecommended" class="mt-4 pt-3 border-top border-secondary border-opacity-25 position-relative z-3">
            <div class="p-3 bg-black bg-opacity-35 rounded-3 border border-secondary border-opacity-10 text-white animate-fade-in">
              <div class="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
                <h5 class="fs-8 fw-bold text-cyan m-0 d-flex align-items-center gap-2">
                  <i class="bi bi-chat-right-quote-fill"></i> สรุปคำแนะนำจาก AI:
                </h5>
                <button 
                  @click="clearAiBuild" 
                  class="btn btn-sm btn-outline-danger d-flex align-items-center gap-1.5 py-1 px-2.5 rounded-3 fs-9 border-glow-pink"
                  title="ล้างข้อเสนอแนะและรีเซ็ตสเปกทั้งหมด"
                  style="border-color: rgba(220, 53, 69, 0.4) !important; background-color: rgba(220, 53, 69, 0.1);"
                >
                  <i class="bi bi-trash3-fill"></i>
                  <span>ล้างข้อมูลและสเปก AI</span>
                </button>
              </div>
              <p class="fs-9 text-light mb-3">
                เราได้จัดสเปกสำหรับ <strong class="text-warning">{{ aiRecommended.purpose }}</strong> ในงบประมาณหลัก <strong>฿{{ aiRecommended.budget.toLocaleString() }}</strong> 
                โดยเลือกระบบที่มีราคารวมจริง <strong>฿{{ aiRecommended.total.toLocaleString() }}</strong> ซึ่งชิ้นส่วนอุปกรณ์ทุกชิ้นได้รับการตรวจสอบความเข้ากันได้ของ Socket, ชนิดแรม และกำลังไฟของ Power Supply เรียบร้อยแล้ว
              </p>
              <div class="row g-2 fs-9">
                <div class="col-md-6 col-12">
                  <span class="text-muted-custom">ซีพียู (CPU):</span> 
                  <span class="text-white ms-1">{{ aiRecommended.cpu }}</span>
                </div>
                <div class="col-md-6 col-12">
                  <span class="text-muted-custom">การ์ดจอ (GPU):</span> 
                  <span class="text-white ms-1">{{ aiRecommended.gpu }}</span>
                </div>
                <div v-if="aiRecommended.mb" class="col-md-6 col-12">
                  <span class="text-muted-custom">เมนบอร์ด (Mainboard):</span> 
                  <span class="text-white ms-1">{{ aiRecommended.mb }}</span>
                </div>
                <div v-if="aiRecommended.ram" class="col-md-6 col-12">
                  <span class="text-muted-custom">แรม (RAM):</span> 
                  <span class="text-white ms-1">{{ aiRecommended.ram }}</span>
                </div>
                <div v-if="aiRecommended.m2" class="col-md-6 col-12">
                  <span class="text-muted-custom">สตอเรจ (SSD/M.2):</span> 
                  <span class="text-white ms-1">{{ aiRecommended.m2 }}</span>
                </div>
                <div v-if="aiRecommended.psu" class="col-md-6 col-12">
                  <span class="text-muted-custom">พาวเวอร์ซัพพลาย (PSU):</span> 
                  <span class="text-white ms-1">{{ aiRecommended.psu }}</span>
                </div>
                <div v-if="aiRecommended.case" class="col-md-6 col-12">
                  <span class="text-muted-custom">เคสคอมพิวเตอร์ (Case):</span> 
                  <span class="text-white ms-1">{{ aiRecommended.case }}</span>
                </div>
                <div v-if="aiRecommended.cooler" class="col-md-6 col-12">
                  <span class="text-muted-custom">ระบบระบายความร้อน (Cooler):</span> 
                  <span class="text-white ms-1">{{ aiRecommended.cooler }}</span>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <!-- Stylized Header for Print Only -->
      <div class="print-only-header mb-4">
        <div class="d-flex justify-content-between align-items-center border-bottom pb-3">
          <div>
            <h2 class="fw-bold text-primary-custom m-0">TechGear Custom Build</h2>
            <p class="text-muted m-0 fs-8">ใบเสนอราคาและจัดสเปกคอมพิวเตอร์</p>
          </div>
          <div class="text-end">
            <h5 class="fw-bold m-0">วันที่พิมพ์: {{ currentDate }}</h5>
            <p class="text-muted m-0 fs-9">www.techgearcom</p>
          </div>
        </div>
      </div>

      <div class="row g-4">
        <!-- Left Sidebar: Selection slots & summation (Takes full width in Print) -->
        <div class="col-lg-4 col-md-5 col-12 animate-slide-right print-full-width">
          <div class="sidebar-card shadow-sm border-0">
            <div class="p-3 border-bottom d-flex justify-content-between align-items-center bg-light-custom rounded-top-4">
              <div>
                <span class="fs-9 text-muted d-block text-uppercase fw-bold letter-spacing-1">ยอดรวมทั้งสิ้น</span>
                <span class="h3 fw-bold text-danger m-0">฿{{ totalBuildPrice.toLocaleString('th-TH', {minimumFractionDigits: 2}) }}</span>
              </div>
              <div class="text-end no-print">
                <span class="badge bg-secondary-subtle text-secondary rounded-pill px-3 py-1 fs-9">{{ selectedItemsCount }} ชิ้น</span>
              </div>
            </div>

            <!-- Build Actions (Hidden in Print) -->
            <div class="p-3 border-bottom d-flex gap-2 no-print bg-light">
              <button @click="printSpec" class="btn btn-outline-secondary btn-action-sm flex-grow-1" :disabled="selectedItemsCount === 0">
                <i class="bi bi-printer-fill me-1"></i> พิมพ์สเปก
              </button>
              <button @click="addAllToCart" class="btn btn-primary-custom btn-action-sm flex-grow-1" :disabled="selectedItemsCount === 0">
                <i class="bi bi-cart-plus-fill me-1"></i> ใส่ตะกร้าทั้งหมด
              </button>
              <button @click="clearAllSpecs" class="btn btn-outline-danger btn-action-sm" :disabled="selectedItemsCount === 0" title="ล้างสเปกทั้งหมด">
                <i class="bi bi-trash3-fill"></i>
              </button>
            </div>

            <!-- ระบบวิเคราะห์ความเข้ากันได้แบบอัจฉริยะ (Compatibility Checking Guide) -->
            <div class="compatibility-widget no-print p-3 border-bottom">
              <div class="d-flex align-items-center gap-2 mb-3">
                <div class="compat-ai-icon">
                  <i class="bi bi-shield-check-fill text-cyan"></i>
                </div>
                <div>
                  <span class="fs-9 text-muted d-block text-uppercase fw-bold letter-spacing-1">การวิเคราะห์ของระบบ</span>
                  <h6 class="fw-bold text-dark m-0 d-flex align-items-center gap-2">
                    <span>วิเคราะห์ความเข้ากันได้</span>
                    <span v-if="hasCompatibilityIssues" class="badge bg-danger fs-10 px-2.5 py-0.5 rounded-pill animate-pulse">มีข้อผิดพลาด</span>
                    <span v-else-if="selectedItemsCount > 0" class="badge bg-success fs-10 px-2.5 py-0.5 rounded-pill">ผ่าน 100%</span>
                  </h6>
                </div>
              </div>

              <!-- List of checks -->
              <div class="d-flex flex-column gap-2">
                <!-- 1. Socket Check -->
                <div class="compat-status-row p-2 rounded-3 border d-flex gap-2 align-items-start" :class="getCompatBgClass(socketStatus.status)">
                  <div class="compat-status-icon mt-0.5">
                    <i :class="getCompatIcon(socketStatus.status) + ' ' + socketStatus.colorClass"></i>
                  </div>
                  <div class="flex-grow-1 min-w-0">
                    <div class="d-flex justify-content-between align-items-center">
                      <span class="fw-bold fs-9 text-dark">ระบบ Socket (CPU + บอร์ด)</span>
                      <span class="fs-10 text-uppercase fw-bold" :class="socketStatus.colorClass">{{ getCompatBadgeText(socketStatus.status) }}</span>
                    </div>
                    <p class="fs-10 m-0 text-secondary mt-0.5" style="line-height: 1.3;">{{ socketStatus.message }}</p>
                  </div>
                </div>

                <!-- 2. RAM DDR Check -->
                <div class="compat-status-row p-2 rounded-3 border d-flex gap-2 align-items-start" :class="getCompatBgClass(ramStatus.status)">
                  <div class="compat-status-icon mt-0.5">
                    <i :class="getCompatIcon(ramStatus.status) + ' ' + ramStatus.colorClass"></i>
                  </div>
                  <div class="flex-grow-1 min-w-0">
                    <div class="d-flex justify-content-between align-items-center">
                      <span class="fw-bold fs-9 text-dark">มาตรฐาน RAM (RAM + บอร์ด)</span>
                      <span class="fs-10 text-uppercase fw-bold" :class="ramStatus.colorClass">{{ getCompatBadgeText(ramStatus.status) }}</span>
                    </div>
                    <p class="fs-10 m-0 text-secondary mt-0.5" style="line-height: 1.3;">{{ ramStatus.message }}</p>
                  </div>
                </div>

                <!-- 3. Wattage Check -->
                <div class="compat-status-row p-2 rounded-3 border d-flex gap-2 align-items-start" :class="getCompatBgClass(psuStatus.status)">
                  <div class="compat-status-icon mt-0.5">
                    <i :class="getCompatIcon(psuStatus.status) + ' ' + psuStatus.colorClass"></i>
                  </div>
                  <div class="flex-grow-1 min-w-0">
                    <div class="d-flex justify-content-between align-items-center">
                      <span class="fw-bold fs-9 text-dark">กำลังไฟระบบ (PSU Wattage)</span>
                      <span class="fs-10 text-uppercase fw-bold" :class="psuStatus.colorClass">{{ getCompatBadgeText(psuStatus.status) }}</span>
                    </div>
                    <p class="fs-10 m-0 text-secondary mt-0.5 mb-1" style="line-height: 1.3;">{{ psuStatus.message }}</p>
                    
                    <!-- Energy bar showing CPU + GPU vs Selected PSU -->
                    <div v-if="systemTdp > 0" class="mt-2 pt-1 border-top border-secondary border-opacity-10">
                      <div class="d-flex justify-content-between align-items-center fs-10 text-muted mb-1">
                        <span>โหลดหลัก (CPU+GPU): <b>{{ systemTdp }}W</b></span>
                        <span v-if="myBuild.psu">ขนาด PSU: <b>{{ getPsuWattage(myBuild.psu) }}W</b></span>
                        <span v-else>แนะนำอย่างน้อย: <b>{{ recommendedPsuWattage }}W</b></span>
                      </div>
                      <div class="progress rounded-pill bg-light" style="height: 6px; overflow: hidden;">
                        <div 
                          class="progress-bar rounded-pill" 
                          role="progressbar" 
                          :class="getPsuProgressBarClass(psuStatus.status)"
                          :style="{ width: getPsuProgressWidth() + '%' }" 
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- List of component categories -->
            <div class="sidebar-menu-list p-2 d-flex flex-column gap-2">
              <div 
                v-for="cat in categories" 
                :key="cat.id" 
                class="category-slot-item rounded-3"
                :class="{ 
                  'active-slot': activeCategory === cat.id && !printingMode,
                  'has-product': myBuild[cat.id]
                }"
                @click="selectCategorySlot(cat.id)"
              >
                <!-- Indicator (Hidden in print) -->
                <span class="slot-indicator no-print"></span>

                <div class="d-flex align-items-center justify-content-between w-100 py-3 px-4">
                  <div class="d-flex align-items-center gap-3 flex-grow-1 min-w-0">
                    <div class="slot-icon-box" :class="{ 'bg-primary-subtle text-primary': activeCategory === cat.id && !myBuild[cat.id] }">
                      <i :class="cat.icon"></i>
                    </div>
                    <div class="min-w-0 flex-grow-1">
                      <div class="d-flex align-items-center gap-2 flex-wrap">
                        <span class="slot-cat-name text-muted fs-9 fw-semibold">{{ cat.name }} <span class="text-secondary opacity-75 fw-normal">({{ getCategoryCount(cat.id) }} ชิ้น)</span></span>
                        <!-- Small brand badge if product is selected -->
                        <span v-if="myBuild[cat.id]" class="badge-brand-pill">{{ myBuild[cat.id].brand }}</span>
                      </div>
                      
                      <!-- Product detail if selected -->
                      <div v-if="myBuild[cat.id]" class="selected-prod-detail mt-0.5">
                        <span class="selected-prod-name fw-semibold text-dark fs-8 text-truncate d-block cursor-pointer hover-text-cyan-neon transition-colors" :title="myBuild[cat.id].name" @click.stop="openReviews(myBuild[cat.id].id, myBuild[cat.id].name)">
                          {{ myBuild[cat.id].name }}
                          <i class="bi bi-info-circle-fill ms-1 fs-9 text-cyan animate-pulse"></i>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div class="d-flex align-items-center gap-2 text-end ps-2 flex-shrink-0">
                    <div class="price-container">
                      <span v-if="myBuild[cat.id]" class="fw-bold price-text fs-8 text-nowrap">
                        ฿{{ Number(myBuild[cat.id].price).toLocaleString('th-TH') }}
                      </span>
                      <span v-else class="fs-9 text-muted no-print text-placeholder">ยังไม่ได้เลือก</span>
                    </div>
                    
                    <!-- Remove button (Hidden in Print) -->
                    <button 
                      v-if="myBuild[cat.id]" 
                      @click.stop="removeSlotProduct(cat.id)" 
                      class="btn btn-sm btn-light text-danger rounded-circle p-1 border-0 no-print hover-danger-bg d-flex align-items-center justify-content-center" 
                      style="width: 20px; height: 20px;"
                      title="ลบรายการสินค้า"
                    >
                      <i class="bi bi-x fs-7 fw-bold"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Notes for Quotation print only -->
            <div class="print-only-footer p-4 border-top mt-3">
              <div class="row">
                <div class="col-8">
                  <h6 class="fw-bold">เงื่อนไขการรับประกันและการชำระเงิน</h6>
                  <ul class="fs-9 ps-3 text-muted">
                    <li>ราคานี้รวมภาษีมูลค่าเพิ่ม 7% แล้ว</li>
                    <li>รับประกันสินค้าตามเงื่อนไขของแต่ละชิ้นส่วน (3-5 ปี)</li>
                    <li>ราคานี้อาจมีการเปลี่ยนแปลงโดยไม่แจ้งให้ทราบล่วงหน้า</li>
                  </ul>
                </div>
                <div class="col-4 text-center border-start">
                  <p class="fs-9 mb-4">ลงชื่อผู้เสนอราคา</p>
                  <div style="border-bottom: 1px dotted #ccc; height: 30px; width: 120px; margin: 0 auto;"></div>
                  <p class="fs-9 text-muted mt-1">เจ้าหน้าที่ฝ่ายขาย</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side: Product list under selected category (Hidden in Print) -->
        <div class="col-lg-8 col-md-7 col-12 animate-slide-left no-print">
          <div class="content-card shadow-sm border-0">
            <!-- Header for active category -->
            <div class="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4 pb-3 border-bottom">
              <div class="d-flex align-items-center gap-3">
                <div class="header-icon-box">
                  <i :class="activeCategoryIcon" class="fs-4"></i>
                </div>
                <div>
                  <h2 class="h4 fw-bold m-0 text-dark">{{ activeCategoryName }}</h2>
                  <p class="text-muted m-0 fs-8">พบอุปกรณ์คอมพิวเตอร์ทั้งหมด <span class="fw-bold text-danger">{{ filteredProducts.length }}</span> ชิ้น ที่พร้อมจำหน่ายในหมวดหมู่นี้</p>
                </div>
              </div>
            </div>

            <!-- Filters Section -->
            <div class="bg-light p-3 rounded-4 mb-4">
              <div class="row g-3">
                <!-- Search -->
                <div class="col-lg-6 col-12">
                  <div class="position-relative">
                    <input 
                      v-model="productSearch" 
                      type="text" 
                      class="form-control filter-input shadow-none ps-4 pe-5" 
                      placeholder="ค้นหาชื่อสินค้าหรือสเปก..."
                    >
                    <i class="bi bi-search position-absolute top-50 end-0 translate-middle-y me-3 text-secondary"></i>
                  </div>
                </div>

                <!-- Sort dropdown -->
                <div class="col-lg-6 col-12">
                  <div class="d-flex gap-2">
                    <select v-model="sortBy" class="form-select filter-select shadow-none">
                      <option value="name">เรียงตามชื่อตัวอักษร</option>
                      <option value="price-asc">ราคา: ต่ำ - สูง</option>
                      <option value="price-desc">ราคา: สูง - ต่ำ</option>
                    </select>
                    <button v-if="selectedBrand || productSearch" @click="resetSearchFilters" class="btn btn-outline-secondary" title="ล้างการค้นหา">
                      <i class="bi bi-arrow-clockwise"></i>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Brand Filter Pills -->
              <div v-if="availableBrands.length > 0" class="d-flex flex-wrap gap-2 mt-3 pt-3 border-top align-items-center">
                <span class="fs-9 text-muted fw-bold me-2">แบรนด์สินค้า:</span>
                <button 
                  class="btn btn-pill btn-sm" 
                  :class="selectedBrand === '' ? 'btn-danger' : 'btn-outline-secondary'"
                  @click="selectedBrand = ''"
                >
                  ทั้งหมด
                </button>
                <button 
                  v-for="brand in availableBrands" 
                  :key="brand" 
                  class="btn btn-pill btn-sm" 
                  :class="selectedBrand === brand ? 'btn-danger' : 'btn-outline-secondary'"
                  @click="selectedBrand = brand"
                >
                  {{ brand }}
                </button>
              </div>

              <!-- Series Filter Pills (Only for CPU and GPU to match pinkish-red filters) -->
              <div v-if="availableSeries.length > 0" class="d-flex flex-wrap gap-2 mt-2 align-items-center">
                <span class="fs-9 text-muted fw-bold me-2">ซีรีส์ / รุ่น:</span>
                <button 
                  class="btn btn-pill btn-sm" 
                  :class="selectedSeries === '' ? 'btn-danger' : 'btn-outline-secondary'"
                  @click="selectedSeries = ''"
                >
                  ทั้งหมด
                </button>
                <button 
                  v-for="series in availableSeries" 
                  :key="series" 
                  class="btn btn-pill btn-sm" 
                  :class="selectedSeries === series ? 'btn-danger' : 'btn-outline-secondary'"
                  @click="selectedSeries = series"
                >
                  {{ series }}
                </button>
              </div>

              <!-- Auto-filtering Toggle (Compatibility Shield) -->
              <div v-if="hasFilterableCompatibility" class="d-flex align-items-center gap-2 mt-2 pt-2 border-top">
                <i class="bi bi-shield-fill-check text-success fs-7"></i>
                <div class="form-check form-switch m-0">
                  <input 
                    v-model="filterCompatibleOnly" 
                    class="form-check-input shadow-none cursor-pointer" 
                    type="checkbox" 
                    id="flexSwitchCompat"
                  >
                  <label class="form-check-label fs-9 fw-semibold text-secondary cursor-pointer" for="flexSwitchCompat">
                    แสดงเฉพาะอุปกรณ์ที่เข้ากันได้ (กรอง Socket และรุ่น RAM อัตโนมัติ)
                  </label>
                </div>
              </div>
            </div>

            <!-- Product Grid -->
            <div v-if="filteredProducts.length > 0" class="row g-3">
              <div v-for="prod in filteredProducts" :key="prod.id" class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                <div class="product-item-card h-100 d-flex flex-column justify-content-between p-3" :class="{'selected-in-build': isSelectedInBuild(prod.id)}">
                  <div>
                    <!-- Stylized SVG placeholder since we don't put actual images -->
                    <div class="blueprint-img-placeholder mb-3 cursor-pointer" @click="openReviews(prod.id, prod.name)" title="คลิกเพื่อดูรายละเอียดสินค้าและรีวิว">
                      <div class="blueprint-inner d-flex flex-column align-items-center justify-content-center">
                        <i :class="activeCategoryIcon" class="blueprint-icon mb-1"></i>
                        <span class="blueprint-text">{{ prod.brand }} TECH</span>
                      </div>
                      <span class="badge-brand-item bg-dark text-white">{{ prod.brand }}</span>
                    </div>

                    <!-- Category and badge -->
                    <div class="d-flex justify-content-between align-items-center mb-1">
                      <span class="text-danger fw-bold fs-9">{{ prod.category }}</span>
                      <span v-if="prod.socket" class="badge-socket bg-light text-secondary fs-9">{{ prod.socket }}</span>
                    </div>

                    <!-- Remaining Stock count -->
                    <div class="d-flex align-items-center mb-2">
                      <span class="badge bg-success-subtle text-success fs-9 rounded-pill px-2.5 py-1 fw-semibold d-inline-flex align-items-center gap-1">
                        <i class="bi bi-check-circle-fill fs-9"></i> คงเหลือในคลัง: {{ (prod.db_id % 12) + 3 }} ชิ้น
                      </span>
                    </div>

                    <!-- Reviews & Ratings Badge -->
                    <div class="d-flex align-items-center gap-2 mb-2 cursor-pointer hover-scale-small" @click="openReviews(prod.id, prod.name)" title="คลิกเพื่อดูรีวิว">
                      <div class="rating-badge-small d-inline-flex align-items-center gap-1 bg-warning-subtle text-warning px-2.5 py-0.5 rounded-pill fs-10 fw-bold">
                        <i class="bi bi-star-fill text-warning animate-pulse"></i>
                        <span>{{ reviewsStats[prod.id]?.avgRating || '5.0' }}</span>
                      </div>
                      <span class="text-secondary fs-10 fw-semibold">({{ reviewsStats[prod.id]?.totalReviews || 0 }} รีวิว)</span>
                    </div>

                    <!-- Title -->
                    <h5 class="product-card-title fw-bold text-dark fs-8 mb-2 cursor-pointer hover-text-cyan-neon transition-colors" :title="`${prod.name} (คลิกเพื่อดูรายละเอียดและรีวิว)`" @click="openReviews(prod.id, prod.name)">{{ prod.name }}</h5>
                    
                    <!-- Specifications details -->
                    <p class="product-card-specs text-muted fs-9 mb-3">{{ prod.specs }}</p>
                  </div>

                  <!-- Price & Action -->
                  <div class="d-flex justify-content-between align-items-center pt-2 border-top">
                    <span class="fw-bold price-text fs-7 text-danger">฿{{ Number(prod.price).toLocaleString('th-TH', {minimumFractionDigits: 2}) }}</span>
                    <button 
                      @click="addProductToSlot(prod)" 
                      class="btn btn-add-plus btn-sm d-flex align-items-center justify-content-center"
                      :class="isSelectedInBuild(prod.id) ? 'btn-success' : 'btn-outline-danger'"
                      :title="isSelectedInBuild(prod.id) ? 'เลือกแล้ว' : 'เพิ่มลงในสเปกคอม'"
                    >
                      <i :class="isSelectedInBuild(prod.id) ? 'bi bi-check-lg' : 'bi bi-plus-lg'"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-5 no-products-box border rounded-4 bg-white animate-fade-in shadow-sm">
              <i class="bi bi-inbox-fill text-muted display-4 mb-2 d-block"></i>
              <h5 class="fw-bold text-dark mb-1">ไม่มีข้อมูลอุปกรณ์คอมพิวเตอร์</h5>
              <p class="text-muted fs-9 mb-3">ไม่พบชิ้นส่วนในหมวดหมู่ที่เลือก หรือไม่มีแบรนด์/ซีรีส์ที่ก๊อปปี้ตรงความต้องการ</p>
              <button @click="resetSearchFilters" class="btn btn-outline-danger btn-sm rounded-pill px-3">ล้างตัวกรองทั้งหมด</button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Elegant React-like floating toast notification for builder feedback -->
      <div class="toast-container position-fixed bottom-0 end-0 p-4" style="z-index: 1080;">
        <transition name="toast-fade">
          <div v-if="toast.show" class="toast-custom d-flex align-items-center p-3 border-0 rounded-4 shadow-lg" :class="'toast-' + toast.type" role="alert">
            <div class="toast-icon-wrapper me-3">
              <i :class="toast.type === 'success' ? 'bi bi-check-circle-fill text-success fs-4' : 'bi bi-exclamation-triangle-fill text-danger fs-4'"></i>
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

    </div>

    <!-- Premium Reviews Modal -->
    <KakaReviewsModal
      :show="showReviewsModal"
      :product-id="activeProductId"
      :product-name="activeProductName"
      @close="showReviewsModal = false"
      @review-submitted="updateLocalReviewStats"
    />

    <!-- Footer Component -->
    <KakaFooter />
  </div>
</template>

<script setup>

// =================================================================================
// ส่วนควบคุมตรรกะและประมวลผล (Script Setup - Composition API)
// =================================================================================
// จัดการข้อมูลสเตต (State), การดึงข้อมูลจาก API, และวิเคราะห์ความเข้ากันได้ของฮาร์ดแวร์แบบ Real-time
// =================================================================================

// นำเข้าโมดูลและฟังก์ชันที่จำเป็นจาก Vue 3 และ Axios
import { ref, reactive, computed, onMounted } from 'vue'
import axios from 'axios'
import KakaNavbar from './KakaNavbar.vue' // นำเข้า Navbar ด้านบนสุด
import KakaFooter from './KakaFooter.vue' // นำเข้า Footer ด้านล่างสุด
import KakaReviewsModal from './KakaReviewsModal.vue' // นำเข้า Modal แสดงข้อมูลรีวิวและการให้คะแนนสินค้า

// ----------------------------------------------------
// [1] สเตตสำหรับหน้าจอแสดงผลรีวิวสินค้า (Reviews Modal State)
// ----------------------------------------------------
const showReviewsModal = ref(false) // ควบคุมการเปิด/ปิดหน้าต่างรีวิวสินค้า (Modal)
const activeProductId = ref('') // เก็บไอดีสินค้าหลักที่ถูกเลือกเพื่อดูรีวิว
const activeProductName = ref('') // เก็บชื่อสินค้าหลักเพื่อนำไปแสดงผลบนหัว Modal
const reviewsStats = ref({}) // ออบเจกต์เก็บสถิติคะแนนรีวิวของสินค้าทั้งหมด { [prodId]: { avgRating, totalReviews } }

// ฟังก์ชันสำหรับเปิดหน้ารีวิวสินค้า
const openReviews = (id, name) => {
  activeProductId.value = id
  activeProductName.value = name
  showReviewsModal.value = true
}

// ฟังก์ชันสำหรับบันทึกคะแนนรีวิวใหม่และอัปเดตค่าคะแนนเฉลี่ยแบบเรียลไทม์หลังผู้ใช้เขียนรีวิวสำเร็จ
const updateLocalReviewStats = (event) => {
  reviewsStats.value[event.productId] = {
    avgRating: event.avgRating,
    totalReviews: event.totalReviews
  }
}

// ----------------------------------------------------
// [2] คำนวณวันที่ปัจจุบันสำหรับออกเอกสาร (Date Helper for Quotation)
// ----------------------------------------------------
const currentDate = computed(() => {
  const d = new Date()
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}` // แสดงในรูปแบบ วัน/เดือน/ปี ค.ศ.
})

// สถานะการพิมพ์หน้าเว็บ (ใช้ซ่อนองค์ประกอบบางส่วนเช่น ปุ่ม หรือฟรอนต์กรองชิ้นส่วน ระหว่างแปลงหน้าเว็บเป็น PDF)
const printingMode = ref(false)

// ----------------------------------------------------
// [3] รายชื่อประเภทชิ้นส่วนคอมพิวเตอร์หลัก 18 หมวดหมู่ (Builder Slots)
// ----------------------------------------------------
const categories = [
  { id: 'cpu', name: 'ซีพียู (CPU)', icon: 'bi-cpu' },
  { id: 'motherboard', name: 'เมนบอร์ด (Mainboard)', icon: 'bi-layout-three-columns' },
  { id: 'gpu', name: 'การ์ดจอ (Graphics Card)', icon: 'bi-gpu-card' },
  { id: 'ram', name: 'แรม (RAM)', icon: 'bi-memory' },
  { id: 'hdd', name: 'ฮาร์ดดิสก์ (HDD)', icon: 'bi-database' },
  { id: 'ssd', name: 'โซลิดสเตตไดรฟ์ (SSD)', icon: 'bi-device-ssd' },
  { id: 'm2', name: 'การ์ด M.2 (M.2 NVMe)', icon: 'bi-lightning-charge' },
  { id: 'psu', name: 'พาวเวอร์ซัพพลาย (Power Supply)', icon: 'bi-plug' },
  { id: 'case', name: 'เคส (Case)', icon: 'bi-box' },
  { id: 'liquid_cooler', name: 'ชุดน้ำปิด (Liquid Cooling)', icon: 'bi-droplet-half' },
  { id: 'cpu_cooler', name: 'พัดลมซีพียู (CPU Cooler)', icon: 'bi-fan' },
  { id: 'case_fan', name: 'พัดลมเคส (Case Fan)', icon: 'bi-wind' },
  { id: 'mouse', name: 'เมาส์ (Mouse)', icon: 'bi-mouse' },
  { id: 'keyboard', name: 'คีย์บอร์ด (Keyboard)', icon: 'bi-keyboard' },
  { id: 'monitor', name: 'จอมอนิเตอร์ (Monitor)', icon: 'bi-display' },
  { id: 'accessories', name: 'อุปกรณ์เสริม (Accessories)', icon: 'bi-usb-plug' },
  { id: 'gaming_gear', name: 'เกมมิ่งเกียร์ (Gaming Gear)', icon: 'bi-controller' },
  { id: 'software', name: 'ซอฟต์แวร์ (Software)', icon: 'bi-disc' }
]

// ตัวแปรเก็บหมวดหมู่สินค้าที่กำลังถูกเลือกอยู่ในฝั่ง Sidebar (เริ่มต้นที่ CPU)
const activeCategory = ref('cpu')

// ดึงชื่อหมวดหมู่ปัจจุบันที่เลือก
const activeCategoryName = computed(() => {
  const cat = categories.find(c => c.id === activeCategory.value)
  return cat ? cat.name : ''
})

// ดึงไอคอนประจำหมวดหมู่ปัจจุบันที่เลือก
const activeCategoryIcon = computed(() => {
  const cat = categories.find(c => c.id === activeCategory.value)
  return cat ? cat.icon : 'bi-cpu'
})

// ----------------------------------------------------
// [4] โครงสร้างข้อมูลเก็บสเปกคอมพิวเตอร์ที่จัดไว้ (User Selected Build State)
// ----------------------------------------------------
// ใช้ reactive อัปเดตข้อมูลแบบสองทาง หากผู้ใช้เพิ่ม/ถอด ชิ้นส่วนใน Slot ต่างๆ
const myBuild = reactive({
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
})

// คำนวณราคารวมทั้งหมดของชิ้นส่วนที่เลือก
const totalBuildPrice = computed(() => {
  let total = 0
  for (const slot in myBuild) {
    if (myBuild[slot]) {
      total += parseFloat(myBuild[slot].price) || 0
    }
  }
  return total
})

// คำนวณจำนวนชิ้นส่วนอุปกรณ์ที่ถูกหยิบเข้าสเปกในขณะนี้
const selectedItemsCount = computed(() => {
  let count = 0
  for (const slot in myBuild) {
    if (myBuild[slot]) count++
  }
  return count
})

// ฟิลเตอร์การค้นหาและการจัดเรียงสินค้า
const productSearch = ref('') // ข้อความค้นหาในอินพุต
const selectedBrand = ref('') // แบรนด์สินค้าที่ฟิลเตอร์ (เช่น ASUS, Intel, AMD)
const selectedSeries = ref('') // ซีรีส์ของสินค้า (เช่น RTX 4060, Core i5)
const sortBy = ref('price-asc') // การเรียงลำดับราคา ( price-asc = ราคาต่ำไปสูง, price-desc = ราคาสูงไปต่ำ )
const filterCompatibleOnly = ref(true) // เปิดฟังก์ชันช่วยกรองเฉพาะสินค้าที่เข้ากันได้อัตโนมัติเป็นค่าเริ่มต้น

// ---------------------------------------------------------------------------------
// [5] ระบบคำนวณ TDP และวิเคราะห์ความเข้ากันได้แบบอัจฉริยะ (Compatibility Check Logic)
// ---------------------------------------------------------------------------------

// ฟังก์ชันหาปริมาณไฟที่ CPU แต่ละรุ่นใช้งาน (TDP - Thermal Design Power ในหน่วยวัตต์)
const getCpuTdp = (cpu) => {
  if (!cpu) return 0
  const specs = (cpu.specs || '').toLowerCase()
  const name = (cpu.name || '').toLowerCase()
  
  // 1. ตรวจสอบว่ามีข้อมูล TDP ระบุในข้อความ Specs หรือไม่ (เช่น 65W หรือ 125W)
  const match = specs.match(/tdp\s*(\d+)\s*w/)
  if (match) {
    return parseInt(match[1])
  }
  
  // 2. หากไม่มี ให้ใช้ค่าประมาณกลางตามรุ่น/ซีรีส์เพื่อความรวดเร็วและปลอดภัย
  if (name.includes('i9') || name.includes('ryzen 9') || name.includes('ultra 9')) return 125
  if (name.includes('i7') || name.includes('ryzen 7') || name.includes('ultra 7')) return 105
  if (name.includes('i5') || name.includes('ryzen 5') || name.includes('ultra 5')) return 65
  if (name.includes('i3') || name.includes('ryzen 3')) return 50
  return 65
}

// ฟังก์ชันหาการกินไฟสูงสุดของการ์ดจอ (GPU TDP - คัดกรองตามรุ่นชิปเซตเด่นๆ ในตลาด)
const getGpuTdp = (gpu) => {
  if (!gpu) return 0
  const name = (gpu.name || '').toLowerCase()
  
  if (name.includes('4090')) return 450
  if (name.includes('4080')) return 320
  if (name.includes('4070 super') || name.includes('4070 ti')) return 220
  if (name.includes('4070')) return 200
  if (name.includes('4060 ti')) return 160
  if (name.includes('4060')) return 115
  if (name.includes('3060 ti')) return 200
  if (name.includes('3060')) return 170
  if (name.includes('3050')) return 130
  if (name.includes('1650')) return 75
  if (name.includes('7900')) return 300
  if (name.includes('7800')) return 263
  if (name.includes('7700')) return 245
  if (name.includes('7600')) return 165
  if (name.includes('6600')) return 132
  
  return 150 // ค่าพื้นฐานหากเป็นรุ่นเก่าหรือรุ่นระดับเริ่มต้นทั่วไป
}

// ดึงกำลังวัตต์แท้สูงสุดที่ Power Supply (PSU) ตัวที่เลือกสามารถจ่ายได้
const getPsuWattage = (psu) => {
  if (!psu) return 0
  const name = (psu.name || '').toLowerCase()
  const specs = (psu.specs || '').toLowerCase()
  
  // ค้นหารูปแบบตัวเลขตามด้วยตัวอักษร w (เช่น 550W, 650W, 1000W)
  const matchName = name.match(/(\d+)\s*w/)
  if (matchName) return parseInt(matchName[1])
  
  const matchSpecs = specs.match(/(\d+)\s*w/)
  if (matchSpecs) return parseInt(matchSpecs[1])
  
  return 0
}

// คำนวณปริมาณการใช้งานไฟฟ้าหลักของระบบ (CPU + GPU โหลดสูงสุด)
const systemTdp = computed(() => {
  const cpuWatts = getCpuTdp(myBuild.cpu)
  const gpuWatts = getGpuTdp(myBuild.gpu)
  return cpuWatts + gpuWatts
})

// แนะนำขนาด Power Supply ขั้นต่ำที่ปลอดภัย (ปริมาณโหลดหลัก + 150 วัตต์ สำหรับ เมนบอร์ด, พัดลม, SSD และค่าเผื่อความเสื่อม/ค่าความปลอดภัย)
const recommendedPsuWattage = computed(() => {
  if (systemTdp.value === 0) return 0
  return systemTdp.value + 150
})

// สรุปสถานะการใช้พลังงานและการรับไฟของระบบ (Power Supply Checking Status)
const psuStatus = computed(() => {
  const psu = myBuild.psu
  const reqWatts = recommendedPsuWattage.value
  
  // กรณีผู้ใช้ยังไม่ได้เลือกชิ้นส่วนหลักที่ใช้กำลังไฟสูง
  if (!myBuild.cpu && !myBuild.gpu) {
    return {
      status: 'pending',
      message: 'กรุณาเลือก CPU หรือการ์ดจอก่อนเพื่อตรวจสอบพลังงาน',
      colorClass: 'text-secondary'
    }
  }
  
  // กรณีเลือก CPU หรือการ์ดจอแล้ว แต่ยังไม่หยิบ PSU ลงตะกร้า
  if (!psu) {
    return {
      status: 'warning',
      message: `ระบบต้องการกำลังไฟสำรองอย่างน้อย ${reqWatts}W (กรุณาเลือก PSU เพื่อความปลอดภัย)`,
      colorClass: 'text-warning'
    }
  }
  
  const psuWatts = getPsuWattage(psu)
  if (psuWatts === 0) {
    return {
      status: 'unknown',
      message: 'ไม่สามารถระบุขนาดวัตต์ของ PSU ที่เลือกได้',
      colorClass: 'text-warning'
    }
  }
  
  // กรณีขนาด PSU จ่ายไฟได้ไม่ถึงค่าขั้นต่ำที่ระบบแนะนำ
  if (psuWatts < reqWatts) {
    return {
      status: 'danger',
      message: `พาวเวอร์ซัพพลายขนาด ${psuWatts}W ไม่เพียงพอ! ต้องการวัตต์จริงอย่างน้อย ${reqWatts}W`,
      colorClass: 'text-danger'
    }
  }
  
  // กำลังไฟเพียงพอและเข้ากันได้ 100%
  return {
    status: 'success',
    message: `พาวเวอร์ซัพพลายขนาด ${psuWatts}W เพียงพอต่อความต้องการอย่างปลอดภัย (${reqWatts}W)`,
    colorClass: 'text-success'
  }
})

// ค้นหาเวอร์ชันมาตรฐานประเภทของหน่วยความจำ (DDR4 หรือ DDR5) จากชื่อสินค้าหรือสเปก
const getDdrVersion = (item) => {
  if (!item) return null
  const str = (item.name + ' ' + (item.specs || '')).toLowerCase()
  if (str.includes('ddr5')) return 'DDR5'
  if (str.includes('ddr4')) return 'DDR4'
  return null
}

// ตรวจสอบความเข้ากันได้ของ RAM และ เมนบอร์ด (RAM Compatibility Check)
const ramStatus = computed(() => {
  const mb = myBuild.motherboard
  const ram = myBuild.ram
  
  if (!mb && !ram) {
    return {
      status: 'pending',
      message: 'กรุณาเลือกเมนบอร์ดและแรมเพื่อตรวจสอบประเภท',
      colorClass: 'text-secondary'
    }
  }
  
  if (!mb) {
    const ramDdr = getDdrVersion(ram)
    return {
      status: 'info',
      message: `แรมที่เลือกเป็นประเภท ${ramDdr || 'ไม่ระบุประเภท DDR'}`,
      colorClass: 'text-info'
    }
  }
  
  if (!ram) {
    const mbDdr = getDdrVersion(mb)
    return {
      status: 'info',
      message: `เมนบอร์ดต้องการแรมประเภท ${mbDdr || 'ไม่ระบุประเภท DDR'}`,
      colorClass: 'text-info'
    }
  }
  
  const mbDdr = getDdrVersion(mb)
  const ramDdr = getDdrVersion(ram)
  
  if (!mbDdr || !ramDdr) {
    return {
      status: 'unknown',
      message: 'ไม่พบข้อมูลชนิดแรม (DDR4/DDR5) ที่ระบุในระบบสเปกอุปกรณ์',
      colorClass: 'text-warning'
    }
  }
  
  // แจ้งเตือนกรณีนำ RAM DDR5 ไปใส่บอร์ด DDR4 หรือในทางกลับกัน
  if (mbDdr !== ramDdr) {
    return {
      status: 'danger',
      message: `ขัดแย้งกัน! เมนบอร์ดรองรับ ${mbDdr} แต่เลือกแรมเป็น ${ramDdr}`,
      colorClass: 'text-danger'
    }
  }
  
  return {
    status: 'success',
    message: `แรมและเมนบอร์ดรองรับมาตรฐานเดียวกัน (${mbDdr}) เข้ากันได้สมบูรณ์`,
    colorClass: 'text-success'
  }
})

// ตรวจสอบความเข้ากันได้ของ Socket ระหว่าง CPU และ เมนบอร์ด (CPU Socket Check)
const socketStatus = computed(() => {
  const cpu = myBuild.cpu
  const mb = myBuild.motherboard
  
  if (!cpu && !mb) {
    return {
      status: 'pending',
      message: 'กรุณาเลือก CPU และเมนบอร์ดเพื่อตรวจสอบ Socket',
      colorClass: 'text-secondary'
    }
  }
  
  if (!cpu) {
    return {
      status: 'info',
      message: `เมนบอร์ดใช้สำหรับ Socket ${mb.socket || 'ไม่ระบุ'}`,
      colorClass: 'text-info'
    }
  }
  
  if (!mb) {
    return {
      status: 'info',
      message: `CPU ใช้สำหรับ Socket ${cpu.socket || 'ไม่ระบุ'}`,
      colorClass: 'text-info'
    }
  }
  
  const normalizeSocket = (s) => (s || '').toString().toLowerCase().replace(/socket\s*/g, '').replace(/[^a-z0-9]/g, '')
  const cpuSocket = normalizeSocket(cpu.socket)
  const mbSocket = normalizeSocket(mb.socket)
  
  if (!cpuSocket || !mbSocket) {
    return {
      status: 'unknown',
      message: 'ไม่พบข้อมูล Socket เพื่อเปรียบเทียบในระบบฐานข้อมูล',
      colorClass: 'text-warning'
    }
  }
  
  // กรณีนำ CPU AMD ใส่บอร์ด Intel หรือขาซีพียูไม่ตรงกับรุ่นบอร์ด
  if (cpuSocket !== mbSocket && !cpuSocket.includes(mbSocket) && !mbSocket.includes(cpuSocket)) {
    return {
      status: 'danger',
      message: `ขัดแย้งกัน! CPU เป็น ${cpu.socket} แต่เมนบอร์ดเป็น ${mb.socket}`,
      colorClass: 'text-danger'
    }
  }
  
  return {
    status: 'success',
    message: `CPU และเมนบอร์ดเข้ากันได้สำเร็จ (Socket: ${cpu.socket})`,
    colorClass: 'text-success'
  }
})

// คืนค่าค่าความเข้ากันได้โดยรวมของระบบคอมพิวเตอร์ว่ามีข้อผิดพลาดรุนแรงที่ทำให้เปิดไม่ติดหรือไม่
const hasCompatibilityIssues = computed(() => {
  return socketStatus.value.status === 'danger' || 
         ramStatus.value.status === 'danger' || 
         psuStatus.value.status === 'danger'
})

// ใช้ระบุว่าหมวดหมู่ปัจจุบันสามารถเปิดใช้งานการคัดกรองความเข้ากันได้แบบไดนามิกได้หรือไม่
const hasFilterableCompatibility = computed(() => {
  if (activeCategory.value === 'motherboard' && myBuild.cpu) return true
  if (activeCategory.value === 'cpu' && myBuild.motherboard) return true
  if (activeCategory.value === 'ram' && myBuild.motherboard) return true
  return false
})

// ตัวช่วยสลับสีพื้นหลังของกล่องแสดงผลความเข้ากันได้ตามระดับสเตตัส
const getCompatBgClass = (status) => {
  if (status === 'success') return 'bg-success-subtle border-success border-opacity-25'
  if (status === 'danger') return 'bg-danger-subtle border-danger border-opacity-25'
  if (status === 'warning') return 'bg-warning-subtle border-warning border-opacity-25'
  if (status === 'info') return 'bg-info-subtle border-info border-opacity-25'
  return 'bg-light border-light'
}

// ตัวช่วยดึงไอคอน Bootstrap Icons ให้สอดคล้องกับระดับความเข้ากันได้
const getCompatIcon = (status) => {
  if (status === 'success') return 'bi-check-circle-fill'
  if (status === 'danger') return 'bi-exclamation-triangle-fill'
  if (status === 'warning') return 'bi-lightbulb-fill'
  if (status === 'info') return 'bi-info-circle-fill'
  return 'bi-info-circle'
}

// ข้อความกำกับสั้นๆ บนป้ายของสเตตัสวิเคราะห์ฮาร์ดแวร์
const getCompatBadgeText = (status) => {
  if (status === 'success') return 'ปกติ'
  if (status === 'danger') return 'ผิดพลาด'
  if (status === 'warning') return 'แนะนำ'
  if (status === 'info') return 'ข้อมูล'
  return 'วิเคราะห์'
}

// สลับสีแถบความก้าวหน้าการโหลดไฟฟ้า Power Supply
const getPsuProgressBarClass = (status) => {
  if (status === 'danger') return 'bg-danger'
  if (status === 'warning') return 'bg-warning'
  return 'bg-success'
}

// คำนวณร้อยละ (%) การกินไฟของชิ้นส่วนเมื่อเทียบกับกำลัง PSU เพื่อวาดแถบความก้าวหน้า
const getPsuProgressWidth = () => {
  if (systemTdp.value === 0) return 0
  const psuWatt = getPsuWattage(myBuild.psu)
  if (psuWatt > 0) {
    return Math.min(100, Math.round((systemTdp.value / psuWatt) * 100))
  }
  return Math.min(100, Math.round((systemTdp.value / recommendedPsuWattage.value) * 100))
}

// ----------------------------------------------------
// [6] สเตตสำหรับหน้าจอช่วยจัดสเปกด้วย AI (AI Assistant states)
// ----------------------------------------------------
const aiBudget = ref('30000') // งบที่ผู้ใช้งานเลือกในตัวช่วย AI (เช่น 15000, 30000, 50000)
const aiPurpose = ref('gaming') // วัตถุประสงค์ในการจัดสเปกคอม (gaming, work, office, streaming)
const aiLoading = ref(false) // สถานะกำลังประมวลผลจัดสเปกคอมโดยระบบจำลอง AI
const aiRecommended = ref(null) // ผลลัพธ์การคัดเลือกสเปกจาก AI สำหรับนำมาพรีวิวแสดงข้อดี

// การจัดการงบประมาณแบบระบุราคาเอง (Custom Budget State)
const isCustomBudget = ref(false) // เปิดปิดช่องกรอกข้อความงบประมาณเอง
const customBudgetVal = ref(30000) // ค่าเงินงบประมาณที่กรอกเอง

// ฟังก์ชันเปิดโหมดระบุงบประมาณคอมพิวเตอร์เอง
const enableCustomBudget = () => {
  isCustomBudget.value = true
  aiBudget.value = customBudgetVal.value.toString()
  showBudgetDropdown.value = false
}

// ปิดโหมดระบุงบประมาณเองและกลับไปใช้ Dropdown มาตรฐาน
const disableCustomBudget = () => {
  isCustomBudget.value = false
  aiBudget.value = '30000'
}

// อัปเดตสเตตงบประมาณตามช่องกรอกของผู้ใช้งานทันทีที่พิมพ์ข้อมูล
const updateCustomBudget = () => {
  if (customBudgetVal.value && !isNaN(customBudgetVal.value)) {
    aiBudget.value = customBudgetVal.value.toString()
  } else {
    aiBudget.value = '0'
  }
}

// ควบคุมการแสดงผลแถบเลือกงบและวัตถุประสงค์ (Dropdown Toggle Controls)
const showBudgetDropdown = ref(false)
const showPurposeDropdown = ref(false)

const toggleBudgetDropdown = () => {
  showBudgetDropdown.value = !showBudgetDropdown.value
}
const closeBudgetDropdown = () => {
  setTimeout(() => {
    showBudgetDropdown.value = false
  }, 150)
}
const selectBudget = (val) => {
  aiBudget.value = val
  showBudgetDropdown.value = false
}

const togglePurposeDropdown = () => {
  showPurposeDropdown.value = !showPurposeDropdown.value
}
const closePurposeDropdown = () => {
  setTimeout(() => {
    showPurposeDropdown.value = false
  }, 150)
}
const selectPurpose = (val) => {
  aiPurpose.value = val
  showPurposeDropdown.value = false
}

// ตัวช่วยแสดงข้อความป้ายราคาให้สวยงามในหน้าอินเทอร์เฟซผู้ใช้งาน
const getBudgetLabel = (val) => {
  const options = {
    '15000': '฿15,000 (ราคาประหยัด)',
    '30000': '฿30,000 (ระดับเริ่มต้น-กลาง)',
    '50000': '฿50,000 (ระดับกลาง-สูง)',
    '75000': '฿75,000 (ระดับไฮเอนด์)',
    '100000': '฿100,000+ (สุดตาราง/ไม่มีอั้น)'
  }
  if (options[val]) return options[val]
  const num = parseFloat(val)
  if (!isNaN(num)) {
    return `฿${num.toLocaleString()} (ระบุเอง)`
  }
  return val
}

const getBudgetIcon = (val) => {
  const icons = {
    '15000': 'bi-wallet2',
    '30000': 'bi-cash-coin',
    '50000': 'bi-piggy-bank',
    '75000': 'bi-gem',
    '100000': 'bi-rocket-takeoff'
  }
  return icons[val] || 'bi-cash'
}

const getPurposeLabel = (val) => {
  const options = {
    gaming: 'เล่นเกม (Gaming)',
    work: 'ทำงานกราฟิก/โค้ด (Work)',
    office: 'งานทั่วไป/ออฟฟิศ (Office)',
    streaming: 'เล่นเกม+สตรีม (Streaming)'
  }
  return options[val] || val
}

const getPurposeIcon = (val) => {
  const icons = {
    gaming: 'bi-controller',
    work: 'bi-briefcase',
    office: 'bi-building',
    streaming: 'bi-camera-video'
  }
  return icons[val] || 'bi-gear'
}

// ----------------------------------------------------
// [7] ฟังก์ชันคำนวณและประมวลผลจัดสเปกคอมโดยระบบ AI (AI Builder Process)
// ----------------------------------------------------
// คำนวณเลือกอุปกรณ์อัตโนมัติให้คุ้มค่าและมีประสิทธิภาพสูงสุดตามงบที่เลือก
const generateAiBuild = () => {
  // หากผู้ใช้จัดสเปกทิ้งไว้ในตะกร้า ให้ออกหน้าต่างเตือนเพื่อยืนยันการเขียนทับข้อมูลสเปกเดิม
  if (selectedItemsCount.value > 0) {
    if (!confirm('การจัดสเปกด้วย AI จะเขียนทับสเปกปัจจุบันที่คุณเลือกไว้ ต้องการดำเนินการต่อหรือไม่?')) {
      return
    }
  }

  aiLoading.value = true
  aiRecommended.value = null

  // หน่วงเวลารันผลลัพธ์จำลองระบบประมวลผลข้อมูล 1 วินาที เพื่อสร้างฟีลลิ่งการคิดวิเคราะห์ของ AI ที่พรีเมียม
  setTimeout(() => {
    try {
      const budget = parseFloat(aiBudget.value)
      if (isNaN(budget) || budget <= 0) {
        throw new Error('กรุณากรอกงบประมาณที่ต้องการจัดสเปกคอมให้ถูกต้อง (ต้องมากกว่า 0 บาท)')
      }
      const purpose = aiPurpose.value

      // 1. กรองฐานข้อมูลสินค้าทั้งหมดแยกตามหมวดหมู่เพื่อใช้คัดสรร
      const db = productDb.value
      const byCat = {}
      categories.forEach(c => {
        byCat[c.id] = db.filter(p => p.category === c.id)
      })

      // 2. กำหนดสัดส่วนเปอร์เซ็นต์งบประมาณ (Weights Allocation) ให้สอดคล้องกับวัตถุประสงค์การใช้งานจริง
      let shares = {}
      if (purpose === 'gaming') {
        shares = {
          cpu: 0.22,
          motherboard: 0.12,
          gpu: 0.38, // ให้สัดส่วนกับการ์ดจอมากที่สุดเพื่อให้เล่นเกมได้เฟรมเรตสูง
          ram: 0.08,
          m2: 0.08,
          psu: 0.07,
          case: 0.05,
          cpu_cooler: 0.00,
          liquid_cooler: 0.00
        }
        // เพิ่มน้ำหนักให้การ์ดจอไฮเอนด์และแรมมากขึ้นสำหรับงบสูงระดับเทพ
        if (budget >= 50000) {
          shares.gpu = 0.40
          shares.cpu = 0.22
          shares.motherboard = 0.12
          shares.ram = 0.10
          shares.m2 = 0.08
          shares.psu = 0.08
          shares.case = 0.06
        }
      } else if (purpose === 'work') {
        shares = {
          cpu: 0.32, // เน้นหน่วยประมวลผลแกนประมวลผลเยอะสำหรับการเรนเดอร์/แปลงไฟล์
          motherboard: 0.15,
          gpu: 0.18,
          ram: 0.12,
          m2: 0.10,
          psu: 0.07,
          case: 0.06,
          cpu_cooler: 0.00,
          liquid_cooler: 0.00
        }
        if (budget >= 50000) {
          shares.cpu = 0.30
          shares.gpu = 0.22
          shares.ram = 0.15 // ขยายแรมเยอะขึ้นเพื่อรองรับพอร์ตงานกราฟิกขนาดใหญ่
          shares.motherboard = 0.13
          shares.m2 = 0.10
          shares.psu = 0.10
        }
      } else if (purpose === 'office') {
        shares = {
          cpu: 0.38, // เน้น CPU ระดับล่างที่มีการ์ดจอในตัว (Integrated APU) เพื่อความประหยัด
          motherboard: 0.22,
          gpu: 0.00, // ไม่มีความจำเป็นต้องใช้การ์ดจอแยกสำหรับงานออฟฟิศเอกสารทั่วไป
          ram: 0.14,
          m2: 0.14,
          psu: 0.12,
          case: 0.10,
          cpu_cooler: 0.00,
          liquid_cooler: 0.00
        }
      } else if (purpose === 'streaming') {
        shares = {
          cpu: 0.25, // สมดุลระหว่าง CPU แรงแกนหลักเยอะสำหรับการเข้ารหัสสตรีมเกม
          motherboard: 0.12,
          gpu: 0.30, // การ์ดจอแรงเพื่อให้เกมลื่นไหล
          ram: 0.12, // แรมเยอะเผื่อโปรแกรมสตรีมมิ่ง OBS ทำงานควบคู่
          m2: 0.09,
          psu: 0.07,
          case: 0.05,
          cpu_cooler: 0.00,
          liquid_cooler: 0.00
        }
        if (budget >= 50000) {
          shares.cpu = 0.25
          shares.gpu = 0.32
          shares.motherboard = 0.12
          shares.ram = 0.12
          shares.m2 = 0.10
          shares.psu = 0.09
        }
      }

      // รีเซ็ตการตั้งค่าสเปกเดิมในตะกร้าทั้งหมดก่อนเริ่มรวบรวมชิ้นส่วนใหม่
      for (const slot in myBuild) {
        myBuild[slot] = null
      }

      let remainingBudget = budget

      // ฟังก์ชันช่วยย่อย: ใช้ค้นหาชิ้นส่วนในกลุ่มประเภทอุปกรณ์ที่มีราคาสูงที่สุดแต่ไม่เกินงบประมาณที่จัดสรร (Target Share)
      const findBestPart = (partsList, targetCost) => {
        if (!partsList || partsList.length === 0) return null
        const sorted = [...partsList].sort((a, b) => b.price - a.price)
        let choice = sorted.find(p => p.price <= targetCost)
        if (!choice) {
          choice = sorted[sorted.length - 1] // หากของแพงเกินงบส่วนย่อยทั้งหมด ให้เอาชิ้นที่ราคาถูกที่สุดแทน
        }
        return choice
      }

      // ขั้นตอนที่ 1: คัดกรอง CPU ที่ดีที่สุดและนำราคามารวม
      const targetCpuCost = budget * shares.cpu
      const cpus = byCat['cpu'] || []
      let selectedCpu = findBestPart(cpus, targetCpuCost)
      if (!selectedCpu && cpus.length > 0) {
        selectedCpu = cpus[cpus.length - 1]
      }

      if (!selectedCpu) {
        throw new Error('ไม่พบข้อมูลหน่วยประมวลผล (CPU) ในระบบคลังสินค้า')
      }

      myBuild.cpu = selectedCpu
      remainingBudget -= selectedCpu.price

      // ขั้นตอนที่ 2: คัดกรองเมนบอร์ดที่เหมาะสมและมี Socket เดียวกันกับ CPU
      const targetMbCost = budget * shares.motherboard
      const motherboards = byCat['motherboard'] || []
      const normalizeSocket = (s) => (s || '').toString().toLowerCase().replace(/socket\s*/g, '').replace(/[^a-z0-9]/g, '')
      const cpuSocketStr = normalizeSocket(selectedCpu.socket)
      
      let compatibleMbs = motherboards.filter(mb => {
        const mbSock = normalizeSocket(mb.socket)
        return mbSock && cpuSocketStr && (mbSock === cpuSocketStr || mbSock.includes(cpuSocketStr) || cpuSocketStr.includes(mbSock))
      })
      if (compatibleMbs.length === 0) {
        throw new Error(`ไม่พบเมนบอร์ดที่รองรับ Socket ${selectedCpu.socket || 'ของ CPU นี้'} ในระบบคลังสินค้า กรุณาเพิ่มข้อมูลเมนบอร์ดสำหรับ Socket นี้`)
      }

      let selectedMb = findBestPart(compatibleMbs, targetMbCost)
      if (selectedMb) {
        myBuild.motherboard = selectedMb
        remainingBudget -= selectedMb.price
      }

      // ขั้นตอนที่ 3: เลือกแรม (RAM) ที่ตรงตามมาตรฐานของเมนบอร์ด (เช่น DDR4/DDR5)
      const targetRamCost = budget * shares.ram
      const rams = byCat['ram'] || []
      let compatibleRams = rams
      
      if (selectedMb) {
        const mbDdr = getDdrVersion(selectedMb)

        if (mbDdr === 'DDR5') {
          compatibleRams = rams.filter(r => getDdrVersion(r) === 'DDR5')
        } else if (mbDdr === 'DDR4') {
          compatibleRams = rams.filter(r => getDdrVersion(r) === 'DDR4')
        }
      }

      if (compatibleRams.length === 0) {
        throw new Error(`ไม่พบ RAM ชนิด ${getDdrVersion(selectedMb) || 'ที่รองรับเมนบอร์ดนี้'} ในระบบคลังสินค้า กรุณาเพิ่มข้อมูล RAM`)
      }

      let selectedRam = findBestPart(compatibleRams, targetRamCost)
      if (selectedRam) {
        myBuild.ram = selectedRam
        remainingBudget -= selectedRam.price
      }

      // ขั้นตอนที่ 4: เลือกการ์ดจอ (GPU)
      let selectedGpu = null
      if (shares.gpu > 0) {
        const targetGpuCost = budget * shares.gpu
        const gpus = byCat['gpu'] || []
        selectedGpu = findBestPart(gpus, targetGpuCost)
        if (selectedGpu) {
          myBuild.gpu = selectedGpu
          remainingBudget -= selectedGpu.price
        }
      }

      // ขั้นตอนที่ 5: เลือกสตอเรจความเร็วสูง (M.2 NVMe SSD / SATA SSD)
      const targetM2Cost = budget * shares.m2
      const m2s = byCat['m2'] || []
      let selectedM2 = findBestPart(m2s, targetM2Cost)
      if (selectedM2) {
        myBuild.m2 = selectedM2
        remainingBudget -= selectedM2.price
      } else {
        const ssds = byCat['ssd'] || []
        let selectedSsd = findBestPart(ssds, targetM2Cost)
        if (selectedSsd) {
          myBuild.ssd = selectedSsd
          remainingBudget -= selectedSsd.price
        }
      }

      // ขั้นตอนที่ 6: เลือก PSU ที่เหมาะกับขนาดการใช้ไฟการ์ดจอตัวแรงและการทดระบบ
      const cpuWatts = getCpuTdp(selectedCpu)
      const gpuWatts = getGpuTdp(selectedGpu)
      let minWattage = cpuWatts + gpuWatts + 150

      const targetPsuCost = budget * shares.psu
      const psus = byCat['psu'] || []
      
      let compatiblePsus = psus.filter(p => {
        const watts = getPsuWattage(p)
        if (watts > 0) {
          return watts >= minWattage
        }
        return true
      })

      if (compatiblePsus.length === 0) {
        throw new Error(`ไม่พบ Power Supply (PSU) ที่มีกำลังไฟเพียงพอ (ขั้นต่ำ ${minWattage}W) ในระบบคลังสินค้า กรุณาเพิ่มข้อมูล PSU`)
      }

      let selectedPsu = findBestPart(compatiblePsus, targetPsuCost)
      if (selectedPsu) {
        myBuild.psu = selectedPsu
        remainingBudget -= selectedPsu.price
      }

      // ขั้นตอนที่ 7: เลือกเคส (CASE) สำหรับประกอบ
      const targetCaseCost = budget * shares.case
      const cases = byCat['case'] || []
      let selectedCase = findBestPart(cases, targetCaseCost)
      if (selectedCase) {
        myBuild.case = selectedCase
        remainingBudget -= selectedCase.price
      }

      // ขั้นตอนที่ 8: หากงบเหลือมากพอและเป็น CPU ตัวท็อปร้อนจัด ให้แถมระบบน้ำปิดระบายความร้อน (Liquid Cooler)
      const cpuName = selectedCpu.name.toLowerCase()
      const isHighEndCpu = cpuName.includes('i7') || cpuName.includes('i9') || cpuName.includes('ryzen 7') || cpuName.includes('ryzen 9') || cpuName.includes('ultra 7') || cpuName.includes('ultra 9')
      
      if (isHighEndCpu && budget >= 50000) {
        const lcs = byCat['liquid_cooler'] || []
        const targetLcCost = Math.max(remainingBudget * 0.5, 2000)
        let selectedLc = findBestPart(lcs, targetLcCost)
        if (selectedLc && selectedLc.price <= remainingBudget) {
          myBuild.liquid_cooler = selectedLc
          remainingBudget -= selectedLc.price
        } else {
          const ccs = byCat['cpu_cooler'] || []
          let selectedCc = findBestPart(ccs, targetLcCost)
          if (selectedCc && selectedCc.price <= remainingBudget) {
            myBuild.cpu_cooler = selectedCc
            remainingBudget -= selectedCc.price
          }
        }
      } else {
        // หาก CPU แยกขายแบบไม่มีซิงก์พัดลมมาในกล่อง (Tray) ให้แถมพัดลมเพิ่มความคุ้มค่า
        if (selectedCpu.name.toLowerCase().includes('tray')) {
          const ccs = byCat['cpu_cooler'] || []
          let selectedCc = findBestPart(ccs, 1000)
          if (selectedCc && selectedCc.price <= remainingBudget) {
            myBuild.cpu_cooler = selectedCc
            remainingBudget -= selectedCc.price
          }
        }
      }

      // บันทึกความคืบหน้าจัดสเปกลงในอุปกรณ์จัดเก็บของเบราว์เซอร์
      localStorage.setItem('myCustomBuild', JSON.stringify(myBuild))

      // แปลงชื่อวัตถุประสงค์เพื่อนำไปเขียนแสดงในกล่องข้อความภาษาไทย
      const purposeThai = {
        gaming: 'เน้นเล่นเกมลื่นไหล (Gaming Beast)',
        work: 'ทำงานตัดต่อกราฟิก / 3D / เขียนโค้ด',
        office: 'ทำงานทั่วไป / เรียนออนไลน์ (เน้นประหยัด)',
        streaming: 'เล่นเกม + สตรีมมิ่ง + แคสเกม'
      }

      // บันทึกคำแนะนำสเปกที่แนะนำเพื่อพรีวิวนำเสนอแบบ UI พรีเมียม
      aiRecommended.value = {
        budget: budget,
        total: totalBuildPrice.value,
        purpose: purposeThai[purpose],
        cpu: selectedCpu.name,
        gpu: selectedGpu ? selectedGpu.name : 'การ์ดจอออนบอร์ด (Integrated Graphics)',
        mb: selectedMb ? selectedMb.name : null,
        ram: selectedRam ? selectedRam.name : null,
        m2: selectedM2 ? selectedM2.name : (myBuild.ssd ? myBuild.ssd.name : null),
        psu: selectedPsu ? selectedPsu.name : null,
        case: selectedCase ? selectedCase.name : null,
        cooler: myBuild.liquid_cooler ? myBuild.liquid_cooler.name : (myBuild.cpu_cooler ? myBuild.cpu_cooler.name : null)
      }

      // แสดงการแจ้งเตือนสไตล์พรีเมียม
      showToast(
        'AI จัดสเปกคอมให้แล้ว!',
        `ระบบประมวลผลสเปกที่คุ้มค่าที่สุดในงบ ฿${budget.toLocaleString()} เรียบร้อยแล้ว`,
        'success'
      )
    } catch (err) {
      console.error(err)
      showToast('การจัดสเปกขัดข้อง', err.message || 'เกิดข้อผิดพลาดในการประมวลผลความเข้ากันได้อุปกรณ์', 'danger')
    } finally {
      aiLoading.value = false
    }
  }, 1000)
}

// ----------------------------------------------------
// [8] การตั้งค่าอินเทอร์เฟซแสดงผล Toast (Toast Configuration)
// ----------------------------------------------------
const toast = reactive({
  show: false,
  title: '',
  message: '',
  type: 'success'
})

// ฟังก์ชันเรียกใช้หน้าต่างแจ้งเตือนสไลด์ขึ้นข้างจอ
const showToast = (title, message, type = 'success') => {
  toast.title = title
  toast.message = message
  toast.type = type
  toast.show = true
  setTimeout(() => {
    toast.show = false
  }, 4000) // หายไปเองเมื่อครบ 4 วินาที
}

// ----------------------------------------------------
// [9] อาร์เรย์เก็บฐานข้อมูลสินค้าทั้งหมด (Master DB Products)
// ----------------------------------------------------
const productDb = ref([]) // เริ่มต้นด้วยว่างเปล่า และดึงค่าจาก Node.js MySQL API ตอนโหลดหน้าเว็บ

// ตัวช่วยนับว่าอุปกรณ์ในแต่ละหมวดหมู่คลังสินค้าในฐานมีจำนวนเท่าใด
const getCategoryCount = (catId) => {
  if (!productDb.value) return 0
  return productDb.value.filter(p => p.category === catId).length
}

// ค้นหาแบรนด์ของสินค้าในหมวดหมู่ที่ทำงานอยู่ เพื่อนำไปวาดปุ่มเลือกแบรนด์ฟิลเตอร์
const availableBrands = computed(() => {
  if (!productDb.value) return []
  const prods = productDb.value.filter(p => p.category === activeCategory.value)
  const brands = prods.map(p => p.brand)
  return [...new Set(brands)] // ลบชื่อแบรนด์ซ้ำซ้อน
})

// ค้นหารุ่นซีรีส์ที่พร้อมคัดเลือก (เฉพาะ CPU / GPU) เพื่อวาดแท็บฟิลเตอร์
const availableSeries = computed(() => {
  if (!productDb.value) return []
  const prods = productDb.value.filter(p => p.category === activeCategory.value)
  const seriesList = prods.map(p => p.series).filter(s => s)
  return [...new Set(seriesList)] // ลบซีรีส์ซ้ำซ้อน
})

// เคลียร์การค้นหาของฝั่งขวา
const resetSearchFilters = () => {
  productSearch.value = ''
  selectedBrand.value = ''
  selectedSeries.value = ''
}

// สลับหมวดหมู่สินค้าหลักจากแถบเมนูด้านซ้าย
const selectCategorySlot = (catId) => {
  activeCategory.value = catId
  resetSearchFilters() // ล้างค่าค้นหาเดิมเมื่อย้ายหมวดหมู่เพื่อการแสดงผลสินค้าที่ถูกต้อง
}


// ตรวจสอบว่าสินค้า ID นี้ถูกเพิ่มลงในสเปกคอมพิวเตอร์ปัจจุบันแล้วหรือไม่
const isSelectedInBuild = (prodId) => {
  const slot = activeCategory.value
  return myBuild[slot] && myBuild[slot].id === prodId
}

// ฟังก์ชันเพิ่มสินค้าที่เลือกลงในช่องหมวดหมู่อุปกรณ์ปัจจุบัน
const addProductToSlot = (prod) => {
  const slot = prod.category
  
  if (myBuild[slot] && myBuild[slot].id === prod.id) {
    // หากคลิกที่สินค้าเดิมที่ถูกเพิ่มไปแล้ว ให้ถอดสินค้าออกจากสเปก (Toggle off)
    myBuild[slot] = null
    showToast(
      'นำสินค้าออก!',
      `ถอด ${prod.name} ออกจากสเปกของคุณแล้ว`,
      'danger'
    )
  } else {
    // เพิ่มหรือเปลี่ยนสินค้าในช่องหมวดหมู่นั้น (Slot in)
    myBuild[slot] = prod
    showToast(
      'เพิ่มเข้าสเปกแล้ว!',
      `เพิ่ม ${prod.name} เข้าในสเปกคอมพิวเตอร์ของคุณแล้ว`,
      'success'
    )
  }
  
  // บันทึกสเปกคอมพิวเตอร์ที่จัดไว้ล่าสุดลงใน Local Storage เพื่อไม่ให้ข้อมูลหายเมื่อรีเฟรชหน้าเว็บ
  localStorage.setItem('myCustomBuild', JSON.stringify(myBuild))
}

// ฟังก์ชันนำชิ้นส่วนอุปกรณ์ออกจากช่อง (Remove)
const removeSlotProduct = (slotId) => {
  const item = myBuild[slotId]
  if (item) {
    myBuild[slotId] = null
    showToast(
      'นำสินค้าออก!',
      `ถอด ${item.name} ออกจากสเปกของคุณแล้ว`,
      'danger'
    )
    localStorage.setItem('myCustomBuild', JSON.stringify(myBuild))
  }
}

// ฟังก์ชันล้างรายการอุปกรณ์ทั้งหมดที่จัดไว้ (Clear all specs)
const clearAllSpecs = () => {
  if (confirm('คุณต้องการล้างรายการสเปกคอมพิวเตอร์ที่จัดไว้ทั้งหมดใช่หรือไม่?')) {
    for (const slot in myBuild) {
      myBuild[slot] = null
    }
    localStorage.removeItem('myCustomBuild')
    showToast(
      'ล้างสเปกสำเร็จ!',
      'รายการจัดสเปกคอมพิวเตอร์ทั้งหมดถูกล้างแล้ว',
      'success'
    )
  }
}

// ฟังก์ชันล้างผลลัพธ์คำแนะนำจาก AI และรีเซ็ตค่าการตั้งค่าต่างๆ กลับเป็นค่าเริ่มต้น
const clearAiBuild = () => {
  if (confirm('คุณต้องการล้างคำแนะนำและสเปกคอมพิวเตอร์ที่จัดโดย AI ทั้งหมดใช่หรือไม่?')) {
    aiRecommended.value = null
    for (const slot in myBuild) {
      myBuild[slot] = null
    }
    localStorage.removeItem('myCustomBuild')
    // รีเซ็ตการตั้งค่า Dropdown ของงบประมาณและวัตถุประสงค์
    aiBudget.value = '30000'
    aiPurpose.value = 'gaming'
    isCustomBudget.value = false
    showToast(
      'ล้างข้อมูลสำเร็จ!',
      'คำแนะนำและตัวช่วยจัดสเปกคอมพิวเตอร์ของ AI ถูกรีเซ็ตแล้ว',
      'success'
    )
  }
}

// สั่งพิมพ์หน้าจอแสดงผลใบเสนอราคาสเปกคอมพิวเตอร์ (Print Quotation)
const printSpec = () => {
  printingMode.value = true
  
  // หน่วงเวลาเล็กน้อยเพื่อให้ระบบปรับรูปแบบ UI สำหรับการพิมพ์ให้เสร็จสิ้นก่อนเปิดหน้าต่างสั่งพิมพ์
  setTimeout(() => {
    window.print()
    printingMode.value = false
  }, 150)
}

// ฟังก์ชันนำอุปกรณ์ทุกชิ้นที่จัดสเปกไว้โยนลงตะกร้าสินค้าของระบบหลัก
const addAllToCart = () => {
  if (hasCompatibilityIssues.value) {
    if (!confirm('แจ้งเตือน: สเปกคอมพิวเตอร์ของคุณมีอุปกรณ์บางชิ้นที่อาจเข้ากันไม่ได้ หรือกำลังไฟ PSU ไม่เพียงพอ ต้องการหยิบใส่ตะกร้าทั้งหมดต่อไปหรือไม่?')) {
      return
    }
  }

  let count = 0
  for (const slot in myBuild) {
    if (myBuild[slot]) {
      const prod = myBuild[slot]
      window.dispatchEvent(new CustomEvent('add-to-cart', { 
        detail: {
          name: prod.name,
          price: prod.price
        } 
      }))
      count++
    }
  }
  
  showToast(
    'นำส่งตะกร้าสำเร็จ!',
    `ย้ายอุปกรณ์รวมทั้งสิ้น ${count} ชิ้น เข้าสู่ตะกร้าสินค้าหลักแล้ว!`,
    'success'
  )
}

// Computed Property สำหรับกรองและเรียงลำดับสินค้าเพื่อนำมาแสดงในตาราง (Product Grid)
const filteredProducts = computed(() => {
  if (!productDb.value) return []
  let items = productDb.value.filter(p => p.category === activeCategory.value)
  
  // ระบบคัดกรองความเข้ากันได้แบบอัจฉริยะ (Smart Compatibility Auto-Filtering)
  if (filterCompatibleOnly.value) {
    // 1. กรอง Socket ของ CPU และ Motherboard ให้ตรงกัน
    if (activeCategory.value === 'motherboard' && myBuild.cpu) {
      const cpuSocket = (myBuild.cpu.socket || '').trim().toLowerCase()
      if (cpuSocket) {
        items = items.filter(p => (p.socket || '').trim().toLowerCase() === cpuSocket)
      }
    } else if (activeCategory.value === 'cpu' && myBuild.motherboard) {
      const mbSocket = (myBuild.motherboard.socket || '').trim().toLowerCase()
      if (mbSocket) {
        items = items.filter(p => (p.socket || '').trim().toLowerCase() === mbSocket)
      }
    }
    
    // 2. กรองมาตรฐานแรม (DDR) ระหว่าง Motherboard กับ RAM
    if (activeCategory.value === 'ram' && myBuild.motherboard) {
      const mbDdr = getDdrVersion(myBuild.motherboard)
      if (mbDdr) {
        items = items.filter(p => getDdrVersion(p) === mbDdr)
      }
    } else if (activeCategory.value === 'motherboard' && myBuild.ram) {
      const ramDdr = getDdrVersion(myBuild.ram)
      if (ramDdr) {
        items = items.filter(p => getDdrVersion(p) === ramDdr)
      }
    }
  }
  
  // การกรองด้วยข้อความค้นหา (Search input filter)
  if (productSearch.value) {
    const q = productSearch.value.toLowerCase()
    items = items.filter(p => 
      p.name.toLowerCase().includes(q) || 
      (p.specs && p.specs.toLowerCase().includes(q)) ||
      p.brand.toLowerCase().includes(q)
    )
  }
  
  // การกรองด้วยแบรนด์ (Brand filter)
  if (selectedBrand.value) {
    items = items.filter(p => p.brand === selectedBrand.value)
  }

  // การกรองด้วยซีรีส์ (Series filter)
  if (selectedSeries.value) {
    items = items.filter(p => p.series === selectedSeries.value)
  }

  // กลไกการจัดเรียงลำดับข้อมูล (Sorting mechanism)
  if (sortBy.value === 'name') {
    items.sort((a, b) => a.name.localeCompare(b.name, 'th'))
  } else if (sortBy.value === 'price-asc') {
    items.sort((a, b) => a.price - b.price)
  } else if (sortBy.value === 'price-desc') {
    items.sort((a, b) => b.price - a.price)
  }
  
  return items
})

// ดึงข้อมูลสินค้าจากฐานข้อมูล และโหลดสเปกที่เคยจัดไว้จาก Local Storage ทันทีที่เข้าหน้านี้
onMounted(async () => {
  try {
    const [partsRes, statsRes] = await Promise.all([
      axios.get('/api/pc-parts'),
      axios.get('/api/reviews-stats')
    ])
    productDb.value = partsRes.data
    if (statsRes.data && statsRes.data.success) {
      reviewsStats.value = statsRes.data.stats || {}
    }
  } catch (error) {
    console.error('Failed to fetch data:', error)
    showToast('ดึงข้อมูลล้มเหลว', 'ไม่สามารถเชื่อมต่อกับฐานข้อมูลอุปกรณ์คอมพิวเตอร์ได้', 'danger')
  }

  const savedBuild = localStorage.getItem('myCustomBuild')
  if (savedBuild) {
    try {
      const parsed = JSON.parse(savedBuild)
      for (const slot in parsed) {
        if (parsed[slot]) {
          myBuild[slot] = parsed[slot]
        }
      }
    } catch (e) {
      console.error('Failed to parse cached custom build', e)
    }
  }
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
  opacity: 0.03;
  mix-blend-mode: multiply;
  animation: float-blob 20s infinite alternate ease-in-out;
}

.blob-purple {
  top: 10%;
  left: 15%;
  width: 450px;
  height: 450px;
  background: #8b5cf6;
}

.blob-pink {
  bottom: 10%;
  right: 15%;
  width: 500px;
  height: 500px;
  background: #2563eb;
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

.text-muted-custom {
  color: #64748b;
}

.text-primary-custom {
  color: #0ea5e9;
}

.letter-spacing-1 {
  letter-spacing: 1px;
}

/* Sidebar and slots styling */
.sidebar-card {
  background: #ffffff;
  border-radius: 1.25rem;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.03) !important;
  overflow: hidden;
  border: 1px solid #eef2f6 !important;
}

.bg-light-custom {
  background-color: #f8fafc;
}

.btn-action-sm {
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.5rem 0.75rem;
  border-radius: 0.75rem;
  transition: all 0.2s ease;
}

.btn-primary-custom {
  background: linear-gradient(135deg, #0ea5e9, #2563eb);
  color: white;
  border: none;
}

.btn-primary-custom:hover:not(:disabled) {
  background: linear-gradient(135deg, #0284c7, #1d4ed8);
  transform: translateY(-1px);
}

.sidebar-menu-list {
  max-height: 640px;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0.5rem;
}

/* Custom Scrollbar for Sidebar menu list */
.sidebar-menu-list::-webkit-scrollbar {
  width: 5px;
}
.sidebar-menu-list::-webkit-scrollbar-track {
  background: transparent;
}
.sidebar-menu-list::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
.sidebar-menu-list::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.category-slot-item {
  position: relative;
  cursor: pointer;
  background-color: #ffffff;
  border: 1px solid #f1f5f9;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 4px rgba(15, 23, 42, 0.01);
  overflow: hidden;
  flex-shrink: 0;
}

.category-slot-item:hover {
  background-color: #f8fafc;
  border-color: #e2e8f0;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03);
}

.slot-indicator {
  position: absolute;
  left: 0;
  top: 15%;
  bottom: 15%;
  width: 4px;
  border-radius: 0 4px 4px 0;
  background-color: transparent;
  transition: background-color 0.2s ease;
}

.active-slot {
  background-color: #f0f9ff !important;
  border-color: #bae6fd !important;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.06) !important;
}

.active-slot .slot-indicator {
  background-color: #0ea5e9;
}

.slot-icon-box {
  width: 36px;
  height: 36px;
  border-radius: 0.6rem;
  background-color: #f8fafc;
  border: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.05rem;
  color: #64748b;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.active-slot .slot-icon-box {
  background-color: #e0f2fe;
  color: #0ea5e9;
  border-color: #bae6fd;
}

.category-slot-item.has-product .slot-icon-box {
  background-color: #e0f2fe;
  color: #0284c7;
  border-color: #bae6fd;
}

.slot-cat-name {
  color: #64748b;
  font-size: 0.72rem !important;
  letter-spacing: 0.3px;
  text-transform: uppercase;
}

.badge-brand-pill {
  font-size: 0.62rem;
  background-color: #f1f5f9;
  color: #475569;
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  font-weight: 600;
  border: 1px solid #e2e8f0;
  text-transform: uppercase;
}

.active-slot .badge-brand-pill {
  background-color: #e0f2fe;
  color: #0369a1;
  border-color: #bae6fd;
}

.selected-prod-detail {
  width: 100%;
  overflow: hidden;
}

.selected-prod-name {
  color: #0f172a !important;
  font-size: 0.82rem !important;
  line-height: 1.45;
  margin-top: 2px;
}

.price-text {
  color: #0ea5e9;
  font-weight: 700;
}

.text-placeholder {
  color: #94a3b8 !important;
  font-style: italic;
}

.hover-danger-bg:hover {
  background-color: #fee2e2 !important;
}

/* Right content card and grid */
.content-card {
  background: #ffffff;
  border-radius: 1.25rem;
  padding: 2rem;
  border: 1px solid #eef2f6 !important;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.03) !important;
}

.header-icon-box {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #f0f9ff;
  color: #0ea5e9;
  display: flex;
  align-items: center;
  justify-content: center;
}

.filter-input {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 50px;
  padding: 0.55rem 1.25rem;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.filter-input:focus {
  border-color: #0ea5e9;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.15) !important;
}

.filter-select {
  border: 1px solid #e2e8f0;
  border-radius: 50px;
  padding: 0.55rem 1.25rem;
  font-size: 0.9rem;
}

.filter-select:focus {
  border-color: #0ea5e9;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.15) !important;
}

.btn-pill {
  border-radius: 50px;
  font-size: 0.8rem;
  padding: 0.35rem 1rem;
  font-weight: 500;
  transition: all 0.25s ease;
}

.btn-outline-secondary {
  border-color: #e2e8f0;
  color: #475569;
}
.btn-outline-secondary:hover {
  background-color: #f1f5f9;
  border-color: #cbd5e1;
  color: #0f172a;
}

.btn-danger {
  background-color: #fee2e2;
  border-color: #fecaca;
  color: #ef4444;
}
.btn-danger:hover {
  background-color: #fca5a5;
  border-color: #fca5a5;
  color: #ef4444;
}

/* Product cards inside builder */
.product-item-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  transition: all 0.3s ease;
}

.product-item-card:hover {
  transform: translateY(-4px);
  border-color: #bae6fd;
  box-shadow: 0 12px 24px rgba(14, 165, 233, 0.08);
}

.selected-in-build {
  border-color: #22c55e !important;
  background-color: #f0fdf4 !important;
}

.blueprint-img-placeholder {
  position: relative;
  width: 100%;
  height: 120px;
  border-radius: 0.75rem;
  background: radial-gradient(circle at center, #1e293b, #0f172a);
  border: 1px solid rgba(255, 255, 255, 0.05);
  overflow: hidden;
}

.blueprint-inner {
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 15px 15px;
}

.blueprint-icon {
  font-size: 2.2rem;
  color: #0ea5e9;
  opacity: 0.85;
  filter: drop-shadow(0 0 8px rgba(14, 165, 233, 0.5));
}

.blueprint-text {
  font-size: 0.6rem;
  color: rgba(255, 255, 255, 0.3);
  font-family: monospace;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.badge-brand-item {
  position: absolute;
  top: 8px;
  left: 8px;
  font-size: 0.65rem;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.badge-socket {
  border-radius: 6px;
  padding: 0.2rem 0.5rem;
  font-weight: 500;
}

.product-card-title {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
  min-height: 3rem;
}

.product-card-specs {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
  min-height: 2.8rem;
}

.btn-add-plus {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.btn-outline-danger {
  border-color: #fee2e2;
  color: #ef4444;
  background-color: #fff5f5;
}

.btn-outline-danger:hover {
  background-color: #ef4444;
  border-color: #ef4444;
  color: white;
}

.btn-success {
  background-color: #22c55e;
  border-color: #22c55e;
  color: white;
}

/* Toast Notification Premium Styling */
.toast-custom {
  background: rgba(255, 255, 255, 0.85) !important;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.4) !important;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2) !important;
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

/* Toast Transitions */
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

/* Print Specific Rules */
.print-only-header,
.print-only-footer {
  display: none;
}

@media print {
  /* Set layout to print neatly */
  body * {
    visibility: hidden;
  }
  
  .print-content, .print-content * {
    visibility: visible;
  }
  
  .print-content {
    position: absolute;
    left: 0;
    top: 0;
    width: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
  }
  
  .no-print {
    display: none !important;
  }
  
  .print-full-width {
    width: 100% !important;
    flex: 0 0 100% !important;
    max-width: 100% !important;
  }
  
  .sidebar-card {
    border: none !important;
    box-shadow: none !important;
  }
  
  .print-only-header {
    display: block !important;
  }
  
  .print-only-footer {
    display: block !important;
  }
  
  .category-slot-item {
    border-bottom: 1px solid #dee2e6 !important;
    background-color: transparent !important;
  }
  
  /* Remove scroll limitations */
  .sidebar-menu-list {
    max-height: none !important;
    overflow: visible !important;
  }
  
  .bg-light-custom {
    background-color: #f8f9fa !important;
  }
  
  /* Add custom headers */
  .page-wrapper {
    background: #ffffff !important;
  }
}

/* AI PC Builder Assistant Styling */
.bg-cyber-assistant {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%) !important;
  border: 1px solid rgba(236, 72, 153, 0.25) !important;
  box-shadow: 0 15px 35px rgba(236, 72, 153, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
  overflow: visible !important;
}

.border-glow-pink {
  border-color: rgba(236, 72, 153, 0.4) !important;
  box-shadow: 0 0 15px rgba(236, 72, 153, 0.2) !important;
}

.assistant-neon-bg {
  position: absolute;
  top: -50%;
  right: -20%;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, transparent 70%);
  z-index: 0;
  pointer-events: none;
}

.ai-avatar-glow {
  width: 48px;
  height: 48px;
  background: rgba(14, 165, 233, 0.1);
  border: 1px solid rgba(14, 165, 233, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 15px rgba(14, 165, 233, 0.2);
  animation: float-ai-avatar 4s infinite ease-in-out;
}

.ai-avatar-glow i {
  animation: pulse-avatar-text 2s infinite ease-in-out;
}

@keyframes float-ai-avatar {
  0% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
  100% { transform: translateY(0); }
}

@keyframes pulse-avatar-text {
  0% { opacity: 0.8; }
  50% { opacity: 1; text-shadow: 0 0 8px rgba(14, 165, 233, 0.6); }
  100% { opacity: 0.8; }
}

.dark-select {
  background-color: rgba(15, 23, 42, 0.8) !important;
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
  color: #f8fafc !important;
  font-size: 0.8rem !important;
}

.dark-select:focus {
  border-color: #ec4899 !important;
  box-shadow: 0 0 8px rgba(236, 72, 153, 0.3) !important;
}

.dark-select option {
  background-color: #0f172a !important;
  color: #f8fafc !important;
}

.text-white-80 {
  color: rgba(255, 255, 255, 0.8) !important;
}

.text-cyan {
  color: #0ea5e9 !important;
}

.bg-black {
  background-color: #000000 !important;
}

.bg-opacity-35 {
  --bs-bg-opacity: 0.35;
}

.custom-dropdown-menu {
  background-color: rgba(15, 23, 42, 0.95) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5) !important;
}

.custom-dropdown-menu .dropdown-item {
  color: rgba(248, 250, 252, 0.8) !important;
  font-size: 0.8rem !important;
  transition: all 0.2s ease;
  border-radius: 6px;
}

.custom-dropdown-menu .dropdown-item:hover,
.custom-dropdown-menu .dropdown-item:focus {
  background-color: rgba(236, 72, 153, 0.2) !important;
  color: #ffffff !important;
}

.min-w-0 {
  min-width: 0 !important;
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

/* Smart Compatibility Checker premium design aesthetics */
.compatibility-widget {
  background: linear-gradient(180deg, #ffffff, #f8fafc);
  border-bottom: 1px solid #e2e8f0;
}

.compat-ai-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(14, 165, 233, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}

.compat-status-row {
  transition: all 0.25s ease;
}

.compat-status-row:hover {
  transform: translateX(2px);
  box-shadow: 0 4px 10px rgba(15, 23, 42, 0.02);
}

.compat-status-icon {
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.progress {
  background-color: #f1f5f9;
  border: 1px solid #e2e8f0;
}

.progress-bar {
  transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
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
