<!-- components/admin/AdminLayout.vue -->
<template>
  <div class="admin-layout" :class="layoutClasses">

    
    <!-- 메인 영역 -->
    <div class="layout-body">
      <!-- 사이드바 -->
      <AppSidebar 
        :collapsed="layoutStore.sidebarCollapsed"
        @toggle="layoutStore.toggleSidebar"
      />
      
      <!-- 메인 콘텐츠 -->
      <main class="main-content">
        <!-- 라우터 뷰 -->
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useLayoutStore } from '@/stores/adminLayout'
import AppSidebar from '@/components/admin/AppSidebar.vue'

const router = useRouter()
const layoutStore = useLayoutStore()

// 레이아웃 클래스 계산
const layoutClasses = computed(() => ({
  'layout--sidebar-collapsed': layoutStore.sidebarCollapsed,
  'layout--mobile': layoutStore.isMobile
}))
</script>

<style scoped>
.admin-layout {
  display: grid;
  grid-template-areas: 
    "sidebar content";
  grid-template-columns: 280px 1fr;
  grid-template-rows: 1fr;
  height: 100vh;
  transition: grid-template-columns 0.3s ease;
}

.admin-layout.layout--sidebar-collapsed {
  grid-template-columns: 60px 1fr;
}

.layout-body {
  display: contents;
}

.main-content {
  grid-area: content;
  overflow-y: auto;
  padding: 20px;
  background: #fff;
}

/* 모바일 반응형 */
@media (max-width: 768px) {
  .admin-layout {
    grid-template-areas: 
      "header"
      "content";
    grid-template-columns: 1fr;
  }
  
  .admin-layout .sidebar {
    position: fixed;
    top: 60px;
    left: 0;
    height: calc(100vh - 60px);
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    z-index: 1000;
  }
  
  .admin-layout:not(.layout--sidebar-collapsed) .sidebar {
    transform: translateX(0);
  }
}
</style>