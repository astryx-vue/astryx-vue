<script setup lang="ts" generic="T extends Record<string, unknown>">
import type { TableColumn, TablePlugin, TableProps, TableSlots } from './types.js'
import { computed, provide } from 'vue'
import { useComponentMessages } from '../locale/context.js'
import { tableMessages } from '../locale/messages/table.js'
import TableData from './TableData.vue'
import { TABLE_SECTION_KEY, TABLE_STRIPED_KEY } from './tableRowPlacement.js'
import TableScroll from './TableScroll.vue'
import '../../styles/table.css'

defineOptions({ name: 'AstryxTable', inheritAttrs: false })

const props = withDefaults(defineProps<TableProps<T>>(), {
  idKey: 'id',
  density: 'balanced',
  dividers: 'rows',
  isStriped: false,
  hasHover: false,
  verticalAlign: 'middle',
  textOverflow: 'wrap',
})

defineSlots<TableSlots>()

const messages = useComponentMessages({ table: tableMessages })
const passedIdKey = computed(() => {
  const key = props.idKey
  if (typeof key === 'function')
    return (row: Record<string, unknown>) => key(row as T)
  return key
})
const plugins = computed(() => Object.values(props.plugins ?? {}).filter((plugin): plugin is TablePlugin<T> => plugin != null))
const dataMode = computed(() => props.data != null)
const columns = computed(() => (props.columns ?? []) as TableColumn[])

// 嵌在别的表格格子里的表格从自己这里重新开始，不沿用外层的斑马纹和区块。
provide(TABLE_STRIPED_KEY, () => props.isStriped)
provide(TABLE_SECTION_KEY, null)
</script>

<template>
  <TableData
    v-if="dataMode"
    :class="$attrs.class"
    :style="$attrs.style"
    :rows="data ?? []"
    :columns="columns"
    :plugins="plugins as TablePlugin[]"
    :id-key="passedIdKey"
    :label="label ?? messages.table.label"
    :density="density"
    :dividers="dividers"
    :is-striped="isStriped"
    :has-hover="hasHover"
    :text-overflow="textOverflow"
    :vertical-align="verticalAlign"
    :row-index-start="rowIndexStart"
    :row-count="rowCount"
  >
    <template v-if="$slots.empty" #empty>
      <slot name="empty" />
    </template>
  </TableData>
  <TableScroll v-else :label="label ?? messages.table.label">
    <table
      class="astryx-table"
      :class="$attrs.class"
      :style="$attrs.style"
      :data-density="density"
      :data-dividers="dividers"
      :data-striped="isStriped || undefined"
      :data-hover="hasHover || undefined"
      :data-overflow="textOverflow"
      :data-valign="verticalAlign"
    >
      <slot />
    </table>
  </TableScroll>
</template>
