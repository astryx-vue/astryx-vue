<script setup lang="ts">
import type { TableCellProps } from './types.js'

defineOptions({ name: 'AstryxTableCell' })
defineProps<TableCellProps>()
</script>

<template>
  <td :data-align="align" :colspan="colSpan" :rowspan="rowSpan" :headers="headers">
    <slot />
  </td>
</template>
