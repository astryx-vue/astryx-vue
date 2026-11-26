import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { pushLayer, resetDismissStackForTests } from './dismissStack.js'

let nodes: HTMLElement[] = []

function openLayer(): { onDismiss: () => void, outside: HTMLElement } {
  const el = document.createElement('div')
  const trigger = document.createElement('button')
  const outside = document.createElement('p')
  document.body.append(el, trigger, outside)
  nodes.push(el, trigger, outside)
  const onDismiss = vi.fn()
  pushLayer({
    token: {},
    getContainer: () => el,
    getTrigger: () => trigger,
    dismissOnPointerOutside: true,
    dismissOnEscape: 'close',
    onDismiss,
  })
  return { onDismiss, outside }
}

function fire(type: string, target: EventTarget, init: PointerEventInit = {}): void {
  target.dispatchEvent(new PointerEvent(type, { bubbles: true, cancelable: true, pointerType: 'touch', pointerId: 1, ...init }))
}

beforeEach(() => {
  resetDismissStackForTests()
})

afterEach(() => {
  resetDismissStackForTests()
  nodes.forEach(node => node.remove())
  nodes = []
})

describe('触摸在层外按下', () => {
  it('抬起时才关，按下那一刻还开着', () => {
    const { onDismiss, outside } = openLayer()
    fire('pointerdown', outside, { clientX: 5, clientY: 5 })
    expect(onDismiss).not.toHaveBeenCalled()
    fire('pointerup', outside, { clientX: 6, clientY: 5 })
    expect(onDismiss).toHaveBeenCalledOnce()
  })

  it('拖动超过平移距离不算点到外面，哪怕没有 pointercancel', () => {
    const { onDismiss, outside } = openLayer()
    fire('pointerdown', outside, { clientX: 5, clientY: 5 })
    fire('pointermove', outside, { clientX: 5, clientY: 60 })
    fire('pointerup', outside, { clientX: 5, clientY: 60 })
    expect(onDismiss).not.toHaveBeenCalled()
  })

  it('被浏览器取消的触摸不关', () => {
    const { onDismiss, outside } = openLayer()
    fire('pointerdown', outside, { clientX: 5, clientY: 5 })
    fire('pointercancel', outside)
    fire('pointerup', outside)
    expect(onDismiss).not.toHaveBeenCalled()
  })

  it('鼠标按下照旧立刻关', () => {
    const { onDismiss, outside } = openLayer()
    fire('pointerdown', outside, { pointerType: 'mouse' })
    expect(onDismiss).toHaveBeenCalledOnce()
  })
})
