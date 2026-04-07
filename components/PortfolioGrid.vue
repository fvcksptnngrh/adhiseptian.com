<template>
  <section id="portfolio" class="portfolio section">
    <div class="container">
      <div class="portfolio__header">
        <h2 class="section-header" data-aos="fade-up">
          MY <span class="accent-cyan">PROJECTS</span>
        </h2>

        <div class="portfolio__filters" data-aos="fade-up" data-aos-delay="100">
          <button
            v-for="filter in filters"
            :key="filter"
            class="filter-btn"
            :class="{ 'filter-btn--active': activeFilter === filter }"
            @click="setFilter(filter)"
          >
            {{ filter }}
          </button>
        </div>
      </div>

      <div class="portfolio__grid">
        <ProjectCard
          v-for="(project, index) in filteredProjects"
          :key="project.id"
          :project="project"
          :index="index"
          :delay="(index % 3) * 80"
        />
      </div>
    </div>
  </section>
</template>

<script>
import ProjectCard from './ProjectCard.vue'

export default {
  name: 'PortfolioGrid',
  components: { ProjectCard },
  data() {
    return {
      activeFilter: 'All',
      filters: ['All', 'Web App', 'Frontend', 'Backend', 'Other'],
      projects: [
        {
          id: 1, number: '01',
          title: 'InstaRoaster',
          role: 'Full Stack Developer',
          category: 'Web App',
          tech: ['React', 'Tailwind CSS', 'TypeScript', 'AI'],
          image: 'https://picsum.photos/seed/instaroast/600/400',
          url: 'https://github.com/fvcksptnngrh/InstaRoast'
        },
        {
          id: 2, number: '02',
          title: 'WeatherBebe',
          role: 'Frontend Developer',
          category: 'Frontend',
          tech: ['React', 'Vite', 'Tailwind CSS'],
          image: 'https://picsum.photos/seed/weatherbebe/600/400',
          url: 'https://github.com/fvcksptnngrh/Simple-Weather-App'
        },
        {
          id: 3, number: '03',
          title: 'Task Roadmap',
          role: 'Full Stack Developer',
          category: 'Web App',
          tech: ['JavaScript', 'Node.js'],
          image: 'https://picsum.photos/seed/taskroad/600/400',
          url: 'https://github.com/fvcksptnngrh/task-roadmap'
        },
        {
          id: 4, number: '04',
          title: 'Microservices Ticket Booking',
          role: 'Backend Developer',
          category: 'Backend',
          tech: ['Java', 'Spring Boot', 'Eureka'],
          image: 'https://picsum.photos/seed/microserv/600/400',
          url: 'https://github.com/fvcksptnngrh/microservices-ticket-booking'
        },
        {
          id: 5, number: '05',
          title: 'YOLO Object Detection',
          role: 'ML Developer',
          category: 'Other',
          tech: ['Python', 'YOLOv8', 'OpenCV'],
          image: 'https://picsum.photos/seed/yolodetect/600/400',
          url: 'https://github.com/fvcksptnngrh/Deteksi-Objek-Kamera-YOLO'
        },
        {
          id: 6, number: '06',
          title: 'Creative Portfolio Hub',
          role: 'Frontend Developer',
          category: 'Frontend',
          tech: ['React', 'CSS'],
          image: 'https://picsum.photos/seed/portohub/600/400',
          url: 'https://github.com/fvcksptnngrh/creative-portofolio-hub'
        },
        {
          id: 7, number: '07',
          title: 'Honey',
          role: 'Frontend Developer',
          category: 'Web App',
          tech: ['Vue.js'],
          image: 'https://picsum.photos/seed/honeyvue/600/400',
          url: 'https://github.com/fvcksptnngrh/honey'
        },
        {
          id: 8, number: '08',
          title: 'ETL-TTU',
          role: 'Backend Developer',
          category: 'Backend',
          tech: ['Java'],
          image: 'https://picsum.photos/seed/etldata/600/400',
          url: 'https://github.com/fvcksptnngrh/ETL-TTU'
        },
        {
          id: 9, number: '09',
          title: 'Tic Tac Toe',
          role: 'Developer',
          category: 'Frontend',
          tech: ['JavaScript'],
          image: 'https://picsum.photos/seed/tictactoe/600/400',
          url: 'https://github.com/fvcksptnngrh/Tic-Tac-Toe'
        }
      ]
    }
  },
  computed: {
    filteredProjects() {
      if (this.activeFilter === 'All') return this.projects
      return this.projects.filter(p => p.category === this.activeFilter)
    }
  },
  methods: {
    setFilter(filter) {
      this.activeFilter = filter
    }
  }
}
</script>

<style lang="scss" scoped>
.portfolio {
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    flex-wrap: wrap;
    gap: 24px;
    margin-bottom: 48px;
  }

  &__filters {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    background: $border-subtle;
    border: 1px solid $border-subtle;

    @media (max-width: $bp-desktop) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 575px) {
      grid-template-columns: 1fr;
    }
  }
}

.filter-btn {
  padding: 6px 18px;
  font-family: $font-body;
  font-size: $fs-caption;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: $text-muted;
  border: 1px solid transparent;
  border-radius: 100px;
  transition: all $transition-fast;
  background: transparent;

  &:hover {
    color: $text-secondary;
  }

  &--active {
    color: $text-primary;
    border-color: $border-color;
  }
}
</style>
