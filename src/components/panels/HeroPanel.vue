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
    <div class="flex flex-col items-center justify-center gap-6
                md:h-full
                lg:flex-row lg:items-center lg:justify-between lg:gap-16">
      <!-- Text content -->
      <div class="flex flex-col items-center text-center lg:items-start lg:text-left">
        <p class="mb-1 font-mono text-xs text-text-muted md:mb-2 md:text-sm">// hello, I'm</p>
        <h1 class="font-heading text-3xl font-medium tracking-tight sm:text-4xl md:text-[length:var(--text-fluid-hero)]">
          <BaseGlowText tag="span">{{ personal.name }}</BaseGlowText>
        </h1>
        <p class="mt-2 max-w-lg text-sm text-text-secondary sm:text-base md:mt-4 md:text-xl">
          {{ personal.title }}
        </p>
        <p class="mt-1 font-mono text-xs text-accent md:mt-2 md:text-sm">
          {{ personal.experience }} years of experience
        </p>
        <div class="mt-4 flex flex-col gap-2 sm:flex-row sm:gap-4 md:mt-8">
          <button class="btn-primary text-sm md:text-base" @click="scrollToPanel(2)">
            View Projects
            <VIcon name="bi-arrow-right" scale="0.9" />
          </button>
          <button class="btn-secondary text-sm md:text-base" @click="scrollToPanel(3)">
            Get an Offer
          </button>
        </div>
      </div>

      <!-- Profile Photo -->
      <div class="relative flex-shrink-0 group lg:ml-8">
        <!-- Decorative background offset -->
        <div class="absolute -right-4 -bottom-4 z-0 h-full w-full rounded-2xl border border-accent/30 bg-accent/5 transition-transform duration-700 group-hover:-translate-x-2 group-hover:-translate-y-2"></div>
        
        <div
          class="relative z-10 h-48 w-48 overflow-hidden rounded-2xl border border-border
                 bg-bg-elevated sm:h-64 sm:w-64 md:h-80 md:w-80 lg:h-96 lg:w-96 shadow-2xl"
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
