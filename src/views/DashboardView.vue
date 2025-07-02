<template>
  <div class="dashboard-container">
    <div class="dashboard-content">
      <!-- 우측 사이드바 (편집모드에서만) -->
      <aside v-if="isEditMode" class="widget-sidebar" :class="{ 'sidebar-hidden': !sidebarOpen }">
        <h3 class="sidebar-title">위젯 추가</h3>
        <div class="widget-categories">
          <!-- 데이터 종류별로 구분 -->
          <div class="category-section">
            <h4 class="category-title">⚡ 전력 사용량</h4>
            <div class="data-description">실시간 전력 사용량 모니터링</div>
            <div class="widget-list">
              <div class="widget-item" @click="showWidgetSelector('power_usage', '전력 사용량')">
                <span class="widget-icon">📈</span>
                <span class="widget-name">전력 사용량 위젯 추가</span>
                <span class="widget-arrow">→</span>
              </div>
            </div>
          </div>

          <div class="category-section">
            <h4 class="category-title">☀️ 태양광 발전량</h4>
            <div class="data-description">태양광 발전량 및 예측량</div>
            <div class="widget-list">
              <div
                class="widget-item"
                @click="showWidgetSelector('solar_generation', '태양광 발전량')"
              >
                <span class="widget-icon">📈</span>
                <span class="widget-name">태양광 위젯 추가</span>
                <span class="widget-arrow">→</span>
              </div>
            </div>
          </div>

          <div class="category-section">
            <h4 class="category-title">🌡️ 환경 센서</h4>
            <div class="data-description">온도, 습도, 압력 등</div>
            <div class="widget-list">
              <div class="widget-item" @click="showWidgetSelector('environment', '환경 센서')">
                <span class="widget-icon">🌡️</span>
                <span class="widget-name">환경 센서 위젯 추가</span>
                <span class="widget-arrow">→</span>
              </div>
            </div>
          </div>

          <div class="category-section">
            <h4 class="category-title">⚙️ 설비 제어</h4>
            <div class="data-description">설비 제어 및 상태 모니터링</div>
            <div class="widget-list">
              <div
                class="widget-item"
                @click="showWidgetSelector('equipment_control', '설비 제어')"
              >
                <span class="widget-icon">🔘</span>
                <span class="widget-name">설비 제어 위젯 추가</span>
                <span class="widget-arrow">→</span>
              </div>
            </div>
          </div>

          <div class="category-section">
            <h4 class="category-title">🔔 시스템 정보</h4>
            <div class="data-description">알람, 상태, 보고서 등</div>
            <div class="widget-list">
              <div class="widget-item" @click="showWidgetSelector('system_info', '시스템 정보')">
                <span class="widget-icon">🔔</span>
                <span class="widget-name">시스템 정보 위젯 추가</span>
                <span class="widget-arrow">→</span>
              </div>
            </div>
          </div>

          <div class="category-section">
            <h4 class="category-title">🔗 기타</h4>
            <div class="data-description">링크, 이미지 등</div>
            <div class="widget-list">
              <div class="widget-item" @click="showWidgetSelector('misc', '기타')">
                <span class="widget-icon">🔗</span>
                <span class="widget-name">기타 위젯 추가</span>
                <span class="widget-arrow">→</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main class="dashboard-main" :class="{ 'sidebar-open': sidebarOpen }">
        <div class="dashboard-header">
          <div class="dashboard-date">
            <div class="left_date">19</div>
            <div class="right-day-month">
              <span>Tue,</span><br/>
              <span>December</span>
            </div>
            <div class="task">
              <button>Show my Tasks 

                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.293 2.29279C8.48053 2.10532 8.73484 2 9 2C9.26516 2 9.51947 2.10532 9.707 2.29279L14.207 6.79279C14.3945 6.98031 14.4998 7.23462 14.4998 7.49979C14.4998 7.76495 14.3945 8.01926 14.207 8.20679L9.707 12.7068C9.5184 12.8889 9.2658 12.9897 9.0036 12.9875C8.7414 12.9852 8.49059 12.88 8.30518 12.6946C8.11977 12.5092 8.0146 12.2584 8.01233 11.9962C8.01005 11.734 8.11084 11.4814 8.293 11.2928L11 8.49979H1.5C1.23478 8.49979 0.98043 8.39443 0.792893 8.20689C0.605357 8.01936 0.5 7.765 0.5 7.49979C0.5 7.23457 0.605357 6.98022 0.792893 6.79268C0.98043 6.60514 1.23478 6.49979 1.5 6.49979H11L8.293 3.70679C8.10553 3.51926 8.00021 3.26495 8.00021 2.99979C8.00021 2.73462 8.10553 2.48031 8.293 2.29279Z"/>
</svg>
              </button>


            </div>
          </div>

          <div class="dashboard-right">
            <div class="welcome-text">
            <span class="user-name">{{ authStore.user?.name || 'ADMIN' }}님</span> 반가워요 🖐<br/>
            무엇을 도와드릴까요?
            </div>

          </div>
          


        </div>

        <div v-if="isEditMode" class="dashboard-toolbar">
          <div class="toolbar-right">
            <button @click="clearDashboard" class="clear-btn">
              <span class="btn-icon">🗑️</span>
              모든 위젯 삭제
            </button>
          </div>
        </div>

        <div
          ref="dashboardGrid"
          class="dashboard-grid"
          :class="{ empty: dashboardWidgets.length === 0 }"
        >
          <div v-if="dashboardWidgets.length === 0" class="empty-state">
            <div class="empty-icon">📈</div>
            <h3 class="empty-title">대시보드가 비어있습니다</h3>
            <p class="empty-description">
              <span v-if="!isEditMode">
                헤더의 '위젯 편집' 버튼을 눌러<br />
                위젯을 추가해보세요.
              </span>
              <span v-else>
                우측 사이드바에서 데이터 종류를 선택하고<br />
                원하는 위젯을 추가해보세요.
              </span>
            </p>
            <div class="empty-features">
              <div class="feature-item">
                <span class="feature-icon">📈</span>
                <span>시계열 그래프</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">📊</span>
                <span>막대 차트</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">🍰</span>
                <span>원형 차트</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">🔘</span>
                <span>제어 위젯</span>
              </div>
            </div>
          </div>

          <div class="widget-grid">
            <div
              v-for="element in dashboardWidgets"
              :key="element.instanceId"
              class="widget-container"
              :style="{
                gridColumn: `span ${element.gridSize.width}`,
                gridRow: `span ${element.gridSize.height}`,
              }"
            >
              <div class="widget-header">
                <div class="widget-title-section">
                  <span class="widget-category">{{ element.dataType }}</span>
                  <span class="widget-title">{{ element.name }}</span>
                </div>
                <div v-if="isEditMode" class="widget-controls">
                  <button @click="configureWidget(element)" class="control-btn" title="설정">
                    ⚙️
                  </button>
                  <button @click="resizeWidget(element)" class="control-btn" title="크기 조절">
                    ⛶
                  </button>
                  <button @click="removeWidget(element)" class="control-btn remove" title="삭제">
                    ✕
                  </button>
                </div>
              </div>

              <div class="widget-content">
                <div class="widget-placeholder">
                  <div class="placeholder-icon">{{ element.icon }}</div>
                  <div class="placeholder-text">
                    <strong>{{ element.name }}</strong
                    ><br />
                    <small>{{ element.description }}</small
                    ><br />
                    <span class="update-cycle">업데이트 주기: {{ element.updateCycle }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- 위젯 선택 모달 -->
    <div v-if="widgetSelector.show" class="modal-overlay" @click="closeWidgetSelector">
      <div class="modal-content widget-selector-modal" @click.stop>
        <h3 class="modal-title">{{ widgetSelector.dataType }} 위젯 선택</h3>
        <p class="modal-description">
          {{ widgetSelector.dataType }}를 표시할 위젯 형태를 선택하세요
        </p>

        <div class="widget-type-grid">
          <div
            v-for="widget in getAvailableWidgets(widgetSelector.category)"
            :key="widget.id"
            class="widget-type-card"
            @click="addWidget(widget)"
          >
            <div class="widget-type-icon">{{ widget.icon }}</div>
            <div class="widget-type-name">{{ widget.name }}</div>
            <div class="widget-type-description">{{ widget.description }}</div>
            <div class="widget-type-badge">{{ widget.updateCycle }}</div>
          </div>
        </div>

        <div class="modal-actions">
          <button @click="closeWidgetSelector" class="cancel-btn">취소</button>
        </div>
      </div>
    </div>

    <!-- 위젯 크기 조절 모달 -->
    <div v-if="resizeModal.show" class="modal-overlay" @click="closeResizeModal">
      <div class="modal-content" @click.stop>
        <h3 class="modal-title">위젯 크기 조절</h3>
        <div class="size-controls">
          <div class="size-control">
            <label>너비 (그리드 칸 수)</label>
            <select v-model="resizeModal.width">
              <option :value="1">1칸</option>
              <option :value="2">2칸</option>
              <option :value="3">3칸</option>
              <option :value="4">4칸</option>
              <option :value="6">6칸</option>
            </select>
          </div>
          <div class="size-control">
            <label>높이 (그리드 칸 수)</label>
            <select v-model="resizeModal.height">
              <option :value="1">1칸</option>
              <option :value="2">2칸</option>
              <option :value="3">3칸</option>
              <option :value="4">4칸</option>
            </select>
          </div>
        </div>
        <div class="modal-actions">
          <button @click="closeResizeModal" class="cancel-btn">취소</button>
          <button @click="applyResize" class="apply-btn">적용</button>
        </div>
      </div>
    </div>

    <!-- 나가기 확인 모달 -->
    <div v-if="exitConfirmModal.show" class="modal-overlay" @click="closeExitConfirmModal">
      <div class="modal-content exit-confirm-modal" @click.stop>
        <h3 class="modal-title">편집 내용을 저장하시겠습니까?</h3>
        <p class="modal-description">
          변경된 내용이 있습니다. 저장하지 않으면 변경사항이 손실될 수 있습니다.
        </p>

        <div class="modal-actions exit-confirm-actions">
          <button @click="closeExitConfirmModal" class="cancel-btn">취소</button>
          <button @click="exitWithoutSaving" class="exit-without-save-btn">
            저장하지 않고 나가기
          </button>
          <button @click="saveAndExit" class="save-and-exit-btn">저장하고 나가기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'  

const authStore = useAuthStore()

// 사이드바 상태 관리
const sidebarOpen = ref(false)
const isEditMode = ref(false)

// 헤더에서 편집모드 변경 이벤트 리스너
const handleEditModeChange = (event) => {
  isEditMode.value = event.detail.isEditMode
  sidebarOpen.value = event.detail.sidebarOpen
}

// 헤더에서 사이드바 토글 이벤트 리스너
const handleSidebarToggle = (event) => {
  if (isEditMode.value) {
    sidebarOpen.value = event.detail.isOpen
  }
}

// 헤더에서 나가기 확인 이벤트 리스너
const handleConfirmExitEditMode = () => {
  exitConfirmModal.show = true
}

// 나가기 확인 모달 닫기
const closeExitConfirmModal = () => {
  exitConfirmModal.show = false
}

// 저장하지 않고 나가기
const exitWithoutSaving = () => {
  exitConfirmModal.show = false
  // 헤더에 강제 종료 이벤트 전송
  window.dispatchEvent(new CustomEvent('force-exit-edit-mode'))
}

// 저장하고 나가기
const saveAndExit = () => {
  saveDashboard()
  exitConfirmModal.show = false
  // 헤더에 강제 종료 이벤트 전송
  window.dispatchEvent(new CustomEvent('force-exit-edit-mode'))
}

// 헤더에서 저장 이벤트 리스너
const handleSaveDashboard = () => {
  saveDashboard()
}

// 데이터 종류별 사용 가능한 위젯 정의
const widgetDefinitions = {
  power_usage: [
    {
      id: 'power-line-chart',
      name: '선 시계열 그래프',
      icon: '📈',
      type: 'line-chart',
      description: '시간에 따른 전력 사용량 변화를 선그래프로 표시',
      updateCycle: '1분~하루',
    },
    {
      id: 'power-bar-chart',
      name: '막대 시계열 그래프',
      icon: '📊',
      type: 'bar-chart',
      description: '시간에 따른 전력 사용량 변화를 막대그래프로 표시',
      updateCycle: '1분~하루',
    },
    {
      id: 'power-pie-chart',
      name: '원 그래프',
      icon: '🍰',
      type: 'pie-chart',
      description: '전력 사용량 비율을 원형 차트로 표시',
      updateCycle: '15분~하루',
    },
    {
      id: 'power-box-widget',
      name: '박스 위젯',
      icon: '📦',
      type: 'box-widget',
      description: '현재 전력량을 숫자로 표시',
      updateCycle: '1분',
    },
  ],
  solar_generation: [
    {
      id: 'solar-line-chart',
      name: '선 시계열 그래프',
      icon: '📈',
      type: 'line-chart',
      description: '태양광 발전량과 예측량을 선그래프로 표시',
      updateCycle: '1분~하루',
    },
    {
      id: 'solar-bar-chart',
      name: '막대 시계열 그래프',
      icon: '📊',
      type: 'bar-chart',
      description: '태양광 발전량과 예측량을 막대그래프로 표시',
      updateCycle: '1분~하루',
    },
    {
      id: 'solar-box-widget',
      name: '박스 위젯',
      icon: '📦',
      type: 'box-widget',
      description: '현재 발전량을 숫자로 표시',
      updateCycle: '1분',
    },
  ],
  environment: [
    {
      id: 'temp-bar-widget',
      name: '막대(온도) 위젯',
      icon: '🌡️',
      type: 'bar-gauge-widget',
      description: '온도를 막대 게이지로 표시',
      updateCycle: '1분~15분',
    },
    {
      id: 'humidity-bar-widget',
      name: '막대(습도) 위젯',
      icon: '💧',
      type: 'bar-gauge-widget',
      description: '습도를 퍼센트 막대로 표시',
      updateCycle: '1분~15분',
    },
    {
      id: 'pressure-box-widget',
      name: '박스 위젯',
      icon: '📦',
      type: 'box-widget',
      description: '압력값을 숫자로 표시',
      updateCycle: '1분~15분',
    },
  ],
  equipment_control: [
    {
      id: 'on-off-control',
      name: '제어(ON/OFF) 위젯',
      icon: '🔘',
      type: 'on-off-control',
      description: '설비 ON/OFF 제어 및 현재 상태 표시',
      updateCycle: '실시간',
    },
    {
      id: 'up-down-control',
      name: '제어(UP/DOWN) 위젯',
      icon: '🔼',
      type: 'up-down-control',
      description: '온도/압력/조도 등 수치 제어',
      updateCycle: '실시간',
    },
    {
      id: 'status-widget',
      name: '상태표시 위젯',
      icon: '🟢',
      type: 'status-widget',
      description: '현재 상태를 색상으로 표시',
      updateCycle: '1분',
    },
  ],
  system_info: [
    {
      id: 'alarm-widget',
      name: '알람 위젯',
      icon: '🚨',
      type: 'alarm-widget',
      description: '통신 또는 설비 알람 표시',
      updateCycle: '실시간',
    },
    {
      id: 'energy-report',
      name: '에너지 진단보고서',
      icon: '📋',
      type: 'energy-report',
      description: 'PDF 진단보고서 분석 결과',
      updateCycle: '하루',
    },
  ],
  misc: [
    {
      id: 'page-link',
      name: '페이지 링크 위젯',
      icon: '🔗',
      type: 'page-link',
      description: 'URL 링크 표시 및 이동',
      updateCycle: '정적',
    },
    {
      id: 'image-widget',
      name: '그림삽입 위젯',
      icon: '🖼️',
      type: 'image-widget',
      description: '이미지 파일 표시',
      updateCycle: '정적',
    },
  ],
}

// 위젯 선택 모달 상태
const widgetSelector = reactive({
  show: false,
  category: '',
  dataType: '',
})

// 대시보드 상태
const dashboardWidgets = ref([])
const dashboardGrid = ref(null)

// 크기 조절 모달
const resizeModal = reactive({
  show: false,
  widget: null,
  width: 2,
  height: 2,
})

// 나가기 확인 모달
const exitConfirmModal = reactive({
  show: false,
})

// 위젯 선택기 표시
const showWidgetSelector = (category, dataType) => {
  widgetSelector.category = category
  widgetSelector.dataType = dataType
  widgetSelector.show = true
}

// 위젯 선택기 닫기
const closeWidgetSelector = () => {
  widgetSelector.show = false
  widgetSelector.category = ''
  widgetSelector.dataType = ''
}

// 카테고리별 사용 가능한 위젯 가져오기
const getAvailableWidgets = (category) => {
  return widgetDefinitions[category] || []
}

// 위젯 추가
const addWidget = (widget) => {
  const newWidget = {
    ...widget,
    instanceId: Date.now() + Math.random(),
    dataType: widgetSelector.dataType,
    gridSize: { width: 2, height: 2 },
    data: {},
    config: {
      updateCycle: widget.updateCycle,
      dataSource: '',
      customSettings: {},
    },
  }
  dashboardWidgets.value.push(newWidget)
  closeWidgetSelector()
  
  // 위젯 추가 후 사이드바 닫기
  sidebarOpen.value = false
  // 헤더에 사이드바 상태 변경 알림
  window.dispatchEvent(new CustomEvent('sidebar-state-change', {
    detail: { isOpen: false }
  }))
}

// 위젯 제거
const removeWidget = (widget) => {
  if (confirm(`${widget.name} 위젯을 삭제하시겠습니까?`)) {
    const index = dashboardWidgets.value.findIndex((w) => w.instanceId === widget.instanceId)
    if (index > -1) {
      dashboardWidgets.value.splice(index, 1)
    }
  }
}

// 위젯 크기 조절
const resizeWidget = (widget) => {
  resizeModal.widget = widget
  resizeModal.width = widget.gridSize.width
  resizeModal.height = widget.gridSize.height
  resizeModal.show = true
}

const closeResizeModal = () => {
  resizeModal.show = false
  resizeModal.widget = null
}

const applyResize = () => {
  if (resizeModal.widget) {
    resizeModal.widget.gridSize.width = resizeModal.width
    resizeModal.widget.gridSize.height = resizeModal.height
  }
  closeResizeModal()
}

// 위젯 설정
const configureWidget = (widget) => {
  alert(`${widget.name} 위젯 설정 기능은 개발 중입니다.`)
}

// 대시보드 저장
const saveDashboard = () => {
  localStorage.setItem('haezoom-dashboard-config', JSON.stringify(dashboardWidgets.value))

  const toast = document.createElement('div')
  toast.className = 'save-toast'
  toast.textContent = '✅ 대시보드가 저장되었습니다!'
  toast.style.cssText = `
    position: fixed;
    top: 120px;
    right: 24px;
    background: #E16349;
    color: white;
    padding: 16px 24px;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
    z-index: 10000;
    font-weight: 600;
    animation: slideIn 0.3s ease;
  `
  document.body.appendChild(toast)

  setTimeout(() => {
    toast.remove()
  }, 3000)
}

// 대시보드 불러오기
const loadDashboard = () => {
  const saved = localStorage.getItem('haezoom-dashboard-config')
  if (saved) {
    dashboardWidgets.value = JSON.parse(saved)
  }
}

// 대시보드 초기화
const clearDashboard = () => {
  if (confirm('모든 위젯을 삭제하시겠습니까?\n(저장된 대시보드 설정도 함께 삭제됩니다)')) {
    dashboardWidgets.value = []
    localStorage.removeItem('haezoom-dashboard-config')
  }
}

onMounted(() => {
  loadDashboard()
  // 헤더에서 오는 이벤트 리스너 등록
  window.addEventListener('edit-mode-change', handleEditModeChange)
  window.addEventListener('sidebar-toggle', handleSidebarToggle)
  window.addEventListener('save-dashboard', handleSaveDashboard)
  window.addEventListener('confirm-exit-edit-mode', handleConfirmExitEditMode)
})

onUnmounted(() => {
  // 이벤트 리스너 제거
  window.removeEventListener('edit-mode-change', handleEditModeChange)
  window.removeEventListener('sidebar-toggle', handleSidebarToggle)
  window.removeEventListener('save-dashboard', handleSaveDashboard)
  window.removeEventListener('confirm-exit-edit-mode', handleConfirmExitEditMode)
})
</script>

<style scoped>
@import './DashboardView-styles.css';
</style>
