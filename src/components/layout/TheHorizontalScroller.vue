<script setup lang="ts">
import { ref } from 'vue'
import { useHorizontalScroll } from '@/composables/useHorizontalScroll'
import type { PanelId } from '@/types'

const panels: PanelId[] = ['hero', 'about', 'projects', 'get-offer', 'contact']
const panelLabels = ['Home', 'About', 'Projects', 'Offer', 'Contact']

const wrapperRef = ref<HTMLElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)

const { isMobile, currentPanelIndex, scrollToPanel } = useHorizontalScroll(wrapperRef, containerRef, {
  panelCount: panels.length,
})
</script>

<template>
  <!-- Mobile: horizontal scroll-snap -->
  <div
    v-if="isMobile"
    ref="wrapperRef"
    class="relative h-dvh w-screen"
  >
    <div
      ref="containerRef"
      class="mobile-scroller flex h-full snap-x snap-mandatory overflow-x-auto"
    >
      <slot />
    </div>

    <!-- Mobile panel indicator -->
    <div class="fixed bottom-4 left-1/2 z-40 -translate-x-1/2">
      <div class="flex items-center gap-2 rounded-full border border-border bg-bg-card/90 px-3 py-1.5 backdrop-blur-md">
        <button
          v-for="(label, index) in panelLabels"
          :key="label"
          class="h-1.5 rounded-full transition-all duration-300 cursor-pointer"
          :class="index === currentPanelIndex
            ? 'w-5 bg-accent shadow-[0_0_8px_rgba(0,255,136,0.5)]'
            : 'w-1.5 bg-text-muted/30'"
          :aria-label="`Go to ${label}`"
          @click="scrollToPanel(index)"
        />
      </div>
    </div>
  </div>

  <!-- Desktop: GSAP horizontal scroll -->
  <div
    v-else
    ref="wrapperRef"
    class="h-screen w-screen overflow-hidden"
  >
    <div
      ref="containerRef"
      class="flex h-screen"
      :style="{ width: `${panels.length * 100}vw` }"
    >
      <slot />
    </div>
  </div>
</template>

<style scoped>
.mobile-scroller {
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
.mobile-scroller::-webkit-scrollbar {
  display: none;
}
</style>
