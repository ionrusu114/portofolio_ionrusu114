<script setup lang="ts">
import { computed } from 'vue'
import BaseTag from '@/components/ui/BaseTag.vue'
import { skills } from '@/data/skills'
import type { SkillCategory } from '@/types'

const categories: { key: SkillCategory; label: string }[] = [
  { key: 'frontend', label: 'Frontend' },
  { key: 'backend', label: 'Backend' },
  { key: 'devops', label: 'DevOps' },
]

const groupedSkills = computed(() =>
  categories.map((cat) => ({
    ...cat,
    items: skills.filter((s) => s.category === cat.key),
  })),
)
</script>

<template>
  <div class="flex flex-col gap-6">
    <div v-for="group in groupedSkills" :key="group.key">
      <h4 class="mb-3 font-mono text-xs uppercase tracking-widest text-text-muted">
        // {{ group.label }}
      </h4>
      <div class="flex flex-wrap gap-2">
        <BaseTag
          v-for="skill in group.items"
          :key="skill.name"
          :label="skill.name"
          :icon="skill.icon"
        />
      </div>
    </div>
  </div>
</template>
