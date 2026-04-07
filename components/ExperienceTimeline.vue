<template>
  <section class="experience section" id="experience">
    <div class="container">
      <h2 class="section-header" data-aos="fade-up">
        MY <span class="accent-cyan">EXPERIENCE</span>
      </h2>

      <div class="experience__timeline" ref="timeline">
        <!-- Timeline line -->
        <div class="experience__line">
          <div class="experience__line-fill" ref="lineFill"></div>
        </div>

        <div
          v-for="(exp, index) in experiences"
          :key="exp.id"
          class="experience__item"
          :class="{ 'experience__item--right': index % 2 !== 0 }"
          data-aos="fade-up"
          :data-aos-delay="index * 100"
        >
          <!-- Dot on timeline -->
          <div class="experience__dot"></div>

          <!-- Card -->
          <div class="experience__card corner-border">
            <span class="experience__year">{{ exp.year }}</span>
            <h3 class="experience__title">{{ exp.title }}</h3>
            <p class="experience__company">{{ exp.company }}</p>
            <p class="experience__desc">{{ exp.description }}</p>
            <div class="experience__skills" v-if="exp.skills">
              <span v-for="s in exp.skills" :key="s" class="skill-tag skill-tag--sm">{{ s }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'ExperienceTimeline',
  data() {
    return {
      experiences: [
        {
          id: 1,
          title: 'Frontend Developer Intern',
          company: 'Alfagift — Global Loyalty Indonesia',
          year: 'Sep 2025 — Present',
          description: 'Building production frontend with Nuxt.js for one of Indonesia\'s largest retail loyalty platforms. On-site in Tangerang Selatan.',
          skills: ['Nuxt.js', 'Vue.js', 'Front-End Development']
        },
        {
          id: 2,
          title: 'Event Organizer — LDKM 2025',
          company: 'Universitas Kristen Satya Wacana',
          year: 'Apr 2025 — May 2025',
          description: 'Coordinated a 250-member committee across 7 divisions. Managed logistics for 300+ participants, 8 guest speakers, and multiple vendors.',
          skills: ['Leadership', 'Communication', 'Project Management']
        },
        {
          id: 3,
          title: 'Event Organizer — FTI Fun Week',
          company: 'Universitas Kristen Satya Wacana',
          year: 'Jul 2024 — Sep 2024',
          description: 'Planned and executed a week-long faculty event for 125 students. Implemented multi-channel promotional strategies across campus.',
          skills: ['Event Management', 'Cross-team Collaboration']
        },
        {
          id: 4,
          title: 'Frontline Staff',
          company: 'Taman Bunga Celosia',
          year: 'Jan 2022 — Aug 2022',
          description: 'Handled daily transactions, ticketing, and customer service. Managed entrance flow and maintained service quality during peak hours.',
          skills: ['Customer Service', 'POS Systems']
        }
      ]
    }
  },
  mounted() {
    this.initScrollLine()
  },
  methods: {
    initScrollLine() {
      if (!this.$gsap || !this.$refs.lineFill) return
      var isMobile = window.innerWidth < 768
      this.$gsap.to(this.$refs.lineFill, {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: this.$refs.timeline,
          start: isMobile ? 'top 80%' : 'top center',
          end: isMobile ? 'bottom 60%' : 'bottom center',
          scrub: isMobile ? 0.5 : 1
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.experience {
  &__timeline {
    position: relative;
    max-width: 900px;
    margin: 0 auto;
  }

  &__line {
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 1px;
    background: $border-subtle;
    transform: translateX(-50%);

    @media (max-width: $bp-tablet) {
      left: 20px;
    }
  }

  &__line-fill {
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, $accent-cyan, rgba($accent-cyan, 0.2));
    transform-origin: top;
    transform: scaleY(0);
  }

  &__item {
    position: relative;
    padding: 0 0 60px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;

    &--right {
      .experience__card {
        grid-column: 2;
      }
      .experience__dot {
        left: 50%;
      }
    }

    &:not(.experience__item--right) {
      .experience__card {
        grid-column: 1;
        text-align: right;
      }
      .experience__dot {
        left: 50%;
      }

      .experience__skills {
        justify-content: flex-end;
      }
    }

    @media (max-width: $bp-tablet) {
      grid-template-columns: 1fr;
      padding-left: 50px;

      &--right .experience__card,
      &:not(.experience__item--right) .experience__card {
        grid-column: 1;
        text-align: left;
      }

      &:not(.experience__item--right) .experience__skills {
        justify-content: flex-start;
      }

      .experience__dot {
        left: 20px !important;
      }
    }
  }

  &__dot {
    position: absolute;
    top: 8px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: $accent-cyan;
    transform: translateX(-50%);
    box-shadow: 0 0 12px 3px $accent-cyan-glow;
    z-index: 2;
  }

  &__card {
    padding: 28px;
  }

  &__year {
    font-family: $font-body;
    font-size: $fs-caption;
    font-weight: 500;
    letter-spacing: 2px;
    color: $accent-cyan;
    display: block;
    margin-bottom: 8px;
  }

  &__title {
    font-family: $font-body;
    font-size: clamp(16px, 1.5vw, 20px);
    font-weight: 700;
    margin-bottom: 4px;
  }

  &__company {
    font-size: $fs-small;
    color: $text-secondary;
    margin-bottom: 12px;
  }

  &__desc {
    font-size: $fs-small;
    color: $text-muted;
    line-height: 1.7;
    margin-bottom: 14px;
  }

  &__skills {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
}

.skill-tag--sm {
  padding: 3px 12px;
  font-size: 11px;
}
</style>
