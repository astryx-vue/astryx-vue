<script setup lang="ts">
import type { TreeListItemData } from '@astryx-vue/core/TreeList'
import { TreeList } from '@astryx-vue/core/TreeList'

function noop() {}

const items: TreeListItemData[] = [
  {
    id: 'src',
    label: 'src',
    isExpanded: true,
    children: [
      {
        id: 'components',
        label: 'components',
        children: [
          { id: 'button', label: 'Button.tsx', onClick: noop },
          { id: 'card', label: 'Card.tsx', onClick: noop },
          { id: 'list', label: 'List.tsx', onClick: noop },
        ],
      },
      { id: 'app', label: 'App.tsx', onClick: noop },
      { id: 'index', label: 'index.tsx', onClick: noop },
    ],
  },
  {
    id: 'public',
    label: 'public',
    children: [
      { id: 'favicon', label: 'favicon.ico', onClick: noop },
      { id: 'index-html', label: 'index.html', onClick: noop },
    ],
  },
  { id: 'pkg', label: 'package.json', onClick: noop },
  { id: 'readme', label: 'README.md', onClick: noop },
]
</script>

<template>
  <TreeList :items="items" />
</template>
