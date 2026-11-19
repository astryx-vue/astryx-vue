<script setup lang="ts">
import type { ContextMenuOption } from '@astryx-vue/core/ContextMenu'
import { ContextMenu } from '@astryx-vue/core/ContextMenu'

const items: ContextMenuOption[] = [
  { label: 'Cut', onClick: () => {} },
  { label: 'Copy', onClick: () => {} },
  { label: 'Paste', onClick: () => {} },
]
</script>

<template>
  <ContextMenu presentation="adaptive" :items="items">
    <div class="context-menu-overview__area">
      Long-press or right-click this area
    </div>
  </ContextMenu>
</template>

<style scoped>
.context-menu-overview__area {
  padding: 48px;
  border: 2px dashed var(--astryx-color-border-emphasized);
  border-radius: 8px;
  color: var(--astryx-color-text-secondary);
  text-align: center;
  user-select: none;
}
</style>
