<!-- components/common/BasePagination.vue -->
<template>
  <div class="pagination-container">
    <div class="pagination-controls">
      <!-- 이전 버튼 -->
      <button 
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="arrow-btn"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      
      <!-- 페이지 번호들 -->
      <div class="page-numbers">
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="goToPage(page)"
          :class="{ active: page === currentPage }"
          class="page-number"
        >
          {{ page }}
        </button>
      </div>
      
      <!-- 다음 버튼 -->
      <button 
        @click="goToPage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="arrow-btn"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalItems: {
    type: Number,
    required: true
  },
  itemsPerPage: {
    type: Number,
    default: 10
  },
  totalPages: {
    type: Number,
    required: false
  }
})

const emit = defineEmits(['page-change'])

// totalPages prop이 있으면 사용하고, 없으면 계산
const computedTotalPages = computed(() => {
  if (props.totalPages && props.totalPages > 0) {
    console.log('BasePagination: 백엔드 totalPages 사용:', props.totalPages)
    return props.totalPages
  }
  const calculated = Math.ceil(props.totalItems / props.itemsPerPage)
  console.log('BasePagination: 계산된 totalPages 사용:', calculated, '(totalItems:', props.totalItems, ', itemsPerPage:', props.itemsPerPage, ')')
  return calculated
})

const startItem = computed(() => (props.currentPage - 1) * props.itemsPerPage + 1)
const endItem = computed(() => Math.min(props.currentPage * props.itemsPerPage, props.totalItems))

const visiblePages = computed(() => {
  const pages = []
  const totalPagesValue = computedTotalPages.value
  const start = Math.max(1, props.currentPage - 5)
  const end = Math.min(totalPagesValue, props.currentPage + 5)
  
  console.log('BasePagination visiblePages 계산:', {
    currentPage: props.currentPage,
    totalPages: totalPagesValue,
    start,
    end
  })
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

const goToPage = (page) => {
  const totalPagesValue = computedTotalPages.value
  console.log(`BasePagination goToPage: ${page}, totalPages: ${totalPagesValue}, currentPage: ${props.currentPage}`)
  
  // totalPages가 0이면 페이지 이동 불가
  if (totalPagesValue === 0) {
    console.warn('BasePagination: totalPages가 0이므로 페이지 이동 불가')
    return
  }
  
  // 유효한 페이지 범위 체크
  if (page >= 1 && page <= totalPagesValue && page !== props.currentPage) {
    console.log(`BasePagination: 페이지 ${page}로 이동`)
    emit('page-change', page)
  } else {
    console.warn(`BasePagination: 유효하지 않은 페이지 이동 시도 - page: ${page}, totalPages: ${totalPagesValue}`)
  }
}
</script>

<style scoped>
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.arrow-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  transition: all 0.2s;
}

.arrow-btn:hover:not(:disabled) {
  background: #f0f0f0;
  color: #333;
}

.arrow-btn:disabled {
  color: #ccc;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 0 8px;
}

.page-number {
  width: 40px;
  height: 40px;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 500;
  color: #666;
  transition: all 0.2s;
}

.page-number:hover:not(.active) {
  background: #f0f0f0;
  color: #333;
}

.page-number.active {
  background: #000;
  color: white;
}
</style>