<script setup lang="ts">
import { ref } from 'vue'
import { budgetOptions } from '@/data/budgetOptions'

const selectedBudget = ref<string | null>(null)
</script>

<template>
  <div class="flex flex-col gap-3">
    <h4 class="font-mono text-xs uppercase tracking-widest text-text-muted">
      <VIcon name="bi-currency-dollar" scale="0.8" class="inline" />
      Budget Range
    </h4>
    <div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
      <button
        v-for="option in budgetOptions"
        :key="option.id"
        class="budget-card text-left"
        :class="{ 'budget-card--active': selectedBudget === option.id }"
        @click="selectedBudget = option.id"
      >
        <span class="block font-mono text-sm font-medium text-text-primary">
          {{ option.label }}
        </span>
        <span v-if="option.range" class="text-xs text-text-muted">
          {{ option.currency }}
        </span>
      </button>
    </div>
  </div>
</template>
