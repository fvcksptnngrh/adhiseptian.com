import { ref, onMounted, onUnmounted } from 'vue'

export function useScroll(threshold = 0) {
  const isScrolled = ref(false)
  var ticking = false

  const handleScroll = () => {
    if (!ticking) {
      ticking = true
      requestAnimationFrame(() => {
        isScrolled.value = window.scrollY > threshold
        ticking = false
      })
    }
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })

  return isScrolled
}
