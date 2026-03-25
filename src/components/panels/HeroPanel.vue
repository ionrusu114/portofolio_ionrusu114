<script setup lang="ts">
import { inject } from 'vue'
import BasePanel from '@/components/ui/BasePanel.vue'
import BaseGlowText from '@/components/ui/BaseGlowText.vue'
import ScrollIndicator from '@/components/ui/ScrollIndicator.vue'
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
          <button class="btn-secondary" @click="scrollToPanel(3)">
            Get an Offer
          </button>
        </div>
      </div>

      <!-- Profile Photo -->
      <div class="relative flex-shrink-0 group lg:ml-8">
        <!-- Decorative background offset -->
        <div class="absolute -right-4 -bottom-4 z-0 h-full w-full rounded-2xl border border-accent/30 bg-accent/5 transition-transform duration-700 group-hover:-translate-x-2 group-hover:-translate-y-2"></div>
        
        <div
          class="relative z-10 h-64 w-64 overflow-hidden rounded-2xl border border-border
                 bg-bg-elevated sm:h-80 sm:w-80 lg:h-96 lg:w-96 shadow-2xl"
        >
          <img 
            src="/images/edited.png" 
            alt="Ion Rusu" 
            class="h-full w-full object-cover object-top grayscale-[0.4] transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0" 
          />
          <!-- Gradient overlay for smooth blending with the dark theme -->
          <div class="absolute inset-0 bg-gradient-to-t from-bg-bg-card/90 via-transparent to-transparent opacity-80 mix-blend-multiply"></div>
        </div>
        <div class="glow-border absolute -inset-1 -z-10 rounded-2xl opacity-50 transition-opacity duration-700 group-hover:opacity-100" />
      </div>
    </div>

    <!-- Scroll indicator at bottom of panel -->
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2">
      <ScrollIndicator />
    </div>
  </BasePanel>
</template>
