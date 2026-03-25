<script setup lang="ts">
import type { OfferChatMessage } from '@/types'

const { message } = defineProps<{
  message: OfferChatMessage
}>()

const emit = defineEmits<{
  select: [actionId: string]
}>()

function handleSelect(actionId: string): void {
  const action = message.actions?.find((a) => a.id === actionId)
  if (action?.disabled) return
  emit('select', actionId)
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <!-- Message text -->
    <div class="chat-bubble chat-bubble--assistant whitespace-pre-line">
      {{ message.content }}
    </div>

    <!-- Action buttons -->
    <div
      v-if="message.actions?.length"
      class="ml-0 grid gap-2"
      :class="message.actionType === 'offer-confirm'
        ? 'grid-cols-2 max-w-xs'
        : 'grid-cols-1 sm:grid-cols-2 max-w-md'"
    >
      <button
        v-for="action in message.actions"
        :key="action.id"
        :disabled="action.disabled"
        class="rounded-lg border px-3 py-2.5 text-left text-sm transition-all duration-200 cursor-pointer"
        :class="[
          action.selected
            ? 'border-accent bg-accent-dark text-accent shadow-[0_0_20px_rgba(0,255,136,0.2)]'
            : action.disabled
              ? 'border-border/50 bg-bg-card/50 text-text-muted cursor-not-allowed opacity-50'
              : message.actionType === 'offer-confirm' && action.id === 'accept'
                ? 'border-accent bg-accent text-text-on-accent hover:scale-[1.02] hover:shadow-[var(--shadow-glow)] text-center font-medium'
                : message.actionType === 'offer-confirm' && action.id === 'decline'
                  ? 'border-border bg-bg-card text-text-secondary hover:border-accent-dark text-center'
                  : 'border-border bg-bg-card text-text-primary hover:border-accent-dark hover:shadow-[var(--shadow-glow)]',
        ]"
        @click="handleSelect(action.id)"
      >
        <span class="block font-medium">{{ action.label }}</span>
        <span v-if="action.description" class="block text-xs text-text-muted mt-0.5">
          {{ action.description }}
        </span>
      </button>
    </div>
  </div>
</template>
