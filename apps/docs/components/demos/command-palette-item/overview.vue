<script setup lang="ts">
import type { SearchableItem } from '@astryx-vue/core'
import { createStaticSource } from '@astryx-vue/core'
import { CommandPalette } from '@astryx-vue/core/CommandPalette'
import { Kbd } from '@astryx-vue/core/Kbd'
import { Text } from '@astryx-vue/core/Text'

interface ShortcutCommand extends SearchableItem<{ shortcut: string }> {}

const commands: ShortcutCommand[] = [
  { id: 'save-file', label: 'Save File', auxiliaryData: { shortcut: 'mod+s' } },
  { id: 'find-in-files', label: 'Find in Files', auxiliaryData: { shortcut: 'mod+shift+f' } },
  { id: 'command-palette', label: 'Command Palette', auxiliaryData: { shortcut: 'mod+shift+p' } },
  { id: 'toggle-terminal', label: 'Toggle Terminal', auxiliaryData: { shortcut: 'ctrl+`' } },
  { id: 'toggle-sidebar', label: 'Toggle Sidebar', auxiliaryData: { shortcut: 'mod+b' } },
]

const source = createStaticSource(commands)
</script>

<template>
  <CommandPalette is-inline is-open :search-source="source">
    <template #item="{ item }">
      <Text type="body" style="flex: 1">
        {{ item.label }}
      </Text>
      <Kbd v-if="item.auxiliaryData" :keys="item.auxiliaryData.shortcut" />
    </template>
  </CommandPalette>
</template>
