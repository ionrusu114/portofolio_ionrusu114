<script setup lang="ts">
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <div class="relative">
      <!-- Logo mark -->
      <div
        class="flex h-20 w-20 items-center justify-center rounded-2xl
               border border-accent bg-accent-dark"
      >
        <span class="font-heading text-3xl font-medium text-accent">IR</span>
      </div>
      <!-- Glow ring -->
      <div
        class="absolute -inset-2 -z-10 rounded-3xl opacity-50"
        style="box-shadow: 0 0 30px rgba(0, 255, 136, 0.3), 0 0 60px rgba(0, 255, 136, 0.1)"
      />
    </div>
  </div>
</template>
