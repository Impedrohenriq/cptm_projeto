import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/styles/main.css'
import { registerSW } from 'virtual:pwa-register'

const app = createApp(App)

app.use(createPinia())
app.use(router)

const registerServiceWorker = () => {
	registerSW({
		immediate: true,
		onRegisteredSW(swScriptUrl, registration) {
			if (!registration) return

			// Ping the service worker to trigger sync checks when available.
			if (registration.active) {
				registration.active.postMessage({ type: 'CPTM_SYNC_NOW', swScriptUrl })
			}
		},
	})
}

// Aguarda a navegação inicial completar antes de montar
// (evita flicker e race-condition com rotas lazy-loaded)
router.isReady().then(() => {
	app.mount('#app')
	setTimeout(registerServiceWorker, 0)
})
