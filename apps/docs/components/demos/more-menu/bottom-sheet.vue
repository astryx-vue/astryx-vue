<script setup lang="ts">
import type { MoreMenuOption } from '@astryx-vue/core/MoreMenu'
import { MoreMenu } from '@astryx-vue/core/MoreMenu'

const items: MoreMenuOption[] = [
  { label: 'Rename project', description: 'Update the project title.', icon: 'i-heroicons-pencil', onClick: () => {} },
  { label: 'Duplicate project', description: 'Create a copy in this workspace.', icon: 'i-heroicons-document-duplicate', onClick: () => {} },
  { label: 'Share project', description: 'Invite people to collaborate.', icon: 'i-heroicons-share', onClick: () => {} },
  { label: 'Delete project', description: 'Move this project to the trash.', icon: 'i-heroicons-trash', variant: 'destructive', onClick: () => {} },
]
</script>

<template>
  <div style="display: flex; align-items: center; justify-content: space-between; gap: 16px; width: min(100%, 360px); padding: 16px; border: 1px solid #d1d5db; border-radius: 12px;">
    <div style="display: flex; flex-direction: column; gap: 4px;">
      <strong>Quarterly plan</strong>
      <span>Updated a few minutes ago</span>
    </div>
    <MoreMenu presentation="bottom-sheet" label="Project actions" :items="items" />
  </div>
</template>
