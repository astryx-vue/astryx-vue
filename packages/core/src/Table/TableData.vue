<script setup lang="ts">
import type { CSSProperties, VNodeChild } from 'vue'
import type { ColumnResizeSnapshot } from './plugins/columnResize.js'
import type {
  TableCellPatch,
  TableColumn,
  TableColumnResizeContribution,
  TablePlugin,
  TableRowMenuItem,
  TableRowPatch,
} from './types.js'
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import CheckboxInput from '../CheckboxInput/CheckboxInput.vue'
import Icon from '../Icon/Icon.vue'
import { useAstryxMessages } from '../locale/context.js'
import VisuallyHidden from '../VisuallyHidden/VisuallyHidden.vue'
import { resolveColumnWidths } from './columnUtils.js'
import { columnResizeDirectionSign, columnResizeStep, resizeColumnWidths } from './plugins/columnResize.js'
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
const scrollRoot = ref<HTMLElement | null>(null)
const menu = ref<{ x: number, y: number, items: readonly TableRowMenuItem[] } | null>(null)

const resolvedColumns = computed(() => props.plugins.reduce(
  (columns, plugin) => plugin.transformColumns?.(columns) ?? columns,
  [...props.columns],
))

const widths = computed(() => resolveColumnWidths(resolvedColumns.value))
const selection = computed(() => props.plugins.find(plugin => plugin.selection)?.selection)
const canResize = computed(() => props.plugins.some(plugin => plugin.onColumnResizeEnd))

/**
 * 一列参与拖动改宽的方式。第一个给出结果的插件说了算。
 * 只实现了 `onColumnResizeEnd` 的老插件仍然拿到一个最朴素的把手：只管自己这一列，最窄 60px。
 */
function resizeContribution(column: TableColumn): TableColumnResizeContribution | null {
  for (const plugin of props.plugins) {
    const contribution = plugin.resizeFor?.(column, resolvedColumns.value)
    if (contribution != null)
      return contribution
  }
  if (!canResize.value || column.resizable === false)
    return null
  return { minWidth: 60, maxWidth: Number.POSITIVE_INFINITY, neighborKey: null, hasHandle: true }
}

const resizeContributions = computed(() => new Map(
  resolvedColumns.value.map(column => [column.key, resizeContribution(column)]),
))
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
  const override = props.plugins.map(plugin => plugin.widthFor?.(column)).find(value => value != null)
    ?? resizeContributions.value.get(column.key)?.currentWidth
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

interface ResizeState {
  snapshots: ColumnResizeSnapshot[]
  resizeIndex: number
  neighborIndex: number | null
  tableWidth: number
  /** 横向位移的符号。RTL 下拖右边等于变小。 */
  direction: 1 | -1
  elements: Map<string, HTMLElement>
}

/** 收集这一行表头的宽度快照，用来算拖动后的宽度。 */
function buildResizeState(cell: HTMLElement, column: TableColumn): ResizeState | null {
  const row = cell.parentElement
  if (row == null)
    return null
  const table = cell.closest('table')
  const dragged = resizeContributions.value.get(column.key)
  const snapshots: ColumnResizeSnapshot[] = []
  const elements = new Map<string, HTMLElement>()
  for (const child of Array.from(row.children)) {
    if (!(child instanceof HTMLElement))
      continue
    const key = child.dataset.column
    if (key == null)
      continue
    const contribution = resizeContributions.value.get(key)
    if (contribution == null)
      continue
    const measured = child.getBoundingClientRect().width
    snapshots.push({
      key,
      initialWidth: contribution.currentWidth ?? (measured > 0 ? measured : 0),
      minWidth: contribution.minWidth,
      maxWidth: contribution.maxWidth,
    })
    elements.set(key, child)
  }
  const resizeIndex = snapshots.findIndex(item => item.key === column.key)
  if (resizeIndex < 0)
    return null
  return {
    snapshots,
    resizeIndex,
    neighborIndex: dragged?.neighborKey == null
      ? null
      : snapshots.findIndex(item => item.key === dragged.neighborKey),
    tableWidth: table?.getBoundingClientRect().width ?? 0,
    direction: columnResizeDirectionSign(getComputedStyle(cell).direction),
    elements,
  }
}

function applyResize(widths: number[], state: ResizeState): void {
  state.snapshots.forEach((snapshot, index) => {
    const element = state.elements.get(snapshot.key)
    const width = widths[index]
    if (element == null || width == null)
      return
    const pixels = `${width}px`
    element.style.width = pixels
    element.style.minWidth = pixels
    element.style.maxWidth = pixels
  })
}

function resetResizeStyles(state: ResizeState): void {
  for (const element of state.elements.values()) {
    element.style.width = ''
    element.style.minWidth = ''
    element.style.maxWidth = ''
  }
}

/** 算一次拖动结果：先把预览写到表头，再把变了的列交给插件。 */
function commitResize(state: ResizeState, delta: number): void {
  const widths = resizeColumnWidths(state, delta)
  applyResize(widths, state)
  const last = state.snapshots.length - 1
  const updates: Record<string, number> = {}
  state.snapshots.forEach((snapshot, index) => {
    // 最后一列的宽度是算出来的（表格剩余空间），不归用户管。
    const width = widths[index]
    if (index !== last && width != null)
      updates[snapshot.key] = width
  })
  if (Object.keys(updates).length === 0)
    return
  for (const plugin of props.plugins)
    plugin.onColumnResizeEnd?.(updates)
}

function resizeLabel(column: TableColumn): string {
  const header = typeof column.header === 'string' && column.header.length > 0 ? column.header : column.key
  return messages.value.table.resizeColumn(header)
}

function resizeMax(contribution: TableColumnResizeContribution | null | undefined): number | undefined {
  const max = contribution?.maxWidth
  return max == null || !Number.isFinite(max) ? undefined : max
}

function startResize(event: PointerEvent, column: TableColumn) {
  const target = event.currentTarget
  if (!(target instanceof HTMLElement) || event.button !== 0)
    return
  const cell = target.closest('th')
  const state = cell == null ? null : buildResizeState(cell, column)
  if (state == null || cell == null)
    return
  event.preventDefault()
  const pointerId = event.pointerId
  const startX = event.clientX
  const table = cell.closest('table')
  const previousUserSelect = table?.style.userSelect ?? ''
  if (table != null)
    table.style.userSelect = 'none'
  target.setAttribute('data-resizing', 'true')
  target.setPointerCapture(pointerId)

  const listeners = new AbortController()
  const move = (moveEvent: PointerEvent) => {
    if (moveEvent.pointerId !== pointerId)
      return
    applyResize(resizeColumnWidths(state, (moveEvent.clientX - startX) * state.direction), state)
  }
  const finish = () => {
    listeners.abort()
    target.removeAttribute('data-resizing')
    if (target.hasPointerCapture(pointerId))
      target.releasePointerCapture(pointerId)
    if (table != null)
      table.style.userSelect = previousUserSelect
  }
  const stop = (upEvent: PointerEvent) => {
    if (upEvent.pointerId !== pointerId)
      return
    finish()
    commitResize(state, (upEvent.clientX - startX) * state.direction)
  }
  const cancel = (cancelEvent: PointerEvent) => {
    if (cancelEvent.pointerId !== pointerId)
      return
    finish()
    resetResizeStyles(state)
  }
  const options = { signal: listeners.signal }
  target.addEventListener('pointermove', move, options)
  target.addEventListener('pointerup', stop, options)
  target.addEventListener('pointercancel', cancel, options)
}

function onResizeKeydown(event: KeyboardEvent, column: TableColumn) {
  const handle = event.currentTarget
  if (!(handle instanceof HTMLElement))
    return
  const cell = handle.closest('th')
  const state = cell == null ? null : buildResizeState(cell, column)
  if (state == null)
    return
  const self = state.snapshots[state.resizeIndex]
  if (self == null)
    return
  const step = columnResizeStep(event.shiftKey)
  let delta: number | null = null
  switch (event.key) {
    case 'ArrowRight':
      delta = step * state.direction
      break
    case 'ArrowLeft':
      delta = -step * state.direction
      break
    case 'Home':
      delta = self.minWidth - self.initialWidth
      break
    case 'End':
      if (Number.isFinite(self.maxWidth))
        delta = self.maxWidth - self.initialWidth
      break
  }
  if (delta == null)
    return
  event.preventDefault()
  commitResize(state, delta)
}

function selectCellPatch(kind: 'header' | 'body', row: Record<string, unknown> | null) {
  return mergeCell(selectColumn(), row, kind)
}

function isSelected(row: Record<string, unknown>): boolean {
  return selection.value?.isSelected(row) === true
}

function isEnabled(row: Record<string, unknown>): boolean {
  return selection.value?.isEnabled?.(row) ?? true
}
</script>

<template>
  <div ref="scrollRoot" class="astryx-table-scroll" role="group" :aria-label="label">
    <PluginFooter v-for="(plugin, index) in plugins.filter(item => item.above)" :key="`above-${index}`" :plugin="plugin" place="above" />
    <table
      class="astryx-table"
      :data-density="density"
      :data-dividers="dividers"
      :data-striped="isStriped || undefined"
      :data-hover="hasHover || undefined"
      :data-overflow="textOverflow"
      :data-valign="verticalAlign"
      :data-row-highlight="selection?.hasRowHighlight === false ? 'off' : undefined"
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
            <!-- eslint-disable-next-line vue-a11y/no-static-element-interactions -- role="separator" 是 WAI-ARIA 的分隔条：自己可聚焦，方向键也归它处理。 -->
            <span
              v-if="resizeContributions.get(column.key)?.hasHandle"
              class="astryx-table__resize"
              role="separator"
              aria-orientation="vertical"
              :aria-label="resizeLabel(column)"
              :aria-valuenow="resizeContributions.get(column.key)?.currentWidth ?? resizeContributions.get(column.key)?.minWidth"
              :aria-valuemin="resizeContributions.get(column.key)?.minWidth"
              :aria-valuemax="resizeMax(resizeContributions.get(column.key))"
              tabindex="0"
              @pointerdown="startResize($event, column)"
              @keydown="onResizeKeydown($event, column)"
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
            :aria-selected="!entry.patch.group && isSelected(entry.row) ? 'true' : undefined"
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
                  :is-disabled="!isEnabled(entry.row)"
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
    <PluginFooter v-for="(plugin, index) in plugins.filter(item => item.below)" :key="`below-${index}`" :plugin="plugin" place="below" />
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
