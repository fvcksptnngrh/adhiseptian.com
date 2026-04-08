<template>
  <div class="error-page">
    <div class="error-content">
      <h1 class="error-code">{{ error.statusCode }}</h1>
      <p class="error-message">{{ message }}</p>
      <nuxt-link to="/" class="error-btn">Back to Home</nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ErrorPage',
  props: {
    error: {
      type: Object,
      default: () => ({ statusCode: 404, message: '' })
    }
  },
  computed: {
    message() {
      if (this.error.statusCode === 404) return "This page doesn't exist."
      return this.error.message || 'Something went wrong.'
    }
  },
  head() {
    return {
      title: this.error.statusCode + ' — Adhi Septian Nugroho'
    }
  }
}
</script>

<style lang="scss" scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.error-content {
  text-align: center;
}

.error-code {
  font-family: var(--font-heading, 'Plus Jakarta Sans', sans-serif);
  font-size: clamp(72px, 15vw, 160px);
  font-weight: 800;
  line-height: 1;
  color: var(--text-primary);
  opacity: 0.1;
  margin-bottom: 8px;
}

.error-message {
  font-size: 16px;
  color: var(--text-secondary);
  margin-bottom: 32px;
}

.error-btn {
  display: inline-flex;
  align-items: center;
  padding: 10px 24px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--accent-cyan);
    background: rgba(6, 182, 212, 0.08);
  }
}
</style>
