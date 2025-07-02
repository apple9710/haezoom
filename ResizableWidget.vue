<template>
  <div 
    ref="widgetContainer"
    class="resizable-widget"
    :class="{ 'edit-mode': isEditMode, 'resizing': isResizing }"
    :style="widgetStyle"
    @mousedown="onMouseDown"
  >
    <!-- 위젯 내용 슬롯 -->
    <div class="widget-content" :class="{ 'pointer-events-none': isEditMode }">
      <slot></slot>
    </div>

    <!-- 편집 모드일 때만 표시되는 리사이즈 핸들들 -->
    <template v-if="isEditMode">
      <!-- 모서리 핸들 -->
      <div class="resize-handle corner top-left" @mousedown.stop="startResize('nw', $event)"></div>
      <div class="resize-handle corner top-right" @mousedown.stop="startResize('ne', $event)"></div>
      <div class="resize-handle corner bottom-left" @mousedown.stop="startResize('sw', $event)"></div>
      <div class="resize-handle corner bottom-right" @mousedown.stop="startResize('se', $event)"></div>
      
      <!-- 가장자리 핸들 -->
      <div class="resize-handle edge top" @mousedown.stop="startResize('n', $event)"></div>
      <div class="resize-handle edge right" @mousedown.stop="startResize('e', $event)"></div>
      <div class="resize-handle edge bottom" @mousedown.stop="startResize('s', $event)"></div>
      <div class="resize-handle edge left" @mousedown.stop="startResize('w', $event)"></div>
      
      <!-- 위젯 정보 표시 -->
      <div class="widget-info">
        <span class="widget-size">{{ width }}×{{ height }}</span>
      </div>
    </template>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'

export default {
  name: 'ResizableWidget',
  props: {
    // 편집 모드 여부
    isEditMode: {
      type: Boolean,
      default: false
    },
    // 초기 크기
    initialWidth: {
      type: Number,
      default: 300
    },
    initialHeight: {
      type: Number,
      default: 200
    },
    // 최소/최대 크기
    minWidth: {
      type: Number,
      default: 150
    },
    minHeight: {
      type: Number,
      default: 100
    },
    maxWidth: {
      type: Number,
      default: 800
    },
    maxHeight: {
      type: Number,
      default: 600
    },
    // 위젯 ID
    widgetId: {
      type: String,
      required: true
    }
  },
  emits: ['resize', 'move'],
  setup(props, { emit }) {
    const widgetContainer = ref(null)
    const width = ref(props.initialWidth)
    const height = ref(props.initialHeight)
    const x = ref(0)
    const y = ref(0)
    
    const isResizing = ref(false)
    const isDragging = ref(false)
    const resizeDirection = ref('')
    
    const startPos = ref({ x: 0, y: 0 })
    const startSize = ref({ width: 0, height: 0 })
    const startPosition = ref({ x: 0, y: 0 })

    // 위젯 스타일 계산
    const widgetStyle = computed(() => ({
      width: `${width.value}px`,
      height: `${height.value}px`,
      transform: `translate(${x.value}px, ${y.value}px)`,
      zIndex: isResizing.value || isDragging.value ? 1000 : 1
    }))

    // 리사이즈 시작
    const startResize = (direction, event) => {
      if (!props.isEditMode) return
      
      event.preventDefault()
      event.stopPropagation()
      
      isResizing.value = true
      resizeDirection.value = direction
      
      startPos.value = {
        x: event.clientX,
        y: event.clientY
      }
      
      startSize.value = {
        width: width.value,
        height: height.value
      }
      
      startPosition.value = {
        x: x.value,
        y: y.value
      }
      
      document.addEventListener('mousemove', onResize)
      document.addEventListener('mouseup', stopResize)
      document.body.style.cursor = getCursorForDirection(direction)
      document.body.style.userSelect = 'none'
    }

    // 리사이즈 진행
    const onResize = (event) => {
      if (!isResizing.value) return
      
      const deltaX = event.clientX - startPos.value.x
      const deltaY = event.clientY - startPos.value.y
      
      let newWidth = startSize.value.width
      let newHeight = startSize.value.height
      let newX = startPosition.value.x
      let newY = startPosition.value.y
      
      // 방향에 따른 크기 계산
      if (resizeDirection.value.includes('e')) {
        newWidth = Math.max(props.minWidth, Math.min(props.maxWidth, startSize.value.width + deltaX))
      }
      if (resizeDirection.value.includes('w')) {
        newWidth = Math.max(props.minWidth, Math.min(props.maxWidth, startSize.value.width - deltaX))
        newX = startPosition.value.x + (startSize.value.width - newWidth)
      }
      if (resizeDirection.value.includes('s')) {
        newHeight = Math.max(props.minHeight, Math.min(props.maxHeight, startSize.value.height + deltaY))
      }
      if (resizeDirection.value.includes('n')) {
        newHeight = Math.max(props.minHeight, Math.min(props.maxHeight, startSize.value.height - deltaY))
        newY = startPosition.value.y + (startSize.value.height - newHeight)
      }
      
      width.value = newWidth
      height.value = newHeight
      x.value = newX
      y.value = newY
    }

    // 리사이즈 종료
    const stopResize = () => {
      isResizing.value = false
      resizeDirection.value = ''
      
      document.removeEventListener('mousemove', onResize)
      document.removeEventListener('mouseup', stopResize)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      
      // 크기 변경 이벤트 발생
      emit('resize', {
        id: props.widgetId,
        width: width.value,
        height: height.value,
        x: x.value,
        y: y.value
      })
    }

    // 위젯 드래그 시작 (이동용)
    const onMouseDown = (event) => {
      if (!props.isEditMode || isResizing.value) return
      if (event.target.classList.contains('resize-handle')) return
      
      event.preventDefault()
      
      isDragging.value = true
      startPos.value = {
        x: event.clientX - x.value,
        y: event.clientY - y.value
      }
      
      document.addEventListener('mousemove', onDrag)
      document.addEventListener('mouseup', stopDrag)
      document.body.style.cursor = 'move'
      document.body.style.userSelect = 'none'
    }

    // 위젯 드래그
    const onDrag = (event) => {
      if (!isDragging.value) return
      
      x.value = event.clientX - startPos.value.x
      y.value = event.clientY - startPos.value.y
    }

    // 위젯 드래그 종료
    const stopDrag = () => {
      isDragging.value = false
      
      document.removeEventListener('mousemove', onDrag)
      document.removeEventListener('mouseup', stopDrag)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      
      // 위치 변경 이벤트 발생
      emit('move', {
        id: props.widgetId,
        x: x.value,
        y: y.value
      })
    }

    // 방향에 따른 커서 설정
    const getCursorForDirection = (direction) => {
      const cursors = {
        'n': 'n-resize',
        'ne': 'ne-resize',
        'e': 'e-resize',
        'se': 'se-resize',
        's': 's-resize',
        'sw': 'sw-resize',
        'w': 'w-resize',
        'nw': 'nw-resize'
      }
      return cursors[direction] || 'default'
    }

    onUnmounted(() => {
      document.removeEventListener('mousemove', onResize)
      document.removeEventListener('mouseup', stopResize)
      document.removeEventListener('mousemove', onDrag)
      document.removeEventListener('mouseup', stopDrag)
    })

    return {
      widgetContainer,
      width,
      height,
      x,
      y,
      isResizing,
      isDragging,
      widgetStyle,
      startResize,
      onMouseDown
    }
  }
}
</script>

<style scoped>
.resizable-widget {
  position: relative;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(225, 99, 73, 0.2);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  overflow: hidden;
}

.resizable-widget.edit-mode {
  border: 2px solid #E16349;
  box-shadow: 0 0 0 4px rgba(225, 99, 73, 0.2);
}

.resizable-widget.resizing {
  transition: none;
}

.widget-content {
  width: 100%;
  height: 100%;
  padding: 16px;
  overflow: auto;
}

.widget-content.pointer-events-none {
  pointer-events: none;
}

/* 리사이즈 핸들 기본 스타일 */
.resize-handle {
  position: absolute;
  background: #E16349;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.resizable-widget.edit-mode .resize-handle {
  opacity: 1;
}

/* 모서리 핸들 */
.resize-handle.corner {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid #FFFFFF;
  z-index: 10;
}

.resize-handle.top-left {
  top: -6px;
  left: -6px;
  cursor: nw-resize;
}

.resize-handle.top-right {
  top: -6px;
  right: -6px;
  cursor: ne-resize;
}

.resize-handle.bottom-left {
  bottom: -6px;
  left: -6px;
  cursor: sw-resize;
}

.resize-handle.bottom-right {
  bottom: -6px;
  right: -6px;
  cursor: se-resize;
}

/* 가장자리 핸들 */
.resize-handle.edge {
  background: rgba(225, 99, 73, 0.8);
  z-index: 5;
}

.resize-handle.top {
  top: -3px;
  left: 20px;
  right: 20px;
  height: 6px;
  cursor: n-resize;
  border-radius: 3px;
}

.resize-handle.right {
  top: 20px;
  right: -3px;
  bottom: 20px;
  width: 6px;
  cursor: e-resize;
  border-radius: 3px;
}

.resize-handle.bottom {
  bottom: -3px;
  left: 20px;
  right: 20px;
  height: 6px;
  cursor: s-resize;
  border-radius: 3px;
}

.resize-handle.left {
  top: 20px;
  left: -3px;
  bottom: 20px;
  width: 6px;
  cursor: w-resize;
  border-radius: 3px;
}

/* 위젯 정보 표시 */
.widget-info {
  position: absolute;
  top: -35px;
  left: 50%;
  transform: translateX(-50%);
  background: #E16349;
  color: white;
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  z-index: 20;
}

.widget-info::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 4px solid transparent;
  border-top-color: #E16349;
}

/* 호버 효과 */
.resize-handle:hover {
  transform: scale(1.2);
}

.resize-handle.corner:hover {
  box-shadow: 0 0 8px rgba(225, 99, 73, 0.5);
}

/* 반응형 */
@media (max-width: 768px) {
  .resize-handle.corner {
    width: 16px;
    height: 16px;
  }
  
  .resize-handle.edge {
    opacity: 0.8;
  }
  
  .widget-content {
    padding: 12px;
  }
}
</style>