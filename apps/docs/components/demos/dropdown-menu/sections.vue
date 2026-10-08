<script setup lang="ts">
import type { DropdownMenuOption } from '@astryx-vue/core/DropdownMenu'
import { DropdownMenu } from '@astryx-vue/core/DropdownMenu'
import { ref } from 'vue'

const lastAction = ref('No action yet')

function run(label: string): () => void {
  return () => {
    lastAction.value = label
  }
}

const items: DropdownMenuOption[] = [
  {
    type: 'section',
    title: 'This project',
    items: [
      { label: 'Edit project', icon: 'css-icon css-icon--sm i-carbon-tools', onClick: run('Edit project') },
      { label: 'Duplicate project', icon: 'css-icon css-icon--sm i-carbon-copy', onClick: run('Duplicate project') },
    ],
  },
  { type: 'divider' },
  {
    type: 'section',
    title: 'Danger zone',
    items: [
      {
        label: 'Move to archive',
        description: 'Hidden from everyone else',
        icon: 'css-icon css-icon--sm i-carbon-view-off',
        onClick: run('Move to archive'),
      },
      { label: 'Delete project', icon: 'css-icon css-icon--sm i-carbon-trash-can', variant: 'destructive', onClick: run('Delete project') },
    ],
  },
]
</script>

<template>
  <div class="dropdown-menu-preview">
    <DropdownMenu :button="{ label: 'Project actions' }" :items="items" />
    <p class="dropdown-menu-preview__note">
      Last action: {{ lastAction }}
    </p>
  </div>
</template>
