<template>
  <section class="hero" ref="hero">
    <div class="hero__bg">
      <div class="hero__gradient-orb hero__gradient-orb--1"></div>
      <div class="hero__gradient-orb hero__gradient-orb--2"></div>
    </div>

    <div class="hero__content container">
      <div class="hero__label" ref="label">
        <span class="hero__label-line"></span>
        <span>PORTFOLIO — 2025</span>
      </div>

      <h1 class="hero__title" ref="title">
        <span class="hero__title-line" ref="titleLine1">ADHI</span>
        <span class="hero__title-line hero__title-line--outline" ref="titleLine2">SEPTIAN</span>
        <span class="hero__title-line" ref="titleLine3">NUGROHO</span>
      </h1>

      <div class="hero__subtitle" ref="subtitle">
        <span class="hero__typewriter">{{ displayedText }}<span class="hero__cursor-blink">|</span></span>
      </div>

      <div class="hero__tags" ref="tags">
        <span class="hero__tag">Frontend Developer</span>
        <span class="hero__tag-dot"></span>
        <span class="hero__tag">Informatics Engineering Student</span>
      </div>

      <button class="hero__cta" ref="cta" @click="scrollToWork">
        <span>View Work</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M7 17L17 7M17 7H7M17 7V17"/>
        </svg>
      </button>

      <div class="hero__scroll-indicator" ref="scrollIndicator">
        <span class="hero__scroll-text">SCROLL</span>
        <div class="hero__scroll-line"></div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'HeroSection',
  data() {
    return {
      displayedText: '',
      phrases: [
        'Frontend Developer Intern @ Alfagift',
        'Building Web Apps with Vue & Nuxt',
        'React, TypeScript & Tailwind CSS',
        'Turning Ideas Into Real Solutions',
        'Based in Salatiga, Indonesia'
      ],
      phraseIndex: 0,
      charIndex: 0,
      isDeleting: false,
      typeSpeed: 80
    }
  },
  mounted() {
    this.startTypewriter()
    this.initGSAP()
  },
  beforeDestroy() {
    if (this.typeTimer) clearTimeout(this.typeTimer)
  },
  methods: {
    startTypewriter() {
      const currentPhrase = this.phrases[this.phraseIndex]
      if (!this.isDeleting) {
        this.displayedText = currentPhrase.substring(0, this.charIndex + 1)
        this.charIndex++
        if (this.charIndex === currentPhrase.length) {
          this.isDeleting = true
          this.typeSpeed = 2000
        } else {
          this.typeSpeed = 80
        }
      } else {
        this.displayedText = currentPhrase.substring(0, this.charIndex - 1)
        this.charIndex--
        if (this.charIndex === 0) {
          this.isDeleting = false
          this.phraseIndex = (this.phraseIndex + 1) % this.phrases.length
          this.typeSpeed = 400
        } else {
          this.typeSpeed = 40
        }
      }
      this.typeTimer = setTimeout(() => this.startTypewriter(), this.typeSpeed)
    },
    initGSAP() {
      if (!this.$gsap) return
      var isMobile = window.innerWidth < 768
      var tl = this.$gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from(this.$refs.label, { y: 30, opacity: 0, duration: 0.8, delay: 0.2 })
        .from(this.$refs.titleLine1, { y: isMobile ? 40 : 100, opacity: 0, duration: 0.9 }, '-=0.4')
        .from(this.$refs.titleLine2, { y: isMobile ? 40 : 100, opacity: 0, duration: 0.9 }, '-=0.6')
        .from(this.$refs.titleLine3, { y: isMobile ? 40 : 100, opacity: 0, duration: 0.9 }, '-=0.6')
        .from(this.$refs.subtitle, { y: 20, opacity: 0, duration: 0.6 }, '-=0.3')
        .from(this.$refs.tags, { y: 20, opacity: 0, duration: 0.6 }, '-=0.4')
        .from(this.$refs.cta, { y: 20, opacity: 0, duration: 0.6 }, '-=0.3')
        .from(this.$refs.scrollIndicator, { opacity: 0, duration: 0.8 }, '-=0.2')

      // Skip scroll-linked parallax on mobile
      if (!isMobile) {
        this.$gsap.to(this.$refs.title, {
          y: -80,
          scrollTrigger: {
            trigger: this.$refs.hero,
            start: 'top top',
            end: 'bottom top',
            scrub: 1
          }
        })
      }
    },
    scrollToWork() {
      const el = document.getElementById('portfolio')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }
}
</script>

<style lang="scss" scoped>
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;

  &__bg {
    position: absolute;
    inset: 0;
    z-index: 0;
  }

  &__gradient-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(140px);
    opacity: 0.15;

    &--1 {
      width: 600px;
      height: 600px;
      background: $accent-cyan;
      top: -200px;
      right: -100px;
      animation: heroFloat1 10s ease-in-out infinite;
    }

    &--2 {
      width: 500px;
      height: 500px;
      background: $accent-cyan;
      bottom: -200px;
      left: -150px;
      animation: heroFloat2 12s ease-in-out infinite;
    }
  }

  &__content {
    position: relative;
    z-index: $z-content;
    padding-top: 140px;
    padding-bottom: 80px;
  }

  &__label {
    display: flex;
    align-items: center;
    gap: 16px;
    font-family: $font-body;
    font-size: $fs-caption;
    font-weight: 500;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: $text-muted;
    margin-bottom: 32px;
  }

  &__label-line {
    width: 40px;
    height: 1px;
    background: $accent-cyan;
  }

  &__title {
    font-family: $font-heading;
    font-size: $fs-hero;
    line-height: 0.95;
    letter-spacing: -2px;
    text-transform: uppercase;
    margin-bottom: 28px;
  }

  &__title-line {
    display: block;

    &--outline {
      color: transparent;
      -webkit-text-stroke: 1.5px rgba($text-primary, 0.4);
    }
  }

  &__subtitle {
    font-family: $font-body;
    font-size: clamp(15px, 1.8vw, 20px);
    color: $text-secondary;
    margin-bottom: 20px;
    min-height: 30px;
  }

  &__cursor-blink {
    color: $accent-cyan;
    animation: blink 0.8s infinite;
    font-weight: 300;
  }

  &__tags {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 48px;
    flex-wrap: wrap;
  }

  &__tag {
    font-family: $font-body;
    font-size: $fs-caption;
    font-weight: 400;
    color: $text-muted;
    letter-spacing: 0.5px;
  }

  &__tag-dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: $accent-cyan;
  }

  &__cta {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 14px 32px;
    font-family: $font-body;
    font-size: $fs-small;
    font-weight: 500;
    letter-spacing: 1px;
    text-transform: uppercase;
    border: 1px solid $border-color;
    color: $text-primary;
    background: transparent;
    transition: all $transition-medium;
    border-radius: 0;

    &:hover {
      border-color: $accent-cyan;
      background: rgba($accent-cyan, 0.08);
      box-shadow: 0 0 20px rgba($accent-cyan, 0.15);
    }
  }

  &__scroll-indicator {
    position: absolute;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  &__scroll-text {
    font-size: 10px;
    letter-spacing: 3px;
    color: $text-muted;
  }

  &__scroll-line {
    width: 1px;
    height: 50px;
    background: linear-gradient(to bottom, rgba($accent-cyan, 0.6), transparent);
    animation: scrollPulse 2s ease-in-out infinite;
  }
}

@keyframes heroFloat1 {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(-30px, 30px); }
}
@keyframes heroFloat2 {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(30px, -30px); }
}
@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
@keyframes scrollPulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

@media (max-width: $bp-tablet) {
  .hero {
    &__scroll-indicator { display: none; }

    &__gradient-orb {
      filter: blur(80px);
      opacity: 0.1;

      &--1 {
        width: 300px;
        height: 300px;
        animation: none;
      }
      &--2 {
        width: 250px;
        height: 250px;
        animation: none;
      }
    }

    &__content {
      padding-top: 100px;
      padding-bottom: 60px;
    }

    &__title {
      letter-spacing: -1px;
    }
  }
}
</style>
