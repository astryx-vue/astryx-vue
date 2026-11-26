/**
 * @file readSet.ts
 * The animator's `get`, `getVelocity` and `set`.
 * @position Internal to motion/engine; split from upstream motion/animator.ts
 */

import type { MotionProperty } from '../types'
import type { MotionEngine } from './context'
import { CHANNEL_OF } from './constants'
import { expand } from './cssValues'

export function installReadSet(engine: MotionEngine): void {
  const { animator, now, resting, segments, shown } = engine

  animator.get = (property, time = now()) => {
    engine.syncPending()
    return engine.valueAt(property === 'scale' ? 'scaleX' : property, time)
  }

  animator.getVelocity = (property, time = now()) => {
    engine.syncPending()
    return engine.velocityAt(property === 'scale' ? 'scaleX' : property, time)
  }

  animator.set = (values, setOptions = {}) => {
    engine.syncPending()
    engine.flushDeferred()
    const time = now()
    const next = expand(values)
    for (const [property, value] of Object.entries(next) as [
      MotionProperty,
      number,
    ][]) {
      engine.interrupt(property, time)
      segments.delete(property)
      shown.delete(property)
      resting[property] = value
    }
    // Direct manipulation: the layer makes each write a composite only.
    if (setOptions.promote !== false) {
      for (const property of Object.keys(next) as MotionProperty[]) {
        engine.promote(CHANNEL_OF[property])
      }
    }
    engine.commit(Object.keys(next) as MotionProperty[], time)
  }
}
