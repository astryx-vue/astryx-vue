<script setup lang="ts">
import type { ContextMenuOption } from '@astryx-vue/core/ContextMenu'
import { ContextMenu } from '@astryx-vue/core/ContextMenu'

const items: ContextMenuOption[] = [
  { label: 'Cut', onClick: () => {} },
  { label: 'Copy', onClick: () => {} },
  { label: 'Paste', onClick: () => {} },
  { type: 'divider' },
  { label: 'Delete', onClick: () => {} },
]
</script>

<template>
  <ContextMenu presentation="adaptive" :items="items">
    <div
      style="padding: 48px; border-width: 2px; border-style: dashed; border-color: #d1d5db; border-radius: 8px; text-align: center; color: #6b7280; user-select: none;"
    >
      Long-press or right-click this area
    </div>
  </ContextMenu>
</template>
