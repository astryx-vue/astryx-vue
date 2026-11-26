import type { PickerWheelOption } from './PickerWheel.vue'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { formatCalendarYearLabel } from '../utils/calendarFormat.js'
import { calendarMonthFromYearMonth, calendarMonthOf } from '../utils/calendarSystem.js'
import { plainDateCreate } from '../utils/plainDate.js'
import PickerWheel from './PickerWheel.vue'
import { clampMonth, isMonthOutside, reachableMonths } from './sheetMonths.js'
import TouchDateSheet from './TouchDateSheet.vue'

/** 2026-10-30 是波斯历 1405 年阿班月 8 日。 */
const ABAN_8 = new Date(2026, 9, 30)

afterEach(() => {
  document.body.innerHTML = ''
})

async function mountSheet(props: Record<string, unknown>) {
  const wrapper = mount(TouchDateSheet, { attachTo: document.body, props })
  await nextTick()
  return wrapper
}

describe('touchDateSheet 按历法翻月', () => {
  it('标题、日子和翻页都按波斯历月', async () => {
    const wrapper = await mountSheet({ calendar: 'persian', selected: ABAN_8 })
    expect(wrapper.get('.astryx-date-touch-title').text()).toBe('Aban 1405 AP')
    await wrapper.get('[aria-label="Next month"]').trigger('click')
    expect(wrapper.get('.astryx-date-touch-title').text()).toBe('Azar 1405 AP')
  })

  it('月份和年份滚轮用历法的名字，选中项是历法的月和年', async () => {
    const wrapper = await mountSheet({ calendar: 'persian', selected: ABAN_8 })
    await wrapper.get('.astryx-date-touch-title').trigger('click')
    const [months, years] = wrapper.findAllComponents(PickerWheel)
    const monthOptions = months!.props('options') as PickerWheelOption[]
    expect(monthOptions.map(option => option.label)).toContain('Aban')
    expect(months!.props('modelValue')).toBe('8')
    expect(years!.props('modelValue')).toBe('1405')
    const yearOptions = years!.props('options') as PickerWheelOption[]
    expect(yearOptions.find(option => option.value === '1405')?.label).toBe('1405 AP')
  })

  it('希伯来历闰年有 13 个月', async () => {
    const wrapper = await mountSheet({ calendar: 'hebrew', selected: new Date(2024, 2, 15) })
    await wrapper.get('.astryx-date-touch-title').trigger('click')
    const [months] = wrapper.findAllComponents(PickerWheel)
    expect((months!.props('options') as PickerWheelOption[]).length).toBe(13)
  })

  it('公历照旧', async () => {
    const wrapper = await mountSheet({ calendar: 'gregory', selected: ABAN_8 })
    expect(wrapper.get('.astryx-date-touch-title').text()).toBe('October 2026')
  })
})

describe('面板可翻到的历法月', () => {
  const today = new Date(2026, 9, 30)

  it('min 和 max 落在历法月里', () => {
    const range = reachableMonths('persian', new Date(2026, 9, 25), new Date(2026, 11, 1), today)
    expect(range.min.start).toEqual(plainDateCreate(2026, 10, 23))
    expect(range.max.start).toEqual(plainDateCreate(2026, 11, 22))
  })

  it('范围外的月份被夹回边界', () => {
    const range = reachableMonths('persian', new Date(2026, 9, 25), new Date(2026, 11, 1), today)
    const later = calendarMonthOf('persian', plainDateCreate(2027, 3, 1))
    expect(isMonthOutside(later, range)).toBe(true)
    expect(clampMonth(later, range)).toEqual(range.max)
  })
})

describe('历法年份标签', () => {
  it('公历只写数字，其他历法带纪元', () => {
    expect(formatCalendarYearLabel('gregory', 2026, 'en')).toBe('2026')
    expect(formatCalendarYearLabel('persian', 1405, 'en')).toBe('1405 AP')
  })

  it('一年跨两个年号时按给定的月写', () => {
    const before = calendarMonthFromYearMonth('japanese', { year: 2019, month: 4 })
    const after = calendarMonthFromYearMonth('japanese', { year: 2019, month: 6 })
    expect(formatCalendarYearLabel('japanese', 2019, 'en', before)).not.toBe(formatCalendarYearLabel('japanese', 2019, 'en', after))
  })
})
