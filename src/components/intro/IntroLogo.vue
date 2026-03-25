<script setup lang="ts">
import The3DLogo from '@/components/ui/The3DLogo.vue'
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <div class="relative">
      <The3DLogo
        src="/images/logo.png"
        :depth="8"
        class="h-24 w-48 sm:h-32 sm:w-64"
      />
      <!-- Glow ring -->
      <div
        class="absolute -inset-4 -z-10 rounded-3xl opacity-50"
        style="box-shadow: 0 0 30px rgba(0, 255, 136, 0.3), 0 0 60px rgba(0, 255, 136, 0.1)"
      />
    </div>
  </div>
</template>
