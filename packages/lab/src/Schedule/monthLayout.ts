import type { PlainDate } from '@astryx-vue/core'
import type { CalendarEvent } from './types.js'
import {
  plainDateFromInstant,
  plainDateIsAfter,
  plainDateIsBefore,
  plainDateToInstant,
} from '@astryx-vue/core'
import { isDayEvent } from './dateMath.js'

/** 一周一行最多画这么多层。 */
export const MONTH_VISIBLE_LEVELS = 3

const DAYS_PER_WEEK = 7

export interface MonthChipPlacement {
  readonly event: CalendarEvent
  readonly week: number
  readonly columnStart: number
  readonly columnEnd: number
  readonly level: number
}

export interface MonthDayOverflow {
  readonly dayIndex: number
  readonly week: number
  readonly column: number
  /** 这一天没有画出来的事件数。 */
  readonly count: number
}

export interface MonthLayout {
  readonly chips: ReadonlyArray<MonthChipPlacement>
  readonly overflow: ReadonlyArray<MonthDayOverflow>
}

interface RangedEvent {
  readonly event: CalendarEvent
  readonly startIndex: number
  readonly endIndex: number
  readonly isPriority: boolean
  readonly start: number
}

/**
 * 每个事件在它经过的每一周里，占这一周所有覆盖日上都空着的最低一层。
 * 某一天需要第四层或更高时，第三层让给「+N more」，N 是这一天第三层及以上的事件数。
 * 跨过这种日子的第三层色块只画在其余日子上。
 */
export function layoutMonthEvents(
  events: ReadonlyArray<CalendarEvent>,
  days: ReadonlyArray<PlainDate>,
  timezoneID: string,
): MonthLayout {
  const firstDay = days[0]
  const lastDay = days[days.length - 1]
  if (firstDay == null || lastDay == null)
    return { chips: [], overflow: [] }

  const ranged = events
    .flatMap((event): RangedEvent[] => {
      const [eventStart, eventEnd] = getEventDateSpan(event, timezoneID)
      if (plainDateIsBefore(eventEnd, firstDay) || plainDateIsAfter(eventStart, lastDay))
        return []
      const startIndex = days.findIndex(day => !plainDateIsBefore(day, eventStart))
      let endIndex = days.length - 1
      while (endIndex > 0 && plainDateIsAfter(days[endIndex], eventEnd))
        endIndex -= 1
      if (startIndex < 0 || endIndex < startIndex)
        return []
      return [{
        event,
        startIndex,
        endIndex,
        isPriority: isDayEvent(event) || endIndex > startIndex,
        start: isDayEvent(event) ? plainDateToInstant(event.start, timezoneID) : event.start,
      }]
    })
    .sort(compareRangedEvents)

  const levelsByWeek: number[][] = []
  const placements: MonthChipPlacement[] = []
  for (const { event, startIndex, endIndex } of ranged) {
    const firstWeek = Math.floor(startIndex / DAYS_PER_WEEK)
    const lastWeek = Math.floor(endIndex / DAYS_PER_WEEK)
    for (let week = firstWeek; week <= lastWeek; week += 1) {
      const columnStart = week === firstWeek ? startIndex % DAYS_PER_WEEK : 0
      const columnEnd = week === lastWeek ? endIndex % DAYS_PER_WEEK : DAYS_PER_WEEK - 1
      const weekLevels = (levelsByWeek[week] ??= [])
      const freeLevel = weekLevels.findIndex(occupiedTo => occupiedTo < columnStart)
      const level = freeLevel >= 0 ? freeLevel : weekLevels.length
      weekLevels[level] = columnEnd
      placements.push({ event, week, columnStart, columnEnd, level })
    }
  }

  const lastPaintedLevel = MONTH_VISIBLE_LEVELS - 1
  const isBusy = Array.from({ length: days.length }).fill(false) as boolean[]
  const countedOnDay = Array.from({ length: days.length }).fill(0) as number[]
  for (const placement of placements) {
    forEachDay(placement, (dayIndex) => {
      if (placement.level > lastPaintedLevel)
        isBusy[dayIndex] = true
      if (placement.level >= lastPaintedLevel)
        countedOnDay[dayIndex] += 1
    })
  }

  const chips: MonthChipPlacement[] = []
  for (const placement of placements) {
    if (placement.level < lastPaintedLevel) {
      chips.push(placement)
    }
    else if (placement.level === lastPaintedLevel) {
      let runStart: number | null = null
      for (let column = placement.columnStart; column <= placement.columnEnd + 1; column += 1) {
        const isFree = column <= placement.columnEnd && !isBusy[placement.week * DAYS_PER_WEEK + column]
        if (isFree && runStart == null) {
          runStart = column
        }
        else if (!isFree && runStart != null) {
          chips.push({ ...placement, columnStart: runStart, columnEnd: column - 1 })
          runStart = null
        }
      }
    }
  }

  const overflow: MonthDayOverflow[] = []
  isBusy.forEach((busy, dayIndex) => {
    if (busy) {
      overflow.push({
        dayIndex,
        week: Math.floor(dayIndex / DAYS_PER_WEEK),
        column: dayIndex % DAYS_PER_WEEK,
        count: countedOnDay[dayIndex],
      })
    }
  })

  return { chips, overflow }
}

function compareRangedEvents(a: RangedEvent, b: RangedEvent): number {
  if (a.startIndex !== b.startIndex)
    return a.startIndex - b.startIndex
  if (a.isPriority !== b.isPriority)
    return a.isPriority ? -1 : 1
  const durationDifference = b.endIndex - b.startIndex - (a.endIndex - a.startIndex)
  if (durationDifference !== 0)
    return durationDifference
  if (a.start !== b.start)
    return a.start - b.start
  const titleOrder = a.event.title.localeCompare(b.event.title)
  if (titleOrder !== 0)
    return titleOrder
  return a.event.id < b.event.id ? -1 : a.event.id > b.event.id ? 1 : 0
}

function forEachDay(placement: MonthChipPlacement, visit: (dayIndex: number) => void): void {
  for (let column = placement.columnStart; column <= placement.columnEnd; column += 1)
    visit(placement.week * DAYS_PER_WEEK + column)
}

/** 事件在日程时区里覆盖的第一天和最后一天。 */
export function getEventDateSpan(event: CalendarEvent, timezoneID: string): [PlainDate, PlainDate] {
  if (isDayEvent(event))
    return [event.start, event.end]
  return [
    plainDateFromInstant(event.start, timezoneID),
    plainDateFromInstant(Math.max(event.end - 1, event.start), timezoneID),
  ]
}
