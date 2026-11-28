/**
 * @file settle.ts
 * @position Internal to motion/layout; split from upstream motion/animatedLayout.ts
 */

import type { GlideProgress } from './timing'
import { sharedWeakMap } from '../../utils/sharedRealm'
import { sampleCount } from '../linearEasing'
import { clearPresentedResolve, writePresentedResolve } from '../presentation'

/** How near its end, px or percent, an animated value counts as there. */
const SETTLED_PX = 0.5

/** How near its end an animated value with no unit, an opacity, counts. */
const SETTLED_RATIO = 0.005

/** Keyframe members that time a keyframe rather than style it. */
const KEYFRAME_TIMING = new Set([
  'offset',
  'computedOffset',
  'easing',
  'composite',
])

type KeyframeValue = string | number | null | undefined

/** Whether a CSS value is within the settle tolerance of `end`. */
function isNearEnd(value: KeyframeValue, end: KeyframeValue): boolean {
  const numbers = (text: KeyframeValue): RegExpMatchArray[] => [
    ...String(text ?? '').matchAll(/(-?\d*\.?\d+(?:e[+-]?\d+)?)([a-z%]*)/gi),
  ]
  const ats = numbers(value)
  const ends = numbers(end)
  return (
    ats.length === ends.length
    && ats.every(([, at, unit], index) => {
      const tolerance = ['px', '%'].includes(unit.toLowerCase())
        ? SETTLED_PX
        : SETTLED_RATIO
      return Math.abs(Number(at) - Number(ends[index][1])) <= tolerance
    })
  )
}

/**
 * The offset from which linear `keyframes` stay near their last one, or null
 * when only the last one is.
 */
function settledOffset(keyframes: ReadonlyArray<Keyframe>): number | null {
  const last = keyframes[keyframes.length - 1]
  if (last == null) {
    return null
  }
  const styles = Object.keys(last).filter(key => !KEYFRAME_TIMING.has(key))
  let from: number | null = null
  for (let index = keyframes.length - 2; index >= 0; index -= 1) {
    const frame = keyframes[index]
    if (!styles.every(key => isNearEnd(frame[key], last[key]))) {
      break
    }
    from = frame.offset ?? index / (keyframes.length - 1)
  }
  return from
}

/**
 * When an animation's sampled linear frames come within reach of their end,
 * ms, or null. An eased two-keyframe fade, the Reduce Motion one, has none:
 * WebKit draws its end values at its end.
 */
function settleTime(
  keyframes: ReadonlyArray<Keyframe>,
  timing: KeyframeAnimationOptions,
): number | null {
  const duration = Number(timing.duration)
  const fraction
    = (timing.easing ?? 'linear') === 'linear' ? settledOffset(keyframes) : null
  return fraction == null || !(duration > 0)
    ? null
    : (timing.delay ?? 0) + fraction * duration
}

interface Settling {
  readonly element: Element
  /** Reads one frame; true once it needs no more frames. */
  readonly frame: () => boolean
}

/** Each window's motions that have not settled yet, read once a frame. */
const settling = sharedWeakMap<Window, Set<Settling>>(
  'motion/animated-layout/settling',
  1,
)

/**
 * Reads `entry` in each frame until it is done or its element leaves its
 * document. One frame loop per window runs while any motion waits. Returns
 * the stop.
 */
function watchSettle(view: Window, entry: Settling): () => void {
  if (typeof view.requestAnimationFrame !== 'function') {
    return () => {}
  }
  let waiting = settling.get(view)
  if (waiting == null) {
    const entries = new Set<Settling>()
    waiting = entries
    settling.set(view, entries)
    const frame = (): void => {
      for (const next of entries) {
        if (!next.element.isConnected || next.frame()) {
          entries.delete(next)
        }
      }
      if (entries.size === 0) {
        settling.delete(view)
        return
      }
      view.requestAnimationFrame(frame)
    }
    view.requestAnimationFrame(frame)
  }
  const entries = waiting
  entries.add(entry)
  return () => {
    entries.delete(entry)
  }
}

/** Each running animation's retime, for a ride that replaces its frames. */
const settleRetimes = sharedWeakMap<
  Animation,
  (keyframes: ReadonlyArray<Keyframe>, durationMs: number) => void
>('motion/animated-layout/settle-retimes', 1)

/**
 * WebKit can draw a compositor animation's last frame with the values it last
 * resolved for the element (presentation.ts). Every frame of a long task over
 * its end can show them too. It resolved them at the start or at a later
 * style write. One resolve once the animation is drawn near its end makes that
 * frame its end. `onResolve` hears it, for a reported glide's hit test.
 * Review condition: re-measure on each WebKit release, and remove these
 * resolves once WebKit draws an ended compositor animation at its final
 * values.
 */
export function settleAnimation(
  element: Element,
  animation: Animation,
  keyframes: ReadonlyArray<Keyframe>,
  options: KeyframeAnimationOptions,
  onResolve?: () => void,
): void {
  const view = element.ownerDocument.defaultView
  if (view == null || !('style' in element)) {
    return
  }
  const styled = element as Element & ElementCSSInlineStyle
  let at = settleTime(keyframes, options)
  let isWritten = false
  settleRetimes.set(animation, (next, durationMs) => {
    at = settleTime(next, { ...options, duration: durationMs })
  })
  const stop = watchSettle(view, {
    element,
    frame: () => {
      if (at == null) {
        return true
      }
      // The engine's own time when it has one; otherwise the clock against
      // the settle's moment, which a subtraction would round short of.
      const isSettled
        = animation.currentTime != null
          ? Number(animation.currentTime) >= at
          : animation.startTime != null
            && view.performance.now() >= Number(animation.startTime) + at
      if (!isSettled) {
        return false
      }
      writePresentedResolve(styled)
      isWritten = true
      onResolve?.()
      return true
    },
  })
  // A reported glide's report clears its write; any other clears at its end.
  const end = (): void => {
    stop()
    settleRetimes.delete(animation)
    if (isWritten && onResolve == null) {
      clearPresentedResolve(styled)
    }
  }
  animation.addEventListener?.('finish', end)
  animation.addEventListener?.('cancel', end)
}

/** Retimes `animation`'s settle after a ride replaced its frames. */
export function retimeSettle(
  animation: Animation,
  keyframes: ReadonlyArray<Keyframe>,
  durationMs: number,
): void {
  settleRetimes.get(animation)?.(keyframes, durationMs)
}

/** Each indicator's settle, stopped when the next change retimes it. */
export const transitionSettles = sharedWeakMap<Element, () => void>(
  'motion/animated-layout/transition-settles',
  1,
)

/**
 * An indicator's CSS transition runs on the compositor too, so it resolves
 * once as it settles. Its time is read from the page's clock from now, when
 * the change starts it: reading the transition itself would flush style.
 */
export function settleTransition(
  element: HTMLElement | SVGElement,
  progress: GlideProgress,
): void {
  transitionSettles.get(element)?.()
  transitionSettles.delete(element)
  const view = element.ownerDocument.defaultView
  const { durationMs } = progress
  // The first sample from which its curve stays near its end.
  const count = sampleCount(durationMs)
  let settled: number | null = null
  for (let index = count - 2; index >= 0; index -= 1) {
    const at = (index / (count - 1)) * durationMs
    if (Math.abs(progress.remaining(at)) > SETTLED_RATIO) {
      break
    }
    settled = at
  }
  if (view == null || settled == null || !(durationMs > 0)) {
    return
  }
  // Its moments on the clock, so a frame that lands on one counts: a
  // subtraction from the frame's time can round short of it.
  const start = view.performance.now()
  const settleAt = start + settled
  const endAt = start + durationMs
  let isWritten = false
  const clear = (): void => {
    transitionSettles.delete(element)
    if (isWritten) {
      clearPresentedResolve(element)
      isWritten = false
    }
  }
  const stop = watchSettle(view, {
    element,
    frame: () => {
      const now = view.performance.now()
      if (!isWritten && now >= settleAt) {
        writePresentedResolve(element)
        isWritten = true
      }
      if (now < endAt) {
        return false
      }
      clear()
      return true
    },
  })
  transitionSettles.set(element, () => {
    stop()
    clear()
  })
}
