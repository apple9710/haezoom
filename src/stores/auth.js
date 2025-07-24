import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authAPI } from '@/utils/api'

export const useAuthStore = defineStore('auth', () => {
  // 상태
  const user = ref(null)
  const token = ref(localStorage.getItem('auth_token') || null)
  const refreshToken = ref(localStorage.getItem('refresh_token') || null)
  const loading = ref(false)
  const error = ref(null)

  // 계산된 속성
  const isAuthenticated = computed(() => !!token.value)

  // JWT 토큰 디코드 함수
  const decodeJWT = (token) => {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
          })
          .join('')
      )
      return JSON.parse(jsonPayload)
    } catch (error) {
      console.error('JWT 디코드 오류:', error)
      return null
    }
  }

  // 데모 계정 로그인 시도
  const tryDemoLogin = (credentials) => {
    const demoAccounts = [
      { username: 'admin', password: 'admin', role: 'admin', name: '최고 관리자' },
      { username: 'user1', password: 'user123', role: 'user', name: '일반 사용자' },
      { username: 'user', password: 'user123', role: 'user', name: '일반 사용자' }
    ]
    
    const account = demoAccounts.find(acc => 
      acc.username === credentials.username && acc.password === credentials.password
    )
    
    if (account) {
      console.log('데모 계정으로 로그인:', account.username)
      
      const userData = {
        id: account.username,
        username: account.username,
        name: account.name,
        email: `${account.username}@demo.com`,
        role: account.role,
        phone: '010-0000-0000'
      }
      
      // 가짜 토큰 생성 (데모용)
      const demoToken = `demo_token_${account.username}_${Date.now()}`
      
      // 상태 업데이트
      token.value = demoToken
      user.value = userData
      
      // localStorage에 저장
      localStorage.setItem('auth_token', demoToken)
      localStorage.setItem('user', JSON.stringify(userData))
      
      console.log('데모 로그인 성공:', userData)
      return { success: true, user: userData }
    }
    
    return { success: false }
  }

  // 로그인
  const login = async (credentials) => {
    loading.value = true
    error.value = null
    
    try {
      console.log('로그인 시도:', credentials.username)
      
      // 데모 계정 체크 먼저 실행
      const demoResult = tryDemoLogin(credentials)
      if (demoResult.success) {
        loading.value = false
        return demoResult
      }
      
      // 백엔드 API 로그인 시도
      const response = await authAPI.login(credentials)
      console.log('로그인 응답:', response.data)
      
      if (response.data && response.data.success) {
        const responseData = response.data.data
        const accessToken = responseData.accessToken
        const userRefreshToken = responseData.refreshToken
        
        // 기본 사용자 데이터
        let userData = {
          id: credentials.username,
          username: credentials.username,
          name: credentials.username,
          email: '',
          role: 'user',
          phone: ''
        }
        
        // JWT 토큰에서 사용자 정보 추출
        if (accessToken) {
          const tokenData = decodeJWT(accessToken)
          console.log('JWT 토큰 데이터:', tokenData)
          
          if (tokenData && tokenData.user) {
            userData = {
              id: tokenData.user.userId || tokenData.user.id || credentials.username,
              username: tokenData.user.id || credentials.username,
              name: tokenData.user.name || credentials.username,
              email: tokenData.user.email || '',
              role: tokenData.user.role || 'user',
              phone: tokenData.user.phone || ''
            }
          }
        }
        
        console.log('파싱된 사용자 데이터:', userData)
        
        if (accessToken) {
          // 상태 업데이트
          token.value = accessToken
          user.value = userData
          
          if (userRefreshToken) {
            refreshToken.value = userRefreshToken
            localStorage.setItem('refresh_token', userRefreshToken)
          }
          
          // localStorage에 저장
          localStorage.setItem('auth_token', accessToken)
          localStorage.setItem('user', JSON.stringify(userData))
          
          console.log('로그인 성공:', userData)
          return { success: true, user: userData }
        } else {
          throw new Error('토큰을 받지 못했습니다.')
        }
      } else {
        throw new Error(response.data?.message || '로그인에 실패했습니다.')
      }
    } catch (err) {
      console.error('로그인 에러:', err)
      
      let errorMessage = '로그인에 실패했습니다.'
      
      if (err.response) {
        const status = err.response.status
        const data = err.response.data
        
        switch (status) {
          case 401:
            errorMessage = '아이디 또는 비밀번호가 올바르지 않습니다.'
            break
          case 403:
            errorMessage = '접근이 거부되었습니다.'
            break
          case 404:
            errorMessage = '서버를 찾을 수 없습니다.'
            break
          case 500:
            errorMessage = '서버 오류가 발생했습니다.'
            break
          default:
            errorMessage = data?.message || `오류가 발생했습니다. (${status})`
        }
      } else if (err.request) {
        errorMessage = '서버에 연결할 수 없습니다. 데모 계정(admin/admin, user1/user123)을 사용해보세요.'
      } else {
        errorMessage = err.message || '알 수 없는 오류가 발생했습니다.'
      }
      
      error.value = errorMessage
      return { success: false, error: errorMessage }
    } finally {
      loading.value = false
    }
  }

  // 로그아웃
  const logout = () => {
    console.log('로그아웃 시작')
    
    // 상태 초기화
    user.value = null
    token.value = null
    refreshToken.value = null
    error.value = null
    
    // localStorage 정리
    localStorage.removeItem('auth_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
    localStorage.removeItem('selectedBuilding')
    
    console.log('로그아웃 완료')
  }

  // 인증 정보 복원
  const initAuth = () => {
    try {
      const savedUser = localStorage.getItem('user')
      const savedToken = localStorage.getItem('auth_token')
      const savedRefreshToken = localStorage.getItem('refresh_token')
      
      if (savedUser && savedToken) {
        user.value = JSON.parse(savedUser)
        token.value = savedToken
        
        if (savedRefreshToken) {
          refreshToken.value = savedRefreshToken
        }
        
        console.log('저장된 인증 정보 복원:', user.value)
      } else {
        console.log('저장된 인증 정보 없음')
      }
    } catch (error) {
      console.error('인증 정보 복원 실패:', error)
      logout()
    }
  }

  // 토큰 갱신
  const refreshAccessToken = async () => {
    try {
      if (!refreshToken.value) {
        throw new Error('리프레시 토큰이 없습니다.')
      }
      console.log('리프레시 토큰:', refreshToken.value)
      const response = await authAPI.refreshToken(refreshToken.value)
      
      if (response.data && response.data.success) {
        const newAccessToken = response.data.data?.accessToken
        
        if (newAccessToken) {
          token.value = newAccessToken
          localStorage.setItem('auth_token', newAccessToken)
          
          // 새 토큰으로 사용자 정보 업데이트
          const tokenData = decodeJWT(newAccessToken)
          if (tokenData && tokenData.user) {
            const updatedUser = {
              ...user.value,
              ...tokenData.user
            }
            user.value = updatedUser
            localStorage.setItem('user', JSON.stringify(updatedUser))
          }
          
          console.log('토큰 갱신 성공')
          return true
        }
      }
      
      throw new Error('토큰 갱신 실패')
    } catch (error) {
      console.error('토큰 갱신 오류:', error)
      logout()
      return false
    }
  }

  // 역할 확인 헬퍼
  const isAdmin = computed(() => {
    return user.value && (
      user.value.role === 'admin' || 
      user.value.role === 'manager' || 
      user.value.role === 'SUPER'
    )
  })

  const isUser = computed(() => {
    return user.value && user.value.role === 'user'
  })

  return {
    // 상태
    user,
    token,
    refreshToken,
    loading,
    error,
    
    // 계산된 속성
    isAuthenticated,
    isAdmin,
    isUser,
    
    // 액션
    login,
    logout,
    initAuth,
    refreshAccessToken
  }
})
