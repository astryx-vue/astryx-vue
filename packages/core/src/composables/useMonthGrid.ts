import type { WeekStartsOn } from './useDateRange.js'
import { CalendarDate } from '@internationalized/date'
import { resolveWeekStart } from './useDateRange.js'

export function toISODate(date: CalendarDate): string {
  const month = String(date.month).padStart(2, '0')
  const day = String(date.day).padStart(2, '0')
  return `${date.year}-${month}-${day}`
}

export function parseISODate(value: string): CalendarDate {
  const [year, month, day] = value.split('-').map(Number)
  return new CalendarDate(year, month, day)
}

export function buildMonthGrid(year: number, month: number, weekStartsOn?: WeekStartsOn | number): string[][] {
  const first = new CalendarDate(year, month, 1)
  const start = resolveWeekStart(weekStartsOn)
  const offset = (first.toDate('UTC').getUTCDay() - start + 7) % 7
  let cursor = first.subtract({ days: offset })
  const weeks: string[][] = []
  for (let week = 0; week < 6; week += 1) {
    const days: string[] = []
    for (let day = 0; day < 7; day += 1) {
      days.push(toISODate(cursor))
      cursor = cursor.add({ days: 1 })
    }
    weeks.push(days)
  }
  return weeks
}

export function addMonths(year: number, month: number, amount: number): { year: number, month: number } {
  const date = new CalendarDate(year, month, 1).add({ months: amount })
  return { year: date.year, month: date.month }
}

export function todayISODate(): string {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}
