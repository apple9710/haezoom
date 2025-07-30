<template>
  <div class="page-link-widget">
    <!-- 위젯 헤더 -->
    <div class="widget-header">
      <h3 class="widget-title">{{ config.title || '페이지 링크' }}</h3>
    </div>

    <!-- 메인 링크 버튼 -->
    <div class="main-link">
      <a 
        :href="config.url"
        target="_blank"
        rel="noopener noreferrer"
        class="link-button"
        :class="{ disabled: !isLinkValid || isEditMode }"
        @click="handleLinkClick"
      >
        <span class="link-icon"></span>
        <span class="link-text">{{ config.buttonText || '이동' }}</span>
        <span class="external-icon">↗</span>
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  },
  config: {
    type: Object,
    default: () => ({
      title: '페이지 링크',
      url: 'https://example.com',
      buttonText: '페이지로 이동',
      showQrCode: false,
      showStats: false,
      showHistory: false,
      checkInterval: 300000 // 5분
    })
  },
  isEditMode: {
    type: Boolean,
    default: false
  }
})

// 반응형 데이터
const isLinkValid = ref(true)

let checkInterval = null

// 메서드
const checkLinkStatus = async () => {
  try {
    // 실제로는 HEAD 요청이나 ping을 통해 확인
    console.log('링크 상태 확인:', props.config.url)
    
    // 95% 확률로 성공
    isLinkValid.value = Math.random() > 0.05
    
  } catch (error) {
    console.error('링크 상태 확인 실패:', error)
    isLinkValid.value = false
  }
}

const handleLinkClick = (event) => {
  if (props.isEditMode || !isLinkValid.value) {
    event.preventDefault()
    return
  }
}

// 라이프사이클
onMounted(() => {
  // 초기 링크 상태 확인
  checkLinkStatus()
  
  // 주기적 상태 확인
  if (props.config.checkInterval && props.config.checkInterval > 0) {
    checkInterval = setInterval(() => {
      if (!props.isEditMode) {
        checkLinkStatus()
      }
    }, props.config.checkInterval)
  }
})

onUnmounted(() => {
  if (checkInterval) {
    clearInterval(checkInterval)
  }
})
</script>

<style scoped>
.page-link-widget {
  container-name: pagelink-control-container;
  container-type: size;
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

.main-link{
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.link-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 16px;
  background: var(--color-primary);
  color: white;
  text-decoration: none;
  border-radius: 99px;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.link-button:not(.disabled):hover {
  background: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(235, 133, 75, 0.3);
}

.link-button.disabled {
  background: #9ca3af;
  cursor: not-allowed;
  transform: none;
}

.link-icon {
  font-size: 18px;
}

.external-icon {
  font-size: 14px;
}

@container pagelink-control-container (max-width: 300px) {
  .widget-title{
    font-size: 14px;
  }
}
@container pagelink-control-container (max-height: 640px) {

}
@container pagelink-control-container (max-height: 311px) {
  .page-link-widget{

  }
}
</style>
