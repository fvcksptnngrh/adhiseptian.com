<template>
  <div class="block-card" data-aos="fade-up">
    <div class="block-header">
      <div class="block-icon-wrap">
        <span class="block-icon">{{ icon }}</span>
      </div>
      <div class="block-title-wrap">
        <h2 class="block-title">{{ title }}</h2>
        <p v-if="description" class="block-desc">{{ description }}</p>
      </div>
    </div>
    <div class="block-body">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Block',
  props: {
    icon: { type: String, default: '📁' },
    title: { type: String, required: true },
    description: { type: String, default: '' }
  }
}
</script>

<style lang="scss" scoped>
.block-card {
  border: 1px solid $border-color;
  border-radius: 16px;
  background: $bg-card;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.block-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid $border-subtle;
}

.block-icon-wrap {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: $bg-elevated;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 15px;
}

.block-title-wrap {
  min-width: 0;
}

.block-title {
  font-family: $font-body;
  font-size: $fs-small;
  font-weight: 600;
  color: $text-primary;
  letter-spacing: 0;
}

.block-desc {
  font-size: $fs-caption;
  color: $text-secondary;
  margin-top: 2px;
}

.block-body {
  padding: 20px;
  flex: 1;
}
</style>
