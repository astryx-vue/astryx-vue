import type { Ref } from 'vue'
import { CalendarDate, getLocalTimeZone, today } from '@internationalized/date'
import { computed, ref } from 'vue'

export interface UseCalendarOptions {
  /** 当前选中的日期 */
  value: Ref<Date | null>
  /** 打开时先显示这一天所在的月份 */
  initialDate?: Date
  /** 最小可选日期 */
  min?: Date
  /** 最大可选日期 */
  max?: Date
  /** 禁用的日期判断函数 */
  isDateDisabled?: (date: Date) => boolean
  /** 日期变化回调 */
  onChange: (date: Date | null) => void
}

export interface CalendarState {
  /** 当前显示的月份（CalendarDate） */
  focusedDate: Ref<CalendarDate>
  /** 当前月份的所有日期（包括前后月份的填充日期） */
  dates: Ref<CalendarDate[][]>
  /** 生成任意月份的六周网格 */
  datesFor: (month: CalendarDate) => CalendarDate[][]
  /** 选中日期 */
  select: (date: CalendarDate) => void
  /** 上一月 */
  previousMonth: () => void
  /** 下一月 */
  nextMonth: () => void
  /** 判断日期是否选中 */
  isSelected: (date: CalendarDate) => boolean
  /** 判断日期是否禁用 */
  isDisabled: (date: CalendarDate) => boolean
  /** 判断日期是否在当前月 */
  isInMonth: (date: CalendarDate) => boolean
}

function calendarDateToJSDate(date: CalendarDate): Date {
  return new Date(date.year, date.month - 1, date.day)
}

function jsDateToCalendarDate(date: Date): CalendarDate {
  return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate())
}

/**
 * 日历逻辑：日期计算、月份导航、日期选择。
 */
export function useCalendar(options: UseCalendarOptions): CalendarState {
  const { value, min, max, isDateDisabled, onChange, initialDate } = options

  const timeZone = getLocalTimeZone()

  const focusedDate = ref(
    initialDate
      ? jsDateToCalendarDate(initialDate)
      : value.value
        ? jsDateToCalendarDate(value.value)
        : today(timeZone),
  ) as Ref<CalendarDate>

  function datesFor(month: CalendarDate): CalendarDate[][] {
    const firstDay = new CalendarDate(month.year, month.month, 1)
    const firstDayOfWeek = firstDay.toDate(timeZone).getDay()
    const startDate = firstDay.subtract({ days: firstDayOfWeek })
    const weeks: CalendarDate[][] = []
    let currentDate = startDate

    for (let week = 0; week < 6; week++) {
      const weekDates: CalendarDate[] = []
      for (let day = 0; day < 7; day++) {
        weekDates.push(currentDate)
        currentDate = currentDate.add({ days: 1 })
      }
      weeks.push(weekDates)
    }

    return weeks
  }

  const dates = computed(() => datesFor(focusedDate.value))

  function select(date: CalendarDate): void {
    if (isDisabled(date))
      return
    onChange(calendarDateToJSDate(date))
  }

  function previousMonth(): void {
    focusedDate.value = focusedDate.value.subtract({ months: 1 })
  }

  function nextMonth(): void {
    focusedDate.value = focusedDate.value.add({ months: 1 })
  }

  function isSelected(date: CalendarDate): boolean {
    if (!value.value)
      return false
    const selected = jsDateToCalendarDate(value.value)
    return date.compare(selected) === 0
  }

  function isDisabled(date: CalendarDate): boolean {
    const jsDate = calendarDateToJSDate(date)

    if (min && jsDate < min)
      return true
    if (max && jsDate > max)
      return true
    if (isDateDisabled?.(jsDate))
      return true

    return false
  }

  function isInMonth(date: CalendarDate): boolean {
    return date.month === focusedDate.value.month
  }

  return {
    focusedDate,
    dates,
    datesFor,
    select,
    previousMonth,
    nextMonth,
    isSelected,
    isDisabled,
    isInMonth,
  }
}
