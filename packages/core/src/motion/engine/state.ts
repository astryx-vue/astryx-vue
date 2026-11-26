/**
 * @file state.ts
 * `initEngineState`: sets the values one animator starts with, in the order
 * upstream's createMotionEngine declares them, before any install module runs.
 * `initLateEngineState`: the values that read installed functions as they
 * are set, after the install modules run.
 * @position Internal to motion/engine; split from upstream motion/animator.ts
 */

import type { SpringDescription } from '../spring'
import type { Animator, MotionProperty } from '../types'
import type { MotionEngine } from './context'
import type { Channel, HandleState, Landing, RestWait, Segment, Shown, StartGroup } from './engineTypes'
import { writePresentedResolve } from '../presentation'
import { IDENTITY } from './constants'
import { defaultIsCoarsePointer, expand, motionNow, registerCustomProperty } from './cssValues'
import { frameNesting } from './taskClock'

export function initEngineState(engine: MotionEngine): void {
  const { options } = engine
  const now = options.now ?? motionNow
  engine.now = now
  const frameSource = options.requestFrame
    ?? (typeof requestAnimationFrame === 'function'
      ? (callback: (frame?: number) => void) => {
          requestAnimationFrame(frame => callback(frame))
        }
      : null)
  engine.frameSource = frameSource
  // Every frame callback of an animator's counts itself, so a call made in
  // one knows its animations commit in that frame.
  engine.requestFrame = frameSource == null
    ? null
    : (callback: (frame?: number) => void) => {
        frameSource((frame) => {
          frameNesting.depth += 1
          try {
            callback(frame)
          }
          finally {
            frameNesting.depth -= 1
          }
        })
      }
  const pseudoElement = options.pseudoElement
  engine.pseudoElement = pseudoElement
  const customProperty = options.customProperty
  engine.customProperty = customProperty
  const companion = customProperty?.companion
  engine.companion = companion
  if (customProperty != null) {
    registerCustomProperty(customProperty.name, customProperty.syntax)
  }
  if (companion != null) {
    registerCustomProperty(companion.name, companion.syntax)
  }
  engine.customUnit = customProperty?.syntax === '<number>' ? '' : 'px'
  engine.isCoarsePointer = defaultIsCoarsePointer
  engine.resting = {
    ...IDENTITY,
    ...expand(options.initial ?? {}),
  }
  engine.base = expand(options.base ?? {})
  engine.segments = new Map<MotionProperty, Segment>()
  engine.running = new Map<Channel, Animation>()
  /** Drops a finished, still-filling animation once the main thread runs. */
  engine.retireTimers = new Map<Channel, ReturnType<typeof setTimeout>>()
  /**
   * Animations whose retire looks again at the next frame (scheduleRetire):
   * each its own, so one still waiting for a replaced animation does not
   * stand in for the next.
   */
  engine.retireFrames = new Set<Animation>()
  /** The timer that starts those looks a frame before a curve's end. */
  engine.retireLooks = new Map<Channel, ReturnType<typeof setTimeout>>()
  engine.touched = new Set<Channel>()
  /**
   * The stylesheet's opacity a Reduce Motion dip borrowed because no call
   * owned opacity; the dip runs from and back to it, then hands it back.
   */
  engine.borrowedOpacity = null
  engine.target = null
  /** Calls from rest whose start still waits for the browser's commit. */
  engine.pendingGroups = new Set<StartGroup>()
  /** atRest() calls still waiting; dispose settles them. */
  engine.restWaits = new Set<RestWait>()
  /** A detach that settles as an unmount at the end of the task, unless an attach follows. */
  engine.unmountQueued = false
  /**
   * The node the latest attach(null) detached, while its unmount is pending:
   * a waiting Reduce Motion move lands there, so that node is left visible
   * where it was going.
   */
  engine.lastDetached = null
  /** The call being committed, when it starts from rest. */
  engine.callGroup = null
  /** The element reported to presentation.ts while translate moves. */
  engine.presented = null
  /**
   * The translate the engine hit-tests the element at while the compositor
   * moves it: where the animation started, or where a `resolve` left it.
   */
  engine.hitTested = { x: 0, y: 0 }
  engine.unpresent = null
  /** Channels promoted to the element's compositing layer (will-change). */
  engine.promoted = new Set<Channel>()
  /** The element's own inline will-change, restored when promotion ends. */
  engine.ownWillChange = null
  /** The stylesheet's will-change when there is no inline value. */
  engine.sheetWillChange = ''
  /**
   * Whether sheetWillChange holds a read of the element's current style: it
   * is read in the task after the element is attached, and again after each
   * demotion, so a promotion (a drag's first move) reads no style in its
   * own task.
   */
  engine.sheetWillChangeRead = false
  /** The pending read of sheetWillChange, cancelled with its element. */
  engine.sheetReadTimer = null
  /** The node whose promotion waits in sheetReads for its stylesheet. */
  engine.sheetReadQueuedFor = null
  engine.demoteTimer = null
  /** A pseudo-element is promoted through a custom property on its host. */
  engine.promotionProperty = pseudoElement == null
    ? null
    : `--astryx-motion-will-change-${pseudoElement.replace(/^:+/, '')}`
  /** Channels whose identity the last node held inline (see `attach`). */
  engine.heldIdentity = new Set<Channel>()
  engine.presentedSource = {
    offset: (time = now()) => {
      engine.syncPending()
      return {
        x: engine.drawnTranslate('x', time) - engine.hitTested.x,
        y: engine.drawnTranslate('y', time) - engine.hitTested.y,
      }
    },
    resolve: () => {
      if (engine.target == null) {
        return
      }
      engine.syncPending()
      const time = now()
      // Any style write makes WebKit resolve the element's transform again,
      // to the value drawn now, where it then stays (iOS 26.2: in the same
      // task); a custom property changes nothing else.
      writePresentedResolve(engine.target)
      engine.hitTested = { x: engine.drawnTranslate('x', time), y: engine.drawnTranslate('y', time) }
    },
  }
  engine.baseChecked = false
  /**
   * Channels whose model a rebase moved while their animation still shows
   * the old curve. Any rebuild clears its channel; the end of the task
   * rebuilds the rest, so a frame never shows the old curve at the new rest.
   */
  engine.stale = new Set<Channel>()
  engine.healQueued = false
  /** Channels left at identity whose stylesheet value is still to be read. */
  engine.releasing = new Set<Channel>()
  engine.releaseQueued = false
  /** Calls with `start: 'presented'` waiting for their second frame. */
  engine.deferredCalls = []
  // -- handles --------------------------------------------------------------

  engine.lastSpring = new WeakMap<HandleState, SpringDescription>()
  engine.shown = new Map<MotionProperty, Shown>()
  /**
   * Channels whose rebuild waits for the frame that commits their call, with
   * the time of the last call on each.
   */
  engine.heldForFrame = new Map<Channel, number>()
  engine.isShownLookQueued = false
  engine.stopWatchingHidden = null
  /** The page whose frames the animator's own frame source draws. */
  engine.framePage = options.requestFrame == null && typeof document !== 'undefined'
    ? document
    : null
  /** This animator's entry in the waiting calls, from what still waits. */
  engine.waitKey = {}
  /** Reduced Motion landings still waiting for the element to be transparent. */
  engine.landings = new Set<Landing>()
  /** Calls a later call's landing carries: an interrupt does not settle them. */
  engine.carriedOwners = new Set<HandleState>()
  /** Reduce Motion calls that named their own opacity. */
  engine.namedOpacity = new WeakSet<HandleState>()
  /**
   * Where opacity was heading before a call took the waiting landings over:
   * an entrance by role that catches an exit fades back to what the exit
   * would have restored.
   */
  engine.headingBeforeTakeOver = null
  engine.animator = {
    get element() {
      return engine.target
    },
  } as Animator
}

export function initLateEngineState(engine: MotionEngine): void {
  /** What the Reduce Motion planner reads of this animator. */
  engine.planView = {
    valueAt: engine.valueAt,
    opacityHeading: () => engine.headingBeforeTakeOver ?? engine.opacityHeading(),
    ownOpacity: () => engine.ownOpacity(),
    writesOwnOpacity: () => engine.writesOwnOpacity(),
    get borrowedOpacity() {
      return engine.borrowedOpacity
    },
    get hasOpacityCurve() {
      return engine.segments.has('opacity')
    },
    get restingOpacity() {
      return engine.resting.opacity
    },
    get hasPendingLanding() {
      return engine.landings.size > 0
    },
    get hasWaitingDip() {
      return [...engine.landings].some(landing => landing.fadeIn != null)
    },
  }
}
