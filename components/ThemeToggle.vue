<template>
  <button
    class="theme-toggle"
    :class="{ 'theme-toggle--light': !isDark }"
    @click="toggle"
    aria-label="Toggle theme"
  >
    <div class="toggle-icon" :class="{ 'toggle-icon--rotate': !isDark }">
      <!-- Sun (shown in dark mode = click to go light) -->
      <svg
        class="icon-sun"
        :class="{ 'icon--hidden': !isDark }"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="12" cy="12" r="5"/>
        <line x1="12" y1="1" x2="12" y2="3"/>
        <line x1="12" y1="21" x2="12" y2="23"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="1" y1="12" x2="3" y2="12"/>
        <line x1="21" y1="12" x2="23" y2="12"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
      </svg>

      <!-- Moon (shown in light mode = click to go dark) -->
      <svg
        class="icon-moon"
        :class="{ 'icon--hidden': isDark }"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>
    </div>
  </button>
</template>

<script>
export default {
  name: 'ThemeToggle',
  data() {
    return {
      isDark: true
    }
  },
  mounted() {
    if (this.$theme) {
      this.isDark = this.$theme.isDark()
    }
  },
  methods: {
    toggle() {
      if (this.$theme) {
        this.$theme.toggle()
        this.isDark = this.$theme.isDark()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.theme-toggle {
  position: relative;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  transition: color 0.2s ease, background-color 0.2s ease;

  &:hover {
    background: var(--nav-hover-bg);
    color: var(--text-primary);
  }
}

.toggle-icon {
  position: relative;
  width: 16px;
  height: 16px;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);

  &--rotate {
    transform: rotate(180deg);
  }
}

.icon-sun,
.icon-moon {
  position: absolute;
  top: 0;
  left: 0;
  transition: opacity 0.3s ease, transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.icon-sun {
  opacity: 1;
  transform: scale(1) rotate(0deg);
}

.icon-moon {
  opacity: 1;
  transform: scale(1) rotate(0deg);
}

.icon--hidden {
  opacity: 0;
  transform: scale(0.5) rotate(90deg);
}
</style>
