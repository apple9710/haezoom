<template>
  <div class="bar-gauge-widget">
    <!-- 위젯 헤더 -->
    <div class="widget-header">
      <h3 class="widget-title">{{ config.title || '게이지' }}</h3>
      <div class="widget-status" :class="statusClass">
        <span class="status-dot"></span>
        <span class="status-text">{{ statusText }}</span>
      </div>
    </div>

    <!-- 현재값 표시 -->
    <div class="current-value">
      <span class="value-number">{{ formattedValue }}</span>
      <span class="value-unit">{{ config.unit || '' }}</span>
    </div>

    <!-- 바 게이지 -->
    <div class="gauge-container">
      <div class="gauge-track">
        <div class="gauge-fill" :class="gaugeClass" :style="{ width: `${percentage}%` }"></div>

        <!-- 임계값 마커들 -->
        <div
          v-for="threshold in thresholdMarkers"
          :key="threshold.name"
          class="threshold-marker"
          :style="{ left: `${threshold.position}%` }"
          :title="`${threshold.name}: ${threshold.value}${config.unit}`"
        >
          <div class="marker-line" :class="`marker-${threshold.type}`"></div>
          <div class="marker-label">{{ threshold.value }}</div>
        </div>
      </div>

      <!-- 범위 라벨 -->
      <div class="gauge-labels">
        <span class="label-min">{{ config.min || 0 }}</span>
        <span class="label-max">{{ config.max || 100 }}</span>
      </div>
    </div>

    <!-- 상태 정보 -->
    <div class="status-info">
      <div class="status-item">
        <span class="status-label">현재 상태:</span>
        <span class="status-value" :class="statusClass">{{ statusText }}</span>
      </div>
      <div class="status-item">
        <span class="status-label">진행률:</span>
        <span class="status-value">{{ percentage.toFixed(1) }}%</span>
      </div>
    </div>

    <!-- 히스토리 (간단한 미니 차트) -->
    <div class="history-chart">
      <div class="history-title">최근 변화</div>
      <div class="history-bars">
        <div
          v-for="(value, index) in historyData"
          :key="index"
          class="history-bar"
          :style="{
            height: `${(value / (config.max || 100)) * 100}%`,
            backgroundColor: getHistoryColor(value),
          }"
          :title="`${value}${config.unit}`"
        ></div>
      </div>
    </div>

    <!-- 업데이트 시간 -->
    <div class="update-time">마지막 업데이트: {{ lastUpdateTime }}</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
  config: {
    type: Object,
    default: () => ({
      title: '게이지',
      unit: '%',
      min: 0,
      max: 100,
      thresholds: {
        warning: 70,
        critical: 90,
      },
      dataSource: 'api/sensor-data',
    }),
  },
  isEditMode: {
    type: Boolean,
    default: false,
  },
})

// 반응형 데이터
const currentValue = ref(0)
const historyData = ref([])
const lastUpdateTime = ref(new Date().toLocaleTimeString())
let updateInterval = null

// 샘플 데이터 생성
const generateSampleData = () => {
  const min = props.config.min || 0
  const max = props.config.max || 100
  const range = max - min

  // 현재값 생성 (점진적 변화)
  const change = (Math.random() - 0.5) * (range * 0.1)
  let newValue = currentValue.value + change
  newValue = Math.max(min, Math.min(max, newValue))

  currentValue.value = Math.round(newValue * 10) / 10

  // 히스토리 업데이트
  historyData.value.push(currentValue.value)
  if (historyData.value.length > 20) {
    historyData.value.shift()
  }

  lastUpdateTime.value = new Date().toLocaleTimeString()
}

// 포맷된 값
const formattedValue = computed(() => {
  return currentValue.value.toFixed(1)
})

// 퍼센티지 계산
const percentage = computed(() => {
  const min = props.config.min || 0
  const max = props.config.max || 100
  const range = max - min
  return Math.max(0, Math.min(100, ((currentValue.value - min) / range) * 100))
})

// 상태 계산
const statusClass = computed(() => {
  const value = currentValue.value
  const thresholds = props.config.thresholds

  if (value >= thresholds.critical) return 'critical'
  if (value >= thresholds.warning) return 'warning'
  return 'normal'
})

const statusText = computed(() => {
  switch (statusClass.value) {
    case 'critical':
      return '위험'
    case 'warning':
      return '주의'
    default:
      return '정상'
  }
})

// 게이지 색상 클래스
const gaugeClass = computed(() => {
  return `gauge-${statusClass.value}`
})

// 임계값 마커들
const thresholdMarkers = computed(() => {
  const min = props.config.min || 0
  const max = props.config.max || 100
  const range = max - min
  const thresholds = props.config.thresholds

  return [
    {
      name: '주의',
      value: thresholds.warning,
      type: 'warning',
      position: ((thresholds.warning - min) / range) * 100,
    },
    {
      name: '위험',
      value: thresholds.critical,
      type: 'critical',
      position: ((thresholds.critical - min) / range) * 100,
    },
  ]
})

// 히스토리 색상
const getHistoryColor = (value) => {
  const thresholds = props.config.thresholds
  if (value >= thresholds.critical) return '#ef4444'
  if (value >= thresholds.warning) return '#f59e0b'
  return '#10b981'
}

// 라이프사이클
onMounted(() => {
  // 초기값 설정
  const min = props.config.min || 0
  const max = props.config.max || 100
  currentValue.value = min + (max - min) * 0.3 // 30% 지점에서 시작

  // 초기 히스토리 생성
  for (let i = 0; i < 10; i++) {
    generateSampleData()
  }

  // 주기적 업데이트
  updateInterval = setInterval(() => {
    if (!props.isEditMode) {
      generateSampleData()
    }
  }, 3000) // 3초마다 업데이트
})

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval)
  }
})
</script>

<style scoped>
.bar-gauge-widget {
  container-name: bar-gauge-container;
  container-type: size;
  background: white;
  width: 100%;
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

.widget-status {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.widget-status.normal {
  background: #dcfce7;
  color: #166534;
}

.widget-status.warning {
  background: #fef3c7;
  color: #92400e;
}

.widget-status.critical {
  background: #fecaca;
  color: #991b1b;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.current-value {
  text-align: center;
  margin-bottom: 24px;
}

.value-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-right: 8px;
}

.value-unit {
  font-size: 1.2rem;
  font-weight: 500;
  color: #6b7280;
}

.gauge-container {
  margin-bottom: 20px;
}

.gauge-track {
  position: relative;
  width: 100%;
  height: 24px;
  background: #f3f4f6;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 8px;
}

.gauge-fill {
  height: 100%;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.gauge-normal {
  background: linear-gradient(90deg, #10b981, #059669);
}

.gauge-warning {
  background: linear-gradient(90deg, #f59e0b, #d97706);
}

.gauge-critical {
  background: linear-gradient(90deg, #ef4444, #dc2626);
}

.threshold-marker {
  position: absolute;
  top: -8px;
  transform: translateX(-50%);
  z-index: 2;
}

.marker-line {
  width: 2px;
  height: 40px;
  margin: 0 auto 4px;
}

.marker-warning {
  background: #f59e0b;
}

.marker-critical {
  background: #ef4444;
}

.marker-label {
  font-size: 10px;
  text-align: center;
  color: #6b7280;
  font-weight: 500;
}

.gauge-labels {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #6b7280;
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
}

.status-label {
  color: #6b7280;
}

.status-value {
  font-weight: 600;
}

.status-value.normal {
  color: #059669;
}

.status-value.warning {
  color: #d97706;
}

.status-value.critical {
  color: #dc2626;
}

.history-chart {
  margin-bottom: 12px;
}

.history-title {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 8px;
  font-weight: 500;
}

.history-bars {
  display: flex;
  align-items: end;
  gap: 2px;
  height: 40px;
  background: #f9fafb;
  border-radius: 4px;
  padding: 4px;
}

.history-bar {
  flex: 1;
  min-height: 2px;
  border-radius: 1px;
  transition: all 0.3s ease;
}

.update-time {
  font-size: 12px;
  color: #9ca3af;
  text-align: center;
  margin-top: auto;
}

@container bar-gauge-container (max-width: 200px) {
  .history-chart {
    display: none;
  }
}
@container bar-gauge-container (max-height:200px) {
  .status-info {
    display: none;
  }
  .value-number {
    font-size: 1.25rem;
  }
}
</style>
