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
      
      // 테스트용 사용자 계정들
      const testUsers = [
        {
          username: 'admin',
          password: 'password',
          id: 1,
          name: '관리자',
          role: 'admin',
          email: 'admin@haezoom.com',
          building: '해줌 본사'
        },
        {
          username: 'haezoom',
          password: '123456',
          id: 2,
          name: '해줌관리자',
          role: 'manager',
          email: 'lab@haezoom.com',
          building: '롯데마트 대전점'
        },
        {
          username: 'user1',
          password: 'user123',
          id: 3,
          name: '김철수',
          role: 'user',
          email: 'user1@example.com',
          building: '롯데마트 금천점'
        },
        {
          username: 'user2',
          password: 'user456',
          id: 4,
          name: '이영희',
          role: 'user',
          email: 'user2@example.com',
          building: '시흥과학기술대학교'
        },
        {
          username: 'manager1',
          password: 'manager123',
          id: 5,
          name: '박관리',
          role: 'manager',
          email: 'manager1@example.com',
          building: '롯데마트 VIC 영등포점'
        }
      ]
      
      // 로그인 검증
      const foundUser = testUsers.find(user => 
        user.username === credentials.username && user.password === credentials.password
      )
      
      if (foundUser) {
        const mockToken = 'mock-jwt-token-' + Date.now()
        const userData = {
          id: foundUser.id,
          username: foundUser.username,
          name: foundUser.name,
          role: foundUser.role,
          email: foundUser.email,
          building: foundUser.building
        }
        
        token.value = mockToken
        user.value = userData
        
        // 토큰을 localStorage에 저장
        localStorage.setItem('auth_token', mockToken)
        localStorage.setItem('user', JSON.stringify(userData))
        
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
