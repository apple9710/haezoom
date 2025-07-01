<template>
  <div class="main-container">
    <main class="main-content">
      <div class="content-wrapper">
        <!-- Hero Section -->
        <div class="hero-section">
          <div class="hero-content">
            <h1 class="hero-title">해줌 에너지</h1>
            <h2 class="hero-subtitle">스마트 모니터링 시스템</h2>
            <p class="hero-description">
              실시간 에너지 데이터 분석과 효율적인 관리를 위한<br>
              통합 모니터링 솔루션을 경험해보세요
            </p>
          </div>
          <div class="hero-decoration">
            <div class="floating-card card-1"></div>
            <div class="floating-card card-2"></div>
            <div class="floating-card card-3"></div>
          </div>
        </div>
 <!-- Quick Stats -->
        <div class="stats-section">
          <div class="stats-container">
            <div class="stats-header">
              <h3 class="stats-title">시스템 현황</h3>
              <p class="stats-subtitle">실시간 모니터링 현황</p>
            </div>
            <div class="stats-grid">
              <div class="stat-card">
                <!-- <div class="stat-icon">🔹</div> -->
                <div class="stat-value">12</div>
                <div class="stat-label">위젯 종류</div>
                <div class="stat-desc">다양한 시각화</div>
              </div>
              <div class="stat-card">
                <!-- <div class="stat-icon">⏱️</div> -->
                <div class="stat-value">4</div>
                <div class="stat-label">데이터 주기</div>
                <div class="stat-desc">1분~하루</div>
              </div>
              <div class="stat-card">
                <!-- <div class="stat-icon">📡</div> -->
                <div class="stat-value">실시간</div>
                <div class="stat-label">모니터링</div>
                <div class="stat-desc">연중무휴</div>
              </div>
              <div class="stat-card">
                <!-- <div class="stat-icon">🛡️</div> -->
                <div class="stat-value">24/7</div>
                <div class="stat-label">서비스</div>
                <div class="stat-desc">안정적 운영</div>
              </div>
            </div>
          </div>
        </div>
        <!-- Features Grid -->
        <div class="features-section">
          <div class="section-header">
            <h3 class="section-title">주요 기능</h3>
            <p class="section-description">강력한 기능들로 에너지를 효율적으로 관리하세요</p>
          </div>
          
          <div class="features-grid">
            <div class="feature-card primary-card" @click="goToDashboard">
              <div class="card-header">
                <!-- <div class="feature-icon">📊</div> -->
                <div class="card-badge active">실행가능</div>
              </div>
              <h4 class="feature-title">실시간 대시보드</h4>
              <p class="feature-description">
                12가지 위젯으로 실시간 에너지 데이터를 시각화하고 모니터링하세요
              </p>
              <div class="feature-stats">
                <div class="stat">
                  <span class="stat-number">12</span>
                  <span class="stat-label">위젯 종류</span>
                </div>
                <div class="stat">
                  <span class="stat-number">실시간</span>
                  <span class="stat-label">데이터</span>
                </div>
              </div>
              <div class="card-action">
                <span>시작하기</span>
                <div class="action-arrow">→</div>
              </div>
            </div>

            <div class="feature-card glass-card">
              <div class="card-header">
                <!-- <div class="feature-icon">📈</div> -->
                <div class="card-badge coming-soon">준비중</div>
              </div>
              <h4 class="feature-title">에너지 분석</h4>
              <p class="feature-description">
                AI 기반 에너지 소비 패턴 분석 및 최적화 제안
              </p>
              <div class="feature-list">
                <span>• 소비 패턴 분석</span>
                <span>• 효율성 진단</span>
                <span>• 절약 제안</span>
              </div>
            </div>

            <div class="feature-card glass-card">
              <div class="card-header">
                <!-- <div class="feature-icon">🔔</div> -->
                <div class="card-badge coming-soon">준비중</div>
              </div>
              <h4 class="feature-title">스마트 알림</h4>
              <p class="feature-description">
                이상 징후 감지 및 실시간 알림 시스템
              </p>
              <div class="feature-list">
                <span>• 이상 감지</span>
                <span>• 즉시 알림</span>
                <span>• 예방 관리</span>
              </div>
            </div>

            <div class="feature-card glass-card">
              <div class="card-header">
                <!-- <div class="feature-icon">⚙️</div> -->
                <div class="card-badge coming-soon">준비중</div>
              </div>
              <h4 class="feature-title">설비 제어</h4>
              <p class="feature-description">
                원격 설비 제어 및 자동화 시스템
              </p>
              <div class="feature-list">
                <span>• 원격 제어</span>
                <span>• 자동화</span>
                <span>• 스케줄링</span>
              </div>
            </div>
          </div>
        </div>

       
      </div>
    </main>

    <!-- Footer -->
    <footer class="main-footer">
      <div class="footer-content">
        <p class="footer-text">&copy; 2025 해줌 에너지 모니터링. All rights reserved.</p>
        <div class="footer-links">
          <span>v1.0.0</span>
        </div>
      </div>
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
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #E16349 0%, #F0BBB1 50%, #F3D7D0 100%);
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  padding-top: 90px; /* 헤더 높이만큼 패딩 추가 */
  box-sizing: border-box;
  position: relative;
  overflow-x: hidden;
}

.main-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" patternUnits="userSpaceOnUse" width="100" height="100"><circle cx="50" cy="50" r="0.5" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.3;
  pointer-events: none;
}

.main-content {
  flex: 1;
  padding: 0 24px 40px;
  width: 100%;
  box-sizing: border-box;
  position: relative;
  z-index: 1;
}

.content-wrapper {
  max-width: 90vw;
  margin: 0 auto;
  width: 100%;
}

/* Hero Section */
.hero-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 60vh;
  margin-bottom: 80px;
  position: relative;
}

.hero-content {
  flex: 1;
  max-width: 600px;
  z-index: 2;
}

.hero-title {
  font-size: 64px;
  font-weight: 800;
  color: var(--color-font-white);
  margin: 0 0 16px 0;
  letter-spacing: -0.02em;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  background: linear-gradient(135deg, #FFFFFF 0%, #F7EBEB 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 32px;
  font-weight: 600;
  color: var(--color-font-white);
  margin: 0 0 32px 0;
  opacity: 0.95;
}

.hero-description {
  font-size: 20px;
  color: var(--color-font-white);
  line-height: 1.6;
  margin: 0;
  opacity: 0.9;
}

.hero-decoration {
  flex: 1;
  position: relative;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.floating-card {
  position: absolute;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: float 6s ease-in-out infinite;
}

.card-1 {
  width: 120px;
  height: 80px;
  top: 20%;
  right: 20%;
  animation-delay: 0s;
}

.card-2 {
  width: 100px;
  height: 120px;
  top: 50%;
  right: 10%;
  animation-delay: 2s;
}

.card-3 {
  width: 80px;
  height: 80px;
  top: 70%;
  right: 30%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

/* Features Section */
.features-section {
  margin-bottom: 80px;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
}

.section-title {
  font-size: 40px;
  font-weight: 700;
  color: var(--color-font-primary);
  margin: 0 0 16px 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.section-description {
  font-size: 18px;
  color: var(--color-font-primary);
  opacity: 0.9;
  margin: 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 32px;
}

.feature-card {
  border-radius: 24px;
  padding: 32px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.primary-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
}

.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.05);
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.15);
}

.glass-card:hover {
  background: rgba(255, 255, 255, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.feature-icon {
  font-size: 48px;
  line-height: 1;
}

.card-badge {
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-badge.active {
  background: var(--color-primary);
  color: white;
}

.card-badge.coming-soon {
  background: rgba(251, 191, 36, 0.9);
  color: white;
}

.feature-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 16px 0;
}

.primary-card .feature-title {
  color: var(--color-font-primary);
}

.glass-card .feature-title {
  color: var(--color-font-secondary);
}

.feature-description {
  font-size: 16px;
  line-height: 1.6;
  margin: 0 0 24px 0;
}

.primary-card .feature-description {
  color: var(--color-font-secondary);
}

.glass-card .feature-description {
  color: var(--color-font-secondary );
  opacity: 0.9;
}

.feature-stats {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-number {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-primary);
}

.stat-label {
  font-size: 12px;
  color: var(--color-font-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.feature-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
}

.feature-list span {
  font-size: 14px;
  color: var(--color-font-secondary);
  opacity: 0.8;
}

.card-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  color: var(--color-primary);
  margin-top: auto;
}

.action-arrow {
  font-size: 20px;
  transition: transform 0.3s ease;
}

.primary-card:hover .action-arrow {
  transform: translateX(4px);
}

/* Stats Section */
.stats-section {
  margin-bottom: 60px;
}

.stats-container {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 32px;
  padding: 48px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.05);
}

.stats-header {
  text-align: center;
  margin-bottom: 48px;
}

.stats-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--color-font-white);
  margin: 0 0 12px 0;
}

.stats-subtitle {
  font-size: 16px;
  color: var(--color-font-white);
  opacity: 0.8;
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 32px;
}

.stat-card {
  text-align: center;
  padding: 32px 24px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  transition: all 0.3s ease;
}

.stat-card:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-4px);
}

.stat-icon {
  font-size: 32px;
  margin-bottom: 16px;
}

.stat-value {
  font-size: 32px;
  font-weight: 800;
  color: var(--color-font-white);
  margin-bottom: 8px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.stat-label {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-font-white);
  margin-bottom: 4px;
}

.stat-desc {
  font-size: 14px;
  color: var(--color-font-white);
  opacity: 0.8;
}

/* Footer */
.main-footer {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding: 32px 24px;
  width: 100%;
  position: relative;
  z-index: 1;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-text {
  margin: 0;
  color: var(--color-font-white);
  font-size: 16px;
  opacity: 0.8;
}

.footer-links span {
  color: var(--color-font-white);
  font-size: 14px;
  opacity: 0.6;
}

/* 모바일 반응형 */
@media (max-width: 1024px) {
  .hero-section {
    flex-direction: column;
    text-align: center;
    min-height: auto;
    gap: 40px;
  }
  
  .hero-decoration {
    height: 200px;
  }
  
  .hero-title {
    font-size: 48px;
  }
  
  .hero-subtitle {
    font-size: 24px;
  }
}

@media (max-width: 768px) {
  .main-container {
    padding-top: 80px; /* 모바일에서 헤더 높이 조정 */
  }
  
  .main-content {
    padding: 0 20px 30px;
  }
  
  .hero-title {
    font-size: 40px;
  }
  
  .hero-subtitle {
    font-size: 20px;
  }
  
  .hero-description {
    font-size: 16px;
  }
  
  .section-title {
    font-size: 32px;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .feature-card {
    padding: 24px;
  }
  
  .stats-container {
    padding: 32px 24px;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  
  .stat-card {
    padding: 24px 16px;
  }
  
  .footer-content {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .main-container {
    padding-top: 70px; /* 작은 모바일에서 헤더 높이 조정 */
  }
  
  .hero-title {
    font-size: 32px;
  }
  
  .hero-subtitle {
    font-size: 18px;
  }
  
  .section-title {
    font-size: 28px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
}

/* 고해상도 화면 */
@media (min-width: 1440px) {
  .hero-title {
    font-size: 72px;
  }
  
  .hero-subtitle {
    font-size: 36px;
  }
  
  .hero-description {
    font-size: 22px;
  }
  
  .section-title {
    font-size: 44px;
  }
  
  .section-description {
    font-size: 20px;
  }
}
</style>