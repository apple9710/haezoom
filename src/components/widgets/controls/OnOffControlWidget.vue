<template>
  <div class="on-off-control-widget">
    <!-- 위젯 헤더 (편집모드에서만 표시) -->
    <div v-if="isEditMode" class="widget-header">
      <h3 class="widget-title">{{ config.title || 'ON/OFF 제어' }}</h3>
      <div class="connection-status" :class="connectionClass">
        <span class="connection-dot"></span>
        <span class="connection-text">{{ connectionText }}</span>
      </div>
    </div>

    <!-- 현재 상태 표시 -->
    <div class="current-status">
      <div class="status-indicator" :class="statusClass">
        <div class="status-icon">{{ statusIcon }}</div>
        <div class="status-pulse" v-if="isTransitioning"></div>
      </div>
      <div class="status-text">
        <div class="status-title">{{ statusTitle }}</div>
        <div class="status-description">{{ statusDescription }}</div>
      </div>
    </div>

    <!-- 제어 버튼 -->
    <div class="control-section">
      <button 
        class="control-btn on-btn" 
        :class="{ active: currentState === 'on', disabled: !isConnected || isTransitioning }"
        :disabled="!isConnected || isTransitioning"
        @click="turnOn"
      >
        <span class="btn-icon">⚡</span>
        <span class="btn-text">켜기</span>
      </button>
      
      <button 
        class="control-btn off-btn" 
        :class="{ active: currentState === 'off', disabled: !isConnected || isTransitioning }"
        :disabled="!isConnected || isTransitioning"
        @click="turnOff"
      >
        <span class="btn-icon">⏸</span>
        <span class="btn-text">끄기</span>
      </button>
    </div>

    <!-- 추가 정보 -->
    <div class="device-info">
      <div class="info-row">
        <span class="info-label">장치명:</span>
        <span class="info-value">{{ config.deviceName || '장치 #1' }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">위치:</span>
        <span class="info-value">{{ config.location || '알 수 없음' }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">상태 변경:</span>
        <span class="info-value">{{ lastStateChange }}</span>
      </div>
    </div>

    <!-- 스케줄 정보 (옵션) -->
    <div v-if="config.showSchedule" class="schedule-info">
      <div class="schedule-title">예약된 작업</div>
      <div class="schedule-list">
        <div 
          v-for="schedule in schedules" 
          :key="schedule.id"
          class="schedule-item"
          :class="{ active: schedule.active }"
        >
          <span class="schedule-time">{{ schedule.time }}</span>
          <span class="schedule-action">{{ schedule.action }}</span>
          <span class="schedule-status">{{ schedule.active ? '활성' : '비활성' }}</span>
        </div>
      </div>
    </div>

    <!-- 제어 로그 -->
    <div class="control-log">
      <div class="log-title">제어 기록</div>
      <div class="log-list">
        <div 
          v-for="(log, index) in controlLogs" 
          :key="index"
          class="log-item"
        >
          <span class="log-time">{{ log.time }}</span>
          <span class="log-action" :class="`action-${log.action}`">{{ log.message }}</span>
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
      title: 'ON/OFF 제어',
      deviceName: '장치 #1',
      location: '메인 홀',
      showSchedule: false,
      dataSource: 'api/device-control'
    })
  },
  isEditMode: {
    type: Boolean,
    default: false
  }
})

// 반응형 데이터
const currentState = ref('off') // 'on', 'off', 'unknown'
const isConnected = ref(true)
const isTransitioning = ref(false)
const lastStateChange = ref('알 수 없음')
const lastUpdateTime = ref(new Date().toLocaleTimeString())
const controlLogs = ref([])
const schedules = ref([
  { id: 1, time: '09:00', action: '자동 켜기', active: true },
  { id: 2, time: '18:00', action: '자동 끄기', active: true },
  { id: 3, time: '22:00', action: '절전 모드', active: false }
])

let statusInterval = null

// 연결 상태
const connectionClass = computed(() => isConnected.value ? 'connected' : 'disconnected')
const connectionText = computed(() => isConnected.value ? '연결됨' : '연결 끊김')

// 현재 상태
const statusClass = computed(() => {
  if (!isConnected.value) return 'status-disconnected'
  if (isTransitioning.value) return 'status-transitioning'
  return `status-${currentState.value}`
})

const statusIcon = computed(() => {
  if (!isConnected.value) return '❌'
  if (isTransitioning.value) return '⏳'
  return currentState.value === 'on' ? '🟢' : '🔴'
})

const statusTitle = computed(() => {
  if (!isConnected.value) return '연결 끊김'
  if (isTransitioning.value) return '처리 중'
  return currentState.value === 'on' ? '켜짐' : '꺼짐'
})

const statusDescription = computed(() => {
  if (!isConnected.value) return '장치와 연결이 끊어졌습니다'
  if (isTransitioning.value) return '명령을 처리하고 있습니다'
  return currentState.value === 'on' ? '장치가 정상 작동 중입니다' : '장치가 꺼져 있습니다'
})

// 제어 메서드
const turnOn = async () => {
  if (!isConnected.value || isTransitioning.value || props.isEditMode) return

  isTransitioning.value = true
  addControlLog('on', '켜기 명령 전송')

  try {
    // 실제로는 API 호출
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    currentState.value = 'on'
    lastStateChange.value = new Date().toLocaleTimeString()
    addControlLog('on', '장치 켜기 완료')
  } catch (error) {
    console.error('장치 켜기 실패:', error)
    addControlLog('error', '켜기 실패: ' + error.message)
  } finally {
    isTransitioning.value = false
    updateStatus()
  }
}

const turnOff = async () => {
  if (!isConnected.value || isTransitioning.value || props.isEditMode) return

  isTransitioning.value = true
  addControlLog('off', '끄기 명령 전송')

  try {
    // 실제로는 API 호출
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    currentState.value = 'off'
    lastStateChange.value = new Date().toLocaleTimeString()
    addControlLog('off', '장치 끄기 완료')
  } catch (error) {
    console.error('장치 끄기 실패:', error)
    addControlLog('error', '끄기 실패: ' + error.message)
  } finally {
    isTransitioning.value = false
    updateStatus()
  }
}

// 제어 로그 추가
const addControlLog = (action, message) => {
  controlLogs.value.unshift({
    time: new Date().toLocaleTimeString(),
    action,
    message
  })

  // 최대 10개까지만 유지
  if (controlLogs.value.length > 10) {
    controlLogs.value = controlLogs.value.slice(0, 10)
  }
}

// 상태 업데이트
const updateStatus = () => {
  lastUpdateTime.value = new Date().toLocaleTimeString()
  
  // 연결 상태 시뮬레이션 (실제로는 ping 등으로 확인)
  if (Math.random() < 0.95) { // 95% 확률로 연결됨
    isConnected.value = true
  } else {
    isConnected.value = false
    addControlLog('error', '장치 연결 끊김')
  }
}

// 주기적 상태 체크
const startStatusCheck = () => {
  statusInterval = setInterval(() => {
    if (!props.isEditMode && !isTransitioning.value) {
      updateStatus()
    }
  }, 10000) // 10초마다 상태 체크
}

// 라이프사이클
onMounted(() => {
  // 초기 상태 설정
  currentState.value = 'off'
  lastStateChange.value = new Date().toLocaleTimeString()
  addControlLog('info', '제어 위젯 초기화 완료')
  
  // 주기적 상태 체크 시작
  startStatusCheck()
})

onUnmounted(() => {
  if (statusInterval) {
    clearInterval(statusInterval)
  }
})
</script>

<style scoped>
.on-off-control-widget {
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

.connection-status {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.connection-status.connected {
  background: #dcfce7;
  color: #166534;
}

.connection-status.disconnected {
  background: #fecaca;
  color: #991b1b;
}

.connection-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.current-status {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding: 20px;
  background: #f9fafb;
  border-radius: 12px;
}

.status-indicator {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.status-on {
  background: #dcfce7;
  border: 3px solid #10b981;
}

.status-off {
  background: #f3f4f6;
  border: 3px solid #6b7280;
}

.status-transitioning {
  background: #fef3c7;
  border: 3px solid #f59e0b;
}

.status-disconnected {
  background: #fecaca;
  border: 3px solid #ef4444;
}

.status-icon {
  font-size: 24px;
}

.status-pulse {
  position: absolute;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  border-radius: 50%;
  border: 3px solid #f59e0b;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.1);
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

.control-section {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.control-btn {
  flex: 1;
  padding: 16px;
  border: 2px solid transparent;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  background: #f9fafb;
  color: #6b7280;
}

.control-btn:not(.disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.on-btn.active {
  background: #dcfce7;
  color: #166534;
  border-color: #10b981;
}

.off-btn.active {
  background: #fecaca;
  color: #991b1b;
  border-color: #ef4444;
}

.control-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-icon {
  font-size: 24px;
}

.btn-text {
  font-size: 14px;
}

.device-info {
  background: #f9fafb;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
}

.info-row:not(:last-child) {
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 8px;
  padding-bottom: 8px;
}

.info-label {
  font-size: 14px;
  color: #6b7280;
}

.info-value {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

.schedule-info {
  margin-bottom: 16px;
}

.schedule-title,
.log-title {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.schedule-list,
.log-list {
  max-height: 120px;
  overflow-y: auto;
}

.schedule-item,
.log-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: #f9fafb;
  border-radius: 6px;
  margin-bottom: 4px;
  font-size: 12px;
}

.schedule-item.active {
  background: #dcfce7;
}

.schedule-time,
.log-time {
  color: #6b7280;
  min-width: 60px;
}

.schedule-action {
  flex: 1;
  color: #1f2937;
}

.schedule-status {
  color: #059669;
  font-weight: 500;
}

.log-action {
  flex: 1;
  color: #1f2937;
}

.action-on {
  color: #059669;
}

.action-off {
  color: #dc2626;
}

.action-error {
  color: #dc2626;
  font-weight: 500;
}

.action-info {
  color: #2563eb;
}

.control-log {
  flex: 1;
  margin-bottom: 12px;
}

.update-time {
  font-size: 12px;
  color: #9ca3af;
  text-align: center;
  margin-top: auto;
}
</style>
