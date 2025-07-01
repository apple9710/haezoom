<template>
  <div class="pie-chart">
    <Pie 
      :data="chartData" 
      :options="chartOptions" 
      ref="chartRef"
    />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Pie } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'

// Chart.js 구성 요소 등록
ChartJS.register(ArcElement, Tooltip, Legend)

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

const chartRef = ref(null)

// Chart.js 형식으로 데이터 변환
const chartData = computed(() => {
  if (!props.data || !props.data.datasets || !props.data.datasets[0]) {
    return { labels: [], datasets: [] }
  }
  
  const dataset = props.data.datasets[0]
  
  return {
    labels: props.data.labels,
    datasets: [{
      ...dataset,
      backgroundColor: dataset.backgroundColor || [
        '#3b82f6', // 파란색
        '#10b981', // 초록색
        '#f59e0b', // 주황색
        '#ef4444', // 빨간색
        '#8b5cf6', // 보라색
        '#06b6d4', // 청록색
        '#f97316', // 주황-빨강
        '#84cc16'  // 라임
      ],
      borderColor: '#ffffff',
      borderWidth: 2,
      hoverBorderWidth: 3,
      hoverOffset: 8
    }]
  }
})

// Chart.js 옵션
const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true,
        padding: 15,
        font: {
          size: 12
        },
        generateLabels: function(chart) {
          const data = chart.data
          if (data.labels.length && data.datasets.length) {
            const dataset = data.datasets[0]
            const total = dataset.data.reduce((sum, value) => sum + value, 0)
            
            return data.labels.map((label, index) => {
              const value = dataset.data[index]
              const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0'
              
              return {
                text: `${label}: ${value}${props.config.unit || ''} (${percentage}%)`,
                fillStyle: dataset.backgroundColor[index],
                strokeStyle: dataset.borderColor,
                lineWidth: dataset.borderWidth,
                hidden: false,
                index: index
              }
            })
          }
          return []
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#ffffff',
      bodyColor: '#ffffff',
      borderColor: 'rgba(255, 255, 255, 0.2)',
      borderWidth: 1,
      cornerRadius: 6,
      callbacks: {
        label: function(context) {
          const label = context.label || ''
          const value = context.parsed
          const total = context.dataset.data.reduce((sum, val) => sum + val, 0)
          const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0'
          
          return `${label}: ${value}${props.config.unit || ''} (${percentage}%)`
        }
      }
    }
  },
  animation: {
    animateRotate: true,
    animateScale: true,
    duration: 1000,
    easing: 'easeInOutQuart'
  },
  cutout: 0, // 0 = 원형, 50-80 = 도넛형
  ...props.config
}))
</script>

<style scoped>
.pie-chart {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Chart.js 스타일 커스터마이징 */
:deep(.chartjs-render-monitor) {
  animation: chartjs-render-animation 1s ease-in-out;
}

@keyframes chartjs-render-animation {
  from { 
    opacity: 0;
    transform: scale(0.8);
  }
  to { 
    opacity: 1;
    transform: scale(1);
  }
}
</style>