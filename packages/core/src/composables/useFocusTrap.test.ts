import { enableAutoUnmount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import { mountComposable } from './testing/mountComposable.js'
import { useFocusTrap } from './useFocusTrap.js'

enableAutoUnmount(afterEach)

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

    mountComposable(() => useFocusTrap({
      container: containerRef,
      isEnabled,
    }))

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

    mountComposable(() => useFocusTrap({
      container: containerRef,
      isEnabled,
    }))

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

    mountComposable(() => useFocusTrap({
      container: containerRef,
      isEnabled,
    }))

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

    const { result: trap } = mountComposable(() => useFocusTrap({
      container: containerRef,
      isEnabled,
    }))

    await nextTick()
    trap.focusFirst()
    expect(document.activeElement).toBe(button1)
  })

  it('focusLast 应该聚焦最后一个可聚焦元素', async () => {
    const containerRef = ref(container)
    const isEnabled = ref(false)

    const { result: trap } = mountComposable(() => useFocusTrap({
      container: containerRef,
      isEnabled,
    }))

    await nextTick()
    trap.focusLast()
    expect(document.activeElement).toBe(button2)
  })

  it('应该在启用时使用 initialFocus', async () => {
    const containerRef = ref(container)
    const isEnabled = ref(false)

    mountComposable(() => useFocusTrap({
      container: containerRef,
      isEnabled,
      initialFocus: () => button2,
    }))

    await nextTick()
    isEnabled.value = true
    await nextTick()

    expect(document.activeElement).toBe(button2)
  })

  it('把 isActive 当 isEnabled 的另一个名字', async () => {
    const isActive = ref(false)

    mountComposable(() => useFocusTrap({ container: ref(container), isActive }))

    await nextTick()
    isActive.value = true
    await nextTick()
    button2.focus()

    const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true })
    button2.dispatchEvent(event)
    expect(event.defaultPrevented).toBe(true)
  })

  it('容器里按下 Escape 时调用 onEscape', async () => {
    const onEscape = vi.fn()

    mountComposable(() => useFocusTrap({ container: ref(container), isEnabled: ref(true), onEscape }))
    await nextTick()

    button1.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    expect(onEscape).toHaveBeenCalledOnce()

    button1.blur()
    const outside = document.createElement('button')
    document.body.append(outside)
    outside.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    expect(onEscape).toHaveBeenCalledOnce()
    outside.remove()
  })

  it('不传 container 时返回自己建的 containerRef', async () => {
    const { result: trap } = mountComposable(() => useFocusTrap({ isEnabled: ref(true) }))
    trap.containerRef.value = container
    await nextTick()

    button2.focus()
    const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true })
    button2.dispatchEvent(event)

    expect(event.defaultPrevented).toBe(true)
  })

  it('关闭时把焦点还给打开前的元素', async () => {
    const trigger = document.createElement('button')
    document.body.append(trigger)
    trigger.focus()
    const isEnabled = ref(false)

    mountComposable(() => useFocusTrap({ container: ref(container), isEnabled }))
    await nextTick()

    isEnabled.value = true
    await nextTick()
    expect(document.activeElement).toBe(button1)

    isEnabled.value = false
    await nextTick()
    expect(document.activeElement).toBe(trigger)
    trigger.remove()
  })

  it('焦点没进过陷阱就不还焦点，卸载时也一样', async () => {
    const trigger = document.createElement('button')
    const empty = document.createElement('div')
    document.body.append(trigger, empty)
    trigger.focus()

    const isEnabled = ref(false)
    mountComposable(() => useFocusTrap({ container: ref(empty), isEnabled }))
    await nextTick()

    isEnabled.value = true
    await nextTick()
    isEnabled.value = false
    await nextTick()
    expect(document.activeElement).toBe(trigger)

    const emptyRef = ref<HTMLElement | null>(empty)
    const mounted = mountComposable(() => useFocusTrap({ container: emptyRef, isEnabled: ref(true) }))
    trigger.focus()
    mounted.wrapper.unmount()
    expect(document.activeElement).toBe(trigger)

    trigger.remove()
    empty.remove()
  })
})
