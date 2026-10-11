import type { AstryxLocale } from './types.js'

const weekdayStart = new Date(2023, 0, 1)

export function formatCalendarMonth(year: number, month: number, locale: AstryxLocale): string {
  return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(new Date(year, month - 1, 1))
}

export function weekdayNames(locale: AstryxLocale, style: 'long' | 'narrow'): string[] {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: style })
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekdayStart)
    date.setDate(weekdayStart.getDate() + index)
    return formatter.format(date)
  })
}
