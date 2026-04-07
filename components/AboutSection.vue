<template>
  <section class="about section" id="about">
    <div class="container">
      <!-- Section title -->
      <h2 class="section-header" data-aos="fade-up">
        WHAT I <span class="accent-cyan">DO</span>
      </h2>

      <div class="about__grid">
        <!-- DEVELOP Card -->
        <div class="about__card corner-border" data-aos="fade-up" data-aos-delay="0">
          <h3 class="about__card-title">DEVELOP</h3>
          <p class="about__card-desc">
            Frontend Developer Intern at <strong>Alfagift — Global Loyalty Indonesia</strong>,
            building production web apps with Vue, Nuxt.js, and modern JavaScript.
            Informatics Engineering student at Universitas Kristen Satya Wacana.
          </p>
          <h4 class="about__card-subtitle">Skillset &amp; Tools</h4>
          <div class="about__tags">
            <span v-for="skill in devSkills" :key="skill" class="skill-tag">{{ skill }}</span>
          </div>
        </div>

        <!-- CREATE Card -->
        <div class="about__card corner-border" data-aos="fade-up" data-aos-delay="150">
          <h3 class="about__card-title">CREATE</h3>
          <p class="about__card-desc">
            I'm passionate about turning ideas into real solutions — seeing every challenge
            as an opportunity to grow, not just as a developer, but as a lifelong learner.
            From AI-powered web apps to microservices architecture.
          </p>
          <h4 class="about__card-subtitle">Skillset &amp; Tools</h4>
          <div class="about__tags">
            <span v-for="skill in createSkills" :key="skill" class="skill-tag">{{ skill }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'AboutSection',
  data() {
    return {
      devSkills: [
        'Vue.js', 'Nuxt.js', 'React', 'TypeScript', 'JavaScript',
        'Tailwind CSS', 'SCSS', 'Java', 'Spring Boot', 'Python', 'Node.js', 'SQL'
      ],
      createSkills: [
        'Figma', 'Git', 'REST API', 'Microservices', 'OpenCV',
        'YOLOv8', 'Vite', 'Webpack', 'Firebase'
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.about {
  &__grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 32px;

    @media (max-width: $bp-tablet) {
      grid-template-columns: 1fr;
    }
  }

  &__card {
    padding: 40px;
    background: transparent;
    transition: transform $transition-medium;

    &:hover {
      transform: scale(1.02);
    }

    @media (max-width: $bp-tablet) {
      padding: 28px;
    }
  }

  &__card-title {
    font-family: $font-body;
    font-size: clamp(20px, 2vw, 26px);
    font-weight: 700;
    letter-spacing: 1px;
    margin-bottom: 16px;
  }

  &__card-desc {
    font-size: $fs-small;
    line-height: 1.8;
    color: $text-secondary;
    margin-bottom: 24px;

    strong {
      color: $text-primary;
      font-weight: 600;
    }
  }

  &__card-subtitle {
    font-size: $fs-small;
    font-weight: 600;
    color: $accent-cyan;
    margin-bottom: 14px;
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
}

.skill-tag {
  display: inline-block;
  padding: 5px 16px;
  font-size: $fs-caption;
  font-weight: 500;
  color: $text-secondary;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 100px;
  background: transparent;
  transition: all $transition-fast;
  letter-spacing: 0.3px;

  &:hover {
    border-color: $accent-cyan;
    color: $accent-cyan;
    transform: scale(1.05);
  }
}
</style>
