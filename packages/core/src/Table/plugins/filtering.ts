import type { MaybeRefOrGetter, Ref } from 'vue'
import type {
  TableColumn,
  TableFilterField,
  TableFilterState,
  TableFilterValue,
  TableFilterVariant,
  TablePlugin,
} from '../types.js'
import { ref, toValue } from 'vue'
import { cellText, proportional } from '../columnUtils.js'

export interface UseTableFilteringConfig {
  filters: TableFilterState
  onFilterChange: (key: string, value: TableFilterValue | null) => void
  fields: readonly TableFilterField[]
  /** 控件的摆放方式。默认 `popover`。 */
  variant?: TableFilterVariant
}

/** `useTableFilterState()` 的对象写法。 */
export interface UseTableFilterStateOptions {
  /** 打开时就生效的过滤条件。 */
  initialState?: TableFilterState
}

export interface TableFilterStateHandle {
  filters: Ref<TableFilterState>
  onFilterChange: (key: string, value: TableFilterValue | null) => void
  clearAll: () => void
}

function isEmptyValue(value: TableFilterValue | null | undefined): boolean {
  if (value == null || value === '')
    return true
  return Array.isArray(value) && value.length === 0
}

function resolveInitialState(initial?: TableFilterState | UseTableFilterStateOptions): TableFilterState {
  if (initial == null)
    return {}
  const options = (initial as UseTableFilterStateOptions).initialState
  // 过滤条件本身不可能是一个对象，所以键名恰好叫 initialState 的条件也不会被误判。
  if (options != null && typeof options === 'object')
    return { ...options }
  return { ...(initial as TableFilterState) }
}

/**
 * 托住过滤条件。位置参数可以直接给初始条件，也可以写成 `{ initialState }`。
 */
export function useTableFilterState(
  initial?: TableFilterState | UseTableFilterStateOptions,
): TableFilterStateHandle {
  const filters = ref<TableFilterState>(resolveInitialState(initial))
  function onFilterChange(key: string, value: TableFilterValue | null): void {
    const next = { ...filters.value }
    if (value == null || isEmptyValue(value))
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

function toComparableNumber(value: unknown): number | null {
  if (typeof value === 'number')
    return Number.isNaN(value) ? null : value
  if (value instanceof Date)
    return value.getTime()
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (trimmed === '')
      return null
    const parsed = Number(trimmed)
    return Number.isNaN(parsed) ? null : parsed
  }
  return null
}

function toTimestamp(value: unknown): number | null {
  if (value instanceof Date)
    return Number.isNaN(value.getTime()) ? null : value.getTime()
  if (typeof value === 'number')
    return Number.isNaN(value) ? null : value
  if (typeof value === 'string') {
    const parsed = Date.parse(value)
    return Number.isNaN(parsed) ? null : parsed
  }
  return null
}

/** 单元格的值看成一组可比较的文本。数组格的每一项都算一个值。 */
function cellValues(cell: unknown): string[] {
  if (Array.isArray(cell))
    return cell.map(item => cellText(item).toLowerCase())
  return [cellText(cell).toLowerCase()]
}

function matchesField(value: TableFilterValue, cell: unknown, kind: TableFilterField['type']): boolean {
  switch (kind) {
    case 'enum':
    case 'multi-select': {
      const selected = (Array.isArray(value) ? value : [value]).map(item => String(item).toLowerCase())
      const values = cellValues(cell)
      return selected.some(item => values.includes(item))
    }
    case 'number': {
      const target = toComparableNumber(value)
      const actual = toComparableNumber(cell)
      return target != null && actual != null && target === actual
    }
    case 'date': {
      const target = toTimestamp(value)
      const actual = toTimestamp(cell)
      return target != null && actual != null && actual > target
    }
    default:
      return cellText(cell).toLowerCase().includes(String(value).toLowerCase())
  }
}

/**
 * 按当前过滤条件挑出符合条件的行。每个条件都要满足。
 * `string` 匹配子串，`enum` / `multi-select` 匹配选项，`number` 比数值，`date` 要求单元格日期更晚。
 */
export function applyTableFilters<T extends Record<string, unknown>>(
  rows: readonly T[],
  filters: TableFilterState,
  fields: readonly TableFilterField[] = [],
): T[] {
  const kinds = new Map(fields.map(field => [field.key, field.type]))
  const active = Object.entries(filters).filter(([, value]) => !isEmptyValue(value))
  if (active.length === 0)
    return [...rows]
  return rows.filter(row => active.every(([key, value]) => {
    const kind = kinds.get(key) ?? (Array.isArray(value) ? 'multi-select' : 'string')
    return matchesField(value, row[key], kind)
  }))
}

export function useTableFiltering<T extends Record<string, unknown>>(
  config: MaybeRefOrGetter<UseTableFilteringConfig>,
): TablePlugin<T> {
  const variantOf = (): TableFilterVariant => toValue(config).variant ?? 'popover'
  return {
    transformColumns(columns: TableColumn<T>[]) {
      const variant = variantOf()
      if (variant !== 'inline' && variant !== 'inline-compact')
        return columns
      // 行内控件的宽度靠比例列撑开：没写宽度的过滤列按 1 份分空间。
      return columns.map(column => column.filter != null && column.width == null
        ? { ...column, width: proportional(1) }
        : column)
    },
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
