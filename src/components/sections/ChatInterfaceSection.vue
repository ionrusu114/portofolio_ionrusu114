<script setup lang="ts">
import { ref } from 'vue'
import BaseChatBubble from '@/components/ui/BaseChatBubble.vue'

const inputMessage = ref('')

const messages = [
  {
    id: '1',
    role: 'system' as const,
    content: 'Welcome! Describe your project and I\'ll help you estimate scope, timeline, and budget.',
  },
  {
    id: '2',
    role: 'user' as const,
    content: 'I need an e-commerce platform with payment integration and admin dashboard.',
  },
  {
    id: '3',
    role: 'assistant' as const,
    content: 'Great project! Based on your requirements, I\'d recommend a custom solution with Vue.js frontend, FastAPI backend, and Stripe integration. Estimated timeline: 8-12 weeks.',
  },
]
</script>

<template>
  <div class="flex h-full flex-col rounded-lg border border-border bg-bg-card">
    <!-- Header -->
    <div class="flex items-center gap-2 border-b border-border px-4 py-3">
      <span class="h-2 w-2 rounded-full bg-accent" />
      <span class="font-mono text-xs text-text-muted">project-assistant</span>
      <span class="ml-auto rounded-full bg-accent-dark px-2 py-0.5 font-mono text-[10px] text-accent">
        DEMO
      </span>
    </div>

    <!-- Messages -->
    <div class="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
      <BaseChatBubble
        v-for="msg in messages"
        :key="msg.id"
        :role="msg.role"
      >
        {{ msg.content }}
      </BaseChatBubble>
    </div>

    <!-- Input -->
    <div class="flex items-center gap-2 border-t border-border p-3">
      <input
        v-model="inputMessage"
        type="text"
        placeholder="Describe your project..."
        class="flex-1 rounded-lg border border-border bg-bg-elevated px-3 py-2
               text-sm text-text-primary placeholder:text-text-muted
               cursor-text transition-colors
               hover:border-accent-dark
               focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
      />
      <button
        class="flex h-9 w-9 items-center justify-center rounded-lg
               bg-accent text-text-on-accent cursor-pointer
               transition-transform hover:scale-105 active:scale-95"
        aria-label="Send message"
      >
        <VIcon name="bi-send" scale="0.9" />
      </button>
    </div>
  </div>
</template>
