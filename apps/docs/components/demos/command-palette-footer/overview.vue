<script setup lang="ts">
import { createStaticSource } from '@astryx-vue/core'
import { CommandPalette, CommandPaletteFooter } from '@astryx-vue/core/CommandPalette'
import { Text } from '@astryx-vue/core/Text'

const source = createStaticSource([
  { id: 'new-file', label: 'New File' },
  { id: 'open-recent', label: 'Open Recent' },
  { id: 'save-all', label: 'Save All' },
])
</script>

<template>
  <CommandPalette is-inline is-open :search-source="source">
    <template #footer>
      <CommandPaletteFooter>
        <Text type="supporting">
          Tip: Press ⌘K anywhere to open the command palette
        </Text>
      </CommandPaletteFooter>
    </template>
  </CommandPalette>
</template>
