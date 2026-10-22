import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { FormLayout } from '../FormLayout/index.js'
import TimeInput from './TimeInput.vue'

enableAutoUnmount(afterEach)

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

function mockPointer(coarse: boolean): void {
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

afterEach(() => {
  document.body.innerHTML = ''
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('timeInput 展现模式', () => {
  it('bottom-sheet 在细指针上也打开小时和分钟滚轮', async () => {
    ensureDialogModalApi()
    mockPointer(false)
    const wrapper = mount(TimeInput, {
      attachTo: document.body,
      props: { label: 'Start', presentation: 'bottom-sheet', modelValue: '14:30' },
    })
    const input = wrapper.get('input')
    expect(input.attributes('readonly')).toBe('')
    expect(input.attributes('role')).toBe('combobox')
    await input.trigger('click')
    await nextTick()
    expect(document.querySelector('[role="listbox"][aria-label="Hour"]')).not.toBeNull()
    expect(document.querySelector('[role="listbox"][aria-label="Minute"]')).not.toBeNull()
  })

  it('adaptive-bottom-sheet 只在粗指针上用面板', () => {
    mockPointer(false)
    const fine = mount(TimeInput, {
      props: { label: 'Start', presentation: 'adaptive-bottom-sheet', modelValue: null },
    })
    expect(fine.get('input').attributes('readonly')).toBeUndefined()
    fine.unmount()
    mockPointer(true)
    const coarse = mount(TimeInput, {
      props: { label: 'Start', presentation: 'adaptive-bottom-sheet', modelValue: null },
    })
    expect(coarse.get('input').attributes('readonly')).toBe('')
  })

  it('text-input 在粗指针上仍是可输入文本，并压过 nativePicker', () => {
    mockPointer(true)
    const wrapper = mount(TimeInput, {
      props: { label: 'Start', presentation: 'text-input', nativePicker: 'always', modelValue: null },
    })
    const input = wrapper.get('input')
    expect(input.attributes('type')).toBe('text')
    expect(input.attributes('readonly')).toBeUndefined()
    expect(wrapper.find('input[type="time"]').exists()).toBe(false)
  })

  it('带秒时，默认粗指针不用系统时间控件', () => {
    mockPointer(true)
    const wrapper = mount(TimeInput, {
      props: { label: 'Start', modelValue: '14:30:00', hasSeconds: true },
    })
    expect(wrapper.get('input').attributes('type')).toBe('text')
  })

  it('containerClass 落在外壳，controlClass 落在本体', () => {
    const wrapper = mount(TimeInput, {
      props: { label: 'Start', modelValue: null, containerClass: 'box-a', controlClass: 'ctl-a' },
    })
    expect(wrapper.get('.astryx-field').classes()).toContain('box-a')
    expect(wrapper.get('.astryx-time-input').classes()).toContain('ctl-a')
    expect(wrapper.get('input').classes()).not.toContain('ctl-a')
    expect(wrapper.get('input').classes()).not.toContain('box-a')
  })

  it('横向标签里 containerClass 不生效并警告', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const Host = defineComponent({
      render: () => h(FormLayout, { direction: 'horizontal-labels' }, {
        default: () => h(TimeInput, { label: 'Start', modelValue: null, containerClass: 'box-a' }),
      }),
    })
    const wrapper = mount(Host)
    expect(wrapper.find('.box-a').exists()).toBe(false)
    expect(warn.mock.calls.some(call => String(call[0]).includes('no Field box renders'))).toBe(true)
  })

  it('labelHidden 藏起标签', () => {
    const wrapper = mount(TimeInput, { props: { label: 'Start', modelValue: null, labelHidden: true } })
    expect(wrapper.get('.astryx-field-label-group').attributes('data-hidden')).toBe('true')
  })
})
