import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/styles/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Aguarda a navegação inicial completar antes de montar
// (evita flicker e race-condition com rotas lazy-loaded)
router.isReady().then(() => app.mount('#app'))
