import type { MaybeRefOrGetter, VNodeChild } from 'vue'
import type { AnimatedLayout } from '../../composables/useAnimatedLayout.js'
import type { TablePlugin, TableRowPatch } from '../types.js'
import { h, toValue } from 'vue'
import { useComponentMessages } from '../../locale/context.js'
import { tableMessages } from '../../locale/messages/table.js'
import { pixel } from '../columnUtils.js'
import TableExpansionChevron from '../TableExpansionChevron.vue'
import { isInteractiveRowClick } from './interaction.js'
import { EXPANSION_KEY_ATTRIBUTE, useRowExpansionGlide } from './rowExpansionGlide.js'

export const EXPANSION_COLUMN_KEY = '__expansion'
export const EXPANSION_COLUMN_WIDTH = 40

export interface UseTableRowExpansionConfig<T extends Record<string, unknown>> {
  expandedKeys: ReadonlySet<string>
  onToggle: (key: string) => void
  getRowKey: (item: T) => string
  renderExpanded: (item: T) => VNodeChild
  /**
   * 行的可读名字，拼进展开按钮的无障碍名称（「Expand Acme」）。返回空白时退回通用的「Expand row」。
   */
  getRowLabel?: (item: T) => string
  getIsItemExpandable?: (item: T) => boolean
  panelVariant?: 'muted' | 'transparent'
  hasRowClickExpansion?: boolean
  /**
   * `useAnimatedLayout` 返回的句柄。传了之后，面板展开或收起时下面的行滑到新位置，
   * 展开的面板播放入场，箭头按同样的节奏转动。
   */
  animatedLayout?: AnimatedLayout | null
}

export function useTableRowExpansion<T extends Record<string, unknown>>(
  config: MaybeRefOrGetter<UseTableRowExpansionConfig<T>>,
): TablePlugin<T> {
  const messages = useComponentMessages({ table: tableMessages })
  const glide = useRowExpansionGlide({
    animatedLayout: () => toValue(config).animatedLayout,
    expandedKeys: () => toValue(config).expandedKeys,
  })
  return {
    rowModel: 'detail',
    bindScrollRoot: glide.bindScrollRoot,
    transformColumns(columns) {
      return [{
        key: EXPANSION_COLUMN_KEY,
        header: messages.value.table.rowExpansion,
        headerHidden: true,
        width: pixel(EXPANSION_COLUMN_WIDTH),
        resizable: false,
        renderCell(item: T) {
          const current = toValue(config)
          const expandable = current.getIsItemExpandable?.(item) ?? true
          if (!expandable)
            return null
          const key = current.getRowKey(item)
          return h(TableExpansionChevron, {
            expanded: current.expandedKeys.has(key),
            rowLabel: current.getRowLabel?.(item)?.trim() || undefined,
            onToggle: () => current.onToggle(key),
          })
        },
      }, ...columns]
    },
    rowPatch(row): TableRowPatch | null {
      const current = toValue(config)
      const expandable = current.getIsItemExpandable?.(row) ?? true
      if (!expandable)
        return null
      const key = current.getRowKey(row)
      const expanded = current.expandedKeys.has(key)
      const variant = current.panelVariant ?? 'transparent'
      return {
        attrs: expanded
          ? { [EXPANSION_KEY_ATTRIBUTE]: key, 'data-expanded': '' }
          : { [EXPANSION_KEY_ATTRIBUTE]: key },
        class: current.hasRowClickExpansion ? 'astryx-table__clickable' : undefined,
        onClick: current.hasRowClickExpansion
          ? (event) => {
              if (!isInteractiveRowClick(event))
                current.onToggle(key)
            }
          : undefined,
        menu: [{
          id: 'row-expansion-toggle',
          label: expanded ? messages.value.table.collapseRow : messages.value.table.expandRow,
          icon: expanded ? 'chevronDown' : 'chevronRight',
          onSelect: () => current.onToggle(key),
        }],
        panel: expanded
          ? { variant, render: () => current.renderExpanded(row) }
          : undefined,
      }
    },
    cellPatch({ column, row, kind }) {
      const isExpansionColumn = column.key === EXPANSION_COLUMN_KEY
      const hasMenu = kind === 'body' && row != null && (toValue(config).getIsItemExpandable?.(row) ?? true)
      if (!isExpansionColumn && !hasMenu)
        return null
      return {
        class: isExpansionColumn ? 'astryx-table__expansion' : undefined,
        attrs: hasMenu ? { 'data-row-menu': '' } : undefined,
      }
    },
  }
}
