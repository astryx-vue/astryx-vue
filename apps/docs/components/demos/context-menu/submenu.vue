<script setup lang="ts">
import type { ContextMenuOption } from '@astryx-vue/core/ContextMenu'
import { Card } from '@astryx-vue/core/Card'
import { ContextMenu } from '@astryx-vue/core/ContextMenu'
import { Text } from '@astryx-vue/core/Text'
import { ref } from 'vue'

const items: ContextMenuOption[] = [
  { label: 'Open', icon: 'css-icon css-icon--sm i-carbon-launch' },
  { label: 'Copy address', icon: 'css-icon css-icon--sm i-carbon-copy' },
  { type: 'divider' },
  {
    label: 'Move to',
    items: [
      { label: 'Inbox' },
      { label: 'Archive' },
      { label: 'Later', items: [{ label: 'Tomorrow' }, { label: 'Next week' }] },
    ],
  },
  { label: 'Labels', items: [{ label: 'Design' }, { label: 'Engineering' }] },
]

const lastMove = ref('Nowhere yet')

function onSelect(item: ContextMenuOption): void {
  if (item.type === undefined)
    lastMove.value = item.label
}
</script>

<template>
  <div class="context-menu-preview">
    <ContextMenu :items="items" label="Message actions" @select="onSelect">
      <Card :padding="6">
        <Text as="div" color="secondary">
          Right-click this card, then open a nested menu with the arrow keys or by hovering it.
        </Text>
      </Card>
    </ContextMenu>
    <p class="context-menu-preview__result">
      Last action: {{ lastMove }}
    </p>
  </div>
</template>
