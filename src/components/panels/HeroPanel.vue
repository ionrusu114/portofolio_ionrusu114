<script setup lang="ts">
import { inject } from 'vue'
import BasePanel from '@/components/ui/BasePanel.vue'
import BaseGlowText from '@/components/ui/BaseGlowText.vue'
import { personal } from '@/data/personal'
import { ScrollToPanelKey } from '@/types'

const scrollToPanel = inject(ScrollToPanelKey, () => {})
</script>

<template>
  <BasePanel id="hero">
    <div class="flex h-full flex-col items-center justify-center gap-6
                lg:flex-row lg:items-center lg:justify-between lg:gap-16">
      <!-- Text content -->
      <div class="flex flex-col items-center text-center lg:items-start lg:text-left">
        <p class="mb-2 font-mono text-sm text-text-muted">// hello, I'm</p>
        <h1 class="font-heading text-[length:var(--text-fluid-hero)] font-medium tracking-tight">
          <BaseGlowText tag="span">{{ personal.name }}</BaseGlowText>
        </h1>
        <p class="mt-4 max-w-lg text-lg text-text-secondary sm:text-xl">
          {{ personal.title }}
        </p>
        <p class="mt-2 font-mono text-sm text-accent">
          {{ personal.experience }} years of experience
        </p>
        <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <button class="btn-primary" @click="scrollToPanel(2)">
            View Projects
            <VIcon name="bi-arrow-right" scale="0.9" />
          </button>
          <button class="btn-secondary" @click="scrollToPanel(4)">
            Get in Touch
          </button>
        </div>
      </div>

      <!-- Photo placeholder -->
      <div class="relative flex-shrink-0">
        <div
          class="h-64 w-64 overflow-hidden rounded-2xl border border-border
                 bg-bg-elevated sm:h-80 sm:w-80 lg:h-96 lg:w-96"
        >
          <div class="flex h-full w-full items-center justify-center text-text-muted">
            <VIcon name="bi-code-slash" scale="4" class="opacity-20" />
          </div>
        </div>
        <div class="glow-border absolute -inset-1 -z-10 rounded-2xl opacity-50" />
      </div>
    </div>
  </BasePanel>
</template>
