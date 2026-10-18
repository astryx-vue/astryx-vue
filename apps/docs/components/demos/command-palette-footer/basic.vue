<script setup lang="ts">
import { createStaticSource } from '@astryx-vue/core'
import { CommandPalette, CommandPaletteFooter } from '@astryx-vue/core/CommandPalette'

const source = createStaticSource([
  { id: 'new-file', label: 'New File' },
  { id: 'open-recent', label: 'Open Recent' },
  { id: 'save-all', label: 'Save All' },
])
</script>

<template>
  <CommandPalette is-inline is-open :search-source="source">
    <template #footer>
      <CommandPaletteFooter />
    </template>
  </CommandPalette>
</template>
