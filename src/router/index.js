import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/main',
    name: 'Main',
    component: () => import('@/views/MainView.vue')
    // meta: { requiresAuth: true } // 임시로 주석처리 - 개발용
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/DashboardView.vue')
    // meta: { requiresAuth: true } // 임시로 주석처리 - 개발용
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 라우터 가드 설정
router.beforeEach((to, from, next) => {
  console.log('라우터 가드:', to.path, to.name)
  
  const authStore = useAuthStore()
  
  // 인증이 필요한 페이지
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    console.log('인증 필요, 로그인으로 이동')
    next('/login')
    return
  }
  
  // 게스트만 접근 가능한 페이지 (로그인 상태에서는 접근 불가)
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    console.log('이미 로그인됨, 대시보드로 이동')
    next('/dashboard')
    return
  }
  
  console.log('정상 라우팅:', to.path)
  next()
})

export default router
