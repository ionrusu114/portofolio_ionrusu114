<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  submit: [min: number, max: number]
}>()

const min = ref<number | undefined>(undefined)
const max = ref<number | undefined>(undefined)
const validationError = ref('')

function handleSubmit(): void {
  validationError.value = ''

  if (!min.value || !max.value) {
    validationError.value = 'Please enter both minimum and maximum values'
    return
  }

  if (min.value <= 0 || max.value <= 0) {
    validationError.value = 'Values must be greater than 0'
    return
  }

  if (min.value >= max.value) {
    validationError.value = 'Minimum must be less than maximum'
    return
  }

  emit('submit', min.value, max.value)
}
</script>

<template>
  <div class="flex flex-col gap-3 rounded-lg border border-border bg-bg-card p-4 max-w-sm">
    <p class="font-mono text-xs uppercase text-text-muted">Custom Budget Range (EUR)</p>

    <div class="flex items-center gap-3">
      <div class="flex-1">
        <label class="block text-xs text-text-muted mb-1">Min €</label>
        <input
          v-model.number="min"
          type="number"
          min="1"
          placeholder="1,000"
          class="w-full rounded-md border border-border bg-bg-elevated px-3 py-2
                 font-mono text-sm text-text-primary outline-none
                 focus:border-accent focus:shadow-[0_0_10px_rgba(0,255,136,0.15)]
                 transition-all placeholder:text-text-muted"
        />
      </div>

      <span class="mt-5 text-text-muted">—</span>

      <div class="flex-1">
        <label class="block text-xs text-text-muted mb-1">Max €</label>
        <input
          v-model.number="max"
          type="number"
          min="1"
          placeholder="10,000"
          class="w-full rounded-md border border-border bg-bg-elevated px-3 py-2
                 font-mono text-sm text-text-primary outline-none
                 focus:border-accent focus:shadow-[0_0_10px_rgba(0,255,136,0.15)]
                 transition-all placeholder:text-text-muted"
        />
      </div>
    </div>

    <p v-if="validationError" class="text-xs text-error">{{ validationError }}</p>

    <button
      class="btn-primary justify-center text-sm"
      @click="handleSubmit"
    >
      Confirm Budget
    </button>
  </div>
</template>
