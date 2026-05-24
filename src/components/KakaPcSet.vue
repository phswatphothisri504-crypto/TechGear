<template>
  <div class="page-wrapper">
    <!-- Glowing background elements for premium feel -->
    <div class="glowing-bg">
      <div class="blob blob-cyan"></div>
      <div class="blob blob-blue"></div>
      <div class="blob blob-purple"></div>
    </div>

    <!-- Navigation Bar -->
    <KakaNavbar />

    <div class="container py-5 content-container">
      <!-- Breadcrumb navigation -->
      <nav aria-label="breadcrumb" class="mb-4 animate-fade-in">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <router-link to="/" class="text-decoration-none text-muted hover-cyan">หน้าแรก</router-link>
          </li>
          <li class="breadcrumb-item active text-dark fw-semibold" aria-current="page">คอมพิวเตอร์เซต</li>
        </ol>
      </nav>

      <!-- Page Header -->
      <div class="text-center mb-5 hero-section animate-fade-in">
        <h1 class="fw-bold title-gradient mb-2">คอมพิวเตอร์เซตประกอบสำเร็จรูป</h1>
        <p class="text-muted-custom fs-6 max-w-2xl mx-auto">
          รวมเซตคอมพิวเตอร์ประกอบสำเร็จที่คัดสรรอุปกรณ์คุณภาพสูง จัดสเปกโดยผู้เชี่ยวชาญของ TechGear
          ผ่านการทดสอบเสถียรภาพความร้อนและความแรงระดับ 100% เล่นเกมสตรีมมิ่ง หรือทำงานระดับมือโปรได้อย่างราบรื่น
        </p>
      </div>

      <!-- Centered Category Selector Tabs (Full Width Dock) -->
      <div class="d-flex justify-content-center mb-4 animate-fade-in">
        <div class="category-tabs-container d-flex gap-1 justify-content-center">
          <button 
            v-for="cat in useCaseCategories" 
            :key="cat.id" 
            class="category-tab-btn"
            :class="{ 'active-tab': selectedCategory === cat.id }"
            @click="selectedCategory = cat.id"
          >
            <i :class="getCategoryIcon(cat.id)" class="me-2"></i>
            <span>{{ cat.name }}</span>
          </button>
        </div>
      </div>

      <!-- Filters & Sorting Control Center -->
      <div class="filter-control-card glass-card p-4 mb-5 border-glow-cyan animate-fade-in">
        <div class="row g-3 align-items-center">
          <!-- Search input -->
          <div class="col-md-8 col-12">
            <div class="position-relative">
              <input 
                v-model="searchQuery" 
                type="text" 
                class="form-control search-filter shadow-none ps-4 pe-5" 
                placeholder="ค้นหาชื่อเซตคอมฯ หรือชิ้นส่วน (เช่น RTX 4060)..."
              >
              <i class="bi bi-search position-absolute top-50 end-0 translate-middle-y me-3 text-secondary"></i>
            </div>
          </div>

          <!-- Sort selection -->
          <div class="col-md-4 col-12 text-md-end">
            <div class="d-flex gap-2 justify-content-md-end">
              <select v-model="sortBy" class="form-select sort-select shadow-none w-100" style="max-width: 220px;">
                <option value="popular">ยอดนิยมอันดับต้น</option>
                <option value="price-asc">ราคา: ต่ำ - สูง</option>
                <option value="price-desc">ราคา: สูง - ต่ำ</option>
              </select>
              <button v-if="searchQuery || selectedCategory !== 'all'" @click="resetFilters" class="btn btn-light-custom" title="ล้างตัวกรอง">
                <i class="bi bi-arrow-clockwise text-dark"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Horizontal divider and hardware brand filters -->
        <div class="border-top mt-3 pt-3">
          <div class="row g-2 align-items-center">
            <div class="col-auto">
              <span class="fs-9 text-muted fw-bold me-2">ค่ายหน่วยประมวลผล (CPU):</span>
            </div>
            <div class="col-auto">
              <div class="d-flex gap-2">
                <button 
                  class="btn btn-pill-sm"
                  :class="selectedCpuBrand === 'all' ? 'btn-danger-custom' : 'btn-outline-secondary-custom'"
                  @click="selectedCpuBrand = 'all'"
                >
                  ทั้งหมด
                </button>
                <button 
                  class="btn btn-pill-sm d-flex align-items-center gap-1"
                  :class="selectedCpuBrand === 'Intel' ? 'btn-intel' : 'btn-outline-secondary-custom'"
                  @click="selectedCpuBrand = 'Intel'"
                >
                  <i class="bi bi-cpu"></i> Intel
                </button>
                <button 
                  class="btn btn-pill-sm d-flex align-items-center gap-1"
                  :class="selectedCpuBrand === 'AMD' ? 'btn-amd' : 'btn-outline-secondary-custom'"
                  @click="selectedCpuBrand = 'AMD'"
                >
                  <i class="bi bi-cpu"></i> AMD
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- PC Sets Display Grid -->
      <div v-if="filteredPcSets.length > 0" class="row g-4 mb-5 animate-fade-in">
        <div v-for="pcSet in filteredPcSets" :key="pcSet.id" class="col-xl-4 col-md-6 col-12">
          <div class="glass-card pc-set-card h-100 d-flex flex-column justify-content-between">
            
            <!-- Top Card Decorative Vector Graphics (Blueprint layout) -->
            <div class="pc-set-graphic-container cursor-pointer animate-hover-pulse" @click="openReviews(pcSet.id, pcSet.name)" title="คลิกเพื่อดูรายละเอียดสินค้าและรีวิว">
              <div class="cyber-grid"></div>
              
              <!-- Premium Badge -->
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
                <!-- Grid background inside the SVG -->
                <path d="M 0,20 L 200,20 M 0,40 L 200,40 M 0,60 L 200,60 M 0,80 L 200,80 M 0,100 L 200,100 M 0,120 L 200,120 M 0,140 L 200,140 M 0,160 L 200,160 M 0,180 L 200,180 M 0,200 L 200,200" fill="none" stroke="rgba(14,165,233,0.04)" stroke-width="1" />
                <path d="M 20,0 L 20,220 M 40,0 L 40,220 M 60,0 L 60,220 M 80,0 L 80,220 M 100,0 L 100,220 M 120,0 L 120,220 M 140,0 L 140,220 M 160,0 L 160,220 M 180,0 L 180,220" fill="none" stroke="rgba(14,165,233,0.04)" stroke-width="1" />

                <!-- The PC Case Outer Chassis -->
                <rect x="40" y="30" width="120" height="160" rx="10" fill="url(#blueprintLines)" stroke="url(#neonGlow)" stroke-width="2" />
                
                <!-- Tempered Glass Window Inner Border -->
                <rect x="48" y="38" width="104" height="134" rx="6" fill="none" stroke="rgba(14, 165, 233, 0.2)" stroke-width="1" stroke-dasharray="4 2" />
                
                <!-- Motherboard Backplate Plate -->
                <rect x="54" y="44" width="70" height="85" rx="3" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1" />

                <!-- CPU Cooler Fan circles or Block -->
                <g transform="translate(89, 65)">
                  <!-- Heatsink/Cooler block -->
                  <rect x="-20" y="-20" width="40" height="40" rx="5" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1" />
                  <circle cx="0" cy="0" r="14" fill="none" stroke="url(#neonGlow)" stroke-width="1.5" />
                  <!-- Rotating fan blade indicators -->
                  <path d="M -10,-10 L 10,10 M -10,10 L 10,-10" stroke="rgba(255,255,255,0.3)" stroke-width="1" />
                </g>
                
                <!-- RAM sticks -->
                <g transform="translate(116, 48)">
                  <rect x="0" y="0" width="3" height="22" rx="1" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="1" />
                  <rect x="5" y="0" width="3" height="22" rx="1" fill="none" stroke="#2563eb" stroke-width="1" />
                  <rect x="10" y="0" width="3" height="22" rx="1" fill="none" stroke="#0ea5e9" stroke-width="1" />
                </g>

                <!-- Graphics Card (Horizontal bar covering motherboard bottom) -->
                <g transform="translate(50, 105)">
                  <!-- GPU shroud -->
                  <rect x="0" y="0" width="85" height="22" rx="4" fill="rgba(6, 11, 19, 0.6)" stroke="url(#neonGlow)" stroke-width="1.5" />
                  <!-- GPU branding text -->
                  <text x="8" y="14" fill="#ffffff" font-size="6" font-family="'Courier New', monospace" font-weight="bold" opacity="0.8">GEFORCE RTX</text>
                  <!-- Dual Fan indicators on GPU -->
                  <circle cx="58" cy="11" r="7" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="1" />
                  <circle cx="74" cy="11" r="7" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="1" />
                </g>
                
                <!-- PSU Basement Shroud (Bottom compartment) -->
                <rect x="40" y="150" width="120" height="40" rx="4" fill="rgba(6, 11, 19, 0.4)" stroke="rgba(14, 165, 233, 0.3)" stroke-width="1" />
                <path d="M 40,150 L 160,150" stroke="rgba(14, 165, 233, 0.5)" stroke-width="1" />
                <!-- PSU Fan vent lines -->
                <line x1="55" y1="160" x2="55" y2="180" stroke="rgba(255,255,255,0.15)" stroke-width="1" />
                <line x1="60" y1="160" x2="60" y2="180" stroke="rgba(255,255,255,0.15)" stroke-width="1" />
                <line x1="65" y1="160" x2="65" y2="180" stroke="rgba(255,255,255,0.15)" stroke-width="1" />
                <line x1="70" y1="160" x2="70" y2="180" stroke="rgba(255,255,255,0.15)" stroke-width="1" />
                <!-- TechGear watermark brand in the case -->
                <text x="90" y="174" fill="rgba(255,255,255,0.2)" font-size="8" font-family="'Kanit', sans-serif" font-weight="bold">TechGear</text>
                
                <!-- Case Front Intake Fan (Circular glowing light on the right edge/front) -->
                <g transform="translate(160, 60)">
                  <path d="M 0,-15 A 15,15 0 0,1 0,15" fill="none" stroke="rgba(14, 165, 233, 0.3)" stroke-width="2" stroke-dasharray="2 2" />
                </g>
                <g transform="translate(160, 110)">
                  <path d="M 0,-15 A 15,15 0 0,1 0,15" fill="none" stroke="rgba(14, 165, 233, 0.3)" stroke-width="2" stroke-dasharray="2 2" />
                </g>
              </svg>
            </div>

            <!-- Card Body Content -->
            <div class="card-body-custom p-4 d-flex flex-column justify-content-between flex-grow-1">
              <div>
                <!-- Brand logo and Platform Badge -->
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <div class="platform-chip d-flex align-items-center gap-1" :class="pcSet.cpuBrand === 'Intel' ? 'bg-intel-subtle' : 'bg-amd-subtle'">
                    <i class="bi bi-cpu-fill" :class="pcSet.cpuBrand === 'Intel' ? 'text-intel' : 'text-amd'"></i>
                    <span :class="pcSet.cpuBrand === 'Intel' ? 'text-intel' : 'text-amd'">{{ pcSet.cpuBrand }} Platform</span>
                  </div>
                  <span class="warranty-badge fs-9 fw-semibold"><i class="bi bi-shield-check me-1"></i> ประกัน 3 ปีเต็ม</span>
                </div>

                <!-- Remaining Stock Count for Prebuilt PC Sets -->
                <div class="mb-2 d-flex justify-content-start">
                  <span class="badge bg-danger-subtle text-danger rounded-pill px-2.5 py-1 fs-9 fw-bold d-inline-flex align-items-center gap-1">
                    <i class="bi bi-fire"></i> เหลือสินค้า: {{ (pcSet.db_id % 3) + 2 }} เซตสุดท้าย
                  </span>
                </div>

                <!-- Reviews & Ratings Badge -->
                <div class="d-flex align-items-center gap-2 mb-2 cursor-pointer hover-scale-small" @click="openReviews(pcSet.id, pcSet.name)" title="คลิกเพื่อดูรีวิว">
                  <div class="rating-badge-small d-inline-flex align-items-center gap-1 bg-warning-subtle text-warning px-2.5 py-0.5 rounded-pill fs-9 fw-bold">
                    <i class="bi bi-star-fill text-warning animate-pulse"></i>
                    <span>{{ reviewsStats[pcSet.id]?.avgRating || '5.0' }}</span>
                  </div>
                  <span class="text-secondary fs-9 fw-semibold">({{ reviewsStats[pcSet.id]?.totalReviews || 0 }} รีวิว)</span>
                </div>

                <!-- Set Title -->
                <h4 class="card-title-custom fw-bold text-dark mb-1 cursor-pointer hover-text-cyan-neon transition-colors" @click="openReviews(pcSet.id, pcSet.name)" title="คลิกเพื่อดูรายละเอียดสินค้าและรีวิว">{{ pcSet.name }}</h4>
                <p class="set-purpose-text text-muted-custom fs-8 mb-3">{{ pcSet.purpose }}</p>

                <!-- Detailed Parts Accordion/Dropdown -->
                <div class="specs-accordion mb-4">
                  <div 
                    class="specs-accordion-header py-2.5 px-2 border-bottom border-top d-flex justify-content-between align-items-center" 
                    :class="{ 'is-expanded': activeSpecsViews[pcSet.id] }"
                    @click="toggleSpecs(pcSet.id)"
                  >
                    <span class="fs-8 fw-semibold text-secondary d-flex align-items-center gap-2 accordion-title">
                      <i class="bi bi-hdd-network-fill icon-glow"></i> รายละเอียดชิ้นส่วนในเซต
                    </span>
                    <i class="bi chevron-icon" :class="activeSpecsViews[pcSet.id] ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
                  </div>
                  
                  <transition name="accordion-slide">
                    <div v-show="activeSpecsViews[pcSet.id]" class="specs-list-container my-2 py-2 px-3">
                      <div v-for="part in pcSet.partsList" :key="part.label" class="spec-part-row d-flex align-items-center justify-content-between py-2 fs-9">
                        <div class="d-flex align-items-center gap-2 text-secondary fw-medium">
                          <span class="part-icon-wrapper d-flex align-items-center justify-content-center">
                            <i :class="part.icon" class="part-icon"></i>
                          </span>
                          <span class="part-label">{{ part.label }}:</span>
                        </div>
                        <span class="part-value text-dark text-end fw-semibold text-truncate ms-2" style="max-width: 180px;" :title="part.name">
                          {{ part.name }}
                        </span>
                      </div>
                    </div>
                  </transition>
                </div>
              </div>

              <!-- Price, Installment and Call-to-actions -->
              <div class="mt-auto">
                <div class="d-flex justify-content-between align-items-baseline mb-3">
                  <div>
                    <span class="fs-9 text-muted d-block text-decoration-line-through">฿{{ (pcSet.original_price || pcSet.originalPrice || 0).toLocaleString('th-TH') }}</span>
                    <span class="h4 fw-bold text-danger">฿{{ (pcSet.price || 0).toLocaleString('th-TH') }}</span>
                  </div>
                  <span class="badge bg-danger-subtle text-danger rounded-pill px-2.5 py-1 fs-9 fw-bold">
                    ประหยัด ฿{{ ((pcSet.original_price || pcSet.originalPrice || 0) - (pcSet.price || 0)).toLocaleString('th-TH') }}
                  </span>
                </div>

                <!-- Installment Info -->
                <div class="installment-box py-2 px-3 rounded-3 mb-3 d-flex align-items-center gap-2 bg-light">
                  <i class="bi bi-credit-card-2-back-fill text-cyan-glow fs-8"></i>
                  <span class="fs-9 text-muted">ผ่อนชำระ <b>฿{{ Math.round((pcSet.price || 0) / 10).toLocaleString('th-TH') }}</b> / เดือน (0% นาน 10 เดือน)</span>
                </div>

                <!-- Action buttons -->
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

      <!-- Empty State -->
      <div v-else class="row mb-5 animate-fade-in">
        <div class="col-12 text-center py-5">
          <div class="empty-state-container glass-card p-5 max-w-2xl mx-auto border-glow-cyan">
            <div class="empty-icon-box mb-3">
              <i class="bi bi-search fs-1"></i>
            </div>
            <h4 class="fw-bold text-dark mb-2">ไม่พบชุดคอมพิวเตอร์เซตที่ตรงตามเงื่อนไข</h4>
            <p class="text-muted-custom mb-4">ลองปรับเปลี่ยนตัวกรอง ค้นหาแบรนด์อื่น หรือล้างค่าการค้นหาเพื่อค้นหาใหม่อีกครั้ง</p>
            <button @click="resetFilters" class="btn btn-action-cyan px-4 py-2 rounded-pill fw-bold">
              <i class="bi bi-arrow-clockwise me-2"></i>ล้างตัวกรองทั้งหมด
            </button>
          </div>
        </div>
      </div>

      <!-- Bottom Promotional Feature Section -->
      <div class="row g-4 mb-5 animate-fade-in">
        <div class="col-md-6 col-12">
          <div class="glass-card p-4 h-100 border-glow-cyan d-flex align-items-center">
            <div class="d-flex gap-3">
              <div class="promo-icon-box"><i class="bi bi-tools"></i></div>
              <div>
                <h5 class="fw-bold text-dark mb-1">ประกอบและจัดสายไฟฟรีทุกชุด</h5>
                <p class="text-muted-custom fs-8 m-0 lh-base">
                  ทุกชุดคอมพิวเตอร์เซตจาก TechGear จะได้รับการประกอบโดยช่างผู้เชี่ยวชาญระดับมือโปร จัดสายไฟสวยงามเป็นระเบียบเรียบร้อย (Cable Management) 
                  เพื่อการไหลเวียนของลมที่ดีที่สุดภายในเครื่อง
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6 col-12">
          <div class="glass-card p-4 h-100 border-glow-cyan d-flex align-items-center">
            <div class="d-flex gap-3">
              <div class="promo-icon-box"><i class="bi bi-box-seam-fill"></i></div>
              <div>
                <h5 class="fw-bold text-dark mb-1">ส่งพรีเมียม แพ็คโฟมกันกระแทกอย่างดี</h5>
                <p class="text-muted-custom fs-8 m-0 lh-base">
                  มั่นใจในความปลอดภัยขณะจัดส่ง คอมพิวเตอร์ประกอบเสร็จจะถูกแพ็คด้วยโฟมขึ้นรูปชนิดพิเศษทั้งภายในเคสเพื่อกันน้ำระบายความร้อนการ์ดจอเคลื่อน 
                  และแพ็คกล่องนอกสองชั้นหนาพิเศษ
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Elegant Toast Notifications -->
    <div class="toast-container position-fixed bottom-0 end-0 p-4" style="z-index: 1080;">
      <transition name="toast-fade">
        <div v-if="toast.show" class="toast-custom d-flex align-items-center p-3 border-0 rounded-4 shadow-lg" :class="'toast-' + toast.type" role="alert">
          <div class="toast-icon-wrapper me-3">
            <i class="bi bi-check-circle-fill text-success fs-4"></i>
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

    <KakaFooter />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import KakaNavbar from './KakaNavbar.vue'
import KakaFooter from './KakaFooter.vue'
import KakaReviewsModal from './KakaReviewsModal.vue'

const router = useRouter()

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

// Filters state
const searchQuery = ref('')
const selectedCategory = ref('all')
const selectedCpuBrand = ref('all')
const sortBy = ref('popular')

// Accordion view state (object tracking expanded state for each card id)
const activeSpecsViews = ref({})

// Toast Notification reactive state
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

// Categories for UI filtering
const useCaseCategories = [
  { id: 'all', name: 'ทั้งหมด' },
  { id: 'budget', name: 'เริ่มต้น & ทำงานทั่วไป' },
  { id: 'gaming', name: 'เล่นเกมยอดฮิต' },
  { id: 'streaming', name: 'สตรีมมิ่ง & กราฟิก' },
  { id: 'high-end', name: 'ระดับท็อป & ไฮเอนด์' }
]

const getCategoryIcon = (id) => {
  switch (id) {
    case 'all': return 'bi-grid-fill'
    case 'budget': return 'bi-laptop'
    case 'gaming': return 'bi-controller'
    case 'streaming': return 'bi-broadcast-fill'
    case 'high-end': return 'bi-fire'
    default: return 'bi-grid-fill'
  }
}

// Dynamic state for PC sets and parts populated from backend
const pcSetsCatalog = ref([])
const allParts = ref([])

// Accordion Toggle
const toggleSpecs = (id) => {
  activeSpecsViews.value[id] = !activeSpecsViews.value[id]
}

// Reset filters back to default
const resetFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = 'all'
  selectedCpuBrand.value = 'all'
  sortBy.value = 'popular'
}

// Filter and sort computer sets logic
const filteredPcSets = computed(() => {
  if (!pcSetsCatalog.value) return []
  let sets = [...pcSetsCatalog.value]

  // Filter by category
  if (selectedCategory.value !== 'all') {
    sets = sets.filter(s => s.category === selectedCategory.value)
  }

  // Filter by CPU brand
  if (selectedCpuBrand.value !== 'all') {
    sets = sets.filter(s => s.cpuBrand === selectedCpuBrand.value)
  }

  // Filter by search query
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    sets = sets.filter(s => 
      s.name.toLowerCase().includes(q) ||
      s.purpose.toLowerCase().includes(q) ||
      (s.partsList && s.partsList.some(part => part.name.toLowerCase().includes(q)))
    )
  }

  // Sorting
  if (sortBy.value === 'price-asc') {
    sets.sort((a, b) => a.price - b.price)
  } else if (sortBy.value === 'price-desc') {
    sets.sort((a, b) => b.price - a.price)
  } else {
    // 'popular' or default sorting
    sets.sort((a, b) => (a.id > b.id ? 1 : -1))
  }

  return sets
})

// Add set as a package item to cart
const addSetToCart = (pcSet) => {
  showToast(
    'เพิ่มลงตะกร้าแล้ว!',
    `ได้ทำการหยิบ ${pcSet.name} มูลค่า ฿${pcSet.price.toLocaleString('th-TH')} ใส่ตะกร้าเรียบร้อยแล้ว`,
    'success'
  )
  // Dispatch add-to-cart event to sync with Navbar Cart dropdown
  window.dispatchEvent(new CustomEvent('add-to-cart', { 
    detail: {
      name: `[PC Set] ${pcSet.name}`,
      price: pcSet.price
    } 
  }))
}

// Customize PC Set inside Custom Builder (KakaBuild.vue)
// Pre-populates all parts of the computer set inside localStorage and redirects to /build
const customizeSetInBuilder = (pcSet) => {
  // Define component mappings
  // In KakaBuild: { cpu, motherboard, gpu, ram, hdd, ssd, m2, psu, case, liquid_cooler, cpu_cooler... }
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

  // Set the specific component parts to matching items
  // Under the hood, KakaBuild uses specific part databases. Let's create proper slot structures!
  if (pcSet.partsList) {
    pcSet.partsList.forEach(part => {
      // Identify slot key
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

      // Find matching part in our fetched parts list to get exact price and details dynamically!
      if (slotKey) {
        const dbPart = allParts.value.find(p => p.id === part.id)
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

  // Write to localStorage and trigger redirect to Custom Builder
  localStorage.setItem('myCustomBuild', JSON.stringify(customBuildData))
  showToast(
    'กำลังเปิดเครื่องมือจัดสเปก...',
    `นำเข้าสเปกคอมจากเซต ${pcSet.name} เรียบร้อยแล้ว สามารถเข้าปรับแต่งชิ้นส่วนต่อได้ทันที!`,
    'success'
  )
  
  // Delay slightly so the user sees the confirmation toast before redirecting
  setTimeout(() => {
    router.push('/build')
  }, 1000)
}

onMounted(async () => {
  // Reset scroll position on enter
  window.scrollTo(0, 0)

  try {
    const [partsRes, setsRes, statsRes] = await Promise.all([
      axios.get('/api/pc-parts'),
      axios.get('/api/pc-sets'),
      axios.get('/api/reviews-stats')
    ])
    allParts.value = partsRes.data
    pcSetsCatalog.value = setsRes.data
    if (statsRes.data && statsRes.data.success) {
      reviewsStats.value = statsRes.data.stats || {}
    }
  } catch (error) {
    console.error('Failed to fetch data from API:', error)
    showToast('ดึงข้อมูลล้มเหลว', 'ไม่สามารถเชื่อมต่อกับฐานข้อมูลคอมพิวเตอร์เซตได้', 'danger')
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

.breadcrumb {
  background: transparent;
  padding: 0;
}

.breadcrumb-item a {
  transition: color 0.3s ease;
}

.hover-cyan:hover {
  color: #0ea5e9 !important;
}

.hero-section {
  padding: 1rem 0 2rem 0;
}

.badge-premium {
  background: #e0f2fe;
  border: 1px solid #bae6fd;
  color: #0ea5e9;
  border-radius: 2rem;
  font-weight: 700;
  font-size: 0.75rem;
  letter-spacing: 1.5px;
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
  line-height: 1.65;
}

.max-w-2xl {
  max-width: 42rem;
}

/* Glassmorphic Cards styling */
.glass-card {
  background: #ffffff !important;
  border: 1px solid #e2e8f0 !important;
  border-radius: 1.5rem !important;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.03) !important;
}

.border-glow-cyan:hover {
  border-color: #bae6fd !important;
  box-shadow: 0 15px 35px rgba(14, 165, 233, 0.08) !important;
}

/* Filters card controls */
.filter-control-card {
  background: rgba(255, 255, 255, 0.85) !important;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.search-filter {
  background-color: #f1f5f9;
  border: 1px solid transparent;
  border-radius: 50px;
  padding: 0.6rem 1.5rem;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.search-filter:focus {
  background-color: #ffffff;
  border-color: #0ea5e9;
  box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.12) !important;
}

/* Centered Premium Tabs Selector */
.category-tabs-container {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: 0.5rem;
  border-radius: 20px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.02);
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px;
  max-width: 100%;
}

.category-tab-btn {
  background: transparent;
  border: none;
  color: #475569;
  font-weight: 600;
  border-radius: 50px;
  padding: 0.65rem 1.4rem;
  font-size: 0.9rem;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  white-space: nowrap;
}

.category-tab-btn i {
  font-size: 1rem;
}

.category-tab-btn:hover {
  color: #0ea5e9;
  transform: translateY(-1px);
}

.active-tab {
  background: linear-gradient(135deg, #0ea5e9, #2563eb);
  color: white !important;
  box-shadow: 0 8px 20px rgba(14, 165, 233, 0.25);
  transform: scale(1.02);
}

.sort-select {
  border-radius: 50px;
  padding: 0.5rem 1.5rem 0.5rem 1rem;
  font-size: 0.85rem;
  border: 1px solid #cbd5e1;
  font-weight: 600;
  background-color: #ffffff;
  color: #475569;
  cursor: pointer;
  min-width: 160px;
}

.btn-light-custom {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #e2e8f0;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.btn-light-custom:hover {
  background: #cbd5e1;
  transform: rotate(45deg);
}

.btn-pill-sm {
  font-size: 0.8rem;
  font-weight: 600;
  border-radius: 50px;
  padding: 0.35rem 0.9rem;
  transition: all 0.2s ease;
}

.btn-danger-custom {
  background: #ef4444;
  color: white;
  border: none;
}

.btn-intel {
  background: #0068b5;
  color: white;
  border: none;
}

.btn-intel:hover {
  background: #00508c;
}

.btn-amd {
  background: #f26522;
  color: white;
  border: none;
}

.btn-amd:hover {
  background: #d44d18;
}

/* PC Set Card Grid Display */
.pc-set-card {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.pc-set-card:hover {
  transform: translateY(-8px);
  border-color: #bae6fd !important;
  box-shadow: 0 20px 40px rgba(14, 165, 233, 0.08) !important;
}

.pc-set-graphic-container {
  height: 220px;
  background: #060b13; /* Premium dark background for the blueprint */
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

.accordion-title {
  transition: color 0.3s ease;
}

.specs-accordion-header:hover .accordion-title,
.specs-accordion-header.is-expanded .accordion-title {
  color: #0ea5e9 !important;
}

.icon-glow {
  color: #0ea5e9;
  transition: transform 0.3s ease, filter 0.3s ease;
}

.specs-accordion-header:hover .icon-glow {
  transform: scale(1.1);
  filter: drop-shadow(0 0 4px rgba(14, 165, 233, 0.5));
}

.chevron-icon {
  font-size: 0.85rem;
  color: #64748b;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), color 0.3s ease;
}

.specs-accordion-header:hover .chevron-icon,
.specs-accordion-header.is-expanded .chevron-icon {
  color: #0ea5e9;
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

.part-icon-wrapper {
  width: 24px;
  height: 24px;
  border-radius: 8px;
  background: rgba(14, 165, 233, 0.08);
  color: #0ea5e9;
  transition: all 0.3s ease;
}

.spec-part-row:hover .part-icon-wrapper {
  background: #0ea5e9;
  color: white;
  box-shadow: 0 4px 10px rgba(14, 165, 233, 0.25);
  transform: scale(1.05);
}

.part-icon {
  font-size: 0.8rem;
}

.part-label {
  font-size: 0.8rem;
  letter-spacing: -0.1px;
}

.part-value {
  font-size: 0.8rem;
  transition: color 0.2s ease;
}

.spec-part-row:hover .part-value {
  color: #0ea5e9 !important;
}

.text-cyan {
  color: #0ea5e9 !important;
}

.border-dashed {
  border-style: dashed !important;
}

.price-text {
  color: #0284c7;
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

/* Promotional boxes bottom */
.promo-icon-box {
  width: 54px;
  height: 54px;
  border-radius: 12px;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  color: #0ea5e9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
}

/* Empty state */
.empty-icon-box {
  width: 64px;
  height: 64px;
  margin: 0 auto;
  background: #f0f9ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0ea5e9;
}

/* Toast Premium design */
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
