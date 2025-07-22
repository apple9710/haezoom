<template>
  <div class="pie-chart-widget" :data-expanded="config.isExpanded">
    <!-- 위젯 헤더  -->
    <div class="widget-header">
      <h3 class="widget-title">{{ config.title || '원 그래프' }}</h3>
      <div class="widget-controls">
        <select v-model="selectedPeriod" @change="updateData" class="period-selector">
          <option value="1day">하루</option>
          <option value="1week">일주일</option>
          <option value="1month">한달</option>
        </select>
        
        <span class="unit">{{ config.unit || '[kWh]' }}</span>
      </div>
    </div>

    <!-- 날짜 선택 컨트롤 -->
    <div class="date-controls">
      <button @click="previousPeriod" class="nav-btn">◀ 이전</button>
      <span class="current-period">{{ currentPeriodLabel }}</span>
      <button @click="nextPeriod" class="nav-btn">다음 ▶</button>
    </div>

    <!-- 차트 영역 -->
    <div class="chart-container">
      <PieChart 
        :data="chartData"
        :config="chartConfig"
      />
    </div>

    <!-- 범례 및 통계 -->
    <div class="chart-info">
      <div class="chart-legend">
        <div 
          v-for="(item, index) in legendItems" 
          :key="item.name"
          class="legend-item"
        >
          <span class="legend-color" :style="{ backgroundColor: item.color }"></span>
          <span class="legend-label">{{ item.name }}</span>
          <span class="legend-value">{{ chartData.datasets[0].data[index] }}{{ config.unit }}</span>
          <span class="legend-percentage">{{ getPercentage(index) }}%</span>
        </div>
      </div>
      
      <div class="chart-summary">
        <div class="summary-item">
          <span class="summary-label">총 사용량:</span>
          <span class="summary-value">{{ totalUsage }}{{ config.unit }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">자급률:</span>
          <span class="summary-value">{{ selfSufficiencyRate }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import PieChart from '../charts/PieChart.vue'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  },
  config: {
    type: Object,
    default: () => ({
      title: '원 그래프',
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
const currentDate = ref(new Date())

// 샘플 데이터
const rawData = ref({
  powerUsage: 2400,
  solarGeneration: 1800,
  gridPower: 600,
  excessSolar: 0
})

// 현재 기간 라벨
const currentPeriodLabel = computed(() => {
  const date = currentDate.value
  switch (selectedPeriod.value) {
    case '1day':
      return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
    case '1week': {
      const weekStart = new Date(date)
      weekStart.setDate(date.getDate() - date.getDay())
      return `${weekStart.getFullYear()}.${String(weekStart.getMonth() + 1).padStart(2, '0')}.${String(weekStart.getDate()).padStart(2, '0')} 주`
    }
    case '1month':
      return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}`
    default:
      return ''
  }
})

// 차트 설정
const chartConfig = computed(() => ({
  responsive: true,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          const label = context.label || ''
          const value = context.parsed
          const percentage = getPercentage(context.dataIndex)
          return `${label}: ${value}${props.config.unit} (${percentage}%)`
        }
      }
    }
  }
}))

// 차트 데이터
const chartData = computed(() => {
  const usage = rawData.value.powerUsage
  const solar = rawData.value.solarGeneration
  const grid = Math.max(0, usage - solar)
  const excess = Math.max(0, solar - usage)
  
  return {
    labels: ['태양광 자가소비', '계통 전력', '태양광 잉여'],
    datasets: [{
      data: [Math.min(solar, usage), grid, excess],
      backgroundColor: ['#10b981', '#ef4444', '#f59e0b'],
      borderWidth: 2,
      borderColor: '#ffffff'
    }]
  }
})

// 범례 데이터
const legendItems = computed(() => [
  { name: '태양광 자가소비', color: '#10b981' },
  { name: '계통 전력', color: '#ef4444' },
  { name: '태양광 잉여', color: '#f59e0b' }
])

// 총 사용량
const totalUsage = computed(() => {
  return chartData.value.datasets[0].data.reduce((sum, value) => sum + value, 0)
})

// 자급률 계산
const selfSufficiencyRate = computed(() => {
  const solarConsumption = chartData.value.datasets[0].data[0]
  const total = totalUsage.value
  return total > 0 ? Math.round((solarConsumption / rawData.value.powerUsage) * 100) : 0
})

// 퍼센티지 계산
const getPercentage = (index) => {
  const total = totalUsage.value
  const value = chartData.value.datasets[0].data[index]
  return total > 0 ? Math.round((value / total) * 100) : 0
}

// 메서드
const previousPeriod = () => {
  const date = new Date(currentDate.value)
  switch (selectedPeriod.value) {
    case '1day':
      date.setDate(date.getDate() - 1)
      break
    case '1week':
      date.setDate(date.getDate() - 7)
      break
    case '1month':
      date.setMonth(date.getMonth() - 1)
      break
  }
  currentDate.value = date
  updateData()
}

const nextPeriod = () => {
  const date = new Date(currentDate.value)
  switch (selectedPeriod.value) {
    case '1day':
      date.setDate(date.getDate() + 1)
      break
    case '1week':
      date.setDate(date.getDate() + 7)
      break
    case '1month':
      date.setMonth(date.getMonth() + 1)
      break
  }
  currentDate.value = date
  updateData()
}

const updateData = async () => {
  console.log('데이터 업데이트:', {
    date: currentDate.value,
    period: selectedPeriod.value
  })
  // TODO: API 호출하여 실제 데이터 로드
}

onMounted(() => {
  updateData()
})

watch([selectedPeriod], () => {
  updateData()
})
</script>

<style scoped>
.pie-chart-widget {
  /* background: white; */
  border-radius: 8px;
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* 확대 모드 스타일 */
.pie-chart-widget[data-expanded="true"] {
  padding: 24px;
  border-radius: 0;
  background: #fafafa;
}

.pie-chart-widget[data-expanded="true"] .chart-container {
  min-height: 400px;
}

.pie-chart-widget[data-expanded="true"] .widget-title {
  font-size: 24px;
}

.pie-chart-widget[data-expanded="true"] .chart-legend {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
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

.current-period {
  font-weight: 600;
  color: #1f2937;
  min-width: 120px;
  text-align: center;
}

.chart-container {
  flex: 1;
  min-height: 250px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.chart-legend {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: #f9fafb;
  border-radius: 6px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  flex-shrink: 0;
}

.legend-label {
  flex: 1;
  font-size: 14px;
  color: #4b5563;
}

.legend-value {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

.legend-percentage {
  font-size: 12px;
  color: #6b7280;
  min-width: 40px;
  text-align: right;
}

.chart-summary {
  display: flex;
  justify-content: space-between;
  padding: 12px;
  background: #f3f4f6;
  border-radius: 8px;
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.summary-label {
  font-size: 12px;
  color: #6b7280;
}

.summary-value {
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
}
</style>
