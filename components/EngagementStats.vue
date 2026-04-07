<template>
  <div class="eng-card">
    <div class="eng-header">
      <div class="eng-icon">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="20" x2="18" y2="10"/>
          <line x1="12" y1="20" x2="12" y2="4"/>
          <line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
      </div>
      <div>
        <h2 class="eng-title">Engagements</h2>
        <p class="eng-sub">All-time engagement metrics</p>
      </div>
    </div>

    <div class="eng-grid">
      <div v-for="stat in stats" :key="stat.label" class="eng-stat" ref="statEls">
        <span class="eng-stat__label">{{ stat.label }}</span>
        <span class="eng-stat__value">{{ stat.prefix }}{{ stat.display.toLocaleString() }}{{ stat.suffix }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EngagementStats',
  data() {
    return {
      stats: [
        { label: 'All-Time Views', value: 0, display: 0, prefix: '', suffix: '' },
        { label: 'All-Time Reactions', value: 0, display: 0, prefix: '', suffix: '' },
        { label: 'Endorsements', value: 10, display: 0, prefix: '', suffix: '+' }
      ],
      hasAnimated: false
    }
  },
  mounted() {
    this.fetchStats()
    this.setupObserver()
  },
  beforeDestroy() {
    if (this._observer) this._observer.disconnect()
  },
  methods: {
    async fetchStats() {
      try {
        var res = await fetch('/api/engagements')
        var data = await res.json()
        if (data.views !== undefined) {
          this.stats[0].value = data.views
        }
        if (data.reactions !== undefined) {
          this.stats[1].value = data.reactions
        }
        // If already visible, animate now
        if (this.hasAnimated) {
          this.animateCountUp()
        }
      } catch (e) {
        // Keep defaults
      }
    },
    setupObserver() {
      var self = this
      if (!window.IntersectionObserver) {
        this.hasAnimated = true
        this.animateCountUp()
        return
      }
      this._observer = new IntersectionObserver(function (entries) {
        for (var i = 0; i < entries.length; i++) {
          if (entries[i].isIntersecting && !self.hasAnimated) {
            self.hasAnimated = true
            self.animateCountUp()
            self._observer.disconnect()
          }
        }
      }, { threshold: 0.3 })

      this.$nextTick(function () {
        if (self.$el) {
          self._observer.observe(self.$el)
        }
      })
    },
    animateCountUp() {
      var self = this
      for (var i = 0; i < this.stats.length; i++) {
        (function (index) {
          var stat = self.stats[index]
          var target = stat.value
          if (target === 0) {
            self.$set(self.stats[index], 'display', 0)
            return
          }
          var duration = 1500
          var startTime = null

          function easeOutCubic(t) {
            return 1 - Math.pow(1 - t, 3)
          }

          function step(timestamp) {
            if (!startTime) startTime = timestamp
            var progress = Math.min((timestamp - startTime) / duration, 1)
            var easedProgress = easeOutCubic(progress)
            self.$set(self.stats[index], 'display', Math.round(easedProgress * target))
            if (progress < 1) {
              requestAnimationFrame(step)
            }
          }

          requestAnimationFrame(step)
        })(i)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.eng-card {
  background: var(--glassmorphism-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 20px;
  backdrop-filter: blur(12px);
}

.eng-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.eng-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: $bg-elevated;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $text-secondary;
  flex-shrink: 0;
}

.eng-title {
  font-size: $fs-small;
  font-weight: 600;
  color: $text-primary;
}

.eng-sub {
  font-size: $fs-caption;
  color: $text-secondary;
  margin-top: 1px;
}

.eng-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;

  @media (max-width: $bp-mobile) {
    grid-template-columns: 1fr;
  }
}

.eng-stat {
  background: var(--glassmorphism-stat-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;

  &__label {
    font-size: $fs-caption;
    font-weight: 500;
    color: $text-secondary;
    line-height: 1.3;
  }

  &__value {
    font-family: $font-mono;
    font-size: clamp(20px, 3vw, 28px);
    font-weight: 800;
    color: $text-primary;
    line-height: 1;
  }
}
</style>
