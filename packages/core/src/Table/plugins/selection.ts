import type { MaybeRefOrGetter, VNodeChild } from 'vue'
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

export function useTableSelectionState<T extends Record<string, unknown>>(config: UseTableSelectionStateConfig<T>) {
  const selectable = computed(() => toValue(config.data))
  const selectionConfig = {
    getIsItemSelected: (item: T) => toValue(config.selectedKeys).has(rowId(item, config.idKey)),
    onSelectItem: ({ item, isSelected }: { item: T, isSelected: boolean }) => {
      const next = new Set(toValue(config.selectedKeys))
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
      const rows = toValue(config.data)
      const selected = toValue(config.selectedKeys)
      return rows.length > 0 && rows.every(item => selected.has(rowId(item, config.idKey)))
    },
    getIsIndeterminate: () => {
      const rows = toValue(config.data)
      const selected = toValue(config.selectedKeys)
      const count = rows.filter(item => selected.has(rowId(item, config.idKey))).length
      return count > 0 && count < rows.length
    },
    getRowLabel: config.getRowLabel,
    hasRowHighlight: config.hasRowHighlight,
    get rows() {
      return selectable.value
    },
  }
  return { selectionConfig }
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

export interface TableSelectionToolbarProps {
  count: number
}

export function selectionSummary(count: number, label: (count: number) => string): VNodeChild {
  return label(count)
}
