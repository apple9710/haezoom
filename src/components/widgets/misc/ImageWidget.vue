<template>
  <div class="image-widget">
    <!-- 위젯 헤더 (편집모드에서만 표시) -->
    <div v-if="isEditMode" class="widget-header">
      <h3 class="widget-title">{{ config.title || '이미지' }}</h3>
      <div v-if="config.showStatus" class="widget-status">
        <span class="status-dot" :class="statusClass"></span>
        <span class="status-text">{{ statusText }}</span>
      </div>
    </div>

    <!-- 이미지 표시 영역 -->
    <div class="image-container" :class="{ 'edit-mode': isEditMode }">
      <div v-if="!config.imageUrl && isEditMode" class="image-placeholder" @click="openImageSelector">
        <div class="placeholder-icon">🖼️</div>
        <div class="placeholder-text">이미지를 선택해주세요</div>
        <button class="select-btn">이미지 선택</button>
      </div>
      
      <div v-else-if="!config.imageUrl" class="image-placeholder">
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

        <!-- 편집 모드에서 이미지 변경 버튼 -->
        <div v-if="isEditMode" class="image-edit-overlay">
          <button @click="openImageSelector" class="edit-btn">이미지 변경</button>
        </div>
      </div>
    </div>

    <!-- 이미지 정보 -->
    <div v-if="config.showInfo && config.imageUrl" class="image-info">
      <div class="info-item">
        <span class="info-label">크기:</span>
        <span class="info-value">{{ imageInfo.width }} × {{ imageInfo.height }}</span>
      </div>
      <div v-if="config.imageDescription" class="info-item">
        <span class="info-label">설명:</span>
        <span class="info-value">{{ config.imageDescription }}</span>
      </div>
    </div>

    <!-- 업데이트 시간 -->
    <div v-if="config.showUpdateTime" class="update-time">
      마지막 업데이트: {{ lastUpdateTime }}
    </div>

    <!-- 이미지 선택 모달 (편집 모드) -->
    <div v-if="showImageSelector" class="modal-overlay" @click="closeImageSelector">
      <div class="modal-content" @click.stop>
        <h4>이미지 선택</h4>
        <div class="image-options">
          <div class="option-section">
            <h5>URL로 이미지 추가</h5>
            <input 
              v-model="newImageUrl" 
              type="url" 
              placeholder="https://example.com/image.jpg"
              class="image-url-input"
            />
            <button @click="setImageFromUrl" class="apply-btn">적용</button>
          </div>
          
          <div class="option-section">
            <h5>샘플 이미지</h5>
            <div class="sample-images">
              <div 
                v-for="sample in sampleImages" 
                :key="sample.id"
                @click="setImageFromSample(sample)"
                class="sample-image"
              >
                <img :src="sample.url" :alt="sample.name" />
                <span>{{ sample.name }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-actions">
          <button @click="closeImageSelector" class="cancel-btn">취소</button>
        </div>
      </div>
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
const showImageSelector = ref(false)
const newImageUrl = ref('')
const imageError = ref(false)

// 샘플 이미지 데이터
const sampleImages = ref([
  {
    id: 1,
    name: '태양광 패널',
    url: '/images/solar-panel.jpg'
  },
  {
    id: 2,
    name: '에너지 모니터',
    url: '/images/energy-monitor.jpg'
  },
  {
    id: 3,
    name: '제어 패널',
    url: '/images/control-panel.jpg'
  },
  {
    id: 4,
    name: '데이터 센터',
    url: '/images/datacenter.jpg'
  }
])

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
const openImageSelector = () => {
  if (props.isEditMode) {
    showImageSelector.value = true
    newImageUrl.value = props.config.imageUrl || ''
  }
}

const closeImageSelector = () => {
  showImageSelector.value = false
  newImageUrl.value = ''
}

const setImageFromUrl = () => {
  if (newImageUrl.value.trim()) {
    // 실제로는 config 업데이트 이벤트를 emit해야 함
    // props.config.imageUrl = newImageUrl.value.trim()
    console.log('이미지 URL 설정:', newImageUrl.value.trim())
    closeImageSelector()
    updateTimestamp()
  }
}

const setImageFromSample = (sample) => {
  // 실제로는 config 업데이트 이벤트를 emit해야 함
  // props.config.imageUrl = sample.url
  // props.config.imageDescription = sample.name
  console.log('샘플 이미지 설정:', sample.name, sample.url)
  closeImageSelector()
  updateTimestamp()
}

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
  margin-bottom: 16px;
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
  border-radius: 8px;
  overflow: hidden;
  background: #f9fafb;
  min-height: 200px;
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
  margin-bottom: 16px;
}

.select-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.select-btn:hover {
  background: #2563eb;
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
  max-width: 100%;
  max-height: 100%;
  border-radius: 4px;
}

.widget-image.contain {
  object-fit: contain;
}

.widget-image.cover {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.widget-image.fill {
  object-fit: fill;
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

.image-edit-overlay {
  position: absolute;
  top: 8px;
  right: 8px;
}

.edit-btn {
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.edit-btn:hover {
  background: rgba(0, 0, 0, 0.8);
}

.image-info {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.info-label {
  color: #6b7280;
}

.info-value {
  color: #1f2937;
  font-weight: 500;
}

.update-time {
  font-size: 12px;
  color: #9ca3af;
  text-align: center;
  margin-top: auto;
  padding-top: 12px;
}

/* 모달 스타일 */
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
  background: white;
  border-radius: 12px;
  padding: 24px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-content h4 {
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: 600;
}

.option-section {
  margin-bottom: 24px;
}

.option-section h5 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.image-url-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  margin-bottom: 12px;
}

.apply-btn {
  background: #10b981;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.apply-btn:hover {
  background: #059669;
}

.sample-images {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 12px;
}

.sample-image {
  text-align: center;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.sample-image:hover {
  background: #f3f4f6;
}

.sample-image img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 4px;
}

.sample-image span {
  display: block;
  font-size: 12px;
  color: #6b7280;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.cancel-btn {
  background: #6b7280;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.cancel-btn:hover {
  background: #4b5563;
}
</style>
