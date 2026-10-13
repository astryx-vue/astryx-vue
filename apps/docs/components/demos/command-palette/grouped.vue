<script setup lang="ts">
import { createStaticSource } from '@astryx-vue/core'
import { CommandPalette } from '@astryx-vue/core/CommandPalette'

const source = createStaticSource([
  { id: 'home', label: 'Home', auxiliaryData: { group: 'Navigation' } },
  { id: 'settings', label: 'Settings', auxiliaryData: { group: 'Navigation' } },
  { id: 'new-file', label: 'New File', auxiliaryData: { group: 'Actions' } },
  { id: 'save', label: 'Save', auxiliaryData: { group: 'Actions' } },
])
</script>

<template>
  <CommandPalette is-inline is-open :search-source="source" />
</template>
