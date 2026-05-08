<template>
  <div class="ci-card">

    <!-- Header -->
    <div class="ci-header">
      <div class="ci-icon">
        <Activity :size="15" :stroke-width="2" />
      </div>
      <div>
        <h2 class="ci-title">Weekly Coding Activities</h2>
        <p class="ci-sub">My WakaTime last 7 days stats.</p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="ci-loading">
      <div class="ci-skeletons">
        <div class="ci-skeleton" v-for="i in 4" :key="'s'+i"></div>
      </div>
      <div class="ci-skeletons ci-skeletons--2">
        <div class="ci-skeleton ci-skeleton--tall" v-for="i in 2" :key="'t'+i"></div>
      </div>
    </div>

    <!-- Not configured -->
    <div v-else-if="!data.configured" class="ci-empty">
      <Clock :size="28" :stroke-width="1.6" class="ci-empty__icon" />
      <p class="ci-empty__title">WakaTime not connected</p>
      <p class="ci-empty__desc">Add <code>WAKATIME_API_KEY</code> to your <code>.env</code> file.</p>
      <a href="https://wakatime.com/api-key" target="_blank" rel="noopener" class="ci-empty__link">Get API Key →</a>
    </div>

    <!-- Error or no stats -->
    <div v-else-if="error || !data.stats" class="ci-empty">
      <AlertTriangle :size="28" :stroke-width="1.6" class="ci-empty__icon" />
      <p class="ci-empty__title">Could not load stats</p>
      <p class="ci-empty__desc">{{ error || data.error || 'No data returned from WakaTime' }}</p>
    </div>

    <!-- Data -->
    <div v-else>

      <!-- 4 overview cards -->
      <div class="ci-overview">
        <div v-for="card in overviewCards" :key="card.label" class="ci-ov-card">
          <span class="ci-ov-card__label">{{ card.label }}</span>
          <span class="ci-ov-card__value">{{ card.value }}</span>
          <span v-if="card.sub" class="ci-ov-card__sub">{{ card.sub }}</span>
        </div>
      </div>

      <!-- Languages + Editors -->
      <div class="ci-bars-row">

        <!-- Languages — blue/purple border -->
        <div class="ci-bar-card ci-bar-card--blue">
          <div class="ci-bar-inner">
            <p class="ci-bar-title">Languages</p>
            <div v-if="topLanguages.length" class="ci-bar-list">
              <div v-for="lang in topLanguages" :key="lang.name" class="ci-bar-item">
                <div class="ci-bar-item__meta">
                  <span class="ci-bar-item__name">{{ lang.name }}</span>
                  <span class="ci-bar-item__pct">{{ Math.round(lang.percent) }}%</span>
                </div>
                <div class="ci-bar-track">
                  <div class="ci-bar-fill ci-bar-fill--blue" :style="{ width: lang.percent + '%' }"></div>
                </div>
              </div>
            </div>
            <p v-else class="ci-bar-empty">No language data yet</p>
          </div>
        </div>

        <!-- Editors — pink/purple border -->
        <div class="ci-bar-card ci-bar-card--pink">
          <div class="ci-bar-inner">
            <p class="ci-bar-title">Editors</p>
            <div v-if="topEditors.length" class="ci-bar-list">
              <div v-for="ed in topEditors" :key="ed.name" class="ci-bar-item">
                <div class="ci-bar-item__meta">
                  <span class="ci-bar-item__name">{{ ed.name }}</span>
                  <span class="ci-bar-item__pct">{{ Math.round(ed.percent) }}%</span>
                </div>
                <div class="ci-bar-track">
                  <div class="ci-bar-fill ci-bar-fill--pink" :style="{ width: ed.percent + '%' }"></div>
                </div>
              </div>
            </div>
            <p v-else class="ci-bar-empty">No editor data yet</p>
          </div>
        </div>

      </div>

      <!-- Footer -->
      <div class="ci-footer">
        <span v-if="lastModified" class="ci-footer__modified">Last modified {{ lastModified }}</span>
        <a href="https://wakatime.com/@adhiseptian" target="_blank" rel="noopener" class="ci-footer__link">
          View full stats on WakaTime →
        </a>
      </div>

    </div>
  </div>
</template>

<script>
import { Activity, Clock, AlertTriangle } from 'lucide-vue'

const NON_CODING_LANGS = new Set([
  'other', 'json', 'json5', 'jsonc', 'yaml', 'yml', 'toml', 'ini', 'csv', 'tsv', 'xml',
  'markdown', 'mdx', 'plain text', 'text', 'restructuredtext',
  'shell', 'shell script', 'bash', 'sh', 'zsh', 'fish', 'powershell', 'batch', 'cmd',
  'git config', 'gitignore', 'dotenv', 'env',
  'properties', 'make', 'makefile', 'dockerfile', 'cmake',
  'svg', 'image (svg)', 'image', 'log', 'diff', 'patch',
  'npm config', 'editorconfig', 'http', 'binary', 'csv/tsv'
])

export default {
  name: 'CodingInsights',
  components: { Activity, Clock, AlertTriangle },
  data() {
    return { loading: true, error: null, data: {} }
  },
  computed: {
    overviewCards() {
      if (!this.data.stats) return []
      const s = this.data.stats
      const bd = s.best_day || {}
      const bdDate = bd.date
        ? new Date(bd.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        : ''
      return [
        { label: 'Daily Average',    value: s.human_readable_daily_average || '—' },
        { label: "This Week's Time", value: s.human_readable_total || '—' },
        { label: 'Best Day',         value: bd.text || '—', sub: bdDate },
        { label: 'Total Time',       value: this.data.allTime?.text || '—' }
      ]
    },
    topLanguages() {
      const langs = this.data.stats?.languages
      if (!langs || !langs.length) return []

      // Drop non-coding entries (Other, JSON, Bash, YAML, Markdown, etc.)
      const real = langs.filter(l => !NON_CODING_LANGS.has((l.name || '').toLowerCase()))
      const top = real.slice(0, 3)

      // Recompute percentages relative to the visible top 3 so bars feel meaningful
      const totalSecs = top.reduce((sum, l) => sum + (l.total_seconds || 0), 0)
      if (totalSecs > 0) {
        return top.map(l => ({
          ...l,
          percent: (l.total_seconds / totalSecs) * 100
        }))
      }
      return top
    },
    topEditors() {
      return this.data.stats?.editors?.slice(0, 3) || []
    },
    lastModified() {
      const m = this.data.stats?.modified_at
      if (!m) return ''
      const diff = Math.floor((Date.now() - new Date(m)) / 60000)
      if (diff < 60) return `about ${diff} min ago`
      const h = Math.floor(diff / 60)
      if (h < 24) return `about ${h} hr ago`
      return `about ${Math.floor(h / 24)} days ago`
    }
  },
  async mounted() {
    try {
      const res = await fetch('/api/wakatime')
      this.data = await res.json()
    } catch (e) {
      this.error = 'Network error — is the server running?'
    } finally {
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.ci-card {
  background: var(--glassmorphism-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 20px;
  backdrop-filter: blur(12px);
}

.ci-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.ci-icon {
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

.ci-title {
  font-size: $fs-small;
  font-weight: 600;
  color: $text-primary;
}

.ci-sub {
  font-size: $fs-caption;
  color: $text-secondary;
  margin-top: 1px;
}

// Loading
.ci-loading { display: flex; flex-direction: column; gap: 10px; }
.ci-skeletons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  &--2 { grid-template-columns: repeat(2, 1fr); }
}
.ci-skeleton {
  height: 80px;
  border-radius: 12px;
  background: $bg-elevated;
  animation: pulse 1.4s ease-in-out infinite;
  &--tall { height: 120px; }
}
@keyframes pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.7; }
}

// Empty / error
.ci-empty {
  text-align: center;
  padding: 32px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  &__icon {
    color: $text-muted;
    margin-bottom: 4px;
  }

  &__title {
    font-weight: 600;
    font-size: $fs-small;
    color: $text-primary;
  }

  &__desc {
    font-size: $fs-caption;
    color: $text-secondary;
    line-height: 1.6;

    code {
      font-family: $font-mono;
      background: $bg-elevated;
      padding: 1px 5px;
      border-radius: 4px;
      font-size: 11px;
    }
  }

  &__link {
    font-size: $fs-caption;
    font-weight: 500;
    color: $accent-cyan;
    &:hover { opacity: 0.75; }
  }
}

// Overview cards
.ci-overview {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 12px;

  @media (min-width: $bp-tablet) {
    grid-template-columns: repeat(4, 1fr);
  }
}

.ci-ov-card {
  background: $bg-elevated;
  border: 1px solid $border-color;
  border-radius: 12px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;

  &__label {
    font-size: $fs-caption;
    font-weight: 500;
    color: $text-secondary;
    line-height: 1.3;
  }

  &__value {
    font-family: $font-mono;
    font-size: clamp(14px, 2vw, 18px);
    font-weight: 700;
    color: $text-primary;
    line-height: 1.2;
  }

  &__sub {
    font-size: 10px;
    color: $text-muted;
    font-family: $font-mono;
  }
}

// Language + Editor bar cards
.ci-bars-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;

  @media (min-width: $bp-tablet) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.ci-bar-card {
  padding: 1px;
  border-radius: 14px;

  &--blue { background: linear-gradient(135deg, #3b82f6, #7c3aed); }
  &--pink { background: linear-gradient(135deg, #ec4899, #7c3aed); }
}

.ci-bar-inner {
  background: $bg-card;
  border-radius: 13px;
  padding: 16px;
  height: 100%;
}

.ci-bar-title {
  font-size: $fs-caption;
  font-weight: 600;
  color: $text-secondary;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 12px;
}

.ci-bar-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ci-bar-empty {
  font-size: $fs-caption;
  color: $text-muted;
  font-style: italic;
}

.ci-bar-item {
  display: flex;
  flex-direction: column;
  gap: 4px;

  &__meta {
    display: flex;
    justify-content: space-between;
  }

  &__name {
    font-size: $fs-caption;
    font-weight: 500;
    color: $text-primary;
  }

  &__pct {
    font-family: $font-mono;
    font-size: 11px;
    color: $text-secondary;
  }
}

.ci-bar-track {
  height: 5px;
  border-radius: 99px;
  background: $bg-elevated;
  overflow: hidden;
}

.ci-bar-fill {
  height: 100%;
  border-radius: 99px;
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);

  &--blue { background: linear-gradient(to right, #3b82f6, #7c3aed); }
  &--pink { background: linear-gradient(to right, #ec4899, #7c3aed); }
}

// Footer
.ci-footer {
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid $border-subtle;
  display: flex;
  flex-direction: column;
  gap: 3px;

  &__modified {
    font-size: 11px;
    color: $text-muted;
    font-style: italic;
  }

  &__link {
    font-size: $fs-caption;
    color: $text-secondary;
    transition: color $transition-fast;
    &:hover { color: $accent-cyan; }
  }
}
</style>
