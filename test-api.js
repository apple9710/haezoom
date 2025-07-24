// API 연결 테스트 스크립트
import { authAPI, codeAPI } from './src/utils/api.js'

// 테스트 함수들
const testAPI = async () => {
  console.log('=== API 연결 테스트 시작 ===')
  
  try {
    // 1. 기본 연결 테스트 (그룹코드 조회)
    console.log('\n1. 그룹코드 조회 테스트...')
    const groupResponse = await codeAPI.getGroupCode('BUILDING')
    console.log('그룹코드 응답:', groupResponse.data)
    
    // 2. 로그인 테스트
    console.log('\n2. 로그인 테스트...')
    const loginResponse = await authAPI.login({
      username: 'admin',
      password: 'admin'
    })
    console.log('로그인 응답:', loginResponse.data)
    
  } catch (error) {
    console.error('API 테스트 실패:', error)
    if (error.response) {
      console.error('응답 상태:', error.response.status)
      console.error('응답 데이터:', error.response.data)
    }
  }
}

// Node.js 환경에서 실행
if (typeof window === 'undefined') {
  testAPI()
}

export { testAPI }
