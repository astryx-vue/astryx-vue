import { renderToString } from '@vue/server-renderer'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createSSRApp, h, nextTick } from 'vue'
import Calendar from '../Calendar/Calendar.vue'
import InternationalizationProvider from '../InternationalizationProvider/InternationalizationProvider.vue'
import { formatCalendarDateHint } from '../utils/calendarDateText.js'
import DateInput from './DateInput.vue'
import NativeDateField from './NativeDateField.vue'
import TouchDateSheet from './TouchDateSheet.vue'

/** 2026-10-30 是波斯历 1405 年阿班月 8 日。 */
const ABAN_8 = new Date(2026, 9, 30)

function mockPointer(coarse = false): void {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: coarse && query === '(pointer: coarse)',
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
    onchange: null,
  }))
}

beforeEach(() => mockPointer())

afterEach(() => {
  document.body.innerHTML = ''
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

function mountField(props: Record<string, unknown> = {}) {
  return mount(DateInput, { attachTo: document.body, props: { label: 'Due', presentation: 'popover', calendar: 'persian', ...props } })
}

function input(wrapper: ReturnType<typeof mount>): HTMLInputElement {
  return wrapper.get('input.astryx-date-input-field').element as HTMLInputElement
}

describe('dateInput 按历法读写日期', () => {
  it('已提交的值按波斯历写，带纪元', () => {
    const wrapper = mountField({ modelValue: ABAN_8 })
    expect(input(wrapper).value).toBe('Aban 8, 1405 AP')
  })

  it('自定义格式函数和 system_date 仍拿到公历 ISO 日期', () => {
    expect(input(mountField({ modelValue: ABAN_8, format: 'system_date' })).value).toBe('2026-10-30')
    expect(input(mountField({ modelValue: ABAN_8, format: (iso: string) => `[${iso}]` })).value).toBe('[2026-10-30]')
  })

  it('打波斯历日期，失焦时提交对应的公历日期', async () => {
    const wrapper = mountField()
    const field = wrapper.get('input.astryx-date-input-field')
    await field.trigger('focus')
    await field.setValue('Aban 8, 1405')
    await field.trigger('blur')
    const emitted = wrapper.emitted('update:modelValue')!
    const date = emitted[emitted.length - 1]![0] as Date
    expect([date.getFullYear(), date.getMonth() + 1, date.getDate()]).toEqual([2026, 10, 30])
  })

  it('按历法的数字写法打也能读回同一天', async () => {
    const wrapper = mountField()
    const field = wrapper.get('input.astryx-date-input-field')
    await field.trigger('focus')
    await field.setValue(formatCalendarDateHint({ year: 2026, month: 10, day: 30 }, 'en', 'persian'))
    await field.trigger('blur')
    const emitted = wrapper.emitted('update:modelValue')!
    const date = emitted[emitted.length - 1]![0] as Date
    expect([date.getFullYear(), date.getMonth() + 1, date.getDate()]).toEqual([2026, 10, 30])
  })

  it('历法里没有的日子说明原因，不提交', async () => {
    const wrapper = mountField()
    const field = wrapper.get('input.astryx-date-input-field')
    await field.trigger('focus')
    await field.setValue('Esfand 31, 1404')
    await field.trigger('blur')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.text()).toContain('Enter a real date')
  })

  it('超出范围时边界日期按历法写', async () => {
    const wrapper = mountField({ min: ABAN_8 })
    const field = wrapper.get('input.astryx-date-input-field')
    await field.trigger('focus')
    await field.setValue('Aban 1, 1405')
    await field.trigger('blur')
    expect(wrapper.text()).toContain('Enter a date on or after Aban 8, 1405 AP')
  })

  it('聚焦且为空时，占位符是按历法写的示例日期；调用方的占位符优先', async () => {
    const wrapper = mountField()
    const field = wrapper.get('input.astryx-date-input-field')
    expect(field.attributes('placeholder')).toBe('Select a date')
    await field.trigger('focus')
    expect(field.attributes('placeholder')).toMatch(/^e\.g\., .*AP$/)
    await field.trigger('blur')
    expect(field.attributes('placeholder')).toBe('Select a date')

    const custom = mountField({ placeholder: 'When?' })
    await custom.get('input.astryx-date-input-field').trigger('focus')
    expect(custom.get('input.astryx-date-input-field').attributes('placeholder')).toBe('When?')
  })

  it('公历字段没有格式提示', async () => {
    const wrapper = mountField({ calendar: 'gregory' })
    const field = wrapper.get('input.astryx-date-input-field')
    await field.trigger('focus')
    expect(field.attributes('placeholder')).toBe('Select a date')
  })
})

describe('dateInput 的历法说明', () => {
  it('字段的历法和应用不同时，读屏说明关联到输入框', () => {
    const wrapper = mountField()
    const describedBy = wrapper.get('input.astryx-date-input-field').attributes('aria-describedby') ?? ''
    const note = document.getElementById(describedBy.split(' ').find(id => id.endsWith('-calendar'))!)
    expect(note?.textContent?.trim()).toBe('Dates use the Persian Calendar')
  })

  it('和 provider 的历法相同时没有说明；公历字段放在波斯历应用里时有', () => {
    const same = mount(InternationalizationProvider, {
      attachTo: document.body,
      props: { locale: 'en', calendar: 'persian' },
      slots: { default: () => h(DateInput, { label: 'Due', presentation: 'popover' }) },
    })
    expect(same.text()).not.toContain('Dates use the')
    same.unmount()

    const gregorian = mount(InternationalizationProvider, {
      attachTo: document.body,
      props: { locale: 'en', calendar: 'persian' },
      slots: { default: () => h(DateInput, { label: 'Due', presentation: 'popover', calendar: 'gregory' }) },
    })
    expect(gregorian.text()).toContain('Dates use the Gregorian Calendar')
  })

  it('provider 的历法也作用于字段', () => {
    const wrapper = mount(InternationalizationProvider, {
      attachTo: document.body,
      props: { locale: 'en', calendar: 'persian' },
      slots: { default: () => h(DateInput, { label: 'Due', presentation: 'popover', modelValue: ABAN_8 }) },
    })
    expect((wrapper.get('input.astryx-date-input-field').element as HTMLInputElement).value).toBe('Aban 8, 1405 AP')
  })
})

describe('dateInput 在别的历法里的打开方式', () => {
  it('弹出日历按字段的历法排月份，选中一天提交公历日期', async () => {
    const wrapper = mountField({ modelValue: ABAN_8 })
    await wrapper.get('input.astryx-date-input-field').trigger('click')
    await nextTick()
    const calendar = wrapper.findComponent(Calendar)
    expect(calendar.props('calendar')).toBe('persian')
    expect(document.querySelector('.astryx-calendar-month-year')?.textContent).toBe('Aban 1405 AP')
    const cell = document.querySelector<HTMLButtonElement>('.astryx-calendar-cell[data-date="2026-10-23"]')!
    expect(cell.textContent?.trim()).toBe('1')
    cell.click()
    await nextTick()
    const emitted = wrapper.emitted('update:modelValue')!
    const date = emitted[emitted.length - 1]![0] as Date
    expect([date.getFullYear(), date.getMonth() + 1, date.getDate()]).toEqual([2026, 10, 23])
  })

  it('显式 native 在非公历里换成 Astryx 的选择器，并警告一次', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mountField({ presentation: 'native', calendar: 'hebrew' })
    expect(wrapper.findComponent(NativeDateField).exists()).toBe(false)
    expect(wrapper.find('input.astryx-date-input-field').exists()).toBe(true)
    mountField({ presentation: 'native', calendar: 'hebrew' })
    const calls = warn.mock.calls.filter(args => String(args[0]).includes('presentation="native"'))
    expect(calls).toHaveLength(1)
  })

  it('触屏默认的系统日期控件在非公历里换成底部面板，面板按历法翻月', async () => {
    mockPointer(true)
    const wrapper = mountField({ presentation: undefined, modelValue: ABAN_8 })
    expect(wrapper.findComponent(NativeDateField).exists()).toBe(false)
    const sheet = wrapper.findComponent(TouchDateSheet)
    expect(sheet.props('calendar')).toBe('persian')
  })

  it('公历的触屏默认仍是系统日期控件', () => {
    mockPointer(true)
    const wrapper = mountField({ presentation: undefined, calendar: 'gregory' })
    expect(wrapper.findComponent(NativeDateField).exists()).toBe(true)
  })
})

describe('dateInput 历法的服务端渲染', () => {
  it('服务端渲染出按历法写的文字，两次结果一致', async () => {
    const render = (): Promise<string> => renderToString(createSSRApp({
      render: () => h(InternationalizationProvider, { locale: 'en', calendar: 'persian' }, {
        default: () => h(DateInput, { label: 'Due', modelValue: ABAN_8 }),
      }),
    }))
    const first = await render()
    expect(first).toContain('value="Aban 8, 1405 AP"')
    expect(await render()).toBe(first)
  })
})
