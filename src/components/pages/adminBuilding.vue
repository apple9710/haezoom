<!-- 실증지 관리 페이지 -->
<template>
  <div class="admin-buildings">
    <!-- 페이지 헤더 -->
    <div class="page-header">
      <h1>실증지 관리</h1>
      <div class="header-actions">
        <button @click="showFilter = !showFilter" class="btn btn-secondary">
          <img src="@/assets/images/manage_search.png" alt="필터" class="btn-icon" />
          필터
        </button>
        <div class="search-box">
          <input 
            v-model="searchQuery" 
            placeholder="실증지 검색"
            class="search-input"
          />
          <button class="search-btn">
            <div class="btn-img">
              <img src="@/assets/images/search.png" alt="검색" class="btn-icon" />
            </div>
          </button>
        </div>
        <button @click="openBuildingModal()" class="btn">
          <img src="@/assets/images/add.svg" alt="추가" class="btn-icon" />
          실증지 추가
        </button>
        <button @click="deleteSelected" :disabled="selectedBuildings.length === 0" class="btn btn-danger">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <mask id="mask0_2337_23821" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
          <rect width="20" height="20" fill="#D9D9D9"/>
          </mask>
          <g mask="url(#mask0_2337_23821)">
          <path d="M5.78125 17.6693C5.25653 17.6693 4.80938 17.4845 4.43979 17.1149C4.07021 16.7453 3.88542 16.2982 3.88542 15.7734V5.05469H2.9375V3.15885H7.38813V2.21094H12.6073V3.15885H17.0679V5.05469H16.12V15.7734C16.12 16.2982 15.9352 16.7453 15.5656 17.1149C15.196 17.4845 14.7489 17.6693 14.2242 17.6693H5.78125ZM14.2242 5.05469H5.78125V15.7734H14.2242V5.05469ZM7.41313 14.1616H9.19438V6.66156H7.41313V14.1616ZM10.811 14.1616H12.5923V6.66156H10.811V14.1616Z" fill="#7F7F7F"/>
          </g>
          </svg>
          실증지 삭제
        </button>
      </div>
    </div>
    
    <!-- 실증지 카드 그리드 -->
    <div class="buildings-grid">
      <div 
        v-for="building in paginatedBuildings" 
        :key="building.id"
        class="building-card"
      >
        <div class="building-image">
          <img :src="getImagePath(building.id)" :alt="building.name" />
          <div class="building-overlay">
            <button @click="openBuildingModal(building)" class="edit-btn">
              <img src="@/assets/images/settings.svg" alt="수정" />
            </button>
            <button @click="deleteBuildingConfirm(building)" class="delete-btn">
              <img src="@/assets/images/close.svg" alt="삭제" />
            </button>
          </div>
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
          
          <div class="building-actions">
            <div class="actions-left">
              <div class="admin-info">
                <img src="@/assets/images/account_icon.png" alt="관리자" class="admin-icon" />
                {{ building.admin }} / 외 {{ building.memberCount }}명
              </div>
            </div>
            <div class="actions-right">
              <select v-model="building.status" class="status-select">
                <option value="위험 설정">위험 설정</option>
                <option value="수정">수정</option>
                <option value="삭제">삭제</option>
              </select>
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
    
    <!-- 실증지 추가/수정 모달 -->
    <BaseModal 
      :is-open="showBuildingModal" 
      :title="isEditMode ? '실증지 수정' : '실증지 추가'"
      @close="closeBuildingModal"
      @confirm="saveBuilding"
    >
      <div class="building-form">
        <div class="form-group">
          <label for="buildingName">건물유형</label>
          <input 
            id="buildingName"
            v-model="buildingForm.name" 
            type="text" 
            placeholder="실증지 이름"
          />
        </div>
        
        <div class="form-group">
          <label for="buildingType">실증지명</label>
          <input 
            id="buildingType"
            v-model="buildingForm.type" 
            type="text" 
            placeholder="롯데마트 금천점"
          />
        </div>
        
        <div class="form-group">
          <label for="address">실증지 주소</label>
          <input 
            id="address"
            v-model="buildingForm.address" 
            type="text" 
            placeholder="서울특별시 금천구 시흥대로 291"
          />
        </div>
        
        <div class="form-group">
          <label for="phone">연락처</label>
          <input 
            id="phone"
            v-model="buildingForm.phone" 
            type="tel" 
            placeholder="0269602550"
          />
        </div>
        
        <div class="form-group">
          <label for="description">비고</label>
          <textarea 
            id="description"
            v-model="buildingForm.description" 
            placeholder="비고란"
            rows="3"
          ></textarea>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import BaseModal from '@/components/common/BaseModal.vue'
import BasePagination from '@/components/common/BasePagination.vue'

// 반응형 데이터
const buildings = ref([
  {
    id: 1,
    name: '롯데마트 금천점',
    type: '롯데마트 금천점',
    phone: '0269602550',
    address: '서울특별시 금천구 시흥대로 291',
    description: '롯데마트 금천점 내 3층 임대방이다.',
    admin: 'Prodadmin(슈퍼관리자)',
    memberCount: 3,
    status: '수정'
  },
  {
    id: 2,
    name: '롯데마트 금천점',
    type: '롯데마트 금천점',
    phone: '0269602550',
    address: '서울특별시 금천구 시흥대로 291',
    description: '롯데마트 금천점 내 3층 임대방이다.',
    admin: 'Prodadmin(슈퍼관리자)',
    memberCount: 3,
    status: '수정'
  }
])

// 상태 변수
const searchQuery = ref('')
const showFilter = ref(false)
const selectedBuildings = ref([])

// 모달 관련
const showBuildingModal = ref(false)
const isEditMode = ref(false)

// 실증지 폼 데이터
const buildingForm = ref({
  id: null,
  name: '',
  type: '',
  image: '',
  phone: '',
  address: '',
  description: '',
  admin: '',
  memberCount: 0,
  status: '수정'
})

// 페이지네이션
const currentPage = ref(1)
const itemsPerPage = ref(4)

// 계산된 속성
const filteredBuildings = computed(() => {
  if (!searchQuery.value) return buildings.value
  return buildings.value.filter(building => 
    building.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    building.address.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const paginatedBuildings = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredBuildings.value.slice(start, end)
})

const totalPages = computed(() => 
  Math.ceil(filteredBuildings.value.length / itemsPerPage.value)
)

// 메서드
const openBuildingModal = (building = null) => {
  isEditMode.value = !!building
  if (building) {
    buildingForm.value = { ...building }
  } else {
    buildingForm.value = {
      id: null,
      name: '',
      type: '',
      image: '',
      phone: '',
      address: '',
      description: '',
      admin: 'Prodadmin(슈퍼관리자)',
      memberCount: 0,
      status: '수정'
    }
  }
  showBuildingModal.value = true
}

const closeBuildingModal = () => {
  showBuildingModal.value = false
}

const saveBuilding = () => {
  if (isEditMode.value) {
    // 수정
    const index = buildings.value.findIndex(b => b.id === buildingForm.value.id)
    if (index !== -1) {
      buildings.value[index] = { ...buildingForm.value }
    }
  } else {
    // 추가
    const newId = Math.max(...buildings.value.map(b => b.id)) + 1
    buildings.value.push({ 
      ...buildingForm.value, 
      id: newId
    })
  }
  closeBuildingModal()
}

const deleteBuildingConfirm = (building) => {
  if (confirm(`${building.name}을(를) 삭제하시겠습니까?`)) {
    buildings.value = buildings.value.filter(b => b.id !== building.id)
  }
}

const deleteSelected = () => {
  if (confirm('선택한 실증지를 삭제하시겠습니까?')) {
    buildings.value = buildings.value.filter(building => !selectedBuildings.value.includes(building.id))
    selectedBuildings.value = []
  }
}

const handlePageChange = (page) => {
  currentPage.value = page
}

// 이미지 경로 반환 함수
const getImagePath = (buildingId) => {
  try {
    return new URL(`../../../assets/images/icon/${buildingId}.png`, import.meta.url).href
  } catch {
    // 기본 이미지
    return new URL(`../../../assets/images/icon/1.png`, import.meta.url).href
  }
}

// 생성될 때 더 많은 데이터 생성
onMounted(() => {
  for (let i = 3; i <= 6; i++) {
    buildings.value.push({
      id: i,
      name: '롯데마트 금천점',
      type: '롯데마트 금천점',
      phone: '0269602550',
      address: '서울특별시 금천구 시흥대로 291',
      description: '롯데마트 금천점 내 3층 임대방이다.',
      admin: 'Prodadmin(슈퍼관리자)',
      memberCount: 3,
      status: '수정'
    })
  }
})
</script>

<style scoped>
img{
  width: 100%;
}
.admin-buildings {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.page-header h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-input {
  padding: 10px 12px;
  background: #F9F9F9;
  border: 1px solid #E4E4E4;
  outline: none;
  font-size: 14px;
  border-radius: 99px;
}

.search-btn {
  width: 40px;
  height: 40px;
  background: #000;
  border: none;   
  border-radius: 99px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}
.btn-img {
  width: 20px;
  height: 20px;
}
.btn {
  padding: 10px 16px;
  border: none;
  border-radius: 99px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  background: #000;
  color: white;
}

.btn-icon {
  width: 20px;
  height: 20px;
}

.btn-primary {
  background-color: #e74c3c;
  color: white;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-danger {
  background-color: #e74c3c;
  color: white;
}

.btn-danger:disabled {
  background-color: #f9f9f9;
  border: 1px solid #E4E4E4;
  cursor: not-allowed;
  color: #7f7f7f;
}

.btn-danger:disabled .btn-icon {
  filter: brightness(0) invert(0.7);
}

.buildings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.building-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}

.building-card:hover {
  transform: translateY(-2px);
}

.building-image {
  position: relative;
  height: 200px;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.building-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
}

.building-overlay {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 5px;
  opacity: 0;
  transition: opacity 0.2s;
}

.building-card:hover .building-overlay {
  opacity: 1;
}

.edit-btn, .delete-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
}

.edit-btn img,
.delete-btn img {
  width: 16px;
  height: 16px;
  filter: brightness(0) invert(1);
}

.edit-btn {
  background: rgba(52, 152, 219, 0.9);
  color: white;
}

.delete-btn {
  background: rgba(231, 76, 60, 0.9);
  color: white;
}

.building-info {
  padding: 15px;
}

.building-info h3 {
  margin: 0 0 10px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.building-details {
  margin-bottom: 15px;
}

.detail-item {
  margin-bottom: 5px;
  font-size: 14px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 8px;
}

.detail-icon {
  width: 16px;
  height: 16px;
  opacity: 0.7;
}

.building-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.admin-info {
  font-size: 12px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 5px;
}

.admin-icon {
  width: 14px;
  height: 14px;
  opacity: 0.7;
}

.status-select {
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
}

.building-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-group label {
  font-weight: 500;
  color: #333;
}

.form-group input,
.form-group textarea,
.form-group select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #e74c3c;
}
</style>