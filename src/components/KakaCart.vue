<template>
  <div class="page-wrapper">
    <!-- Glowing background elements -->
    <div class="glowing-bg">
      <div class="blob blob-blue"></div>
      <div class="blob blob-cyan"></div>
    </div>

    <!-- Navigation Bar -->
    <KakaNavbar />

    <div class="container py-5 content-container">
      <!-- Step Indicator -->
      <div class="checkout-steps-wrapper mb-5 animate-fade-in">
        <div class="d-flex justify-content-center align-items-center gap-2 gap-md-4">
          <!-- Step 1: Cart -->
          <div 
            class="step-pill" 
            :class="{ active: currentStep === 1, completed: currentStep > 1 }"
            @click="goToStep(1)"
          >
            <span class="step-num">1.</span> ตะกร้าสินค้า
          </div>
          <div class="step-line" :class="{ active: currentStep >= 2 }"></div>
          
          <!-- Step 2: Shipping -->
          <div 
            class="step-pill" 
            :class="{ active: currentStep === 2, completed: currentStep > 2, inactive: currentStep < 2 }"
            @click="goToStep(2)"
          >
            <span class="step-num">2.</span> รายละเอียด
          </div>
          <div class="step-line" :class="{ active: currentStep >= 3 }"></div>
          
          <!-- Step 3: Payment -->
          <div 
            class="step-pill" 
            :class="{ active: currentStep === 3, inactive: currentStep < 3 }"
            @click="goToStep(3)"
          >
            <span class="step-num">3.</span> ชำระเงิน
          </div>
        </div>
      </div>

      <!-- MAIN CONTENT GRID -->
      <div v-if="cartItems.length > 0 && currentStep < 4" class="row g-4 mb-5 animate-fade-in">
        <!-- LEFT COLUMN: Step Panels -->
        <div class="col-lg-8 col-12">
          
          <!-- STEP 1 PANEL: Cart List -->
          <div v-if="currentStep === 1" class="glass-card p-4 border-glow-blue h-100">
            <h5 class="fw-bold mb-4 d-flex align-items-center gap-2">
              <i class="bi bi-cart3 text-blue-glow"></i> รายการสินค้าในตะกร้า 
              <span class="fs-9 text-muted fw-normal">({{ totalQuantity }} ชิ้น)</span>
            </h5>
            
            <div class="cart-items-wrapper">
              <div v-for="(item, index) in cartItems" :key="index" class="cart-item-card d-flex align-items-center justify-content-between p-3 mb-3">
                <div class="d-flex align-items-center gap-3 flex-wrap flex-md-nowrap w-100">
                  <!-- Product Icon Placeholder -->
                  <div class="product-img-wrapper">
                    <div class="product-icon-placeholder d-flex align-items-center justify-content-center">
                      <i :class="['bi', getProductIcon(item.name)]" class="product-cat-icon"></i>
                    </div>
                  </div>
                  
                  <!-- Product Details -->
                  <div class="product-info-wrapper flex-grow-1">
                    <h6 class="product-title fw-semibold text-dark mb-2" :title="item.name">
                      {{ item.name }}
                    </h6>
                    <div class="d-flex align-items-baseline gap-2">
                      <span class="product-price fw-bold text-blue-glow">฿{{ parseFloat(item.price).toLocaleString('th-TH', {minimumFractionDigits: 2}) }}</span>
                      <span v-if="item.originalPrice" class="product-old-price text-decoration-line-through text-muted fs-8">
                        ฿{{ parseFloat(item.originalPrice).toLocaleString('th-TH', {minimumFractionDigits: 2}) }}
                      </span>
                    </div>
                  </div>
                  
                  <!-- Quantity Controls & Delete -->
                  <div class="qty-and-delete-wrapper d-flex align-items-center justify-content-end gap-3 ms-auto pt-2 pt-md-0">
                    <div class="qty-controls d-flex align-items-center">
                      <button @click="decreaseQty(index)" class="btn-qty-minus shadow-none" aria-label="Decrease quantity">
                        <i class="bi bi-dash"></i>
                      </button>
                      <input 
                        type="number" 
                        v-model.number="item.qty" 
                        @change="validateQty(index)"
                        class="qty-input text-center shadow-none"
                        min="1"
                      >
                      <button @click="increaseQty(index)" class="btn-qty-plus shadow-none" aria-label="Increase quantity">
                        <i class="bi bi-plus text-blue-glow"></i>
                      </button>
                    </div>
                    
                    <button @click="removeItem(index)" class="btn-delete-item shadow-none" title="ลบรายการสินค้า">
                      <i class="bi bi-trash3"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Back to shopping -->
            <div class="mt-4">
              <router-link to="/computer-set" class="btn btn-outline-dark rounded-pill px-4 fw-semibold text-decoration-none d-inline-flex align-items-center gap-2">
                <i class="bi bi-arrow-left"></i> เลือกซื้อสินค้าต่อ
              </router-link>
            </div>
          </div>

          <!-- STEP 2 PANEL: Shipping Details Form -->
          <div v-if="currentStep === 2" class="glass-card p-4 border-glow-blue h-100">
            <h5 class="fw-bold mb-4 d-flex align-items-center gap-2">
              <i class="bi bi-geo-alt text-blue-glow"></i> ข้อมูลที่อยู่จัดส่งและใบเสร็จ
            </h5>
            
            <form @submit.prevent="proceedToStep(3)" class="shipping-form row g-3">
              <!-- Saved Shipping Addresses Selector -->
              <div v-if="savedAddresses.length > 0 && shipping.method === 'delivery'" class="col-12 mb-3">
                <label class="form-label fw-bold text-dark fs-8 d-flex align-items-center gap-2">
                  <i class="bi bi-journal-bookmark-fill text-blue-glow"></i> เลือกจากที่อยู่จัดส่งที่บันทึกไว้
                </label>
                <div class="row g-2 saved-addresses-selector">
                  <div 
                    v-for="addr in savedAddresses" 
                    :key="addr.id" 
                    class="col-md-6 col-12"
                  >
                    <div 
                      class="address-select-card p-3 rounded-4 border cursor-pointer h-100 position-relative transition-all"
                      :class="{ active: selectedAddressId === addr.id }"
                      @click="selectSavedAddress(addr.id)"
                    >
                      <div class="d-flex justify-content-between align-items-start mb-2">
                        <span class="badge text-white" :class="addr.is_default ? 'bg-primary-glow' : 'bg-secondary text-secondary-custom'">
                          {{ addr.is_default ? 'ที่อยู่เริ่มต้น' : 'ที่อยู่ทั่วไป' }}
                        </span>
                        <div class="option-radio-circle ms-2">
                          <div class="inner-dot" :class="{ 'bg-blue-glow': selectedAddressId === addr.id }"></div>
                        </div>
                      </div>
                      <div class="fw-bold text-dark fs-8 mb-1">{{ addr.full_name }}</div>
                      <div class="text-muted fs-9 mb-1"><i class="bi bi-telephone me-1"></i> {{ addr.phone }}</div>
                      <div class="text-secondary fs-9 text-truncate-2" :title="addr.address_line">
                        <i class="bi bi-geo-alt me-1"></i> {{ addr.address_line }}
                      </div>
                    </div>
                  </div>
                  
                  <!-- Add Custom Option -->
                  <div class="col-md-6 col-12">
                    <div 
                      class="address-select-card p-3 rounded-4 border cursor-pointer h-100 d-flex flex-column justify-content-center align-items-center gap-2 border-dashed transition-all"
                      :class="{ active: selectedAddressId === 'new' }"
                      @click="selectSavedAddress('new')"
                    >
                      <i class="bi bi-plus-circle fs-4" :class="selectedAddressId === 'new' ? 'text-blue-glow' : 'text-muted'"></i>
                      <div class="fw-bold fs-8" :class="selectedAddressId === 'new' ? 'text-blue-glow' : 'text-dark'">ระบุที่อยู่อื่น ๆ</div>
                      <div class="text-muted fs-9">กรอกที่อยู่ใหม่สำหรับการจัดส่งนี้</div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-md-6 col-12">
                <label class="form-label fw-semibold text-secondary fs-8">ชื่อ - นามสกุล <span class="text-danger">*</span></label>
                <input v-model="shipping.fullName" type="text" class="form-control form-input shadow-none" required placeholder="นาย สมชาย ใจดี">
              </div>
              <div class="col-md-6 col-12">
                <label class="form-label fw-semibold text-secondary fs-8">เบอร์โทรศัพท์ <span class="text-danger">*</span></label>
                <input v-model="shipping.phone" type="tel" class="form-control form-input shadow-none" required placeholder="089-XXX-XXXX">
              </div>
              <div class="col-12">
                <label class="form-label fw-semibold text-secondary fs-8">อีเมล <span class="text-danger">*</span></label>
                <input v-model="shipping.email" type="email" class="form-control form-input shadow-none" required placeholder="somchai@example.com">
              </div>
              
              <div class="col-12 mt-4">
                <label class="form-label fw-semibold text-secondary fs-8">ช่องทางการจัดส่ง <span class="text-danger">*</span></label>
                <div class="row g-3">
                  <!-- Option 1: Delivery -->
                  <div class="col-md-6 col-12">
                    <div 
                      class="shipping-option-card p-3 rounded-4 border d-flex align-items-center gap-3 cursor-pointer"
                      :class="{ active: shipping.method === 'delivery' }"
                      @click="setShippingMethod('delivery')"
                    >
                      <div class="option-radio-circle">
                        <div class="inner-dot"></div>
                      </div>
                      <div class="option-icon-box">
                        <i class="bi bi-truck fs-4 text-blue-glow"></i>
                      </div>
                      <div>
                        <div class="fw-bold text-dark fs-8">จัดส่งด่วนตามที่อยู่</div>
                        <div class="text-muted fs-9">จัดส่งฟรีทั่วไทยเมื่อครบ 5,000.-</div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Option 2: Self-Pickup -->
                  <div class="col-md-6 col-12">
                    <div 
                      class="shipping-option-card p-3 rounded-4 border d-flex align-items-center gap-3 cursor-pointer"
                      :class="{ active: shipping.method === 'pickup' }"
                      @click="setShippingMethod('pickup')"
                    >
                      <div class="option-radio-circle">
                        <div class="inner-dot"></div>
                      </div>
                      <div class="option-icon-box">
                        <i class="bi bi-shop fs-4 text-blue-glow"></i>
                      </div>
                      <div>
                        <div class="fw-bold text-dark fs-8">รับสินค้าเองที่หน้าร้าน</div>
                        <div class="text-success fw-bold fs-9">ส่วนลดพิเศษ ฿1,000.00</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Address Details (Only show if Delivery is chosen) -->
              <div v-if="shipping.method === 'delivery'" class="col-12 mt-3 animate-fade-in">
                <label class="form-label fw-semibold text-secondary fs-8">ที่อยู่สำหรับการจัดส่ง <span class="text-danger">*</span></label>
                <textarea v-model="shipping.address" class="form-control form-textarea shadow-none" rows="3" required placeholder="บ้านเลขที่, ถนน, ตำบล, อำเภอ, จังหวัด, รหัสไปรษณีย์"></textarea>
              </div>

              <!-- Store Branch Selection (Only show if Pickup is chosen) -->
              <div v-else class="col-12 mt-3 animate-fade-in">
                <label class="form-label fw-semibold text-secondary fs-8">สาขาที่สะดวกเข้ารับสินค้า <span class="text-danger">*</span></label>
                <select v-model="shipping.pickupBranch" class="form-select form-input shadow-none" required>
                  <option value="" disabled selected>กรุณาเลือกสาขา</option>
                  <option value="headquarter">TechGear สำนักงานใหญ่ (บางแค กรุงเทพฯ)</option>
                  <option value="central-rama9">TechGear สาขาเซ็นทรัล พระราม 9 (ชั้น 4)</option>
                  <option value="fashion-island">TechGear สาขาแฟชั่นไอส์แลนด์ (ชั้น 3)</option>
                  <option value="megabangna">TechGear สาขาเมกาบางนา (ชั้น 2)</option>
                </select>
                <div class="alert alert-success-custom mt-2 fs-9 rounded-3 py-2 px-3 border-0">
                  <i class="bi bi-info-circle-fill me-1"></i> ได้รับส่วนลดประกอบคอมพิวเตอร์เซต 1,000 บาททันทีเมื่อมารับสินค้าด้วยตัวเอง!
                </div>
              </div>

              <div class="col-12 d-flex justify-content-between mt-4">
                <button type="button" @click="goToStep(1)" class="btn btn-outline-dark rounded-pill px-4 fw-semibold d-flex align-items-center gap-2">
                  <i class="bi bi-chevron-left"></i> ย้อนกลับ
                </button>
                <button type="submit" class="btn btn-blue-glow rounded-pill px-4 fw-semibold text-white d-flex align-items-center gap-2">
                  ดำเนินการต่อ <i class="bi bi-chevron-right"></i>
                </button>
              </div>
            </form>
          </div>

          <!-- STEP 3 PANEL: Payment Options -->
          <div v-if="currentStep === 3" class="glass-card p-4 border-glow-blue h-100">
            <h5 class="fw-bold mb-4 d-flex align-items-center gap-2">
              <i class="bi bi-credit-card text-blue-glow"></i> ช่องทางการชำระเงิน
            </h5>
            
            <div class="row g-3 mb-4">
              <!-- Pay method 1: QR PromptPay -->
              <div class="col-md-4 col-12">
                <div 
                  class="payment-option-card p-3 rounded-4 border text-center cursor-pointer h-100 d-flex flex-column justify-content-center align-items-center gap-2"
                  :class="{ active: payment.method === 'qr' }"
                  @click="payment.method = 'qr'"
                >
                  <i class="bi bi-qr-code-scan fs-2 text-blue-glow"></i>
                  <div class="fw-bold text-dark fs-8">Thai QR PromptPay</div>
                  <div class="text-muted fs-9">สแกนชำระด้วยแอปธนาคาร</div>
                </div>
              </div>
              
              <!-- Pay method 2: Credit Card -->
              <div class="col-md-4 col-12">
                <div 
                  class="payment-option-card p-3 rounded-4 border text-center cursor-pointer h-100 d-flex flex-column justify-content-center align-items-center gap-2"
                  :class="{ active: payment.method === 'card' }"
                  @click="payment.method = 'card'"
                >
                  <i class="bi bi-credit-card-2-front fs-2 text-blue-glow"></i>
                  <div class="fw-bold text-dark fs-8">บัตรเครดิต / เดบิต</div>
                  <div class="text-muted fs-9">ชำระเต็มจำนวนหรือแบ่งจ่าย</div>
                </div>
              </div>

              <!-- Pay method 3: Bank Installment -->
              <div class="col-md-4 col-12">
                <div 
                  class="payment-option-card p-3 rounded-4 border text-center cursor-pointer h-100 d-flex flex-column justify-content-center align-items-center gap-2"
                  :class="{ active: payment.method === 'installment' }"
                  @click="payment.method = 'installment'"
                >
                  <i class="bi bi-wallet2 fs-2 text-blue-glow"></i>
                  <div class="fw-bold text-dark fs-8">ผ่อนชำระ 0%</div>
                  <div class="text-muted fs-9">ผ่อนสูงสุด 10 เดือน</div>
                </div>
              </div>
            </div>

            <!-- Conditional Details based on Payment Method -->
            <div class="payment-method-details p-3 rounded-4 bg-light mb-4 border border-dashed">
              <!-- PromptPay Details -->
              <div v-if="payment.method === 'qr'" class="text-center py-3 animate-fade-in">
                <!-- QR Placeholder (ไม่ใช้ external QR API) -->
                <div class="qr-placeholder-box d-inline-flex flex-column align-items-center justify-content-center mb-3 shadow rounded-3 border p-3 bg-white">
                  <i class="bi bi-qr-code fs-1 text-dark mb-2"></i>
                  <span class="fs-9 text-muted fw-semibold">Thai QR PromptPay</span>
                  <span class="fs-9 text-secondary">PromptPay: 062-050-0065</span>
                </div>
                <div class="fw-bold text-dark fs-7">สแกนจ่ายผ่านแอปธนาคารของคุณ</div>
                <div class="text-muted fs-8 mt-1">ยอดชำระสุทธิ: <b class="text-blue-glow text-lg">฿{{ finalTotal.toLocaleString('th-TH', {minimumFractionDigits: 2}) }}</b></div>
                <div class="alert alert-secondary fs-9 rounded-3 py-2 px-3 border-0 mt-3 d-inline-block">
                  <i class="bi bi-shield-lock-fill text-success me-1"></i> ปลอดภัยและได้รับการเข้ารหัสผ่านพันธมิตรผู้ให้บริการชำระเงิน
                </div>
              </div>

              <!-- Credit Card Form -->
              <div v-if="payment.method === 'card'" class="row g-3 py-2 animate-fade-in">
                <!-- Saved Payment Cards Selector -->
                <div v-if="savedPaymentMethods.length > 0" class="col-12 mb-2">
                  <label class="form-label fw-bold text-dark fs-8 d-flex align-items-center gap-2">
                    <i class="bi bi-credit-card-fill text-blue-glow"></i> เลือกจากบัตรที่บันทึกไว้
                  </label>
                  <div class="row g-2 saved-cards-selector">
                    <div 
                      v-for="card in savedPaymentMethods" 
                      :key="card.id" 
                      class="col-md-6 col-12"
                    >
                      <div 
                        class="card-select-card p-3 rounded-4 border cursor-pointer h-100 position-relative transition-all"
                        :class="[
                          { active: selectedPaymentMethodId === card.id },
                          'card-theme-' + (card.card_provider ? card.card_provider.toLowerCase().replace(/\s+/g, '') : 'default')
                        ]"
                        @click="selectSavedPaymentMethod(card.id)"
                      >
                        <div class="d-flex justify-content-between align-items-start mb-2">
                          <span class="card-brand fw-bold text-uppercase fs-9">
                            <i class="bi bi-credit-card-2-front-fill me-1"></i> {{ card.card_provider }}
                          </span>
                          <span v-if="card.is_default" class="badge bg-white-translucent text-white fs-9">เริ่มต้น</span>
                        </div>
                        <div class="card-number-masked fw-bold fs-7 mb-1 text-white">
                          •••• •••• •••• {{ card.card_number.slice(-4) }}
                        </div>
                        <div class="d-flex justify-content-between align-items-center mt-2">
                          <div class="card-holder text-uppercase fs-9 text-white-50 text-truncate" style="max-width: 150px;">{{ card.card_holder }}</div>
                          <div class="card-expiry fs-9 text-white">{{ card.expiry_date }}</div>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Add Custom Option -->
                    <div class="col-md-6 col-12">
                      <div 
                        class="card-select-card p-3 rounded-4 border cursor-pointer h-100 d-flex flex-column justify-content-center align-items-center gap-2 border-dashed transition-all"
                        :class="{ active: selectedPaymentMethodId === 'new' }"
                        @click="selectSavedPaymentMethod('new')"
                        style="min-height: 100px; color: #64748b;"
                      >
                        <i class="bi bi-plus-circle fs-4" :class="selectedPaymentMethodId === 'new' ? 'text-blue-glow' : 'text-muted'"></i>
                        <div class="fw-bold fs-8" :class="selectedPaymentMethodId === 'new' ? 'text-blue-glow' : 'text-dark'">ระบุบัตรอื่น ๆ</div>
                        <div class="text-muted fs-9">กรอกข้อมูลบัตรใบใหม่</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Input Fields for Credit Card -->
                <div class="col-12">
                  <label class="form-label fw-semibold text-secondary fs-8">หมายเลขบัตรเครดิต <span class="text-danger">*</span></label>
                  <div class="input-group">
                    <span class="input-group-text bg-white border-end-0"><i class="bi bi-credit-card"></i></span>
                    <input 
                      :value="payment.cardNumber" 
                      @input="onCardNumberInput"
                      type="text" 
                      class="form-control form-input border-start-0 shadow-none" 
                      placeholder="XXXX-XXXX-XXXX-XXXX"
                      required
                      :disabled="selectedPaymentMethodId !== 'new'"
                    >
                  </div>
                </div>
                <div class="col-12">
                  <label class="form-label fw-semibold text-secondary fs-8">ชื่อผู้ถือบัตร <span class="text-danger">*</span></label>
                  <input 
                    v-model="payment.cardHolder" 
                    type="text" 
                    class="form-control form-input shadow-none" 
                    placeholder="NAME SURNAME"
                    required
                    :disabled="selectedPaymentMethodId !== 'new'"
                  >
                </div>
                <div class="col-md-6 col-12">
                  <label class="form-label fw-semibold text-secondary fs-8">วันหมดอายุ <span class="text-danger">*</span></label>
                  <input 
                    :value="payment.expiryDate" 
                    @input="onExpiryInput"
                    type="text" 
                    class="form-control form-input shadow-none" 
                    placeholder="MM/YY"
                    required
                    :disabled="selectedPaymentMethodId !== 'new'"
                  >
                </div>
                <div class="col-md-6 col-12">
                  <label class="form-label fw-semibold text-secondary fs-8">รหัสความปลอดภัย (CVV) <span class="text-danger">*</span></label>
                  <input 
                    :value="payment.cvv" 
                    @input="onCvvInput"
                    type="password" 
                    class="form-control form-input shadow-none" 
                    placeholder="XXX"
                    required
                  >
                </div>
              </div>

              <!-- Installment Options -->
              <div v-if="payment.method === 'installment'" class="animate-fade-in py-2">
                <label class="form-label fw-semibold text-secondary fs-8">เลือกธนาคารสำหรับการผ่อนชำระ 0%</label>
                <select v-model="payment.installmentBank" class="form-select form-input shadow-none mb-3">
                  <option value="" disabled selected>กรุณาเลือกธนาคาร</option>
                  <option value="kbank">ธนาคารกสิกรไทย (K-Bank) - 0% สูงสุด 10 เดือน</option>
                  <option value="scb">ธนาคารไทยพาณิชย์ (SCB) - 0% สูงสุด 10 เดือน</option>
                  <option value="bbl">ธนาคารกรุงเทพ (BBL) - 0% สูงสุด 10 เดือน</option>
                  <option value="krungsri">ธนาคารกรุงศรีอยุธยา (KCC) - 0% สูงสุด 10 เดือน</option>
                </select>
                
                <label class="form-label fw-semibold text-secondary fs-8">เลือกระยะเวลาการผ่อนชำระ</label>
                <div class="row g-2">
                  <div class="col-4">
                    <div 
                      class="installment-term-card p-2 text-center rounded-3 border cursor-pointer"
                      :class="{ active: payment.installmentTerm === 3 }"
                      @click="payment.installmentTerm = 3"
                    >
                      <div class="fw-bold fs-8">3 เดือน</div>
                      <div class="fs-9 text-muted">฿{{ Math.round(finalTotal / 3).toLocaleString('th-TH') }}/ด.</div>
                    </div>
                  </div>
                  <div class="col-4">
                    <div 
                      class="installment-term-card p-2 text-center rounded-3 border cursor-pointer"
                      :class="{ active: payment.installmentTerm === 6 }"
                      @click="payment.installmentTerm = 6"
                    >
                      <div class="fw-bold fs-8">6 เดือน</div>
                      <div class="fs-9 text-muted">฿{{ Math.round(finalTotal / 6).toLocaleString('th-TH') }}/ด.</div>
                    </div>
                  </div>
                  <div class="col-4">
                    <div 
                      class="installment-term-card p-2 text-center rounded-3 border cursor-pointer"
                      :class="{ active: payment.installmentTerm === 10 }"
                      @click="payment.installmentTerm = 10"
                    >
                      <div class="fw-bold fs-8">10 เดือน</div>
                      <div class="fs-9 text-blue-glow">฿{{ Math.round(finalTotal / 10).toLocaleString('th-TH') }}/ด.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-12 d-flex justify-content-between mt-4">
              <button @click="goToStep(2)" class="btn btn-outline-dark rounded-pill px-4 fw-semibold d-flex align-items-center gap-2">
                <i class="bi bi-chevron-left"></i> ย้อนกลับ
              </button>
              <button @click="placeOrder" class="btn btn-blue-glow rounded-pill px-5 fw-bold text-white d-flex align-items-center gap-2">
                ยืนยันการสั่งซื้อ <i class="bi bi-check2-circle"></i>
              </button>
            </div>
          </div>

        </div>

        <!-- RIGHT COLUMN: Order Summary Card -->
        <div class="col-lg-4 col-12">
          <div class="glass-card p-4 border-glow-blue order-summary-sidebar position-sticky" style="top: 110px;">
            <h5 class="fw-bold text-dark border-bottom pb-3 mb-3">ยอดรวมทั้งหมด</h5>
            
            <div class="d-flex flex-column gap-2 mb-3">
              <div class="d-flex justify-content-between text-secondary fs-8">
                <span>ค่าจัดส่ง:</span>
                <span class="text-dark fw-medium">฿0.00</span>
              </div>
              <div class="d-flex justify-content-between text-secondary fs-8">
                <span>ราคาก่อนภาษี:</span>
                <span class="text-dark fw-medium">฿{{ preTaxPrice.toLocaleString('th-TH', {minimumFractionDigits: 2}) }}</span>
              </div>
              <div class="d-flex justify-content-between text-secondary fs-8">
                <span>ภาษี VAT 7%:</span>
                <span class="text-dark fw-medium">฿{{ vatAmount.toLocaleString('th-TH', {minimumFractionDigits: 2}) }}</span>
              </div>
              <div class="d-flex justify-content-between text-secondary fs-8 border-top pt-2">
                <span>ส่วนลดทั้งหมด</span>
              </div>
              <div class="d-flex justify-content-between text-success fs-8">
                <span>ส่วนลด:</span>
                <span class="fw-bold">-฿{{ totalDiscount.toLocaleString('th-TH', {minimumFractionDigits: 2}) }}</span>
              </div>
            </div>
            
            <div class="border-top pt-3 mb-4">
              <div class="d-flex justify-content-between align-items-baseline">
                <div>
                  <div class="fw-bold text-dark fs-7">ยอดรวม</div>
                  <div class="text-muted-custom" style="font-size: 0.7rem;">ยอดรวม (รวมภาษีมูลค่าเพิ่ม)</div>
                </div>
                <div class="text-end">
                  <div class="fw-bold text-blue-glow fs-4">฿{{ finalTotal.toLocaleString('th-TH', {minimumFractionDigits: 2}) }}</div>
                </div>
              </div>
            </div>
            
            <!-- Large Action Button -->
            <button 
              v-if="currentStep === 1" 
              @click="proceedToStep(2)" 
              class="btn btn-blue-glow w-100 rounded-4 py-3 fw-bold text-white fs-6 mb-4 shadow"
            >
              ดำเนินการต่อ
            </button>
            <button 
              v-if="currentStep === 2" 
              @click="shippingFormSubmitTrigger" 
              class="btn btn-blue-glow w-100 rounded-4 py-3 fw-bold text-white fs-6 mb-4 shadow"
            >
              ดำเนินการต่อไปยังชำระเงิน
            </button>
            <button 
              v-if="currentStep === 3" 
              @click="placeOrder" 
              class="btn btn-blue-glow w-100 rounded-4 py-3 fw-bold text-white fs-6 mb-4 shadow"
            >
              ยืนยันยอดสั่งซื้อ
            </button>

            <!-- Bottom trust points -->
            <div class="trust-points-list d-flex flex-column gap-3 border-top pt-4">
              <div class="trust-point-item d-flex gap-3">
                <i class="bi bi-truck text-muted fs-5 flex-shrink-0"></i>
                <div>
                  <div class="fw-bold text-dark fs-8">ส่งฟรีทั่วไทย</div>
                  <div class="text-muted fs-9">ช้อปครบ 5,000 บาทขึ้นไป</div>
                </div>
              </div>
              
              <div class="trust-point-item d-flex gap-3">
                <i class="bi bi-credit-card text-muted fs-5 flex-shrink-0"></i>
                <div>
                  <div class="fw-bold text-dark fs-8">ผ่อนสูงสุด 10 เดือน</div>
                  <div class="text-muted fs-9">ผ่อนได้เลย เพียงแค่มีบัตรเครดิต</div>
                </div>
              </div>
              
              <div class="trust-point-item d-flex gap-3">
                <i class="bi bi-shop text-muted fs-5 flex-shrink-0"></i>
                <div>
                  <div class="fw-bold text-dark fs-8">รับเองที่ร้านลด 1000.-</div>
                  <div class="text-muted fs-9">รับสินค้าเองที่ร้านเพื่อรับส่วนลด เฉพาะคอมเซ็ตประกอบ</div>
                </div>
              </div>
              
              <div class="trust-point-item d-flex gap-3">
                <i class="bi bi-arrow-repeat text-muted fs-5 flex-shrink-0"></i>
                <div>
                  <div class="fw-bold text-dark fs-8">เปลี่ยนคืนง่าย</div>
                  <div class="text-muted fs-9">ภายใน 7 วัน *เงื่อนไขเป็นไปตามที่บริษัทกำหนด</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- EMPTY STATE -->
      <div v-else-if="cartItems.length === 0 && currentStep < 4" class="row py-5 animate-fade-in">
        <div class="col-12 text-center py-5">
          <div class="empty-state-card glass-card p-5 max-w-2xl mx-auto border-glow-blue shadow-lg rounded-4">
            <div class="empty-icon-wrapper mb-4">
              <i class="bi bi-cart-x fs-1"></i>
            </div>
            <h4 class="fw-bold text-dark mb-2">ไม่มีสินค้าในตะกร้าของคุณ</h4>
            <p class="text-muted-custom mb-4 max-w-md mx-auto">คุณยังไม่ได้เลือกซื้อสินค้า หรือระบบล้างรายการตะกร้าแล้ว ลองเลือกคอมพิวเตอร์เซ็ตสเปกแรงที่เราแนะนำกันเลย!</p>
            <div class="d-flex justify-content-center gap-3">
              <button @click="loadDemoItem" class="btn btn-outline-blue rounded-pill px-4 py-2 fw-semibold">
                <i class="bi bi-lightning-charge-fill me-1"></i> โหลดสินค้าสาธิต (ในรูป)
              </button>
              <router-link to="/computer-set" class="btn btn-blue-glow rounded-pill px-4 py-2 fw-semibold text-white text-decoration-none">
                <i class="bi bi-shop-window me-1"></i> ไปที่คอมพิวเตอร์เซต
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- SUCCESS SCREEN (Step 4) -->
      <div v-if="currentStep === 4" class="row justify-content-center py-5 animate-fade-in">
        <div class="col-lg-6 col-md-8 col-12">
          <div class="glass-card success-order-card text-center p-5 border-glow-blue rounded-4 shadow-lg">
            <div class="success-animation-wrapper mb-4">
              <div class="success-circle d-inline-flex align-items-center justify-content-center rounded-circle">
                <i class="bi bi-check2 fs-1 text-white animate-pulse"></i>
              </div>
            </div>
            
            <h3 class="fw-bold text-dark mb-2">สั่งซื้อสินค้าเสร็จสมบูรณ์!</h3>
            <p class="text-muted-custom mb-4">ขอบคุณที่ร่วมใช้บริการและทำการทดสอบระบบกับเรา ทางเจ้าหน้าที่จะทำการติดต่อกลับไปอย่างรวดเร็วที่สุด</p>
            
            <!-- Order Details Card -->
            <div class="order-receipt-card p-4 rounded-4 bg-light text-start border mb-4">
              <div class="d-flex justify-content-between border-bottom pb-2 mb-3">
                <span class="text-secondary fw-semibold fs-8">รหัสใบสั่งซื้อ:</span>
                <span class="text-dark fw-bold fs-8 text-uppercase">#TG-{{ orderNumber }}</span>
              </div>
              
              <div class="d-flex justify-content-between mb-2">
                <span class="text-secondary fs-8">ผู้สั่งซื้อ:</span>
                <span class="text-dark fw-medium fs-8">{{ shipping.fullName }}</span>
              </div>
              <div class="d-flex justify-content-between mb-2">
                <span class="text-secondary fs-8">เบอร์ติดต่อ:</span>
                <span class="text-dark fw-medium fs-8">{{ shipping.phone }}</span>
              </div>
              <div class="d-flex justify-content-between mb-3 border-bottom pb-3">
                <span class="text-secondary fs-8">รูปแบบจัดส่ง:</span>
                <span class="text-dark fw-semibold fs-8 text-success">
                  {{ shipping.method === 'pickup' ? 'รับเองที่ร้าน (รับส่วนลด 1,000.-)' : 'จัดส่งถึงบ้านฟรี' }}
                </span>
              </div>
              
              <!-- Items list inside receipt -->
              <div class="receipt-items-list mb-3">
                <div v-for="(item, index) in orderReceiptItems" :key="index" class="d-flex justify-content-between py-1 border-bottom border-light fs-9 text-muted">
                  <span class="text-truncate" style="max-width: 250px;">{{ item.name }} x{{ item.qty }}</span>
                  <span class="fw-semibold">฿{{ (item.price * item.qty).toLocaleString('th-TH') }}</span>
                </div>
              </div>
              
              <div class="d-flex justify-content-between align-items-baseline pt-2">
                <span class="text-dark fw-bold fs-7">ยอดรวมทั้งหมดสุทธิ:</span>
                <span class="text-blue-glow fw-bold fs-4">฿{{ receiptTotal.toLocaleString('th-TH', {minimumFractionDigits: 2}) }}</span>
              </div>
            </div>

            <div class="d-flex justify-content-center gap-3">
              <router-link to="/" class="btn btn-outline-dark rounded-pill px-4 py-2 fw-semibold text-decoration-none">
                <i class="bi bi-house-door me-1"></i> กลับหน้าแรก
              </router-link>
              <router-link to="/computer-set" class="btn btn-blue-glow rounded-pill px-4 py-2 fw-semibold text-white text-decoration-none">
                <i class="bi bi-controller me-1"></i> ไปเลือกสเปกคอมอื่นๆ
              </router-link>
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
            <i class="bi bi-info-circle-fill text-primary fs-4"></i>
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

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import axios from 'axios'
import KakaNavbar from './KakaNavbar.vue'
import KakaFooter from './KakaFooter.vue'

// สถานะการนำทางระหว่างขั้นตอนการสั่งซื้อ (1 = สรุปตะกร้า, 2 = ข้อมูลจัดส่ง, 3 = ชำระเงิน, 4 = เสร็จสมบูรณ์)
const currentStep = ref(1)
const orderNumber = ref('') // เก็บเลขที่ใบสั่งซื้อที่ถูกสร้างขึ้น

// ข้อมูลสินค้าที่ถูกเพิ่มลงในตะกร้า
const cartItems = ref([])

// Computed Properties สำหรับสรุปยอดรวม (Order Summary)
const totalQuantity = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + parseInt(item.qty || 0), 0)
})

const cartSubtotal = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + (parseFloat(item.price || 0) * parseInt(item.qty || 0)), 0)
})

const totalDiscount = computed(() => {
  // If self-pickup is selected, award a 1,000 Baht discount
  let discount = 0
  if (shipping.method === 'pickup') {
    discount += 1000.00
  }
  return discount
})

const finalTotal = computed(() => {
  const calculated = cartSubtotal.value - totalDiscount.value
  return calculated > 0 ? calculated : 0
})

const preTaxPrice = computed(() => {
  return finalTotal.value / 1.07
})

const vatAmount = computed(() => {
  return finalTotal.value - preTaxPrice.value
})

// โมเดลข้อมูลฟอร์มสำหรับการจัดส่ง (Shipping Information Form)
const shipping = reactive({
  fullName: '',
  phone: '',
  email: '',
  method: 'delivery', // delivery or pickup
  address: '',
  pickupBranch: ''
})

const payment = reactive({
  method: 'qr', // qr, card, installment
  installmentBank: '',
  installmentTerm: 10,
  cardNumber: '',
  cardHolder: '',
  expiryDate: '',
  cvv: '',
  cardProvider: 'Visa'
})

// State สำหรับจัดการข้อมูลที่อยู่และบัตรเครดิตที่บันทึกไว้ในระบบ
const savedAddresses = ref([])
const savedPaymentMethods = ref([])
const selectedAddressId = ref(null) // ID ของที่อยู่ที่ถูกเลือก (หรือ 'new' หากระบุใหม่)
const selectedPaymentMethodId = ref(null) // ID ของบัตรที่ถูกเลือก (หรือ 'new' หากระบุใหม่)

// State สำหรับเก็บข้อมูลใบเสร็จหลังจากสั่งซื้อสำเร็จเพื่อนำไปแสดงในขั้นตอนที่ 4
const orderReceiptItems = ref([])
const receiptTotal = ref(0)

const formatCardNumber = (num) => {
  if (!num) return ''
  const clean = num.replace(/\D/g, '')
  return clean.match(/.{1,4}/g)?.join(' ') || clean
}

const detectCardProvider = (num) => {
  const clean = num.replace(/\s+/g, '')
  if (clean.startsWith('4')) return 'Visa'
  if (clean.startsWith('5')) return 'Mastercard'
  if (clean.startsWith('3')) return 'American Express'
  if (clean.startsWith('6')) return 'JCB'
  return 'Visa'
}

const onCardNumberInput = (event) => {
  let val = event.target.value.replace(/\D/g, '')
  val = val.substring(0, 16)
  payment.cardNumber = val.replace(/(.{4})/g, '$1 ').trim()
  
  const detected = detectCardProvider(val)
  if (detected) {
    payment.cardProvider = detected
  }
}

const onExpiryInput = (event) => {
  let val = event.target.value.replace(/\D/g, '')
  if (val.length > 4) val = val.substring(0, 4)
  if (val.length > 2) {
    payment.expiryDate = val.substring(0, 2) + '/' + val.substring(2)
  } else {
    payment.expiryDate = val
  }
}

const onCvvInput = (event) => {
  let val = event.target.value.replace(/\D/g, '')
  payment.cvv = val.substring(0, 3)
}

const selectSavedAddress = (id) => {
  selectedAddressId.value = id
  if (id === 'new') {
    shipping.fullName = ''
    shipping.phone = ''
    shipping.address = ''
    return
  }
  const addr = savedAddresses.value.find(a => a.id === id)
  if (addr) {
    shipping.fullName = addr.full_name
    shipping.phone = addr.phone
    shipping.address = addr.address_line
  }
}

const selectSavedPaymentMethod = (id) => {
  selectedPaymentMethodId.value = id
  if (id === 'new') {
    payment.cardNumber = ''
    payment.cardHolder = ''
    payment.expiryDate = ''
    payment.cvv = ''
    payment.cardProvider = 'Visa'
    return
  }
  const pm = savedPaymentMethods.value.find(p => p.id === id)
  if (pm) {
    payment.cardNumber = formatCardNumber(pm.card_number)
    payment.cardHolder = pm.card_holder
    payment.expiryDate = pm.expiry_date
    payment.cardProvider = pm.card_provider
    payment.cvv = '' // CVV blank for security / user input
  }
}

// ระบบหน้าต่างแจ้งเตือน (Toast Notification System)
const toast = reactive({
  show: false,
  title: '',
  message: '',
  type: 'info'
})

const showToast = (title, message, type = 'info') => {
  toast.title = title
  toast.message = message
  toast.type = type
  toast.show = true
  setTimeout(() => {
    toast.show = false
  }, 4000)
}

// ฟังก์ชันสลับรูปแบบการจัดส่ง (จัดส่งด่วน หรือ รับเองที่ร้าน)
const setShippingMethod = (method) => {
  shipping.method = method
}

// ตรวจสอบความถูกต้องและจัดการการเปลี่ยนขั้นตอน (Step Validation & Navigation)
const goToStep = (step) => {
  if (step > currentStep.value) {
    if (currentStep.value === 1 && step >= 2) {
      if (cartItems.value.length === 0) {
        showToast('ผิดพลาด', 'ไม่มีสินค้าในตะกร้าเพื่อดำเนินการต่อ', 'warning')
        return
      }
    }
    if (currentStep.value === 2 && step >= 3) {
      if (!validateShippingForm()) {
        showToast('ผิดพลาด', 'กรุณากรอกที่อยู่และเบอร์ติดต่อให้ครบถ้วนก่อนดำเนินการต่อ', 'warning')
        return
      }
    }
  }
  currentStep.value = step
}

const proceedToStep = (step) => {
  goToStep(step)
  window.scrollTo(0, 0)
}

const shippingFormSubmitTrigger = () => {
  // Trigger form validation indirectly
  if (validateShippingForm()) {
    proceedToStep(3)
  } else {
    showToast('ข้อมูลไม่ครบถ้วน', 'กรุณากรอกแบบฟอร์มการจัดส่งให้ครบถ้วนก่อนไปต่อ', 'warning')
  }
}

const validateShippingForm = () => {
  if (!shipping.fullName || !shipping.phone || !shipping.email) return false
  if (shipping.method === 'delivery' && !shipping.address) return false
  if (shipping.method === 'pickup' && !shipping.pickupBranch) return false
  return true
}

// ฟังก์ชันจัดการจำนวนสินค้าในตะกร้า (เพิ่ม/ลด จำนวน)
const increaseQty = (index) => {
  cartItems.value[index].qty++
  saveCartState()
}

const decreaseQty = (index) => {
  if (cartItems.value[index].qty > 1) {
    cartItems.value[index].qty--
    saveCartState()
  }
}

const validateQty = (index) => {
  if (typeof cartItems.value[index].qty !== 'number' || cartItems.value[index].qty < 1) {
    cartItems.value[index].qty = 1
  }
  saveCartState()
}

const removeItem = (index) => {
  const removedName = cartItems.value[index].name
  cartItems.value.splice(index, 1)
  saveCartState()
  showToast('ลบสำเร็จ', `ได้ลบ ${removedName} ออกจากตะกร้าเรียบร้อยแล้ว`, 'info')
  
  // Sync to Navbar
  window.dispatchEvent(new Event('cart-updated'))
}

// ฟังก์ชันซิงค์ข้อมูลตะกร้าล่าสุดกลับไปที่ Local Storage เพื่อป้องกันข้อมูลสูญหาย
const saveCartState = () => {
  // Re-flatten cartItems to simple list format as Navbar expects
  const flatItems = []
  cartItems.value.forEach(item => {
    for (let i = 0; i < item.qty; i++) {
      flatItems.push({
        name: item.name,
        price: item.price
      })
    }
  })
  localStorage.setItem('cartItems', JSON.stringify(flatItems))
  
  // Dispatch custom event to let navbar know to reload cart
  window.dispatchEvent(new CustomEvent('auth-change')) 
}

// ฟังก์ชันดึงข้อมูลตะกร้าที่กระจายอยู่จาก Local Storage และจัดกลุ่มสินค้าที่เหมือนกัน (Group duplicates)
const groupAndLoadItems = () => {
  const savedCart = localStorage.getItem('cartItems')
  let items = []
  
  if (savedCart) {
    items = JSON.parse(savedCart)
  }
  
  // If cart is empty, auto-populate with the gorgeous PC Set spec item from the user's screenshot!
  if (items.length === 0) {
    loadDemoItem()
    return
  }
  
  const grouped = []
  items.forEach(item => {
    // If it's already grouped in local state
    const existing = grouped.find(g => g.name === item.name)
    if (existing) {
      existing.qty = (existing.qty || 1) + 1
    } else {
      grouped.push({
        name: item.name,
        price: parseFloat(item.price || 0),
        originalPrice: item.originalPrice || parseFloat(item.price || 0) * 1.15,
        qty: item.qty || 1
      })
    }
  })
  
  cartItems.value = grouped
}

const loadDemoItem = () => {
  cartItems.value = [
    {
      name: 'MAY26INTD5-001 INTEL I5-12400 2.5GHz 6C/12T / H610M / ONBOARD / 32GB DDR5 5600MHz / M.2 1TB / 550W (80+SILVER)',
      price: 27990.00,
      originalPrice: 31690.00,
      qty: 1
    }
  ]
  saveCartState()
  showToast('โหลดสินค้าสาธิต', 'โหลดรายละเอียดคอมเซ็ตสาธิตเรียบร้อยแล้ว!', 'info')
}

// ฟังก์ชันดำเนินการยืนยันสั่งซื้อสินค้าขั้นสุดท้าย (Place Final Order)
const placeOrder = async () => {
  if (cartItems.value.length === 0) return
  
  // Check validation
  if (!validateShippingForm()) {
    showToast('ข้อมูลไม่ครบถ้วน', 'กรุณากรอกรายละเอียดจัดส่งให้เรียบร้อยก่อนชำระเงิน', 'warning')
    goToStep(2)
    return
  }

  // If credit card payment, validate fields
  if (payment.method === 'card') {
    if (!payment.cardNumber || !payment.cardHolder || !payment.expiryDate || !payment.cvv) {
      showToast('ข้อมูลไม่ครบถ้วน', 'กรุณากรอกรายละเอียดบัตรเครดิตและรหัส CVV ให้ครบถ้วน', 'warning')
      return
    }
  }

  // Pre-load receipt details
  const generatedOrderNum = Math.floor(100000 + Math.random() * 900000).toString()
  orderNumber.value = generatedOrderNum
  orderReceiptItems.value = [...cartItems.value]
  receiptTotal.value = finalTotal.value

  const payload = {
    userEmail: localStorage.getItem('userEmail') || shipping.email,
    shipping: {
      fullName: shipping.fullName,
      phone: shipping.phone,
      email: shipping.email,
      method: shipping.method,
      address: shipping.method === 'delivery' ? shipping.address : '',
      pickupBranch: shipping.method === 'pickup' ? shipping.pickupBranch : ''
    },
    payment: {
      method: payment.method,
      installmentBank: payment.method === 'installment' ? payment.installmentBank : '',
      installmentTerm: payment.method === 'installment' ? payment.installmentTerm : null,
      cardNumber: payment.method === 'card' ? payment.cardNumber.replace(/\s+/g, '') : null,
      cardHolder: payment.method === 'card' ? payment.cardHolder : null,
      expiryDate: payment.method === 'card' ? payment.expiryDate : null,
      cardProvider: payment.method === 'card' ? payment.cardProvider : null
    },
    items: cartItems.value.map(item => ({
      name: item.name,
      price: parseFloat(item.price),
      qty: parseInt(item.qty)
    })),
    totalDiscount: totalDiscount.value,
    finalTotal: finalTotal.value,
    orderNumber: generatedOrderNum
  }

  try {
    const response = await axios.post('/api/orders', payload)
    if (response.data.success) {
      showToast('สั่งซื้อสำเร็จ', 'รายการคำสั่งซื้อจัดเตรียมการจัดส่งเรียบร้อยแล้ว!', 'success')
      
      // Clear cart in local storage
      localStorage.setItem('cartItems', JSON.stringify([]))
      cartItems.value = []
      
      // Clear navbar badge
      window.dispatchEvent(new CustomEvent('auth-change'))
      
      // Go to step 4
      currentStep.value = 4
      window.scrollTo(0, 0)
    } else {
      showToast('เกิดข้อผิดพลาด', response.data.message || 'ไม่สามารถสั่งซื้อได้ในขณะนี้', 'danger')
    }
  } catch (error) {
    console.error('Checkout error:', error)
    showToast('เกิดข้อผิดพลาด', 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง', 'danger')
  }
}

// ระบบช่วยจับคู่คำค้นหาชื่อสินค้าเพื่อแปลงเป็นไอคอนสำหรับแสดงผลแทนรูปภาพจริง (Icon-based Product Matcher)
const getProductIcon = (name = '') => {
  const n = name.toLowerCase()
  if (n.includes('cpu') || n.includes('processor') || n.includes('i5') || n.includes('i7') || n.includes('i9') || n.includes('ryzen')) return 'bi-cpu-fill'
  if (n.includes('gpu') || n.includes('rtx') || n.includes('gtx') || n.includes('geforce') || n.includes('radeon') || n.includes('strix')) return 'bi-gpu-card'
  if (n.includes('ram') || n.includes('ddr') || n.includes('dominator') || n.includes('memory')) return 'bi-memory'
  if (n.includes('ssd') || n.includes('nvme') || n.includes('m.2') || n.includes('990 pro')) return 'bi-device-ssd'
  if (n.includes('hdd') || n.includes('hard')) return 'bi-hdd-fill'
  if (n.includes('motherboard') || n.includes('mainboard') || n.includes('maximus') || n.includes('z790') || n.includes('h610')) return 'bi-layout-three-columns'
  if (n.includes('psu') || n.includes('power') || n.includes('modular') || n.includes('rm1000') || n.includes('550w') || n.includes('80+')) return 'bi-plug-fill'
  if (n.includes('case') || n.includes('o11') || n.includes('dynamic')) return 'bi-box-fill'
  if (n.includes('monitor') || n.includes('oled') || n.includes('display')) return 'bi-display-fill'
  if (n.includes('mouse') || n.includes('superlight')) return 'bi-mouse-fill'
  if (n.includes('keyboard') || n.includes('azoth')) return 'bi-keyboard-fill'
  if (n.includes('[pc set]') || n.includes('pc set') || n.includes('intel') || n.includes('amd')) return 'bi-pc-display-horizontal'
  return 'bi-box-seam-fill'
}

onMounted(async () => {
  window.scrollTo(0, 0)
  groupAndLoadItems()

  // เติมข้อมูลที่อยู่จัดส่งและรายละเอียดผู้ใช้อัตโนมัติ หากผู้ใช้เข้าสู่ระบบอยู่
  const savedEmail = localStorage.getItem('userEmail')
  if (savedEmail) {
    shipping.email = savedEmail
    
    // First, load user basic profile info
    try {
      const response = await axios.get(`/api/profile?email=${encodeURIComponent(savedEmail)}`)
      if (response.data.success && response.data.profile) {
        const p = response.data.profile
        shipping.fullName = [p.firstName, p.lastName].filter(Boolean).join(' ')
        shipping.phone = p.phone || ''
      }
    } catch (error) {
      console.warn('Failed to pre-fill profile data:', error)
    }

    // Load saved shipping addresses
    try {
      const addrResponse = await axios.get(`/api/addresses?email=${encodeURIComponent(savedEmail)}`)
      if (addrResponse.data.success) {
        savedAddresses.value = addrResponse.data.addresses.filter(addr => addr.type === 'shipping')
        // Find default
        const defaultAddr = savedAddresses.value.find(addr => addr.is_default === 1)
        if (defaultAddr) {
          selectedAddressId.value = defaultAddr.id
          shipping.fullName = defaultAddr.full_name
          shipping.phone = defaultAddr.phone
          shipping.address = defaultAddr.address_line
        } else if (savedAddresses.value.length > 0) {
          const firstAddr = savedAddresses.value[0]
          selectedAddressId.value = firstAddr.id
          shipping.fullName = firstAddr.full_name
          shipping.phone = firstAddr.phone
          shipping.address = firstAddr.address_line
        } else {
          selectedAddressId.value = 'new'
        }
      }
    } catch (error) {
      console.warn('Failed to load saved addresses:', error)
    }

    // Load saved payment methods
    try {
      const pmResponse = await axios.get(`/api/payment-methods?email=${encodeURIComponent(savedEmail)}`)
      if (pmResponse.data.success) {
        savedPaymentMethods.value = pmResponse.data.paymentMethods
        // Find default card
        const defaultCard = savedPaymentMethods.value.find(pm => pm.is_default === 1)
        if (defaultCard) {
          selectedPaymentMethodId.value = defaultCard.id
          payment.cardNumber = formatCardNumber(defaultCard.card_number)
          payment.cardHolder = defaultCard.card_holder
          payment.expiryDate = defaultCard.expiry_date
          payment.cardProvider = defaultCard.card_provider
          payment.method = 'card' // Pre-select card method if a default card is found!
        } else if (savedPaymentMethods.value.length > 0) {
          const firstCard = savedPaymentMethods.value[0]
          selectedPaymentMethodId.value = firstCard.id
          payment.cardNumber = formatCardNumber(firstCard.card_number)
          payment.cardHolder = firstCard.card_holder
          payment.expiryDate = firstCard.expiry_date
          payment.cardProvider = firstCard.card_provider
          payment.method = 'card'
        } else {
          selectedPaymentMethodId.value = 'new'
        }
      }
    } catch (error) {
      console.warn('Failed to load saved payment methods:', error)
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
  background: #f5f6f8;
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
  opacity: 0.025;
  mix-blend-mode: multiply;
  animation: float-blob-cart 20s infinite alternate ease-in-out;
}

.blob-blue {
  top: 15%;
  left: 5%;
  width: 400px;
  height: 400px;
  background: #0ea5e9;
}

.blob-cyan {
  bottom: 15%;
  right: 5%;
  width: 450px;
  height: 450px;
  background: #22d3ee;
  animation-delay: -5s;
}

@keyframes float-blob-cart {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(40px, -60px) scale(1.1); }
  100% { transform: translate(-30px, 40px) scale(0.95); }
}

.content-container {
  position: relative;
  z-index: 1;
}

/* Checkout Multi-Step Pills */
.checkout-steps-wrapper {
  background-color: transparent;
  padding: 1.5rem 0;
}

.step-pill {
  padding: 0.6rem 1.8rem;
  border-radius: 50px;
  font-weight: 700;
  font-size: 0.95rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 0.25rem;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03);
}

.step-pill.active {
  background-color: #0ea5e9;
  color: white !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(14, 165, 233, 0.3);
}

.step-pill.completed {
  background-color: #e6f4ea;
  color: #137333 !important;
  border: 1px solid #137333;
}

.step-pill.inactive {
  background-color: #e0f2fe;
  color: #0ea5e9 !important;
  border: 1px solid transparent;
}

.step-num {
  font-weight: 800;
}

.step-line {
  height: 2px;
  width: 60px;
  background-color: #bae6fd;
  transition: all 0.4s ease;
}

.step-line.active {
  background-color: #0ea5e9;
}

/* Main Cards Premium Glassmorphism styling */
.glass-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 1.25rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;
}

.border-glow-blue {
  position: relative;
}

.border-glow-blue::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 1.25rem;
  pointer-events: none;
  border: 1.5px solid transparent;
  transition: all 0.3s ease;
}

.border-glow-blue:hover::after {
  border-color: rgba(14, 165, 233, 0.15);
}

/* Cart item card styling */
.cart-item-card {
  background-color: #ffffff;
  border-radius: 1rem;
  border: 1px solid #edf0f4;
  transition: all 0.3s ease;
}

.cart-item-card:hover {
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.04);
  transform: translateY(-1px);
}

.product-img-wrapper {
  width: 90px;
  height: 90px;
  border-radius: 0.75rem;
  overflow: hidden;
  background: #f8fafc;
  border: 1px solid #eaedf2;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.product-icon-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f0f4f8 0%, #e8edf2 100%);
}

.product-cat-icon {
  font-size: 2rem;
  color: #64748b;
}

.product-info-wrapper {
  min-width: 0;
}

.product-title {
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.text-blue-glow {
  color: #0ea5e9 !important;
}

.product-price {
  font-size: 1.15rem;
  font-weight: 800;
}

.product-old-price {
  color: #8b96a5;
  font-weight: 500;
}

/* Quantity controls custom design */
.qty-controls {
  border: 1px solid #d3d9e2;
  border-radius: 8px;
  background: #f8fafc;
  overflow: hidden;
}

.btn-qty-minus, .btn-qty-plus {
  background: transparent;
  border: none;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9rem;
  color: #475569;
  transition: all 0.2s ease;
}

.btn-qty-minus:hover {
  background-color: #eaedf2;
}

.btn-qty-plus:hover {
  background-color: #0ea5e9;
}

.btn-qty-plus:hover i {
  color: white !important;
}

.qty-input {
  width: 40px;
  height: 32px;
  border: none;
  border-left: 1px solid #d3d9e2;
  border-right: 1px solid #d3d9e2;
  background: white;
  font-weight: 600;
  font-size: 0.9rem;
  color: #1e293b;
}

/* Hide spin buttons for inputs */
.qty-input::-webkit-outer-spin-button,
.qty-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.btn-delete-item {
  border: none;
  background: transparent;
  color: #94a3b8;
  font-size: 1.15rem;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.btn-delete-item:hover {
  background-color: #fee2e2;
  color: #ef4444;
}

/* Shipping Options design */
.shipping-option-card, .payment-option-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background-color: white;
  border-color: #eaedf2 !important;
}

.shipping-option-card:hover, .payment-option-card:hover {
  border-color: #0ea5e9 !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.shipping-option-card.active, .payment-option-card.active {
  border-color: #0ea5e9 !important;
  background-color: rgba(14, 165, 233, 0.02) !important;
  box-shadow: 0 4px 15px rgba(14, 165, 233, 0.08);
}

.option-radio-circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.shipping-option-card.active .option-radio-circle {
  border-color: #0ea5e9;
}

.inner-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: transparent;
  transition: all 0.2s ease;
}

.shipping-option-card.active .inner-dot {
  background-color: #0ea5e9;
}

.option-icon-box {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background-color: #e0f2fe;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* Form Styling */
.form-input {
  border: 1px solid #d3d9e2;
  border-radius: 10px;
  padding: 0.65rem 1rem;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.form-input:focus {
  border-color: #0ea5e9;
  box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.1) !important;
}

.form-textarea {
  border: 1px solid #d3d9e2;
  border-radius: 12px;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.form-textarea:focus {
  border-color: #0ea5e9;
  box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.1) !important;
}

.alert-success-custom {
  background-color: #e6f4ea;
  color: #137333;
}

/* Step 3: Payment styling */
.installment-term-card {
  background-color: white;
  border-color: #eaedf2 !important;
  transition: all 0.2s ease;
}

.installment-term-card:hover {
  border-color: #0ea5e9 !important;
}

.installment-term-card.active {
  border-color: #0ea5e9 !important;
  background-color: #e0f2fe !important;
}

.qr-placeholder-box {
  width: 160px;
  height: 160px;
  border-radius: 0.75rem;
}

/* Order Summary sidebar */
.order-summary-sidebar {
  transition: top 0.3s ease;
}

.btn-blue-glow {
  background: linear-gradient(135deg, #0ea5e9, #2563eb);
  color: white;
  border: none;
  font-weight: 700;
  transition: all 0.3s ease;
}

.btn-blue-glow:hover {
  background: linear-gradient(135deg, #0284c7, #1d4ed8);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(14, 165, 233, 0.35);
  color: white;
}

.btn-blue-glow:active {
  transform: translateY(0);
}

.btn-outline-blue {
  color: #0ea5e9;
  border-color: #0ea5e9;
  transition: all 0.3s ease;
}

.btn-outline-blue:hover {
  background-color: #0ea5e9;
  color: white;
}

.trust-point-item i {
  color: #475569;
}

/* Empty State custom styling */
.empty-icon-wrapper {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background-color: #e0f2fe;
  color: #0ea5e9;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Success Card customization */
.success-circle {
  width: 90px;
  height: 90px;
  background: linear-gradient(135deg, #137333, #2e7d32);
  box-shadow: 0 10px 25px rgba(19, 115, 51, 0.3);
}

.order-receipt-card {
  border: 1px solid #eaedf2 !important;
}

/* Utility Animations */
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}

.cursor-pointer {
  cursor: pointer;
}

.fs-9 {
  font-size: 0.75rem;
}
.fs-8 {
  font-size: 0.85rem;
}
.fs-7 {
  font-size: 0.95rem;
}

/* Toast Custom Alert */
.toast-custom {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(10px) !important;
  border-left: 4px solid #0ea5e9 !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15) !important;
  width: 320px;
}

.toast-container {
  z-index: 2000;
}

.btn-close-custom {
  background: transparent;
  border: none;
  color: #64748b;
  font-size: 1.1rem;
}

/* Transitions */
.toast-fade-enter-active, .toast-fade-leave-active {
  transition: all 0.3s ease;
}
.toast-fade-enter-from, .toast-fade-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}

/* Custom Saved Address and Saved Payment Selector Styles */
.address-select-card {
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid #e2e8f0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.address-select-card:hover {
  border-color: #0ea5e9;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.05);
}

.address-select-card.active {
  border-color: #0ea5e9 !important;
  background: rgba(14, 165, 233, 0.03) !important;
  box-shadow: 0 4px 15px rgba(14, 165, 233, 0.1);
}

.address-select-card .inner-dot {
  background-color: transparent;
}

.address-select-card .inner-dot.bg-blue-glow {
  background-color: #0ea5e9;
  box-shadow: 0 0 8px rgba(14, 165, 233, 0.8);
}

.border-dashed {
  border-style: dashed !important;
}

/* Card select card design */
.card-select-card {
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: white;
  min-height: 100px;
}

.card-select-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.card-select-card.active {
  border-color: #ffffff !important;
  box-shadow: 0 8px 25px rgba(14, 165, 233, 0.25), inset 0 0 0 1px rgba(255, 255, 255, 0.3);
}

/* Card Skins */
.card-theme-visa {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
}

.card-theme-mastercard {
  background: linear-gradient(135deg, #7f1d1d 0%, #ea580c 100%);
}

.card-theme-americanexpress {
  background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
}

.card-theme-jcb {
  background: linear-gradient(135deg, #0f172a 0%, #0d9488 100%);
}

.card-theme-default {
  background: linear-gradient(135deg, #334155 0%, #1e293b 100%);
}

.bg-primary-glow {
  background-color: #0ea5e9;
  box-shadow: 0 0 10px rgba(14, 165, 233, 0.5);
}

.bg-white-translucent {
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}

.text-secondary-custom {
  color: #64748b !important;
}

.bg-secondary {
  background-color: #f1f5f9 !important;
}

.text-white-50 {
  color: rgba(255, 255, 255, 0.6) !important;
}

.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
