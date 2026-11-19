<script setup lang="ts">
import type { MoreMenuOption } from '@astryx-vue/core/MoreMenu'
import { MoreMenu } from '@astryx-vue/core/MoreMenu'

const items: MoreMenuOption[] = [
  { label: 'Edit' },
  { label: 'Duplicate' },
  { label: 'Delete' },
]
</script>

<template>
  <MoreMenu :items="items" />
</template>
