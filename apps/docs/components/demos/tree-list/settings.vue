<script setup lang="ts">
import type { TreeListItemData } from '@astryx-vue/core/TreeList'
import { TreeList } from '@astryx-vue/core/TreeList'

function noop() {}

const items: TreeListItemData[] = [
  {
    id: 'settings',
    label: 'Settings',
    isExpanded: true,
    icon: 'i-heroicons-cog-6-tooth',
    children: [
      { id: 'general', label: 'General', onClick: noop },
      { id: 'advanced', label: 'Advanced', onClick: noop },
    ],
  },
  {
    id: 'docs',
    label: 'Documentation',
    href: '#',
    endIcon: 'i-heroicons-chevron-right',
  },
]
</script>

<template>
  <TreeList :items="items" />
</template>
