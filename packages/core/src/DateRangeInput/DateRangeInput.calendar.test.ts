import { renderToString } from '@vue/server-renderer'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { createSSRApp, h, nextTick } from 'vue'
import InternationalizationProvider from '../InternationalizationProvider/InternationalizationProvider.vue'
import DateRangeInput from './DateRangeInput.vue'
import { formatRangeDisplay } from './rangeDisplay.js'

const RANGE = { start: '2026-10-23', end: '2026-10-30' }

afterEach(() => {
  document.body.innerHTML = ''
})

describe('dateRangeInput 按历法显示和选择', () => {
  it('按钮上的范围按波斯历写', () => {
    const wrapper = mount(DateRangeInput, { props: { label: 'Period', modelValue: { start: '2020-03-20', end: '2020-03-27' }, calendar: 'persian' } })
    expect(wrapper.get('.astryx-date-range-value').text()).toBe('Farvardin 1, 1399 AP – Farvardin 8, 1399 AP')
  })

  it('两端和今天在同一历法年时省掉年份', () => {
    expect(formatRangeDisplay(RANGE, 'en', 'persian', new Date(2026, 9, 1))).toBe('Aban 1 – Aban 8')
    expect(formatRangeDisplay(RANGE, 'en', 'persian', new Date(2026, 2, 1))).toBe('Aban 1, 1405 AP – Aban 8, 1405 AP')
  })

  it('弹出的日历按历法排月份，选两天提交公历 ISO 日期', async () => {
    const wrapper = mount(DateRangeInput, {
      attachTo: document.body,
      props: { label: 'Period', modelValue: RANGE, calendar: 'persian' },
    })
    await wrapper.get('.astryx-date-range-trigger').trigger('click')
    await nextTick()
    expect(document.querySelector('.astryx-date-range-calendar .astryx-calendar-month-year')?.textContent).toBe('Aban 1405 AP – Azar 1405 AP')
    const months = document.querySelectorAll('.astryx-date-range-month')
    const firstDay = [...months[0]!.querySelectorAll<HTMLButtonElement>('.astryx-calendar-cell:not(.is-other-month)')][0]!
    expect(firstDay.textContent?.trim()).toBe('1')
    firstDay.click()
    await nextTick()
    const days = [...months[0]!.querySelectorAll<HTMLButtonElement>('.astryx-calendar-cell:not(.is-other-month)')]
    days[2]!.click()
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([{ start: '2026-10-23', end: '2026-10-25' }])
  })

  it('翻页按历法月走', async () => {
    const wrapper = mount(DateRangeInput, {
      attachTo: document.body,
      props: { label: 'Period', modelValue: RANGE, calendar: 'persian' },
    })
    await wrapper.get('.astryx-date-range-trigger').trigger('click')
    await nextTick()
    document.querySelector<HTMLButtonElement>('.astryx-date-range-calendar [aria-label="Next month"]')!.click()
    await nextTick()
    expect(document.querySelector('.astryx-date-range-calendar .astryx-calendar-month-year')?.textContent).toBe('Azar 1405 AP – Dey 1405 AP')
  })

  it('provider 的历法也作用于范围，服务端渲染两次一致', async () => {
    const render = (): Promise<string> => renderToString(createSSRApp({
      render: () => h(InternationalizationProvider, { locale: 'en', calendar: 'persian' }, {
        default: () => h(DateRangeInput, { label: 'Period', modelValue: RANGE }),
      }),
    }))
    const first = await render()
    expect(first).toContain('Aban 1, 1405 AP – Aban 8, 1405 AP')
    expect(await render()).toBe(first)
  })

  it('公历照旧', () => {
    const wrapper = mount(DateRangeInput, { props: { label: 'Period', modelValue: { start: '2025-03-01', end: '2025-03-07' } } })
    expect(wrapper.get('.astryx-date-range-value').text()).toBe('Mar 1, 2025 – Mar 7, 2025')
  })
})
