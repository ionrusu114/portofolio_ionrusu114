<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'
import IntroLogo from './IntroLogo.vue'
import IntroTextReveal from './IntroTextReveal.vue'
import BaseSkipButton from './BaseSkipButton.vue'

const emit = defineEmits<{
  complete: []
}>()

const overlayRef = ref<HTMLElement | null>(null)
const isVisible = ref(true)

function exitIntro(): void {
  if (!overlayRef.value) {
    isVisible.value = false
    emit('complete')
    return
  }

  gsap.to(overlayRef.value, {
    opacity: 0,
    duration: 0.6,
    ease: 'power2.in',
    onComplete: () => {
      isVisible.value = false
      emit('complete')
    },
  })
}

function handleSkip(): void {
  exitIntro()
}

function handleAnimationComplete(): void {
  exitIntro()
}

onMounted(() => {
  gsap.from(overlayRef.value, {
    opacity: 0,
    duration: 0.5,
    ease: 'power2.out',
  })
})
</script>

<template>
  <div
    v-if="isVisible"
    ref="overlayRef"
    class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg"
  >
    <IntroLogo />
    <div class="mt-12">
      <IntroTextReveal @animation-complete="handleAnimationComplete" />
    </div>
    <BaseSkipButton @skip="handleSkip" />
  </div>
</template>
