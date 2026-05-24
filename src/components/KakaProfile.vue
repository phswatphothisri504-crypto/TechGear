<template>
  <div class="page-wrapper">
    <KakaNavbar />
    <div class="profile-container">
      <div class="profile-layout">
        <!-- Sidebar -->
        <aside class="profile-sidebar">
          <nav class="sidebar-menu">
            <div v-for="group in tabGroups" :key="group.title" class="menu-group">
              <div class="menu-group-title">{{ group.title }}</div>
              <button 
                v-for="tab in group.items" 
                :key="tab.id" 
                :class="['menu-item', { active: activeTab === tab.id }]"
                @click="activeTab = tab.id"
              >
                <span class="icon" v-html="tab.icon"></span>
                {{ tab.label }}
              </button>
            </div>
          </nav>
        </aside>

        <!-- Main Content -->
        <main class="profile-content">
          <!-- ข้อมูลส่วนตัว (My Profile) Tab -->
          <div v-if="activeTab === 'profile'" class="tab-pane fade-in">
            <div class="pane-header-row">
              <div class="pane-title-wrap">
                <span class="title-icon">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </span>
                <h2>ข้อมูลส่วนตัว</h2>
              </div>
              <button 
                v-if="!isEditing"
                type="button" 
                class="btn-edit" 
                @click="startEdit"
              >
                แก้ไขข้อมูลส่วนตัว
              </button>
            </div>
            
            <!-- Summary Header Card Row -->
            <div class="profile-summary-row">
              <!-- Avatar Card -->
              <div class="avatar-card">
                <div class="avatar-circle">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke-linecap="round" stroke-linejoin="round"></path>
                    <circle cx="12" cy="7" r="4" stroke-linecap="round" stroke-linejoin="round"></circle>
                  </svg>
                </div>
                <div class="avatar-name-wrap">
                  <span class="avatar-name">{{ userProfile.firstName || 'พศวัต' }} {{ userProfile.lastName || 'บัวจีน' }}</span>
                </div>
              </div>
              
              <!-- Stats Grid -->
              <div class="stats-grid">
                <div class="stat-box">
                  <span class="stat-num">{{ stats.completed }}</span>
                  <span class="stat-label">เสร็จสิ้น</span>
                </div>
                <div class="stat-box">
                  <span class="stat-num">{{ stats.shipped }}</span>
                  <span class="stat-label">จัดส่งแล้ว</span>
                </div>
                <div class="stat-box">
                  <span class="stat-num">{{ stats.processing }}</span>
                  <span class="stat-label">รอดำเนินการ</span>
                </div>
                <div class="stat-box">
                  <span class="stat-num">{{ stats.pending }}</span>
                  <span class="stat-label">รอชำระเงิน</span>
                </div>
              </div>
            </div>
            
            <!-- View Mode Details Card -->
            <div v-if="!isEditing" class="details-card fade-in">
              <div class="details-grid">
                <div class="detail-item">
                  <span class="detail-label">ชื่อ - นามสกุล</span>
                  <span class="detail-val">{{ (userProfile.firstName || userProfile.lastName) ? `${userProfile.firstName} ${userProfile.lastName}` : '-' }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">อีเมล</span>
                  <span class="detail-val">{{ userProfile.email || '-' }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">หมายเลขโทรศัพท์</span>
                  <span class="detail-val">{{ userProfile.phone || '-' }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">วัน / เดือน / ปีเกิด</span>
                  <span class="detail-val">{{ formatBirthday(userProfile.birthday) }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">ไลน์ไอดี</span>
                  <span class="detail-val">{{ userProfile.lineId || '-' }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">เฟสบุ๊ค</span>
                  <span class="detail-val">{{ userProfile.facebook || '-' }}</span>
                </div>
              </div>
            </div>
            
            <!-- Edit Mode Details Card -->
            <div v-else class="edit-card fade-in">
              <form @submit.prevent="saveProfile" class="edit-form">
                <div class="edit-grid">
                  <div class="form-group">
                    <label>ชื่อ (First Name)</label>
                    <input type="text" v-model="editProfileData.firstName" placeholder="ชื่อ" required />
                  </div>
                  <div class="form-group">
                    <label>นามสกุล (Last Name)</label>
                    <input type="text" v-model="editProfileData.lastName" placeholder="นามสกุล" required />
                  </div>
                  <div class="form-group">
                    <label>อีเมล (Email) *อ่านอย่างเดียว</label>
                    <input type="email" :value="userProfile.email" readonly class="readonly" />
                  </div>
                  <div class="form-group">
                    <label>หมายเลขโทรศัพท์ (Phone Number)</label>
                    <input type="text" v-model="editProfileData.phone" placeholder="-" />
                  </div>
                  <div class="form-group">
                    <label>วัน / เดือน / ปีเกิด (Birthday)</label>
                    <input type="date" v-model="editProfileData.birthday" />
                  </div>
                  <div class="form-group">
                    <label>เพศ (Gender)</label>
                    <select v-model="editProfileData.gender">
                      <option value="male">ชาย</option>
                      <option value="female">หญิง</option>
                      <option value="other">อื่นๆ</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label>ไลน์ไอดี (Line ID)</label>
                    <input type="text" v-model="editProfileData.lineId" placeholder="-" />
                  </div>
                  <div class="form-group">
                    <label>เฟสบุ๊ค (Facebook)</label>
                    <input type="text" v-model="editProfileData.facebook" placeholder="-" />
                  </div>
                </div>
                <div class="edit-actions">
                  <button type="button" class="btn-cancel" @click="cancelEdit">ยกเลิก</button>
                  <button type="submit" class="btn-submit">บันทึกข้อมูล</button>
                </div>
              </form>
            </div>
          </div>

          <!-- Shipping Address Tab -->
          <div v-if="activeTab === 'shipping_address'" class="tab-pane fade-in">
            <div class="pane-header">
              <h2>ที่อยู่สำหรับจัดส่ง (Shipping Address)</h2>
              <p>จัดการที่อยู่สำหรับจัดส่งสินค้าของคุณ</p>
            </div>
            <div class="address-list">
              <div v-for="addr in addresses.filter(a => a.type === 'shipping')" :key="addr.id" class="address-card">
                <div class="address-header">
                  <span v-if="addr.is_default === 1" class="badge default-badge">ค่าเริ่มต้น</span>
                  <span v-else class="badge-set-default" @click="setAddressDefault(addr)">ตั้งเป็นค่าเริ่มต้น</span>
                  <div class="actions-wrap d-flex gap-2">
                    <button class="btn-icon" @click="openEditAddress(addr)" title="แก้ไขที่อยู่">
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                    <button class="btn-icon btn-delete" @click="deleteAddress(addr.id)" title="ลบที่อยู่">
                      <i class="bi bi-trash text-danger" style="font-size: 1.1rem;"></i>
                    </button>
                  </div>
                </div>
                <h4>{{ addr.full_name }}</h4>
                <p>{{ addr.address_line }}</p>
                <p>โทร: {{ addr.phone }}</p>
              </div>
              <button class="add-address-btn" @click="openAddAddress('shipping')">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                เพิ่มที่อยู่ใหม่
              </button>
            </div>
          </div>

          <!-- Billing Address Tab -->
          <div v-if="activeTab === 'billing_address'" class="tab-pane fade-in">
            <div class="pane-header">
              <h2>ที่อยู่สำหรับออกใบกำกับภาษี (Billing Address)</h2>
              <p>จัดการที่อยู่สำหรับออกใบกำกับภาษีและใบเสร็จรับเงิน</p>
            </div>
            <div class="address-list">
              <div v-for="addr in addresses.filter(a => a.type === 'billing')" :key="addr.id" class="address-card">
                <div class="address-header">
                  <span v-if="addr.is_default === 1" class="badge default-badge">ค่าเริ่มต้น</span>
                  <span v-else class="badge-set-default" @click="setAddressDefault(addr)">ตั้งเป็นค่าเริ่มต้น</span>
                  <div class="actions-wrap d-flex gap-2">
                    <button class="btn-icon" @click="openEditAddress(addr)" title="แก้ไขที่อยู่">
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                    <button class="btn-icon btn-delete" @click="deleteAddress(addr.id)" title="ลบที่อยู่">
                      <i class="bi bi-trash text-danger" style="font-size: 1.1rem;"></i>
                    </button>
                  </div>
                </div>
                <h4>{{ addr.full_name }}</h4>
                <p>{{ addr.address_line }}</p>
                <p v-if="addr.tax_id">เลขประจำตัวผู้เสียภาษี: {{ addr.tax_id }}</p>
                <p>โทร: {{ addr.phone }}</p>
              </div>
              <button class="add-address-btn" @click="openAddAddress('billing')">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                เพิ่มที่อยู่ใหม่
              </button>
            </div>
          </div>

          <!-- Orders Tab -->
          <div v-if="activeTab === 'orders'" class="tab-pane fade-in">
            <div class="pane-header">
              <h2>คำสั่งซื้อทั้งหมด (My Orders)</h2>
              <p>ดูประวัติการสั่งซื้อสินค้าและการจัดส่งทั้งหมด</p>
            </div>
            
            <div v-if="orders.length > 0" class="order-list">
              <div v-for="order in orders" :key="order.id" class="order-card shadow-sm border rounded-4 overflow-hidden mb-3">
                <div class="order-header d-flex justify-content-between align-items-center p-3 bg-light border-bottom">
                  <div>
                    <span class="order-id fw-bold text-dark me-2">รายการสั่งซื้อ #{{ order.order_number }}</span>
                    <span class="order-date text-muted fs-8">{{ formatDate(order.created_at) }}</span>
                  </div>
                  <span :class="['status px-3 py-1 rounded-pill fw-semibold fs-8', getStatusClass(order.status)]">
                    {{ getStatusLabel(order.status) }}
                  </span>
                </div>
                <div class="order-items p-3">
                  <div v-for="item in order.items" :key="item.id" class="item d-flex align-items-center gap-3 py-2 border-bottom border-light">
                    <div class="item-img premium-img d-flex align-items-center justify-content-center" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; width: 55px; height: 55px; flex-shrink: 0;">
                      <i :class="['bi', getProductIcon(item.product_name)]" style="font-size: 1.35rem; color: #64748b;"></i>
                    </div>
                    <div class="item-details flex-grow-1">
                      <h4 class="m-0 fw-semibold text-dark fs-8" :title="item.product_name">{{ item.product_name }}</h4>
                      <p class="m-0 text-muted fs-9">จำนวน: {{ item.qty }}</p>
                    </div>
                    <div class="item-price fw-bold text-dark">฿{{ parseFloat(item.price).toLocaleString('th-TH') }}</div>
                  </div>
                </div>
                <div class="order-footer p-3 bg-light border-top d-flex justify-content-between align-items-center flex-wrap gap-2">
                  <div class="text-muted fs-9">
                    <span class="me-3"><i class="bi bi-truck me-1"></i>{{ order.shipping_method === 'pickup' ? `รับเองที่สาขา (${order.pickup_branch})` : 'จัดส่งถึงบ้าน' }}</span>
                    <span><i class="bi bi-credit-card me-1"></i>{{ order.payment_method === 'qr' ? 'PromptPay' : order.payment_method === 'card' ? 'บัตรเครดิต' : 'ผ่อนชำระ 0%' }}</span>
                  </div>
                  <div class="d-flex align-items-center gap-3">
                    <div class="text-end">
                      <span class="total-label text-muted fs-8 me-2">ยอดชำระสุทธิ:</span>
                      <span class="total-price fw-bold text-primary fs-6">฿{{ parseFloat(order.total_amount).toLocaleString('th-TH', {minimumFractionDigits: 2}) }}</span>
                    </div>
                    <button class="btn btn-view-details" @click="viewOrderDetails(order)">
                      <i class="bi bi-eye"></i>ดูรายละเอียด
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-else class="empty-favorites text-center py-5">
              <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" class="mb-3 text-muted">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              <p class="m-0 text-muted fw-medium">ยังไม่มีประวัติการสั่งซื้อสินค้าของคุณ</p>
            </div>
          </div>

          <!-- Favorites Tab -->
          <div v-if="activeTab === 'favorites'" class="tab-pane fade-in">
            <div class="pane-header">
              <h2>สินค้าที่ถูกใจ (My Favorites)</h2>
              <p>รายการสินค้าคอมพิวเตอร์ระดับพรีเมียมที่คุณกดถูกใจไว้</p>
            </div>
            <div class="empty-favorites">
              <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              <p>ยังไม่มีรายการสินค้าที่คุณถูกใจ</p>
            </div>
          </div>

          <!-- Payment Channels Tab -->
          <div v-if="activeTab === 'payment'" class="tab-pane fade-in">
            <div class="pane-header">
              <h2>ช่องทางการชำระเงิน (Payment Methods)</h2>
              <p>จัดการบัตรเครดิต บัญชีธนาคาร หรือกระเป๋าเงินดิจิทัลสำหรับการทำธุรกรรม</p>
            </div>
            <div class="address-list align-items-stretch">
              <div v-for="card in paymentMethods" :key="card.id" :class="['payment-card premium-card-glow', card.card_provider.toLowerCase()]">
                <div class="card-top-row d-flex justify-content-between align-items-center">
                  <div class="card-chip"></div>
                  <span class="card-provider-brand fw-extrabold text-uppercase tracking-wider fs-7">{{ card.card_provider }}</span>
                </div>
                
                <div class="card-number">•••• •••• •••• {{ card.card_number.slice(-4) }}</div>
                
                <div class="card-footer">
                  <div class="card-holder">
                    <span class="lbl">ผู้ถือบัตร</span>
                    <span class="val">{{ card.card_holder }}</span>
                  </div>
                  <div class="card-expiry">
                    <span class="lbl">หมดอายุ</span>
                    <span class="val">{{ card.expiry_date }}</span>
                  </div>
                </div>
                
                <div class="card-actions-overlay">
                  <span v-if="card.is_default === 1" class="card-default-badge"><i class="bi bi-check-circle-fill me-1"></i>ค่าเริ่มต้น</span>
                  <span v-else class="card-set-default-badge" @click="setPaymentMethodDefault(card)">ตั้งเป็นค่าเริ่มต้น</span>
                  
                  <button type="button" class="card-delete-btn" @click="deletePaymentMethod(card.id)" title="ลบบัตรนี้">
                    <i class="bi bi-trash3-fill"></i>
                  </button>
                </div>
              </div>
              
              <button class="add-address-btn" @click="openAddPayment" style="min-height: 160px; margin-top: 0;">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                เพิ่มช่องทางการชำระเงินใหม่
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
    <KakaFooter />


  <!-- Order Details Modal (Premium UI) -->
  <transition name="modal-fade">
    <div v-if="selectedOrder" class="order-modal-backdrop" @click.self="selectedOrder = null">
      <div class="order-modal-container glassmorphic-card">
        <!-- Header -->
        <div class="order-modal-header">
          <div class="header-info">
            <span class="badge-premium mb-2">
              <i class="bi bi-receipt text-info me-1 animate-pulse"></i>
              รายละเอียดใบสั่งซื้อสินค้า
            </span>
            <h3>รายการสั่งซื้อ #{{ selectedOrder.order_number }}</h3>
            <p class="order-date-time text-muted mt-1 mb-0">
              <i class="bi bi-clock me-1"></i>สั่งเมื่อ: {{ formatDate(selectedOrder.created_at) }}
            </p>
          </div>
          <button class="close-btn" @click="selectedOrder = null" aria-label="Close modal">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <!-- Body -->
        <div class="order-modal-body scrollbar-custom">
          <div class="row g-4">
            <!-- Left Column: Products List & Total Breakdown -->
            <div class="col-lg-7 border-end-lg">
              <div class="section-title-wrap mb-3">
                <h4 class="section-title"><i class="bi bi-box-seam me-2 text-primary"></i>สินค้าในคำสั่งซื้อ</h4>
              </div>
              <div class="order-details-items-list mb-4">
                <div v-for="item in selectedOrder.items" :key="item.id" class="details-item d-flex align-items-center gap-3 py-3 border-bottom">
                  <div class="details-item-icon-box d-flex align-items-center justify-content-center">
                    <i :class="['bi', getProductIcon(item.product_name)]"></i>
                  </div>
                  <div class="details-item-info flex-grow-1 min-w-0">
                    <h5 class="m-0 fw-semibold text-dark text-truncate" :title="item.product_name">{{ item.product_name }}</h5>
                    <span class="text-muted fs-9">ราคาต่อชิ้น: ฿{{ parseFloat(item.price).toLocaleString('th-TH') }}</span>
                  </div>
                  <div class="details-item-qty text-muted fs-8 px-2 py-1 bg-light rounded-3 flex-shrink-0">x{{ item.qty }}</div>
                  <div class="details-item-subtotal fw-bold text-dark text-end flex-shrink-0" style="min-width: 100px;">
                    ฿{{ (parseFloat(item.price) * item.qty).toLocaleString('th-TH') }}
                  </div>
                </div>
              </div>

              <!-- Price Summary Card -->
              <div class="price-summary-card p-3 rounded-4 bg-light border">
                <div class="d-flex justify-content-between mb-2 fs-8">
                  <span class="text-muted">ยอดรวมสินค้า ({{ selectedOrder.items ? selectedOrder.items.reduce((acc, i) => acc + i.qty, 0) : 0 }} ชิ้น)</span>
                  <span class="fw-semibold text-dark">฿{{ selectedOrder.items ? selectedOrder.items.reduce((acc, i) => acc + (parseFloat(i.price) * i.qty), 0).toLocaleString('th-TH', {minimumFractionDigits: 2}) : '0.00' }}</span>
                </div>
                <div v-if="parseFloat(selectedOrder.discount) > 0" class="d-flex justify-content-between mb-2 fs-8 text-danger">
                  <span>ส่วนลดโปรโมชั่น</span>
                  <span>-฿{{ parseFloat(selectedOrder.discount).toLocaleString('th-TH', {minimumFractionDigits: 2}) }}</span>
                </div>
                <div class="d-flex justify-content-between mb-2 fs-8">
                  <span class="text-muted">ค่าจัดส่งสินค้า</span>
                  <span class="fw-semibold text-success">ฟรีค่าจัดส่ง</span>
                </div>
                <hr class="my-2">
                <div class="d-flex justify-content-between align-items-center">
                  <span class="fw-bold text-dark fs-7">ยอดชำระสุทธิ:</span>
                  <span class="fw-extrabold text-primary fs-5">฿{{ parseFloat(selectedOrder.total_amount).toLocaleString('th-TH', {minimumFractionDigits: 2}) }}</span>
                </div>
              </div>
            </div>

            <!-- Right Column: Shipping & Payment Details -->
            <div class="col-lg-5">
              <!-- Status Badge Banner -->
              <div class="status-banner-card p-3 mb-4 rounded-4 text-center" :class="selectedOrder.status">
                <div class="fs-9 text-uppercase tracking-wider fw-bold mb-1 opacity-75">สถานะใบสั่งซื้อ</div>
                <div class="fs-6 fw-extrabold">{{ getStatusLabel(selectedOrder.status) }}</div>
              </div>

              <!-- Shipping Details -->
              <div class="details-section mb-4">
                <h4 class="section-title mb-3"><i class="bi bi-geo-alt me-2 text-primary"></i>ข้อมูลการจัดส่ง</h4>
                <div class="info-card p-3 rounded-4 border bg-white shadow-sm">
                  <div class="mb-2">
                    <span class="label text-muted d-block fs-9">ชื่อผู้รับ</span>
                    <span class="val fw-semibold text-dark fs-8">{{ selectedOrder.full_name }}</span>
                  </div>
                  <div class="mb-2">
                    <span class="label text-muted d-block fs-9">เบอร์โทรศัพท์</span>
                    <span class="val fw-semibold text-dark fs-8">{{ selectedOrder.phone }}</span>
                  </div>
                  <div class="mb-2">
                    <span class="label text-muted d-block fs-9">อีเมล</span>
                    <span class="val fw-semibold text-dark fs-8 text-break">{{ selectedOrder.email }}</span>
                  </div>
                  <div class="mb-0">
                    <span class="label text-muted d-block fs-9">วิธีรับสินค้า</span>
                    <span class="val fw-semibold text-dark fs-8">
                      {{ selectedOrder.shipping_method === 'pickup' ? `รับเองที่สาขา (${selectedOrder.pickup_branch})` : 'จัดส่งถึงบ้าน' }}
                    </span>
                  </div>
                  <div v-if="selectedOrder.shipping_method === 'delivery' && selectedOrder.address" class="mt-2 pt-2 border-top">
                    <span class="label text-muted d-block fs-9">ที่อยู่จัดส่ง</span>
                    <p class="val fw-medium text-secondary fs-9 mb-0 leading-normal">{{ selectedOrder.address }}</p>
                  </div>
                </div>
              </div>

              <!-- Payment Details -->
              <div class="details-section">
                <h4 class="section-title mb-3"><i class="bi bi-credit-card me-2 text-primary"></i>ข้อมูลการชำระเงิน</h4>
                <div class="info-card p-3 rounded-4 border bg-white shadow-sm">
                  <div class="mb-2">
                    <span class="label text-muted d-block fs-9">วิธีชำระเงิน</span>
                    <span class="val fw-semibold text-dark fs-8">
                      {{ selectedOrder.payment_method === 'qr' ? 'PromptPay (คิวอาร์โค้ด)' : selectedOrder.payment_method === 'card' ? 'บัตรเครดิต/เดบิต' : 'ผ่อนชำระผ่านบัตรเครดิต 0%' }}
                    </span>
                  </div>
                  <div v-if="selectedOrder.payment_bank" class="mb-2">
                    <span class="label text-muted d-block fs-9">ธนาคารผู้ให้บริการ</span>
                    <span class="val fw-semibold text-dark fs-8 text-uppercase">{{ selectedOrder.payment_bank }}</span>
                  </div>
                  <div v-if="selectedOrder.payment_term" class="mb-0">
                    <span class="label text-muted d-block fs-9">ระยะเวลาผ่อนชำระ</span>
                    <span class="val fw-semibold text-dark fs-8">{{ selectedOrder.payment_term }} เดือน (ดอกเบี้ย 0%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="order-modal-footer d-flex justify-content-between align-items-center">
          <button class="btn btn-outline-secondary btn-sm rounded-pill px-4" @click="printReceipt">
            <i class="bi bi-printer me-1"></i>พิมพ์ใบเสร็จ
          </button>
          <button class="btn btn-primary-custom btn-sm rounded-pill px-4 fw-bold" @click="selectedOrder = null">
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  </transition>

  <!-- Address Form Modal (Premium Glassmorphism) -->
  <transition name="modal-fade">
    <div v-if="showAddressModal" class="order-modal-backdrop" @click.self="showAddressModal = false">
      <div class="order-modal-container glassmorphic-card" style="max-width: 550px;">
        <div class="order-modal-header">
          <div class="header-info">
            <span class="badge-premium mb-2">
              <i class="bi bi-geo-alt-fill text-info me-1 animate-pulse"></i>
              {{ addressForm.id ? 'แก้ไขที่อยู่' : 'เพิ่มที่อยู่ใหม่' }}
            </span>
            <h3>{{ addressForm.type === 'shipping' ? 'ที่อยู่สำหรับจัดส่ง (Shipping)' : 'ที่อยู่สำหรับออกใบกำกับภาษี (Billing)' }}</h3>
          </div>
          <button class="close-btn" @click="showAddressModal = false">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <form @submit.prevent="saveAddress">
          <div class="order-modal-body scrollbar-custom">
            <div class="row g-3">
              <div class="col-12">
                <label class="form-label fw-semibold text-secondary fs-8">{{ addressForm.type === 'shipping' ? 'ชื่อ-นามสกุล ผู้รับ' : 'ชื่อบริษัท หรือชื่อผู้เสียภาษี' }}</label>
                <input type="text" v-model="addressForm.fullName" class="form-control rounded-3" placeholder="ระบุชื่อเต็ม" required />
              </div>
              
              <div class="col-12">
                <label class="form-label fw-semibold text-secondary fs-8">เบอร์โทรศัพท์ผู้ติดต่อ</label>
                <input type="text" v-model="addressForm.phone" class="form-control rounded-3" placeholder="เช่น 0812345678" required />
              </div>

              <div class="col-12" v-if="addressForm.type === 'billing'">
                <label class="form-label fw-semibold text-secondary fs-8">เลขประจำตัวผู้เสียภาษี (Tax ID)</label>
                <input type="text" v-model="addressForm.taxId" class="form-control rounded-3" placeholder="เลขประจำตัวผู้เสียภาษี 13 หลัก" required />
              </div>

              <div class="col-12">
                <label class="form-label fw-semibold text-secondary fs-8">รายละเอียดที่อยู่</label>
                <textarea v-model="addressForm.addressLine" class="form-control rounded-3" rows="4" placeholder="ระบุบ้านเลขที่, ถนน, แขวง, เขต, จังหวัด และรหัสไปรษณีย์" required></textarea>
              </div>

              <div class="col-12">
                <div class="form-check form-switch mt-2">
                  <input class="form-check-input" type="checkbox" id="defaultAddressCheck" v-model="addressForm.isDefault">
                  <label class="form-check-label fw-semibold text-dark fs-8" for="defaultAddressCheck">
                    ตั้งที่อยู่นี้เป็นค่าเริ่มต้น
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div class="order-modal-footer d-flex justify-content-end gap-2">
            <button type="button" class="btn btn-outline-secondary btn-sm rounded-pill px-4" @click="showAddressModal = false">
              ยกเลิก
            </button>
            <button type="submit" class="btn btn-primary-custom btn-sm rounded-pill px-4 fw-bold">
              บันทึกข้อมูล
            </button>
          </div>
        </form>
      </div>
    </div>
  </transition>

  <!-- Add Payment Method Modal (Premium Dynamic Card visualizer!) -->
  <transition name="modal-fade">
    <div v-if="showPaymentModal" class="order-modal-backdrop" @click.self="showPaymentModal = false">
      <div class="order-modal-container glassmorphic-card" style="max-width: 550px;">
        <div class="order-modal-header">
          <div class="header-info">
            <span class="badge-premium mb-2">
              <i class="bi bi-credit-card-2-front-fill text-info me-1 animate-pulse"></i>
              เพิ่มช่องทางชำระเงินใหม่
            </span>
            <h3>ข้อมูลบัตรเครดิต / เดบิต</h3>
          </div>
          <button class="close-btn" @click="showPaymentModal = false">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <form @submit.prevent="savePaymentMethod">
          <div class="order-modal-body scrollbar-custom d-flex flex-column align-items-center gap-4">
            <!-- Dynamic Visual Card Representation -->
            <div :class="['payment-card visual-card-preview premium-card-glow', paymentForm.cardProvider.toLowerCase()]" style="width: 100%; max-width: 380px;">
              <div class="card-top-row d-flex justify-content-between align-items-center">
                <div class="card-chip"></div>
                <span class="card-provider-brand fw-extrabold text-uppercase tracking-wider fs-7">{{ paymentForm.cardProvider }}</span>
              </div>
              <div class="card-number font-monospace my-3 text-center" style="font-size: 1.35rem; letter-spacing: 0.12em;">{{ visualCardNumber }}</div>
              <div class="card-footer">
                <div class="card-holder">
                  <span class="lbl">ผู้ถือบัตร</span>
                  <span class="val text-truncate" style="max-width: 220px;">{{ visualCardHolder }}</span>
                </div>
                <div class="card-expiry">
                  <span class="lbl">หมดอายุ</span>
                  <span class="val">{{ visualExpiryDate }}</span>
                </div>
              </div>
            </div>

            <!-- Form Fields -->
            <div class="row g-3 w-100">
              <div class="col-12">
                <label class="form-label fw-semibold text-secondary fs-8">หมายเลขบัตร (Card Number)</label>
                <input 
                  type="text" 
                  class="form-control rounded-3 font-monospace" 
                  placeholder="xxxx xxxx xxxx xxxx" 
                  v-model="paymentForm.cardNumber"
                  @input="onCardNumberInput"
                  maxlength="19"
                  required 
                />
              </div>

              <div class="col-md-6 col-12">
                <label class="form-label fw-semibold text-secondary fs-8">ชื่อผู้ถือบัตร (Card Holder Name)</label>
                <input 
                  type="text" 
                  class="form-control rounded-3 text-uppercase" 
                  placeholder="เช่น PHASAWAT BUACHIN" 
                  v-model="paymentForm.cardHolder"
                  required 
                />
              </div>

              <div class="col-md-6 col-12">
                <label class="form-label fw-semibold text-secondary fs-8">หมดอายุ (Expiry Date)</label>
                <input 
                  type="text" 
                  class="form-control rounded-3 font-monospace" 
                  placeholder="MM/YY" 
                  v-model="paymentForm.expiryDate"
                  maxlength="5"
                  required 
                />
              </div>

              <div class="col-12">
                <label class="form-label fw-semibold text-secondary fs-8">ผู้ให้บริการบัตร (Card Provider)</label>
                <select class="form-select rounded-3" v-model="paymentForm.cardProvider">
                  <option value="Visa">Visa</option>
                  <option value="Mastercard">Mastercard</option>
                  <option value="JCB">JCB</option>
                  <option value="American Express">American Express</option>
                </select>
              </div>

              <div class="col-12">
                <div class="form-check form-switch mt-2">
                  <input class="form-check-input" type="checkbox" id="defaultPaymentCheck" v-model="paymentForm.isDefault">
                  <label class="form-check-label fw-semibold text-dark fs-8" for="defaultPaymentCheck">
                    ตั้งช่องทางชำระเงินนี้เป็นค่าเริ่มต้น
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div class="order-modal-footer d-flex justify-content-end gap-2">
            <button type="button" class="btn btn-outline-secondary btn-sm rounded-pill px-4" @click="showPaymentModal = false">
              ยกเลิก
            </button>
            <button type="submit" class="btn btn-primary-custom btn-sm rounded-pill px-4 fw-bold">
              บันทึกข้อมูลบัตร
            </button>
          </div>
        </form>
      </div>
    </div>
  </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import KakaNavbar from './KakaNavbar.vue';
import KakaFooter from './KakaFooter.vue';

const activeTab = ref('profile');
const isEditing = ref(false);

const orders = ref([]);
const selectedOrder = ref(null);

// ==========================================
// --- สถานะจัดการที่อยู่และช่องทางชำระเงิน (ADDRESS & PAYMENT METHOD CRUD STATE) ---
// ==========================================
const addresses = ref([]);
const paymentMethods = ref([]);

const showAddressModal = ref(false);
const showPaymentModal = ref(false);

const addressForm = ref({
  id: null,
  type: 'shipping',
  fullName: '',
  phone: '',
  addressLine: '',
  taxId: '',
  isDefault: false
});

const paymentForm = ref({
  id: null,
  cardNumber: '',
  cardHolder: '',
  expiryDate: '',
  cardProvider: 'Visa',
  isDefault: false
});

const fetchAddresses = async () => {
  const email = userProfile.value.email || localStorage.getItem('userEmail') || 'phswatphothisri504@gmail.com';
  try {
    const response = await axios.get(`/api/addresses?email=${encodeURIComponent(email)}`);
    if (response.data.success) {
      addresses.value = response.data.addresses;
    }
  } catch (error) {
    console.error('Error fetching addresses:', error);
  }
};

const fetchPaymentMethods = async () => {
  const email = userProfile.value.email || localStorage.getItem('userEmail') || 'phswatphothisri504@gmail.com';
  try {
    const response = await axios.get(`/api/payment-methods?email=${encodeURIComponent(email)}`);
    if (response.data.success) {
      paymentMethods.value = response.data.paymentMethods;
    }
  } catch (error) {
    console.error('Error fetching payment methods:', error);
  }
};

const openAddAddress = (type) => {
  addressForm.value = {
    id: null,
    type: type,
    fullName: type === 'shipping' ? `${userProfile.value.firstName} ${userProfile.value.lastName}`.trim() : '',
    phone: userProfile.value.phone || '',
    addressLine: '',
    taxId: '',
    isDefault: false
  };
  showAddressModal.value = true;
};

const openEditAddress = (address) => {
  addressForm.value = {
    id: address.id,
    type: address.type,
    fullName: address.full_name,
    phone: address.phone,
    addressLine: address.address_line,
    taxId: address.tax_id || '',
    isDefault: address.is_default === 1
  };
  showAddressModal.value = true;
};

const saveAddress = async () => {
  const email = userProfile.value.email || localStorage.getItem('userEmail') || 'phswatphothisri504@gmail.com';
  try {
    const payload = {
      id: addressForm.value.id,
      userEmail: email,
      type: addressForm.value.type,
      fullName: addressForm.value.fullName,
      phone: addressForm.value.phone,
      addressLine: addressForm.value.addressLine,
      taxId: addressForm.value.type === 'billing' ? addressForm.value.taxId : null,
      isDefault: addressForm.value.isDefault
    };

    const response = await axios.post('/api/addresses', payload);
    if (response.data.success) {
      showAddressModal.value = false;
      await fetchAddresses();
    } else {
      alert('เกิดข้อผิดพลาดในการบันทึกที่อยู่');
    }
  } catch (error) {
    console.error('Error saving address:', error);
    alert('เกิดข้อผิดพลาดในการบันทึกที่อยู่');
  }
};

const deleteAddress = async (id) => {
  if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบที่อยู่นี้?')) return;
  try {
    const response = await axios.delete(`/api/addresses/${id}`);
    if (response.data.success) {
      await fetchAddresses();
    }
  } catch (error) {
    console.error('Error deleting address:', error);
  }
};

const setAddressDefault = async (address) => {
  try {
    const response = await axios.put(`/api/addresses/${address.id}/default`);
    if (response.data.success) {
      await fetchAddresses();
    }
  } catch (error) {
    console.error('Error setting default address:', error);
  }
};

const openAddPayment = () => {
  paymentForm.value = {
    id: null,
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cardProvider: 'Visa',
    isDefault: false
  };
  showPaymentModal.value = true;
};

const savePaymentMethod = async () => {
  const email = userProfile.value.email || localStorage.getItem('userEmail') || 'phswatphothisri504@gmail.com';
  
  if (!paymentForm.value.cardNumber || !paymentForm.value.cardHolder || !paymentForm.value.expiryDate) {
    alert('กรุณากรอกข้อมูลบัตรให้ครบถ้วน!');
    return;
  }
  
  try {
    const payload = {
      userEmail: email,
      cardNumber: paymentForm.value.cardNumber,
      cardHolder: paymentForm.value.cardHolder,
      expiryDate: paymentForm.value.expiryDate,
      cardProvider: paymentForm.value.cardProvider,
      isDefault: paymentForm.value.isDefault
    };

    const response = await axios.post('/api/payment-methods', payload);
    if (response.data.success) {
      showPaymentModal.value = false;
      await fetchPaymentMethods();
    } else {
      alert('เกิดข้อผิดพลาดในการบันทึกช่องทางชำระเงิน');
    }
  } catch (error) {
    console.error('Error saving payment method:', error);
    alert('เกิดข้อผิดพลาดในการบันทึกช่องทางชำระเงิน');
  }
};

const deletePaymentMethod = async (id) => {
  if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบช่องชำระเงินนี้?')) return;
  try {
    const response = await axios.delete(`/api/payment-methods/${id}`);
    if (response.data.success) {
      await fetchPaymentMethods();
    }
  } catch (error) {
    console.error('Error deleting payment method:', error);
  }
};

const setPaymentMethodDefault = async (card) => {
  try {
    const response = await axios.put(`/api/payment-methods/${card.id}/default`);
    if (response.data.success) {
      await fetchPaymentMethods();
    }
  } catch (error) {
    console.error('Error setting default payment method:', error);
  }
};

const visualCardNumber = computed(() => {
  const num = paymentForm.value.cardNumber.replace(/\s+/g, '');
  if (!num) return '•••• •••• •••• ••••';
  const padded = num.padEnd(16, '•');
  return padded.replace(/(.{4})/g, '$1 ').trim();
});

const visualExpiryDate = computed(() => {
  return paymentForm.value.expiryDate || 'MM/YY';
});

const visualCardHolder = computed(() => {
  return paymentForm.value.cardHolder.toUpperCase() || 'CARD HOLDER';
});

const detectCardProvider = (num) => {
  const clean = num.replace(/\s+/g, '');
  if (clean.startsWith('4')) return 'Visa';
  if (clean.startsWith('5')) return 'Mastercard';
  if (clean.startsWith('3')) return 'American Express';
  if (clean.startsWith('6')) return 'JCB';
  return null;
};

const onCardNumberInput = (event) => {
  let val = event.target.value.replace(/\D/g, '');
  val = val.substring(0, 16);
  paymentForm.value.cardNumber = val.replace(/(.{4})/g, '$1 ').trim();
  
  const detected = detectCardProvider(val);
  if (detected) {
    paymentForm.value.cardProvider = detected;
  }
};

const viewOrderDetails = (order) => {
  selectedOrder.value = order;
};

const printReceipt = () => {
  window.print();
};

const stats = computed(() => {
  const counts = { completed: 0, shipped: 0, processing: 0, pending: 0 };
  orders.value.forEach(order => {
    if (order.status === 'completed') counts.completed++;
    else if (order.status === 'shipped') counts.shipped++;
    else if (order.status === 'processing') counts.processing++;
    else if (order.status === 'pending') counts.pending++;
  });
  return counts;
});

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

const getStatusLabel = (status) => {
  const labels = {
    'pending': 'รอชำระเงิน',
    'processing': 'รอดำเนินการ',
    'shipped': 'จัดส่งแล้ว',
    'completed': 'เสร็จสิ้น'
  };
  return labels[status] || status;
};

const getStatusClass = (status) => {
  const classes = {
    'pending': 'pending',
    'processing': 'processing',
    'shipped': 'shipped',
    'completed': 'completed'
  };
  return classes[status] || 'pending';
};

const getProductIcon = (name = '') => {
  const n = name.toLowerCase()
  if (n.includes('cpu') || n.includes('processor') || n.includes('i5') || n.includes('i7') || n.includes('i9') || n.includes('ryzen')) return 'bi-cpu'
  if (n.includes('gpu') || n.includes('rtx') || n.includes('gtx') || n.includes('geforce') || n.includes('radeon') || n.includes('strix')) return 'bi-gpu-card'
  if (n.includes('ram') || n.includes('ddr') || n.includes('dominator') || n.includes('memory')) return 'bi-memory'
  if (n.includes('ssd') || n.includes('nvme') || n.includes('m.2') || n.includes('990 pro')) return 'bi-device-ssd'
  if (n.includes('hdd') || n.includes('hard')) return 'bi-hdd'
  if (n.includes('motherboard') || n.includes('mainboard') || n.includes('maximus') || n.includes('z790') || n.includes('h610')) return 'bi-layout-three-columns'
  if (n.includes('psu') || n.includes('power') || n.includes('modular') || n.includes('rm1000') || n.includes('550w') || n.includes('80+')) return 'bi-plug'
  if (n.includes('case') || n.includes('o11') || n.includes('dynamic')) return 'bi-box'
  if (n.includes('monitor') || n.includes('oled') || n.includes('display')) return 'bi-display'
  if (n.includes('mouse') || n.includes('superlight')) return 'bi-mouse'
  if (n.includes('keyboard') || n.includes('azoth')) return 'bi-keyboard'
  if (n.includes('pc set') || n.includes('set-') || n.includes('intel') || n.includes('amd')) return 'bi-pc-display-horizontal'
  return 'bi-box-seam'
};

const userProfile = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  gender: 'male',
  birthday: '',
  lineId: '',
  facebook: ''
});

const editProfileData = ref({
  firstName: '',
  lastName: '',
  phone: '',
  gender: 'male',
  birthday: '',
  lineId: '',
  facebook: ''
});

const tabGroups = [
  {
    title: 'รายการ',
    items: [
      { id: 'orders', label: 'คำสั่งซื้อ', icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>` },
      { id: 'favorites', label: 'สินค้าที่ถูกใจ', icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>` }
    ]
  },
  {
    title: 'บัญชี',
    items: [
      { id: 'profile', label: 'ข้อมูลส่วนตัว', icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>` },
      { id: 'shipping_address', label: 'ที่อยู่สำหรับจัดส่ง', icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>` },
      { id: 'billing_address', label: 'ที่อยู่สำหรับออกใบกำกับภาษี', icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>` },
      { id: 'payment', label: 'ช่องทางชำระเงิน', icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>` }
    ]
  }
];

const startEdit = () => {
  editProfileData.value = {
    firstName: userProfile.value.firstName || '',
    lastName: userProfile.value.lastName || '',
    phone: userProfile.value.phone || '',
    gender: userProfile.value.gender || 'male',
    birthday: userProfile.value.birthday || '',
    lineId: userProfile.value.lineId || '',
    facebook: userProfile.value.facebook || ''
  };
  isEditing.value = true;
};

const cancelEdit = () => {
  isEditing.value = false;
};

const formatBirthday = (dateStr) => {
  if (!dateStr) return '-';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    // Return formatted date
    return `${parts[2]} / ${parts[1]} / ${parts[0]}`;
  }
  return dateStr;
};

onMounted(async () => {
  const email = localStorage.getItem('userEmail') || 'phswatphothisri504@gmail.com';
  userProfile.value.email = email;

  // พยายามโหลดข้อมูลจากฐานข้อมูลก่อนเป็นอันดับแรก
  let profileLoaded = false;
  try {
    const response = await axios.get(`/api/profile?email=${encodeURIComponent(email)}`);
    if (response.data.success && response.data.profile) {
      const p = response.data.profile;
      userProfile.value.firstName = p.firstName || '';
      userProfile.value.lastName = p.lastName || '';
      userProfile.value.phone = p.phone || '';
      userProfile.value.gender = p.gender || 'male';
      userProfile.value.lineId = p.lineId || '';
      userProfile.value.facebook = p.facebook || '';
      if (p.birthday) {
        userProfile.value.birthday = p.birthday.substring(0, 10);
      }
      // บันทึกข้อมูลลงใน Local Storage เพื่อแคชไว้ใช้งาน
      localStorage.setItem(`profile_${email}`, JSON.stringify(userProfile.value));
      profileLoaded = true;
    }
  } catch (error) {
    console.warn('Could not fetch profile from server, trying local storage fallback:', error);
  }

  // หากโหลดจากฐานข้อมูลไม่สำเร็จ ให้ดึงข้อมูลสำรองจาก Local Storage แทน
  if (!profileLoaded) {
    const savedProfile = localStorage.getItem(`profile_${email}`);
    if (savedProfile) {
      try {
        const p = JSON.parse(savedProfile);
        userProfile.value.firstName = p.firstName || '';
        userProfile.value.lastName = p.lastName || '';
        userProfile.value.phone = p.phone || '';
        userProfile.value.gender = p.gender || 'male';
        userProfile.value.birthday = p.birthday || '';
        userProfile.value.lineId = p.lineId || '';
        userProfile.value.facebook = p.facebook || '';
      } catch (e) {
        console.error('Error parsing cached profile:', e);
      }
    }
  }

  // โหลดประวัติคำสั่งซื้อจากฐานข้อมูลสำหรับอีเมลผู้ใช้นี้
  try {
    const response = await axios.get(`/api/orders?email=${encodeURIComponent(email)}`);
    if (response.data.success && response.data.orders) {
      orders.value = response.data.orders;
    }
  } catch (error) {
    console.warn('Could not fetch orders from server:', error);
  }

  // โหลดข้อมูลที่อยู่และช่องทางการชำระเงิน
  await fetchAddresses();
  await fetchPaymentMethods();
});

const saveProfile = async () => {
  const email = userProfile.value.email || localStorage.getItem('userEmail') || 'phswatphothisri504@gmail.com';
  
  // บันทึกข้อมูลลงฝั่งเครื่องผู้ใช้งาน (Local) ก่อน
  userProfile.value.firstName = editProfileData.value.firstName;
  userProfile.value.lastName = editProfileData.value.lastName;
  userProfile.value.phone = editProfileData.value.phone;
  userProfile.value.gender = editProfileData.value.gender;
  userProfile.value.birthday = editProfileData.value.birthday;
  userProfile.value.lineId = editProfileData.value.lineId;
  userProfile.value.facebook = editProfileData.value.facebook;

  localStorage.setItem(`profile_${email}`, JSON.stringify(userProfile.value));

  try {
    const response = await axios.post('/api/profile', {
      email,
      firstName: userProfile.value.firstName,
      lastName: userProfile.value.lastName,
      phone: userProfile.value.phone,
      gender: userProfile.value.gender,
      birthday: userProfile.value.birthday,
      lineId: userProfile.value.lineId,
      facebook: userProfile.value.facebook
    });

    if (response.data.success) {
      alert('บันทึกข้อมูลเรียบร้อยแล้ว!');
      isEditing.value = false;
    } else {
      alert('บันทึกข้อมูลสำเร็จในเบราว์เซอร์!');
      isEditing.value = false;
    }
  } catch (error) {
    console.error('Error updating profile on backend:', error);
    alert('บันทึกข้อมูลสำเร็จในเบราว์เซอร์แล้ว!');
    isEditing.value = false;
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Sans+Thai:wght@300;400;500;600;700&display=swap');

.page-wrapper {
  min-height: 100vh;
  background-color: #f8fafc;
}

.profile-container {
  min-height: calc(100vh - 76px);
  background-color: #f8fafc;
  font-family: 'Inter', 'Noto Sans Thai', sans-serif;
  color: #1e293b;
  padding: 3rem 2rem;
  display: flex;
  justify-content: center;
}

.profile-layout {
  width: 100%;
  max-width: 1200px;
  display: flex;
  gap: 2.5rem;
}

/* Sidebar Styles */
.profile-sidebar {
  width: 280px;
  flex-shrink: 0;
  background-color: #ffffff;
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  height: fit-content;
}

.sidebar-menu {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.menu-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.menu-group-title {
  font-size: 0.75rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.5rem 0.75rem;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  color: #64748b;
  font-size: 0.95rem;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-align: left;
  font-family: inherit;
}

.menu-item:hover {
  background-color: #f8fafc;
  color: #1e293b;
}

.menu-item.active {
  background-color: #f0f9ff;
  color: #0ea5e9;
  font-weight: 600;
}

.menu-item.active :deep(svg) {
  stroke: #0ea5e9;
  color: #0ea5e9;
}

/* Main Content Styles */
.profile-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.tab-pane {
  display: flex;
  flex-direction: column;
  gap: 2.25rem;
  width: 100%;
}

.fade-in {
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Tab Header styles */
.pane-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0;
}

.pane-title-wrap {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.title-icon {
  color: #0ea5e9;
  display: flex;
  align-items: center;
}

.pane-title-wrap h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.btn-edit {
  background-color: #f0f9ff;
  color: #0ea5e9;
  border: none;
  border-radius: 8px;
  padding: 0.6rem 1.2rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s ease;
}

.btn-edit:hover {
  background-color: #bae6fd;
  transform: translateY(-1px);
}

.pane-header {
  margin-bottom: 0;
}

.pane-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: #0f172a;
}

.pane-header p {
  color: #64748b;
  margin: 0;
  font-size: 0.95rem;
}

/* Profile summary card row */
.profile-summary-row {
  display: flex;
  gap: 1.5rem;
  width: 100%;
}

.avatar-card {
  flex: 2;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
}

.avatar-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  border: 1px solid #cbd5e1;
}

.avatar-circle svg {
  width: 32px;
  height: 32px;
}

.avatar-name-wrap {
  display: flex;
  flex-direction: column;
}

.avatar-name {
  font-size: 1.15rem;
  font-weight: 600;
  color: #1e293b;
}

.stats-grid {
  flex: 3;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.stat-box {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 1rem 0.5rem;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
  transition: transform 0.2s ease;
}

.stat-box:hover {
  transform: translateY(-2px);
}

.stat-num {
  font-size: 1.75rem;
  font-weight: 700;
  color: #0ea5e9;
  line-height: 1;
}

.stat-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: #64748b;
  margin-top: 0.5rem;
}

/* Details and forms */
.details-card,
.edit-card {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem 2.5rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #94a3b8;
}

.detail-val {
  font-size: 0.95rem;
  font-weight: 500;
  color: #334155;
  word-break: break-all;
}

/* Edit form */
.edit-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.edit-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #475569;
}

.form-group input,
.form-group select {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #1e293b;
  font-size: 0.95rem;
  font-family: inherit;
  transition: all 0.2s ease;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #cbd5e1;
  background-color: #ffffff;
  box-shadow: 0 0 0 3px rgba(148, 163, 184, 0.08);
}

.form-group input.readonly {
  background-color: #f1f5f9;
  color: #94a3b8;
  cursor: not-allowed;
}

.edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  border-top: 1px solid #f1f5f9;
  padding-top: 1.5rem;
}

.btn-cancel {
  background-color: #f1f5f9;
  color: #475569;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 2rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: background-color 0.2s;
}

.btn-cancel:hover {
  background-color: #e2e8f0;
}

.btn-submit {
  background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%);
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 2rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;
}

.btn-submit:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.2);
}

/* Address List & Cards */
.address-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.address-card {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  position: relative;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
}

.address-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.badge {
  background-color: #f0f9ff;
  color: #0284c7;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid #bae6fd;
}

.btn-icon {
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 0.4rem;
  border-radius: 6px;
  transition: all 0.2s;
}

.btn-icon:hover {
  background-color: #f1f5f9;
  color: #1e293b;
}

.address-card h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #0f172a;
}

.address-card p {
  margin: 0 0 0.25rem 0;
  color: #64748b;
  font-size: 0.9rem;
  line-height: 1.5;
}

.add-address-btn {
  background-color: transparent;
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: #64748b;
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  min-height: 150px;
  transition: all 0.2s ease;
}

.add-address-btn:hover {
  border-color: #0ea5e9;
  color: #0ea5e9;
  background-color: #f0f9ff;
}

/* Premium Payment Card */
.payment-card {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border-radius: 16px;
  padding: 1.5rem;
  color: #ffffff;
  position: relative;
  min-height: 160px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.card-chip {
  width: 40px;
  height: 30px;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  border-radius: 6px;
}

.card-number {
  font-size: 1.25rem;
  letter-spacing: 0.15em;
  margin: 1.5rem 0;
  font-family: monospace;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.card-holder,
.card-expiry {
  display: flex;
  flex-direction: column;
}

.lbl {
  font-size: 0.65rem;
  color: #94a3b8;
  text-transform: uppercase;
}

.val {
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.05em;
}

/* Orders List & Card */
.order-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.order-card {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
}

.order-header {
  padding: 1rem 1.5rem;
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-id {
  font-weight: 600;
  margin-right: 1rem;
  color: #0f172a;
  font-size: 0.95rem;
}

.order-date {
  color: #94a3b8;
  font-size: 0.85rem;
}

.status.delivered {
  color: #10b981;
  background-color: rgba(16, 185, 129, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.order-items {
  padding: 1.5rem;
}

.item {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.item-img {
  width: 65px;
  height: 65px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.prod-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details {
  flex-grow: 1;
}

.item-details h4 {
  margin: 0 0 0.25rem 0;
  font-weight: 600;
  color: #1e293b;
  font-size: 0.95rem;
}

.item-details p {
  margin: 0;
  color: #64748b;
  font-size: 0.85rem;
}

.item-price {
  font-weight: 700;
  color: #0f172a;
}

.order-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
  background-color: #f8fafc;
}

.total-label {
  color: #64748b;
  font-size: 0.9rem;
}

.total-price {
  font-size: 1.15rem;
  font-weight: 700;
  color: #2563eb;
}

/* Empty Favorites */
.empty-favorites {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  color: #94a3b8;
  gap: 1rem;
}

.empty-favorites p {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 500;
}

/* Responsive */
@media (max-width: 1024px) {
  .details-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 900px) {
  .profile-layout {
    flex-direction: column;
  }
  .profile-sidebar {
    width: 100%;
  }
  .profile-summary-row {
    flex-direction: column;
  }
  .edit-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .details-grid {
    grid-template-columns: repeat(1, 1fr);
  }
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Order Status Card Badges styling */
.status.pending {
  color: #d97706;
  background-color: rgba(245, 158, 11, 0.1);
}
.status.processing {
  color: #0284c7;
  background-color: rgba(14, 165, 233, 0.1);
}
.status.shipped {
  color: #7c3aed;
  background-color: rgba(139, 92, 246, 0.1);
}
.status.completed {
  color: #10b981;
  background-color: rgba(16, 185, 129, 0.1);
}

.btn-view-details {
  background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%);
  color: #ffffff;
  border: none;
  border-radius: 20px;
  padding: 0.45rem 1.15rem;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  transition: all 0.2s ease;
  font-family: inherit;
}

.btn-view-details i {
  font-size: 0.9rem;
}

.btn-view-details:hover {
  transform: translateY(-1.5px);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
  filter: brightness(1.05);
}

/* Order Details Modal Styles */
.order-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(8px);
  z-index: 1050;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5rem;
}

.order-modal-container {
  background-color: rgba(255, 255, 255, 0.98);
  border: 1px solid rgba(226, 232, 240, 0.85);
  border-radius: 20px;
  width: 100%;
  max-width: 850px;
  max-height: 90vh;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 40px rgba(0, 0, 0, 0.02);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: modalScaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes modalScaleUp {
  from { opacity: 0; transform: scale(0.96) translateY(12px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.order-modal-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.order-modal-header h3 {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 700;
  color: #0f172a;
}

.badge-premium {
  background-color: #f0f9ff;
  color: #0284c7;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  border: 1px solid #bae6fd;
  display: inline-flex;
  align-items: center;
}

.order-modal-header .close-btn {
  background: #f1f5f9;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
}

.order-modal-header .close-btn:hover {
  background-color: #cbd5e1;
  color: #0f172a;
  transform: rotate(90deg);
}

.order-modal-body {
  padding: 2rem;
  overflow-y: auto;
  flex: 1 1 auto;
  min-height: 0;
}

.section-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

/* Scrollbar Customizer */
.scrollbar-custom::-webkit-scrollbar {
  width: 6px;
}
.scrollbar-custom::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-custom::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 20px;
}

/* Items list inside details */
.order-details-items-list {
  display: flex;
  flex-direction: column;
}

.details-item {
  transition: background-color 0.2s ease;
}

.details-item:hover {
  background-color: #f8fafc;
}

.details-item-icon-box {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #64748b;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.min-w-0 {
  min-width: 0;
}

.details-item-info h5 {
  font-size: 0.9rem;
  margin-bottom: 0.2rem;
  font-weight: 600;
}

/* Status Banner styling */
.status-banner-card {
  border-radius: 12px;
  border: 1px solid transparent;
}

.status-banner-card.pending {
  background-color: rgba(245, 158, 11, 0.08);
  border-color: rgba(245, 158, 11, 0.2);
  color: #d97706;
}

.status-banner-card.processing {
  background-color: rgba(14, 165, 233, 0.08);
  border-color: rgba(14, 165, 233, 0.2);
  color: #0284c7;
}

.status-banner-card.shipped {
  background-color: rgba(139, 92, 246, 0.08);
  border-color: rgba(139, 92, 246, 0.2);
  color: #7c3aed;
}

.status-banner-card.completed {
  background-color: rgba(16, 185, 129, 0.08);
  border-color: rgba(16, 185, 129, 0.2);
  color: #059669;
}

.info-card {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
}

.info-card .label {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  color: #94a3b8;
}

.info-card .val {
  font-size: 0.85rem;
  color: #334155;
}

.order-modal-footer {
  padding: 1.25rem 2rem;
  background-color: #f8fafc;
  border-top: 1px solid #e2e8f0;
}

/* Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* Responsive grid tweak for details column border */
@media (min-width: 992px) {
  .border-end-lg {
    border-right: 1px solid #e2e8f0;
    padding-right: 2rem;
  }
}
@media (max-width: 991px) {
  .border-end-lg {
    border-right: none;
    padding-right: 0;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 2rem;
  }
}

/* Custom Styles for Address Default Action and Delete */
.badge-set-default {
  background-color: #f1f5f9;
  color: #64748b;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid #cbd5e1;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-block;
}

.badge-set-default:hover {
  background-color: #e2e8f0;
  color: #1e293b;
  border-color: #94a3b8;
}

.btn-delete {
  transition: all 0.2s ease;
}

.btn-delete:hover {
  background-color: #fef2f2;
}

/* Premium Credit Card Custom Themes */
.payment-card {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  overflow: hidden;
  position: relative;
}

.payment-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.payment-card.visa {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #1e40af 100%);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.payment-card.mastercard {
  background: linear-gradient(135deg, #2a2a2a 0%, #ff5f00 60%, #cc0000 100%);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.payment-card.jcb {
  background: linear-gradient(135deg, #052f5f 0%, #0077b6 40%, #0096c7 100%);
}

.payment-card.american\ express {
  background: linear-gradient(135deg, #374151 0%, #4b5563 50%, #1f2937 100%);
}

.card-top-row {
  width: 100%;
}

.card-provider-brand {
  font-family: 'Inter', sans-serif;
  letter-spacing: 0.05em;
  opacity: 0.9;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* Card Actions Overlay on Hover */
.card-actions-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(4px);
  opacity: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
  transition: opacity 0.3s ease;
  border-radius: 16px;
  padding: 1.5rem;
}

.payment-card:hover .card-actions-overlay {
  opacity: 1;
}

.card-default-badge {
  color: #10b981;
  background-color: rgba(16, 185, 129, 0.15);
  border: 1px solid #10b981;
  padding: 0.35rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
}

.card-set-default-badge {
  color: #ffffff;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.4);
  padding: 0.35rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.card-set-default-badge:hover {
  background-color: rgba(255, 255, 255, 0.2);
  border-color: #ffffff;
}

.card-delete-btn {
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid #ef4444;
  color: #f87171;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.card-delete-btn:hover {
  background-color: #ef4444;
  color: #ffffff;
  transform: scale(1.1);
}

.visual-card-preview {
  height: 200px;
  min-height: 200px !important;
  border-radius: 20px !important;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.15) !important;
  padding: 1.75rem !important;
}

/* Form check inputs scale */
.form-check-input:checked {
  background-color: #0ea5e9;
  border-color: #0ea5e9;
}

/* Print Styles */
@media print {
  body * {
    visibility: hidden;
  }
  
  .order-modal-backdrop, .order-modal-backdrop * {
    visibility: visible;
  }
  
  .order-modal-backdrop {
    position: absolute !important;
    left: 0 !important;
    top: 0 !important;
    width: 100% !important;
    padding: 0 !important;
    background: none !important;
    backdrop-filter: none !important;
    align-items: flex-start !important;
  }
  
  .order-modal-container {
    max-width: 100% !important;
    width: 100% !important;
    border: none !important;
    box-shadow: none !important;
    max-height: none !important;
    border-radius: 0 !important;
    animation: none !important;
  }
  
  .order-modal-body {
    overflow: visible !important;
    height: auto !important;
    padding: 1rem 0 !important;
  }
  
  .order-modal-header {
    border-bottom: 2px solid #000 !important;
    padding: 1rem 0 !important;
  }
  
  .order-modal-header .close-btn,
  .order-modal-footer {
    display: none !important;
  }
  
  .col-lg-7, .col-lg-5 {
    width: 100% !important;
  }
  
  .border-end-lg {
    border-right: none !important;
    padding-right: 0 !important;
  }
}
</style>
