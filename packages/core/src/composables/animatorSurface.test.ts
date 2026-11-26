/**
 * @file animatorSurface.test.ts
 * @input The package root
 * @output The package root hands out `createAnimator` and `useAnimator`, and
 *   nothing of the motion module beneath them; no internal factory takes the
 *   public factory's name
 * @position Public API test for the animator
 */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import * as root from '../index.js'

/** Names of the motion module beneath the public animator. */
const INTERNAL = [
  'createMotionEngine',
  'createAttachableAnimator',
  'animatorFor',
  'coast',
  'resolveMotion',
  'registerSpringsTable',
  'springs',
  'readThemeTiming',
  'resolveThemeMotion',
  'expandThemeMotion',
]

const SRC = join(process.cwd(), 'packages/core/src')

describe('the public animator surface', () => {
  it('the package root exports createAnimator and useAnimator, and nothing of the motion module', () => {
    expect(typeof root.createAnimator).toBe('function')
    expect(typeof root.useAnimator).toBe('function')
    for (const name of INTERNAL)
      expect(root).not.toHaveProperty(name)
  })

  it('the package root re-exports no motion module whole', () => {
    const source = readFileSync(join(SRC, 'index.ts'), 'utf8')
    expect(source).not.toMatch(/export \* from '\.\/motion(\/|')/)
  })

  it('no internal factory takes the public factory’s name', () => {
    const motion = readFileSync(join(SRC, 'motion/animator.ts'), 'utf8')
    expect(motion).not.toMatch(/export function createAnimator\b/)
    expect(motion).toMatch(/export function createMotionEngine\b/)
  })
})
