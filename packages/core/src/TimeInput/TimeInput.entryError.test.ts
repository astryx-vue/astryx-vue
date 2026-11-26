import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { resetLiveRegionsForTest } from '../composables/internal/announce.js'
import DateTimeInput from '../DateTimeInput/DateTimeInput.vue'
import TimeInput from './TimeInput.vue'

beforeEach(() => {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
    onchange: null,
  }))
})

afterEach(() => {
  resetLiveRegionsForTest()
  document.body.innerHTML = ''
  vi.unstubAllGlobals()
})

function nextFrame(): Promise<void> {
  return new Promise(resolve => requestAnimationFrame(() => resolve()))
}

function mountTime(props: Record<string, unknown> = {}) {
  return mount(TimeInput, { attachTo: document.body, props: { label: 'Start', presentation: 'text-input', hourFormat: '24h', ...props } })
}

function pressEnter(input: HTMLInputElement): KeyboardEvent {
  const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true })
  input.dispatchEvent(event)
  return event
}

describe('timeInput 留下被拒的时间并说明原因', () => {
  it('读不成时间的文字打字时不标，失焦时留在框里，显示原因并标成无效', async () => {
    const onEntryErrorChange = vi.fn()
    const wrapper = mountTime({ modelValue: '09:00', onEntryErrorChange })
    const input = wrapper.get('input')
    await input.setValue('25:99')
    expect(wrapper.text()).not.toContain('Invalid time')
    expect(input.attributes('aria-invalid')).toBeUndefined()
    expect(onEntryErrorChange).not.toHaveBeenCalled()

    await input.trigger('blur')
    expect((input.element as HTMLInputElement).value).toBe('25:99')
    expect(wrapper.text()).toContain('Invalid time')
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(onEntryErrorChange).toHaveBeenCalledTimes(1)
    expect(onEntryErrorChange).toHaveBeenLastCalledWith({ kind: 'unreadable', text: '25:99' })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('没打完的时间什么都不标', async () => {
    const wrapper = mountTime({ modelValue: null, min: '09:00', max: '17:00' })
    const input = wrapper.get('input')
    await input.setValue('7:3')
    expect(wrapper.text()).not.toContain('outside')
    expect(input.attributes('aria-invalid')).toBeUndefined()
  })

  it('完整却超出范围的时间立刻亮出来，并报出时间', async () => {
    const onEntryErrorChange = vi.fn()
    const wrapper = mountTime({ modelValue: '10:00', min: '09:00', max: '17:00', onEntryErrorChange })
    const input = wrapper.get('input')
    await input.setValue('18:30')
    expect(wrapper.text()).toContain('Time is outside the allowed range')
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(onEntryErrorChange).toHaveBeenLastCalledWith({ kind: 'outOfRange', text: '18:30', time: '18:30' })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    await input.setValue('12:00')
    expect(wrapper.text()).not.toContain('outside')
    expect(input.attributes('aria-invalid')).toBeUndefined()
    expect(onEntryErrorChange).toHaveBeenLastCalledWith(null)
  })

  it('blur-or-enter 下完整却超出范围的时间要等 Enter 或失焦', async () => {
    const wrapper = mountTime({ modelValue: '10:00', min: '09:00', max: '17:00', entryErrorBehavior: 'blur-or-enter' })
    const input = wrapper.get('input')
    await input.setValue('18:30')
    expect(wrapper.text()).not.toContain('outside')
    await input.trigger('blur')
    expect(wrapper.text()).toContain('Time is outside the allowed range')
  })

  it('enter 收下打进来的文字，并且不拦着 Enter', async () => {
    const wrapper = mountTime({ modelValue: null })
    const input = wrapper.get('input')
    await input.setValue('13:15')
    const event = pressEnter(input.element as HTMLInputElement)
    await nextTick()
    expect(event.defaultPrevented).toBe(false)
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['13:15'])
  })

  it('enter 让读不成的文字亮出原因，也不拦着 Enter', async () => {
    const wrapper = mountTime({ modelValue: null })
    const input = wrapper.get('input')
    await input.setValue('soon')
    const event = pressEnter(input.element as HTMLInputElement)
    await nextTick()
    expect(event.defaultPrevented).toBe(false)
    expect(wrapper.text()).toContain('Invalid time')
  })

  it('原因只念一次，调用方的 error 说明优先，警告不挡住拒绝', async () => {
    const wrapper = mountTime({ modelValue: null, status: { type: 'warning', message: 'Slots are tight' } })
    const input = wrapper.get('input')
    await input.setValue('soon')
    await input.trigger('blur')
    expect(wrapper.text()).toContain('Invalid time')
    expect(wrapper.text()).not.toContain('Slots are tight')

    const withError = mountTime({ modelValue: null, status: { type: 'error', message: 'Pick a slot' } })
    const second = withError.get('input')
    await second.setValue('soon')
    await second.trigger('blur')
    expect(withError.text()).toContain('Pick a slot')
    expect(withError.text()).not.toContain('Invalid time')
    // 字段的状态没变，所以由字段自己的 alert 念一次。
    expect(withError.get('.astryx-date-input-alert').text()).toBe('Pick a slot')
  })

  it('被拒的文字留着时，表单提交的是已提交的时间', async () => {
    const wrapper = mountTime({ modelValue: '09:00', name: 'start' })
    const input = wrapper.get('input')
    expect(input.attributes('name')).toBe('start')
    await input.setValue('soon')
    await input.trigger('blur')
    expect(wrapper.get('input[type="text"]').attributes('name')).toBeUndefined()
    const hidden = wrapper.get('input[type="hidden"]')
    expect(hidden.attributes('name')).toBe('start')
    expect((hidden.element as HTMLInputElement).value).toBe('09:00')
    await input.setValue('10:30')
    expect(wrapper.find('input[type="hidden"]').exists()).toBe(false)
  })

  it('调用方在 Enter 或失焦那一刻恢复自己的值，被拒的文字不被顶掉', async () => {
    const value = ref<string | null>('09:00')
    const Host = defineComponent({
      setup: () => () => h(TimeInput, {
        'label': 'Start',
        'presentation': 'text-input',
        'hourFormat': '24h',
        'modelValue': value.value,
        'onUpdate:modelValue': (next: unknown) => {
          value.value = next as string | null
        },
      }),
    })
    const wrapper = mount(Host, { attachTo: document.body })
    const input = wrapper.get('input')
    await input.setValue('soon')
    await input.trigger('blur')
    value.value = '09:00'
    await nextTick()
    expect((input.element as HTMLInputElement).value).toBe('soon')
    expect(wrapper.text()).toContain('Invalid time')
    value.value = '11:00'
    await nextTick()
    expect((input.element as HTMLInputElement).value).toBe('11:00')
  })

  it('禁用时不报拒绝，也不收打字', async () => {
    const onEntryErrorChange = vi.fn()
    const wrapper = mountTime({ modelValue: '09:00', isDisabled: true, onEntryErrorChange })
    const input = wrapper.get('input')
    await input.setValue('soon')
    await input.trigger('blur')
    expect(wrapper.text()).not.toContain('Invalid time')
    expect(onEntryErrorChange).not.toHaveBeenCalled()
  })

  it('系统时间控件改到范围外时留下拒绝，失焦回到已提交的时间', async () => {
    const wrapper = mount(TimeInput, {
      attachTo: document.body,
      props: { label: 'Start', presentation: 'native', modelValue: '10:00', min: '09:00', max: '17:00' },
    })
    const input = wrapper.get('input[type="time"]')
    const element = input.element as HTMLInputElement
    // happy-dom 会把超出 min / max 的值清成空，浏览器不会：用一个存取器模拟浏览器。
    let current = '18:30'
    Object.defineProperty(element, 'value', { configurable: true, get: () => current, set: (next: string) => {
      current = next
    } })
    await input.trigger('input')
    expect(wrapper.text()).toContain('Time is outside the allowed range')
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    await input.trigger('blur')
    expect(element.value).toBe('10:00')
    expect(wrapper.text()).toContain('Time is outside the allowed range')
    current = '12:00'
    await input.trigger('input')
    expect(wrapper.text()).not.toContain('outside')
  })
})

describe('dateTimeInput 时间那一段的拒绝', () => {
  it('时间那一段读不成的文字亮出原因，标在时间输入上', async () => {
    const wrapper = mount(DateTimeInput, {
      attachTo: document.body,
      props: { label: 'When', presentation: 'text-input', hourFormat: '24h', modelValue: '2026-03-21T09:00' },
    })
    const time = wrapper.findAll('input').at(-1)!
    await time.setValue('soon')
    await time.trigger('blur')
    expect(wrapper.text()).toContain('Invalid time')
    expect(time.attributes('aria-invalid')).toBe('true')
    expect((time.element as HTMLInputElement).value).toBe('soon')
  })
})

describe('忙碌的时间字段', () => {
  it('timeInput 的转圈不出声，进入忙碌时字段自己播报一次', async () => {
    const wrapper = mountTime({ modelValue: null })
    await wrapper.setProps({ isLoading: true })
    await nextFrame()
    await nextFrame()
    expect(wrapper.get('.astryx-spinner').attributes('aria-hidden')).toBe('true')
    expect(document.querySelector('[data-astryx-live-region="polite"]')?.textContent).toBe('Loading')
  })

  it('dateTimeInput 的转圈不出声，进入忙碌时字段自己播报一次', async () => {
    const wrapper = mount(DateTimeInput, {
      attachTo: document.body,
      props: { label: 'When', presentation: 'text-input', modelValue: null },
    })
    await wrapper.setProps({ isLoading: true })
    await nextFrame()
    await nextFrame()
    expect(wrapper.get('.astryx-spinner').attributes('aria-hidden')).toBe('true')
    expect(document.querySelector('[data-astryx-live-region="polite"]')?.textContent).toBe('Loading')
  })
})
