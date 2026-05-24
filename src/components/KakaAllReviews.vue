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
          <li class="breadcrumb-item active" aria-current="page">รีวิวจากลูกค้าทั้งหมด</li>
        </ol>
      </nav>

      <div class="row g-4">
        <!-- Left Sidebar Column -->
        <div class="col-lg-3 col-md-4 col-12 animate-slide-right">
          <div class="sidebar-card">
            <!-- Section 1: เกี่ยวกับเรา -->
            <div class="sidebar-section">
              <span class="section-title-sidebar">เกี่ยวกับเรา</span>
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
                <li class="active">
                  <router-link to="/reviews" class="menu-link">
                    <span class="indicator"></span>
                    <i class="bi bi-star me-2 icon-active"></i>
                    รีวิวจากลูกค้า
                  </router-link>
                </li>
                <li>
                  <router-link to="/terms" class="menu-link">
                    <span class="indicator"></span>
                    <i class="bi bi-file-earmark-text me-2"></i>
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
              <span class="section-title-sidebar">บริการลูกค้า</span>
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
              <i class="bi bi-star-fill header-icon"></i>
              <h1 class="h3 fw-bold m-0 text-dark">รีวิวจากลูกค้าทั้งหมด</h1>
            </div>

            <!-- Badge & Subtitle -->
            <div class="mb-4">
              <div class="badge-premium px-3 py-2 mb-3 d-inline-flex align-items-center gap-2 shadow-sm">
                <i class="bi bi-patch-check-fill"></i> CUSTOMER REVIEWS & FEEDBACK
              </div>
              <p class="text-muted-custom fs-6 lh-lg mb-0 text-justify">
                เสียงจากผู้ใช้งานจริงคือความภาคภูมิใจของเรา ร่วมสัมผัสความประทับใจและประสิทธิภาพของชุดคอมพิวเตอร์ TechGear จากลูกค้าจริงทั่วประเทศ
              </p>
            </div>

            <!-- Dashboard: Stats & Distribution -->
            <div class="row g-3 mb-4">
              <!-- Average Rating Card -->
              <div class="col-md-4 col-12">
                <div class="stat-card text-center p-4 h-100 d-flex flex-column justify-content-center align-items-center">
                  <span class="fs-9 text-muted fw-bold mb-1">คะแนนเฉลี่ยรวม</span>
                  <div class="huge-rating-number my-2">{{ overallAvgRating }}</div>
                  <div class="stars-row mb-2">
                    <i v-for="i in 5" :key="i" :class="getStarClass(i, overallAvgRating)" class="bi fs-5"></i>
                  </div>
                  <span class="text-muted fs-9">จากรีวิวทั้งหมด {{ reviews.length }} รายการ</span>
                </div>
              </div>

              <!-- Star Distribution -->
              <div class="col-md-8 col-12">
                <div class="stat-card p-4 h-100">
                  <h5 class="section-title mb-3">สัดส่วนคะแนนรีวิว</h5>
                  <div class="d-flex flex-column gap-2">
                    <div v-for="star in [5, 4, 3, 2, 1]" :key="star" class="d-flex align-items-center gap-3">
                      <span class="star-label text-nowrap fs-9 fw-semibold text-muted">
                        {{ star }} <i class="bi bi-star-fill text-warning fs-10"></i>
                      </span>
                      <div class="progress progress-custom flex-grow-1">
                        <div 
                          class="progress-bar progress-bar-blue" 
                          role="progressbar" 
                          :style="{ width: getDistributionPercentage(star) + '%' }" 
                          :aria-valuenow="getDistributionPercentage(star)" 
                          aria-valuemin="0" 
                          aria-valuemax="100"
                        ></div>
                      </div>
                      <span class="percentage-label fs-9 fw-bold text-primary">{{ getDistributionPercentage(star) }}%</span>
                      <span class="count-label fs-9 text-muted">({{ starDistribution[star] || 0 }})</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="divider mb-4"></div>

            <!-- Search and Filter Controls -->
            <div class="filter-controls p-3 mb-4 rounded-4">
              <div class="row g-3 align-items-center">
                <!-- Search bar -->
                <div class="col-md-5 col-12">
                  <div class="position-relative">
                    <input 
                      v-model="searchQuery" 
                      type="text" 
                      class="form-control filter-search shadow-none" 
                      placeholder="ค้นหาชื่อสินค้า หรือเนื้อหารีวิว..."
                    >
                    <i class="bi bi-search position-absolute top-50 end-0 translate-middle-y me-3 text-muted"></i>
                  </div>
                </div>

                <!-- Star Filter Badges -->
                <div class="col-md-7 col-12">
                  <div class="d-flex flex-wrap gap-2 justify-content-md-end align-items-center">
                    <span class="fs-9 text-muted fw-bold me-1 d-none d-sm-inline">กรอง:</span>
                    <button 
                      class="btn btn-filter-star" 
                      :class="{ active: selectedStarFilter === 'all' }"
                      @click="selectedStarFilter = 'all'"
                    >
                      ทั้งหมด ({{ reviews.length }})
                    </button>
                    <button 
                      v-for="star in [5, 4, 3, 2, 1]" 
                      :key="star" 
                      class="btn btn-filter-star"
                      :class="{ active: selectedStarFilter === star }"
                      @click="selectedStarFilter = star"
                    >
                      {{ star }} <i class="bi bi-star-fill text-warning fs-10"></i> ({{ starDistribution[star] || 0 }})
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="text-center py-5">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">กำลังโหลด...</span>
              </div>
              <p class="text-muted mt-3">กำลังเรียกข้อมูลประวัติรีวิว...</p>
            </div>

            <!-- Empty State -->
            <div v-else-if="filteredReviews.length === 0" class="text-center py-5 empty-reviews-box rounded-4">
              <div class="empty-icon-box mb-3">
                <i class="bi bi-chat-left-quote text-muted fs-1"></i>
              </div>
              <h4 class="fw-bold text-dark fs-6">ไม่พบรีวิวที่ตรงกับเงื่อนไขการค้นหา</h4>
              <p class="text-muted fs-9 max-w-sm mx-auto mt-2">
                ท่านสามารถลองพิมพ์คำค้นหาอื่น หรือลองรีเซ็ตฟิลเตอร์ดึงรีวิวทั้งหมดของร้าน
              </p>
              <button @click="resetFilters" class="btn btn-outline-primary rounded-pill px-4 mt-3 fw-bold fs-9">
                <i class="bi bi-arrow-counterclockwise"></i> ล้างการกรองทั้งหมด
              </button>
            </div>

            <!-- Reviews Grid -->
            <div v-else class="row g-3">
              <div 
                v-for="review in filteredReviews" 
                :key="review.id" 
                class="col-xl-6 col-12 animate-slide-up"
              >
                <div class="review-card h-100 d-flex flex-column justify-content-between p-3">
                  <div>
                    <!-- Card Header -->
                    <div class="d-flex justify-content-between align-items-start gap-3 mb-3">
                      <div class="d-flex align-items-center gap-3">
                        <div class="avatar-circle">
                          {{ getAvatarLetter(review.user_email) }}
                        </div>
                        <div>
                          <div class="fw-bold text-dark fs-8">{{ maskEmail(review.user_email) }}</div>
                          <div class="fs-9 text-muted mt-0">
                            <i class="bi bi-calendar3 me-1"></i> {{ review.date }}
                          </div>
                        </div>
                      </div>
                      <!-- Stars -->
                      <div class="stars-display d-inline-flex gap-0">
                        <i v-for="i in 5" :key="i" :class="i <= review.rating ? 'bi-star-fill text-warning' : 'bi-star text-muted'" class="bi fs-9"></i>
                      </div>
                    </div>

                    <!-- Product Tag -->
                    <div class="mb-3">
                      <span 
                        class="product-link-badge d-inline-flex align-items-center gap-1 cursor-pointer" 
                        @click="navigateToProduct(review.product_id)"
                        :title="'คลิกเพื่อไปที่หน้ารายการ ' + review.product_name"
                      >
                        <i :class="['bi', getProductIcon(review.product_id), 'text-primary']"></i>
                        <span class="fw-bold fs-9 text-truncate text-primary" style="max-width: 280px;">{{ review.product_name }}</span>
                        <i class="bi bi-arrow-right-short text-primary fs-8"></i>
                      </span>
                    </div>

                    <!-- Comment -->
                    <p class="review-comment text-muted-custom fs-8 lh-lg mb-0 text-justify">
                      {{ review.comment }}
                    </p>
                  </div>

                  <!-- Footer: Verified Buyer -->
                  <div class="d-flex justify-content-end mt-3 pt-3 border-top">
                    <span class="badge-verified d-inline-flex align-items-center gap-1">
                      <i class="bi bi-patch-check-fill text-success fs-10"></i> 
                      <span class="fs-10 text-success fw-semibold">ผู้สั่งซื้อสินค้าจริง (Verified Buyer)</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Back button -->
            <div class="mt-5 text-center">
              <router-link to="/" class="btn-gradient px-4 py-2 shadow-glow-blue text-decoration-none d-inline-flex align-items-center gap-2">
                <i class="bi bi-arrow-left-circle"></i> กลับสู่หน้าแรก
              </router-link>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import KakaNavbar from './KakaNavbar.vue'
import KakaFooter from './KakaFooter.vue'

const router = useRouter()

// Reactive State
const loading = ref(true)
const reviews = ref([])
const searchQuery = ref('')
const selectedStarFilter = ref('all')

// Load All Reviews from backend
const loadAllReviews = async () => {
  loading.value = true
  try {
    const res = await axios.get('/api/reviews')
    if (res.data && res.data.success) {
      reviews.value = res.data.reviews || []
    }
  } catch (err) {
    console.error('Failed to load reviews list:', err)
  } finally {
    loading.value = false
  }
}

// Compute Statistics
const overallAvgRating = computed(() => {
  if (reviews.value.length === 0) return '5.0'
  const sum = reviews.value.reduce((acc, r) => acc + parseInt(r.rating), 0)
  return (sum / reviews.value.length).toFixed(1)
})

const starDistribution = computed(() => {
  const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  reviews.value.forEach(r => {
    const star = Math.min(5, Math.max(1, parseInt(r.rating)))
    dist[star] = (dist[star] || 0) + 1
  })
  return dist
})

const getDistributionPercentage = (star) => {
  if (reviews.value.length === 0) return 0
  const count = starDistribution.value[star] || 0
  return Math.round((count / reviews.value.length) * 100)
}

// Reset Filters
const resetFilters = () => {
  searchQuery.value = ''
  selectedStarFilter.value = 'all'
}

// Filter reviews dynamically
const filteredReviews = computed(() => {
  return reviews.value.filter(r => {
    if (selectedStarFilter.value !== 'all') {
      if (parseInt(r.rating) !== selectedStarFilter.value) {
        return false
      }
    }
    if (searchQuery.value.trim() !== '') {
      const q = searchQuery.value.toLowerCase()
      const nameMatch = r.product_name.toLowerCase().includes(q)
      const commentMatch = r.comment.toLowerCase().includes(q)
      return nameMatch || commentMatch
    }
    return true
  })
})

// Star helpers
const getStarClass = (index, avgRating) => {
  const rating = parseFloat(avgRating)
  if (index <= Math.floor(rating)) {
    return 'bi-star-fill text-warning'
  }
  if (index - 0.5 <= rating) {
    return 'bi-star-half text-warning'
  }
  return 'bi-star text-muted'
}

// GDPR Masking
const maskEmail = (email) => {
  if (!email) return 'Guest'
  const parts = email.split('@')
  if (parts.length !== 2) return email
  const name = parts[0]
  const domain = parts[1]
  if (name.length <= 2) return `${name}***@${domain}`
  return `${name.substring(0, 2)}***@${domain}`
}

const getAvatarLetter = (email) => {
  if (!email) return 'U'
  return email.charAt(0).toUpperCase()
}

// Navigate to category or builder
const navigateToProduct = (productId) => {
  if (productId.startsWith('set-')) {
    router.push({ name: 'PcSets' })
  } else {
    router.push({ name: 'Build' })
  }
}

// Helper icons
const getProductIcon = (productId = '') => {
  const id = productId.toLowerCase()
  if (id.startsWith('cpu')) return 'bi-cpu-fill'
  if (id.startsWith('gpu')) return 'bi-gpu-card'
  if (id.startsWith('ram')) return 'bi-memory'
  if (id.startsWith('ssd') || id.startsWith('m2')) return 'bi-device-ssd'
  if (id.startsWith('hdd')) return 'bi-hdd-fill'
  if (id.startsWith('mb')) return 'bi-layout-three-columns'
  if (id.startsWith('psu')) return 'bi-plug-fill'
  if (id.startsWith('case')) return 'bi-box-fill'
  if (id.startsWith('set')) return 'bi-pc-display-horizontal'
  return 'bi-box-seam-fill'
}

onMounted(() => {
  loadAllReviews()
})
</script>

<script>
export default {
  name: 'KakaAllReviews'
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

.section-title-sidebar {
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

.title-gradient {
  background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 50%, #1d4ed8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
}

.text-muted-custom {
  color: #475569;
}

.text-justify {
  text-align: justify;
}

.divider {
  height: 1px;
  background: #e2e8f0;
  width: 100%;
}

.max-w-sm {
  max-width: 24rem;
}

.fs-8 {
  font-size: 0.85rem;
}

.fs-9 {
  font-size: 0.8rem;
}

.fs-10 {
  font-size: 0.7rem;
}

/* Stats Cards */
.stat-card {
  background: #fafbfc;
  border: 1px solid #f1f5f9;
  border-radius: 1rem;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.03);
  border-color: #bae6fd;
}

.huge-rating-number {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1;
  background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  border-left: 3px solid #0ea5e9;
  padding-left: 0.75rem;
}

/* Progress Distribution */
.star-label {
  width: 44px;
}

.progress-custom {
  height: 10px;
  background: #f1f5f9;
  border-radius: 10px;
  overflow: hidden;
}

.progress-bar-blue {
  background: linear-gradient(90deg, #0ea5e9 0%, #3b82f6 100%);
  border-radius: 10px;
  transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.percentage-label {
  width: 40px;
  text-align: right;
}

.count-label {
  width: 32px;
  text-align: right;
}

/* Filters */
.filter-controls {
  background: #fafbfc;
  border: 1px solid #f1f5f9;
}

.filter-search {
  background: #ffffff !important;
  border: 1px solid #e2e8f0 !important;
  color: #1e293b !important;
  border-radius: 50px !important;
  padding: 0.6rem 1.5rem !important;
  font-size: 0.85rem !important;
  transition: all 0.3s ease !important;
}

.filter-search:focus {
  border-color: #0ea5e9 !important;
  box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.1) !important;
}

.btn-filter-star {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  color: #64748b;
  font-weight: 600;
  font-size: 0.8rem;
  border-radius: 50px;
  padding: 0.4rem 1rem;
  transition: all 0.2s ease;
  cursor: pointer;
  user-select: none;
}

.btn-filter-star:hover {
  background: #f0f9ff;
  color: #0ea5e9;
  border-color: #bae6fd;
}

.btn-filter-star.active {
  background: linear-gradient(135deg, #0ea5e9, #2563eb);
  border-color: transparent;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.25);
}

/* Empty Reviews */
.empty-reviews-box {
  background: #fafbfc;
  border: 1px dashed #e2e8f0;
}

.empty-icon-box {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
}

/* Review Card */
.review-card {
  background: #fafbfc;
  border: 1px solid #f1f5f9;
  border-radius: 1rem;
  transition: all 0.3s ease;
}

.review-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.04);
  border-color: #bae6fd;
}

.avatar-circle {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.2);
  flex-shrink: 0;
}

.review-comment {
  line-height: 1.65;
  white-space: pre-line;
}

/* Product Link Badge */
.product-link-badge {
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  padding: 0.35rem 0.85rem;
  border-radius: 50px;
  transition: all 0.2s ease;
  cursor: pointer !important;
  user-select: none;
}

.product-link-badge:hover {
  background: #e0f2fe;
  border-color: #7dd3fc;
  box-shadow: 0 4px 10px rgba(14, 165, 233, 0.1);
  transform: translateY(-1px);
}

.cursor-pointer {
  cursor: pointer !important;
  user-select: none;
}

/* Verified Buyer Badge */
.badge-verified {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
}

/* Buttons */
.btn-gradient {
  background: linear-gradient(135deg, #0ea5e9, #2563eb);
  color: white;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  padding: 0.6rem 1.75rem;
}

.btn-gradient:hover {
  transform: translateY(-2px);
  color: white;
  box-shadow: 0 8px 20px rgba(14, 165, 233, 0.25);
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
.animate-slide-up {
  animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInRight {
  from { opacity: 0; transform: translateX(-30px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Responsive Overrides */
@media (max-width: 767px) {
  .content-card {
    padding: 1.5rem;
  }
}
</style>
