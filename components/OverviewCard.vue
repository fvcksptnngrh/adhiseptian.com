<template>
  <div class="overview-card">
    <span class="overview-card__icon">{{ icon }}</span>
    <span class="overview-card__value">{{ value || '—' }}</span>
    <span v-if="sub" class="overview-card__sub">{{ sub }}</span>
    <span class="overview-card__label">{{ label }}</span>
  </div>
</template>

<script>
export default {
  name: 'OverviewCard',
  props: {
    icon: { type: String, default: '📊' },
    label: { type: String, required: true },
    value: { type: String, default: '' },
    sub: { type: String, default: '' }
  }
}
</script>

<style lang="scss" scoped>
.overview-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px;
  border: 1px solid $border-color;
  border-radius: 12px;
  background: $bg-elevated;
  transition: border-color $transition-fast;

  &:hover {
    border-color: var(--accent-cyan);
  }

  &__icon {
    font-size: 18px;
    line-height: 1;
  }

  &__value {
    font-family: $font-mono;
    font-size: clamp(16px, 2.5vw, 22px);
    font-weight: 500;
    color: $text-primary;
    line-height: 1.2;
  }

  &__sub {
    font-size: 10px;
    color: $text-secondary;
    font-family: $font-mono;
    margin-top: -2px;
  }

  &__label {
    font-size: $fs-caption;
    color: $text-secondary;
    font-weight: 500;
  }
}
</style>
