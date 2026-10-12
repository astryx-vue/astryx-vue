<script setup lang="ts">
import type { TreeListItemData } from '@astryx-vue/core/TreeList'
import { TreeList } from '@astryx-vue/core/TreeList'

function noop() {}

const items: TreeListItemData[] = [
  {
    id: 'inbox',
    label: 'Inbox',
    isExpanded: true,
    badge: '3',
    children: [
      { id: 'unread', label: 'Unread', onClick: noop, badge: '3' },
      { id: 'starred', label: 'Starred', onClick: noop },
    ],
  },
  { id: 'sent', label: 'Sent', onClick: noop },
  { id: 'drafts', label: 'Drafts', onClick: noop, badge: '1' },
]
</script>

<template>
  <TreeList :items="items" />
</template>
