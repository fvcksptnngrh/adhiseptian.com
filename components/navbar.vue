<template>
  <header :class="cn(
    'fixed top-0 left-0 right-0 z-50 h-16 flex items-center transition-all duration-300',
    isScrolled
      ? 'bg-background/90 backdrop-blur-md border-b border-border'
      : 'bg-transparent border-b border-transparent'
  )">
    <div class="w-full max-w-[1280px] mx-auto px-5 md:px-12 flex items-center justify-between">

      <!-- Logo -->
      <nuxt-link to="/" class="flex items-center gap-2 group" @click.native="mobileOpen = false">
        <img
          src="~/assets/images/logo.png"
          alt="logo"
          class="h-7 w-auto object-contain"
        />
        <span class="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors duration-200">
          adhiseptian
        </span>
      </nuxt-link>

      <!-- Nav Links desktop + theme toggle -->
      <div class="hidden md:flex items-center gap-1">
        <nav class="flex items-center gap-0.5">
          <nuxt-link
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            :class="cn(
              'relative px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200',
              'text-muted-foreground hover:text-foreground hover:bg-white/5',
              isActive(link.path) ? 'text-foreground' : ''
            )"
            @click.native="mobileOpen = false"
          >
            {{ link.label }}
            <span
              v-if="isActive(link.path)"
              class="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
            ></span>
          </nuxt-link>
        </nav>
        <ThemeToggle />
      </div>

      <!-- Mobile: theme toggle + hamburger -->
      <div class="md:hidden flex items-center gap-1">
        <ThemeToggle />
        <button
          class="flex flex-col justify-center items-center gap-1.5 w-9 h-9 rounded-md hover:bg-white/5 transition-colors"
          @click="mobileOpen = !mobileOpen"
          aria-label="Toggle menu"
        >
          <span :class="cn(
            'block w-[18px] h-px bg-foreground transition-all duration-200 origin-center',
            mobileOpen ? 'rotate-45 translate-y-[5px]' : ''
          )"></span>
          <span :class="cn(
            'block w-[18px] h-px bg-foreground transition-all duration-200',
            mobileOpen ? 'opacity-0 scale-x-0' : ''
          )"></span>
          <span :class="cn(
            'block w-[18px] h-px bg-foreground transition-all duration-200 origin-center',
            mobileOpen ? '-rotate-45 -translate-y-[5px]' : ''
          )"></span>
        </button>
      </div>

    </div>

    <!-- Mobile dropdown -->
    <transition name="menu">
      <div
        v-if="mobileOpen"
        class="md:hidden absolute top-16 inset-x-0 bg-background/95 backdrop-blur-md border-b border-border"
      >
        <nav class="flex flex-col px-4 py-2 gap-0.5">
          <nuxt-link
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            :class="cn(
              'px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-200',
              isActive(link.path)
                ? 'text-foreground bg-white/5'
                : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
            )"
            @click.native="mobileOpen = false"
          >
            {{ link.label }}
          </nuxt-link>
        </nav>
      </div>
    </transition>
  </header>
</template>

<script>
import { cn } from '~/lib/utils'
import ThemeToggle from '~/components/ThemeToggle.vue'

export default {
  name: 'Navbar',
  components: { ThemeToggle },
  data() {
    return {
      isScrolled: false,
      mobileOpen: false,
      navLinks: [
        { path: '/',          label: 'Home' },
        { path: '/projects',  label: 'Projects' },
        { path: '/dashboard', label: 'Dashboard' },
        { path: '/guestbook', label: 'Guestbook' },
        { path: '/about',     label: 'About' }
      ]
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    cn,
    handleScroll() {
      this.isScrolled = window.scrollY > 10
    },
    isActive(path) {
      return this.$route.path === path
    }
  }
}
</script>

<style scoped>
.menu-enter-active,
.menu-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.menu-enter,
.menu-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
