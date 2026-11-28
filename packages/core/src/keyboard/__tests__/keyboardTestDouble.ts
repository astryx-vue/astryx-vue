/**
 * @file keyboardTestDouble.ts
 * @input vitest, the window's visual viewport and matchMedia
 * @output installKeyboardTestDouble: a stand-in on-screen keyboard that a
 *   field's keyboard test drives with one call per keyboard change. Its
 *   visual viewport pans as Chrome's does. act runs one step of a test
 * @position Test helper for the keyboard module and the fields it covers
 */

import { vi } from 'vitest'
import { __resetLayoutViewportForTest } from '../../utils/layoutViewport'

/**
 * Runs one step of a test. The keyboard module writes the DOM as each event
 * arrives, so a step needs no flush after it.
 */
export function act(step: () => void): void {
  step()
}

/** A stand-in keyboard over the window's layout viewport. */
export interface KeyboardTestDouble {
  /** The keyboard now covers `cover` px of the layout viewport's bottom. */
  show: (cover: number) => void
  /** The keyboard has gone. */
  hide: () => void
  /** Runs the animation frames asked for since, as before a paint. */
  frame: () => void
  /** The visual viewport. A fixed element scrolled into view pans it there. */
  viewport: EventTarget & { height: number, offsetTop: number }
  /** Puts the window back as it was. */
  restore: () => void
}

/**
 * Installs a visual viewport that shrinks for the keyboard, as Mobile Safari
 * and Chrome on Android do. It also installs a coarse primary pointer unless
 * `coarse` is false. Each change reports in the visual viewport's own `resize`,
 * and the animation frames asked for during it run right after, as before a
 * paint.
 */
export function installKeyboardTestDouble({
  coarse = true,
}: { coarse?: boolean } = {}): KeyboardTestDouble {
  const viewport = Object.assign(new EventTarget(), {
    height: window.innerHeight,
    offsetTop: 0,
    scale: 1,
  })
  Object.defineProperty(window, 'visualViewport', {
    configurable: true,
    value: viewport,
  })
  Object.defineProperty(Element.prototype, 'scrollIntoView', {
    configurable: true,
    value: vi.fn(function (this: HTMLElement) {
      if (this.style.position === 'fixed') {
        viewport.offsetTop = Number.parseFloat(this.style.top) || 0
      }
    }),
  })
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      matches: query.includes('pointer: coarse') ? coarse : false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  )
  // Not iOS WebKit: happy-dom's CSS.supports answers yes to its touch
  // callout query.
  vi.stubGlobal('CSS', { supports: () => false })
  // The page scrolls, so a field in it is revealed by the document.
  const page = document.scrollingElement ?? document.documentElement
  Object.defineProperty(page, 'scrollHeight', {
    configurable: true,
    value: 3000,
  })
  Object.defineProperty(page, 'clientHeight', {
    configurable: true,
    value: window.innerHeight,
  })
  const frames = new Map<number, FrameRequestCallback>()
  let nextFrame = 1
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    const id = nextFrame++
    frames.set(id, callback)
    return id
  })
  vi.stubGlobal('cancelAnimationFrame', (id: number) => {
    frames.delete(id)
  })
  const frame = () => {
    act(() => {
      for (let round = 0; round < 5 && frames.size > 0; round++) {
        const due = [...frames.values()]
        frames.clear()
        for (const callback of due) {
          callback(performance.now())
        }
      }
    })
  }
  const report = (height: number) => {
    viewport.height = height
    act(() => {
      viewport.dispatchEvent(new Event('resize'))
    })
    frame()
  }
  return {
    show: cover => report(window.innerHeight - cover),
    hide: () => report(window.innerHeight),
    frame,
    viewport,
    restore: () => {
      Reflect.deleteProperty(page, 'scrollHeight')
      Reflect.deleteProperty(page, 'clientHeight')
      Reflect.deleteProperty(window, 'visualViewport')
      Reflect.deleteProperty(Element.prototype, 'scrollIntoView')
      __resetLayoutViewportForTest()
      vi.unstubAllGlobals()
    },
  }
}
