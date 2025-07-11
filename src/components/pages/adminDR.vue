<!-- DR 관리 페이지 -->
<template>
  <div class="admin-dr">
    <!-- 페이지 헤더 -->
    <div class="page-header">
      <h1>DR 관리</h1>
      <div class="header-actions">
        <button @click="openDRModal()" class="btn btn-primary">
          DR 추가
        </button>
        <button @click="deleteSelected" :disabled="selectedDRs.length === 0" class="btn btn-danger">
          DR 삭제
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
            <th>시작시간</th>
            <th>종료시간</th>
            <th>유형</th>
            <th>실증지</th>
            <th>수행여부</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(dr, index) in paginatedDRs" :key="dr.id">
            <td>
              <input 
                type="checkbox" 
                :value="dr.id"
                v-model="selectedDRs"
              />
            </td>
            <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
            <td>{{ dr.startTime }}</td>
            <td>{{ dr.endTime }}</td>
            <td>{{ dr.type }}</td>
            <td>{{ dr.building }}</td>
            <td>
              <span :class="['status-badge', dr.status === '수행' ? 'status-complete' : 'status-pending']">
                {{ dr.status }}
              </span>
            </td>
            <td>
              <button @click="openDRModal(dr)" class="btn btn-sm btn-edit">
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
      :total-items="filteredDRs.length"
      @page-change="handlePageChange"
    />
    
    <!-- DR 추가/수정 모달 -->
    <BaseModal 
      :is-open="showDRModal" 
      :title="isEditMode ? 'DR 수정' : 'DR 추가'"
      @close="closeDRModal"
      @confirm="saveDR"
    >
      <div class="dr-form">
        <div class="form-row">
          <div class="form-group">
            <label for="startTime">시작시간</label>
            <input 
              id="startTime"
              v-model="drForm.startTime" 
              type="datetime-local"
            />
          </div>
          
          <div class="form-group">
            <label for="endTime">종료시간</label>
            <input 
              id="endTime"
              v-model="drForm.endTime" 
              type="datetime-local"
            />
          </div>
        </div>
        
        <div class="form-group">
          <label for="type">유형</label>
          <select id="type" v-model="drForm.type">
            <option value="">유형 선택</option>
            <option value="중소형 DR">중소형 DR</option>
            <option value="대형 DR">대형 DR</option>
            <option value="긴급 DR">긴급 DR</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="building">실증지</label>
          <select id="building" v-model="drForm.building">
            <option value="">실증지 선택</option>
            <option value="롯데마트 대전점">롯데마트 대전점</option>
            <option value="롯데마트 금천점">롯데마트 금천점</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="status">수행여부</label>
          <select id="status" v-model="drForm.status">
            <option value="미수행">미수행</option>
            <option value="수행">수행</option>
          </select>
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
const drs = ref([
  {
    id: 1,
    startTime: '2025-07-02 08:00',
    endTime: '2025-07-04 18:00',
    type: '중소형 DR',
    building: '롯데마트 대전점',
    status: '미수행'
  },
  {
    id: 2,
    startTime: '2025-07-02 08:00',
    endTime: '2025-07-04 18:00',
    type: '중소형 DR',
    building: '롯데마트 대전점',
    status: '수행'
  }
])

// 모달 관련
const showDRModal = ref(false)
const isEditMode = ref(false)
const selectedDRs = ref([])

// DR 폼 데이터
const drForm = ref({
  id: null,
  startTime: '',
  endTime: '',
  type: '',
  building: '',
  status: '미수행'
})

// 페이지네이션
const currentPage = ref(1)
const itemsPerPage = ref(10)

// 계산된 속성
const filteredDRs = computed(() => drs.value)

const paginatedDRs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredDRs.value.slice(start, end)
})

const totalPages = computed(() => 
  Math.ceil(filteredDRs.value.length / itemsPerPage.value)
)

const allSelected = computed(() => 
  selectedDRs.value.length === paginatedDRs.value.length && paginatedDRs.value.length > 0
)

// 메서드
const openDRModal = (dr = null) => {
  isEditMode.value = !!dr
  if (dr) {
    drForm.value = { ...dr }
  } else {
    drForm.value = {
      id: null,
      startTime: '',
      endTime: '',
      type: '',
      building: '',
      status: '미수행'
    }
  }
  showDRModal.value = true
}

const closeDRModal = () => {
  showDRModal.value = false
}

const saveDR = () => {
  if (isEditMode.value) {
    // 수정
    const index = drs.value.findIndex(d => d.id === drForm.value.id)
    if (index !== -1) {
      drs.value[index] = { ...drForm.value }
    }
  } else {
    // 추가
    const newId = Math.max(...drs.value.map(d => d.id)) + 1
    drs.value.push({ ...drForm.value, id: newId })
  }
  closeDRModal()
}

const deleteSelected = () => {
  if (confirm('선택한 DR을 삭제하시겠습니까?')) {
    drs.value = drs.value.filter(dr => !selectedDRs.value.includes(dr.id))
    selectedDRs.value = []
  }
}

const toggleAllSelection = () => {
  if (allSelected.value) {
    selectedDRs.value = []
  } else {
    selectedDRs.value = paginatedDRs.value.map(dr => dr.id)
  }
}

const handlePageChange = (page) => {
  currentPage.value = page
  selectedDRs.value = []
}

// 생성될 때 더 많은 데이터 생성
onMounted(() => {
  for (let i = 3; i <= 10; i++) {
    drs.value.push({
      id: i,
      startTime: '2025-07-02 08:00',
      endTime: '2025-07-04 18:00',
      type: '중소형 DR',
      building: '롯데마트 대전점',
      status: i % 2 === 0 ? '수행' : '미수행'
    })
  }
})
</script>

<style scoped>
.admin-dr {
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

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-complete {
  background-color: #27ae60;
  color: white;
}

.status-pending {
  background-color: #f39c12;
  color: white;
}

.dr-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
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