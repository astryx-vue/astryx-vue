import type { MaybeRefOrGetter } from 'vue'
import type { TablePlugin } from '../types.js'
import { h, toValue } from 'vue'
import { pixel } from '../columnUtils.js'
import { isTableGroupHeader } from './groupedRows.js'

export const ROW_INDEX_COLUMN_KEY = '__rowIndex'

export interface UseTableRowIndexConfig<T extends Record<string, unknown>> {
  data: readonly T[]
  getRowKey?: (item: T) => string
  label?: string
  startFrom?: number
}

export function useTableRowIndex<T extends Record<string, unknown>>(
  config: MaybeRefOrGetter<UseTableRowIndexConfig<T>>,
): TablePlugin<T> {
  return {
    transformColumns(columns) {
      return [{
        key: ROW_INDEX_COLUMN_KEY,
        header: toValue(config).label ?? '#',
        width: pixel(48),
        align: 'end' as const,
        resizable: false,
        renderCell(item: T) {
          const live = toValue(config)
          if (isTableGroupHeader(item))
            return null
          const start = live.startFrom ?? 1
          let seen = 0
          for (const row of live.data) {
            if (isTableGroupHeader(row))
              continue
            const same = live.getRowKey
              ? live.getRowKey(row) === live.getRowKey(item)
              : row === item
            if (same)
              return h('span', { class: 'astryx-table__row-index' }, String(start + seen))
            seen += 1
          }
          return null
        },
      }, ...columns]
    },
  }
}
