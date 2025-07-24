import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from '@/stores/auth'
import './assets/main.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// 앱 마운트 후 인증 정보 초기화
app.mount('#app')

// 인증 정보 복원
const authStore = useAuthStore()
authStore.initAuth()
