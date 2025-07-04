<template>
  <div class="line-chart-widget" :data-expanded="config.isExpanded">
    <!-- 위젯 헤더 (편집모드에서만 표시) -->
    <div v-if="isEditMode" class="widget-header">
      <h3 class="widget-title">{{ config.title || '선 시계열 그래프' }}</h3>
      <div class="widget-controls">
        <select v-model="selectedPeriod" @change="updateData" class="period-selector">
          <option value="1min">1분</option>
          <option value="15min">15분</option>
          <option value="1hour">1시간</option>
          <option value="1day">하루</option>
        </select>
        <span class="unit">{{ config.unit || '[kWh]' }}</span>
      </div>
    </div>

    <!-- 날짜 선택 컨트롤 -->
    <div class="date-controls">
      <button @click="previousDay" class="nav-btn">◀ 이전</button>
      <input 
        type="date" 
        v-model="selectedDate" 
        @change="updateData"
        class="date-picker"
      />
      <button @click="nextDay" class="nav-btn">다음 ▶</button>
    </div>

    <!-- 차트 영역 -->
    <div class="chart-container">
      <LineChart 
        :data="chartData"
        :config="chartConfig"
        @hover="onChartHover"
      />
    </div>

    <!-- 범례 -->
    <div class="chart-legend">
      <div 
        v-for="item in legendItems" 
        :key="item.name"
        class="legend-item"
      >
        <span class="legend-color" :style="{ backgroundColor: item.color }"></span>
        <span class="legend-label">{{ item.name }}</span>
      </div>
    </div>

    <!-- 호버 툴팁 -->
    <div v-if="hoveredData" class="tooltip" :style="tooltipPosition">
      <div class="tooltip-time">{{ hoveredData.time }}</div>
      <div v-for="data in hoveredData.values" :key="data.name" class="tooltip-item">
        <span class="tooltip-name">{{ data.name }}:</span>
        <span class="tooltip-value">{{ data.value }}{{ config.unit }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import LineChart from '../charts/LineChart.vue'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  },
  config: {
    type: Object,
    default: () => ({
      title: '선 시계열 그래프',
      unit: '[kWh]',
      dataSource: 'api/power-usage'
    })
  },
  isEditMode: {
    type: Boolean,
    default: false
  }
})

// 반응형 데이터
const selectedPeriod = ref('1day')
const selectedDate = ref(new Date().toISOString().split('T')[0])
const hoveredData = ref(null)
const tooltipPosition = ref({ left: '0px', top: '0px' })

// 샘플 데이터 (실제로는 API에서 가져올 데이터)
const rawData = ref([
  { time: '00:00', powerUsage: 120, solarGeneration: 0, solarPrediction: 0 },
  { time: '06:00', powerUsage: 150, solarGeneration: 20, solarPrediction: 25 },
  { time: '12:00', powerUsage: 200, solarGeneration: 180, solarPrediction: 170 },
  { time: '18:00', powerUsage: 250, solarGeneration: 50, solarPrediction: 55 },
  { time: '23:59', powerUsage: 130, solarGeneration: 0, solarPrediction: 0 }
])

// 차트 설정
const chartConfig = computed(() => ({
  responsive: true,
  scales: {
    x: {
      title: {
        display: true,
        text: '시간'
      }
    },
    y: {
      title: {
        display: true,
        text: `전력량 ${props.config.unit}`
      }
    }
  }
}))

// 차트 데이터
const chartData = computed(() => ({
  labels: rawData.value.map(item => item.time),
  datasets: [
    {
      label: '전력 사용량',
      data: rawData.value.map(item => item.powerUsage),
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4
    },
    {
      label: '태양광 발전량',
      data: rawData.value.map(item => item.solarGeneration),
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      tension: 0.4
    },
    {
      label: '태양광 예측량',
      data: rawData.value.map(item => item.solarPrediction),
      borderColor: '#f59e0b',
      backgroundColor: 'rgba(245, 158, 11, 0.1)',
      borderDash: [5, 5],
      tension: 0.4
    }
  ]
}))

// 범례 데이터
const legendItems = computed(() => [
  { name: '전력 사용량', color: '#3b82f6' },
  { name: '태양광 발전량', color: '#10b981' },
  { name: '태양광 예측량', color: '#f59e0b' }
])

// 메서드
const previousDay = () => {
  const date = new Date(selectedDate.value)
  date.setDate(date.getDate() - 1)
  selectedDate.value = date.toISOString().split('T')[0]
}

const nextDay = () => {
  const date = new Date(selectedDate.value)
  date.setDate(date.getDate() + 1)
  selectedDate.value = date.toISOString().split('T')[0]
}

const updateData = async () => {
  // 실제로는 API 호출
  console.log('데이터 업데이트:', {
    date: selectedDate.value,
    period: selectedPeriod.value
  })
  // TODO: API 호출 로직
}

const onChartHover = (event, data) => {
  if (data && data.length > 0) {
    hoveredData.value = {
      time: data[0].time,
      values: data
    }
    tooltipPosition.value = {
      left: event.clientX + 'px',
      top: event.clientY + 'px'
    }
  } else {
    hoveredData.value = null
  }
}

// 컴포넌트 마운트 시 데이터 로드
onMounted(() => {
  updateData()
})

// 날짜나 주기 변경 시 데이터 업데이트
watch([selectedDate, selectedPeriod], () => {
  updateData()
})
</script>

<style scoped>
.line-chart-widget {
  background: white;
  border-radius: 8px;
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* 확대 모드 스타일 */
.line-chart-widget[data-expanded="true"] {
  padding: 24px;
  border-radius: 0;
  background: #fafafa;
}

.line-chart-widget[data-expanded="true"] .chart-container {
  min-height: 400px;
}

.line-chart-widget[data-expanded="true"] .widget-title {
  font-size: 24px;
}

.line-chart-widget[data-expanded="true"] .chart-legend {
  margin-top: 20px;
  padding: 16px;
  background: white;
  border-radius: 8px;
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.widget-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.widget-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.period-selector {
  padding: 4px 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
}

.unit {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.date-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 16px;
}

.nav-btn {
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.nav-btn:hover {
  background: #f3f4f6;
}

.date-picker {
  padding: 6px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
}

.chart-container {
  flex: 1;
  min-height: 300px;
  margin-bottom: 16px;
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.legend-label {
  font-size: 14px;
  color: #4b5563;
}

.tooltip {
  position: fixed;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px;
  border-radius: 4px;
  font-size: 12px;
  pointer-events: none;
  z-index: 1000;
}

.tooltip-time {
  font-weight: 600;
  margin-bottom: 4px;
}

.tooltip-item {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}
</style>
