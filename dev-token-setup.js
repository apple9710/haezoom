// 개발용 토큰 설정 스크립트
// 브라우저 콘솔에서 실행하세요

const devToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InV1aWQiOiI3YWNlNjc1ZS1lZTQyLTQyMjEtYmZlZi1jMjk1ZjBiYjEzYTYiLCJpZCI6ImFkbWluIiwicGFzc3dvcmQiOiIkMmIkMTAkcGRWdG8yMS5vZjVmbWpIMGxPVkZTLmhsZk0uNEwzWEZWbFZwYXZlTjdnS25xQ2R6R01WMy4iLCJjcmVhdGVkQXQiOiIyMDI1LTA3LTE3VDIzOjIxOjA3LjAzOFoiLCJ1cGRhdGVkQXQiOiIyMDI1LTA3LTE3VDIzOjIxOjA3LjAzOFoifSwidHlwZSI6ImFjY2VzcyIsImlhdCI6MTc1Mjc5NDQ5MCwiZXhwIjoxNzU3OTc4NDkwfQ.ufeRlmN-XP07wQ1Es1dBk0PEysNkNOjx-lqMr0iwkd8"

const userData = {
  id: "admin",
  username: "admin", 
  name: "관리자",
  email: "admin@example.com",
  role: "admin"
}

// 토큰과 사용자 정보 저장
localStorage.setItem('auth_token', devToken)
localStorage.setItem('user', JSON.stringify(userData))

console.log('개발용 토큰 설정 완료!')
console.log('토큰:', devToken)
console.log('사용자 정보:', userData)

// 페이지 새로고침
window.location.reload()
