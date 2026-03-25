<script setup lang="ts">
</script>

<template>
  <div class="chat-bubble chat-bubble--assistant inline-flex items-center gap-1" aria-live="polite">
    <span class="sr-only">AI is thinking...</span>
    <span class="typing-dot" />
    <span class="typing-dot typing-dot--delay-1" />
    <span class="typing-dot typing-dot--delay-2" />
  </div>
</template>

<style scoped>
.typing-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--color-accent);
  animation: typing-bounce 1.4s ease-in-out infinite;
}

.typing-dot--delay-1 {
  animation-delay: 0.2s;
}

.typing-dot--delay-2 {
  animation-delay: 0.4s;
}

@keyframes typing-bounce {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  30% {
    transform: translateY(-6px);
    opacity: 1;
  }
}
</style>
