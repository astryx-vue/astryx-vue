import type { MaybeRefOrGetter, Ref } from 'vue'
import type { TableColumn, TableFilterField, TableFilterState, TableFilterValue, TablePlugin } from '../types.js'
import { ref, toValue } from 'vue'

export interface UseTableFilteringConfig {
  filters: TableFilterState
  onFilterChange: (key: string, value: TableFilterValue | null) => void
  fields: readonly TableFilterField[]
  variant?: 'inline' | 'popover'
}

export function useTableFilterState(initial: TableFilterState = {}): {
  filters: Ref<TableFilterState>
  onFilterChange: (key: string, value: TableFilterValue | null) => void
  clearAll: () => void
} {
  const filters = ref<TableFilterState>({ ...initial })
  function onFilterChange(key: string, value: TableFilterValue | null): void {
    const next = { ...filters.value }
    if (value == null || value === '' || (Array.isArray(value) && value.length === 0))
      delete next[key]
    else
      next[key] = value
    filters.value = next
  }
  function clearAll(): void {
    filters.value = {}
  }
  return { filters, onFilterChange, clearAll }
}

export function applyTableFilters<T extends Record<string, unknown>>(
  rows: readonly T[],
  filters: TableFilterState,
  fields: readonly TableFilterField[] = [],
): T[] {
  const kinds = new Map(fields.map(field => [field.key, field.type]))
  const active = Object.entries(filters).filter(([, value]) => value != null && value !== '' && !(Array.isArray(value) && value.length === 0))
  if (active.length === 0)
    return [...rows]
  return rows.filter(row => active.every(([key, value]) => {
    const cell = String(row[key] ?? '').toLowerCase()
    const kind = kinds.get(key) ?? (Array.isArray(value) ? 'enum' : 'string')
    if (kind === 'enum') {
      const selected = Array.isArray(value) ? value : [value]
      return selected.some(item => cell === item.toLowerCase())
    }
    return cell.includes(String(value).toLowerCase())
  }))
}

export function useTableFiltering<T extends Record<string, unknown>>(
  config: MaybeRefOrGetter<UseTableFilteringConfig>,
): TablePlugin<T> {
  return {
    filterFor(column: TableColumn<T>) {
      if (column.filter == null)
        return null
      const current = toValue(config)
      const fieldKey = column.filter
      const field = current.fields.find(item => item.key === fieldKey)
      if (field == null)
        return null
      return {
        variant: current.variant ?? 'popover',
        field,
        value: current.filters[fieldKey] ?? null,
        onChange(value) {
          toValue(config).onFilterChange(fieldKey, value)
        },
      }
    },
  }
}
