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
  <div
    ref="wrapperRef"
    class="w-screen"
    :class="isMobile ? 'h-dvh' : 'h-screen overflow-hidden'"
  >
    <div
      ref="containerRef"
      class="flex"
      :class="isMobile
        ? 'h-full snap-x snap-mandatory overflow-x-auto mobile-scroller'
        : 'h-screen'"
      :style="isMobile ? undefined : { width: `${panels.length * 100}vw` }"
    >
      <slot />
    </div>

    <!-- Mobile panel dots -->
    <div
      v-if="isMobile"
      class="fixed bottom-4 left-1/2 z-40 -translate-x-1/2"
    >
      <div class="flex items-center gap-2.5 rounded-full border border-border bg-bg-card/90 px-3.5 py-2 backdrop-blur-md">
        <button
          v-for="(label, index) in panelLabels"
          :key="label"
          class="h-2 rounded-full transition-all duration-300 cursor-pointer"
          :class="index === currentPanelIndex
            ? 'w-6 bg-accent shadow-[0_0_10px_rgba(0,255,136,0.6)]'
            : 'w-2 bg-text-muted/30 hover:bg-text-muted/50'"
          :aria-label="`Go to ${label}`"
          @click="scrollToPanel(index)"
        />
      </div>
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
