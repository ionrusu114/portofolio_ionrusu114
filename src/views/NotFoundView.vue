<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goHome(): void {
  router.push({ name: 'home' })
}
</script>

<template>
  <main class="flex min-h-screen flex-col items-center justify-center px-4">
    <h1 class="heading-1">404</h1>
    <p class="mt-4 text-lg text-text-secondary">Page not found</p>
    <button class="btn-primary mt-8" @click="goHome">
      Go Home
    </button>
  </main>
</template>
