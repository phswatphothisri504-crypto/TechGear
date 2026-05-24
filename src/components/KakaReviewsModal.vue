<template>
  <transition name="modal-fade">
    <div v-if="show" class="reviews-modal-backdrop" @click.self="closeModal">
      <div class="reviews-modal-container glassmorphic-card" :class="{ 'set-modal-width': productDetails?.partsList }">
        
        <!-- Modal Header -->
        <div class="modal-header-custom">
          <div class="header-info">
            <span class="badge badge-premium mb-2">
              <i class="bi bi-cpu text-info me-1 animate-pulse"></i>
              ข้อมูลรายละเอียดสินค้า & รีวิว
            </span>
            <h3 class="product-title text-truncate">{{ productDetails?.name || productName }}</h3>
          </div>
          <button class="close-btn" @click="closeModal" aria-label="Close modal">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <!-- Custom Tab Navigation -->
        <div class="tabs-navigation">
          <button 
            class="tab-nav-btn" 
            :class="{ active: activeTab === 'details' }" 
            @click="activeTab = 'details'"
          >
            <i class="bi bi-info-circle-fill me-2"></i>รายละเอียดสินค้า
          </button>
          <button 
            class="tab-nav-btn" 
            :class="{ active: activeTab === 'reviews' }" 
            @click="activeTab = 'reviews'"
          >
            <i class="bi bi-star-fill me-2 text-warning"></i>รีวิวจากลูกค้า ({{ stats.totalReviews || 0 }})
          </button>
        </div>

        <!-- Modal Body -->
        <div class="modal-body-custom scrollbar-custom">
          <!-- Inline Notification / Success Message inside Modal -->
          <transition name="fade">
            <div v-if="modalNotification.show" class="modal-inline-notification" :class="modalNotification.type">
              <i class="bi" :class="modalNotification.type === 'success' ? 'bi-check-circle-fill' : 'bi-info-circle-fill'"></i>
              <span>{{ modalNotification.message }}</span>
            </div>
          </transition>

          <!-- Tab 1: รายละเอียดสินค้า (Product Details) -->
          <div v-if="activeTab === 'details'" class="tab-content-details animate-slide-up">
            
            <div v-if="detailsLoading" class="text-center py-5">
              <div class="spinner-border text-info mb-3" role="status">
                <span class="visually-hidden">กำลังโหลด...</span>
              </div>
              <p class="text-secondary fs-8">กำลังดึงรายละเอียดข้อมูลสินค้า...</p>
            </div>

            <div v-else-if="!productDetails" class="text-center py-5">
              <div class="empty-icon-box mb-3">
                <i class="bi bi-exclamation-triangle text-warning fs-1"></i>
              </div>
              <p class="text-secondary fs-8 m-0">ไม่สามารถโหลดข้อมูลของสินค้านี้ได้</p>
            </div>

            <div v-else class="row g-4">
              <!-- Left Column: Visual Sidebar -->
              <div class="col-lg-5">
                <div class="visual-sidebar-card">
                  <!-- Custom SVG Illustration based on Category -->
                  <div class="svg-illustration-container mb-3">
                    <div v-html="getCategorySvg(productDetails.category)" class="category-svg-wrapper"></div>
                  </div>

                  <!-- Details Badges -->
                  <div class="d-flex flex-wrap gap-2 justify-content-center mb-3">
                    <span class="badge badge-brand text-capitalize">{{ productDetails.brand || 'Premium' }}</span>
                    <span class="badge badge-category text-capitalize">
                      <i class="bi bi-tag-fill me-1"></i>{{ getCategoryLabel(productDetails.category) }}
                    </span>
                    <span class="badge badge-stock">
                      <i class="bi bi-check-circle-fill text-success me-1"></i>มีสินค้าพร้อมส่ง
                    </span>
                  </div>

                  <!-- Price & Selection Card -->
                  <div class="price-selection-card text-center p-3">
                    <span class="price-label text-secondary fs-9 d-block mb-1">ราคาพิเศษรวมภาษีแล้ว</span>
                    
                    <div class="price-value-container mb-3">
                      <span class="currency">฿</span>
                      <span class="price-amount">{{ formatPrice(productDetails.price) }}</span>
                    </div>

                    <!-- Socket compatibility for CPU & Mobo -->
                    <div v-if="productDetails.socket" class="socket-info-banner mb-3" :class="getSocketPlatformClass(productDetails.socket)">
                      <div class="socket-header">
                        <i class="bi bi-cpu-fill me-1"></i>
                        <span>แพลตฟอร์มที่รองรับ</span>
                      </div>
                      <div class="socket-value mt-1">
                        {{ productDetails.socket }}
                      </div>
                    </div>

                    <!-- Buy / Builder Action Buttons -->
                    <div class="d-grid gap-2">
                      <button @click="handleAddToCart" class="btn btn-add-to-cart rounded-pill py-2 fw-bold">
                        <i class="bi bi-cart-plus-fill me-2"></i>หยิบใส่ตะกร้าสินค้า
                      </button>
                      
                      <!-- Redirection to Custom Spec Builder (only for parts, not sets) -->
                      <button 
                        v-if="!productDetails.partsList"
                        @click="handleUseInBuilder" 
                        class="btn btn-use-in-builder rounded-pill py-2 fw-bold"
                      >
                        <i class="bi bi-tools me-2 text-info animate-pulse"></i>จัดสเปกด้วยชิ้นนี้
                      </button>

                      <!-- Redirection for prebuilt PC sets -->
                      <button 
                        v-else
                        @click="handleUseInBuilder" 
                        class="btn btn-use-in-builder rounded-pill py-2 fw-bold"
                      >
                        <i class="bi bi-sliders me-2 text-info"></i>แต่งสเปกคอมเซ็ตนี้ต่อ
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Right Column: Info & Specs Grid -->
              <div class="col-lg-7">
                <div class="details-info-container">
                  <!-- If it's a component part: Specs table -->
                  <div v-if="!productDetails.partsList">
                    <h4 class="details-section-title mb-3">
                      <i class="bi bi-file-earmark-text-fill me-2 text-primary"></i>ตารางคุณสมบัติเฉพาะสินค้า (Specifications)
                    </h4>
                    
                    <div class="table-responsive specs-table-container">
                      <table class="table table-custom m-0">
                        <tbody>
                          <tr v-for="(spec, index) in parsedSpecs" :key="index" class="spec-row">
                            <td class="spec-label text-secondary fw-semibold">{{ spec.label }}</td>
                            <td class="spec-value text-slate-dark">{{ spec.value }}</td>
                          </tr>
                          <!-- Extra rows for static details -->
                          <tr class="spec-row">
                            <td class="spec-label text-secondary fw-semibold">ยี่ห้อ (Brand)</td>
                            <td class="spec-value text-slate-dark text-uppercase">{{ productDetails.brand }}</td>
                          </tr>
                          <tr v-if="productDetails.series" class="spec-row">
                            <td class="spec-label text-secondary fw-semibold">ซีรีส์สินค้า (Series)</td>
                            <td class="spec-value text-slate-dark">{{ productDetails.series }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <!-- If it's a PC Set: Parts list -->
                  <div v-else>
                    <h4 class="details-section-title mb-2">
                      <i class="bi bi-pc-display-horizontal me-2 text-primary"></i>ชิ้นส่วนอุปกรณ์ในชุดคอมเซ็ตนี้
                    </h4>
                    <p class="text-secondary fs-8 mb-3">
                      ทุกชิ้นส่วนประกอบและติดตั้งพร้อมใช้งาน รับประกันอุปกรณ์ทุกชิ้นแยกตามผู้ผลิต พร้อมบริการดูแลหลังการขายโดยทีมงานระดับมืออาชีพ
                    </p>

                    <div class="set-parts-grid">
                      <div v-for="(part, idx) in productDetails.partsList" :key="idx" class="set-part-item-card">
                        <div class="d-flex align-items-center gap-3">
                          <div class="part-icon-box">
                            <i class="bi" :class="part.icon || 'bi-cpu'"></i>
                          </div>
                          <div class="part-info flex-grow-1 min-w-0">
                            <div class="part-label text-secondary fs-9 fw-semibold text-uppercase">{{ part.label }}</div>
                            <div class="part-name text-slate-dark fs-8 text-truncate">{{ part.name }}</div>
                          </div>
                          <div class="part-status-badge">
                            <i class="bi bi-check-circle-fill text-success" title="รวมอยู่ในเซ็ตแล้ว"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- Tab 2: รีวิวจากลูกค้า (Reviews) -->
          <div v-if="activeTab === 'reviews'" class="tab-content-reviews animate-slide-up">
            <div class="row g-4">
              <!-- Column 1: Ratings & Stats Summary -->
              <div class="col-lg-5">
                <div class="stats-summary-card">
                  <h4 class="section-title">สถิติคะแนนรีวิว</h4>
                  
                  <div class="d-flex align-items-center gap-4 my-4">
                    <div class="huge-rating-number">{{ stats.avgRating || '0.0' }}</div>
                    <div>
                      <div class="stars-display mb-1">
                        <i v-for="i in 5" :key="i" :class="getStarClass(i, stats.avgRating)" class="bi fs-5"></i>
                      </div>
                      <div class="text-secondary fs-9">จากทั้งหมด {{ stats.totalReviews || 0 }} รีวิว</div>
                    </div>
                  </div>

                  <!-- Rating Distribution Bars -->
                  <div class="distribution-list">
                    <div v-for="star in [5, 4, 3, 2, 1]" :key="star" class="distribution-row d-flex align-items-center gap-2 mb-2">
                      <span class="star-label text-nowrap">{{ star }} <i class="bi bi-star-fill text-warning fs-10"></i></span>
                      <div class="progress progress-custom flex-grow-1">
                        <div 
                          class="progress-bar progress-bar-glow" 
                          role="progressbar" 
                          :style="{ width: getDistributionPercentage(star) + '%' }" 
                          :aria-valuenow="getDistributionPercentage(star)" 
                          aria-valuemin="0" 
                          aria-valuemax="100"
                        ></div>
                      </div>
                      <span class="percentage-label text-secondary">{{ getDistributionPercentage(star) }}%</span>
                      <span class="count-label text-secondary">({{ stats.ratingDistribution?.[star] || 0 }})</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Column 2: Write Review & Reviews List -->
              <div class="col-lg-7">
                
                <!-- Section: Write a Review -->
                <div class="write-review-section mb-4">
                  <h4 class="section-title mb-3">เขียนรีวิวของคุณ</h4>
                  
                  <div v-if="!isLoggedIn" class="login-prompt-card">
                    <div class="d-flex align-items-center gap-3">
                      <div class="prompt-icon-box">
                        <i class="bi bi-shield-lock-fill text-warning fs-3"></i>
                      </div>
                      <div>
                        <h5 class="text-dark fw-bold mb-1">เฉพาะผู้ใช้ที่เข้าสู่ระบบเท่านั้น</h5>
                        <p class="text-secondary fs-8 mb-2">กรุณาเข้าสู่ระบบด้วยบัญชีผู้ใช้ของคุณเพื่อส่งความคิดเห็นและให้คะแนนสินค้า</p>
                        <div class="d-flex gap-2">
                          <router-link to="/login" class="btn btn-outline-secondary btn-sm rounded-pill px-3" @click="closeModal">เข้าสู่ระบบ</router-link>
                          <router-link to="/register" class="btn btn-primary-custom btn-sm rounded-pill px-3" @click="closeModal">สมัครสมาชิก</router-link>
                        </div>
                      </div>
                    </div>
                  </div>

                  <form v-else @submit.prevent="submitReview" class="review-form">
                    <!-- Star Rating Selector -->
                    <div class="mb-3">
                      <label class="form-label text-secondary fs-8 d-block mb-2">คะแนนความพึงพอใจของคุณ *</label>
                      <div class="stars-selector d-flex align-items-center gap-2">
                        <button 
                          v-for="star in 5" 
                          :key="star" 
                          type="button" 
                          class="star-selector-btn"
                          @mouseenter="hoverRating = star"
                          @mouseleave="hoverRating = 0"
                          @click="newReview.rating = star"
                          aria-label="Rate product"
                        >
                          <i 
                            class="bi" 
                            :class="[
                              (hoverRating || newReview.rating) >= star ? 'bi-star-fill text-warning scale-up' : 'bi-star text-muted'
                            ]"
                          ></i>
                        </button>
                        <span class="selected-rating-label text-warning fw-bold ms-2">{{ getRatingText }}</span>
                      </div>
                    </div>

                    <!-- Comment Input -->
                    <div class="mb-3">
                      <label for="reviewComment" class="form-label text-secondary fs-8">ความคิดเห็น / รีวิวสินค้า *</label>
                      <div class="textarea-container">
                        <textarea 
                          id="reviewComment"
                          v-model="newReview.comment" 
                          class="form-control textarea-custom" 
                          rows="3" 
                          maxlength="500"
                          placeholder="เล่าประสบการณ์ใช้งานสินค้าชิ้นนี้ให้เพื่อนๆ ฟังหน่อยครับ..."
                          required
                        ></textarea>
                        <span class="char-counter fs-9" :class="{ 'text-danger': newReview.comment.length >= 500 }">
                          {{ newReview.comment.length }}/500
                        </span>
                      </div>
                    </div>

                    <!-- Form Feedback Messages -->
                    <div v-if="submitError" class="alert alert-danger-custom d-flex align-items-center gap-2 py-2 px-3 rounded-3 mb-3">
                      <i class="bi bi-exclamation-triangle-fill"></i>
                      <span class="fs-9">{{ submitError }}</span>
                    </div>

                    <div v-if="submitSuccess" class="alert alert-success-custom d-flex align-items-center gap-2 py-2 px-3 rounded-3 mb-3 animate-fade-in">
                      <i class="bi bi-check-circle-fill"></i>
                      <span class="fs-9">ส่งรีวิวเรียบร้อยแล้ว ขอบพระคุณมากครับ!</span>
                    </div>

                    <!-- Submit Button -->
                    <div class="d-flex justify-content-end">
                      <button 
                        type="submit" 
                        class="btn btn-submit-review rounded-pill px-4 fw-bold" 
                        :disabled="isSubmitting || newReview.rating === 0 || newReview.comment.trim().length < 5"
                      >
                        <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        <i v-else class="bi bi-send-fill me-2"></i>
                        ส่งรีวิวสินค้า
                      </button>
                    </div>
                  </form>
                </div>

                <hr class="border-secondary opacity-25 my-4">

                <!-- Section: Reviews List -->
                <div class="reviews-list-section">
                  <h4 class="section-title mb-3">ความคิดเห็นของผู้ซื้อ ({{ stats.totalReviews || 0 }})</h4>
                  
                  <div v-if="loading" class="text-center py-5">
                    <div class="spinner-border text-info mb-3" role="status">
                      <span class="visually-hidden">กำลังโหลด...</span>
                    </div>
                    <p class="text-secondary fs-8">กำลังดึงข้อมูลรีวิวสินค้า...</p>
                  </div>

                  <div v-else-if="reviews.length === 0" class="empty-reviews text-center py-5">
                    <div class="empty-icon-box mb-3">
                      <i class="bi bi-chat-left-dots text-secondary fs-1"></i>
                    </div>
                    <p class="text-secondary fs-8 m-0">ยังไม่มีรีวิวสำหรับสินค้าชิ้นนี้</p>
                    <p class="text-secondary opacity-75 fs-9">เป็นคนแรกที่รีวิวสินค้านี้กันเลย!</p>
                  </div>

                  <div v-else class="reviews-items-container">
                    <div v-for="review in reviews" :key="review.id" class="review-item-card animate-slide-up">
                      <div class="d-flex justify-content-between align-items-start gap-2 mb-2">
                        <div class="d-flex align-items-center gap-3">
                          <div class="avatar-circle">
                            {{ getAvatarLetter(review.user_email) }}
                          </div>
                          <div>
                            <div class="user-email text-slate-dark fw-bold fs-8">{{ maskEmail(review.user_email) }}</div>
                            <div class="review-stars-small text-warning">
                              <i v-for="i in 5" :key="i" :class="i <= review.rating ? 'bi-star-fill' : 'bi-star'" class="bi fs-10"></i>
                            </div>
                          </div>
                        </div>
                        <span class="review-date text-secondary fs-9">{{ review.date }}</span>
                      </div>
                      <p class="review-comment text-slate-gray fs-8 m-0">{{ review.comment }}</p>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </transition>
</template>

<script setup>
/* global defineProps, defineEmits */
import { ref, watch, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  productId: {
    type: String,
    required: true
  },
  productName: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['close', 'review-submitted'])

const router = useRouter()

// Auth State
const isLoggedIn = ref(false)
const userEmail = ref('')

// Component State
const loading = ref(false)
const reviews = ref([])
const stats = ref({
  totalReviews: 0,
  avgRating: 0,
  ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
})

// Tab State
const activeTab = ref('details')
const productDetails = ref(null)
const detailsLoading = ref(false)
const allParts = ref([]) // loaded for PC set price reference

// Modal Notifications State
const modalNotification = ref({
  show: false,
  message: '',
  type: 'success'
})

const triggerModalNotification = (message, type = 'success') => {
  modalNotification.value.message = message
  modalNotification.value.type = type
  modalNotification.value.show = true
  setTimeout(() => {
    modalNotification.value.show = false
  }, 3500)
}

// Review Submission State
const hoverRating = ref(0)
const isSubmitting = ref(false)
const submitSuccess = ref(false)
const submitError = ref('')
const newReview = ref({
  rating: 0,
  comment: ''
})

const ratingTexts = {
  1: 'ปรับปรุง / แย่มาก',
  2: 'พอใช้ได้',
  3: 'ปานกลาง / ทั่วไป',
  4: 'ดีมาก / แนะนำ',
  5: 'ดีเลิศ / ประทับใจที่สุด'
}

const getRatingText = computed(() => {
  const current = hoverRating.value || newReview.value.rating
  return ratingTexts[current] || ''
})

// Watch modal visibility to load data and check login
watch(() => props.show, (newVal) => {
  if (newVal) {
    checkLogin()
    loadReviewsData()
    loadProductDetails()
    // Reset submission form and tab
    activeTab.value = 'details'
    newReview.value.rating = 0
    newReview.value.comment = ''
    submitSuccess.value = false
    submitError.value = ''
  }
})

const checkLogin = () => {
  isLoggedIn.value = localStorage.getItem('isLoggedIn') === 'true'
  userEmail.value = localStorage.getItem('userEmail') || ''
}

const loadProductDetails = async () => {
  if (!props.productId) return
  
  detailsLoading.value = true
  productDetails.value = null
  
  try {
    const isSet = props.productId.toString().startsWith('set-')
    const url = isSet 
      ? `/api/pc-sets/${props.productId}`
      : `/api/pc-parts/${props.productId}`
      
    const res = await axios.get(url)
    if (res.data) {
      productDetails.value = res.data
      
      // If it's a set, load all parts to resolve prices and enable robust building
      if (isSet) {
        try {
          const partsRes = await axios.get('/api/pc-parts')
          allParts.value = partsRes.data || []
        } catch (partsErr) {
          console.error('Failed to load PC parts for set components:', partsErr)
        }
      }
    }
  } catch (err) {
    console.error('Failed to load product details:', err)
  } finally {
    detailsLoading.value = false
  }
}

const loadReviewsData = async () => {
  if (!props.productId) return
  
  loading.value = true
  try {
    const res = await axios.get(`/api/reviews/${props.productId}`)
    if (res.data && res.data.success) {
      reviews.value = res.data.reviews || []
      stats.value = {
        totalReviews: res.data.totalReviews || 0,
        avgRating: res.data.avgRating || 0,
        ratingDistribution: res.data.ratingDistribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      }
    }
  } catch (err) {
    console.error('Failed to load reviews:', err)
  } finally {
    loading.value = false
  }
}

const submitReview = async () => {
  if (newReview.value.rating === 0) {
    submitError.value = 'กรุณาเลือกคะแนนประเมินด้วยความพึงพอใจ!'
    return
  }
  if (newReview.value.comment.trim().length < 5) {
    submitError.value = 'กรุณาใส่ความคิดเห็นอย่างน้อย 5 ตัวอักษร!'
    return
  }

  isSubmitting.value = true
  submitError.value = ''
  submitSuccess.value = false

  try {
    const response = await axios.post('/api/reviews', {
      product_id: props.productId,
      product_name: props.productName,
      user_email: userEmail.value,
      rating: newReview.value.rating,
      comment: newReview.value.comment
    })

    if (response.data && response.data.success) {
      submitSuccess.value = true
      newReview.value.rating = 0
      newReview.value.comment = ''
      
      // Reload lists and stats
      await loadReviewsData()
      
      emit('review-submitted', {
        productId: props.productId,
        avgRating: stats.value.avgRating,
        totalReviews: stats.value.totalReviews
      })

      // Hide success message after 3 seconds
      setTimeout(() => {
        submitSuccess.value = false
      }, 3000)
    } else {
      submitError.value = response.data.message || 'ส่งรีวิวไม่สำเร็จ กรุณาลองใหม่อีกครั้ง'
    }
  } catch (err) {
    console.error('Submit review error:', err)
    submitError.value = err.response?.data?.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์'
  } finally {
    isSubmitting.value = false
  }
}

const closeModal = () => {
  emit('close')
}

// Format Price
const formatPrice = (val) => {
  if (!val) return '0.00'
  return parseFloat(val).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// Add to Cart Action
const handleAddToCart = () => {
  if (!productDetails.value) return
  
  const isSet = props.productId.toString().startsWith('set-')
  const cartName = isSet ? `[PC Set] ${productDetails.value.name}` : productDetails.value.name
  
  triggerModalNotification(`หยิบ ${productDetails.value.name} ใส่ตะกร้าเรียบร้อยแล้ว!`, 'success')
  
  window.dispatchEvent(new CustomEvent('add-to-cart', { 
    detail: {
      name: cartName,
      price: productDetails.value.price
    } 
  }))
}

// Use in Custom Spec Builder
const handleUseInBuilder = () => {
  if (!productDetails.value) return
  
  const isSet = props.productId.toString().startsWith('set-')
  
  if (isSet) {
    // Implement customized prebuilt set loading in builder
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

    if (productDetails.value.partsList) {
      productDetails.value.partsList.forEach(part => {
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
          const dbPart = allParts.value.find(p => p.id === part.id)
          const partPrice = dbPart ? dbPart.price : 0
          const partSpecs = dbPart ? dbPart.specs : (part.name + ' อุปกรณ์ประสิทธิภาพเยี่ยมรับประกันศูนย์ไทย')
          
          customBuildData[slotKey] = {
            id: part.id,
            category: slotKey === 'motherboard' ? 'motherboard' : (slotKey === 'liquid_cooler' ? 'liquid_cooler' : (slotKey === 'cpu_cooler' ? 'cpu_cooler' : slotKey)),
            brand: part.name.split(' ')[0] || 'Premium',
            name: part.name,
            price: partPrice,
            specs: partSpecs
          }
        }
      })
    }

    localStorage.setItem('myCustomBuild', JSON.stringify(customBuildData))
    triggerModalNotification('จัดทำสเปกเริ่มต้นจากคอมเซ็ตเรียบร้อยแล้ว! กำลังเปลี่ยนหน้า...', 'success')
    
    setTimeout(() => {
      closeModal()
      router.push('/build')
    }, 1200)

  } else {
    // Individual PC Part building
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
    let slotKey = productDetails.value.category
    if (slotKey === 'liquid_cooler') slotKey = 'liquid_cooler'
    else if (slotKey === 'cpu_cooler') slotKey = 'cpu_cooler'
    else if (slotKey === 'case_fan') slotKey = 'case_fan'

    if (slotKey in customBuildData) {
      customBuildData[slotKey] = {
        id: productDetails.value.id,
        category: productDetails.value.category,
        brand: productDetails.value.brand,
        name: productDetails.value.name,
        price: productDetails.value.price,
        specs: productDetails.value.specs,
        socket: productDetails.value.socket || ''
      }
    }

    localStorage.setItem('myCustomBuild', JSON.stringify(customBuildData))
    triggerModalNotification(`เพิ่ม ${productDetails.value.name} เข้าชุดจัดสเปกแล้ว! กำลังไปยังหน้าจัดสเปก...`, 'success')

    setTimeout(() => {
      closeModal()
      router.push('/build')
    }, 1200)
  }
}

// Helpers
const getStarClass = (index, avgRating) => {
  if (!avgRating) return 'bi-star text-muted'
  if (index <= Math.floor(avgRating)) {
    return 'bi-star-fill text-warning'
  }
  if (index - 0.5 <= avgRating) {
    return 'bi-star-half text-warning'
  }
  return 'bi-star text-muted'
}

const getDistributionPercentage = (star) => {
  if (!stats.value.totalReviews) return 0
  const count = stats.value.ratingDistribution?.[star] || 0
  return Math.round((count / stats.value.totalReviews) * 100)
}

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

// Category mappings to Thai labels
const getCategoryLabel = (category) => {
  const mapping = {
    'cpu': 'หน่วยประมวลผล (CPU)',
    'gpu': 'การ์ดจอแสดงผล (GPU)',
    'motherboard': 'เมนบอร์ด (Mainboard)',
    'ram': 'หน่วยความจำ (RAM)',
    'ssd': 'ฮาร์ดดิสก์แบบ SSD',
    'm2': 'สตอเรจ M.2 NVMe',
    'psu': 'พาวเวอร์ซัพพลาย (PSU)',
    'case': 'เคสคอมพิวเตอร์ (Case)',
    'monitor': 'หน้าจอคอม (Monitor)',
    'mouse': 'เมาส์เกมมิ่ง (Mouse)',
    'keyboard': 'คีย์บอร์ดกลไก (Keyboard)',
    'set': 'คอมพิวเตอร์จัดชุด (PC Set)'
  }
  return mapping[category] || 'อุปกรณ์ฮาร์ดแวร์'
}

// Socket color flag support
const getSocketPlatformClass = (socket) => {
  if (!socket) return ''
  const s = socket.toLowerCase()
  if (s.includes('lga') || s.includes('intel')) return 'socket-intel'
  if (s.includes('am5') || s.includes('am4') || s.includes('amd')) return 'socket-amd'
  return 'socket-generic'
}

// Dynamic spec parsing for specs table
const parsedSpecs = computed(() => {
  if (!productDetails.value || !productDetails.value.specs) return []
  const parts = productDetails.value.specs.split('/').map(s => s.trim()).filter(Boolean)
  return parts.map(part => {
    let label = 'คุณสมบัติ'
    let value = part
    
    const pLow = part.toLowerCase()
    if (pLow.includes('socket') || pLow.includes('lga') || pLow.includes('am5') || pLow.includes('am4')) {
      label = 'ซ็อกเก็ตเชื่อมต่อ (Socket)'
    } else if (pLow.includes('core')) {
      label = 'แกนประมวลผล (Cores)'
    } else if (pLow.includes('thread')) {
      label = 'เธรดการทำงาน (Threads)'
    } else if (pLow.includes('ghz') || pLow.includes('speed')) {
      label = 'ความเร็วประมวลผล (Clock Speed)'
    } else if (pLow.includes('mhz') || pLow.includes('cl30') || pLow.includes('cl16')) {
      label = 'สเปกหน่วยความจำ (RAM Speed)'
    } else if (pLow.includes('graphics') || pLow.includes('geforce') || pLow.includes('rtx')) {
      label = 'ชิปเซตกราฟิก (GPU)'
    } else if (pLow.includes('tdp') || pLow.includes('watts') || pLow.includes('watt') || pLow.includes('gold')) {
      label = 'กำลังไฟ / มาตรฐาน (Power)'
    } else if (pLow.includes('gb') || pLow.includes('tb') || pLow.includes('2tb')) {
      label = 'ความจุสินค้า (Capacity)'
    } else if (pLow.includes('read') || pLow.includes('write') || pLow.includes('mb/s')) {
      label = 'ความเร็วในการโอนถ่ายข้อมูล'
    } else if (pLow.includes('fan') || pLow.includes('cooling') || pLow.includes('heatsink')) {
      label = 'การระบายความร้อน'
    } else if (pLow.includes('glass') || pLow.includes('chamber') || pLow.includes('atx')) {
      label = 'ฟอร์มแฟกเตอร์ / เคส'
    } else if (pLow.includes('inch') || pLow.includes('qhd') || pLow.includes('oled') || pLow.includes('hz')) {
      label = 'คุณสมบัติจอภาพ'
    } else if (pLow.includes('sensor') || pLow.includes('dpi') || pLow.includes('battery')) {
      label = 'เทคโนโลยีเซนเซอร์'
    } else if (pLow.includes('switch') || pLow.includes('mechanical') || pLow.includes('gasket')) {
      label = 'ชนิดปุ่มและสวิตช์'
    }
    
    return { label, value }
  })
})

// Dynamic premium inline SVGs representing categories
const getCategorySvg = (category) => {
  const isSet = props.productId.toString().startsWith('set-')
  
  if (isSet) {
    // SVGs for PC Sets (Battle Station Desktop setup)
    return `<svg viewBox="0 0 100 100" class="neon-svg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="setGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#00f2fe" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="#6366f1" stop-opacity="0.8"/>
        </linearGradient>
        <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <!-- Desk line -->
      <line x1="10" y1="85" x2="90" y2="85" stroke="rgba(255,255,255,0.2)" stroke-width="2" />
      <!-- PC Case -->
      <rect x="68" y="35" width="18" height="40" rx="3" fill="none" stroke="url(#setGrad)" stroke-width="2" filter="url(#neonGlow)"/>
      <circle cx="77" cy="45" r="4" fill="none" stroke="#6366f1" stroke-width="1"/>
      <circle cx="77" cy="55" r="4" fill="none" stroke="#00f2fe" stroke-width="1"/>
      <circle cx="77" cy="65" r="4" fill="none" stroke="#6366f1" stroke-width="1"/>
      <!-- Monitor -->
      <rect x="22" y="32" width="38" height="24" rx="2" fill="none" stroke="url(#setGrad)" stroke-width="2" filter="url(#neonGlow)"/>
      <line x1="41" y1="56" x2="41" y2="72" stroke="url(#setGrad)" stroke-width="2"/>
      <ellipse cx="41" cy="72" rx="10" ry="2" fill="none" stroke="url(#setGrad)" stroke-width="2"/>
      <!-- Keyboard -->
      <rect x="24" y="78" width="22" height="4" rx="1" fill="none" stroke="#00f2fe" stroke-width="1.5"/>
      <!-- Mouse -->
      <ellipse cx="53" cy="80" rx="2" ry="3" fill="none" stroke="#6366f1" stroke-width="1.5"/>
      <!-- Connection line -->
      <path d="M 68 70 L 53 70 L 46 78" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1" />
    </svg>`
  }

  // individual hardware component SVGs
  switch(category) {
    case 'cpu':
      return `<svg viewBox="0 0 100 100" class="neon-svg" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="cpuGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#3b82f6" />
            <stop offset="100%" stop-color="#00f2fe" />
          </linearGradient>
          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <!-- CPU Silicon block -->
        <rect x="20" y="20" width="60" height="60" rx="8" fill="rgba(15, 23, 42, 0.6)" stroke="url(#cpuGrad)" stroke-width="3" filter="url(#neonGlow)" />
        <rect x="28" y="28" width="44" height="44" rx="4" fill="none" stroke="url(#cpuGrad)" stroke-width="1.5" stroke-dasharray="4 2" />
        <!-- Pins and Circuits -->
        <line x1="10" y1="30" x2="20" y2="30" stroke="#3b82f6" stroke-width="2" />
        <line x1="10" y1="42" x2="20" y2="42" stroke="#3b82f6" stroke-width="2" />
        <line x1="10" y1="58" x2="20" y2="58" stroke="#3b82f6" stroke-width="2" />
        <line x1="10" y1="70" x2="20" y2="70" stroke="#3b82f6" stroke-width="2" />
        
        <line x1="80" y1="30" x2="90" y2="30" stroke="#00f2fe" stroke-width="2" />
        <line x1="80" y1="42" x2="90" y2="42" stroke="#00f2fe" stroke-width="2" />
        <line x1="80" y1="58" x2="90" y2="58" stroke="#00f2fe" stroke-width="2" />
        <line x1="80" y1="70" x2="90" y2="70" stroke="#00f2fe" stroke-width="2" />
        
        <line x1="30" y1="10" x2="30" y2="20" stroke="#3b82f6" stroke-width="2" />
        <line x1="42" y1="10" x2="42" y2="20" stroke="#3b82f6" stroke-width="2" />
        <line x1="58" y1="10" x2="58" y2="20" stroke="#00f2fe" stroke-width="2" />
        <line x1="70" y1="10" x2="70" y2="20" stroke="#00f2fe" stroke-width="2" />
        
        <line x1="30" y1="80" x2="30" y2="90" stroke="#3b82f6" stroke-width="2" />
        <line x1="42" y1="80" x2="42" y2="90" stroke="#3b82f6" stroke-width="2" />
        <line x1="58" y1="80" x2="58" y2="90" stroke="#00f2fe" stroke-width="2" />
        <line x1="70" y1="80" x2="70" y2="90" stroke="#00f2fe" stroke-width="2" />
        
        <!-- Core Text -->
        <text x="50" y="55" font-family="'Outfit', sans-serif" font-weight="800" font-size="14" fill="#ffffff" text-anchor="middle">CPU</text>
      </svg>`
    case 'gpu':
      return `<svg viewBox="0 0 100 100" class="neon-svg" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="gpuGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#a855f7" />
            <stop offset="100%" stop-color="#ec4899" />
          </linearGradient>
          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <!-- Board outline -->
        <rect x="15" y="30" width="70" height="40" rx="6" fill="rgba(15,23,42,0.6)" stroke="url(#gpuGrad)" stroke-width="3" filter="url(#gpuGrad)" />
        <!-- Cooling Fans -->
        <circle cx="37" cy="50" r="13" fill="none" stroke="url(#gpuGrad)" stroke-width="2"/>
        <line x1="37" y1="37" x2="37" y2="63" stroke="#ec4899" stroke-width="1.5"/>
        <line x1="24" y1="50" x2="50" y2="50" stroke="#ec4899" stroke-width="1.5"/>
        
        <circle cx="63" cy="50" r="13" fill="none" stroke="url(#gpuGrad)" stroke-width="2"/>
        <line x1="63" y1="37" x2="63" y2="63" stroke="#a855f7" stroke-width="1.5"/>
        <line x1="50" y1="50" x2="76" y2="50" stroke="#a855f7" stroke-width="1.5"/>
        <!-- PCIe Gold connection -->
        <rect x="25" y="70" width="40" height="4" fill="#eab308" rx="1"/>
      </svg>`
    case 'motherboard':
      return `<svg viewBox="0 0 100 100" class="neon-svg" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="moboGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#6366f1" />
            <stop offset="100%" stop-color="#3b82f6" />
          </linearGradient>
          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <!-- Motherboard layout -->
        <rect x="18" y="15" width="64" height="70" rx="4" fill="rgba(15,23,42,0.6)" stroke="url(#moboGrad)" stroke-width="2.5" filter="url(#neonGlow)"/>
        <!-- Socket -->
        <rect x="38" y="25" width="24" height="24" rx="2" fill="none" stroke="#6366f1" stroke-width="2"/>
        <rect x="43" y="30" width="14" height="14" fill="none" stroke="#3b82f6" stroke-width="1" stroke-dasharray="2 1"/>
        <!-- PCIe Slot -->
        <rect x="25" y="65" width="50" height="4" rx="1" fill="none" stroke="#6366f1" stroke-width="2"/>
        <rect x="25" y="75" width="40" height="3" rx="1" fill="none" stroke="#3b82f6" stroke-width="1"/>
        <!-- RAM Slots -->
        <line x1="68" y1="22" x2="68" y2="48" stroke="#3b82f6" stroke-width="1.5" />
        <line x1="72" y1="22" x2="72" y2="48" stroke="#6366f1" stroke-width="1.5" />
        <line x1="76" y1="22" x2="76" y2="48" stroke="#3b82f6" stroke-width="1.5" />
      </svg>`
    case 'ram':
      return `<svg viewBox="0 0 100 100" class="neon-svg" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="ramGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#06b6d4" />
            <stop offset="50%" stop-color="#84cc16" />
            <stop offset="100%" stop-color="#00f2fe" />
          </linearGradient>
          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <!-- Memory module -->
        <rect x="10" y="38" width="80" height="24" rx="3" fill="rgba(15,23,42,0.6)" stroke="url(#ramGrad)" stroke-width="2.5" filter="url(#neonGlow)"/>
        <!-- RGB light bar -->
        <rect x="12" y="34" width="76" height="4" rx="1" fill="url(#ramGrad)"/>
        <!-- Memory chips -->
        <rect x="20" y="46" width="10" height="10" rx="1" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>
        <rect x="36" y="46" width="10" height="10" rx="1" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>
        <rect x="52" y="46" width="10" height="10" rx="1" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>
        <rect x="68" y="46" width="10" height="10" rx="1" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>
        <!-- Connection Pins -->
        <line x1="15" y1="62" x2="15" y2="65" stroke="#84cc16" stroke-width="1" />
        <line x1="25" y1="62" x2="25" y2="65" stroke="#84cc16" stroke-width="1" />
        <line x1="35" y1="62" x2="35" y2="65" stroke="#84cc16" stroke-width="1" />
        <line x1="45" y1="62" x2="45" y2="65" stroke="#84cc16" stroke-width="1" />
        <line x1="55" y1="62" x2="55" y2="65" stroke="#84cc16" stroke-width="1" />
        <line x1="65" y1="62" x2="65" y2="65" stroke="#84cc16" stroke-width="1" />
        <line x1="75" y1="62" x2="75" y2="65" stroke="#84cc16" stroke-width="1" />
        <line x1="85" y1="62" x2="85" y2="65" stroke="#84cc16" stroke-width="1" />
      </svg>`
    case 'ssd':
    case 'm2':
      return `<svg viewBox="0 0 100 100" class="neon-svg" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="ssdGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#14b8a6" />
            <stop offset="100%" stop-color="#06b6d4" />
          </linearGradient>
          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <!-- M.2 board -->
        <rect x="15" y="38" width="70" height="24" rx="2" fill="rgba(15,23,42,0.6)" stroke="url(#ssdGrad)" stroke-width="2.5" filter="url(#neonGlow)"/>
        <!-- Connection interface pin -->
        <rect x="11" y="44" width="4" height="12" fill="#eab308" rx="0.5"/>
        <!-- Memory Controllers & Flash NAND Chips -->
        <rect x="24" y="43" width="10" height="14" fill="none" stroke="#14b8a6" stroke-width="1.5"/>
        <rect x="42" y="43" width="15" height="14" fill="none" stroke="#06b6d4" stroke-width="1.5"/>
        <rect x="63" y="43" width="15" height="14" fill="none" stroke="#06b6d4" stroke-width="1.5"/>
      </svg>`
    case 'psu':
      return `<svg viewBox="0 0 100 100" class="neon-svg" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="psuGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#eab308" />
            <stop offset="100%" stop-color="#f97316" />
          </linearGradient>
          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <!-- Modular PSU Box -->
        <rect x="25" y="25" width="50" height="50" rx="8" fill="rgba(15,23,42,0.6)" stroke="url(#psuGrad)" stroke-width="3" filter="url(#neonGlow)"/>
        <!-- Fan mesh/glow -->
        <circle cx="50" cy="50" r="18" fill="none" stroke="url(#psuGrad)" stroke-width="2" stroke-dasharray="4 2"/>
        <circle cx="50" cy="50" r="6" fill="url(#psuGrad)"/>
        <!-- Modular power cable slots -->
        <rect x="32" y="62" width="6" height="4" fill="rgba(255,255,255,0.3)"/>
        <rect x="42" y="62" width="6" height="4" fill="rgba(255,255,255,0.3)"/>
        <rect x="52" y="62" width="6" height="4" fill="rgba(255,255,255,0.3)"/>
        <rect x="62" y="62" width="6" height="4" fill="rgba(255,255,255,0.3)"/>
      </svg>`
    case 'case':
      return `<svg viewBox="0 0 100 100" class="neon-svg" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="caseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#3b82f6" />
            <stop offset="100%" stop-color="#a855f7" />
          </linearGradient>
          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <!-- ATX Chassis -->
        <rect x="25" y="15" width="50" height="70" rx="5" fill="rgba(15,23,42,0.6)" stroke="url(#caseGrad)" stroke-width="3" filter="url(#neonGlow)"/>
        <!-- Glass side window reflection -->
        <line x1="30" y1="25" x2="55" y2="75" stroke="rgba(255,255,255,0.15)" stroke-width="2" stroke-linecap="round"/>
        <line x1="38" y1="25" x2="48" y2="45" stroke="rgba(255,255,255,0.1)" stroke-width="1.5" stroke-linecap="round"/>
        <!-- Glowing cooling fan circles -->
        <circle cx="65" cy="30" r="6" fill="none" stroke="#3b82f6" stroke-width="1.5" filter="url(#neonGlow)"/>
        <circle cx="65" cy="48" r="6" fill="none" stroke="#a855f7" stroke-width="1.5" filter="url(#neonGlow)"/>
        <circle cx="65" cy="66" r="6" fill="none" stroke="#3b82f6" stroke-width="1.5" filter="url(#neonGlow)"/>
      </svg>`
    case 'monitor':
      return `<svg viewBox="0 0 100 100" class="neon-svg" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="monGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#00f2fe" />
            <stop offset="100%" stop-color="#6366f1" />
          </linearGradient>
          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <!-- Curved Screen -->
        <path d="M 12 25 Q 50 20 88 25 L 88 65 Q 50 60 12 65 Z" fill="rgba(15,23,42,0.6)" stroke="url(#monGrad)" stroke-width="3" filter="url(#neonGlow)" />
        <!-- Glowing desktop mesh inside monitor -->
        <path d="M 20 35 L 35 48 L 45 42 L 65 52 L 80 40" fill="none" stroke="url(#monGrad)" stroke-width="1.5" stroke-dasharray="3 3"/>
        <!-- Stand -->
        <line x1="50" y1="62" x2="50" y2="78" stroke="url(#monGrad)" stroke-width="3.5" />
        <ellipse cx="50" cy="78" rx="16" ry="3" fill="none" stroke="url(#monGrad)" stroke-width="2.5" />
      </svg>`
    case 'mouse':
      return `<svg viewBox="0 0 100 100" class="neon-svg" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="mouseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#06b6d4" />
            <stop offset="100%" stop-color="#3b82f6" />
          </linearGradient>
          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <!-- Ergonomic Mouse Body -->
        <rect x="32" y="20" width="36" height="60" rx="18" fill="rgba(15,23,42,0.6)" stroke="url(#mouseGrad)" stroke-width="2.5" filter="url(#neonGlow)" />
        <!-- Scroll wheel -->
        <rect x="47" y="28" width="6" height="12" rx="3" fill="url(#mouseGrad)"/>
        <!-- Click Separation line -->
        <line x1="50" y1="20" x2="50" y2="42" stroke="url(#mouseGrad)" stroke-width="1.5" />
        <!-- RGB light outline -->
        <path d="M 36 60 Q 50 68 64 60" fill="none" stroke="url(#mouseGrad)" stroke-width="1.5" stroke-dasharray="4 2"/>
      </svg>`
    case 'keyboard':
      return `<svg viewBox="0 0 100 100" class="neon-svg" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="kbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ec4899" />
            <stop offset="100%" stop-color="#8b5cf6" />
          </linearGradient>
          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <!-- Keyboard Board -->
        <rect x="10" y="32" width="80" height="36" rx="4" fill="rgba(15,23,42,0.6)" stroke="url(#kbGrad)" stroke-width="2.5" filter="url(#neonGlow)"/>
        <!-- OLED Display on top right -->
        <rect x="76" y="36" width="10" height="6" rx="1" fill="none" stroke="#ec4899" stroke-width="1" />
        <!-- Key rows layout -->
        <rect x="15" y="44" width="8" height="6" rx="1.5" fill="none" stroke="url(#kbGrad)" stroke-width="1" />
        <rect x="26" y="44" width="8" height="6" rx="1.5" fill="none" stroke="url(#kbGrad)" stroke-width="1" />
        <rect x="37" y="44" width="8" height="6" rx="1.5" fill="none" stroke="url(#kbGrad)" stroke-width="1" />
        <rect x="48" y="44" width="8" height="6" rx="1.5" fill="none" stroke="url(#kbGrad)" stroke-width="1" />
        <rect x="59" y="44" width="8" height="6" rx="1.5" fill="none" stroke="url(#kbGrad)" stroke-width="1" />
        <rect x="70" y="44" width="8" height="6" rx="1.5" fill="none" stroke="url(#kbGrad)" stroke-width="1" />
        
        <rect x="15" y="54" width="8" height="6" rx="1.5" fill="none" stroke="url(#kbGrad)" stroke-width="1" />
        <!-- Spacebar -->
        <rect x="26" y="54" width="30" height="6" rx="1.5" fill="none" stroke="url(#kbGrad)" stroke-width="1" />
        <rect x="59" y="54" width="8" height="6" rx="1.5" fill="none" stroke="url(#kbGrad)" stroke-width="1" />
        <rect x="70" y="54" width="8" height="6" rx="1.5" fill="none" stroke="url(#kbGrad)" stroke-width="1" />
      </svg>`
    default:
      return `<svg viewBox="0 0 100 100" class="neon-svg" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="defGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#00f2fe" />
            <stop offset="100%" stop-color="#9d4edd" />
          </linearGradient>
          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <circle cx="50" cy="50" r="30" fill="rgba(15,23,42,0.6)" stroke="url(#defGrad)" stroke-width="3" filter="url(#neonGlow)"/>
        <polygon points="50,32 65,60 35,60" fill="none" stroke="url(#defGrad)" stroke-width="2"/>
        <line x1="50" y1="42" x2="50" y2="55" stroke="#ffffff" stroke-width="2" />
        <circle cx="50" cy="56" r="1" fill="#ffffff" />
      </svg>`
  }
}

onMounted(() => {
  checkLogin()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&family=Kanit:wght@200;400;600&display=swap');

/* Modal Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.4s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* Modal Layout */
.reviews-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.35); /* Soft premium slate-900 transparent overlay */
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 2000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5rem;
}

.reviews-modal-container {
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  color: #1e293b; /* Slate-800 text for maximum legibility */
  overflow: hidden;
  animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  font-family: 'Outfit', 'Kanit', sans-serif;
  position: relative;
}

@keyframes scaleUp {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

/* Premium Light Glassmorphism Styles */
.glassmorphic-card {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(14, 165, 233, 0.15); /* Sleek light cyan border */
  border-radius: 24px;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.08), 
              0 0 40px rgba(14, 165, 233, 0.05),
              inset 0 0 2px rgba(255, 255, 255, 0.6);
}

/* Header */
.modal-header-custom {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem 2rem 1rem 2rem;
  border-bottom: 1px solid rgba(14, 165, 233, 0.1);
}

.header-info {
  flex: 1;
  min-width: 0;
}

.product-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #0f172a 0%, #1d4ed8 50%, #0ea5e9 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.badge-premium {
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.08) 0%, rgba(79, 70, 229, 0.08) 100%);
  border: 1px solid rgba(79, 70, 229, 0.2);
  color: #4f46e5;
  font-weight: 600;
  padding: 0.35rem 0.75rem;
  border-radius: 50px;
  display: inline-flex;
  align-items: center;
}

.close-btn {
  background: rgba(15, 23, 42, 0.03);
  border: 1px solid rgba(15, 23, 42, 0.08);
  color: #64748b;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-left: 1rem;
}

.close-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  transform: rotate(90deg);
}

/* Dual-Tab Styles */
.tabs-navigation {
  display: flex;
  background: rgba(14, 165, 233, 0.02);
  border-bottom: 1px solid rgba(14, 165, 233, 0.1);
  padding: 0 1.5rem;
  gap: 0.5rem;
}

.tab-nav-btn {
  background: none;
  border: none;
  color: #64748b;
  padding: 1rem 1.25rem;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

.tab-nav-btn:hover {
  color: #0f172a;
}

.tab-nav-btn.active {
  color: #0284c7;
}

.tab-nav-btn.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, #0ea5e9 0%, #4f46e5 100%);
  box-shadow: 0 0 8px rgba(14, 165, 233, 0.4);
}

/* Modal sizing for PC sets */
.set-modal-width {
  max-width: 1050px !important;
}

/* Inline Modal Notification */
.modal-inline-notification {
  position: absolute;
  top: 15px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.5rem;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 600;
  animation: slideDownFade 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.modal-inline-notification.success {
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  color: #059669;
}

.modal-inline-notification.info {
  background: rgba(14, 165, 233, 0.1);
  border: 1px solid rgba(14, 165, 233, 0.2);
  color: #0284c7;
}

@keyframes slideDownFade {
  from { transform: translate(-50%, -15px); opacity: 0; }
  to { transform: translate(-50%, 0); opacity: 1; }
}

/* Visual Sidebar Layout */
.visual-sidebar-card {
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(14, 165, 233, 0.1);
  border-radius: 20px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 8px 32px rgba(15, 23, 42, 0.03);
}

.svg-illustration-container {
  width: 160px;
  height: 160px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(14, 165, 233, 0.03);
  border: 1px solid rgba(14, 165, 233, 0.12);
  border-radius: 50%;
  padding: 1.25rem;
  box-shadow: inset 0 0 15px rgba(14, 165, 233, 0.05);
  transition: all 0.3s ease;
}

.svg-illustration-container:hover {
  transform: scale(1.05) rotate(2deg);
  border-color: rgba(14, 165, 233, 0.3);
  box-shadow: inset 0 0 20px rgba(14, 165, 233, 0.1),
              0 0 20px rgba(14, 165, 233, 0.1);
}

.neon-svg {
  width: 100%;
  height: 100%;
}

/* Custom badges */
.badge-brand {
  background: rgba(79, 70, 229, 0.08);
  border: 1px solid rgba(79, 70, 229, 0.2);
  color: #4f46e5;
  font-weight: 600;
  border-radius: 6px;
  padding: 0.3rem 0.6rem;
}

.badge-category {
  background: rgba(14, 165, 233, 0.08);
  border: 1px solid rgba(14, 165, 233, 0.2);
  color: #0284c7;
  font-weight: 600;
  border-radius: 6px;
  padding: 0.3rem 0.6rem;
}

.badge-stock {
  background: rgba(16, 185, 129, 0.08);
  border: 1px solid rgba(16, 185, 129, 0.2);
  color: #059669;
  font-weight: 600;
  border-radius: 6px;
  padding: 0.3rem 0.6rem;
}

/* Price selection */
.price-selection-card {
  width: 100%;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  box-shadow: inset 0 2px 4px rgba(15, 23, 42, 0.02);
}

.price-value-container {
  display: flex;
  align-items: baseline;
  justify-content: center;
  color: #0f172a;
}

.price-value-container .currency {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0ea5e9;
  margin-right: 0.2rem;
}

.price-value-container .price-amount {
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #0f172a 30%, #0ea5e9 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Platform Socket Flags */
.socket-info-banner {
  padding: 0.5rem 1rem;
  border-radius: 12px;
  text-align: center;
  font-weight: 650;
  font-size: 0.8rem;
}

.socket-intel {
  background: rgba(14, 165, 233, 0.08);
  border: 1px solid rgba(14, 165, 233, 0.2);
  color: #0369a1;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.04);
}

.socket-amd {
  background: rgba(249, 115, 22, 0.08);
  border: 1px solid rgba(249, 115, 22, 0.2);
  color: #c2410c;
  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.04);
}

.socket-generic {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  color: #475569;
}

.socket-header {
  font-size: 0.7rem;
  opacity: 0.8;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.socket-value {
  font-size: 0.9rem;
  font-weight: 700;
}

/* Buy buttons */
.btn-add-to-cart {
  background: linear-gradient(90deg, #10b981 0%, #059669 100%);
  border: none;
  color: #ffffff;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
}

.btn-add-to-cart:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(16, 185, 129, 0.35);
  filter: brightness(1.05);
}

.btn-use-in-builder {
  background: #ffffff;
  border: 1px solid rgba(14, 165, 233, 0.4);
  color: #0ea5e9;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  box-shadow: 0 2px 6px rgba(14, 165, 233, 0.05);
}

.btn-use-in-builder:hover {
  background: rgba(14, 165, 233, 0.05);
  border-color: #0ea5e9;
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(14, 165, 233, 0.15);
}

/* Specifications Table */
.details-section-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #1e293b;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 0.5rem;
  display: flex;
  align-items: center;
}

.specs-table-container {
  border-radius: 16px;
  overflow: hidden;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.02);
}

.table-custom {
  font-size: 0.85rem;
}

.spec-row {
  border-bottom: 1px solid #f1f5f9;
  transition: all 0.2s ease;
}

.spec-row:last-child {
  border-bottom: none;
}

.spec-row:hover {
  background: #f8fafc;
}

.table-custom td {
  padding: 0.8rem 1.2rem;
  vertical-align: middle;
  border: none;
  background: transparent !important;
}

.spec-label {
  width: 35%;
  border-right: 1px solid #f1f5f9;
}

.spec-value {
  width: 65%;
  line-height: 1.4;
}

/* PC Set Parts Checklist */
.set-parts-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  max-height: 480px;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.set-parts-grid::-webkit-scrollbar {
  width: 4px;
}
.set-parts-grid::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.set-part-item-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 0.75rem 1rem;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(15, 23, 42, 0.01);
}

.set-part-item-card:hover {
  background: #f8fafc;
  border-color: rgba(14, 165, 233, 0.3);
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.05);
}

.part-icon-box {
  width: 38px;
  height: 38px;
  border-radius: 8px;
  background: rgba(79, 70, 229, 0.08);
  border: 1px solid rgba(79, 70, 229, 0.15);
  color: #4f46e5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}

.part-info {
  line-height: 1.3;
}

.part-label {
  letter-spacing: 0.3px;
}

.part-name {
  font-weight: 500;
}

.part-status-badge {
  display: flex;
  align-items: center;
  font-size: 1.1rem;
}

/* Body and Scrollbar */
.modal-body-custom {
  padding: 2rem;
  overflow-y: auto;
  flex: 1;
}

.scrollbar-custom::-webkit-scrollbar {
  width: 6px;
}
.scrollbar-custom::-webkit-scrollbar-track {
  background: #f1f5f9;
}
.scrollbar-custom::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
.scrollbar-custom::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Stats Card */
.stats-summary-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.02);
}

.section-title {
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #1e293b;
  border-left: 3px solid #4f46e5;
  padding-left: 0.75rem;
}

.huge-rating-number {
  font-size: 3.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #eab308 0%, #ca8a04 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1;
}

/* Progress Distribution */
.star-label {
  font-size: 0.8rem;
  width: 42px;
}

.progress-custom {
  height: 8px;
  background: #f1f5f9;
  border-radius: 10px;
  overflow: hidden;
}

.progress-bar-glow {
  background: linear-gradient(90deg, #4f46e5 0%, #0ea5e9 100%);
  box-shadow: 0 0 6px rgba(14, 165, 233, 0.2);
  border-radius: 10px;
  transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.percentage-label {
  font-size: 0.8rem;
  width: 36px;
  text-align: right;
}

.count-label {
  font-size: 0.75rem;
  width: 30px;
  text-align: right;
}

/* Form Write Review */
.login-prompt-card {
  background: rgba(217, 119, 6, 0.04);
  border: 1px dashed rgba(217, 119, 6, 0.3);
  border-radius: 16px;
  padding: 1.25rem;
}

.prompt-icon-box {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: rgba(217, 119, 6, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stars-selector {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  display: inline-flex;
}

.star-selector-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.15rem;
  font-size: 1.5rem;
  transition: transform 0.2s ease;
}

.star-selector-btn:hover {
  transform: scale(1.2) rotate(8deg);
}

.star-selector-btn i {
  transition: color 0.15s ease, filter 0.15s ease;
}

.star-selector-btn:hover i.bi-star-fill {
  filter: drop-shadow(0 0 5px rgba(250, 204, 21, 0.7));
}

.selected-rating-label {
  font-size: 0.85rem;
}

.textarea-container {
  position: relative;
}

.textarea-custom {
  background: #ffffff !important;
  border: 1px solid #cbd5e1 !important;
  color: #0f172a !important;
  border-radius: 16px !important;
  padding: 0.75rem 1rem !important;
  font-size: 0.85rem !important;
  resize: none;
  transition: all 0.3s ease !important;
}

.textarea-custom:focus {
  background: #ffffff !important;
  border-color: #4f46e5 !important;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15) !important;
}

.char-counter {
  position: absolute;
  bottom: 8px;
  right: 12px;
  color: #94a3b8;
}

/* Custom Alerts */
.alert-danger-custom {
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #dc2626;
}

.alert-success-custom {
  background: rgba(16, 185, 129, 0.08);
  border: 1px solid rgba(16, 185, 129, 0.2);
  color: #059669;
}

/* Buttons */
.btn-submit-review {
  background: linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%);
  border: none;
  color: #ffffff;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.2);
}

.btn-submit-review:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(14, 165, 233, 0.3);
  background: linear-gradient(135deg, #5850ec 0%, #0284c7 100%);
}

.btn-submit-review:disabled {
  background: #e2e8f0;
  box-shadow: none;
  color: #94a3b8;
  cursor: not-allowed;
}

/* Reviews List */
.reviews-items-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.reviews-items-container::-webkit-scrollbar {
  width: 4px;
}
.reviews-items-container::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.review-item-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 1rem 1.25rem;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(15, 23, 42, 0.01);
}

.review-item-card:hover {
  background: #f8fafc;
  border-color: rgba(14, 165, 233, 0.2);
  transform: translateX(3px);
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03);
}

.avatar-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4f46e5 0%, #a855f7 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.95rem;
  color: #ffffff;
  box-shadow: 0 4px 10px rgba(79, 70, 229, 0.2);
}

.user-email {
  letter-spacing: 0.3px;
}

.review-comment {
  line-height: 1.5;
  white-space: pre-line;
}

.empty-reviews {
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 20px;
}

.empty-icon-box {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: #ffffff;
  border: 1px solid #e2e8f0;
}

/* Animations */
.animate-pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
}

.animate-slide-up {
  animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes slideUp {
  from { transform: translateY(15px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease both;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Custom Text Colors for Light Theme */
.text-slate-dark {
  color: #0f172a !important;
}

.text-slate-gray {
  color: #475569 !important;
}

/* Responsive */
@media (max-width: 991px) {
  .reviews-modal-container {
    max-height: 95vh;
  }
  .modal-body-custom {
    padding: 1.25rem;
  }
}
</style>
