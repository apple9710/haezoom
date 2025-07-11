// stores/navigation.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useNavigationStore = defineStore('navigation', () => {
  // 상태
  const currentView = ref('adminBuilding')
  const breadcrumbs = ref([])
  const pageTitle = ref('')
  
  // 메뉴 항목 정의
  const menuItems = ref([
    {
      id: 'adminBuilding',
      name: '실증지 관리',
      icon: '🏢',
      component: 'adminBuilding',
      breadcrumb: [{ name: '실증지 관리' }]
    },
    {
      id: 'adminUsers',
      name: '사용자 관리',
      icon: '👥',
      component: 'adminUsers',
      breadcrumb: [{ name: '사용자 관리' }]
    },
    {
      id: 'adminDR',
      name: 'DR 관리',
      icon: '⚡',
      component: 'adminDR',
      breadcrumb: [{ name: 'DR 관리' }]
    }
  ])
  
  // 계산된 속성
  const currentMenuItem = computed(() => 
    menuItems.value.find(item => item.id === currentView.value)
  )
  
  // 액션
  const setCurrentView = (viewId) => {
    const menuItem = menuItems.value.find(item => item.id === viewId)
    if (menuItem) {
      currentView.value = viewId
      pageTitle.value = menuItem.name
      breadcrumbs.value = menuItem.breadcrumb
      
      // 브라우저 히스토리에 추가 (선택사항)
      history.pushState({ viewId }, menuItem.name, `#${viewId}`)
    }
  }
  
  const updateBreadcrumbs = (crumbs) => {
    breadcrumbs.value = crumbs
  }
  
  const setPageTitle = (title) => {
    pageTitle.value = title
    document.title = `${title} - HAEZOOM Admin`
  }
  
  return {
    // 상태
    currentView,
    breadcrumbs,
    pageTitle,
    menuItems,
    
    // 계산된 속성
    currentMenuItem,
    
    // 액션
    setCurrentView,
    updateBreadcrumbs,
    setPageTitle
  }
})