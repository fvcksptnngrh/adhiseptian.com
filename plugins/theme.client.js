export default function ({ app }, inject) {
  var theme = localStorage.getItem('theme') || 'dark'

  // Apply on load
  if (theme === 'light') {
    document.documentElement.classList.add('light')
  }

  var themeManager = {
    current: theme,
    toggle: function () {
      var html = document.documentElement
      // Brief transition class
      html.classList.add('theme-transition')

      if (this.current === 'dark') {
        html.classList.add('light')
        this.current = 'light'
      } else {
        html.classList.remove('light')
        this.current = 'dark'
      }

      localStorage.setItem('theme', this.current)

      // Update theme-color meta
      var meta = document.querySelector('meta[name="theme-color"]')
      if (meta) {
        meta.content = this.current === 'dark' ? '#0d0d0d' : '#f9fafb'
      }

      setTimeout(function () {
        html.classList.remove('theme-transition')
      }, 350)
    },
    isDark: function () {
      return this.current === 'dark'
    }
  }

  inject('theme', themeManager)
}
