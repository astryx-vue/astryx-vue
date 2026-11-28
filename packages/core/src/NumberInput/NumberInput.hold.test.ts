import type { VueWrapper } from '@vue/test-utils'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import NumberInput from './NumberInput.vue'

enableAutoUnmount(afterEach)
afterEach(() => {
  vi.useRealTimers()
  document.body.innerHTML = ''
})

type Wrapper = VueWrapper<InstanceType<typeof NumberInput>>

function render(props: Record<string, unknown> = {}, attrs: Record<string, unknown> = {}): Wrapper {
  const wrapper: Wrapper = mount(NumberInput, {
    attachTo: document.body,
    props: {
      'label': 'Seats',
      'modelValue': 5,
      'hasNumberSteppers': true,
      'onUpdate:modelValue': (value: number | null) => { void wrapper.setProps({ modelValue: value }) },
      ...props,
    },
    attrs,
  })
  return wrapper
}

function pointer(type: string, init: { pointerId?: number, pointerType?: string, button?: number } = {}): Event {
  const event = new MouseEvent(type, { bubbles: true, cancelable: true, button: init.button ?? 0, detail: 1 })
  Object.defineProperty(event, 'pointerId', { value: init.pointerId ?? 1 })
  Object.defineProperty(event, 'pointerType', { value: init.pointerType ?? 'mouse' })
  return event
}

function field(wrapper: Wrapper): HTMLInputElement {
  return wrapper.get<HTMLInputElement>('input[role="spinbutton"]').element
}

describe('numberInput held stepper', () => {
  it('repeats into the draft after half a second and commits once on release', async () => {
    vi.useFakeTimers()
    const wrapper = render()
    const increment = wrapper.get('.increment').element
    increment.dispatchEvent(pointer('pointerdown'))
    await vi.advanceTimersByTimeAsync(499)
    expect(field(wrapper).value).toBe('5')
    await vi.advanceTimersByTimeAsync(2)
    expect(field(wrapper).value).toBe('6')
    await vi.advanceTimersByTimeAsync(250)
    expect(field(wrapper).value).toBe('7')
    // 按住期间只写草稿，没有提交。
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    increment.dispatchEvent(pointer('pointerup'))
    await nextTick()
    expect(wrapper.emitted('update:modelValue')).toEqual([[7]])
    expect(wrapper.emitted('change')).toEqual([[7]])
    // 松手后跟着来的 click 不再步进。
    increment.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }))
    await nextTick()
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
  })

  it('speeds the repeats up from 250 ms toward 50 ms', async () => {
    vi.useFakeTimers()
    const wrapper = render({ modelValue: 0 })
    wrapper.get('.increment').element.dispatchEvent(pointer('pointerdown'))
    await vi.advanceTimersByTimeAsync(500)
    expect(field(wrapper).value).toBe('1')
    await vi.advanceTimersByTimeAsync(250)
    expect(field(wrapper).value).toBe('2')
    // 第三次间隔是 250 * 0.9 = 225 ms。
    await vi.advanceTimersByTimeAsync(224)
    expect(field(wrapper).value).toBe('2')
    await vi.advanceTimersByTimeAsync(2)
    expect(field(wrapper).value).toBe('3')
  })

  it('treats a press released before the first repeat as a click that steps and commits at once', async () => {
    vi.useFakeTimers()
    const wrapper = render()
    const increment = wrapper.get('.increment').element
    increment.dispatchEvent(pointer('pointerdown'))
    await vi.advanceTimersByTimeAsync(200)
    increment.dispatchEvent(pointer('pointerup'))
    increment.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }))
    await nextTick()
    expect(wrapper.emitted('update:modelValue')).toEqual([[6]])
  })

  it('gives a finger the single step of its click, with no hold', async () => {
    vi.useFakeTimers()
    const wrapper = render()
    const increment = wrapper.get('.increment').element
    increment.dispatchEvent(pointer('pointerdown', { pointerType: 'touch' }))
    await vi.advanceTimersByTimeAsync(2000)
    expect(field(wrapper).value).toBe('5')
    increment.dispatchEvent(pointer('pointerup', { pointerType: 'touch' }))
    increment.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }))
    await nextTick()
    expect(wrapper.emitted('update:modelValue')).toEqual([[6]])
  })

  it('commits what the repeats reached when the pointer is cancelled', async () => {
    vi.useFakeTimers()
    const wrapper = render()
    const increment = wrapper.get('.increment').element
    increment.dispatchEvent(pointer('pointerdown'))
    await vi.advanceTimersByTimeAsync(800)
    expect(field(wrapper).value).toBe('7')
    increment.dispatchEvent(pointer('pointercancel'))
    await nextTick()
    expect(wrapper.emitted('update:modelValue')).toEqual([[7]])
    // 取消不吞随后的 click（只有松手才吞）。
    increment.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }))
    await nextTick()
    expect(wrapper.emitted('update:modelValue')).toHaveLength(2)
  })

  it('stops repeating at the bound and still commits on release', async () => {
    vi.useFakeTimers()
    const wrapper = render({ modelValue: 8, max: 10 })
    const increment = wrapper.get('.increment').element
    increment.dispatchEvent(pointer('pointerdown'))
    await vi.advanceTimersByTimeAsync(5000)
    expect(field(wrapper).value).toBe('10')
    increment.dispatchEvent(pointer('pointerup'))
    await nextTick()
    expect(wrapper.emitted('update:modelValue')).toEqual([[10]])
  })

  it('freezes a hold when the field turns read-only, and commits nothing', async () => {
    vi.useFakeTimers()
    const wrapper = render()
    const increment = wrapper.get('.increment').element
    increment.dispatchEvent(pointer('pointerdown'))
    await vi.advanceTimersByTimeAsync(600)
    await wrapper.setProps({ isReadOnly: true })
    await vi.advanceTimersByTimeAsync(2000)
    increment.dispatchEvent(pointer('pointerup'))
    await nextTick()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(field(wrapper).value).toBe('5')
  })

  it('ignores a press by a secondary button', async () => {
    vi.useFakeTimers()
    const wrapper = render()
    wrapper.get('.increment').element.dispatchEvent(pointer('pointerdown', { button: 2 }))
    await vi.advanceTimersByTimeAsync(2000)
    expect(field(wrapper).value).toBe('5')
  })

  it('a click without a pointer, as a screen reader makes, steps', async () => {
    const wrapper = render()
    wrapper.get('.increment').element.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 0 }))
    await nextTick()
    expect(wrapper.emitted('update:modelValue')).toEqual([[6]])
  })
})

describe('numberInput disabled', () => {
  it('runs no caller handler except focus and blur, and Enter does not submit', async () => {
    const onClick = vi.fn()
    const onKeyup = vi.fn()
    const onFocus = vi.fn()
    const wrapper = render({ isDisabled: true, hasNumberSteppers: false }, { onClick, onKeyup, onFocus })
    const input = wrapper.get<HTMLInputElement>('input[role="spinbutton"]')
    await input.trigger('click')
    await input.trigger('keyup', { key: 'a' })
    input.element.focus()
    expect(onClick).not.toHaveBeenCalled()
    expect(onKeyup).not.toHaveBeenCalled()
    expect(onFocus).toHaveBeenCalledTimes(1)
    const enter = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true })
    input.element.dispatchEvent(enter)
    expect(enter.defaultPrevented).toBe(true)
    expect(wrapper.emitted('enter')).toBeUndefined()
    expect(wrapper.emitted('keydown')).toBeUndefined()
  })

  it('steps with neither keys, wheel nor stepper buttons', async () => {
    const wrapper = render({ isDisabled: true })
    await wrapper.get('input[role="spinbutton"]').trigger('keydown', { key: 'ArrowUp' })
    await wrapper.get('.increment').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
})

describe('numberInput focus', () => {
  it('selects the whole editable text again after formatValue swaps it in', async () => {
    const wrapper = render({ modelValue: 1500000, hasNumberSteppers: false, formatValue: (value: number) => value.toLocaleString('en-US') })
    const input = field(wrapper)
    expect(input.value).toBe('1,500,000')
    input.setSelectionRange(0, input.value.length)
    // Tab 聚焦：全选着进来。
    input.focus()
    await nextTick()
    await nextTick()
    expect(input.value).toBe('1500000')
    expect(input.selectionStart).toBe(0)
    expect(input.selectionEnd).toBe(input.value.length)
  })

  it('leaves a caret that a click placed alone', async () => {
    const wrapper = render({ modelValue: 1500000, hasNumberSteppers: false, formatValue: (value: number) => value.toLocaleString('en-US') })
    const input = field(wrapper)
    input.setSelectionRange(3, 3)
    input.focus()
    await nextTick()
    await nextTick()
    expect(input.selectionStart).toBe(input.selectionEnd)
  })

  it('focuses the input inside the tap on the clear button', async () => {
    const wrapper = render({ hasClear: true, hasNumberSteppers: false })
    const focus = vi.spyOn(field(wrapper), 'focus')
    const raf = vi.spyOn(window, 'requestAnimationFrame')
    wrapper.get('.astryx-number-input-clear').element.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }))
    expect(focus).toHaveBeenCalledWith({ preventScroll: true })
    expect(raf).not.toHaveBeenCalled()
    raf.mockRestore()
  })
})

describe('numberInput theme seam and start icon', () => {
  it('marks each stepper with number-input-stepper and its direction', () => {
    const wrapper = render()
    const steppers = wrapper.findAll('.astryx-number-input-stepper')
    expect(steppers.map(item => item.attributes('data-direction'))).toEqual(['increment', 'decrement'])
  })

  it('takes a semantic icon name as startIcon', () => {
    const wrapper = render({ startIcon: 'search' })
    expect(wrapper.find('.astryx-number-input-icon .astryx-icon').exists()).toBe(true)
  })
})
