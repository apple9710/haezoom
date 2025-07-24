import { reactive } from 'vue'

// 위젯 데이터 스토어
export const widgetDataStore = reactive({
  // 위젯별 실시간 데이터 저장 - reactive 객체로 변경하여 더 나은 반응성 확보
  widgetData: reactive({}),
  
  // 위젯 데이터 업데이트
  updateWidgetData(instanceId, data) {
    console.log('스토어 업데이트 - instanceId:', instanceId, 'data:', data);
    this.widgetData[instanceId] = { ...data, lastUpdated: Date.now() }
    console.log('스토어 업데이트 후 - 저장된 데이터:', this.widgetData[instanceId]);
  },
  
  // 위젯 데이터 가져오기
  getWidgetData(instanceId) {
    const data = this.widgetData[instanceId] || {}
    console.log('스토어에서 데이터 가져오기 - instanceId:', instanceId, 'data:', data);
    return data
  },
  
  // 위젯 데이터 삭제
  removeWidgetData(instanceId) {
    delete this.widgetData[instanceId]
  },
  
  // 모든 위젯 데이터 초기화
  clearAll() {
    Object.keys(this.widgetData).forEach(key => {
      delete this.widgetData[key]
    })
  }
})

// 위젯 상태 스토어 (차트 상태, 컨트롤 상태 등)
export const widgetStateStore = reactive({
  // 위젯별 상태 저장 (확대/축소, 선택된 데이터 등) - reactive 객체로 변경
  widgetStates: reactive({}),
  
  // 위젯 상태 업데이트
  updateWidgetState(instanceId, state) {
    const currentState = this.widgetStates[instanceId] || {}
    this.widgetStates[instanceId] = { ...currentState, ...state }
  },
  
  // 위젯 상태 가져오기
  getWidgetState(instanceId) {
    return this.widgetStates[instanceId] || {}
  },
  
  // 위젯 상태 삭제
  removeWidgetState(instanceId) {
    delete this.widgetStates[instanceId]
  },
  
  // 모든 위젯 상태 초기화
  clearAll() {
    Object.keys(this.widgetStates).forEach(key => {
      delete this.widgetStates[key]
    })
  }
})

// 실시간 데이터 생성기 (시뮬레이션용)
export const generateRealtimeData = (widgetType, dataType) => {
  const now = new Date()
  
  switch (widgetType) {
    case 'line-chart':
    case 'bar-chart':
      return {
        labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
        datasets: [{
          label: dataType,
          data: Array.from({ length: 24 }, () => Math.floor(Math.random() * 100) + 20),
          borderColor: '#E16349',
          backgroundColor: 'rgba(225, 99, 73, 0.1)',
          tension: 0.4
        }],
        lastUpdated: now.toLocaleTimeString()
      }
      
    case 'pie-chart':
      return {
        labels: ['사용량 A', '사용량 B', '사용량 C', '기타'],
        datasets: [{
          data: [30, 25, 20, 25],
          backgroundColor: ['#E16349', '#E8A89A', '#F3D7D0', '#f59e0b']
        }],
        lastUpdated: now.toLocaleTimeString()
      }
      
    case 'box-widget':
      return {
        value: Math.floor(Math.random() * 1000) + 100,
        unit: 'kWh',
        trend: Math.random() > 0.5 ? 'up' : 'down',
        percentage: Math.floor(Math.random() * 20) - 10,
        lastUpdated: now.toLocaleTimeString()
      }
      
    case 'bar-gauge-widget':
      return {
        value: Math.floor(Math.random() * 100),
        max: 100,
        unit: dataType.includes('온도') ? '°C' : '%',
        status: 'normal',
        lastUpdated: now.toLocaleTimeString()
      }
      
    case 'on-off-control':
      // 컨트롤 위젯은 사용자가 직접 제어하므로 랜덤 값 생성하지 않음
      // 기존 값이 없다면 기본값 반환
      return {
        isOn: false,
        label: '설비 상태',
        lastToggled: now.toLocaleTimeString(),
        lastUpdated: now.toLocaleTimeString()
      }
      
    case 'up-down-control':
      // 컨트롤 위젯은 사용자가 직접 제어하므로 랜덤 값 생성하지 않음
      // 기존 값이 없다면 기본값 반환
      return {
        value: 50,
        min: 0,
        max: 100,
        unit: '°C',
        lastChanged: now.toLocaleTimeString(),
        lastUpdated: now.toLocaleTimeString()
      }
      
    case 'status-widget': {
      const statuses = ['정상', '경고', '위험', '점검중']
      const colors = ['green', 'yellow', 'red', 'blue']
      const randomIndex = Math.floor(Math.random() * statuses.length)
      return {
        status: statuses[randomIndex],
        color: colors[randomIndex],
        message: `시스템 ${statuses[randomIndex]}`,
        lastUpdated: now.toLocaleTimeString()
      }
    }
      
    default:
      return {
        message: '데이터 없음',
        lastUpdated: now.toLocaleTimeString()
      }
  }
}

// 실시간 데이터 업데이트 인터벌 관리
export const realtimeUpdateManager = {
  intervals: reactive({}),
  
  // 위젯의 실시간 업데이트 시작
  startUpdate(instanceId, widgetType, dataType, interval = 5000) {
    // 기존 인터벌이 있으면 제거
    this.stopUpdate(instanceId)
    
    // 초기 데이터 생성
    const initialData = generateRealtimeData(widgetType, dataType)
    widgetDataStore.updateWidgetData(instanceId, initialData)
    
    // 주기적 업데이트 시작
    const intervalId = setInterval(() => {
      const newData = generateRealtimeData(widgetType, dataType)
      widgetDataStore.updateWidgetData(instanceId, newData)
    }, interval)
    
    this.intervals[instanceId] = intervalId
  },
  
  // 위젯의 실시간 업데이트 중지
  stopUpdate(instanceId) {
    const intervalId = this.intervals[instanceId]
    if (intervalId) {
      clearInterval(intervalId)
      delete this.intervals[instanceId]
    }
  },
  
  // 모든 업데이트 중지
  stopAllUpdates() {
    Object.values(this.intervals).forEach((intervalId) => {
      clearInterval(intervalId)
    })
    Object.keys(this.intervals).forEach(key => {
      delete this.intervals[key]
    })
  }
}
