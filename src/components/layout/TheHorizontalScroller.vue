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

    <!-- Mobile panel indicator with labels -->
    <div class="fixed bottom-3 left-1/2 z-40 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm">
      <div class="flex items-center justify-between rounded-xl border border-border bg-bg-card/95 px-1 py-1 backdrop-blur-md">
        <button
          v-for="(label, index) in panelLabels"
          :key="label"
          class="flex flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 transition-all duration-300 cursor-pointer"
          :class="index === currentPanelIndex
            ? 'bg-accent/15 text-accent'
            : 'text-text-muted'"
          @click="scrollToPanel(index)"
        >
          <span
            class="h-1 rounded-full transition-all duration-300"
            :class="index === currentPanelIndex
              ? 'w-4 bg-accent shadow-[0_0_8px_rgba(0,255,136,0.5)]'
              : 'w-1 bg-text-muted/30'"
          />
          <span class="text-[0.55rem] font-mono leading-none">{{ label }}</span>
        </button>
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
