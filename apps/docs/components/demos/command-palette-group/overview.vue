<script setup lang="ts">
import { createStaticSource } from '@astryx-vue/core'
import { CommandPalette } from '@astryx-vue/core/CommandPalette'

const source = createStaticSource([
  { id: 'index', label: 'index.tsx', auxiliaryData: { group: 'Recent Files' } },
  { id: 'app', label: 'App.tsx', auxiliaryData: { group: 'Recent Files' } },
  { id: 'settings', label: 'Open Settings', auxiliaryData: { group: 'Commands' } },
  { id: 'terminal', label: 'Toggle Terminal', auxiliaryData: { group: 'Commands' } },
  { id: 'theme', label: 'Color Theme', auxiliaryData: { group: 'Preferences' } },
  { id: 'font', label: 'Font Size', auxiliaryData: { group: 'Preferences' } },
])
</script>

<template>
  <CommandPalette is-inline is-open :search-source="source" />
</template>
