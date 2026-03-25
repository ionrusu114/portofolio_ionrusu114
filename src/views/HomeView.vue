<script setup lang="ts">
import { useHead } from '@unhead/vue'
import TheHorizontalScroller from '@/components/layout/TheHorizontalScroller.vue'
import TheNavMenu from '@/components/layout/TheNavMenu.vue'
import TheBackgroundCanvas from '@/components/three/TheBackgroundCanvas.vue'
import HeroPanel from '@/components/panels/HeroPanel.vue'
import AboutPanel from '@/components/panels/AboutPanel.vue'
import ProjectsPanel from '@/components/panels/ProjectsPanel.vue'
import GetOfferPanel from '@/components/panels/GetOfferPanel.vue'
import ContactPanel from '@/components/panels/ContactPanel.vue'

useHead({
  title: 'Ion Rusu — Web Architect & Developer',
  meta: [
    { name: 'description', content: 'Ion Rusu — Web Architect & Full-Stack Developer. Building scalable web applications with Vue.js, Nuxt, FastAPI, PostgreSQL, Docker, and Kubernetes.' },
  ],
})
</script>

<template>
  <TheHorizontalScroller>
    <HeroPanel />
    <AboutPanel />
    <ProjectsPanel />
    <GetOfferPanel />
    <ContactPanel />
    <TheBackgroundCanvas />
    <TheNavMenu />
  </TheHorizontalScroller>
</template>
