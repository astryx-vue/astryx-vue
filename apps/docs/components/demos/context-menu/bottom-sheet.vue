<script setup lang="ts">
import type { ContextMenuOption } from '@astryx-vue/core/ContextMenu'
import { ContextMenu } from '@astryx-vue/core/ContextMenu'

const items: ContextMenuOption[] = [
  { label: 'Rename document', description: 'Change the title shown to collaborators.', icon: 'i-heroicons-pencil', onClick: () => {} },
  { label: 'Duplicate document', description: 'Create a copy in the same workspace.', icon: 'i-heroicons-document-duplicate', onClick: () => {} },
  { label: 'Share document', description: 'Invite people or copy a share link.', icon: 'i-heroicons-share', onClick: () => {} },
  { label: 'Delete document', description: 'Move this document to the trash.', icon: 'i-heroicons-trash', variant: 'destructive', onClick: () => {} },
]
</script>

<template>
  <ContextMenu presentation="bottom-sheet" label="Document actions" :items="items">
    <div style="display: flex; flex-direction: column; gap: 8px; padding: 32px; border: 1px solid #d1d5db; border-radius: 12px;">
      <strong>Quarterly plan</strong>
      <span>Long-press on touch or right-click for document actions.</span>
    </div>
  </ContextMenu>
</template>
