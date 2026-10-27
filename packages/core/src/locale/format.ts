import type { StandaloneShortWeekdayNames } from './weekdays.js'
import { standaloneShortWeekdayNamesByLocale } from './weekdays.js'

const weekdayStart = new Date(2023, 0, 1)
const englishWeekdays = standaloneShortWeekdayNamesByLocale.en!

/**
 * 日历表头用的短星期名，从周日开始。
 * 先找完整标签，再找基础语言（`fr-FR` 找 `fr`），都没有时回到英文，和原版一致。
 */
export function standaloneShortWeekdayNames(locale: string): StandaloneShortWeekdayNames {
  try {
    const parsed = new Intl.Locale(locale)
    return standaloneShortWeekdayNamesByLocale[parsed.baseName]
      ?? standaloneShortWeekdayNamesByLocale[parsed.language]
      ?? englishWeekdays
  }
  catch {
    return englishWeekdays
  }
}

export function formatCalendarMonth(year: number, month: number, locale: string): string {
  return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(new Date(year, month - 1, 1))
}

export function weekdayNames(locale: string, style: 'long' | 'narrow' | 'short'): string[] {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: style })
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekdayStart)
    date.setDate(weekdayStart.getDate() + index)
    return formatter.format(date)
  })
}
