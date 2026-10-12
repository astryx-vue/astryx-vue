<script setup lang="ts">
import type { TreeListItemData } from '@astryx-vue/core/TreeList'
import { TreeList } from '@astryx-vue/core/TreeList'

function noop() {}

const items: TreeListItemData[] = [
  {
    id: 'nav',
    label: 'Navigation',
    isExpanded: true,
    children: [
      { id: 'home', label: 'Home', onClick: noop },
      { id: 'about', label: 'About', onClick: noop, isSelected: true },
      { id: 'contact', label: 'Contact', onClick: noop },
    ],
  },
]
</script>

<template>
  <TreeList :items="items" />
</template>
