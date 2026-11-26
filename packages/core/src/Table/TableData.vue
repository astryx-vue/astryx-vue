<script setup lang="ts">
import type { VNodeChild, VNodeRef } from 'vue'
import type { TableColumn, TablePlugin, TableRowMenuItem, TableRowPatch } from './types.js'
import { computed, h, onBeforeUnmount, ref, useAttrs, useId } from 'vue'
import CheckboxInput from '../CheckboxInput/CheckboxInput.vue'
import ComponentIcon from '../Icon/ComponentIcon.vue'
import { useComponentMessages } from '../locale/context.js'
import { tableMessages } from '../locale/messages/table.js'
import CutTextTooltip from '../Text/CutTextTooltip.vue'
import VisuallyHidden from '../VisuallyHidden/VisuallyHidden.vue'
import { resolveTableMinWidth, splitStyleMinWidth } from './columnUtils.js'
import { columnHeaderText } from './headerText.js'
import { mergeRowPatches } from './rowPatch.js'
import { CellContent, HeaderAddon, PluginFooter, RenderFn } from './TableDataRenderers.js'
import TableFilterControl from './TableFilterControl.vue'
import TableGroupHeader from './TableGroupHeader.vue'
import TableRowMenu from './TableRowMenu.vue'
import TableScroll from './TableScroll.vue'
import { useColumnResizeAria } from './useColumnResizeAria.js'
import { useHeaderCutText } from './useHeaderCutText.js'
import { useTableColumnResizeSession } from './useTableColumnResizeSession.js'
import { useTableDataModel } from './useTableDataModel.js'

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

const headerCutText = useHeaderCutText()

const attrs = useAttrs()
const messages = useComponentMessages({ table: tableMessages })
const headerIdPrefix = useId()
/** 排序按钮描述（多列排序时的优先级）的 id 前缀，后面接列的序号。 */
const sortIdBase = useId()
const scrollRoot = ref<HTMLElement | null>(null)
const menu = ref<{ x: number, y: number, items: readonly TableRowMenuItem[] } | null>(null)
const scrollStyle = computed(() => splitStyleMinWidth(attrs.style).style)

const {
  resolvedColumns,
  layoutColumns,
  selection,
  widths,
  resizeContributions,
  sortFor,
  filterAt,
  mergeCell,
  headerStyle,
  bodyStyle,
  selectCellPatch,
} = useTableDataModel({ columns: () => props.columns, plugins: () => props.plugins })

const { startResize, onResizeKeydown, resizeLabel } = useTableColumnResizeSession({
  plugins: () => props.plugins,
  contributions: () => resizeContributions.value,
  resizeColumnLabel: header => messages.value.table.resizeColumn(header),
})
const resizeAria = useColumnResizeAria(width => messages.value.table.columnWidthValue(width))
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

/** 列头内容：字符串直接显示，函数按函数式组件渲染。 */
function HeaderContent(props: { column: TableColumn }) {
  return typeof props.column.header === 'function'
    ? props.column.header()
    : h('span', null, columnHeaderText(props.column))
}

/**
 * 有拖动把手的列头不从内容取名字：把手是可聚焦的分隔条，会把它的宽度值拼进列头名里。
 * 这时列头用 `aria-labelledby` 指向标题那一块，名字只剩标题。
 */
function headerContentId(index: number): string {
  return `${headerIdPrefix}-header-${index}`
}

function rowKey(row: Record<string, unknown>, index: number) {
  if (typeof props.idKey === 'function')
    return props.idKey(row)
  const id = row[props.idKey]
  return id == null ? String(index) : String(id)
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
      data-layout="fixed"
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
      <thead
        @focusin="headerCutText.onFocusin"
        @focusout="headerCutText.onFocusout"
        @pointerdown="headerCutText.onPointerdown"
        @keydown="headerCutText.onKeydown"
      >
        <tr class="astryx-table-row" data-header-row>
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
            v-for="(column, columnIndex) in resolvedColumns"
            :key="column.key"
            scope="col"
            :data-column="column.key"
            :data-align="column.align"
            :class="mergeCell(column, null, 'header').class"
            v-bind="mergeCell(column, null, 'header').attrs"
            :style="headerStyle(column)"
            :aria-sort="sortFor(column)?.direction ?? undefined"
            :aria-labelledby="resizeContributions.get(column.key)?.hasHandle ? headerContentId(columnIndex) : undefined"
          >
            <div :id="headerContentId(columnIndex)" class="astryx-table__header">
              <div class="astryx-table__header-line">
                <HeaderAddon :column="column" :plugins="plugins" />
                <template v-if="sortFor(column)">
                  <button
                    type="button"
                    class="astryx-table__sort"
                    :data-align="column.align"
                    :aria-describedby="sortFor(column)?.description ? `${sortIdBase}-${columnIndex}` : undefined"
                    @click="sortFor(column)?.onClick($event)"
                  >
                    <VisuallyHidden v-if="column.headerHidden">
                      {{ columnHeaderText(column) }}
                    </VisuallyHidden>
                    <span v-else class="astryx-table__header-label"><HeaderContent :column="column" /></span>
                    <span class="astryx-table__sort-icon" :data-active="sortFor(column)?.direction != null || undefined">
                      <ComponentIcon
                        icon-slot="table-sort-indicator"
                        :state="{ direction: sortFor(column)?.direction ?? 'none' }"
                        :fallback="{ icon: sortFor(column)?.direction === 'descending' ? 'arrowDown' : 'arrowUp', size: 'xsm' }"
                      />
                    </span>
                    <span v-if="sortFor(column)?.rank" class="astryx-table__sort-rank" aria-hidden="true">{{ sortFor(column)?.rank }}</span>
                  </button>
                  <span v-if="sortFor(column)?.description" :id="`${sortIdBase}-${columnIndex}`" hidden>{{ sortFor(column)?.description }}</span>
                </template>
                <VisuallyHidden v-else-if="column.headerHidden">
                  {{ columnHeaderText(column) }}
                </VisuallyHidden>
                <span v-else class="astryx-table__header-label"><HeaderContent :column="column" /></span>
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
              :ref="element => resizeAria.observeHandle(column.key, element)"
              class="astryx-table__resize"
              role="separator"
              aria-orientation="vertical"
              :aria-label="resizeLabel(column)"
              :aria-valuenow="resizeAria.ariaValue(column.key, resizeContributions.get(column.key)).now"
              :aria-valuemin="resizeAria.ariaValue(column.key, resizeContributions.get(column.key)).min"
              :aria-valuemax="resizeAria.ariaValue(column.key, resizeContributions.get(column.key)).max"
              :aria-valuetext="resizeAria.ariaValue(column.key, resizeContributions.get(column.key)).text"
              tabindex="0"
              @pointerdown="startResize($event, column)"
              @keydown="onResizeKeydown($event, column)"
            />
          </th>
        </tr>
        <CutTextTooltip
          v-if="headerCutText.cutText.value != null"
          :anchor="headerCutText.cell.value"
          :text="headerCutText.cutText.value"
        />
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
            class="astryx-table-row"
            :class="entry.patch.class"
            :data-parity="entry.index % 2 === 0 ? 'odd' : 'even'"
            :data-striped="isStriped ? 'striped' : undefined"
            :data-selected="!entry.patch.group && isSelected(entry.row) ? 'selected' : undefined"
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
