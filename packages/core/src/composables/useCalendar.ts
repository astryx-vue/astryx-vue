import type { Ref } from 'vue'
import type { CalendarConstraintInput } from '../Calendar/useCalendarConstraints.js'
import { CalendarDate, getLocalTimeZone, today } from '@internationalized/date'
import { computed, ref } from 'vue'
import { isCalendarDateDisabled } from '../Calendar/useCalendarConstraints.js'
import { buildCalendarWeeks } from '../Calendar/useCalendarGrid.js'

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
  /** 返回 false 的约束会禁用这一天 */
  dateConstraints?: CalendarConstraintInput['dateConstraints']
  /** 一周从哪一天开始，0 是周日 */
  weekStartsOn?: number
  /** 按当月收缩行数。默认固定六行 */
  hasVariableRowCount?: boolean
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
  const { value, min, max, isDateDisabled, dateConstraints, onChange, initialDate } = options
  const weekStartsOn = options.weekStartsOn ?? 0
  const variableRows = options.hasVariableRowCount ?? false

  const timeZone = getLocalTimeZone()

  const focusedDate = ref(
    initialDate
      ? jsDateToCalendarDate(initialDate)
      : value.value
        ? jsDateToCalendarDate(value.value)
        : today(timeZone),
  ) as Ref<CalendarDate>

  function datesFor(month: CalendarDate): CalendarDate[][] {
    return buildCalendarWeeks(month.year, month.month, weekStartsOn, variableRows)
      .map(week => week.days.map(day => day.date))
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
    return isCalendarDateDisabled(date, { min, max, isDateDisabled, dateConstraints })
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
