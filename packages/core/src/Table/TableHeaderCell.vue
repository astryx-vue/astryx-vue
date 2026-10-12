<script setup lang="ts">
import type { TableCellProps } from './types.js'

defineOptions({ name: 'AstryxTableHeaderCell' })
defineProps<TableCellProps>()
</script>

<template>
  <th scope="col" :data-align="align" :colspan="colSpan" :rowspan="rowSpan">
    <slot />
  </th>
</template>
