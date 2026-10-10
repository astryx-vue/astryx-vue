import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import { useFocusTrap } from './useFocusTrap.js'

describe('useFocusTrap', () => {
  let container: HTMLDivElement
  let button1: HTMLButtonElement
  let button2: HTMLButtonElement

  beforeEach(() => {
    container = document.createElement('div')
    button1 = document.createElement('button')
    button2 = document.createElement('button')
    button1.textContent = 'Button 1'
    button2.textContent = 'Button 2'
    container.append(button1, button2)
    document.body.append(container)
  })

  afterEach(() => {
    container.remove()
  })

  it('当启用时应该捕获 Tab 键焦点', async () => {
    const containerRef = ref(container)
    const isEnabled = ref(true)

    useFocusTrap({
      container: containerRef,
      isEnabled,
    })

    await nextTick()
    button2.focus()
    expect(document.activeElement).toBe(button2)

    const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true, composed: true })
    button2.dispatchEvent(event)

    await nextTick()
    expect(event.defaultPrevented).toBe(true)
  })

  it('当按 Shift+Tab 时应该反向循环', async () => {
    const containerRef = ref(container)
    const isEnabled = ref(true)

    useFocusTrap({
      container: containerRef,
      isEnabled,
    })

    await nextTick()
    button1.focus()

    const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true, composed: true })
    button1.dispatchEvent(event)

    await nextTick()
    expect(event.defaultPrevented).toBe(true)
  })

  it('当禁用时不应该捕获焦点', async () => {
    const containerRef = ref(container)
    const isEnabled = ref(false)

    useFocusTrap({
      container: containerRef,
      isEnabled,
    })

    await nextTick()
    button1.focus()

    const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true })
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault')
    document.dispatchEvent(event)

    await nextTick()
    expect(preventDefaultSpy).not.toHaveBeenCalled()
  })

  it('focusFirst 应该聚焦第一个可聚焦元素', async () => {
    const containerRef = ref(container)
    const isEnabled = ref(false)

    const trap = useFocusTrap({
      container: containerRef,
      isEnabled,
    })

    await nextTick()
    trap.focusFirst()
    expect(document.activeElement).toBe(button1)
  })

  it('focusLast 应该聚焦最后一个可聚焦元素', async () => {
    const containerRef = ref(container)
    const isEnabled = ref(false)

    const trap = useFocusTrap({
      container: containerRef,
      isEnabled,
    })

    await nextTick()
    trap.focusLast()
    expect(document.activeElement).toBe(button2)
  })

  it('应该在启用时使用 initialFocus', async () => {
    const containerRef = ref(container)
    const isEnabled = ref(false)

    useFocusTrap({
      container: containerRef,
      isEnabled,
      initialFocus: () => button2,
    })

    await nextTick()
    isEnabled.value = true
    await nextTick()

    expect(document.activeElement).toBe(button2)
  })
})
