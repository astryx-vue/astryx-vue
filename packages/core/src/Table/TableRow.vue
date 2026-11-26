<script setup lang="ts">
import type { TableRowProps } from './types.js'
import { useTableRowStriped } from './tableRowPlacement.js'

defineOptions({ name: 'AstryxTableRow' })
const props = defineProps<TableRowProps>()
const isStriped = useTableRowStriped(() => props.isHeaderRow === true)
</script>

<template>
  <tr
    class="astryx-table-row"
    :data-header-row="isHeaderRow || undefined"
    :data-striped="isStriped() ? 'striped' : undefined"
  >
    <slot />
  </tr>
</template>
