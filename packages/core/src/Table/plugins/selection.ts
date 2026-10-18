import type { MaybeRefOrGetter } from 'vue'
import type { TablePlugin } from '../types.js'
import { toValue } from 'vue'

/**
 * 选中集合的写入方式。钩子总是算好新的 `Set` 再交出去，所以接到值直接赋值就行；
 * 原版那种同时支持 updater 的派发器（参数更宽）也能直接传进来。
 */
export type TableSelectedKeysSetter = (keys: Set<string>) => void

export interface UseTableSelectionStateConfig<T extends Record<string, unknown>> {
  data: MaybeRefOrGetter<readonly T[]>
  /** 行的唯一键：属性名，或者从行里取出键的函数。 */
  idKey: (keyof T & string) | ((item: T) => string)
  selectedKeys: MaybeRefOrGetter<ReadonlySet<string>>
  setSelectedKeys: TableSelectedKeysSetter
  /** 这一行显示复选框吗。为 false 的行连复选框都没有，也不算进全选。 */
  getIsItemSelectable?: (item: T) => boolean
  /** 这一行的复选框能点吗。为 false 的行复选框是禁用的，全选时保留它原来的状态。 */
  getIsItemEnabled?: (item: T) => boolean
  getRowLabel?: (item: T) => string
  hasRowHighlight?: boolean
}

function rowId<T extends Record<string, unknown>>(row: T, idKey: (keyof T & string) | ((item: T) => string)): string {
  if (typeof idKey === 'function')
    return String(idKey(row))
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
  readonly clearSelection: () => void
}

export function useTableSelectionState<T extends Record<string, unknown>>(config: UseTableSelectionStateConfig<T>): {
  selectionConfig: UseTableSelectionConfig<T> & { readonly rows: readonly T[] }
  selectionState: TableSelectionState
} {
  const rows = (): readonly T[] => toValue(config.data)
  const selectedKeys = (): ReadonlySet<string> => toValue(config.selectedKeys)
  const isSelectable = (item: T): boolean => config.getIsItemSelectable?.(item) ?? true
  const isEnabled = (item: T): boolean => config.getIsItemEnabled?.(item) ?? true
  /** 能勾的行：既显示复选框，又没被禁用。 */
  const isTogglable = (item: T): boolean => isSelectable(item) && isEnabled(item)
  const keysOf = (items: readonly T[]): Set<string> => new Set(items.map(item => rowId(item, config.idKey)))

  /** 全选时要打开的键：已选中的加上所有能勾的行。 */
  function selectableKeys(): Set<string> {
    return keysOf(rows().filter(isTogglable))
  }

  /** 全选时要保留的键：不在可勾集合里的（点名选中、被禁用、不在当前数据里）一律保留。 */
  function frozenKeys(): Set<string> {
    const selectable = selectableKeys()
    const frozen = new Set<string>()
    for (const key of selectedKeys()) {
      if (!selectable.has(key))
        frozen.add(key)
    }
    return frozen
  }

  function write(keys: Set<string>): void {
    config.setSelectedKeys(keys)
  }
  const selectionConfig = {
    getIsItemSelected: (item: T) => selectedKeys().has(rowId(item, config.idKey)),
    onSelectItem: ({ item, isSelected }: { item: T, isSelected: boolean }) => {
      const next = new Set(selectedKeys())
      const id = rowId(item, config.idKey)
      if (isSelected)
        next.add(id)
      else
        next.delete(id)
      write(next)
    },
    onSelectAll: ({ isAllSelected }: { isAllSelected: boolean }) => {
      if (!isAllSelected) {
        write(frozenKeys())
        return
      }
      const next = new Set(selectedKeys())
      for (const key of selectableKeys())
        next.add(key)
      write(next)
    },
    getIsAllSelected: () => {
      const selectable = selectableKeys()
      if (selectable.size === 0)
        return false
      const keys = selectedKeys()
      for (const key of selectable) {
        if (!keys.has(key))
          return false
      }
      return true
    },
    getIsIndeterminate: () => {
      const selectable = selectableKeys()
      const keys = selectedKeys()
      let count = 0
      for (const key of selectable) {
        if (keys.has(key))
          count += 1
      }
      return count > 0 && count < selectable.size
    },
    getIsItemSelectable: isSelectable,
    getIsItemEnabled: isEnabled,
    getRowLabel: config.getRowLabel,
    hasRowHighlight: config.hasRowHighlight,
    get rows() {
      return rows()
    },
  }
  const selectionState: TableSelectionState = {
    get selectedKeys() {
      return selectedKeys()
    },
    get selectedCount() {
      return selectedKeys().size
    },
    get hasSelection() {
      return selectedKeys().size > 0
    },
    clearSelection: () => write(new Set()),
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
  getIsItemEnabled?: (item: T) => boolean
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
      isEnabled: row => toValue(config).getIsItemEnabled?.(row) ?? true,
      selectAll: selected => toValue(config).onSelectAll({ isAllSelected: selected }),
      selectRow: (row, selected) => toValue(config).onSelectItem({ item: row, isSelected: selected }),
      rowLabel: row => toValue(config).getRowLabel?.(row) ?? '',
      hasRowHighlight: toValue(config).hasRowHighlight,
    },
  }
}
