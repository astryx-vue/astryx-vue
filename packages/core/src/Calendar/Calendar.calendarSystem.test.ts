import { renderToString } from '@vue/server-renderer'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import InternationalizationProvider from '../InternationalizationProvider/InternationalizationProvider.vue'
import Calendar from './Calendar.vue'

function inMonthCells(wrapper: ReturnType<typeof mount>) {
  return wrapper.findAll('.astryx-calendar-cell').filter(cell => !cell.classes().includes('is-other-month'))
}

function header(wrapper: ReturnType<typeof mount>): string {
  return wrapper.get('.astryx-calendar-month-year').text()
}

describe('calendar 按非公历历法排月份', () => {
  it('provider 选了波斯历：格子是波斯历的一个月，标题和读屏名字也按波斯历写', () => {
    const wrapper = mount(InternationalizationProvider, {
      props: { locale: 'en', calendar: 'persian' },
      slots: { default: () => h(Calendar, { modelValue: new Date(2026, 9, 30) }) },
    })
    expect(header(wrapper)).toBe('Aban 1405 AP')
    const cells = inMonthCells(wrapper)
    expect(cells).toHaveLength(30)
    expect(cells[0]!.attributes('data-date')).toBe('2026-10-23')
    expect(cells[0]!.text()).toBe('1')
    expect(cells[29]!.attributes('data-date')).toBe('2026-11-21')
    const selected = wrapper.get('.astryx-calendar-cell.is-selected')
    expect(selected.text()).toBe('8')
    expect(selected.attributes('aria-label')).toBe('Friday, Aban 8, 1405 AP')
  })

  it('点一天选中的仍是公历日期', async () => {
    const wrapper = mount(Calendar, { props: { calendar: 'persian', focusDate: new Date(2026, 9, 30) } })
    await inMonthCells(wrapper)[0]!.trigger('click')
    const value = wrapper.emitted('update:modelValue')![0]![0] as Date
    expect([value.getFullYear(), value.getMonth() + 1, value.getDate()]).toEqual([2026, 10, 23])
  })

  it('翻月、Page Down 和 Shift+Page Down 都按波斯历的月和年走', async () => {
    const wrapper = mount(Calendar, {
      props: { calendar: 'persian', modelValue: new Date(2026, 8, 22) },
      attachTo: document.body,
    })
    expect(header(wrapper)).toBe('Shahrivar 1405 AP')
    expect(wrapper.get('.astryx-calendar-cell[tabindex="0"]').text()).toBe('31')

    await wrapper.get('.astryx-calendar-grid').trigger('keydown', { key: 'PageDown' })
    expect(header(wrapper)).toBe('Mehr 1405 AP')
    const focused = wrapper.get('.astryx-calendar-cell[tabindex="0"]')
    expect(focused.text()).toBe('30')
    expect(focused.attributes('data-date')).toBe('2026-10-22')

    await wrapper.get('.astryx-calendar-grid').trigger('keydown', { key: 'PageDown', shiftKey: true })
    expect(header(wrapper)).toBe('Mehr 1406 AP')

    await wrapper.findAll('.astryx-calendar-nav-button')[0]!.trigger('click')
    expect(header(wrapper)).toBe('Shahrivar 1406 AP')
    expect(wrapper.emitted('update:focusDate')!.at(-1)![0]).toEqual(new Date(2027, 7, 23))
    wrapper.unmount()
  })

  it('min 和 max 按历法月决定翻月按钮能不能点', () => {
    const wrapper = mount(Calendar, {
      props: { calendar: 'persian', modelValue: new Date(2026, 9, 30), min: new Date(2026, 9, 23), max: new Date(2026, 10, 21) },
    })
    const [previous, next] = wrapper.findAll('.astryx-calendar-nav-button')
    expect(previous!.attributes('disabled')).toBeDefined()
    expect(next!.attributes('disabled')).toBeDefined()
  })

  it('希伯来历闰年的亚达一月有自己的格子', () => {
    const wrapper = mount(Calendar, { props: { calendar: 'hebrew', focusDate: new Date(2024, 1, 20) } })
    expect(header(wrapper)).toBe('Adar I 5784')
    expect(inMonthCells(wrapper)).toHaveLength(30)
  })

  it('组件自己的 calendar 优先于 provider；公历时 fa-IR 的标题不再混进波斯历', () => {
    const wrapper = mount(InternationalizationProvider, {
      props: { locale: 'fa-IR', calendar: 'persian' },
      slots: { default: () => h(Calendar, { calendar: 'gregory', modelValue: new Date(2026, 9, 30) }) },
    })
    expect(inMonthCells(wrapper)).toHaveLength(31)
    expect(header(wrapper)).not.toMatch(/۱۴۰۵/)
  })

  it('服务端渲染的标记稳定，两次一样', async () => {
    const app = () => createSSRApp({
      render: () => h(InternationalizationProvider, { locale: 'en', calendar: 'persian' }, () => h(Calendar, { focusDate: new Date(2026, 9, 30) })),
    })
    const first = await renderToString(app())
    expect(first).toContain('Aban 1405 AP')
    expect(first).toContain('data-date="2026-10-23"')
    expect(await renderToString(app())).toBe(first)
  })
})
