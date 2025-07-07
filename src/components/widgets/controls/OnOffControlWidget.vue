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

    <!-- 실시간 업데이트 표시 -->
    <div v-if="!isEditMode && lastUpdateTime" class="update-indicator">
      <span class="update-time">최근 업데이트: {{ lastUpdateTime }}</span>
      <div class="status-dot" :class="{ active: isConnected }"></div>
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
import { useControlWidget } from '@/composables/useWidgetData'

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
  },
  instanceId: {
    type: [String, Number],
    default: null
  }
})

// 위젯 데이터 관리
const { widgetData, updateData } = useControlWidget(props.instanceId)

// 현재 데이터 - 실시간 데이터를 우선 사용
const currentData = computed(() => {
  const realtimeData = widgetData.value
  const fallbackData = props.data
  
  if (realtimeData && Object.keys(realtimeData).length > 0) {
    return realtimeData
  }
  
  if (fallbackData && Object.keys(fallbackData).length > 0) {
    return fallbackData
  }
  
  // 기본 데이터
  return {
    isOn: false,
    label: '설비 상태',
    lastToggled: new Date().toLocaleTimeString()
  }
})

// 반응형 데이터
const currentState = computed(() => currentData.value.isOn ? 'on' : 'off')
const isConnected = ref(true)
const isTransitioning = ref(false)
const lastStateChange = computed(() => currentData.value.lastToggled || '알 수 없음')
const lastUpdateTime = computed(() => currentData.value.lastUpdated || new Date().toLocaleTimeString())

// 로그 데이터
const controlLogs = ref([])

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

  console.log('OnOffControl - turnOn 호출, instanceId:', props.instanceId)
  console.log('OnOffControl - 현재 데이터:', currentData.value)

  isTransitioning.value = true
  addControlLog('on', '켜기 명령 전송')

  try {
    // 실제로는 API 호출
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 실시간 데이터 스토어 업데이트
    const newData = {
      ...currentData.value,
      isOn: true,
      lastToggled: new Date().toLocaleTimeString(),
      lastUpdated: new Date().toLocaleTimeString()
    }
    
    console.log('OnOffControl - 업데이트할 데이터:', newData)
    updateData(newData)
    console.log('OnOffControl - 업데이트 후 스토어 데이터:', widgetData.value)
    
    addControlLog('on', '장치 켜기 완료')
  } catch (error) {
    console.error('장치 켜기 실패:', error)
    addControlLog('error', '켜기 실패: ' + error.message)
  } finally {
    isTransitioning.value = false
  }
}

const turnOff = async () => {
  if (!isConnected.value || isTransitioning.value || props.isEditMode) return

  console.log('OnOffControl - turnOff 호출, instanceId:', props.instanceId)
  console.log('OnOffControl - 현재 데이터:', currentData.value)

  isTransitioning.value = true
  addControlLog('off', '끄기 명령 전송')

  try {
    // 실제로는 API 호출
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 실시간 데이터 스토어 업데이트
    const newData = {
      ...currentData.value,
      isOn: false,
      lastToggled: new Date().toLocaleTimeString(),
      lastUpdated: new Date().toLocaleTimeString()
    }
    
    console.log('OnOffControl - 업데이트할 데이터:', newData)
    updateData(newData)
    console.log('OnOffControl - 업데이트 후 스토어 데이터:', widgetData.value)
    
    addControlLog('off', '장치 끄기 완료')
  } catch (error) {
    console.error('장치 끄기 실패:', error)
    addControlLog('error', '끄기 실패: ' + error.message)
  } finally {
    isTransitioning.value = false
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

// 주기적 상태 체크
const startStatusCheck = () => {
  // 컨트롤 위젯의 경우 사용자가 직접 제어하므로 주기적 상태 체크 비활성화
  // 필요시 연결 상태만 체크하는 가벼운 인터벌로 변경
  statusInterval = setInterval(() => {
    if (!props.isEditMode && !isTransitioning.value) {
      // 단순히 연결 상태만 체크 (상태값 변경 없음)
      // 실제 환경에서는 ping이나 health check 등으로 연결 상태만 확인
    }
  }, 30000) // 30초마다 연결 상태만 체크 (데이터 변경 없음)
}

// 라이프사이클
onMounted(() => {
  // 초기 데이터가 없다면 기본 데이터 설정
  if (!widgetData.value || Object.keys(widgetData.value).length === 0) {
    const initialData = {
      isOn: false,
      label: '설비 상태',
      lastToggled: new Date().toLocaleTimeString(),
      lastUpdated: new Date().toLocaleTimeString()
    }
    updateData(initialData)
  }
  
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

.update-indicator {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 8px 12px;
  background: #f8fafc;
  border-radius: 8px;
  font-size: 12px;
  color: #64748b;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #e2e8f0;
  transition: background-color 0.3s ease;
}

.status-dot.active {
  background: #10b981;
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

.status-disconnected {
  background: #fecaca;
  border: 3px solid #ef4444;
}

.status-transitioning {
  background: #fef3c7;
  border: 3px solid #f59e0b;
}

.status-icon {
  font-size: 24px;
}

.status-pulse {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid #f59e0b;
  animation: pulse 1.5s infinite;
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
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.status-description {
  font-size: 14px;
  color: #64748b;
  line-height: 1.4;
}

.control-section {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.control-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 12px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
}

.control-btn:hover:not(.disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.control-btn.active {
  border-color: #10b981;
  background: #dcfce7;
  color: #166534;
}

.control-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.on-btn.active {
  border-color: #10b981;
  background: #dcfce7;
  color: #166534;
}

.off-btn.active {
  border-color: #6b7280;
  background: #f3f4f6;
  color: #374151;
}

.btn-icon {
  font-size: 20px;
}

.btn-text {
  font-weight: 600;
}

.device-info {
  background: #f8fafc;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-label {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

.info-value {
  font-size: 14px;
  color: #1f2937;
  font-weight: 600;
}

.control-log {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.log-title {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;
}

.log-list {
  flex: 1;
  background: #f8fafc;
  border-radius: 8px;
  padding: 8px;
  overflow-y: auto;
  max-height: 150px;
}

.log-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  margin-bottom: 4px;
  background: white;
  border-radius: 6px;
  font-size: 12px;
}

.log-time {
  color: #64748b;
  font-weight: 500;
  white-space: nowrap;
}

.log-action {
  flex: 1;
  margin-left: 12px;
  font-weight: 500;
}

.action-on {
  color: #10b981;
}

.action-off {
  color: #6b7280;
}

.action-error {
  color: #ef4444;
}

.action-info {
  color: #3b82f6;
}

.update-time {
  margin-top: 16px;
  text-align: center;
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}
</style>
