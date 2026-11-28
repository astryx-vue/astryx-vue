import type { CalendarDate } from '@internationalized/date'
import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import type { ISODateString } from '../utils/dateTypes.js'
import type { PlainDate } from '../utils/plainDate.js'
import { computed, toValue } from 'vue'
import { plainDateDiffDays, plainDateFromDate, plainDateFromISO, plainDateIsAfter, plainDateIsBefore, plainDateToDate } from '../utils/plainDate.js'

/** 判断一天能不能选的全部规则。 */
interface DayRules {
  min: PlainDate | null
  max: PlainDate | null
  isDateDisabled?: (date: Date) => boolean
  dateConstraints?: ReadonlyArray<(date: Date) => boolean>
  minRangeSpan?: number
  maxRangeSpan?: number
  rangeAnchor?: PlainDate | null
}

/**
 * 范围、跨度和自定义规则里任何一条不让选，这一天就不可选。
 * 跨度把两端都算上，所以最多 7 天时，起点前后各能走 6 天；起点自己始终可选，好让人改选或取消。
 */
function isDayDisabled(date: PlainDate, rules: DayRules): boolean {
  if (rules.min && plainDateIsBefore(date, rules.min))
    return true
  if (rules.max && plainDateIsAfter(date, rules.max))
    return true

  const anchor = rules.rangeAnchor
  if (anchor) {
    const distance = Math.abs(plainDateDiffDays(anchor, date))
    if (rules.maxRangeSpan != null && distance > rules.maxRangeSpan - 1)
      return true
    if (rules.minRangeSpan != null && distance > 0 && distance < rules.minRangeSpan - 1)
      return true
  }

  if (rules.isDateDisabled == null && !rules.dateConstraints?.length)
    return false
  const jsDate = plainDateToDate(date)
  if (rules.isDateDisabled?.(jsDate))
    return true
  return rules.dateConstraints?.some(constraint => !constraint(jsDate)) ?? false
}

export interface CalendarConstraintInput {
  min?: Date
  max?: Date
  /** 返回 true 时禁用这一天，和约束列表一起生效。 */
  isDateDisabled?: (date: Date) => boolean
  /** 任何一个函数返回 false，这一天就禁用。 */
  dateConstraints?: ReadonlyArray<(date: Date) => boolean>
  minRangeSpan?: number
  maxRangeSpan?: number
  rangeAnchor?: CalendarDate | null
}

/** 组件内部用：边界是 `Date`，格子里的日子是 `CalendarDate`。 */
export function isCalendarDateDisabled(date: CalendarDate, input: CalendarConstraintInput): boolean {
  return isDayDisabled(date, {
    ...input,
    min: input.min ? plainDateFromDate(input.min) : null,
    max: input.max ? plainDateFromDate(input.max) : null,
  })
}

export function isOutsideCalendarBounds(date: CalendarDate, min?: Date, max?: Date): boolean {
  return isDayDisabled(date, {
    min: min ? plainDateFromDate(min) : null,
    max: max ? plainDateFromDate(max) : null,
  })
}

export interface UseCalendarConstraintsOptions {
  /** 最早能选的日期，`YYYY-MM-DD`。 */
  min?: ISODateString
  /** 最晚能选的日期，`YYYY-MM-DD`。 */
  max?: ISODateString
  /** 自定义规则，拿到原生 `Date`；任何一个返回 false，这一天就不可选。 */
  dateConstraints?: ReadonlyArray<(date: Date) => boolean>
  /** 范围最多跨几天，两端都算（7 就是 7 天的窗口）。有了 `rangeAnchor` 才生效。 */
  maxRangeSpan?: number
  /** 范围最少跨几天，两端都算（2 就是不能只选一天）。起点本身始终可选。 */
  minRangeSpan?: number
  /** 正在选的范围起点（点了第一下、还没点第二下）。跨度从这里量；没在选时为 null。 */
  rangeAnchor?: PlainDate | null
}

export interface UseCalendarConstraintsReturn {
  /** 这一天不可选时返回 true。每次调用都读最新的选项。 */
  isDateDisabled: (date: PlainDate) => boolean
  /** 解析后的 `min`，没给时为 null。 */
  minDate: ComputedRef<PlainDate | null>
  /** 解析后的 `max`，没给时为 null。 */
  maxDate: ComputedRef<PlainDate | null>
}

/**
 * 日期能不能选：把 `min` / `max`、从范围起点量的跨度和自定义规则合成一个判断函数。
 * 只返回数据，格子怎么画、怎么选由调用方决定。
 *
 * @example
 * ```ts
 * const anchor = ref<PlainDate | null>(null)
 * const { isDateDisabled } = useCalendarConstraints(() => ({
 *   min: '2026-06-05',
 *   max: '2026-06-25',
 *   maxRangeSpan: 8,
 *   rangeAnchor: anchor.value,
 *   dateConstraints: [date => date.getDay() !== 1],
 * }))
 * isDateDisabled({ year: 2026, month: 6, day: 15 })
 * ```
 */
export function useCalendarConstraints(options: MaybeRefOrGetter<UseCalendarConstraintsOptions>): UseCalendarConstraintsReturn {
  const minDate = computed(() => {
    const min = toValue(options).min
    return min ? plainDateFromISO(min) : null
  })
  const maxDate = computed(() => {
    const max = toValue(options).max
    return max ? plainDateFromISO(max) : null
  })

  function isDateDisabled(date: PlainDate): boolean {
    const { dateConstraints, minRangeSpan, maxRangeSpan, rangeAnchor } = toValue(options)
    return isDayDisabled(date, { min: minDate.value, max: maxDate.value, dateConstraints, minRangeSpan, maxRangeSpan, rangeAnchor })
  }

  return { isDateDisabled, minDate, maxDate }
}
