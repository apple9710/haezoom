<template>
  <header class="app-header" v-if="shouldShowHeader">
    <div class="header-content">
      <div class="header-left">
        <button 
          v-if="showBackButton" 
          @click="goBack" 
          class="back-btn"
        >
          ← 뒤로가기
        </button>
        <div class="logo-section">
          <img src="/logo.svg" alt="해줌" class="header-logo" />
          <h1 class="header-title">{{ pageTitle }}</h1>
        </div>
      </div>
      
      <div class="header-right" v-if="authStore.isAuthenticated">
        <div class="user-info">
          <span class="user-name">{{ authStore.user?.name || 'ADMIN' }}님</span>
          <span class="user-role">{{ authStore.user?.role || '관리자' }}</span>
        </div>
        <button @click="handleLogout" class="logout-btn">
          로그아웃
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// 헤더를 보여줄지 결정
const shouldShowHeader = computed(() => {
  return route.name !== 'Login'
})

// 뒤로가기 버튼을 보여줄지 결정
const showBackButton = computed(() => {
  return route.name === 'Dashboard'
})

// 페이지 제목 결정
const pageTitle = computed(() => {
  switch (route.name) {
    case 'Main':
      return '해줌 에너지 모니터링'
    case 'Dashboard':
      return '대시보드'
    default:
      return '해줌 에너지 모니터링'
  }
})

// 뒤로가기
const goBack = () => {
  if (route.name === 'Dashboard') {
    router.push('/main')
  } else {
    router.go(-1)
  }
}

// 로그아웃
const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.app-header {
  background: var(--color-bg-white);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: fixed;

  top: 0;
  z-index: 100;
  width: 100%;
}

.header-content {
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.back-btn {
  padding: 12px 20px;
  background: var(--color-gray-light);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  color: var(--color-font-primary);
  transition: all 0.2s ease;
}

.back-btn:hover {
  background: var(--color-gray);
  color: var(--color-font-white);
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-logo {
  width: 50px;
  height: 50px;
}

.header-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-font-primary);
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.user-name {
  font-weight: 600;
  color: var(--color-font-primary);
  font-size: 16px;
}

.user-role {
  font-size: 14px;
  color: var(--color-font-secondary);
  text-transform: uppercase;
}

.logout-btn {
  padding: 12px 20px;
  background: var(--color-primary);
  color: var(--color-font-white);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.logout-btn:hover {
  background: var(--color-primary-light);
  transform: translateY(-1px);
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .header-content {
    padding: 16px 20px;
    flex-direction: column;
    gap: 16px;
  }
  
  .header-title {
    font-size: 24px;
  }
  
  .header-logo {
    width: 40px;
    height: 40px;
  }
  
  .user-section {
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .header-left {
    flex-direction: column;
    gap: 12px;
    align-items: center;
  }
  
  .back-btn {
    align-self: flex-start;
  }
  
  .header-title {
    font-size: 20px;
  }
}
</style>