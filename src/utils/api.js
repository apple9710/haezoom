import axios from 'axios'

// API 기본 URL - 환경 변수 사용
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

console.log('API Base URL:', API_BASE_URL)
console.log('Environment:', import.meta.env.MODE)

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
    console.log('API 요청:', {
      method: config.method,
      url: config.url,
      data: config.data,
      headers: config.headers
    })
    
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('API 요청 에러:', error)
    return Promise.reject(error)
  }
)

// 응답 인터셉터 - 에러 처리 및 토큰 갱신
api.interceptors.response.use(
  (response) => {
    console.log('API 응답:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    })
    return response
  },
  async (error) => {
    console.error('API 응답 에러:', {
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    })
    
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
  // 로그인 - 토큰 없이 요청
  login: async (credentials) => {
    console.log('로그인 API 요청:', credentials)
    
    // 로그인용 별도 인스턴스 생성 (토큰 없이)
    const loginApi = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    // 방법 1: id/password 형태로 전송
    try {
      console.log('방법 1: id/password 형태로 로그인 시도')
      const response = await loginApi.post('/auth/login', {
        id: credentials.username,
        password: credentials.password
      })
      console.log('로그인 성공:', response.data)
      return response
    } catch (error1) {
      console.log('방법 1 실패:', error1.response?.status, error1.response?.data)
      
      // 방법 2: username/password 형태로 전송
      try {
        console.log('방법 2: username/password 형태로 로그인 시도')
        const response = await loginApi.post('/auth/login', {
          username: credentials.username,
          password: credentials.password
        })
        console.log('로그인 성공:', response.data)
        return response
      } catch (error2) {
        console.log('방법 2 실패:', error2.response?.status, error2.response?.data)
        
        // 방법 3: Basic Auth 헤더 사용
        try {
          console.log('방법 3: Basic Auth 헤더로 로그인 시도')
          const basicAuth = btoa(`${credentials.username}:${credentials.password}`)
          const response = await loginApi.post('/auth/login', {}, {
            headers: {
              Authorization: `Basic ${basicAuth}`
            }
          })
          console.log('로그인 성공:', response.data)
          return response
        } catch (error3) {
          console.log('방법 3 실패:', error3.response?.status, error3.response?.data)
          throw error1 // 첫 번째 에러를 던짐
        }
      }
    }
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
  
  // 모든 사용자 조회 (페이지네이션)
  getUsers: (params) => {
    return api.get('/auth', { params })
  },
  
  // 특정 사용자 조회
  getUserById: (userId) => {
    return api.get(`/auth/${userId}`)
  },
  
  // 사용자 정보 수정
  updateUser: (userId, userData) => {
    return api.patch(`/auth/${userId}`, {
      email: userData.email,
      name: userData.name,
      role: userData.userType,
      buildingArray: userData.buildings || []
    })
  },
  
  // 사용자 삭제
  deleteUser: (userId) => {
    return api.delete(`/auth/${userId}`)
  },
  
  // 다수 사용자 일괄 삭제
  deleteMultipleUsers: (userIds) => {
    return api.delete('/auth', {
      data: { userIds }
    })
  },
  
  // 임시 비밀번호 발급
  sendTempPassword: (userId) => {
    return api.post('/auth/tempPwd', { userId })
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

export const electricRateAPI = {
  // 전기요금제 목록 조회
  getElectricRatePlans: () => {
    return codeAPI.getGroupCode('ELECT_RATE_PLAN')
  },
  
  // 특정 전기요금제의 전력구분 조회
  getPowerDivisionsByPlan: (planCode) => {
    return codeAPI.getGroupCode(planCode)
  }
}

export const buildingAPI = {
  // 실증지 목록 조회 (페이지네이션)
  getBuildings: (params) => {
    return api.get('/building', { params })
  },
  
  // 특정 실증지 조회
  getBuildingById: (buildingId) => {
    return api.get(`/building/${buildingId}`)
  },
  
  // 실증지 생성
  createBuilding: (buildingData) => {
    return api.post('/building', buildingData)
  },
  
  // 실증지 수정
  updateBuilding: (buildingId, buildingData) => {
    return api.patch(`/building/${buildingId}`, buildingData)
  },
  
  // 실증지 삭제
  deleteBuilding: (buildingId) => {
    return api.delete(`/building/${buildingId}`)
  }
}

export default api
