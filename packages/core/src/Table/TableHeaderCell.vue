<script setup lang="ts">
import type { TableCellProps } from './types.js'
import CutTextTooltip from '../Text/CutTextTooltip.vue'
import { useHeaderCutText } from './useHeaderCutText.js'

defineOptions({ name: 'AstryxTableHeaderCell' })
defineProps<TableCellProps>()

const headerCutText = useHeaderCutText()
</script>

<template>
  <th
    scope="col"
    :data-align="align"
    :colspan="colSpan"
    :rowspan="rowSpan"
    @focusin="headerCutText.onFocusin"
    @focusout="headerCutText.onFocusout"
    @pointerdown="headerCutText.onPointerdown"
    @keydown="headerCutText.onKeydown"
  >
    <slot />
    <CutTextTooltip
      v-if="headerCutText.cutText.value != null"
      :anchor="headerCutText.cell.value"
      :text="headerCutText.cutText.value"
    />
  </th>
</template>
