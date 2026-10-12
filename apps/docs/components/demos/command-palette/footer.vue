<script setup lang="ts">
import { createStaticSource } from '@astryx-vue/core'
import { CommandPalette, CommandPaletteFooter } from '@astryx-vue/core/CommandPalette'
import { Text } from '@astryx-vue/core/Text'

const source = createStaticSource([
  { id: 'home', label: 'Home' },
  { id: 'settings', label: 'Settings' },
])
</script>

<template>
  <CommandPalette is-inline is-open :search-source="source">
    <template #footer>
      <CommandPaletteFooter>
        <Text type="supporting">
          Pro tip: use ⌘K to open anywhere
        </Text>
      </CommandPaletteFooter>
    </template>
  </CommandPalette>
</template>
