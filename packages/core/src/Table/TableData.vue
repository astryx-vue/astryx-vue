<script setup lang="ts">
import type { CSSProperties, VNodeChild } from 'vue'
import type { TableColumn, TablePlugin } from './types.js'
import { computed, defineComponent, ref } from 'vue'
import CheckboxInput from '../CheckboxInput/CheckboxInput.vue'
import Icon from '../Icon/Icon.vue'
import { useAstryxMessages } from '../locale/context.js'
import { cellText, resolveColumnWidths } from './columnUtils.js'
import TableFilterControl from './TableFilterControl.vue'

const props = defineProps<{
  rows: readonly Record<string, unknown>[]
  columns: readonly TableColumn[]
  plugins: TablePlugin[]
  idKey: string
  label: string
  density: string
  dividers: string
  isStriped: boolean
  hasHover: boolean
  textOverflow: string
  verticalAlign: string
  minWidth?: number
}>()

defineSlots<{ empty?: () => VNodeChild }>()

const messages = useAstryxMessages()
const dragWidths = ref<Record<string, number>>({})

const resolvedColumns = computed(() => props.plugins.reduce(
  (columns, plugin) => plugin.transformColumns?.(columns) ?? columns,
  [...props.columns],
))

const widths = computed(() => resolveColumnWidths(resolvedColumns.value))
const selection = computed(() => props.plugins.find(plugin => plugin.selection)?.selection)
const resizable = computed(() => props.plugins.some(plugin => plugin.onColumnResizeEnd))

function styleFor(column: TableColumn): CSSProperties {
  const base = { ...(widths.value.columns.get(column.key)?.style ?? {}) }
  const override = props.plugins.map(plugin => plugin.widthFor?.(column)).find(value => value != null) ?? dragWidths.value[column.key]
  if (override != null) {
    base.width = `${override}px`
    base.minWidth = `${override}px`
  }
  return base
}

function sortFor(column: TableColumn) {
  for (const plugin of props.plugins) {
    const sort = plugin.sortFor?.(column)
    if (sort)
      return sort
  }
  return null
}

function filterFor(column: TableColumn) {
  for (const plugin of props.plugins) {
    const filter = plugin.filterFor?.(column)
    if (filter)
      return filter
  }
  return null
}

function rowKey(row: Record<string, unknown>, index: number) {
  const id = row[props.idKey]
  return id == null ? index : String(id)
}

function selected(row: Record<string, unknown>) {
  return selection.value?.isSelected(row) === true && selection.value.hasRowHighlight !== false
}

const CellContent = defineComponent({
  name: 'AstryxTableCellContent',
  props: {
    column: { type: Object, required: true },
    row: { type: Object, required: true },
    index: { type: Number, required: true },
  },
  setup(cellProps) {
    return () => {
      const column = cellProps.column as TableColumn
      const row = cellProps.row as Record<string, unknown>
      const rendered = column.renderCell?.(row, cellProps.index)
      if (rendered == null)
        return cellText(row[column.key])
      return rendered
    }
  },
})

const PluginFooter = defineComponent({
  name: 'AstryxTablePluginFooter',
  props: {
    plugin: { type: Object, required: true },
  },
  setup(footerProps) {
    return () => (footerProps.plugin as TablePlugin).below?.() ?? null
  },
})

function startResize(event: PointerEvent, column: TableColumn) {
  const handle = event.currentTarget
  if (!(handle instanceof HTMLElement))
    return
  const cell = handle.closest('th')
  if (cell == null)
    return
  const startX = event.clientX
  const startWidth = cell.getBoundingClientRect().width
  handle.setPointerCapture(event.pointerId)
  const move = (moveEvent: Event) => {
    if (!(moveEvent instanceof PointerEvent))
      return
    const next = Math.max(60, startWidth + moveEvent.clientX - startX)
    dragWidths.value = { ...dragWidths.value, [column.key]: next }
  }
  const stop = (upEvent: Event) => {
    handle.removeEventListener('pointermove', move)
    handle.removeEventListener('pointerup', stop)
    const width = dragWidths.value[column.key] ?? startWidth
    for (const plugin of props.plugins)
      plugin.onColumnResizeEnd?.(column.key, width)
    if (upEvent instanceof PointerEvent && handle.hasPointerCapture(upEvent.pointerId))
      handle.releasePointerCapture(upEvent.pointerId)
  }
  handle.addEventListener('pointermove', move)
  handle.addEventListener('pointerup', stop)
}

const columnCount = computed(() => resolvedColumns.value.length + (selection.value ? 1 : 0))
</script>

<template>
  <div class="astryx-table-scroll" role="group" :aria-label="label">
    <table
      class="astryx-table"
      :data-density="density"
      :data-dividers="dividers"
      :data-striped="isStriped || undefined"
      :data-hover="hasHover || undefined"
      :data-overflow="textOverflow"
      :data-valign="verticalAlign"
      :style="minWidth ? { minWidth: `${Math.max(minWidth, widths.tableMinWidth)}px` } : { minWidth: `${widths.tableMinWidth}px` }"
    >
      <thead>
        <tr>
          <th v-if="selection" class="astryx-table__select" scope="col">
            <CheckboxInput
              :model-value="selection.isIndeterminate() ? 'indeterminate' : selection.isAllSelected()"
              :label="messages.table.selectAllRows"
              is-label-hidden
              size="sm"
              @update:model-value="value => selection?.selectAll(value === true)"
            />
          </th>
          <th
            v-for="column in resolvedColumns"
            :key="column.key"
            scope="col"
            :data-align="column.align"
            :style="styleFor(column)"
            :aria-sort="sortFor(column)?.direction ?? undefined"
          >
            <div class="astryx-table__header">
              <button
                v-if="sortFor(column)"
                type="button"
                class="astryx-table__sort"
                :data-align="column.align"
                :aria-label="sortFor(column)?.label"
                @click="sortFor(column)?.onClick($event)"
              >
                <span>{{ column.header ?? column.key }}</span>
                <span class="astryx-table__sort-icon" :data-active="sortFor(column)?.direction != null || undefined">
                  <Icon :icon="sortFor(column)?.direction === 'descending' ? 'arrowDown' : 'arrowUp'" size="sm" />
                </span>
                <span v-if="sortFor(column)?.rank" class="astryx-table__sort-rank">{{ sortFor(column)?.rank }}</span>
              </button>
              <span v-else>{{ column.header ?? column.key }}</span>
              <TableFilterControl v-if="filterFor(column)" :filter="filterFor(column)!" />
            </div>
            <span
              v-if="resizable"
              class="astryx-table__resize"
              @pointerdown="startResize($event, column)"
            />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="rows.length === 0">
          <td class="astryx-table__empty" :colspan="columnCount">
            <slot name="empty">
              {{ messages.table.noData }}
            </slot>
          </td>
        </tr>
        <tr
          v-for="(row, index) in rows"
          :key="rowKey(row, index)"
          :aria-selected="selected(row) ? 'true' : undefined"
        >
          <td v-if="selection" class="astryx-table__select">
            <CheckboxInput
              v-if="selection.isSelectable?.(row) !== false"
              :model-value="selection.isSelected(row)"
              :label="selection.rowLabel?.(row) ? messages.table.selectRowNamed(selection.rowLabel(row)) : messages.table.selectRow"
              is-label-hidden
              size="sm"
              @update:model-value="value => selection?.selectRow(row, value === true)"
            />
          </td>
          <td
            v-for="column in resolvedColumns"
            :key="column.key"
            :data-align="column.align"
            :style="column.verticalAlign ? { verticalAlign: column.verticalAlign } : undefined"
          >
            <CellContent :column="column" :row="row" :index="index" />
          </td>
        </tr>
      </tbody>
    </table>
    <PluginFooter v-for="(plugin, index) in plugins" :key="index" :plugin="plugin" />
  </div>
</template>
