import type { CalendarDate } from '@internationalized/date'
import type { CalendarGridWeek } from './useCalendarGrid.js'
import { inSpan, sameCalendarDay } from './calendarDate.js'

export interface CalendarDayView {
  iso: string
  date: CalendarDate
  /** 这一天在它所在的历法月里是第几天。 */
  text: number
  outside: boolean
  shown: boolean
  disabled: boolean
  selected: boolean
  inRange: boolean
  /** 范围色带来自悬停预览，还没有提交。 */
  preview: boolean
  /** 这一周里范围色带的第一天或最后一天。 */
  bandStart: boolean
  bandEnd: boolean
  rangeStart: boolean
  rangeEnd: boolean
  today: boolean
  tab: boolean
  roundStart: boolean
  roundEnd: boolean
  label: string
}

export interface CalendarPaintContext {
  /** 色带的起点和终点，已经合并了悬停预览。 */
  start: CalendarDate | null
  end: CalendarDate | null
  preview: boolean
  selected: CalendarDate | null
  today: CalendarDate | null
  focused: CalendarDate
  hasOutsideDays: boolean
  disabled: boolean
  blocked: (date: CalendarDate) => boolean
  /** 日期格子的读屏名字，`isStart`/`isEnd` 表示它是不是范围的端点。 */
  label: (date: CalendarDate, isStart: boolean, isEnd: boolean) => string
}

/** 把一周的格子算成模板直接用的状态：选中、范围色带、圆角、今天、Tab 停靠点和读屏名字。 */
export function paintCalendarWeek(week: CalendarGridWeek, context: CalendarPaintContext): CalendarDayView[] {
  const { start, end, blocked } = context
  const continuesAt = (index: number): boolean => {
    const day = week.days[index]
    return !!day && !day.outside && !blocked(day.date) && inSpan(day.date, start, end)
  }
  return week.days.map((day, index) => {
    const outside = day.outside
    const continues = continuesAt(index)
    const previousContinues = continuesAt(index - 1)
    const nextContinues = continuesAt(index + 1)
    const previous = week.days[index - 1]
    const next = week.days[index + 1]
    const isStart = !!start && !outside && sameCalendarDay(day.date, start)
    const isEnd = !!end && !outside && sameCalendarDay(day.date, end)
    const middle = continues && !isStart && !isEnd
    return {
      iso: day.iso,
      date: day.date,
      text: day.day,
      outside,
      shown: context.hasOutsideDays || !outside,
      disabled: outside || blocked(day.date),
      selected: !outside && ((!!context.selected && sameCalendarDay(day.date, context.selected)) || isStart || isEnd),
      inRange: middle,
      preview: context.preview,
      bandStart: middle && (!previousContinues || (!!start && sameCalendarDay(previous!.date, start))),
      bandEnd: middle && (!nextContinues || (!!end && sameCalendarDay(next!.date, end))),
      rangeStart: isStart,
      rangeEnd: isEnd,
      today: !outside && context.today != null && sameCalendarDay(day.date, context.today),
      tab: !outside && !context.disabled && sameCalendarDay(day.date, context.focused),
      roundStart: continues && (isStart || index === 0 || !previousContinues),
      roundEnd: continues && (isEnd || index === 6 || !nextContinues),
      label: context.label(day.date, isStart, isEnd),
    }
  })
}
