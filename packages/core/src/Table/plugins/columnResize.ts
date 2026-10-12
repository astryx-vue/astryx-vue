import type { MaybeRefOrGetter } from 'vue'
import type { TableColumn, TablePlugin } from '../types.js'
import { toValue } from 'vue'

export interface UseTableColumnResizeConfig {
  columnWidths: Record<string, number>
  onColumnResizeEnd: (updates: Record<string, number>) => void
}

export function useTableColumnResize<T extends Record<string, unknown>>(
  config: MaybeRefOrGetter<UseTableColumnResizeConfig>,
): TablePlugin<T> {
  return {
    widthFor(column: TableColumn<T>) {
      return toValue(config).columnWidths[column.key]
    },
    onColumnResizeEnd(key, width) {
      toValue(config).onColumnResizeEnd({ [key]: Math.max(60, Math.round(width)) })
    },
  }
}
