<template>
  <span class="flip-words">
    <span
      v-for="(word, i) in words"
      :key="word"
      :class="['flip-word', {
        'flip-word--active': i === current,
        'flip-word--leave': i === prev
      }]"
    >{{ word }}</span>
  </span>
</template>

<script>
export default {
  name: 'FlipWords',
  props: {
    words: { type: Array, required: true },
    interval: { type: Number, default: 3000 }
  },
  data() {
    return { current: 0, prev: -1, timer: null }
  },
  mounted() {
    this.timer = setInterval(() => {
      this.prev = this.current
      this.current = (this.current + 1) % this.words.length
    }, this.interval)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  }
}
</script>

<style scoped>
.flip-words {
  position: relative;
  display: inline-block;
}

.flip-word {
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  transform: translateY(6px);
  transition: opacity 0.4s ease, transform 0.4s ease;
  white-space: nowrap;
  pointer-events: none;
}

.flip-word--active {
  position: relative;
  opacity: 1;
  transform: translateY(0);
}

.flip-word--leave {
  opacity: 0;
  transform: translateY(-6px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}
</style>
