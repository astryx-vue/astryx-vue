/**
 * @file wheelStrip.ts
 * @input The touch wheel's strip (its flat rows in one element), its layout,
 *   and curves from wheelPhysics.ts
 * @output createWheelStrip: the one owner of a wheel's offset. It writes a
 *   drag's frames, plays and stops curves, ticks, and reports the nearest row
 * @position Glue of the touch picker wheel (useTouchWheel.ts) over the shared
 *   animator (motion/animator.ts) and the Reduce Motion dip
 *   (motion/reducedMotion.ts)
 *
 * The strip is the one element that moves, on `translate`, so a motion plays
 * on the compositor with no layout or paint per frame.
 */

import type { MotionCurve } from '../motion/animator'
import type { ReducedMotionDip } from '../motion/reducedMotion'
import type { WheelCurve, WheelLayout } from './wheelPhysics'
import { canVibrate, playHaptic } from '../gestures/haptics'
import { createMotionEngine, motionNow } from '../motion/animator'
import { playReducedMotionDip, reducedMotionFade } from '../motion/reducedMotion'
import { picker } from '../motion/uikit/picker'
import { nearestIndex, reachesRow, tickTimes } from './wheelPhysics'

/** How a motion ended: arrived on its row, or stopped before. */
export type WheelMotionOutcome = 'arrived' | 'stopped'

/** What started a motion: a release owns the wheel until it rests; a turn commits at once. */
export type WheelMotionKind = 'release' | 'turn'

/** Options for one motion. */
export interface PlayOptions {
  /** @default 'turn' */
  kind?: WheelMotionKind
  /** Tick as rows reach the band (a drag's release); a tap's turn does not. */
  ticks?: boolean
  /** Called once when the motion ends, either way. */
  onEnd?: (outcome: WheelMotionOutcome, offset: number) => void
  /** Started by a touch drag's release, which cross-fades under Reduce Motion. */
  touchRelease?: boolean
  /**
   * The momentum that continues a throw: a coast, and its bounce at an end.
   * It is direct movement, so it plays under Reduce Motion too, as scrolling
   * keeps decelerating under iOS Reduce Motion.
   */
  momentum?: boolean
}

/** One picker column's offset and everything that moves it. */
export interface WheelStrip {
  /** The strip the offset moves (null detaches it). */
  attach: (strip: HTMLElement | null) => void
  /** Update the rows (a new option list); keeps the offset. */
  setLayout: (layout: WheelLayout) => void
  /**
   * Tell `listener` the row nearest the band whenever it changes: on a drag
   * frame, where a motion stops or ends, and at rest. A motion itself reports
   * nothing until it ends, so no mark rides away from the band.
   */
  onNearestChange: (listener: ((position: number) => void) | null) => void
  /** Whether a motion is playing. */
  isMoving: () => boolean
  /** What started the motion playing, or null at rest. */
  movingKind: () => WheelMotionKind | null
  /** The offset on screen at `time` (ms, the event clock; default now). */
  offset: (time?: number) => number
  /** Where the wheel will be at rest: the motion's end, or the offset now. */
  target: () => number
  /** Show `offset` at once, stopping any motion: a drag frame (`ticks`) or a park. */
  setOffset: (offset: number, options?: { ticks?: boolean }) => void
  /** Forget the previous drag frame (a new gesture starts). */
  resetDrag: () => void
  /** Stop the motion where it was on screen at `time`. Returns that offset. */
  stop: (time?: number) => number
  /** Play `curve` from the current offset; the strip ends at `curve.to`. */
  play: (curve: WheelCurve, options?: PlayOptions) => void
  /** Forget the row last reported, so the next report names it again even unchanged. */
  forgetNearest: () => void
  /** Stop everything; a motion still running ends as stopped. */
  dispose: () => void
}

interface Running {
  readonly curve: WheelCurve
  readonly kind: WheelMotionKind
  readonly onEnd?: (outcome: WheelMotionOutcome, offset: number) => void
  readonly timers: ReturnType<typeof setTimeout>[]
  dip: ReducedMotionDip | null
}

/**
 * Creates a wheel's strip on a fresh animator.
 *
 * A release's coast and its bounce at an end are momentum (`decay`), so they
 * keep their motion under Reduce Motion. Every other curve is a transition:
 * under Reduce Motion it lands under the shared dip (`playReducedMotionDip`)
 * after a touch or on a coarse pointer, and at once otherwise.
 *
 * @example
 * ```ts
 * const strip = createWheelStrip({ rowHeight: 28, rowCount: 60 })
 * strip.attach(element)
 * strip.play(planRelease(strip.offset(), 900, layout).curve, { ticks: true, momentum: true })
 * ```
 */
export function createWheelStrip(initialLayout: WheelLayout): WheelStrip {
  const animator = createMotionEngine(null)
  let layout = initialLayout
  let running: Running | null = null
  let nearestListener: ((position: number) => void) | null = null
  let lastNearest: number | null = null
  let lastTick = -Infinity
  /** Last offset a drag frame showed, for its ticks. */
  let dragPrevious: number | null = null

  // The strip's top sits on the band's row: offset `o` is `translate` −o.
  const shown = (time?: number): number => -animator.get('y', time) || 0

  function reportNearest(offset: number): void {
    const position = nearestIndex(offset, layout)
    if (position === lastNearest)
      return
    lastNearest = position
    nearestListener?.(position)
  }

  function tick(time: number): void {
    if (time - lastTick < picker.selectionTick.minimumIntervalMs)
      return
    lastTick = time
    playHaptic('selection')
  }

  function clear(motion: Running): void {
    for (const timer of motion.timers)
      clearTimeout(timer)
    motion.timers.length = 0
    motion.dip?.cancel()
    motion.dip = null
    if (running === motion)
      running = null
  }

  function finish(motion: Running): void {
    if (running !== motion)
      return
    clear(motion)
    // The strip rests where the curve ends, written once, with no layer.
    animator.set({ y: -motion.curve.to })
    reportNearest(motion.curve.to)
    motion.onEnd?.('arrived', motion.curve.to)
  }

  /** The motion's ticks and its end, timed from `origin` (when it started on screen). */
  function schedule(motion: Running, origin: number, ticks: boolean): void {
    for (const timer of motion.timers)
      clearTimeout(timer)
    motion.timers.length = 0
    const elapsed = motionNow() - origin
    if (ticks) {
      for (const t of tickTimes(motion.curve, layout.rowHeight)) {
        motion.timers.push(setTimeout(() => {
          if (running === motion)
            tick(motionNow())
        }, Math.max(0, t * 1000 - elapsed)))
      }
    }
    motion.timers.push(setTimeout(finish, Math.max(0, motion.curve.duration * 1000 - elapsed), motion))
  }

  function stop(time?: number): number {
    const motion = running
    if (motion == null)
      return shown()
    const offset = shown(time)
    clear(motion)
    // `set` ends the strip's animation and puts it where it was shown.
    animator.set({ y: -offset })
    reportNearest(offset)
    motion.onEnd?.('stopped', offset)
    return offset
  }

  function land(to: number, onEnd: PlayOptions['onEnd']): void {
    animator.set({ y: -to })
    reportNearest(to)
    onEnd?.('arrived', to)
  }

  return {
    attach(strip) {
      animator.attach(strip)
    },
    setLayout(next) {
      layout = next
    },
    onNearestChange(listener) {
      nearestListener = listener
      lastNearest = null
    },
    isMoving: () => running != null,
    movingKind: () => running?.kind ?? null,
    offset: shown,
    target: () => running?.curve.to ?? shown(),
    setOffset(offset, { ticks = false } = {}) {
      if (running != null)
        stop()
      if (ticks && dragPrevious != null && canVibrate() && reachesRow(dragPrevious, offset, layout.rowHeight))
        tick(motionNow())
      dragPrevious = offset
      // A park is a one-off write: no layer for a strip at rest.
      animator.set({ y: -offset }, { promote: ticks })
      reportNearest(offset)
    },
    resetDrag() {
      dragPrevious = null
    },
    stop,
    play(curve, { kind = 'turn', ticks = false, onEnd, touchRelease = false, momentum = false } = {}) {
      stop()
      dragPrevious = null
      const element = animator.element
      // What Reduce Motion makes of a transition: null while motion plays.
      // Momentum is never substituted.
      const fade = momentum ? null : reducedMotionFade(element, { touchRelease })
      if (fade != null && (fade.duration <= 0 || element == null)) {
        land(curve.to, onEnd)
        return
      }
      if (fade == null && !(curve.duration > 0)) {
        land(curve.to, onEnd)
        return
      }
      const motion: Running = { curve, kind, onEnd, timers: [], dip: null }
      running = motion
      if (fade != null && element != null) {
        // The rows land when the fade-out ends, on the fade's own timeline,
        // and the motion ends with the fade-in.
        motion.dip = playReducedMotionDip(element, fade, () => {
          if (running !== motion)
            return
          animator.set({ y: -curve.to })
          reportNearest(curve.to)
          motion.timers.push(setTimeout(finish, fade.duration / 2, motion))
        })
        return
      }
      const motionCurve: MotionCurve = {
        duration: curve.duration,
        at: t => -curve.value(t),
        velocity: t => -curve.velocity(t),
      }
      const handle = momentum
        ? animator.decay({ y: motionCurve }, { touchRelease })
        : animator.play({ y: motionCurve }, { touchRelease })
      const withTicks = ticks && canVibrate()
      schedule(motion, motionNow(), withTicks)
      // A busy main thread can hold a motion's first frame: its timers then
      // follow the start the browser gives it.
      void handle.started.then((start) => {
        if (running === motion)
          schedule(motion, start, withTicks)
      })
    },
    forgetNearest() {
      lastNearest = null
    },
    dispose() {
      stop()
      animator.dispose()
    },
  }
}
