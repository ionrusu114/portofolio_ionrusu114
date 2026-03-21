<script setup lang="ts">
const { role } = defineProps<{
  role: 'user' | 'assistant' | 'system'
}>()
</script>

<template>
  <div
    class="chat-bubble"
    :class="{
      'chat-bubble--user': role === 'user',
      'chat-bubble--assistant': role === 'assistant' || role === 'system',
    }"
  >
    <slot />
  </div>
</template>
