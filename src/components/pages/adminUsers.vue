<!-- 사용자 관리 페이지 -->
<template>
  <div class="admin-users">
    <!-- 페이지 헤더 -->
    <div class="page-header">
      <h1>사용자 관리</h1>
      <div class="header-actions">
        <button @click="openUserModal()" class="btn btn-primary">
          사용자 추가
        </button>
        <button @click="deleteSelected" :disabled="selectedUsers.length === 0" class="btn btn-danger">
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
            <th>전화번호</th>
            <th>E-mail</th>
            <th>실증지</th>
            <th>관리</th>
            <th>대시보드</th>
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
            <td>{{ user.username }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.phone }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.building }}</td>
            <td>
              <button @click="openUserModal(user)" class="btn btn-sm btn-edit">
                관리
              </button>
            </td>
            <td>
              <button @click="openDashboard(user)" class="btn btn-sm btn-dashboard">
                대시보드
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
      :title="isEditMode ? '사용자 수정' : '사용자 추가'"
      @close="closeUserModal"
      @confirm="saveUser"
    >
      <div class="user-form">
        <div class="form-group">
          <label for="username">ID</label>
          <input 
            id="username"
            v-model="userForm.username" 
            type="text" 
            :disabled="isEditMode"
            placeholder="사용자 ID"
          />
        </div>
        
        <div class="form-group">
          <label for="name">이름</label>
          <input 
            id="name"
            v-model="userForm.name" 
            type="text" 
            placeholder="사용자 이름"
          />
        </div>
        
        <div class="form-group">
          <label for="phone">전화번호</label>
          <input 
            id="phone"
            v-model="userForm.phone" 
            type="tel" 
            placeholder="전화번호"
          />
        </div>
        
        <div class="form-group">
          <label for="email">E-mail</label>
          <input 
            id="email"
            v-model="userForm.email" 
            type="email" 
            placeholder="이메일"
          />
        </div>
        
        <div class="form-group">
          <label for="building">실증지</label>
          <select id="building" v-model="userForm.building">
            <option value="">실증지 선택</option>
            <option value="롯데마트 금천점">롯데마트 금천점</option>
            <option value="기타 실증지">기타 실증지</option>
          </select>
        </div>
        
        <div class="form-group" v-if="!isEditMode">
          <label for="password">비밀번호</label>
          <input 
            id="password"
            v-model="userForm.password" 
            type="password" 
            placeholder="비밀번호"
          />
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
const users = ref([
  {
    id: 1,
    username: 'haezoom',
    name: '해줌관리자',
    phone: '01012345678',
    email: 'lab@haezoom.com',
    building: '롯데마트 대전점 / 발전량 예측 api + ems / 롯데마트 금천점 / 워스테이브렐 / 시룩과학기술대학교과학원 / 전기업 / 롯데마트 VIC 영등포점...'
  },
  {
    id: 2,
    username: 'haezoom',
    name: '해줌관리자',
    phone: '01012345678',
    email: 'lab@haezoom.com',
    building: '롯데마트 대전점'
  },
  // ...더 많은 사용자 데이터
])

// 모달 관련
const showUserModal = ref(false)
const isEditMode = ref(false)
const selectedUsers = ref([])

// 사용자 폼 데이터
const userForm = ref({
  id: null,
  username: '',
  name: '',
  phone: '',
  email: '',
  building: '',
  password: ''
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
    userForm.value = { ...user }
  } else {
    userForm.value = {
      id: null,
      username: '',
      name: '',
      phone: '',
      email: '',
      building: '',
      password: ''
    }
  }
  showUserModal.value = true
}

const closeUserModal = () => {
  showUserModal.value = false
}

const saveUser = () => {
  if (isEditMode.value) {
    // 수정
    const index = users.value.findIndex(u => u.id === userForm.value.id)
    if (index !== -1) {
      users.value[index] = { ...userForm.value }
    }
  } else {
    // 추가
    const newId = Math.max(...users.value.map(u => u.id)) + 1
    users.value.push({ ...userForm.value, id: newId })
  }
  closeUserModal()
}

const deleteSelected = () => {
  if (confirm('선택한 사용자를 삭제하시겠습니까?')) {
    users.value = users.value.filter(user => !selectedUsers.value.includes(user.id))
    selectedUsers.value = []
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

const openDashboard = (user) => {
  // 대시보드 페이지로 이동
  console.log('대시보드 열기:', user)
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
      building: '롯데마트 대전점'
    })
  }
})
</script>

<style scoped>
.admin-users {
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
  gap: 10px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.btn-primary {
  background-color: #e74c3c;
  color: white;
}

.btn-primary:hover {
  background-color: #c0392b;
}

.btn-danger {
  background-color: #e74c3c;
  color: white;
}

.btn-danger:hover {
  background-color: #c0392b;
}

.btn-danger:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
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

.btn-dashboard {
  background-color: #95a5a6;
  color: white;
}

.btn-dashboard:hover {
  background-color: #7f8c8d;
}

.user-form {
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
.form-group select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #e74c3c;
}
</style>