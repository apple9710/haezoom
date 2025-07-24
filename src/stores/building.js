import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { buildingAPI, codeAPI } from '@/utils/api'

export const useBuildingStore = defineStore('building', () => {
  // 상태
  const buildings = ref([])
  const selectedBuilding = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // 계산된 속성
  const buildingOptions = computed(() => {
    return buildings.value.map(building => ({
      id: building.codeValue || building.id,
      name: building.codeName || building.name,
      description: building.codeDesc || building.description,
      ...building
    }))
  })

  // 액션
  const fetchBuildings = async () => {
    loading.value = true
    error.value = null
    
    try {
      console.log('건물 목록 조회 중...')
      const response = await buildingAPI.getBuildings()
      
      if (response.data) {
        // 백엔드 응답 구조에 맞게 데이터 처리
        buildings.value = response.data.data || response.data || []
        console.log('건물 목록 조회 성공:', buildings.value)
      } else {
        buildings.value = []
      }
    } catch (err) {
      console.error('건물 목록 조회 실패:', err)
      error.value = err.response?.data?.message || '건물 목록을 불러올 수 없습니다.'
      
      // 임시 데이터 제공 (개발용)
      buildings.value = [
        {
          codeValue: 'BUILDING001',
          codeName: '해줌 본사',
          codeDesc: '서울시 강남구'
        },
        {
          codeValue: 'BUILDING002', 
          codeName: '롯데마트 대전점',
          codeDesc: '대전시 서구'
        },
        {
          codeValue: 'BUILDING003',
          codeName: '롯데마트 금천점', 
          codeDesc: '서울시 금천구'
        },
        {
          codeValue: 'BUILDING004',
          codeName: '시흥과학기술대학교',
          codeDesc: '경기도 시흥시'
        },
        {
          codeValue: 'BUILDING005',
          codeName: '롯데마트 VIC 영등포점',
          codeDesc: '서울시 영등포구'
        }
      ]
    } finally {
      loading.value = false
    }
  }

  const selectBuilding = (building) => {
    selectedBuilding.value = building
    localStorage.setItem('selectedBuilding', JSON.stringify(building))
  }

  const clearSelectedBuilding = () => {
    selectedBuilding.value = null
    localStorage.removeItem('selectedBuilding')
  }

  const initializeBuilding = () => {
    const saved = localStorage.getItem('selectedBuilding')
    if (saved) {
      selectedBuilding.value = JSON.parse(saved)
    }
  }

  return {
    buildings,
    selectedBuilding,
    loading,
    error,
    buildingOptions,
    fetchBuildings,
    selectBuilding,
    clearSelectedBuilding,
    initializeBuilding
  }
})
