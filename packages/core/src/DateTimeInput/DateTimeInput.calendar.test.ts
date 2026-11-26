import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import DateInput from '../DateInput/DateInput.vue'
import DateTimeInput from './DateTimeInput.vue'
import TouchDateTimeField from './TouchDateTimeField.vue'

afterEach(() => {
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

describe('dateTimeInput 按历法显示日期', () => {
  it('日期部分交给按历法读写的 DateInput', () => {
    const wrapper = mount(DateTimeInput, {
      attachTo: document.body,
      props: { label: 'Meeting', presentation: 'popover', calendar: 'persian', modelValue: '2026-10-30T14:30' },
    })
    const date = wrapper.findComponent(DateInput)
    expect(date.props('calendar')).toBe('persian')
    expect((date.get('input.astryx-date-input-field').element as HTMLInputElement).value).toBe('Aban 8, 1405 AP')
  })

  it('显式 native 在非公历里换成弹出日历', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mount(DateTimeInput, {
      attachTo: document.body,
      props: { label: 'Meeting', presentation: 'native', calendar: 'persian', modelValue: '2026-10-30T14:30' },
    })
    expect(wrapper.findComponent(DateInput).props('presentation')).toBe('adaptive-bottom-sheet')
  })

  it('底部面板的日期段按历法写长日期', () => {
    const wrapper = mount(DateTimeInput, {
      attachTo: document.body,
      props: { label: 'Meeting', presentation: 'bottom-sheet', calendar: 'persian', modelValue: '2026-10-30T14:30' },
    })
    const field = wrapper.findComponent(TouchDateTimeField)
    expect(field.props('calendar')).toBe('persian')
    expect(wrapper.get('.astryx-date-touch-segment').text()).toContain('1405 AP')
  })
})
