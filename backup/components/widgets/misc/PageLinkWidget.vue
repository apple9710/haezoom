<template>
  <div class="page-link-widget">
    <!-- 위젯 헤더 -->
    <div class="widget-header">
      <h3 class="widget-title">{{ config.title || '페이지 링크' }}</h3>
      <div class="link-status" :class="linkStatusClass">
        <span class="status-dot"></span>
        <span class="status-text">{{ linkStatusText }}</span>
      </div>
    </div>

    <!-- 링크 정보 -->
    <div class="link-info">
      <div class="link-icon">
        <img 
          v-if="faviconUrl" 
          :src="faviconUrl" 
          :alt="config.title"
          class="favicon"
          @error="faviconUrl = null"
        >
        <span v-else class="default-icon">🔗</span>
      </div>
      
      <div class="link-details">
        <div class="link-title">{{ linkTitle }}</div>
        <div class="link-description">{{ linkDescription }}</div>
        <div class="link-url">{{ displayUrl }}</div>
      </div>
    </div>

    <!-- QR 코드 (옵션) -->
    <div v-if="config.showQrCode" class="qr-section">
      <div class="qr-title">QR 코드로 접속</div>
      <div class="qr-container">
        <div class="qr-placeholder">
          <span class="qr-icon">📱</span>
          <span class="qr-text">QR 코드</span>
        </div>
      </div>
    </div>

    <!-- 링크 통계 (옵션) -->
    <div v-if="config.showStats" class="link-stats">
      <div class="stats-title">접속 통계</div>
      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-value">{{ clickCount }}</span>
          <span class="stat-label">총 클릭</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ todayClicks }}</span>
          <span class="stat-label">오늘 클릭</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ avgResponseTime }}ms</span>
          <span class="stat-label">응답시간</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ uptimePercentage }}%</span>
          <span class="stat-label">가동률</span>
        </div>
      </div>
    </div>

    <!-- 즐겨찾기 및 공유 -->
    <div class="link-actions">
      <button 
        class="action-btn bookmark-btn"
        :class="{ active: isBookmarked }"
        @click="toggleBookmark"
        :disabled="isEditMode"
      >
        <span class="btn-icon">{{ isBookmarked ? '★' : '☆' }}</span>
        <span class="btn-text">즐겨찾기</span>
      </button>
      
      <button 
        class="action-btn share-btn"
        @click="shareLink"
        :disabled="isEditMode"
      >
        <span class="btn-icon">📤</span>
        <span class="btn-text">공유</span>
      </button>
    </div>

    <!-- 메인 링크 버튼 -->
    <div class="main-link">
      <a 
        :href="config.url"
        target="_blank"
        rel="noopener noreferrer"
        class="link-button"
        :class="{ disabled: !isLinkValid || isEditMode }"
        @click="handleLinkClick"
      >
        <span class="link-icon">🌐</span>
        <span class="link-text">{{ config.buttonText || '페이지로 이동' }}</span>
        <span class="external-icon">↗</span>
      </a>
    </div>

    <!-- 최근 접속 기록 -->
    <div v-if="config.showHistory && accessHistory.length > 0" class="access-history">
      <div class="history-title">최근 접속</div>
      <div class="history-list">
        <div 
          v-for="(access, index) in accessHistory.slice(0, 3)"
          :key="index"
          class="history-item"
        >
          <span class="history-time">{{ formatTime(access.timestamp) }}</span>
          <span class="history-user">{{ access.user || '익명' }}</span>
          <span class="history-device">{{ access.device }}</span>
        </div>
      </div>
    </div>

    <!-- 업데이트 시간 -->
    <div class="update-time">
      마지막 확인: {{ lastCheckTime }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  },
  config: {
    type: Object,
    default: () => ({
      title: '페이지 링크',
      url: 'https://example.com',
      buttonText: '페이지로 이동',
      showQrCode: false,
      showStats: false,
      showHistory: false,
      checkInterval: 300000 // 5분
    })
  },
  isEditMode: {
    type: Boolean,
    default: false
  }
})

// 반응형 데이터
const isLinkValid = ref(true)
const linkTitle = ref('페이지 제목')
const linkDescription = ref('페이지 설명')
const faviconUrl = ref(null)
const isBookmarked = ref(false)
const clickCount = ref(847)
const todayClicks = ref(23)
const avgResponseTime = ref(245)
const uptimePercentage = ref(99.2)
const lastCheckTime = ref(new Date().toLocaleTimeString())
const accessHistory = ref([
  { timestamp: new Date(Date.now() - 300000), user: 'admin', device: 'Chrome' },
  { timestamp: new Date(Date.now() - 900000), user: 'user1', device: 'Safari' },
  { timestamp: new Date(Date.now() - 1800000), user: 'admin', device: 'Edge' }
])

let checkInterval = null

// 계산된 속성
const displayUrl = computed(() => {
  try {
    const url = new URL(props.config.url)
    return url.hostname
  } catch {
    return props.config.url
  }
})

const linkStatusClass = computed(() => {
  if (!isLinkValid.value) return 'status-error'
  if (avgResponseTime.value > 1000) return 'status-slow'
  return 'status-ok'
})

const linkStatusText = computed(() => {
  if (!isLinkValid.value) return '접속 불가'
  if (avgResponseTime.value > 1000) return '응답 지연'
  return '정상'
})

// 메서드
const checkLinkStatus = async () => {
  try {
    // 실제로는 HEAD 요청이나 ping을 통해 확인
    console.log('링크 상태 확인:', props.config.url)
    
    // 시뮬레이션
    const randomDelay = Math.random() * 500 + 200
    avgResponseTime.value = Math.round(randomDelay)
    
    // 95% 확률로 성공
    isLinkValid.value = Math.random() > 0.05
    
    // 메타데이터 가져오기 시뮬레이션
    if (isLinkValid.value && !linkTitle.value.includes('제목')) {
      linkTitle.value = '에너지 관리 시스템'
      linkDescription.value = '실시간 에너지 모니터링 및 분석 플랫폼'
      faviconUrl.value = '/favicon.ico'
    }
    
    lastCheckTime.value = new Date().toLocaleTimeString()
    
  } catch (error) {
    console.error('링크 상태 확인 실패:', error)
    isLinkValid.value = false
  }
}

const handleLinkClick = (event) => {
  if (props.isEditMode || !isLinkValid.value) {
    event.preventDefault()
    return
  }

  // 클릭 통계 업데이트
  clickCount.value++
  todayClicks.value++
  
  // 접속 기록 추가
  accessHistory.value.unshift({
    timestamp: new Date(),
    user: 'admin', // 실제로는 현재 사용자
    device: getBrowserName()
  })

  // 최대 10개까지만 유지
  if (accessHistory.value.length > 10) {
    accessHistory.value = accessHistory.value.slice(0, 10)
  }
}

const toggleBookmark = () => {
  if (props.isEditMode) return
  isBookmarked.value = !isBookmarked.value
  console.log('즐겨찾기:', isBookmarked.value ? '추가' : '제거')
}

const shareLink = async () => {
  if (props.isEditMode) return

  try {
    if (navigator.share) {
      await navigator.share({
        title: linkTitle.value,
        text: linkDescription.value,
        url: props.config.url
      })
    } else {
      // Fallback: 클립보드에 복사
      await navigator.clipboard.writeText(props.config.url)
      console.log('URL이 클립보드에 복사되었습니다')
    }
  } catch (error) {
    console.error('공유 실패:', error)
  }
}

const formatTime = (timestamp) => {
  const now = new Date()
  const diff = now - timestamp
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)

  if (hours > 0) return `${hours}시간 전`
  if (minutes > 0) return `${minutes}분 전`
  return '방금 전'
}

const getBrowserName = () => {
  const userAgent = navigator.userAgent
  if (userAgent.includes('Chrome')) return 'Chrome'
  if (userAgent.includes('Firefox')) return 'Firefox'
  if (userAgent.includes('Safari')) return 'Safari'
  if (userAgent.includes('Edge')) return 'Edge'
  return 'Unknown'
}

// 라이프사이클
onMounted(() => {
  // 초기 링크 상태 확인
  checkLinkStatus()
  
  // 주기적 상태 확인
  if (props.config.checkInterval && props.config.checkInterval > 0) {
    checkInterval = setInterval(() => {
      if (!props.isEditMode) {
        checkLinkStatus()
      }
    }, props.config.checkInterval)
  }
})

onUnmounted(() => {
  if (checkInterval) {
    clearInterval(checkInterval)
  }
})
</script>

<style scoped>
.page-link-widget {
  background: white;
  border-radius: 12px;
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.widget-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.link-status {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-ok {
  background: #dcfce7;
  color: #166534;
}

.status-slow {
  background: #fef3c7;
  color: #92400e;
}

.status-error {
  background: #fecaca;
  color: #991b1b;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.link-info {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 20px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 12px;
}

.link-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.favicon {
  width: 24px;
  height: 24px;
}

.default-icon {
  font-size: 24px;
}

.link-details {
  flex: 1;
  min-width: 0;
}

.link-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.link-description {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 4px;
  line-height: 1.4;
}

.link-url {
  font-size: 12px;
  color: #3b82f6;
  font-family: monospace;
}

.qr-section {
  margin-bottom: 20px;
}

.qr-title {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.qr-container {
  display: flex;
  justify-content: center;
}

.qr-placeholder {
  width: 80px;
  height: 80px;
  background: #f3f4f6;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.qr-icon {
  font-size: 24px;
}

.qr-text {
  font-size: 10px;
  color: #6b7280;
}

.link-stats {
  margin-bottom: 20px;
}

.stats-title {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.stat-item {
  background: #f9fafb;
  border-radius: 6px;
  padding: 8px;
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 14px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 2px;
}

.stat-label {
  display: block;
  font-size: 10px;
  color: #6b7280;
}

.link-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.action-btn {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.action-btn:not(:disabled):hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.bookmark-btn.active {
  background: #fef3c7;
  border-color: #f59e0b;
  color: #92400e;
}

.main-link {
  margin-bottom: 20px;
}

.link-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.link-button:not(.disabled):hover {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.link-button.disabled {
  background: #9ca3af;
  cursor: not-allowed;
  transform: none;
}

.link-icon {
  font-size: 18px;
}

.external-icon {
  font-size: 14px;
}

.access-history {
  margin-bottom: 12px;
}

.history-title {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.history-list {
  max-height: 80px;
  overflow-y: auto;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  background: #f9fafb;
  border-radius: 4px;
  margin-bottom: 4px;
  font-size: 12px;
}

.history-time {
  color: #6b7280;
  min-width: 60px;
}

.history-user {
  color: #1f2937;
  font-weight: 500;
  flex: 1;
}

.history-device {
  color: #6b7280;
  font-size: 10px;
}

.update-time {
  font-size: 12px;
  color: #9ca3af;
  text-align: center;
  margin-top: auto;
}
</style>
