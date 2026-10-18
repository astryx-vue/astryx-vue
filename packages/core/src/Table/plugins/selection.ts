import type { MaybeRefOrGetter } from 'vue'
import type { TablePlugin } from '../types.js'
import { computed, toValue } from 'vue'

export interface UseTableSelectionStateConfig<T extends Record<string, unknown>> {
  data: MaybeRefOrGetter<readonly T[]>
  idKey: keyof T & string
  selectedKeys: MaybeRefOrGetter<ReadonlySet<string>>
  setSelectedKeys: (keys: Set<string>) => void
  getRowLabel?: (item: T) => string
  hasRowHighlight?: boolean
}

function rowId<T extends Record<string, unknown>>(row: T, idKey: string): string {
  return String(row[idKey] ?? '')
}

/**
 * 选择状态的只读快照。`useTableSelectionState` 返回它，选择相关的界面直接读这几个字段，
 * 不用自己再数 `selectedKeys`。
 */
export interface TableSelectionState {
  /** 选中的全部键，含不在当前页里的行。 */
  readonly selectedKeys: ReadonlySet<string>
  /** 选中的键的总数。 */
  readonly selectedCount: number
  /** 是否至少选中了一个键。 */
  readonly hasSelection: boolean
  /** 清空全部选中的键。 */
  clearSelection: () => void
}

export function useTableSelectionState<T extends Record<string, unknown>>(config: UseTableSelectionStateConfig<T>): {
  selectionConfig: UseTableSelectionConfig<T> & { readonly rows: readonly T[] }
  selectionState: TableSelectionState
} {
  const selectable = computed(() => toValue(config.data))
  const selectedKeys = computed(() => toValue(config.selectedKeys))
  const selectionConfig = {
    getIsItemSelected: (item: T) => selectedKeys.value.has(rowId(item, config.idKey)),
    onSelectItem: ({ item, isSelected }: { item: T, isSelected: boolean }) => {
      const next = new Set(selectedKeys.value)
      const id = rowId(item, config.idKey)
      if (isSelected)
        next.add(id)
      else
        next.delete(id)
      config.setSelectedKeys(next)
    },
    onSelectAll: ({ isAllSelected }: { isAllSelected: boolean }) => {
      config.setSelectedKeys(isAllSelected
        ? new Set(toValue(config.data).map(item => rowId(item, config.idKey)))
        : new Set())
    },
    getIsAllSelected: () => {
      const rows = selectable.value
      return rows.length > 0 && rows.every(item => selectedKeys.value.has(rowId(item, config.idKey)))
    },
    getIsIndeterminate: () => {
      const rows = selectable.value
      const count = rows.filter(item => selectedKeys.value.has(rowId(item, config.idKey))).length
      return count > 0 && count < rows.length
    },
    getRowLabel: config.getRowLabel,
    hasRowHighlight: config.hasRowHighlight,
    get rows() {
      return selectable.value
    },
  }
  const selectionState: TableSelectionState = {
    get selectedKeys() {
      return selectedKeys.value
    },
    get selectedCount() {
      return selectedKeys.value.size
    },
    get hasSelection() {
      return selectedKeys.value.size > 0
    },
    clearSelection: () => config.setSelectedKeys(new Set()),
  }
  return { selectionConfig, selectionState }
}

export interface UseTableSelectionConfig<T extends Record<string, unknown>> {
  getIsItemSelected: (item: T) => boolean
  onSelectItem: (event: { item: T, isSelected: boolean }) => void
  onSelectAll: (event: { isAllSelected: boolean }) => void
  getIsAllSelected: () => boolean
  getIsIndeterminate?: () => boolean
  getIsItemSelectable?: (item: T) => boolean
  getRowLabel?: (item: T) => string
  hasRowHighlight?: boolean
}

export function useTableSelection<T extends Record<string, unknown>>(
  config: MaybeRefOrGetter<UseTableSelectionConfig<T>>,
): TablePlugin<T> {
  return {
    selection: {
      isAllSelected: () => toValue(config).getIsAllSelected(),
      isIndeterminate: () => toValue(config).getIsIndeterminate?.() ?? false,
      isSelected: row => toValue(config).getIsItemSelected(row),
      isSelectable: row => toValue(config).getIsItemSelectable?.(row) ?? true,
      selectAll: selected => toValue(config).onSelectAll({ isAllSelected: selected }),
      selectRow: (row, selected) => toValue(config).onSelectItem({ item: row, isSelected: selected }),
      rowLabel: row => toValue(config).getRowLabel?.(row) ?? '',
      hasRowHighlight: toValue(config).hasRowHighlight,
    },
  }
}
