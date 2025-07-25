<template>
  <div class="box-widget" :data-expanded="config.isExpanded">
    <!-- 위젯 헤더 -->
    <div class="widget-header">
      <h3 class="widget-title">{{ config.title || '수치 데이터' }}</h3>
      <!-- <div class="widget-status" :class="statusClass">
        <span class="status-dot"></span>
        <span class="status-text">{{ statusText }}</span>
      </div> -->
    </div>

    <!-- 실시간 업데이트 표시 -->
    <div v-if="!isEditMode && lastUpdated" class="update-indicator">
      <span class="update-time">최근 업데이트: {{ lastUpdated }}</span>
      <div class="status-dot" :class="{ active: hasData }"></div>
    </div>

    <!-- 메인 수치 표시 -->
    <div class="main-value-container">
      <div class="value-label">{{ config.label || '현재값' }}</div>
      <div class="main-value">
        <span class="value-number">{{ formattedValue }}</span>
        <span class="value-unit">{{ currentData.unit || config.unit || '' }}</span>
      </div>
    </div>

    <!-- 추가 정보 -->
    <div class="additional-info">
      <div class="info-row">
        <span class="info-label">최대값:</span>
        <span class="info-value">{{ formattedMaxValue }}{{ currentData.unit || config.unit }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">최소값:</span>
        <span class="info-value">{{ formattedMinValue }}{{ currentData.unit || config.unit }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">평균값:</span>
        <span class="info-value">{{ formattedAvgValue }}{{ currentData.unit || config.unit }}</span>
      </div>
    </div>

    <!-- 변화량 표시 -->
    <div class="change-indicator" :class="changeClass">
      <span class="change-icon">{{ changeIcon }}</span>
      <span class="change-text">{{ changeText }}</span>
    </div>

    <!-- 업데이트 시간 -->
    <!-- <div class="update-time">
      마지막 업데이트: {{ lastUpdateTime }}
    </div> -->
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useWidgetData } from '@/composables/useWidgetData'

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
  },
  instanceId: {
    type: [String, Number],
    default: null
  }
})

// 위젯 데이터 관리
const { widgetData, hasData, lastUpdated } = useWidgetData(props.instanceId)

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
    value: 0,
    unit: props.config.unit || '',
    trend: 'stable',
    percentage: 0
  }
})
// 포맷된 값들
const formattedValue = computed(() => {
  const value = currentData.value.value || 0
  return typeof value === 'number' ? value.toLocaleString() : value
})

const formattedMaxValue = computed(() => {
  const value = currentData.value.maxValue || currentData.value.value || 0
  return typeof value === 'number' ? value.toLocaleString() : value
})

const formattedMinValue = computed(() => {
  const value = currentData.value.minValue || currentData.value.value || 0
  return typeof value === 'number' ? value.toLocaleString() : value
})

const formattedAvgValue = computed(() => {
  const value = currentData.value.avgValue || currentData.value.value || 0
  return typeof value === 'number' ? value.toLocaleString() : value
})

// 변화량 계산
const changeClass = computed(() => {
  const trend = currentData.value.trend
  const percentage = currentData.value.percentage || 0
  
  if (trend === 'up' || percentage > 0) return 'positive'
  if (trend === 'down' || percentage < 0) return 'negative'
  return 'neutral'
})

const changeIcon = computed(() => {
  const trend = currentData.value.trend
  const percentage = currentData.value.percentage || 0
  
  if (trend === 'up' || percentage > 0) return '↗'
  if (trend === 'down' || percentage < 0) return '↘'
  return '→'
})

const changeText = computed(() => {
  const percentage = currentData.value.percentage || 0
  const abs = Math.abs(percentage)
  
  if (abs === 0) return '변화 없음'
  
  const direction = percentage > 0 ? '증가' : '감소'
  return `${direction} ${abs}%`
})

// 상태 관련
const statusClass = computed(() => {
  const value = currentData.value.value || 0
  const thresholds = props.config.thresholds || {}
  
  if (value >= (thresholds.critical || 95)) return 'critical'
  if (value >= (thresholds.warning || 80)) return 'warning'
  return 'normal'
})

const statusText = computed(() => {
  const status = statusClass.value
  switch (status) {
    case 'critical': return '위험'
    case 'warning': return '경고'
    default: return '정상'
  }
})

const lastUpdateTime = computed(() => {
  const timestamp = currentData.value.lastUpdated;

  if(timestamp){
    if(typeof timestamp === 'number'){
      return new Date(timestamp).toLocaleTimeString();
    }
    return timestamp
  }

  return new Date().toLocaleTimeString();
})
</script>

<style scoped>
.update-indicator{
  display: none;
}
.box-widget {
  container-name: box-control-container;
  container-type: size;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
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
}

.main-value {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
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
  display: none;
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
  color: #000;
  display: none;
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
  display: block;
}

@container box-control-container (max-width: 300px) {
  .widget-title{
    font-size: 14px;
  }
  .legend-label {
    font-size: 12px;
  }
  .status-description{
    display: none;
  }
}
@container box-control-container (max-height: 640px) {

}
</style>
