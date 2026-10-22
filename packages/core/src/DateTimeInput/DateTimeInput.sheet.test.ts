import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import DateRangeInput from '../DateRangeInput/DateRangeInput.vue'
import DateTimeInput from './DateTimeInput.vue'

function ensureDialogModalApi(): void {
  const proto = HTMLDialogElement.prototype as unknown as Record<string, unknown>
  if (typeof proto.showModal === 'function')
    return
  proto.showModal = function (this: HTMLDialogElement) {
    this.setAttribute('open', '')
  }
  proto.close = function (this: HTMLDialogElement) {
    this.removeAttribute('open')
  }
}

afterEach(() => {
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

describe('dateTimeInput 底部面板', () => {
  it('一个面板里可以在日期和时间之间切换', async () => {
    ensureDialogModalApi()
    const wrapper = mount(DateTimeInput, {
      attachTo: document.body,
      props: { label: 'Meeting', presentation: 'bottom-sheet', modelValue: '2026-03-21T14:30' },
    })
    expect(wrapper.findAll('input')).toHaveLength(0)
    await wrapper.get('.astryx-date-touch-segment').trigger('click')
    await nextTick()
    const tabs = document.querySelector('[role="tablist"]')
    expect(tabs?.textContent).toContain('Date')
    expect(tabs?.textContent).toContain('Time')
    const timeTab = [...(tabs?.querySelectorAll('button') ?? [])].find(button => button.textContent === 'Time')
    timeTab?.click()
    await nextTick()
    expect(document.querySelector('[role="listbox"][aria-label="Hour"]')).not.toBeNull()
    expect(document.querySelector('[role="listbox"][aria-label="Minute"]')).not.toBeNull()
  })

  it('containerClass 落在外壳，controlClass 落在本体', () => {
    const wrapper = mount(DateTimeInput, {
      props: { label: 'Meeting', modelValue: null, containerClass: 'box-a', controlClass: 'ctl-a' },
    })
    expect(wrapper.get('.astryx-field').classes()).toContain('box-a')
    expect(wrapper.get('.astryx-date-time-input').classes()).toContain('ctl-a')
  })

  it('labelHidden 藏起标签', () => {
    const wrapper = mount(DateTimeInput, { props: { label: 'Meeting', modelValue: null, labelHidden: true } })
    expect(wrapper.get('.astryx-field-label-group').attributes('data-hidden')).toBe('true')
  })

  it('底部面板改值后触发 change 和 changeAction', async () => {
    ensureDialogModalApi()
    const changeAction = vi.fn()
    const wrapper = mount(DateTimeInput, {
      attachTo: document.body,
      props: {
        label: 'Meeting',
        presentation: 'bottom-sheet',
        modelValue: '2026-03-21T14:30',
        changeAction,
      },
    })
    await wrapper.get('.astryx-date-touch-segment').trigger('click')
    await nextTick()
    const day = document.querySelector<HTMLButtonElement>('dialog button[data-date="2026-03-22"]:not(.is-disabled)')
    expect(day).toBeTruthy()
    day?.click()
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['2026-03-22T14:30'])
    expect(wrapper.emitted('change')).toEqual([['2026-03-22T14:30']])
    expect(changeAction).toHaveBeenCalledTimes(1)
    expect(changeAction).toHaveBeenCalledWith('2026-03-22T14:30')
  })

  it('isReadOnly 时底部面板不能改', async () => {
    ensureDialogModalApi()
    const changeAction = vi.fn()
    const wrapper = mount(DateTimeInput, {
      attachTo: document.body,
      props: {
        label: 'Meeting',
        presentation: 'bottom-sheet',
        modelValue: '2026-03-21T14:30',
        isReadOnly: true,
        changeAction,
      },
    })
    const segments = wrapper.findAll('.astryx-date-touch-segment')
    expect(segments).toHaveLength(2)
    for (const segment of segments)
      expect(segment.attributes('disabled')).toBe('')
    await segments[0]?.trigger('click')
    await nextTick()
    expect(document.querySelector('dialog')?.hasAttribute('open')).not.toBe(true)
    expect(wrapper.emitted('change')).toBeUndefined()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(changeAction).not.toHaveBeenCalled()
  })
})

describe('dateRangeInput 样式分层', () => {
  it('containerClass 落在外壳，controlClass 落在本体，不落到触发按钮上', () => {
    const wrapper = mount(DateRangeInput, {
      props: { label: 'Stay', modelValue: null, containerClass: 'box-a', controlClass: 'ctl-a' },
    })
    expect(wrapper.get('.astryx-field').classes()).toContain('box-a')
    expect(wrapper.get('.astryx-date-range-input').classes()).toContain('ctl-a')
    expect(wrapper.get('.astryx-date-range-trigger').classes()).not.toContain('ctl-a')
  })

  it('labelHidden 藏起标签', () => {
    const wrapper = mount(DateRangeInput, { props: { label: 'Stay', modelValue: null, labelHidden: true } })
    expect(wrapper.get('.astryx-field-label-group').attributes('data-hidden')).toBe('true')
  })

  it('鼠标点清除不把焦点送回触发器，键盘激活才会', async () => {
    const wrapper = mount(DateRangeInput, {
      attachTo: document.body,
      props: { label: 'Stay', modelValue: { start: '2026-03-01', end: '2026-03-03' }, hasClear: true },
    })
    const trigger = wrapper.get<HTMLButtonElement>('.astryx-date-range-trigger')
    const mouseClear = wrapper.get<HTMLButtonElement>('button[class*="clear"]')
    mouseClear.element.focus()
    mouseClear.element.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }))
    await nextTick()
    expect(document.activeElement).not.toBe(trigger.element)
    await wrapper.setProps({ modelValue: { start: '2026-03-01', end: '2026-03-04' } })
    const keyboardClear = wrapper.get<HTMLButtonElement>('button[class*="clear"]')
    keyboardClear.element.focus()
    keyboardClear.element.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 0 }))
    await nextTick()
    expect(document.activeElement).toBe(wrapper.get('.astryx-date-range-trigger').element)
  })
})
