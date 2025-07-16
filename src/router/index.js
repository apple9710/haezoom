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
    meta: { 
      requiresAuth: true,
      isUserOnly: true  // 일반 사용자만 접근 가능
    }
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
  
  // 인증이 필요한 페이지
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    console.log('인증 필요, 로그인으로 이동')
    next('/login')
    return
  }
  
  // 게스트만 접근 가능한 페이지 (로그인 상태에서는 접근 불가)
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    console.log('이미 로그인됨')
    
    // 역할에 따른 리다이렉트
    if (authStore.user?.role === 'admin' || authStore.user?.role === 'manager') {
      console.log('관리자/매니저 - admin 페이지로 이동')
      next('/admin')
    } else {
      console.log('일반 사용자 - 대시보드로 이동')
      next('/dashboard')
    }
    return
  }
  
  // 홈 경로(/) 접근 시 역할에 따른 리다이렉트
  if (to.path === '/' && authStore.isAuthenticated) {
    console.log('홈 경로 접근 - 역할에 따른 리다이렉트')
    
    if (authStore.user?.role === 'admin' || authStore.user?.role === 'manager') {
      console.log('관리자/매니저 - admin 페이지로 이동')
      next('/admin')
    } else {
      console.log('일반 사용자 - 대시보드로 이동')
      next('/dashboard')
    }
    return
  }
  
  // admin 페이지 접근 권한 확인
  if (to.meta.isAdmin && authStore.isAuthenticated) {
    if (authStore.user?.role !== 'admin' && authStore.user?.role !== 'manager') {
      console.log('admin 페이지 접근 권한 없음, 대시보드로 이동')
      next('/dashboard')
      return
    }
  }
  
  // dashboard 페이지 접근 권한 확인 (일반 사용자만)
  if (to.meta.isUserOnly && authStore.isAuthenticated) {
    if (authStore.user?.role === 'admin' || authStore.user?.role === 'manager') {
      console.log('관리자는 dashboard 접근 불가, admin 페이지로 이동')
      next('/admin')
      return
    }
  }
  
  console.log('정상 라우팅:', to.path)
  next()
})

export default router
