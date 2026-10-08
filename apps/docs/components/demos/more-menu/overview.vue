<script setup lang="ts">
import type { MoreMenuOption } from '@astryx-vue/core/MoreMenu'
import { MoreMenu } from '@astryx-vue/core/MoreMenu'

const items: MoreMenuOption[] = [
  { label: 'Edit' },
  { label: 'Duplicate' },
  { label: 'Share', icon: 'css-icon css-icon--sm i-carbon-upload' },
  { type: 'divider' },
  { label: 'Delete', variant: 'destructive' },
]
</script>

<template>
  <div class="more-menu-preview__inline">
    <MoreMenu
      :items="items"
      is-inline
      is-menu-open
      label="Project actions"
    />
  </div>
</template>
