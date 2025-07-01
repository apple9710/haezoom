import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // 상태
  const user = ref(null)
  const token = ref(localStorage.getItem('auth_token') || null)
  const loading = ref(false)
  const error = ref(null)

  // 계산된 속성
  const isAuthenticated = computed(() => !!token.value)

  // 액션
  const login = async (credentials) => {
    loading.value = true
    error.value = null
    
    try {
      // 실제 API 호출 대신 모의 로그인 로직
      await new Promise(resolve => setTimeout(resolve, 1000)) // 로딩 시뮬레이션
      
      // 간단한 로그인 검증 (실제 프로젝트에서는 API 호출)
      if (credentials.username === 'admin' && credentials.password === 'password') {
        const mockToken = 'mock-jwt-token-' + Date.now()
        const mockUser = {
          id: 1,
          username: credentials.username,
          name: '관리자',
          role: 'admin'
        }
        
        token.value = mockToken
        user.value = mockUser
        
        // 토큰을 localStorage에 저장
        localStorage.setItem('auth_token', mockToken)
        localStorage.setItem('user', JSON.stringify(mockUser))
        
        return { success: true }
      } else {
        throw new Error('아이디 또는 비밀번호가 올바르지 않습니다.')
      }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    error.value = null
    
    // localStorage에서 제거
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
  }

  const initializeAuth = () => {
    const savedToken = localStorage.getItem('auth_token')
    const savedUser = localStorage.getItem('user')
    
    if (savedToken && savedUser) {
      token.value = savedToken
      user.value = JSON.parse(savedUser)
    }
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    initializeAuth
  }
})
