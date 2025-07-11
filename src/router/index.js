import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AdminLayout from '@/components/admin/AdminLayout.vue'

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
    component: () => import('@/views/MainView.vue'),
    meta: { requiresAuth: true } // 인증 필요
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true } // 인증 필요
  },
   {
  path: '/admin',
    name: 'Admin',
    component: AdminLayout,
    meta: { 
      requiresAuth: true,
      isAdmin: true  // 관리자 페이지임을 표시
    },
    children: [
      {
        path: '',
        redirect: '/admin/building'
      },
      {
        path: 'building',
        name: 'AdminBuilding',
        component: () => import('@/components/pages/adminBuilding.vue')
      },
      {
        path: 'users',
        name: 'AdminUsers', 
        component: () => import('@/components/pages/adminUsers.vue')
      },
      {
        path: 'dr',
        name: 'AdminDR',
        component: () => import('@/components/pages/adminDR.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 라우터 가드 설정
router.beforeEach((to, from, next) => {
  console.log('라우터 가드:', to.path, to.name)
  
  const authStore = useAuthStore()
    // /admin 경로 특별 처리 (임시)
  if (to.path === '/admin') {
    console.log('/admin 경로 감지 - 강제 통과')
    next()
    return
  }
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
