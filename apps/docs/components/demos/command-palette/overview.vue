<script setup lang="ts">
import { createStaticSource } from '@astryx-vue/core'
import { CommandPalette } from '@astryx-vue/core/CommandPalette'

const source = createStaticSource([
  { id: 'home', label: 'Home' },
  { id: 'settings', label: 'Settings' },
  { id: 'profile', label: 'Profile' },
])
</script>

<template>
  <CommandPalette is-inline is-open :search-source="source" width="100%" />
</template>
