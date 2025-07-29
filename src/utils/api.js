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
    console.log('=== API 요청 상세 ===')
    console.log('URL:', config.url)
    console.log('Method:', config.method)
    console.log('Base URL:', config.baseURL)
    console.log('Full URL:', `${config.baseURL}${config.url}`)
    console.log('Headers:', config.headers)
    console.log('Data:', config.data)
    console.log('===================')
    
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('토큰 추가됨:', `Bearer ${token.substring(0, 50)}...`)
    } else {
      console.warn('토큰이 없습니다!')
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
    console.log('=== API 응답 성공 ===')
    console.log('URL:', response.config.url)
    console.log('Status:', response.status)
    console.log('Status Text:', response.statusText)
    console.log('Data:', response.data)
    console.log('===================')
    return response
  },
  async (error) => {
    console.error('=== API 응답 에러 ===')
    console.error('URL:', error.config?.url)
    console.error('Method:', error.config?.method)
    console.error('Status:', error.response?.status)
    console.error('Status Text:', error.response?.statusText)
    console.error('Error Data:', error.response?.data)
    console.error('Request Headers:', error.config?.headers)
    console.error('Response Headers:', error.response?.headers)
    console.error('Error Message:', error.message)
    console.error('==================')
    
    // 400 에러의 경우 상세한 에러 메시지 출력
    if (error.response?.status === 400) {
      console.error('=== 400 Bad Request 상세 분석 ===')
      console.error('요청 URL:', error.config?.url)
      console.error('요청 메서드:', error.config?.method)
      console.error('요청 데이터:', error.config?.data)
      console.error('요청 헤더:', error.config?.headers)
      console.error('응답 데이터:', error.response?.data)
      console.error('================================')
    }
    
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

// 공통 API 요청 함수
const apiRequest = async (url, method, data = null) => {
  try {
    const config = {
      method,
      url,
      ...(data && { data })
    }
    
    const response = await api(config)
    return response
  } catch (error) {
    console.error(`API 요청 실패 [${method} ${url}]:`, error)
    throw error
  }
}

// API 함수들
export const authAPI = {
  // 로그인 - Swagger 스펙에 맞게 수정
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
    
    // Swagger 스펙에 따른 Basic Auth 방식 사용
    try {
      console.log('Basic Auth 헤더로 로그인 시도')
      const basicAuth = btoa(`${credentials.username}:${credentials.password}`)
      const response = await loginApi.post('/auth/login', {}, {
        headers: {
          Authorization: `Basic ${basicAuth}`
        }
      })
      console.log('로그인 성공:', response.data)
      return response
    } catch (error) {
      console.log('로그인 실패:', error.response?.status, error.response?.data)
      throw error
    }
  },
  
  // 사용자 등록 - Swagger 스펙의 RegisterUserReqDto 사용
  register: async (userData) => {
    const registerData = {
      username: userData.username || userData.id,
      password: userData.password,
      name: userData.name,
      email: userData.email || '',
      phone: userData.phone || '',
      company: userData.company || '',
      authority: userData.authority || userData.userType || 'USER'
    }
    
    return apiRequest('/auth/register', 'POST', registerData)
  },
  
  // 모든 사용자 조회 - Swagger 스펙에 맞는 페이징
  getUsers: async (page = 0, size = 10, name = '', role = '') => {
    console.log(`Users API 호출: page=${page}, size=${size}, name=${name}, role=${role}`)
    
    // Swagger 스펙에 맞게 1-based 페이지네이션과 pageSize 파라미터 사용
    const swaggerPage = page + 1  // 0-based를 1-based로 변환
    let url = `/auth?page=${swaggerPage}&pageSize=${size}`
    
    // 검색 파라미터 추가
    if (name) {
      url += `&name=${encodeURIComponent(name)}`
    }
    if (role) {
      url += `&role=${encodeURIComponent(role)}`
    }
    
    try {
      console.log(`실제 Users API 호출: ${url}`)
      const response = await api.get(url)
      console.log('✅ Users API 성공:', response.data)
      
      // 응답 데이터 구조를 기존 형식에 맞게 변환
      const transformedResponse = {
        ...response,
        data: {
          success: true,
          message: response.data.message || '사용자 목록 조회 성공',
          data: {
            content: response.data.data?.items || [],
            totalElements: response.data.data?.pageResponse?.totalElements || 0,
            totalPages: response.data.data?.pageResponse?.totalPages || 0,
            size: response.data.data?.pageResponse?.pageSize || size,
            number: page  // 0-based로 유지
          }
        }
      }
      
      return transformedResponse
    } catch (error) {
      console.error('❌ Users API 실패:', error.response?.status, error.response?.data)
      throw error
    }
  },
  
  // 특정 사용자 조회
  getUserById: async (userId) => {
    return apiRequest(`/auth/users/${userId}`, 'GET')
  },
  
  // 사용자 정보 수정 - Swagger 스펙의 UpdateUserReqDto 사용
  updateUser: async (userId, userData) => {
    const updateData = {
      username: userData.username || userData.id,
      password: userData.password || undefined,
      name: userData.name,
      email: userData.email || '',
      phone: userData.phone || '',
      company: userData.company || '',
      authority: userData.authority || userData.userType || 'USER'
    }
    
    // undefined 필드 제거
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key]
      }
    })
    
    return apiRequest(`/auth/users/${userId}`, 'PUT', updateData)
  },
  
  // 사용자 삭제
  deleteUser: async (userId) => {
    return apiRequest(`/auth/users/${userId}`, 'DELETE')
  },
  
  // 다중 사용자 삭제 - Swagger 스펙의 DeleteUsersReqDto 사용
  deleteMultipleUsers: async (userIds) => {
    return apiRequest('/auth/users', 'DELETE', { userIds })
  },
  
  // 임시 비밀번호 발송
  sendTempPassword: async (userId) => {
    return apiRequest(`/auth/users/${userId}/temp-password`, 'POST')
  },
  
  // 토큰 갱신
  refreshToken: (refreshToken) => {
    return api.post('/auth/refreshToken', { refreshToken })
  }
  
  // 로그아웃은 클라이언트 사이드에서만 처리 (서버 API 없음)
}

export const codeAPI = {
  // 그룹코드 조회 - Swagger 스펙에 맞는 형태
  getGroupCode: async (groupCode) => {
    return apiRequest(`/code/group?groupCode=${groupCode}`, 'GET')
  }
}

export const electricRateAPI = {
  // 전기요금제 목록 조회
  getElectricRatePlans: async () => {
    return codeAPI.getGroupCode('ELECT_RATE_PLAN')
  },
  
  // 특정 전기요금제의 전력구분 조회
  getPowerDivisionsByPlan: async (planCode) => {
    return codeAPI.getGroupCode(planCode)
  }
}

export const buildingAPI = {
  // 실증지 목록 조회 - Swagger 스펙에 맞게 수정
  getBuildings: async (page = 0, size = 10) => {
    console.log(`Building API 호출: page=${page}, size=${size}`)
    
    // Swagger 스펙에 맞게 1-based 페이지네이션과 pageSize 파라미터 사용
    const swaggerPage = page + 1  // 0-based를 1-based로 변환
    const url = `/building?page=${swaggerPage}&pageSize=${size}`
    
    try {
      console.log(`실제 API 호출: ${url}`)
      const response = await api.get(url)
      console.log('✅ Building API 성공:', response.data)
      
      // 응답 데이터 구조를 기존 형식에 맞게 변환
      const transformedResponse = {
        ...response,
        data: {
          success: true,
          message: response.data.message || '실증지 목록 조회 성공',
          data: {
            content: response.data.data?.items || [],
            totalElements: response.data.data?.pageResponse?.totalElements || 0,
            totalPages: response.data.data?.pageResponse?.totalPages || 0,
            size: response.data.data?.pageResponse?.pageSize || size,
            number: page  // 0-based로 유지
          }
        }
      }
      
      return transformedResponse
    } catch (error) {
      console.error('❌ Building API 실패:', error.response?.status, error.response?.data)
      
      // 500 에러 특별 처리
      if (error.response?.status === 500) {
        console.warn('서버 내부 오류 - 존재하지 않는 페이지일 가능성 높음')
        // 에러를 그대로 throw해서 handlePageChange에서 처리하도록 함
        throw error
      }
      
      throw error
    }
  },
  
  // 실증지 검색 (name 파라미터 포함)
  searchBuildings: async (page = 0, size = 10, name = '') => {
    console.log(`Building 검색 API 호출: page=${page}, size=${size}, name=${name}`)
    
    const swaggerPage = page + 1
    let url = `/building?page=${swaggerPage}&pageSize=${size}`
    if (name) {
      url += `&name=${encodeURIComponent(name)}`
    }
    
    try {
      console.log(`실제 검색 API 호출: ${url}`)
      const response = await api.get(url)
      console.log('✅ Building 검색 API 성공:', response.data)
      
      // 응답 데이터 구조를 기존 형식에 맞게 변환
      const transformedResponse = {
        ...response,
        data: {
          success: true,
          message: response.data.message || '실증지 검색 성공',
          data: {
            content: response.data.data?.items || [],
            totalElements: response.data.data?.pageResponse?.totalElements || 0,
            totalPages: response.data.data?.pageResponse?.totalPages || 0,
            size: response.data.data?.pageResponse?.pageSize || size,
            number: page
          }
        }
      }
      
      return transformedResponse
    } catch (error) {
      console.error('❌ Building 검색 API 실패:', error.response?.status, error.response?.data)
      throw error
    }
  },
  
  // 특정 실증지 조회
  getBuildingById: async (buildingId) => {
    return apiRequest(`/building/${buildingId}`, 'GET')
  },
  
  // 실증지 생성 - Swagger 스펙에 맞게 multipart/form-data 사용
  createBuilding: async (buildingData) => {
    console.log('실증지 생성 요청:', buildingData)
    
    // FormData 객체 생성
    const formData = new FormData()
    formData.append('name', buildingData.name || '')
    formData.append('address', buildingData.address || '')
    formData.append('comment', buildingData.description || buildingData.comment || '')
    formData.append('electRatePlanCode', buildingData.electricRatePlan || buildingData.electRatePlanCode || '')
    formData.append('powerClassCode', buildingData.powerDivision || buildingData.powerClassCode || '')
    formData.append('threshold', buildingData.threshold || '0')
    formData.append('contractPower', buildingData.contractPower || '0')
    
    // userIds 배열 처리
    if (buildingData.userIds && Array.isArray(buildingData.userIds)) {
      buildingData.userIds.forEach(userId => {
        formData.append('userIds', userId.toString())
      })
    } else if (buildingData.userIds) {
      formData.append('userIds', buildingData.userIds.toString())
    }
    
    try {
      // multipart/form-data용 별도 인스턴스 생성
      const formDataApi = axios.create({
        baseURL: API_BASE_URL,
        timeout: 10000,
        headers: {
          // Content-Type을 설정하지 않으면 브라우저가 자동으로 multipart boundary 설정
        }
      })
      
      // 토큰 추가
      const token = localStorage.getItem('auth_token')
      if (token) {
        formDataApi.defaults.headers.Authorization = `Bearer ${token}`
      }
      
      const response = await formDataApi.post('/building', formData)
      console.log('실증지 생성 성공:', response.data)
      return response
    } catch (error) {
      console.error('실증지 생성 실패:', error.response?.status, error.response?.data)
      throw error
    }
  },
  
  // 실증지 정보 수정 - PUT 메서드가 있다면 multipart/form-data 사용
  updateBuilding: async (buildingId, buildingData) => {
    console.log('실증지 수정 요청:', buildingId, buildingData)
    
    // FormData 객체 생성
    const formData = new FormData()
    formData.append('name', buildingData.name || '')
    formData.append('address', buildingData.address || '')
    formData.append('comment', buildingData.description || buildingData.comment || '')
    formData.append('electRatePlanCode', buildingData.electricRatePlan || buildingData.electRatePlanCode || '')
    formData.append('powerClassCode', buildingData.powerDivision || buildingData.powerClassCode || '')
    formData.append('threshold', buildingData.threshold || '0')
    formData.append('contractPower', buildingData.contractPower || '0')
    
    // userIds 배열 처리
    if (buildingData.userIds && Array.isArray(buildingData.userIds)) {
      buildingData.userIds.forEach(userId => {
        formData.append('userIds', userId.toString())
      })
    } else if (buildingData.userIds) {
      formData.append('userIds', buildingData.userIds.toString())
    }
    
    try {
      // multipart/form-data용 별도 인스턴스 생성
      const formDataApi = axios.create({
        baseURL: API_BASE_URL,
        timeout: 10000,
        headers: {
          // Content-Type을 설정하지 않으면 브라우저가 자동으로 multipart boundary 설정
        }
      })
      
      // 토큰 추가
      const token = localStorage.getItem('auth_token')
      if (token) {
        formDataApi.defaults.headers.Authorization = `Bearer ${token}`
      }
      
      const response = await formDataApi.put(`/building/${buildingId}`, formData)
      console.log('실증지 수정 성공:', response.data)
      return response
    } catch (error) {
      console.error('실증지 수정 실패:', error.response?.status, error.response?.data)
      throw error
    }
  },
  
  // 실증지 삭제
  deleteBuilding: async (buildingId) => {
    return apiRequest(`/building/${buildingId}`, 'DELETE')
  }
}

export default api
