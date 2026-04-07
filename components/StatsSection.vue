<template>
  <section class="education section" id="education">
    <div class="container">
      <h2 class="section-header" data-aos="fade-up">
        EDUCATION <span class="accent-cyan">&amp;</span> CERTS
      </h2>

      <div class="education__grid">
        <!-- Education -->
        <div class="education__card corner-border" data-aos="fade-up" data-aos-delay="0">
          <span class="education__icon">&#127891;</span>
          <h3 class="education__degree">Bachelor's — Informatics Engineering</h3>
          <p class="education__school">Universitas Kristen Satya Wacana</p>
          <span class="education__year">2022 — Present</span>
          <div class="education__tags">
            <span class="skill-tag skill-tag--sm">Programming</span>
            <span class="skill-tag skill-tag--sm">Front-end Coding</span>
          </div>
        </div>

        <div class="education__card corner-border" data-aos="fade-up" data-aos-delay="100">
          <span class="education__icon">&#127891;</span>
          <h3 class="education__degree">Digital Communication &amp; Multimedia</h3>
          <p class="education__school">SMK Negeri Pringsurat</p>
          <span class="education__year">2018 — 2021</span>
        </div>

        <!-- Certifications -->
        <div class="education__card corner-border" data-aos="fade-up" data-aos-delay="200">
          <span class="education__icon">&#128196;</span>
          <h3 class="education__degree">Java (Basic)</h3>
          <p class="education__school">HackerRank</p>
          <span class="education__year">Credential ID: 57D5404BE64F</span>
        </div>

        <div class="education__card corner-border" data-aos="fade-up" data-aos-delay="300">
          <span class="education__icon">&#128196;</span>
          <h3 class="education__degree">SQL (Basic)</h3>
          <p class="education__school">HackerRank</p>
          <span class="education__year">Credential ID: 4AB27B580BF0</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'StatsSection'
}
</script>

<style lang="scss" scoped>
.education {
  &__grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;

    @media (max-width: $bp-tablet) {
      grid-template-columns: 1fr;
    }
  }

  &__card {
    padding: 32px;
    transition: transform $transition-medium;

    &:hover {
      transform: scale(1.02);
    }
  }

  &__icon {
    font-size: 24px;
    display: block;
    margin-bottom: 16px;
  }

  &__degree {
    font-family: $font-body;
    font-size: clamp(16px, 1.5vw, 20px);
    font-weight: 600;
    margin-bottom: 6px;
  }

  &__school {
    font-size: $fs-small;
    color: $accent-cyan;
    margin-bottom: 8px;
  }

  &__year {
    display: block;
    font-size: $fs-caption;
    color: $text-muted;
    letter-spacing: 1px;
    margin-bottom: 12px;
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
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

  &:hover {
    border-color: $accent-cyan;
    color: $accent-cyan;
  }
}

.skill-tag--sm {
  padding: 3px 12px;
  font-size: 11px;
}
</style>
