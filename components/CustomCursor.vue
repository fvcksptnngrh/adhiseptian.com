<template>
  <div class="custom-cursor" v-if="enabled">
    <div class="cursor-dot" ref="dot"></div>
    <div class="cursor-ring" ref="ring"></div>
  </div>
</template>

<script>
export default {
  name: 'CustomCursor',
  data() {
    return {
      enabled: false
    }
  },
  mounted() {
    var isMobile = window.innerWidth <= 768
    var prefersReducedMotion = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    this.enabled = !isMobile && !prefersReducedMotion
    if (!this.enabled) return

    document.documentElement.classList.add('custom-cursor-enabled')
    this.$nextTick(() => {
      this.initCursor()
    })
  },
  beforeDestroy() {
    document.documentElement.classList.remove('custom-cursor-enabled')

    if (this._animationFrame) {
      cancelAnimationFrame(this._animationFrame)
    }

    if (this._onMouseMove) {
      document.removeEventListener('mousemove', this._onMouseMove)
    }
    if (this._onMouseOver) {
      document.removeEventListener('mouseover', this._onMouseOver)
    }
    if (this._onMouseOut) {
      document.removeEventListener('mouseout', this._onMouseOut)
    }
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

      this._onMouseMove = (e) => {
        mouseX = e.clientX
        mouseY = e.clientY
        dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`
      }
      document.addEventListener('mousemove', this._onMouseMove)

      const animate = () => {
        ringX += (mouseX - ringX) * 0.12
        ringY += (mouseY - ringY) * 0.12
        ring.style.transform = `translate(${ringX - 16}px, ${ringY - 16}px)`
        this._animationFrame = requestAnimationFrame(animate)
      }
      animate()

      this._onMouseOver = (e) => {
        if (e.target.closest('a, button, .project-card, .filter-btn, .skill-tag')) {
          ring.classList.add('cursor-hover')
          dot.classList.add('cursor-hover')
        }
      }
      document.addEventListener('mouseover', this._onMouseOver)

      this._onMouseOut = (e) => {
        if (e.target.closest('a, button, .project-card, .filter-btn, .skill-tag')) {
          ring.classList.remove('cursor-hover')
          dot.classList.remove('cursor-hover')
        }
      }
      document.addEventListener('mouseout', this._onMouseOut)
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
