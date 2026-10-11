<script setup lang="ts">
import { OverflowList } from '@astryx-vue/core/OverflowList'

const items = [
  { href: '#home', iconClass: 'i-carbon-home', id: 'home', label: 'Home' },
  { href: '#files', iconClass: 'i-carbon-folder', id: 'files', label: 'Files' },
  { href: '#mail', iconClass: 'i-carbon-email', id: 'mail', label: 'Mail' },
  { href: '#people', iconClass: 'i-carbon-user', id: 'people', label: 'People' },
  { href: '#help', iconClass: 'i-carbon-help', id: 'help', label: 'Help' },
  { href: '#settings', iconClass: 'i-carbon-settings', id: 'settings', label: 'Settings' },
]
</script>

<template>
  <div class="nav-frame--narrow">
    <OverflowList :items="items" />
  </div>
</template>
