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
    <!-- Desktop: mouse icon -->
    <div class="scroll-indicator__mouse hidden md:flex">
      <div class="scroll-indicator__wheel" />
    </div>
    <!-- Mobile: swipe arrows -->
    <div class="scroll-indicator__swipe flex md:hidden">
      <span class="scroll-indicator__arrow">&#8592;</span>
      <span class="scroll-indicator__arrow">&#8594;</span>
    </div>
    <span class="scroll-indicator__text hidden md:block">Scroll to explore</span>
    <span class="scroll-indicator__text block md:hidden">Swipe to explore</span>
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

.scroll-indicator__swipe {
  gap: 1rem;
  align-items: center;
}

.scroll-indicator__arrow {
  font-size: 1.2rem;
  color: var(--color-accent);
  animation: swipe-hint 2s ease-in-out infinite;
}

.scroll-indicator__arrow:first-child {
  animation-name: swipe-left;
}

.scroll-indicator__arrow:last-child {
  animation-name: swipe-right;
}

.scroll-indicator__text {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--color-text-muted);
}

@keyframes scroll-wheel {
  0% { opacity: 1; transform: translateY(0); }
  50% { opacity: 0.5; transform: translateY(8px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes swipe-left {
  0%, 100% { transform: translateX(0); opacity: 0.5; }
  50% { transform: translateX(-6px); opacity: 1; }
}

@keyframes swipe-right {
  0%, 100% { transform: translateX(0); opacity: 0.5; }
  50% { transform: translateX(6px); opacity: 1; }
}
</style>
