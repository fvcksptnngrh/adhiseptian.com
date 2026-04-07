<template>
  <section class="marquee">
    <div class="marquee__track">
      <div class="marquee__content">
        <span v-for="n in 4" :key="'a'+n" class="marquee__text">
          VUE.JS <span class="marquee__dot"></span>
          NUXT.JS <span class="marquee__dot"></span>
          REACT <span class="marquee__dot"></span>
          TYPESCRIPT <span class="marquee__dot"></span>
          JAVASCRIPT <span class="marquee__dot"></span>
          TAILWIND CSS <span class="marquee__dot"></span>
          JAVA <span class="marquee__dot"></span>
          SPRING BOOT <span class="marquee__dot"></span>
          PYTHON <span class="marquee__dot"></span>
        </span>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'MarqueeSection'
}
</script>

<style lang="scss" scoped>
.marquee {
  padding: 20px 0;
  overflow: hidden;
  border-top: 1px solid $border-subtle;
  border-bottom: 1px solid $border-subtle;

  &__track {
    overflow: hidden;
    white-space: nowrap;
  }

  &__content {
    display: inline-flex;
    animation: marqueeScroll 40s linear infinite;
  }

  &__text {
    font-family: $font-body;
    font-size: clamp(12px, 1.2vw, 14px);
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 3px;
    color: $text-muted;
    padding-right: 4px;
    flex-shrink: 0;
  }

  &__dot {
    display: inline-block;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: $accent-cyan;
    vertical-align: middle;
    margin: 0 20px;
  }
}

@keyframes marqueeScroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-25%); }
}
</style>
