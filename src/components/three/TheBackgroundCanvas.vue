<script setup lang="ts">
import { ref, inject } from 'vue'
import { useRealisticThreeScene } from '@/composables/useRealisticThreeScene'
import { useMediaQuery } from '@/composables/useMediaQuery'
import { ScrollProgressKey } from '@/types'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const scrollProgress = inject(ScrollProgressKey, ref(0))
const isMobile = useMediaQuery('(max-width: 768px)')

// Use the new realistic 3D scene (deep particle field, bokeh, floating glass)
useRealisticThreeScene(canvasRef, scrollProgress, {
  particleCount: isMobile.value ? 500 : 2500,
})
</script>

<template>
  <canvas
    ref="canvasRef"
    class="pointer-events-none fixed inset-0 -z-10 h-full w-full"
    aria-hidden="true"
  />
</template>
