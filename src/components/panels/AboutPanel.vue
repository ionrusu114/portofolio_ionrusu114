<script setup lang="ts">
import BasePanel from '@/components/ui/BasePanel.vue'
import SkillsSection from '@/components/sections/SkillsSection.vue'
import { personal } from '@/data/personal'
</script>

<template>
  <BasePanel id="about">
    <div class="flex h-full flex-col justify-center gap-4 py-4 overflow-y-auto
                sm:gap-6 sm:py-6
                lg:flex-row lg:items-center lg:gap-16 lg:overflow-y-visible lg:py-8">
      <!-- Left: Profile -->
      <div class="flex flex-col gap-4 sm:gap-6 lg:w-1/2">
        <div>
          <p class="mb-2 font-mono text-xs uppercase tracking-widest text-accent">
            // about me
          </p>
          <h2 class="heading-2">
            Building solutions<br />from A to Z
          </h2>
        </div>

        <p class="max-w-prose text-base leading-relaxed text-text-secondary">
          {{ personal.bio }}
        </p>

        <!-- Capabilities -->
        <div class="grid grid-cols-2 gap-2 text-xs sm:gap-3 sm:text-sm">
          <div class="flex items-center gap-2 text-text-secondary">
            <VIcon name="bi-code-slash" scale="0.9" class="text-accent" />
            Custom Web Apps
          </div>
          <div class="flex items-center gap-2 text-text-secondary">
            <VIcon name="bi-globe" scale="0.9" class="text-accent" />
            Full-Stack Solutions
          </div>
          <div class="flex items-center gap-2 text-text-secondary">
            <VIcon name="bi-chat" scale="0.9" class="text-accent" />
            Bots & Automation
          </div>
          <div class="flex items-center gap-2 text-text-secondary">
            <VIcon name="bi-clipboard" scale="0.9" class="text-accent" />
            DevOps & Consulting
          </div>
        </div>

        <!-- Education & Languages -->
        <div class="flex flex-col gap-3 border-t border-border pt-3 text-xs sm:gap-4 sm:pt-4 sm:text-sm">
          <div>
            <span class="font-mono text-xs uppercase text-text-muted">// education</span>
            <p class="mt-1 text-text-secondary">
              {{ personal.education.degree }}
            </p>
            <p class="text-text-muted">
              {{ personal.education.university }} ({{ personal.education.years }})
            </p>
          </div>
          <div>
            <span class="font-mono text-xs uppercase text-text-muted">// languages</span>
            <div class="mt-1 flex flex-wrap gap-3">
              <span
                v-for="lang in personal.languages"
                :key="lang.name"
                class="text-text-secondary"
              >
                {{ lang.name }}
                <span class="text-text-muted">({{ lang.level }})</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Skills -->
      <div class="lg:w-1/2">
        <p class="mb-4 font-mono text-xs uppercase tracking-widest text-accent">
          // tech stack
        </p>
        <SkillsSection />
      </div>
    </div>
  </BasePanel>
</template>
