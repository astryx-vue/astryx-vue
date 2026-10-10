import { CalendarDate } from '@internationalized/date'
import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { useCalendar } from './useCalendar.js'

describe('useCalendar', () => {
  it('应该生成正确的月份网格（42 天）', () => {
    const displayDate = ref(new CalendarDate(2024, 1, 15))
    const calendar = useCalendar({ displayDate })

    const grid = calendar.monthGrid.value
    expect(grid).toHaveLength(6)
    expect(grid[0]).toHaveLength(7)
    expect(grid.flat()).toHaveLength(42)
  })

  it('应该包含当前月份的所有天数', () => {
    const displayDate = ref(new CalendarDate(2024, 1, 15))
    const calendar = useCalendar({ displayDate })

    const allDays = calendar.monthGrid.value.flat()
    const januaryDays = allDays.filter(d => d.month === 1 && d.year === 2024)

    expect(januaryDays).toHaveLength(31)
  })

  it('应该从星期日开始每周', () => {
    const displayDate = ref(new CalendarDate(2024, 1, 15))
    const calendar = useCalendar({ displayDate })

    const firstWeek = calendar.monthGrid.value[0]
    const firstDay = firstWeek[0]

    const jsDate = new Date(firstDay.year, firstDay.month - 1, firstDay.day)
    expect(jsDate.getDay()).toBe(0)
  })

  it('应该正确导航到上个月', () => {
    const displayDate = ref(new CalendarDate(2024, 2, 15))
    const calendar = useCalendar({ displayDate })

    calendar.previousMonth()

    expect(displayDate.value.month).toBe(1)
    expect(displayDate.value.year).toBe(2024)
  })

  it('应该正确导航到下个月', () => {
    const displayDate = ref(new CalendarDate(2024, 1, 15))
    const calendar = useCalendar({ displayDate })

    calendar.nextMonth()

    expect(displayDate.value.month).toBe(2)
    expect(displayDate.value.year).toBe(2024)
  })

  it('跨年导航应该正确', () => {
    const displayDate = ref(new CalendarDate(2024, 1, 15))
    const calendar = useCalendar({ displayDate })

    calendar.previousMonth()

    expect(displayDate.value.month).toBe(12)
    expect(displayDate.value.year).toBe(2023)
  })

  it('应该正确判断是否是当前月份的日期', () => {
    const displayDate = ref(new CalendarDate(2024, 1, 15))
    const calendar = useCalendar({ displayDate })

    const grid = calendar.monthGrid.value
    const firstWeek = grid[0]

    const inMonth = firstWeek.find(d => d.month === 1)
    const notInMonth = firstWeek.find(d => d.month !== 1)

    expect(calendar.isInDisplayMonth(inMonth!)).toBe(true)
    if (notInMonth) {
      expect(calendar.isInDisplayMonth(notInMonth)).toBe(false)
    }
  })

  it('应该正确判断今天', () => {
    const now = new Date()
    const today = new CalendarDate(now.getFullYear(), now.getMonth() + 1, now.getDate())
    const displayDate = ref(today)
    const calendar = useCalendar({ displayDate })

    expect(calendar.isToday(today)).toBe(true)

    const yesterday = today.subtract({ days: 1 })
    expect(calendar.isToday(yesterday)).toBe(false)
  })

  it('应该返回正确的月份和年份', () => {
    const displayDate = ref(new CalendarDate(2024, 3, 15))
    const calendar = useCalendar({ displayDate })

    expect(calendar.displayMonth.value).toBe(3)
    expect(calendar.displayYear.value).toBe(2024)
  })
})
