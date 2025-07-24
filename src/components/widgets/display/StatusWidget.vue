<template>
  <div class="status-widget">
    <!-- 위젯 헤더 -->
    <div  class="widget-header">
      <h3 class="widget-title">{{ config.title || '상태 표시' }}</h3>
      <div class="refresh-btn" @click="refreshStatus" :disabled="isEditMode">
        <span class="refresh-icon" :class="{ spinning: isRefreshing }">↻</span>
      </div>
    </div>

    <!-- 메인 상태 표시 -->
    <div class="main-status">
      <div class="status-circle" :class="`status-${currentStatus.level}`">
        <div class="status-inner">
          <span class="status-icon">{{ currentStatus.icon }}</span>
        </div>
        <div class="status-pulse" v-if="currentStatus.level === 'critical'"></div>
      </div>
      <div class="status-text">
        <div class="status-title">{{ currentStatus.title }}</div>
        <div class="status-description">{{ currentStatus.description }}</div>
      </div>
    </div>

    <!-- 상세 상태 정보 -->
    <div class="status-details">
      <div 
        v-for="item in statusItems" 
        :key="item.id"
        class="status-item"
        :class="`item-${item.status}`"
      >
        <div class="item-indicator" :class="`indicator-${item.status}`"></div>
        <div class="item-content">
          <span class="item-name">{{ item.name }}</span>
          <span class="item-value">{{ item.value }}</span>
        </div>
        <div class="item-time">{{ item.lastUpdate }}</div>
      </div>
    </div>

    <!-- 상태 히스토리 -->
    <div class="status-history">
      <div class="history-title">상태 변화 기록</div>
      <div class="history-timeline">
        <div 
          v-for="(event, index) in statusHistory" 
          :key="index"
          class="timeline-item"
          :class="`timeline-${event.level}`"
        >
          <div class="timeline-dot" :class="`dot-${event.level}`"></div>
          <div class="timeline-content">
            <div class="timeline-time">{{ event.time }}</div>
            <div class="timeline-message">{{ event.message }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 업데이트 시간 -->
    <div class="update-time">
      마지막 업데이트: {{ lastUpdateTime }}
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
      title: '상태 표시',
      monitoredItems: [
        { id: 'power', name: '전력 시스템' },
        { id: 'network', name: '네트워크' },
        { id: 'sensors', name: '센서' },
        { id: 'storage', name: '저장장치' }
      ],
      dataSource: 'api/system-status'
    })
  },
  isEditMode: {
    type: Boolean,
    default: false
  }
})

// 반응형 데이터
const statusItems = ref([])
const statusHistory = ref([])
const lastUpdateTime = ref(new Date().toLocaleTimeString())
const isRefreshing = ref(false)
let updateInterval = null

// 상태 레벨 정의
const statusLevels = {
  normal: { title: '정상', description: '모든 시스템이 정상 작동 중입니다', icon: '✓', color: '#10b981' },
  warning: { title: '주의', description: '일부 시스템에 주의가 필요합니다', icon: '⚠', color: '#f59e0b' },
  critical: { title: '위험', description: '즉시 확인이 필요한 문제가 있습니다', icon: '✕', color: '#ef4444' },
  unknown: { title: '알 수 없음', description: '상태를 확인할 수 없습니다', icon: '?', color: '#6b7280' }
}

// 현재 전체 상태 계산
const currentStatus = computed(() => {
  if (statusItems.value.length === 0) {
    return statusLevels.unknown
  }

  const hasCritical = statusItems.value.some(item => item.status === 'critical')
  const hasWarning = statusItems.value.some(item => item.status === 'warning')

  if (hasCritical) return statusLevels.critical
  if (hasWarning) return statusLevels.warning
  return statusLevels.normal
})

// 샘플 데이터 생성
const generateStatusData = () => {
  const items = props.config.monitoredItems || [
    { id: 'power', name: '전력 시스템' },
    { id: 'network', name: '네트워크' },
    { id: 'sensors', name: '센서' },
    { id: 'storage', name: '저장장치' },
    { id: 'hvac', name: '공조 시스템' }
  ]
  
  const statuses = ['normal', 'warning', 'critical']
  const statusValues = {
    normal: ['정상', '온라인', '활성', '연결됨'],
    warning: ['주의', '지연', '부분 오류', '불안정'],
    critical: ['오류', '오프라인', '실패', '연결 끊김']
  }

  statusItems.value = items.map(item => {
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]
    const values = statusValues[randomStatus]
    const randomValue = values[Math.floor(Math.random() * values.length)]
    
    return {
      id: item.id,
      name: item.name,
      status: randomStatus,
      value: randomValue,
      lastUpdate: new Date().toLocaleTimeString()
    }
  })

  lastUpdateTime.value = new Date().toLocaleTimeString()
}

// 상태 히스토리 추가
const addStatusHistory = (level, message) => {
  statusHistory.value.unshift({
    level,
    message,
    time: new Date().toLocaleTimeString()
  })

  // 최대 10개까지만 유지
  if (statusHistory.value.length > 10) {
    statusHistory.value = statusHistory.value.slice(0, 10)
  }
}

// 상태 새로고침
const refreshStatus = async () => {
  if (isRefreshing.value || props.isEditMode) return

  isRefreshing.value = true
  
  // 이전 상태 저장
  const previousStatus = currentStatus.value.title

  try {
    // 실제로는 API 호출
    await new Promise(resolve => setTimeout(resolve, 1000))
    generateStatusData()

    // 상태 변화 확인
    const newStatus = currentStatus.value.title
    if (previousStatus !== newStatus) {
      addStatusHistory(currentStatus.value.level || 'normal', `상태가 ${previousStatus}에서 ${newStatus}로 변경됨`)
    }
  } catch (error) {
    console.error('상태 업데이트 실패:', error)
    addStatusHistory('critical', '상태 업데이트 실패')
  } finally {
    isRefreshing.value = false
  }
}

// 주기적 업데이트
const startPeriodicUpdate = () => {
  updateInterval = setInterval(() => {
    if (!props.isEditMode) {
      refreshStatus()
    }
  }, 10000) // 10초마다 업데이트
}

// 라이프사이클
onMounted(() => {
  // 초기 데이터 로드
  generateStatusData()
  
  // 초기 히스토리 데이터 추가
  addStatusHistory('normal', '상태 모니터링 시작')
  addStatusHistory('warning', '네트워크 지연 감지됨')
  addStatusHistory('critical', '저장장치 용량 부족 경고')
  addStatusHistory('normal', '전력 시스템 안정화')
  addStatusHistory('warning', 'HVAC 시스템 점검 필요')
  
  // 주기적 업데이트 시작
  startPeriodicUpdate()
})

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval)
  }
})
</script>

<style scoped>
.status-widget {
  /* background: white; */
  border-radius: 12px;
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  /* box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); */
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

.refresh-btn {
  background: #f3f4f6;
  border: none;
  border-radius: 6px;
  padding: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.refresh-btn:hover:not([disabled]) {
  background: #e5e7eb;
}

.refresh-btn[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

.refresh-icon {
  font-size: 14px;
  display: inline-block;
  transition: transform 0.3s ease;
}

.refresh-icon.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.main-status {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding: 20px;
  background: #f9fafb;
  border-radius: 12px;
}

.status-circle {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.status-normal {
  background: #dcfce7;
  border: 3px solid #10b981;
}

.status-warning {
  background: #fef3c7;
  border: 3px solid #f59e0b;
}

.status-critical {
  background: #fecaca;
  border: 3px solid #ef4444;
}

.status-unknown {
  background: #f3f4f6;
  border: 3px solid #6b7280;
}

.status-inner {
  font-size: 24px;
  font-weight: bold;
}

.status-pulse {
  position: absolute;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  border-radius: 50%;
  border: 3px solid #ef4444;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.2);
    opacity: 0;
  }
}

.status-text {
  flex: 1;
}

.status-title {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;
}

.status-description {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.4;
}

.status-details {
  margin-bottom: 20px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 8px;
  background: #f9fafb;
}

.item-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.indicator-normal {
  background: #10b981;
}

.indicator-warning {
  background: #f59e0b;
}

.indicator-critical {
  background: #ef4444;
}

.item-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-name {
  font-size: 14px;
  color: #1f2937;
  font-weight: 500;
}

.item-value {
  font-size: 14px;
  color: #6b7280;
}

.item-time {
  font-size: 12px;
  color: #9ca3af;
}

.status-history {
  flex: 1;
  margin-bottom: 12px;
}

.history-title {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;
}

.history-timeline {
  max-height: 120px;
  overflow-y: auto;
}

.timeline-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 8px;
}

.timeline-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-top: 6px;
  flex-shrink: 0;
}

.dot-normal {
  background: #10b981;
}

.dot-warning {
  background: #f59e0b;
}

.dot-critical {
  background: #ef4444;
}

.timeline-content {
  flex: 1;
}

.timeline-time {
  font-size: 12px;
  color: #9ca3af;
  margin-bottom: 2px;
}

.timeline-message {
  font-size: 12px;
  color: #4b5563;
  line-height: 1.3;
}

.update-time {
  font-size: 12px;
  color: #9ca3af;
  text-align: center;
  margin-top: auto;
}
</style>
