<script setup lang="ts">
import type { MoreMenuOption } from '@astryx-vue/core/MoreMenu'
import { MoreMenu } from '@astryx-vue/core/MoreMenu'

const items: MoreMenuOption[] = [
  {
    type: 'section',
    title: 'Actions',
    items: [
      { label: 'Edit', icon: 'i-heroicons-pencil', onClick: () => {} },
      { label: 'Duplicate', icon: 'i-heroicons-document-duplicate', onClick: () => {} },
    ],
  },
  {
    type: 'section',
    title: 'Danger zone',
    items: [{ label: 'Delete', icon: 'i-heroicons-trash', onClick: () => {} }],
  },
]
</script>

<template>
  <MoreMenu variant="secondary" label="Document actions" :items="items" />
</template>
