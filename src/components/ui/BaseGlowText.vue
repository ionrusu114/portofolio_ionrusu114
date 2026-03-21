<script setup lang="ts">
const { tag = 'span' } = defineProps<{
  tag?: string
}>()
</script>

<template>
  <component :is="tag" class="glow-text text-accent">
    <slot />
  </component>
</template>
