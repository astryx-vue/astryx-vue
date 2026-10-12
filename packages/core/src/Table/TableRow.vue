<script setup lang="ts">
import type { TableRowProps } from './types.js'

defineOptions({ name: 'AstryxTableRow' })
defineProps<TableRowProps>()
</script>

<template>
  <tr :data-header-row="isHeaderRow || undefined">
    <slot />
  </tr>
</template>
