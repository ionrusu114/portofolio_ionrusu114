<script setup lang="ts">
import { ref } from 'vue'
import { useHorizontalScroll } from '@/composables/useHorizontalScroll'
import type { PanelId } from '@/types'

const panels: PanelId[] = ['hero', 'about', 'projects', 'get-offer', 'contact']

const wrapperRef = ref<HTMLElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)

useHorizontalScroll(wrapperRef, containerRef, {
  panelCount: panels.length,
})
</script>

<template>
  <div ref="wrapperRef" class="h-screen w-screen overflow-hidden">
    <div
      ref="containerRef"
      class="flex h-screen"
      :style="{ width: `${panels.length * 100}vw` }"
    >
      <slot />
    </div>
  </div>
</template>
