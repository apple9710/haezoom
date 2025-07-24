<!-- 사용자 관리 페이지 -->
<template>
  <div class="admin-users">
    <!-- 페이지 헤더 -->
    <div class="page-header">
      <h1>사용자 관리</h1>
      <div class="header-actions">
        <button @click="openUserModal()" class="btn">
          <img src="@/assets/images/add.svg" alt="추가" class="btn-icon" />

          사용자 추가
        </button>
        <button @click="deleteSelected" :disabled="selectedUsers.length === 0" class="btn btn-danger">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <mask id="mask0_2337_23821" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
          <rect width="20" height="20" fill="#D9D9D9"/>
          </mask>
          <g mask="url(#mask0_2337_23821)">
          <path d="M5.78125 17.6693C5.25653 17.6693 4.80938 17.4845 4.43979 17.1149C4.07021 16.7453 3.88542 16.2982 3.88542 15.7734V5.05469H2.9375V3.15885H7.38813V2.21094H12.6073V3.15885H17.0679V5.05469H16.12V15.7734C16.12 16.2982 15.9352 16.7453 15.5656 17.1149C15.196 17.4845 14.7489 17.6693 14.2242 17.6693H5.78125ZM14.2242 5.05469H5.78125V15.7734H14.2242V5.05469ZM7.41313 14.1616H9.19438V6.66156H7.41313V14.1616ZM10.811 14.1616H12.5923V6.66156H10.811V14.1616Z" fill="#7F7F7F"/>
          </g>
          </svg>
          사용자 삭제
        </button>
      </div>
    </div>
    
    <!-- 데이터 테이블 -->
    <div class="table-container">
      <table class="admin-table">
        <thead>
          <tr>
            <th class="checkbox-column">
              <input 
                type="checkbox" 
                @change="toggleAllSelection"
                :checked="allSelected"
              />
            </th>
            <th>번호</th>
            <th>ID</th>
            <th>이름</th>
            <!-- <th>전화번호</th> -->
            <th>E-mail</th>
            <th>실증지</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in paginatedUsers" :key="user.id">
            <td>
              <input 
                type="checkbox" 
                :value="user.id"
                v-model="selectedUsers"
              />
            </td>
            <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
            <td class="clickable-cell" @click="openUserDetailModal(user)">{{ user.username }}</td>
            <td class="clickable-cell" @click="openUserDetailModal(user)">{{ user.name }}</td>
            <td class="clickable-cell" @click="openUserDetailModal(user)">{{ user.email }}</td>
            <td class="clickable-cell" @click="openUserDetailModal(user)">{{ user.building }}</td>
            <td>
              <button @click="openUserModal(user)" class="btn btn-sm btn-edit">
                관리
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- 페이지네이션 -->
    <BasePagination
      :current-page="currentPage"
      :total-pages="totalPages"
      :total-items="filteredUsers.length"
      @page-change="handlePageChange"
    />
    
    <!-- 사용자 추가/수정 모달 -->
    <BaseModal 
      :is-open="showUserModal" 
      title="사용자 관리"
      @close="closeUserModal"
      :show-footer="false"
    >
      <div class="user-form">
        
        <div class="form-group">
          <label for="name">이름</label>
          <input 
            id="name"
            v-model="userForm.name" 
            type="text" 
            placeholder="이름을 입력해 주세요"
            class="form-input"
          />
        </div>
        
        <div class="form-group">
          <label for="email">E-mail</label>
          <input 
            id="email"
            v-model="userForm.email" 
            type="email" 
            placeholder="ex@naver.com"
            class="form-input"
          />
        </div>
        
        <div class="form-group">
          <label for="username">ID</label>
          <input 
            id="username"
            v-model="userForm.username" 
            type="text" 
            :disabled="isEditMode"
            placeholder="아이디를 입력해 주세요"
            class="form-input"
          />
        </div>
        
        <div class="form-group">
          <label for="password">암호</label>
          <input 
            id="password"
            v-model="userForm.password" 
            type="password" 
            placeholder="암호를 입력해 주세요 (영문,숫자,특수문자 8~16자 이내)"
            class="form-input"
          />
        </div>
        
        <div class="form-group">
          <label for="passwordConfirm">암호 확인</label>
          <input 
            id="passwordConfirm"
            v-model="userForm.passwordConfirm" 
            type="password" 
            placeholder="암호를 한 번 더 입력해 주세요."
            class="form-input"
          />
        </div>
        
        <div class="form-group">
          <label for="userType">사용자유형</label>
          <select id="userType" v-model="userForm.userType" class="form-select">
            <option value="admin">관리자</option>
            <option value="user">사용자</option>
          </select>
        </div>
        
        <div class="form-group">
          <label>실증지 관리</label>
          <div class="building-management">
            <div class="building-controls">
              <input 
                type="text" 
                :value="buildingDisplayText"
                placeholder="서울특별시 금천구 시흥대로 291"
                class="building-search-input"
                readonly
              />
              <button @click="openBuildingSelectModal" class="building-search-btn">실증지 검색</button>
            </div>
          </div>
        </div>

        <div class="modal-buttons">
          <button @click="closeUserModal" class="btn-cancel">취소</button>
          <button @click="saveUser" class="btn-confirm">확인</button>
        </div>
      </div>
    </BaseModal>

    <!-- 사용자 세부 정보 모달 -->
    <BaseModal 
      :is-open="showUserDetailModal" 
      title="haezoom 님의 사용자 정보"
      @close="closeUserDetailModal"
      :show-footer="false"
    >
      <div class="user-detail">
        <div class="detail-group">
          <label>ID</label>
          <div class="detail-value">{{ selectedUser?.username || 'haezoom' }}</div>
        </div>
        
        <div class="detail-group">
          <label>이름</label>
          <div class="detail-value">{{ selectedUser?.name || '롯데마트 금천점' }}</div>
        </div>
        
        <div class="detail-group">
          <label>전화번호</label>
          <div class="detail-value">{{ selectedUser?.phone || '서울특별시 금천구 시흥대로 291' }}</div>
        </div>
        
        <div class="detail-group">
          <label>E-mail</label>
          <div class="detail-value">{{ selectedUser?.email || 'lab@haezoom.com' }}</div>
        </div>
        
        <div class="detail-group">
          <label>암호</label>
          <button class="password-btn">임시비밀번호발송</button>
        </div>

        <div class="modal-buttons single-button">
          <button @click="closeUserDetailModal" class="btn-close">닫기</button>
        </div>
      </div>
    </BaseModal>

    <!-- 실증지 선택 모달 -->
    <BaseModal 
      :is-open="showBuildingSelectModal" 
      title="실증지검색"
      @close="closeBuildingSelectModal"
      :show-footer="false"
    >
      <div class="building-select">
        <div class="user-buildings-section">
          <label>사용자 실증지 정보</label>
          <div class="selected-buildings-display">
            <span v-for="building in userForm.buildings" :key="building" class="building-tag-selected">
              {{ building }}
              <button @click="removeBuildingFromUser(building)" class="remove-tag">×</button>
            </span>
            <span v-if="!userForm.buildings || userForm.buildings.length === 0" class="no-buildings">선택된 실증지가 없습니다</span>
          </div>
        </div>
        
        <div class="search-section">
          <div class="search-box">
            <select class="search-category">
              <option value="all">전체</option>
              <option value="seoul">서울</option>
              <option value="busan">부산</option>
            </select>
            <input 
              type="text" 
              v-model="buildingSearchQuery"
              placeholder="검색어를 입력해주세요"
              class="search-input"
            />
            <button @click="searchBuildings" class="search-btn">검색</button>
          </div>
        </div>
        
        <div class="building-list-section">
          <div class="list-header">
            <span class="list-title">실증지이름</span>
          </div>
          <div class="building-list">
            <div v-for="building in filteredBuildings" :key="building" class="building-option" :class="{ selected: selectedBuildings.includes(building) }">
              <input 
                type="checkbox" 
                :id="`building-${building}`"
                :value="building"
                v-model="selectedBuildings"
                class="building-checkbox"
                @change="updateBuildingSelection"
              />
              <label :for="`building-${building}`" class="building-label">{{ building }}</label>
            </div>
            <div v-if="filteredBuildings.length === 0" class="no-results">
              검색 결과가 없습니다.
            </div>
          </div>
        </div>

        <div class="modal-buttons">
          <button @click="closeBuildingSelectModal" class="btn-cancel">취소</button>
          <button @click="applyBuildingSelection" class="btn-confirm">선택완료</button>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import BaseModal from '@/components/common/BaseModal.vue'
import BasePagination from '@/components/common/BasePagination.vue'

// 반응형 데이터
const users = ref([
  {
    id: 1,
    username: 'admin',
    name: '관리자',
    phone: '01012345678',
    email: 'admin@haezoom.com',
    building: '해줌 본사',
    userType: 'admin',
    buildings: ['해줌 본사']
  },
  {
    id: 2,
    username: 'haezoom',
    name: '해줌관리자',
    phone: '01012345678',
    email: 'lab@haezoom.com',
    building: '롯데마트 대전점 / 발전량 예측 api + ems / 롯데마트 금천점 / 워스테이브렐 / 시흥과학기술대학교과학원 / 전기업 / 롯데마트 VIC 영등포점...',
    userType: 'manager',
    buildings: ['서울특별시 금천구 시흥대로 291', '롯데마트 금천점', '롯데마트 대전점']
  },
  {
    id: 3,
    username: 'user1',
    name: '김철수',
    phone: '01098765432',
    email: 'user1@example.com',
    building: '롯데마트 금천점',
    userType: 'user',
    buildings: ['롯데마트 금천점']
  },
  {
    id: 4,
    username: 'user2',
    name: '이영희',
    phone: '01087654321',
    email: 'user2@example.com',
    building: '시흥과학기술대학교',
    userType: 'user',
    buildings: ['시흥과학기술대학교']
  },
  {
    id: 5,
    username: 'manager1',
    name: '박관리',
    phone: '01076543210',
    email: 'manager1@example.com',
    building: '롯데마트 VIC 영등포점',
    userType: 'manager',
    buildings: ['롯데마트 VIC 영등포점']
  },
  {
    id: 6,
    username: 'testuser',
    name: '테스트사용자',
    phone: '01065432109',
    email: 'test@example.com',
    building: '롯데마트 대전점',
    userType: 'user',
    buildings: ['롯데마트 대전점']
  }
])

// 모달 관련
const showUserModal = ref(false)
const showUserDetailModal = ref(false)
const showBuildingSelectModal = ref(false)
const isEditMode = ref(false)
const selectedUsers = ref([])
const selectedUserDetail = ref(null)

// 사용자 폼 데이터
const userForm = ref({
  id: null,
  username: '',
  name: '',
  email: '',
  password: '',
  passwordConfirm: '',
  userType: 'user', // 'admin' 또는 'user'
  buildings: [] // 연결된 실증지 목록
})

// 페이지네이션
const currentPage = ref(1)
const itemsPerPage = ref(10)

// 계산된 속성
const filteredUsers = computed(() => users.value)

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredUsers.value.slice(start, end)
})

const totalPages = computed(() => 
  Math.ceil(filteredUsers.value.length / itemsPerPage.value)
)

const allSelected = computed(() => 
  selectedUsers.value.length === paginatedUsers.value.length && paginatedUsers.value.length > 0
)

// 메서드
const openUserModal = (user = null) => {
  isEditMode.value = !!user
  if (user) {
    userForm.value = { 
      ...user, 
      password: '', 
      passwordConfirm: '',
      userType: user.userType || 'user',
      buildings: user.buildings ? [...user.buildings] : []
    }
  } else {
    userForm.value = {
      id: null,
      username: '',
      name: '',
      email: '',
      password: '',
      passwordConfirm: '',
      userType: 'user',
      buildings: []
    }
  }
  showUserModal.value = true
}

const closeUserModal = () => {
  showUserModal.value = false
}

// 사용자 세부 정보 모달 관련
const selectedUser = ref(null)
const openUserDetailModal = (user) => {
  selectedUser.value = user
  showUserDetailModal.value = true
}

const closeUserDetailModal = () => {
  showUserDetailModal.value = false
  selectedUser.value = null
}

const openEditUserModal = () => {
  closeUserDetailModal()
  openUserModal(selectedUser.value)
}

// 실증지 선택 모달 관련
const buildingSearchQuery = ref('')
const selectedBuildings = ref([])
const availableBuildings = ref([
  '롯데마트 금천점',
  '롯데마트 대전점', 
  '서울특별시 금천구 시흥대로 291',
  '부산 해운대점',
  '대구 동성로점',
  '인천 송도점',
  '광주 충장로점',
  '대전 둔산점',
  '울산 삼산점',
  '창원 상남점'
])

const buildingDisplayText = computed(() => {
  if (userForm.value.buildings && userForm.value.buildings.length > 0) {
    return userForm.value.buildings.join(', ')
  }
  return ''
})

const filteredBuildings = computed(() => {
  if (!buildingSearchQuery.value) return availableBuildings.value
  return availableBuildings.value.filter(building => 
    building.toLowerCase().includes(buildingSearchQuery.value.toLowerCase())
  )
})

// 백엔드 API 함수들 (현재는 mock 데이터)
const fetchBuildings = async () => {
  try {
    const buildings = await apiService.getBuildings()
    availableBuildings.value = buildings
  } catch (error) {
    console.error('실증지 목록 로딩 실패:', error)
    alert('실증지 목록을 불러오는데 실패했습니다.')
  }
}

const searchBuildings = async () => {
  try {
    if (buildingSearchQuery.value.trim()) {
      const results = await apiService.searchBuildings(buildingSearchQuery.value)
      // 검색 결과를 filteredBuildings에 반영하기 위해 availableBuildings 업데이트
      availableBuildings.value = results
    } else {
      // 검색어가 없으면 전체 목록 로드
      await fetchBuildings()
    }
  } catch (error) {
    console.error('실증지 검색 실패:', error)
    alert('실증지 검색에 실패했습니다.')
  }
}

const removeBuildingFromUser = (building) => {
  const newBuildings = userForm.value.buildings.filter(b => b !== building)
  userForm.value = {
    ...userForm.value,
    buildings: newBuildings
  }
  
  // 선택된 실증지 목록에서도 제거
  const selectedIndex = selectedBuildings.value.indexOf(building)
  if (selectedIndex > -1) {
    selectedBuildings.value.splice(selectedIndex, 1)
  }
  
  console.log('실증지 제거 후:', userForm.value.buildings)
}

const openBuildingSelectModal = () => {
  // 현재 사용자의 실증지 목록을 선택된 상태로 설정
  selectedBuildings.value = [...(userForm.value.buildings || [])]
  console.log('모달 열기 - 현재 사용자 실증지:', userForm.value.buildings)
  console.log('모달 열기 - 선택된 실증지:', selectedBuildings.value)
  showBuildingSelectModal.value = true
  // 모달이 열릴 때 실증지 목록 새로고침
  fetchBuildings()
}

const closeBuildingSelectModal = () => {
  showBuildingSelectModal.value = false
  buildingSearchQuery.value = ''
  // selectedBuildings.value = [] // 이 부분을 제거하여 선택상태 유지
}

const applyBuildingSelection = async () => {
  // 선택된 실증지들을 사용자 폼에 적용 (새 객체로 교체하여 반응성 확보)
  userForm.value = {
    ...userForm.value,
    buildings: [...selectedBuildings.value]
  }
  console.log('적용된 실증지:', userForm.value.buildings)
  
  // DOM 업데이트를 위해 nextTick 사용
  await nextTick()
  
  closeBuildingSelectModal()
}

const updateBuildingSelection = () => {
  // 실시간으로 선택된 실증지 상태 업데이트
  console.log('선택된 실증지:', selectedBuildings.value)
}

// 백엔드 연결을 위한 API 서비스 함수들
const apiService = {
  // 사용자 관련 API
  async getUsers() {
    try {
      // TODO: 실제 API 엔드포인트로 변경
      // const response = await fetch('/api/users')
      // return await response.json()
      return users.value
    } catch (error) {
      console.error('사용자 목록 로딩 실패:', error)
      throw error
    }
  },

  async createUser(userData) {
    try {
      // TODO: 실제 API 엔드포인트로 변경
      // const response = await fetch('/api/users', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(userData)
      // })
      // return await response.json()
      
      const newId = Math.max(...users.value.map(u => u.id)) + 1
      const newUser = { ...userData, id: newId }
      users.value.push(newUser)
      return newUser
    } catch (error) {
      console.error('사용자 생성 실패:', error)
      throw error
    }
  },

  async updateUser(userId, userData) {
    try {
      // TODO: 실제 API 엔드포인트로 변경
      // const response = await fetch(`/api/users/${userId}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(userData)
      // })
      // return await response.json()
      
      const index = users.value.findIndex(u => u.id === userId)
      if (index !== -1) {
        users.value[index] = { ...userData, id: userId }
        return users.value[index]
      }
    } catch (error) {
      console.error('사용자 수정 실패:', error)
      throw error
    }
  },

  async deleteUser(userId) {
    try {
      // TODO: 실제 API 엔드포인트로 변경
      // await fetch(`/api/users/${userId}`, { method: 'DELETE' })
      
      users.value = users.value.filter(u => u.id !== userId)
    } catch (error) {
      console.error('사용자 삭제 실패:', error)
      throw error
    }
  },

  // 실증지 관련 API
  async getBuildings() {
    try {
      // TODO: 실제 API 엔드포인트로 변경
      // const response = await fetch('/api/buildings')
      // return await response.json()
      return availableBuildings.value
    } catch (error) {
      console.error('실증지 목록 로딩 실패:', error)
      throw error
    }
  },

  async searchBuildings(query) {
    try {
      // TODO: 실제 검색 API 엔드포인트로 변경
      // const response = await fetch(`/api/buildings/search?q=${encodeURIComponent(query)}`)
      // return await response.json()
      
      return availableBuildings.value.filter(building => 
        building.toLowerCase().includes(query.toLowerCase())
      )
    } catch (error) {
      console.error('실증지 검색 실패:', error)
      throw error
    }
  }
}

const saveUser = async () => {
  try {
    if (isEditMode.value) {
      // 수정
      await apiService.updateUser(userForm.value.id, userForm.value)
    } else {
      // 추가
      await apiService.createUser(userForm.value)
    }
    closeUserModal()
  } catch (error) {
    console.error('사용자 저장 실패:', error)
    alert('사용자 저장에 실패했습니다.')
  }
}

const deleteSelected = async () => {
  if (confirm('선택한 사용자를 삭제하시겠습니까?')) {
    try {
      await Promise.all(selectedUsers.value.map(userId => apiService.deleteUser(userId)))
      selectedUsers.value = []
    } catch (error) {
      console.error('사용자 삭제 실패:', error)
      alert('사용자 삭제에 실패했습니다.')
    }
  }
}

const deleteUser = async (user) => {
  if (confirm('이 사용자를 삭제하시겠습니까?')) {
    try {
      await apiService.deleteUser(user.id)
      closeUserDetailModal()
    } catch (error) {
      console.error('사용자 삭제 실패:', error)
      alert('사용자 삭제에 실패했습니다.')
    }
  }
}

const toggleAllSelection = () => {
  if (allSelected.value) {
    selectedUsers.value = []
  } else {
    selectedUsers.value = paginatedUsers.value.map(user => user.id)
  }
}

const handlePageChange = (page) => {
  currentPage.value = page
  selectedUsers.value = []
}

// 생성될 때 더 많은 데이터 생성
onMounted(() => {
  for (let i = 3; i <= 10; i++) {
    users.value.push({
      id: i,
      username: 'haezoom',
      name: '해줌관리자',
      phone: '01012345678',
      email: 'lab@haezoom.com',
      building: '롯데마트 대전점',
      userType: 'user',
      buildings: ['롯데마트 대전점']
    })
  }
})
</script>

<style scoped>

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 15px;
}

.page-header h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.header-actions {
  display: flex;
  gap: 10px;
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

.table-container {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
}

.admin-table th {
  background-color: #e74c3c;
  color: white;
  padding: 12px 8px;
  text-align: center;
  font-weight: 500;
  font-size: 14px;
}

.admin-table td {
  padding: 12px 8px;
  text-align: center;
  border-bottom: 1px solid #eee;
  font-size: 14px;
  color: #424242;
}

.checkbox-column {
  width: 40px;
}

.admin-table tr:hover {
  background-color: #f8f9fa;
}

.btn-sm {
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 3px;
}

.btn-edit {
  background-color: #3498db;
  color: white;
}

.btn-edit:hover {
  background-color: #2980b9;
}

/* 사용자 폼 스타일 */
.user-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 8px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 500;
  color: #333;
  font-size: 14px;
  margin-bottom: 4px;
}

.form-input {
  padding: 12px 16px;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  font-size: 14px;
  background-color: #f8f9fa;
  color: #6c757d;
}

.form-input:focus {
  outline: none;
  border-color: #dee2e6;
  background-color: #fff;
}

.form-input:disabled {
  background-color: #f8f9fa;
  color: #6c757d;
}

.form-select {
  padding: 12px 16px;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  font-size: 14px;
  background-color: #f8f9fa;
  color: #6c757d;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 12px center;
  background-repeat: no-repeat;
  background-size: 16px;
  padding-right: 40px;
}

.building-management {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.building-controls {
  display: flex;
  gap: 8px;
}

.building-search-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  font-size: 14px;
  background-color: #f8f9fa;
  color: #6c757d;
}

.building-search-btn {
  padding: 12px 16px;
  background-color: #f8f9fa;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #6c757d;
  white-space: nowrap;
}

.building-search-btn:hover {
  background-color: #e9ecef;
}

.modal-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 32px;
  padding-top: 24px;
}

.modal-buttons.single-button {
  justify-content: center;
}

.btn-cancel {
  padding: 12px 32px;
  background-color: #f8f9fa;
  color: #6c757d;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  min-width: 80px;
}

.btn-cancel:hover {
  background-color: #e9ecef;
}

.btn-confirm {
  padding: 12px 32px;
  background-color: #e16349;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  min-width: 80px;
}

.btn-confirm:hover {
  background-color: #d55540;
}

.btn-close {
  padding: 12px 32px;
  background-color: #e16349;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  min-width: 80px;
}

.btn-close:hover {
  background-color: #d55540;
}

/* 사용자 세부 정보 모달 스타일 */
.user-detail {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 8px;
}

.detail-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-group label {
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.detail-value {
  padding: 12px 16px;
  background-color: #f8f9fa;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  font-size: 14px;
  color: #6c757d;
}

.password-btn {
  padding: 12px 16px;
  background-color: #f8f9fa;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #6c757d;
  text-align: left;
}

.password-btn:hover {
  background-color: #e9ecef;
}

/* 실증지 선택 모달 스타일 */
.building-select {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 8px;
}

.user-buildings-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.user-buildings-section label {
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.selected-buildings-display {
  min-height: 60px;
  padding: 12px 16px;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  background-color: #f8f9fa;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: flex-start;
}

.building-tag-selected {
  background-color: #e16349;
  color: white;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.remove-tag {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  padding: 0;
  margin: 0;
}

.no-buildings {
  color: #6c757d;
  font-size: 14px;
  font-style: italic;
}

.search-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.search-box {
  display: flex;
  gap: 8px;
}

.search-category {
  padding: 12px 16px;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  font-size: 14px;
  background-color: #f8f9fa;
  color: #6c757d;
  min-width: 80px;
}

.search-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  font-size: 14px;
  background-color: white;
}

.search-input:focus {
  outline: none;
  border-color: #e16349;
}

.search-btn {
  padding: 12px 24px;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;
}

.search-btn:hover {
  background-color: #555;
}

.building-list-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.list-header {
  background-color: #e16349;
  color: white;
  padding: 12px 16px;
  text-align: center;
  border-radius: 8px 8px 0 0;
  font-weight: 500;
}

.list-title {
  font-size: 14px;
}

.building-list {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #e1e5e9;
  border-top: none;
  border-radius: 0 0 8px 8px;
  background-color: white;
}

.building-list::-webkit-scrollbar {
  width: 8px;
}

.building-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.building-list::-webkit-scrollbar-thumb {
  background: #e16349;
  border-radius: 4px;
}

.building-list::-webkit-scrollbar-thumb:hover {
  background: #d55540;
}

.building-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid #f1f3f4;
  cursor: pointer;
}

.building-option:last-child {
  border-bottom: none;
}

.building-option:hover {
  background-color: #f8f9fa;
}

.building-option.selected {
  background-color: #fdf2f0;
}

.building-checkbox {
  margin: 0;
  width: 16px;
  height: 16px;
}

.building-label {
  cursor: pointer;
  flex: 1;
  margin: 0;
  font-size: 14px;
  color: #333;
}

.no-results {
  padding: 20px;
  text-align: center;
  color: #6c757d;
  font-style: italic;
}

/* 클릭 가능한 테이블 셀 스타일 */
.clickable-cell {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.clickable-cell:hover {
  background-color: #f8f9fa !important;
  color: #e16349;
}
</style>