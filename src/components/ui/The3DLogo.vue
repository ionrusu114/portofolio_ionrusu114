<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { gsap } from 'gsap'

const props = defineProps<{
  src: string
  depth?: number
  color?: string // Defaults to var(--color-accent)
}>()

const containerRef = ref<HTMLElement | null>(null)
const processedImageSrc = ref('')
const depthLayers = ref(props.depth || 8)

onMounted(() => {
  const img = new Image()
  img.crossOrigin = 'Anonymous'
  img.src = props.src

  img.onload = () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = img.width
    canvas.height = img.height

    ctx.drawImage(img, 0, 0)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    // Accent color: #00FF88 (rgb: 0, 255, 136)
    let targetR = 0
    let targetG = 255
    let targetB = 136

    // If a custom color prop is passed (hex), parse it
    if (props.color && props.color.startsWith('#')) {
      const hex = props.color.replace('#', '')
      targetR = parseInt(hex.substring(0, 2), 16)
      targetG = parseInt(hex.substring(2, 4), 16)
      targetB = parseInt(hex.substring(4, 6), 16)
    }

    // Process pixels
    const finalData = new Uint8ClampedArray(data.length)
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      const a = data[i + 3]

      // Check if pixel is close to white (background) or already transparent
      const isBg = (r > 220 && g > 220 && b > 220) || a < 10

      if (isBg) {
        // Make background transparent
        finalData[i] = 0
        finalData[i + 1] = 0
        finalData[i + 2] = 0
        finalData[i + 3] = 0 // Alpha = 0
      } else {
        // Colorize non-background pixels to target color 
        finalData[i] = targetR
        finalData[i + 1] = targetG
        finalData[i + 2] = targetB
        
        // Enhance opacity slightly to ensure the green pops, but cap at 255
        finalData[i + 3] = Math.min(a + 20, 255) 
      }
    }

    // Create a new ImageData object
    const newImageData = new ImageData(finalData, canvas.width, canvas.height)
    ctx.putImageData(newImageData, 0, 0)
    processedImageSrc.value = canvas.toDataURL('image/png')

    // Animate the drop-in entry 
    nextTick(() => {
      if (!containerRef.value) return
      
      const layers = containerRef.value.querySelectorAll('.logo-layer')
      gsap.from(layers, {
        y: -100,
        opacity: 0,
        duration: 1,
        stagger: 0.05,
        ease: 'bounce.out',
      })
      
      // Floating animation post-entry
      gsap.to(containerRef.value, {
        y: -5,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1
      })
    })
  }
})
</script>

<template>
  <div 
    ref="containerRef" 
    class="relative h-full w-full"
    style="transform-style: preserve-3d; transform: perspective(800px) rotateX(15deg) rotateY(-15deg);"
  >
    <!-- Base transparent image layers for 3D extrusion -->
    <div 
      v-for="i in depthLayers" 
      :key="i"
      class="logo-layer absolute inset-0"
      :style="{
        transform: `translateZ(${-(i - 1) * 2}px)`,
        filter: i !== 1 ? `brightness(${0.4 + (depthLayers - i) * 0.05})` : 'drop-shadow(0 0 10px rgba(0, 255, 136, 0.5))'
      }"
    >
      <img 
        v-if="processedImageSrc" 
        :src="processedImageSrc" 
        class="h-full w-full object-contain object-left" 
        alt="3D Logo Layer"
        aria-hidden="true"
      />
    </div>
  </div>
</template>

<style scoped>
/* Ensure the container doesn't block clicks underneath, while still being interactive */
.logo-layer {
  pointer-events: none;
}
.logo-layer:first-child {
  pointer-events: auto;
}
</style>
