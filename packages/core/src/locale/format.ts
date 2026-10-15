import type { AstryxLocale } from './types.js'

const weekdayStart = new Date(2023, 0, 1)

/** CLDR stand-alone short names. Intl `short` is Sun/Mon, which is not the calendar header. */
const standaloneShortWeekdays: Record<AstryxLocale, readonly [string, string, string, string, string, string, string]> = {
  'en': ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  'zh-CN': ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
}

export function standaloneShortWeekdayNames(locale: AstryxLocale): readonly string[] {
  return standaloneShortWeekdays[locale]
}

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
