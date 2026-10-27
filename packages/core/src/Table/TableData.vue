<script setup lang="ts">
import type { CSSProperties, VNodeChild, VNodeRef } from 'vue'
import type {
  TableCellPatch,
  TableColumn,
  TableColumnResizeContribution,
  TablePlugin,
  TableRowMenuItem,
  TableRowPatch,
} from './types.js'
import { computed, h, onBeforeUnmount, ref, useAttrs } from 'vue'
import CheckboxInput from '../CheckboxInput/CheckboxInput.vue'
import Icon from '../Icon/Icon.vue'
import { useAstryxMessages } from '../locale/context.js'
import VisuallyHidden from '../VisuallyHidden/VisuallyHidden.vue'
import { resolveColumnWidths, resolveTableMinWidth, splitStyleMinWidth } from './columnUtils.js'
import { selectColumn } from './plugins/stickyColumns.js'
import { mergeRowPatches } from './rowPatch.js'
import { CellContent, HeaderAddon, PluginFooter, RenderFn } from './TableDataRenderers.js'
import TableFilterControl from './TableFilterControl.vue'
import TableGroupHeader from './TableGroupHeader.vue'
import TableRowMenu from './TableRowMenu.vue'
import TableScroll from './TableScroll.vue'
import { useTableColumnResizeSession } from './useTableColumnResizeSession.js'

defineOptions({ inheritAttrs: false })

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
}>()

defineSlots<{ empty?: () => VNodeChild }>()

const attrs = useAttrs()
const messages = useAstryxMessages()
const scrollRoot = ref<HTMLElement | null>(null)
const menu = ref<{ x: number, y: number, items: readonly TableRowMenuItem[] } | null>(null)
const scrollStyle = computed(() => splitStyleMinWidth(attrs.style).style)

const resolvedColumns = computed(() => props.plugins.reduce(
  (columns, plugin) => plugin.transformColumns?.(columns) ?? columns,
  [...props.columns],
))

const selection = computed(() => props.plugins.find(plugin => plugin.selection)?.selection)
const layoutColumns = computed(() => selection.value
  ? [selectColumn(), ...resolvedColumns.value]
  : resolvedColumns.value)
// 原版把选择列（fixed pixel 宽）也算进 tableMinWidth，比例列分到的下限才不被它挤占。
const widths = computed(() => resolveColumnWidths(layoutColumns.value))
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
const { startResize, onResizeKeydown, resizeLabel, resizeMax } = useTableColumnResizeSession({
  plugins: () => props.plugins,
  contributions: () => resizeContributions.value,
  resizeColumnLabel: header => messages.value.table.resizeColumn(header),
})
const tableStyle = computed(() => ({
  minWidth: resolveTableMinWidth(splitStyleMinWidth(attrs.style).minWidth, widths.value.tableMinWidth),
}))
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

function onViewport(element: HTMLElement | null): void {
  if (scrollRoot.value === element)
    return
  if (scrollRoot.value != null)
    bindScroll(null)
  scrollRoot.value = element
  if (element != null)
    bindScroll(element)
}

onBeforeUnmount(() => {
  bindScroll(null)
})

/** 列头的纯文本形态：函数式列头没有纯文本，可访问名称回退到 key。 */
function headerText(column: TableColumn): string {
  return typeof column.header === 'string' && column.header !== '' ? column.header : column.key
}

/** 列头内容：字符串直接显示，函数按函数式组件渲染。 */
function HeaderContent(props: { column: TableColumn }) {
  return typeof props.column.header === 'function'
    ? props.column.header()
    : h('span', null, headerText(props.column))
}

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

const filterContributions = computed(() => new Map(
  resolvedColumns.value.map(column => [column.key, filterFor(column)]),
))

/**
 * 取某一列落在指定位置的筛选控件。
 * `popover` 是一个漏斗按钮，跟标题、排序图标同一行；`inline` 系列是输入框，垫在标题下面。
 */
function filterAt(column: TableColumn, place: 'line' | 'below') {
  const filter = filterContributions.value.get(column.key) ?? null
  if (filter == null)
    return null
  return (filter.variant === 'popover' ? 'line' : 'below') === place ? filter : null
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

/** Vue 的 ref 回调拿到的是更宽的 `Element`，收窄成 `<tr>` 再交给插件。 */
function rowRefBinding(patch: TableRowPatch): VNodeRef | undefined {
  const callback = patch.ref
  if (callback == null)
    return undefined
  return (element) => {
    callback(element as HTMLTableRowElement | null)
  }
}

const entries = computed(() => {
  let ordinal = 0
  const start = props.rowIndexStart ?? 1
  return props.rows.map((row, index) => {
    const patch = mergeRowPatches(props.plugins, row, index, columnCount.value)
    let rowIndex: number | undefined
    if (trackRows.value && !patch.skipRowIndex) {
      rowIndex = start + ordinal
      ordinal += 1
    }
    return { key: rowKey(row, index), row, index, patch, ref: rowRefBinding(patch), rowIndex }
  })
})

function openMenu(event: MouseEvent, items: readonly TableRowMenuItem[] | undefined): void {
  if (items == null || items.length === 0)
    return
  event.preventDefault()
  menu.value = { x: event.clientX, y: event.clientY, items }
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
  <TableScroll :class="attrs.class" :style="scrollStyle" :label="label" @viewport="onViewport">
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
      :style="tableStyle"
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
                    {{ headerText(column) }}
                  </VisuallyHidden>
                  <HeaderContent v-else :column="column" />
                  <span class="astryx-table__sort-icon" :data-active="sortFor(column)?.direction != null || undefined">
                    <Icon :icon="sortFor(column)?.direction === 'descending' ? 'arrowDown' : 'arrowUp'" size="sm" />
                  </span>
                  <span v-if="sortFor(column)?.rank" class="astryx-table__sort-rank">{{ sortFor(column)?.rank }}</span>
                </button>
                <VisuallyHidden v-else-if="column.headerHidden">
                  {{ headerText(column) }}
                </VisuallyHidden>
                <HeaderContent v-else :column="column" />
                <TableFilterControl
                  v-if="filterAt(column, 'line')"
                  :filter="filterAt(column, 'line')!"
                />
              </div>
              <TableFilterControl
                v-if="filterAt(column, 'below')"
                :filter="filterAt(column, 'below')!"
              />
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
            :ref="entry.ref"
            :aria-selected="!entry.patch.group && isSelected(entry.row) ? 'true' : undefined"
            :aria-rowindex="entry.rowIndex"
            :class="entry.patch.class"
            v-bind="entry.patch.attrs"
            @blur="entry.patch.listeners?.onBlur?.($event)"
            @click="entry.patch.onClick?.($event)"
            @contextmenu="openMenu($event, entry.patch.menu)"
            @focus="entry.patch.listeners?.onFocus?.($event)"
            @mouseenter="entry.patch.listeners?.onMouseenter?.($event)"
            @mouseleave="entry.patch.listeners?.onMouseleave?.($event)"
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
    <TableRowMenu
      v-if="menu"
      :x="menu.x"
      :y="menu.y"
      :items="menu.items"
      @close="menu = null"
    />
  </TableScroll>
</template>
