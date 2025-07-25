<template>
  <div class="on-off-control-widget">
    <div class="media-container">
      <!-- 위젯 헤더 (편집모드에서만 표시) -->
      <div class="widget-header">
        <h3 class="widget-title">{{ config.title || 'ON/OFF 제어' }}</h3>
        <!-- <div class="connection-status" :class="connectionClass">
          <span class="connection-dot"></span>
          <span class="connection-text">{{ connectionText }}</span>
        </div> -->
      </div>

      <!-- 실시간 업데이트 표시 -->
      <div v-if="!isEditMode && lastUpdateTime" class="update-indicator">
        <span class="update-time">최근 업데이트: {{ lastUpdateTime }}</span>
        <div class="status-dot" :class="{ active: isConnected }"></div>
      </div>

      <!-- 현재 상태 표시 -->
      <div class="current-status">
        <div class="status-indicator" :class="statusClass">
          <div class="status-icon">

            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <mask id="mask0_2260_9556" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="48" height="48">
            <rect width="48" height="48" fill="#D9D9D9"/>
            </mask>
            <g mask="url(#mask0_2260_9556)">
            <path d="M23.991 24.1C23.3303 24.1 22.775 23.8728 22.325 23.4185C21.875 22.9645 21.65 22.4083 21.65 21.75V4.9C21.65 4.24167 21.878 3.677 22.334 3.206C22.7897 2.73533 23.348 2.5 24.009 2.5C24.6697 2.5 25.225 2.73533 25.675 3.206C26.125 3.677 26.35 4.24167 26.35 4.9V21.75C26.35 22.4083 26.122 22.9645 25.666 23.4185C25.2103 23.8728 24.652 24.1 23.991 24.1ZM24 43.35C21.3333 43.35 18.8333 42.85 16.5 41.85C14.1667 40.85 12.125 39.475 10.375 37.725C8.625 35.975 7.25 33.9333 6.25 31.6C5.25 29.2667 4.75 26.7667 4.75 24.1C4.75 21.9667 5.08333 19.9167 5.75 17.95C6.41667 15.9833 7.41667 14.1833 8.75 12.55C9.18333 11.9833 9.75 11.675 10.45 11.625C11.15 11.575 11.7625 11.7792 12.2875 12.2375C12.7292 12.6792 12.95 13.225 12.95 13.875C12.95 14.525 12.7667 15.1167 12.4 15.65C11.4333 16.85 10.7 18.179 10.2 19.637C9.7 21.0947 9.45 22.5823 9.45 24.1C9.45 28.1453 10.8637 31.5817 13.691 34.409C16.5183 37.2363 19.9547 38.65 24 38.65C28.0453 38.65 31.4817 37.2363 34.309 34.409C37.1363 31.5817 38.55 28.1453 38.55 24.1C38.55 22.5333 38.3 21.0417 37.8 19.625C37.3 18.2083 36.5833 16.8833 35.65 15.65C35.239 15.0817 35.0278 14.4897 35.0165 13.874C35.0055 13.258 35.2333 12.7167 35.7 12.25C36.2667 11.75 36.9167 11.5333 37.65 11.6C38.3833 11.6667 38.9833 12 39.45 12.6C40.75 14.2333 41.7167 16.0333 42.35 18C42.9833 19.9667 43.3 22 43.3 24.1C43.3 26.7667 42.7917 29.2667 41.775 31.6C40.7583 33.9333 39.375 35.975 37.625 37.725C35.875 39.475 33.8333 40.85 31.5 41.85C29.1667 42.85 26.6667 43.35 24 43.35Z" :fill="svgIconColor"/>
            </g>
            </svg>
          </div>
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
          <!-- <span class="btn-icon">⚡</span> -->
          <span class="btn-text">ON</span>
        </button>
        
        <button 
          class="control-btn off-btn" 
          :class="{ active: currentState === 'off', disabled: !isConnected || isTransitioning }"
          :disabled="!isConnected || isTransitioning"
          @click="turnOff"
        >
          <!-- <span class="btn-icon">⏸</span> -->
          <span class="btn-text">OFF</span>
        </button>
      </div>
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
    <div class="update-time lasttime">
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
    lastToggled: new Date().toLocaleTimeString(),
  }
})

// 반응형 데이터
const currentState = computed(() => currentData.value.isOn ? 'on' : 'off')
const isConnected = ref(true)
const isTransitioning = ref(false)
const lastStateChange = computed(() => currentData.value.lastToggled || '알 수 없음')

const lastUpdateTime = computed(() => 
{
  const timestamp = currentData.value.lastUpdated;

if(timestamp){
  if(typeof timestamp === 'number'){
    return new Date(timestamp).toLocaleTimeString();
  }

  return timestamp
}

return new Date().toLocaleDateString();

}


)

// 로그 데이터
const controlLogs = ref([])

let statusInterval = null

// 연결 상태
const connectionClass = computed(() => isConnected.value ? 'connected' : 'disconnected')
const connectionText = computed(() => isConnected.value ? '연결됨' : '연결 끊김')

// SVG 아이콘 색상
const svgIconColor = computed(() => {
  if (!isConnected.value) return '#991b1b'
  if (isTransitioning.value) return ''
  return currentState.value === 'on' ? '#fff' : '#7f7f7f'
})

// 현재 상태
const statusClass = computed(() => {
  if (!isConnected.value) return 'status-disconnected'
  if (isTransitioning.value) return 'status-transitioning'
  return `status-${currentState.value}`
})

const statusIcon = computed(() => {
  if (!isConnected.value) return '❌'
  if (isTransitioning.value) return ''
  return currentState.value === 'on' ? '🟢' : '🔴'
})

const statusTitle = computed(() => {
  if (!isConnected.value) return '연결 끊김'
  if (isTransitioning.value) return '처리 중'
  return currentState.value === 'on' ? 'ON' : 'OFF'
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
  container-name: on-off-control-container;
  container-type: size;
  border-radius: 12px;
  padding: 20px;
  width: 100%;
  height: 100%;
  /* display: flex;
  flex-direction: column; */
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
  background: #fff;
  border-radius: 8px;
  font-size: 12px;
  color: #424242;
  display: none;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #991b1b;
  transition: background-color 0.3s ease;
}

.status-dot.active {
  background: #E16349;
}

.current-status {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding: 20px;
  background: #fff;
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
  background: #E16349;
  border: 3px solid #E16349;
}

.status-off {
  background: #f3f4f6;
  border: 3px solid #7f7f7f;
}

.status-disconnected {
  background: #fecaca;
  border: 3px solid #ef4444;
}

.status-transitioning {
  background: #F7EBEB;
  border: 3px solid #F0BBB1;
}

.status-icon {
  width: 32px;
  height: 32px;
}
.status-icon svg{
  width: 100%;
  height: 100%;
}

.status-pulse {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 10px solid #F0BBB1;
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
  border-color: #E16349;
  background: #F7EBEB;
  color: #E16349;
}

.control-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.on-btn.active {
  border-color: #E16349;
  background: #E16349;
  color: #fff;
}

.off-btn.active {
  border-color: #000;
  background: #000;
  color: #fff;
}

.btn-icon {
  font-size: 20px;
}

.btn-text {
  font-weight: 600;
}

.device-info {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 30px;
  display: none;
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
  color: #424242;
  margin-bottom: 12px;
}

.log-list {
  flex: 1;
  background: #fff;
  border-radius: 20px;
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
  /* background: #f8f8f8;
  border: 1px solid #e4e4e4; */
  border-radius: 20px;
  font-size: 12px;
}

.log-time {
  color: #424242;
  font-weight: 500;
  white-space: nowrap;
}

.log-action {
  flex: 1;
  margin-left: 12px;
  font-weight: 500;
}

.action-on {
  color: #E16349;
}

.action-off {
  color: #6b7280;
}

.action-error {
  color: #991b1b;
}

.action-info {
  color: #424242;
}

.update-time:not(:first-child) {
  margin-top: 16px;
  text-align: center;
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}
.update-time.lasttime{
  font-size: 0;
}


@container on-off-control-container (max-width: 450px) {
  }
@container on-off-control-container (max-width: 300px) {
  .widget-title{
    font-size: 14px;
  }
  .legend-label {
    font-size: 12px;
  }
  .date-picker{
    font-size: 10px;
    padding: 7px 9px;
  }
  .nav-btn {
    font-size: 10px;
    padding: 4px 8px;
  }
  .status-description{
    display: none;
  }
}
@container on-off-control-container (max-height: 640px) {
.control-log,.status-info{
  display: none;
}
}
@container on-off-control-container (max-height: 311px) {
  .chart-container{
    min-height: 200px;
    margin-bottom: 0;
  }
}
@container on-off-control-container (max-height: 205px) {
.media-container{
    display: grid;  
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto 1fr ;
  }
  .widget-header {
    grid-column-start: 1;
    grid-column-end: 3;    
    margin-bottom: 8px;
  }
  .current-status{
    display: block;
    margin-bottom: 0px;
    margin-right: 8px;
  }
  .status-title{
    margin-bottom: 0;
    font-size: 14px;
    text-align: center;
  }
  .status-indicator{
    margin: 0 auto 4px;
  }
  .control-section{
    margin-bottom: 0;
    flex-direction: column;
  }
}
</style>
