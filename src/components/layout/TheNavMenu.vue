<script setup lang="ts">
import { ref, inject } from 'vue'
import The3DLogo from '@/components/ui/The3DLogo.vue'
import { ScrollToPanelKey, CurrentPanelKey } from '@/types'
import type { PanelId } from '@/types'

const panels: { id: PanelId; label: string }[] = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'get-offer', label: 'Get Offer' },
  { id: 'contact', label: 'Contact' },
]

const isOpen = ref(false)
const scrollToPanel = inject(ScrollToPanelKey, () => {})
const currentPanelIndex = inject(CurrentPanelKey, ref(0))

function navigate(index: number): void {
  scrollToPanel(index)
  isOpen.value = false
}
</script>

<template>
  <div class="fixed left-4 top-4 z-50">
    <a href="#" @click.prevent="scrollToPanel(0)" class="block h-20 w-40 md:h-24 md:w-48 cursor-pointer outline-none transition-transform hover:scale-105" aria-label="Home">
      <The3DLogo 
        src="/images/logo.png" 
        :depth="8" 
        class="h-full w-full" 
      />
    </a>
  </div>

  <div class="fixed right-4 top-4 z-50 md:hidden">
    <button
      class="flex h-10 w-10 items-center justify-center rounded-lg
             border border-border bg-bg-card/80 backdrop-blur-md
             cursor-pointer transition-colors hover:border-accent-dark"
      :aria-expanded="isOpen"
      aria-label="Toggle menu"
      @click="isOpen = !isOpen"
    >
      <VIcon :name="isOpen ? 'hi-x' : 'hi-menu'" scale="1.2" class="text-text-primary" />
    </button>

    <Transition name="menu">
      <div
        v-show="isOpen"
        class="absolute right-0 top-12 w-48 rounded-lg border border-border
               bg-bg-card/95 p-2 backdrop-blur-md"
      >
        <button
          v-for="(panel, index) in panels"
          :key="panel.id"
          class="flex w-full items-center gap-3 rounded-md px-3 py-2.5
                 text-sm transition-colors cursor-pointer
                 hover:bg-bg-elevated"
          :class="currentPanelIndex === index
            ? 'text-accent'
            : 'text-text-secondary'"
          @click="navigate(index)"
        >
          <span
            class="h-1.5 w-1.5 rounded-full"
            :class="currentPanelIndex === index ? 'bg-accent' : 'bg-text-muted'"
          />
          {{ panel.label }}
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.menu-enter-active,
.menu-leave-active {
  transition: opacity 200ms ease, transform 200ms ease;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
