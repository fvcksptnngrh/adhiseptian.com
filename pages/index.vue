<template>
  <div class="home-page">
    <!-- Background layers — lives outside content-wrap so they never get clipped -->
    <div ref="heroBgGrid" class="hero__bg-grid"></div>
    <div ref="heroBgGlow" class="hero__bg-glow"></div>
    <div ref="heroBgGlow2" class="hero__bg-glow2"></div>

    <div class="content-wrap">

      <!-- ── Hero ── -->
      <section ref="hero" class="hero" data-aos="fade-up">
          <p class="hero__greeting">hi, I'm</p>
          <h1 class="hero__name">Adhi Septian Nugroho</h1>
          <p class="hero__role">
            <FlipWords :words="['a frontend developer', 'a Vue.js enthusiast', 'a Nuxt craftsman', 'an Informatics student']" />
          </p>
          <p class="hero__bio">
            I'm a Frontend Developer Intern at
            <a href="https://www.alfagift.id" target="_blank" rel="noopener" class="hero__highlight">Alfagift</a>
            and an Informatics Engineering student at
            <a href="https://www.uksw.edu" target="_blank" rel="noopener" class="hero__highlight">Universitas Kristen Satya Wacana</a>.
            I build clean, fast, and user-friendly web applications using Vue, Nuxt, and React.
          </p>
          <div class="hero__actions">
            <a href="mailto:adhiseptiannugroho@gmail.com" class="hero__btn hero__btn--primary">
              Get in touch
            </a>
            <a href="https://github.com/fvcksptnngrh" target="_blank" rel="noopener" class="hero__btn hero__btn--ghost">
              GitHub
            </a>
          </div>
      </section>

      <!-- ── Tech Stack ── -->
      <Block icon="🛠" title="what i work with" description="Technologies I use day to day">
        <TechStack />
      </Block>

      <!-- ── Bottom row: Featured + Contact (side by side on desktop) ── -->
      <div class="bottom-row">

        <!-- Featured Projects -->
        <Block icon="💼" title="featured work" description="A selection of projects I've built">
          <div class="featured-grid">
            <a
              v-for="project in featuredProjects"
              :key="project.id"
              :href="project.url"
              target="_blank"
              rel="noopener noreferrer"
              class="featured-card"
            >
              <div class="featured-card__header">
                <span class="featured-card__num">{{ project.number }}</span>
                <div class="featured-card__tags">
                  <span v-for="t in project.tech.slice(0,2)" :key="t" class="tag">{{ t }}</span>
                </div>
              </div>
              <h3 class="featured-card__title">{{ project.title }}</h3>
              <p class="featured-card__role">{{ project.role }}</p>
            </a>
          </div>
          <nuxt-link to="/projects" class="view-all-link">
            View all projects →
          </nuxt-link>
        </Block>

        <!-- Get in touch -->
        <Block icon="✉️" title="get in touch">
          <div class="contact-block">
            <p class="contact-block__text">
              Have a project in mind, a question, or just want to say hi?
              My inbox is always open.
            </p>
            <a href="mailto:adhiseptiannugroho@gmail.com" class="contact-block__email">
              adhiseptiannugroho@gmail.com
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline;vertical-align:middle;margin-left:4px">
                <path d="M7 17L17 7M17 7H7M17 7V17"/>
              </svg>
            </a>
            <div class="contact-socials">
              <a href="https://github.com/fvcksptnngrh" target="_blank" rel="noopener" class="contact-social-link">GitHub</a>
              <a href="https://www.linkedin.com/in/adhiseptiannugroho/" target="_blank" rel="noopener" class="contact-social-link">LinkedIn</a>
            </div>
          </div>
        </Block>

      </div>

    </div>
  </div>
</template>

<script>
import FlipWords from '~/components/FlipWords.vue'
import Block from '~/components/Block.vue'
import TechStack from '~/components/TechStack.vue'

export default {
  name: 'IndexPage',
  components: { FlipWords, Block, TechStack },
  data() {
    return {
      featuredProjects: [
        {
          id: 1, number: '01',
          title: 'InstaRoaster',
          role: 'Full Stack Developer',
          tech: ['React', 'TypeScript', 'AI'],
          url: 'https://instagram-roast.vercel.app/'
        },
        {
          id: 2, number: '02',
          title: 'WeatherBebe',
          role: 'Frontend Developer',
          tech: ['React', 'Tailwind CSS'],
          url: 'https://weatherbebe.netlify.app/'
        },
        {
          id: 3, number: '03',
          title: 'Task Roadmap',
          role: 'Full Stack Developer',
          tech: ['JavaScript', 'Node.js'],
          url: 'https://github.com/fvcksptnngrh/task-roadmap'
        }
      ]
    }
  },
  mounted() {
    this.$nextTick(function () {
      this.initParallax()
    })
  },
  beforeDestroy() {
    if (this._heroTriggers) {
      for (var i = 0; i < this._heroTriggers.length; i++) {
        this._heroTriggers[i].kill()
      }
    }
  },
  methods: {
    initParallax() {
      var gsap = this.$gsap
      var ST = this.$ScrollTrigger
      if (!gsap || !ST) return

      this._heroTriggers = []
      var heroEl = this.$refs.hero
      var self = this

      function addTrigger(el, props, triggerOpts) {
        if (!el) return
        var stDefaults = {
          trigger: heroEl,
          start: 'top 80%',
          end: 'bottom -50%',
          scrub: 1.5
        }
        var tween = gsap.to(el, Object.assign({
          ease: 'none',
          force3D: true,
          scrollTrigger: Object.assign(stDefaults, triggerOpts || {})
        }, props))
        self._heroTriggers.push(tween.scrollTrigger)
      }

      // Background layers — parallax drift on scroll
      addTrigger(this.$refs.heroBgGrid, { y: 300 })
      addTrigger(this.$refs.heroBgGlow, { y: 250, x: -80 })
      addTrigger(this.$refs.heroBgGlow2, { y: 280, x: 100 })
    }
  },
  head() {
    return {
      title: 'Adhi Septian Nugroho — Frontend Developer'
    }
  }
}
</script>

<style lang="scss" scoped>
.home-page {
  position: relative;
  padding: 48px 0 0;
  overflow: visible;
}

.content-wrap {
  position: relative;
  z-index: 1;
  max-width: $container-max;
  margin: 0 auto;
  padding: 0 $container-padding;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

// ── Hero ──
.hero {
  position: relative;
  padding: 48px 0 32px;
}

// ── Hero background layers ──
// Background layers — positioned relative to home-page, no clipping
.hero__bg-grid {
  position: absolute;
  top: -50px;
  left: -80px;
  right: -80px;
  height: 600px;
  background-image:
    linear-gradient(var(--border-color) 1px, transparent 1px),
    linear-gradient(90deg, var(--border-color) 1px, transparent 1px);
  background-size: 48px 48px;
  opacity: 0.5;
  pointer-events: none;
  will-change: transform;
  z-index: 0;
  mask-image: radial-gradient(ellipse 80% 70% at 35% 40%, black 10%, transparent 60%);
  -webkit-mask-image: radial-gradient(ellipse 80% 70% at 35% 40%, black 10%, transparent 60%);
}

.hero__bg-glow {
  position: absolute;
  top: -80px;
  left: -120px;
  width: 700px;
  height: 700px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--accent-cyan) 0%, transparent 45%);
  opacity: 0.1;
  pointer-events: none;
  will-change: transform;
  z-index: 0;
}

.hero__bg-glow2 {
  position: absolute;
  top: 100px;
  right: -150px;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle, #7c3aed 0%, transparent 45%);
  opacity: 0.08;
  pointer-events: none;
  will-change: transform;
  z-index: 0;
}

.hero {
  &__greeting {
    font-size: $fs-small;
    color: $text-secondary;
    margin-bottom: 8px;
    font-weight: 400;
  }

  &__name {
    font-family: $font-heading;
    font-size: clamp(36px, 6vw, 64px);
    font-weight: 600;
    color: $text-primary;
    line-height: 1.1;
    margin-bottom: 12px;
    letter-spacing: -0.5px;
  }

  &__role {
    font-size: clamp(16px, 2.5vw, 20px);
    color: $accent-cyan;
    font-weight: 500;
    margin-bottom: 20px;
    min-height: 1.5em;
  }

  &__bio {
    font-size: $fs-body;
    color: $text-secondary;
    line-height: 1.7;
    max-width: 620px;
    margin-bottom: 28px;
  }

  &__highlight {
    color: $text-primary;
    border-bottom: 1px solid $border-color;
    transition: border-color $transition-fast;

    &:hover {
      border-color: $accent-cyan;
      color: $accent-cyan;
    }
  }

  &__actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  &__btn {
    display: inline-flex;
    align-items: center;
    padding: 8px 20px;
    border-radius: 8px;
    font-size: $fs-small;
    font-weight: 500;
    transition: all $transition-fast;

    &--primary {
      background: var(--accent-cyan);
      color: var(--bg-primary);

      &:hover {
        filter: brightness(1.15);
      }
    }

    &--ghost {
      border: 1px solid $border-color;
      color: $text-secondary;

      &:hover {
        border-color: $text-secondary;
        color: $text-primary;
      }
    }
  }
}

// ── Bottom row layout ──
.bottom-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: $bp-desktop) {
    grid-template-columns: 2fr 1fr;
  }
}

// ── Featured Projects ──
.featured-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
  margin-bottom: 16px;

  @media (min-width: 540px) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.featured-card {
  display: block;
  padding: 16px;
  border: 1px solid $border-color;
  border-radius: 10px;
  background: $bg-elevated;
  transition: border-color $transition-fast, transform $transition-fast;

  &:hover {
    border-color: var(--accent-cyan);
    transform: translateY(-2px);
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  &__num {
    font-family: $font-mono;
    font-size: 11px;
    color: $text-muted;
  }

  &__tags {
    display: flex;
    gap: 4px;
  }

  &__title {
    font-size: $fs-small;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: 4px;
  }

  &__role {
    font-size: $fs-caption;
    color: $text-secondary;
  }
}

.tag {
  font-size: 10px;
  font-weight: 500;
  padding: 2px 7px;
  border-radius: 100px;
  background: $bg-primary;
  border: 1px solid $border-subtle;
  color: $text-secondary;
}

.view-all-link {
  display: inline-block;
  font-size: $fs-caption;
  color: $text-secondary;
  font-weight: 500;
  transition: color $transition-fast;

  &:hover { color: $accent-cyan; }
}

// ── Contact ──
.contact-block {
  &__text {
    font-size: $fs-small;
    color: $text-secondary;
    line-height: 1.6;
    margin-bottom: 16px;
  }

  &__email {
    display: block;
    font-family: $font-mono;
    font-size: $fs-small;
    color: $text-primary;
    border-bottom: 1px solid $border-color;
    padding-bottom: 2px;
    transition: all $transition-fast;
    margin-bottom: 20px;
    word-break: break-all;

    &:hover {
      color: $accent-cyan;
      border-color: $accent-cyan;
    }
  }
}

.contact-socials {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.contact-social-link {
  font-size: $fs-caption;
  font-weight: 500;
  color: $text-muted;
  border: 1px solid $border-subtle;
  border-radius: 100px;
  padding: 4px 12px;
  transition: all $transition-fast;

  &:hover {
    color: $text-primary;
    border-color: $border-color;
  }
}
</style>
