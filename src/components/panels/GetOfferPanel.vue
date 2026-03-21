<script setup lang="ts">
import BasePanel from '@/components/ui/BasePanel.vue'
import ChatInterfaceSection from '@/components/sections/ChatInterfaceSection.vue'
import BudgetSelectorSection from '@/components/sections/BudgetSelectorSection.vue'
import TimelineSelectorSection from '@/components/sections/TimelineSelectorSection.vue'
</script>

<template>
  <BasePanel id="get-offer">
    <div class="flex h-full flex-col justify-center gap-8 py-8">
      <div>
        <p class="mb-2 font-mono text-xs uppercase tracking-widest text-accent">
          // get offer
        </p>
        <h2 class="heading-2">Let's Build Something</h2>
      </div>

      <div class="grid h-[60vh] grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <!-- Chat interface -->
        <ChatInterfaceSection />

        <!-- Sidebar: Budget + Timeline -->
        <div class="flex flex-col gap-6">
          <BudgetSelectorSection />
          <TimelineSelectorSection />
        </div>
      </div>
    </div>
  </BasePanel>
</template>
