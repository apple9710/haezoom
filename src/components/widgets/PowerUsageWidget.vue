<template>
  <div class="power-usage-widget">
    <!-- 위젯 헤더 -->
    <div class="widget-header">
      <h3 class="widget-title">{{ config.title || '전력 사용량' }}</h3>
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

    <!-- 차트 타입 선택 -->
    <div class="chart-type-selector">
      <button 
        v-for="type in chartTypes" 
        :key="type.value"
        @click="changeChartType(type.value)"
        :class="['chart-type-btn', { active: selectedChartType === type.value }]"
      >
        {{ type.label }}
      </button>
    </div>

    <!-- 차트 영역 -->
    <div class="chart-container">
      <!-- 선 그래프 -->
      <LineChart 
        v-if="selectedChartType === 'line'"
        :data="chartData"
        :config="chartConfig"
        @hover="onChartHover"
      />
      
      <!-- 막대 그래프 -->
      <BarChart 
        v-else-if="selectedChartType === 'bar'"
        :data="chartData"
        :config="chartConfig"
        @hover="onChartHover"
      />
      
      <!-- 원 그래프 -->
      <PieChart 
        v-else-if="selectedChartType === 'pie'"
        :data="pieData"
        :config="chartConfig"
      />
    </div>

    <!-- 범례 및 툴팁 -->
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
import LineChart from './charts/LineChart.vue'
import BarChart from './charts/BarChart.vue'
import PieChart from './charts/PieChart.vue'

const props = defineProps({
  config: {
    type: Object,
    default: () => ({
      title: '전력 사용량',
      unit: '[kWh]',
      defaultChartType: 'line',
      dataSource: 'api/power-usage'
    })
  }
})

// 반응형 데이터
const selectedPeriod = ref('1day')
const selectedDate = ref(new Date().toISOString().split('T')[0])
const selectedChartType = ref(props.config.defaultChartType || 'line')
const hoveredData = ref(null)
const tooltipPosition = ref({ left: '0px', top: '0px' })

// 차트 타입 옵션
const chartTypes = [
  { value: 'line', label: '선 그래프' },
  { value: 'bar', label: '막대 그래프' },
  { value: 'pie', label: '원 그래프' }
]

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

// 선/막대 차트용 데이터
const chartData = computed(() => ({
  labels: rawData.value.map(item => item.time),
  datasets: [
    {
      label: '전력 사용량',
      data: rawData.value.map(item => item.powerUsage),
      borderColor: '#3b82f6',
      backgroundColor: selectedChartType.value === 'bar' ? '#3b82f6' : 'rgba(59, 130, 246, 0.1)',
      tension: 0.4
    },
    {
      label: '태양광 발전량',
      data: rawData.value.map(item => item.solarGeneration),
      borderColor: '#10b981',
      backgroundColor: selectedChartType.value === 'bar' ? '#10b981' : 'rgba(16, 185, 129, 0.1)',
      tension: 0.4
    },
    {
      label: '태양광 예측량',
      data: rawData.value.map(item => item.solarPrediction),
      borderColor: '#f59e0b',
      backgroundColor: selectedChartType.value === 'bar' ? '#f59e0b' : 'rgba(245, 158, 11, 0.1)',
      borderDash: [5, 5],
      tension: 0.4
    }
  ]
}))

// 원 차트용 데이터
const pieData = computed(() => {
  const totalUsage = rawData.value.reduce((sum, item) => sum + item.powerUsage, 0)
  const totalSolar = rawData.value.reduce((sum, item) => sum + item.solarGeneration, 0)
  
  return {
    labels: ['전력 사용량', '태양광 발전량', '기타'],
    datasets: [{
      data: [totalUsage, totalSolar, Math.max(0, totalUsage - totalSolar)],
      backgroundColor: ['#3b82f6', '#10b981', '#6b7280']
    }]
  }
})

// 범례 데이터
const legendItems = computed(() => [
  { name: '전력 사용량', color: '#3b82f6' },
  { name: '태양광 발전량', color: '#10b981' },
  { name: '태양광 예측량', color: '#f59e0b' }
])

// 메서드
const changeChartType = (type) => {
  selectedChartType.value = type
}

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
.power-usage-widget {
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 100%;
  display: flex;
  flex-direction: column;
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

.chart-type-selector {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  justify-content: center;
}

.chart-type-btn {
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
}

.chart-type-btn:hover {
  background: #f3f4f6;
}

.chart-type-btn.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
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