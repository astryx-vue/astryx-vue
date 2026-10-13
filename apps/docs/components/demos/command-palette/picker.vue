<script setup lang="ts">
import { createStaticSource } from '@astryx-vue/core'
import { CommandPalette } from '@astryx-vue/core/CommandPalette'
import { Text } from '@astryx-vue/core/Text'
import { ref } from 'vue'

const theme = ref('light')
const source = createStaticSource([
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
  { id: 'system', label: 'System' },
])
</script>

<template>
  <CommandPalette v-model:value="theme" is-inline is-open :search-source="source">
    <template #item="{ item, isSelected }">
      <Text type="body" style="flex: 1">
        {{ item.label }}
      </Text>
      <span v-if="isSelected" class="css-icon css-icon--sm i-carbon-checkmark" aria-hidden="true" />
    </template>
  </CommandPalette>
</template>
