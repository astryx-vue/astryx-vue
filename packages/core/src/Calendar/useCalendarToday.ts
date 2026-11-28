import type { CalendarDate } from '@internationalized/date'
import type { ComputedRef, Ref, ShallowRef } from 'vue'
import type { CalendarSystem } from '../utils/calendarSystem.js'
import type { CalendarProps } from './types.js'
import { CalendarDate as CalendarDay } from '@internationalized/date'
import { computed, getCurrentInstance, shallowRef } from 'vue'
import { fromCalendarDate, initialCalendarFocus, toCalendarDate } from './calendarDate.js'

export interface CalendarToday {
  hasExplicitOpening: boolean
  isMonthPending: ComputedRef<boolean>
  isResolvingToday: () => boolean
  openingFocus: (known: CalendarDate | null) => CalendarDate
  resolveToday: (apply: (known: CalendarDate) => void) => void
  today: ShallowRef<CalendarDate | null>
}

/**
 * 日历的「今天」。服务端和浏览器可能在不同的日期（不同时区）：渲染和接管服务端 HTML 时先不知道今天，
 * 挂载之后再读，两边的标记才对得上。只在浏览器里直接挂载（没有服务端 HTML 可对）时马上就知道。
 *
 * 没有 `focusDate` 也没有值时，开着的月份要由今天决定：今天还不知道时给一个占位月份，
 * 月份格子先占着位置藏起来（`isMonthPending`），挂载后一读到今天就换成真的月份。
 */
export function useCalendarToday(props: CalendarProps, monthCount: Ref<1 | 2>, calendar: Ref<CalendarSystem>): CalendarToday {
  const isServerOrHydrating = typeof document === 'undefined' || getCurrentInstance()?.vnode.el != null
  const today = shallowRef<CalendarDate | null>(isServerOrHydrating ? null : toCalendarDate(new Date()))
  const hasExplicitOpening = Boolean(props.focusDate || (props.mode === 'single' && props.modelValue) || props.range?.start)
  const isMonthPending = computed(() => today.value == null && !hasExplicitOpening)
  let isResolving = false

  /** 开着的月份。今天不知道又没有明确的日期时是占位月份。 */
  function openingFocus(known: CalendarDate | null): CalendarDate {
    if (known == null && !hasExplicitOpening)
      return new CalendarDay(2000, 1, 1)
    return initialCalendarFocus({
      focusDate: props.focusDate,
      selected: props.mode === 'single' ? props.modelValue : null,
      rangeStart: props.range?.start ?? null,
      min: props.min,
      max: props.max,
      numberOfMonths: monthCount.value,
      today: known == null ? undefined : fromCalendarDate(known),
      calendar: calendar.value,
    })
  }

  /** 挂载时调：今天还不知道就读一次，再让调用方据此换月份。读的这一刻不算用户翻页，月份不播报。 */
  function resolveToday(apply: (known: CalendarDate) => void): void {
    if (today.value != null)
      return
    const known = toCalendarDate(new Date())
    isResolving = true
    today.value = known
    apply(known)
    isResolving = false
  }

  return { hasExplicitOpening, isMonthPending, isResolvingToday: () => isResolving, openingFocus, resolveToday, today }
}
