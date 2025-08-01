<template>
  <div class="bar-chart">
    <Bar 

      :data="chartData" 
      :options="chartOptions" 
      @chart:hover="handleHover"
      ref="chartRef"
    />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

// Chart.js 구성 요소 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  config: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['hover'])

const chartRef = ref(null)

// Chart.js 형식으로 데이터 변환
const chartData = computed(() => {
  if (!props.data || !props.data.datasets) return { labels: [], datasets: [] }
  
  return {
    labels: props.data.labels,
    datasets: props.data.datasets.map((dataset, index) => ({
      ...dataset,
      backgroundColor: dataset.backgroundColor || dataset.borderColor,
      borderColor: dataset.borderColor,
      borderWidth: 1,
      borderRadius: 4,
      borderSkipped: false,
      hoverBackgroundColor: dataset.borderColor,
      hoverBorderColor: '#ffffff',
      hoverBorderWidth: 2
    }))
  }
})

// Chart.js 옵션
const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false
  },
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true,
        padding: 20,
        font: {
          size: 12
        }
      }
    },
    tooltip: {
      mode: 'index',
      intersect: false,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#ffffff',
      bodyColor: '#ffffff',
      borderColor: 'rgba(255, 255, 255, 0.2)',
      borderWidth: 1,
      cornerRadius: 6,
      callbacks: {
        afterLabel: function(context) {
          return ` ${props.config.unit || ''}`
        }
      }
    }
  },
  scales: {
    x: {
      display: true,
      grid: {
        display: false
      },
      ticks: {
        font: {
          size: 11
        },
        color: '#666'
      }
    },
    y: {
      display: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.1)',
        lineWidth: 1
      },
      ticks: {
        font: {
          size: 11
        },
        color: '#666',
        callback: function(value) {
          return value + (props.config.unit || '')
        }
      }
    }
  },
  animation: {
    duration: 750,
    easing: 'easeInOutQuart'
  },
  onHover: (event, activeElements) => {
    handleHover(event, activeElements)
  },
  ...props.config
}))

const handleHover = (event, activeElements) => {
  if (activeElements && activeElements.length > 0) {
    const dataIndex = activeElements[0].index
    const datasets = chartData.value.datasets
    
    const hoveredData = {
      time: chartData.value.labels[dataIndex],
      values: datasets.map(dataset => ({
        name: dataset.label,
        value: dataset.data[dataIndex],
        color: dataset.backgroundColor || dataset.borderColor
      }))
    }
    
    emit('hover', event, hoveredData)
  } else {
    emit('hover', event, null)
  }
}
</script>

<style scoped>
.bar-chart {
  width: 100%;
  height: 100%;
  position: relative;
}

/* Chart.js 스타일 커스터마이징 */
:deep(.chartjs-render-monitor) {
  animation: chartjs-render-animation 0.8s linear;
}

@keyframes chartjs-render-animation {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>