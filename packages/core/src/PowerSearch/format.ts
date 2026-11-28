import type { PowerSearchMessages } from '../locale/messages/power-search.js'
import type { CalendarSystem } from '../utils/calendarSystem.js'
import type { EnumItem, FilterValue, OperatorValue } from './types.js'
import { formatCalendarInstant } from '../utils/calendarFormat.js'
import { characterCount, truncateCharacters } from '../utils/characters.js'
import { isDateOnlyOperator, resolveDateZone } from './dateZone.js'

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

/** 带时刻的日期，例如 "Oct 30, 2026, 3:00 PM"。日期按 `calendar` 写，默认公历。 */
export function formatDateAbsolute(unixSeconds: number, locale: string, timeZone?: string, calendar: CalendarSystem = 'gregory'): string {
  return formatCalendarInstant(calendar, new Date(unixSeconds * 1000), {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }, locale, timeZone || undefined)
}

/** 只有日期，例如 "Oct 30, 2026"。日期按 `calendar` 写，默认公历。 */
export function formatDateAbsoluteCompact(unixSeconds: number, locale: string, timeZone?: string, calendar: CalendarSystem = 'gregory'): string {
  return formatCalendarInstant(calendar, new Date(unixSeconds * 1000), {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }, locale, timeZone || undefined)
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
  calendar: CalendarSystem = 'gregory',
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
        isDateOnlyOperator(operatorValue)
          ? formatDateAbsoluteCompact(filterValue.unixSeconds, locale, resolveDateZone(timeZone, true), calendar)
          : formatDateAbsolute(filterValue.unixSeconds, locale, timeZone, calendar),
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
