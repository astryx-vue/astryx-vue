const weekdayStart = new Date(2023, 0, 1)

/** CLDR stand-alone short names. Intl `short` is Sun/Mon, which is not the calendar header. */
const standaloneShortWeekdays = {
  'en': ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  'zh-CN': ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
} as const

export function standaloneShortWeekdayNames(locale: string): readonly string[] {
  if (locale === 'en' || locale === 'zh-CN')
    return standaloneShortWeekdays[locale]
  return weekdayNames(locale, 'short')
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
