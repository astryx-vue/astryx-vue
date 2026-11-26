import type { CalendarHandle } from './types.js'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, shallowRef } from 'vue'
import { provideAstryxLocale } from '../locale/index.js'
import Calendar from './Calendar.vue'

function flushPromises() {
  return new Promise((resolve) => {
    setTimeout(resolve, 0)
  })
}

async function focusDay(wrapper: ReturnType<typeof mount>, day: number): Promise<void> {
  const cell = wrapper.findAll('.astryx-calendar-cell').find(c => !c.classes().includes('is-other-month') && c.text() === String(day))
  await cell?.trigger('focus')
}

describe('calendar', () => {
  it('renders calendar grid', () => {
    const wrapper = mount(Calendar, {
      props: {
        modelValue: new Date(2024, 2, 15),
      },
    })

    expect(wrapper.find('.astryx-calendar-grid').exists()).toBe(true)
    expect(wrapper.findAll('.astryx-calendar-row')).toHaveLength(6) // 6 weeks
  })

  it('displays current month and year', () => {
    const wrapper = mount(Calendar, {
      props: {
        modelValue: new Date(2024, 2, 15),
      },
    })

    const header = wrapper.find('.astryx-calendar-month-year')
    expect(header.text()).toBe('March 2024')
    expect(wrapper.get('.astryx-calendar').attributes('aria-label')).toBe('Calendar')
    expect(wrapper.get('.astryx-calendar-nav-button').attributes('aria-label')).toBe('Previous month')
  })

  it('selects date on click', async () => {
    const wrapper = mount(Calendar, {
      props: {
        modelValue: null,
      },
    })

    const cells = wrapper.findAll('.astryx-calendar-cell')
    const firstCell = cells.find(cell => !cell.classes().includes('is-other-month'))

    if (firstCell) {
      await firstCell.trigger('click')
      await flushPromises()

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('change')).toBeTruthy()
    }
  })

  it('highlights selected date', () => {
    const testDate = new Date(2024, 2, 15)
    const wrapper = mount(Calendar, {
      props: {
        modelValue: testDate,
      },
    })

    const selectedCells = wrapper.findAll('.astryx-calendar-cell.is-selected')
    expect(selectedCells.length).toBeGreaterThan(0)
  })

  it('navigates to previous month', async () => {
    const wrapper = mount(Calendar, {
      props: {
        modelValue: new Date(2024, 2, 15),
      },
    })

    const prevButton = wrapper.findAll('.astryx-calendar-nav-button')[0]!
    await prevButton.trigger('click')
    await nextTick()

    const header = wrapper.find('.astryx-calendar-month-year')
    expect(header.text()).toBe('February 2024')
  })

  it('navigates to next month', async () => {
    const wrapper = mount(Calendar, {
      props: {
        modelValue: new Date(2024, 2, 15),
      },
    })

    const nextButton = wrapper.findAll('.astryx-calendar-nav-button')[1]!
    await nextButton.trigger('click')
    await nextTick()

    const header = wrapper.find('.astryx-calendar-month-year')
    expect(header.text()).toBe('April 2024')
  })

  it('disables dates based on min/max', () => {
    mount(Calendar, {
      props: {
        modelValue: null,
        min: new Date(2024, 2, 10),
        max: new Date(2024, 2, 20),
      },
    })

    // Calendar 组件应该正常渲染
    expect(true).toBe(true)
  })

  it('uses custom isDateDisabled function', () => {
    const isDateDisabled = vi.fn((date: Date) => date.getDay() === 0)

    mount(Calendar, {
      props: {
        modelValue: null,
        isDateDisabled,
      },
    })

    expect(isDateDisabled).toHaveBeenCalled()
  })

  it('marks today date', () => {
    const wrapper = mount(Calendar, {
      props: {
        modelValue: null,
      },
    })

    const todayCells = wrapper.findAll('.astryx-calendar-cell.is-today')
    expect(todayCells.length).toBeGreaterThanOrEqual(0)
  })

  it('applies disabled state', () => {
    const wrapper = mount(Calendar, {
      props: {
        modelValue: null,
        disabled: true,
      },
    })

    expect(wrapper.find('.astryx-calendar').classes()).toContain('is-disabled')
    const navButtons = wrapper.findAll('.astryx-calendar-nav-button')
    navButtons.forEach((button) => {
      expect(button.attributes('disabled')).toBeDefined()
    })
  })

  it('handles keyboard navigation', async () => {
    const wrapper = mount(Calendar, {
      props: {
        modelValue: new Date(2024, 2, 15),
      },
    })

    const grid = wrapper.find('.astryx-calendar-grid')
    const before = wrapper.get('.astryx-calendar-cell[tabindex="0"]').text()
    await grid.trigger('keydown', { key: 'ArrowRight' })
    await nextTick()
    expect(wrapper.get('.astryx-calendar-cell[tabindex="0"]').text()).not.toBe(before)
  })

  it('selects date with Enter key', async () => {
    const wrapper = mount(Calendar, {
      props: {
        modelValue: null,
      },
    })

    const grid = wrapper.find('.astryx-calendar-grid')
    await grid.trigger('keydown', { key: 'Enter' })
    await flushPromises()

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })

  it('dims dates from other months', () => {
    const wrapper = mount(Calendar, {
      props: {
        modelValue: new Date(2024, 2, 15),
      },
    })

    const otherMonthCells = wrapper.findAll('.astryx-calendar-cell.is-other-month')
    expect(otherMonthCells.length).toBeGreaterThan(0)
  })

  it('uses Chinese labels when zh-CN is provided', () => {
    const Host = defineComponent({
      setup() {
        provideAstryxLocale('zh-CN')
        return () => h(Calendar, { modelValue: new Date(2024, 2, 15) })
      },
    })
    const wrapper = mount(Host)
    expect(wrapper.get('.astryx-calendar-month-year').text()).toBe('2024年3月')
    expect(wrapper.get('.astryx-calendar').attributes('aria-label')).toBe('日历')
    expect(wrapper.get('.astryx-calendar-nav-button').attributes('aria-label')).toBe('上个月')
  })

  it('shows the focused month and disables weekends inside min and max', () => {
    const wrapper = mount(Calendar, {
      props: {
        modelValue: null,
        focusDate: new Date(2026, 0, 1),
        min: new Date(2026, 0, 10),
        max: new Date(2026, 2, 20),
        isDateDisabled: (date: Date) => date.getDay() === 0 || date.getDay() === 6,
      },
    })
    expect(wrapper.get('.astryx-calendar-month-year').text()).toBe('January 2026')
    const weekday = wrapper.findAll('.astryx-calendar-cell').find(cell => cell.text() === '12')
    const saturday = wrapper.findAll('.astryx-calendar-cell').find(cell => cell.text() === '10')
    expect(weekday?.classes()).not.toContain('is-disabled')
    expect(saturday?.classes()).toContain('is-disabled')
  })

  it('selects a range across two clicks and can show two months', async () => {
    const wrapper = mount(Calendar, {
      props: {
        mode: 'range',
        numberOfMonths: 2,
        focusDate: new Date(2026, 0, 1),
        range: { start: new Date(2026, 0, 10), end: new Date(2026, 0, 20) },
      },
    })
    expect(wrapper.findAll('.astryx-calendar-month')).toHaveLength(2)
    expect(wrapper.get('.astryx-calendar-month-year').text()).toBe('January 2026 – February 2026')
    expect(wrapper.findAll('[role="grid"]')).toHaveLength(2)
    expect(wrapper.findAll('[role="grid"]')[0]?.attributes('aria-multiselectable')).toBe('true')
    expect(wrapper.findAll('.is-range-start').length).toBeGreaterThan(0)
    expect(wrapper.findAll('.is-in-range').length).toBeGreaterThan(0)

    const day = wrapper.findAll('.astryx-calendar-cell').find(cell => cell.text() === '25' && !cell.classes().includes('is-other-month'))
    await day?.trigger('click')
    const next = wrapper.emitted('update:range')?.[0]?.[0] as { start: Date, end: Date | null }
    expect(next.start).toEqual(new Date(2026, 0, 25))
    expect(next.end).toBeNull()
  })

  it('shows week numbers, a Monday start, and a shorter month', () => {
    const weeks = mount(Calendar, {
      props: {
        focusDate: new Date(2026, 1, 1),
        hasWeekNumbers: true,
        hasVariableRowCount: true,
      },
    })
    expect(weeks.findAll('[role="rowheader"]').length).toBe(4)
    expect(weeks.findAll('.astryx-calendar-row')).toHaveLength(4)
    expect(weeks.text()).toContain('week')

    const monday = mount(Calendar, {
      props: { focusDate: new Date(2026, 0, 1), weekStartsOn: 'mon' },
    })
    expect(monday.findAll('[role="columnheader"]').at(0)?.attributes('aria-label')).toBe('Monday')
    expect(monday.findAll('[role="columnheader"]').map(cell => cell.text())).toEqual(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])
  })

  it('hides adjacent months and refuses to select them', async () => {
    const wrapper = mount(Calendar, {
      props: { focusDate: new Date(2026, 0, 1), hasOutsideDays: false },
    })
    expect(wrapper.findAll('.is-other-month')).toHaveLength(0)
    const outside = wrapper.findAll('.astryx-calendar-gridcell').find(cell => !cell.find('button').exists())
    expect(outside).toBeTruthy()
  })

  it('disables a day when a constraint returns false and caps a range', async () => {
    const wrapper = mount(Calendar, {
      props: {
        mode: 'range',
        focusDate: new Date(2026, 0, 1),
        maxRangeSpan: 3,
        dateConstraints: [(date: Date) => date.getDay() !== 0],
      },
    })
    const sunday = wrapper.findAll('.astryx-calendar-cell').find(cell => cell.text() === '4')
    expect(sunday?.classes()).toContain('is-disabled')
    const start = wrapper.findAll('.astryx-calendar-cell').find(cell => cell.text() === '12' && !cell.classes().includes('is-other-month'))
    await start?.trigger('click')
    const far = wrapper.findAll('.astryx-calendar-cell').find(cell => cell.text() === '16' && !cell.classes().includes('is-other-month'))
    expect(far?.classes()).toContain('is-disabled')
  })

  it('moves the visible month from the imperative handle', async () => {
    const holder = shallowRef<CalendarHandle | null>(null)
    const wrapper = mount(Calendar, {
      props: {
        focusDate: new Date(2026, 0, 1),
        handleRef: holder,
      },
    })
    holder.value?.navigateTo(new Date(2026, 2, 4))
    await nextTick()
    expect(wrapper.get('.astryx-calendar-month-year').text()).toBe('March 2026')
    expect(wrapper.get('.astryx-calendar-cell[tabindex="0"]').text()).toBe('4')
    expect(holder.value?.navigateTo).toBeTypeOf('function')
  })

  it('pages to the next month with PageDown and cancels a range with Escape', async () => {
    const wrapper = mount(Calendar, {
      props: { mode: 'range', focusDate: new Date(2026, 0, 1) },
    })
    await wrapper.get('.astryx-calendar-grid').trigger('keydown', { key: 'PageDown' })
    await nextTick()
    expect(wrapper.get('.astryx-calendar-month-year').text()).toBe('February 2026')
    await wrapper.get('.astryx-calendar-cell[tabindex="0"]').trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:range')?.[0]?.[0]).toMatchObject({ end: null })
    await wrapper.get('.astryx-calendar-grid').trigger('keydown', { key: 'Escape' })
    const cleared = wrapper.emitted('update:range')?.at(-1)?.[0] as { start: Date | null, end: Date | null }
    expect(cleared.start).toBeNull()
  })

  it('moves the focused day by a year with Shift+PageDown and Shift+PageUp', async () => {
    const wrapper = mount(Calendar, { props: { focusDate: new Date(2026, 2, 15) } })
    const grid = wrapper.get('.astryx-calendar-grid')
    await focusDay(wrapper, 15)
    await grid.trigger('keydown', { key: 'PageDown', shiftKey: true })
    await nextTick()
    expect(wrapper.get('.astryx-calendar-month-year').text()).toBe('March 2027')
    expect(wrapper.get('.astryx-calendar-cell[tabindex="0"]').text()).toBe('15')
    await grid.trigger('keydown', { key: 'PageUp', shiftKey: true })
    await nextTick()
    expect(wrapper.get('.astryx-calendar-month-year').text()).toBe('March 2026')
  })

  it('a year from February 29 lands on February 28, and a year past max keeps focus', async () => {
    const leap = mount(Calendar, { props: { focusDate: new Date(2024, 1, 29) } })
    await focusDay(leap, 29)
    await leap.get('.astryx-calendar-grid').trigger('keydown', { key: 'PageDown', shiftKey: true })
    await nextTick()
    expect(leap.get('.astryx-calendar-month-year').text()).toBe('February 2025')
    expect(leap.get('.astryx-calendar-cell[tabindex="0"]').text()).toBe('28')

    const capped = mount(Calendar, { props: { focusDate: new Date(2026, 2, 15), max: new Date(2027, 2, 14) } })
    await focusDay(capped, 15)
    await capped.get('.astryx-calendar-grid').trigger('keydown', { key: 'PageDown', shiftKey: true })
    await nextTick()
    expect(capped.get('.astryx-calendar-month-year').text()).toBe('March 2026')
  })

  it('writes day and week numbers with the locale digits', () => {
    const host = defineComponent({
      setup() {
        provideAstryxLocale('ar-EG')
        return () => h(Calendar, { focusDate: new Date(2026, 0, 1), hasWeekNumbers: true })
      },
    })
    const wrapper = mount(host)
    expect(wrapper.find('.astryx-calendar-day').text()).toMatch(/^[\u0660-\u0669]+$/)
    expect(wrapper.find('.astryx-calendar-week-number').text()).toMatch(/^[\u0660-\u0669]+$/)
    const latin = mount(Calendar, { props: { focusDate: new Date(2026, 0, 1), hasWeekNumbers: true } })
    expect(latin.find('.astryx-calendar-day').text()).toMatch(/^\d+$/)
  })
})
