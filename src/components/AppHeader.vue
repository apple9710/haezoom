<template>
  <header class="app-header" v-if="shouldShowHeader">
    <div class="header-content">
      <div class="header-left">
        <button 
          v-if="showBackButton" 
          @click="goBack" 
          class="back-btn"
        >
          <span class="back-icon">←</span>
          <span class="back-text">뒤로가기</span>
        </button>
        <div class="logo-section">
          <!-- <div class="header-logo">
            <div class="logo-icon">⚡</div>
          </div> -->
          <h1 class="header-title">{{ pageTitle }}</h1>
        </div>
      </div>
      
      <div class="header-center">
        <ul class="menu_list">
          <li>메뉴1</li>
          <li>메뉴2</li>

        </ul>
      </div>

      <div class="header-right" v-if="authStore.isAuthenticated">
        <div class="user-info">
          <div class="user-avatar">
            <span>{{ getUserInitials() }}</span>
          </div>
          <div class="user-details">
            <span class="user-name">{{ authStore.user?.name || 'ADMIN' }}님</span>
            <span class="user-role">{{ authStore.user?.role || '관리자' }}</span>
          </div>
        </div>
        <button @click="handleLogout" class="logout-btn">
          <span>로그아웃</span>
          <span class="logout-icon">→</span>
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
      return '실시간 대시보드'
    default:
      return '해줌 에너지 모니터링'
  }
})

// 사용자 이니셜 가져오기
const getUserInitials = () => {
  const name = authStore.user?.name || 'ADMIN'
  return name.charAt(0).toUpperCase()
}

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
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  position: fixed;
  border-radius:999px;
  top: 1%;
  left: 50%;
  transform:TranslateX(-50%);

  /* right: 0; */
  z-index: 1000;
  width: 100%;
  max-width:80vw;
  transition: all 0.3s ease;
}

.header-content {
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  box-sizing: border-box;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 24px;
  /* flex: 1; */
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: rgba(225, 99, 73, 0.1);
  border: 1px solid rgba(225, 99, 73, 0.2);
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-primary);
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  font-family: inherit;
}

.back-btn:hover {
  background: rgba(225, 99, 73, 0.15);
  border-color: rgba(225, 99, 73, 0.3);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(225, 99, 73, 0.2);
}

.back-icon {
  font-size: 16px;
  transition: transform 0.3s ease;
}

.back-btn:hover .back-icon {
  transform: translateX(-2px);
}

.back-text {
  font-family: inherit;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-logo {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(225, 99, 73, 0.3);
  transition: all 0.3s ease;
}

.header-logo:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(225, 99, 73, 0.4);
}

.logo-icon {
  font-size: 24px;
  color: white;
  font-weight: bold;
}

.header-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-font-primary);
  margin: 0;
  letter-spacing: -0.5px;
  background: linear-gradient(135deg, var(--color-font-primary) 0%, var(--color-gray) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.user-info:hover {
  background: rgba(255, 255, 255, 0.7);
  border-color: rgba(255, 255, 255, 0.5);
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(225, 99, 73, 0.3);
}

.user-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.user-name {
  font-weight: 600;
  color: var(--color-font-primary);
  font-size: 14px;
  line-height: 1.2;
}

.user-role {
  font-size: 12px;
  color: var(--color-font-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
  color: var(--color-font-white);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(225, 99, 73, 0.3);
  font-family: inherit;
}

.logout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(225, 99, 73, 0.4);
  background: linear-gradient(135deg, #d45740 0%, #e8a89a 100%);
}

.logout-icon {
  font-size: 16px;
  transition: transform 0.3s ease;
}

.logout-btn:hover .logout-icon {
  transform: translateX(2px);
}

/* 스크롤시 헤더 스타일 변경 (선택사항) */
@media (prefers-reduced-motion: no-preference) {
  .app-header {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

/* 모바일 반응형 */
@media (max-width: 1024px) {
  .header-content {
    padding: 14px 20px;
  }
  
  .user-details {
    display: none;
  }
  
  .user-info {
    padding: 8px;
  }
}

@media (max-width: 768px) {
  .header-content {
    padding: 12px 16px;
    gap: 16px;
  }
  
  .header-left {
    gap: 16px;
  }
  
  .header-title {
    font-size: 20px;
  }
  
  .header-logo {
    width: 40px;
    height: 40px;
  }
  
  .logo-icon {
    font-size: 20px;
  }
  
  .back-btn {
    padding: 10px 16px;
    font-size: 13px;
  }
  
  .logout-btn {
    padding: 10px 16px;
    font-size: 13px;
  }
  
  .back-text {
    display: none;
  }
}

@media (max-width: 480px) {
  .header-content {
    padding: 10px 12px;
  }
  
  .header-title {
    font-size: 16px;
  }
  
  .header-logo {
    width: 36px;
    height: 36px;
  }
  
  .logo-icon {
    font-size: 18px;
  }
  
  .user-avatar {
    width: 32px;
    height: 32px;
    font-size: 12px;
  }
  
  .back-btn {
    padding: 8px 12px;
  }
  
  .logout-btn {
    padding: 8px 12px;
  }
  
  .logout-btn span:first-child {
    display: none;
  }
  
  .header-right {
    gap: 12px;
  }
}
</style>