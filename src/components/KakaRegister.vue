<template>
  <div class="login-container">
    <div class="login-split">
      <!-- Left Side: Branding / Visuals -->
      <div class="login-visual">
        <div class="brand">
          <svg class="logo" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <h1>TechGear</h1>
        </div>
        <div class="visual-content">
          <h2>Join TechGear</h2>
          <p>Create an account to unlock the ultimate premium experience.</p>
        </div>
        
        <!-- Animated Background Elements -->
        <div class="glowing-orb orb-1"></div>
        <div class="glowing-orb orb-2"></div>
        <div class="grid-overlay"></div>
      </div>

      <!-- Right Side: Register Form -->
      <div class="login-form-container">
        <div class="form-wrapper">
          <h2 class="form-title">Create Account</h2>
          <p class="form-subtitle">Fill in the details to get started</p>

          <form @submit.prevent="handleRegister" class="auth-form">
            <div class="input-group">
              <label for="email">Email</label>
              <div class="input-wrapper">
                <input 
                  type="email" 
                  id="email" 
                  v-model="email" 
                  placeholder="Enter your email"
                  required
                  autocomplete="email"
                />
                <i class="input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </i>
              </div>
            </div>

            <div class="input-group">
              <label for="password">Password</label>
              <div class="input-wrapper">
                <input 
                  type="password" 
                  id="password" 
                  v-model="password" 
                  placeholder="Create a password"
                  required
                  autocomplete="new-password"
                />
                <i class="input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </i>
              </div>
            </div>
            
            <div class="input-group">
              <label for="confirmPassword">Confirm Password</label>
              <div class="input-wrapper">
                <input 
                  type="password" 
                  id="confirmPassword" 
                  v-model="confirmPassword" 
                  placeholder="Confirm your password"
                  required
                  autocomplete="new-password"
                />
                <i class="input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </i>
              </div>
            </div>

            <button type="submit" class="submit-btn" :disabled="isLoading">
              <span v-if="!isLoading">Sign Up</span>
              <span v-else class="loader"></span>
            </button>
          </form>

          <p class="signup-prompt">
            Already have an account? <router-link to="/login">Sign in here</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// นำเข้าโมดูลที่จำเป็นสำหรับการสมัครสมาชิก
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

// ตัวแปรเก็บข้อมูลฟอร์มและสถานะการโหลด
const email = ref('') // เก็บอีเมลผู้ใช้ใหม่
const password = ref('') // เก็บรหัสผ่าน
const confirmPassword = ref('') // เก็บรหัสผ่านสำหรับยืนยัน
const isLoading = ref(false) // สถานะระหว่างการส่งข้อมูล (แสดง Loading)
const router = useRouter() // ตัวจัดการเส้นทาง (Router) ของ Vue

// ฟังก์ชันจัดการการสมัครสมาชิก
const handleRegister = async () => {
  // ตรวจสอบว่ารหัสผ่านและการยืนยันรหัสผ่านตรงกันหรือไม่
  if (password.value !== confirmPassword.value) {
    alert("Passwords do not match!")
    return
  }

  isLoading.value = true // เปิดสถานะกำลังโหลด
  
  try {
    // ส่งข้อมูลอีเมลและรหัสผ่านไปบันทึกที่ API ฝั่ง Backend
    const response = await axios.post('/api/register', {
      email: email.value,
      password: password.value
    });

    // หากระบบหลังบ้านตอบกลับว่าสร้างบัญชีสำเร็จ
    if (response.data.success) {
      alert('Account created successfully! Please login.') // แจ้งเตือนความสำเร็จ
      router.push('/login') // พากลับไปหน้าเข้าสู่ระบบ
    }
  } catch (error) {
    // กรณีเกิดข้อผิดพลาด เช่น อีเมลซ้ำในระบบ หรือเซิร์ฟเวอร์ไม่ตอบสนอง
    console.error('Registration error:', error)
    alert(error.response?.data?.message || 'Failed to create account. Email might already exist.')
  } finally {
    // ปิดสถานะการโหลดเสมอ
    isLoading.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

* { box-sizing: border-box; }

.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8fafc;
  font-family: 'Inter', sans-serif;
  color: #1e293b;
  padding: 2rem;
}

.login-split {
  display: flex;
  width: 100%;
  max-width: 1200px;
  min-height: 700px;
  background-color: #ffffff;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.05), 0 0 100px rgba(14, 165, 233, 0.05);
  border: 1px solid #e2e8f0;
}

/* Left Side - Visuals */
.login-visual {
  flex: 1;
  position: relative;
  background: linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%);
  padding: 4rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
}

.brand {
  display: flex;
  align-items: center;
  gap: 1rem;
  z-index: 10;
}

.logo {
  width: 40px;
  height: 40px;
  color: #ffffff;
}

.brand h1 {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
  color: #ffffff;
}

.visual-content {
  z-index: 10;
  margin-top: auto;
  margin-bottom: 2rem;
}

.visual-content h2 {
  font-size: 3rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  line-height: 1.1;
  color: #ffffff;
}

.visual-content p {
  font-size: 1.1rem;
  color: #e0f2fe;
  line-height: 1.6;
  max-width: 400px;
}

/* Glowing Orbs */
.glowing-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  z-index: 1;
  opacity: 0.5;
}

.orb-1 {
  width: 300px;
  height: 300px;
  background-color: #38bdf8;
  top: -100px;
  left: -100px;
  animation: float 10s infinite ease-in-out alternate;
}

.orb-2 {
  width: 400px;
  height: 400px;
  background-color: #60a5fa;
  bottom: -150px;
  right: -100px;
  animation: float 12s infinite ease-in-out alternate-reverse;
}

.grid-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 30px 30px;
  z-index: 2;
  opacity: 0.5;
}

@keyframes float {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(30px, 50px) scale(1.1); }
}

/* Right Side - Form */
.login-form-container {
  flex: 1;
  padding: 4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #ffffff;
  z-index: 10;
}

.form-wrapper {
  max-width: 400px;
  width: 100%;
  margin: 0 auto;
}

.form-title {
  font-size: 2rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: #0f172a;
}

.form-subtitle {
  color: #64748b;
  margin: 0 0 2.5rem 0;
  font-size: 0.95rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #475569;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper input {
  width: 100%;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 0.875rem 1rem 0.875rem 3rem;
  color: #1e293b;
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.3s ease;
  outline: none;
}

.input-wrapper input:focus {
  border-color: #0ea5e9;
  box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.1);
  background-color: #ffffff;
}

.input-wrapper input::placeholder {
  color: #94a3b8;
}

.input-icon {
  position: absolute;
  left: 1rem;
  color: #94a3b8;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s ease;
}

.input-wrapper input:focus + .input-icon {
  color: #0ea5e9;
}

/* Submit Button */
.submit-btn {
  background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%);
  color: #ffffff;
  border: none;
  border-radius: 12px;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 52px;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.25);
}

.submit-btn:active {
  transform: translateY(0);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Loader */
.loader {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #ffffff;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Signup Prompt */
.signup-prompt {
  text-align: center;
  margin-top: 2rem;
  color: #64748b;
  font-size: 0.95rem;
}

.signup-prompt a {
  color: #0ea5e9;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
}

.signup-prompt a:hover {
  color: #0284c7;
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 900px) {
  .login-split {
    flex-direction: column;
  }
  
  .login-visual {
    padding: 3rem 2rem;
    min-height: 300px;
  }
  
  .visual-content h2 {
    font-size: 2.5rem;
  }
  
  .login-form-container {
    padding: 3rem 2rem;
  }
}

@media (max-width: 480px) {
  .login-container {
    padding: 1rem;
  }
  
  .login-visual {
    display: none;
  }
}
</style>
