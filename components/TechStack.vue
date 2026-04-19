<template>
  <div ref="marqueeWrap" class="marquee-wrap">

    <!-- Row 1 — scrolls LEFT -->
    <div ref="row1El" class="marquee-row">
      <div class="marquee-track marquee-track--left">
        <div v-for="(tech, i) in repeat(row1, 4)" :key="'r1-' + i" class="tech-item">
          <img :src="tech.icon" :alt="tech.name" class="tech-icon" width="30" height="30" loading="lazy" decoding="async" />
          <span class="tech-name">{{ tech.name }}</span>
        </div>
      </div>
    </div>

    <!-- Row 2 — scrolls RIGHT -->
    <div ref="row2El" class="marquee-row">
      <div class="marquee-track marquee-track--right">
        <div v-for="(tech, i) in repeat(row2, 4)" :key="'r2-' + i" class="tech-item">
          <img :src="tech.icon" :alt="tech.name" class="tech-icon" width="30" height="30" loading="lazy" decoding="async" />
          <span class="tech-name">{{ tech.name }}</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'TechStack',
  data() {
    return {
      row1: [
        { name: 'Vue.js',       icon: '/icons/tech/vue.svg' },
        { name: 'Nuxt.js',      icon: '/icons/tech/nuxt.svg' },
        { name: 'React',        icon: '/icons/tech/react.svg' },
        { name: 'TypeScript',   icon: '/icons/tech/typescript.svg' },
        { name: 'JavaScript',   icon: '/icons/tech/javascript.svg' },
        { name: 'Tailwind CSS', icon: '/icons/tech/tailwind.svg' },
        { name: 'Figma',        icon: '/icons/tech/figma.svg' },
        { name: 'Git',          icon: '/icons/tech/git.svg' }
      ],
      row2: [
        { name: 'Laravel',      icon: '/icons/tech/laravel.svg' },
        { name: 'PHP',          icon: '/icons/tech/php.svg' },
        { name: 'Spring Boot',  icon: '/icons/tech/springboot.svg' },
        { name: 'Java',         icon: '/icons/tech/java.svg' },
        { name: 'Node.js',      icon: '/icons/tech/nodejs.svg' },
        { name: 'Python',       icon: '/icons/tech/python.svg' },
        { name: 'MySQL',        icon: '/icons/tech/mysql.svg' },
        { name: 'Docker',       icon: '/icons/tech/docker.svg' }
      ]
    }
  },
  mounted() {
    this.$nextTick(function () {
      this.initParallax()
    })
  },
  beforeDestroy() {
    if (this._triggers) {
      for (var i = 0; i < this._triggers.length; i++) {
        this._triggers[i].kill()
      }
    }
  },
  methods: {
    initParallax() {
      var gsap = this.$gsap
      var ST = this.$ScrollTrigger
      if (!gsap || !ST) return

      // Skip scroll-linked parallax on mobile — CSS marquee is enough
      if (window.innerWidth < 768) return

      this._triggers = []

      // Row 1: shifts left slightly on scroll
      if (this.$refs.row1El) {
        var t1 = gsap.to(this.$refs.row1El, {
          x: -30,
          ease: 'none',
          force3D: true,
          scrollTrigger: {
            trigger: this.$refs.marqueeWrap,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        })
        this._triggers.push(t1.scrollTrigger)
      }

      // Row 2: shifts right slightly on scroll (opposite direction)
      if (this.$refs.row2El) {
        var t2 = gsap.to(this.$refs.row2El, {
          x: 30,
          ease: 'none',
          force3D: true,
          scrollTrigger: {
            trigger: this.$refs.marqueeWrap,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        })
        this._triggers.push(t2.scrollTrigger)
      }
    },
    repeat(arr, times) {
      var result = []
      for (var t = 0; t < times; t++) {
        for (var i = 0; i < arr.length; i++) {
          result.push(arr[i])
        }
      }
      return result
    }
  }
}
</script>

<style lang="scss" scoped>
.marquee-wrap {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-left: -20px;
  margin-right: -20px;
  overflow: hidden;
}

.marquee-row {
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 60px;
    background: linear-gradient(to right, var(--bg-card), transparent);
    z-index: 2;
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 60px;
    background: linear-gradient(to left, var(--bg-card), transparent);
    z-index: 2;
    pointer-events: none;
  }

  @media (hover: hover) {
    &:hover .marquee-track {
      animation-play-state: paused;
    }
  }
}

.marquee-track {
  display: flex;
  width: max-content;
  gap: 10px;
  will-change: transform;

  // 2 copies total: animate across 1 set = 50%
  &--left {
    animation: scroll-x 40s linear infinite;
  }

  &--right {
    animation: scroll-x 40s linear infinite reverse;
  }
}

@keyframes scroll-x {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.tech-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 14px 20px;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: var(--bg-elevated);
  min-width: 90px;
  user-select: none;
  flex-shrink: 0;
}

.tech-icon {
  width: 30px;
  height: 30px;
  object-fit: contain;
  display: block;
}

.tech-name {
  font-size: 11px;
  font-weight: 500;
  color: var(--text-secondary);
  white-space: nowrap;
}

@media (max-width: 768px) {
  .marquee-track {
    &--left { animation-duration: 30s; }
    &--right { animation-duration: 30s; }
  }
  .tech-item {
    padding: 10px 14px;
    min-width: 76px;
  }
  .tech-icon {
    width: 24px;
    height: 24px;
  }
}
</style>
