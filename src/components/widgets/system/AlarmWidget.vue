<template>
  <div class="alarm-widget">
    <!-- 위젯 헤더 -->
    <div class="widget-header">
      <h3 class="widget-title">{{ config.title || '알람' }}</h3>
      <!-- <div class="alarm-summary" :class="alarmSummaryClass">
        <span class="alarm-count">{{ activeAlarmsCount }}</span>
        <span class="alarm-text">{{ alarmSummaryText }}</span>
      </div> -->
    </div>

    <!-- 알람 필터 -->
    <!-- <div class="alarm-filters">
      <button 
        v-for="filter in alarmFilters"
        :key="filter.type"
        class="filter-btn"
        :class="{ active: selectedFilter === filter.type }"
        @click="selectedFilter = filter.type"
      >
        <span class="filter-icon" :style="{ color: filter.color }">●</span>
        <span class="filter-label">{{ filter.label }}</span>
        <span class="filter-count">({{ getFilterCount(filter.type) }})</span>
      </button>
    </div> -->

    <!-- 알람 목록 -->
    <div class="alarm-list">
      <div 
        v-for="alarm in filteredAlarms"
        :key="alarm.id"
        class="alarm-item"
        :class="`alarm-${alarm.severity}`"
      >
        <div class="alarm-indicator" :class="`indicator-${alarm.severity}`">
          <span class="alarm-icon">{{ getAlarmIcon(alarm.severity) }}</span>
          <div v-if="alarm.severity === 'critical'" class="alarm-pulse"></div>
        </div>
        
        <div class="alarm-content">
          <div class="alarm-title">{{ alarm.title }}</div>
          <div class="alarm-description">{{ alarm.description }}</div>
          <div class="alarm-meta">
            <span class="alarm-source">{{ alarm.source }}</span>
            <span class="alarm-time">{{ formatTime(alarm.timestamp) }}</span>
          </div>
        </div>

        <div class="alarm-actions" v-if="!isEditMode">
          <button 
            v-if="!alarm.acknowledged"
            class="action-btn ack-btn"
            @click="acknowledgeAlarm(alarm.id)"
            title="확인"
          >
            ✓
          </button>
          <button 
            class="action-btn clear-btn"
            @click="clearAlarm(alarm.id)"
            title="삭제"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- 알람이 없는 경우 -->
      <div v-if="filteredAlarms.length === 0" class="no-alarms">
        <div class="no-alarms-icon">🎉</div>
        <div class="no-alarms-text">
          {{ selectedFilter === 'all' ? '활성 알람이 없습니다' : `${getFilterLabel(selectedFilter)} 알람이 없습니다` }}
        </div>
      </div>
    </div>

    <!-- 알람 통계 -->
    <div class="alarm-stats">
      <div class="stat-item">
        <span class="stat-label">오늘 총 알람:</span>
        <span class="stat-value">{{ todayAlarmsCount }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">해결된 알람:</span>
        <span class="stat-value">{{ resolvedAlarmsCount }}</span>
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
      title: '알람',
      maxDisplayCount: 10,
      autoRefresh: true,
      dataSource: 'api/alarms'
    })
  },
  isEditMode: {
    type: Boolean,
    default: false
  }
})

// 반응형 데이터
const alarms = ref([])
const selectedFilter = ref('all')
const lastUpdateTime = ref(new Date().toLocaleTimeString())
const todayAlarmsCount = ref(0)
const resolvedAlarmsCount = ref(0)

let updateInterval = null

// 알람 필터 정의
const alarmFilters = [
  { type: 'all', label: '전체', color: '#6b7280' },
  { type: 'critical', label: '위험', color: '#ef4444' },
  { type: 'warning', label: '주의', color: '#f59e0b' },
  { type: 'info', label: '정보', color: '#3b82f6' }
]

// 샘플 알람 데이터 생성
const generateSampleAlarms = () => {
  const sampleAlarms = [
    {
      id: Date.now() + Math.random(),
      severity: 'critical',
      title: '조명-1',
      description: '연결해제',
      source: '',
      timestamp: new Date(),
      acknowledged: false
    },
    {
      id: Date.now() + Math.random() + 1,
      severity: 'warning',
      title: '전기차충전기',
      description: '정상',
      source: '',
      timestamp: new Date(Date.now() - 300000), // 5분 전
      acknowledged: false
    },
    {
      id: Date.now() + Math.random() + 2,
      severity: 'info',
      title: '조명-2',
      description: '정상',
      source: '',
      timestamp: new Date(Date.now() - 900000), // 15분 전
      acknowledged: true
    }
  ]

  // 기존 알람과 합치기 (중복 제거)
  const existingIds = alarms.value.map(alarm => alarm.id)
  const newAlarms = sampleAlarms.filter(alarm => !existingIds.includes(alarm.id))
  
  if (newAlarms.length > 0) {
    alarms.value = [...newAlarms, ...alarms.value]
      .slice(0, props.config.maxDisplayCount || 10)
  }

  // 통계 업데이트
  todayAlarmsCount.value = alarms.value.length + Math.floor(Math.random() * 20)
  resolvedAlarmsCount.value = Math.floor(todayAlarmsCount.value * 0.8)
}

// 계산된 속성
const activeAlarmsCount = computed(() => {
  return alarms.value.filter(alarm => !alarm.acknowledged).length
})

const alarmSummaryClass = computed(() => {
  const hasCritical = alarms.value.some(alarm => alarm.severity === 'critical' && !alarm.acknowledged)
  const hasWarning = alarms.value.some(alarm => alarm.severity === 'warning' && !alarm.acknowledged)
  
  if (hasCritical) return 'summary-critical'
  if (hasWarning) return 'summary-warning'
  return 'summary-normal'
})

const alarmSummaryText = computed(() => {
  if (activeAlarmsCount.value === 0) return '정상'
  return '알람 발생'
})

const filteredAlarms = computed(() => {
  if (selectedFilter.value === 'all') {
    return alarms.value
  }
  return alarms.value.filter(alarm => alarm.severity === selectedFilter.value)
})

// 메서드
const getFilterCount = (filterType) => {
  if (filterType === 'all') return alarms.value.length
  return alarms.value.filter(alarm => alarm.severity === filterType).length
}

const getFilterLabel = (filterType) => {
  const filter = alarmFilters.find(f => f.type === filterType)
  return filter ? filter.label : '전체'
}

const getAlarmIcon = (severity) => {
  switch (severity) {
    case 'critical': return '🚨'
    case 'warning': return '⚠️'
    case 'info': return 'ℹ️'
    default: return '❓'
  }
}

const formatTime = (timestamp) => {
  const now = new Date()
  const diff = now - timestamp
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (days > 0) return `${days}일 전`
  if (hours > 0) return `${hours}시간 전`
  if (minutes > 0) return `${minutes}분 전`
  return '방금 전'
}

const acknowledgeAlarm = (alarmId) => {
  const alarm = alarms.value.find(a => a.id === alarmId)
  if (alarm) {
    alarm.acknowledged = true
    console.log('알람 확인:', alarmId)
  }
}

const clearAlarm = (alarmId) => {
  const index = alarms.value.findIndex(a => a.id === alarmId)
  if (index > -1) {
    alarms.value.splice(index, 1)
    console.log('알람 삭제:', alarmId)
  }
}

const updateAlarms = () => {
  // 실제로는 API에서 새로운 알람 데이터를 가져옴
  if (Math.random() < 0.3) { // 30% 확률로 새 알람 생성
    generateSampleAlarms()
  }
  
  lastUpdateTime.value = new Date().toLocaleTimeString()
}

// 라이프사이클
onMounted(() => {
  // 초기 알람 데이터 생성
  generateSampleAlarms()
  
  // 주기적 업데이트
  if (props.config.autoRefresh) {
    updateInterval = setInterval(() => {
      if (!props.isEditMode) {
        updateAlarms()
      }
    }, 30000) // 30초마다 업데이트
  }
})

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval)
  }
})
</script>

<style scoped>
.alarm-widget {
  container-name: alarm-container;
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
  margin-bottom: 16px;
}

.widget-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.alarm-summary {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.summary-normal {
  background: #dcfce7;
  color: #166534;
}

.summary-warning {
  background: #fef3c7;
  color: #92400e;
}

.summary-critical {
  background: #fecaca;
  color: #991b1b;
}

.alarm-filters {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 6px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.filter-btn:hover {
  background: #f9fafb;
}

.filter-btn.active {
  background: #eff6ff;
  border-color: #3b82f6;
  color: #1e40af;
}

.filter-icon {
  font-size: 8px;
}

.filter-count {
  color: #6b7280;
  font-size: 10px;
}

.alarm-list {
  flex: 1;
  /* overflow-y: auto; */
  padding: 0 4px;
}

.alarm-item {
  position: relative;
  padding: 12px;
  border-radius: 8px;
  border-left: 4px solid transparent;
  background: #f9fafb;
  height: calc(33.333% - 8px);
  box-shadow: 0px 0px 0px 1px rgba(0, 0, 0, 0.1);
}

.alarm-item:not(:last-child) {
  margin-bottom: 8px;
}

.alarm-critical {
  border-left-color: var(--color-primary);
  background: var(--color-primary-lightest);
}

.alarm-warning {
  border-left-color: var(--color-primary-light);
  background: var(--color-gray-bg);
}

.alarm-info {
  border-left-color: var(--color-gray);
  background: var(--color-gray-lightest);
}

.alarm-indicator {
  position: relative;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: none;
}

.indicator-critical {
  background: var(--color-primary-lighter);
}

.indicator-warning {
  background: var(--color-primary-lightest);
}

.indicator-info {
  background: var(--color-gray-lightest);
}

.alarm-icon {
  font-size: 16px;
}

.alarm-pulse {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 50%;
  border: 2px solid var(--color-primary);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.3);
    opacity: 0;
  }
}

.alarm-content {
  flex: 1;
  min-width: 0;
}

.alarm-title {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.alarm-description {
  font-size: 13px;
  color: #4b5563;
  line-height: 1.4;
  margin-bottom: 6px;
}

.alarm-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  color: #6b7280;
}

.alarm-source {
  font-weight: 500;
}

.alarm-actions {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

.action-btn {
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.ack-btn {
  background: var(--color-primary);
  color: white;
}

.ack-btn:hover {
  background: #000000;
}

.clear-btn {
  background: #000;
  color: #fff;
}

.clear-btn:hover {
  background: #7f7f7f;
}

.no-alarms {
  text-align: center;
  padding: 40px 20px;
  color: #6b7280;
}

.no-alarms-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.no-alarms-text {
  font-size: 14px;
}

.alarm-stats {
  background: #f9fafb;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
  display: none;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}

.stat-item:not(:last-child) {
  margin-bottom: 6px;
}

.stat-label {
  color: #6b7280;
}

.stat-value {
  font-weight: 600;
  color: #1f2937;
}

.update-time {
  font-size: 12px;
  color: #9ca3af;
  text-align: center;
  margin-top: auto;
  display: none;
}


@container alarm-container (max-width: 300px) {
  .widget-title{
    font-size: 14px;
  }
  .widget-header{
    margin-bottom: 8px;
  }
  .alarm-list {
    padding: 0;
  }
}
@container alarm-container (max-height: 300px) {
  .chart-container{
    min-height: 200px;
    margin-bottom: 0;
  }
  .alarm-item{
    padding: 8px;
  }
  .alarm-item:not(:last-child) {
    margin-bottom: 4px;
  }
  .alarm-description{
    font-size: 12px;
  }
}
</style>
