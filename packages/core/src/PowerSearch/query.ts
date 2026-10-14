import type { FilterValue, PowerSearchConfig, PowerSearchFieldDefinition, PowerSearchFieldType, PowerSearchFilter } from './types.js'
import { buildPowerSearchField } from './fieldBuilders.js'
import { resolveDateTimeRangePart } from './range.js'

interface FieldTypeToValue {
  string: string
  number: number
  boolean: boolean
  date: Date | number
  enum: string
  enum_list: readonly string[]
  string_list: readonly string[]
}

export type InferPowerSearchData<D extends readonly PowerSearchFieldDefinition[]> = {
  [F in D[number] as F['key']]: FieldTypeToValue[F['type']]
}

const stringHandlers: Record<string, (value: string, target: string) => boolean> = {
  contains: (value, target) => value.includes(target),
  not_contains: (value, target) => !value.includes(target),
  starts_with: (value, target) => value.startsWith(target),
  not_starts_with: (value, target) => !value.startsWith(target),
  ends_with: (value, target) => value.endsWith(target),
  not_ends_with: (value, target) => !value.endsWith(target),
  is: (value, target) => value === target,
  is_not: (value, target) => value !== target,
}

const numberHandlers: Record<string, (value: number, target: number) => boolean> = {
  equals: (value, target) => value === target,
  not_equals: (value, target) => value !== target,
  greater_than: (value, target) => value > target,
  less_than: (value, target) => value < target,
  greater_than_or_equal: (value, target) => value >= target,
  less_than_or_equal: (value, target) => value <= target,
}

function toUnixSeconds(value: Date | number): number {
  return value instanceof Date ? Math.floor(value.getTime() / 1000) : value
}

function toStringValues(value: unknown): string[] | null {
  if (typeof value === 'string')
    return [value]
  if (Array.isArray(value) && value.every(item => typeof item === 'string'))
    return value
  return null
}

function isAnyOperator(operator: string): boolean {
  return operator === 'or' || operator === 'any' || operator === 'any_of' || operator.includes('any')
}

function matchesNested(row: Record<string, unknown>, value: FilterValue, operator: string): boolean {
  if (value.type !== 'nested')
    return true
  const checks = value.value.map(filter => matchesPowerSearchFilter(row, filter))
  if (checks.length === 0)
    return true
  return isAnyOperator(operator) ? checks.some(Boolean) : checks.every(Boolean)
}

export function matchesPowerSearchFilter(row: Record<string, unknown>, filter: PowerSearchFilter): boolean {
  const fieldValue = row[filter.field]
  const { operator, value } = filter
  switch (value.type) {
    case 'empty':
      if (operator === 'is_true')
        return Boolean(fieldValue) === true
      if (operator === 'is_false')
        return Boolean(fieldValue) === false
      return true
    case 'string': {
      if (typeof fieldValue !== 'string')
        return false
      const handler = stringHandlers[operator]
      return handler ? handler(fieldValue.toLowerCase(), value.value.toLowerCase()) : true
    }
    case 'integer':
    case 'float': {
      if (typeof fieldValue !== 'number')
        return false
      const handler = numberHandlers[operator]
      return handler ? handler(fieldValue, value.value) : true
    }
    case 'date_absolute': {
      if (!(fieldValue instanceof Date) && typeof fieldValue !== 'number')
        return false
      const stamp = toUnixSeconds(fieldValue)
      if (operator === 'before')
        return stamp < value.unixSeconds
      if (operator === 'after')
        return stamp > value.unixSeconds
      return true
    }
    case 'date_range': {
      if (!(fieldValue instanceof Date) && typeof fieldValue !== 'number')
        return false
      if (operator !== 'between')
        return true
      const now = Date.now() / 1000
      const stamp = toUnixSeconds(fieldValue)
      const start = resolveDateTimeRangePart(value.value.start, now)
      const end = resolveDateTimeRangePart(value.value.end, now)
      return stamp >= start && stamp <= end
    }
    case 'enum':
      if (typeof fieldValue !== 'string')
        return false
      if (operator === 'is')
        return fieldValue === value.value
      if (operator === 'is_not')
        return fieldValue !== value.value
      return true
    case 'enum_list':
    case 'string_list': {
      const values = toStringValues(fieldValue)
      if (values == null)
        return false
      if (operator === 'is_any_of')
        return values.some(item => value.value.includes(item))
      if (operator === 'is_none_of')
        return values.every(item => !value.value.includes(item))
      return true
    }
    case 'nested':
      return matchesNested(row, value, operator)
    case 'time':
    case 'date_relative':
    case 'entity_list':
    case 'custom':
      return true
  }
}

export function applyPowerSearchFilters<T extends Record<string, unknown>>(
  filters: readonly PowerSearchFilter[],
  data: readonly T[],
): T[] {
  if (filters.length === 0)
    return [...data]
  return data.filter(row => filters.every(filter => matchesPowerSearchFilter(row, filter)))
}

export function createPowerSearchConfig<const D extends readonly PowerSearchFieldDefinition[]>(
  definitions: D,
  configName?: string,
): {
  config: PowerSearchConfig
  applyFilters: <T extends InferPowerSearchData<D>>(filters: readonly PowerSearchFilter[], data: readonly T[]) => T[]
} {
  const config: PowerSearchConfig = {
    name: configName ?? 'PowerSearchConfig',
    fields: definitions.map(definition => buildPowerSearchField(definition)),
  }
  return {
    config,
    applyFilters<T extends InferPowerSearchData<D>>(filters: readonly PowerSearchFilter[], data: readonly T[]) {
      return applyPowerSearchFilters(filters, data as readonly Record<string, unknown>[]) as T[]
    },
  }
}

export function usePowerSearchConfig<const D extends readonly PowerSearchFieldDefinition[]>(
  definitions: D,
  configName?: string,
): ReturnType<typeof createPowerSearchConfig<D>> {
  return createPowerSearchConfig(definitions, configName)
}

export type { PowerSearchFieldType }
