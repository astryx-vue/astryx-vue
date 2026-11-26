import type { MaybeRefOrGetter } from 'vue'
import type { TableColumn, TablePlugin } from '../types.js'
import { computed, h, toValue } from 'vue'
import { pixel } from '../columnUtils.js'
import { isTableGroupHeader } from './groupedRows.js'

export const ROW_INDEX_COLUMN_KEY = '__rowIndex'

export interface UseTableRowIndexConfig<T extends Record<string, unknown>> {
  /**
   * 编号顺序跟着的数组。不传时按表格渲染出的位置编号，跟着当前的排序、筛选和分页走。
   * 传了就按这个数组里的位置编号（例如分组表格传未分组的行），分组头不占号。
   */
  data?: readonly T[]
  /** 配合 `data` 用：按返回的字符串匹配行，不按对象身份。 */
  getRowKey?: (item: T) => string
  label?: string
  startFrom?: number
}

/** 按 `data` 里的位置查行号：分组头不占号，键或对象身份对上就算同一行。 */
function createLookup<T extends Record<string, unknown>>(data: readonly T[], getRowKey?: (item: T) => string) {
  const positions = new Map<unknown, number>()
  let seen = 0
  for (const row of data) {
    if (isTableGroupHeader(row))
      continue
    positions.set(getRowKey ? getRowKey(row) : row, seen)
    seen += 1
  }
  return (item: T): number | undefined => positions.get(getRowKey ? getRowKey(item) : item)
}

export function useTableRowIndex<T extends Record<string, unknown>>(
  config: MaybeRefOrGetter<UseTableRowIndexConfig<T>> = {},
): TablePlugin<T> {
  const lookup = computed(() => {
    const { data, getRowKey } = toValue(config)
    return data == null ? null : createLookup(data, getRowKey)
  })
  return {
    transformColumns(columns) {
      const indexColumn: TableColumn<T> = {
        key: ROW_INDEX_COLUMN_KEY,
        header: toValue(config).label ?? '#',
        width: pixel(48),
        align: 'end' as const,
        resizable: false,
        renderCell(item: T, index: number) {
          if (isTableGroupHeader(item))
            return null
          const position = lookup.value == null ? index : lookup.value(item)
          if (position == null)
            return null
          const start = toValue(config).startFrom ?? 1
          return h('span', { class: 'astryx-table__row-index' }, String(start + position))
        },
      }
      return [indexColumn, ...columns]
    },
  }
}
