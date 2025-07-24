import axios from 'axios'

// API 기본 URL - 개발 환경에서는 프록시 사용
const API_BASE_URL = import.meta.env.DEV ? '/api' : 'http://15.164.55.52:9091/api'

console.log('API Base URL:', API_BASE_URL)

// axios 인스턴스 생성
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 요청 인터셉터 - 토큰 자동 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 응답 인터셉터 - 에러 처리 및 토큰 갱신
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      // 토큰 갱신 시도
      try {
        const refreshToken = localStorage.getItem('refresh_token')
        if (refreshToken) {
          const response = await api.post('/auth/refreshToken', {
            refreshToken
          })
          
          const newToken = response.data.data?.accessToken
          if (newToken) {
            localStorage.setItem('auth_token', newToken)
            
            // 원래 요청 재시도
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            return api(originalRequest)
          }
        }
      } catch (refreshError) {
        // 토큰 갱신 실패 시 로그아웃
        localStorage.removeItem('auth_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

// API 함수들
export const authAPI = {
  // 로그인
  login: (credentials) => {
    // Basic Auth 헤더 생성
    const basicAuth = btoa(`${credentials.username}:${credentials.password}`)
    return api.post('/auth/login', {}, {  // 빈 객체를 body로 전송
      headers: {
        Authorization: `Basic ${basicAuth}`
      }
    })
  },
  
  // 사용자 등록 (관리자용)
  register: (userData) => {
    return api.post('/auth', {
      id: userData.username,
      password: userData.password,
      email: userData.email,
      name: userData.name,
      buildingArray: userData.buildings || [],
      role: userData.userType || 'user'
    })
  },
  
  // 토큰 갱신
  refreshToken: (refreshToken) => {
    return api.post('/auth/refreshToken', { refreshToken })
  }
  
  // 로그아웃은 클라이언트 사이드에서만 처리 (서버 API 없음)
}

export const codeAPI = {
  // 그룹코드 조회
  getGroupCode: (groupCode) => {
    return api.get('/code/group', {
      params: { groupCode }
    })
  }
}

export const buildingAPI = {
  // 건물 목록 조회 (그룹코드 기반)
  getBuildings: () => {
    return codeAPI.getGroupCode('BUILDING')
  }
}

export default api
