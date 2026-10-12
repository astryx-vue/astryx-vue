<script setup lang="ts">
import type { SearchableItem } from '@astryx-vue/core'
import { createStaticSource } from '@astryx-vue/core'
import { CommandPalette } from '@astryx-vue/core/CommandPalette'
import { Kbd } from '@astryx-vue/core/Kbd'
import { Text } from '@astryx-vue/core/Text'

interface RichCommand extends SearchableItem<{ group?: string, shortcut?: string }> {}

const commands: RichCommand[] = [
  { id: 'settings', label: 'Open Settings', auxiliaryData: { group: 'Navigation', shortcut: 'mod+,' } },
  { id: 'profile', label: 'View Profile', auxiliaryData: { group: 'Navigation' } },
  { id: 'new-file', label: 'Create New File', auxiliaryData: { group: 'Actions', shortcut: 'mod+n' } },
  { id: 'search', label: 'Search Files', auxiliaryData: { group: 'Actions', shortcut: 'mod+p' } },
]

const source = createStaticSource(commands)

function shortcut(item: { auxiliaryData?: unknown }): string | undefined {
  const data = item.auxiliaryData
  if (data != null && typeof data === 'object' && 'shortcut' in data && typeof data.shortcut === 'string')
    return data.shortcut
  return undefined
}
</script>

<template>
  <CommandPalette is-inline is-open :search-source="source">
    <template #item="{ item }">
      <Text type="body" style="flex: 1">
        {{ item.label }}
      </Text>
      <Kbd v-if="shortcut(item)" :keys="shortcut(item)!" />
    </template>
  </CommandPalette>
</template>
