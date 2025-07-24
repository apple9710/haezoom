<template>
  <div class="app-container">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'


const authStore = useAuthStore()

onMounted(() => {
  // 앱 시작시 저장된 인증 정보 초기화
  authStore.initAuth()
})
</script>

<style>
/* 전체 앱 스타일 */
.app-container {
  min-height: 100vh;
  width: 100vw;
  font-family: 'Pretendard', sans-serif;
  overflow-x: hidden;
  position: relative;
  background: var(--color-bg-gray);
}

/* 기본 리셋 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  line-height: 1.6;
  color: #000000;
  overflow-x: hidden;
  scroll-behavior: smooth;
}

/* 폰트 최적화 */
html {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  font-feature-settings: "kern" 1;
}

/* 버튼, 입력 필드 기본 스타일 */
button {
  font-family: inherit;
  border: none;
  outline: none;
  cursor: pointer;
}

input, select, textarea {
  font-family: inherit;
  outline: none;
}

/* 링크 기본 스타일 */
a {
  color: inherit;
  text-decoration: none;
}

/* 스크롤바 커스터마이징 (Webkit 브라우저) */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
}

::-webkit-scrollbar-thumb {
  background: #F0BBB1 !important;
  border-radius: 4px;
  transition: all 0.3s ease;
  border: none;
}

::-webkit-scrollbar-thumb:hover {
  background: #E16349 !important;
}

::-webkit-scrollbar-thumb:active {
  background: #D53818 !important;
}

::-webkit-scrollbar-corner {
  background: rgba(0, 0, 0, 0.05);
}


/* 특정 브라우저 벤더 프리픽스 추가 */
/* ::-webkit-scrollbar-thumb:vertical {
  background: #F0BBB1 !important;
}

::-webkit-scrollbar-thumb:horizontal {
  background: #F0BBB1 !important;
} */

/* 선택 영역 스타일 */
::selection {
  background: rgba(225, 99, 73, 0.2);
  color: var(--color-font-primary);
}

::-moz-selection {
  background: rgba(225, 99, 73, 0.2);
  color: var(--color-font-primary);
}

/* 포커스 가능한 요소들의 기본 포커스 스타일 */
button:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible,
[tabindex]:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: 4px;
}

/* 애니메이션 감소 설정 존중 */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* 고대비 모드 지원 */
@media (prefers-contrast: high) {
  .app-container .app-header {
    border-bottom: 2px solid var(--color-font-primary);
  }
  
  button {
    border: 2px solid currentColor;
  }
}

/* 다크모드 준비 (추후 구현용) */
@media (prefers-color-scheme: dark) {
  /* 다크모드 스타일이 필요할 때 여기에 추가 */
}

/* 프린트 스타일 */
@media print {
  .app-header,
  .main-footer,
  button {
    display: none !important;
  }
  
  * {
    background: white !important;
    color: black !important;
    box-shadow: none !important;
  }
}

/* 터치 디바이스 최적화 */
@media (hover: none) and (pointer: coarse) {
  button,
  .feature-card,
  .stat-card {
    min-height: 44px;
  }
}

/* 고해상도 디스플레이 최적화 */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .header-logo,
  .user-avatar {
    transform: translateZ(0);
    will-change: transform;
  }
}
</style>