/**
 * @file channelText.ts
 * Per-animator CSS text: a channel's property name and text, the custom
 * property and its companion, the person's settings, and the last-detach
 * handoff.
 * @position Internal to motion/engine; split from upstream motion/animator.ts
 */

import type { MotionProperty } from '../types'
import type { MotionEngine } from './context'
import type { Channel } from './engineTypes'
import { themeReducesMotion } from '../reducedMotionMark'
import { IDENTITY_TEXT } from './constants'
import { defaultPrefersReducedMotion, format, round } from './cssValues'

export function installChannelText(engine: MotionEngine): void {
  const { companion, customProperty, customUnit } = engine

  engine.companionText = (x: number): string =>
    companion == null
      ? ''
      : companion.syntax === '<number>'
        ? `${round(companion.map(x), 5)}`
        : `${round(companion.map(x), 3)}px`

  engine.isCustom = (channel: Channel) =>
    customProperty != null && channel === 'translate'

  engine.cssName = (channel: Channel): string =>
    customProperty != null && channel === 'translate'
      ? customProperty.name
      : channel

  engine.textOf = (
    channel: Channel,
    value: (property: MotionProperty) => number,
  ): string =>
    engine.isCustom(channel)
      ? `${round(value('x'), customUnit === '' ? 5 : 3)}${customUnit}`
      : format(channel, value)

  /** A keyframe's properties for a channel: the companion rides x's. */
  engine.frameOf = (
    channel: Channel,
    value: (property: MotionProperty) => number,
  ): Record<string, string> =>
    engine.isCustom(channel) && companion != null
      ? {
          [engine.cssName(channel)]: engine.textOf(channel, value),
          [companion.name]: engine.companionText(value('x')),
        }
      : { [engine.cssName(channel)]: engine.textOf(channel, value) }

  engine.identityOf = (channel: Channel): string =>
    engine.isCustom(channel) ? `0${customUnit}` : IDENTITY_TEXT[channel]

  // Reduced Motion reads the person's settings and nothing else: no option
  // overrides them (design:reduced-motion DR4). A theme that reduces motion
  // for everyone counts as the setting.
  engine.prefersReducedMotion = () =>
    defaultPrefersReducedMotion() || themeReducesMotion(engine.target)

  /** Runs `write` with the pending unmount's node as the target. */
  engine.onLastDetached = (write: () => void) => {
    const current = engine.target
    engine.target = engine.target ?? engine.lastDetached
    try {
      write()
    }
    finally {
      engine.target = current
    }
  }
}
