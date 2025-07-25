<template>
  <div class="building-selector">
   
    <!-- 검색 영역 -->
    <div class="search-section">
      <div class="search-box">
        <input 
          v-model="searchQuery" 
          placeholder="실증지 검색"
          class="search-input"
        />
        <button class="search-btn">
          <img src="@/assets/images/search.png" alt="검색" class="search-icon" />
        </button>
      </div>
    </div>

    <!-- 실증지 그리드 -->
    <div class="buildings-grid">
      <div 
        v-for="building in filteredBuildings" 
        :key="building.id"
        class="building-card"
        @click="selectBuilding(building)"
      >
        <div class="building-image">
          <img :src="getImagePath(building.id)" :alt="building.name" />
        </div>
        
        <div class="building-info">
          <h3>{{ building.name }}</h3>
          <div class="building-details">
            <div class="detail-item">
              <img src="@/assets/images/call_icon.png" alt="전화" class="detail-icon" />
              {{ building.phone }}
            </div>
            <div class="detail-item">
              <img src="@/assets/images/location_icon.png" alt="위치" class="detail-icon" />
              {{ building.address }}
            </div>
            <div class="detail-item">
              <img src="@/assets/images/info_icon.png" alt="정보" class="detail-icon" />
              {{ building.description }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 페이지네이션 -->
    <BasePagination
      :current-page="currentPage"
      :total-items="totalItems"
      :items-per-page="itemsPerPage"
      @page-change="handlePageChange"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import BasePagination from '@/components/common/BasePagination.vue'
// 이미지 import (Vite 빌드 시 자동으로 최적화됨)
import testImage from '@/assets/images/testimg.png'

const emit = defineEmits(['building-selected'])

// 반응형 데이터
const buildings = ref([])
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(6)

// 계산된 속성
const filteredBuildings = computed(() => {
  if (!searchQuery.value) return buildings.value
  return buildings.value.filter(building => 
    building.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    building.address.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const totalItems = computed(() => filteredBuildings.value.length)

// 메서드
const selectBuilding = (building) => {
  emit('building-selected', building)
}

const handlePageChange = (page) => {
  currentPage.value = page
}

const getImagePath = (buildingId) => {
  // import된 이미지 사용 (개발/배포 환경 모두 지원)
  return testImage
}

// 생성될 때 실증지 데이터 로드
onMounted(() => {
  // 임시 데이터 (실제로는 API에서 가져와야 함)
  buildings.value = [
    {
      id: 1,
      name: '롯데마트 금천점',
      phone: '0269602550',
      address: '서울특별시 금천구 시흥대로 291',
      description: '롯데마트 금천점 내 3층 임대방이다.'
    },
    {
      id: 2,
      name: '롯데마트 대전점',
      phone: '0421234567',
      address: '대전광역시 서구 둔산대로 123',
      description: '롯데마트 대전점 지하 1층 임대방이다.'
    },
    {
      id: 3,
      name: '시흥과학기술대학교',
      phone: '0311234567',
      address: '경기도 시흥시 정왕대로 237',
      description: '시흥과학기술대학교 공학관 3층이다.'
    },
    {
      id: 4,
      name: '롯데마트 VIC 영등포점',
      phone: '0221234567',
      address: '서울특별시 영등포구 영중로 15',
      description: '롯데마트 VIC 영등포점 4층 임대방이다.'
    }
  ]
})
</script>

<style scoped>

.building-selector {
  padding: 20px;
  max-width: 1540px;
  margin: 0 auto;
}

.selector-header {
  text-align: center;
  margin-bottom: 40px;
}

.selector-header h2 {
  margin: 0 0 10px 0;
  font-size: 28px;
  font-weight: 600;
  color: #333;
}

.selector-header p {
  margin: 0;
  font-size: 16px;
  color: #666;
}

.search-section {
  display: flex;
  justify-content: end;
  margin-bottom: 10px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-input {
  padding: 12px 16px;
  background: #F9F9F9;
  border: 1px solid #E4E4E4;
  outline: none;
  font-size: 14px;
  border-radius: 99px;
  width: 375px;
}

.search-btn {
  width: 44px;
  height: 44px;
  background: #000;
  border: none;   
  border-radius: 99px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}

.search-icon {
  width: 20px;
  height: 20px;
}

.buildings-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  padding: 30px;
  background: #f8f8f8;
  border-radius: 20px;
}

.building-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #E4E4E4;
  transition: all 0.2s;
  padding: 16px;
  display: grid;
  grid-template-columns: 168px 1fr;
  column-gap: 20px;
  align-items: center;
  cursor: pointer;
}

.building-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #E16349;
}

.building-image {
  position: relative;
  height: 168px;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  overflow: hidden;
}

.building-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
  height: 100%;
  width: 100%;
}

.building-info h3 {
  margin: 0 0 10px 0;
  font-size: 18px;
  font-weight: 700;
  color: #000;
}

.building-details {
  margin-bottom: 8px;
}

.detail-item {
  margin-bottom: 4px;
  font-size: 14px;
  color: #7f7f7f;
  display: flex;
  align-items: center;
  gap: 8px;
}

.detail-icon {
  width: 16px;
  height: 16px;
  opacity: 0.7;
}
</style>
