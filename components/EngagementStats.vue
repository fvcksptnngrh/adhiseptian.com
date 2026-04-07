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
      <div v-for="stat in stats" :key="stat.label" class="eng-stat">
        <span class="eng-stat__label">{{ stat.label }}</span>
        <span class="eng-stat__value">{{ stat.value.toLocaleString() }}</span>
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
        { label: 'All-Time views',     value: 1193 },
        { label: 'All-Time reactions', value: 2032 },
        { label: 'Endorsements',       value: 214  }
      ]
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
