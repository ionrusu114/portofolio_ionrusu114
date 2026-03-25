<script setup lang="ts">
import { ref, computed } from 'vue'
import ProjectCardSection from '@/components/sections/ProjectCardSection.vue'
import type { ProjectDetail } from '@/types'

const { projects } = defineProps<{
  projects: ProjectDetail[]
}>()

const currentIndex = ref(0)
const touchStartX = ref(0)
const touchDeltaX = ref(0)
const isSwiping = ref(false)

const canGoPrev = computed(() => currentIndex.value > 0)
const canGoNext = computed(() => currentIndex.value < projects.length - 1)

function goTo(index: number): void {
  currentIndex.value = Math.max(0, Math.min(index, projects.length - 1))
}

function onTouchStart(e: TouchEvent): void {
  touchStartX.value = e.touches[0].clientX
  touchDeltaX.value = 0
  isSwiping.value = true
}

function onTouchMove(e: TouchEvent): void {
  if (!isSwiping.value) return
  touchDeltaX.value = e.touches[0].clientX - touchStartX.value
}

function onTouchEnd(): void {
  if (!isSwiping.value) return
  isSwiping.value = false
  const threshold = 50
  if (touchDeltaX.value < -threshold && canGoNext.value) {
    goTo(currentIndex.value + 1)
  } else if (touchDeltaX.value > threshold && canGoPrev.value) {
    goTo(currentIndex.value - 1)
  }
  touchDeltaX.value = 0
}

const trackStyle = computed(() => {
  const swipeOffset = isSwiping.value ? touchDeltaX.value : 0
  return {
    transform: `translateX(calc(-${currentIndex.value * 100}% + ${swipeOffset}px))`,
    transition: isSwiping.value ? 'none' : 'transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)',
  }
})
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- Carousel track -->
    <div
      class="overflow-hidden rounded-lg"
      @touchstart.passive="onTouchStart"
      @touchmove.passive="onTouchMove"
      @touchend="onTouchEnd"
    >
      <div class="flex" :style="trackStyle">
        <div
          v-for="project in projects"
          :key="project.id"
          class="w-full flex-shrink-0 px-1"
        >
          <ProjectCardSection :project="project" />
        </div>
      </div>
    </div>

    <!-- Dots + swipe hint -->
    <div class="flex items-center justify-center gap-3">
      <button
        v-for="(project, index) in projects"
        :key="project.id"
        class="h-2 rounded-full transition-all duration-300 cursor-pointer"
        :class="index === currentIndex
          ? 'w-6 bg-accent'
          : 'w-2 bg-text-muted/40 hover:bg-text-muted'"
        :aria-label="`View ${project.title}`"
        @click="goTo(index)"
      />
    </div>

    <p class="text-center font-mono text-xs text-text-muted">
      Swipe to browse &middot; {{ currentIndex + 1 }}/{{ projects.length }}
    </p>
  </div>
</template>
