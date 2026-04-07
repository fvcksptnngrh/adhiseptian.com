<template>
  <div class="custom-cursor" v-if="!isMobile">
    <div class="cursor-dot" ref="dot"></div>
    <div class="cursor-ring" ref="ring"></div>
  </div>
</template>

<script>
export default {
  name: 'CustomCursor',
  data() {
    return {
      isMobile: true
    }
  },
  mounted() {
    this.isMobile = window.innerWidth <= 768
    if (this.isMobile) return
    this.$nextTick(() => {
      this.initCursor()
    })
  },
  methods: {
    initCursor() {
      const dot = this.$refs.dot
      const ring = this.$refs.ring
      if (!dot || !ring) return

      let mouseX = window.innerWidth / 2
      let mouseY = window.innerHeight / 2
      let ringX = mouseX
      let ringY = mouseY

      document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX
        mouseY = e.clientY
        dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`
      })

      const animate = () => {
        ringX += (mouseX - ringX) * 0.12
        ringY += (mouseY - ringY) * 0.12
        ring.style.transform = `translate(${ringX - 16}px, ${ringY - 16}px)`
        requestAnimationFrame(animate)
      }
      animate()

      document.addEventListener('mouseover', (e) => {
        if (e.target.closest('a, button, .project-card, .filter-btn, .skill-tag')) {
          ring.classList.add('cursor-hover')
          dot.classList.add('cursor-hover')
        }
      })
      document.addEventListener('mouseout', (e) => {
        if (e.target.closest('a, button, .project-card, .filter-btn, .skill-tag')) {
          ring.classList.remove('cursor-hover')
          dot.classList.remove('cursor-hover')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-cursor {
  pointer-events: none;
  position: fixed;
  top: 0;
  left: 0;
  z-index: $z-cursor;
}

.cursor-dot {
  width: 8px;
  height: 8px;
  background: var(--accent-cyan);
  border-radius: 50%;
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  transition: width 0.2s, height 0.2s, background 0.2s;
  will-change: transform;
  box-shadow: 0 0 10px 3px var(--accent-cyan-glow);

  &.cursor-hover {
    width: 12px;
    height: 12px;
    background: var(--text-primary);
    box-shadow: 0 0 14px 4px var(--cursor-hover-bg);
  }
}

.cursor-ring {
  width: 32px;
  height: 32px;
  border: 1.5px solid var(--cursor-ring-border);
  border-radius: 50%;
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  transition: width 0.3s, height 0.3s, border-color 0.3s, opacity 0.3s;
  will-change: transform;
  opacity: 0.6;

  &.cursor-hover {
    width: 50px;
    height: 50px;
    border-color: var(--cursor-ring-hover-border);
    opacity: 0.4;
  }
}
</style>
