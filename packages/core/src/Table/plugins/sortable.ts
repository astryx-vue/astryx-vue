import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue'
import type { TableColumn, TablePlugin, TableSortDirection, TableSortState } from '../types.js'
import { computed, ref, toValue } from 'vue'
import { useAstryxMessages } from '../../locale/context.js'
import { useCollator } from '../../locale/useCollator.js'
import { sortRows } from '../columnUtils.js'

export interface UseTableSortableConfig<TSortKey extends string = string> {
  sort: TableSortState<TSortKey>
  onSortChange: (sort: TableSortState<TSortKey>) => void
  allowUnsortedState?: boolean
  isMultiSortEnabled?: boolean
}

export function useTableSortableState<T extends Record<string, unknown>>(options: {
  data: MaybeRefOrGetter<readonly T[]>
  columns?: MaybeRefOrGetter<readonly TableColumn<T>[]>
  defaultSort?: TableSortState
}): {
  sortedData: ComputedRef<T[]>
  sort: Ref<TableSortState>
  sortConfig: UseTableSortableConfig
} {
  const sort = ref<TableSortState>(options.defaultSort ?? [])
  const collator = useCollator({ numeric: true })
  const sortedData = computed(() => sortRows(toValue(options.data), sort.value, toValue(options.columns) ?? [], collator.value))
  const sortConfig: UseTableSortableConfig = {
    get sort() {
      return sort.value
    },
    onSortChange(next) {
      sort.value = next
    },
  }
  return { sortedData, sort, sortConfig }
}

function sortKeyOf<T extends Record<string, unknown>>(column: TableColumn<T>): string | null {
  if (!column.sortable)
    return null
  if (column.sortable === true)
    return column.key
  return column.sortable.sortKey ?? column.key
}

function headerLabel<T extends Record<string, unknown>>(column: TableColumn<T>): string {
  return column.header ?? column.key
}

function nextDirection(current: TableSortDirection | null, allowUnsorted: boolean): TableSortDirection | null {
  if (current == null)
    return 'ascending'
  if (current === 'ascending')
    return 'descending'
  return allowUnsorted ? null : 'ascending'
}

export function useTableSortable<T extends Record<string, unknown>>(
  config: MaybeRefOrGetter<UseTableSortableConfig>,
): TablePlugin<T> {
  const messages = useAstryxMessages()
  return {
    sortFor(column) {
      const key = sortKeyOf(column)
      if (key == null)
        return null
      const current = toValue(config)
      const index = current.sort.findIndex(entry => entry.sortKey === key)
      const direction = index >= 0 ? current.sort[index]!.direction : null
      const rank = current.sort.length > 1 && index >= 0 ? index + 1 : null
      const label = headerLabel(column)
      const action = direction == null
        ? messages.value.table.sortAscending
        : direction === 'ascending'
          ? messages.value.table.sortDescending
          : messages.value.table.clearSort
      return {
        direction,
        rank,
        label: `${messages.value.table.sortBy(label)}. ${action}`,
        onClick(event) {
          const latest = toValue(config)
          const allowUnsorted = latest.allowUnsortedState ?? true
          const multi = (latest.isMultiSortEnabled ?? false) && event.shiftKey
          const existing = latest.sort.findIndex(entry => entry.sortKey === key)
          const currentDirection = existing >= 0 ? latest.sort[existing]!.direction : null
          const direction = nextDirection(currentDirection, allowUnsorted)
          if (!multi) {
            latest.onSortChange(direction == null ? [] : [{ sortKey: key, direction }])
            return
          }
          const next = latest.sort.filter(entry => entry.sortKey !== key)
          if (direction != null)
            next.push({ sortKey: key, direction })
          latest.onSortChange(next)
        },
      }
    },
  }
}
