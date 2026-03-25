<script setup lang="ts">
import type { GeneratedOffer } from '@/types'

const { offer } = defineProps<{
  offer: GeneratedOffer
}>()
</script>

<template>
  <div class="max-w-lg rounded-lg border border-accent-dark bg-bg-elevated p-4 sm:p-5">
    <!-- Header -->
    <div class="mb-4 border-b border-border pb-3">
      <p class="font-mono text-xs uppercase tracking-widest text-accent">// project estimate</p>
      <p class="mt-2 text-sm leading-relaxed text-text-secondary">
        {{ offer.projectSummary }}
      </p>
    </div>

    <!-- Hours breakdown -->
    <div class="mb-4 space-y-1.5">
      <p class="font-mono text-xs uppercase text-text-muted">Hours Breakdown</p>
      <div
        v-for="item in offer.hoursBreakdown"
        :key="item.task"
        class="flex items-center justify-between text-sm"
      >
        <span class="text-text-secondary">{{ item.task }}</span>
        <span class="font-mono text-text-primary">{{ item.estimatedHours }}h</span>
      </div>
    </div>

    <!-- Totals -->
    <div class="border-t border-border pt-3 space-y-2">
      <div class="flex justify-between text-sm">
        <span class="text-text-muted">Total Hours</span>
        <span class="font-mono text-text-primary">
          {{ offer.totalHoursMin }} - {{ offer.totalHoursMax }}h
        </span>
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-text-muted">Rate</span>
        <span class="font-mono text-text-primary">
          €{{ offer.ratePerHour }}/hour · {{ offer.contractType }}
        </span>
      </div>
      <div class="flex justify-between text-base font-medium">
        <span class="text-accent">Total Estimate</span>
        <span class="font-mono text-accent">
          €{{ offer.totalMin.toLocaleString() }} - €{{ offer.totalMax.toLocaleString() }}
        </span>
      </div>
    </div>

    <!-- Disclaimer -->
    <p class="mt-4 text-xs leading-relaxed text-text-muted italic">
      {{ offer.disclaimer }}
    </p>
  </div>
</template>
