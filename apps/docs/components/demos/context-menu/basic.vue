<script setup lang="ts">
import type { ContextMenuOption } from '@astryx-vue/core/ContextMenu'
import { Card } from '@astryx-vue/core/Card'
import { ContextMenu } from '@astryx-vue/core/ContextMenu'
import { Text } from '@astryx-vue/core/Text'
import { ref } from 'vue'

const LAST_ACTION_NONE = 'No action yet'

const lastAction = ref(LAST_ACTION_NONE)

const items: ContextMenuOption[] = [
  { label: 'Cut', icon: 'css-icon css-icon--sm i-carbon-cut' },
  { label: 'Copy', icon: 'css-icon css-icon--sm i-carbon-copy' },
  { label: 'Paste', isDisabled: true },
  { type: 'divider' },
  { type: 'section', title: 'Share', items: [{ label: 'Copy link' }, { label: 'Email' }] },
  { type: 'divider' },
  { label: 'Delete', variant: 'destructive' },
]

function onSelect(item: ContextMenuOption): void {
  if (item.type === undefined)
    lastAction.value = item.label
}
</script>

<template>
  <div class="context-menu-preview">
    <ContextMenu :items="items" label="Clipboard actions" @select="onSelect">
      <Card :padding="6">
        <Text as="div" color="secondary">
          Right-click this card.
        </Text>
      </Card>
    </ContextMenu>
    <p class="context-menu-preview__result">
      Last action: {{ lastAction }}
    </p>
  </div>
</template>
