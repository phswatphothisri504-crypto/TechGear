<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import axios from 'axios'
import KakaNavbar from './KakaNavbar.vue'
import KakaFooter from './KakaFooter.vue'

// --- ระบบจัดการแถบเมนู (Tabs Management) ---
const activeTab = ref('parts') // 'parts' or 'sets'

// --- สถานะข้อมูลหลัก (Master Data State) ---
const parts = ref([])
const sets = ref([])

// --- ข้อมูลการค้นหาและตัวกรอง (Search & Sort Queries) ---
const partSearch = ref('')
const partCategoryFilter = ref('all')
const setSearch = ref('')

// --- ระบบหน้าต่างแจ้งเตือนแบบไดนามิก (Dynamic Toast Alert) ---
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

// --- ตั้งค่าหมวดหมู่อุปกรณ์ (Categories Config) ---
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

const setCategories = [
  { id: 'budget', name: 'เริ่มต้น & ทำงานทั่วไป' },
  { id: 'gaming', name: 'เล่นเกมยอดฮิต' },
  { id: 'streaming', name: 'สตรีมมิ่ง & กราฟิก' },
  { id: 'high-end', name: 'ระดับท็อป & ไฮเอนด์' }
]

// ==========================================
// 1. ระบบจัดการชิ้นส่วนคอมพิวเตอร์ (COMPUTER PARTS CRUD LOGIC)
// ==========================================
const partForm = reactive({
  category: 'cpu',
  brand: '',
  series: '',
  name: '',
  price: '',
  specs: '',
  socket: ''
})

const isPartEdit = ref(false)
const currentPartDbId = ref(null)

const fetchParts = async () => {
  try {
    const res = await axios.get('/api/pc-parts')
    parts.value = res.data
  } catch (error) {
    console.error(error)
    showToast('ดึงข้อมูลล้มเหลว', 'ไม่สามารถเชื่อมต่อดึงข้อมูลอุปกรณ์คอมพิวเตอร์ได้', 'danger')
  }
}

const savePart = async () => {
  if (!partForm.brand || !partForm.name || !partForm.price) {
    showToast('กรอกข้อมูลไม่ครบ', 'กรุณากรอกยี่ห้อ ชื่อ และราคาอุปกรณ์ก่อนทำการบันทึก', 'warning')
    return
  }
  try {
    const dataToSend = { ...partForm, price: parseFloat(partForm.price) }
    await axios.post('/api/pc-parts', dataToSend)
    showToast('บันทึกอุปกรณ์สำเร็จ!', 'เพิ่มอุปกรณ์คอมพิวเตอร์ใหม่เข้าสู่ระบบแล้ว', 'success')
    clearPartForm()
    fetchParts()
  } catch (error) {
    console.error(error)
    showToast('บันทึกล้มเหลว', 'ไม่สามารถบันทึกอุปกรณ์ใหม่เข้าคลังได้', 'danger')
  }
}

const editPart = (part) => {
  partForm.category = part.category
  partForm.brand = part.brand
  partForm.series = part.series || ''
  partForm.name = part.name
  partForm.price = part.price
  partForm.specs = part.specs || ''
  partForm.socket = part.socket || ''
  
  isPartEdit.value = true
  currentPartDbId.value = part.db_id
  showToast('แก้ไขอุปกรณ์', `โหลดชิ้นส่วน #${part.id} เข้าสู่ฟอร์มเรียบร้อยแล้ว`, 'info')
  window.scrollTo({ top: 300, behavior: 'smooth' })
}

const updatePart = async () => {
  if (!partForm.brand || !partForm.name || !partForm.price) {
    showToast('กรอกข้อมูลไม่ครบ', 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วนก่อนบันทึก', 'warning')
    return
  }
  try {
    const dataToSend = { ...partForm, price: parseFloat(partForm.price) }
    await axios.put(`/api/pc-parts/${currentPartDbId.value}`, dataToSend)
    showToast('อัปเดตเรียบร้อย!', 'รายละเอียดอุปกรณ์ได้รับการปรับปรุงแล้ว', 'success')
    clearPartForm()
    fetchParts()
  } catch (error) {
    console.error(error)
    showToast('อัปเดตผิดพลาด', 'ไม่สามารถแก้ไขอุปกรณ์ดังกล่าวได้', 'danger')
  }
}

const deletePart = async (part) => {
  if (confirm(`คุณแน่ใจที่จะลบชิ้นส่วน "${part.name}" ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้`)) {
    try {
      await axios.delete(`/api/pc-parts/${part.db_id}`)
      showToast('ลบอุปกรณ์สำเร็จ!', 'ชิ้นส่วนถูกนำออกจากคลังข้อมูลหลักแล้ว', 'danger')
      fetchParts()
      if (currentPartDbId.value === part.db_id) {
        clearPartForm()
      }
    } catch (error) {
      console.error(error)
      showToast('ลบข้อมูลล้มเหลว', 'เกิดข้อผิดพลาดในการลบชิ้นส่วนดังกล่าว', 'danger')
    }
  }
}

const clearPartForm = () => {
  partForm.category = 'cpu'
  partForm.brand = ''
  partForm.series = ''
  partForm.name = ''
  partForm.price = ''
  partForm.specs = ''
  partForm.socket = ''
  isPartEdit.value = false
  currentPartDbId.value = null
}

// --- ระบบคำนวณและกรองชิ้นส่วนคอมพิวเตอร์ (Computer Parts Computed Stats & Filtering) ---
const filteredParts = computed(() => {
  let list = parts.value
  if (partCategoryFilter.value !== 'all') {
    list = list.filter(p => p.category === partCategoryFilter.value)
  }
  if (partSearch.value.trim()) {
    const q = partSearch.value.toLowerCase().trim()
    list = list.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.brand.toLowerCase().includes(q) ||
      (p.series && p.series.toLowerCase().includes(q)) ||
      p.id.toLowerCase().includes(q)
    )
  }
  return list
})

const partsTotalValue = computed(() => {
  return parts.value.reduce((sum, item) => sum + parseFloat(item.price || 0), 0)
})

const partsAveragePrice = computed(() => {
  if (parts.value.length === 0) return 0
  return Math.round(partsTotalValue.value / parts.value.length)
})


// ==========================================
// 2. ระบบจัดการคอมพิวเตอร์เซตสำเร็จรูป (COMPUTER SETS CRUD LOGIC)
// ==========================================
const setForm = reactive({
  name: '',
  purpose: '',
  category: 'gaming',
  cpu_brand: 'Intel',
  badge_type: 'popular',
  badge_text: '',
  original_price: 0,
  price: 0
})

const selectedSetParts = reactive({
  cpu: '',
  motherboard: '',
  gpu: '',
  ram: '',
  m2: '',
  psu: '',
  case: '',
  cooler: ''
})

const isSetEdit = ref(false)
const currentSetDbId = ref(null)

// --- ตัวเลือกที่ถูกกรองสำหรับส่วนประกอบของคอมเซต (Filtered options for PC Set Parts selector slot) ---
const cpuOptions = computed(() => parts.value.filter(p => p.category === 'cpu'))
const mbOptions = computed(() => parts.value.filter(p => p.category === 'motherboard'))
const gpuOptions = computed(() => parts.value.filter(p => p.category === 'gpu'))
const ramOptions = computed(() => parts.value.filter(p => p.category === 'ram'))
const m2Options = computed(() => parts.value.filter(p => p.category === 'm2' || p.category === 'ssd' || p.category === 'hdd'))
const psuOptions = computed(() => parts.value.filter(p => p.category === 'psu'))
const caseOptions = computed(() => parts.value.filter(p => p.category === 'case'))
const coolerOptions = computed(() => parts.value.filter(p => p.category === 'liquid_cooler' || p.category === 'cpu_cooler'))

// --- ระบบรวมราคาอัตโนมัติ (Auto summing dynamic system) ---
const autoCalculatedOriginalPrice = computed(() => {
  let sum = 0
  const slots = ['cpu', 'motherboard', 'gpu', 'ram', 'm2', 'psu', 'case', 'cooler']
  slots.forEach(slot => {
    const selectedId = selectedSetParts[slot]
    if (selectedId) {
      const partObj = parts.value.find(p => p.id === selectedId)
      if (partObj) sum += partObj.price
    }
  })
  return sum
})

// ซิงค์ค่าที่คำนวณได้ไปยังราคาเต็มในฟอร์ม และแนะนำราคาที่ลดแล้ว 10% อัตโนมัติ
watch(autoCalculatedOriginalPrice, (newVal) => {
  setForm.original_price = newVal
  if (!isSetEdit.value || setForm.price === 0) {
    setForm.price = Math.round(newVal * 0.9 / 10) * 10 // suggest a 10% discount rounded
  }
})

const fetchSets = async () => {
  try {
    const res = await axios.get('/api/pc-sets')
    sets.value = res.data
  } catch (error) {
    console.error(error)
    showToast('ดึงข้อมูลคอมเซตล้มเหลว', 'ไม่สามารถเชื่อมต่อข้อมูลแพ็คเกจคอมพิวเตอร์เซตได้', 'danger')
  }
}

const compilePartsList = () => {
  const partsList = []
  
  // 1. CPU
  if (selectedSetParts.cpu) {
    const p = parts.value.find(x => x.id === selectedSetParts.cpu)
    if (p) partsList.push({ label: 'ซีพียู (CPU)', name: p.name, icon: 'bi-cpu', id: p.id })
  }
  // 2. GPU
  if (selectedSetParts.gpu) {
    const p = parts.value.find(x => x.id === selectedSetParts.gpu)
    if (p) partsList.push({ label: 'การ์ดจอ (GPU)', name: p.name, icon: 'bi-gpu-card', id: p.id })
  }
  // 3. Motherboard
  if (selectedSetParts.motherboard) {
    const p = parts.value.find(x => x.id === selectedSetParts.motherboard)
    if (p) partsList.push({ label: 'เมนบอร์ด (MB)', name: p.name, icon: 'bi-layout-three-columns', id: p.id })
  }
  // 4. RAM
  if (selectedSetParts.ram) {
    const p = parts.value.find(x => x.id === selectedSetParts.ram)
    if (p) partsList.push({ label: 'หน่วยความจำ (RAM)', name: p.name, icon: 'bi-memory', id: p.id })
  }
  // 5. SSD / Storage
  if (selectedSetParts.m2) {
    const p = parts.value.find(x => x.id === selectedSetParts.m2)
    if (p) partsList.push({ label: 'สตอเรจ (SSD)', name: p.name, icon: 'bi-device-ssd', id: p.id })
  }
  // 6. PSU
  if (selectedSetParts.psu) {
    const p = parts.value.find(x => x.id === selectedSetParts.psu)
    if (p) partsList.push({ label: 'พาวเวอร์ (PSU)', name: p.name, icon: 'bi-plug', id: p.id })
  }
  // 7. Case
  if (selectedSetParts.case) {
    const p = parts.value.find(x => x.id === selectedSetParts.case)
    if (p) partsList.push({ label: 'เคสคอม (CASE)', name: p.name, icon: 'bi-box', id: p.id })
  }
  // 8. Cooler
  if (selectedSetParts.cooler) {
    const p = parts.value.find(x => x.id === selectedSetParts.cooler)
    if (p) partsList.push({ label: 'ระบบระบายความร้อน', name: p.name, icon: 'bi-fan', id: p.id })
  }

  return partsList
}

const saveSet = async () => {
  if (!setForm.name || !setForm.purpose || !setForm.price) {
    showToast('กรอกข้อมูลไม่ครบ', 'กรุณากรอกชื่อเซต จุดประสงค์การใช้งาน และราคาก่อนบันทึก', 'warning')
    return
  }
  
  const compiledList = compilePartsList()
  if (compiledList.length === 0) {
    showToast('ไม่มีอุปกรณ์ในเซต', 'กรุณาเลือกอุปกรณ์คอมพิวเตอร์อย่างน้อย 1 ชิ้นในส่วนจัดสเปกคอมเซต', 'warning')
    return
  }

  try {
    const dataToSend = {
      ...setForm,
      original_price: parseFloat(setForm.original_price),
      price: parseFloat(setForm.price),
      parts_list: compiledList
    }
    
    await axios.post('/api/pc-sets', dataToSend)
    showToast('บันทึกคอมเซตสำเร็จ!', 'ชุดคอมพิวเตอร์เซตประกอบสำเร็จรูปใหม่ถูกจัดเก็บแล้ว', 'success')
    clearSetForm()
    fetchSets()
  } catch (error) {
    console.error(error)
    showToast('บันทึกล้มเหลว', 'ไม่สามารถบันทึกคอมเซตใหม่ได้', 'danger')
  }
}

const editSet = (setObj) => {
  setForm.name = setObj.name
  setForm.purpose = setObj.purpose
  setForm.category = setObj.category
  setForm.cpu_brand = setObj.cpuBrand || setObj.cpu_brand || 'Intel'
  setForm.badge_type = setObj.badgeType || setObj.badge_type || 'popular'
  setForm.badge_text = setObj.badgeText || setObj.badge_text || ''
  setForm.original_price = setObj.originalPrice || setObj.original_price || 0
  setForm.price = setObj.price

  // รีเซ็ตตัวเลือกชิ้นส่วนในคอมเซต
  selectedSetParts.cpu = ''
  selectedSetParts.gpu = ''
  selectedSetParts.motherboard = ''
  selectedSetParts.ram = ''
  selectedSetParts.m2 = ''
  selectedSetParts.psu = ''
  selectedSetParts.case = ''
  selectedSetParts.cooler = ''

  // เติมข้อมูลลงในตัวเลือกชิ้นส่วนอัตโนมัติตามข้อมูลใน setObj.partsList
  if (setObj.partsList && Array.isArray(setObj.partsList)) {
    setObj.partsList.forEach(item => {
      if (item.id.startsWith('cpu')) selectedSetParts.cpu = item.id
      else if (item.id.startsWith('gpu') || item.id.startsWith('gtx') || item.id.startsWith('rtx') || item.id.startsWith('rx')) selectedSetParts.gpu = item.id
      else if (item.id.startsWith('mb') || item.id.startsWith('h610') || item.id.startsWith('b760') || item.id.startsWith('z790')) selectedSetParts.motherboard = item.id
      else if (item.id.startsWith('ram')) selectedSetParts.ram = item.id
      else if (item.id.startsWith('m2') || item.id.startsWith('ssd') || item.id.startsWith('hdd') || item.id.startsWith('nv2') || item.id.startsWith('sn580') || item.id.startsWith('sn850') || item.id.startsWith('990')) selectedSetParts.m2 = item.id
      else if (item.id.startsWith('psu')) selectedSetParts.psu = item.id
      else if (item.id.startsWith('case')) selectedSetParts.case = item.id
      else if (item.id.startsWith('lc') || item.id.startsWith('cc')) selectedSetParts.cooler = item.id
    })
  }

  isSetEdit.value = true
  currentSetDbId.value = setObj.db_id
  showToast('แก้ไขคอมเซต', `โหลดคอมเซต #${setObj.id} เข้าสู่ส่วนประกอบแบบฟอร์มแล้ว`, 'info')
  window.scrollTo({ top: 300, behavior: 'smooth' })
}

const updateSet = async () => {
  if (!setForm.name || !setForm.purpose || !setForm.price) {
    showToast('กรอกข้อมูลไม่ครบ', 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วนก่อนบันทึก', 'warning')
    return
  }

  const compiledList = compilePartsList()
  try {
    const dataToSend = {
      ...setForm,
      original_price: parseFloat(setForm.original_price),
      price: parseFloat(setForm.price),
      parts_list: compiledList
    }

    await axios.put(`/api/pc-sets/${currentSetDbId.value}`, dataToSend)
    showToast('อัปเดตเรียบร้อย!', 'ปรับเปลี่ยนสเปกและข้อมูลคอมเซตสำเร็จแล้ว', 'success')
    clearSetForm()
    fetchSets()
  } catch (error) {
    console.error(error)
    showToast('อัปเดตผิดพลาด', 'ไม่สามารถบันทึกการปรับปรุงข้อมูลคอมเซตได้', 'danger')
  }
}

const deleteSet = async (setObj) => {
  if (confirm(`คุณต้องการลบลบชุดคอมพิวเตอร์ "${setObj.name}" ใช่หรือไม่?`)) {
    try {
      await axios.delete(`/api/pc-sets/${setObj.db_id}`)
      showToast('ลบคอมเซตสำเร็จ!', 'คอมเซตประกอบสำเร็จรูปถูกนำออกจากแค็ตตาล็อกแล้ว', 'danger')
      fetchSets()
      if (currentSetDbId.value === setObj.db_id) {
        clearSetForm()
      }
    } catch (error) {
      console.error(error)
      showToast('ลบล้มเหลว', 'เกิดข้อผิดพลาดในการนำคอมเซตนี้ออกจากฐานข้อมูล', 'danger')
    }
  }
}

const clearSetForm = () => {
  setForm.name = ''
  setForm.purpose = ''
  setForm.category = 'gaming'
  setForm.cpu_brand = 'Intel'
  setForm.badge_type = 'popular'
  setForm.badge_text = ''
  setForm.original_price = 0
  setForm.price = 0
  
  selectedSetParts.cpu = ''
  selectedSetParts.motherboard = ''
  selectedSetParts.gpu = ''
  selectedSetParts.ram = ''
  selectedSetParts.m2 = ''
  selectedSetParts.psu = ''
  selectedSetParts.case = ''
  selectedSetParts.cooler = ''
  
  isSetEdit.value = false
  currentSetDbId.value = null
}

const filteredSets = computed(() => {
  let list = sets.value
  if (setSearch.value.trim()) {
    const q = setSearch.value.toLowerCase().trim()
    list = list.filter(s => 
      s.name.toLowerCase().includes(q) || 
      s.purpose.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q)
    )
  }
  return list
})

const setsTotalValue = computed(() => {
  return sets.value.reduce((sum, item) => sum + parseFloat(item.price || 0), 0)
})

const setsAveragePrice = computed(() => {
  if (sets.value.length === 0) return 0
  return Math.round(setsTotalValue.value / sets.value.length)
})

// --- ฟังก์ชันเริ่มต้นทำงานเมื่อโหลดหน้า (Global Initialization) ---
onMounted(() => {
  fetchParts()
  fetchSets()
})
</script>

<template>
  <div class="page-wrapper">
    <!-- Glowing background elements for premium feel -->
    <div class="glowing-bg">
      <div class="blob blob-purple"></div>
      <div class="blob blob-pink"></div>
      <div class="blob blob-blue"></div>
    </div>
    
    <KakaNavbar />
    
    <div class="container py-5 content-container">
      
      <!-- Hero Header Section -->
      <div class="text-center mb-5 hero-section">
        <span class="badge-premium px-3 py-2 mb-3 d-inline-flex align-items-center gap-1">
          <i class="bi bi-gear-fill spin-slow"></i> TechGear Admin Console
        </span>
        <h2 class="fw-bold title-gradient mb-2 mt-2">จัดการสเปกคอมพิวเตอร์และเซตสำเร็จรูป</h2>
        <p class="text-muted-custom fs-6 max-w-2xl mx-auto">
          จัดการชิ้นส่วนจัดสเปกคอม (Computer Parts) และชุดคอมพิวเตอร์ประกอบสำเร็จรูป (PC Sets) ได้อย่างสมบูรณ์แบบในแดชบอร์ดเดียว
        </p>
      </div>

      <!-- PREMIUM TABS SYSTEM SWITCHER -->
      <div class="tabs-navigation-panel d-flex justify-content-center gap-2 mb-4">
        <button 
          @click="activeTab = 'parts'" 
          class="tab-nav-btn py-3 px-4 rounded-3 d-flex align-items-center gap-2"
          :class="{ 'active-tab': activeTab === 'parts' }"
        >
          <i class="bi bi-cpu fs-5"></i>
          <span>จัดการอุปกรณ์คอมพิวเตอร์ (PC Parts)</span>
        </button>
        <button 
          @click="activeTab = 'sets'" 
          class="tab-nav-btn py-3 px-4 rounded-3 d-flex align-items-center gap-2"
          :class="{ 'active-tab': activeTab === 'sets' }"
        >
          <i class="bi bi-pc-display-horizontal fs-5"></i>
          <span>จัดการคอมพิวเตอร์เซต (Computer Sets)</span>
        </button>
      </div>

      <!-- ======================================================== -->
      <!-- TAB 1: COMPUTER PARTS CRUD SYSTEM -->
      <!-- ======================================================== -->
      <div v-if="activeTab === 'parts'" class="tab-content-area animate-fade-in">
        
        <!-- Parts Statistics Grid -->
        <div class="row g-4 mb-5">
          <div class="col-md-4">
            <div class="stat-card glass-card border-glow-cyan">
              <div class="stat-icon-wrapper bg-cyan-glow">
                <i class="bi bi-cpu-fill"></i>
              </div>
              <div class="stat-info">
                <span class="stat-title">จำนวนอุปกรณ์ทั้งหมด</span>
                <h3 class="stat-number text-cyan-glow">{{ parts.length }} <span class="stat-unit">ชิ้น</span></h3>
              </div>
            </div>
          </div>

          <div class="col-md-4">
            <div class="stat-card glass-card border-glow-purple">
              <div class="stat-icon-wrapper bg-purple-glow">
                <i class="bi bi-tag-fill"></i>
              </div>
              <div class="stat-info">
                <span class="stat-title">มูลค่าเฉลี่ยชิ้นส่วน</span>
                <h3 class="stat-number text-emerald-glow">฿{{ partsAveragePrice.toLocaleString('th-TH') }}</h3>
              </div>
            </div>
          </div>

          <div class="col-md-4">
            <div class="stat-card glass-card border-glow-purple">
              <div class="stat-icon-wrapper bg-purple-glow">
                <i class="bi bi-cash-stack"></i>
              </div>
              <div class="stat-info">
                <span class="stat-title">มูลค่ารวมชิ้นส่วนคอม</span>
                <h3 class="stat-number text-blue-glow">฿{{ partsTotalValue.toLocaleString('th-TH') }}</h3>
              </div>
            </div>
          </div>
        </div>
       
        <div class="row g-4">
          <!-- Left Form Column -->
          <div class="col-lg-4">
            <div class="glass-card form-card border-glow h-100">
              <div class="card-header-gradient" :class="isPartEdit ? 'header-edit' : 'header-add'">
                <div class="header-icon-box">
                  <i v-if="!isPartEdit" class="bi bi-plus-circle-fill"></i>
                  <i v-else class="bi bi-pencil-square"></i>
                </div>
                <div class="header-text-container">
                  <h5 class="m-0 fw-bold">{{ isPartEdit ? 'แก้ไขชิ้นส่วนคอมฯ' : 'เพิ่มอุปกรณ์คอมฯ ใหม่' }}</h5>
                  <small class="opacity-75">{{ isPartEdit ? 'ปรับปรุงรายละเอียดและบันทึกอุปกรณ์' : 'ระบุรายละเอียดอุปกรณ์สำหรับจัดสเปก' }}</small>
                </div>
              </div>
               
              <div class="card-body-custom p-4">
                <!-- Dropdown: Category -->
                <div class="mb-3">
                  <label class="form-label-custom mb-2"><i class="bi bi-grid-3x3-gap-fill me-1"></i> หมวดหมู่อุปกรณ์</label>
                  <select v-model="partForm.category" class="form-select-custom w-100">
                    <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                  </select>
                </div>

                <!-- Input: Brand -->
                <div class="mb-3">
                  <label class="form-label-custom mb-2"><i class="bi bi-badge-ad-fill me-1"></i> ยี่ห้อ / แบรนด์</label>
                  <input v-model="partForm.brand" type="text" class="form-control-custom-input" placeholder="เช่น AMD, Intel, ASUS, MSI">
                </div>

                <!-- Input: Series -->
                <div class="mb-3">
                  <label class="form-label-custom mb-2"><i class="bi bi-activity me-1"></i> ซีรีส์ / รุ่นหลัก (ระบุเฉพาะ CPU/GPU เท่านั้น)</label>
                  <input v-model="partForm.series" type="text" class="form-control-custom-input" placeholder="เช่น Ryzen 5, Core i5, RTX 4060 (ถ้ามี)">
                </div>

                <!-- Input: Name -->
                <div class="mb-3">
                  <label class="form-label-custom mb-2"><i class="bi bi-bookmark-star-fill me-1"></i> ชื่อชิ้นส่วนเต็ม</label>
                  <input v-model="partForm.name" type="text" class="form-control-custom-input" placeholder="เช่น CPU AMD AM4 RYZEN 5 5500 3.6GHz">
                </div>

                <!-- Input: Price -->
                <div class="mb-3">
                  <label class="form-label-custom mb-2"><i class="bi bi-cash-stack me-1"></i> ราคาสินค้า (บาท)</label>
                  <input v-model="partForm.price" type="number" class="form-control-custom-input" placeholder="เช่น 3190">
                </div>

                <!-- Input: Socket -->
                <div class="mb-3">
                  <label class="form-label-custom mb-2"><i class="bi bi-cpu-fill me-1"></i> ซ็อกเก็ต / ขั้วต่อ (ทางเลือก)</label>
                  <input v-model="partForm.socket" type="text" class="form-control-custom-input" placeholder="เช่น Socket AM4, Socket LGA1700">
                </div>

                <!-- Input: Specs -->
                <div class="mb-3">
                  <label class="form-label-custom mb-2"><i class="bi bi-file-text-fill me-1"></i> สเปกและรายละเอียดสินค้า</label>
                  <textarea v-model="partForm.specs" class="form-control-custom-input text-area-specs" rows="3" placeholder="ระบุคอร์ เทรด บัส ความแรง ข้อมูลเสริมต่าง ๆ"></textarea>
                </div>

                <!-- Action Button Section -->
                <div class="mt-4 pt-2">
                  <button v-if="!isPartEdit" @click="savePart" class="btn-action-gradient btn-save w-100 py-3 shadow-glow-success">
                    <i class="bi bi-check-circle-fill me-2"></i>บันทึกอุปกรณ์ใหม่
                  </button>
                  <div v-else class="d-flex gap-2">
                    <button @click="updatePart" class="btn-action-gradient btn-update flex-grow-1 py-3 shadow-glow-warning">
                      <i class="bi bi-pencil-square me-2"></i>บันทึกการแก้ไข
                    </button>
                    <button @click="clearPartForm" class="btn btn-outline-secondary rounded-4 px-3">
                      ยกเลิก
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Listing Column -->
          <div class="col-lg-8">
            <div class="glass-card table-card border-glow h-100 p-4">
              <!-- Filter Tools -->
              <div class="d-flex flex-wrap gap-3 justify-content-between align-items-center mb-4">
                <div class="d-flex align-items-center gap-2">
                  <div class="header-icon-box bg-primary-subtle text-primary rounded-3">
                    <i class="bi bi-filter-square-fill fs-5"></i>
                  </div>
                  <div>
                    <h5 class="m-0 fw-bold text-dark">คลังชิ้นส่วนอุปกรณ์คอม</h5>
                    <small class="text-muted">จำนวนอุปกรณ์คอมพิวเตอร์ที่จัดสเปกได้</small>
                  </div>
                </div>
                
                <div class="d-flex flex-wrap gap-2">
                  <!-- Category Dropdown Filter -->
                  <select v-model="partCategoryFilter" class="form-select filter-select-custom shadow-none">
                    <option value="all">กรองหมวดหมู่ทั้งหมด</option>
                    <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                  </select>

                  <!-- Search Bar -->
                  <div class="position-relative search-input-box">
                    <input v-model="partSearch" type="text" class="form-control table-search shadow-none ps-3 pe-5" placeholder="ค้นหาชื่อแบรนด์/รุ่น/ID...">
                    <i class="bi bi-search search-icon text-muted"></i>
                  </div>
                </div>
              </div>

              <!-- Parts Table Grid -->
              <div class="table-responsive border rounded-4 custom-table-wrapper">
                <table class="table table-hover align-middle m-0">
                  <thead class="table-light-premium text-uppercase">
                    <tr>
                      <th class="ps-4">หมวดหมู่ / รหัส</th>
                      <th>รายละเอียดอุปกรณ์</th>
                      <th>แบรนด์</th>
                      <th>ราคา</th>
                      <th class="text-center pe-4" style="width: 120px;">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="part in filteredParts" :key="part.id" class="table-row-premium">
                      <!-- Category & ID -->
                      <td class="ps-4 font-monospace">
                        <span class="badge bg-dark-subtle text-dark rounded-pill px-2.5 py-1.5 fs-9 me-2">
                          <i :class="categories.find(c => c.id === part.category)?.icon || 'bi-cpu'"></i>
                          {{ categories.find(c => c.id === part.category)?.name || part.category }}
                        </span>
                        <div class="text-muted-custom fs-9 mt-1 fw-bold">{{ part.id }}</div>
                      </td>

                      <!-- Name / Specs -->
                      <td>
                        <div class="fw-bold text-dark fs-8 text-truncate-custom" style="max-width: 250px;" :title="part.name">{{ part.name }}</div>
                        <div class="text-muted-custom fs-9 mt-0.5 text-truncate-custom" style="max-width: 250px;" :title="part.specs">{{ part.specs || '-' }}</div>
                        <span v-if="part.socket" class="badge bg-light text-secondary border fs-9.5 mt-1">{{ part.socket }}</span>
                      </td>

                      <!-- Brand / Series -->
                      <td>
                        <span class="badge bg-secondary-subtle text-secondary px-2.5 py-1 rounded-pill fs-9 fw-bold">{{ part.brand }}</span>
                        <div v-if="part.series" class="text-muted-custom fs-9.5 mt-1 fw-semibold">{{ part.series }}</div>
                      </td>

                      <!-- Price -->
                      <td class="fw-bold text-danger fs-8">
                        ฿{{ part.price.toLocaleString('th-TH') }}
                      </td>

                      <!-- Actions -->
                      <td class="text-center pe-4">
                        <div class="d-inline-flex gap-1.5">
                          <button @click="editPart(part)" class="btn btn-action-edit btn-sm rounded-circle p-2 border-0" title="แก้ไข">
                            <i class="bi bi-pencil-fill"></i>
                          </button>
                          <button @click="deletePart(part)" class="btn btn-action-delete btn-sm rounded-circle p-2 border-0" title="ลบ">
                            <i class="bi bi-trash3-fill"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr v-if="filteredParts.length === 0">
                      <td colspan="5" class="text-center py-5 text-muted-custom">
                        <i class="bi bi-box-fill fs-2 mb-2 d-block"></i>
                        ไม่พบอุปกรณ์คอมพิวเตอร์ที่ตรงเงื่อนไขการค้นหาของคุณ
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- ======================================================== -->
      <!-- TAB 2: COMPUTER SETS CRUD SYSTEM -->
      <!-- ======================================================== -->
      <div v-if="activeTab === 'sets'" class="tab-content-area animate-fade-in">
        
        <!-- Sets Statistics Grid -->
        <div class="row g-4 mb-5">
          <div class="col-md-4">
            <div class="stat-card glass-card border-glow-cyan">
              <div class="stat-icon-wrapper bg-cyan-glow">
                <i class="bi bi-pc-display-horizontal"></i>
              </div>
              <div class="stat-info">
                <span class="stat-title">จำนวนเซตคอมทั้งหมด</span>
                <h3 class="stat-number text-cyan-glow">{{ sets.length }} <span class="stat-unit">ชุด</span></h3>
              </div>
            </div>
          </div>

          <div class="col-md-4">
            <div class="stat-card glass-card border-glow-purple">
              <div class="stat-icon-wrapper bg-purple-glow">
                <i class="bi bi-tag-fill"></i>
              </div>
              <div class="stat-info">
                <span class="stat-title">ราคาเฉลี่ยชุดคอมเซต</span>
                <h3 class="stat-number text-emerald-glow">฿{{ setsAveragePrice.toLocaleString('th-TH') }}</h3>
              </div>
            </div>
          </div>

          <div class="col-md-4">
            <div class="stat-card glass-card border-glow-purple">
              <div class="stat-icon-wrapper bg-purple-glow">
                <i class="bi bi-wallet2"></i>
              </div>
              <div class="stat-info">
                <span class="stat-title">มูลค่ารวมชุดคอมเซต</span>
                <h3 class="stat-number text-blue-glow">฿{{ setsTotalValue.toLocaleString('th-TH') }}</h3>
              </div>
            </div>
          </div>
        </div>

        <div class="row g-4">
          <!-- Left Set Form Column -->
          <div class="col-lg-5">
            <div class="glass-card form-card border-glow h-100">
              <div class="card-header-gradient" :class="isSetEdit ? 'header-edit' : 'header-add'">
                <div class="header-icon-box">
                  <i v-if="!isSetEdit" class="bi bi-plus-circle-fill"></i>
                  <i v-else class="bi bi-pencil-square"></i>
                </div>
                <div class="header-text-container">
                  <h5 class="m-0 fw-bold">{{ isSetEdit ? 'แก้ไขคอมพิวเตอร์เซต' : 'จัดคอมพิวเตอร์เซตใหม่' }}</h5>
                  <small class="opacity-75">{{ isSetEdit ? 'ปรับปรุงรายละเอียดและอุปกรณ์ภายในคอมเซต' : 'สร้างแพ็คเกจคอมเซตสำเร็จรูปใหม่' }}</small>
                </div>
              </div>
               
              <div class="card-body-custom p-4">
                <!-- Input: Set Name -->
                <div class="mb-3">
                  <label class="form-label-custom mb-2"><i class="bi bi-laptop-fill me-1"></i> ชื่อคอมพิวเตอร์เซตประกอบสำเร็จ</label>
                  <input v-model="setForm.name" type="text" class="form-control-custom-input" placeholder="เช่น TechGear Fighter RTX 4060">
                </div>

                <!-- Input: Purpose -->
                <div class="mb-3">
                  <label class="form-label-custom mb-2"><i class="bi bi-card-text me-1"></i> คำอธิบายวัตถุประสงค์ / ประสิทธิภาพเซต</label>
                  <textarea v-model="setForm.purpose" class="form-control-custom-input text-area-specs" rows="2" placeholder="เช่น เซตขวัญใจมหาชน แรงเล่นเกมระดับ AAA ปรับ Ultra 1080p ลื่นไหล"></textarea>
                </div>

                <div class="row g-2">
                  <!-- Dropdown: Set Category -->
                  <div class="col-md-6 mb-3">
                    <label class="form-label-custom mb-2"><i class="bi bi-grid-fill me-1"></i> หมวดหมู่การใช้งาน</label>
                    <select v-model="setForm.category" class="form-select-custom w-100">
                      <option v-for="cat in setCategories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                    </select>
                  </div>
                  
                  <!-- Dropdown: CPU Platform Brand -->
                  <div class="col-md-6 mb-3">
                    <label class="form-label-custom mb-2"><i class="bi bi-cpu me-1"></i> ค่ายประมวลผลหลัก (CPU Brand)</label>
                    <select v-model="setForm.cpu_brand" class="form-select-custom w-100">
                      <option value="Intel">Intel Platform</option>
                      <option value="AMD">AMD Platform</option>
                    </select>
                  </div>
                </div>

                <div class="row g-2">
                  <!-- Badge Type -->
                  <div class="col-md-6 mb-3">
                    <label class="form-label-custom mb-2"><i class="bi bi-bookmark-fill me-1"></i> ประเภทป้าย Badge</label>
                    <select v-model="setForm.badge_type" class="form-select-custom w-100">
                      <option value="hot">HOT (ร้อนแรง)</option>
                      <option value="popular">POPULAR (ยอดนิยม)</option>
                      <option value="special">SPECIAL (พิเศษ)</option>
                      <option value="premium">PREMIUM (พรีเมียม)</option>
                      <option value="overkill">OVERKILL (จัดเต็มขีดสุด)</option>
                    </select>
                  </div>
                  
                  <!-- Badge Text -->
                  <div class="col-md-6 mb-3">
                    <label class="form-label-custom mb-2"><i class="bi bi-fonts me-1"></i> ข้อความป้ายกำกับ</label>
                    <input v-model="setForm.badge_text" type="text" class="form-control-custom-input" placeholder="เช่น คุ้มค่าที่สุด, ขายดีอันดับ 1">
                  </div>
                </div>

                <!-- ============================================== -->
                <!-- CORE SET COMPONENT PICKER (DYNAMIC AUTOSUM) -->
                <!-- ============================================== -->
                <div class="border rounded-4 p-3 bg-light-custom my-4">
                  <span class="fs-9 text-muted d-block text-uppercase fw-bold letter-spacing-1 mb-3"><i class="bi bi-tools text-primary"></i> เลือกชิ้นส่วนประกอบชุดเซตคอม</span>
                  
                  <!-- 1. CPU Slot -->
                  <div class="mb-2">
                    <label class="fs-9.5 text-dark fw-bold mb-1 d-block">1. ซีพียู (CPU)</label>
                    <select v-model="selectedSetParts.cpu" class="form-select form-select-sm rounded-3">
                      <option value="">-- เลือก CPU --</option>
                      <option v-for="item in cpuOptions" :key="item.id" :value="item.id">[{{ item.brand }}] {{ item.name }} (฿{{ item.price }})</option>
                    </select>
                  </div>

                  <!-- 2. Motherboard Slot -->
                  <div class="mb-2">
                    <label class="fs-9.5 text-dark fw-bold mb-1 d-block">2. เมนบอร์ด (Motherboard)</label>
                    <select v-model="selectedSetParts.motherboard" class="form-select form-select-sm rounded-3">
                      <option value="">-- เลือกเมนบอร์ด --</option>
                      <option v-for="item in mbOptions" :key="item.id" :value="item.id">[{{ item.brand }}] {{ item.name }} (฿{{ item.price }})</option>
                    </select>
                  </div>

                  <!-- 3. GPU Slot -->
                  <div class="mb-2">
                    <label class="fs-9.5 text-dark fw-bold mb-1 d-block">3. การ์ดจอ (Graphics Card)</label>
                    <select v-model="selectedSetParts.gpu" class="form-select form-select-sm rounded-3">
                      <option value="">-- เลือกการ์ดจอ --</option>
                      <option v-for="item in gpuOptions" :key="item.id" :value="item.id">[{{ item.brand }}] {{ item.name }} (฿{{ item.price }})</option>
                    </select>
                  </div>

                  <!-- 4. RAM Slot -->
                  <div class="mb-2">
                    <label class="fs-9.5 text-dark fw-bold mb-1 d-block">4. แรม (RAM)</label>
                    <select v-model="selectedSetParts.ram" class="form-select form-select-sm rounded-3">
                      <option value="">-- เลือกหน่วยความจำ --</option>
                      <option v-for="item in ramOptions" :key="item.id" :value="item.id">[{{ item.brand }}] {{ item.name }} (฿{{ item.price }})</option>
                    </select>
                  </div>

                  <!-- 5. SSD / Storage Slot -->
                  <div class="mb-2">
                    <label class="fs-9.5 text-dark fw-bold mb-1 d-block">5. สตอเรจ (SSD/HDD/M.2)</label>
                    <select v-model="selectedSetParts.m2" class="form-select form-select-sm rounded-3">
                      <option value="">-- เลือกอุปกรณ์จัดเก็บข้อมูล --</option>
                      <option v-for="item in m2Options" :key="item.id" :value="item.id">[{{ item.brand }}] {{ item.name }} (฿{{ item.price }})</option>
                    </select>
                  </div>

                  <!-- 6. PSU Slot -->
                  <div class="mb-2">
                    <label class="fs-9.5 text-dark fw-bold mb-1 d-block">6. พาวเวอร์ซัพพลาย (PSU)</label>
                    <select v-model="selectedSetParts.psu" class="form-select form-select-sm rounded-3">
                      <option value="">-- เลือกพาวเวอร์ซัพพลาย --</option>
                      <option v-for="item in psuOptions" :key="item.id" :value="item.id">[{{ item.brand }}] {{ item.name }} (฿{{ item.price }})</option>
                    </select>
                  </div>

                  <!-- 7. Case Slot -->
                  <div class="mb-2">
                    <label class="fs-9.5 text-dark fw-bold mb-1 d-block">7. เคสคอม (Case)</label>
                    <select v-model="selectedSetParts.case" class="form-select form-select-sm rounded-3">
                      <option value="">-- เลือกเคสคอมพิวเตอร์ --</option>
                      <option v-for="item in caseOptions" :key="item.id" :value="item.id">[{{ item.brand }}] {{ item.name }} (฿{{ item.price }})</option>
                    </select>
                  </div>

                  <!-- 8. Cooler Slot -->
                  <div class="mb-2">
                    <label class="fs-9.5 text-dark fw-bold mb-1 d-block">8. ระบบระบายความร้อน (Cooler)</label>
                    <select v-model="selectedSetParts.cooler" class="form-select form-select-sm rounded-3">
                      <option value="">-- เลือกชุดระบายความร้อน --</option>
                      <option v-for="item in coolerOptions" :key="item.id" :value="item.id">[{{ item.brand }}] {{ item.name }} (฿{{ item.price }})</option>
                    </select>
                  </div>
                </div>

                <div class="row g-2">
                  <!-- Original Price (Auto Generated) -->
                  <div class="col-md-6 mb-3">
                    <label class="form-label-custom mb-2"><i class="bi bi-wallet2 me-1"></i> ราคารวมปกติ (คำนวณอัตโนมัติ)</label>
                    <input v-model="setForm.original_price" type="number" class="form-control-custom-input fw-semibold text-muted bg-light" disabled>
                  </div>
                  
                  <!-- Set Offer Promo Price -->
                  <div class="col-md-6 mb-3">
                    <label class="form-label-custom mb-2"><i class="bi bi-lightning-charge-fill text-danger me-1"></i> ราคาแพ็คเกจลดพิเศษ (บาท)</label>
                    <input v-model="setForm.price" type="number" class="form-control-custom-input fw-bold text-danger border-danger-custom" placeholder="ระบุราคาเสนอขายแพ็คเกจ">
                  </div>
                </div>

                <!-- Action Button Section -->
                <div class="mt-4 pt-2">
                  <button v-if="!isSetEdit" @click="saveSet" class="btn-action-gradient btn-save w-100 py-3 shadow-glow-success">
                    <i class="bi bi-check-circle-fill me-2"></i>บันทึกเซตคอมใหม่
                  </button>
                  <div v-else class="d-flex gap-2">
                    <button @click="updateSet" class="btn-action-gradient btn-update flex-grow-1 py-3 shadow-glow-warning">
                      <i class="bi bi-pencil-square me-2"></i>บันทึกการแก้ไขเซต
                    </button>
                    <button @click="clearSetForm" class="btn btn-outline-secondary rounded-4 px-3">
                      ยกเลิก
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Set Listing Column -->
          <div class="col-lg-7">
            <div class="glass-card table-card border-glow h-100 p-4">
              <!-- Filter Tools -->
              <div class="d-flex flex-wrap gap-3 justify-content-between align-items-center mb-4">
                <div class="d-flex align-items-center gap-2">
                  <div class="header-icon-box bg-purple-subtle text-purple rounded-3">
                    <i class="bi bi-card-checklist fs-5"></i>
                  </div>
                  <div>
                    <h5 class="m-0 fw-bold text-dark">แค็ตตาล็อกคอมพิวเตอร์เซตสำเร็จรูป</h5>
                    <small class="text-muted">จำนวนคอมพิวเตอร์ประกอบสำเร็จรูปในระบบ</small>
                  </div>
                </div>
                
                <div class="d-flex flex-wrap gap-2">
                  <!-- Search Bar -->
                  <div class="position-relative search-input-box">
                    <input v-model="setSearch" type="text" class="form-control table-search shadow-none ps-3 pe-5" placeholder="ค้นหาชื่อ/สเปก/หมวดคอมเซต...">
                    <i class="bi bi-search search-icon text-muted"></i>
                  </div>
                </div>
              </div>

              <!-- Sets Listing Cards or Table -->
              <div class="table-responsive border rounded-4 custom-table-wrapper">
                <table class="table table-hover align-middle m-0">
                  <thead class="table-light-premium text-uppercase">
                    <tr>
                      <th class="ps-4">ชื่อคอมพิวเตอร์เซต</th>
                      <th>แพลตฟอร์ม</th>
                      <th>รายละเอียด / ประโยชน์หลัก</th>
                      <th>ราคาเสนอขาย</th>
                      <th class="text-center pe-4" style="width: 120px;">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="s in filteredSets" :key="s.id" class="table-row-premium">
                      <!-- Name -->
                      <td class="ps-4">
                        <div class="fw-bold text-dark fs-8">{{ s.name }}</div>
                        <div class="fs-9.5 text-muted font-monospace mt-0.5 fw-bold">{{ s.id }}</div>
                        <span class="badge bg-danger text-white rounded-pill px-2 py-0.5 fs-9.5 mt-2">{{ s.badgeText || 'PROMO' }}</span>
                      </td>

                      <!-- CPU Brand / Platform -->
                      <td>
                        <span class="badge px-2.5 py-1.5 rounded-pill fs-9 fw-bold" :class="(s.cpuBrand || s.cpu_brand) === 'Intel' ? 'bg-info-subtle text-info' : 'bg-warning-subtle text-warning'">
                          <i class="bi bi-cpu-fill"></i>
                          {{ s.cpuBrand || s.cpu_brand || 'Platform' }}
                        </span>
                        <div class="fs-9.5 text-muted-custom mt-1 fw-bold text-capitalize">{{ s.category }}</div>
                      </td>

                      <!-- Purpose / Parts summary count -->
                      <td>
                        <div class="text-muted-custom fs-9 text-truncate-custom" style="max-width: 200px;" :title="s.purpose">{{ s.purpose }}</div>
                        <span class="badge bg-secondary-subtle text-secondary border fs-9 mt-1.5">
                          <i class="bi bi-motherboard me-1"></i>
                          ชิ้นส่วนภายใน {{ s.partsList ? s.partsList.length : (s.parts_list ? JSON.parse(s.parts_list).length : 0) }} ชิ้น
                        </span>
                      </td>

                      <!-- Price & Discount Info -->
                      <td>
                        <div class="fs-9.5 text-decoration-line-through text-muted fw-semibold">฿{{ (s.originalPrice || s.original_price || 0).toLocaleString('th-TH') }}</div>
                        <div class="fw-bold text-danger fs-8 mt-0.5">฿{{ s.price.toLocaleString('th-TH') }}</div>
                      </td>

                      <!-- Actions -->
                      <td class="text-center pe-4">
                        <div class="d-inline-flex gap-1.5">
                          <button @click="editSet(s)" class="btn btn-action-edit btn-sm rounded-circle p-2 border-0" title="แก้ไขสเปกคอมเซต">
                            <i class="bi bi-pencil-fill"></i>
                          </button>
                          <button @click="deleteSet(s)" class="btn btn-action-delete btn-sm rounded-circle p-2 border-0" title="ลบคอมเซต">
                            <i class="bi bi-trash3-fill"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr v-if="filteredSets.length === 0">
                      <td colspan="5" class="text-center py-5 text-muted-custom">
                        <i class="bi bi-clipboard-x fs-2 mb-2 d-block"></i>
                        ไม่พบคอมพิวเตอร์เซตที่ตรงเงื่อนไขการค้นหา
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        </div>

      </div>

    </div>

    <!-- Elegant Floating React Toast Alert -->
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

    <KakaFooter />
  </div>
</template>

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
  animation: float-blob-dashboard 20s infinite alternate ease-in-out;
}

.blob-purple {
  top: 10%;
  left: 15%;
  width: 450px;
  height: 450px;
  background: #a855f7;
}

.blob-pink {
  bottom: 10%;
  right: 15%;
  width: 500px;
  height: 500px;
  background: #ec4899;
  animation-delay: -5s;
}

.blob-blue {
  top: 40%;
  right: 35%;
  width: 350px;
  height: 350px;
  background: #3b82f6;
  animation-delay: -10s;
}

@keyframes float-blob-dashboard {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(40px, -60px) scale(1.1); }
  100% { transform: translate(-30px, 40px) scale(0.9); }
}

.content-container {
  position: relative;
  z-index: 1;
}

/* Hero Header and Badges */
.badge-premium {
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(37, 99, 235, 0.1));
  border: 1px solid rgba(14, 165, 233, 0.25);
  color: #0ea5e9;
  font-weight: 700;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
  border-radius: 2rem;
}

.spin-slow {
  animation: spin 8s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.title-gradient {
  background: linear-gradient(135deg, #0f172a 30%, #1e293b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.5px;
}

.text-muted-custom {
  color: #64748b;
}

/* Navigation tabs */
.tab-nav-btn {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  color: #64748b;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.02);
}

.tab-nav-btn:hover {
  background: #f8fafc;
  color: #0f172a;
  border-color: #cbd5e1;
}

.tab-nav-btn.active-tab {
  background: linear-gradient(135deg, #0ea5e9, #2563eb);
  color: #ffffff;
  border-color: transparent;
  box-shadow: 0 8px 24px rgba(14, 165, 233, 0.25);
}

/* Glassmorphism Cards styling */
.glass-card {
  background: #ffffff;
  border-radius: 1.25rem;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.02) !important;
  overflow: hidden;
  border: 1px solid #eef2f6 !important;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.border-glow-cyan:hover {
  box-shadow: 0 15px 30px rgba(14, 165, 233, 0.08) !important;
  border-color: rgba(14, 165, 233, 0.3) !important;
}

.border-glow-purple:hover {
  box-shadow: 0 15px 30px rgba(168, 85, 247, 0.08) !important;
  border-color: rgba(168, 85, 247, 0.3) !important;
}

/* Stats Cards styling */
.stat-card {
  display: flex;
  align-items: center;
  padding: 1.75rem;
  gap: 1.25rem;
}

.stat-icon-wrapper {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 1rem;
  font-size: 1.5rem;
  color: #fff;
  flex-shrink: 0;
}

.bg-cyan-glow {
  background: linear-gradient(135deg, #0ea5e9, #2563eb);
  box-shadow: 0 8px 20px rgba(14, 165, 233, 0.2);
}

.bg-purple-glow {
  background: linear-gradient(135deg, #a855f7, #ec4899);
  box-shadow: 0 8px 20px rgba(168, 85, 247, 0.2);
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-title {
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.stat-number {
  font-size: 1.75rem;
  font-weight: 800;
  margin: 0.15rem 0 0 0;
}

.stat-unit {
  font-size: 0.9rem;
  font-weight: 500;
  color: #64748b;
  margin-left: 0.25rem;
}

.text-cyan-glow { color: #0ea5e9; }
.text-emerald-glow { color: #10b981; }
.text-blue-glow { color: #2563eb; }

/* Card Header Gradient banner */
.card-header-gradient {
  display: flex;
  align-items: center;
  padding: 1.5rem;
  gap: 1rem;
}

.header-add {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-bottom: 1px solid #bae6fd;
}

.header-edit {
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  border-bottom: 1px solid #fde68a;
}

.header-icon-box {
  width: 42px;
  height: 42px;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.header-add .header-icon-box {
  background: #e0f2fe;
  color: #0ea5e9;
  border: 1px solid #bae6fd;
}

.header-edit .header-icon-box {
  background: #fef3c7;
  color: #d97706;
  border: 1px solid #fde68a;
}

.header-text-container h5 {
  font-size: 1.05rem;
  letter-spacing: -0.2px;
  color: #0f172a;
}

.header-text-container small {
  font-size: 0.75rem;
  color: #64748b;
}

/* Premium Form Elements */
.form-label-custom {
  font-size: 0.85rem;
  font-weight: 600;
  color: #475569;
}

.form-select-custom {
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  color: #1e293b;
  border-radius: 0.85rem;
  padding: 0.85rem 1rem;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.form-select-custom:focus {
  border-color: #0ea5e9;
  box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.15);
}

.form-control-custom-input {
  width: 100%;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #1e293b;
  border-radius: 0.85rem;
  padding: 0.85rem 1rem;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.form-control-custom-input:focus {
  border-color: #0ea5e9;
  box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.15);
}

.border-danger-custom {
  border: 1px solid #ef4444 !important;
}
.border-danger-custom:focus {
  border-color: #dc2626 !important;
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.15) !important;
}

.text-area-specs {
  resize: vertical;
}

/* Actions Button Gradients */
.btn-action-gradient {
  border: none !important;
  border-radius: 0.85rem !important;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: white !important;
}

.btn-save {
  background: linear-gradient(135deg, #0ea5e9, #2563eb) !important;
}

.btn-save:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(14, 165, 233, 0.3) !important;
}

.btn-update {
  background: linear-gradient(135deg, #f59e0b, #d97706) !important;
}

.btn-update:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(217, 119, 6, 0.3) !important;
}

/* Right Column Table layout styling */
.filter-select-custom {
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 0.65rem 1rem;
  font-size: 0.85rem;
  color: #475569;
  outline: none;
  background-color: #ffffff;
}

.search-input-box {
  width: 220px;
}

.table-search {
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 0.65rem 2.5rem 0.65rem 1rem;
  font-size: 0.85rem;
  background-color: #ffffff;
  color: #1e293b;
  width: 100%;
}

.search-icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.95rem;
  pointer-events: none;
}

.custom-table-wrapper {
  max-height: 600px;
  overflow-y: auto;
}

.table-light-premium {
  background: #f8fafc;
  color: #475569;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #e2e8f0;
}

.table-light-premium th {
  padding: 1rem 0.75rem;
}

.table-row-premium {
  border-bottom: 1px solid #f1f5f9;
  transition: background-color 0.2s ease;
}

.table-row-premium:hover {
  background-color: #f8fafc;
}

.text-truncate-custom {
  white-space: nowrap;
  overflow: hidden;
  text-shadow: none;
  text-overflow: ellipsis;
}

/* Edit / Delete Buttons styling */
.btn-action-edit {
  background-color: #fef3c7;
  color: #d97706;
  transition: all 0.2s ease;
}

.btn-action-edit:hover {
  background-color: #fde68a;
  transform: scale(1.1);
}

.btn-action-delete {
  background-color: #fee2e2;
  color: #ef4444;
  transition: all 0.2s ease;
}

.btn-action-delete:hover {
  background-color: #fca5a5;
  transform: scale(1.1);
}

/* Toast Notifications standard */
.toast-custom {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-left: 5px solid transparent !important;
  width: 320px;
}

.toast-success {
  border-left-color: #10b981 !important;
}

.toast-danger {
  border-left-color: #ef4444 !important;
}

.toast-info {
  border-left-color: #0ea5e9 !important;
}

.toast-warning {
  border-left-color: #f59e0b !important;
}

.btn-close-custom {
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 1.15rem;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
}

.btn-close-custom:hover {
  color: #475569;
}

/* Responsive adjustments */
@media (max-width: 991px) {
  .search-input-box {
    width: 100%;
  }
}
</style>
