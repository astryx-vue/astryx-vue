<script setup lang="ts">
import type { CSSProperties, VNodeChild } from 'vue'
import type { TableCellPatch, TableColumn, TablePlugin, TableRowMenuItem, TableRowPatch } from './types.js'
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import CheckboxInput from '../CheckboxInput/CheckboxInput.vue'
import Icon from '../Icon/Icon.vue'
import { useAstryxMessages } from '../locale/context.js'
import VisuallyHidden from '../VisuallyHidden/VisuallyHidden.vue'
import { resolveColumnWidths } from './columnUtils.js'
import { selectColumn } from './plugins/stickyColumns.js'
import { CellContent, HeaderAddon, PluginFooter, RenderFn } from './TableDataRenderers.js'
import TableFilterControl from './TableFilterControl.vue'
import TableGroupHeader from './TableGroupHeader.vue'
import TableRowMenu from './TableRowMenu.vue'

const props = defineProps<{
  rows: readonly Record<string, unknown>[]
  columns: readonly TableColumn[]
  plugins: TablePlugin[]
  idKey: string | ((row: Record<string, unknown>) => string)
  label: string
  density: string
  dividers: string
  isStriped: boolean
  hasHover: boolean
  textOverflow: string
  verticalAlign: string
  rowIndexStart?: number
  rowCount?: number
  minWidth?: number
}>()

defineSlots<{ empty?: () => VNodeChild }>()

const messages = useAstryxMessages()
const dragWidths = ref<Record<string, number>>({})
const scrollRoot = ref<HTMLElement | null>(null)
const menu = ref<{ x: number, y: number, items: readonly TableRowMenuItem[] } | null>(null)

const resolvedColumns = computed(() => props.plugins.reduce(
  (columns, plugin) => plugin.transformColumns?.(columns) ?? columns,
  [...props.columns],
))

const widths = computed(() => resolveColumnWidths(resolvedColumns.value))
const selection = computed(() => props.plugins.find(plugin => plugin.selection)?.selection)
const canResize = computed(() => props.plugins.some(plugin => plugin.onColumnResizeEnd))
const layoutColumns = computed(() => selection.value
  ? [selectColumn(), ...resolvedColumns.value]
  : resolvedColumns.value)
const columnCount = computed(() => layoutColumns.value.length)
const trackRows = computed(() => props.rowCount != null || props.rowIndexStart != null)
const ariaRowCount = computed(() => {
  if (!trackRows.value)
    return undefined
  return String(props.rowCount ?? -1)
})

function bindScroll(element: HTMLElement | null): void {
  for (const plugin of props.plugins)
    plugin.bindScrollRoot?.(element)
}

watch(scrollRoot, (element, previous) => {
  if (previous)
    bindScroll(null)
  if (element)
    bindScroll(element)
})

onBeforeUnmount(() => {
  bindScroll(null)
})

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
  if (typeof props.idKey === 'function')
    return props.idKey(row)
  const id = row[props.idKey]
  return id == null ? String(index) : String(id)
}

function selected(row: Record<string, unknown>) {
  return selection.value?.isSelected(row) === true && selection.value.hasRowHighlight !== false
}

function mergeCell(column: TableColumn, row: Record<string, unknown> | null, kind: 'header' | 'body'): TableCellPatch {
  const style: CSSProperties = {}
  const classes: string[] = []
  const attrs: Record<string, string | undefined> = {}
  for (const plugin of props.plugins) {
    const patch = plugin.cellPatch?.({ column, columns: layoutColumns.value, row, kind })
    if (patch == null)
      continue
    if (patch.class)
      classes.push(patch.class)
    if (patch.style)
      Object.assign(style, patch.style)
    if (patch.attrs)
      Object.assign(attrs, patch.attrs)
  }
  return { class: classes.join(' ') || undefined, style, attrs }
}

function headerStyle(column: TableColumn): CSSProperties {
  return { ...styleFor(column), ...mergeCell(column, null, 'header').style }
}

function bodyStyle(column: TableColumn, row: Record<string, unknown>): CSSProperties {
  const style: CSSProperties = { ...mergeCell(column, row, 'body').style }
  if (column.verticalAlign)
    style.verticalAlign = column.verticalAlign
  return style
}

function mergeRow(row: Record<string, unknown>, index: number): TableRowPatch {
  const classes: string[] = []
  const clicks: Array<(event: MouseEvent) => void> = []
  const menus: TableRowMenuItem[] = []
  const merged: TableRowPatch = {}
  for (const plugin of props.plugins) {
    const patch = plugin.rowPatch?.(row, index, columnCount.value)
    if (patch == null)
      continue
    if (patch.group && merged.group == null)
      merged.group = patch.group
    if (patch.panel && merged.panel == null)
      merged.panel = patch.panel
    if (patch.suppressSelection)
      merged.suppressSelection = true
    if (patch.skipRowIndex)
      merged.skipRowIndex = true
    if (patch.class)
      classes.push(patch.class)
    if (patch.attrs)
      merged.attrs = { ...merged.attrs, ...patch.attrs }
    if (patch.onClick)
      clicks.push(patch.onClick)
    if (patch.menu)
      menus.push(...patch.menu)
  }
  merged.class = classes.join(' ') || undefined
  merged.menu = menus
  if (clicks.length > 0) {
    merged.onClick = (event) => {
      for (const click of clicks)
        click(event)
    }
  }
  return merged
}

const entries = computed(() => {
  let ordinal = 0
  const start = props.rowIndexStart ?? 1
  return props.rows.map((row, index) => {
    const patch = mergeRow(row, index)
    let rowIndex: number | undefined
    if (trackRows.value && !patch.skipRowIndex) {
      rowIndex = start + ordinal
      ordinal += 1
    }
    return { key: rowKey(row, index), row, index, patch, rowIndex }
  })
})

function openMenu(event: MouseEvent, items: readonly TableRowMenuItem[] | undefined): void {
  if (items == null || items.length === 0)
    return
  event.preventDefault()
  menu.value = { x: event.clientX, y: event.clientY, items }
}

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

function selectCellPatch(kind: 'header' | 'body', row: Record<string, unknown> | null) {
  return mergeCell(selectColumn(), row, kind)
}
</script>

<template>
  <div ref="scrollRoot" class="astryx-table-scroll" role="group" :aria-label="label">
    <table
      class="astryx-table"
      :data-density="density"
      :data-dividers="dividers"
      :data-striped="isStriped || undefined"
      :data-hover="hasHover || undefined"
      :data-overflow="textOverflow"
      :data-valign="verticalAlign"
      :aria-rowcount="ariaRowCount"
      :style="minWidth ? { minWidth: `${Math.max(minWidth, widths.tableMinWidth)}px` } : { minWidth: `${widths.tableMinWidth}px` }"
    >
      <thead>
        <tr>
          <th
            v-if="selection"
            class="astryx-table__select"
            :class="selectCellPatch('header', null).class"
            scope="col"
            v-bind="selectCellPatch('header', null).attrs"
            :style="selectCellPatch('header', null).style"
          >
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
            :data-column="column.key"
            :data-align="column.align"
            :class="mergeCell(column, null, 'header').class"
            v-bind="mergeCell(column, null, 'header').attrs"
            :style="headerStyle(column)"
            :aria-sort="sortFor(column)?.direction ?? undefined"
          >
            <div class="astryx-table__header">
              <div class="astryx-table__header-line">
                <HeaderAddon :column="column" :plugins="plugins" />
                <button
                  v-if="sortFor(column)"
                  type="button"
                  class="astryx-table__sort"
                  :data-align="column.align"
                  :aria-label="sortFor(column)?.label"
                  @click="sortFor(column)?.onClick($event)"
                >
                  <VisuallyHidden v-if="column.headerHidden">
                    {{ column.header ?? column.key }}
                  </VisuallyHidden>
                  <span v-else>{{ column.header ?? column.key }}</span>
                  <span class="astryx-table__sort-icon" :data-active="sortFor(column)?.direction != null || undefined">
                    <Icon :icon="sortFor(column)?.direction === 'descending' ? 'arrowDown' : 'arrowUp'" size="sm" />
                  </span>
                  <span v-if="sortFor(column)?.rank" class="astryx-table__sort-rank">{{ sortFor(column)?.rank }}</span>
                </button>
                <VisuallyHidden v-else-if="column.headerHidden">
                  {{ column.header ?? column.key }}
                </VisuallyHidden>
                <span v-else>{{ column.header ?? column.key }}</span>
              </div>
              <TableFilterControl v-if="filterFor(column)" :filter="filterFor(column)!" />
            </div>
            <span
              v-if="canResize && column.resizable !== false"
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
        <template v-for="entry in entries" :key="entry.key">
          <tr
            :aria-selected="!entry.patch.group && selected(entry.row) ? 'true' : undefined"
            :aria-rowindex="entry.rowIndex"
            :class="entry.patch.class"
            v-bind="entry.patch.attrs"
            @click="entry.patch.onClick?.($event)"
            @contextmenu="openMenu($event, entry.patch.menu)"
          >
            <template v-if="entry.patch.group">
              <td class="astryx-table__group" :colspan="columnCount">
                <TableGroupHeader
                  :group-key="entry.patch.group.groupKey"
                  :count="entry.patch.group.count"
                  :collapsed="entry.patch.group.collapsed"
                  :custom="entry.patch.group.render != null"
                  @toggle="entry.patch.group.onToggle()"
                >
                  <RenderFn v-if="entry.patch.group.render" :render="entry.patch.group.render" />
                </TableGroupHeader>
              </td>
            </template>
            <template v-else>
              <td
                v-if="selection && !entry.patch.suppressSelection"
                class="astryx-table__select"
                :class="selectCellPatch('body', entry.row).class"
                v-bind="selectCellPatch('body', entry.row).attrs"
                :style="selectCellPatch('body', entry.row).style"
              >
                <CheckboxInput
                  v-if="selection.isSelectable?.(entry.row) !== false"
                  :model-value="selection.isSelected(entry.row)"
                  :label="selection.rowLabel?.(entry.row) ? messages.table.selectRowNamed(selection.rowLabel(entry.row)) : messages.table.selectRow"
                  is-label-hidden
                  size="sm"
                  @update:model-value="value => selection?.selectRow(entry.row, value === true)"
                />
              </td>
              <td
                v-for="column in resolvedColumns"
                :key="column.key"
                :data-column="column.key"
                :data-align="column.align"
                :class="mergeCell(column, entry.row, 'body').class"
                v-bind="mergeCell(column, entry.row, 'body').attrs"
                :style="bodyStyle(column, entry.row)"
              >
                <CellContent :column="column" :row="entry.row" :index="entry.index" />
              </td>
            </template>
          </tr>
          <tr
            v-if="entry.patch.panel"
            data-expansion-panel
            class="astryx-table__panel-row"
            :data-variant="entry.patch.panel.variant"
          >
            <td class="astryx-table__panel" :colspan="columnCount">
              <RenderFn :render="entry.patch.panel.render" />
            </td>
          </tr>
        </template>
      </tbody>
    </table>
    <PluginFooter v-for="(plugin, index) in plugins" :key="index" :plugin="plugin" />
    <Teleport to="body">
      <TableRowMenu
        v-if="menu"
        :x="menu.x"
        :y="menu.y"
        :items="menu.items"
        @close="menu = null"
      />
    </Teleport>
  </div>
</template>
