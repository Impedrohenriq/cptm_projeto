import { ref, onMounted, onUnmounted } from 'vue'

export function useSwipe(onSwipeLeft, onSwipeRight, threshold = 50) {
  const startX = ref(0)
  const startY = ref(0)
  const el = ref(null)

  function onTouchStart(e) {
    startX.value = e.touches[0].clientX
    startY.value = e.touches[0].clientY
  }

  function onTouchEnd(e) {
    const dx = e.changedTouches[0].clientX - startX.value
    const dy = e.changedTouches[0].clientY - startY.value
    // Only trigger if horizontal swipe is dominant
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > threshold) {
      if (dx < 0) onSwipeLeft && onSwipeLeft()
      else onSwipeRight && onSwipeRight()
    }
  }

  function bind(element) {
    el.value = element
    if (!element) return
    element.addEventListener('touchstart', onTouchStart, { passive: true })
    element.addEventListener('touchend', onTouchEnd, { passive: true })
  }

  function unbind() {
    if (!el.value) return
    el.value.removeEventListener('touchstart', onTouchStart)
    el.value.removeEventListener('touchend', onTouchEnd)
  }

  return { bind, unbind }
}
