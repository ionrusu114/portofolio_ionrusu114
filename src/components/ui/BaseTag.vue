<script setup lang="ts">
const { label, icon, active = false } = defineProps<{
  label: string
  icon?: string
  active?: boolean
}>()
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5
           text-xs font-medium transition-all duration-200"
    :class="active
      ? 'border-accent bg-accent-dark text-accent'
      : 'border-border bg-bg-card text-text-secondary hover:border-accent-dark hover:text-text-primary'"
  >
    <VIcon v-if="icon" :name="icon" scale="0.8" />
    {{ label }}
  </span>
</template>
