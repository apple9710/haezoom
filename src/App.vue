<template>
  <div id="app">
    <header class="app-header">
      <h1>HaeZoom - 에너지 모니터링 대시보드</h1>
      <div class="header-controls">
        <button @click="addWidget" class="add-btn">
          + 위젯 추가
        </button>
      </div>
    </header>

    <main class="dashboard">
      <div class="widget-grid">
        <!-- 전력 사용량 위젯 -->
        <div class="widget-container large">
          <PowerUsageWidget 
            :config="{
              title: '전력 사용량 모니터링',
              unit: '[kWh]',
              defaultChartType: 'line',
              dataSource: 'api/power-usage'
            }"
          />
        </div>

        <!-- 임시 위젯들 -->
        <div class="widget-container medium">
          <div class="placeholder-widget">
            <h3>박스 위젯</h3>
            <p>숫자 표시 위젯</p>
          </div>
        </div>

        <div class="widget-container medium">
          <div class="placeholder-widget">
            <h3>제어 위젯</h3>
            <p>ON/OFF 제어</p>
          </div>
        </div>

        <div class="widget-container small">
          <div class="placeholder-widget">
            <h3>상태 위젯</h3>
            <p>상태 표시</p>
          </div>
        </div>

        <div class="widget-container small">
          <div class="placeholder-widget">
            <h3>알람 위젯</h3>
            <p>알림 표시</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import PowerUsageWidget from './components/widgets/PowerUsageWidget.vue'

const addWidget = () => {
  console.log('위젯 추가 기능 - 추후 구현')
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #f5f5f5;
  color: #333;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.app-header h1 {
  font-size: 28px;
  font-weight: 600;
}

.header-controls {
  display: flex;
  gap: 12px;
}

.add-btn {
  padding: 8px 16px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.dashboard {
  flex: 1;
  padding: 20px;
  background-color: #f5f5f5;
}

.widget-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.widget-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.widget-container:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.widget-container.large {
  grid-column: span 2;
  min-height: 500px;
}

.widget-container.medium {
  min-height: 350px;
}

.widget-container.small {
  min-height: 250px;
}

.placeholder-widget {
  padding: 30px;
  text-align: center;
  color: #6b7280;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.placeholder-widget h3 {
  font-size: 18px;
  margin-bottom: 10px;
  color: #374151;
}

.placeholder-widget p {
  font-size: 14px;
}

/* 반응형 */
@media (max-width: 768px) {
  .widget-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .widget-container.large {
    grid-column: span 1;
  }
  
  .dashboard {
    padding: 15px;
  }
  
  .app-header h1 {
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .app-header {
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }
}
</style>