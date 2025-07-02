<template>
  <header class="app-header" v-if="shouldShowHeader">
    <div class="header-content">
      <div class="header-left">
        <button v-if="showBackButton" @click="goBack" class="back-btn">
          <span class="back-icon">←</span>
          <span class="back-text">뒤로가기</span>
        </button>
        <div class="logo-section">
          <h1 class="header-title">{{ pageTitle }}</h1>
        </div>
      </div>

      <div class="header-center">


        <button
          v-if="route.name === 'Dashboard' && isEditMode"
          @click="toggleSidebar"
          class="sidebar-toggle-btn"
          :class="{ active: sidebarOpen }"
        >
          <span class="toggle-icon">☰</span>
          <span class="toggle-text">위젯 메뉴</span>
        </button>
        <ul class="top-menu"
          v-else
        >
          <li v-if="route.name ==='Dashboard'" class="active">
            <a class="top-menu-item" href="#">대시보드</a>
          </li>
          <li>
            <a class="top-menu-item" href="#">공조기</a>
          </li>
          <li>
            <a class="top-menu-item" href="#">공조기</a>
          </li>
          <li>
            <a class="top-menu-item" href="#">공조기</a>
          </li>
          <li>
            <a class="top-menu-item" href="#">공조기</a>
          </li>
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

        <!-- 대시보드 편집 관련 버튼들 -->
        <div v-if="route.name === 'Dashboard'" class="dashboard-controls">
          <div v-if="!isEditMode" class="view-mode-controls">
            <button @click="enterEditMode" class="edit-mode-btn">
              <span class="btn-icon">✏️</span>
              <span>위젯 편집</span>
            </button>
          </div>

          <div v-else class="edit-mode-controls">
            <button @click="saveDashboard" class="save-btn">
              <span class="btn-icon">💾</span>
              <span>저장</span>
            </button>
            <button @click="exitEditMode" class="exit-btn">
              <span class="btn-icon">✕</span>
              <span>나가기</span>
            </button>
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
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// 사이드바 상태 관리
const sidebarOpen = ref(false) // 기본적으로 닫혀있음
const isEditMode = ref(false) // 편집모드 상태

// 편집모드 진입
const enterEditMode = () => {
  isEditMode.value = true
  sidebarOpen.value = true
  // 대시보드에 편집모드 알림
  window.dispatchEvent(
    new CustomEvent('edit-mode-change', {
      detail: { isEditMode: true, sidebarOpen: true },
    }),
  )
}

// 편집모드 나가기
const exitEditMode = () => {
  // 변경사항 저장 확인 이벤트 전송
  window.dispatchEvent(new CustomEvent('confirm-exit-edit-mode'))
}

// 사이드바 토글
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
  // 전역 이벤트로 대시보드에 알림
  window.dispatchEvent(
    new CustomEvent('sidebar-toggle', {
      detail: { isOpen: sidebarOpen.value },
    }),
  )
}

// 편집모드 실제 종료 (대시보드에서 호출)
const forceExitEditMode = () => {
  isEditMode.value = false
  sidebarOpen.value = false
  // 대시보드에 편집모드 알림
  window.dispatchEvent(
    new CustomEvent('edit-mode-change', {
      detail: { isEditMode: false, sidebarOpen: false },
    }),
  )
}

// 대시보드에서 호출되는 이벤트 리스너
const handleForceExit = () => {
  forceExitEditMode()
}

// 대시보드에서 사이드바 상태 변경 이벤트 리스너
const handleSidebarStateChange = (event) => {
  sidebarOpen.value = event.detail.isOpen
}

// 마운트 시 이벤트 리스너 등록
const setupEventListeners = () => {
  window.addEventListener('force-exit-edit-mode', handleForceExit)
  window.addEventListener('sidebar-state-change', handleSidebarStateChange)
}

// 언마운트 시 이벤트 리스너 제거
const cleanupEventListeners = () => {
  window.removeEventListener('force-exit-edit-mode', handleForceExit)
  window.removeEventListener('sidebar-state-change', handleSidebarStateChange)
}

// 대시보드 저장 함수
const saveDashboard = () => {
  // 대시보드에 저장 이벤트 전송
  window.dispatchEvent(new CustomEvent('save-dashboard'))
}

// 대시보드가 아닌 페이지에서는 편집모드 닫기
watch(
  route,
  (newRoute) => {
    if (newRoute.name !== 'Dashboard') {
      isEditMode.value = false
      sidebarOpen.value = false
    }
  },
  { immediate: true },
)

// 헤더를 보여줄지 결정
const shouldShowHeader = computed(() => {
  return route.name !== 'Login'
})

// 뒤로가기 버튼을 보여줄지 결정 (대시보드가 메인이므로 제거)
const showBackButton = computed(() => {
  return false
})

// 페이지 제목 결정
const pageTitle = computed(() => {
  switch (route.name) {
    case 'Main':
      return '해줌 에너지 모니터링'
    case 'Dashboard':
      return '해줌 에너지 대시보드'
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

// 라이프사이클
onMounted(() => {
  setupEventListeners()
})

onUnmounted(() => {
  cleanupEventListeners()
})
</script>

<style scoped>
.app-header {
  /* background: rgba(255, 255, 255, 0.95); */
  /* backdrop-filter: blur(20px); */
  /* -webkit-backdrop-filter: blur(20px); */
  /* border-bottom: 1px solid rgba(225, 99, 73, 0.2); */
  /* box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15); */
  position: fixed;
  border-radius: 24px;
  top: 1%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  width: 95%;
  padding: 0 2.5%;
  /* max-width: 1200px; */
  transition: all 0.3s ease;
}

.header-content {
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  /* max-width: 1400px; */
  margin: 0 auto;
  box-sizing: border-box;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 24px;
  /* flex: 1; */
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.sidebar-toggle-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 2px solid rgba(225, 99, 73, 0.2);
  border-radius: 12px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-primary);
  transition: all 0.3s ease;
  font-family: inherit;
}

.sidebar-toggle-btn:hover {
  background: rgba(225, 99, 73, 0.1);
  border-color: rgba(225, 99, 73, 0.3);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(225, 99, 73, 0.2);
}

.sidebar-toggle-btn.active {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 16px rgba(225, 99, 73, 0.3);
}

.toggle-icon {
  font-size: 18px;
  transition: transform 0.3s ease;
}

.sidebar-toggle-btn.active .toggle-icon {
  transform: rotate(90deg);
}

.toggle-text {
  font-family: inherit;
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
  gap: 16px;
}

.dashboard-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.view-mode-controls,
.edit-mode-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.edit-mode-btn,
.save-btn,
.exit-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  font-family: inherit;
}

.edit-mode-btn {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
  color: var(--color-font-white);
  box-shadow: 0 4px 16px rgba(225, 99, 73, 0.3);
}

.edit-mode-btn:hover {
  background: linear-gradient(135deg, #d45740 0%, #e8a89a 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(225, 99, 73, 0.4);
}

.save-btn {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: white;
  box-shadow: 0 4px 16px rgba(34, 197, 94, 0.3);
}

.save-btn:hover {
  background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(34, 197, 94, 0.4);
}

.exit-btn {
  background: var(--color-gray-light);
  color: var(--color-font-primary);
  border: 2px solid var(--color-gray);
}

.exit-btn:hover {
  background: var(--color-gray);
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.btn-icon {
  font-size: 16px;
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


/* top-menu */

.top-menu {
  display:flex;
  align-items:center;
  background-color:var(--color-bg-white);
  border-radius:999px;
}
.top-menu  li {
  list-style-type:none;


  font-size:20px;
}
.top-menu  li .top-menu-item {
  color:#000;
  width:138px;
  height:64px;
  display:flex;
  align-items: center;
  justify-content:center;
  border-radius:999px;

  /* display:block;
  padding:20px 34px;
  background-color: #000;
  border-radius:999px;
  color:#fff;
  font-size:20px; */
}
.top-menu  li .top-menu-item:hover{
  background:none;
}
.top-menu li.active .top-menu-item{
    color:#fff;
    background-color: #000;
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
    gap: 12px;
  }

  .header-left {
    gap: 12px;
  }

  .header-title {
    font-size: 18px;
  }

  .back-btn {
    padding: 8px 12px;
    font-size: 13px;
  }

  .logout-btn {
    padding: 8px 12px;
    font-size: 13px;
  }

  .back-text {
    display: none;
  }

  .sidebar-toggle-btn {
    padding: 8px 12px;
    font-size: 14px;
  }

  .toggle-text {
    display: none;
  }

  .dashboard-controls {
    gap: 8px;
  }

  .edit-mode-btn,
  .save-btn,
  .exit-btn {
    padding: 8px 12px;
    font-size: 13px;
  }

  .edit-mode-btn span:last-child,
  .save-btn span:last-child,
  .exit-btn span:last-child {
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
