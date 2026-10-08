<script setup lang="ts">
import type { MoreMenuOption } from '@astryx-vue/core/MoreMenu'
import { MoreMenu } from '@astryx-vue/core/MoreMenu'

const items: MoreMenuOption[] = [
  { label: 'Rename', icon: 'css-icon css-icon--sm i-carbon-tools', endContent: '⌘R' },
  { label: 'Duplicate', icon: 'css-icon css-icon--sm i-carbon-copy', endContent: '⌘D' },
  { type: 'divider' },
  {
    type: 'section',
    id: 'share',
    title: 'Share',
    items: [
      { label: 'Copy link', icon: 'css-icon css-icon--sm i-carbon-copy' },
      { label: 'Publish to the web', description: 'Available on the team plan', isDisabled: true },
    ],
  },
  { type: 'divider' },
  { label: 'Move to trash', variant: 'destructive' },
]
</script>

<template>
  <div class="more-menu-preview__stack">
    <MoreMenu :items="items" label="File actions" />
  </div>
</template>
