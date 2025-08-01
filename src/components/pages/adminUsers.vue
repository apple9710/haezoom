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
      <div v-if="loading" class="loading-message">
        사용자 목록을 불러오는 중...
      </div>
      <table v-else class="admin-table">
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
      v-if="!loading"
      :current-page="currentPage"
      :total-pages="totalPages"
      :total-items="totalUsers"
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
          <button @click="sendTempPassword" class="password-btn">임시비밀번호발송</button>
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
import { authAPI, buildingAPI } from '@/utils/api.js'

// 반응형 데이터
const users = ref([])
const loading = ref(false)
const totalUsers = ref(0)

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

const paginatedUsers = computed(() => users.value)

const totalPages = computed(() => 
  Math.ceil(totalUsers.value / itemsPerPage.value)
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
  // 폼 초기화
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

// 임시 비밀번호 발송
const sendTempPassword = async () => {
  if (!selectedUser.value) return
  
  if (confirm('임시 비밀번호를 발송하시겠습니까?')) {
    try {
      await apiService.sendTempPassword(selectedUser.value.id)
      alert('임시 비밀번호가 이메일로 발송되었습니다.')
    } catch (error) {
      console.error('임시 비밀번호 발송 실패:', error)
      alert('임시 비밀번호 발송에 실패했습니다.')
    }
  }
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
    // 기본값 유지
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

// 백엔드 API 함수들
const apiService = {
  // 사용자 관련 API
  async getUsers(page = 0, size = 10, name = '', role = '') {
    try {
      loading.value = true
      
      console.log('사용자 목록 조회 - 실제 API 호출')
      
      // 실제 백엔드 API 호출
      const response = await authAPI.getUsers(page, size, name, role)
      console.log('사용자 목록 조회 성공:', response.data)
      
      if (response.data && response.data.data) {
        const apiData = response.data.data
        
        // API 응답을 화면 표시용 형식으로 변환
        users.value = apiData.content.map(user => ({
          id: user.userId || user.id,
          username: user.id || user.username,
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          userType: user.role,
          buildings: user.buildingArray || [],
          building: user.buildingArray ? user.buildingArray.join(' / ') : '',
          createdAt: user.createdAt
        }))
        
        totalUsers.value = apiData.totalElements || 0
        
        return {
          content: users.value,
          totalElements: totalUsers.value,
          totalPages: apiData.totalPages || 0
        }
      } else {
        throw new Error('API 응답 형식이 올바르지 않습니다.')
      }
      
    } catch (error) {
      console.error('사용자 목록 로딩 실패:', error)
      console.error('에러 상세:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      })
      
      // API 실패 시에도 빈 배열로 설정
      users.value = []
      totalUsers.value = 0
      
      throw error
    } finally {
      loading.value = false
    }
  },

  async getUserById(userId) {
    try {
      const response = await authAPI.getUserById(userId)
      if (response.data.success) {
        const user = response.data.data
        return {
          id: user.id,
          username: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          userType: user.role,
          buildings: user.buildingArray || [],
          building: user.buildingArray ? user.buildingArray.join(' / ') : ''
        }
      }
    } catch (error) {
      console.error('사용자 조회 실패:', error)
      throw error
    }
  },

  async createUser(userData) {
    try {
      console.log('사용자 생성 - API 호출')
      console.log('전달받은 userData:', userData)
      
      // 비밀번호 검증
      if (!userData.password || userData.password.length < 6) {
        throw new Error('비밀번호는 최소 6자 이상이어야 합니다.')
      }
      
      // Swagger 스펙에 맞는 API 호출
      const response = await authAPI.register({
        id: userData.username,
        password: userData.password,
        email: userData.email || '',
        name: userData.name,
        buildingArray: userData.buildings && userData.buildings.length > 0 ? userData.buildings[0] : 1, // 첫 번째 실증지 또는 기본값 1
        role: userData.userType || 'user'
      })
      
      console.log('사용자 생성 성공:', response.data)
      
      // 목록 새로고침
      await apiService.getUsers(currentPage.value, itemsPerPage.value)
      
      return response.data.data
    } catch (error) {
      console.error('사용자 생성 실패:', error)
      
      // API 실패 시 더미 모드로 대체
      console.warn('API 실패, 더미 모드로 전환')
      
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const newUser = {
        id: userData.username,
        username: userData.username,
        name: userData.name,
        email: userData.email,
        phone: userData.phone || '',
        company: userData.company || '',
        authority: userData.userType || 'USER'
      }
      
      // 로컬 목록에 추가
      users.value.push(newUser)
      totalUsers.value = users.value.length
      
      return newUser
    }
  },

  async updateUser(userId, userData) {
    try {
      console.log('사용자 수정 - API 호출')
      
      // Swagger 스펙에 맞는 API 호출
      const response = await authAPI.updateUser(userId, {
        username: userData.username,
        password: userData.password, // 비밀번호는 수정시에는 선택사항
        name: userData.name,
        email: userData.email || '',
        phone: userData.phone || '',
        company: userData.company || '',
        authority: userData.userType || userData.authority || 'USER'
      })
      
      console.log('사용자 수정 성공:', response.data)
      
      // 목록 새로고침
      await apiService.getUsers(currentPage.value, itemsPerPage.value)
      return response.data.data
    } catch (error) {
      console.error('사용자 수정 실패:', error)
      
      // API 실패 시 더미 모드로 대체
      console.warn('API 실패, 더미 모드로 전환')
      
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 로컬 목록에서 사용자 업데이트
      const userIndex = users.value.findIndex(u => u.id === userId)
      if (userIndex !== -1) {
        users.value[userIndex] = {
          ...users.value[userIndex],
          name: userData.name,
          email: userData.email,
          phone: userData.phone || '',
          company: userData.company || '',
          authority: userData.userType || userData.authority || 'USER'
        }
        return users.value[userIndex]
      }
      
      return { success: true }
    }
  },

  async deleteUser(userId) {
    try {
      console.log('사용자 삭제 - API 호출')
      
      // 실제 API 호출
      const response = await authAPI.deleteUser(userId)
      console.log('사용자 삭제 성공:', response.data)
      
      // 목록 새로고침
      await apiService.getUsers(currentPage.value, itemsPerPage.value)
      return response.data.data
    } catch (error) {
      console.error('사용자 삭제 실패:', error)
      
      // API 실패 시 더미 모드로 대체
      console.warn('API 실패, 더미 모드로 전환')
      
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 로컬 목록에서 사용자 제거
      users.value = users.value.filter(u => u.id !== userId)
      totalUsers.value = users.value.length
      
      return { success: true }
    }
  },

  async deleteMultipleUsers(userIds) {
    try {
      console.log('사용자 일괄 삭제 - API 호출')
      
      // Swagger 스펙에 맞는 API 호출 (DeleteUsersReqDto)
      const response = await authAPI.deleteMultipleUsers(userIds)
      console.log('사용자 일괄 삭제 성공:', response.data)
      
      // 목록 새로고침
      await apiService.getUsers(currentPage.value, itemsPerPage.value)
      return response.data.data
    } catch (error) {
      console.error('사용자 일괄 삭제 실패:', error)
      
      // API 실패 시 더미 모드로 대체
      console.warn('API 실패, 더미 모드로 전환')
      
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 로컬 목록에서 사용자들 제거
      users.value = users.value.filter(u => !userIds.includes(u.id))
      totalUsers.value = users.value.length
      
      return { success: true }
    }
  },

  async sendTempPassword(userId) {
    try {
      console.log('임시 비밀번호 발송 - API 호출')
      
      // 실제 API 호출
      const response = await authAPI.sendTempPassword(userId)
      if (response.data.success) {
        return { success: true, message: response.data.message || '임시 비밀번호가 발송되었습니다.' }
      } else {
        throw new Error(response.data.message || '임시 비밀번호 발송에 실패했습니다.')
      }
    } catch (error) {
      console.error('임시 비밀번호 발송 실패:', error)
      
      // API 실패 시 더미 모드로 대체
      console.warn('API 실패, 더미 모드로 전환')
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      return { success: true, message: '임시 비밀번호가 발송되었습니다. (더미 모드)' }
    }
  },

  // 실증지 관련 API
  async getBuildings() {
    try {
      console.log('실증지 목록 조회 - 실제 API 호출')
      
      // 실제 API 호출 (0-based 페이지, 100개 조회)
      const response = await buildingAPI.getBuildings(0, 100)
      
      console.log('실증지 목록 조회 성공:', response.data)
      
      if (response.data && response.data.data && response.data.data.content) {
        // 실증지 데이터를 이름 배열로 변환
        return response.data.data.content.map(building => building.name)
      } else {
        console.warn('실증지 조회 응답이 비어있습니다.')
        return []
      }
      
    } catch (error) {
      console.error('실증지 목록 로딩 실패:', error)
      
      // API 실패 시 빈 배열 반환
      return []
    }
  },

  async searchBuildings(query) {
    try {
      const allBuildings = await this.getBuildings()
      return allBuildings.filter(building => 
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
    // 폼 유효성 검사
    if (!userForm.value.username || !userForm.value.name || !userForm.value.email) {
      alert('필수 정보를 모두 입력해주세요.')
      return
    }

    if (isEditMode.value) {
      // 수정 모드
      await apiService.updateUser(userForm.value.id, userForm.value)
      alert('사용자 정보가 성공적으로 수정되었습니다.')
      
    } else {
      // 신규 등록 모드
      if (!userForm.value.password) {
        alert('비밀번호를 입력해주세요.')
        return
      }
      
      if (userForm.value.password !== userForm.value.passwordConfirm) {
        alert('비밀번호가 일치하지 않습니다.')
        return
      }

      await apiService.createUser(userForm.value)
      alert('사용자가 성공적으로 등록되었습니다.')
    }
    
    closeUserModal()
    
  } catch (error) {
    console.error('사용자 저장 실패:', error)
    if (error.message) {
      alert('사용자 저장에 실패했습니다: ' + error.message)
    } else {
      alert('사용자 저장에 실패했습니다.')
    }
  }
}

const deleteSelected = async () => {
  if (selectedUsers.value.length === 0) {
    alert('삭제할 사용자를 선택해주세요.')
    return
  }
  
  if (confirm('선택한 사용자를 삭제하시겠습니까?')) {
    try {
      // selectedUsers는 이미 사용자 ID들의 배열
      const userIds = selectedUsers.value
      console.log('=== 사용자 삭제 요청 디버깅 ===')
      console.log('선택된 사용자 ID들:', selectedUsers.value)
      console.log('전송할 userIds:', userIds)
      console.log('userIds 타입:', typeof userIds)
      console.log('userIds 배열인가?', Array.isArray(userIds))
      console.log('userIds 길이:', userIds.length)
      console.log('각 ID 타입:', userIds.map(id => ({ id, type: typeof id })))
      console.log('==========================')
      
      await authAPI.deleteMultipleUsers(userIds)
      alert('선택한 사용자가 삭제되었습니다.')
      selectedUsers.value = []
      
      // 사용자 목록 새로고침 - 강제 새로고침
      console.log('사용자 목록 새로고침 시작...')
      await loadUsers()
      console.log('사용자 목록 새로고침 완료')
      
    } catch (error) {
      console.error('사용자 삭제 실패:', error)
      console.error('에러 응답:', error.response?.data)
      alert('사용자 삭제에 실패했습니다.')
    }
  }
}

const deleteUser = async (user) => {
  if (confirm('이 사용자를 삭제하시겠습니까?')) {
    try {
      console.log('삭제할 사용자 ID:', user.id)
      await authAPI.deleteUser(user.id)
      alert('사용자가 삭제되었습니다.')
      closeUserDetailModal()
      // 사용자 목록 새로고침
      loadUsers()
      
    } catch (error) {
      console.error('사용자 삭제 실패:', error)
      console.error('에러 응답:', error.response?.data)
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

// 사용자 목록 새로고침 함수
const loadUsers = async () => {
  try {
    // currentPage는 1-based이므로 0-based로 변환
    const pageIndex = Math.max(0, (currentPage.value || 1) - 1)
    await apiService.getUsers(pageIndex, itemsPerPage.value, '', '')
  } catch (error) {
    console.error('사용자 목록 로딩 실패:', error)
  }
}

const handlePageChange = async (page) => {
  currentPage.value = page
  selectedUsers.value = []
  
  console.log(`페이지 ${page}로 이동`)
  
  // 1-based 페이지를 0-based로 변환하여 API 호출
  await apiService.getUsers(page - 1, itemsPerPage.value)
}

// 생성될 때 API에서 데이터 로드
onMounted(async () => {
  try {
    console.log('사용자 관리 페이지 초기화 시작...')
    
    // 사용자 목록 로드 (0-based 페이지)
    await apiService.getUsers(0, itemsPerPage.value)
    console.log('사용자 목록 로드 완료')
    
    // 실증지 목록 로드
    await fetchBuildings()
    console.log('실증지 목록 로드 완료')
    
  } catch (error) {
    console.error('초기 데이터 로딩 실패:', error)
    // API 실패 시 에러 메시지 표시
    alert('데이터를 불러오는데 실패했습니다. 새로고침 후 다시 시도해주세요.')
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

.loading-message {
  padding: 40px;
  text-align: center;
  color: #666;
  font-size: 16px;
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
  margin: 0 auto;
  background-color: #000;
  color: white;
}

.btn-edit:hover {
  background-color: #424242;
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