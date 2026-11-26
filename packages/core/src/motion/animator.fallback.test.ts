/**
 * @file animator.fallback.test.ts
 * @input animator.ts under happy-dom, with and without Web Animations
 * @output Without `element.animate` a call lands on its end value at once and
 *   throws nothing; with happy-dom's own Web Animations, cancelling motions
 *   leaves no unhandled rejection behind
 * @position Unit test beside animator.test.ts (which drives a fake Web
 *   Animations clock): the DOM-shim environments component tests run in
 */

import { afterEach, describe, expect, it, vi } from 'vitest'
import { createMotionEngine } from './animator'

afterEach(() => {
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

function mount(): HTMLElement {
  const element = document.createElement('div')
  document.body.append(element)
  return element
}

describe('the animator in a DOM shim', () => {
  it('shows the end value at once when the element has no Web Animations', async () => {
    const element = mount()
    Object.defineProperty(element, 'animate', { value: undefined })
    const animator = createMotionEngine(element)
    let handle: ReturnType<typeof animator.animate> | undefined
    expect(() => {
      handle = animator.animate({ x: 120, opacity: 0.5 }, { spring: { response: 0.4, dampingRatio: 1 } })
    }).not.toThrow()
    // The element shows the end at once; the model keeps its curve in time.
    expect(element.style.translate).toBe('120px 0px')
    expect(element.style.opacity).toBe('0.5')
    expect(animator.get('x', performance.now() + 10_000)).toBe(120)
    animator.stop()
    await expect(handle!.finished).resolves.toBe(false)
    animator.dispose()
  })

  it('leaves no unhandled rejection when happy-dom\'s animations are cancelled', async () => {
    const rejections: unknown[] = []
    const onRejection = (reason: unknown): void => {
      rejections.push(reason)
    }
    process.on('unhandledRejection', onRejection)
    try {
      const animator = createMotionEngine(mount())
      animator.animate({ x: 80 }, { spring: { response: 0.4, dampingRatio: 1 } })
      animator.animate({ x: -40 }, { spring: { response: 0.4, dampingRatio: 1 } })
      animator.stop()
      animator.animate({ y: 30 }, { spring: { response: 0.4, dampingRatio: 1 } })
      animator.dispose()
      await new Promise(resolve => setTimeout(resolve, 20))
    }
    finally {
      process.off('unhandledRejection', onRejection)
    }
    expect(rejections).toEqual([])
  })
})
