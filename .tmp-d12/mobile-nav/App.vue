<script setup lang="ts">
import { ref } from 'vue'
import AppShell from '../../packages/core/src/AppShell/AppShell.vue'
import Dialog from '../../packages/core/src/Dialog/Dialog.vue'
import DialogHeader from '../../packages/core/src/Dialog/DialogHeader.vue'
import TopNavMenu from '../../packages/core/src/TopNav/TopNavMenu.vue'

const dialogOpen = ref(false)
const items = [{ id: 'analytics', label: 'Analytics', href: '#analytics' }]
</script>

<template>
  <AppShell :mobile-nav="{ breakpoint: 'md' }" content-padding="4">
    <template #sideNav>
      <nav aria-label="Sections">
        <a data-home-link href="#home">Home</a>
        <TopNavMenu label="Products" :items="items" />
      </nav>
    </template>
    <button id="dialog-opener" type="button" @click="dialogOpen = true">
      Open dialog
    </button>
    <Dialog :is-open="dialogOpen" @open-change="dialogOpen = $event">
      <template v-if="dialogOpen">
        <DialogHeader
          title="Review"
          has-close-button
          @open-change="dialogOpen = $event"
        />
        <p>Dialog body</p>
      </template>
    </Dialog>
  </AppShell>
</template>
