<script setup lang="ts">
const { href, icon, label } = defineProps<{
  href: string
  icon: string
  label: string
}>()
</script>

<template>
  <a
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
    class="group flex items-center gap-3 rounded-lg border border-border bg-bg-card
           px-5 py-4 transition-all duration-300 cursor-pointer
           hover:border-accent-dark hover:shadow-[var(--shadow-glow)]
           focus-visible:ring-2 focus-visible:ring-accent"
  >
    <VIcon
      :name="icon"
      scale="1.4"
      class="text-text-secondary transition-colors duration-300
             group-hover:text-accent"
    />
    <span class="text-sm font-medium text-text-primary">{{ label }}</span>
    <VIcon
      name="bi-arrow-up-right"
      scale="0.8"
      class="ml-auto text-text-muted transition-all duration-300
             group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
    />
  </a>
</template>
