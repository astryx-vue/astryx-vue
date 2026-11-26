// @vitest-environment node
/**
 * @file createAnimator.server.test.ts
 * @input createAnimator.ts and useAnimator.ts with no DOM
 * @output Importing the factory or the composable touches no DOM global, and
 *   the composable with no element does nothing, so both are safe on the
 *   server
 * @position Unit test beside createAnimator.test.ts: the server side of the
 *   public animator
 */

import { describe, expect, it } from 'vitest'
import { effectScope } from 'vue'

describe('the public animator on the server', () => {
  it('the factory imports with no window or document', async () => {
    expect(typeof document).toBe('undefined')
    expect(Object.keys(await import('./createAnimator.js')).sort()).toEqual(['createAnimator'])
  })

  it('the composable imports and runs with no element', async () => {
    const { useAnimator } = await import('./useAnimator.js')
    const scope = effectScope()
    const animator = scope.run(() => useAnimator(null))!
    await expect(animator.animate({ x: 10 })).resolves.toBeUndefined()
    await expect(animator.decay({ x: 500 })).resolves.toBeUndefined()
    expect(() => animator.set({ y: 4 })).not.toThrow()
    expect(animator.get()).toEqual({ x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 })
    scope.stop()
  })
})
