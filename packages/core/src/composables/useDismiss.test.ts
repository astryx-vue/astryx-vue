import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import { useDismiss } from './useDismiss.js'

describe('useDismiss', () => {
  let container: HTMLDivElement
  let trigger: HTMLButtonElement
  let dismissSpy: () => void

  beforeEach(() => {
    container = document.createElement('div')
    trigger = document.createElement('button')
    trigger.textContent = 'Trigger'
    container.textContent = 'Container content'
    document.body.append(trigger, container)
    dismissSpy = vi.fn()
  })

  afterEach(() => {
    container.remove()
    trigger.remove()
  })

  it('点击容器外部应该触发关闭', async () => {
    const containerRef = ref(container)
    const triggerRef = ref(trigger)
    const isEnabled = ref(true)

    useDismiss({
      container: containerRef,
      trigger: triggerRef,
      isEnabled,
      onDismiss: dismissSpy,
    })

    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 10))

    const event = new MouseEvent('mousedown', { bubbles: true })
    document.body.dispatchEvent(event)

    await nextTick()
    expect(dismissSpy).toHaveBeenCalledOnce()
  })

  it('点击容器内部不应该触发关闭', async () => {
    const containerRef = ref(container)
    const triggerRef = ref(trigger)
    const isEnabled = ref(true)

    useDismiss({
      container: containerRef,
      trigger: triggerRef,
      isEnabled,
      onDismiss: dismissSpy,
    })

    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 10))

    const event = new MouseEvent('mousedown', { bubbles: true })
    container.dispatchEvent(event)

    await nextTick()
    expect(dismissSpy).not.toHaveBeenCalled()
  })

  it('点击触发器不应该触发关闭', async () => {
    const containerRef = ref(container)
    const triggerRef = ref(trigger)
    const isEnabled = ref(true)

    useDismiss({
      container: containerRef,
      trigger: triggerRef,
      isEnabled,
      onDismiss: dismissSpy,
    })

    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 10))

    const event = new MouseEvent('mousedown', { bubbles: true })
    trigger.dispatchEvent(event)

    await nextTick()
    expect(dismissSpy).not.toHaveBeenCalled()
  })

  it('按 Escape 键应该触发关闭', async () => {
    const containerRef = ref(container)
    const isEnabled = ref(true)

    useDismiss({
      container: containerRef,
      isEnabled,
      onDismiss: dismissSpy,
    })

    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 10))

    const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })
    document.dispatchEvent(event)

    await nextTick()
    expect(dismissSpy).toHaveBeenCalledOnce()
    expect(event.defaultPrevented).toBe(true)
  })

  it('当 enableEscape 为 false 时按 Escape 键不应该触发关闭', async () => {
    const containerRef = ref(container)
    const isEnabled = ref(true)
    const enableEscape = ref(false)

    useDismiss({
      container: containerRef,
      isEnabled,
      enableEscape,
      onDismiss: dismissSpy,
    })

    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 10))

    const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
    document.dispatchEvent(event)

    await nextTick()
    expect(dismissSpy).not.toHaveBeenCalled()
  })

  it('当禁用时不应该响应任何事件', async () => {
    const containerRef = ref(container)
    const isEnabled = ref(false)

    useDismiss({
      container: containerRef,
      isEnabled,
      onDismiss: dismissSpy,
    })

    await nextTick()

    const mouseEvent = new MouseEvent('mousedown', { bubbles: true })
    document.body.dispatchEvent(mouseEvent)

    const keyEvent = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
    document.dispatchEvent(keyEvent)

    await nextTick()
    expect(dismissSpy).not.toHaveBeenCalled()
  })
})
