# 백엔드 CORS 설정 요청

## 요청 내용
프론트엔드 배포 도메인에서 API 호출을 위해 CORS 허용 설정을 요청드립니다.

## 허용이 필요한 Origin
```
http://15.165.117.119
```

## Spring Boot 설정 예시

### 방법 1: @CrossOrigin 어노테이션 (컨트롤러별)
```java
@CrossOrigin(origins = "http://15.165.117.119")
@RestController
@RequestMapping("/api")
public class YourController {
    // ...
}
```

### 방법 2: WebMvcConfigurer (전역 설정) - 권장
```java
@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(
                    "http://localhost:5173",      // 개발환경
                    "http://15.165.117.119"       // 프로덕션환경
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

### 방법 3: application.yml 설정
```yaml
spring:
  web:
    cors:
      allowed-origins:
        - "http://localhost:5173"
        - "http://15.165.117.119"
      allowed-methods:
        - GET
        - POST
        - PUT
        - DELETE
        - OPTIONS
      allowed-headers: "*"
      allow-credentials: true
      max-age: 3600
```

## 테스트 확인 사항
설정 완료 후 다음 요청이 정상 작동하는지 확인:
- POST /api/auth/login
- GET /api/user/profile (인증 필요 시)

## 참고사항
- `allowCredentials(true)` 설정으로 JWT 토큰 전송 허용
- OPTIONS 메서드는 preflight 요청을 위해 필수
- 개발환경(localhost:5173)도 함께 허용하면 개발 시 편리함
