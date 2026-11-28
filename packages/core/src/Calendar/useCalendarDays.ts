import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import type { WeekStartsOn } from '../composables/useDateRange.js'
import type { CalendarSystem } from '../utils/calendarSystem.js'
import type { ISODateString } from '../utils/dateTypes.js'
import type { PlainDate } from '../utils/plainDate.js'
import { computed, toValue } from 'vue'
import { resolveWeekStart } from '../composables/useDateRange.js'
import { resolveCalendarSystem } from '../locale/calendar.js'
import { useAstryxLocale } from '../locale/context.js'
import { standaloneShortWeekdayNames } from '../locale/format.js'
import { calendarMonthFromYearMonth } from '../utils/calendarSystem.js'
import { buildMonthWeeks } from './useCalendarGrid.js'

/** 月格子里的一天。 */
export interface CalendarDay {
  /** 这一天的公历日期。 */
  date: PlainDate
  /** `YYYY-MM-DD`，公历。 */
  iso: ISODateString
  /** 不属于这个月、用来补齐首尾两周的日子。 */
  isOutside: boolean
  /** 这一天在它所在的历法月里是第几天。 */
  dayNumber: number
}

export interface UseCalendarDaysOptions {
  /** 要排的月份所在的年，按 `calendar` 的纪年。 */
  year: number
  /** 月份在这一年里是第几个月，从 1 开始。公历 1 是一月；希伯来历闰年从 1 数到 13。 */
  month: number
  /** 一周从哪天开始，0 到 6（0 是周日）或 `'sun'` 到 `'sat'`。默认 0。 */
  weekStartsOn?: WeekStartsOn
  /** 只用这个月需要的行数，不固定六行。默认 false。 */
  hasVariableRowCount?: boolean
  /** 给 `year`、`month` 和每天的 `dayNumber` 编号的历法。每天的 `date` 和 `iso` 始终是公历。不读 provider 的历法。默认 `'gregory'`。 */
  calendar?: CalendarSystem
}

export interface UseCalendarDaysReturn {
  /** 格子里的每一天，按顺序，含首尾补齐的日子。 */
  days: ComputedRef<CalendarDay[]>
  /** 同样的日子，每七天一行。 */
  weeks: ComputedRef<CalendarDay[][]>
  /** 表头的星期名，按当前语言，从 `weekStartsOn` 开始。 */
  dayNames: ComputedRef<string[]>
  /** 格子总数：固定六行时 42，否则行数乘 7。 */
  totalCells: ComputedRef<number>
}

/**
 * 一个月的日子格子：这个月的每一天，加上补齐首尾两周的前后月日子，按周分好，再给一行按语言写的星期名。
 * 和 `Calendar` 用的是同一套排法。只返回数据，渲染、选择、键盘和无障碍语义由调用方负责。
 *
 * @example
 * ```ts
 * const { weeks, dayNames } = useCalendarDays({ year: 2026, month: 12 })
 * // 波斯历 1405 年阿班月，日期仍是公历
 * useCalendarDays({ year: 1405, month: 8, calendar: 'persian' })
 * ```
 */
export function useCalendarDays(options: MaybeRefOrGetter<UseCalendarDaysOptions>): UseCalendarDaysReturn {
  const locale = useAstryxLocale()
  const weekStart = computed(() => resolveWeekStart(toValue(options).weekStartsOn))

  const weeks = computed(() => {
    const { year, month, hasVariableRowCount = false } = toValue(options)
    const calendar = resolveCalendarSystem(toValue(options).calendar ?? 'gregory', 'useCalendarDays')
    const calendarMonth = calendarMonthFromYearMonth(calendar, { year, month })
    return buildMonthWeeks(calendar, calendarMonth, weekStart.value, hasVariableRowCount).map(week => week.days.map(day => ({
      date: { year: day.date.year, month: day.date.month, day: day.date.day },
      iso: day.iso as ISODateString,
      isOutside: day.outside,
      dayNumber: day.day,
    })))
  })
  const days = computed(() => weeks.value.flat())
  const dayNames = computed(() => {
    const names = standaloneShortWeekdayNames(locale.value)
    return Array.from({ length: 7 }, (_, index) => names[(index + weekStart.value) % 7]!)
  })
  const totalCells = computed(() => days.value.length)

  return { days, weeks, dayNames, totalCells }
}
