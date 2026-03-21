<script setup lang="ts">
import { ref, inject } from 'vue'
import { useThreeBackground } from '@/composables/useThreeBackground'
import { useMediaQuery } from '@/composables/useMediaQuery'
import { ScrollProgressKey } from '@/types'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const scrollProgress = inject(ScrollProgressKey, ref(0))
const isMobile = useMediaQuery('(max-width: 768px)')

useThreeBackground(canvasRef, scrollProgress, {
  particleCount: isMobile.value ? 200 : 600,
})
</script>

<template>
  <canvas
    ref="canvasRef"
    class="pointer-events-none fixed inset-0 -z-10 h-full w-full"
    aria-hidden="true"
  />
</template>
