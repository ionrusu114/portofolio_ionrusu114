<script setup lang="ts">
import BasePanel from '@/components/ui/BasePanel.vue'
import ChatInterfaceSection from '@/components/sections/ChatInterfaceSection.vue'
</script>

<template>
  <BasePanel id="get-offer">
    <div class="flex h-full flex-col gap-6 py-4 sm:py-6 lg:py-8">
      <div>
        <p class="mb-2 font-mono text-xs uppercase tracking-widest text-accent">
          // get offer
        </p>
        <h2 class="heading-2">Let's Build Something</h2>
      </div>

      <ChatInterfaceSection class="min-h-0 flex-1" />
    </div>
  </BasePanel>
</template>
