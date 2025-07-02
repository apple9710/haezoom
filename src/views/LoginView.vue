<template>
  <div class="login-container">
    <!-- 배경 애니메이션 요소들 -->
    <div class="background-elements">
      <div class="floating-element element-1"></div>
      <div class="floating-element element-2"></div>
      <div class="floating-element element-3"></div>
      <div class="floating-element element-4"></div>
    </div>

    <div class="login-card">
      <div class="glass-overlay"></div>
      
      <div class="login-content">
        <div class="login-header">
          <div class="logo">
            <div class="logo-circle">
              <img src="/logo.svg" alt="해줌" class="logo-image" />
            </div>
            <h1 class="logo-text">해줌</h1>
            <p class="logo-subtitle">Energy Monitoring</p>
          </div>
          <p class="login-description">에너지 효율성을 위한 스마트 대시보드</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <div class="input-wrapper">
              <input
                id="username"
                v-model="form.username"
                type="text"
                class="form-input"
                placeholder="아이디를 입력하세요"
                required
                :disabled="authStore.loading"
              />
              <div class="input-overlay"></div>
            </div>
          </div>

          <div class="form-group">
            <div class="input-wrapper">
              <input
                id="password"
                v-model="form.password"
                type="password"
                class="form-input"
                placeholder="비밀번호를 입력하세요"
                required
                :disabled="authStore.loading"
              />
              <div class="input-overlay"></div>
            </div>
          </div>

          <div class="form-options">
            <label class="checkbox-container">
              <input v-model="form.rememberMe" type="checkbox" class="checkbox-input" />
              <div class="custom-checkbox">
                <svg class="check-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
              <span class="checkbox-label">로그인 상태 유지</span>
            </label>
          </div>

          <button
            type="submit"
            class="login-button"
            :disabled="authStore.loading"
            :class="{ loading: authStore.loading }"
          >
            <div class="button-overlay"></div>
            <span v-if="!authStore.loading" class="button-text">로그인</span>
            <span v-else class="loading-text">
              <div class="spinner"></div>
              로그인 중...
            </span>
          </button>

          <div v-if="authStore.error" class="error-message">
            <div class="error-overlay"></div>
            <span class="error-text">{{ authStore.error }}</span>
          </div>
        </form>

        <div class="login-footer">
          <div class="demo-info">
            <div class="demo-overlay"></div>
            <div class="demo-content">
              <h3>데모 계정</h3>
              <div class="demo-credentials">
                <div class="credential-item">
                  <span class="credential-label">아이디:</span>
                  <span class="credential-value">admin</span>
                </div>
                <div class="credential-item">
                  <span class="credential-label">비밀번호:</span>
                  <span class="credential-value">password</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="footer-links">
            <a href="#" class="footer-link">비밀번호 찾기</a>
            <div class="divider"></div>
            <a href="#" class="footer-link">고객지원</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  username: '',
  password: '',
  rememberMe: false
})

const handleLogin = async () => {
  const result = await authStore.login({
    username: form.username,
    password: form.password
  })
  
  if (result.success) {
    router.push('/dashboard')
  }
}
</script>

<style scoped>
/* 기본 컨테이너 스타일 */
.login-container {
  min-height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #E16349 0%, #F0BBB1 50%, #F3D7D0 100%);
  padding: 20px;
  margin: 0;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
}

/* 배경 애니메이션 요소들 */
.background-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.floating-element {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
}

.element-1 {
  width: 80px;
  height: 80px;
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.element-2 {
  width: 120px;
  height: 120px;
  top: 60%;
  right: 15%;
  animation-delay: 2s;
}

.element-3 {
  width: 60px;
  height: 60px;
  bottom: 30%;
  left: 20%;
  animation-delay: 4s;
}

.element-4 {
  width: 100px;
  height: 100px;
  top: 10%;
  right: 30%;
  animation-delay: 1s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.5;
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
    opacity: 0.8;
  }
}

/* Glassmorphism 로그인 카드 */
.login-card {
  position: relative;
  width: 100%;
  max-width: 480px;
  min-height: 600px;
  border-radius: 32px;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  overflow: hidden;
  z-index: 2;
  animation: slideUp 0.8s ease-out;
}

.glass-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  z-index: -1;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(50px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.login-content {
  padding: 40px 32px 32px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 600px;
  box-sizing: border-box;
}

/* 헤더 스타일 */
.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.logo-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  animation: logoFloat 3s ease-in-out infinite;
}

@keyframes logoFloat {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px);
  }
}

.logo-image {
  width: 60px;
  height: 60px;
  filter: brightness(0) invert(1);
}

.logo-text {
  font-size: 36px;
  font-weight: 700;
  color: #FFFFFF;
  margin: 0;
  line-height: 1;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo-subtitle {
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.login-description {
  color: rgba(255, 255, 255, 0.9);
  font-size: 16px;
  margin: 0;
  line-height: 1.4;
  font-weight: 400;
}

/* 폼 스타일 */
.login-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 24px;
}

.form-group {
  position: relative;
}

.input-wrapper {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
}

.input-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  pointer-events: none;
  z-index: -1;
}

.form-input {
  width: 100%;
  padding: 18px 24px;
  border: none;
  border-radius: 20px;
  font-size: 16px;
  background: transparent;
  color: #FFFFFF;
  transition: all 0.3s ease;
  box-sizing: border-box;
  position: relative;
  z-index: 1;
}

.form-input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.form-input:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
}

.form-input:focus + .input-overlay {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
}

.form-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 체크박스 스타일 */
.form-options {
  display: flex;
  justify-content: center;
}

.checkbox-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  gap: 12px;
}

.checkbox-input {
  display: none;
}

.custom-checkbox {
  width: 24px;
  height: 24px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.check-icon {
  width: 16px;
  height: 16px;
  color: #FFFFFF;
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.3s ease;
}

.checkbox-input:checked + .custom-checkbox {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
}

.checkbox-input:checked + .custom-checkbox .check-icon {
  opacity: 1;
  transform: scale(1);
}

.checkbox-label {
  color: rgba(255, 255, 255, 0.9);
  font-size: 15px;
  font-weight: 400;
}

/* 로그인 버튼 */
.login-button {
  position: relative;
  width: 100%;
  padding: 20px;
  border: none;
  border-radius: 20px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #E16349;
  background: transparent;
  overflow: hidden;
}

.button-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  z-index: -1;
  transition: all 0.3s ease;
}

.button-text {
  position: relative;
  z-index: 1;
}

.login-button:hover:not(:disabled) .button-overlay {
  background: rgba(255, 255, 255, 1);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.login-button:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.loading-text {
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  z-index: 1;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid #E16349;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 에러 메시지 */
.error-message {
  position: relative;
  padding: 16px 20px;
  border-radius: 16px;
  text-align: center;
  overflow: hidden;
}

.error-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(241, 235, 235, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(225, 99, 73, 0.3);
  border-radius: 16px;
  z-index: -1;
}

.error-text {
  color: #E16349;
  font-size: 15px;
  font-weight: 500;
  position: relative;
  z-index: 1;
}

/* 푸터 */
.login-footer {
  text-align: center;
  margin-top: 32px;
}

.demo-info {
  position: relative;
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 24px;
  overflow: hidden;
}

.demo-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  z-index: -1;
}

.demo-content {
  position: relative;
  z-index: 1;
}

.demo-info h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #FFFFFF;
}

.demo-credentials {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.credential-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.credential-label {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
}

.credential-value {
  color: #FFFFFF;
  font-weight: 600;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.1);
  padding: 4px 12px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.footer-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.footer-link {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-size: 15px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.footer-link:hover {
  color: #FFFFFF;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
}

.divider {
  width: 1px;
  height: 16px;
  background: rgba(255, 255, 255, 0.3);
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .login-container {
    padding: 16px;
  }
  
  .login-card {
    max-width: 100%;
    border-radius: 24px;
    min-height: auto;
  }
  
  .login-content {
    padding: 32px 24px;
    min-height: auto;
  }
  
  .logo-circle {
    width: 80px;
    height: 80px;
  }
  
  .logo-image {
    width: 48px;
    height: 48px;
  }
  
  .logo-text {
    font-size: 28px;
  }
  
  .login-description {
    font-size: 15px;
  }
  
  .form-input {
    padding: 16px 20px;
    font-size: 15px;
  }
  
  .login-button {
    padding: 18px;
    font-size: 16px;
  }
}

@media (min-width: 1024px) {
  .login-card {
    max-width: 520px;
  }
  
  .login-content {
    padding: 48px 40px;
  }
  
  .logo-circle {
    width: 120px;
    height: 120px;
  }
  
  .logo-image {
    width: 72px;
    height: 72px;
  }
  
  .logo-text {
    font-size: 42px;
  }
  
  .login-description {
    font-size: 18px;
  }
  
  .form-input {
    padding: 20px 28px;
    font-size: 17px;
  }
  
  .login-button {
    padding: 22px;
    font-size: 19px;
  }
}

/* 매우 큰 화면 대응 */
@media (min-width: 1440px) {
  .login-card {
    max-width: 600px;
  }
  
  .logo-circle {
    width: 140px;
    height: 140px;
  }
  
  .logo-image {
    width: 84px;
    height: 84px;
  }
  
  .logo-text {
    font-size: 48px;
  }
}
</style>