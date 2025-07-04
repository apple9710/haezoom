<template>
  <div class="box-widget" :data-expanded="config.isExpanded">
    <!-- 위젯 헤더 (편집모드에서만 표시) -->
    <div v-if="isEditMode" class="widget-header">
      <h3 class="widget-title">{{ config.title || '수치 데이터' }}</h3>
      <div class="widget-status" :class="statusClass">
        <span class="status-dot"></span>
        <span class="status-text">{{ statusText }}</span>
      </div>
    </div>

    <!-- 메인 수치 표시 -->
    <div class="main-value-container">
      <div class="main-value">
        <span class="value-number">{{ formattedValue }}</span>
        <span class="value-unit">{{ config.unit || '' }}</span>
      </div>
      <div class="value-label">{{ config.label || '현재값' }}</div>
    </div>

    <!-- 추가 정보 -->
    <div class="additional-info">
      <div class="info-row">
        <span class="info-label">최대값:</span>
        <span class="info-value">{{ formattedMaxValue }}{{ config.unit }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">최소값:</span>
        <span class="info-value">{{ formattedMinValue }}{{ config.unit }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">평균값:</span>
        <span class="info-value">{{ formattedAvgValue }}{{ config.unit }}</span>
      </div>
    </div>

    <!-- 변화량 표시 -->
    <div class="change-indicator" :class="changeClass">
      <span class="change-icon">{{ changeIcon }}</span>
      <span class="change-text">{{ changeText }}</span>
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
      title: '수치 데이터',
      unit: '',
      label: '현재값',
      dataSource: 'api/sensor-data',
      thresholds: {
        warning: 80,
        critical: 95
      }
    })
  },
  isEditMode: {
    type: Boolean,
    default: false
  }
})

// 반응형 데이터
const currentValue = ref(0)
const maxValue = ref(0)
const minValue = ref(0)
const avgValue = ref(0)
const previousValue = ref(0)
const lastUpdateTime = ref(new Date().toLocaleTimeString())
let updateInterval = null

// 샘플 데이터 생성
const generateSampleData = () => {
  // 실제로는 API에서 데이터를 가져올 것
  const baseValue = 850
  const variation = 50
  const newValue = baseValue + (Math.random() - 0.5) * variation
  
  previousValue.value = currentValue.value
  currentValue.value = Math.round(newValue * 10) / 10
  
  // 최대/최소/평균값 업데이트 (시뮬레이션)
  maxValue.value = Math.max(maxValue.value, currentValue.value)
  minValue.value = minValue.value === 0 ? currentValue.value : Math.min(minValue.value, currentValue.value)
  avgValue.value = (maxValue.value + minValue.value) / 2
  
  lastUpdateTime.value = new Date().toLocaleTimeString()
}

// 포맷된 값들
const formattedValue = computed(() => {
  return currentValue.value.toLocaleString()
})

const formattedMaxValue = computed(() => {
  return maxValue.value.toLocaleString()
})

const formattedMinValue = computed(() => {
  return minValue.value.toLocaleString()
})

const formattedAvgValue = computed(() => {
  return Math.round(avgValue.value * 10) / 10
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
    case 'critical': return '위험'
    case 'warning': return '주의'
    default: return '정상'
  }
})

// 변화량 계산
const changeValue = computed(() => {
  return currentValue.value - previousValue.value
})

const changeClass = computed(() => {
  if (changeValue.value > 0) return 'increase'
  if (changeValue.value < 0) return 'decrease'
  return 'stable'
})

const changeIcon = computed(() => {
  if (changeValue.value > 0) return '↑'
  if (changeValue.value < 0) return '↓'
  return '→'
})

const changeText = computed(() => {
  const absChange = Math.abs(changeValue.value)
  if (absChange === 0) return '변화없음'
  
  const direction = changeValue.value > 0 ? '증가' : '감소'
  return `${absChange.toFixed(1)} ${direction}`
})

// 라이프사이클
onMounted(() => {
  // 초기 데이터 로드
  generateSampleData()
  
  // 주기적 업데이트 (실제로는 config에서 설정된 주기 사용)
  updateInterval = setInterval(() => {
    if (!props.isEditMode) {
      generateSampleData()
    }
  }, 5000) // 5초마다 업데이트
})

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval)
  }
})
</script>

<style scoped>
.box-widget {
  background: white;
  border-radius: 12px;
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 확대 모드 스타일 */
.box-widget[data-expanded="true"] {
  padding: 32px;
  box-shadow: none;
  border-radius: 0;
}

.box-widget[data-expanded="true"] .main-value {
  font-size: 3.5rem;
}

.box-widget[data-expanded="true"] .value-unit {
  font-size: 1.5rem;
}

.box-widget[data-expanded="true"] .additional-info {
  padding: 24px;
  margin-bottom: 24px;
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

.main-value-container {
  text-align: center;
  margin-bottom: 24px;
}

.main-value {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 8px;
  margin-bottom: 8px;
}

.value-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1;
}

.value-unit {
  font-size: 1.2rem;
  font-weight: 500;
  color: #6b7280;
}

.value-label {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.additional-info {
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

.change-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 12px;
}

.change-indicator.increase {
  background: #dcfce7;
  color: #166534;
}

.change-indicator.decrease {
  background: #fee2e2;
  color: #991b1b;
}

.change-indicator.stable {
  background: #f3f4f6;
  color: #6b7280;
}

.change-icon {
  font-size: 16px;
}

.update-time {
  font-size: 12px;
  color: #9ca3af;
  text-align: center;
  margin-top: auto;
}
</style>
