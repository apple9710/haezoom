<template>
  <div class="image-widget">
    <!-- 위젯 헤더 -->
    <div class="widget-header">
      <h3 class="widget-title">{{ config.title || '이미지' }}</h3>
      <div v-if="config.showStatus" class="widget-status">
        <span class="status-dot" :class="statusClass"></span>
        <span class="status-text">{{ statusText }}</span>
      </div>
    </div>

    <!-- 이미지 표시 영역 -->
    <div class="image-container" :class="{ 'edit-mode': isEditMode }">
      <div v-if="!config.imageUrl" class="image-placeholder">
        <div class="placeholder-icon">🖼️</div>
        <div class="placeholder-text">이미지가 설정되지 않았습니다</div>
      </div>

      <div v-else class="image-display">
        <img 
          :src="config.imageUrl" 
          :alt="config.alt || '이미지'"
          :class="['widget-image', config.imageStyle || 'contain']"
          @error="handleImageError"
          @load="handleImageLoad"
        />
        
        <!-- 이미지 오버레이 정보 -->
        <div v-if="config.showOverlay && !isEditMode" class="image-overlay">
          <div v-if="config.overlayTitle" class="overlay-title">{{ config.overlayTitle }}</div>
          <div v-if="config.overlayDescription" class="overlay-description">{{ config.overlayDescription }}</div>
        </div>
      </div>
    </div>

    <!-- 업데이트 시간 -->
    <div v-if="config.showUpdateTime" class="update-time">
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
      title: '이미지',
      imageUrl: '',
      alt: '이미지',
      imageStyle: 'contain', // contain, cover, fill
      showOverlay: false,
      overlayTitle: '',
      overlayDescription: '',
      showInfo: true,
      showStatus: false,
      showUpdateTime: false,
      imageDescription: ''
    })
  },
  isEditMode: {
    type: Boolean,
    default: false
  }
})

// 반응형 데이터
const imageInfo = ref({ width: 0, height: 0 })
const lastUpdateTime = ref(new Date().toLocaleTimeString())
const imageError = ref(false)

// 상태 계산
const statusClass = computed(() => {
  if (imageError.value) return 'error'
  if (!props.config.imageUrl) return 'warning'
  return 'normal'
})

const statusText = computed(() => {
  if (imageError.value) return '오류'
  if (!props.config.imageUrl) return '미설정'
  return '정상'
})

// 메서드
const handleImageLoad = (event) => {
  imageError.value = false
  const img = event.target
  imageInfo.value = {
    width: img.naturalWidth,
    height: img.naturalHeight
  }
}

const handleImageError = () => {
  imageError.value = true
  imageInfo.value = { width: 0, height: 0 }
}

const updateTimestamp = () => {
  lastUpdateTime.value = new Date().toLocaleTimeString()
}

// 라이프사이클
onMounted(() => {
  updateTimestamp()
})
</script>

<style scoped>
.image-widget {
  /* background: white; */
  border-radius: 12px;
  padding: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0;
  padding: 16px 20px 12px 20px;
  flex-shrink: 0;
}

.widget-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.widget-status {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.status-dot.normal {
  background: #10b981;
}

.status-dot.warning {
  background: #f59e0b;
}

.status-dot.error {
  background: #ef4444;
}

.image-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 0 0 12px 12px;
  overflow: hidden;
  /* background: #f9fafb; */
  min-height: 0;
}

.image-placeholder {
  text-align: center;
  padding: 40px 20px;
  color: #6b7280;
}

.placeholder-icon {
  font-size: 3rem;
  margin-bottom: 12px;
}

.placeholder-text {
  font-size: 14px;
}

.image-display {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.widget-image {
  width: 100%;
  height: 100%;
  border-radius: 0;
}

.widget-image.contain {
  object-fit: cover;
}

.widget-image.cover {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.widget-image.fill {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: white;
  padding: 20px;
}

.overlay-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

.overlay-description {
  font-size: 14px;
  opacity: 0.9;
}

.update-time {
  font-size: 12px;
  color: #9ca3af;
  text-align: center;
  margin-top: auto;
  padding: 8px 20px 16px 20px;
  flex-shrink: 0;
}
</style>
