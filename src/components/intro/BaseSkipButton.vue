<script setup lang="ts">
const emit = defineEmits<{
  skip: []
}>()
</script>

<template>
  <button
    class="fixed bottom-6 right-6 z-[60] flex items-center gap-2
           rounded-full border border-border bg-bg-card/80 px-4 py-2
           font-mono text-xs text-text-muted backdrop-blur-sm
           cursor-pointer transition-all duration-200
           hover:border-accent-dark hover:text-text-primary"
    @click="emit('skip')"
  >
    Skip
    <VIcon name="bi-chevron-right" scale="0.7" />
  </button>
</template>
