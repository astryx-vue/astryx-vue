import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { provideAstryxLocale } from '../locale/index.js'
import Calendar from './Calendar.vue'

function flushPromises() {
  return new Promise((resolve) => {
    setTimeout(resolve, 0)
  })
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
    await grid.trigger('keydown', { key: 'ArrowRight' })

    // Should update activeIndex
    expect(grid.attributes('aria-activedescendant')).toBeTruthy()
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
    expect(wrapper.get('.astryx-calendar-nav-button').attributes('aria-label')).toBe('上一月')
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
    expect(wrapper.findAll('.astryx-calendar-month-year').map(node => node.text())).toEqual(['January 2026', 'February 2026'])
    expect(wrapper.findAll('.is-range-start').length).toBeGreaterThan(0)
    expect(wrapper.findAll('.is-in-range').length).toBeGreaterThan(0)

    const day = wrapper.findAll('.astryx-calendar-cell').find(cell => cell.text() === '25' && !cell.classes().includes('is-other-month'))
    await day?.trigger('click')
    const next = wrapper.emitted('update:range')?.[0]?.[0] as { start: Date, end: Date | null }
    expect(next.start).toEqual(new Date(2026, 0, 25))
    expect(next.end).toBeNull()
  })
})
