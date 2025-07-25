<template>
  <div class="login-container">
      <div class="demo-info">
        <div class="demo-overlay"></div>
        <div class="demo-content">
          <h3>테스트 계정</h3>
          <div class="demo-accounts">
            <div class="account-group">
              <h4>최고 관리자</h4>
              <div class="credential-item">
                <span class="credential-label">ID:</span>
                <span class="credential-value">admin</span>
                <span class="credential-label">PW:</span>
                <span class="credential-value">admin</span>
              </div>
            </div>
            <div class="account-group">
              <h4>관리자</h4>
              <div class="credential-item">
                <!-- <span class="credential-label">ID:</span>
                <span class="credential-value">haezoom</span>
                <span class="credential-label">PW:</span>
                <span class="credential-value">123456</span> -->
              </div>
            </div>
            <div class="account-group">
              <h4>일반 사용자</h4>
              <div class="credential-item">
                <span class="credential-label">ID:</span>
                <span class="credential-value">test1234</span>
                <span class="credential-label">PW:</span>
                <span class="credential-value">test!23</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    <div class="login-card">
      <div class="glass-overlay"></div>
      
      <div class="login-content">
        <div class="login-header">
          <div class="logo">
            <div class="logo-circle">
              <img src="@/assets/images/haezoom_logo.svg" alt="해줌" class="logo-image" />
            </div>
            <h1 class="logo-text">에너지 모니터링</h1>
            <!-- <p class="logo-subtitle">Energy Monitoring</p> -->
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
    // 사용자 역할에 따라 페이지 이동
    const user = authStore.user
    console.log('로그인한 사용자 정보:', user)
    if (user && (user.role === 'admin' || user.role === 'manager')) {
      console.log('관리자/매니저로 인식, /admin으로 이동')
      router.push('/admin')
    } else {
      console.log('일반 사용자로 인식, /dashboard로 이동')
      router.push('/dashboard')
    }
  }
}
</script>

<style scoped>
@import './LoginView-styles.css';
</style>
