<template>
  <div class="up-down-control-widget">
    <!-- 위젯 헤더  -->
    <div class="widget-header">
      <h3 class="widget-title">{{ config.title || 'UP/DOWN 제어' }}</h3>
      <div class="connection-status" :class="connectionClass">
        <span class="connection-dot"></span>
        <span class="connection-text">{{ connectionText }}</span>
      </div>
    </div>

    <!-- 현재 값 표시 -->
    <div class="current-value">
      <div class="value-display">
        <span class="value-number">{{ formattedValue }}</span>
        <span class="value-unit">{{ config.unit || '' }}</span>
      </div>
      <div class="value-range">
        {{ config.min || 0 }} ~ {{ config.max || 100 }}{{ config.unit }}
      </div>
    </div>

    <!-- 슬라이더 제어 -->
    <div class="slider-section">
      <label class="slider-label">
        <!-- 직접 설정 -->
        </label>
      <div class="slider-container">
        <input 
          type="range"
          class="slider"
          :min="config.min || 0"
          :max="config.max || 100"
          :step="config.minorStep || 1"
          v-model="targetValue"
          :disabled="!isConnected || isTransitioning"
          @input="onSliderInput"
          @change="onSliderChange"
        >
        <div class="slider-markers">
          <span class="marker-min">{{ config.min || 0 }}</span>
          <span class="marker-mid">{{ Math.round(((config.max || 100) + (config.min || 0)) / 2) }}</span>
          <span class="marker-max">{{ config.max || 100 }}</span>
        </div>
      </div>
    </div>

    <!-- 제어 버튼 -->
    <div class="control-section">
      <!-- 큰 단위 증가/감소 -->
      <div class="major-controls">
        <button 
          class="control-btn major-btn up-btn"
          :disabled="!isConnected || isTransitioning || isAtMax"
          @click="adjustValue(config.majorStep || 10)"
        >
          <span class="btn-icon">⬆⬆</span>
          <span class="btn-text">+{{ config.majorStep || 10 }}</span>
        </button>
        
        <button 
          class="control-btn major-btn down-btn"
          :disabled="!isConnected || isTransitioning || isAtMin"
          @click="adjustValue(-(config.majorStep || 10))"
        >
          <span class="btn-icon">⬇⬇</span>
          <span class="btn-text">-{{ config.majorStep || 10 }}</span>
        </button>
      </div>

      <!-- 작은 단위 증가/감소 -->
      <div class="minor-controls">
        <button 
          class="control-btn minor-btn up-btn"
          :disabled="!isConnected || isTransitioning || isAtMax"
          @click="adjustValue(config.minorStep || 1)"
        >
          <span class="btn-icon">⬆</span>
          <span class="btn-text">+{{ config.minorStep || 1 }}</span>
        </button>
        
        <button 
          class="control-btn minor-btn down-btn"
          :disabled="!isConnected || isTransitioning || isAtMin"
          @click="adjustValue(-(config.minorStep || 1))"
        >
          <span class="btn-icon">⬇</span>
          <span class="btn-text">-{{ config.minorStep || 1 }}</span>
        </button>
      </div>
    </div>

   

    <!-- 프리셋 버튼 -->
    <div v-if="config.presets && config.presets.length" class="preset-section">
      <label class="preset-label">프리셋</label>
      <div class="preset-buttons">
        <button 
          v-for="preset in config.presets"
          :key="preset.name"
          class="preset-btn"
          :class="{ active: Math.abs(currentValue - preset.value) < 0.1 }"
          :disabled="!isConnected || isTransitioning"
          @click="setPreset(preset.value)"
        >
          {{ preset.name }}
          <small>{{ preset.value }}{{ config.unit }}</small>
        </button>
      </div>
    </div>

    <!-- 상태 정보 -->
    <div class="status-info">
      <div class="status-item">
        <span class="status-label">현재 상태:</span>
        <span class="status-value" :class="statusClass">{{ statusText }}</span>
      </div>
      <div class="status-item">
        <span class="status-label">목표값:</span>
        <span class="status-value">{{ targetValue }}{{ config.unit }}</span>
      </div>
      <div class="status-item">
        <span class="status-label">마지막 변경:</span>
        <span class="status-value">{{ lastChangeTime }}</span>
      </div>
    </div>

    <!-- 제어 기록 -->
    <div class="control-log">
      <div class="log-title">제어 기록</div>
      <div class="log-list">
        <div 
          v-for="(log, index) in controlLogs" 
          :key="index"
          class="log-item"
        >
          <span class="log-time">{{ log.time }}</span>
          <span class="log-action">{{ log.message }}</span>
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
      title: 'UP/DOWN 제어',
      unit: '°C',
      min: 0,
      max: 100,
      minorStep: 1,
      majorStep: 10,
      presets: [
        { name: '최소', value: 0 },
        { name: '기본', value: 50 },
        { name: '최대', value: 100 }
      ],
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
    value: 50,
    min: props.config.min || 0,
    max: props.config.max || 100,
    unit: props.config.unit || '°C',
    lastChanged: new Date().toLocaleTimeString()
  }
})

// 반응형 데이터
const currentValue = computed({
  get: () => currentData.value.value || 50,
  set: (newValue) => {
    const updatedData = {
      ...currentData.value,
      value: newValue,
      lastChanged: new Date().toLocaleTimeString(),
      lastUpdated: new Date().toLocaleTimeString()
    }
    updateData(updatedData)
  }
})

const targetValue = ref(50)
const isConnected = ref(true)
const isTransitioning = ref(false)
const lastChangeTime = computed(() => currentData.value.lastChanged || '알 수 없음')
const lastUpdateTime = computed(() => currentData.value.lastUpdated || new Date().toLocaleTimeString())
const controlLogs = ref([])

let statusInterval = null
let transitionTimeout = null

// 계산된 속성
const formattedValue = computed(() => {
  return currentValue.value.toFixed(1)
})

const isAtMin = computed(() => {
  return currentValue.value <= (props.config.min || 0)
})

const isAtMax = computed(() => {
  return currentValue.value >= (props.config.max || 100)
})

const connectionClass = computed(() => isConnected.value ? 'connected' : 'disconnected')
const connectionText = computed(() => isConnected.value ? '연결됨' : '연결 끊김')

const statusClass = computed(() => {
  if (!isConnected.value) return 'disconnected'
  if (isTransitioning.value) return 'transitioning'
  return 'normal'
})

const statusText = computed(() => {
  if (!isConnected.value) return '연결 끊김'
  if (isTransitioning.value) return '조정 중'
  return '정상'
})

// 제어 메서드
const adjustValue = async (delta) => {
  if (!isConnected.value || isTransitioning.value || props.isEditMode) return

  const newValue = Math.max(
    props.config.min || 0,
    Math.min(props.config.max || 100, currentValue.value + delta)
  )

  if (newValue === currentValue.value) return

  await setValue(newValue, `${delta > 0 ? '+' : ''}${delta} 조정`)
}

const setPreset = async (value) => {
  if (!isConnected.value || isTransitioning.value || props.isEditMode) return
  
  const preset = props.config.presets.find(p => p.value === value)
  await setValue(value, `프리셋: ${preset?.name || value}`)
}

const setValue = async (newValue, description) => {
  console.log('UpDownControl - setValue 호출, instanceId:', props.instanceId)
  console.log('UpDownControl - 새 값:', newValue, 'description:', description)

  isTransitioning.value = true
  targetValue.value = newValue
  
  addControlLog(`${description} → ${newValue}${props.config.unit}`)

  try {
    // 실제로는 API 호출
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 점진적 값 변경 시뮬레이션
    const startValue = currentValue.value
    const endValue = newValue
    const duration = 1000 // 1초
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // easeInOut 함수 사용
      const easeProgress = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2

      const intermediateValue = startValue + (endValue - startValue) * easeProgress

      if (progress < 1) {
        // 애니메이션 중간값 업데이트
        const tempData = {
          ...currentData.value,
          value: intermediateValue,
          lastUpdated: new Date().toLocaleTimeString()
        }
        updateData(tempData)
        requestAnimationFrame(animate)
      } else {
        // 최종값 설정
        const finalData = {
          ...currentData.value,
          value: endValue,
          lastChanged: new Date().toLocaleTimeString(),
          lastUpdated: new Date().toLocaleTimeString()
        }
        updateData(finalData)
        isTransitioning.value = false
        addControlLog(`설정 완료: ${endValue}${props.config.unit}`)
        
        console.log('UpDownControl - 최종 데이터 업데이트:', finalData)
        console.log('UpDownControl - 업데이트 후 스토어 데이터:', widgetData.value)
      }
    }

    animate()
    
  } catch (error) {
    console.error('값 설정 실패:', error)
    addControlLog(`설정 실패: ${error.message}`)
    isTransitioning.value = false
  }
}

// 슬라이더 이벤트
const onSliderInput = () => {
  // 실시간 미리보기 (옵션)
}

const onSliderChange = (event) => {
  const newValue = parseFloat(event.target.value)
  setValue(newValue, '슬라이더 조정')
}

// 로그 추가
const addControlLog = (message) => {
  controlLogs.value.unshift({
    time: new Date().toLocaleTimeString(),
    message
  })

  if (controlLogs.value.length > 8) {
    controlLogs.value = controlLogs.value.slice(0, 8)
  }
}

// 주기적 상태 체크
const startStatusCheck = () => {
  // 컨트롤 위젯의 경우 사용자가 직접 제어하므로 주기적 상태 체크 비활성화
  // 필요시 연결 상태만 체크하는 가벼운 인터벌로 변경
  statusInterval = setInterval(() => {
    if (!props.isEditMode && !isTransitioning.value) {
      // 단순히 연결 상태만 체크 (값 변경 없음)
      // 실제 환경에서는 ping이나 health check 등으로 연결 상태만 확인
    }
  }, 30000) // 30초마다 연결 상태만 체크 (데이터 변경 없음)
}

// 라이프사이클
onMounted(() => {
  // 초기 데이터가 없다면 기본 데이터 설정
  if (!widgetData.value || Object.keys(widgetData.value).length === 0) {
    const initialValue = (props.config.min || 0) + (props.config.max || 100) * 0.5
    const initialData = {
      value: initialValue,
      min: props.config.min || 0,
      max: props.config.max || 100,
      unit: props.config.unit || '°C',
      lastChanged: new Date().toLocaleTimeString(),
      lastUpdated: new Date().toLocaleTimeString()
    }
    updateData(initialData)
  }
  
  // 타겟값을 현재값과 동기화
  targetValue.value = currentValue.value
  
  addControlLog('제어 위젯 초기화 완료')
  startStatusCheck()
})

onUnmounted(() => {
  if (statusInterval) {
    clearInterval(statusInterval)
  }
  if (transitionTimeout) {
    clearTimeout(transitionTimeout)
  }
})
</script>

<style scoped>
.up-down-control-widget {
  container-name: up-down-control-container;
  container-type: size;
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
  margin-bottom: 8px;
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

.current-value {
  text-align: center;
}

.value-display {
  margin-bottom: 8px;
}

.value-number {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-right: 8px;
}

.value-unit {
  font-size: 1.2rem;
  font-weight: 500;
  color: #6b7280;
}

.value-range {
  font-size: 14px;
  color: #6b7280;
}

.control-section {
  margin-bottom: 20px;
}

.major-controls,
.minor-controls {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.control-btn {
  flex: 1;
  padding: 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.control-btn:not(:disabled):hover {
  border-color: #3b82f6;
  background: #eff6ff;
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.major-btn {
  font-weight: 600;
}

.minor-btn {
  font-weight: 500;
}

.up-btn:not(:disabled):hover {
  border-color: #10b981;
  background: #ecfdf5;
}

.down-btn:not(:disabled):hover {
  border-color: #ef4444;
  background: #fef2f2;
}

.btn-icon {
  font-size: 18px;
}

.btn-text {
  font-size: 12px;
}

.slider-section {
  margin-bottom: 20px;
}

.slider-label,
.preset-label {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
  display: block;
}

.slider-container {
  position: relative;
}

.slider {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #e5e7eb;
  outline: none;
  margin-bottom: 8px;
}

.slider::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: none;
}

.slider-markers {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #6b7280;
}

.preset-section {
  margin-bottom: 20px;
}

.preset-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.preset-btn {
  padding: 8px 12px;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.preset-btn:not(:disabled):hover {
  border-color: #3b82f6;
  background: #eff6ff;
}

.preset-btn.active {
  border-color: #10b981;
  background: #ecfdf5;
  color: #166534;
}

.preset-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.preset-btn small {
  color: #6b7280;
  font-size: 10px;
}

.status-info {
  background: #f9fafb;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.status-item:not(:last-child) {
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
}

.status-label {
  color: #6b7280;
}

.status-value {
  font-weight: 600;
  color: #1f2937;
}

.status-value.normal {
  color: #059669;
}

.status-value.transitioning {
  color: #d97706;
}

.status-value.disconnected {
  color: #dc2626;
}

.control-log {
  flex: 1;
  margin-bottom: 12px;
}

.log-title {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.log-list {
  max-height: 100px;
  overflow-y: auto;
}

.log-item {
  display: flex;
  gap: 8px;
  padding: 6px 8px;
  background: #f9fafb;
  border-radius: 4px;
  margin-bottom: 4px;
  font-size: 12px;
}

.log-time {
  color: #6b7280;
  min-width: 60px;
  flex-shrink: 0;
}

.log-action {
  color: #1f2937;
  flex: 1;
}

.update-time {
  font-size: 12px;
  color: #9ca3af;
  text-align: center;
  margin-top: auto;
} 


@container up-down-control-container (max-width: 300px) {
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
}
@container up-down-control-container (max-height: 640px) {
.control-log,.status-info{
  display: none;
}
}
@container up-down-control-container (max-height: 311px) {
  .chart-container{
    min-height: 200px;
    margin-bottom: 0;
  }
  .btn-icon{
    display: none;
  }
  .major-controls,
  .minor-controls {
    display: flex;
    gap: 8px;
    margin-bottom: 8px;
  }
}
</style>
