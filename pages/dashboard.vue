<template>
  <div class="dashboard-page">
    <div class="content-wrap">

      <!-- Page header -->
      <div class="page-header" data-aos="fade-up">
        <h1 class="page-header__title">Dashboard</h1>
        <p class="page-header__desc">
          My personal stats — coding activity, GitHub, and more. Updated in real-time.
        </p>
      </div>

      <!-- Engagement Stats -->
      <EngagementStats />

      <!-- Coding Insights -->
      <CodingInsights />

      <!-- GitHub -->
      <Block icon="🐙" title="github insights" description="Open source activity">
        <GitHubStats />
      </Block>

    </div>
  </div>
</template>

<script>
import Block from '~/components/Block.vue'
import CodingInsights from '~/components/CodingInsights.vue'
import GitHubStats from '~/components/GitHubStats.vue'
import EngagementStats from '~/components/EngagementStats.vue'

export default {
  name: 'DashboardPage',
  components: { Block, CodingInsights, GitHubStats, EngagementStats },
  head() {
    return { title: 'Dashboard — Adhi Septian Nugroho' }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-page {
  padding: 48px 0 0;
}

.content-wrap {
  max-width: $container-max;
  margin: 0 auto;
  padding: 0 $container-padding;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.page-header {
  padding: 32px 0 16px;

  &__title {
    font-family: $font-heading;
    font-size: clamp(28px, 4vw, 40px);
    font-weight: 600;
    color: $text-primary;
    margin-bottom: 8px;
    letter-spacing: -0.3px;
  }

  &__desc {
    font-size: $fs-small;
    color: $text-secondary;
    line-height: 1.6;
  }
}

</style>
