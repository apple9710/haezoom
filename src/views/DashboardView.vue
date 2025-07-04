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
              <span>Tue,</span><br />
              <span>December</span>
            </div>
            <div class="task">
              <button>
                Show my Tasks

                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.293 2.29279C8.48053 2.10532 8.73484 2 9 2C9.26516 2 9.51947 2.10532 9.707 2.29279L14.207 6.79279C14.3945 6.98031 14.4998 7.23462 14.4998 7.49979C14.4998 7.76495 14.3945 8.01926 14.207 8.20679L9.707 12.7068C9.5184 12.8889 9.2658 12.9897 9.0036 12.9875C8.7414 12.9852 8.49059 12.88 8.30518 12.6946C8.11977 12.5092 8.0146 12.2584 8.01233 11.9962C8.01005 11.734 8.11084 11.4814 8.293 11.2928L11 8.49979H1.5C1.23478 8.49979 0.98043 8.39443 0.792893 8.20689C0.605357 8.01936 0.5 7.765 0.5 7.49979C0.5 7.23457 0.605357 6.98022 0.792893 6.79268C0.98043 6.60514 1.23478 6.49979 1.5 6.49979H11L8.293 3.70679C8.10553 3.51926 8.00021 3.26495 8.00021 2.99979C8.00021 2.73462 8.10553 2.48031 8.293 2.29279Z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div class="dashboard-right">
            <div class="welcome-text">
              <span class="user-name">{{ authStore.user?.name || 'ADMIN' }}님</span> 반가워요 🖐<br />
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
          @dragover="handleDragOver"
          @drop="handleDrop"
          :style="{
            display: 'grid',
            gridTemplateColumns: `repeat(${gridConfig.cols}, 1fr)`,
            gridTemplateRows: `repeat(${gridConfig.rows}, 1fr)`,
            gap: '16px',
            padding: '24px',
            position: 'relative',
          }"
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

          <!-- 위젯들을 직접 dashboard-grid에 배치 -->
          <div
            v-for="element in dashboardWidgets"
            :key="element.instanceId"
            class="widget-container"
            :class="{ dragging: dragState.dragElement === element, clickable: !isEditMode }"
            :draggable="isEditMode"
            @dragstart="isEditMode ? handleDragStart(element, $event) : null"
            @dragend="handleDragEnd"
            @click="!isEditMode ? openWidgetModal(element) : null"
            :style="{
              gridColumn: element.position
                ? `${element.position.x + 1} / span ${element.gridSize.width}`
                : `1 / span ${element.gridSize.width}`,
              gridRow: element.position
                ? `${element.position.y + 1} / span ${element.gridSize.height}`
                : `auto / span ${element.gridSize.height}`,
              cursor: isEditMode ? 'move' : 'pointer',
            }"
          >
            <div class="widget-inner">
              <!-- 편집모드에서만 위젯 헤더 표시 -->
              <div v-if="isEditMode" class="widget-header">
                <div class="widget-title-section">
                  <span class="widget-category">{{ element.dataType }}</span>
                  <span class="widget-title">{{ element.name }}</span>
                </div>
                <div class="widget-controls">
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

              <div class="widget-content" :class="{ 'no-header': !isEditMode }">
                <!-- WidgetFactory를 사용하여 동적으로 위젯 렌더링 -->
                <WidgetFactory
                  :widgetType="element.type"
                  :data="element.data || {}"
                  :config="element.config || {}"
                  :isEditMode="isEditMode"
                />
              </div>
            </div>
          </div>

          <!-- 드롭 가이드 -->
          <div
            v-if="dragState.showDropGuide"
            class="drop-guide"
            :style="dragState.dropGuideStyle"
          ></div>
        </div>
      </main>
    </div>

    <!-- 위젯 선택 모달 -->
    <div v-if="widgetSelector.show" class="modal-overlay" @click="closeWidgetSelector">
      <div class="modal-content widget-selector-modal" @click.stop>
        <h3 class="modal-title">
          {{ widgetSelector.dataType }} {{ widgetOptions.show ? '옵션' : '위젯' }} 선택
        </h3>
        <p class="modal-description">
          {{ widgetSelector.dataType }}를 표시할 위젯 형태를 선택하세요
        </p>

        <div v-if="!widgetOptions.show" class="widget-type-grid">
          <div
            v-for="widget in getAvailableWidgets(widgetSelector.category)"
            :key="widget.id"
            class="widget-type-card"
            @click="changeShowWidget(widget)"
          >
            <div class="widget-type-icon">{{ widget.icon }}</div>
            <div class="widget-type-name">{{ widget.name }}</div>
            <div class="widget-type-description">{{ widget.description }}</div>
            <div class="widget-type-badge">
              {{
                widget.updateCycle.length !== 1
                  ? widgetChar(Math.min(...widget.updateCycle)) +
                    '~' +
                    widgetChar(Math.max(...widget.updateCycle))
                  : widgetChar(widget.updateCycle[0])
              }}
            </div>
          </div>
        </div>
        <div v-else-if="widgetOptions.show" class="widget-options">
          <p>업데이트 주기</p>
          <div class="input-box">
            <div
              v-for="(option, index) in widgetOptions.cycle"
              :key="index"
              class="widget-option-item"
            >
              <input
                type="radio"
                name="cycle"
                :value="option"
                v-model="widgetOptions.selectedCycle"
                :id="`cycle-${index}`"
              />
              <label :for="`cycle-${index}`">{{ widgetChar(option) }}</label>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button @click="addWidget(widgetOptions.other)" class="cancel-btn">등록</button>
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

    <!-- 위젯 상세보기 모달 -->
    <div v-if="widgetModal.show" class="modal-overlay" @click="closeWidgetModal">
      <div class="modal-content widget-detail-modal" @click.stop>
        <div class="modal-header">
          <div class="modal-title-section">
            <h3 class="modal-title">{{ widgetModal.widget?.name || '위젯 상세보기' }}</h3>
            <span class="widget-category-badge">{{ widgetModal.widget?.dataType }}</span>
          </div>
          <button @click="closeWidgetModal" class="close-btn">✕</button>
        </div>

        <div class="modal-body">
          <div v-if="widgetModal.widget" class="widget-detail-content">
            <!-- 확대된 위젯 컨텐츠 -->
            <div class="expanded-widget">
              <WidgetFactory
                :widgetType="widgetModal.widget.type"
                :data="widgetModal.widget.data || {}"
                :config="{ ...widgetModal.widget.config, isExpanded: true }"
                :isEditMode="false"
              />
            </div>

            <!-- 위젯 정보 -->
            <div class="widget-info-panel">
              <div class="info-section">
                <h4>위젯 정보</h4>
                <div class="info-grid">
                  <div class="info-item">
                    <span class="info-label">타입:</span>
                    <span class="info-value">{{ widgetModal.widget.name }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">카테고리:</span>
                    <span class="info-value">{{ widgetModal.widget.dataType }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">크기:</span>
                    <span class="info-value">{{ widgetModal.widget.gridSize.width }} × {{ widgetModal.widget.gridSize.height }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">업데이트 주기:</span>
                    <span class="info-value">
                      {{ Array.isArray(widgetModal.widget.updateCycle) 
                          ? widgetModal.widget.updateCycle.map(c => widgetChar(c)).join(', ')
                          : widgetModal.widget.updateCycle }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="info-section">
                <h4>설명</h4>
                <p class="widget-description">{{ widgetModal.widget.description || '위젯에 대한 설명이 없습니다.' }}</p>
              </div>

              <!-- 위젯별 추가 정보 -->
              <div v-if="widgetModal.additionalInfo" class="info-section">
                <h4>추가 정보</h4>
                <div class="additional-info">
                  <div v-for="(value, key) in widgetModal.additionalInfo" :key="key" class="info-item">
                    <span class="info-label">{{ key }}:</span>
                    <span class="info-value">{{ value }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="openWidgetSettings" class="settings-btn">
            <span class="btn-icon">⚙️</span>
            위젯 설정
          </button>
          <button @click="closeWidgetModal" class="close-modal-btn">닫기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import WidgetFactory from '@/components/widgets/WidgetFactory.vue'

const authStore = useAuthStore()

// 드래그 앤 드롭 상태
const dragState = reactive({
  isDragging: false,
  dragElement: null,
  showDropGuide: false,
  dropGuideStyle: {}
})

// 크기 조절 모달 상태
const resizeModal = reactive({
  show: false,
  widget: null,
  width: 2,
  height: 2
})

// 위젯 선택 모달 상태
const widgetSelector = reactive({
  show: false,
  category: '',
  dataType: '',
})

const widgetOptions = reactive({
  show: false,
  keyword: [],
  cycle: [],
  unit: '',
  selectedCycle: '',
})

// 위젯 상세보기 모달 상태
const widgetModal = reactive({
  show: false,
  widget: null,
  additionalInfo: null
})

// 나가기 확인 모달 상태
const exitConfirmModal = reactive({
  show: false
})

// 대시보드 상태
const dashboardWidgets = ref([])
const dashboardGrid = ref(null)

// 그리드 설정
const gridConfig = reactive({
  cols: 16,
  rows: 6
})

// 사이드바 상태
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
const widgetsData = {
  power_usage: [
    {
      id: 'power-line-chart',
      name: '선 시계열 그래프',
      icon: '📈',
      type: 'line-chart',
      description: '시간에 따른 전력 사용량 변화를 선그래프로 표시',
      updateCycle: [0, 1, 2, 3],
    },
    {
      id: 'power-bar-chart',
      name: '막대 시계열 그래프',
      icon: '📊',
      type: 'bar-chart',
      description: '시간에 따른 전력 사용량 변화를 막대그래프로 표시',
      updateCycle: [0, 1, 2, 3],
    },
    {
      id: 'power-pie-chart',
      name: '원 그래프',
      icon: '🍰',
      type: 'pie-chart',
      description: '전력 사용량 비율을 원형 차트로 표시',
      updateCycle: [1, 2, 3],
    },
    {
      id: 'power-box-widget',
      name: '박스 위젯',
      icon: '📦',
      type: 'box-widget',
      description: '현재 전력량을 숫자로 표시',
      updateCycle: [0],
    },
  ],
  solar_generation: [
    {
      id: 'solar-line-chart',
      name: '선 시계열 그래프',
      icon: '📈',
      type: 'line-chart',
      description: '태양광 발전량과 예측량을 선그래프로 표시',
      updateCycle: [0, 1, 2, 3],
    },
    {
      id: 'solar-bar-chart',
      name: '막대 시계열 그래프',
      icon: '📊',
      type: 'bar-chart',
      description: '태양광 발전량과 예측량을 막대그래프로 표시',
      updateCycle: [0, 1, 2, 3],
    },
    {
      id: 'solar-box-widget',
      name: '박스 위젯',
      icon: '📦',
      type: 'box-widget',
      description: '현재 발전량을 숫자로 표시',
      updateCycle: [0],
    },
  ],
  environment: [
    {
      id: 'temp-bar-widget',
      name: '막대(온도) 위젯',
      icon: '🌡️',
      type: 'bar-gauge-widget',
      description: '온도를 막대 게이지로 표시',
      updateCycle: [0, 1],
    },
    {
      id: 'humidity-bar-widget',
      name: '막대(습도) 위젯',
      icon: '💧',
      type: 'bar-gauge-widget',
      description: '습도를 퍼센트 막대로 표시',
      updateCycle: [0, 1],
    },
    {
      id: 'pressure-box-widget',
      name: '박스 위젯',
      icon: '📦',
      type: 'box-widget',
      description: '압력값을 숫자로 표시',
      updateCycle: [0, 1],
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
      updateCycle: '실시간',
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
      updateCycle: [3],
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

// 카테고리별 사용 가능한 위젯 반환
const getAvailableWidgets = (category) => {
  return widgetsData[category] || []
}

// 위젯 사이클 변환
const widgetChar = (ele) => {
  const numArr = ['1분', '15분', '1시간', '하루']
  if (typeof ele === 'number') {
    return numArr[ele]
  } else if (typeof ele === 'string') {
    return ele
  }
}

// 위젯 추가
const addWidget = (widget) => {
  // 빈 공간 찾기
  const emptyPosition = findEmptyPosition({ width: 2, height: 2 })

  const newWidget = {
    ...widget,
    instanceId: Date.now() + Math.random(),
    cycle: widgetOptions.cycle,
    selectedCycle: widgetOptions.selectedCycle,
    keyword: widgetOptions.keyword,
    unit: widgetOptions.unit,
    dataType: widgetSelector.dataType,
    gridSize: { width: 2, height: 2 },
    position: emptyPosition,
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
}

// 빈 공간 찾기
const findEmptyPosition = (size) => {
  for (let y = 0; y <= gridConfig.rows - size.height; y++) {
    for (let x = 0; x <= gridConfig.cols - size.width; x++) {
      if (isPositionEmpty(x, y, size)) {
        return { x, y }
      }
    }
  }
  return { x: 0, y: 0 }
}

// 위치가 비어있는지 확인
const isPositionEmpty = (x, y, size) => {
  for (let dy = 0; dy < size.height; dy++) {
    for (let dx = 0; dx < size.width; dx++) {
      if (isPositionOccupied(x + dx, y + dy)) {
        return false
      }
    }
  }
  return true
}

// 위치가 점유되어 있는지 확인
const isPositionOccupied = (x, y) => {
  return dashboardWidgets.value.some((widget) => {
    if (!widget.position) return false
    const wx = widget.position.x
    const wy = widget.position.y
    const ww = widget.gridSize.width
    const wh = widget.gridSize.height
    return x >= wx && x < wx + ww && y >= wy && y < wy + wh
  })
}

// 나머지 필요한 함수들
const configureWidget = (widget) => {
  console.log('위젯 설정:', widget)
  // TODO: 위젯 설정 모달 구현
}

const clearDashboard = () => {
  if (confirm('모든 위젯을 삭제하시겠습니까?')) {
    dashboardWidgets.value = []
  }
}

const saveDashboard = () => {
  localStorage.setItem('dashboard-widgets', JSON.stringify(dashboardWidgets.value))
  console.log('대시보드 저장됨')
}

const loadDashboard = () => {
  const saved = localStorage.getItem('dashboard-widgets')
  if (saved) {
    dashboardWidgets.value = JSON.parse(saved)
  }
}

// 드래그 앤 드롭 관련 함수들
const handleDragStart = (element, event) => {
  dragState.isDragging = true
  dragState.dragElement = element
  event.dataTransfer.effectAllowed = 'move'
}

const handleDragEnd = () => {
  resetDragState()
}

const resetDragState = () => {
  dragState.isDragging = false
  dragState.dragElement = null
  dragState.showDropGuide = false
  dragState.dropGuideStyle = {}
}

const handleDragOver = (event) => {
  if (!isEditMode.value || !dragState.dragElement) return

  event.preventDefault()
  event.dataTransfer.dropEffect = 'move'

  const gridRect = dashboardGrid.value.getBoundingClientRect()
  const cellWidth = (gridRect.width - 48) / gridConfig.cols // 48 = padding * 2
  const cellHeight = 120 + 16 // 셀 높이 + gap

  const mouseX = event.clientX - gridRect.left - 24 // padding 제외
  const mouseY = event.clientY - gridRect.top - 24

  const gridX = Math.floor(mouseX / cellWidth)
  const gridY = Math.floor(mouseY / cellHeight)

  dragState.dropPosition = {
    x: Math.max(0, Math.min(gridX, gridConfig.cols - dragState.dragElement.gridSize.width)),
    y: Math.max(0, Math.min(gridY, gridConfig.rows - dragState.dragElement.gridSize.height)),
  }

  // 드래그 가이드 표시
  showDropGuide()
}

const handleDrop = (event) => {
  event.preventDefault()
  console.log('드롭 이벤트 발생')

  if (!dragState.dragElement) {
    console.log('드래그 요소가 없음')
    return
  }

  const draggedElement = dragState.dragElement
  const newPosition = { ...dragState.dropPosition }

  // 배치 가능성 확인
  if (canPlaceWidget(newPosition, draggedElement.gridSize, draggedElement)) {
    draggedElement.position = newPosition
    saveDashboard()
  }

  resetDragState()
}

const canPlaceWidget = (position, size, excludeWidget = null) => {
  for (let dy = 0; dy < size.height; dy++) {
    for (let dx = 0; dx < size.width; dx++) {
      const x = position.x + dx
      const y = position.y + dy

      if (x >= gridConfig.cols || y >= gridConfig.rows) {
        return false
      }

      const occupied = dashboardWidgets.value.some((widget) => {
        if (excludeWidget && widget.instanceId === excludeWidget.instanceId) {
          return false
        }
        if (!widget.position) return false
        const wx = widget.position.x
        const wy = widget.position.y
        const ww = widget.gridSize.width
        const wh = widget.gridSize.height
        return x >= wx && x < wx + ww && y >= wy && y < wy + wh
      })

      if (occupied) return false
    }
  }
  return true
}

const showDropGuide = () => {
  if (!dragState.dropPosition) return

  dragState.showDropGuide = true
  dragState.dropGuideStyle = {
    gridColumn: `${dragState.dropPosition.x + 1} / span ${dragState.dragElement.gridSize.width}`,
    gridRow: `${dragState.dropPosition.y + 1} / span ${dragState.dragElement.gridSize.height}`,
  }
}

// 위젯 선택 모달 열기
const showWidgetSelector = (category, dataType) => {
  widgetSelector.category = category
  widgetSelector.dataType = dataType
  widgetSelector.show = true
  widgetOptions.show = false
}

// 위젯 선택 모달 닫기
const closeWidgetSelector = () => {
  widgetSelector.show = false
  widgetSelector.category = ''
  widgetSelector.dataType = ''
}

// 위젯 옵션으로 변경
const changeShowWidget = (widget) => {
  widgetOptions.show = true
  widgetOptions.cycle = widget.updateCycle
  widgetOptions.selectedCycle = Array.isArray(widget.updateCycle) ? widget.updateCycle[0] : widget.updateCycle
  widgetOptions.keyword = []
  widgetOptions.unit = ''
  widgetOptions.other = widget
}

// 위젯 제거
const removeWidget = (widget) => {
  if (confirm('이 위젯을 삭제하시겠습니까?')) {
    const index = dashboardWidgets.value.findIndex(w => w.instanceId === widget.instanceId)
    if (index !== -1) {
      dashboardWidgets.value.splice(index, 1)
      saveDashboard()
    }
  }
}

// 위젯 크기 조절 모달 열기
const resizeWidget = (widget) => {
  resizeModal.widget = widget
  resizeModal.width = widget.gridSize.width
  resizeModal.height = widget.gridSize.height
  resizeModal.show = true
}

// 위젯 크기 조절 모달 닫기
const closeResizeModal = () => {
  resizeModal.show = false
  resizeModal.widget = null
}

// 위젯 크기 조절 적용
const applyResize = () => {
  if (resizeModal.widget) {
    const newSize = { width: resizeModal.width, height: resizeModal.height }
    
    // 새로운 크기로 배치 가능한지 확인
    if (canPlaceWidget(resizeModal.widget.position, newSize, resizeModal.widget)) {
      resizeModal.widget.gridSize = newSize
      saveDashboard()
      closeResizeModal()
    } else {
      alert('해당 크기로 변경할 수 없습니다. 다른 위젯과 겹치거나 그리드 범위를 벗어납니다.')
    }
  }
}

// 위젯 상세보기 모달 열기
const openWidgetModal = (widget) => {
  widgetModal.widget = widget
  widgetModal.additionalInfo = {
    '업데이트 주기': Array.isArray(widget.updateCycle) 
      ? widget.updateCycle.map(c => widgetChar(c)).join(', ')
      : widget.updateCycle,
    '생성 시간': new Date(widget.instanceId).toLocaleString()
  }
  widgetModal.show = true
}

// 위젯 상세보기 모달 닫기
const closeWidgetModal = () => {
  widgetModal.show = false
  widgetModal.widget = null
  widgetModal.additionalInfo = null
}

// 위젯 설정 열기
const openWidgetSettings = () => {
  console.log('위젯 설정 열기:', widgetModal.widget)
  // TODO: 위젯별 설정 모달 구현
  alert('위젯 설정 기능은 추후 구현 예정입니다.')
}

onMounted(() => {
  loadDashboard()
  // 헤더에서 오는 이벤트 리스너 등록
  window.addEventListener('edit-mode-change', handleEditModeChange)
  window.addEventListener('sidebar-toggle', handleSidebarToggle)
  window.addEventListener('save-dashboard', handleSaveDashboard)
  window.addEventListener('confirm-exit-edit-mode', handleConfirmExitEditMode)
})

// onUnmounted() 이전에 위치

onUnmounted(() => {
  // 이벤트 리스너 제거
  window.removeEventListener('edit-mode-change', handleEditModeChange)
  window.removeEventListener('sidebar-toggle', handleSidebarToggle)
  window.removeEventListener('save-dashboard', handleSaveDashboard)
  window.removeEventListener('confirm-exit-edit-mode', handleConfirmExitEditMode)
})

// 위젯 추가
</script>

<style scoped>
@import './DashboardView-styles.css';
</style>
