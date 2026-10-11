import type { UseCalendarOptions } from './useCalendar.js'
import { CalendarDate } from '@internationalized/date'
import { describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { useCalendar } from './useCalendar.js'

describe('useCalendar', () => {
  it('initializes with current month if no value', () => {
    const value = ref<Date | null>(null)
    const onChange = vi.fn()

    const { focusedDate, dates } = useCalendar({
      value,
      onChange,
    } as UseCalendarOptions)

    expect(focusedDate.value).toBeInstanceOf(CalendarDate)
    expect(dates.value).toHaveLength(6) // 6 weeks
    expect(dates.value[0]).toHaveLength(7) // 7 days per week
  })

  it('initializes with selected date', () => {
    const testDate = new Date(2024, 2, 15) // March 15, 2024
    const value = ref(testDate)
    const onChange = vi.fn()

    const { focusedDate } = useCalendar({
      value,
      onChange,
    } as UseCalendarOptions)

    expect(focusedDate.value.year).toBe(2024)
    expect(focusedDate.value.month).toBe(3)
  })

  it('generates 42 dates (6 weeks)', () => {
    const value = ref<Date | null>(null)
    const onChange = vi.fn()

    const { dates } = useCalendar({
      value,
      onChange,
    } as UseCalendarOptions)

    const totalDates = dates.value.reduce((sum, week) => sum + week.length, 0)
    expect(totalDates).toBe(42)
  })

  it('navigates to previous month', () => {
    const value = ref(new Date(2024, 2, 15)) // March 2024
    const onChange = vi.fn()

    const { focusedDate, previousMonth } = useCalendar({
      value,
      onChange,
    } as UseCalendarOptions)

    previousMonth()

    expect(focusedDate.value.year).toBe(2024)
    expect(focusedDate.value.month).toBe(2) // February
  })

  it('navigates to next month', () => {
    const value = ref(new Date(2024, 2, 15)) // March 2024
    const onChange = vi.fn()

    const { focusedDate, nextMonth } = useCalendar({
      value,
      onChange,
    } as UseCalendarOptions)

    nextMonth()

    expect(focusedDate.value.year).toBe(2024)
    expect(focusedDate.value.month).toBe(4) // April
  })

  it('selects a date', () => {
    const value = ref<Date | null>(null)
    const onChange = vi.fn()

    const { select, dates } = useCalendar({
      value,
      onChange,
    } as UseCalendarOptions)

    const dateToSelect = dates.value[2]![3]! // Some date in the grid
    select(dateToSelect)

    expect(onChange).toHaveBeenCalledWith(expect.any(Date))
  })

  it('identifies selected date', () => {
    const testDate = new Date(2024, 2, 15) // March 15, 2024
    const value = ref(testDate)
    const onChange = vi.fn()

    const { isSelected } = useCalendar({
      value,
      onChange,
    } as UseCalendarOptions)

    const selectedCalendarDate = new CalendarDate(2024, 3, 15)
    const otherCalendarDate = new CalendarDate(2024, 3, 16)

    expect(isSelected(selectedCalendarDate)).toBe(true)
    expect(isSelected(otherCalendarDate)).toBe(false)
  })

  it('identifies dates in current month', () => {
    const value = ref(new Date(2024, 2, 15)) // March 2024
    const onChange = vi.fn()

    const { isInMonth } = useCalendar({
      value,
      onChange,
    } as UseCalendarOptions)

    const marchDate = new CalendarDate(2024, 3, 15)
    const februaryDate = new CalendarDate(2024, 2, 28)

    expect(isInMonth(marchDate)).toBe(true)
    expect(isInMonth(februaryDate)).toBe(false)
  })

  it('disables dates before min', () => {
    const value = ref<Date | null>(null)
    const min = new Date(2024, 2, 10) // March 10, 2024
    const onChange = vi.fn()

    const { isDisabled } = useCalendar({
      value,
      min,
      onChange,
    } as UseCalendarOptions)

    const beforeMin = new CalendarDate(2024, 3, 9)
    const afterMin = new CalendarDate(2024, 3, 11)

    expect(isDisabled(beforeMin)).toBe(true)
    expect(isDisabled(afterMin)).toBe(false)
  })

  it('disables dates after max', () => {
    const value = ref<Date | null>(null)
    const max = new Date(2024, 2, 20) // March 20, 2024
    const onChange = vi.fn()

    const { isDisabled } = useCalendar({
      value,
      max,
      onChange,
    } as UseCalendarOptions)

    const beforeMax = new CalendarDate(2024, 3, 19)
    const afterMax = new CalendarDate(2024, 3, 21)

    expect(isDisabled(beforeMax)).toBe(false)
    expect(isDisabled(afterMax)).toBe(true)
  })

  it('uses custom isDateDisabled function', () => {
    const value = ref<Date | null>(null)
    const isDateDisabled = (date: Date) => date.getDay() === 0 // Disable Sundays
    const onChange = vi.fn()

    const { isDisabled } = useCalendar({
      value,
      isDateDisabled,
      onChange,
    } as UseCalendarOptions)

    // March 3, 2024 is a Sunday
    const sunday = new CalendarDate(2024, 3, 3)
    const monday = new CalendarDate(2024, 3, 4)

    expect(isDisabled(sunday)).toBe(true)
    expect(isDisabled(monday)).toBe(false)
  })

  it('prevents selecting disabled date', () => {
    const value = ref<Date | null>(null)
    const min = new Date(2024, 2, 10)
    const onChange = vi.fn()

    const { select } = useCalendar({
      value,
      min,
      onChange,
    } as UseCalendarOptions)

    const disabledDate = new CalendarDate(2024, 3, 5) // Before min
    select(disabledDate)

    expect(onChange).not.toHaveBeenCalled()
  })

  it('handles year transitions', () => {
    const value = ref(new Date(2024, 0, 15)) // January 2024
    const onChange = vi.fn()

    const { focusedDate, previousMonth, nextMonth } = useCalendar({
      value,
      onChange,
    } as UseCalendarOptions)

    previousMonth()
    expect(focusedDate.value.year).toBe(2023)
    expect(focusedDate.value.month).toBe(12) // December

    nextMonth()
    nextMonth()
    expect(focusedDate.value.year).toBe(2024)
    expect(focusedDate.value.month).toBe(2) // February
  })
})
