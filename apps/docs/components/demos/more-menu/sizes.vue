<script setup lang="ts">
import type { MoreMenuOption } from '@astryx-vue/core/MoreMenu'
import { MoreMenu } from '@astryx-vue/core/MoreMenu'

const items: MoreMenuOption[] = [
  { label: 'Edit' },
  { label: 'Duplicate' },
  { label: 'Delete', variant: 'destructive' },
]

const sizes = [
  { label: 'sm', size: 'sm' as const },
  { label: 'md', size: 'md' as const },
  { label: 'lg', size: 'lg' as const },
]
</script>

<template>
  <div class="more-menu-preview__sizes">
    <div v-for="item in sizes" :key="item.size" class="more-menu-preview__size">
      <span class="more-menu-preview__size-label">{{ item.label }}</span>
      <MoreMenu
        :items="items"
        is-inline
        is-menu-open
        :label="`${item.label} menu`"
        :size="item.size"
      />
    </div>
  </div>
</template>
