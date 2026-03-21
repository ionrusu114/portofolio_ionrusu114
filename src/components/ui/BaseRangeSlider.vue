<script setup lang="ts">
const { modelValue, min = 1, max = 12, step = 1, label } = defineProps<{
  modelValue: number
  min?: number
  max?: number
  step?: number
  label?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

function handleInput(event: Event): void {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', Number(target.value))
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <div v-if="label" class="flex items-center justify-between text-sm">
      <span class="text-text-secondary">{{ label }}</span>
      <span class="font-mono text-accent">{{ modelValue }}</span>
    </div>
    <input
      type="range"
      :value="modelValue"
      :min="min"
      :max="max"
      :step="step"
      class="w-full cursor-pointer accent-accent"
      @input="handleInput"
    />
    <div class="flex justify-between text-xs text-text-muted">
      <span>{{ min }}</span>
      <span>{{ max }}</span>
    </div>
  </div>
</template>
