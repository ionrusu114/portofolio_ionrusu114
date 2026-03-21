<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTextReveal } from '@/composables/useTextReveal'
import { personal } from '@/data/personal'

const nameRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const expRef = ref<HTMLElement | null>(null)

const nameReveal = useTextReveal(nameRef, { delay: 1.5, duration: 0.8, y: 60 })
const titleReveal = useTextReveal(titleRef, { delay: 3, duration: 0.6, y: 30 })
const expReveal = useTextReveal(expRef, { delay: 4.5, duration: 0.5, y: 20 })

const emit = defineEmits<{
  animationComplete: []
}>()

onMounted(() => {
  nameReveal.play()
  titleReveal.play()
  const expTl = expReveal.play()
  if (expTl) {
    expTl.eventCallback('onComplete', () => {
      setTimeout(() => emit('animationComplete'), 1000)
    })
  }
})
</script>

<template>
  <div class="flex flex-col items-center gap-4 text-center" style="perspective: 800px">
    <h1
      ref="nameRef"
      class="font-heading text-5xl font-medium tracking-tight text-text-primary
             sm:text-6xl lg:text-7xl"
    >
      {{ personal.name }}
    </h1>
    <p
      ref="titleRef"
      class="text-lg text-text-secondary sm:text-xl"
    >
      {{ personal.title }}
    </p>
    <p
      ref="expRef"
      class="font-mono text-sm text-accent"
    >
      {{ personal.experience }}+ years of experience
    </p>
  </div>
</template>
