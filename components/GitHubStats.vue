<template>
  <div class="gh-stats">

    <!-- Header -->
    <div class="gh-head">
      <div class="gh-head__left">
        <div class="gh-head__icon">
          <Github :size="15" :stroke-width="2" />
        </div>
        <div>
          <h3 class="gh-head__title">Open-source activity</h3>
          <p class="gh-head__sub">
            <span class="gh-pulse"></span>
            Live from <a href="https://github.com/fvcksptnngrh" target="_blank" rel="noopener" class="gh-head__handle">@fvcksptnngrh</a>
          </p>
        </div>
      </div>
      <span v-if="memberSince" class="gh-head__chip">
        <Calendar :size="11" :stroke-width="2" />
        Since {{ memberSince }}
      </span>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="gh-loading">
      <div class="gh-skeleton" v-for="i in 3" :key="'sk'+i"></div>
    </div>

    <template v-else>
      <!-- Stat cards -->
      <div class="gh-cards">
        <OverviewCard label="Followers" :value="String(stats.followers || 0)">
          <template #icon><Users :size="16" :stroke-width="2" class="gh-stat-icon" /></template>
        </OverviewCard>
        <OverviewCard label="Repositories" :value="String(stats.public_repos || 0)">
          <template #icon><FolderGit2 :size="16" :stroke-width="2" class="gh-stat-icon" /></template>
        </OverviewCard>
        <OverviewCard label="Following" :value="String(stats.following || 0)">
          <template #icon><UserPlus :size="16" :stroke-width="2" class="gh-stat-icon" /></template>
        </OverviewCard>
      </div>

      <!-- Contribution chart with green gradient border -->
      <div class="gh-contrib-card">
        <div class="gh-contrib-inner">
          <div class="gh-contrib-head">
            <span class="gh-contrib-title">
              <Flame :size="13" :stroke-width="2" />
              Contribution graph
            </span>
            <span class="gh-contrib-meta">last 12 months</span>
          </div>
          <div class="gh-contrib">
            <img
              :src="`https://ghchart.rshah.org/22c55e/fvcksptnngrh`"
              alt="GitHub contributions chart"
              class="gh-chart"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      <p class="gh-footer">
        <a href="https://github.com/fvcksptnngrh" target="_blank" rel="noopener" class="gh-footer__link">
          View GitHub profile
          <ArrowUpRight :size="13" :stroke-width="2" />
        </a>
      </p>
    </template>
  </div>
</template>

<script>
import OverviewCard from '~/components/OverviewCard.vue'
import { Github, Users, FolderGit2, UserPlus, Flame, ArrowUpRight, Calendar } from 'lucide-vue'

export default {
  name: 'GitHubStats',
  components: { OverviewCard, Github, Users, FolderGit2, UserPlus, Flame, ArrowUpRight, Calendar },
  data() {
    return {
      loading: true,
      stats: {}
    }
  },
  computed: {
    memberSince() {
      if (!this.stats.created_at) return null
      const d = new Date(this.stats.created_at)
      if (isNaN(d.getTime())) return null
      return d.getFullYear()
    }
  },
  async mounted() {
    try {
      const res = await fetch('/api/github')
      this.stats = await res.json()
    } catch (e) {
      this.stats = { followers: 0, public_repos: 0, following: 0 }
    } finally {
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
$gh-green: #22c55e;
$gh-emerald: #10b981;

.gh-stats {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

// ── Header ──
.gh-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;

  &__left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: linear-gradient(135deg, rgba($gh-green, 0.18), rgba($gh-emerald, 0.12));
    border: 1px solid rgba($gh-green, 0.3);
    color: $gh-green;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &__title {
    font-size: $fs-small;
    font-weight: 600;
    color: $text-primary;
    line-height: 1.2;
  }

  &__sub {
    font-size: $fs-caption;
    color: $text-secondary;
    margin-top: 2px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  &__handle {
    color: $text-primary;
    font-family: $font-mono;
    transition: color $transition-fast;
    &:hover { color: $gh-green; }
  }

  &__chip {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    font-family: $font-mono;
    color: $text-muted;
    padding: 4px 10px;
    border-radius: 100px;
    border: 1px solid $border-subtle;
    background: $bg-elevated;
  }
}

// Pulsing live dot
.gh-pulse {
  position: relative;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: $gh-green;
  flex-shrink: 0;

  &::after {
    content: '';
    position: absolute;
    inset: -3px;
    border-radius: 50%;
    background: rgba($gh-green, 0.45);
    animation: ghPulse 1.8s ease-out infinite;
  }
}

@keyframes ghPulse {
  0%   { transform: scale(0.7); opacity: 0.6; }
  100% { transform: scale(2.2); opacity: 0; }
}

// ── Loading ──
.gh-loading {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.gh-skeleton {
  height: 88px;
  border-radius: 12px;
  background: $bg-elevated;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.7; }
}

// ── Stat cards ──
.gh-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;

  @media (max-width: $bp-mobile) {
    grid-template-columns: 1fr;
  }

  ::v-deep .overview-card {
    transition: border-color $transition-fast, transform $transition-fast, background $transition-fast;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba($gh-green, 0.06), transparent 60%);
      opacity: 0;
      transition: opacity $transition-fast;
      pointer-events: none;
    }

    &:hover {
      border-color: rgba($gh-green, 0.55);
      transform: translateY(-2px);

      &::before { opacity: 1; }

      .gh-stat-icon { color: $gh-green; }
    }
  }

  ::v-deep .overview-card__value {
    color: $text-primary;
  }
}

.gh-stat-icon {
  color: $text-secondary;
  transition: color $transition-fast;
}

// ── Contribution chart card ──
.gh-contrib-card {
  padding: 1px;
  border-radius: 14px;
  background: linear-gradient(135deg, $gh-green, $gh-emerald 55%, #16a34a);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: -1px;
    border-radius: 15px;
    background: linear-gradient(135deg, rgba($gh-green, 0.5), transparent 70%);
    filter: blur(10px);
    opacity: 0.35;
    z-index: -1;
    pointer-events: none;
  }
}

.gh-contrib-inner {
  background: $bg-card;
  border-radius: 13px;
  padding: 14px 16px;
}

.gh-contrib-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  flex-wrap: wrap;
  gap: 6px;
}

.gh-contrib-title {
  font-size: $fs-caption;
  font-weight: 600;
  color: $text-secondary;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  display: inline-flex;
  align-items: center;
  gap: 6px;

  svg { color: $gh-green; }
}

.gh-contrib-meta {
  font-size: 10px;
  font-family: $font-mono;
  color: $text-muted;
}

.gh-contrib {
  border-radius: 8px;
  background: rgba($gh-green, 0.04);
  padding: 10px;
}

.gh-chart {
  width: 100%;
  height: auto;
  opacity: var(--chart-opacity);
  display: block;
}

// ── Footer ──
.gh-footer {
  padding-top: 4px;

  &__link {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: $fs-caption;
    font-weight: 500;
    color: $text-secondary;
    transition: color $transition-fast, gap $transition-fast;

    svg { transition: transform $transition-fast; }

    &:hover {
      color: $gh-green;
      gap: 6px;
      svg { transform: translate(1px, -1px); }
    }
  }
}
</style>
