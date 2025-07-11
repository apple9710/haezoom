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
            <i :class="item.icon" class="menu-icon"></i>
            <span v-if="!collapsed" class="menu-text">{{ item.name }}</span>
          </button>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle'])

const route = useRoute()
const router = useRouter()

// 메뉴 항목 정의
const menuItems = computed(() => [
  {
    id: 'adminBuilding',
    name: '실증지 관리',
    icon: '🏢',
    component: 'adminBuilding'
  },
  {
    id: 'adminUsers',
    name: '사용자 관리',
    icon: '👥',
    component: 'adminUsers'
  },
  {
    id: 'adminDR',
    name: 'DR 관리',
    icon: '⚡',
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
</script>

<style scoped>
.sidebar {
  grid-area: sidebar;
  background: #f8f8f8;
  color: white;
  transition: width 0.3s ease;
  overflow-x: hidden;
  width: 280px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding:32px;
  border-bottom: 1px solid #34495e;
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
  padding: 20px 0;
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-item {
  margin-bottom: 5px;
}

.menu-link {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 15px 20px;
  color: #bdc3c7;
  text-decoration: none;
  border: none;
  background: none;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.menu-link:hover {
  background: #34495e;
  color: #ecf0f1;
}

.menu-item.active .menu-link {
  background: #3498db;
  color: white;
}

.menu-link i,
.menu-icon {
  margin-right: 15px;
  font-size: 18px;
  width: 20px;
  text-align: center;
  display: inline-block;
}

.menu-text {
  font-size: 14px;
  font-weight: 500;
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
</style>