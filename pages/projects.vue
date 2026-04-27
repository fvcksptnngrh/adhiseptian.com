<template>
  <div class="projects-page">
    <div class="content-wrap">

      <!-- Page header -->
      <div class="page-header" data-aos="fade-up">
        <h1 class="page-header__title">Projects</h1>
        <p class="page-header__desc">
          A collection of things I've built — from web apps to backend services and ML experiments.
        </p>
      </div>

      <!-- Filter tabs -->
      <div class="filter-bar" data-aos="fade-up">
        <button
          v-for="f in filters"
          :key="f"
          :class="['filter-btn', activeFilter === f ? 'filter-btn--active' : '']"
          @click="activeFilter = f"
        >
          {{ f }}
        </button>
      </div>

      <!-- Grid -->
      <div class="projects-grid">
        <a
          v-for="(project, index) in filteredProjects"
          :key="project.id"
          :href="project.url"
          target="_blank"
          rel="noopener noreferrer"
          class="project-card"
          data-aos="fade-up"
          :data-aos-delay="(index % 3) * 60"
        >
          <div class="project-card__top">
            <span class="project-card__num">{{ project.number }}</span>
            <svg class="project-card__arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M7 17L17 7M17 7H7M17 7V17"/>
            </svg>
          </div>
          <h3 class="project-card__title">{{ project.title }}</h3>
          <p class="project-card__role">{{ project.role }}</p>
          <div class="project-card__tags">
            <span v-for="t in project.tech" :key="t" class="tag">{{ t }}</span>
          </div>
        </a>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'ProjectsPage',
  data() {
    return {
      activeFilter: 'All',
      filters: ['All', 'Web App', 'Frontend', 'Backend', 'Other'],
      projects: [
        {
          id: 1, number: '01',
          title: 'Aplikasi Pesanan Online',
          role: 'Frontend Developer',
          category: 'Web App',
          tech: ['Vue.js', 'Nuxt.js', 'JavaScript', 'Bootstrap Vue'],
          url: 'https://play.google.com/store/apps/details?id=com.alfamart.apo&hl=id'
        },
        {
          id: 2, number: '02',
          title: 'InstaRoaster',
          role: 'Full Stack Developer',
          category: 'Web App',
          tech: ['React', 'Tailwind CSS', 'TypeScript', 'AI'],
          url: 'https://instagram-roast.vercel.app/'
        },
        {
          id: 3, number: '03',
          title: 'WeatherBebe',
          role: 'Frontend Developer',
          category: 'Frontend',
          tech: ['React', 'Vite', 'Tailwind CSS'],
          url: 'https://weatherbebe.netlify.app/'
        },
        {
          id: 4, number: '04',
          title: 'Microservices Ticket Booking',
          role: 'Backend Developer',
          category: 'Backend',
          tech: ['Java', 'Spring Boot', 'Eureka'],
          url: 'https://github.com/fvcksptnngrh/microservices-ticket-booking'
        },
        {
          id: 5, number: '05',
          title: 'YOLO Object Detection',
          role: 'ML Developer',
          category: 'Other',
          tech: ['Python', 'YOLOv8', 'OpenCV'],
          url: 'https://github.com/fvcksptnngrh/Deteksi-Objek-Kamera-YOLO'
        },
        {
          id: 6, number: '06',
          title: 'Creative Portfolio Hub',
          role: 'Frontend Developer',
          category: 'Frontend',
          tech: ['Vue.js', 'CSS'],
          url: 'https://adhiseptian.me'
        },
      ]
    }
  },
  computed: {
    filteredProjects() {
      if (this.activeFilter === 'All') return this.projects
      return this.projects.filter(p => p.category === this.activeFilter)
    }
  },
  head() {
    return {
      title: 'Projects — Adhi Septian Nugroho',
      meta: [
        { hid: 'description', name: 'description', content: 'A collection of projects built by Adhi Septian Nugroho — web apps, tools, and experiments with Vue, React, and more.' },
        { hid: 'og:title', property: 'og:title', content: 'Projects — Adhi Septian Nugroho' },
        { hid: 'og:description', property: 'og:description', content: 'A collection of projects built with Vue, React, and more.' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.projects-page {
  padding: 64px 0 0;
}

.content-wrap {
  max-width: $container-max;
  margin: 0 auto;
  padding: 0 $container-padding;
}

.page-header {
  padding: 32px 0 24px;

  &__title {
    font-family: $font-heading;
    font-size: clamp(28px, 4vw, 40px);
    font-weight: 600;
    color: $text-primary;
    margin-bottom: 8px;
    letter-spacing: -0.3px;
  }

  &__desc {
    font-size: $fs-small;
    color: $text-secondary;
    line-height: 1.6;
    max-width: 560px;
  }
}

.filter-bar {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.filter-btn {
  padding: 6px 16px;
  font-size: $fs-caption;
  font-weight: 500;
  border: 1px solid transparent;
  border-radius: 100px;
  color: $text-muted;
  background: transparent;
  transition: all $transition-fast;
  font-family: $font-body;

  &:hover { color: $text-secondary; }

  &--active {
    color: $text-primary;
    border-color: $border-color;
    background: $bg-card;
  }
}

.projects-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;

  @media (min-width: 540px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: $bp-tablet) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: $bp-desktop) {
    grid-template-columns: repeat(4, 1fr);
  }
}

.project-card {
  display: block;
  padding: 20px;
  border: 1px solid $border-color;
  border-radius: 12px;
  background: $bg-card;
  transition: border-color $transition-fast, transform $transition-fast;

  &:hover {
    border-color: var(--accent-cyan);
    transform: translateY(-2px);

    .project-card__arrow {
      transform: translate(2px, -2px);
    }
  }

  &__top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  &__num {
    font-family: $font-mono;
    font-size: 11px;
    color: $text-muted;
  }

  &__arrow {
    color: $text-muted;
    transition: transform $transition-fast;
    flex-shrink: 0;
  }

  &__title {
    font-size: $fs-body;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: 4px;
  }

  &__role {
    font-size: $fs-caption;
    color: $text-secondary;
    margin-bottom: 12px;
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }
}

.tag {
  font-size: 10px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 100px;
  background: $bg-elevated;
  border: 1px solid $border-subtle;
  color: $text-secondary;
}
</style>
