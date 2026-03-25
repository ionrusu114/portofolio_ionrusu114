<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  submit: [contact: { email: string; phone: string }]
}>()

const email = ref('')
const phone = ref('')
const validationError = ref('')

function handleSubmit(): void {
  validationError.value = ''

  if (!email.value.trim()) {
    validationError.value = 'Please enter your email address'
    return
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(email.value.trim())) {
    validationError.value = 'Please enter a valid email address'
    return
  }

  if (!phone.value.trim()) {
    validationError.value = 'Please enter your phone number'
    return
  }

  emit('submit', { email: email.value.trim(), phone: phone.value.trim() })
}
</script>

<template>
  <div class="flex flex-col gap-3 rounded-lg border border-border bg-bg-card p-4 max-w-sm">
    <p class="font-mono text-xs uppercase text-text-muted">Contact Information</p>

    <div>
      <label class="block text-xs text-text-muted mb-1">Email *</label>
      <input
        v-model="email"
        type="email"
        placeholder="your@email.com"
        class="w-full rounded-md border border-border bg-bg-elevated px-3 py-2
               font-mono text-sm text-text-primary outline-none
               focus:border-accent focus:shadow-[0_0_10px_rgba(0,255,136,0.15)]
               transition-all placeholder:text-text-muted"
      />
    </div>

    <div>
      <label class="block text-xs text-text-muted mb-1">Phone *</label>
      <input
        v-model="phone"
        type="tel"
        placeholder="+40 7XX XXX XXX"
        class="w-full rounded-md border border-border bg-bg-elevated px-3 py-2
               font-mono text-sm text-text-primary outline-none
               focus:border-accent focus:shadow-[0_0_10px_rgba(0,255,136,0.15)]
               transition-all placeholder:text-text-muted"
      />
    </div>

    <p v-if="validationError" class="text-xs text-error">{{ validationError }}</p>

    <button
      class="btn-primary justify-center text-sm"
      @click="handleSubmit"
    >
      Send Offer Request
    </button>
  </div>
</template>
