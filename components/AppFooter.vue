<template>
  <footer class="app-footer">
    <div class="app-footer__inner">
      <p class="app-footer__copy">
        © {{ year }} Adhi Septian Nugroho.
      </p>

      <div class="app-footer__social">
        <a
          v-for="s in socials"
          :key="s.name"
          :href="s.url"
          target="_blank"
          rel="noopener noreferrer"
          class="app-footer__social-link"
          :aria-label="s.name"
        >
          {{ s.name }}
        </a>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter',
  data() {
    return {
      socials: [
        { name: 'GitHub', url: 'https://github.com/fvcksptnngrh' },
        { name: 'LinkedIn', url: 'https://www.linkedin.com/in/adhiseptiannugroho/' }
      ]
    }
  },
  computed: {
    year() { return new Date().getFullYear() }
  }
}
</script>

<style lang="scss" scoped>
.app-footer {
  border-top: 1px solid $border-subtle;
  padding: 24px 0;
  margin-top: 48px;

  &__inner {
    max-width: $container-max;
    margin: 0 auto;
    padding: 0 $container-padding;

    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
  }

  &__copy {
    font-size: $fs-caption;
    color: $text-muted;
  }

  &__link {
    color: $text-secondary;
    transition: color $transition-fast;
    &:hover { color: $accent-cyan; }
  }

  &__social {
    display: flex;
    gap: 20px;
  }

  &__social-link {
    font-size: $fs-caption;
    font-weight: 500;
    color: $text-muted;
    transition: color $transition-fast;
    &:hover { color: $text-primary; }
  }
}
</style>
