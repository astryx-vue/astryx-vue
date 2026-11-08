import type { PlainDate } from '@astryx-vue/core'
import type { InjectionKey } from 'vue'
import type { Instant } from './types.js'
import { plainDateFromInstant, plainDateIsEqual } from '@astryx-vue/core'
import { getMinutesSinceStartOfDay } from './format.js'

export interface TimeGridRangeKey {
  start: Instant
  end: Instant
  timezoneID: string
  minHour: number
  maxHour: number
  hourHeight: number
}

export interface TimeGridScrollMemory {
  key: TimeGridRangeKey | null
  offset: number
}

export const TimeGridScrollKey: InjectionKey<TimeGridScrollMemory> = Symbol('TimeGridScroll')

export function isSameRangeKey(a: TimeGridRangeKey, b: TimeGridRangeKey): boolean {
  return a.start === b.start
    && a.end === b.end
    && a.timezoneID === b.timezoneID
    && a.minHour === b.minHour
    && a.maxHour === b.maxHour
    && a.hourHeight === b.hourHeight
}

/** 区间里有今天时，打开在当前时刻上方一小时；否则停在小时窗口顶部。 */
export function getInitialTimeGridOffset({
  currentTime,
  days,
  timezoneID,
  minHour,
  hourHeight,
  scrollHeight,
  clientHeight,
}: {
  currentTime: Instant
  days: ReadonlyArray<PlainDate>
  timezoneID: string
  minHour: number
  hourHeight: number
  scrollHeight: number
  clientHeight: number
}): number {
  const maxOffset = Math.max(0, scrollHeight - clientHeight)
  const today = plainDateFromInstant(currentTime, timezoneID)
  if (!days.some(day => plainDateIsEqual(day, today)))
    return 0
  const currentMinute = getMinutesSinceStartOfDay(currentTime, timezoneID)
  const nowOffset = ((currentMinute - minHour * 60) / 60) * hourHeight + 2
  return Math.min(maxOffset, Math.max(0, Math.round(nowOffset - hourHeight)))
}
