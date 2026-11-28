/**
 * @file createSnapDrag.ts
 * @input An element and its snap points. From Core: the pan's options, a
 *   custom property to draw into, the parts a settle moves on the compositor,
 *   and a drag model
 * @output createSnapDrag: the snap-point drag under the public
 *   `createDragToSnapPoints`, with the options only Core passes. No package
 *   entry exports it.
 * @position Engine of packages/core/src/dragToSnapPoints. A Core component
 *   whose drag needs more than the public options uses it. Importing it does
 *   no DOM work.
 *
 * SYNC: When modified, update createSnapDrag.test.ts and
 * createDragToSnapPoints.ts.
 */

import type { PanInput } from '../gestures/createPanGesture'
import type { MotionHandle } from '../motion/animator'
import type { CompositorSettle } from './compositorSettle'
import type { SettleOptions, SnapDrag, SnapDragLanding, SnapDragOptions } from './snapDragTypes'
import { devWarn } from '../composables/useDevWarning'
import { createPan } from '../gestures/createPanGesture'
import { createMotionEngine } from '../motion/animator'
import { resolveMotion } from '../motion/resolveMotion'
import { resolveSnapPoint } from '../motion/resolveSnapPoint'
import { solveSpring, toSpring } from '../motion/spring'
import { registerSpringsTable, springs } from '../motion/uikit/springs'
import { playCompositorSettle } from './compositorSettle'
import { DEFAULT_FLICK_THRESHOLD } from './snapDragTypes'

/** The document timeline's clock, which the animator runs on. */
const now = (): number => performance.now()

/** Runs `callback` in the next animation frame (a timer without one). */
function requestFrame(callback: () => void): void {
  if (typeof requestAnimationFrame === 'function')
    requestAnimationFrame(() => callback())
  else
    setTimeout(callback, 16)
}

/**
 * Where `element` is drawn now, read from the inline value an animator left
 * on it. A drag destroyed and created again leaves it where it stopped. An
 * axis it does not set reads 0.
 */
function drawnAt(element: HTMLElement, customProperty: string | undefined): { x: number, y: number } {
  if (customProperty != null) {
    const value = Number.parseFloat(element.style.getPropertyValue(customProperty))
    return { x: Number.isFinite(value) ? value : 0, y: 0 }
  }
  const [x = 0, y = 0] = element.style
    .getPropertyValue('translate')
    .trim()
    .split(/\s+/)
    .map(part => Number.parseFloat(part))
    .map(value => (Number.isFinite(value) ? value : 0))
  return { x, y }
}

/** Drops a point that is not a finite number, with a dev warning. */
function sortedSnapPoints(snapPoints: ReadonlyArray<number>): number[] {
  const usable = snapPoints.filter(point => Number.isFinite(point))
  if (usable.length < snapPoints.length)
    devWarn('createDragToSnapPoints', 'snapPoints must be numbers; the others are ignored.')
  return usable.sort((a, b) => a - b)
}

/** Lets a drag move `element` along `axis` and settles it on its snap points. */
export function createSnapDrag(element: HTMLElement, options: SnapDragOptions): SnapDrag {
  const { axis, onSettle, model } = options
  if (options.customProperty != null && axis !== 'x')
    devWarn('createSnapDrag', 'customProperty draws the x axis only, so this y drag draws nothing.')
  const flickThreshold = options.flickThreshold ?? DEFAULT_FLICK_THRESHOLD
  let points = sortedSnapPoints(options.snapPoints)
  // It starts where the element is drawn, so a drag created again to change
  // its options moves on from there instead of jumping.
  const drawn = drawnAt(element, options.customProperty?.name)
  const animator = createMotionEngine(element, {
    initial: drawn,
    ...(options.customProperty != null ? { customProperty: options.customProperty } : {}),
  })
  // The snap point the element rests on, or is settling toward.
  let targetIndex
    = points.length === 0
      ? 0
      : resolveSnapPoint({ points, position: drawn[axis], velocity: 0, flickThreshold }).index
  // Each settle and each drag takes a turn; only the latest settle reports.
  let turn = 0
  let drag: {
    start: number
    startIndex: number
    input: PanInput
    /** The drag has drawn the element: it caught any settle in flight. */
    caught: boolean
  } | null = null
  let destroyed = false
  // The settle in flight and its options, until it ends or is replaced.
  let inFlight: {
    turn: number
    options: SettleOptions
    /** Its `onPass` has called back. */
    passed: boolean
  } | null = null

  // The settle in flight on the compositor (compositorParts), if any, and
  // what its end does.
  let compositor: CompositorSettle | null = null
  let finishCompositor: (() => void) | null = null
  const position = (): number => compositor?.presented() ?? animator.get(axis)
  /** Stops a compositor settle where it is on screen, and draws it there. */
  const holdCompositor = (): void => {
    if (compositor == null)
      return
    const value = compositor.stop()
    compositor = null
    finishCompositor = null
    animator.set({ [axis]: value }, { promote: false })
  }

  const settle = (target: number, settleOptions: SettleOptions): MotionHandle | null => {
    registerSpringsTable()
    targetIndex = target
    const mine = ++turn
    const flight = { turn: mine, options: settleOptions, passed: false }
    inFlight = flight
    const { velocity } = settleOptions
    const spring = settleOptions.spring ?? springs.settle
    const touchRelease = settleOptions.touchRelease === true
    const { compositorParts } = options
    if (compositorParts != null && animator.reducedMotion({ touchRelease }) === 'off') {
      // A zero velocity keeps the element's own, as on the animator.
      const startVelocity
        = velocity != null && velocity !== 0
          ? velocity
          : (compositor?.velocity() ?? animator.getVelocity(axis))
      const from = position()
      holdCompositor()
      const to = points[target]
      // At the theme's tempo, as the animator plays a role spring.
      const curve = solveSpring(toSpring(resolveMotion(element, spring)), {
        from,
        to,
        velocity: startVelocity,
      })
      const { onPass } = settleOptions
      const play = (): void => {
        if (destroyed || mine !== turn)
          return
        animator.stop()
        animator.set({ [axis]: to }, { promote: false })
        const finish = (): void => {
          compositor = null
          finishCompositor = null
          if (inFlight === flight)
            inFlight = null
          if (mine === turn && !destroyed)
            onSettle(targetIndex)
        }
        compositor = playCompositorSettle({
          curve,
          parts: compositorParts(),
          requestFrame,
          ...(onPass != null
            ? {
                onPass: {
                  ...onPass,
                  call: () => {
                    flight.passed = true
                    onPass.call()
                  },
                },
              }
            : {}),
          onFinish: finish,
        })
        finishCompositor = finish
      }
      if (settleOptions.start === 'next-frame')
        requestFrame(play)
      else
        play()
      return null
    }
    holdCompositor()
    const handle = animator.animate(
      { [axis]: points[target] },
      {
        spring,
        ...(velocity != null && velocity !== 0 ? { velocity: { [axis]: velocity } } : {}),
      },
      {
        touchRelease,
        ...(settleOptions.start != null ? { start: settleOptions.start } : {}),
      },
    )
    let finished = false
    void handle.finished.then((arrived) => {
      finished = true
      if (inFlight === flight)
        inFlight = null
      if (arrived && mine === turn && !destroyed)
        onSettle(targetIndex)
    })
    const { onPass } = settleOptions
    if (onPass != null && typeof requestAnimationFrame === 'function') {
      // No timer: each frame reads the curve at its own time.
      const { direction } = onPass
      const check = (time: number): void => {
        if (destroyed || mine !== turn)
          return
        if ((animator.get(axis, time) - onPass.offset) * direction >= 0) {
          flight.passed = true
          onPass.call()
          return
        }
        if (!finished)
          requestAnimationFrame(check)
      }
      requestAnimationFrame(check)
    }
    return handle
  }

  /** Lands a model's landing (null: the element stays as it is). */
  const land = (landing: SnapDragLanding | null, touchRelease: boolean): void => {
    if (landing != null)
      settle(landing.index, { velocity: landing.velocity, spring: landing.spring, touchRelease })
  }

  const pan = createPan(element, {
    axis,
    recognizer: options.pan,
    onPan: ({ state, translation, totalTranslation, velocity, input }) => {
      if (destroyed || points.length === 0)
        return
      const moved = { translation: translation[axis], total: totalTranslation[axis], input }
      if (state === 'began') {
        drag = { start: position(), startIndex: targetIndex, input, caught: false }
        if (model?.begin?.({ start: drag.start, ...moved }) === false) {
          drag = null
          return
        }
      }
      if (drag == null)
        return
      const reading = { start: drag.start, ...moved, input: drag.input }
      if (state === 'began' || state === 'changed') {
        const target = model?.move != null ? model.move(reading) : { offset: drag.start + moved.translation }
        if (target == null)
          return
        if (!drag.caught) {
          // Catch a settle in flight where it is on screen: it reports
          // nothing now.
          drag.caught = true
          turn += 1
          holdCompositor()
        }
        if (target.spring == null) {
          animator.set({ [axis]: target.offset })
        }
        else {
          registerSpringsTable()
          // On the drag's own clock, now. A target that waited for the
          // browser's start would be replaced by the next move before WebKit
          // starts it. Each would restart from rest, so the element would
          // stand still until the drag paused.
          void animator.animate({ [axis]: target.offset }, { spring: target.spring }, { at: now() })
        }
        return
      }
      const { startIndex, start } = drag
      drag = null
      // Only a touch drag's release cross-fades under Reduce Motion. Any other
      // release lands at once on a fine primary pointer.
      const touchRelease = reading.input === 'touch'
      if (state === 'cancelled') {
        if (model?.cancel != null)
          land(model.cancel(reading), touchRelease)
        else
          settle(startIndex, { velocity: 0, touchRelease })
        return
      }
      const release = velocity[axis]
      if (model?.release != null) {
        land(model.release({ ...reading, velocity: release }), touchRelease)
        return
      }
      // Core's one release policy. The drag's start lets a release that moves
      // back return to the snap point it started from.
      const { index: target } = resolveSnapPoint({
        points,
        position: position(),
        velocity: release,
        flickThreshold,
        start,
      })
      settle(target, { velocity: release, touchRelease })
    },
  })

  return {
    settleTo(target, settleOptions = {}) {
      if (destroyed)
        return null
      if (!Number.isInteger(target) || target < 0 || target >= points.length) {
        devWarn(
          'createDragToSnapPoints',
          `settleTo(${target}) is outside the ${points.length} snap points, so it does nothing.`,
        )
        return null
      }
      drag = null
      return settle(target, { velocity: 0, ...settleOptions })
    },
    setSnapPoints(snapPoints) {
      if (destroyed)
        return
      // A drag that has not caught the settle leaves it running.
      const flight = (drag == null || !drag.caught) && inFlight?.turn === turn ? inFlight : null
      const heading = flight == null ? null : points[targetIndex]
      // The point a drag started on: where it rested, or the settle's target.
      const startPoint = drag == null ? null : points[drag.startIndex]
      points = sortedSnapPoints(snapPoints)
      if (points.length === 0) {
        // No point to land on: a running settle stops and never reports, and
        // a drag in progress ends.
        turn += 1
        drag = null
        holdCompositor()
        animator.stop()
        targetIndex = 0
        return
      }
      // Every index named a point of the old list.
      const nearest = (at: number): number =>
        resolveSnapPoint({ points, position: at, velocity: 0, flickThreshold }).index
      if (flight != null && heading != null) {
        // The re-aim keeps the motion's own velocity, not the first one, and
        // an `onPass` that has called back never calls again.
        const { onPass, ...rest } = flight.options
        settle(nearest(heading), { ...rest, ...(flight.passed ? {} : { onPass }), velocity: 0 })
        if (drag != null)
          drag.startIndex = nearest(startPoint ?? drag.start)
        return
      }
      targetIndex = nearest(startPoint ?? position())
      if (drag != null)
        drag.startIndex = targetIndex
    },
    snapPoints() {
      return points
    },
    animator,
    position,
    finishSettle() {
      const finish = finishCompositor
      if (compositor == null || finish == null)
        return
      // The drawn value is already the end: only the parts' animations stop.
      compositor.stop()
      finish()
    },
    destroy() {
      if (destroyed)
        return
      destroyed = true
      pan.destroy()
      // Held where it is: disposing cancels a running settle, which would
      // otherwise leave the element where that settle began.
      holdCompositor()
      animator.stop()
      animator.dispose()
    },
  }
}
