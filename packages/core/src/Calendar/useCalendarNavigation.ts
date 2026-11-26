import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue'
import type { CalendarSystem, CalendarYearMonth } from '../utils/calendarSystem.js'
import type { ISODateString } from '../utils/dateTypes.js'
import type { PlainDate } from '../utils/plainDate.js'
import { computed, readonly, shallowRef, toValue } from 'vue'
import { resolveCalendarSystem } from '../locale/calendar.js'
import { useAstryxLocale } from '../locale/context.js'
import { formatCalendarMonthLabel } from '../utils/calendarFormat.js'
import { calendarAddMonths, calendarMonthOf, calendarYearMonthOf } from '../utils/calendarSystem.js'
import { plainDateAddDays, plainDateFromISO, plainDateToday, plainDateToISO } from '../utils/plainDate.js'

export interface UseCalendarNavigationOptions {
  /** 不受控时，从这一天所在的月开始。 */
  initialValue?: ISODateString
  /** 受控时显示这一天所在的月。和 `onFocusDateChange` 一起传。 */
  focusDate?: ISODateString
  /** 翻月时收到新月份的第一天（公历 ISO）。 */
  onFocusDateChange?: (focusDate: ISODateString) => void
  /** 同时显示几个月。默认 1。 */
  numberOfMonths?: 1 | 2
  /** 按哪种历法翻月和写月份标题。日期仍是公历 ISO。不读 provider 的历法。默认 `'gregory'`。 */
  calendar?: CalendarSystem
}

export interface UseCalendarNavigationReturn {
  /** 当前月第一天的公历日期。 */
  baseMonth: ComputedRef<PlainDate>
  /** 每个可见月第一天的公历日期。 */
  visibleMonths: ComputedRef<PlainDate[]>
  /** 每个可见月在 `calendar` 里的年和月，可以直接交给同一历法的 `useCalendarDays`。 */
  visibleCalendarMonths: ComputedRef<CalendarYearMonth[]>
  /** 月份标题，按当前语言和 `calendar` 写；两个月时用 ` – ` 连起来。 */
  monthYearLabel: ComputedRef<string>
  /** 往后（正数）或往前（负数）翻 `delta` 个月。传了 `focusedDate` 时，按 `offset`（默认 7）算出翻过去后要聚焦的日子。 */
  navigateMonth: (delta: number, focusedDate?: ISODateString, offset?: number) => void
  /** 翻月后要聚焦的日子，没有时为 null。 */
  pendingFocus: Readonly<Ref<ISODateString | null>>
  /** 那一天拿到焦点后清掉 `pendingFocus`。 */
  clearPendingFocus: () => void
}

/**
 * 日历的月份导航：当前显示哪个月、上一月和下一月、月份标题，以及键盘跨月时下一个要聚焦的日子。
 * 自己拼日历头、翻页按钮或双月选择器时用。
 *
 * @example
 * ```ts
 * const nav = useCalendarNavigation({ initialValue: '2026-01-15', calendar: 'persian' })
 * const { weeks } = useCalendarDays(() => ({ ...nav.visibleCalendarMonths.value[0]!, calendar: 'persian' }))
 * nav.navigateMonth(1)
 * ```
 */
export function useCalendarNavigation(options: MaybeRefOrGetter<UseCalendarNavigationOptions>): UseCalendarNavigationReturn {
  const locale = useAstryxLocale()
  const initial = toValue(options)
  const internal = shallowRef<PlainDate>(plainDateFromISO(initial.focusDate ?? initial.initialValue ?? plainDateToISO(plainDateToday())))
  const pendingFocus = shallowRef<ISODateString | null>(null)

  const calendar = computed(() => resolveCalendarSystem(toValue(options).calendar ?? 'gregory', 'useCalendarNavigation'))
  const isControlled = (): boolean => {
    const { focusDate, onFocusDateChange } = toValue(options)
    return focusDate !== undefined && onFocusDateChange !== undefined
  }
  const focusIso = computed(() => isControlled() ? toValue(options).focusDate! : plainDateToISO(internal.value))

  const shownMonths = computed(() => {
    const first = calendarMonthOf(calendar.value, plainDateFromISO(focusIso.value))
    return Array.from({ length: toValue(options).numberOfMonths ?? 1 }, (_, index) => calendarAddMonths(calendar.value, first, index))
  })
  const visibleMonths = computed(() => shownMonths.value.map(month => month.start))
  const baseMonth = computed(() => visibleMonths.value[0]!)
  const visibleCalendarMonths = computed(() => shownMonths.value.map(month => calendarYearMonthOf(calendar.value, month)))
  const monthYearLabel = computed(() => shownMonths.value.map(month => formatCalendarMonthLabel(calendar.value, month, locale.value)).join(' – '))

  function navigateMonth(delta: number, focusedDate?: ISODateString, offset = 7): void {
    const next = calendarAddMonths(calendar.value, shownMonths.value[0]!, delta).start
    if (focusedDate)
      pendingFocus.value = plainDateToISO(plainDateAddDays(plainDateFromISO(focusedDate), delta * offset))
    toValue(options).onFocusDateChange?.(plainDateToISO(next))
    if (!isControlled())
      internal.value = next
  }

  function clearPendingFocus(): void {
    pendingFocus.value = null
  }

  return {
    baseMonth,
    visibleMonths,
    visibleCalendarMonths,
    monthYearLabel,
    navigateMonth,
    pendingFocus: readonly(pendingFocus),
    clearPendingFocus,
  }
}
