<template>
  <header :class="cn(
    'fixed top-0 left-0 right-0 z-50 h-20 flex items-center transition-all duration-300',
    isScrolled
      ? 'bg-background/90 backdrop-blur-md border-b border-border'
      : 'bg-transparent border-b border-transparent'
  )">
    <div class="w-full max-w-[1080px] mx-auto px-3 md:px-5 flex items-center justify-between">

      <!-- Logo -->
      <nuxt-link to="/" class="flex items-center gap-2 group" @click.native="menuOpen = false">
        <img
          :src="isDark ? require('~/assets/images/logo-white.png') : require('~/assets/images/logo-black.png')"
          alt="logo"
          class="logo-img"
        />
        <span class="text-base font-bold text-foreground">
          adhiseptian
        </span>
      </nuxt-link>

      <!-- Nav Links desktop + theme toggle + hamburger -->
      <div class="hidden md:flex items-center gap-1">
        <nav class="flex items-center gap-0.5">
          <nuxt-link
            v-for="link in pageLinks"
            :key="link.path"
            :to="link.path"
            :class="cn(
              'relative px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200',
              'text-muted-foreground hover:text-foreground hover:bg-white/5',
              isActive(link.path) ? 'text-foreground' : ''
            )"
          >
            {{ link.label }}
            <span
              v-if="isActive(link.path)"
              class="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
            ></span>
          </nuxt-link>
        </nav>
        <ThemeToggle />
        <!-- Hamburger -->
        <button
          :class="cn('burger', menuOpen ? 'burger--active' : '')"
          @click="menuOpen = !menuOpen"
          aria-label="Toggle menu"
        >
          <span class="burger__line burger__line--1"></span>
          <span class="burger__line burger__line--2"></span>
          <span class="burger__line burger__line--3"></span>
        </button>
      </div>

      <!-- Mobile: theme toggle + hamburger -->
      <div class="md:hidden flex items-center gap-1">
        <ThemeToggle />
        <button
          :class="cn('burger', menuOpen ? 'burger--active' : '')"
          @click="menuOpen = !menuOpen"
          aria-label="Toggle menu"
        >
          <span class="burger__line burger__line--1"></span>
          <span class="burger__line burger__line--2"></span>
          <span class="burger__line burger__line--3"></span>
        </button>
      </div>

    </div>

    <!-- Dropdown panel -->
    <transition name="menu">
      <div
        v-if="menuOpen"
        class="absolute top-20 inset-x-0 bg-background/95 backdrop-blur-md border-b border-border menu-panel"
      >
        <div class="w-full max-w-[1080px] mx-auto px-3 md:px-5 py-5">
          <div class="menu-grid">

            <!-- Pages -->
            <div class="menu-section">
              <span class="menu-section__label">Pages</span>
              <nav class="menu-section__list">
                <nuxt-link
                  v-for="link in pageLinks"
                  :key="'menu-' + link.path"
                  :to="link.path"
                  :class="cn('menu-link', isActive(link.path) ? 'menu-link--active' : '')"
                  @click.native="menuOpen = false"
                >
                  <span>{{ link.label }}</span>
                  <span v-if="isActive(link.path)" class="menu-link__badge">You are here</span>
                </nuxt-link>
              </nav>
            </div>

            <!-- Social -->
            <div class="menu-section">
              <span class="menu-section__label">Social</span>
              <nav class="menu-section__list">
                <a
                  v-for="link in socialLinks"
                  :key="link.url"
                  :href="link.url"
                  target="_blank"
                  rel="noopener"
                  class="menu-link"
                  @click="menuOpen = false"
                >
                  <span>{{ link.label }}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="menu-link__ext"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
                </a>
              </nav>
            </div>

            <!-- Appearance -->
            <div class="menu-section">
              <span class="menu-section__label">Appearance</span>
              <div class="menu-section__list">
                <button class="menu-link" @click="toggleTheme">
                  <span>{{ isDark ? 'Dark mode' : 'Light mode' }}</span>
                  <span class="menu-link__theme-dot" :class="isDark ? 'menu-link__theme-dot--dark' : 'menu-link__theme-dot--light'"></span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </transition>

    <!-- Overlay -->
    <transition name="fade">
      <div v-if="menuOpen" class="fixed inset-0 top-20 bg-black/40 z-[-1]" @click="menuOpen = false"></div>
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
      menuOpen: false,
      isDark: true,
      pageLinks: [
        { path: '/',          label: 'Home' },
        { path: '/projects',  label: 'Projects' },
        { path: '/dashboard', label: 'Dashboard' },
        { path: '/guestbook', label: 'Guestbook' },
        { path: '/about',     label: 'About' }
      ],
      socialLinks: [
        { label: 'GitHub',   url: 'https://github.com/fvcksptnngrh' },
        { label: 'LinkedIn', url: 'https://www.linkedin.com/in/adhiseptiannugroho/' },
        { label: 'Email',    url: 'mailto:adhiseptiannugroho@gmail.com' }
      ]
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
    this.isDark = !document.documentElement.classList.contains('light')
    this._themeObserver = new MutationObserver(() => {
      this.isDark = !document.documentElement.classList.contains('light')
    })
    this._themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
    if (this._themeObserver) this._themeObserver.disconnect()
  },
  methods: {
    cn,
    handleScroll() {
      this.isScrolled = window.scrollY > 10
    },
    isActive(path) {
      return this.$route.path === path
    },
    toggleTheme() {
      if (this.$theme) {
        this.$theme.toggle()
        this.isDark = this.$theme.isDark()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.logo-img {
  height: 5rem;
  max-height: 100%;
  width: auto;
  object-fit: contain;
}

// ── Burger button ──
.burger {
  position: relative;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 4px;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  &__line {
    position: absolute;
    width: 20px;
    height: 1.5px;
    background: var(--text-primary);
    border-radius: 2px;
    transition: all 0.4s cubic-bezier(0.68, -0.6, 0.32, 1.6);

    &--1 {
      top: 11px;
    }
    &--2 {
      top: 17px;
      width: 14px;
      right: 8px;
      left: auto;
    }
    &--3 {
      top: 23px;
    }
  }

  &--active {
    .burger__line--1 {
      top: 17px;
      transform: rotate(45deg);
    }
    .burger__line--2 {
      width: 0;
      opacity: 0;
    }
    .burger__line--3 {
      top: 17px;
      transform: rotate(-45deg);
    }
  }
}

// ── Dropdown menu panel ──
.menu-panel {
  z-index: 100;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}

.menu-section {
  &__label {
    display: block;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 10px;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
}

.menu-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  transition: all 0.15s ease;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  font-family: inherit;

  &:hover {
    color: var(--text-primary);
    background: var(--nav-hover-bg, rgba(255, 255, 255, 0.05));
  }

  &--active {
    color: var(--text-primary);
    background: var(--nav-hover-bg, rgba(255, 255, 255, 0.05));
  }

  &__badge {
    font-size: 10px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 100px;
    background: var(--accent-cyan);
    color: var(--bg-primary);
    letter-spacing: 0.3px;
  }

  &__ext {
    color: var(--text-muted);
    flex-shrink: 0;
  }

  &__theme-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 1.5px solid var(--border-color);
    flex-shrink: 0;

    &--dark { background: #1a1a1a; }
    &--light { background: #f5f5f5; }
  }
}

// ── Transitions ──
.menu-enter-active,
.menu-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.menu-enter,
.menu-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
