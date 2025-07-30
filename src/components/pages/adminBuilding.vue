<!-- 실증지 관리 페이지 -->
<template>
  <div class="admin-buildings">
    <!-- 페이지 헤더 -->
    <div class="page-header">
      <div class="header-title-section">
        <h1>실증지 관리</h1>
        <div class="buildings-count-info">
          <span class="total-count">총 {{ totalBuildings }}개의 실증지</span>
          <span class="current-page-info">
            ({{ currentPage }}페이지 / {{ totalPages }}페이지, 현재 {{ buildings.length }}개 표시)
          </span>
        </div>
      </div>
      <div class="header-actions">
        <!-- <button @click="showFilter = !showFilter" class="btn btn-secondary">
          <img src="@/assets/images/manage_search.png" alt="필터" class="btn-icon" />
          필터
        </button> -->
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
        <button @click="openBuildingModal()" class="btn" id="add-building-btn">
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
        <!-- 호버 시 표시되는 오버레이 -->
        <div class="building-hover-overlay">
          <!-- 상세보기 버튼 (좌측) -->
          <div class="detail-view-section">
            <button @click="viewBuildingDetail(building)" class="detail-view-btn">
              <div class="img-mask"><img src="@/assets/images/manage_search.svg" alt=""></div>
              <!-- <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="white"/>
              </svg> -->
              상세보기
            </button>
          </div>

          <!-- 관리자 정보 (우측) -->
          <div class="admin-info-section">
            <div class="admin-info-title">연결된 실증지 사용자</div>
            <div class="connected-users">
              <div class="user-item" v-for="user in getConnectedUsers(building)" :key="user.id">
                <span class="user-id">{{ user.username }}({{ user.displayName }})</span>
              </div>
            </div>
          </div>

          <!-- 액션 메뉴 (우측 상단) -->
          <div class="action-menu">
            <button class="action-menu-btn">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="4" cy="10" r="2" fill="white"/>
                <circle cx="10" cy="10" r="2" fill="white"/>
                <circle cx="16" cy="10" r="2" fill="white"/>
              </svg>
            </button>
            <div class="action-dropdown">
              <button @click="openWidgetSettings(building)" class="dropdown-item">
                위젯 설정
              </button>
              <button @click="openBuildingModal(building)" class="dropdown-item">
                수정
              </button>
              <button @click="deleteBuildingConfirm(building)" class="dropdown-item">
                삭제
              </button>
            </div>
          </div>
        </div>

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
          
          <div class="building-actions">
              <div class="admin-info">
                <img src="@/assets/images/account_icon.png" alt="관리자" class="admin-icon" />
                {{ building.admin }} / 외 {{ building.memberCount }}명
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
      title="실증지 정보"
      @close="closeBuildingModal"
      :show-footer="false"
    >
      <div class="building-form">
        <!-- 이미지 업로드 영역 -->
        <div class="image-upload-area">
          <div v-if="buildingForm.imagePreview" class="image-preview">
            <img :src="buildingForm.imagePreview" alt="미리보기" />
            <button @click="removeImage" class="remove-image-btn">×</button>
          </div>
          <div v-else class="upload-placeholder">
            <div class="upload-text">
              실증지 리스트에 사용할 이미지를 등록해 주세요<br>
              <span class="upload-hint">※파일 이미지 사이즈 500X250</span>
            </div>
            <input 
              ref="fileInput"
              type="file" 
              accept="image/*" 
              @change="handleImageUpload"
              style="display: none"
            />
            <button @click="$refs.fileInput.click()" class="upload-btn">파일 선택</button>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="buildingName">실증지 명 (*)</label>
            <input 
              id="buildingName"
              v-model="buildingForm.name" 
              type="text" 
              placeholder="실증지 명을 입력해 주세요"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="buildingAddress">실증지 주소 (*)</label>
            <input 
              id="buildingAddress"
              v-model="buildingForm.address" 
              type="text" 
              placeholder="주소를 입력해 주세요"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="buildingPhone">전화번호</label>
            <input 
              id="buildingPhone"
              v-model="buildingForm.phone" 
              type="tel" 
              placeholder="전화번호를 입력해 주세요"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group desc">
            <label for="buildingDescription">비고</label>
            <div class="textarea-container">
              <textarea 
                id="buildingDescription"
                v-model="buildingForm.description" 
                placeholder="기타 정보를 입력해주세요"
                maxlength="60"
                rows="3"
              ></textarea>
              <div class="char-count">{{ buildingForm.description?.length || 0 }} / 60 자</div>
            </div>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>사용자 선택</label>
            <input 
              type="text" 
              :value="buildingForm.selectedUsersText || ''"
              placeholder="사용자를 선택해주세요"
              readonly
              class="form-input"
              @click="openUserSelectModal"
              style="cursor: pointer;"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>전기요금제 선택</label>
            <input 
              type="text" 
              :value="buildingForm.electricPlanText || ''"
              placeholder="전기요금제를 선택해주세요"
              readonly
              class="form-input"
              @click="openElectricPlanModal"
              style="cursor: pointer;"
            />
          </div>
        </div>

        <div class="modal-buttons">
          <button @click="closeBuildingModal" class="btn-cancel">취소</button>
          <button @click="saveBuilding" class="btn-save">추가</button>
        </div>
      </div>
    </BaseModal>

    <!-- 사용자 선택 모달 -->
    <BaseModal 
      :is-open="showUserSelectModal" 
      title="사용자 검색"
      @close="closeUserSelectModal"
      :show-footer="false"
    >
      <div class="user-select-form">
        <div class="search-section">
          <div class="search-info">사용자 실증지 정보</div>
          <div class="search-tag">
            롯데마트(lottemart) ×
          </div>
          <div class="search-controls">
            <select class="search-type">
              <option>전체</option>
              <option>ID</option>
              <option>이름</option>
            </select>
            <input type="text" placeholder="검색어를 입력해주세요" class="search-input-modal" />
            <button class="search-btn-modal">검색</button>
          </div>
        </div>

        <div class="user-table">
          <div class="table-header">
            <div class="table-cell">
              <input type="checkbox" />
            </div>
            <div class="table-cell">ID</div>
            <div class="table-cell">이름</div>
          </div>
          <div 
            v-for="user in availableUsers" 
            :key="user.id"
            class="table-row"
            :class="{ selected: selectedUsers.includes(user.id) }"
          >
            <div class="table-cell">
              <input 
                type="checkbox" 
                :checked="selectedUsers.includes(user.id)"
                @change="toggleUserSelection(user.id)"
              />
            </div>
            <div class="table-cell">{{ user.username }}</div>
            <div class="table-cell">{{ user.name }}</div>
          </div>
        </div>

        <div class="modal-buttons">
          <button @click="closeUserSelectModal" class="btn-cancel">취소</button>
          <button @click="selectUsers" class="btn-save">선택완료</button>
        </div>
      </div>
    </BaseModal>

    <!-- 전기요금제 선택 모달 -->
    <BaseModal 
      :is-open="showElectricPlanModal" 
      title="전기요금제 선택"
      @close="closeElectricPlanModal"
      :show-footer="false"
    >
      <div class="electric-plan-form">
        <div class="form-row">
          <div class="form-group">
            <label>전기요금제 선택</label>
            <select v-model="selectedElectricPlan" @change="onElectricPlanChange" class="form-select">
              <option value="">전기요금제 선택</option>
              <option 
                v-for="plan in availableElectricPlans" 
                :key="plan.code" 
                :value="plan.code"
              >
                {{ plan.name }}
              </option>
            </select>
          </div>
        </div>

        <div class="form-row" v-if="selectedElectricPlan">
          <div class="form-group">
            <label>전력구분</label>
            <select v-model="selectedPowerDivision" class="form-select">
              <option value="">전력구분 선택</option>
              <option 
                v-for="division in currentPowerDivisions" 
                :key="division.code" 
                :value="division.code"
              >
                {{ division.name }}
              </option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>검침일</label>
            <input 
              v-model="meterReadingDay" 
              type="number" 
              placeholder="15"
              class="form-input"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>계약 전력</label>
            <input 
              v-model="contractPower" 
              type="number" 
              placeholder="200"
              class="form-input"
            />
          </div>
        </div>

        <div class="modal-buttons">
          <button @click="closeElectricPlanModal" class="btn-cancel">취소</button>
          <button @click="saveElectricPlan" class="btn-save">설정완료</button>
        </div>
      </div>
    </BaseModal>

    <!-- 실증지 상세보기 모달 -->
    <BaseModal 
      :is-open="showBuildingDetailModal" 
      title="실증지 상세 정보"
      @close="closeBuildingDetailModal"
      :show-footer="false"
    >
      <div class="building-detail-form" v-if="selectedBuildingDetail">
        <!-- 실증지 이미지 -->
        <div class="detail-image-section">
          <div class="detail-image">
            <img :src="getImagePath(selectedBuildingDetail.id)" :alt="selectedBuildingDetail.name" />
          </div>
        </div>

        <!-- 기본 정보 -->
        <div class="detail-info-section">
          <!-- <h3 class="detail-section-title">기본 정보</h3> -->
          <div class="detail-info-grid">
            <div class="detail-info-item">
              <label>실증지 명</label>
              <span>{{ selectedBuildingDetail.name }}</span>
            </div>
            <!-- <div class="detail-info-item">
              <label>전화번호</label>
              <span>{{ selectedBuildingDetail.phone }}</span>
            </div> -->
            <div class="detail-info-item">
              <label>주소</label>
              <span>{{ selectedBuildingDetail.address }}</span>
            </div>
            <div class="detail-info-item">
              <label>비고란</label>
              <span>{{ selectedBuildingDetail.description }}</span>
            </div>
          </div>
        </div>

        <!-- 관리자 정보 -->
        <!-- <div class="detail-admin-section">
          <h3 class="detail-section-title">관리자 정보</h3>
          <div class="detail-admin-info">
            <div class="admin-main-info">
              <img src="@/assets/images/account_icon.png" alt="관리자" class="admin-detail-icon" />
              <span>{{ selectedBuildingDetail.admin }} / 외 {{ selectedBuildingDetail.memberCount }}명</span>
            </div>
          </div>
        </div> -->

        <!-- 연결된 사용자 -->
        <div class="detail-users-section">
          <h3 class="detail-section-title">연결된 사용자</h3>
          <div class="detail-users-grid">
            <div 
              v-for="user in getConnectedUsers(selectedBuildingDetail)" 
              :key="user.id"
              class="detail-user-item"
            >
              <div class="user-info">
                <span class="user-name">{{ user.displayName }}</span>
                <span class="user-id-text">{{ user.username }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-buttons">
          <button @click="closeBuildingDetailModal" class="btn-cancel">닫기</button>
          <button @click="editFromDetail(selectedBuildingDetail)" class="btn-save">수정</button>
        </div>
      </div>
    </BaseModal>

    <!-- 위젯 설정 모달 -->
    <BaseModal 
      :is-open="showWidgetSettingsModal" 
      title="위젯 설정 관리"
      @close="closeWidgetSettingsModal"
      :show-footer="false"
    >
      <div class="widget-settings-form" v-if="selectedBuildingForWidget">
        <div class="building-info-header">
          <h3>{{ selectedBuildingForWidget.name }} 위젯 설정</h3>
          <p>테스트 데모 모달입니다. 실제 사용자 대시보드로 보여질 예정</p>
        </div>

        <div class="pages-section">
          <div class="section-header">
            <h4>대시보드 페이지 목록</h4>
            <button @click="createNewPage" class="btn btn-sm">
              <img src="@/assets/images/add.svg" alt="추가" class="btn-icon" />
              새 페이지 추가
            </button>
          </div>

          <div class="pages-list">
            <!-- 기존 페이지 목록 (임시 데이터) -->
            <div class="page-item">
              <div class="page-info">
                <span class="page-name">전력 모니터링</span>
                <span class="page-meta">위젯 5개</span>
              </div>
              <div class="page-actions">
                <button @click="editExistingPage({ id: 1, name: '전력 모니터링' })" class="btn btn-sm btn-edit">
                  편집
                </button>
              </div>
            </div>

            <div class="page-item">
              <div class="page-info">
                <span class="page-name">에너지 효율성</span>
                <span class="page-meta">위젯 3개</span>
              </div>
              <div class="page-actions">
                <button @click="editExistingPage({ id: 2, name: '에너지 효율성' })" class="btn btn-sm btn-edit">
                  편집
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-buttons">
          <button @click="closeWidgetSettingsModal" class="btn-cancel">닫기</button>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
/*
백엔드 연결 시 예상 데이터 구조:

Building 객체:
{
  id: number,
  name: string,
  phone: string,
  address: string,
  description: string,
  admin: string,
  memberCount: number,
  connectedUsers: [
    {
      id: number,
      username: string,
      displayName: string,
      role: string,
      email?: string
    }
  ]
}

API 엔드포인트:
- GET /api/buildings - 모든 실증지 목록 조회
- GET /api/buildings/:id/users - 특정 실증지의 연결된 사용자 목록 조회
- POST /api/buildings - 새 실증지 생성
- PUT /api/buildings/:id - 실증지 정보 수정
- DELETE /api/buildings/:id - 실증지 삭제
*/

import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BaseModal from '@/components/common/BaseModal.vue'
import BasePagination from '@/components/common/BasePagination.vue'
import { buildingAPI, electricRateAPI, authAPI } from '@/utils/api.js'
// 이미지 import (Vite 빌드 시 자동으로 최적화됨)
import testImage from '@/assets/images/testimg.png'

// 스토어와 라우터 설정
const router = useRouter()
const authStore = useAuthStore()

// 반응형 데이터
const buildings = ref([])
const loading = ref(false)
const totalBuildings = ref(0)

// 전기요금제 관련 데이터
const electricRatePlans = ref([])
const powerDivisions = ref([])

// 사용자 관련 데이터
const availableUsers = ref([])
const selectedUsers = ref([])

// 백엔드 연결을 위한 사용자 데이터 추가
const connectedUsers = ref([]) // 각 실증지별 연결된 사용자 목록

// 상태 변수
const searchQuery = ref('')
const showFilter = ref(false)
const selectedBuildings = ref([])

// 모달 관련
const showBuildingModal = ref(false)
const showUserSelectModal = ref(false)
const showElectricPlanModal = ref(false)
const showBuildingDetailModal = ref(false)
const showWidgetSettingsModal = ref(false)
const isEditMode = ref(false)
const selectedBuildingDetail = ref(null)
const selectedBuildingForWidget = ref(null)

// 전기요금제 선택 관련
const availableElectricPlans = ref([])
const currentPowerDivisions = ref([])
const selectedElectricPlan = ref('')
const selectedPowerDivision = ref('')
const meterReadingDay = ref('')
const contractPower = ref('')

// 실증지 폼 데이터
const buildingForm = ref({
  id: null,
  name: '',
  type: '',
  image: '',
  imagePreview: '',
  phone: '',
  address: '',
  description: '',
  admin: '',
  memberCount: 0,
  status: '',
  electricRatePlan: '',
  powerDivision: '',
  meterReadingDay: '',
  contractPower: '',
  electricPlanText: '',
  selectedUsers: [],
  selectedUsersText: ''
})

// 페이지네이션
const currentPage = ref(1)
const itemsPerPage = ref(6) // 안정적인 크기로 설정
const backendTotalPages = ref(0) // 백엔드에서 제공하는 실제 페이지 수

// 계산된 속성
const filteredBuildings = computed(() => {
  if (!searchQuery.value) return buildings.value
  return buildings.value.filter(building => 
    building.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    building.address.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const paginatedBuildings = computed(() => filteredBuildings.value)

// 백엔드에서 제공하는 페이지 수를 우선 사용, 없으면 보수적으로 계산
const totalPages = computed(() => {
  if (backendTotalPages.value > 0) {
    return backendTotalPages.value
  }
  
  // 백엔드 totalPages가 없으면 보수적으로 계산
  // 2페이지부터는 1개씩이므로 첫 페이지 이후 남은 데이터 개수만큼 페이지 추가
  const firstPageItems = Math.min(itemsPerPage.value, totalBuildings.value)
  const remainingItems = Math.max(0, totalBuildings.value - firstPageItems)
  
  return remainingItems > 0 ? 1 + remainingItems : 1
})

const totalItems = computed(() => totalBuildings.value)

// 백엔드 API 함수들
const apiService = {
  // 실증지 관련 API
  async getBuildings(page = 0, size = 6) {
    try {
      loading.value = true
      console.log('실증지 목록 조회 - API 연결')
      
      // 토큰 확인
      const token = localStorage.getItem('auth_token')
      if (!token) {
        console.warn('토큰이 없습니다. 개발용 토큰을 설정합니다.')
        authStore.setDevToken()
      }
      
      // Swagger 스펙에 맞는 API 호출
      const response = await buildingAPI.getBuildings(page, size)
      
      console.log('실증지 목록 조회 성공:', response)
      
      // API 응답 데이터 처리
      let apiData;
      
      // Mock API 응답인 경우 (response가 직접 데이터)
      if (response.success === true && response.data) {
        apiData = response;
      }
      // 실제 API 응답인 경우 (response.data가 데이터)
      else if (response.data) {
        apiData = response.data;
      }
      else {
        apiData = response;
      }
      
      console.log('처리된 API 데이터:', apiData);
      
      if (apiData && apiData.data) {
        let buildingData;
        
        // Mock API 형식 (Array)
        if (Array.isArray(apiData.data)) {
          buildingData = {
            content: apiData.data,
            totalElements: apiData.data.length
          };
        }
        // 실제 API 형식 (Page 객체)
        else {
          buildingData = apiData.data;
        }
        
        console.log('빌딩 데이터:', buildingData);
        
        // 실증지 개수 정보 출력
        console.log('📊 실증지 현황:');
        console.log(`  전체 실증지 개수 (totalElements): ${buildingData.totalElements || 0}개`);
        console.log(`  현재 페이지 표시 개수 (content.length): ${buildingData.content?.length || 0}개`);
        console.log(`  백엔드 제공 총 페이지 수 (totalPages): ${buildingData.totalPages || 0}페이지`);
        console.log(`  백엔드 제공 페이지 크기 (size): ${buildingData.size || 0}개`);
        console.log(`  백엔드 제공 현재 페이지 번호 (number): ${buildingData.number || 0} (0-based)`);
        console.log(`  현재 페이지: ${currentPage.value}페이지`);
        console.log('🔍 데이터 분석:');
        console.log(`  실제 표시되는 실증지들:`, buildingData.content?.map(b => `${b.buildingId}:${b.name}`) || []);
        
        // 페이지네이션 계산 검증
        const frontendCalculatedPages = Math.ceil((buildingData.totalElements || 0) / itemsPerPage.value);
        const backendProvidedPages = buildingData.totalPages || 0;
        console.log('🧮 페이지네이션 계산 비교:');
        console.log(`  프론트엔드 계산: ${buildingData.totalElements}÷${itemsPerPage.value} = ${frontendCalculatedPages}페이지`);
        console.log(`  백엔드 제공: ${backendProvidedPages}페이지`);
        if (frontendCalculatedPages !== backendProvidedPages) {
          console.warn('⚠️ 페이지 수 불일치 발견!');
        }
        
          buildings.value = buildingData.content.map(building => ({
            id: building.id,
            name: building.name,
            address: building.address || '',
            description: building.description || '',
            electricRatePlan: building.electricRatePlan || '',
            powerDivision: building.powerDivision || '',
            admin: 'Admin',
            memberCount: 3,
            status: '수정',
            type: building.name
          }))
          totalBuildings.value = buildingData.totalElements || 0
          backendTotalPages.value = buildingData.totalPages || 0 // 백엔드 페이지 수 저장
          console.log(`✅ 총 ${totalBuildings.value}개의 실증지가 저장되어 있습니다.`);
          console.log(`📄 백엔드 제공 총 페이지 수: ${backendTotalPages.value}페이지`);
          return buildingData
        }
      } catch (error) {
        console.error('실증지 목록 조회 실패:', error)
        
        // 401 에러인 경우 인증 문제
        if (error.response?.status === 401) {
          console.warn('인증 실패: 개발용 토큰으로 재시도합니다.')
          authStore.setDevToken()
          // 재시도
          try {
            const response = await buildingAPI.getBuildings(page, size)
            console.log('재시도 성공:', response.data)
            return response.data
          } catch (retryError) {
            console.error('재시도 실패:', retryError)
          }
        }
        
        // 사용자에게 에러 메시지 표시
        let errorMessage = '실증지 목록을 불러오는 데 실패했습니다.'
        
        if (error.response?.status === 401) {
          errorMessage = '인증이 만료되었습니다. 다시 로그인해주세요.'
        } else if (error.response?.status === 403) {
          errorMessage = '실증지 목록을 조회할 권한이 없습니다.'
        } else if (error.response?.status === 500) {
          errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
        } else if (error.code === 'NETWORK_ERROR' || !error.response) {
          errorMessage = '네트워크 연결을 확인해주세요.'
        }
        
        alert(errorMessage)
        
        // 빈 데이터로 초기화
        buildings.value = []
        totalBuildings.value = 0
        
        throw error
      } finally {
        loading.value = false
      }
    },

  async createBuilding(buildingData) {
    try {
      console.log('실증지 생성 - API 연결')
      console.log('전송할 데이터:', buildingData)
      
      // Swagger 스펙에 맞는 API 호출 (정확한 필드명 사용)
      const response = await buildingAPI.createBuilding({
        name: buildingData.name,
        address: buildingData.address || '',
        comment: buildingData.description || buildingData.comment || '',
        electRatePlanCode: buildingData.electricRatePlan || '',
        powerClassCode: buildingData.powerDivision || '',
        threshold: buildingData.threshold || '15',  // 검침일 기본값 15
        contractPower: buildingData.contractPower || '0',
        userIds: buildingData.selectedUserIds || []
      })
      
      console.log('실증지 생성 성공:', response.data)
      return response.data.data
    } catch (error) {
      console.error('실증지 생성 실패:', error)
      throw error
    }
  },

  async updateBuilding(buildingId, buildingData) {
    try {
      console.log('실증지 수정 - API 연결')
      console.log('수정할 데이터:', buildingData)
      
      // Swagger 스펙에 맞는 API 호출 (정확한 필드명 사용)
      const response = await buildingAPI.updateBuilding(buildingId, {
        name: buildingData.name,
        address: buildingData.address || '',
        comment: buildingData.description || buildingData.comment || '',
        electRatePlanCode: buildingData.electricRatePlan || '',
        powerClassCode: buildingData.powerDivision || '',
        threshold: buildingData.threshold || '15',  // 검침일 기본값 15
        contractPower: buildingData.contractPower || '0',
        userIds: buildingData.selectedUserIds || []
      })
      
      console.log('실증지 수정 성공:', response.data)
      return response.data.data
    } catch (error) {
      console.error('실증지 수정 실패:', error)
      throw error
    }
  },

  async deleteBuilding(buildingId) {
    try {
      console.log('실증지 삭제 - API 연결')
      
      const response = await buildingAPI.deleteBuilding(buildingId)
      console.log('실증지 삭제 성공:', response.data)
      return response.data.data
    } catch (error) {
      console.error('실증지 삭제 실패:', error)
      throw error
    }
  },

  // 전기요금제 관련 API
  async getElectricRatePlans() {
    try {
      console.log('전기요금제 목록 조회 - API 연결')
      
      const response = await electricRateAPI.getElectricRatePlans()
      console.log('전기요금제 목록 조회 성공:', response.data)
      
      if (response.data && response.data.data && response.data.data.codes) {
        return response.data.data.codes.map(plan => ({
          code: plan.code,
          name: plan.codeName
        }))
      } else {
        throw new Error('전기요금제 데이터가 없습니다.')
      }
    } catch (error) {
      console.error('전기요금제 목록 조회 실패:', error)
      // 실패 시 더미 데이터 반환
      return [
        { code: 'GENERAL_A1', name: '일반용(갑) Ⅰ' },
        { code: 'GENERAL_A2', name: '일반용(갑) Ⅱ' },
        { code: 'GENERAL_B', name: '일반용(을)' },
        { code: 'INDUSTRY_A1', name: '산업용(갑) Ⅰ' },
        { code: 'INDUSTRY_A2', name: '산업용(갑) Ⅱ' },
        { code: 'INDUSTRY_B', name: '산업용(을)' },
        { code: 'EDUCATION_A', name: '교육용(갑)' },
        { code: 'EDUCATION_B', name: '교육용(을)' },
        { code: 'AGRICULTURE_A', name: '농사용(갑)' },
        { code: 'AGRICULTURE_B', name: '농사용(을)' },
        { code: 'RESIDENTIAL', name: '주택용' }
      ]
    }
  },

  async getPowerDivisions(planCode) {
    try {
      console.log('전력구분 목록 조회 - API 연결')
      
      const response = await electricRateAPI.getPowerDivisionsByPlan(planCode)
      console.log('전력구분 목록 조회 성공:', response.data)
      
      if (response.data && response.data.data && response.data.data.codes) {
        return response.data.data.codes.map(division => ({
          code: division.code,
          name: division.codeName
        }))
      } else {
        throw new Error('전력구분 데이터가 없습니다.')
      }
    } catch (error) {
      console.error('전력구분 목록 조회 실패:', error)
      // 실패 시 더미 데이터 반환 (요금제별로 다른 옵션)
      return this.getDefaultPowerDivisions(planCode)
    }
  },

  // 요금제별 기본 전력구분 반환
  getDefaultPowerDivisions(planCode) {
    const divisions = {
      'GENERAL_A1': [
        { code: 'LOW_VOLTAGE', name: '저압' },
        { code: 'HIGH_A1', name: '고압A(Ⅰ)' },
        { code: 'HIGH_A2', name: '고압A(Ⅱ)' },
        { code: 'HIGH_B1', name: '고압B(Ⅰ)' },
        { code: 'HIGH_B2', name: '고압B(Ⅱ)' }
      ],
      'GENERAL_A2': [
        { code: 'HIGH_A1', name: '고압A(Ⅰ)' },
        { code: 'HIGH_A2', name: '고압A(Ⅱ)' },
        { code: 'HIGH_B1', name: '고압B(Ⅰ)' },
        { code: 'HIGH_B2', name: '고압B(Ⅱ)' }
      ],
      'GENERAL_B': [
        { code: 'HIGH_A1', name: '고압A(Ⅰ)' },
        { code: 'HIGH_A2', name: '고압A(Ⅱ)' },
        { code: 'HIGH_A3', name: '고압A(Ⅲ)' },
        { code: 'HIGH_B1', name: '고압B(Ⅰ)' },
        { code: 'HIGH_B2', name: '고압B(Ⅱ)' },
        { code: 'HIGH_B3', name: '고압B(Ⅲ)' }
      ],
      'INDUSTRY_A1': [
        { code: 'LOW_VOLTAGE', name: '저압' },
        { code: 'HIGH_A1', name: '고압A(Ⅰ)' },
        { code: 'HIGH_A2', name: '고압A(Ⅱ)' },
        { code: 'HIGH_B1', name: '고압B(Ⅰ)' },
        { code: 'HIGH_B2', name: '고압B(Ⅱ)' }
      ],
      'INDUSTRY_A2': [
        { code: 'HIGH_A1', name: '고압A(Ⅰ)' },
        { code: 'HIGH_A2', name: '고압A(Ⅱ)' },
        { code: 'HIGH_B1', name: '고압B(Ⅰ)' },
        { code: 'HIGH_B2', name: '고압B(Ⅱ)' }
      ],
      'INDUSTRY_B': [
        { code: 'HIGH_A1', name: '고압A(Ⅰ)' },
        { code: 'HIGH_A2', name: '고압A(Ⅱ)' },
        { code: 'HIGH_B1', name: '고압B(Ⅰ)' },
        { code: 'HIGH_B2', name: '고압B(Ⅱ)' }
      ],
      'EDUCATION_A': [
        { code: 'LOW_VOLTAGE', name: '저압' },
        { code: 'HIGH_A1', name: '고압A(Ⅰ)' },
        { code: 'HIGH_A2', name: '고압A(Ⅱ)' },
        { code: 'HIGH_B1', name: '고압B(Ⅰ)' },
        { code: 'HIGH_B2', name: '고압B(Ⅱ)' }
      ],
      'EDUCATION_B': [
        { code: 'HIGH_A1', name: '고압A(Ⅰ)' },
        { code: 'HIGH_A2', name: '고압A(Ⅱ)' },
        { code: 'HIGH_B1', name: '고압B(Ⅰ)' },
        { code: 'HIGH_B2', name: '고압B(Ⅱ)' }
      ],
      'AGRICULTURE_A': [],
      'AGRICULTURE_B': [
        { code: 'LOW_VOLTAGE', name: '저압' },
        { code: 'HIGH_A', name: '고압A' },
        { code: 'HIGH_B', name: '고압B' }
      ],
      'RESIDENTIAL': [
        { code: 'LOW_VOLTAGE', name: '저압' },
        { code: 'HIGH_VOLTAGE', name: '고압' }
      ]
    }
    
    return divisions[planCode] || []
  },

  // 사용자 관련 API
  async getUsers() {
    try {
      console.log('사용자 목록 조회 - API 연결')
      
      const response = await authAPI.getUsers(0, 100) // 모든 사용자 조회
      console.log('사용자 목록 조회 성공:', response.data)
      
      if (response.data && response.data.data && response.data.data.content) {
        return response.data.data.content.map(user => ({
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email
        }))
      } else {
        throw new Error('사용자 데이터가 없습니다.')
      }
    } catch (error) {
      console.error('사용자 목록 조회 실패:', error)
      // 실패 시 더미 데이터 반환
      return [
        { id: '1', username: 'haezoom', name: '해줌관리자', email: 'haezoom@example.com' },
        { id: '2', username: 'lottemart', name: '롯데마트', email: 'lotte@example.com' },
        { id: '3', username: 'bems', name: 'bems', email: 'bems@example.com' },
        { id: '4', username: 'test1234', name: 'test', email: 'test@example.com' }
      ]
    }
  }
}

const fetchBuildingUsers = async (buildingId) => {
  try {
    // 임시로 더미 데이터 반환 (사용자 API 연결 전까지)
    return [
      { id: 1, username: 'haezoom', displayName: '해줌관리자' },
      { id: 2, username: 'prodadmin', displayName: '슈퍼관리자' },
      { id: 3, username: 'hzuser', displayName: '해줌사용자' },
      { id: 4, username: 'lottemart', displayName: '김태훈' }
    ]
  } catch (error) {
    console.error('사용자 데이터 조회 실패:', error)
    return []
  }
}

const fetchAllBuildings = async () => {
  try {
    await apiService.getBuildings(currentPage.value - 1, itemsPerPage.value)
  } catch (error) {
    console.error('실증지 데이터 조회 실패:', error)
  }
}

// 위젯 설정 관련 함수들
const openWidgetSettings = (building) => {
  selectedBuildingForWidget.value = building
  showWidgetSettingsModal.value = true
}

const closeWidgetSettingsModal = () => {
  showWidgetSettingsModal.value = false
  selectedBuildingForWidget.value = null
}

const createNewPage = () => {
  // 새 페이지 생성 로직 (다음 단계에서 구현)
  console.log('새 페이지 생성:', selectedBuildingForWidget.value)
}

const editExistingPage = (page) => {
  // 기존 페이지 편집 로직 (다음 단계에서 구현)
  console.log('페이지 편집:', page)
}

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
      imagePreview: '',
      phone: '',
      address: '',
      description: '',
      admin: 'Prodadmin(슈퍼관리자)',
      memberCount: 0,
      status: '',
      electricRatePlan: '',
      powerDivision: '',
      meterReadingDay: '',
      contractPower: '',
      electricPlanText: '',
      selectedUsers: [],
      selectedUsersText: ''
    }
  }
  showBuildingModal.value = true
}

const closeBuildingModal = () => {
  showBuildingModal.value = false
}

// 상세보기 함수 수정
const viewBuildingDetail = (building) => {
  selectedBuildingDetail.value = building
  showBuildingDetailModal.value = true
}

const closeBuildingDetailModal = () => {
  showBuildingDetailModal.value = false
  selectedBuildingDetail.value = null
}

// 상세보기에서 수정 버튼 클릭 시
const editFromDetail = (building) => {
  closeBuildingDetailModal()
  openBuildingModal(building)
}

// 이미지 업로드 관련
const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      buildingForm.value.imagePreview = e.target.result
      buildingForm.value.image = file
    }
    reader.readAsDataURL(file)
  }
}

const removeImage = () => {
  buildingForm.value.imagePreview = ''
  buildingForm.value.image = ''
}

// 사용자 선택 모달
const openUserSelectModal = async () => {
  // 사용자 목록 로드
  try {
    availableUsers.value = await apiService.getUsers()
  } catch (error) {
    console.error('사용자 목록 로드 실패:', error)
  }
  
  showUserSelectModal.value = true
}

const closeUserSelectModal = () => {
  showUserSelectModal.value = false
  selectedUsers.value = []
}

const selectUsers = () => {
  // 선택된 사용자들을 건물 폼에 적용
  buildingForm.value.selectedUsers = [...selectedUsers.value]
  
  // 표시용 텍스트 설정
  const userNames = selectedUsers.value.map(userId => {
    const user = availableUsers.value.find(u => u.id === userId)
    return user ? `${user.name}(${user.username})` : userId
  })
  buildingForm.value.selectedUsersText = userNames.join(', ')
  
  closeUserSelectModal()
}

const toggleUserSelection = (userId) => {
  const index = selectedUsers.value.indexOf(userId)
  if (index > -1) {
    selectedUsers.value.splice(index, 1)
  } else {
    selectedUsers.value.push(userId)
  }
}

// 전기요금제 선택 모달
const openElectricPlanModal = async () => {
  // 전기요금제 목록 로드
  try {
    availableElectricPlans.value = await apiService.getElectricRatePlans()
  } catch (error) {
    console.error('전기요금제 로드 실패:', error)
    availableElectricPlans.value = []
  }
  
  showElectricPlanModal.value = true
}

const closeElectricPlanModal = () => {
  showElectricPlanModal.value = false
  selectedElectricPlan.value = ''
  selectedPowerDivision.value = ''
  meterReadingDay.value = ''
  contractPower.value = ''
  currentPowerDivisions.value = []
}

// 전기요금제 변경 시 전력구분 로드
const onElectricPlanChange = async () => {
  if (selectedElectricPlan.value) {
    try {
      currentPowerDivisions.value = await apiService.getPowerDivisions(selectedElectricPlan.value)
      selectedPowerDivision.value = '' // 초기화
    } catch (error) {
      console.error('전력구분 로드 실패:', error)
      currentPowerDivisions.value = []
    }
  } else {
    currentPowerDivisions.value = []
    selectedPowerDivision.value = ''
  }
}

const saveElectricPlan = () => {
  // 전기요금제 설정 저장 로직
  if (!selectedElectricPlan.value) {
    alert('전기요금제를 선택해주세요.')
    return
  }
  
  const selectedPlan = availableElectricPlans.value.find(plan => plan.code === selectedElectricPlan.value)
  const selectedDivision = currentPowerDivisions.value.find(div => div.code === selectedPowerDivision.value)
  
  buildingForm.value.electricRatePlan = selectedElectricPlan.value
  buildingForm.value.powerDivision = selectedPowerDivision.value
  buildingForm.value.threshold = meterReadingDay.value  // meterReadingDay를 threshold로 저장
  buildingForm.value.contractPower = contractPower.value
  
  // 표시용 텍스트 설정
  buildingForm.value.electricPlanText = selectedPlan ? selectedPlan.name : ''
  if (selectedDivision) {
    buildingForm.value.electricPlanText += ` - ${selectedDivision.name}`
  }
  
  console.log('전기요금제 설정 저장:', {
    electricRatePlan: selectedElectricPlan.value,
    powerDivision: selectedPowerDivision.value,
    threshold: meterReadingDay.value,  // 검침일이 threshold로 저장됨
    contractPower: contractPower.value
  })
  
  closeElectricPlanModal()
}

const saveBuilding = async () => {
  try {
    // 폼 유효성 검사
    if (!buildingForm.value.name || !buildingForm.value.address) {
      alert('필수 정보를 모두 입력해주세요.')
      return
    }

    if (isEditMode.value) {
      // 수정
      await apiService.updateBuilding(buildingForm.value.id, buildingForm.value)
      alert('실증지 정보가 성공적으로 수정되었습니다.')
      // 현재 페이지 유지
      await apiService.getBuildings(currentPage.value - 1, itemsPerPage.value)
    } else {
      // 추가
      await apiService.createBuilding(buildingForm.value)
      alert('실증지가 성공적으로 등록되었습니다.')
      // 새로 추가된 항목을 보기 위해 첫 번째 페이지로 이동
      currentPage.value = 1
      await apiService.getBuildings(0, itemsPerPage.value)
    }
    
    closeBuildingModal()
    
  } catch (error) {
    console.error('실증지 저장 실패:', error)
    if (error.message) {
      alert('실증지 저장에 실패했습니다: ' + error.message)
    } else {
      alert('실증지 저장에 실패했습니다.')
    }
  }
}

const deleteBuildingConfirm = async (building) => {
  if (confirm(`${building.name}을(를) 삭제하시겠습니까?`)) {
    try {
      await apiService.deleteBuilding(building.id)
      alert('실증지가 삭제되었습니다.')
      
      // 목록 새로고침 (currentPage는 1-based이므로 0-based로 변환)
      await apiService.getBuildings(currentPage.value - 1, itemsPerPage.value)
      
    } catch (error) {
      console.error('실증지 삭제 실패:', error)
      alert('실증지 삭제에 실패했습니다.')
    }
  }
}

const deleteSelected = async () => {
  if (selectedBuildings.value.length === 0) {
    alert('삭제할 실증지를 선택해주세요.')
    return
  }
  
  if (confirm('선택한 실증지를 삭제하시겠습니까?')) {
    try {
      // 선택된 실증지들을 하나씩 삭제
      await Promise.all(
        selectedBuildings.value.map(buildingId => 
          apiService.deleteBuilding(buildingId)
        )
      )
      alert('선택한 실증지가 삭제되었습니다.')
      selectedBuildings.value = []
      
      // 목록 새로고침 (currentPage는 1-based이므로 0-based로 변환)
      await apiService.getBuildings(currentPage.value - 1, itemsPerPage.value)
      
    } catch (error) {
      console.error('실증지 삭제 실패:', error)
      alert('실증지 삭제에 실패했습니다.')
    }
  }
}

const handlePageChange = async (page) => {
  const previousPage = currentPage.value
  
  console.log(`🔄 페이지 변경 시도: ${previousPage} → ${page}`)
  console.log(`📊 현재 상태:`)
  console.log(`  - 전체 실증지: ${totalBuildings.value}개`)
  console.log(`  - 페이지당 기본 항목: ${itemsPerPage.value}개`)
  console.log(`  - 계산된 총 페이지: ${totalPages.value}페이지`)
  
  // 유효한 페이지 범위 체크
  if (page < 1 || page > totalPages.value) {
    console.warn(`⚠️ 잘못된 페이지 요청: ${page} (유효 범위: 1-${totalPages.value})`)
    alert(`페이지 ${page}는 존재하지 않습니다. (전체 ${totalPages.value}페이지)`)
    return
  }
  
  // 동적 pageSize 계산 - 2페이지부터는 안전하게 1개씩 요청
  let dynamicPageSize = itemsPerPage.value
  
  if (page > 1) {
    // 2페이지부터는 1개씩 안전하게 요청
    dynamicPageSize = 1
    console.log(`� 안전 모드: 2페이지 이후는 1개씩 요청 (${itemsPerPage.value}개 → ${dynamicPageSize}개)`)
  }
  
  console.log(`🎯 실제 요청:`)
  console.log(`  - 요청할 백엔드 페이지: ${page} (1-based)`)
  console.log(`  - 요청할 pageSize: ${dynamicPageSize}개`)
  console.log(`  - 설명: ${page === 1 ? '첫 페이지 - 최대 개수 요청' : '2페이지 이후 - 안전하게 1개씩 요청'}`)
  
  try {
    currentPage.value = page
    await apiService.getBuildings(page - 1, dynamicPageSize)
    console.log(`✅ 페이지 ${page} 로딩 성공`)
  } catch (error) {
    console.error('❌ 페이지 변경 중 오류:', error)
    
    // 페이지를 이전 상태로 되돌림
    currentPage.value = previousPage
    
    // 상세한 에러 분석
    let errorMessage = '페이지를 불러오는 데 실패했습니다.'
    
    if (error.response?.status === 500) {
      console.error(`🚫 500 에러 분석:`)
      console.error(`  - 요청 페이지: ${page}`)
      console.error(`  - 백엔드 API: /building?page=${page}&pageSize=${dynamicPageSize}`)
      console.error(`  - 가능한 원인: 동적 pageSize 계산 오류 또는 백엔드 데이터 변경`)
      errorMessage = `페이지 ${page} 데이터 로딩에 실패했습니다. 데이터가 변경되었을 수 있습니다.`
    } else if (error.response?.status === 404) {
      errorMessage = '요청한 페이지를 찾을 수 없습니다.'
    } else if (!error.response) {
      errorMessage = '네트워크 연결을 확인해주세요.'
    }
    
    alert(errorMessage)
  }
}// 이미지 경로 반환 함수
const getImagePath = (buildingId) => {
  // import된 이미지 사용 (개발/배포 환경 모두 지원)
  return testImage
}

// 연결된 사용자 목록 가져오기 (백엔드 연결 전까지 임시 데이터 반환)
const getConnectedUsers = (building) => {
  // 백엔드 연결 시 실제 데이터 사용
  if (building.connectedUsers && building.connectedUsers.length > 0) {
    return building.connectedUsers
  }
  
  // 임시 하드코딩 데이터 (백엔드 연결 전까지 사용)
  return [
    { id: 1, username: 'haezoom', displayName: '해줌관리자' },
    { id: 2, username: 'prodadmin', displayName: '슈퍼관리자' },
    { id: 3, username: 'hzuser', displayName: '해줌사용자' },
    { id: 4, username: 'lottemart', displayName: '김태훈' },
    { id: 5, username: 'haezoom', displayName: '해줌관리자' },
    { id: 6, username: 'prodadmin', displayName: '슈퍼관리자' }
  ]
}

// 생성될 때 더 많은 데이터 생성
onMounted(async () => {
  // 인증 확인 - 토큰이 없으면 개발용 토큰 설정
  if (!authStore.isAuthenticated) {
    console.log('토큰이 없습니다. 개발용 토큰을 설정합니다.')
    authStore.setDevToken()
  }
  
  console.log('인증 상태 확인 완료:', authStore.user)
  
  // 다른 API 먼저 테스트 (인증 확인용)
  try {
    console.log('사용자 API 테스트 중...')
    const usersResponse = await authAPI.getUsers(0, 5)
    console.log('사용자 API 성공:', usersResponse.data)
  } catch (userError) {
    console.error('사용자 API 실패:', userError.response?.status, userError.response?.data)
  }
  
  // 임시 데이터 생성 (개발용)
  for (let i = 3; i <= 9; i++) {
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
  
  // 실제 백엔드 API 연결
  try {
    await apiService.getBuildings(0, itemsPerPage.value)
  } catch (error) {
    console.error('초기 데이터 로딩 실패:', error)
    
    let errorMessage = '실증지 데이터를 불러오는 데 실패했습니다.'
    
    if (error.response?.status === 401) {
      errorMessage = '인증이 필요합니다. 다시 로그인해주세요.'
    } else if (error.response?.status === 500) {
      errorMessage = '서버에 문제가 발생했습니다. 관리자에게 문의하세요.'
    } else if (!error.response) {
      errorMessage = '네트워크 연결을 확인해주세요.'
    }
    
    alert(errorMessage)
  }
})
</script>

<style scoped>
img{
  width: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 15px;
}

.header-title-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.page-header h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.buildings-count-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.total-count {
  color: #e16349;
  font-weight: 600;
}

.current-page-info {
  color: #666;
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
  grid-template-columns: repeat(auto-fill, minmax(700px, 1fr));
  align-items: flex-start;
  gap: 20px;
  height: 706px;
  padding: 30px;
  background: #f8f8f8;
  border-radius: 20px;
}

.building-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #E4E4E4;
  transition: transform 0.2s;
  padding: 16px;
  display: grid;
  grid-template-columns: 168px 1fr;
  column-gap: 20px;
  align-items: center;
  position: relative;
}

.building-card:hover {
  transform: translateY(-2px);
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
}

/* 호버 오버레이 스타일 */
.building-hover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 10;
  border-radius: 10px;
  display: grid;
  grid-template-columns: 150px 1fr;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(5px);
  padding: 20px;
}

.building-card:hover .building-hover-overlay {
  opacity: 1;
  visibility: visible;
}

/* 상세보기 버튼 영역 (좌측) */
.detail-view-section {
  width: 108px;
  height: 108px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  margin-left: 14px;
}

.detail-view-btn {
  width: 100%;
  height: 100%;
  background: #424242;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 100%;
  color: white;
  padding: 12px 20px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.detail-view-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
}

/* 관리자 정보 영역 (우측) */

.admin-info-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 15px;
  color: white;
}

.connected-users {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 120px;
  overflow-y: auto;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* 스크롤바 스타일 */
.connected-users::-webkit-scrollbar {
  scrollbar-width: thin;
  background: transparent;
  width: 4px !important;
}

.connected-users::-webkit-scrollbar-track {
  /* background: rgba(255, 255, 255, 0.1); */
  border-radius: 2px;
}

.connected-users::-webkit-scrollbar-thumb {
  background:#ffffff !important;
  border-radius: 2px;
}

.connected-users::-webkit-scrollbar-thumb:hover {
  background: #ffffff !important;
}

.user-item {
  display: flex;
  align-items: center;
  padding: 4px 12px;

}

.user-id {
  font-size: 14px;
  color: white;
}

/* 액션 메뉴 (우측 상단) */
.action-menu {
  position: absolute;
  top: 15px;
  right: 15px;
  z-index: 20;
}

.action-menu-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: background 0.2s;
}

.action-menu-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.action-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  padding: 10px;
  background: #fff;
  border: 1px solid #e4e4e4;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 120px;
  overflow: hidden;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.2s ease;
  z-index: 30;
}

.action-menu:hover .action-dropdown {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-item {
  width: 100%;
  padding: 12px 16px;
  border-radius: 4px;
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  color: #424242;
  transition: background 0.2s;
}

.dropdown-item:first-child{
  margin-bottom: 10px;
}
.dropdown-item:hover {
  background: #E1E1E1;
}

.dropdown-icon {
  width: 16px;
  height: 16px;
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

.building-actions {
  margin: 0 auto;
  padding: 8px 0;
  background: #f8f8f8;
  border: 1px solid #e4e4e4;
  border-radius: 10px;
  text-align: center;
  
}

.admin-info {
  font-size: 12px;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
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
  gap: 16px;
}

.image-upload-area {
  width: 100%;
  height: 200px;
  border: 2px dashed #ddd;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background-color: #f9f9f9;
}

.image-preview {
  position: relative;
  width: 100%;
  height: 100%;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}

.remove-image-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-placeholder {
  text-align: center;
}

.upload-text {
  color: #666;
  margin-bottom: 15px;
  line-height: 1.5;
}

.upload-hint {
  font-size: 12px;
  color: #999;
}

.upload-btn {
  padding: 8px 20px;
  background: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  color: #666;
}

.form-group {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 8px;
  align-items: center;
}
.form-group.desc {
  align-items: flex-start;
}
.form-group label {
  font-weight: 500;
  color: #333;
  font-size: 15px;
}

.form-group input,
.form-group textarea,
.form-select {
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 15px;
  outline: none;
}
.form-select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23374151'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3e%3c/path%3e%3c/svg%3e");
    background-size: 20px;
    background-position: right 12px center;
    background-repeat: no-repeat;
    background-size: 16px;
}

.form-group textarea {
  resize: none;
  width: 100%;
}

.textarea-container {
  position: relative;
}

.char-count {
  position: absolute;
  bottom: 8px;
  right: 12px;
  font-size: 12px;
  color: #666;
  background: rgba(255, 255, 255, 0.9);
  padding: 2px 4px;
  border-radius: 2px;
}

.form-group input:focus,
.form-group textarea:focus,
.form-select:focus {
  border-color: #e74c3c;
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding-top: 10px;
}

.btn-cancel {
  padding: 12px 30px;
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  color: #666;
  font-size: 14px;
}

.btn-save {
  padding: 12px 30px;
  background: #e74c3c;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: white;
  font-size: 14px;
}

/* 사용자 선택 모달 스타일 */
.user-select-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.search-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.search-info {
  font-weight: 500;
  color: #333;
}

.search-tag {
  background: #f0f0f0;
  padding: 8px 12px;
  border-radius: 4px;
  display: inline-block;
  font-size: 14px;
  color: #666;
}

.search-controls {
  display: flex;
  gap: 10px;
  align-items: center;
}

.search-type {
  padding: 8px 25px 8px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23374151'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3e%3c/path%3e%3c/svg%3e");
  background-size: 20px;
  background-position: right 5px center;
  background-repeat: no-repeat;
  background-size: 16px;
}

.search-input-modal {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.search-btn-modal {
  padding: 8px 16px;
  background: #333;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.user-table {
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.table-header {
  display: flex;
  background: #e74c3c;
  color: white;
  font-weight: 500;
}
.table-header .table-cell{
  color: #fff;
}
.table-row {
  display: flex;
  border-bottom: 1px solid #eee;
}

.table-row.selected {
  background: #ffe6e6;
}

.table-cell {
  flex: 1;
  padding: 12px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #424242;
}

/* 전기요금제 선택 모달 스타일 */
.electric-plan-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-input {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
}

.form-input:focus {
  border-color: #007bff;
}

/* 실증지 상세보기 모달 스타일 */
.building-detail-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.detail-image-section {
  text-align: center;
}

.detail-image {
  width: 100%;
  height: 200px;
  margin: 0 auto;
  border-radius: 10px;
  overflow: hidden;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.detail-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail-section-title {
  font-size: 14px;
  font-weight: 700;
  color: #424242;
  padding-bottom: 8px;
}

.detail-info-item:not(:last-child) {
  margin-bottom: 10px;
}

.detail-info-item {
  display: grid;
  grid-template-columns: 120px 1fr;
  align-items: center;
}

.detail-info-item label {
  font-weight: 500;
  color: #666;
  font-size: 13px;
}

.detail-info-item span {
  padding: 8px 10px;
  background: #f8f9fa;
  border: 1px solid #e4e4e4;
  border-radius: 8px;
  color: #333;
  font-size: 13px;
}

.detail-admin-section {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #e4e4e4;
}

.admin-main-info {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  color: #333;
}

.admin-detail-icon {
  width: 20px;
  height: 20px;
  opacity: 0.7;
}

.detail-users-section {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 10px;
  border: 1px solid #e4e4e4;
}

.detail-users-grid {
  /* display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 12px; */
  max-height: 200px;
  overflow-y: auto;
}

.detail-user-item {
  background: white;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #e4e4e4;
  transition: all 0.2s ease;
}
.detail-user-item:not(:last-child) {
  margin-bottom: 4px;
}

.detail-user-item:hover {
  border-color: #e74c3c;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 4px;
}

.user-name {
  font-weight: 500;
  color: #424242;
  font-size: 12px;
}

.user-id-text {
  color: #666;
  font-size: 12px;
}

/* 위젯 설정 모달 스타일 */
.widget-settings-form {
  padding: 0;
}

.building-info-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e0e0e0;
}

.building-info-header h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.building-info-header p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.pages-section {
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.pages-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.page-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #f9f9f9;
}

.page-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.page-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.page-meta {
  font-size: 12px;
  color: #666;
}

.page-actions {
  display: flex;
  gap: 8px;
}

/* 상세보기 사용자 목록 스크롤바 스타일 */
.detail-users-grid::-webkit-scrollbar {
  width: 6px;
}

.detail-users-grid::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.detail-users-grid::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.detail-users-grid::-webkit-scrollbar-thumb:hover {
  background: #e16349;
}
</style>