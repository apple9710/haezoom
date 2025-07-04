<template>
  <div class="energy-report-widget">
    <!-- 위젯 헤더 (편집모드에서만 표시) -->
    <div v-if="isEditMode" class="widget-header">
      <h3 class="widget-title">{{ config.title || '에너지 진단보고서' }}</h3>
      <div class="report-status" :class="reportStatusClass">
        <span class="status-dot"></span>
        <span class="status-text">{{ reportStatusText }}</span>
      </div>
    </div>

    <!-- 보고서 정보 -->
    <div class="report-info">
      <div class="report-date">
        <span class="info-label">보고서 기간:</span>
        <span class="info-value">{{ reportPeriod }}</span>
      </div>
      <div class="report-generated">
        <span class="info-label">생성일:</span>
        <span class="info-value">{{ reportGeneratedDate }}</span>
      </div>
    </div>

    <!-- 주요 지표 -->
    <div class="key-metrics">
      <div class="metric-card energy">
        <div class="metric-icon">⚡</div>
        <div class="metric-content">
          <div class="metric-value">{{ energyEfficiency }}%</div>
          <div class="metric-label">에너지 효율</div>
        </div>
        <div class="metric-trend" :class="energyTrendClass">
          {{ energyTrendIcon }} {{ energyTrendText }}
        </div>
      </div>

      <div class="metric-card savings">
        <div class="metric-icon">💰</div>
        <div class="metric-content">
          <div class="metric-value">{{ costSavings }}만원</div>
          <div class="metric-label">비용 절감</div>
        </div>
        <div class="metric-trend" :class="savingsTrendClass">
          {{ savingsTrendIcon }} {{ savingsTrendText }}
        </div>
      </div>

      <div class="metric-card carbon">
        <div class="metric-icon">🌱</div>
        <div class="metric-content">
          <div class="metric-value">{{ carbonReduction }}톤</div>
          <div class="metric-label">탄소 저감</div>
        </div>
        <div class="metric-trend" :class="carbonTrendClass">
          {{ carbonTrendIcon }} {{ carbonTrendText }}
        </div>
      </div>
    </div>

    <!-- 분석 결과 요약 -->
    <div class="analysis-summary">
      <div class="summary-title">분석 결과 요약</div>
      <div class="summary-items">
        <div 
          v-for="item in analysisSummary"
          :key="item.category"
          class="summary-item"
          :class="`item-${item.status}`"
        >
          <div class="item-icon">{{ item.icon }}</div>
          <div class="item-content">
            <div class="item-title">{{ item.title }}</div>
            <div class="item-description">{{ item.description }}</div>
          </div>
          <div class="item-score" :class="`score-${item.status}`">
            {{ item.score }}점
          </div>
        </div>
      </div>
    </div>

    <!-- 권장사항 -->
    <div class="recommendations">
      <div class="recommendations-title">주요 권장사항</div>
      <div class="recommendations-list">
        <div 
          v-for="(recommendation, index) in recommendations"
          :key="index"
          class="recommendation-item"
          :class="`priority-${recommendation.priority}`"
        >
          <div class="rec-priority">{{ getPriorityIcon(recommendation.priority) }}</div>
          <div class="rec-content">
            <div class="rec-title">{{ recommendation.title }}</div>
            <div class="rec-impact">예상 효과: {{ recommendation.impact }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- PDF 다운로드 -->
    <div class="report-actions">
      <button 
        class="download-btn"
        :disabled="isEditMode || isDownloading"
        @click="downloadReport"
      >
        <span class="btn-icon" :class="{ spinning: isDownloading }">
          {{ isDownloading ? '⏳' : '📄' }}
        </span>
        <span class="btn-text">
          {{ isDownloading ? '다운로드 중...' : '상세 보고서 다운로드' }}
        </span>
      </button>
    </div>

    <!-- 업데이트 시간 -->
    <div class="update-time">
      마지막 업데이트: {{ lastUpdateTime }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  },
  config: {
    type: Object,
    default: () => ({
      title: '에너지 진단보고서',
      reportType: 'monthly',
      dataSource: 'api/energy-report'
    })
  },
  isEditMode: {
    type: Boolean,
    default: false
  }
})

// 반응형 데이터
const reportPeriod = ref('2024년 12월')
const reportGeneratedDate = ref('2024.12.31')
const energyEfficiency = ref(85.2)
const costSavings = ref(247)
const carbonReduction = ref(3.8)
const lastUpdateTime = ref(new Date().toLocaleTimeString())
const isDownloading = ref(false)

// 분석 결과 데이터
const analysisSummary = ref([
  {
    category: 'energy',
    title: '에너지 사용 패턴',
    description: '피크타임 사용량 최적화 필요',
    icon: '⚡',
    score: 85,
    status: 'good'
  },
  {
    category: 'efficiency',
    title: '설비 효율성',
    description: '노후 설비 교체 권장',
    icon: '⚙️',
    score: 72,
    status: 'warning'
  },
  {
    category: 'solar',
    title: '태양광 발전',
    description: '발전량 목표 대비 105% 달성',
    icon: '☀️',
    score: 92,
    status: 'excellent'
  },
  {
    category: 'management',
    title: '에너지 관리',
    description: '자동화 시스템 도입 효과',
    icon: '📊',
    score: 78,
    status: 'good'
  }
])

// 권장사항 데이터
const recommendations = ref([
  {
    priority: 'high',
    title: '노후 에어컨 시스템 교체',
    impact: '월 전력비 15% 절감'
  },
  {
    priority: 'medium',
    title: 'LED 조명 전면 교체',
    impact: '조명 전력 60% 절감'
  },
  {
    priority: 'medium',
    title: '태양광 패널 청소 주기 단축',
    impact: '발전 효율 3% 향상'
  },
  {
    priority: 'low',
    title: '스마트 온도조절기 설치',
    impact: '냉난방비 8% 절감'
  }
])

// 계산된 속성
const reportStatusClass = computed(() => {
  const efficiency = energyEfficiency.value
  if (efficiency >= 90) return 'status-excellent'
  if (efficiency >= 80) return 'status-good'
  if (efficiency >= 70) return 'status-warning'
  return 'status-poor'
})

const reportStatusText = computed(() => {
  const efficiency = energyEfficiency.value
  if (efficiency >= 90) return '우수'
  if (efficiency >= 80) return '양호'
  if (efficiency >= 70) return '보통'
  return '개선필요'
})

const energyTrendClass = computed(() => 'trend-up')
const energyTrendIcon = computed(() => '↗')
const energyTrendText = computed(() => '3.2%')

const savingsTrendClass = computed(() => 'trend-up')
const savingsTrendIcon = computed(() => '↗')
const savingsTrendText = computed(() => '12.8%')

const carbonTrendClass = computed(() => 'trend-up')
const carbonTrendIcon = computed(() => '↗')
const carbonTrendText = computed(() => '5.4%')

// 메서드
const getPriorityIcon = (priority) => {
  switch (priority) {
    case 'high': return '🔴'
    case 'medium': return '🟡'
    case 'low': return '🟢'
    default: return '⚪'
  }
}

const downloadReport = async () => {
  if (isDownloading.value || props.isEditMode) return

  isDownloading.value = true

  try {
    // 실제로는 PDF 생성 API 호출
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // 다운로드 시뮬레이션
    console.log('보고서 다운로드 완료')
    
    // 실제 구현에서는 blob으로 받은 PDF를 다운로드
    // const blob = new Blob([pdfData], { type: 'application/pdf' })
    // const url = URL.createObjectURL(blob)
    // const a = document.createElement('a')
    // a.href = url
    // a.download = `energy-report-${reportPeriod.value}.pdf`
    // a.click()
    // URL.revokeObjectURL(url)
    
  } catch (error) {
    console.error('보고서 다운로드 실패:', error)
  } finally {
    isDownloading.value = false
  }
}

// 라이프사이클
onMounted(() => {
  // 실제로는 API에서 보고서 데이터를 가져옴
  console.log('에너지 진단보고서 위젯 초기화')
})
</script>

<style scoped>
.energy-report-widget {
  background: white;
  border-radius: 12px;
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.widget-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.report-status {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-excellent {
  background: #dcfce7;
  color: #166534;
}

.status-good {
  background: #dbeafe;
  color: #1e40af;
}

.status-warning {
  background: #fef3c7;
  color: #92400e;
}

.status-poor {
  background: #fecaca;
  color: #991b1b;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.report-info {
  background: #f9fafb;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 20px;
}

.report-date,
.report-generated {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.report-generated {
  margin-top: 8px;
}

.info-label {
  color: #6b7280;
}

.info-value {
  font-weight: 600;
  color: #1f2937;
}

.key-metrics {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-bottom: 20px;
}

.metric-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  background: #f9fafb;
  border-left: 4px solid;
}

.metric-card.energy {
  border-left-color: #3b82f6;
}

.metric-card.savings {
  border-left-color: #10b981;
}

.metric-card.carbon {
  border-left-color: #059669;
}

.metric-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.metric-content {
  flex: 1;
}

.metric-value {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 2px;
}

.metric-label {
  font-size: 12px;
  color: #6b7280;
}

.metric-trend {
  font-size: 12px;
  font-weight: 600;
}

.trend-up {
  color: #059669;
}

.trend-down {
  color: #dc2626;
}

.analysis-summary {
  margin-bottom: 20px;
}

.summary-title,
.recommendations-title {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;
}

.summary-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  background: #f9fafb;
}

.item-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.item-content {
  flex: 1;
}

.item-title {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 2px;
}

.item-description {
  font-size: 12px;
  color: #6b7280;
}

.item-score {
  font-size: 14px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 4px;
}

.score-excellent {
  background: #dcfce7;
  color: #166534;
}

.score-good {
  background: #dbeafe;
  color: #1e40af;
}

.score-warning {
  background: #fef3c7;
  color: #92400e;
}

.score-poor {
  background: #fecaca;
  color: #991b1b;
}

.recommendations {
  margin-bottom: 20px;
}

.recommendations-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.recommendation-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  background: #f9fafb;
}

.rec-priority {
  font-size: 16px;
  flex-shrink: 0;
}

.rec-content {
  flex: 1;
}

.rec-title {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.rec-impact {
  font-size: 12px;
  color: #059669;
  font-weight: 500;
}

.report-actions {
  margin-bottom: 12px;
}

.download-btn {
  width: 100%;
  padding: 12px;
  border: 2px solid #3b82f6;
  border-radius: 8px;
  background: #3b82f6;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.download-btn:not(:disabled):hover {
  background: #2563eb;
  border-color: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.download-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-icon {
  font-size: 16px;
  transition: transform 0.3s ease;
}

.btn-icon.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.update-time {
  font-size: 12px;
  color: #9ca3af;
  text-align: center;
  margin-top: auto;
}
</style>
