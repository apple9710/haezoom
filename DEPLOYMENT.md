# 프로덕션 배포 가이드 (CORS 허용 방식)

## 1. 백엔드 CORS 설정 확인
`CORS_REQUEST.md` 파일의 내용을 백엔드 개발자에게 전달하여 CORS 설정 완료 확인

## 2. 빌드 명령어
```bash
npm run build
```

## 3. 파일 업로드
`dist/` 폴더의 내용을 서버의 `/var/www/html/haz/`에 업로드

## 4. 접속 URL
- 메인 애플리케이션: http://15.165.117.119/haz/
- 직접 API 호출: http://15.164.55.52:9091/api/

## 5. 데모 계정 (백엔드 연결 안될 시)
- 관리자: admin / admin
- 사용자: user1 / user123

## 6. 트러블슈팅

### CORS 에러가 발생하는 경우
1. 백엔드 CORS 설정 확인
2. 브라우저 개발자 도구에서 Network 탭으로 요청 확인
3. preflight OPTIONS 요청이 성공하는지 확인

### 로그인이 안되는 경우
1. 데모 계정으로 먼저 테스트
2. 백엔드 API 응답 확인
