<script setup lang="ts">
import { ref, nextTick, watch, onMounted } from 'vue'
import { useOfferChat } from '@/composables/useOfferChat'
import BaseChatBubble from '@/components/ui/BaseChatBubble.vue'
import ChatActionMessage from '@/components/chat/ChatActionMessage.vue'
import ChatOfferCard from '@/components/chat/ChatOfferCard.vue'
import ChatTypingIndicator from '@/components/chat/ChatTypingIndicator.vue'
import ChatCustomBudgetInput from '@/components/chat/ChatCustomBudgetInput.vue'

const {
  messages,
  currentStep,
  isLoading,
  isRateLimited,
  canSendMessage,
  initialize,
  sendMessage,
  selectBudget,
  submitCustomBudget,
  selectTimeline,
  handleOfferResponse,
} = useOfferChat()

const inputMessage = ref('')
const messagesContainer = ref<HTMLElement | null>(null)

function handleSend(): void {
  if (!inputMessage.value.trim()) return
  sendMessage(inputMessage.value.trim())
  inputMessage.value = ''
}

function handleKeydown(e: KeyboardEvent): void {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}

function handleActionSelect(actionId: string, actionType: string): void {
  if (actionType === 'budget-select') {
    selectBudget(actionId)
  } else if (actionType === 'timeline-select') {
    selectTimeline(actionId)
  } else if (actionType === 'offer-confirm') {
    handleOfferResponse(actionId)
  }
}

function handleCustomBudget(min: number, max: number): void {
  submitCustomBudget(min, max)
}

function scrollToBottom(): void {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

watch(
  () => messages.value.length,
  () => scrollToBottom(),
)

watch(isLoading, () => scrollToBottom())

onMounted(() => {
  initialize()
})
</script>

<template>
  <div class="flex h-full flex-col rounded-lg border border-border bg-bg-card overflow-hidden">
    <!-- Header -->
    <div class="flex items-center gap-2 border-b border-border px-4 py-2.5">
      <span class="h-2 w-2 rounded-full bg-accent animate-pulse" />
      <span class="font-mono text-xs text-text-muted">project-assistant</span>
      <span
        v-if="currentStep === 'completed' || currentStep === 'declined'"
        class="ml-auto font-mono text-xs text-text-muted"
      >
        session ended
      </span>
    </div>

    <!-- Rate limit state -->
    <div
      v-if="isRateLimited"
      class="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center"
    >
      <VIcon name="bi-clock" scale="2" class="text-text-muted" />
      <div>
        <p class="text-base font-medium text-text-primary">Session limit reached</p>
        <p class="mt-1 text-sm text-text-secondary">
          You've used all 3 available sessions. Contact Ion directly at
          <a href="mailto:ionrusu114@gmail.com" class="text-accent hover:underline">
            ionrusu114@gmail.com
          </a>
        </p>
      </div>
    </div>

    <!-- Messages area -->
    <div
      v-else
      ref="messagesContainer"
      class="flex-1 space-y-3 overflow-y-auto p-4"
    >
      <template v-for="msg in messages" :key="msg.id">
        <!-- Action message (budget/timeline/confirm buttons) -->
        <ChatActionMessage
          v-if="msg.actionType && msg.actionType !== 'custom-budget'"
          :message="msg"
          @select="(id) => handleActionSelect(id, msg.actionType!)"
        />

        <!-- Custom budget input -->
        <div v-else-if="msg.actionType === 'custom-budget'" class="flex flex-col gap-2">
          <BaseChatBubble role="assistant">{{ msg.content }}</BaseChatBubble>
          <ChatCustomBudgetInput
            v-if="currentStep === 'custom-budget'"
            @submit="handleCustomBudget"
          />
        </div>

        <!-- Offer card -->
        <div v-else-if="msg.offer" class="flex flex-col gap-2">
          <BaseChatBubble role="assistant">{{ msg.content }}</BaseChatBubble>
          <ChatOfferCard :offer="msg.offer" />
        </div>

        <!-- Regular text message -->
        <BaseChatBubble v-else :role="msg.role">
          {{ msg.content }}
        </BaseChatBubble>
      </template>

      <!-- Typing indicator -->
      <ChatTypingIndicator v-if="isLoading" />
    </div>

    <!-- Input area -->
    <div
      v-if="canSendMessage"
      class="border-t border-border p-3"
    >
      <div class="flex items-end gap-2">
        <textarea
          v-model="inputMessage"
          rows="2"
          placeholder="Describe your project..."
          class="flex-1 resize-none rounded-lg border border-border bg-bg-elevated px-3 py-2
                 text-sm text-text-primary outline-none
                 focus:border-accent focus:shadow-[0_0_10px_rgba(0,255,136,0.15)]
                 transition-all placeholder:text-text-muted"
          @keydown="handleKeydown"
        />
        <button
          class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg
                 bg-accent text-text-on-accent transition-all cursor-pointer
                 hover:scale-105 hover:shadow-[var(--shadow-glow)]
                 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          :disabled="!inputMessage.trim()"
          @click="handleSend"
        >
          <VIcon name="bi-send" scale="0.9" />
        </button>
      </div>
    </div>
  </div>
</template>
