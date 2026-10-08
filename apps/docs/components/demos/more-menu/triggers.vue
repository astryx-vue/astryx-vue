<script setup lang="ts">
import type { MoreMenuOption } from '@astryx-vue/core/MoreMenu'
import { MoreMenu } from '@astryx-vue/core/MoreMenu'

const items: MoreMenuOption[] = [
  { label: 'Edit' },
  { label: 'Duplicate' },
]
</script>

<template>
  <div class="more-menu-preview__row">
    <MoreMenu :items="items" label="Small" size="sm" />
    <MoreMenu :items="items" label="Medium" size="md" />
    <MoreMenu :items="items" label="Large" size="lg" />
    <MoreMenu :items="items" label="Outlined trigger" variant="secondary" />
    <MoreMenu :items="items" disabled label="Unavailable actions" />
    <MoreMenu :items="items" label="Filter actions">
      <template #icon>
        <span class="css-icon i-carbon-filter" />
      </template>
    </MoreMenu>
    <MoreMenu :items="items" label="Touch actions" presentation="adaptive" />
  </div>
</template>
