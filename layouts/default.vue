<template>
  <div class="app">
    <div class="app__bg-grid" />
    <CustomCursor />
    <Navbar />
    <main class="app-main">
      <nuxt />
    </main>
    <AppFooter />
  </div>
</template>

<script>
import CustomCursor from '~/components/CustomCursor.vue'
import Navbar from '~/components/navbar.vue'
import AppFooter from '~/components/AppFooter.vue'

export default {
  name: 'DefaultLayout',
  components: { CustomCursor, Navbar, AppFooter }
}
</script>

<style lang="scss">
.app {
  position: relative;
  min-height: 100vh;
  background: var(--bg-primary);
  color: var(--text-primary);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.app__bg-grid {
  position: fixed;
  inset: 0;
  background-image:
    linear-gradient(var(--border-color) 1px, transparent 1px),
    linear-gradient(90deg, var(--border-color) 1px, transparent 1px);
  background-size: 48px 48px;
  opacity: 0.35;
  pointer-events: none;
  z-index: 0;
  mask-image: radial-gradient(ellipse 70% 60% at 50% 30%, black 10%, transparent 75%);
  -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 30%, black 10%, transparent 75%);
}

.app-main {
  position: relative;
  z-index: 1;
  padding-top: 64px; // offset fixed navbar
}
</style>
