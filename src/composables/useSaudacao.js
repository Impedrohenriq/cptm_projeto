import { computed } from 'vue'

export function useSaudacao() {
  const saudacao = computed(() => {
    const h = new Date().getHours()
    if (h >= 5 && h < 12) return 'Bom dia,'
    if (h >= 12 && h < 18) return 'Boa tarde,'
    return 'Boa noite,'
  })
  return { saudacao }
}
