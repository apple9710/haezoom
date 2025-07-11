<!-- components/admin/AppSidebar.vue -->
<template>
  <aside class="sidebar" :class="{ 'collapsed': collapsed }">
    <!-- 사이드바 헤더 -->
    <div class="sidebar-header">
      <div class="logo" v-if="!collapsed">
        <img src="@/assets/images/logo_en.svg" alt="HAEZOOM" class="logo-image" />
        <h2>프로파일관리</h2>
      </div>
      <button 
        @click="$emit('toggle')"
        class="toggle-btn"
        :aria-label="collapsed ? '사이드바 확장' : '사이드바 축소'"
      >
        {{ collapsed ? '▶' : '◀' }}
      </button>
    </div>
    
    <!-- 네비게이션 메뉴 -->
    <nav class="sidebar-nav">
      <ul class="menu-list">
        <li 
          v-for="item in menuItems" 
          :key="item.id"
          class="menu-item"
          :class="{ 'active': currentView === item.id }"
        >
          <button 
            @click="navigateToPage(item.id)"
            class="menu-link"
            :title="collapsed ? item.name : ''"
          >
            <img :src="item.icon" :alt="item.name" class="menu-icon" />
            <span v-if="!collapsed" class="menu-text">{{ item.name }}</span>
          </button>
        </li>
      </ul>
      <button class="admin_logout" @click="handleLogout">
        <img src="@/assets/images/logout.svg" alt="로그아웃" />
        <h2 v-if="!collapsed">로그아웃</h2>
      </button>
    </nav>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle'])

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// 메뉴 항목 정의
const menuItems = computed(() => [
  {
    id: 'adminBuilding',
    name: '실증지 관리',
    icon: new URL('@/assets/images/domain_icon.png', import.meta.url).href,
    component: 'adminBuilding'
  },
  {
    id: 'adminUsers',
    name: '사용자 관리',
    icon: new URL('@/assets/images/account_user.png', import.meta.url).href,
    component: 'adminUsers'
  },
  {
    id: 'adminDR',
    name: 'DR 관리',
    icon: new URL('@/assets/images/dr_icon.png', import.meta.url).href,
    component: 'adminDR'
  }
])

// 현재 활성 메뉴 계산
const currentView = computed(() => {
  const pathMap = {
    '/admin/building': 'adminBuilding',
    '/admin/users': 'adminUsers',
    '/admin/dr': 'adminDR'
  }
  return pathMap[route.path] || 'adminBuilding'
})

// 페이지 이동 함수
const navigateToPage = (pageId) => {
  const routeMap = {
    'adminBuilding': '/admin/building',
    'adminUsers': '/admin/users', 
    'adminDR': '/admin/dr'
  }
  
  const route = routeMap[pageId]
  if (route) {
    router.push(route)
  }
}

// 로그아웃 처리 함수
const handleLogout = async () => {
  if (confirm('로그아웃 하시겠습니까?')) {
    try {
      // 로그아웃 처리
      await authStore.logout()
      
      // 로그인 페이지로 이동
      router.push('/login')
    } catch (error) {
      console.error('로그아웃 실패:', error)
      alert('로그아웃 중 오류가 발생했습니다.')
    }
  }
}
</script>

<style scoped>
.sidebar {
  grid-area: sidebar;
  background: #f8f8f8;
  color: white;
  transition: width 0.3s ease;
  overflow-x: hidden;
  width: 285px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding:32px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-image {
  width: 120px;
}

.logo h2 {
  margin: 0;
  font-weight: 700;
  font-size: 16px;
  color: #424242;
}

.toggle-btn {
  display: none;
  background: none;
  border: none;
  color: #ecf0f1;
  font-size: 16px;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.toggle-btn:hover {
  background: #34495e;
}

.sidebar-nav {
  padding: 18px 32px;
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-item {
  margin-bottom: 5px;
  border-radius: 8px;
}

.menu-link {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 15px 20px;
  color: #424242;
  text-decoration: none;
  border: none;
  background: none;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  border-radius: 8px;
}

.menu-link:hover {
  background: #e1e1e1;
  color: #424242;
}

.menu-item.active .menu-link {
  background: #e1e1e1;
  color: #424242;
}

.menu-link i,
.menu-icon {
  margin-right: 15px;
  width: 20px;
  height: 20px;
  text-align: center;
  display: inline-block;
}

.menu-icon {
  object-fit: contain;
}

.menu-text {
  font-size: 14px;
  font-weight: 500;
  color: #424242;
}

.admin_logout {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 15px 20px;
  margin-top: 20px;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.admin_logout:hover {
  background: #ffe6e6;
}

.admin_logout img {
  width: 20px;
  height: 20px;
}

.admin_logout h2 {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: #e74c3c;
}

/* 축소 상태 */
.sidebar.collapsed {
  width: 60px;
}

.sidebar.collapsed .sidebar-header {
  justify-content: center;
}

.sidebar.collapsed .menu-link {
  justify-content: center;
  padding: 15px 10px;
}

.sidebar.collapsed .menu-link i,
.sidebar.collapsed .menu-icon {
  margin-right: 0;
}

.sidebar.collapsed .admin_logout {
  justify-content: center;
  padding: 15px 10px;
}
</style>