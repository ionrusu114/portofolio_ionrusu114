<script setup lang="ts">
import type { PanelId } from '@/types'

const { id } = defineProps<{
  id: PanelId
}>()
</script>

<template>
  <section :id="id" class="panel">
    <div class="section-container flex h-full flex-col justify-center">
      <slot />
    </div>
  </section>
</template>
