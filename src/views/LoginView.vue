<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <div class="logo">
          <img src="/logo.svg" alt="해줌" class="logo-image" />
          <h1 class="logo-text">해줌 에너지 모니터링</h1>
        </div>
        <p class="login-subtitle">에너지 효율성을 위한 스마트 대시보드</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="username" class="form-label">아이디</label>
          <input
            id="username"
            v-model="form.username"
            type="text"
            class="form-input"
            placeholder="아이디를 입력하세요"
            required
            :disabled="authStore.loading"
          />
        </div>

        <div class="form-group">
          <label for="password" class="form-label">비밀번호</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            class="form-input"
            placeholder="비밀번호를 입력하세요"
            required
            :disabled="authStore.loading"
          />
        </div>

        <div class="form-options">
          <label class="checkbox-container">
            <input v-model="form.rememberMe" type="checkbox" />
            <span class="checkmark"></span>
            로그인 상태 유지
          </label>
        </div>

        <button
          type="submit"
          class="login-button"
          :disabled="authStore.loading"
          :class="{ loading: authStore.loading }"
        >
          <span v-if="!authStore.loading">로그인</span>
          <span v-else class="loading-text">
            <div class="spinner"></div>
            로그인 중...
          </span>
        </button>

        <div v-if="authStore.error" class="error-message">
          {{ authStore.error }}
        </div>
      </form>

      <div class="login-footer">
        <div class="demo-info">
          <h3>데모 계정</h3>
          <p>아이디: <strong>admin</strong></p>
          <p>비밀번호: <strong>password</strong></p>
        </div>
        <div class="footer-links">
          <a href="#" class="footer-link">비밀번호 찾기</a>
          <span class="divider">|</span>
          <a href="#" class="footer-link">고객지원</a>
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
    router.push('/main')
  }
}
</script>

<style scoped>
/* 모든 화면 크기에서 전체 화면을 차지하도록 설정 */
.login-container {
  min-height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #E16349 0%, #F0BBB1 100%);
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

/* 모든 디바이스에서 전체 너비 사용 */
.login-card {
  background: #FFFFFF;
  border-radius: 0;
  box-shadow: none;
  padding: 32px 24px;
  width: 100%;
  max-width:500px;
  height: 95vh;
  animation: slideUp 0.6s ease-out;
  border: none;
  display: flex;
  border-radius: 12px;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-header {
  text-align: center;
  /* margin-bottom: 40px; */
}

.logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.logo-image {
  width: 80px;
  height: 80px;
}

.logo-text {
  font-size: 28px;
  font-weight: 700;
  color: #000000;
  margin: 0;
  line-height: 1.2;
}

.login-subtitle {
  color: #7F7F7F;
  font-size: 16px;
  margin: 0;
  line-height: 1.4;
}

.login-form {
  margin-bottom: 4px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #000000;
  font-size: 16px;
}

.form-input {
  width: 100%;
  padding: 16px 20px;
  border: 2px solid #D0D0D0;
  border-radius: 12px;
  font-size: 18px;
  transition: all 0.2s ease;
  box-sizing: border-box;
  background: #FFFFFF;
}

.form-input:focus {
  outline: none;
  border-color: #E16349;
  box-shadow: 0 0 0 3px rgba(225, 99, 73, 0.1);
}

.form-input:disabled {
  background-color: #F8F8F8;
  cursor: not-allowed;
  color: #7F7F7F;
}

.form-options {
  margin-bottom: 32px;
}

.checkbox-container {
  display: flex;
  align-items: center;
  font-size: 16px;
  color: #424242;
  cursor: pointer;
  user-select: none;
}

.checkbox-container input {
  margin-right: 12px;
  transform: scale(1.2);
}

.login-button {
  width: 100%;
  padding: 18px 20px;
  background: linear-gradient(135deg, #E16349 0%, #F0BBB1 100%);
  color: #FFFFFF;
  border: none;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  /* margin-bottom: 24px; */
}

.login-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(225, 99, 73, 0.3);
  background: #E16349;
}

.login-button:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.loading-text {
  display: flex;
  align-items: center;
  gap: 12px;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid #FFFFFF;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-message {
  margin-bottom: 24px;
  padding: 16px;
  background-color: #F7EBEB;
  border: 1px solid #F0BBB1;
  border-radius: 12px;
  color: #E16349;
  font-size: 16px;
  text-align: center;
}

.login-footer {
  text-align: center;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
}

.demo-info {
  background-color: #F8F8F8;
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 24px;
  border: 1px solid #EFEFEF;
}

.demo-info h3 {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
  color: #000000;
}

.demo-info p {
  margin: 6px 0;
  font-size: 15px;
  color: #7F7F7F;
}

.demo-info strong {
  color: #424242;
}

.footer-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.footer-link {
  color: #E16349;
  text-decoration: none;
  font-size: 16px;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: #F0BBB1;
  text-decoration: underline;
}

.divider {
  color: #D0D0D0;
}

/* PC에서 더 큰 로고와 폰트 크기 */
@media (min-width: 1024px) {
  .logo-image {
    width: 120px;
    height: 120px;
  }
  
  .logo-text {
    font-size: 36px;
  }
  
  .login-subtitle {
    font-size: 18px;
  }
  
  .form-label {
    font-size: 18px;
  }
  
  .form-input {
    padding: 20px 24px;
    font-size: 20px;
    border-radius: 16px;
  }
  
  .checkbox-container {
    font-size: 18px;
  }
  
  .login-button {
    padding: 20px 24px;
    font-size: 20px;
    border-radius: 16px;
  }
  
  .demo-info {
    padding: 12px;
    border-radius: 16px;
  }
  
  .demo-info h3 {
    font-size: 18px;
  }
  
  .demo-info p {
    font-size: 16px;
  }
  
  .footer-link {
    font-size: 18px;
  }
  
  .login-form,
  .login-footer {
    max-width: 600px;
  }
}

/* 매우 큰 화면에서는 더 큰 크기로 */
@media (min-width: 1440px) {
  .login-form,
  .login-footer {
    max-width: 700px;
  }
  
  .logo-image {
    width: 140px;
    height: 140px;
  }
  
  .logo-text {
    font-size: 42px;
  }
}
</style>