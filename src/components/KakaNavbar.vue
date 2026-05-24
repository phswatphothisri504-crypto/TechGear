<template>
  <div class="ihavecpu-navbar-wrapper">
    <!-- Tier 1: Top Bar (Black background, white/gray text) -->
    <div class="top-bar d-none d-lg-block">
      <div class="container d-flex justify-content-between align-items-center py-2">
        <div class="d-flex align-items-center gap-4 text-white-50">
          <span class="top-item d-flex align-items-center gap-2">
            <i class="bi bi-telephone-fill icon-red"></i>
            <a href="tel:0620500065" class="text-white-50 text-decoration-none hover-white">0620500065</a>
          </span>
          <span class="top-item d-flex align-items-center gap-2">
            <i class="bi bi-envelope-fill icon-red"></i>
            <a href="mailto:info@techgearcom" class="text-white-50 text-decoration-none hover-white">info@techgearcom</a>
          </span>
          <span class="top-item slogan-text text-white-50 border-start ps-3 border-secondary">
            TechGear ถ้าคุณชอบคอมพิวเตอร์ เราคือเพื่อนกัน
          </span>
        </div>
        <div class="d-flex align-items-center">
          <a href="#" class="top-item d-flex align-items-center gap-2 text-white-50 text-decoration-none hover-white" @click.prevent="showLocationAlert">
            <i class="bi bi-geo-alt-fill icon-red"></i>
            <span>ค้นหาร้านค้าใกล้คุณ</span>
            <i class="bi bi-chevron-right fs-9"></i>
          </a>
        </div>
      </div>
    </div>

    <!-- Tier 2: Middle Header (White background) -->
    <div class="middle-header py-3 bg-white">
      <div class="container d-flex justify-content-between align-items-center gap-3">
        <!-- Logo (TechGear) -->
        <router-link to="/" class="logo-brand text-decoration-none d-flex align-items-center gap-2">
          <i class="bi bi-layers logo-icon"></i>
          <span class="logo-text">TechGear</span>
        </router-link>

        <!-- Search Bar -->
        <div class="search-bar-container flex-grow-1 mx-lg-5 max-w-lg">
          <form @submit.prevent="handleSearch" class="position-relative">
            <input 
              v-model="searchQuery" 
              type="text" 
              class="form-control search-input shadow-none" 
              placeholder="ค้นหาสินค้าที่ต้องการ..."
              @input="onSearchInput"
            >
            <button type="submit" class="btn btn-search-icon position-absolute top-50 end-0 translate-middle-y me-2 rounded-circle border-0 bg-transparent">
              <i class="bi bi-search text-secondary"></i>
            </button>
          </form>
        </div>

        <!-- Right Side Icons: Cart and User Profile -->
        <div class="d-flex align-items-center gap-3">
          <!-- Shopping Cart Icon with Badge -->
          <div class="position-relative cart-dropdown-wrapper" @mouseenter="showCartDropdown = true" @mouseleave="showCartDropdown = false">
            <button class="icon-btn-circle" @click="toggleCart" aria-label="Shopping Cart">
              <i class="bi bi-bag"></i>
              <span v-if="cartCount > 0" class="badge-cart-count">{{ cartCount }}</span>
            </button>
            
            <!-- Cart Dropdown -->
            <transition name="dropdown-fade">
              <div v-if="showCartDropdown" class="cart-dropdown-menu position-absolute end-0 bg-white shadow rounded-4 border-0 p-3 mt-1" style="width: 340px; z-index: 1050;">
                <div class="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2">
                  <h6 class="fw-bold m-0 text-dark">ตะกร้าสินค้าของคุณ</h6>
                  <span class="badge badge-red rounded-pill">{{ cartCount }} ชิ้น</span>
                </div>
                
                <div v-if="cartItems.length === 0" class="text-center py-4 text-muted">
                  <i class="bi bi-cart-x fs-1 text-secondary mb-2 d-block"></i>
                  <span>ไม่มีสินค้าในตะกร้า</span>
                </div>
                
                <div v-else class="cart-scroll-container">
                  <div class="cart-items-list mb-3">
                    <div v-for="(item, index) in cartItems" :key="index" class="d-flex align-items-center justify-content-between py-2 border-bottom">
                      <div class="d-flex align-items-center gap-2">
                        <div class="cart-product-icon-box rounded d-flex align-items-center justify-content-center">
                          <i :class="['bi', getProductIcon(item.name), 'text-secondary']"></i>
                        </div>
                        <div class="cart-item-info">
                          <div class="fw-bold text-dark fs-8 text-truncate" style="max-width: 170px;">{{ item.name }}</div>
                          <div class="price-text fw-semibold fs-9">฿{{ parseFloat(item.price).toLocaleString('th-TH') }}</div>
                        </div>
                      </div>
                      <button @click="removeFromCart(index)" class="btn btn-sm text-secondary hover-danger border-0 p-1">
                        <i class="bi bi-trash-fill text-danger"></i>
                      </button>
                    </div>
                  </div>
                  <div class="d-flex justify-content-between align-items-center pt-2 fw-bold text-dark border-top mb-3">
                    <span>ยอดรวมทั้งหมด:</span>
                    <span class="price-text fs-7">฿{{ cartTotal.toLocaleString('th-TH') }}</span>
                  </div>
                  <div class="d-grid gap-2">
                    <button class="btn btn-checkout w-100 rounded-pill fw-bold" @click="checkout">
                      <i class="bi bi-credit-card-2-front-fill me-2"></i>ชำระเงิน / ดูรายละเอียด
                    </button>
                  </div>
                </div>
              </div>
            </transition>
          </div>



          <!-- User Menu (Login / Profile) -->
          <div class="position-relative user-dropdown-wrapper" @mouseenter="showUserMenu = true" @mouseleave="showUserMenu = false">
            <button class="icon-btn-circle" @click="handleUserClick" aria-label="User Account">
              <i class="bi bi-person"></i>
            </button>

            <!-- Hover Dropdown Menu -->
            <transition name="dropdown-fade">
              <div v-if="showUserMenu" class="user-hover-menu position-absolute end-0 bg-white shadow rounded-4 border-0 p-3 mt-1" style="width: 220px; z-index: 1060;">
                <template v-if="!isLoggedIn">
                  <div class="text-center pb-2 border-bottom mb-2">
                    <p class="fs-8 text-muted mb-2">ยินดีต้อนรับเข้าสู่ TechGear</p>
                    <router-link to="/login" class="btn btn-primary-custom btn-sm w-100 rounded-pill fw-bold mb-1" @click="showUserMenu = false">เข้าสู่ระบบ</router-link>
                    <router-link to="/register" class="btn btn-outline-secondary btn-sm w-100 rounded-pill fw-bold mt-1" @click="showUserMenu = false">สมัครสมาชิก</router-link>
                  </div>
                </template>
                <template v-else>
                  <div class="pb-2 border-bottom mb-2">
                    <div class="fw-bold text-dark text-truncate">สวัสดีคุณลูกค้า</div>
                    <span class="badge bg-success-subtle text-success fs-9 px-2 mt-1 rounded-pill">{{ userRole === 'admin' ? 'ผู้ดูแลระบบ' : 'สมาชิกทั่วไป' }}</span>
                  </div>
                  <router-link to="/profile" class="dropdown-item-custom py-2 text-decoration-none d-flex align-items-center gap-2 text-secondary hover-dark" @click="showUserMenu = false">
                    <i class="bi bi-person-fill icon-red"></i>
                    <span>ข้อมูลส่วนตัว</span>
                  </router-link>
                  <router-link v-if="userRole === 'admin'" to="/product" class="dropdown-item-custom py-2 text-decoration-none d-flex align-items-center gap-2 text-secondary hover-dark" @click="showUserMenu = false">
                    <i class="bi bi-gear-fill icon-red"></i>
                    <span>จัดการสินค้าหลังร้าน</span>
                  </router-link>
                  <a href="#" class="dropdown-item-custom py-2 text-decoration-none d-flex align-items-center gap-2 text-danger border-top mt-2 pt-2" @click.prevent="onLogoutClick">
                    <i class="bi bi-box-arrow-right"></i>
                    <span>ออกจากระบบ</span>
                  </a>
                </template>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>

    <!-- Tier 3: Bottom Navigation Bar (Sticky Menu, white background) -->
    <nav class="bottom-nav bg-white border-top border-bottom sticky-top">
      <div class="container d-flex justify-content-between align-items-center py-1">
        <!-- Categories Button & Dropdown -->
        <div class="categories-dropdown-container position-relative" @mouseenter="showCategories = true" @mouseleave="showCategories = false">
          <button class="btn btn-categories d-flex align-items-center gap-2 px-3 py-2 text-dark font-medium border-0 shadow-none" @click.stop="toggleCategories">
            <i class="bi bi-grid-3x3-gap-fill icon-red"></i>
            <span>หมวดหมู่สินค้า</span>
            <i class="bi bi-chevron-down fs-8 ms-2"></i>
          </button>

          <!-- Category Hover List -->
          <transition name="dropdown-fade">
            <div v-if="showCategories" class="categories-list-dropdown position-absolute start-0 bg-white shadow rounded-4 border-0 p-3 mt-1" style="width: 280px; z-index: 1040;">
              <a href="#" class="category-item d-flex justify-content-between align-items-center py-2 px-3 rounded-3 text-dark text-decoration-none" :class="{ 'active-category': activeCategory === 'CPU' }" @click.prevent="filterCategory('CPU')">
                <span class="d-flex align-items-center gap-2">
                  <i class="bi bi-cpu text-secondary"></i> 
                  <span>CPU (หน่วยประมวลผล)</span>
                </span>
                <i class="bi bi-chevron-right fs-9 text-muted"></i>
              </a>
              <a href="#" class="category-item d-flex justify-content-between align-items-center py-2 px-3 rounded-3 text-dark text-decoration-none" :class="{ 'active-category': activeCategory === 'Graphics Card' }" @click.prevent="filterCategory('Graphics Card')">
                <span class="d-flex align-items-center gap-2">
                  <i class="bi bi-gpu-card text-secondary"></i> 
                  <span>การ์ดจอ (Graphics Card)</span>
                </span>
                <i class="bi bi-chevron-right fs-9 text-muted"></i>
              </a>
              <a href="#" class="category-item d-flex justify-content-between align-items-center py-2 px-3 rounded-3 text-dark text-decoration-none" :class="{ 'active-category': activeCategory === 'Memory' }" @click.prevent="filterCategory('Memory')">
                <span class="d-flex align-items-center gap-2">
                  <i class="bi bi-memory text-secondary"></i> 
                  <span>RAM (หน่วยความจำ)</span>
                </span>
                <i class="bi bi-chevron-right fs-9 text-muted"></i>
              </a>
              <a href="#" class="category-item d-flex justify-content-between align-items-center py-2 px-3 rounded-3 text-dark text-decoration-none" :class="{ 'active-category': activeCategory === 'Storage' }" @click.prevent="filterCategory('Storage')">
                <span class="d-flex align-items-center gap-2">
                  <i class="bi bi-hdd-fill text-secondary"></i> 
                  <span>SSD / HDD Storage</span>
                </span>
                <i class="bi bi-chevron-right fs-9 text-muted"></i>
              </a>
              <a href="#" class="category-item d-flex justify-content-between align-items-center py-2 px-3 rounded-3 text-dark text-decoration-none" :class="{ 'active-category': activeCategory === 'Motherboard' }" @click.prevent="filterCategory('Motherboard')">
                <span class="d-flex align-items-center gap-2">
                  <i class="bi bi-device-ssd text-secondary"></i> 
                  <span>เมนบอร์ด (Motherboard)</span>
                </span>
                <i class="bi bi-chevron-right fs-9 text-muted"></i>
              </a>
              <a href="#" class="category-item d-flex justify-content-between align-items-center py-2 px-3 rounded-3 text-dark text-decoration-none" :class="{ 'active-category': activeCategory === 'Monitor' }" @click.prevent="filterCategory('Monitor')">
                <span class="d-flex align-items-center gap-2">
                  <i class="bi bi-display text-secondary"></i> 
                  <span>จอคอม (Monitor)</span>
                </span>
                <i class="bi bi-chevron-right fs-9 text-muted"></i>
              </a>
              <a href="#" class="category-item d-flex justify-content-between align-items-center py-2 px-3 rounded-3 text-dark text-decoration-none" :class="{ 'active-category': activeCategory === 'PSU' }" @click.prevent="filterCategory('PSU')">
                <span class="d-flex align-items-center gap-2">
                  <i class="bi bi-plug text-secondary"></i> 
                  <span>พาวเวอร์ซัพพลาย (PSU)</span>
                </span>
                <i class="bi bi-chevron-right fs-9 text-muted"></i>
              </a>
              <a href="#" class="category-item d-flex justify-content-between align-items-center py-2 px-3 rounded-3 text-dark text-decoration-none" :class="{ 'active-category': activeCategory === 'Case' }" @click.prevent="filterCategory('Case')">
                <span class="d-flex align-items-center gap-2">
                  <i class="bi bi-box text-secondary"></i> 
                  <span>เคสคอมพิวเตอร์ (Case)</span>
                </span>
                <i class="bi bi-chevron-right fs-9 text-muted"></i>
              </a>
              <a href="#" class="category-item d-flex justify-content-between align-items-center py-2 px-3 rounded-3 text-dark text-decoration-none" :class="{ 'active-category': activeCategory === 'Cooling' }" @click.prevent="filterCategory('Cooling')">
                <span class="d-flex align-items-center gap-2">
                  <i class="bi bi-wind text-secondary"></i> 
                  <span>อุปกรณ์ระบายความร้อน (Cooling)</span>
                </span>
                <i class="bi bi-chevron-right fs-9 text-muted"></i>
              </a>
              <div class="border-top mt-2 pt-2">
                <a href="#" class="category-item d-flex justify-content-between align-items-center py-2 px-3 rounded-3 text-danger text-decoration-none fw-bold" :class="{ 'active-category': activeCategory === '' }" @click.prevent="filterCategory('')">
                  <span class="d-flex align-items-center gap-2">
                    <i class="bi bi-x-circle-fill"></i> 
                    <span>แสดงสินค้าทั้งหมด</span>
                  </span>
                </a>
              </div>
            </div>
          </transition>
        </div>

        <!-- Main Links (Middle/Right) -->
        <div class="main-menu-links d-none d-lg-flex align-items-center gap-4">
          <router-link to="/" class="nav-link-custom text-decoration-none py-2 text-dark font-medium" active-class="active">หน้าแรก</router-link>
          <router-link to="/computer-set" class="nav-link-custom text-decoration-none py-2 text-dark font-medium" active-class="active">คอมพิวเตอร์เซต</router-link>
          <router-link to="/build" class="nav-link-custom text-decoration-none py-2 text-dark font-medium" active-class="active">จัดสเปกคอม</router-link>
          <router-link to="/apipost" class="nav-link-custom text-decoration-none py-2 text-dark font-medium" active-class="active">บทความ</router-link>
          <router-link to="/reviews" class="nav-link-custom text-decoration-none py-2 text-dark font-medium" active-class="active">รีวิวลูกค้า</router-link>
          <router-link to="/about" class="nav-link-custom text-decoration-none py-2 text-dark font-medium" active-class="active">เกี่ยวกับเรา</router-link>
          <router-link to="/contact" class="nav-link-custom text-decoration-none py-2 text-dark font-medium" active-class="active">ติดต่อเรา</router-link>
          <router-link v-if="isLoggedIn && userRole === 'admin'" to="/product" class="nav-link-custom text-decoration-none py-2 text-danger fw-bold" active-class="active">จัดการสินค้าหลังร้าน</router-link>
        </div>

        <!-- Mobile Toggler -->
        <button class="navbar-toggler d-lg-none btn border-0 shadow-none px-2 text-dark" type="button" @click="showMobileMenu = !showMobileMenu" aria-label="Toggle Navigation">
          <i class="bi bi-list fs-2"></i>
        </button>
      </div>

      <!-- Mobile Menu Dropdown -->
      <div v-if="showMobileMenu" class="mobile-menu bg-white border-top d-lg-none py-3 px-4 shadow-sm">
        <div class="d-flex flex-column gap-3">
          <router-link to="/" class="mobile-nav-link text-decoration-none text-dark py-2 border-bottom" @click="showMobileMenu = false">หน้าแรก</router-link>
          <router-link to="/computer-set" class="mobile-nav-link text-decoration-none text-dark py-2 border-bottom" @click="showMobileMenu = false">คอมพิวเตอร์เซต</router-link>
          <router-link to="/build" class="mobile-nav-link text-decoration-none text-dark py-2 border-bottom" @click="showMobileMenu = false">จัดสเปกคอม</router-link>
          <router-link to="/apipost" class="mobile-nav-link text-decoration-none text-dark py-2 border-bottom" @click="showMobileMenu = false">บทความ</router-link>
          <router-link to="/reviews" class="mobile-nav-link text-decoration-none text-dark py-2 border-bottom" @click="showMobileMenu = false">รีวิวลูกค้า</router-link>
          <router-link to="/about" class="mobile-nav-link text-decoration-none text-dark py-2 border-bottom" @click="showMobileMenu = false">เกี่ยวกับเรา</router-link>
          <router-link to="/contact" class="mobile-nav-link text-decoration-none text-dark py-2 border-bottom" @click="showMobileMenu = false">ติดต่อเรา</router-link>
          <router-link to="/cart" class="mobile-nav-link text-decoration-none text-dark py-2 border-bottom d-flex justify-content-between align-items-center" @click="showMobileMenu = false">
            <span>ตะกร้าสินค้า</span>
            <span v-if="cartCount > 0" class="badge bg-danger rounded-pill fs-9">{{ cartCount }}</span>
          </router-link>
          <router-link v-if="isLoggedIn && userRole === 'admin'" to="/product" class="mobile-nav-link text-decoration-none text-danger py-2 border-bottom fw-bold" @click="showMobileMenu = false">จัดการสินค้าหลังร้าน</router-link>
          
          <!-- Mobile Search -->
          <div class="py-2">
            <div class="position-relative">
              <input 
                v-model="searchQuery" 
                type="text" 
                class="form-control mobile-search shadow-none" 
                placeholder="ค้นหาสินค้า..."
                @input="onSearchInput"
              >
              <i class="bi bi-search position-absolute top-50 end-0 translate-middle-y me-3 text-secondary"></i>
            </div>
          </div>


          <!-- Mobile Auth Links -->
          <div class="d-flex gap-2 mt-3">
            <template v-if="!isLoggedIn">
              <router-link to="/login" class="btn btn-primary-custom btn-sm flex-grow-1 rounded-pill fw-bold" @click="showMobileMenu = false">เข้าสู่ระบบ</router-link>
              <router-link to="/register" class="btn btn-outline-secondary btn-sm flex-grow-1 rounded-pill fw-bold" @click="showMobileMenu = false">สมัครสมาชิก</router-link>
            </template>
            <template v-else>
              <router-link to="/profile" class="btn btn-outline-secondary btn-sm flex-grow-1 rounded-pill fw-bold" @click="showMobileMenu = false">ข้อมูลส่วนตัว</router-link>
              <button @click="onLogoutClickMobile" class="btn btn-danger btn-sm flex-grow-1 rounded-pill fw-bold">ออกจากระบบ</button>
            </template>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup>
// นำเข้าฟังก์ชัน Reactive และ Lifecycle Hooks จาก Vue core
import { ref, onMounted, onUnmounted, computed } from 'vue'
// นำเข้าตัวควบคุมเส้นทางของ Vue Router
import { useRouter, useRoute } from 'vue-router'

// สถานะการล็อกอินและบทบาทผู้ใช้งาน (User/Admin)
const isLoggedIn = ref(false)
const userRole = ref('user')
const router = useRouter()
const route = useRoute()

// ควบคุมการแสดงผลแถบค้นหา เมนูส่วนบุคคล และป๊อปอัพต่าง ๆ บน Navbar
const searchQuery = ref('')
const showUserMenu = ref(false)
const showCategories = ref(false)
const showMobileMenu = ref(false)
const showCartDropdown = ref(false)



// หาประเภทหมวดหมู่สินค้าที่มีการกรองใน URL เพื่อนำมาไฮไลท์ที่เมนู (Active Category)
const activeCategory = computed(() => route.query.category || '')

// เปิด-ปิดเมนูหมวดหมู่สินค้า
const toggleCategories = () => {
  showCategories.value = !showCategories.value
}

// ตรวจจับเมื่อกดนอกกรอบเมนูหมวดหมู่ เพื่อปิดตัวมันลงโดยอัตโนมัติ
const handleClickOutside = (event) => {
  const container = document.querySelector('.categories-dropdown-container')
  if (container && !container.contains(event.target)) {
    showCategories.value = false
  }
}

// รายการสินค้าในตะกร้าช้อปปิ้ง
const cartItems = ref([])
// นับจำนวนสินค้าที่มีในตะกร้าทั้งหมด
const cartCount = computed(() => cartItems.value.length)
// คำนวณราคารวมทั้งหมดของตะกร้า
const cartTotal = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + parseFloat(item.price || 0), 0)
})

// ฟังก์ชันตรวจสอบสถานะล็อกอินจาก LocalStorage เพื่ออัปเดต UI แถบสมาชิก
const checkLoginStatus = () => {
  isLoggedIn.value = localStorage.getItem('isLoggedIn') === 'true'
  userRole.value = localStorage.getItem('userRole') || 'user'
  
  // โหลดรายการสินค้าจากตะกร้าที่เก็บอยู่ใน LocalStorage เพื่อป้องกันข้อมูลหายเมื่อกด F5 รีเฟรชเว็บ
  const savedCart = localStorage.getItem('cartItems')
  if (savedCart) {
    cartItems.value = JSON.parse(savedCart)
  } else {
    cartItems.value = []
  }
}



// ส่งสัญญาณค้นหาไปยังคอมโพเนนต์อื่น ๆ เมื่อพิมพ์ในแถบค้นหา
const onSearchInput = () => {
  window.dispatchEvent(new CustomEvent('search-query', { detail: searchQuery.value }))
}

// ส่งสัญญาณค้นหาเมื่อกดยอมรับการค้นหา (เช่น กด Enter หรือกดรูปแว่นขยาย)
const handleSearch = () => {
  window.dispatchEvent(new CustomEvent('search-query', { detail: searchQuery.value }))
}

// กรองหมวดหมู่สินค้า และเปลี่ยนเส้นทางหน้าเว็บกลับมาที่หน้าแรก (Home) พร้อมแทรกประเภทเป็น query parameter
const filterCategory = (category) => {
  router.push({ path: '/', query: { category: category || undefined } })
  showCategories.value = false
}

// รีเซ็ตค่าค้นหาบนแถบนำทางเป็นค่าว่างเปล่า
const handleResetNavbarSearch = () => {
  searchQuery.value = ''
}

// เปิด-ปิดหน้าต่างตะกร้าสินค้าขนาดย่อม (Mini Cart Dropdown)
const toggleCart = () => {
  showCartDropdown.value = !showCartDropdown.value
}

// ลบสินค้าออกจากตะกร้าตามดัชนี (Index) และอัปเดตฐานข้อมูลจำลอง LocalStorage
const removeFromCart = (index) => {
  cartItems.value.splice(index, 1)
  localStorage.setItem('cartItems', JSON.stringify(cartItems.value))
}

// ไปยังหน้าระบบตะกร้าสินค้าหลักเพื่อเตรียมตัวชำระเงิน
const checkout = () => {
  showCartDropdown.value = false
  router.push('/cart')
}

// ตรวจจับเมื่อมีการกดปุ่มสมาชิก หากล็อกอินแล้วจะพาไปหน้าโปรไฟล์ หากยังไม่ล็อกอินจะพาไปหน้าลงชื่อเข้าใช้งาน
const handleUserClick = () => {
  if (isLoggedIn.value) {
    router.push('/profile')
  } else {
    router.push('/login')
  }
}

// แจ้งเตือนเมื่อกดปุ่มค้นหาร้านค้าใกล้บ้าน
const showLocationAlert = () => {
  alert('TechGear มีสาขาทั่วประเทศ! ติดต่อสอบถามจุดบริการได้ที่ Line: @techgear')
}

// ฟังก์ชันล้างค่าออกจากระบบ (Logout) ลบความจำการล็อกอิน และกระจายสัญญาณไปยังหน้าร้าน
const handleLogout = () => {
  localStorage.removeItem('isLoggedIn')
  localStorage.removeItem('userRole')
  window.dispatchEvent(new Event('auth-change'))
  router.push('/login')
}

// ออกจากระบบสำหรับแถบเมนูในจอคอมพิวเตอร์
const onLogoutClick = () => {
  showUserMenu.value = false
  handleLogout()
}

// ออกจากระบบสำหรับแถบเมนูในมือถือ
const onLogoutClickMobile = () => {
  showMobileMenu.value = false
  handleLogout()
}

// ตรวจจับ Event ต่าง ๆ ทันทีที่ Component นี้โหลดขึ้นจอเสร็จสิ้น (Lifecycle Hook: onMounted)
onMounted(() => {
  checkLoginStatus()

  // คอยฟัง Event เพื่ออัปเดตสเตตัสล็อกอินของตัวเว็บแบบเรียลไทม์
  window.addEventListener('auth-change', checkLoginStatus)
  window.addEventListener('reset-navbar-search', handleResetNavbarSearch)
  window.addEventListener('click', handleClickOutside)

  // คอยตรวจสอบเมื่อมีการกดยัดสินค้าเข้าตะกร้า (Add To Cart) จากการกดที่หน้ารายละเอียดสินค้า
  window.addEventListener('add-to-cart', (e) => {
    cartItems.value.push(e.detail)
    localStorage.setItem('cartItems', JSON.stringify(cartItems.value))
    
    // ตั้งค่าแสดงหน้าต่างย่อยตะกร้าสินค้าอัตโนมัติเป็นเวลา 3 วินาทีเพื่อให้รู้ว่าสินค้าเข้าไปแล้ว
    showCartDropdown.value = true
    setTimeout(() => {
      showCartDropdown.value = false
    }, 3000)
  })

  // ดึงสินค้าในตะกร้าจากระบบบันทึกความจำของเบราว์เซอร์
  const savedCart = localStorage.getItem('cartItems')
  if (savedCart) {
    cartItems.value = JSON.parse(savedCart)
  }
})

// ปลดการติดตั้ง Event Listener ทุกตัวเมื่อละหน้าไปจากระบบ เพื่อประหยัด RAM คอมพิวเตอร์
onUnmounted(() => {
  window.removeEventListener('auth-change', checkLoginStatus)
  window.removeEventListener('reset-navbar-search', handleResetNavbarSearch)
  window.removeEventListener('click', handleClickOutside)
})

// ฟังก์ชันช่วยเลือกไอคอนแสดงแทนตามชื่อสินค้าแต่ละหมวดหมู่ (ทำให้ระบบสวยงามโดยไม่ต้องโหลดภาพหนัก)
const getProductIcon = (name = '') => {
  const n = name.toLowerCase()
  if (n.includes('cpu') || n.includes('processor') || n.includes('i5') || n.includes('i7') || n.includes('i9') || n.includes('ryzen')) return 'bi-cpu-fill'
  if (n.includes('gpu') || n.includes('rtx') || n.includes('gtx') || n.includes('geforce') || n.includes('radeon') || n.includes('strix')) return 'bi-gpu-card'
  if (n.includes('ram') || n.includes('ddr') || n.includes('dominator') || n.includes('memory')) return 'bi-memory'
  if (n.includes('ssd') || n.includes('nvme') || n.includes('m.2') || n.includes('990 pro')) return 'bi-device-ssd'
  if (n.includes('hdd') || n.includes('hard')) return 'bi-hdd-fill'
  if (n.includes('motherboard') || n.includes('mainboard') || n.includes('maximus') || n.includes('z790')) return 'bi-layout-three-columns'
  if (n.includes('psu') || n.includes('power') || n.includes('modular') || n.includes('rm1000')) return 'bi-plug-fill'
  if (n.includes('case') || n.includes('o11') || n.includes('dynamic')) return 'bi-box-fill'
  if (n.includes('monitor') || n.includes('oled') || n.includes('display')) return 'bi-display-fill'
  if (n.includes('mouse') || n.includes('superlight')) return 'bi-mouse-fill'
  if (n.includes('keyboard') || n.includes('azoth')) return 'bi-keyboard-fill'
  if (n.includes('pc set') || n.includes('[pc set]')) return 'bi-pc-display-horizontal'
  return 'bi-box-seam-fill'
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Kanit:wght@200;300;400;500;600;700;800;900&display=swap');
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css");

.ihavecpu-navbar-wrapper {
  font-family: 'Kanit', sans-serif;
  width: 100%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 1020;
  background-color: var(--bs-body-bg);
  transition: background-color 0.3s ease;
}

/* Tier 1: Top Bar */
.top-bar {
  background-color: #060b13;
  font-size: 0.8rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.top-item {
  transition: color 0.3s ease;
}

.hover-white:hover {
  color: #ffffff !important;
}

.icon-red {
  color: #0ea5e9 !important;
}

.fs-9 {
  font-size: 0.65rem;
}

.fs-8 {
  font-size: 0.8rem;
}

/* Tier 2: Middle Header */
.middle-header {
  border-bottom: 1px solid #f1f3f5;
}

.logo-brand {
  font-size: 1.8rem;
  font-weight: 800;
  letter-spacing: -0.5px;
  display: flex;
  align-items: center;
  color: #0ea5e9 !important;
  transition: transform 0.2s ease;
}

.logo-brand:hover {
  transform: scale(1.02);
}

.logo-icon {
  font-size: 2.1rem;
  background: linear-gradient(135deg, #0ea5e9, #2563eb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: flex;
  align-items: center;
}

.logo-text {
  font-weight: 800;
  background: linear-gradient(135deg, #0ea5e9, #2563eb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.max-w-lg {
  max-width: 550px;
}

.search-input {
  background-color: #f1f3f5;
  border: 1px solid transparent;
  border-radius: 50px;
  padding: 0.55rem 2.8rem 0.55rem 1.25rem;
  font-size: 0.9rem;
  color: #1e293b;
  width: 100%;
  transition: all 0.3s ease;
}

.search-input:focus {
  background-color: #ffffff;
  border-color: #0ea5e9;
  box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.15) !important;
}

.btn-search-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.btn-search-icon:hover {
  transform: scale(1.1);
}

.icon-btn-circle {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background-color: #f1f3f5;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: #475569;
  position: relative;
  transition: all 0.3s ease;
}

.icon-btn-circle:hover {
  background-color: #0ea5e9;
  color: #ffffff;
  transform: translateY(-2px);
}

.badge-cart-count {
  position: absolute;
  top: -2px;
  right: -2px;
  background-color: #0ea5e9;
  color: white;
  font-size: 0.65rem;
  font-weight: 700;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
}

/* User Hover Dropdown Menu */
.user-hover-menu {
  top: 100%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1) !important;
  border: 1px solid var(--bs-border-color, #f1f3f5) !important;
  background-color: var(--bs-body-bg) !important;
}

.dropdown-item-custom {
  font-size: 0.9rem;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s ease;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

.dropdown-item-custom:hover {
  background-color: #f8fafc;
  color: #1e293b !important;
}

.hover-dark:hover {
  color: #0f172a !important;
}

/* Cart Dropdown */
.cart-dropdown-menu {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1) !important;
  border: 1px solid var(--bs-border-color, #f1f3f5) !important;
  background-color: var(--bs-body-bg) !important;
}

.badge-red {
  background-color: #0ea5e9 !important;
  color: white;
}

.cart-scroll-container {
  display: flex;
  flex-direction: column;
}

.cart-items-list {
  max-height: 240px;
  overflow-y: auto;
}

.cart-product-icon-box {
  width: 44px;
  height: 44px;
  background-color: #f1f5f9;
  border: 1px solid #e2e8f0;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.cart-item-info {
  display: flex;
  flex-direction: column;
}

.price-text {
  color: #0284c7;
  font-weight: 700;
}

.btn-checkout {
  background-color: #0ea5e9;
  color: white;
  border: none;
  font-size: 0.9rem;
  padding: 0.55rem;
  transition: all 0.3s ease;
}

.btn-checkout:hover {
  background-color: #0284c7;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
}

/* Tier 3: Bottom Navigation */
.bottom-nav {
  z-index: 1000;
}

.btn-categories {
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  border-radius: 8px;
}

.btn-categories:hover {
  background-color: #f8fafc !important;
}

.categories-list-dropdown {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1) !important;
  border: 1px solid var(--bs-border-color, #f1f3f5) !important;
  background-color: var(--bs-body-bg) !important;
}

.category-item {
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.category-item:hover {
  background-color: #f8fafc;
  color: #0ea5e9 !important;
}

.category-item.active-category {
  background-color: rgba(14, 165, 233, 0.08);
  color: #0ea5e9 !important;
  font-weight: 700;
}

.nav-link-custom {
  font-size: 0.95rem;
  font-weight: 600;
  color: #475569 !important;
  transition: all 0.3s ease;
  position: relative;
}

:global([data-bs-theme="dark"]) .nav-link-custom {
  color: #a0aab5 !important;
}

.nav-link-custom::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background-color: #0ea5e9;
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.nav-link-custom:hover {
  color: #0ea5e9 !important;
}

.nav-link-custom:hover::after, .nav-link-custom.active::after {
  width: 100%;
}

.nav-link-custom.active {
  color: #0ea5e9 !important;
}

/* Transitions */
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: all 0.2s ease-out;
}

.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

/* Mobile Menu */
.mobile-menu {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05);
}

.mobile-nav-link {
  font-weight: 600;
  font-size: 1rem;
  display: block;
}

.mobile-nav-link:hover {
  color: #0ea5e9 !important;
}

.mobile-search {
  background-color: #f1f3f5;
  border: none;
  border-radius: 50px;
  padding: 0.55rem 2.8rem 0.55rem 1.25rem;
  font-size: 0.9rem;
}
.btn-primary-custom {
  background: linear-gradient(135deg, #0ea5e9, #2563eb);
  color: white;
  border: none;
  transition: all 0.3s ease;
}

.btn-primary-custom:hover {
  background: linear-gradient(135deg, #0284c7, #1d4ed8);
  color: white;
}
</style>
