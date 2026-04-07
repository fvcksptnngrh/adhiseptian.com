<template>
  <div class="app">
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
  min-height: 100vh;
  background: var(--bg-primary);
  color: var(--text-primary);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.app-main {
  padding-top: 64px; // offset fixed navbar
}
</style>
