// @vitest-environment node
/**
 * @file animator.server.test.ts
 * @input animator.ts and reducedMotion.ts with no DOM
 * @output Importing them and driving an animator with no element touches no
 *   DOM global and throws nothing, so server rendering can create animators
 * @position Unit test beside animator.test.ts: the server side of the
 *   animator
 */

import { describe, expect, it } from 'vitest'

describe('the animator on the server', () => {
  it('imports and runs with no element and no DOM', async () => {
    expect(typeof document).toBe('undefined')
    const { createMotionEngine } = await import('./animator')
    await import('./reducedMotion')
    const animator = createMotionEngine(null)
    expect(() => {
      animator.animate({ x: 40 }, { spring: { response: 0.4, dampingRatio: 1 } })
      animator.set({ y: 10 })
      animator.stop()
      animator.dispose()
    }).not.toThrow()
  })
})
