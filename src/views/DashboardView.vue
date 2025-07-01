<template>
  <div class="dashboard-container">
    <div class="dashboard-content">
      <aside class="widget-sidebar">
        <h3 class="sidebar-title">위젯 추가</h3>
        <div class="widget-categories">
          <div class="category-section">
            <h4 class="category-title">차트 위젯</h4>
            <div class="widget-list">
              <div 
                v-for="widget in chartWidgets" 
                :key="widget.id"
                class="widget-item"
                @click="addWidget(widget)"
              >
                <span class="widget-icon">{{ widget.icon }}</span>
                <span class="widget-name">{{ widget.name }}</span>
              </div>
            </div>
          </div>

          <div class="category-section">
            <h4 class="category-title">제어 위젯</h4>
            <div class="widget-list">
              <div 
                v-for="widget in controlWidgets" 
                :key="widget.id"
                class="widget-item"
                @click="addWidget(widget)"
              >
                <span class="widget-icon">{{ widget.icon }}</span>
                <span class="widget-name">{{ widget.name }}</span>
              </div>
            </div>
          </div>

          <div class="category-section">
            <h4 class="category-title">기타 위젯</h4>
            <div class="widget-list">
              <div 
                v-for="widget in otherWidgets" 
                :key="widget.id"
                class="widget-item"
                @click="addWidget(widget)"
              >
                <span class="widget-icon">{{ widget.icon }}</span>
                <span class="widget-name">{{ widget.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main class="dashboard-main">
        <div class="dashboard-toolbar">
          <div class="toolbar-left">
            <h2 class="dashboard-title">에너지 모니터링 대시보드</h2>
          </div>
          <div class="toolbar-right">
            <button @click="clearDashboard" class="clear-btn">
              모든 위젯 삭제
            </button>
            <button @click="saveDashboard" class="save-btn">
              대시보드 저장
            </button>
          </div>
        </div>

        <div 
          ref="dashboardGrid"
          class="dashboard-grid"
          :class="{ 'empty': dashboardWidgets.length === 0 }"
        >
          <div v-if="dashboardWidgets.length === 0" class="empty-state">
            <div class="empty-icon">📊</div>
            <h3 class="empty-title">대시보드가 비어있습니다</h3>
            <p class="empty-description">
              왼쪽 사이드바에서 위젯을 선택하여 대시보드에 추가해보세요.
            </p>
          </div>

          <div class="widget-grid">
            <div 
              v-for="element in dashboardWidgets"
              :key="element.instanceId"
              class="widget-container"
              :style="{ 
                gridColumn: `span ${element.gridSize.width}`,
                gridRow: `span ${element.gridSize.height}`
              }"
            >
              <div class="widget-header">
                <span class="widget-title">{{ element.name }}</span>
                <div class="widget-controls">
                  <button @click="resizeWidget(element)" class="control-btn" title="크기 조절">
                    ⛶
                  </button>
                  <button @click="removeWidget(element)" class="control-btn remove" title="삭제">
                    ✕
                  </button>
                </div>
              </div>
              
              <div class="widget-content">
                <div style="text-align: center; color: var(--color-font-secondary);">
                  {{ element.name }} 위젯<br>
                  <small>(위젯 내용이 여기에 표시됩니다)</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
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
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
// import { VueDraggableNext as draggable } from 'vue-draggable-next' // 임시로 비활성화

// 위젯 정의
const chartWidgets = ref([
  { id: 'line-chart', name: '선 시계열 그래프', icon: '📈', type: 'line-chart' },
  { id: 'bar-chart', name: '막대 시계열 그래프', icon: '📊', type: 'bar-chart' },
  { id: 'pie-chart', name: '원 그래프', icon: '🍰', type: 'pie-chart' }
])

const controlWidgets = ref([
  { id: 'on-off-control', name: '제어(ON/OFF)', icon: '🔘', type: 'on-off-control' },
  { id: 'up-down-control', name: '제어(UP/DOWN)', icon: '🔼', type: 'up-down-control' },
  { id: 'bar-widget', name: '막대(%, 온도 등)', icon: '📏', type: 'bar-widget' }
])

const otherWidgets = ref([
  { id: 'box-widget', name: '박스 위젯', icon: '📦', type: 'box-widget' },
  { id: 'page-link', name: '페이지 링크', icon: '🔗', type: 'page-link' },
  { id: 'energy-report', name: '에너지 진단보고서', icon: '📋', type: 'energy-report' },
  { id: 'alarm-widget', name: '알람 위젯', icon: '🚨', type: 'alarm-widget' },
  { id: 'image-widget', name: '그림삽입 위젯', icon: '🖼️', type: 'image-widget' },
  { id: 'status-widget', name: '상태표시 위젯', icon: '🟢', type: 'status-widget' }
])

// 대시보드 상태
const dashboardWidgets = ref([])
const dashboardGrid = ref(null)

// 크기 조절 모달
const resizeModal = reactive({
  show: false,
  widget: null,
  width: 2,
  height: 2
})

// 위젯 추가
const addWidget = (widget) => {
  const newWidget = {
    ...widget,
    instanceId: Date.now() + Math.random(),
    gridSize: { width: 2, height: 2 },
    data: {},
    config: {}
  }
  dashboardWidgets.value.push(newWidget)
}

// 위젯 제거
const removeWidget = (widget) => {
  const index = dashboardWidgets.value.findIndex(w => w.instanceId === widget.instanceId)
  if (index > -1) {
    dashboardWidgets.value.splice(index, 1)
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

// 드래그 끝났을 때
// const onDragEnd = () => {
//   console.log('Widget order changed')
// }

// 대시보드 저장
const saveDashboard = () => {
  localStorage.setItem('dashboard-config', JSON.stringify(dashboardWidgets.value))
  alert('대시보드가 저장되었습니다.')
}

// 대시보드 불러오기
const loadDashboard = () => {
  const saved = localStorage.getItem('dashboard-config')
  if (saved) {
    dashboardWidgets.value = JSON.parse(saved)
  }
}

// 대시보드 초기화
const clearDashboard = () => {
  if (confirm('모든 위젯을 삭제하시겠습니까?')) {
    dashboardWidgets.value = []
  }
}

onMounted(() => {
  loadDashboard()
})
</script>

<style scoped>
.dashboard-container {
  min-height: calc(100vh - 90px);
  width: 100vw;
  background: var(--color-bg-gray);
  display: flex;
  flex-direction: column;
  margin: 0;
  margin-top:90px;
  padding: 0;
  box-sizing: border-box;
}

.dashboard-content {
  flex: 1;
  display: flex;
  width: 100%;
  height: calc(100vh - 90px);
}

.widget-sidebar {
  width: 320px;
  background: var(--color-bg-white);
  border-right: 1px solid var(--color-gray-lightest);
  padding: 32px 24px;
  overflow-y: auto;
  box-sizing: border-box;
}

.sidebar-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-font-primary);
  margin: 0 0 32px 0;
}

.category-section {
  margin-bottom: 40px;
}

.category-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-font-secondary);
  margin: 0 0 16px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.widget-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.widget-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 2px solid var(--color-gray-lightest);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: var(--color-bg-white);
}

.widget-item:hover {
  background: var(--color-primary-lightest);
  border-color: var(--color-primary);
  transform: translateY(-2px);
}

.widget-icon {
  font-size: 24px;
}

.widget-name {
  font-size: 16px;
  font-weight: 500;
  color: var(--color-font-primary);
}

.dashboard-main {
  flex: 1;
  padding: 32px 24px;
  overflow-y: auto;
  box-sizing: border-box;
}

.dashboard-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.dashboard-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-font-primary);
  margin: 0;
}

.toolbar-right {
  display: flex;
  gap: 16px;
}

.clear-btn, .save-btn {
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.clear-btn {
  background: var(--color-primary-lightest);
  color: var(--color-primary);
  border: 2px solid var(--color-primary-light);
}

.clear-btn:hover {
  background: var(--color-primary-light);
  color: var(--color-font-white);
}

.save-btn {
  background: var(--color-primary);
  color: var(--color-font-white);
}

.save-btn:hover {
  background: var(--color-primary-light);
  transform: translateY(-1px);
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  min-height: 500px;
}

.dashboard-grid.empty {
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-state {
  text-align: center;
  color: var(--color-font-secondary);
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 24px;
}

.empty-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: var(--color-font-primary);
}

.empty-description {
  font-size: 18px;
  margin: 0;
  line-height: 1.5;
}

.widget-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  width: 100%;
}

.widget-container {
  background: var(--color-bg-white);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.2s ease;
  border: 1px solid var(--color-gray-lightest);
}

.widget-container:hover {
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
  transform: translateY(-4px);
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: var(--color-bg-light);
  border-bottom: 1px solid var(--color-gray-lightest);
}

.widget-title {
  font-weight: 600;
  color: var(--color-font-primary);
  font-size: 16px;
}

.widget-controls {
  display: flex;
  gap: 8px;
}

.control-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: all 0.2s ease;
  color: var(--color-font-secondary);
}

.control-btn:hover {
  background: var(--color-gray-lightest);
  color: var(--color-font-primary);
}

.control-btn.remove:hover {
  background: var(--color-primary-lightest);
  color: var(--color-primary);
}

.widget-content {
  padding: 24px;
  height: calc(100% - 77px);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-font-secondary);
  font-size: 16px;
  min-height: 150px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: var(--color-bg-white);
  border-radius: 16px;
  padding: 32px;
  width: 100%;
  max-width: 500px;
  margin: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.modal-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-font-primary);
  margin: 0 0 32px 0;
}

.size-controls {
  margin-bottom: 32px;
}

.size-control {
  margin-bottom: 20px;
}

.size-control label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: var(--color-font-primary);
  font-size: 16px;
}

.size-control select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid var(--color-gray-light);
  border-radius: 8px;
  font-size: 16px;
  background: var(--color-bg-white);
  color: var(--color-font-primary);
}

.size-control select:focus {
  outline: none;
  border-color: var(--color-primary);
}

.modal-actions {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
}

.cancel-btn, .apply-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.cancel-btn {
  background: var(--color-gray-light);
  color: var(--color-font-primary);
}

.apply-btn {
  background: var(--color-primary);
  color: var(--color-font-white);
}

.cancel-btn:hover {
  background: var(--color-gray);
}

.apply-btn:hover {
  background: var(--color-primary-light);
  transform: translateY(-1px);
}

@media (max-width: 1024px) {
  .widget-sidebar {
    width: 280px;
  }
  
  .widget-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .dashboard-content {
    flex-direction: column;
    height: auto;
  }
  
  .widget-sidebar {
    width: 100%;
    max-height: 300px;
    padding: 24px 20px;
  }
  
  .dashboard-main {
    padding: 24px 20px;
  }
  
  .widget-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  
  .dashboard-toolbar {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .toolbar-right {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .widget-grid {
    grid-template-columns: 1fr;
  }
  
  .modal-content {
    padding: 24px;
    margin: 16px;
  }
}
</style>