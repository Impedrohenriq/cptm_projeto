import { computed, onMounted } from 'vue'
import { useInspecoesStore } from '@/stores/inspecoes'

export function useNetwork() {
  const store = useInspecoesStore()

  onMounted(() => {
    store.initialize()
  })

  return {
    isOnline: computed(() => store.browserOnline),
    apiDisponivel: computed(() => store.apiDisponivel),
    pendentesSync: computed(() => store.pendentesSync),
    syncing: computed(() => store.syncing),
  }
}