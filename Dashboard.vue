<template>
  <div class="dashboard-container">
    <!-- 상단 툴바 -->
    <div class="dashboard-toolbar">
      <div class="toolbar-left">
        <h1 class="dashboard-title">에너지 대시보드</h1>
      </div>
      <div class="toolbar-right">
        <button 
          class="edit-toggle-btn"
          :class="{ active: isEditMode }"
          @click="toggleEditMode"
        >
          <span class="btn-icon">{{ isEditMode ? '✓' : '✏️' }}</span>
          {{ isEditMode ? '편집 완료' : '편집' }}
        </button>
        <button 
          v-if="isEditMode"
          class="add-widget-btn"
          @click="showWidgetSelector = true"
        >
          <span class="btn-icon">+</span>
          위젯 추가
        </button>
      </div>
    </div>

    <!-- 대시보드 메인 영역 -->
    <div 
      class="dashboard-main"
      :class="{ 'edit-mode': isEditMode }"
      ref="dashboardMain"
    >
      <!-- 위젯들 -->
      <ResizableWidget
        v-for="widget in widgets"
        :key="widget.id"
        :widget-id="widget.id"
        :is-edit-mode="isEditMode"
        :initial-width="widget.width"
        :initial-height="widget.height"
        :min-width="widget.minWidth"
        :min-height="widget.minHeight"
        :max-width="widget.maxWidth"
        :max-height="widget.maxHeight"
        @resize="onWidgetResize"
        @move="onWidgetMove"
      >
        <!-- 위젯 타입에 따른 내용 렌더링 -->
        <component 
          :is="getWidgetComponent(widget.type)"
          :widget-data="widget"
          :is-edit-mode="isEditMode"
        />
        
        <!-- 편집 모드에서 삭제 버튼 -->
        <button 
          v-if="isEditMode"
          class="delete-widget-btn"
          @click="deleteWidget(widget.id)"
        >
          ×
        </button>
      </ResizableWidget>

      <!-- 편집 모드 안내 -->
      <div v-if="isEditMode && widgets.length === 0" class="edit-guide">
        <div class="guide-content">
          <div class="guide-icon">📊</div>
          <h3>위젯을 추가해보세요</h3>
          <p>상단의 "위젯 추가" 버튼을 클릭하여<br>원하는 위젯을 대시보드에 추가할 수 있습니다.</p>
        </div>
      </div>
    </div>

    <!-- 위젯 선택 모달 -->
    <div v-if="showWidgetSelector" class="widget-selector-overlay" @click="closeWidgetSelector">
      <div class="widget-selector-modal" @click.stop>
        <div class="modal-header">
          <h2>위젯 선택</h2>
          <button class="close-btn" @click="closeWidgetSelector">×</button>
        </div>
        <div class="modal-content">
          <div class="widget-categories">
            <button 
              v-for="category in widgetCategories"
              :key="category.id"
              class="category-btn"
              :class="{ active: selectedCategory === category.id }"
              @click="selectedCategory = category.id"
            >
              <span class="category-icon">{{ category.icon }}</span>
              {{ category.name }}
            </button>
          </div>
          <div class="widget-grid">
            <div 
              v-for="widgetType in filteredWidgetTypes"
              :key="widgetType.id"
              class="widget-card"
              @click="addWidget(widgetType)"
            >
              <div class="widget-preview">
                <span class="widget-icon">{{ widgetType.icon }}</span>
              </div>
              <div class="widget-info">
                <h4>{{ widgetType.name }}</h4>
                <p>{{ widgetType.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, nextTick } from 'vue'
import ResizableWidget from './ResizableWidget.vue'

export default {
  name: 'Dashboard',
  components: {
    ResizableWidget
  },
  setup() {
    const dashboardMain = ref(null)
    const isEditMode = ref(false)
    const showWidgetSelector = ref(false)
    const selectedCategory = ref('chart')
    const widgets = ref([])

    // 위젯 카테고리 정의
    const widgetCategories = ref([
      { id: 'chart', name: '차트', icon: '📊' },
      { id: 'control', name: '제어', icon: '🎛️' },
      { id: 'display', name: '표시', icon: '💡' },
      { id: 'utility', name: '유틸리티', icon: '🔧' }
    ])

    // 위젯 타입 정의
    const widgetTypes = ref([
      // 차트 카테고리
      {
        id: 'line-chart',
        name: '선 시계열 그래프',
        description: '시간에 따른 데이터 변화를 선으로 표시',
        icon: '📈',
        category: 'chart',
        component: 'LineChartWidget',
        defaultWidth: 400,
        defaultHeight: 300,
        minWidth: 300,
        minHeight: 200
      },
      {
        id: 'bar-chart',
        name: '막대 시계열 그래프',
        description: '시간에 따른 데이터를 막대로 표시',
        icon: '📊',
        category: 'chart',
        component: 'BarChartWidget',
        defaultWidth: 400,
        defaultHeight: 300,
        minWidth: 300,
        minHeight: 200
      },
      {
        id: 'pie-chart',
        name: '원 그래프',
        description: '비율을 원형으로 표시',
        icon: '🥧',
        category: 'chart',
        component: 'PieChartWidget',
        defaultWidth: 300,
        defaultHeight: 300,
        minWidth: 250,
        minHeight: 250
      },
      // 표시 카테고리
      {
        id: 'box-widget',
        name: '박스 위젯',
        description: '값과 단위를 표시하는 박스',
        icon: '📦',
        category: 'display',
        component: 'BoxWidget',
        defaultWidth: 200,
        defaultHeight: 150,
        minWidth: 150,
        minHeight: 100
      },
      {
        id: 'progress-bar',
        name: '막대 위젯',
        description: '온도, 습도 등을 막대로 표시',
        icon: '📏',
        category: 'display',
        component: 'ProgressBarWidget',
        defaultWidth: 250,
        defaultHeight: 120,
        minWidth: 200,
        minHeight: 100
      },
      {
        id: 'status-indicator',
        name: '상태표시 위젯',
        description: '현재 상태를 색으로 표시',
        icon: '🚥',
        category: 'display',
        component: 'StatusIndicatorWidget',
        defaultWidth: 150,
        defaultHeight: 150,
        minWidth: 100,
        minHeight: 100
      },
      // 제어 카테고리
      {
        id: 'on-off-control',
        name: 'ON/OFF 제어',
        description: '설비 ON/OFF 제어',
        icon: '🔘',
        category: 'control',
        component: 'OnOffControlWidget',
        defaultWidth: 200,
        defaultHeight: 120,
        minWidth: 150,
        minHeight: 100
      },
      {
        id: 'up-down-control',
        name: 'UP/DOWN 제어',
        description: '온도, 압력 등 수치 제어',
        icon: '🔼',
        category: 'control',
        component: 'UpDownControlWidget',
        defaultWidth: 200,
        defaultHeight: 150,
        minWidth: 150,
        minHeight: 120
      },
      // 유틸리티 카테고리
      {
        id: 'page-link',
        name: '페이지 링크',
        description: 'URL 링크 버튼',
        icon: '🔗',
        category: 'utility',
        component: 'PageLinkWidget',
        defaultWidth: 200,
        defaultHeight: 100,
        minWidth: 150,
        minHeight: 80
      },
      {
        id: 'image-widget',
        name: '그림 삽입',
        description: '이미지를 표시',
        icon: '🖼️',
        category: 'utility',
        component: 'ImageWidget',
        defaultWidth: 300,
        defaultHeight: 200,
        minWidth: 200,
        minHeight: 150
      },
      {
        id: 'alarm-widget',
        name: '알람 위젯',
        description: '알람 및 경고 표시',
        icon: '🚨',
        category: 'utility',
        component: 'AlarmWidget',
        defaultWidth: 250,
        defaultHeight: 180,
        minWidth: 200,
        minHeight: 150
      }
    ])

    // 선택된 카테고리에 따른 위젯 필터링
    const filteredWidgetTypes = computed(() => {
      return widgetTypes.value.filter(widget => widget.category === selectedCategory.value)
    })

    // 편집 모드 토글
    const toggleEditMode = () => {
      isEditMode.value = !isEditMode.value
      if (!isEditMode.value) {
        saveWidgetPositions()
      }
    }

    // 위젯 추가
    const addWidget = (widgetType) => {
      const newWidget = {
        id: `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: widgetType.id,
        name: widgetType.name,
        width: widgetType.defaultWidth,
        height: widgetType.defaultHeight,
        minWidth: widgetType.minWidth,
        minHeight: widgetType.minHeight,
        maxWidth: widgetType.maxWidth || 800,
        maxHeight: widgetType.maxHeight || 600,
        x: Math.random() * 100,
        y: Math.random() * 100,
        data: getDefaultWidgetData(widgetType.id)
      }
      
      widgets.value.push(newWidget)
      closeWidgetSelector()
    }

    // 위젯 삭제
    const deleteWidget = (widgetId) => {
      const index = widgets.value.findIndex(w => w.id === widgetId)
      if (index > -1) {
        widgets.value.splice(index, 1)
      }
    }

    // 위젯 크기 변경 처리
    const onWidgetResize = (resizeData) => {
      const widget = widgets.value.find(w => w.id === resizeData.id)
      if (widget) {
        widget.width = resizeData.width
        widget.height = resizeData.height
        widget.x = resizeData.x
        widget.y = resizeData.y
      }
    }

    // 위젯 이동 처리
    const onWidgetMove = (moveData) => {
      const widget = widgets.value.find(w => w.id === moveData.id)
      if (widget) {
        widget.x = moveData.x
        widget.y = moveData.y
      }
    }

    // 위젯 선택기 닫기
    const closeWidgetSelector = () => {
      showWidgetSelector.value = false
    }

    // 위젯 컴포넌트 가져오기
    const getWidgetComponent = (widgetType) => {
      // 실제 구현에서는 동적 import를 사용하거나 컴포넌트 매핑을 할 수 있습니다
      return 'div' // 임시로 div 반환
    }

    // 기본 위젯 데이터 생성
    const getDefaultWidgetData = (widgetType) => {
      const defaultData = {
        'line-chart': {
          title: '전력 사용량',
          unit: 'kWh',
          datasets: []
        },
        'bar-chart': {
          title: '일별 전력 사용량',
          unit: 'kWh',
          datasets: []
        },
        'pie-chart': {
          title: '전력 사용 비율',
          datasets: []
        },
        'box-widget': {
          label: '현재 전력량',
          value: 1250.5,
          unit: 'kWh',
          alignment: 'center'
        },
        'progress-bar': {
          label: '온도',
          value: 22,
          unit: '°C',
          min: 0,
          max: 50
        },
        'status-indicator': {
          label: '시스템 상태',
          status: 'normal',
          color: '#4CAF50'
        },
        'on-off-control': {
          label: '조명 제어',
          status: false
        },
        'up-down-control': {
          label: '온도 설정',
          value: 22,
          unit: '°C',
          min: 16,
          max: 30
        },
        'page-link': {
          label: '에너지 보고서',
          url: 'https://example.com'
        },
        'image-widget': {
          src: '',
          alt: '이미지'
        },
        'alarm-widget': {
          alarms: []
        }
      }
      
      return defaultData[widgetType] || {}
    }

    // 위젯 위치 저장
    const saveWidgetPositions = () => {
      // 실제 구현에서는 서버나 로컬 스토리지에 저장
      localStorage.setItem('dashboard-widgets', JSON.stringify(widgets.value))
      console.log('위젯 위치가 저장되었습니다.')
    }

    // 위젯 위치 불러오기
    const loadWidgetPositions = () => {
      try {
        const savedWidgets = localStorage.getItem('dashboard-widgets')
        if (savedWidgets) {
          widgets.value = JSON.parse(savedWidgets)
        }
      } catch (error) {
        console.error('위젯 데이터 불러오기 실패:', error)
      }
    }

    onMounted(() => {
      loadWidgetPositions()
    })

    return {
      dashboardMain,
      isEditMode,
      showWidgetSelector,
      selectedCategory,
      widgets,
      widgetCategories,
      filteredWidgetTypes,
      toggleEditMode,
      addWidget,
      deleteWidget,
      onWidgetResize,
      onWidgetMove,
      closeWidgetSelector,
      getWidgetComponent
    }
  }
}
</script>