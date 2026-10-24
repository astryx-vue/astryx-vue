import { enableAutoUnmount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { resetInteractionModalityForTest } from './internal/interactionModality.js'
import { mountComposable } from './testing/mountComposable.js'
import { isActionTrigger, useTouchTrigger } from './useTouchTrigger.js'

enableAutoUnmount(afterEach)

let trigger: HTMLElement
let layer: HTMLElement

beforeEach(() => {
  resetInteractionModalityForTest()
  trigger = document.createElement('span')
  trigger.textContent = 'Trigger'
  layer = document.createElement('div')
  layer.id = 'layer-1'
  document.body.append(trigger, layer)
})

afterEach(() => {
  trigger.remove()
  layer.remove()
})

type Touch = ReturnType<typeof useTouchTrigger>

/** 像组件那样把返回的处理函数绑到元素上。 */
function bindHandlers(element: HTMLElement, touch: Touch): void {
  element.addEventListener('pointerenter', touch.handlePointerEnter)
  element.addEventListener('pointerdown', (event) => {
    touch.handlePointerDown(event as PointerEvent)
  })
}

function press(element: HTMLElement, pointerType = 'touch'): void {
  element.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true, pointerType }))
}

function setup(options: Partial<Parameters<typeof useTouchTrigger>[0]> = {}) {
  const show = vi.fn()
  const hide = vi.fn()
  const isOpen = ref(false)
  const target = options.triggerRef ?? ref<HTMLElement | null>(trigger)
  const { result: touch } = mountComposable(() => useTouchTrigger({
    touchTrigger: 'auto',
    isOpen,
    layerId: 'layer-1',
    show,
    hide,
    ...options,
    triggerRef: target,
  }))
  bindHandlers(target.value ?? trigger, touch)
  return { show, hide, isOpen, touch, target }
}

describe('isActionTrigger', () => {
  it('treats a button as an action trigger', () => {
    expect(isActionTrigger(document.createElement('button'))).toBe(true)
  })

  it('treats a plain span as inert even when it carries a tabindex', () => {
    const span = document.createElement('span')
    span.setAttribute('tabindex', '0')
    expect(isActionTrigger(span)).toBe(false)
  })

  it('lets an explicit role win over the tag', () => {
    const button = document.createElement('button')
    button.setAttribute('role', 'presentation')
    expect(isActionTrigger(button)).toBe(false)

    const span = document.createElement('span')
    span.setAttribute('role', 'button')
    expect(isActionTrigger(span)).toBe(true)
  })

  it('counts an anchor with an href but not one without', () => {
    const link = document.createElement('a')
    link.setAttribute('href', '#')
    expect(isActionTrigger(link)).toBe(true)

    const anchor = document.createElement('a')
    expect(isActionTrigger(anchor)).toBe(false)
  })
})

describe('useTouchTrigger', () => {
  it('opens an inert trigger on a finger tap', () => {
    const { show, hide, touch } = setup()

    // 到达时只记下指针类型，不打开。
    trigger.dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'touch' }))
    expect(touch.isTouchPointer.value).toBe(true)
    expect(show).not.toHaveBeenCalled()

    press(trigger)

    expect(show).toHaveBeenCalledOnce()
    expect(hide).not.toHaveBeenCalled()
  })

  it('leaves an action trigger alone on a finger tap', () => {
    const button = document.createElement('button')
    document.body.append(button)
    const { show } = setup({ triggerRef: ref<HTMLElement | null>(button) })

    press(button)

    expect(show).not.toHaveBeenCalled()
    button.remove()
  })

  it('always opens on tap when the mode is tap', () => {
    const button = document.createElement('button')
    document.body.append(button)
    const { show } = setup({ triggerRef: ref<HTMLElement | null>(button), touchTrigger: 'tap' })

    press(button)

    expect(show).toHaveBeenCalledOnce()
    button.remove()
  })

  it('never opens on touch when the mode is none', () => {
    const { show } = setup({ touchTrigger: 'none' })

    press(trigger)

    expect(show).not.toHaveBeenCalled()
  })

  it('toggles a tap-opened layer shut on the next tap', () => {
    const { show, hide, isOpen } = setup()

    press(trigger)
    isOpen.value = true
    press(trigger)

    expect(show).toHaveBeenCalledOnce()
    expect(hide).toHaveBeenCalledOnce()
  })

  it('closes a tap-opened layer when the next press lands outside', () => {
    const { hide } = setup()
    press(trigger)

    const outside = document.createElement('div')
    document.body.append(outside)
    press(outside)

    expect(hide).toHaveBeenCalledOnce()
    outside.remove()
  })

  it('keeps a tap-opened layer open when the next press is inside it', () => {
    const { hide } = setup()
    press(trigger)

    const inside = document.createElement('p')
    layer.append(inside)
    press(inside)

    expect(hide).not.toHaveBeenCalled()
    inside.remove()
  })

  it('leaves the toggle to the trigger when the next press is its own trigger', () => {
    const { hide } = setup()
    press(trigger)

    press(trigger)

    // 只算触发器自己那一次开关，外面那套监听不能也关一次。
    expect(hide).toHaveBeenCalledOnce()
  })

  it('drops the outside listener once the layer closes another way', () => {
    const { hide, isOpen } = setup()
    press(trigger)

    isOpen.value = true
    isOpen.value = false
    const outside = document.createElement('div')
    document.body.append(outside)
    press(outside)

    expect(hide).not.toHaveBeenCalled()
    outside.remove()
  })

  it('never toggles a controlled layer', () => {
    const { show } = setup({ isControlled: true })

    press(trigger)

    expect(show).not.toHaveBeenCalled()
  })

  it('does nothing on mouse presses', () => {
    const { show, touch } = setup()

    press(trigger, 'mouse')

    expect(show).not.toHaveBeenCalled()
    expect(touch.isTouchPointer.value).toBe(false)
  })

  it('marks a hovering pen as hovering and a landed pen as touch', () => {
    const { touch } = setup()

    trigger.dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'pen' }))
    expect(touch.isTouchPointer.value).toBe(false)

    press(trigger, 'pen')
    expect(touch.isTouchPointer.value).toBe(true)
  })

  it('reports a touch interaction only while the pointer modality is in charge', () => {
    const { touch } = setup()

    press(trigger)
    expect(touch.isTouchInteraction()).toBe(true)

    // 用户一碰键盘，焦点驱动的浮层就该照常工作。
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }))
    expect(touch.isTouchInteraction()).toBe(false)
  })
})
