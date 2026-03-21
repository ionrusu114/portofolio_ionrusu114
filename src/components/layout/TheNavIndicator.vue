<script setup lang="ts">
import { inject, ref } from 'vue'
import { ScrollToPanelKey, CurrentPanelKey } from '@/types'
import type { PanelId } from '@/types'

const panels: { id: PanelId; label: string }[] = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'get-offer', label: 'Get Offer' },
  { id: 'contact', label: 'Contact' },
]

const scrollToPanel = inject(ScrollToPanelKey, () => {})
const currentPanelIndex = inject(CurrentPanelKey, ref(0))
</script>

<template>
  <nav
    class="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3
           rounded-full border border-border bg-bg-card/80 px-4 py-2 backdrop-blur-md"
    aria-label="Page navigation"
  >
    <button
      v-for="(panel, index) in panels"
      :key="panel.id"
      class="nav-dot"
      :class="{ 'nav-dot--active': currentPanelIndex === index }"
      :aria-label="`Go to ${panel.label}`"
      :aria-current="currentPanelIndex === index ? 'true' : undefined"
      @click="scrollToPanel(index)"
    >
      <span class="sr-only">{{ panel.label }}</span>
    </button>
  </nav>
</template>
