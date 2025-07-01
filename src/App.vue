<template>

    <AppHeader />
    <router-view />

</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import AppHeader from '@/components/AppHeader.vue'

const authStore = useAuthStore()

onMounted(() => {
  // 앱 시작시 저장된 인증 정보 초기화
  authStore.initializeAuth()
})
</script>

<style>
#app {
  min-height: 100vh;
  width: 100vw;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  overflow-x: hidden;
  /* display: flex; */
  /* flex-direction: column; */
}

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
}

button {
  font-family: inherit;
}

input, select, textarea {
  font-family: inherit;
}
</style>