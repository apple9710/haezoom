<template>
  <div class="main-container">
    <main class="main-content">
      <div class="content-wrapper">
        <div class="welcome-section">
          <h2 class="welcome-title">환영합니다!</h2>
          <p class="welcome-description">
            해줌 에너지 모니터링 시스템에 오신 것을 환영합니다.<br>
            아래에서 원하시는 기능을 선택해주세요.
          </p>
        </div>

        <div class="features-grid">
          <div class="feature-card" @click="goToDashboard">
            <div class="feature-icon dashboard-icon">
              📊
            </div>
            <h3 class="feature-title">대시보드</h3>
            <p class="feature-description">
              실시간 에너지 데이터를 다양한 위젯으로 모니터링하고 분석하세요.
            </p>
            <div class="feature-arrow">→</div>
          </div>

          <div class="feature-card coming-soon">
            <div class="feature-icon reports-icon">
              📈
            </div>
            <h3 class="feature-title">보고서</h3>
            <p class="feature-description">
              에너지 사용량 분석 및 진단 보고서를 생성하고 관리하세요.
            </p>
            <div class="coming-soon-badge">준비중</div>
          </div>

          <div class="feature-card coming-soon">
            <div class="feature-icon settings-icon">
              ⚙️
            </div>
            <h3 class="feature-title">설정</h3>
            <p class="feature-description">
              시스템 설정 및 사용자 권한을 관리하세요.
            </p>
            <div class="coming-soon-badge">준비중</div>
          </div>

          <div class="feature-card coming-soon">
            <div class="feature-icon alarm-icon">
              🔔
            </div>
            <h3 class="feature-title">알람 관리</h3>
            <p class="feature-description">
              시스템 알람 및 경고 메시지를 설정하고 확인하세요.
            </p>
            <div class="coming-soon-badge">준비중</div>
          </div>
        </div>

        <div class="quick-stats">
          <h3 class="stats-title">시스템 현황</h3>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-value">12</div>
              <div class="stat-label">총 위젯 종류</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">4</div>
              <div class="stat-label">데이터 주기</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">실시간</div>
              <div class="stat-label">모니터링</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">24/7</div>
              <div class="stat-label">서비스</div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <footer class="main-footer">
      <p>&copy; 2025 해줌 에너지 모니터링. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToDashboard = () => {
  console.log('대시보드 버튼 클릭됨')
  console.log('현재 라우트:', router.currentRoute.value.path)
  
  router.push('/dashboard')
    .then(() => {
      console.log('대시보드 이동 성공')
    })
    .catch((error) => {
      console.error('대시보드 이동 실패:', error)
    })
}
</script>

<style scoped>
.main-container {
  min-height: calc(100vh - 90px); /* 헤더 높이 제외 */
  width: 100vw;
  background: linear-gradient(135deg, #E16349 0%, #F0BBB1 100%);
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.main-content {
  flex: 1;
  padding: 40px 24px;
  width: 100%;
  box-sizing: border-box;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.welcome-section {
  text-align: center;
  margin-bottom: 60px;
}

.welcome-title {
  font-size: 42px;
  font-weight: 700;
  color: var(--color-font-white);
  margin: 0 0 20px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.welcome-description {
  font-size: 20px;
  color: var(--color-font-white);
  line-height: 1.6;
  margin: 0;
  opacity: 0.9;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
  margin-top:500px;
  margin-bottom: 60px;
}

.feature-card {
  background: var(--color-bg-white);
  border-radius: 16px;
  padding: 40px 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border: 1px solid var(--color-gray-lightest);
}

.feature-card:not(.coming-soon):hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
}

.feature-card.coming-soon {
  cursor: not-allowed;
  opacity: 0.7;
}

.feature-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.feature-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-font-primary);
  margin: 0 0 16px 0;
}

.feature-description {
  color: var(--color-font-secondary);
  line-height: 1.5;
  margin: 0 0 20px 0;
  font-size: 16px;
}

.feature-arrow {
  font-size: 32px;
  color: var(--color-primary);
  font-weight: bold;
}

.coming-soon-badge {
  position: absolute;
  top: 20px;
  right: 20px;
  background: #fbbf24;
  color: white;
  padding: 8px 16px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 600;
}

.quick-stats {
  background: var(--color-bg-white);
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--color-gray-lightest);
}

.stats-title {
  font-size: 28px;
  font-weight: 600;
  color: var(--color-font-primary);
  margin: 0 0 32px 0;
  text-align: center;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 32px;
}

.stat-item {
  text-align: center;
  padding: 24px;
  border-radius: 12px;
  background: var(--color-bg-light);
  border: 1px solid var(--color-gray-lightest);
}

.stat-value {
  font-size: 36px;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 12px;
}

.stat-label {
  font-size: 16px;
  color: var(--color-font-secondary);
  font-weight: 500;
}

.main-footer {
  background: var(--color-bg-white);
  border-top: 1px solid var(--color-gray-lightest);
  padding: 20px 24px;
  text-align: center;
  width: 100%;
}

.main-footer p {
  margin: 0;
  color: var(--color-font-secondary);
  font-size: 16px;
}

/* 모바일 스타일 */
@media (max-width: 768px) {
  .welcome-title {
    font-size: 32px;
  }
  
  .welcome-description {
    font-size: 18px;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .feature-card {
    padding: 32px 24px;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  
  .stat-item {
    padding: 20px;
  }
  
  .stat-value {
    font-size: 28px;
  }
}

/* 큰 화면에서 더 큰 스타일 */
@media (min-width: 1440px) {
  .welcome-title {
    font-size: 48px;
  }
  
  .welcome-description {
    font-size: 22px;
  }
  
  .feature-icon {
    font-size: 72px;
  }
  
  .feature-title {
    font-size: 26px;
  }
  
  .feature-description {
    font-size: 18px;
  }
}
</style>