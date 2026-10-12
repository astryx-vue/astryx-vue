<script setup lang="ts" generic="T extends Record<string, unknown>">
import type { TableColumn, TablePlugin, TableProps, TableSlots } from './types.js'
import { computed } from 'vue'
import { useAstryxMessages } from '../locale/context.js'
import TableData from './TableData.vue'
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

const messages = useAstryxMessages()
const plugins = computed(() => Object.values(props.plugins ?? {}).filter((plugin): plugin is TablePlugin<T> => plugin != null))
const dataMode = computed(() => props.data != null)
const columns = computed(() => (props.columns ?? []) as TableColumn[])
</script>

<template>
  <TableData
    v-if="dataMode"
    :class="$attrs.class"
    :style="$attrs.style"
    :rows="data ?? []"
    :columns="columns"
    :plugins="plugins as TablePlugin[]"
    :id-key="idKey"
    :label="label ?? messages.table.label"
    :density="density"
    :dividers="dividers"
    :is-striped="isStriped"
    :has-hover="hasHover"
    :text-overflow="textOverflow"
    :vertical-align="verticalAlign"
  >
    <template v-if="$slots.empty" #empty>
      <slot name="empty" />
    </template>
  </TableData>
  <div v-else class="astryx-table-scroll" role="group" :aria-label="label ?? messages.table.label">
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
  </div>
</template>
