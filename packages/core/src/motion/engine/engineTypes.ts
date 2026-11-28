/**
 * @file engineTypes.ts
 * The motion engine's internal records: curve segments, start groups,
 * landings, task marks and the closure-level `Shown` record.
 * @position Internal to motion/engine; split from upstream motion/animator.ts
 */

import type { SpringDescription } from '../spring'
import type { MotionCurve, MotionProperty } from '../types'

// ---------------------------------------------------------------------------
// Curves
// ---------------------------------------------------------------------------

export interface Segment {
  /**
   * Start on the document timeline, ms. A call started from rest moves it to
   * the time the browser committed the animation (StartGroup).
   */
  start: number
  /** Length in ms (finite). */
  readonly duration: number
  /** Value from the end on. */
  readonly target: number
  /** Value `t` ms after the start (0 ≤ t ≤ duration). */
  at: (t: number) => number
  /** Velocity `t` ms after the start, units/s. */
  speed: (t: number) => number
  /** Times (ms after the start) where the value jumps; `at` is right-continuous. */
  readonly jumps: ReadonlyArray<number>
  /**
   * The curve a `play` call gave, which other calls in its task can share. A
   * segment whose values move from that curve's has none.
   */
  readonly source?: MotionCurve
  /** A Reduce Motion fade: an interruption finishes it instead of freezing it. */
  readonly isFade?: true
  readonly owner: HandleState
  /** The call's start group while its start waits for the commit. */
  group?: StartGroup
  /** The spring driving it, when one does (`rebase` keeps it). */
  spring?: SpringDescription
  /** The old curve plus a spring of the difference (`additive`). */
  readonly isAdditive?: true
  /** A velocity the call handed the spring, such as a release's. */
  readonly handedVelocity?: number
}

/**
 * A call started from rest. Its animations are created without a start time,
 * so the browser starts them when it commits them, as Core Animation starts
 * an animation at its transaction's commit: a main-thread block before that
 * frame delays the motion instead of skipping into it. Until then the curves
 * read from the call time; once the browser's start is known they move to it.
 */
export interface StartGroup {
  readonly provisional: number
  /**
   * Its animations were created in the running task: the browser cannot have
   * started them yet, so nothing reads their start time until it ends.
   */
  fresh: boolean
  readonly segments: Segment[]
  readonly animations: Animation[]
  readonly channels: Set<Channel>
  resolved: boolean
  /**
   * The first frame after the call has run: a start read later is the
   * browser's, whatever it says (startAfterBlock).
   */
  framed?: boolean
  /**
   * Made in an animation-frame callback of an animator's own (a presented
   * call's second frame): the browser commits its animations in that frame,
   * so the frame after it is not the one that starts them.
   */
  madeInFrame?: boolean
  /**
   * Its call asked for `start: 'next-frame'`: the call ran in an input
   * event's own task. Its task mark carries that to the calls it holds.
   */
  nextFrame?: boolean
  /** The task it was made in, with every call made in that task. */
  task?: TaskMark
  /**
   * Per channel, when its animation's first frame ran without a known start.
   * That frame came too late to stand for the start, and the browser had not
   * told it yet. The compositor starts the animation within about a frame of
   * this time. Until the browser tells its start, a read of the channel takes
   * the curve from here.
   */
  latest?: Map<Channel, number>
  /** A later call in the same task that took over its curves. */
  adoptedBy?: StartGroup
  readonly resolve: (start: number) => void
  readonly started: Promise<number>
}

/** An atRest() call waiting for its curves to end. */
export interface RestWait {
  timer: ReturnType<typeof setTimeout> | null
  settle: () => void
}

export interface HandleState {
  resolve: (finished: boolean) => void
  settled: boolean
  timer: ReturnType<typeof setTimeout> | null
}

/**
 * Reduced Motion travel that lands with a plain style write while the
 * element is fully transparent (never an animated transform), then, in a
 * dip, the fade back in.
 */
export interface Landing {
  /**
   * The call that settles when the landing (and its fade back in) ends; a
   * call that joins the dip takes it over, and the call it replaces is
   * carried.
   */
  owner: HandleState
  /** ms after the call's start. */
  readonly at: number
  readonly values: Map<MotionProperty, number>
  /**
   * The fade back in that follows the landing (a dip); `isBorrowed` when it
   * returns to the stylesheet's opacity, which owns it again once it ends.
   */
  fadeIn: {
    readonly to: number
    readonly ms: number
    readonly isBorrowed?: boolean
  } | null
  /** The opacity written with the landing (an exit by role). */
  restore: number | null
  /**
   * The restore returns to the stylesheet's opacity (an exit by role on a
   * surface no call owns opacity on): the stylesheet owns it again.
   */
  restoreIsBorrowed?: boolean
  /** Earlier calls whose landings this one carries: they land with it. */
  readonly carried: HandleState[]
  /** Whose move each value is: a carried value keeps its own call. */
  readonly owners: Map<MotionProperty, HandleState>
  timer: ReturnType<typeof setTimeout> | null
  /** When it is due on the document timeline, once the call has started. */
  due: number | null
}

/** What Reduced Motion makes of a call: its segments, and any landing. */
export interface ReducedPlan {
  readonly next: Partial<Record<MotionProperty, Segment | null>>
  /** Values that stay where they are until the landing writes them. */
  readonly holds: Partial<Record<MotionProperty, number>>
  readonly landing: Omit<
    Landing,
    'owner' | 'timer' | 'carried' | 'owners' | 'due'
  > | null
  /** The stylesheet opacity a dip borrowed (no call owns opacity). */
  readonly borrowed?: number | null
  /** The call joins the waiting dip (see the planner's `joins`). */
  readonly joins?: boolean
}

/**
 * The task calls from rest are made in, shared by every call made in it
 * (every animator's), so one motion's parts that are separate calls start
 * together (startAfterBlock).
 */
export interface TaskMark {
  /**
   * When its first call from rest created animations: the call itself, or a
   * presented call's second frame.
   */
  readonly first: number
  /** When the task ended, at its first microtask. */
  ended?: number
  /** The start every call of a blocked task moves to, set by its first read. */
  at?: number
  /**
   * A call of the task asked for `start: 'next-frame'`. The task is then an
   * input event's own. Every call the mark holds moves to the first frame
   * after the task: the calls made before the task's first microtask.
   */
  nextFrame?: boolean
}

/** One element's wait in sheetReads. */
export interface SheetRead {
  /** Takes the promotion off the element, so a read sees its stylesheet. */
  readonly lift: () => void
  readonly read: () => void
  /** Writes the promotion back with the stylesheet's reasons. */
  readonly write: () => void
}

/**
 * What the calls of the running task have baked. A call that plays the same
 * curve objects reuses them: a row of items that one curve moves samples it
 * once. Cleared at the next microtask checkpoint.
 */
export interface TaskBakes {
  /** Sample times, from the bake's start, by curve, offset and tolerance. */
  readonly times: { readonly key: unknown[], readonly times: number[] }[]
  /** Keyframes, by curves, offsets and the channel's rest values. */
  readonly keyframes: {
    readonly key: unknown[]
    readonly keyframes: Keyframe[]
    effect: AnimationEffect | null
  }[]
}

export type Channel = 'translate' | 'rotate' | 'scale' | 'opacity'

// -- a retarget's start ----------------------------------------------------

/**
 * What the screen shows of a property after a call that continues its
 * motion: the old curve, or the value at rest. It shows that until the
 * frame that commits the call. A rebase since then moves the element
 * under it by `offset`.
 */
export interface Shown {
  readonly segment: Segment | null
  readonly resting: number
  offset: number
  /** When the first such call changed the property. */
  readonly since: number
}
