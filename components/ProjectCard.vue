<template>
  <a
    :href="project.url"
    target="_blank"
    rel="noopener noreferrer"
    class="project-card"
    :data-aos="aos"
    :data-aos-delay="delay"
  >
    <div class="project-card__inner">
      <!-- Large number watermark -->
      <span class="project-card__number">{{ project.number }}</span>

      <!-- Content -->
      <div class="project-card__content" :class="contentAlignment">
        <div class="project-card__text">
          <h3 class="project-card__title">{{ project.title }}</h3>
          <p class="project-card__role">{{ project.role }}</p>
        </div>
        <div class="project-card__tech">
          <span v-for="t in project.tech" :key="t" class="project-card__tech-tag">{{ t }}</span>
        </div>
      </div>

      <!-- Image -->
      <div class="project-card__image-wrap">
        <img
          :src="project.image"
          :alt="project.title"
          class="project-card__image"
          loading="lazy"
        />
      </div>
    </div>
  </a>
</template>

<script>
export default {
  name: 'ProjectCard',
  props: {
    project: { type: Object, required: true },
    index: { type: Number, default: 0 },
    aos: { type: String, default: 'fade-up' },
    delay: { type: Number, default: 0 }
  },
  computed: {
    contentAlignment() {
      const pattern = this.index % 4
      return pattern < 2 ? 'project-card__content--right' : 'project-card__content--left'
    }
  }
}
</script>

<style lang="scss" scoped>
.project-card {
  display: block;
  border: 1px solid $border-subtle;
  background: transparent;
  overflow: hidden;
  transition: border-color $transition-medium;
  text-decoration: none;

  &:hover {
    border-color: $border-color;

    .project-card__image {
      opacity: 1;
      transform: scale(1.05);
    }

    .project-card__number {
      opacity: 0.08;
    }
  }

  &__inner {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 32px;
    min-height: 380px;

    @media (max-width: $bp-tablet) {
      padding: 24px;
      min-height: 320px;
    }
  }

  &__number {
    position: absolute;
    top: 16px;
    left: 24px;
    font-family: $font-heading;
    font-size: clamp(48px, 5vw, 72px);
    color: $text-primary;
    opacity: 0.04;
    line-height: 1;
    transition: opacity $transition-medium;
    pointer-events: none;
  }

  &__content {
    position: relative;
    z-index: 2;

    &--right {
      text-align: right;

      .project-card__tech {
        justify-content: flex-end;
      }
    }

    &--left {
      text-align: left;

      .project-card__tech {
        justify-content: flex-start;
      }
    }
  }

  &__title {
    font-family: $font-body;
    font-size: clamp(16px, 1.5vw, 20px);
    font-weight: 600;
    margin-bottom: 4px;
  }

  &__role {
    font-size: $fs-caption;
    color: $text-muted;
    margin-bottom: 10px;
  }

  &__tech {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  &__tech-tag {
    font-size: 11px;
    font-weight: 500;
    padding: 3px 10px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 100px;
    color: $text-muted;
  }

  &__image-wrap {
    position: relative;
    z-index: 2;
    border-radius: 8px;
    overflow: hidden;
    margin-top: 20px;
  }

  &__image {
    width: 100%;
    height: auto;
    object-fit: cover;
    opacity: 0.7;
    transition: all 0.4s ease;

    @media (max-width: $bp-tablet) {
      opacity: 1;
    }
  }
}
</style>
