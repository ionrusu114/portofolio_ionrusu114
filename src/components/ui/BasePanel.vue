<script setup lang="ts">
import type { PanelId } from '@/types'

const { id } = defineProps<{
  id: PanelId
}>()
</script>

<template>
  <section :id="id" class="panel">
    <div class="section-container panel-content">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.panel-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
}

/* Mobile: let content flow naturally, add padding for breathing room */
@media (max-width: 767px) {
  .panel-content {
    justify-content: flex-start;
    height: auto;
    min-height: 100%;
    padding-top: 5rem;
    padding-bottom: 2rem;
  }
}
</style>
