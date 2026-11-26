/**
 * @file snapDragTypes.ts
 * @input The pan's types, the animator's types and a spring description
 * @output The types of createSnapDrag: a drag's reading, a model's target and
 *   landing, the drag's options, how `settleTo` settles, and the handle. Also
 *   the default flick threshold.
 * @position Type layer of packages/core/src/dragToSnapPoints, shared by
 *   createSnapDrag.ts, createDragToSnapPoints.ts and Core components that
 *   pass a model. No package entry exports it.
 */

import type { PanInput } from '../gestures/createPanGesture'
import type { PanGestureRecognizerOptions } from '../gestures/PanGestureRecognizer'
import type { Animator, AnimatorOptions, MotionHandle } from '../motion/animator'
import type { SpringDescription } from '../motion/spring'
import type { CompositorPart } from './compositorSettle'

/**
 * The release speed, in px/s, above which a drag carries to the next snap
 * point: the flick speed measured for UIKit's sheet on iOS 26.2.
 */
export const DEFAULT_FLICK_THRESHOLD = 1008

/** A drag in progress, along the axis, as a model reads it. */
export interface SnapDragMove {
  /** Where the element was drawn when the drag began (it was caught there). */
  start: number
  /** Travel since the drag began, px: the pan's claim is not part of it. */
  translation: number
  /** Travel since the touch began, px, the pan's claim included. */
  total: number
  /** What drives the drag. */
  input: PanInput
}

/** A release, along the axis, as a model reads it. */
export interface SnapDragRelease extends SnapDragMove {
  /** The release velocity, px/s (0 when the contact rested). */
  velocity: number
}

/** Where a model draws the element during a drag. */
export interface SnapDragTarget {
  /** The offset along the axis. */
  offset: number
  /**
   * Follows on this spring from where the element is drawn, keeping its
   * velocity; without one the element is set there, one for one.
   */
  spring?: SpringDescription
}

/** Where a model lands a release. */
export interface SnapDragLanding {
  /** The snap point the element settles on. */
  index: number
  /**
   * The settle's starting velocity along the axis, px/s; without one it
   * starts from the velocity the element is drawn with.
   */
  velocity?: number
  /** The settle's spring; the settle spring without one. */
  spring?: SpringDescription
}

/** A drag's model: where it draws the element and where a release lands. */
export interface SnapDragModel {
  /**
   * A drag began where the element is drawn (`start`). Returns false to
   * leave the element as it is for this drag: it moves nothing and its
   * release lands nothing.
   */
  begin?: (drag: SnapDragMove) => boolean
  /**
   * Where the drag draws the element; null leaves it as it is (inside a dead
   * zone: a settle under it carries on). The first target catches the
   * element where it is drawn. One for one from `start` when absent.
   */
  move?: (drag: SnapDragMove) => SnapDragTarget | null
  /**
   * Where the release lands; null leaves the element as it is (the model
   * may settle it itself). Core's one release policy when absent.
   */
  release?: (drag: SnapDragRelease) => SnapDragLanding | null
  /**
   * Where a cancelled drag lands (the browser took the touch); null leaves
   * the element as it is. Back to where the drag started when absent.
   */
  cancel?: (drag: SnapDragMove) => SnapDragLanding | null
}

/** Options of `createSnapDrag`. */
export interface SnapDragOptions {
  /** The axis the element moves along. */
  axis: 'x' | 'y'
  /**
   * Offsets in px along `axis` from the element's resting position, sorted
   * before use (`onSettle` and `settleTo` count in that order).
   */
  snapPoints: ReadonlyArray<number>
  /** A release faster than this, px/s, carries to the next point. Default 1008. */
  flickThreshold?: number
  /** Called with the snap point's index once the element settles on it. */
  onSettle: (index: number) => void
  /** The pan's own options: which pointers and scrolls start it, its claim, a begin gate. */
  pan?: Omit<PanGestureRecognizerOptions, 'direction'>
  /**
   * Draws an x drag into this custom property instead of `translate`, with
   * an optional companion drawn from it in the same animation. The animator
   * renders only x into it, so a y drag with it draws nothing.
   */
  customProperty?: AnimatorOptions['customProperty']
  /**
   * The parts a settle moves on the compositor, for an element drawn into
   * `customProperty`. Each part plays a `translate` that follows the axis by
   * its own offset, while the property holds the settle's end. A drag
   * catches the settle where it is on screen. Reduce Motion keeps the
   * animator's cross-fade. `settleTo` returns null for such a settle.
   */
  compositorParts?: () => ReadonlyArray<CompositorPart>
  /** The drag's model; the public one without it. */
  model?: SnapDragModel
}

/** How `settleTo` settles. */
export interface SettleOptions {
  /** Starting velocity, px/s; the one the element is drawn with without it. */
  velocity?: number
  /** The spring; the settle spring without one. */
  spring?: SpringDescription
  /** Whether a touch drag's release starts it (Reduce Motion cross-fades). */
  touchRelease?: boolean
  /**
   * Calls `call` once, on the first animation frame whose presented value
   * is past `offset` in `direction`. The value is read on the settle's own
   * curve at that frame's time. Direction 1 means at or above the offset,
   * and -1 means at or below it. If the element is past it already, the
   * call comes on the next frame, wherever the settle lands. It never comes
   * for a settle that stays short of the offset, that another settle or a
   * drag replaces first, or that a destroy ends. The caller reads a crossing
   * during a drag from the drag itself.
   */
  onPass?: { offset: number, direction: 1 | -1, call: () => void }
  /**
   * The settle is asked for in an input event's own task: a key, a click, a
   * tap. From rest, it starts at the first frame after that task, however long
   * the task runs (the animator's `start: 'next-frame'`).
   */
  start?: 'next-frame'
}

/** What `createSnapDrag` returns. */
export interface SnapDrag {
  /**
   * Settles the element on the snap point at `index`, then calls `onSettle`.
   * Returns the settle's motion, or null when it does nothing or the compositor
   * plays it.
   */
  settleTo: (index: number, options?: SettleOptions) => MotionHandle | null
  /**
   * Replaces the snap points (a layout change). A settle in flight re-aims
   * at the new point nearest where it was heading; otherwise the element
   * stays where it is. An empty list stops the element where it is and ends
   * a drag in progress, and nothing reports. After `destroy` it does
   * nothing.
   */
  setSnapPoints: (snapPoints: ReadonlyArray<number>) => void
  /** The snap points, ascending. */
  snapPoints: () => ReadonlyArray<number>
  /** The animator that draws the element (presentation values, curves). */
  readonly animator: Animator
  /** Where the element is on screen now, along the axis. */
  position: () => number
  /**
   * Ends a compositor settle in flight at its end now, and calls `onSettle`.
   * It does nothing to a settle the animator draws.
   */
  finishSettle: () => void
  /** Removes every listener and stops the element where it is. */
  destroy: () => void
}
