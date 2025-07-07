import { computed } from 'vue'
import { widgetDataStore, widgetStateStore } from '@/stores/widgetData'

// 위젯 데이터 관리를 위한 컴포저블
export function useWidgetData(instanceId) {
  // 실시간 위젯 데이터
  const widgetData = computed(() => widgetDataStore.getWidgetData(instanceId))
  
  // 위젯 상태
  const widgetState = computed(() => widgetStateStore.getWidgetState(instanceId))
  
  // 위젯 데이터 업데이트
  const updateData = (newData) => {
    widgetDataStore.updateWidgetData(instanceId, newData)
  }
  
  // 위젯 상태 업데이트
  const updateState = (newState) => {
    widgetStateStore.updateWidgetState(instanceId, newState)
  }
  
  // 위젯에 데이터가 있는지 확인
  const hasData = computed(() => {
    const data = widgetData.value
    return data && Object.keys(data).length > 0
  })
  
  // 마지막 업데이트 시간
  const lastUpdated = computed(() => {
    return widgetData.value?.lastUpdated || null
  })
  
  return {
    widgetData,
    widgetState,
    updateData,
    updateState,
    hasData,
    lastUpdated
  }
}

// 차트 위젯 전용 컴포저블
export function useChartWidget(instanceId) {
  const { widgetData, widgetState, updateState } = useWidgetData(instanceId)
  
  // 차트 옵션
  const chartOptions = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      tooltip: {
        enabled: true
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    },
    animation: {
      duration: 300
    }
  }))
  
  // 확대 모드 차트 옵션
  const expandedChartOptions = computed(() => ({
    ...chartOptions.value,
    plugins: {
      ...chartOptions.value.plugins,
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: {
            size: 14
          }
        }
      }
    },
    scales: {
      ...chartOptions.value.scales,
      x: {
        ticks: {
          font: {
            size: 12
          }
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 12
          }
        }
      }
    }
  }))
  
  return {
    widgetData,
    widgetState,
    updateState,
    chartOptions,
    expandedChartOptions
  }
}

// 컨트롤 위젯 전용 컴포저블
export function useControlWidget(instanceId) {
  const { widgetData, widgetState, updateData, updateState } = useWidgetData(instanceId)
  
  // 컨트롤 값 변경
  const handleControlChange = (newValue, type = 'value') => {
    const currentData = widgetData.value || {}
    const updatedData = {
      ...currentData,
      [type]: newValue,
      lastChanged: new Date().toLocaleTimeString()
    }
    updateData(updatedData)
  }
  
  // ON/OFF 토글
  const toggleSwitch = () => {
    const currentData = widgetData.value || {}
    const newState = !currentData.isOn
    handleControlChange(newState, 'isOn')
  }
  
  return {
    widgetData,
    widgetState,
    updateData,
    updateState,
    handleControlChange,
    toggleSwitch
  }
}
