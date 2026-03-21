<script setup lang="ts">
import { ref } from 'vue'
import BasePanel from '@/components/ui/BasePanel.vue'
import BaseSocialLink from '@/components/ui/BaseSocialLink.vue'
import BaseGlowText from '@/components/ui/BaseGlowText.vue'
import { personal } from '@/data/personal'

const copied = ref(false)

function copyPhone(): void {
  navigator.clipboard.writeText(personal.phone)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}
</script>

<template>
  <BasePanel id="contact">
    <div class="flex h-full flex-col items-center justify-center gap-8 text-center">
      <div>
        <p class="mb-2 font-mono text-xs uppercase tracking-widest text-accent">
          // contact
        </p>
        <h2 class="heading-2">
          Let's Work
          <BaseGlowText tag="span"> Together</BaseGlowText>
        </h2>
        <p class="mt-4 max-w-md text-text-secondary">
          Have a project in mind? Let's discuss how I can help bring your vision to life.
        </p>
      </div>

      <div class="grid w-full max-w-md grid-cols-1 gap-3">
        <BaseSocialLink
          :href="personal.linkedin"
          icon="fa-linkedin"
          label="LinkedIn"
        />
        <BaseSocialLink
          :href="personal.github"
          icon="fa-github"
          label="GitHub"
        />
        <BaseSocialLink
          :href="`mailto:${personal.email}`"
          icon="bi-envelope"
          :label="personal.email"
        />
      </div>

      <!-- Phone with copy -->
      <button
        class="flex items-center gap-2 rounded-lg border border-border bg-bg-card
               px-5 py-3 transition-all duration-200 cursor-pointer
               hover:border-accent-dark hover:shadow-[var(--shadow-glow)]"
        @click="copyPhone"
      >
        <VIcon name="bi-telephone" scale="1" class="text-text-secondary" />
        <span class="font-mono text-sm text-text-primary">{{ personal.phone }}</span>
        <VIcon
          :name="copied ? 'bi-clipboard' : 'bi-clipboard'"
          scale="0.8"
          class="ml-2 transition-colors"
          :class="copied ? 'text-accent' : 'text-text-muted'"
        />
        <span
          v-if="copied"
          class="font-mono text-xs text-accent"
        >
          Copied!
        </span>
      </button>
    </div>
  </BasePanel>
</template>
