<script setup lang="ts">
import type { TreeListItemData } from '@astryx-vue/core/TreeList'
import { TreeList } from '@astryx-vue/core/TreeList'

function noop() {}

const items: TreeListItemData[] = [
  {
    id: 'src',
    label: 'src',
    isExpanded: true,
    icon: 'i-heroicons-folder',
    children: [
      { id: 'app', label: 'App.tsx', onClick: noop, icon: 'i-heroicons-document' },
      { id: 'index', label: 'index.tsx', onClick: noop, icon: 'i-heroicons-document' },
    ],
  },
  { id: 'pkg', label: 'package.json', onClick: noop, icon: 'i-heroicons-document' },
]
</script>

<template>
  <TreeList :items="items" />
</template>
