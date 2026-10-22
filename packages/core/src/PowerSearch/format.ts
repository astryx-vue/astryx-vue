import type { PowerSearchMessages } from '../locale/messages/power-search.js'
import type { EnumItem, FilterValue, OperatorValue } from './types.js'
import { characterCount, truncateCharacters } from '../utils/characters.js'

function truncate(value: string, maxLength: number): string {
  return truncateCharacters(value, maxLength)
}

function enumLabel(value: string, values: readonly EnumItem[]): string {
  return values.find(item => item.value === value)?.label ?? value
}

function formatNumber(value: number, locale: string, units?: string): string {
  const formatted = new Intl.NumberFormat(locale).format(value)
  return units ? `${formatted} ${units}` : formatted
}

export function formatDateAbsolute(unixSeconds: number, locale: string, timeZone?: string): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    ...(timeZone ? { timeZone } : {}),
    calendar: 'gregory',
  }).format(unixSeconds * 1000)
}

export function formatDateAbsoluteCompact(unixSeconds: number, locale: string, timeZone?: string): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...(timeZone ? { timeZone } : {}),
    calendar: 'gregory',
  }).format(unixSeconds * 1000)
}

function joinOrCount(labels: readonly string[], maxLength: number, countLabel: (count: number) => string): string {
  if (labels.length === 0)
    return ''
  if (labels.length === 1)
    return truncate(labels[0] ?? '', maxLength)
  const joined = labels.join(', ')
  if (characterCount(joined) <= maxLength)
    return joined
  return countLabel(labels.length)
}

export function formatFilterValue(
  operatorValue: OperatorValue,
  filterValue: FilterValue,
  maxLength: number,
  messages: PowerSearchMessages,
  locale: string,
  timeZone?: string,
): string {
  switch (filterValue.type) {
    case 'empty':
      return ''
    case 'string':
      return truncate(filterValue.value, maxLength)
    case 'integer':
      return formatNumber(filterValue.value, locale, operatorValue.type === 'integer' ? operatorValue.units : undefined)
    case 'float':
      return formatNumber(filterValue.value, locale, operatorValue.type === 'float' ? operatorValue.units : undefined)
    case 'enum':
      return truncate(operatorValue.type === 'enum' ? enumLabel(filterValue.value, operatorValue.values) : filterValue.value, maxLength)
    case 'string_list':
      return joinOrCount(filterValue.value, maxLength, messages.itemsCount)
    case 'enum_list': {
      const labels = operatorValue.type === 'enum_list'
        ? filterValue.value.map(value => enumLabel(value, operatorValue.values))
        : filterValue.value
      return joinOrCount(labels, maxLength, messages.itemsCount)
    }
    case 'entity_list':
      return joinOrCount(filterValue.value.map(entity => entity.label), maxLength, messages.entitiesCount)
    case 'time':
      return filterValue.value
    case 'date_absolute':
      return truncate(
        operatorValue.type === 'date_absolute' && operatorValue.isDateOnly
          ? formatDateAbsoluteCompact(filterValue.unixSeconds, locale, timeZone)
          : formatDateAbsolute(filterValue.unixSeconds, locale, timeZone),
        maxLength,
      )
    case 'date_relative':
      return filterValue.value
    case 'date_range':
      return messages.dateRange
    case 'custom':
      return truncate(operatorValue.type === 'custom' ? operatorValue.getString(filterValue.value) : filterValue.value, maxLength)
    case 'nested':
      return messages.filtersCount(filterValue.value.length)
  }
}
