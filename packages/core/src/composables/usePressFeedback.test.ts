import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import {
  isPressFeedbackInstalledForTest,
  PRESSABLE_ATTRIBUTE,
  PRESSED_ATTRIBUTE,
  resetPressFeedbackForTest,
} from './internal/pressFeedback.js'
import { usePressFeedback } from './usePressFeedback.js'

function mountPressable(nested = false) {
  const wrapper = mount(defineComponent({
    name: 'PressableHost',
    setup() {
      const { pressableProps } = usePressFeedback()
      return () => h('div', { class: 'surface', ...pressableProps }, [
        h('span', { class: 'label' }, 'Press me'),
        nested ? h('div', { class: 'inner', ...pressableProps }, [h('span', { class: 'inner-label' }, 'Inner')]) : null,
      ])
    },
  }), { attachTo: document.body })

  return wrapper
}

function pointer(target: Element, type: string, init: PointerEventInit = {}): void {
  target.dispatchEvent(new PointerEvent(type, { bubbles: true, pointerId: 1, pointerType: 'touch', clientX: 10, clientY: 10, ...init }))
}

function isPressed(target: Element): boolean {
  return target.hasAttribute(PRESSED_ATTRIBUTE)
}

describe('usePressFeedback', () => {
  afterEach(() => {
    vi.useRealTimers()
    resetPressFeedbackForTest()
  })

  it('marks the element with the pressable attribute', () => {
    const wrapper = mountPressable()
    expect(wrapper.get('.surface').attributes(PRESSABLE_ATTRIBUTE)).toBe('')
    expect(wrapper.get('.surface').attributes(PRESSED_ATTRIBUTE)).toBeUndefined()
  })

  it('waits before believing a press', async () => {
    vi.useFakeTimers()
    const wrapper = mountPressable()
    const surface = wrapper.get('.surface').element

    pointer(surface, 'pointerdown')
    await vi.advanceTimersByTimeAsync(149)
    expect(isPressed(surface)).toBe(false)

    await vi.advanceTimersByTimeAsync(1)
    expect(isPressed(surface)).toBe(true)

    pointer(surface, 'pointerup')
    expect(isPressed(surface)).toBe(false)
  })

  it('answers a quick tap at the lift', async () => {
    vi.useFakeTimers()
    const wrapper = mountPressable()
    const surface = wrapper.get('.surface').element

    pointer(surface, 'pointerdown')
    await vi.advanceTimersByTimeAsync(50)
    expect(isPressed(surface)).toBe(false)

    pointer(surface, 'pointerup')
    expect(isPressed(surface)).toBe(true)

    await vi.advanceTimersByTimeAsync(0)
    expect(isPressed(surface)).toBe(false)
  })

  it('gives up once the finger travels far enough, and never comes back', async () => {
    vi.useFakeTimers()
    const wrapper = mountPressable()
    const surface = wrapper.get('.surface').element

    pointer(surface, 'pointerdown')
    await vi.advanceTimersByTimeAsync(149)
    pointer(surface, 'pointermove', { clientY: 25 })

    await vi.advanceTimersByTimeAsync(500)
    expect(isPressed(surface)).toBe(false)

    pointer(surface, 'pointerup')
    expect(isPressed(surface)).toBe(false)
  })

  it('keeps the press while the finger stays inside the tolerance', async () => {
    vi.useFakeTimers()
    const wrapper = mountPressable()
    const surface = wrapper.get('.surface').element

    pointer(surface, 'pointerdown')
    pointer(surface, 'pointermove', { clientY: 15 })
    await vi.advanceTimersByTimeAsync(150)
    expect(isPressed(surface)).toBe(true)
  })

  it('cancels when a scroll claims the gesture', async () => {
    vi.useFakeTimers()
    const wrapper = mountPressable()
    const surface = wrapper.get('.surface').element

    pointer(surface, 'pointerdown')
    await vi.advanceTimersByTimeAsync(150)
    expect(isPressed(surface)).toBe(true)

    document.dispatchEvent(new Event('scroll'))
    expect(isPressed(surface)).toBe(false)
  })

  it('drops the press when the browser cancels the gesture', async () => {
    vi.useFakeTimers()
    const wrapper = mountPressable()
    const surface = wrapper.get('.surface').element

    pointer(surface, 'pointerdown')
    await vi.advanceTimersByTimeAsync(150)
    pointer(surface, 'pointercancel')
    expect(isPressed(surface)).toBe(false)
  })

  it('leaves the mouse to :active', async () => {
    vi.useFakeTimers()
    const wrapper = mountPressable()
    const surface = wrapper.get('.surface').element

    pointer(surface, 'pointerdown', { pointerType: 'mouse' })
    await vi.advanceTimersByTimeAsync(200)
    expect(isPressed(surface)).toBe(false)
  })

  it('presses the innermost marked element', async () => {
    vi.useFakeTimers()
    const wrapper = mountPressable(true)
    const surface = wrapper.get('.surface').element
    const inner = wrapper.get('.inner').element

    pointer(wrapper.get('.inner-label').element, 'pointerdown')
    await vi.advanceTimersByTimeAsync(150)
    expect(isPressed(inner)).toBe(true)
    expect(isPressed(surface)).toBe(false)
  })

  it('installs one controller for every pressable and removes it with the last one', () => {
    resetPressFeedbackForTest()
    const first = mountPressable()
    const second = mountPressable()
    expect(isPressFeedbackInstalledForTest()).toBe(true)

    first.unmount()
    expect(isPressFeedbackInstalledForTest()).toBe(true)

    second.unmount()
    expect(isPressFeedbackInstalledForTest()).toBe(false)
  })
})
