<script setup lang="ts">
import BaseTag from '@/components/ui/BaseTag.vue'
import type { ProjectDetail } from '@/types'

const { project } = defineProps<{
  project: ProjectDetail
}>()
</script>

<template>
  <article
    class="card flex flex-col gap-4 p-5"
    :class="{ 'border-accent-dark': project.featured }"
  >
    <div class="flex items-start justify-between">
      <div>
        <h3 class="heading-3">{{ project.title }}</h3>
        <span
          v-if="project.featured"
          class="mt-1 inline-block rounded-full bg-accent-dark px-2 py-0.5
                 font-mono text-xs text-accent"
        >
          Featured
        </span>
      </div>
      <a
        v-if="project.liveUrl"
        :href="project.liveUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center gap-1 text-sm text-accent transition-opacity
               hover:opacity-80 cursor-pointer"
      >
        Live
        <VIcon name="bi-arrow-up-right" scale="0.7" />
      </a>
    </div>

    <p class="text-sm leading-relaxed text-text-secondary">
      {{ project.description }}
    </p>

    <ul class="flex flex-col gap-1">
      <li
        v-for="highlight in project.highlights"
        :key="highlight"
        class="flex items-center gap-2 text-sm text-text-primary"
      >
        <span class="h-1 w-1 rounded-full bg-accent" />
        {{ highlight }}
      </li>
    </ul>

    <div class="mt-auto flex flex-wrap gap-1.5 pt-2">
      <BaseTag
        v-for="tag in project.tags"
        :key="tag"
        :label="tag"
      />
    </div>
  </article>
</template>
