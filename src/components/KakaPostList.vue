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
      <!-- Hero Section -->
      <div class="header-section text-center mb-5 animate-fade-in">
        <span class="badge-premium px-3 py-2 mb-3 d-inline-flex align-items-center gap-1">
          <span class="pulse-icon"></span>
          IT NEWS HUB
        </span>
        <h1 class="fw-bold display-4 title-gradient mb-3 mt-2">TechGear Insight</h1>
        <p class="subtitle mx-auto text-muted-custom mb-4 fs-6">
          เกาะติดทุกความเคลื่อนไหวในแวดวงไอที เทคโนโลยีระดับโลก นวัตกรรมชิปเซต ฮาร์ดแวร์ล่าสุด และแนวคิดล้ำสมัยจากทั่วทุกมุมโลก
        </p>
        
        <!-- Search and Filter Section -->
        <div class="row justify-content-center mb-4">
          <div class="col-md-8 col-lg-6">
            <div class="search-box-wrapper glass-search position-relative shadow-sm rounded-pill p-1">
              <i class="bi bi-search search-icon-left position-absolute top-50 start-0 translate-middle-y ms-4 text-muted"></i>
              <input 
                v-model="searchQuery" 
                type="text" 
                class="form-control border-0 bg-transparent py-3 ps-5 pe-4 rounded-pill shadow-none" 
                placeholder="ค้นหาหัวข้อข่าวหรือเนื้อหา..."
              >
              <button v-if="searchQuery" @click="searchQuery = ''" class="btn btn-clear position-absolute top-50 end-0 translate-middle-y me-3 text-secondary border-0 bg-transparent">
                <i class="bi bi-x-circle-fill"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Categories Tabs -->
        <div class="categories-tabs d-flex justify-content-center flex-wrap gap-2 mb-4">
          <button 
            v-for="cat in categories" 
            :key="cat.id" 
            @click="selectedCategory = cat.id"
            class="btn category-tab-btn rounded-pill px-4 py-2 border-0 shadow-none d-flex align-items-center gap-2"
            :class="{ 'active-tab': selectedCategory === cat.id }"
          >
            <i :class="['bi', cat.icon]"></i>
            <span>{{ cat.name }}</span>
            <span class="badge rounded-pill bg-light-custom text-dark-custom fs-9">{{ getArticleCount(cat.id) }}</span>
          </button>
        </div>
      </div>

      <!-- Loading State (keeping the original look but with high fidelity skeleton card) -->
      <div v-if="loading" class="row g-4">
        <div v-for="n in 6" :key="n" class="col-md-6 col-lg-4">
          <div class="skeleton-card-premium rounded-4 p-4">
            <div class="skeleton-line header w-50 mb-4"></div>
            <div class="skeleton-line title w-100 mb-2"></div>
            <div class="skeleton-line title w-75 mb-4"></div>
            <div class="skeleton-line text w-100 mb-2"></div>
            <div class="skeleton-line text w-100 mb-2"></div>
            <div class="skeleton-line text w-50 mb-4"></div>
            <div class="d-flex justify-content-between mt-3">
              <div class="skeleton-line w-25"></div>
              <div class="skeleton-line w-25"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredArticles.length === 0" class="empty-state glass-card mx-auto text-center py-5 rounded-5 border-glow max-w-lg">
        <div class="empty-icon-box mb-4">
          <i class="bi bi-journal-x display-3 text-secondary opacity-50"></i>
        </div>
        <h3 class="fw-bold mb-2">ไม่พบข่าวสารที่คุณต้องการ</h3>
        <p class="text-muted-custom px-4 mb-4">ลองเปลี่ยนหมวดหมู่หรือคีย์เวิร์ดการค้นหาใหม่อีกครั้ง</p>
        <button @click="resetFilters" class="btn-action-gradient btn-retry px-5 py-3 shadow-glow-indigo">
          <i class="bi bi-arrow-clockwise me-2"></i>รีเซ็ตการค้นหาทั้งหมด
        </button>
      </div>

      <!-- Content Grid -->
      <div v-else class="row g-4">
        <div v-for="(article, index) in filteredArticles" :key="article.id" 
             class="col-md-6 col-lg-4 animate-fade-in-up"
             :style="{ animationDelay: (index * 0.08) + 's' }">
          <div class="glass-card modern-card h-100 p-0 rounded-4 position-relative overflow-hidden card-hover d-flex flex-column">
            <!-- Decorative light glow -->
            <div class="card-glow"></div>
            
            <!-- Article Image -->
            <div class="article-image-box position-relative overflow-hidden">
              <img :src="article.image" :alt="article.title" class="article-img-fluid img-hover-zoom">
              <div class="category-badge-overlay position-absolute top-0 start-0 m-3 px-3 py-1.5 rounded-pill shadow-sm">
                <i :class="['bi', getCategoryIcon(article.category), 'me-1']"></i>
                {{ article.categoryName }}
              </div>
            </div>

            <div class="p-4 d-flex flex-column flex-grow-1 text-start">
              <div class="card-header-top d-flex justify-content-between align-items-center mb-3">
                <div class="date-badge-custom">
                  <i class="bi bi-calendar3 me-1"></i> {{ article.date }}
                </div>
                <div class="readtime-meta">
                  <i class="bi bi-clock-fill text-muted me-1"></i>
                  <span class="readtime-text-custom">{{ article.readTime }}</span>
                </div>
              </div>

              <h5 class="card-title-premium fw-bold mb-3 text-dark">{{ article.title }}</h5>
              <p class="card-body-premium text-muted-custom mb-4">{{ article.summary }}</p>
              
              <div class="card-footer-premium mt-auto pt-3 border-top border-light-custom d-flex justify-content-between align-items-center">
                <div class="social-metrics d-flex gap-3">
                  <button @click.stop="toggleLike(article)" class="btn btn-like-custom border-0 p-0 d-flex align-items-center gap-1" :class="{ 'liked': article.isLiked }">
                    <i :class="['bi', article.isLiked ? 'bi-heart-fill' : 'bi-heart']"></i>
                    <span>{{ article.likes }}</span>
                  </button>
                  <span class="metric-box-custom text-blue"><i class="bi bi-eye-fill me-1"></i> {{ article.views }}</span>
                </div>
                <button @click="openArticle(article)" class="btn-read-glow-custom">
                  อ่านรายละเอียด <i class="bi bi-chevron-right ms-1"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Premium Article Reading Modal -->
    <transition name="modal-fade">
      <div v-if="showModal && activeArticle" class="modal-overlay d-flex align-items-center justify-content-center p-3" @click.self="closeArticle">
        <div class="modal-card glass-modal rounded-5 overflow-hidden animate-slide-up position-relative d-flex flex-column">
          <!-- Close button -->
          <button @click="closeArticle" class="btn-modal-close position-absolute top-0 end-0 m-4 rounded-circle border-0 d-flex align-items-center justify-content-center" aria-label="Close modal">
            <i class="bi bi-x-lg"></i>
          </button>

          <!-- Modal Image Header -->
          <div class="modal-image-header position-relative">
            <img :src="activeArticle.image" :alt="activeArticle.title" class="modal-header-img">
            <div class="modal-category-overlay position-absolute bottom-0 start-0 m-4 px-4 py-2 rounded-pill shadow-lg">
              <i :class="['bi', getCategoryIcon(activeArticle.category), 'me-1']"></i>
              {{ activeArticle.categoryName }}
            </div>
          </div>

          <!-- Modal Body Content (Scrollable) -->
          <div class="modal-body-scroll p-4 p-md-5 text-start">
            <div class="d-flex flex-wrap align-items-center gap-4 text-muted-custom fs-8 mb-4 border-bottom pb-3">
              <span class="d-flex align-items-center gap-1">
                <i class="bi bi-person-circle fs-6 text-primary"></i>
                เขียนโดย: <strong>{{ activeArticle.author }}</strong>
              </span>
              <span class="d-flex align-items-center gap-1">
                <i class="bi bi-calendar3 text-primary"></i>
                เผยแพร่เมื่อ: <strong>{{ activeArticle.date }}</strong>
              </span>
              <span class="d-flex align-items-center gap-1">
                <i class="bi bi-clock text-primary"></i>
                เวลาอ่านประมาณ: <strong>{{ activeArticle.readTime }}</strong>
              </span>
            </div>

            <h2 class="fw-extrabold text-dark modal-article-title mb-4">{{ activeArticle.title }}</h2>

            <!-- Render blocks of rich text -->
            <div class="article-rich-content lh-lg text-secondary-custom mb-5">
              <div v-for="(block, bIndex) in activeArticle.content" :key="bIndex" class="mb-4">
                <!-- Paragraph -->
                <p v-if="block.type === 'paragraph'" class="article-p fs-6">
                  {{ block.text }}
                </p>
                <!-- Heading -->
                <h4 v-else-if="block.type === 'heading'" class="article-h4 fw-bold text-dark mt-4 mb-3">
                  {{ block.text }}
                </h4>
                <!-- Quote -->
                <div v-else-if="block.type === 'quote'" class="article-quote-box border-start border-primary border-4 py-2 ps-4 my-4 rounded-end">
                  <p class="article-quote-text fst-italic text-dark fw-medium fs-5 mb-0">
                    {{ block.text }}
                  </p>
                </div>
                <!-- List -->
                <ul v-else-if="block.type === 'list'" class="article-list-ul ps-4 fs-6">
                  <li v-for="(item, itemIndex) in block.items" :key="itemIndex" class="mb-2 article-li">
                    {{ item }}
                  </li>
                </ul>
              </div>
            </div>

            <!-- Share & Action Center -->
            <div class="modal-actions-bar border-top pt-4 d-flex justify-content-between align-items-center">
              <button @click="toggleLike(activeArticle)" class="btn btn-modal-action-like px-4 py-2.5 rounded-pill border-0 d-flex align-items-center gap-2" :class="{ 'liked': activeArticle.isLiked }">
                <i :class="['bi', activeArticle.isLiked ? 'bi-heart-fill text-danger' : 'bi-heart']"></i>
                <span class="fw-bold">{{ activeArticle.isLiked ? 'ถูกใจแล้ว' : 'ถูกใจบทความนี้' }} ({{ activeArticle.likes }})</span>
              </button>
              <button @click="shareArticle(activeArticle)" class="btn btn-modal-action-share px-4 py-2.5 rounded-pill border border-secondary bg-transparent d-flex align-items-center gap-2">
                <i class="bi bi-share-fill"></i>
                <span class="fw-bold">แชร์บทความ</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Custom Toast Alert for sharing confirmation -->
    <transition name="toast-fade">
      <div v-if="showToast" class="toast-share-custom glass-toast position-fixed bottom-0 start-50 translate-middle-x mb-5 px-4 py-3 rounded-pill shadow-lg text-white d-flex align-items-center gap-2" style="z-index: 2000;">
        <i class="bi bi-check-circle-fill text-success fs-5"></i>
        <span class="fw-semibold text-dark">{{ toastMessage }}</span>
      </div>
    </transition>

    <KakaFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import KakaNavbar from './KakaNavbar.vue'
import KakaFooter from './KakaFooter.vue'

// Import assets to ensure correct compilation by Vite
import aiNewsImg from '../assets/tech_ai_news.png'
import hardwareNewsImg from '../assets/tech_hardware.png'
import cybersecNewsImg from '../assets/tech_cybersec.png'
import softwareNewsImg from '../assets/tech_software.png'

const loading = ref(true)
const searchQuery = ref('')
const selectedCategory = ref('all')
const showModal = ref(false)
const activeArticle = ref(null)
const showToast = ref(false)
const toastMessage = ref('')

const categories = ref([
  { id: 'all', name: 'ทั้งหมด', icon: 'bi-grid-fill' },
  { id: 'ai', name: 'AI & นวัตกรรม', icon: 'bi-cpu-fill' },
  { id: 'hardware', name: 'ฮาร์ดแวร์', icon: 'bi-gpu-card' },
  { id: 'software', name: 'ซอฟต์แวร์ & ดีเวลลอปเปอร์', icon: 'bi-code-slash' },
  { id: 'cybersec', name: 'ความปลอดภัยไซเบอร์', icon: 'bi-shield-lock-fill' }
])

const articles = ref([
  {
    id: 1,
    category: 'ai',
    categoryName: 'AI & นวัตกรรม',
    title: 'NVIDIA เปิดตัวสถาปัตยกรรม Blackwell ปฏิวัติวงการ AI และการประมวลผลขนาดใหญ่',
    summary: 'เจาะลึกชิปสถาปัตยกรรม Blackwell ยุคใหม่จาก NVIDIA ที่มีทรานซิสเตอร์สูงถึง 2.08 แสนล้านตัว มอบประสิทธิภาพการคำนวณและการเทรน AI สูงขึ้นกว่าเดิมถึง 30 เท่า',
    image: aiNewsImg,
    author: 'อนันต์ สิทธิ์เดช',
    date: '20 พ.ค. 2026',
    readTime: '5 นาที',
    views: 1420,
    likes: 412,
    isLiked: false,
    content: [
      { type: 'paragraph', text: 'ในยุคที่ปัญญาประดิษฐ์ (AI) เติบโตอย่างก้าวกระโดด ความต้องการพลังประมวลผลในศูนย์ข้อมูลก็ทวีความรุนแรงมากขึ้น NVIDIA จึงได้เปิดตัวสถาปัตยกรรม "Blackwell" ซึ่งเป็นชิปประมวลผลกราฟิก (GPU) ที่ทรงพลังที่สุดในโลก ณ ขณะนี้ ออกแบบมาเพื่อขับเคลื่อนโมเดล AI ขนาดใหญ่ระดับล้านล้านพารามิเตอร์' },
      { type: 'heading', text: 'สเปกสุดอลังการและพลังประมวลผลก้าวล้ำ' },
      { type: 'paragraph', text: 'ชิป Blackwell (รหัส B200) ผลิตด้วยกระบวนการ TSMC 4NP แบบพิเศษ โดยรวบรวมชิปสองตัวเข้าด้วยกันผ่านการเชื่อมต่อความเร็วสูงถึง 10 TB/s ทำให้มีทรานซิสเตอร์รวมกันมากถึง 2.08 แสนล้านตัว ช่วยเพิ่มความเร็วในการคำนวณแบบ FP8 และ FP4 ได้สูงสุดถึง 20 Petaflops' },
      { type: 'quote', text: '“Blackwell ไม่ใช่แค่ชิปธรรมดา แต่เป็นแพลตฟอร์มการประมวลผลยุคใหม่ที่จะเป็นกลไกขับเคลื่อนการปฏิวัติอุตสาหกรรมครั้งใหม่” — Jensen Huang, CEO ของ NVIDIA' },
      { type: 'heading', text: 'ทำไม Blackwell ถึงเป็นตัวเปลี่ยนเกมสำหรับองค์กร?' },
      { type: 'list', items: [
        'ประสิทธิภาพการรัน Generative AI ดีขึ้นถึง 30 เท่า เมื่อเทียบกับชิป Hopper H100 รุ่นก่อนหน้า',
        'ลดการใช้พลังงานและค่าใช้จ่ายลงได้สูงสุดถึง 25 เท่า ซึ่งเป็นมิตรต่อสิ่งแวดล้อมและงบประมาณของศูนย์ข้อมูล',
        'ระบบความปลอดภัยในตัวระดับฮาร์ดแวร์เพื่อปกป้องความลับของข้อมูลโมเดล AI ของลูกค้าองค์กร'
      ] },
      { type: 'paragraph', text: 'ด้วยขีดความสามารถเหล่านี้ ยักษ์ใหญ่ด้านเทคโนโลยีอย่าง AWS, Google Cloud, Microsoft Azure, และ Oracle ต่างเข้าคิวรอรับชิป Blackwell นี้เพื่อนำไปเสริมแกร่งระบบคลาวด์ของตนเอง ชี้ให้เห็นว่าวงการเทคโนโลยีไอทีทั่วโลกกำลังก้าวเข้าสู่ยุคถัดไปอย่างแท้จริง' }
    ]
  },
  {
    id: 2,
    category: 'hardware',
    categoryName: 'ฮาร์ดแวร์',
    title: 'เจาะลึกชิปประมวลผล Apple M4 ซีรีส์ พลังรัน AI เหนือระดับ บนโน้ตบุ๊กรุ่นใหม่ล่าสุด',
    summary: 'วิเคราะห์โครงสร้างชิป Apple M4, M4 Pro และ M4 Max ที่มาพร้อมสถาปัตยกรรม 3 นาโนเมตรรุ่นที่ 2 และ Neural Engine ความเร็วสูงถึง 38 ล้านล้านครั้งต่อวินาที',
    image: hardwareNewsImg,
    author: 'วิทวัส เจริญชัย',
    date: '18 พ.ค. 2026',
    readTime: '4 นาที',
    views: 980,
    likes: 215,
    isLiked: false,
    content: [
      { type: 'paragraph', text: 'Apple ได้สั่นสะเทือนวงการคอมพิวเตอร์พกพาอีกครั้งด้วยการเปิดตัวชิปซีรีส์ M4 (M4, M4 Pro, M4 Max) ซึ่งสร้างขึ้นบนสถาปัตยกรรมระดับ 3 นาโนเมตรระดับพรีเมียม ช่วยให้การใช้พลังงานมีประสิทธิภาพมากขึ้นและตอบสนองการคำนวณขั้นสูงได้อย่างสมบูรณ์แบบ โดยเฉพาะอย่างยิ่งระบบประมวลผล Apple Intelligence' },
      { type: 'heading', text: 'ความเร็วแรงของ Neural Engine ยุคใหม่' },
      { type: 'paragraph', text: 'หัวใจสำคัญของการทำงาน AI ในชิป M4 คือการอัปเดตตัวประมวลผล Neural Engine แบบ 16-Core ซึ่งสามารถทำการคำนวณได้สูงถึง 38 ล้านล้านครั้งต่อวินาที (TOPS) ซึ่งช่วยเร่งการประมวลผลภาษาแบบ Local (On-Device) ได้รวดเร็วอย่างไม่น่าเชื่อและไม่สูญเสียความปลอดภัยของข้อมูล' },
      { type: 'quote', text: '“ชิปตระกูล M4 มอบความสามารถต่อวัตต์ที่ทรงพลังที่สุดในคอมพิวเตอร์พกพา และช่วยเปลี่ยนผ่านแมคบุ๊กให้กลายเป็นขุมพลัง AI ของผู้ใช้งานจริง”' },
      { type: 'heading', text: 'การเปรียบเทียบประสิทธิภาพที่โดดเด่น' },
      { type: 'list', items: [
        'ประสิทธิภาพ CPU แบบมัลติคอร์เพิ่มขึ้นสูงสุดถึง 1.8 เท่า เมื่อเทียบกับชิป M2 รุ่นก่อนหน้า',
        'การประมวลผลกราฟิก (GPU) ที่มีฟีเจอร์ Hardware-accelerated Ray Tracing และ Mesh Shading เหมาะสำหรับการเรนเดอร์ 3 มิติ และการเล่นเกมฟอร์มยักษ์',
        'แบนด์วิดท์หน่วยความจำเพิ่มขึ้นมหาศาล รองรับ Unified Memory ได้สูงสุดถึง 128GB ในรุ่น Max'
      ] },
      { type: 'paragraph', text: 'ไม่ว่าคุณจะเป็นนักพัฒนาระบบ ดีไซเนอร์ หรือผู้ใช้ทั่วไป ชิป M4 ซีรีส์นี้ถือเป็นแนวทางใหม่ที่ชัดเจนว่าการทำงานบนระบบคอมพิวเตอร์ส่วนบุคคลจะเปลี่ยนไปสู่อนาคตที่มี AI ช่วยงานเป็นหัวใจสำคัญ' }
    ]
  },
  {
    id: 3,
    category: 'ai',
    categoryName: 'AI & นวัตกรรม',
    title: 'คาดการณ์ฟีเจอร์เด่นของ GPT-5: คลื่นลูกใหม่แห่งปัญญาประดิษฐ์ระดับสากล',
    summary: 'เผยข้อมูลวงในและวิเคราะห์ความสามารถของ GPT รุ่นใหม่จาก OpenAI ที่เน้นความเข้าใจบริบทเชิงลึกและการวิเคราะห์แบบ Multi-Modal สื่อสารไร้รอยต่อ',
    image: aiNewsImg,
    author: 'รพีพัฒน์ สุวรรณ',
    date: '15 พ.ค. 2026',
    readTime: '6 นาที',
    views: 1890,
    likes: 673,
    isLiked: false,
    content: [
      { type: 'paragraph', text: 'เป็นที่จับตามองของคนทั้งโลกสำหรับโมเดลภาษาขนาดใหญ่ (LLM) ยุคถัดไปอย่าง "GPT-5" จากค่าย OpenAI ที่มีข่าวลือว่าจะเปิดตัวอย่างเป็นทางการในเร็วๆ นี้ ซึ่งคาดว่าจะเป็นการปฏิวัติวงการ AI อีกครั้งด้วยขีดความสามารถที่อาจเข้าใกล้ปัญญาประดิษฐ์ทั่วไป (AGI) มากขึ้น' },
      { type: 'heading', text: 'การคิดวิเคราะห์เชิงเหตุผลขั้นสูง (Reasoning Capability)' },
      { type: 'paragraph', text: 'สิ่งสำคัญที่จะแยกความแตกต่างระหว่าง GPT-4 และโมเดลรุ่นใหม่นี้ คือความสามารถในการคิดวิเคราะห์โจทย์ที่ซับซ้อนหลายขั้นตอนได้อย่างเป็นระบบ โดยตัวโมเดลจะไม่ได้ให้คำตอบทันที แต่จะใช้กระบวนการ "System 2 thinking" หรือการทบทวนและตรวจสอบความถูกต้องด้วยตนเองก่อนตอบกลับ' },
      { type: 'quote', text: '“เป้าหมายของเราคือการสร้างระบบที่เข้าใจบริบทและสามารถแก้ไขปัญหาในโลกแห่งความเป็นจริงได้เหมือนกับผู้เชี่ยวชาญส่วนบุคคล”' },
      { type: 'heading', text: 'ฟีเจอร์ที่คาดว่าจะมาพร้อมกับ GPT-5' },
      { type: 'list', items: [
        'Multi-Modal ที่แท้จริง: สื่อสารตอบรับเสียง วิดีโอ รหัสมือ และข้อความได้แบบเรียลไทม์ไม่มีความหน่วง (Real-time Omnipresent)',
        'ขยาย Context Window ให้กว้างขึ้นสูงสุดถึง 1 ล้านโทเค็น สามารถอ่านหนังสือและเอกสารหลายสิบเล่มพร้อมกันได้โดยไม่หลงบริบท',
        'ระบบ Agent อัจฉริยะ: สามารถตั้งเป้าหมายและทำงานย่อยๆ แทนผู้ใช้ เช่น การจองตั๋ว การตรวจสอบความถูกต้องของระบบบัญชี หรือแม้แต่การเขียนโค้ดและทดสอบระบบได้ด้วยตัวเอง'
      ] },
      { type: 'paragraph', text: 'เทคโนโลยีระดับนี้คาดว่าจะช่วยเพิ่มประสิทธิภาพของนักวิจัย แพทย์ วิศวกรซอฟต์แวร์ และผู้คนทุกสาขาอาชีพได้อย่างก้าวกระโดด ซึ่งเราต้องรอคอยติดตามประกาศอย่างเป็นทางการอย่างใกล้ชิด' }
    ]
  },
  {
    id: 4,
    category: 'software',
    categoryName: 'ซอฟต์แวร์ & ดีเวลลอปเปอร์',
    title: 'เทรนด์ยอดนิยมในการพัฒนาเว็บปี 2026: ยุคแห่งความเร็วและความยืดหยุ่นด้วย WebAssembly',
    summary: 'อัปเดตทิศทางการสร้างและพัฒนาเว็บไซต์ยุคใหม่ เจาะลึกความนิยมของ React 19, การปฏิวัติ UI ของ Tailwind CSS และการเติบโตแบบก้าวกระโดดของ WebAssembly',
    image: softwareNewsImg,
    author: 'ณพงศ์ มงคล',
    date: '12 พ.ค. 2026',
    readTime: '4 นาที',
    views: 1120,
    likes: 310,
    isLiked: false,
    content: [
      { type: 'paragraph', text: 'การพัฒนาเว็บฟรอนต์เอนด์ (Frontend) ไม่เคยหยุดนิ่ง ในปี 2026 นี้ ทิศทางเทคโนโลยีเน้นหนักไปที่สองเรื่องสำคัญคือ ประสิทธิภาพความเร็วในการโหลดข้อมูล และความสามารถในการโต้ตอบกับผู้ใช้งานอย่างไร้ความขัดข้อง' },
      { type: 'heading', text: 'พลังของ WebAssembly (Wasm) ในการยกระดับประสิทธิภาพ' },
      { type: 'paragraph', text: 'WebAssembly กำลังกลายเป็นเครื่องมือหลักเมื่อต้องการประมวลผลกราฟิก วิดีโอ หรือ AI บนเบราว์เซอร์โดยไม่ต้องพึ่งพาเซิร์ฟเวอร์ขนาดใหญ่ ช่วยให้นักพัฒนาสามารถนำโค้ดที่เขียนด้วย C++, Rust หรือ Go มารันบนเบราว์เซอร์ด้วยความเร็วใกล้เคียงระดับ Native App' },
      { type: 'quote', text: '“เบราว์เซอร์ไม่ได้เป็นเพียงแค่เครื่องมือเปิดดูเอกสารหน้ากระดาษอีกต่อไป แต่ได้กลายเป็นแอปพลิเคชันรันเทมประสิทธิภาพสูงอย่างสมบูรณ์แบบ”' },
      { type: 'heading', text: 'สเปกแนวทางพัฒนาที่คุณห้ามพลาด' },
      { type: 'list', items: [
        'React 19 และการสนับสนุน React Server Components (RSC) ที่เป็นมาตรฐาน ช่วยให้เปิดหน้าเว็บได้เร็วขึ้นสูงสุดถึง 40%',
        'ความนิยมในระบบ SSR (Server-Side Rendering) และ Edge Computing ที่ดึงประสิทธิภาพการแสดงผลเข้าใกล้ผู้ใช้มากที่สุด',
        'การประยุกต์ใช้ AI Coding Assistants (เช่น Gemini Code Assist) ในการเขียนและรีแฟกเตอร์โค้ด ช่วยลดเวลาพัฒนาลงได้กว่าครึ่ง'
      ] },
      { type: 'paragraph', text: 'สำหรับนักพัฒนาฟรอนต์เอนด์และแบ็กเอนด์ การอัปเดตทักษะเกี่ยวกับ Framework สมัยใหม่และการบูรณาการระบบ AI จะเป็นกุญแจสำคัญที่ทำให้คุณโดดเด่นที่สุดในสายงานปีนี้' }
    ]
  },
  {
    id: 5,
    category: 'cybersec',
    categoryName: 'ความปลอดภัยไซเบอร์',
    title: 'แจ้งเตือนด่วน! พบช่องโหว่ระลอกใหม่ Zero-Day บนเว็บเบราว์เซอร์ยอดนิยม แนะนำให้อัปเดตทันที',
    summary: 'หน่วยงานความมั่นคงปลอดภัยไซเบอร์ระดับชาติออกโรงแจ้งเตือนช่องโหว่ความปลอดภัยระดับวิกฤตที่เปิดช่องให้แฮกเกอร์โจมตีคอมพิวเตอร์ระยะไกล',
    image: cybersecNewsImg,
    author: 'ธนัตถ์ จิตต์ภักดี',
    date: '10 พ.ค. 2026',
    readTime: '3 นาที',
    views: 1650,
    likes: 198,
    isLiked: false,
    content: [
      { type: 'paragraph', text: 'เกิดเหตุการณ์ความปลอดภัยระดับวิกฤตอีกครั้ง เมื่อนักวิจัยระบบรักษาความปลอดภัยไซเบอร์ตรวจพบการใช้ช่องโหว่ระดับ Zero-Day บนเอนจินประมวลผลโค้ดของเว็บเบราว์เซอร์ยอดนิยม ซึ่งปัจจุบันถูกนำไปใช้งานโดยกลุ่มแฮกเกอร์เพื่อเจาะข้อมูลจากระยะไกลและขโมยข้อมูลผู้ใช้งานแล้ว' },
      { type: 'heading', text: 'รายละเอียดของช่องโหว่และรูปแบบการทำงาน' },
      { type: 'paragraph', text: 'ช่องโหว่รหัส CVE-2026-X12 เกิดขึ้นในส่วนการจัดการหน่วยความจำ (V8 JavaScript Engine) โดยเมื่อผู้ใช้งานหลงเชื่อเข้าไปยังเว็บไซต์ที่แฮกเกอร์เตรียมไฟล์โค้ดประสงค์ร้ายไว้ โค้ดดังกล่าวจะสร้างสภาวะความผิดพลาดของหน่วยความจำเพื่อแอบติดตั้งมัลแวร์เข้าสู่คอมพิวเตอร์ได้ทันทีโดยที่ผู้ใช้ไม่จำเป็นต้องกดดาวน์โหลดไฟล์ใดๆ' },
      { type: 'quote', text: '“นี่คือการโจมตีแบบ Drive-by Download ที่อันตรายมากที่สุด เพราะเกิดขึ้นโดยตรงผ่านเบราว์เซอร์ปกติของผู้ใช้งาน”' },
      { type: 'heading', text: 'คำแนะนำการป้องกันตัวสำหรับผู้ใช้งานทั่วไป' },
      { type: 'list', items: [
        'เปิดเมนูการตั้งค่าของเว็บเบราว์เซอร์และกดตรวจสอบการอัปเดตเวอร์ชันล่าสุดทันที เพื่อรับแพตช์ความปลอดภัยใหม่ล่าสุด',
        'เปิดใช้งานฟีเจอร์ Safe Browsing และหลีกเลี่ยงการคลิกลิงก์แปลกปลอมจากอีเมลสแปมหรือข้อความไม่พึงประสงค์',
        'ติดตั้งระบบป้องกันไวรัส/มัลแวร์ที่อัปเดตฐานข้อมูลสม่ำเสมอเพื่อช่วยบล็อกทราฟฟิกประสงค์ร้าย'
      ] },
      { type: 'paragraph', text: 'ในยุคที่การทำงานส่วนใหญ่รันอยู่บนเบราว์เซอร์ การใส่ใจเรื่องความปลอดภัยเชิงรุกเป็นสิ่งสำคัญที่สุดที่ไม่สามารถละเลยได้ อย่าปล่อยให้ความล่าช้าในการกดอัปเดตปุ่มซอฟต์แวร์กลายเป็นโอกาสของแฮกเกอร์' }
    ]
  },
  {
    id: 6,
    category: 'ai',
    categoryName: 'AI & นวัตกรรม',
    title: 'ความสำเร็จครั้งประวัติศาสตร์: การพัฒนาชิปควอนตัมคอมพิวเตอร์ที่เสถียรที่สุดในโลก',
    summary: 'นักวิจัยเผยแพร่งานวิจัยการคิดค้นชิปควอนตัมที่ลดอัตราความผิดพลาดของคิวบิต (Qubits) ได้สูงถึง 99.9% ปลดล็อกการประมวลผลระดับซูเปอร์คอมพิวเตอร์',
    image: aiNewsImg,
    author: 'ศศิธร ไกลรัตน์',
    date: '08 พ.ค. 2026',
    readTime: '5 นาที',
    views: 820,
    likes: 290,
    isLiked: false,
    content: [
      { type: 'paragraph', text: 'ควอนตัมคอมพิวเตอร์ (Quantum Computing) เป็นเป้าหมายสูงสุดของวิศวกรคอมพิวเตอร์ทั่วโลก ล่าสุดสถาบันวิจัยชั้นนำร่วมมือกับทีมนักฟิสิกส์ประกาศความสำเร็จครั้งสำคัญในการสร้าง "ชิปควอนตัมเชิงพาณิชย์" ที่มีเสถียรภาพและสามารถทำงานในอุณหภูมิที่สูงขึ้นกว่าเดิมได้สำเร็จเป็นครั้งแรก' },
      { type: 'heading', text: 'การแก้ไขปัญหาความเปราะบางของคิวบิต' },
      { type: 'paragraph', text: 'อุปสรรคสำคัญที่ฉุดรั้งเทคโนโลยีควอนตัมมานานคือ ปรากฏการณ์ "Quantum Decoherence" ที่สภาวะควอนตัมล่มสลายจากคลื่นรบกวนภายนอก ทีมวิจัยแก้ไขเรื่องนี้ด้วยการนำวัสดุทรานซิสเตอร์ชนิดใหม่ที่มีการแยกโมเลกุลด้วยแม่เหล็กขนาดจิ๋ว (Topological Qubits) มาใช้ ซึ่งทำให้อัตราความผิดพลาดในการคำนวณลดลงเหลือน้อยกว่า 0.1% เท่านั้น' },
      { type: 'quote', text: '“นี่คือการก้าวข้ามจากจุดที่ศึกษาทางทฤษฎี สู่ยุคของควอนตัมคอมพิวเตอร์ที่สามารถแก้ปัญหายาเคมี และออกแบบรหัสความปลอดภัยใหม่ได้จริง”' },
      { type: 'heading', text: 'ขอบเขตการใช้งานในอนาคตอันใกล้' },
      { type: 'list', items: [
        'การคำนวณและจำลองโมเลกุลสารเคมีเพื่อพัฒนายาต้านมะเร็งตัวใหม่ภายในเวลาเพียงไม่กี่ชั่วโมง จากปกติที่ต้องใช้เวลากว่า 10 ปี',
        'การจำลองสภาวะภูมิอากาศของโลกแบบสมบูรณ์ เพื่อวิเคราะห์และแก้ไขปัญหาโลกร้อนได้อย่างตรงจุดและแม่นยำ',
        'การแก้โจทย์การขนส่งและลอจิสติกส์ระดับโลกที่มีตัวแปรนับล้านตัวในเวลาเสี้ยววินาที'
      ] },
      { type: 'paragraph', text: 'นับเป็นการปฏิวัติวงการวิทยาศาสตร์คำนวณของมนุษยชาติ ซึ่งจะช่วยผลักดันให้ขีดจำกัดทางเทคโนโลยีของโลกเราฉีกออกไปอย่างไม่มีวันย้อนกลับมาได้อีกเลย' }
    ]
  },
  {
    id: 7,
    category: 'hardware',
    categoryName: 'ฮาร์ดแวร์',
    title: 'Intel เปิดตัวซีพียู Arrow Lake ชิปประหยัดพลังงานประสิทธิภาพสูง ลุยศึกตลาด AI PC',
    summary: 'เจาะลึกสถาปัตยกรรม Intel Core Ultra เจนเนอเรชั่นใหม่ล่าสุด โดดเด่นด้านพลังประมวลผลกราฟิก Xe-LPG และการประหยัดพลังงานที่ดีเยี่ยมสำหรับอุปกรณ์พกพา',
    image: hardwareNewsImg,
    author: 'กิตติศักดิ์ พรหมมา',
    date: '05 พ.ค. 2026',
    readTime: '4 นาที',
    views: 1310,
    likes: 278,
    isLiked: false,
    content: [
      { type: 'paragraph', text: 'Intel ได้เปิดตัวหน่วยประมวลผลตระกูลใหม่ล่าสุดภายใต้รหัส "Arrow Lake" หรือ Core Ultra ซีรีส์ใหม่ เพื่อช่วงชิงส่วนแบ่งตลาดฮาร์ดแวร์ยุค AI PC ที่กำลังแข่งขันกันอย่างดุเดือด โดยชิปตัวนี้เน้นการออกแบบสถาปัตยกรรม 3D Foveros Packaging ที่แบ่งเป็น Tile ย่อยๆ เพื่อความยืดหยุ่นในการประมวลผล' },
      { type: 'heading', text: 'การจัดการพลังงานแบบไฮบริดยุคใหม่' },
      { type: 'paragraph', text: 'ชิ้นส่วนสำคัญคือ Lion Cove (Performance cores) และ Skymont (Efficient cores) ได้ถูกรีดีไซน์ใหม่ทั้งหมด ทำให้ได้ประสิทธิภาพ Single-thread ดีขึ้น แต่จุดที่น่าตกใจที่สุดคืออัตราการบริโภคพลังงานที่ลดลงเกือบ 30% เมื่อเทียบกับเจนเนอเรชั่น 14 เดิม ซึ่งช่วยยืดอายุการใช้งานแบตเตอรี่บนแล็ปท็อปได้ยาวนานกว่าเดิมมาก' },
      { type: 'quote', text: '“Arrow Lake ได้แก้ไขปัญหาเรื่องความร้อนและพลังงานที่ผู้ใช้งานกังวลได้อย่างมีนัยสำคัญ และนำพา Intel เข้าสู่ยุคประสิทธิภาพต่อวัตต์ระดับสูงสุด”' },
      { type: 'heading', text: 'จุดเด่นเชิงเทคนิคของ Arrow Lake' },
      { type: 'list', items: [
        'หน่วยประมวลผล NPU (Neural Processing Unit) ในตัวที่อัปเกรดความเร็วเป็น 40+ TOPS ตอบโจทย์ข้อกำหนด Copilot+ PC ของ Microsoft',
        'การประมวลผลกราฟิกออนชิป (iGPU) สถาปัตยกรรมตัวใหม่ที่แรงกว่าเดิมเกือบเท่าตัว สามารถเล่นเกมความละเอียดสูงได้ลื่นไหล',
        'การเชื่อมต่อความเร็วสูงผ่าน Thunderbolt 5 และการรองรับเครือข่ายไร้สาย Wi-Fi 7 เป็นมาตรฐานติดตัวชิป'
      ] },
      { type: 'paragraph', text: 'ศึกชิปประมวลผลของเครื่องพีซีในครั้งนี้คึกคักอย่างยิ่ง และการเปิดตัว Arrow Lake ของ Intel ก็นับว่าเป็นการขยับหมากที่ทรงพลังและตอบสนองกลุ่มลูกค้าที่ต้องการทั้งความแรงและความประหยัดพลังงานอย่างสมบูรณ์แบบ' }
    ]
  }
])

const filteredArticles = computed(() => {
  let result = articles.value

  // Filter by category
  if (selectedCategory.value !== 'all') {
    result = result.filter(a => a.category === selectedCategory.value)
  }

  // Filter by search query
  if (searchQuery.value.trim() !== '') {
    const q = searchQuery.value.toLowerCase().trim()
    result = result.filter(a => 
      a.title.toLowerCase().includes(q) || 
      a.summary.toLowerCase().includes(q) ||
      a.author.toLowerCase().includes(q)
    )
  }

  return result
})

const getArticleCount = (categoryId) => {
  if (categoryId === 'all') return articles.value.length
  return articles.value.filter(a => a.category === categoryId).length
}

const getCategoryIcon = (category) => {
  switch (category) {
    case 'ai': return 'bi-cpu-fill'
    case 'hardware': return 'bi-gpu-card'
    case 'software': return 'bi-code-slash'
    case 'cybersec': return 'bi-shield-lock-fill'
    default: return 'bi-bookmark-fill'
  }
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = 'all'
}

const toggleLike = (article) => {
  article.isLiked = !article.isLiked
  if (article.isLiked) {
    article.likes++
    showToastAlert('เพิ่มบทความในรายการที่คุณถูกใจแล้ว! ❤️')
  } else {
    article.likes--
  }
}

const openArticle = (article) => {
  activeArticle.value = article
  showModal.value = true
  // Increment view counter locally for visual realism
  article.views++
  // Prevent background scrolling
  document.body.style.overflow = 'hidden'
}

const closeArticle = () => {
  showModal.value = false
  // Re-enable background scrolling
  document.body.style.overflow = ''
}

const shareArticle = (article) => {
  // Simulate copying link to clipboard
  const url = window.location.href + '?article=' + article.id
  navigator.clipboard.writeText(url).then(() => {
    showToastAlert('คัดลอกลิงก์บทความไปยังคลิปบอร์ดแล้ว! 🔗')
  }).catch(() => {
    // Fallback if clipboard API is blocked
    showToastAlert('คัดลอกลิงก์บทความสำเร็จแล้ว!')
  })
}

const showToastAlert = (message) => {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 2500)
}

onMounted(() => {
  // Simulate loading delay for a premium transition feel
  setTimeout(() => {
    loading.value = false
  }, 800)
})
</script>

<script>
export default {
  name: 'KakaPostList'
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
  background: #f8fafc;
  color: #1e293b;
}

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
  opacity: 0.04;
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

.fw-bold {
  font-weight: 700;
}

.fw-extrabold {
  font-weight: 800;
}

.title-gradient {
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 40%, #2563eb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 2.8rem;
  letter-spacing: -0.5px;
}

.subtitle {
  max-width: 600px;
}

.badge-premium {
  background: #e0f2fe;
  border: 1px solid #bae6fd;
  color: #0ea5e9;
  border-radius: 2rem;
  font-weight: 700;
  font-size: 0.75rem;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.pulse-icon {
  width: 8px;
  height: 8px;
  background-color: #0ea5e9;
  border-radius: 50%;
  display: inline-block;
  position: relative;
}

.pulse-icon::after {
  content: '';
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  border-radius: 50%;
  background-color: inherit;
  animation: pulse-wave 2s infinite;
}

@keyframes pulse-wave {
  0% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(3); opacity: 0; }
}

/* Glassmorphic Search */
.glass-search {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1.5px solid rgba(226, 232, 240, 0.8);
  transition: all 0.3s ease;
}

.glass-search:focus-within {
  background: #ffffff;
  border-color: #0ea5e9;
  box-shadow: 0 10px 25px rgba(14, 165, 233, 0.1) !important;
}

.search-box-wrapper input {
  font-size: 1rem;
  color: #1e293b;
}

.search-icon-left {
  font-size: 1.1rem;
}

/* Category Tabs */
.category-tab-btn {
  background: #ffffff;
  border: 1.5px solid #e2e8f0 !important;
  color: #64748b;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 10px rgba(0,0,0,0.02);
}

.category-tab-btn:hover {
  background: #f8fafc;
  color: #0ea5e9;
  border-color: #bae6fd !important;
  transform: translateY(-1px);
}

.category-tab-btn.active-tab {
  background: linear-gradient(135deg, #0ea5e9, #2563eb);
  color: #ffffff !important;
  border-color: transparent !important;
  box-shadow: 0 8px 20px rgba(14, 165, 233, 0.25);
}

.bg-light-custom {
  background-color: rgba(241, 245, 249, 0.9);
}

.active-tab .bg-light-custom {
  background-color: rgba(255, 255, 255, 0.2);
}

.text-dark-custom {
  color: #475569;
  font-size: 0.8rem;
  font-weight: 700;
}

.active-tab .text-dark-custom {
  color: #ffffff;
}

/* Glassmorphic News Card */
.glass-card {
  background: #ffffff !important;
  border: 1.5px solid #e2e8f0 !important;
  border-radius: 1.5rem !important;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.03) !important;
}

.card-hover:hover {
  transform: translateY(-8px);
  border-color: #bae6fd !important;
  box-shadow: 0 20px 40px rgba(14, 165, 233, 0.08) !important;
}

.article-image-box {
  height: 200px;
  width: 100%;
  background-color: #e2e8f0;
}

.article-img-fluid {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.card-hover:hover .img-hover-zoom {
  transform: scale(1.05);
}

.category-badge-overlay {
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px);
  color: #1e293b;
  font-weight: 700;
  font-size: 0.75rem;
  border: 1px solid rgba(255,255,255,0.6);
}

.date-badge-custom {
  font-size: 0.8rem;
  font-weight: 600;
  color: #64748b;
  background: #f1f5f9;
  padding: 4px 12px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.readtime-text-custom {
  font-size: 0.8rem;
  font-weight: 600;
  color: #64748b;
}

.card-title-premium {
  font-size: 1.2rem;
  line-height: 1.45;
  height: 3.5rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  color: #0f172a !important;
  transition: color 0.3s ease;
}

.card-hover:hover .card-title-premium {
  color: #0ea5e9 !important;
}

.card-body-premium {
  font-size: 0.9rem;
  line-height: 1.6;
  height: 4.8rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  color: #64748b !important;
}

.border-light-custom {
  border-color: #e2e8f0 !important;
}

.btn-like-custom {
  background: none;
  font-size: 0.85rem;
  font-weight: 600;
  color: #64748b;
  transition: all 0.2s ease;
}

.btn-like-custom i {
  font-size: 0.95rem;
  transition: transform 0.2s ease;
}

.btn-like-custom:hover {
  color: #ef4444;
}

.btn-like-custom:hover i {
  transform: scale(1.2);
}

.btn-like-custom.liked {
  color: #ef4444 !important;
}

.metric-box-custom {
  font-size: 0.85rem;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.text-blue {
  color: #0ea5e9 !important;
}

.btn-read-glow-custom {
  background: transparent;
  border: none;
  color: #0ea5e9;
  font-weight: 700;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.btn-read-glow-custom:hover {
  color: #2563eb;
  transform: translateX(4px);
}

/* Premium Reading Modal */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(8px);
  z-index: 1100;
}

.modal-card {
  width: 100%;
  max-width: 820px;
  max-height: 90vh;
  background: #ffffff;
  border: 1px solid rgba(255,255,255,0.8);
  box-shadow: 0 30px 60px rgba(15, 23, 42, 0.2);
  z-index: 1200;
}

.btn-modal-close {
  width: 40px;
  height: 40px;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(8px);
  color: #ffffff;
  font-size: 1rem;
  transition: all 0.3s ease;
  z-index: 10;
}

.btn-modal-close:hover {
  background: #ef4444;
  transform: rotate(90deg);
}

.modal-image-header {
  height: 280px;
  width: 100%;
}

.modal-header-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-category-overlay {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  color: #1e293b;
  font-weight: 800;
  font-size: 0.85rem;
  border: 1px solid rgba(255,255,255,0.8);
}

.modal-body-scroll {
  overflow-y: auto;
  flex-grow: 1;
}

.modal-article-title {
  font-size: 1.8rem;
  line-height: 1.4;
  color: #0f172a;
}

.article-rich-content {
  color: #334155;
  font-size: 1.05rem;
}

.article-p {
  line-height: 1.85;
  margin-bottom: 1.5rem;
}

.article-h4 {
  font-size: 1.35rem;
  border-left: 4px solid #0ea5e9;
  padding-left: 12px;
  margin-top: 1.5rem;
}

.article-quote-box {
  background: rgba(14, 165, 233, 0.04);
}

.article-quote-text {
  color: #0f172a !important;
}

.article-list-ul {
  list-style-type: none;
}

.article-li {
  position: relative;
  padding-left: 1.5rem;
}

.article-li::before {
  content: "✦";
  position: absolute;
  left: 0;
  color: #0ea5e9;
  font-weight: bold;
}

.btn-modal-action-like {
  background: #f1f5f9;
  color: #475569;
  transition: all 0.3s ease;
}

.btn-modal-action-like.liked {
  background: #fee2e2;
  color: #ef4444;
}

.btn-modal-action-like:hover {
  background: #e2e8f0;
}

.btn-modal-action-like.liked:hover {
  background: #fecaca;
}

.btn-modal-action-share {
  transition: all 0.3s ease;
  color: #475569;
}

.btn-modal-action-share:hover {
  background: #f8fafc;
  color: #0ea5e9;
  border-color: #bae6fd !important;
}

/* Glass Toast */
.glass-toast {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid #bae6fd;
  box-shadow: 0 10px 30px rgba(14, 165, 233, 0.15);
}

/* Skeleton Loading styles */
.skeleton-card-premium {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.03);
}

.skeleton-line {
  background: rgba(0, 0, 0, 0.05);
  height: 15px;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}

.skeleton-line::after {
  content: "";
  position: absolute;
  top: 0; right: 0; bottom: 0; left: 0;
  background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.03), transparent);
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.skeleton-line.header { height: 25px; }
.skeleton-line.title { height: 20px; }
.skeleton-line.text { height: 12px; }

/* Empty state styling */
.empty-state {
  max-width: 500px;
}

.border-glow:hover {
  box-shadow: 0 15px 40px rgba(14, 165, 233, 0.08) !important;
}

.text-muted-custom {
  color: #64748b;
  font-weight: 400;
}

/* Retry Connection button */
.btn-action-gradient {
  border: none !important;
  border-radius: 1rem !important;
  font-weight: 700;
  letter-spacing: 0.5px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  color: white !important;
}

.btn-retry {
  background: linear-gradient(135deg, #0ea5e9, #2563eb) !important;
}

.btn-retry:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(14, 165, 233, 0.3) !important;
}

/* Transitions */
.animate-fade-in {
  animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Vue Animations */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.3s ease;
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, 20px);
}

@media (max-width: 768px) {
  .display-4 { font-size: 2.3rem; }
  .modal-article-title { font-size: 1.4rem; }
  .modal-image-header { height: 180px; }
  .modal-card { max-height: 95vh; }
  .modal-body-scroll { padding: 1.5rem; }
}
</style>
