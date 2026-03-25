<script setup lang="ts">
import { inject, computed } from 'vue'
import { ScrollProgressKey } from '@/types'

const scrollProgress = inject(ScrollProgressKey, null)

const isVisible = computed(() => {
  if (!scrollProgress) return true
  return scrollProgress.value < 0.05
})
</script>

<template>
  <div
    class="scroll-indicator"
    :class="{ 'scroll-indicator--hidden': !isVisible }"
    aria-hidden="true"
  >
    <div class="scroll-indicator__mouse">
      <div class="scroll-indicator__wheel" />
    </div>
    <span class="scroll-indicator__text">Scroll to explore</span>
  </div>
</template>

<style scoped>
.scroll-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.scroll-indicator--hidden {
  opacity: 0;
  transform: translateY(10px);
  pointer-events: none;
}

.scroll-indicator__mouse {
  width: 24px;
  height: 38px;
  border: 2px solid var(--color-text-muted);
  border-radius: 12px;
  display: flex;
  justify-content: center;
  padding-top: 6px;
}

.scroll-indicator__wheel {
  width: 4px;
  height: 8px;
  border-radius: 2px;
  background-color: var(--color-accent);
  animation: scroll-wheel 1.8s ease-in-out infinite;
}

.scroll-indicator__text {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--color-text-muted);
}

@keyframes scroll-wheel {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  50% {
    opacity: 0.5;
    transform: translateY(8px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
