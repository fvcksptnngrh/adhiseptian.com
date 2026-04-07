<template>
  <div class="gh-stats">
    <div v-if="loading" class="gh-loading">
      <div class="gh-skeleton" v-for="i in 2" :key="i"></div>
    </div>
    <template v-else>
      <div class="gh-cards">
        <OverviewCard icon="👥" label="Followers" :value="String(stats.followers || 0)" />
        <OverviewCard icon="📦" label="Repositories" :value="String(stats.public_repos || 0)" />
      </div>
      <div class="gh-contrib">
        <img
          :src="`https://ghchart.rshah.org/06b6d4/fvcksptnngrh`"
          alt="GitHub contributions chart"
          class="gh-chart"
          loading="lazy"
        />
      </div>
      <p class="gh-footer">
        <a href="https://github.com/fvcksptnngrh" target="_blank" rel="noopener" class="gh-footer__link">
          View GitHub profile →
        </a>
      </p>
    </template>
  </div>
</template>

<script>
import OverviewCard from '~/components/OverviewCard.vue'

export default {
  name: 'GitHubStats',
  components: { OverviewCard },
  data() {
    return {
      loading: true,
      stats: {}
    }
  },
  async mounted() {
    try {
      const res = await fetch('/api/github')
      this.stats = await res.json()
    } catch (e) {
      this.stats = { followers: 0, public_repos: 0 }
    } finally {
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.gh-loading {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.gh-skeleton {
  height: 80px;
  border-radius: 10px;
  background: $bg-elevated;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.7; }
}

.gh-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 16px;
}

.gh-contrib {
  border-radius: 10px;
  overflow: hidden;
  background: $bg-elevated;
  padding: 12px;
  margin-bottom: 12px;
}

.gh-chart {
  width: 100%;
  height: auto;
  opacity: var(--chart-opacity);
}

.gh-footer {
  padding-top: 12px;
  border-top: 1px solid $border-subtle;

  &__link {
    font-size: $fs-caption;
    color: $text-secondary;
    transition: color $transition-fast;

    &:hover { color: $accent-cyan; }
  }
}
</style>
