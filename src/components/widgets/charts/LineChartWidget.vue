<template>
  <div class="line-chart-widget" :data-expanded="config.isExpanded">
    <!-- 위젯 헤더  -->
    <div class="widget-header">
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

    <!-- 실시간 업데이트 표시 -->
    <div v-if="!isEditMode && lastUpdated" class="update-indicator">
      <span class="update-time">최근 업데이트: {{ lastUpdated }}</span>
      <div class="status-dot" :class="{ active: hasData }"></div>
    </div>

    <!-- 날짜 선택 컨트롤 -->
    <div class="date-controls">
      <button @click="previousDay" class="nav-btn">
        <img src="@/assets/images/prev_arrow_circle.png" alt="전날" />전날
      </button>
      <input 
        type="date" 
        v-model="selectedDate" 
        @change="updateData"
        class="date-picker"
      />
      <button @click="nextDay" class="nav-btn">
        다음날 <img src="@/assets/images/next_arrow_circle.png" alt="" />
      </button>
    </div>

    <!-- 차트 영역 -->
    <div class="chart-container">
      <LineChart 
        :data="chartData"
        :config="currentChartOptions"
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
import { useChartWidget } from '@/composables/useWidgetData'
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
  },
  instanceId: {
    type: [String, Number],
    default: null
  }
})

// 위젯 데이터 관리
const { widgetData, chartOptions, expandedChartOptions, hasData, lastUpdated } = useChartWidget(props.instanceId)

// 반응형 데이터
const selectedPeriod = ref('1day')
const selectedDate = ref(new Date().toISOString().split('T')[0])
const hoveredData = ref(null)
const tooltipPosition = ref({ left: '0px', top: '0px' })

// 차트 데이터 - 실시간 스토어에서 가져오거나 기본 데이터 사용
const chartData = computed(() => {
  // 실시간 데이터가 있으면 사용, 없으면 props.data 또는 기본 데이터 사용
  const realtimeData = widgetData.value
  const fallbackData = props.data
  
  let data = null
  
  if (realtimeData && realtimeData.labels && realtimeData.datasets) {
    data = { ...realtimeData }
  } else if (fallbackData && fallbackData.labels && fallbackData.datasets) {
    data = { ...fallbackData }
  } else {
    // 기본 샘플 데이터
    data = {
      labels: ['00:00', '06:00', '12:00', '18:00', '23:59'],
      datasets: [{
        label: '전력 사용량',
        data: [120, 150, 200, 250, 130],
        borderColor: '#E16349',
        backgroundColor: 'rgba(225, 99, 73, 0.1)',
        tension: 0.4,
        fill: true
      }]
    }
  }
  
  // 모든 데이터셋의 색상을 #E16349로 강제 변경
  if (data && data.datasets) {
    data.datasets = data.datasets.map(dataset => ({
      ...dataset,
      borderColor: '#E16349',
      backgroundColor: 'rgba(225, 99, 73, 0.1)',
      pointBackgroundColor: '#E16349',
      pointBorderColor: '#E16349'
    }))
  }
  
  return data
})

// 차트 설정 - 확대 모드에 따라 다른 옵션 사용
const currentChartOptions = computed(() => {
  const baseOptions = props.config.isExpanded ? expandedChartOptions : chartOptions
  
  return {
    ...baseOptions.value,
    scales: {
      ...baseOptions.value.scales,
      x: {
        ...baseOptions.value.scales?.x,
        title: {
          display: true,
          text: '시간'
        }
      },
      y: {
        ...baseOptions.value.scales?.y,
        title: {
          display: true,
          text: `전력량 ${props.config.unit || '[kWh]'}`
        }
      }
    }
  }
})

// 범례 데이터
const legendItems = computed(() => [
  { name: '전력 사용량', color: '#E16349' },
  { name: '태양광 발전량', color: '#F0BBB1' },
  { name: '태양광 예측량', color: '#F3D7D0' }
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
  container-name: line-chart-container;
  container-type: size;
  /* background: white; */
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
  height: 100%;
  min-height: 500px;
}

.line-chart-widget[data-expanded="true"] .chart-container {
  min-height: 400px;
  height: calc(100% - 100px);
}

.line-chart-widget[data-expanded="true"] .date-controls {
  padding: 16px 0;
}

.line-chart-widget[data-expanded="true"] .chart-legend {
  margin-top: 20px;
  gap: 24px;
}

.line-chart-widget[data-expanded="true"] .legend-item {
  font-size: 16px;
}

.line-chart-widget[data-expanded="true"] .legend-color {
  width: 16px;
  height: 16px;
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  display: none;
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
  gap: 8px;
  /* margin-bottom: 16px; */
}

.nav-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid #e4e4e4;
  background: #fff;
  border-radius: 99px;
  cursor: pointer;
  transition: background-color 0.2s;
  white-space: nowrap;
}

.nav-btn:hover {
  background: #e4e4e4;
}

.nav-btn img {
  width: 20px;
  height: 20px;
  object-fit: cover;
}

.date-picker {
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid #e4e4e4;
  background: #fff;
  border-radius: 99px;
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

/* 실시간 업데이트 표시 */
.update-indicator {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  margin-bottom: 12px;
  font-size: 12px;
  color: #64748b;
}

.update-time {
  font-weight: 500;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #9ca3af;
  transition: all 0.3s ease;
}

.status-dot.active {
  background: #10b981;
  box-shadow: 0 0 6px rgba(16, 185, 129, 0.4);
  animation: pulse-green 2s infinite;
}

@keyframes pulse-green {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@container line-chart-container (max-width: 300px) {
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
  .current-period{
    font-size: 12px;
    min-width: auto;
  }
}
@container line-chart-container (max-height: 300px) {
  .chart-container{
    min-height: 200px;
    margin-bottom: 0;
  }
}
</style>
