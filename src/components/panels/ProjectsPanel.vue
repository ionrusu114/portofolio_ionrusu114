<script setup lang="ts">
import BasePanel from '@/components/ui/BasePanel.vue'
import ProjectCardSection from '@/components/sections/ProjectCardSection.vue'
import ProjectCarousel from '@/components/sections/ProjectCarousel.vue'
import { projects } from '@/data/projects'
</script>

<template>
  <BasePanel id="projects">
    <div class="flex flex-col gap-4 py-4
                md:h-full md:justify-center md:gap-8 md:py-8">
      <div>
        <p class="mb-2 font-mono text-xs uppercase tracking-widest text-accent">
          // projects
        </p>
        <h2 class="heading-2">Selected Work</h2>
      </div>

      <!-- Mobile: vertical stack (scrolls within panel) -->
      <div class="flex flex-col gap-3 md:hidden">
        <ProjectCardSection
          v-for="project in projects"
          :key="project.id"
          :project="project"
        />
      </div>

      <!-- Tablet: carousel -->
      <div class="hidden md:hidden sm:block">
        <ProjectCarousel :projects="projects" />
      </div>

      <!-- Desktop: grid -->
      <div class="hidden gap-4 md:grid md:grid-cols-2 lg:grid-cols-3">
        <ProjectCardSection
          v-for="project in projects"
          :key="project.id"
          :project="project"
        />
      </div>
    </div>
  </BasePanel>
</template>
