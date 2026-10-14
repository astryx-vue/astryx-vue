import type { MaybeRefOrGetter, VNodeChild } from 'vue'
import type { TablePlugin, TableRowPatch } from '../types.js'
import { h, toValue } from 'vue'
import { useAstryxMessages } from '../../locale/context.js'
import { pixel } from '../columnUtils.js'
import TableExpansionChevron from '../TableExpansionChevron.vue'
import { isInteractiveRowClick } from './interaction.js'

export const EXPANSION_COLUMN_KEY = '__expansion'
export const EXPANSION_COLUMN_WIDTH = 40

export interface UseTableRowExpansionConfig<T extends Record<string, unknown>> {
  expandedKeys: ReadonlySet<string>
  onToggle: (key: string) => void
  getRowKey: (item: T) => string
  renderExpanded: (item: T) => VNodeChild
  getIsItemExpandable?: (item: T) => boolean
  panelVariant?: 'muted' | 'transparent'
  hasRowClickExpansion?: boolean
}

export function useTableRowExpansion<T extends Record<string, unknown>>(
  config: MaybeRefOrGetter<UseTableRowExpansionConfig<T>>,
): TablePlugin<T> {
  const messages = useAstryxMessages()
  return {
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
        attrs: expanded ? { 'data-expanded': '' } : undefined,
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
      if (kind !== 'body' || row == null || column.key !== EXPANSION_COLUMN_KEY)
        return column.key === EXPANSION_COLUMN_KEY ? { class: 'astryx-table__expansion' } : null
      return { class: 'astryx-table__expansion' }
    },
  }
}
