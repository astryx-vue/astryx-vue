import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { attachScrollLockTouchGuard } from './scrollLockTouchGuard.js'

function touchEvent(type: string, target: EventTarget, points: Array<{ x: number, y: number }>): Event {
  const event = new Event(type, { bubbles: true, cancelable: true })
  const touches = points.map(point => ({ clientX: point.x, clientY: point.y }))
  Object.defineProperty(event, 'touches', { value: touches })
  target.dispatchEvent(event)
  return event
}

function stubScroller(element: HTMLElement, box: { clientHeight: number, scrollHeight: number, scrollTop: number }): void {
  element.style.overflowY = 'auto'
  for (const [key, value] of Object.entries(box))
    Object.defineProperty(element, key, { configurable: true, value })
}

describe('scrollLockTouchGuard', () => {
  let detach: () => void
  let overlay: HTMLElement
  let scroller: HTMLElement
  let plain: HTMLElement

  beforeEach(() => {
    vi.stubGlobal('matchMedia', (query: string) => ({ matches: query === '(pointer: coarse)', media: query, addEventListener() {}, removeEventListener() {} }))
    overlay = document.createElement('div')
    scroller = document.createElement('div')
    plain = document.createElement('p')
    scroller.append(document.createElement('span'))
    overlay.append(scroller, plain)
    document.body.append(overlay)
    detach = attachScrollLockTouchGuard(document)
  })

  afterEach(() => {
    detach()
    document.body.innerHTML = ''
    vi.unstubAllGlobals()
  })

  it('cancels a one-finger pan nothing inside the overlay takes', () => {
    touchEvent('touchstart', plain, [{ x: 10, y: 100 }])
    expect(touchEvent('touchmove', plain, [{ x: 10, y: 60 }]).defaultPrevented).toBe(true)
  })

  it('lets a scroller in the overlay take the pan while it can still scroll that way', () => {
    stubScroller(scroller, { clientHeight: 100, scrollHeight: 400, scrollTop: 50 })
    const inner = scroller.firstElementChild!
    touchEvent('touchstart', inner, [{ x: 10, y: 100 }])
    expect(touchEvent('touchmove', inner, [{ x: 10, y: 60 }]).defaultPrevented).toBe(false)
    touchEvent('touchend', inner, [])

    stubScroller(scroller, { clientHeight: 100, scrollHeight: 400, scrollTop: 300 })
    touchEvent('touchstart', inner, [{ x: 10, y: 100 }])
    expect(touchEvent('touchmove', inner, [{ x: 10, y: 60 }]).defaultPrevented).toBe(true)
  })

  it('leaves a pinch, a zoomed page and a range input alone', () => {
    touchEvent('touchstart', plain, [{ x: 10, y: 100 }, { x: 80, y: 100 }])
    expect(touchEvent('touchmove', plain, [{ x: 10, y: 60 }, { x: 80, y: 140 }]).defaultPrevented).toBe(false)
    touchEvent('touchend', plain, [])

    const range = document.createElement('input')
    range.type = 'range'
    overlay.append(range)
    touchEvent('touchstart', range, [{ x: 10, y: 100 }])
    expect(touchEvent('touchmove', range, [{ x: 40, y: 100 }]).defaultPrevented).toBe(false)
    touchEvent('touchend', range, [])

    vi.stubGlobal('visualViewport', { scale: 2 })
    Object.defineProperty(window, 'visualViewport', { configurable: true, value: { scale: 2 } })
    touchEvent('touchstart', plain, [{ x: 10, y: 100 }])
    expect(touchEvent('touchmove', plain, [{ x: 10, y: 60 }]).defaultPrevented).toBe(false)
    Object.defineProperty(window, 'visualViewport', { configurable: true, value: undefined })
  })

  it('does nothing on a device whose primary pointer is not coarse', () => {
    detach()
    vi.stubGlobal('matchMedia', () => ({ matches: false, media: '', addEventListener() {}, removeEventListener() {} }))
    detach = attachScrollLockTouchGuard(document)
    touchEvent('touchstart', plain, [{ x: 10, y: 100 }])
    expect(touchEvent('touchmove', plain, [{ x: 10, y: 60 }]).defaultPrevented).toBe(false)
  })
})
