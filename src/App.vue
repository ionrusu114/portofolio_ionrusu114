<script setup lang="ts">
import { RouterView } from 'vue-router'
import TheIntroOverlay from '@/components/intro/TheIntroOverlay.vue'
import { useIntro } from '@/composables/useIntro'

const { shouldShowIntro, completeIntro } = useIntro()

function handleIntroComplete(): void {
  completeIntro()
}
</script>

<template>
  <TheIntroOverlay
    v-if="shouldShowIntro"
    @complete="handleIntroComplete"
  />
  <RouterView v-show="!shouldShowIntro" />
</template>
