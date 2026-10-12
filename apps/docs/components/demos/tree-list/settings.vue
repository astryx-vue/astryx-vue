<script setup lang="ts">
import type { TreeListItemData } from '@astryx-vue/core/TreeList'
import { TreeList } from '@astryx-vue/core/TreeList'

function noop() {}

const items: TreeListItemData[] = [
  {
    id: 'settings',
    label: 'Settings',
    isExpanded: true,
    icon: 'i-carbon-settings',
    children: [
      { id: 'general', label: 'General', onClick: noop },
      { id: 'advanced', label: 'Advanced', onClick: noop },
    ],
  },
  {
    id: 'docs',
    label: 'Documentation',
    href: '#',
    endIcon: 'i-carbon-chevron-right',
  },
]
</script>

<template>
  <TreeList :items="items" />
</template>
