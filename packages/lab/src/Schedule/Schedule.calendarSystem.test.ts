import { InternationalizationProvider } from '@astryx-vue/core'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { h } from 'vue'
import { formatDayNumber, formatFullDate, formatWeekTitle } from './format.js'
import { createScheduleMonthlyView } from './monthlyView.js'
import Schedule from './Schedule.vue'

enableAutoUnmount(afterEach)
afterEach(() => {
  document.body.innerHTML = ''
})

describe('schedule 按 provider 的历法写日期', () => {
  it('格式化函数按历法写日子、整天和跨月标题', () => {
    const day = { year: 2026, month: 10, day: 30 }
    expect(formatDayNumber(day, 'en', 'persian')).toBe('8')
    expect(formatFullDate(day, 'en', 'persian')).toBe('Friday, Aban 8, 1405 AP')
    expect(formatWeekTitle({ year: 2026, month: 10, day: 1 }, { year: 2026, month: 10, day: 31 }, 'en', 'persian')).toBe('Mehr - Aban 1405 AP')
    expect(formatWeekTitle({ year: 2026, month: 10, day: 1 }, { year: 2026, month: 10, day: 31 }, 'en')).toBe('October 2026')
  })

  it('月视图的格子仍按公历排，标题和日子按波斯历写', () => {
    const wrapper = mount(InternationalizationProvider, {
      attachTo: document.body,
      props: { locale: 'en', calendar: 'persian' },
      slots: {
        default: () => h(Schedule, {
          view: createScheduleMonthlyView(),
          events: [],
          date: Date.UTC(2026, 9, 30, 12),
          timezoneID: 'UTC',
        }),
      },
    })
    const text = wrapper.text()
    expect(text).toContain('Mehr')
    expect(text).toContain('Aban')
    expect(wrapper.find('[aria-label="Friday, Aban 8, 1405 AP"]').exists()).toBe(true)
  })
})
