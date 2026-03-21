<script setup lang="ts">
import { ref } from 'vue'
import BaseRangeSlider from '@/components/ui/BaseRangeSlider.vue'

const timeline = ref(3)
</script>

<template>
  <div class="flex flex-col gap-3">
    <h4 class="font-mono text-xs uppercase tracking-widest text-text-muted">
      <VIcon name="bi-clock" scale="0.8" class="inline" />
      Timeline (months)
    </h4>
    <BaseRangeSlider
      v-model="timeline"
      :min="1"
      :max="12"
      :step="1"
      :label="`${timeline} ${timeline === 1 ? 'month' : 'months'}`"
    />
  </div>
</template>
