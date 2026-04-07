<template>
  <footer class="footer section" id="contact">
    <div class="container">
      <div class="footer__cta" data-aos="fade-up">
        <p class="footer__label">GOT A PROJECT IN MIND?</p>
        <h2 class="footer__title">
          LET'S <span class="accent-cyan">BUILD</span><br />TOGETHER
        </h2>
        <a href="mailto:adhiseptiannugroho@gmail.com" class="footer__email">
          adhiseptiannugroho@gmail.com
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M7 17L17 7M17 7H7M17 7V17"/>
          </svg>
        </a>
      </div>

      <div class="footer__divider"></div>

      <div class="footer__bottom">
        <div class="footer__social" data-aos="fade-up" data-aos-delay="100">
          <a
            v-for="social in socials"
            :key="social.name"
            :href="social.url"
            class="footer__social-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ social.name }}
          </a>
        </div>

        <p class="footer__copy" data-aos="fade-up" data-aos-delay="200">
          &copy; {{ year }} Adhi Septian Nugroho
        </p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'FooterSection',
  data() {
    return {
      socials: [
        { name: 'GITHUB', url: 'https://github.com/fvcksptnngrh' },
        { name: 'LINKEDIN', url: 'https://www.linkedin.com/in/adhiseptiannugroho/' },
        { name: 'INSTAGRAM', url: '#' }
      ]
    }
  },
  computed: {
    year() {
      return new Date().getFullYear()
    }
  }
}
</script>

<style lang="scss" scoped>
.footer {
  &__cta {
    text-align: center;
    margin-bottom: 80px;
  }

  &__label {
    font-family: $font-body;
    font-size: $fs-caption;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: $text-muted;
    margin-bottom: 24px;
  }

  &__title {
    font-family: $font-heading;
    font-size: clamp(48px, 8vw, 120px);
    line-height: 0.95;
    letter-spacing: -1px;
    margin-bottom: 40px;
  }

  &__email {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-family: $font-body;
    font-size: clamp(14px, 2vw, 20px);
    font-weight: 300;
    color: $text-secondary;
    border-bottom: 1px solid $border-subtle;
    padding-bottom: 8px;
    transition: all $transition-medium;

    &:hover {
      color: $accent-cyan;
      border-color: $accent-cyan;
    }

    svg {
      transition: transform $transition-fast;
    }

    &:hover svg {
      transform: translate(3px, -3px);
    }
  }

  &__divider {
    height: 1px;
    background: $border-subtle;
    margin-bottom: 32px;
  }

  &__bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;
  }

  &__social {
    display: flex;
    gap: 28px;
    flex-wrap: wrap;
  }

  &__social-link {
    font-family: $font-body;
    font-size: $fs-caption;
    font-weight: 500;
    letter-spacing: 2px;
    color: $text-muted;
    transition: color $transition-fast;

    &:hover {
      color: $accent-cyan;
    }
  }

  &__copy {
    font-size: $fs-caption;
    color: $text-muted;
  }
}
</style>
