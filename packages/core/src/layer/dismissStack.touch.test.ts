import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { currentGesture } from '../composables/internal/gestureCounter.js'
import { didOutsideDismissInGesture, pushLayer, resetDismissStackForTests } from './dismissStack.js'

function touch(type: string, target: EventTarget, x = 10, y = 10): void {
  target.dispatchEvent(new PointerEvent(type, { bubbles: true, cancelable: true, pointerType: 'touch', pointerId: 7, clientX: x, clientY: y }))
}

function openLayer(options: { dismissOnOutsidePan?: boolean, doc?: Document } = {}): { el: HTMLElement, onDismiss: ReturnType<typeof vi.fn> } {
  const doc = options.doc ?? document
  const el = doc.createElement('div')
  doc.body.append(el)
  const onDismiss = vi.fn()
  pushLayer({
    token: {},
    getContainer: () => el,
    dismissOnPointerOutside: true,
    dismissOnOutsidePan: options.dismissOnOutsidePan,
    dismissOnEscape: 'close',
    onDismiss,
  })
  return { el, onDismiss }
}

beforeEach(() => {
  resetDismissStackForTests()
})

afterEach(() => {
  resetDismissStackForTests()
  document.body.innerHTML = ''
})

describe('关闭栈：手指在外面的按压', () => {
  it('轻点外面在抬起时才关，落下时不关', () => {
    const layer = openLayer()

    touch('pointerdown', document.body)
    expect(layer.onDismiss).not.toHaveBeenCalled()

    touch('pointerup', document.body)
    expect(layer.onDismiss).toHaveBeenCalledOnce()
  })

  it('在外面滑开时，弹出框留着，菜单关掉', () => {
    const popover = openLayer({ dismissOnOutsidePan: false })
    const menu = openLayer()

    // 菜单在上面，先只关菜单：一次按压只关最上面那层。
    touch('pointerdown', document.body, 10, 10)
    expect(menu.onDismiss).not.toHaveBeenCalled()
    touch('pointermove', document.body, 10, 40)
    expect(menu.onDismiss).toHaveBeenCalledOnce()

    touch('pointerup', document.body, 10, 40)
    expect(popover.onDismiss).not.toHaveBeenCalled()
  })

  it('弹出框在外面滑动或被浏览器接走滚动都不关', () => {
    const popover = openLayer({ dismissOnOutsidePan: false })

    touch('pointerdown', document.body, 10, 10)
    touch('pointermove', document.body, 10, 30)
    touch('pointerup', document.body, 10, 30)
    expect(popover.onDismiss).not.toHaveBeenCalled()

    touch('pointerdown', document.body, 10, 10)
    touch('pointercancel', document.body, 10, 10)
    expect(popover.onDismiss).not.toHaveBeenCalled()

    touch('pointerdown', document.body, 10, 10)
    touch('pointermove', document.body, 14, 14)
    touch('pointerup', document.body, 14, 14)
    expect(popover.onDismiss).toHaveBeenCalledOnce()
  })

  it('浏览器把手指接走滚动时，菜单当场关', () => {
    const menu = openLayer()

    touch('pointerdown', document.body)
    expect(menu.onDismiss).not.toHaveBeenCalled()
    touch('pointercancel', document.body)

    expect(menu.onDismiss).toHaveBeenCalledOnce()
  })

  it('鼠标照旧在按下时关，手指等到抬起', () => {
    const layer = openLayer()

    touch('pointerdown', document.body)
    expect(layer.onDismiss).not.toHaveBeenCalled()
    touch('pointerup', document.body)
    expect(layer.onDismiss).toHaveBeenCalledTimes(1)

    document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerType: 'mouse' }))
    expect(layer.onDismiss).toHaveBeenCalledTimes(2)
  })

  it('记下这次手势关掉过一层', () => {
    openLayer()
    currentGesture()

    touch('pointerdown', document.body)
    const gesture = currentGesture()
    expect(didOutsideDismissInGesture(gesture)).toBe(false)

    touch('pointerup', document.body)
    expect(didOutsideDismissInGesture(gesture)).toBe(true)
  })
})

describe('关闭栈：第二个 document', () => {
  it('层在 iframe 里时，Escape 和点外面在那个 document 里也管用', () => {
    const frame = document.createElement('iframe')
    document.body.append(frame)
    const doc = frame.contentDocument!
    const layer = openLayer({ doc })

    doc.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
    expect(layer.onDismiss).toHaveBeenCalledOnce()

    doc.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerType: 'mouse' }))
    expect(layer.onDismiss).toHaveBeenCalledTimes(2)
  })

  it('另一个 document 里的按键和按压不碰这一层', () => {
    const frame = document.createElement('iframe')
    document.body.append(frame)
    const layer = openLayer({ doc: frame.contentDocument! })

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
    document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerType: 'mouse' }))

    expect(layer.onDismiss).not.toHaveBeenCalled()
  })
})
