// stores/adminLayout.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useLayoutStore = defineStore('adminLayout', () => {
  // 상태
  const sidebarCollapsed = ref(false)
  const isMobile = ref(false)
  const componentProps = ref({})
  const loadingStates = ref({})
  
  // 계산된 속성
  const sidebarWidth = computed(() => 
    sidebarCollapsed.value ? '60px' : '280px'
  )
  
  const isLoading = computed(() => 
    Object.values(loadingStates.value).some(loading => loading)
  )
  
  // 액션
  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }
  
  const setSidebarCollapsed = (collapsed) => {
    sidebarCollapsed.value = collapsed
  }
  
  const setMobile = (mobile) => {
    isMobile.value = mobile
    // 모바일에서는 자동으로 사이드바 축소
    if (mobile) {
      sidebarCollapsed.value = true
    }
  }
  
  const setComponentProps = (props) => {
    componentProps.value = props
  }
  
  const setLoadingState = (key, loading) => {
    loadingStates.value[key] = loading
  }
  
  return {
    // 상태
    sidebarCollapsed,
    isMobile,
    componentProps,
    loadingStates,
    
    // 계산된 속성
    sidebarWidth,
    isLoading,
    
    // 액션
    toggleSidebar,
    setSidebarCollapsed,
    setMobile,
    setComponentProps,
    setLoadingState
  }
})