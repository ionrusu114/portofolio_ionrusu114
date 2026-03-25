<script setup lang="ts">
import BasePanel from '@/components/ui/BasePanel.vue'
import ProjectCardSection from '@/components/sections/ProjectCardSection.vue'
import ProjectCarousel from '@/components/sections/ProjectCarousel.vue'
import { projects } from '@/data/projects'
</script>

<template>
  <BasePanel id="projects">
    <div class="flex h-full flex-col justify-center gap-6 py-4 sm:gap-8 sm:py-8">
      <div>
        <p class="mb-2 font-mono text-xs uppercase tracking-widest text-accent">
          // projects
        </p>
        <h2 class="heading-2">Selected Work</h2>
      </div>

      <!-- Desktop: grid -->
      <div class="hidden gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3">
        <ProjectCardSection
          v-for="project in projects"
          :key="project.id"
          :project="project"
        />
      </div>

      <!-- Mobile: carousel -->
      <div class="sm:hidden">
        <ProjectCarousel :projects="projects" />
      </div>
    </div>
  </BasePanel>
</template>
