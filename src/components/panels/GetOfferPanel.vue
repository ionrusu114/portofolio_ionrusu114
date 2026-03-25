<script setup lang="ts">
import BasePanel from '@/components/ui/BasePanel.vue'
import ChatInterfaceSection from '@/components/sections/ChatInterfaceSection.vue'
</script>

<template>
  <BasePanel id="get-offer">
    <div class="flex flex-col gap-4 py-4 md:h-full sm:gap-6 sm:py-6 lg:py-8">
      <div>
        <p class="mb-2 font-mono text-xs uppercase tracking-widest text-accent">
          // get offer
        </p>
        <h2 class="heading-2">Let's Build Something</h2>
      </div>

      <ChatInterfaceSection class="min-h-0 flex-1 max-h-[70dvh] md:max-h-none" />
    </div>
  </BasePanel>
</template>
