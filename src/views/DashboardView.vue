<template>
  <div class="dashboard-container">
    <AppHeader :selected-building="selectedBuilding" />
    <div class="edit-mode-ing" v-if="isEditMode">
      <span class="left-circle"></span>
      <span>대시보드 수정중</span>
    </div>
    <div class="dashboard-content">
      <!-- 우측 사이드바 (편집모드에서만) -->
      <aside v-if="isEditMode" class="widget-sidebar" :class="{ 'sidebar-hidden': !sidebarOpen }">
        <!-- ...existing sidebar code... -->
        <h3 class="sidebar-title">위젯 추가</h3>
        <div class="widget-categories">
          <!-- ...existing widget categories... -->
          <div class="category-section">
            <h4 class="category-title">전력</h4>
            <div class="data-description">실시간 전력 사용량 모니터링</div>
            <div class="widget-list">
              <div class="widget-item" @click="showWidgetSelector('power_usage', '전력 ')">
                <span class="widget-icon"><img src="@/assets/images/icon/1.png" alt="" /></span>
                <span class="widget-name">위젯 추가</span>
                <span class="widget-arrow">→</span>
              </div>
            </div>
          </div>

          <div class="category-section">
            <h4 class="category-title">태양광</h4>
            <div class="data-description">태양광 발전량 및 예측량</div>
            <div class="widget-list">
              <div
                class="widget-item"
                @click="showWidgetSelector('solar_generation', '태양광 발전량')"
              >
                <span class="widget-icon"><img src="@/assets/images/icon/1.png" alt="" /></span>
                <span class="widget-name">위젯 추가</span>
                <span class="widget-arrow">→</span>
              </div>
            </div>
          </div>

          <div class="category-section">
            <h4 class="category-title">환경 센서</h4>
            <div class="data-description">온도, 습도, 압력 등</div>
            <div class="widget-list">
              <div class="widget-item" @click="showWidgetSelector('environment', '환경 센서')">
                <span class="widget-icon">🌡️</span>
                <span class="widget-name">위젯 추가</span>
                <span class="widget-arrow">→</span>
              </div>
            </div>
          </div>

          <div class="category-section">
            <h4 class="category-title">설비 제어</h4>
            <div class="data-description">기기 제어 및 상태 모니터링</div>
            <div class="widget-list">
              <div
                class="widget-item"
                @click="showWidgetSelector('equipment_control', '설비 제어')"
              >
                <span class="widget-icon">🔘</span>
                <span class="widget-name">위젯 추가</span>
                <span class="widget-arrow">→</span>
              </div>
            </div>
          </div>

          <div class="category-section">
            <h4 class="category-title">시스템 정보</h4>
            <div class="data-description">알람, 상태, 보고서 등</div>
            <div class="widget-list">
              <div class="widget-item" @click="showWidgetSelector('system_info', '시스템 정보')">
                <span class="widget-icon">🔔</span>
                <span class="widget-name">위젯 추가</span>
                <span class="widget-arrow">→</span>
              </div>
            </div>
          </div>

          <div class="category-section">
            <h4 class="category-title">기타</h4>
            <div class="data-description">링크, 이미지 등</div>
            <div class="widget-list">
              <div class="widget-item" @click="showWidgetSelector('misc', '기타')">
                <span class="widget-icon">🔗</span>
                <span class="widget-name">위젯 추가</span>
                <span class="widget-arrow">→</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main class="dashboard-main" :class="{ 'sidebar-open': sidebarOpen }">
        <!-- dashboard-header는 항상 표시 -->
        <div class="dashboard-header">
          <div class="dashboard-date">
            <div class="left_date">{{ currentDate.day }}</div>
            <div class="right-day-month">
              <span>{{ currentDate.dayOfWeek }},</span><br />
              <span>{{ currentDate.month }}</span>
            </div>
            <div class="task">
              <div class="building_name">
                {{ selectedBuilding?.name || 'Green Energy Mode!' }}
              </div>
            </div>
          </div>

          <div class="dashboard-right">
            <div class="welcome-text">
              <span class="user-name"
                ><b>{{ authStore.user?.name || 'ADMIN' }}님</b>
                <span>반가워요 <span class="hand_icon">👋</span></span></span
              >
              <span v-if="!selectedBuilding">원하는 실증지를 선택해주세요!</span>
              <span v-else>오늘도 에너지 가득한 하루 되세요!</span>
            </div>
          </div>
        </div>

        <!-- 실증지 선택 화면 -->
        <div v-if="!selectedBuilding" class="building-selector-container">
          <BuildingSelector @building-selected="handleBuildingSelected" />
        </div>

        <div v-if="selectedBuilding" class="dashboard-content-inner">
          <!-- 대시보드 화면 -->

          <!-- 실증지 변경 버튼 (고정 위치) -->
          <div class="building-change-btn">
            <button
              @click="goBackToBuildingList"
              class="change-building-btn"
              title="실증지 변경"
              :data-tooltip="`실증지 변경`"
            >
              <span class="change-icon">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <mask
                    id="mask0_2391_10537"
                    style="mask-type: alpha"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="40"
                    height="40"
                  >
                    <rect width="40" height="40" fill="#D9D9D9" />
                  </mask>
                  <g mask="url(#mask0_2391_10537)">
                    <path
                      d="M27.0846 36.6673L10.418 20.0007L27.0846 3.33398L29.6263 5.90357L15.5292 20.0007L29.6263 34.0977L27.0846 36.6673Z"
                      fill="white"
                    />
                  </g>
                </svg>
              </span>
              <span class="building-name">실증지 변경</span>
            </button>
          </div>

          <div v-if="isEditMode" class="dashboard-toolbar">
            <div class="toolbar-right">
              <button @click="clearDashboard" class="clear-btn" :data-tooltip="`모든 위젯 삭제`">
                <span class="btn-icon"
                  ><img src="@/assets/images/delete.svg" alt="모든위젯삭제" class="btn-icon_img"
                /></span>
                <span class="sound_only">모든 위젯 삭제</span>
              </button>
            </div>
          </div>

          <div
            ref="dashboardGrid"
            class="dashboard-grid"
            :class="{ empty: dashboardWidgets.length === 0 }"
            @dragover="handleDragOver"
            @drop="handleDrop"
            :style="{
              display: 'grid',
              gridTemplateColumns: `repeat(${gridConfig.cols}, 1fr)`,
              gridTemplateRows: `repeat(${gridConfig.rows}, 1fr)`,
              gap: '16px',
              padding: '24px',
              position: 'relative',
            }"
          >
            <!-- ...existing dashboard grid content... -->
            <div v-if="dashboardWidgets.length === 0" class="empty-state">
              <div class="empty-icon">📈</div>
              <h3 class="empty-title">대시보드가 비어있습니다</h3>
              <p class="empty-description">
                <span v-if="!isEditMode">
                  헤더의 '위젯 편집' 버튼을 눌러<br />
                  위젯을 추가해보세요.
                </span>
                <span v-else>
                  우측 사이드바에서 데이터 종류를 선택하고<br />
                  원하는 위젯을 추가해보세요.
                </span>
              </p>
              <div class="empty-features">
                <div class="feature-item">
                  <span class="feature-icon">📈</span>
                  <span>시계열 그래프</span>
                </div>
                <div class="feature-item">
                  <span class="feature-icon">📊</span>
                  <span>막대 차트</span>
                </div>
                <div class="feature-item">
                  <span class="feature-icon">🍰</span>
                  <span>원형 차트</span>
                </div>
                <div class="feature-item">
                  <span class="feature-icon">🔘</span>
                  <span>제어 위젯</span>
                </div>
              </div>
            </div>

            <!-- 위젯들을 직접 dashboard-grid에 배치 -->
            <div
              v-for="element in dashboardWidgets"
              :key="element.instanceId"
              class="widget-container"
              :class="{
                dragging: dragState.dragElement === element,
                clickable: !isEditMode,
                resizing:
                  widgetResizeState.isResizing && widgetResizeState.resizingWidget === element,
                'resize-invalid':
                  widgetResizeState.isResizing &&
                  widgetResizeState.resizingWidget === element &&
                  !canPlaceWidget(element.position, element.gridSize, element),
              }"
              :draggable="isEditMode"
              @dragstart="isEditMode ? handleDragStart(element, $event) : null"
              @dragend="handleDragEnd"
              :style="{
                gridColumn: element.position
                  ? `${element.position.x + 1} / span ${element.gridSize.width}`
                  : `1 / span ${element.gridSize.width}`,
                gridRow: element.position
                  ? `${element.position.y + 1} / span ${element.gridSize.height}`
                  : `auto / span ${element.gridSize.height}`,
                cursor: isEditMode ? 'move' : 'pointer',
              }"
            >
              <div class="widget-inner">
                <!-- 편집모드에서만 위젯 헤더 표시 -->
                <div v-if="isEditMode" class="widget-header">
                  <div class="widget-title-section">
                    <span class="widget-category">{{ element.dataType }}</span>
                    <span class="widget-title">{{ element.name }}</span>
                  </div>
                  <div class="widget-controls">
                    <button @click="configureWidget(element)" id="settingBtn" class="control-btn" title="설정">
                      <img src="@/assets/images/settings.svg" alt="" />
                    </button>
                    <button @click="removeWidget(element)" class="control-btn remove" title="삭제">
                      ✕
                    </button>
                  </div>
                </div>

                <div class="widget-content" :class="{ 'no-header': !isEditMode }">
                  <!-- WidgetFactory를 사용하여 동적으로 위젯 렌더링 -->
                  <WidgetFactory
                    :widgetType="element.type"
                    :data="widgetDataStore.getWidgetData(element.instanceId)"
                    :config="element.config || {}"
                    :isEditMode="isEditMode"
                    :instanceId="element.instanceId"
                  />
                </div>
                <!-- 위젯 모달 버튼 (일반 모드, 차트 위젯에만 표시) -->
                <div v-if="!isEditMode && isChartWidget(element.type)" class="widget_modal_btn">
                  <button @click="openWidgetModal(element)">
                    <DetailIcon />
                  </button>
                </div>

                <!-- 편집 모드에서의 컨트롤 요소들 -->
                <div v-if="isEditMode" class="widget-edit-controls">
                  <!-- 크기 조절 핸들들 -->
                  <div class="resize-handles">
                    <!-- 남동쪽 핸들 (오른쪽 아래) -->
                    <div
                      class="resize-handle resize-handle-se"
                      @mousedown="handleResizeStart(element, $event, 'se')"
                      title="크기 조절"
                    >
                      <DragIcon />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 드롭 가이드 -->
            <div
              v-if="dragState.showDropGuide"
              class="drop-guide"
              :style="dragState.dropGuideStyle"
            ></div>
          </div>
        </div>
      </main>
    </div>

    <!-- 위젯 선택 모달 -->
    <div v-if="widgetSelector.show" class="modal-overlay" @click="closeWidgetSelector">
      <div class="modal-content widget-selector-modal" @click.stop>
        <h3 class="modal-title">
          {{ widgetOptions.isEditing ? '위젯 수정' : widgetSelector.dataType }} 
          {{ widgetOptions.show ? '옵션' : '위젯' }} 
          {{ widgetOptions.isEditing ? '' : '선택' }}
        </h3>
        <p class="modal-description">
          표시할 위젯 형태를 선택하세요
        </p>

        <div v-if="!widgetOptions.show" class="widget-type-grid">
          <div
            v-for="widget in getAvailableWidgets(widgetSelector.category)"
            :key="widget.id"
            class="widget-type-card"
            @click="changeShowWidget(widget)"
          >
            <div class="widget-type-icon">
              <img :src="widget.icon" :alt="widget.name" />
            </div>
            <div class="widget-type-name">{{ widget.name }}</div>
            <div class="widget-type-description">{{ widget.description }}</div>
            <div 
              v-if="getBadgeText(widget)" 
              class="widget-type-badge"
            >
              {{ getBadgeText(widget) }}
            </div>
          </div>
        </div>
        <div v-else-if="widgetOptions.show" class="widget-options">
          <div class="input-grid">
            <p>명칭 <span class="required-mark">*</span></p>
            <div class="input-box">
              <input
                type="text"
                v-model="widgetOptions.widgetName"
                placeholder="위젯 명칭을 입력하세요"
                class="widget-input"
                required
              />
            </div>
          </div>

          <!-- 이미지 위젯, 페이지링크 위젯이 아닌 경우에만 단위 입력 표시 -->
          <div v-if="!widgetOptions.other || (widgetOptions.other.type !== 'page-link' && widgetOptions.other.type !== 'image-widget')" class="input-grid">
            <p>단위</p>
            <div class="input-box">
              <input
                type="text"
                v-model="widgetOptions.widgetUnit"
                placeholder="단위를 입력하세요 (예: kWh, °C, %)"
                class="widget-input"
              />
            </div>
          </div>

          <!-- 이미지 위젯, 페이지링크 위젯이 아닌 경우에만 기간 설정 표시 -->
          <div v-if="!widgetOptions.other || (widgetOptions.other.type !== 'page-link' && widgetOptions.other.type !== 'image-widget')" class="input-grid">
            <p>기간</p>
            <div class="input-box period-selection">
              <div 
                v-for="(periodOption, index) in [
                  { value: 'day', label: '하루' },
                  { value: 'month', label: '1개월' },
                  { value: 'year', label: '1년' },
                  { value: 'custom', label: '사용자임의' }
                ]"
                :key="index"
                class="widget-option-item"
                @click="widgetOptions.selectedPeriod = periodOption.value"
              >
                <input
                  type="radio"
                  name="period"
                  :value="periodOption.value"
                  v-model="widgetOptions.selectedPeriod"
                  :id="`period-${index}`"
                />
                <label :for="`period-${index}`">{{ periodOption.label }}</label>
              </div>
            </div>
          </div>

          <!-- 사용자임의 선택 시 날짜 범위 입력 (이미지 위젯, 페이지링크 위젯이 아닌 경우에만) -->
          <div v-if="widgetOptions.selectedPeriod === 'custom' && (!widgetOptions.other || (widgetOptions.other.type !== 'page-link' && widgetOptions.other.type !== 'image-widget'))" class="input-grid">
            <p class="period-label">기간 설정</p>
            <div class="input-box custom-period">
              <div class="date-range-inputs">
                <div class="date-input-group">
                  <label class="date-label">시작일</label>
                  <input 
                    type="date" 
                    v-model="widgetOptions.startDate" 
                    class="widget-input date-input"
                  />
                </div>
                <div class="date-separator">~</div>
                <div class="date-input-group">
                  <label class="date-label">종료일</label>
                  <input 
                    type="date" 
                    v-model="widgetOptions.endDate" 
                    class="widget-input date-input"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- 이미지 위젯, 페이지링크 위젯이 아닌 경우에만 업데이트 주기 표시 -->
          <div v-if="!widgetOptions.other || (widgetOptions.other.type !== 'page-link' && widgetOptions.other.type !== 'image-widget')" class="input-grid">
            <p>업데이트 주기</p>
            <div class="input-box">
              <!-- 배열인 경우: 선택 가능한 옵션들 표시 -->
              <template v-if="Array.isArray(widgetOptions.cycle)">
                <div
                  v-for="(option, index) in widgetOptions.cycle"
                  :key="index"
                  class="widget-option-item"
                  @click="widgetOptions.selectedCycle = option"
                >
                  <input
                    type="radio"
                    name="cycle"
                    :value="option"
                    v-model="widgetOptions.selectedCycle"
                    :id="`cycle-${index}`"
                  />
                  <label :for="`cycle-${index}`">{{ widgetChar(option) }}</label>
                </div>
              </template>
              
              <!-- 고정 문자열인 경우: 읽기 전용 표시 -->
              <template v-else>
                <div class="widget-option-readonly">
                  <span class="readonly-label">{{ widgetOptions.cycle }}</span>
                  <span class="readonly-desc">(변경 불가)</span>
                </div>
              </template>
            </div>
          </div>

          <!-- 페이지링크 위젯인 경우에만 URL 설정 표시 -->
          <div v-if="widgetOptions.other && widgetOptions.other.type === 'page-link'" class="input-grid">
            <p>페이지 URL <span class="required-mark">*</span></p>
            <div class="input-box">
              <input
                type="url"
                v-model="widgetOptions.pageUrl"
                placeholder="https://example.com"
                class="widget-input"
                required
              />
            </div>
          </div>

          <!-- 이미지 위젯인 경우에만 이미지 업로드 표시 -->
          <div v-if="widgetOptions.other && widgetOptions.other.type === 'image-widget'" class="input-grid">
            <p>이미지 파일 <span class="required-mark">*</span></p>
            <div class="input-box">
              <div class="image-upload-container">
                <!-- 파일 업로드 영역 -->
                <div class="file-upload-section">
                  <input 
                    ref="imageFileInput"
                    type="file" 
                    accept="image/*"
                    @change="handleImageFileUpload"
                    class="file-input"
                    id="image-file-input"
                  />
                  <label for="image-file-input" class="file-upload-label">
                    <div class="upload-icon">📁</div>
                    <div class="upload-text">
                      <span class="upload-title">이미지 파일 선택</span>
                      <span class="upload-subtitle">클릭하거나 파일을 드래그하여 업로드</span>
                    </div>
                  </label>
                </div>
                
                <!-- 선택된 파일 정보 -->
                <div v-if="widgetOptions.selectedFile" class="selected-file-info">
                  <div class="file-info">
                    <span class="file-name">{{ widgetOptions.selectedFile.name }}</span>
                    <span class="file-size">({{ formatFileSize(widgetOptions.selectedFile.size) }})</span>
                    <button @click="clearSelectedFile" class="clear-file-btn">✕</button>
                  </div>
                </div>
                
                <!-- 이미지 미리보기 -->
                <div v-if="widgetOptions.imageUrl" class="image-preview-section">
                  <label class="input-label">미리보기</label>
                  <div class="selected-image-preview">
                    <img 
                      :src="widgetOptions.imageUrl" 
                      alt="선택된 이미지"
                      @error="handleImageError"
                      @load="handleImageLoad"
                    />
                    <button @click="clearSelectedImage" class="clear-img-btn">✕</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 페이지링크, 이미지 위젯이 아닌 경우에만 데이터 타입 표시 -->
          <div v-if="!widgetOptions.other || (widgetOptions.other.type !== 'page-link' && widgetOptions.other.type !== 'image-widget')" class="input-grid">
            <p>데이터 타입 <span class="required-mark">*</span></p>
            <div class="input-box">
              <div 
                v-for="(option, index) in dumyData" 
                :key="index" 
                class="widget-option-item"
                @click="widgetOptions.selectedDataType = option"
              >
                <input 
                  type="radio" 
                  name="dataType" 
                  :value="option" 
                  v-model="widgetOptions.selectedDataType"
                  :id="`data-${index}`" 
                  required
                />
                <label :for="`data-${index}`">{{ option }}</label>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button @click="closeWidgetSelector" class="cancel-btn">취소</button>
          <button v-if="widgetOptions.show" @click="addWidget(widgetOptions.other)" class="apply-btn">
            {{ widgetOptions.isEditing ? '수정' : '등록' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 위젯 크기 조절 모달 -->
    <div v-if="resizeModal.show" class="modal-overlay" @click="closeResizeModal">
      <div class="modal-content" @click.stop>
        <h3 class="modal-title">위젯 크기 조절</h3>
        <div class="size-controls">
          <div class="size-control">
            <label>너비 (그리드 칸 수)</label>
            <select v-model="resizeModal.width">
              <option 
                v-for="width in getAvailableWidthOptions(resizeModal.widget)" 
                :key="width" 
                :value="width"
              >
                {{ width }}칸
              </option>
            </select>
          </div>
          <div class="size-control">
            <label>높이 (그리드 칸 수)</label>
            <select v-model="resizeModal.height">
              <option 
                v-for="height in getAvailableHeightOptions(resizeModal.widget)" 
                :key="height" 
                :value="height"
              >
                {{ height }}칸
              </option>
            </select>
          </div>
        </div>
        <div class="modal-actions">
          <button @click="closeResizeModal" class="cancel-btn">취소</button>
          <button @click="applyResize" class="apply-btn">적용</button>
        </div>
      </div>
    </div>

    <!-- 나가기 확인 모달 -->
    <div v-if="exitConfirmModal.show" class="modal-overlay" @click="closeExitConfirmModal">
      <div class="modal-content exit-confirm-modal" @click.stop>
        <h3 class="modal-title">편집 내용을 저장하시겠습니까?</h3>
        <p class="modal-description">
          변경된 내용이 있습니다.<br />
          저장하지 않으면 변경사항이 손실될 수 있습니다.
        </p>

        <div class="modal-actions exit-confirm-actions">
          <button @click="closeExitConfirmModal" class="cancel-btn">취소</button>
          <button @click="exitWithoutSaving" class="exit-without-save-btn">
            저장하지 않고 나가기
          </button>
          <button @click="saveAndExit" class="save-and-exit-btn">저장하고 나가기</button>
        </div>
      </div>
    </div>

    <!-- 위젯 상세보기 모달 -->
    <div v-if="widgetModal.show" class="modal-overlay" @click="closeWidgetModal">
      <div class="modal-content widget-detail-modal" @click.stop>
        <div class="modal-header">
          <!-- <div class="modal-title-section">
            <h3 class="modal-title">{{ widgetModal.widget?.name || '위젯 상세보기' }}</h3>
            <span class="widget-category-badge">{{ widgetModal.widget?.dataType }}</span>
          </div> -->
          <button @click="closeWidgetModal" class="close-btn">✕</button>
        </div>

        <div class="modal-body">
          <div v-if="widgetModal.widget" class="widget-detail-content">
            <!-- 확대된 위젯 컨텐츠 -->
            <div class="expanded-widget">
              <WidgetFactory
                :widgetType="widgetModal.widget.type"
                :data="widgetDataStore.getWidgetData(widgetModal.widget.instanceId)"
                :config="{ ...widgetModal.widget.config, isExpanded: true }"
                :isEditMode="false"
                :instanceId="widgetModal.widget.instanceId"
              />
            </div>

            <!-- 위젯 정보 -->
            <div class="widget-info-panel">
              <div class="info-section">
                <h4>위젯 정보</h4>
                <div class="info-grid">
                  <div class="info-item">
                    <span class="info-label">타입:</span>
                    <span class="info-value">{{ widgetModal.widget.name }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">카테고리:</span>
                    <span class="info-value">{{ widgetModal.widget.dataType }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">크기:</span>
                    <span class="info-value"
                      >{{ widgetModal.widget.gridSize.width }} ×
                      {{ widgetModal.widget.gridSize.height }}</span
                    >
                  </div>
                  <div class="info-item">
                    <span class="info-label">업데이트 주기:</span>
                    <span class="info-value">
                      {{
                        Array.isArray(widgetModal.widget.updateCycle)
                          ? widgetModal.widget.updateCycle.map((c) => widgetChar(c)).join(', ')
                          : widgetModal.widget.updateCycle
                      }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="info-section">
                <h4>설명</h4>
                <p class="widget-description">
                  {{ widgetModal.widget.description || '위젯에 대한 설명이 없습니다.' }}
                </p>
              </div>

              <!-- 위젯별 추가 정보 -->
              <div v-if="widgetModal.additionalInfo" class="info-section">
                <h4>추가 정보</h4>
                <div class="additional-info">
                  <div
                    v-for="(value, key) in widgetModal.additionalInfo"
                    :key="key"
                    class="info-item"
                  >
                    <span class="info-label">{{ key }}:</span>
                    <span class="info-value">{{ value }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="openWidgetSettings" class="settings-btn">
            <span class="btn-icon">⚙️</span>
            위젯 설정
          </button>
          <button @click="closeWidgetModal" class="close-modal-btn">닫기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { widgetDataStore, widgetStateStore, realtimeUpdateManager } from '@/stores/widgetData'
import WidgetFactory from '@/components/widgets/WidgetFactory.vue'
import AppHeader from '@/components/AppHeader.vue'
import DetailIcon from '@/components/icons/DetailIcon.vue'
import DragIcon from '@/components/icons/DragIcon.vue'
import BuildingSelector from '@/components/BuildingSelector.vue'

const authStore = useAuthStore()
// 그리드 설정
// 최대 너비 16, 최소높이 6 
const widgetMinGridSizes = {
  'line-chart': { width: 3, height: 3 },
  'bar-chart': { width: 3, height: 3 },
  'pie-chart': { width: 3, height: 3 },
  'on-off-control': { width: 2, height: 2 },
  'up-down-control': { width: 2, height: 2 },
  'box-widget': { width: 2, height: 2 },
  'bar-gauge-widget': { width: 2, height: 2 },
  'status-widget': { width: 2, height: 2 },
  'alarm-widget': { width: 2, height: 3 },
  'energy-report': { width: 8, height: 6 },
  'page-link': { width: 2, height: 2 },
  'image-widget': { width: 2, height: 2 },
}

const widgetMaxGridSizes = {
  'line-chart': { width: 16, height: 6 },     // 최소 3x3, 최대 16x6
  'bar-chart': { width: 16, height: 6 },      // 최소 3x3, 최대 16x6
  'pie-chart': { width: 16, height: 6 },      // 최소 3x3, 최대 16x6
  'on-off-control': { width: 4, height: 3 },  // 최소 2x2, 최대 4x3
  'up-down-control': { width: 4, height: 4 }, // 최소 2x2, 최대 4x4
  'box-widget': { width: 4, height: 2 },      // 최소 2x2, 최대 4x2
  'bar-gauge-widget': { width: 6, height: 3 }, // 최소 2x2, 최대 6x3
  'status-widget': { width: 3, height: 2 },    // 최소 2x2, 최대 3x2
  'alarm-widget': { width:4 , height: 6 },    // 최소 2x3, 최대 4x6
  'energy-report': { width: 16, height: 6 },  // 최소 8x6, 최대 16x6
  'page-link': { width: 4, height: 2 },
  'image-widget': { width: 6, height: 6 },
}

// 현재 날짜 정보
const currentDate = ref({
  day: '',
  dayOfWeek: '',
  month: '',
})

// 현재 날짜 업데이트 함수
const updateCurrentDate = () => {
  const now = new Date()
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  currentDate.value = {
    day: now.getDate().toString(),
    dayOfWeek: dayNames[now.getDay()],
    month: monthNames[now.getMonth()],
  }
}

// 날짜 업데이트 타이머
let dateUpdateInterval = null

// 실증지 선택 상태
const selectedBuilding = ref(null)

// 실증지 선택 핸들러
const handleBuildingSelected = (building) => {
  selectedBuilding.value = building
  // 실증지별 대시보드 데이터 로드
  loadDashboardForBuilding(building.id)
}

// 실증지 리스트로 돌아가기
const goBackToBuildingList = () => {
  if (confirm('실증지를 변경하시겠습니까? 편집 중인 내용이 있다면 저장하시기 바랍니다.')) {
    // 편집모드 종료
    if (isEditMode.value) {
      isEditMode.value = false
      sidebarOpen.value = false
      window.dispatchEvent(
        new CustomEvent('edit-mode-change', {
          detail: { isEditMode: false, sidebarOpen: false },
        }),
      )
    }

    // 모든 실시간 업데이트 중지
    realtimeUpdateManager.stopAllUpdates()

    // 선택된 실증지 초기화
    selectedBuilding.value = null

    // 위젯 데이터 초기화
    dashboardWidgets.value = []
  }
}

// 실증지별 대시보드 로드
const loadDashboardForBuilding = (buildingId) => {
  const savedKey = `dashboard-widgets-building-${buildingId}`
  const saved = localStorage.getItem(savedKey)
  if (saved) {
    dashboardWidgets.value = JSON.parse(saved)

    // 저장된 위젯들의 실시간 데이터 업데이트 시작 (컨트롤 위젯은 제외)
    dashboardWidgets.value.forEach((widget) => {
      const isControlWidget = widget.type.includes('control')
      if (!isControlWidget) {
        realtimeUpdateManager.startUpdate(widget.instanceId, widget.type, widget.dataType, 5000)
      }
    })
  } else {
    // 실증지에 대한 저장된 대시보드가 없으면 빈 상태로 시작
    dashboardWidgets.value = []
  }
}

// 드래그 앤 드롭 상태
const dragState = reactive({
  isDragging: false,
  dragElement: null,
  showDropGuide: false,
  dropGuideStyle: {},
  dropPosition: null,
})

// 크기 조절 모달 상태
const resizeModal = reactive({
  show: false,
  widget: null,
  width: 2,
  height: 2,
})

// 위젯 선택 모달 상태
const widgetSelector = reactive({
  show: false,
  category: '',
  dataType: '',
})

const widgetOptions = reactive({
  show: false,
  keyword: [],
  cycle: [],
  unit: '',
  selectedCycle: '',
  widgetName: '',
  widgetUnit: '',
  periodQuery: '',
  selectedPeriod: 'day',
  startDate: '',
  endDate: '',
  selectedDataType: '',
  pageUrl: '', // 페이지링크 위젯용 URL 필드
  imageUrl: '', // 이미지 위젯용 이미지 URL 필드
  selectedFile: null, // 선택된 이미지 파일
  editingWidget: null, // 수정 중인 위젯
  isEditing: false,    // 수정 모드 여부
  other: null
})

// 위젯 상세보기 모달 상태
const widgetModal = reactive({
  show: false,
  widget: null,
  additionalInfo: null,
})

// 나가기 확인 모달 상태
const exitConfirmModal = reactive({
  show: false,
})

// 대시보드 상태
const dashboardWidgets = ref([])
const dashboardGrid = ref(null)

// 그리드 설정
const gridConfig = reactive({
  cols: 16,
  rows: 6,
})

// 사이드바 상태
const sidebarOpen = ref(false)
const isEditMode = ref(false)

// 헤더에서 편집모드 변경 이벤트 리스너
const handleEditModeChange = (event) => {
  isEditMode.value = event.detail.isEditMode
  sidebarOpen.value = event.detail.sidebarOpen
}

// 헤더에서 사이드바 토글 이벤트 리스너
const handleSidebarToggle = (event) => {
  if (isEditMode.value) {
    sidebarOpen.value = event.detail.isOpen
  }
}

// 헤더에서 나가기 확인 이벤트 리스너
const handleConfirmExitEditMode = () => {
  exitConfirmModal.show = true
}

// 나가기 확인 모달 닫기
const closeExitConfirmModal = () => {
  exitConfirmModal.show = false
}

// 저장하지 않고 나가기
const exitWithoutSaving = () => {
  exitConfirmModal.show = false
  // 헤더에 강제 종료 이벤트 전송
  window.dispatchEvent(new CustomEvent('force-exit-edit-mode'))
}

// 저장하고 나가기
const saveAndExit = () => {
  saveDashboard()
  exitConfirmModal.show = false
  // 헤더에 강제 종료 이벤트 전송
  window.dispatchEvent(new CustomEvent('force-exit-edit-mode'))
}

// 헤더에서 저장 이벤트 리스너
const handleSaveDashboard = () => {
  saveDashboard()
}
const getIconPath = (iconName) => {
  try {
    return new URL(`../assets/images/icon/${iconName}`, import.meta.url).href
  } catch {
    return '@/assets/images/icon/1.png' // 기본 이미지
  }
}

const dumyData = ['AH', 'AQ', 'CBL', 'EL', 'EM', 'MP', 'MW', 'PMV', 'RE', 'SC']
// 데이터 종류별 사용 가능한 위젯 정의
const widgetsData = {
  power_usage: [
    {
      id: 'power-line-chart',
      name: '선 시계열 그래프',
      icon: getIconPath('1.png'),
      type: 'line-chart',
      description: '시간에 따른 전력 사용량 변화를 선그래프로 표시',
      updateCycle: [0, 1, 2, 3],
    },
    {
      id: 'power-bar-chart',
      name: '막대 시계열 그래프',
      icon: getIconPath('2.png'),
      type: 'bar-chart',
      description: '시간에 따른 전력 사용량 변화를 막대그래프로 표시',
      updateCycle: [0, 1, 2, 3],
    },
    {
      id: 'power-pie-chart',
      name: '원 그래프',
      icon: getIconPath('3.png'),
      type: 'pie-chart',
      description: '전력 사용량 비율을 원형 차트로 표시',
      updateCycle: [1, 2, 3],
    },
    {
      id: 'power-box-widget',
      name: '박스 위젯',
      icon: getIconPath('4.png'),
      type: 'box-widget',
      description: '현재 전력량을 숫자로 표시',
      updateCycle: [0],
    },
  ],
  solar_generation: [
    {
      id: 'solar-line-chart',
      name: '선 시계열 그래프',
      icon: getIconPath('1.png'),
      type: 'line-chart',
      description: '태양광 발전량과 예측량을 선그래프로 표시',
      updateCycle: [0, 1, 2, 3],
    },
    {
      id: 'solar-bar-chart',
      name: '막대 시계열 그래프',
      icon: getIconPath('2.png'),
      type: 'bar-chart',
      description: '태양광 발전량과 예측량을 막대그래프로 표시',
      updateCycle: [0, 1, 2, 3],
    },
    {
      id: 'solar-box-widget',
      name: '박스 위젯',
      icon: getIconPath('4.png'),
      type: 'box-widget',
      description: '현재 발전량을 숫자로 표시',
      updateCycle: [0],
    },
  ],
  environment: [
    {
      id: 'temp-bar-widget',
      name: '막대(온도) 위젯',
      icon: getIconPath('5.png'),
      type: 'bar-gauge-widget',
      description: '온도를 막대 게이지로 표시',
      updateCycle: [0, 1],
    },
    {
      id: 'humidity-bar-widget',
      name: '막대(습도) 위젯',
      icon: getIconPath('5.png'),
      type: 'bar-gauge-widget',
      description: '습도를 퍼센트 막대로 표시',
      updateCycle: [0, 1],
    },
    {
      id: 'pressure-box-widget',
      name: '박스 위젯',
      icon: getIconPath('4.png'),
      type: 'box-widget',
      description: '압력값을 숫자로 표시',
      updateCycle: [0, 1],
    },
  ],
  equipment_control: [
    {
      id: 'on-off-control',
      name: '제어(ON/OFF) 위젯',
      icon: getIconPath('7.png'),
      type: 'on-off-control',
      description: '설비 ON/OFF 제어 및 현재 상태 표시',
      updateCycle: '실시간',
    },
    {
      id: 'up-down-control',
      name: '제어(UP/DOWN) 위젯',
      icon: getIconPath('8.png'),
      type: 'up-down-control',
      description: '온도/압력/조도 등 수치 제어',
      updateCycle: '실시간',
    },
    {
      id: 'status-widget',
      name: '상태표시 위젯',
      icon: getIconPath('12.png'),
      type: 'status-widget',
      description: '현재 상태를 색상으로 표시',
      updateCycle: '실시간',
    },
  ],
  system_info: [
    {
      id: 'alarm-widget',
      name: '알람 위젯',
      icon: getIconPath('10.png'),
      type: 'alarm-widget',
      description: '통신 또는 설비 알람 표시',
      updateCycle: '실시간',
    },
    {
      id: 'energy-report',
      name: '에너지 진단보고서',
      icon: getIconPath('9.png'),
      type: 'energy-report',
      description: 'PDF 진단보고서 분석 결과',
      updateCycle: [3],
    },
  ],
  misc: [
    {
      id: 'page-link',
      name: '페이지 링크 위젯',
      icon: getIconPath('6.png'),
      type: 'page-link',
      description: 'URL 링크 표시 및 이동',
      updateCycle: '정적',
    },
    {
      id: 'image-widget',
      name: '그림삽입 위젯',
      icon: getIconPath('11.png'),
      type: 'image-widget',
      description: '이미지 파일 표시',
      updateCycle: '정적',
    },
  ],
}

// 카테고리별 사용 가능한 위젯 반환
const getAvailableWidgets = (category) => {
  return widgetsData[category] || []
}

// 위젯 사이클 변환
const widgetChar = (ele) => {
  const numArr = ['1분', '15분', '1시간', '하루']
  if (typeof ele === 'number') {
    return numArr[ele]
  } else if (typeof ele === 'string') {
    return ele
  }
}

// 뱃지 텍스트 생성 함수
const getBadgeText = (widget) => {
  if (!widget.updateCycle) return null
  
  try {
    if (Array.isArray(widget.updateCycle)) {
      if (widget.updateCycle.length === 0) return null
      
      const validCycles = widget.updateCycle.filter(cycle => cycle !== undefined && cycle !== null)
      if (validCycles.length === 0) return null
      
      if (validCycles.length === 1) {
        return widgetChar(validCycles[0])
      } else {
        const minCycle = Math.min(...validCycles)
        const maxCycle = Math.max(...validCycles)
        return widgetChar(minCycle) + '~' + widgetChar(maxCycle)
      }
    } else {
      return widgetChar(widget.updateCycle)
    }
  } catch (error) {
    console.warn('뱃지 텍스트 생성 오류:', error, widget)
    return null
  }
}

// 위젯 추가/수정
const addWidget = (widget) => {
  // 필수 입력 검증
  const validationErrors = validateRequiredFields()
  if (validationErrors.length > 0) {
    alert(validationErrors.join('\n'))
    return
  }

  if (widgetOptions.isEditing && widgetOptions.editingWidget) {
    // 기존 위젯 수정
    updateExistingWidget(widgetOptions.editingWidget, widget)
  } else {
    // 새 위젯 추가
    addNewWidget(widget)
  }

  closeWidgetSelector()
  
  // 위젯 추가/수정 후 사이드바 닫기
  sidebarOpen.value = false
  // 헤더에 사이드바 상태 변경 알림
  window.dispatchEvent(
    new CustomEvent('sidebar-state-change', {
      detail: { isOpen: false },
    }),
  )
}

// 기존 위젯 업데이트 함수
const updateExistingWidget = (existingWidget, widgetTemplate) => {
  console.log('기존 위젯 수정:', existingWidget, widgetTemplate)
  
  // 기존 위젯의 속성 업데이트
  existingWidget.name = widgetOptions.widgetName || widgetTemplate.name
  existingWidget.customUnit = widgetOptions.widgetUnit
  existingWidget.selectedCycle = widgetOptions.selectedCycle
  existingWidget.cycle = widgetOptions.cycle
  existingWidget.keyword = widgetOptions.keyword
  existingWidget.unit = widgetOptions.unit
  existingWidget.periodQuery = widgetOptions.periodQuery
  existingWidget.selectedDataType = widgetOptions.selectedDataType
  
  // config 업데이트
  if (!existingWidget.config) {
    existingWidget.config = {}
  }
  
  existingWidget.config = {
    ...existingWidget.config,
    title: widgetOptions.widgetName || existingWidget.config.title,
    unit: widgetOptions.widgetUnit || existingWidget.config.unit,
    periodQuery: widgetOptions.periodQuery || '',
    selectedPeriod: widgetOptions.selectedPeriod,
    startDate: widgetOptions.startDate,
    endDate: widgetOptions.endDate,
    updateCycle: widgetOptions.selectedCycle
  }

  // 페이지링크 위젯인 경우 URL 업데이트
  if (existingWidget.type === 'page-link') {
    existingWidget.config.url = widgetOptions.pageUrl || existingWidget.config.url
  }

  // 이미지 위젯인 경우 이미지 URL 업데이트
  if (existingWidget.type === 'image-widget') {
    existingWidget.config.imageUrl = widgetOptions.imageUrl || existingWidget.config.imageUrl
  }

  // 실시간 데이터 업데이트 재시작 (설정이 변경되었을 수 있으므로)
  const isControlWidget = existingWidget.type.includes('control')
  if (!isControlWidget) {
    realtimeUpdateManager.stopUpdate(existingWidget.instanceId)
    realtimeUpdateManager.startUpdate(
      existingWidget.instanceId,
      existingWidget.type,
      existingWidget.dataType,
      5000
    )
  }

  saveDashboard()
  console.log('위젯 수정 완료:', existingWidget)
}

// 새 위젯 추가 함수 (기존 addWidget 로직)
const addNewWidget = (widget) => {
  console.log('새 위젯 추가:', widget)
  
  // 빈 공간 찾기
  const minSize = widgetMinGridSizes[widget.type] || { width: 2, height: 2 }
  const maxSize = widgetMaxGridSizes[widget.type] || { width: 16, height: 6 }
  const emptyPosition = findEmptyPosition(minSize)
  
  if (emptyPosition === null) {
    alert(
      `대시보드에 빈 공간이 없습니다. 해당 위젯을 추가하려면 최소 가로 ${minSize.width}칸, 세로 ${minSize.height}칸의 공간을 확보해주세요.`
    )
    return
  }

  // 위젯 타입별 기본 설정
  const getDefaultConfig = (widgetType) => {
    const baseConfig = {
      updateCycle: widget.updateCycle,
      dataSource: '',
      customSettings: {},
    }

    if (widgetType === 'bar-gauge-widget') {
      return {
        ...baseConfig,
        title: widgetOptions.widgetName || '게이지',
        unit: widgetOptions.widgetUnit || '%',
        min: 0,
        max: 100,
        thresholds: {
          warning: 70,
          critical: 90,
        },
        periodQuery: widgetOptions.periodQuery || '',
        selectedPeriod: widgetOptions.selectedPeriod,
        startDate: widgetOptions.startDate,
        endDate: widgetOptions.endDate
      }
    }

    if (widgetType === 'page-link') {
      return {
        ...baseConfig,
        title: widgetOptions.widgetName || '페이지 링크',
        url: widgetOptions.pageUrl || 'https://example.com',
        buttonText: '페이지로 이동',
        showQrCode: false,
        showStats: false,
        showHistory: false,
        checkInterval: 300000 // 5분
      }
    }

    if (widgetType === 'image-widget') {
      return {
        ...baseConfig,
        title: widgetOptions.widgetName || '이미지',
        imageUrl: widgetOptions.imageUrl || '',
        alt: '이미지',
        imageStyle: 'contain',
        showOverlay: false,
        overlayTitle: '',
        overlayDescription: '',
        showInfo: true,
        showStatus: false,
        showUpdateTime: false,
        imageDescription: ''
      }
    }

    return {
      ...baseConfig,
      title: widgetOptions.widgetName || baseConfig.title,
      unit: widgetOptions.widgetUnit || baseConfig.unit,
      periodQuery: widgetOptions.periodQuery || '',
      selectedPeriod: widgetOptions.selectedPeriod,
      startDate: widgetOptions.startDate,
      endDate: widgetOptions.endDate
    }
  }

  const newWidget = {
    ...widget,
    instanceId: Date.now() + Math.random(),
    cycle: widgetOptions.cycle,
    selectedCycle: widgetOptions.selectedCycle,
    keyword: widgetOptions.keyword,
    unit: widgetOptions.unit,
    dataType: widgetSelector.dataType,
    name: widgetOptions.widgetName || widget.name,
    customUnit: widgetOptions.widgetUnit,
    periodQuery: widgetOptions.periodQuery,
    selectedDataType: widgetOptions.selectedDataType,
    gridSize: { 
      width: Math.min(Math.max(minSize.width, 2), maxSize.width), 
      height: Math.min(Math.max(minSize.height, 2), maxSize.height) 
    },
    position: emptyPosition,
    data: {},
    config: getDefaultConfig(widget.type),
  }

  dashboardWidgets.value.push(newWidget)

  // 실시간 데이터 업데이트 시작 (컨트롤 위젯은 제외)
  const isControlWidget = newWidget.type.includes('control')
  if (!isControlWidget) {
    realtimeUpdateManager.startUpdate(
      newWidget.instanceId,
      newWidget.type,
      newWidget.dataType,
      5000
    )
  }

  saveDashboard()
  console.log('새 위젯 추가 완료:', newWidget)
}

// 빈 공간 찾기
const findEmptyPosition = (size) => {
  for (let y = 0; y <= gridConfig.rows - size.height; y++) {
    for (let x = 0; x <= gridConfig.cols - size.width; x++) {
      if (isPositionEmpty(x, y, size)) {
        return { x, y }
      }
    }
  }
  return null
}

// 위치가 비어있는지 확인
const isPositionEmpty = (x, y, size) => {
  for (let dy = 0; dy < size.height; dy++) {
    for (let dx = 0; dx < size.width; dx++) {
      if (isPositionOccupied(x + dx, y + dy)) {
        return false
      }
    }
  }
  return true
}

// 위치가 점유되어 있는지 확인
const isPositionOccupied = (x, y) => {
  return dashboardWidgets.value.some((widget) => {
    if (!widget.position) return false
    const wx = widget.position.x
    const wy = widget.position.y
    const ww = widget.gridSize.width
    const wh = widget.gridSize.height
    return x >= wx && x < wx + ww && y >= wy && y < wy + wh
  })
}

// 나머지 필요한 함수들
const configureWidget = (widget) => {
  console.log('위젯 설정:', widget)
  
  // 위젯 선택 모달 설정
  widgetSelector.category = getCategoryFromDataType(widget.dataType)
  widgetSelector.dataType = widget.dataType
  widgetSelector.show = true
  
  // 위젯 옵션을 바로 표시하고 기존 값으로 초기화
  widgetOptions.show = true
  widgetOptions.cycle = widget.updateCycle || widget.cycle || []
  widgetOptions.selectedCycle = widget.selectedCycle || (Array.isArray(widget.updateCycle) ? widget.updateCycle[0] : widget.updateCycle)
  widgetOptions.keyword = widget.keyword || []
  widgetOptions.unit = widget.unit || ''
  widgetOptions.widgetName = widget.name || widget.config?.title || ''
  widgetOptions.widgetUnit = widget.customUnit || widget.config?.unit || ''
  widgetOptions.periodQuery = widget.periodQuery || widget.config?.periodQuery || ''
  widgetOptions.selectedPeriod = widget.config?.selectedPeriod || 'day'
  widgetOptions.startDate = widget.config?.startDate || ''
  widgetOptions.endDate = widget.config?.endDate || ''
  widgetOptions.selectedDataType = widget.selectedDataType || dumyData[0] || ''
  widgetOptions.pageUrl = widget.config?.url || '' // 페이지링크 위젯 URL 설정
  widgetOptions.imageUrl = widget.config?.imageUrl || '' // 이미지 위젯 URL 설정
  
  // 수정할 위젯 정보 저장
  widgetOptions.editingWidget = widget
  widgetOptions.isEditing = true
  
  // 기존 위젯 타입 정보도 저장
  const availableWidgets = getAvailableWidgets(widgetSelector.category)
  const currentWidgetType = availableWidgets.find(w => w.type === widget.type)
  widgetOptions.other = currentWidgetType || availableWidgets[0]
}

// 데이터 타입으로부터 카테고리를 찾는 헬퍼 함수 추가
const getCategoryFromDataType = (dataType) => {
  const categoryMapping = {
    '전력': 'power_usage',
    '태양광': 'solar_generation', 
    '태양광 발전량': 'solar_generation',
    '환경 센서': 'environment',
    '설비 제어': 'equipment_control',
    '시스템 정보': 'system_info',
    '기타': 'misc'
  }
  
  return categoryMapping[dataType] || 'power_usage'
}

const clearDashboard = () => {
  if (confirm('모든 위젯을 삭제하시겠습니까?')) {
    // 모든 실시간 업데이트 중지
    realtimeUpdateManager.stopAllUpdates()
    // 모든 위젯 데이터 및 상태 제거
    widgetDataStore.clearAll()
    widgetStateStore.clearAll()
    // 위젯 배열 초기화
    dashboardWidgets.value = []
  }
}

const saveDashboard = () => {
  if (!selectedBuilding.value) return

  const savedKey = `dashboard-widgets-building-${selectedBuilding.value.id}`
  localStorage.setItem(savedKey, JSON.stringify(dashboardWidgets.value))
  console.log(`대시보드 저장됨 - 실증지: ${selectedBuilding.value.name}`)
}

const loadDashboard = () => {
  // 실증지가 선택되지 않은 상태에서는 기본적으로 빈 상태
  dashboardWidgets.value = []
}

// 드래그 앤 드롭 관련 함수들
const handleDragStart = (element, event) => {
  dragState.isDragging = true
  dragState.dragElement = element
  dragState.dropPosition = null // 초기화
  event.dataTransfer.effectAllowed = 'move'
}

const handleDragEnd = () => {
  resetDragState()
}

const resetDragState = () => {
  dragState.isDragging = false
  dragState.dragElement = null
  dragState.showDropGuide = false
  dragState.dropGuideStyle = {}
  dragState.dropPosition = null
}

const handleDragOver = (event) => {
  if (!isEditMode.value || !dragState.dragElement) return

  event.preventDefault()
  event.dataTransfer.dropEffect = 'move'

  const gridRect = dashboardGrid.value.getBoundingClientRect()
  const cellWidth = (gridRect.width - 48) / gridConfig.cols // 48 = padding * 2
  const cellHeight = 120 + 16 // 셀 높이 + gap

  const mouseX = event.clientX - gridRect.left - 24 // padding 제외
  const mouseY = event.clientY - gridRect.top - 24

  const gridX = Math.floor(mouseX / cellWidth)
  const gridY = Math.floor(mouseY / cellHeight)

  dragState.dropPosition = {
    x: Math.max(0, Math.min(gridX, gridConfig.cols - dragState.dragElement.gridSize.width)),
    y: Math.max(0, Math.min(gridY, gridConfig.rows - dragState.dragElement.gridSize.height)),
  }

  // 드래그 가이드 표시
  showDropGuide()
}

const handleDrop = (event) => {
  event.preventDefault()
  console.log('드롭 이벤트 발생')

  if (!dragState.dragElement) {
    console.log('드래그 요소가 없음')
    return
  }

  const draggedElement = dragState.dragElement
  const newPosition = { ...dragState.dropPosition }

  // 배치 가능성 확인
  if (canPlaceWidget(newPosition, draggedElement.gridSize, draggedElement)) {
    draggedElement.position = newPosition
    saveDashboard()
  }

  resetDragState()
}

const canPlaceWidget = (position, size, excludeWidget = null) => {
  for (let dy = 0; dy < size.height; dy++) {
    for (let dx = 0; dx < size.width; dx++) {
      const x = position.x + dx
      const y = position.y + dy

      if (x >= gridConfig.cols || y >= gridConfig.rows) {
        return false
      }

      const occupied = dashboardWidgets.value.some((widget) => {
        if (excludeWidget && widget.instanceId === excludeWidget.instanceId) {
          return false
        }
        if (!widget.position) return false
        const wx = widget.position.x
        const wy = widget.position.y
        const ww = widget.gridSize.width
        const wh = widget.gridSize.height
        return x >= wx && x < wx + ww && y >= wy && y < wy + wh
      })

      if (occupied) return false
    }
  }
  return true
}

const showDropGuide = () => {
  if (!dragState.dropPosition) return

  // 드롭 가능 여부 확인
  const canPlace = canPlaceWidget(
    dragState.dropPosition,
    dragState.dragElement.gridSize,
    dragState.dragElement,
  )

  dragState.showDropGuide = true
  dragState.dropGuideStyle = {
    gridColumn: `${dragState.dropPosition.x + 1} / span ${dragState.dragElement.gridSize.width}`,
    gridRow: `${dragState.dropPosition.y + 1} / span ${dragState.dragElement.gridSize.height}`,
    background: canPlace ? 'rgba(225, 99, 73, 0.2)' : 'rgba(255, 0, 0, 0.2)',
    border: `2px dashed ${canPlace ? '#E16349' : '#ff0000'}`,
    borderRadius: '12px',
    pointerEvents: 'none',
    zIndex: 999,
  }
}

// 위젯 선택 모달 열기
const showWidgetSelector = (category, dataType) => {
  widgetSelector.category = category
  widgetSelector.dataType = dataType
  widgetSelector.show = true
  widgetOptions.show = false
}

// 위젯 선택 모달 닫기
const closeWidgetSelector = () => {
  widgetSelector.show = false
  widgetSelector.category = ''
  widgetSelector.dataType = ''
  
  // 위젯 옵션도 함께 초기화
  widgetOptions.show = false
  widgetOptions.keyword = []
  widgetOptions.cycle = []
  widgetOptions.unit = ''
  widgetOptions.selectedCycle = ''
  widgetOptions.widgetName = ''
  widgetOptions.widgetUnit = ''
  widgetOptions.periodQuery = ''
  widgetOptions.selectedPeriod = 'day'
  widgetOptions.startDate = ''
  widgetOptions.endDate = ''
  widgetOptions.selectedDataType = ''
  widgetOptions.pageUrl = '' // 페이지 URL 초기화
  widgetOptions.imageUrl = '' // 이미지 URL 초기화
  widgetOptions.selectedFile = null // 선택된 파일 초기화
  widgetOptions.editingWidget = null  // 편집 상태 초기화
  widgetOptions.isEditing = false     // 편집 모드 초기화
  widgetOptions.other = null
}

// 위젯 옵션으로 변경
const changeShowWidget = (widget) => {
  widgetOptions.show = true
  widgetOptions.cycle = widget.updateCycle
  widgetOptions.selectedCycle = Array.isArray(widget.updateCycle)
    ? widget.updateCycle[0]
    : widget.updateCycle
  widgetOptions.keyword = []
  widgetOptions.unit = ''
  widgetOptions.widgetName = ''
  widgetOptions.widgetUnit = ''
  widgetOptions.periodQuery = ''
  widgetOptions.selectedPeriod = 'day' // 기간 초기화
  widgetOptions.startDate = '' // 시작일 초기화
  widgetOptions.endDate = '' // 종료일 초기화
  widgetOptions.selectedDataType = '' // 데이터 타입 초기화
  widgetOptions.pageUrl = '' // 페이지 URL 초기화
  widgetOptions.imageUrl = '' // 이미지 URL 초기화
  widgetOptions.selectedFile = null // 선택된 파일 초기화
  widgetOptions.other = widget
}

// 필수 입력 검증 함수
const validateRequiredFields = () => {
  const errors = []
  
  if (!widgetOptions.widgetName.trim()) {
    errors.push('명칭을 입력해주세요.')
  }
  
  // 페이지링크, 이미지 위젯이 아닌 경우에만 데이터 타입 검증
  if (widgetOptions.other && 
      widgetOptions.other.type !== 'page-link' && 
      widgetOptions.other.type !== 'image-widget') {
    if (!widgetOptions.selectedDataType) {
      errors.push('데이터 타입을 선택해주세요.')
    }
  }
  
  // 페이지링크 위젯인 경우 URL 검증
  if (widgetOptions.other && widgetOptions.other.type === 'page-link') {
    if (!widgetOptions.pageUrl.trim()) {
      errors.push('페이지 URL을 입력해주세요.')
    } else {
      // URL 형식 검증
      try {
        new URL(widgetOptions.pageUrl)
      } catch {
        errors.push('올바른 URL 형식을 입력해주세요. (예: https://example.com)')
      }
    }
  }
  
  // 이미지 위젯인 경우 파일 선택 검증
  if (widgetOptions.other && widgetOptions.other.type === 'image-widget') {
    if (!widgetOptions.selectedFile && !widgetOptions.imageUrl) {
      errors.push('이미지 파일을 선택해주세요.')
    }
  }
  
  return errors
}

// 위젯 제거
const removeWidget = (widget) => {
  if (confirm('이 위젯을 삭제하시겠습니까?')) {
    const index = dashboardWidgets.value.findIndex((w) => w.instanceId === widget.instanceId)
    if (index !== -1) {
      // 실시간 업데이트 중지
      realtimeUpdateManager.stopUpdate(widget.instanceId)
      // 위젯 데이터 및 상태 제거
      widgetDataStore.removeWidgetData(widget.instanceId)
      widgetStateStore.removeWidgetState(widget.instanceId)
      // 위젯 제거
      dashboardWidgets.value.splice(index, 1)
      saveDashboard()
    }
  }
}

// 이미지 파일 업로드 관련 메서드들
const handleImageFileUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  // 파일 타입 검증
  if (!file.type.startsWith('image/')) {
    alert('이미지 파일만 업로드할 수 있습니다.')
    return
  }
  
  // 파일 크기 검증 (10MB 제한)
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    alert('파일 크기는 10MB 이하여야 합니다.')
    return
  }
  
  widgetOptions.selectedFile = file
  
  // 파일을 Base64로 변환하여 미리보기 표시
  const reader = new FileReader()
  reader.onload = (e) => {
    widgetOptions.imageUrl = e.target.result
  }
  reader.readAsDataURL(file)
}

const clearSelectedFile = () => {
  widgetOptions.selectedFile = null
  widgetOptions.imageUrl = ''
  // 파일 input 초기화
  const fileInput = document.getElementById('image-file-input')
  if (fileInput) {
    fileInput.value = ''
  }
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const clearSelectedImage = () => {
  clearSelectedFile()
}

const handleImageError = (event) => {
  console.error('이미지 로드 오류:', event.target.src)
  alert('이미지를 불러올 수 없습니다.')
}

const handleImageLoad = (event) => {
  console.log('이미지 로드 성공:', event.target.src)
}

// 위젯 크기 조절 모달 열기
const resizeWidget = () => {
  alert('위젯의 모서리를 드래그하여 크기를 조절할 수 있습니다.')
}

// 사용 가능한 너비 옵션 생성
const getAvailableWidthOptions = (widget) => {
  if (!widget) return [1, 2, 3, 4, 6]
  
  const minSize = widgetMinGridSizes[widget.type] || { width: 1, height: 1 }
  const maxSize = widgetMaxGridSizes[widget.type] || { width: 16, height: 6 }
  
  const options = []
  for (let i = minSize.width; i <= maxSize.width; i++) {
    options.push(i)
  }
  return options
}

// 사용 가능한 높이 옵션 생성
const getAvailableHeightOptions = (widget) => {
  if (!widget) return [1, 2, 3, 4]
  
  const minSize = widgetMinGridSizes[widget.type] || { width: 1, height: 1 }
  const maxSize = widgetMaxGridSizes[widget.type] || { width: 16, height: 6 }
  
  const options = []
  for (let i = minSize.height; i <= maxSize.height; i++) {
    options.push(i)
  }
  return options
}

// 위젯 크기 조절 모달 닫기
const closeResizeModal = () => {
  resizeModal.show = false
  resizeModal.widget = null
}

// 위젯 크기 조절 적용
const applyResize = () => {
  if (resizeModal.widget) {
    const newSize = { width: resizeModal.width, height: resizeModal.height }

    // 새로운 크기로 배치 가능한지 확인
    if (canPlaceWidget(resizeModal.widget.position, newSize, resizeModal.widget)) {
      resizeModal.widget.gridSize = newSize
      saveDashboard()
      closeResizeModal()
    } else {
      alert('해당 크기로 변경할 수 없습니다. 다른 위젯과 겹치거나 그리드 범위를 벗어납니다.')
    }
  }
}

// 위젯 상세보기 모달 열기
const openWidgetModal = (widget) => {
  console.log('모달 열기 - 위젯:', widget)
  console.log('모달 열기 - 현재 스토어 데이터:', widgetDataStore.getWidgetData(widget.instanceId))

  widgetModal.widget = widget
  widgetModal.additionalInfo = {
    '업데이트 주기': Array.isArray(widget.updateCycle)
      ? widget.updateCycle.map((c) => widgetChar(c)).join(', ')
      : widget.updateCycle,
    '생성 시간': new Date(widget.instanceId).toLocaleString(),
  }
  widgetModal.show = true
}

// 위젯 상세보기 모달 닫기
const closeWidgetModal = () => {
  widgetModal.show = false
  widgetModal.widget = null
  widgetModal.additionalInfo = null
}

// 위젯 설정 열기
const openWidgetSettings = () => {
  console.log('위젯 설정 열기:', widgetModal.widget)
  // TODO: 위젯별 설정 모달 구현
  alert('위젯 설정 기능은 추후 구현 예정입니다.')
}

// 차트 위젯인지 확인하는 함수
const isChartWidget = (widgetType) => {
  const chartWidgets = ['bar-chart', 'line-chart', 'pie-chart']
  return chartWidgets.includes(widgetType)
}

const widgetResizeState = reactive({
  isResizing: false,
  resizingWidget: null,
  startX: null,
  startY: null,
  startWidth: null,
  startHeight: null,
  resizeHandle: null, // 'se' (남동쪽), 'sw' (남서쪽), 'ne' (북동쪽), 'nw' (북서쪽)
})

const resetWidgetResizeState = () => {
  widgetResizeState.isResizing = false
  widgetResizeState.resizingWidget = null
  widgetResizeState.startX = null
  widgetResizeState.startY = null
  widgetResizeState.startWidth = null
  widgetResizeState.startHeight = null
  widgetResizeState.resizeHandle = null
}

// 위젯 크기 조절 시작
const handleResizeStart = (widget, event, handle = 'se') => {
  event.stopPropagation()
  event.preventDefault()

  widgetResizeState.isResizing = true
  widgetResizeState.resizingWidget = widget
  widgetResizeState.startX = event.clientX
  widgetResizeState.startY = event.clientY
  widgetResizeState.startWidth = widget.gridSize.width
  widgetResizeState.startHeight = widget.gridSize.height
  widgetResizeState.resizeHandle = handle

  // 마우스 이벤트 리스너 등록
  document.addEventListener('mousemove', handleResizeMove)
  document.addEventListener('mouseup', handleResizeEnd)

  console.log('크기 조절 시작:', widget.name, handle)
}

// 위젯 크기 조절 중
const handleResizeMove = (event) => {
  if (!widgetResizeState.isResizing || !widgetResizeState.resizingWidget) return

  event.preventDefault()

  const deltaX = event.clientX - widgetResizeState.startX
  const deltaY = event.clientY - widgetResizeState.startY

  // 그리드 셀 크기 계산
  const gridRect = dashboardGrid.value.getBoundingClientRect()
  const cellWidth = (gridRect.width - 48) / gridConfig.cols
  const cellHeight = (gridRect.height - 48) / gridConfig.rows

  // 델타를 그리드 단위로 변환
  const gridDeltaX = Math.round(deltaX / cellWidth)
  const gridDeltaY = Math.round(deltaY / cellHeight)
  
  const minSize = widgetMinGridSizes[widgetResizeState.resizingWidget.type] || {
    width: 1,
    height: 1,
  }
  
  const maxSize = widgetMaxGridSizes[widgetResizeState.resizingWidget.type] || {
    width: 16,
    height: 6,
  }
  // 새로운 크기 계산
  let newWidth = widgetResizeState.startWidth
  let newHeight = widgetResizeState.startHeight

  switch (widgetResizeState.resizeHandle) {
    case 'se': // 남동쪽 (오른쪽 아래)
      newWidth = Math.max(minSize.width, widgetResizeState.startWidth + gridDeltaX)
      newHeight = Math.max(minSize.height, widgetResizeState.startHeight + gridDeltaY)
      break
    case 'sw': // 남서쪽 (왼쪽 아래)
      newWidth = Math.max(1, widgetResizeState.startWidth - gridDeltaX)
      newHeight = Math.max(1, widgetResizeState.startHeight + gridDeltaY)
      break
    case 'ne': // 북동쪽 (오른쪽 위)
      newWidth = Math.max(1, widgetResizeState.startWidth + gridDeltaX)
      newHeight = Math.max(1, widgetResizeState.startHeight - gridDeltaY)
      break
    case 'nw': // 북서쪽 (왼쪽 위)
      newWidth = Math.max(1, widgetResizeState.startWidth - gridDeltaX)
      newHeight = Math.max(1, widgetResizeState.startHeight - gridDeltaY)
      break
  }

  // 그리드 범위 제한
  const widget = widgetResizeState.resizingWidget

  const maxWidth = gridConfig.cols - widget.position.x
  const maxHeight = gridConfig.rows - widget.position.y

  // newWidth = Math.min(newWidth, maxWidth)
  // newHeight = Math.min(newHeight, maxHeight)

  // 최소 크기 제한 적용
  newWidth = Math.max(minSize.width, newWidth)
  newHeight = Math.max(minSize.height, newHeight)

  // 위젯별 최대 크기 제한 적용
  newWidth = Math.min(newWidth, maxSize.width)
  newHeight = Math.min(newHeight, maxSize.height)

  // 그리드 범위 제한 적용
  newWidth = Math.min(newWidth, maxWidth)
  newHeight = Math.min(newHeight, maxHeight)

  // 다른 위젯과 겹치는지 확인
  const newSize = { width: newWidth, height: newHeight }
  const canResize = canPlaceWidget(widget.position, newSize, widget)

  // 임시로 크기 업데이트 (시각적 피드백)
  widget.gridSize.width = newWidth
  widget.gridSize.height = newHeight

  // 겹침 상태에 따라 시각적 피드백 제공
  if (!canResize) {
    // 겹치는 경우 빨간색 테두리로 표시
    console.log('크기 조절 중 겹침 감지:', widget.name, newSize)
  }
}

// 위젯 크기 조절 완료
const handleResizeEnd = (event) => {
  if (!widgetResizeState.isResizing) return

  event.preventDefault()

  // 마우스 이벤트 리스너 제거
  document.removeEventListener('mousemove', handleResizeMove)
  document.removeEventListener('mouseup', handleResizeEnd)

  // 최종 크기 확인 및 저장
  const widget = widgetResizeState.resizingWidget
  const finalSize = { width: widget.gridSize.width, height: widget.gridSize.height }

  if (canPlaceWidget(widget.position, finalSize, widget)) {
    saveDashboard()
    console.log('크기 조절 완료:', widget.name, finalSize)
  } else {
    // 크기 조절 실패 시 원래 크기로 복원
    widget.gridSize.width = widgetResizeState.startWidth
    widget.gridSize.height = widgetResizeState.startHeight
    console.log('크기 조절 실패 - 원래 크기로 복원')
  }

  resetWidgetResizeState()
}

onMounted(() => {
  // 초기 날짜 설정
  updateCurrentDate()

  // 매 분마다 날짜 업데이트 (날짜가 바뀔 수 있으므로)
  dateUpdateInterval = setInterval(updateCurrentDate, 60000) // 1분마다

  loadDashboard()
  // 헤더에서 오는 이벤트 리스너 등록
  window.addEventListener('edit-mode-change', handleEditModeChange)
  window.addEventListener('sidebar-toggle', handleSidebarToggle)
  window.addEventListener('save-dashboard', handleSaveDashboard)
  window.addEventListener('confirm-exit-edit-mode', handleConfirmExitEditMode)
})

// onUnmounted() 이전에 위치

onUnmounted(() => {
  // 날짜 업데이트 타이머 정리
  if (dateUpdateInterval) {
    clearInterval(dateUpdateInterval)
  }

  // 모든 실시간 업데이트 중지
  realtimeUpdateManager.stopAllUpdates()

  // 이벤트 리스너 제거
  window.removeEventListener('edit-mode-change', handleEditModeChange)
  window.removeEventListener('sidebar-toggle', handleSidebarToggle)
  window.removeEventListener('save-dashboard', handleSaveDashboard)
  window.removeEventListener('confirm-exit-edit-mode', handleConfirmExitEditMode)
})
</script>

<style scoped>
@import './DashboardView-styles.css';
</style>
