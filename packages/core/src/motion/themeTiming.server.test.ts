// @vitest-environment node
/**
 * @file themeTiming.server.test.ts
 * @input themeTiming.ts with no DOM
 * @output Importing the theme-timing reader touches no DOM global, and a
 *   reader with no element plays no motion
 * @position Unit test beside themeTiming.test.ts: the server side of the
 *   reader, which server-safe factories import
 */

import { describe, expect, it } from 'vitest'

describe('the theme-timing reader on the server', () => {
  it('imports with no window or document', async () => {
    expect(typeof document).toBe('undefined')
    const timing = await import('./themeTiming')
    expect(Object.keys(timing).sort()).toEqual([
      'declaredTimingTokens',
      'easedProgress',
      'readThemeTiming',
      'readThemeTimingOrInstant',
      'readThemeTokenText',
      'readThemeTokens',
      'resolveTiming',
    ])
    const instant = timing.readThemeTimingOrInstant(null, { duration: '--duration-fast', easing: '--ease-standard' })
    expect(instant.duration).toBe(0)
  })
})
