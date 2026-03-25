<script setup lang="ts">
import TheHorizontalScroller from '@/components/layout/TheHorizontalScroller.vue'
import TheNavMenu from '@/components/layout/TheNavMenu.vue'
import TheBackgroundCanvas from '@/components/three/TheBackgroundCanvas.vue'
import HeroPanel from '@/components/panels/HeroPanel.vue'
import AboutPanel from '@/components/panels/AboutPanel.vue'
import ProjectsPanel from '@/components/panels/ProjectsPanel.vue'
import GetOfferPanel from '@/components/panels/GetOfferPanel.vue'
import ContactPanel from '@/components/panels/ContactPanel.vue'
</script>

<template>
  <TheBackgroundCanvas />

  <TheHorizontalScroller>
    <HeroPanel />
    <AboutPanel />
    <ProjectsPanel />
    <GetOfferPanel />
    <ContactPanel />
  </TheHorizontalScroller>

  <TheNavMenu />
</template>
