import type { StandaloneShortWeekdayNames } from './weekdays.js'
import { firstCharacter } from '../utils/characters.js'
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

/**
 * 内置语言里，CLDR（contextTransforms）把单独出现的月份名首字母大写的那些。
 * `Intl` 按句中写法格式化月份，这些语言的日历标题会以小写开头（"octubre de 2026"）。
 */
const STANDALONE_MONTH_CAPITAL_LANGUAGES: ReadonlySet<string> = new Set(['es', 'fr', 'it', 'nl', 'pl', 'ru', 'uk'])

/**
 * 月份加年份，用在单独成行的地方：日历标题、月份网格的名字。
 * 和日历表头的星期名一样用单独出现的写法，CLDR 要求大写的语言首字母大写。
 */
export function formatCalendarMonth(year: number, month: number, locale: string): string {
  const label = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(new Date(year, month - 1, 1))
  let language: string
  try {
    language = new Intl.Locale(locale).language
  }
  catch {
    return label
  }
  if (!STANDALONE_MONTH_CAPITAL_LANGUAGES.has(language))
    return label
  const first = firstCharacter(label)
  return first.toLocaleUpperCase(locale) + label.slice(first.length)
}

export function weekdayNames(locale: string, style: 'long' | 'narrow' | 'short'): string[] {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: style })
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekdayStart)
    date.setDate(weekdayStart.getDate() + index)
    return formatter.format(date)
  })
}
