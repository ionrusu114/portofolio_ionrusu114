<script setup lang="ts">
import { ref } from 'vue'
import { useHorizontalScroll } from '@/composables/useHorizontalScroll'
import type { PanelId } from '@/types'

const panels: PanelId[] = ['hero', 'about', 'projects', 'get-offer', 'contact']

const wrapperRef = ref<HTMLElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)

const { isMobile } = useHorizontalScroll(wrapperRef, containerRef, {
  panelCount: panels.length,
})
</script>

<template>
  <!-- Mobile: horizontal scroll-snap -->
  <div
    v-if="isMobile"
    ref="wrapperRef"
    class="h-dvh w-screen"
  >
    <div
      ref="containerRef"
      class="mobile-scroller flex h-full snap-x snap-mandatory overflow-x-auto"
    >
      <slot />
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
