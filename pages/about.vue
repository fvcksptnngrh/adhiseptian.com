<template>
  <div class="about-page">
    <div class="content-wrap">

      <!-- Page header -->
      <div class="page-header" data-aos="fade-up">
        <h1 class="page-header__title">About</h1>
        <p class="page-header__desc">
          A bit about who I am, what I do, and where I've been.
        </p>
      </div>

      <!-- About me -->
      <Block icon="👋" title="about me">
        <div class="about-text">
          <p>
            I'm <strong>Adhi Septian Nugroho</strong>, a frontend developer and Informatics Engineering student
            at Universitas Kristen Satya Wacana (UKSW) in Semarang, Indonesia.
          </p>
          <p>
            Currently interning at <a href="https://www.alfagift.id" target="_blank" rel="noopener" class="about-link">Alfagift — Global Loyalty Indonesia</a>,
            where I build production frontend applications using Nuxt.js for one of Indonesia's largest retail loyalty platforms.
          </p>
          <p>
            Outside of work, I enjoy experimenting with new frameworks, contributing to open source,
            and exploring the intersection of design and engineering.
          </p>
          <div class="about-chips">
            <a href="https://github.com/fvcksptnngrh" target="_blank" rel="noopener" class="about-chip">
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/adhiseptiannugroho/" target="_blank" rel="noopener" class="about-chip">
              LinkedIn
            </a>
            <a href="mailto:adhiseptiannugroho@gmail.com" class="about-chip">
              Email
            </a>
          </div>
        </div>
      </Block>

      <!-- Experience -->
      <Block icon="💼" title="experience" description="My professional and organizational journey">
        <div class="exp-list">
          <div v-for="exp in experiences" :key="exp.id" class="exp-item">
            <div class="exp-item__header">
              <div>
                <h3 class="exp-item__title">{{ exp.title }}</h3>
                <p class="exp-item__company">{{ exp.company }}</p>
              </div>
              <span class="exp-item__year">{{ exp.year }}</span>
            </div>
            <p class="exp-item__desc">{{ exp.description }}</p>
            <div class="exp-item__skills" v-if="exp.skills">
              <span v-for="s in exp.skills" :key="s" class="tag">{{ s }}</span>
            </div>
          </div>
        </div>
      </Block>

      <!-- Education -->
      <Block icon="🎓" title="education">
        <div class="edu-list">
          <div v-for="edu in education" :key="edu.id" class="edu-item">
            <div class="edu-item__header">
              <div>
                <h3 class="edu-item__title">{{ edu.institution }}</h3>
                <p class="edu-item__degree">{{ edu.degree }}</p>
              </div>
              <span class="edu-item__year">{{ edu.year }}</span>
            </div>
          </div>
        </div>
      </Block>

      <!-- Certifications -->
      <Block icon="🏅" title="certifications">
        <div class="cert-list">
          <a
            v-for="cert in certifications"
            :key="cert.id"
            :href="cert.url"
            target="_blank"
            rel="noopener noreferrer"
            class="cert-item"
          >
            <div>
              <p class="cert-item__name">{{ cert.name }}</p>
              <p class="cert-item__issuer">{{ cert.issuer }}</p>
            </div>
            <svg class="cert-item__icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M7 17L17 7M17 7H7M17 7V17"/>
            </svg>
          </a>
        </div>
      </Block>

    </div>
  </div>
</template>

<script>
import Block from '~/components/Block.vue'

export default {
  name: 'AboutPage',
  components: { Block },
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
          skills: ['Leadership', 'Project Management']
        },
        {
          id: 3,
          title: 'Event Organizer — FTI Fun Week',
          company: 'Universitas Kristen Satya Wacana',
          year: 'Jul 2024 — Sep 2024',
          description: 'Planned and executed a week-long faculty event for 125 students across multiple promotional channels.',
          skills: ['Event Management', 'Cross-team Collaboration']
        },
        {
          id: 4,
          title: 'Frontline Staff',
          company: 'Taman Bunga Celosia',
          year: 'Jan 2022 — Aug 2022',
          description: 'Handled daily transactions, ticketing, and customer service. Managed entrance flow during peak hours.',
          skills: ['Customer Service', 'POS Systems']
        }
      ],
      education: [
        {
          id: 1,
          institution: 'Universitas Kristen Satya Wacana',
          degree: 'Bachelor of Informatics Engineering',
          year: '2023 — Present'
        },
        {
          id: 2,
          institution: 'SMK Negeri 2 Salatiga',
          degree: 'Software Engineering (RPL)',
          year: '2020 — 2023'
        }
      ],
      certifications: [
        {
          id: 1,
          name: 'Java (Basic)',
          issuer: 'HackerRank',
          url: 'https://www.hackerrank.com/certificates/iframe/48dd34264261'
        },
        {
          id: 2,
          name: 'SQL (Basic)',
          issuer: 'HackerRank',
          url: 'https://www.hackerrank.com/certificates/iframe/6b9d72d2b427'
        }
      ]
    }
  },
  head() {
    return {
      title: 'About — Adhi Septian Nugroho',
      meta: [
        { hid: 'description', name: 'description', content: 'Learn more about Adhi Septian Nugroho — Frontend Developer, Informatics Engineering student at UKSW, and intern at Alfagift.' },
        { hid: 'og:title', property: 'og:title', content: 'About — Adhi Septian Nugroho' },
        { hid: 'og:description', property: 'og:description', content: 'Frontend Developer, Informatics Engineering student at UKSW, and intern at Alfagift.' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.about-page {
  padding: 64px 0 0;
}

.content-wrap {
  max-width: $container-max;
  margin: 0 auto;
  padding: 0 $container-padding;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.page-header {
  padding: 32px 0 16px;

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
  }
}

// ── About Text ──
.about-text {
  display: flex;
  flex-direction: column;
  gap: 14px;

  p {
    font-size: $fs-body;
    color: $text-secondary;
    line-height: 1.7;
    max-width: 680px;

    strong {
      color: $text-primary;
      font-weight: 600;
    }
  }
}

.about-link {
  color: $text-primary;
  border-bottom: 1px solid $border-color;
  transition: all $transition-fast;

  &:hover {
    color: $accent-cyan;
    border-color: $accent-cyan;
  }
}

.about-chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  padding-top: 4px;
}

.about-chip {
  display: inline-flex;
  align-items: center;
  padding: 5px 14px;
  border: 1px solid $border-color;
  border-radius: 100px;
  font-size: $fs-caption;
  font-weight: 500;
  color: $text-secondary;
  background: $bg-elevated;
  transition: all $transition-fast;

  &:hover {
    border-color: $accent-cyan;
    color: $accent-cyan;
  }
}

// ── Experience ──
.exp-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.exp-item {
  padding: 16px 0;
  border-bottom: 1px solid $border-subtle;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  &:first-child {
    padding-top: 0;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 8px;
    flex-wrap: wrap;
  }

  &__title {
    font-size: $fs-small;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: 2px;
  }

  &__company {
    font-size: $fs-caption;
    color: $text-secondary;
  }

  &__year {
    font-family: $font-mono;
    font-size: 11px;
    color: $text-muted;
    white-space: nowrap;
    flex-shrink: 0;
  }

  &__desc {
    font-size: $fs-caption;
    color: $text-secondary;
    line-height: 1.6;
    margin-bottom: 10px;
  }

  &__skills {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }
}

// ── Education ──
.edu-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.edu-item {
  padding: 14px 0;
  border-bottom: 1px solid $border-subtle;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  &:first-child { padding-top: 0; }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
    flex-wrap: wrap;
  }

  &__title {
    font-size: $fs-small;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: 2px;
  }

  &__degree {
    font-size: $fs-caption;
    color: $text-secondary;
  }

  &__year {
    font-family: $font-mono;
    font-size: 11px;
    color: $text-muted;
    white-space: nowrap;
    flex-shrink: 0;
  }
}

// ── Certifications ──
.cert-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.cert-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid $border-subtle;
  transition: all $transition-fast;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  &:first-child { padding-top: 0; }

  &:hover .cert-item__name {
    color: $accent-cyan;
  }

  &__name {
    font-size: $fs-small;
    font-weight: 500;
    color: $text-primary;
    margin-bottom: 2px;
    transition: color $transition-fast;
  }

  &__issuer {
    font-size: $fs-caption;
    color: $text-secondary;
  }

  &__icon {
    color: $text-muted;
    flex-shrink: 0;
    transition: transform $transition-fast;
  }

  &:hover &__icon {
    transform: translate(2px, -2px);
    color: $accent-cyan;
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
