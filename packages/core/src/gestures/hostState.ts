/**
 * @file hostState.ts
 * @output HostState: The host's state: its arena, clock, notes per contact and per element, and the reads every layer shares
 * @position A layer of GestureHost.ts, below HostAttach
 */

import type { DragSelectionHold, DragSelectionReleaseOptions } from '../utils/dragSelection'
import type { EventClock } from '../utils/inputAge'
import type { GestureClock } from './GestureArena'
import type { GestureRecognizer } from './GestureRecognizer'
import type { PlacedContact } from './hostHelpers'
import type { GestureHostOptions, Registration } from './hostTypes'
import type { WheelGesture } from './hostWheel'
import type {
  GestureEnvironment,
  GestureTouch,
  PointerKind,
  TouchSample,
} from './types'
import type { WheelSegment } from './wheelSegmenter'

import { isCoarsePointer } from '../utils/coarsePointer'
import { clockOf } from '../utils/inputAge'
import { isRtlElement } from '../utils/isRtlElement'
import { isElement } from '../utils/nodeType'
import {
  GestureArena,

} from './GestureArena'
import { documentClock } from './hostHelpers'

import { WheelSegmenter } from './wheelSegmenter'

/** The host's state: its arena, clock, notes per contact and per element, and the reads every layer shares; GestureHost is the class to use. */
export abstract class HostState {
  protected abstract lockClaimedDrags(
    ids: ReadonlyArray<number>,
    claimer: GestureRecognizer,
  ): void
  protected abstract refresh(element: Element, registration: Registration): void
  protected abstract releaseArmedPress(): void
  protected abstract releaseClaimedDrags(ids: ReadonlyArray<number>): void
  protected abstract replayClick(touch: GestureTouch, allowed: boolean): void
  protected abstract syncListeners(): void

  readonly arena: GestureArena
  protected readonly doc: Document
  protected readonly registry = new Map<Element, Registration>()
  /** Stops following the animator's moving elements (iOS WebKit only). */
  protected stopWatchingMovers: (() => void) | null = null
  /** Whether the document carries the blocking touchmove for a mover. */
  protected stopBlockingForMovers: (() => void) | null = null
  /** Elements whose caller touch-action waits for a read after paint. */
  protected readonly pendingCallerReads = new Set<HTMLElement>()
  protected isCallerReadScheduled = false
  /** Cancels the scheduled next-frame read (readCallerTouchActionInNextFrame). */
  protected cancelCallerRead: (() => void) | null = null
  /** The selection lock each contact holds, by host contact id. */
  protected readonly lockedBy = new Map<
    number,
    (options?: DragSelectionReleaseOptions) => void
  >()

  /**
   * The page's selection when each mouse or pen press began: a drag a
   * recognizer claims keeps it.
   */
  protected readonly pressSelections = new Map<
    number,
    ReadonlyArray<AbstractRange>
  >()

  /**
   * Mouse and pen contacts that began on selectable text. Once one moves, the
   * browser keeps the drag for a selection, and no recognizer claims it.
   */
  protected readonly selectingContacts = new Set<number>()
  /**
   * Drag selection holds until their last task ends, a task after their lift
   * (lockDragSelection); the last detach ends them at once.
   */
  protected readonly dragHolds = new Set<
    (options?: DragSelectionReleaseOptions) => void
  >()

  /** Each claimed contact's drag hold, until its lift or a give-back. */
  protected readonly claimHolds = new Map<number, DragSelectionHold>()
  protected readonly presentedHitTesting: 'auto' | 'always' | 'never'
  /**
   * Contacts sent to what is drawn instead of what the engine hit, by host
   * contact id, with where they landed (for their click).
   */
  protected readonly retargeted = new Map<
    number,
    { x: number, y: number, target: EventTarget }
  >()

  /** Touch.identifier → arena id, for live fingers. */
  protected readonly touchIds = new Map<number, number>()
  /**
   * Fingers cancelled because the app lost focus, kept until the browser
   * ends them: a browser that keeps such a touch alive must not let its
   * lift click (`spec:AST-094` FR28: nothing acts).
   */
  protected readonly cancelledFingers = new Set<number>()
  /**
   * The pens and pointer-read fingers that the app's lost focus cancelled,
   * by pointer id. Each is kept until its lift, which must not click either,
   * or until a new press.
   */
  protected readonly cancelledPointers = new Map<number, PointerKind>()
  /** Touch.identifier → the element the finger landed on. */
  protected readonly touchTargets = new Map<number, EventTarget>()
  /**
   * Finger targets with listeners of their own: how many fingers each, and
   * how many of those a recognizer could claim while they move (only those
   * need the blocking `touchmove` listener).
   */
  protected readonly watched = new Map<
    EventTarget,
    { count: number, blocking: number, claiming: number }
  >()

  /** Fingers whose target listener is the blocking one. */
  protected readonly blockingFingers = new Set<number>()
  /**
   * Fingers a participant could claim (a recognizer that claims touches, or
   * a press consumer): only their target's `touchend` may need cancelling,
   * so a touch only watchers follow gets a passive one (`spec:AST-094`
   * FR20).
   */
  protected readonly claimingFingers = new Set<number>()
  /** Touch events already handled (the document's and the target's listeners both see one). */
  protected readonly processed = new WeakSet<Event>()
  /** pointerId → arena id, for live mouse and pen contacts. */
  protected readonly pointerIds = new Map<number, number>()
  /** Each contact's kind: a blur refuses a pen's or a pointer-read finger's lift, never a mouse's. */
  protected readonly pointerKinds = new Map<number, PointerKind>()
  /**
   * The boxes the host watches for screen-edge pans (syncLayoutWatch): each
   * element with an enabled one, and the root for one whose band moves with
   * the viewport (spec:AST-094 FR18, FR19, DEC-22), and the one observer
   * that watches them.
   */
  protected readonly layoutWatched = new Set<Element>()
  protected layoutObserver: ResizeObserver | null = null
  /** Where and when the last pen hold the host tracked ended. */
  protected lastPenLift: { target: unknown, time: number } | null = null
  /**
   * Arena ids of the pen contacts that left the long press's tolerance
   * before its duration. No such contact is a hold.
   */
  protected readonly driftedPens = new Set<number>()
  /** Fingers whose first uncancelable `touchmove` was already judged. */
  protected readonly judgedUncancelable = new Set<number>()
  /**
   * A finger's pointerId → its arena id, once its pointerdown and its
   * touchstart are paired. Chromium sends no `touchmove` until a finger has
   * travelled its slop (about 16 px), but sends every `pointermove`, so a
   * paired finger is sampled from its pointer events (`pointerFed`); and its
   * `pointercancel` is the browser's claim of exactly that finger.
   */
  protected readonly fingerPointers = new Map<number, number>()
  /** Finger pointerdowns still waiting for their touchstart. */
  protected readonly pendingPointers = new Map<number, PlacedContact>()
  /**
   * A paired finger's lift, at its `pointerup`: the place and clock its moves
   * came on. Linux WebKit stamps the `touchend` that follows only after the
   * page's pointerup listeners finish. A busy listener would then make a flick
   * read as a resting finger. Read at the touchend, dropped with the finger.
   */
  protected readonly liftStamps = new Map<
    number,
    { x: number, y: number, time: number }
  >()

  /**
   * Where fingers come from their pointer events, where claimed fingers
   * lifted and when: the `touchend` that follows each `pointerup` is
   * cancelled (FR21). A record no `touchend` consumed expires
   * (CLAIMED_LIFT_MS).
   */
  protected readonly claimedLifts: (PlacedContact & { time: number })[] = []
  /** The one timer that drops claimed lifts whose `touchend` never came. */
  protected claimedLiftTimer: unknown = null
  /** The arena's clock, which the claimed lifts' timer runs on too. */
  protected readonly clock: GestureClock
  /**
   * The clock of the document's own window, which stamps its events. A page
   * can replace it after the host exists, so each read looks it up.
   */
  protected get timing(): EventClock | null {
    return clockOf(this.doc)
  }

  /** Fingers still waiting for their pointerdown, by arena id. */
  protected readonly unpairedTouches = new Map<number, PlacedContact>()
  protected readonly isPrimaryPointerCoarse: () => boolean
  /** Whether the host follows `(pointer: coarse)` (no read was passed). */
  protected readonly followsPointer: boolean
  /** The last sample fed per contact: a contact's time never runs back. */
  protected readonly lastFed = new Map<number, TouchSample>()
  /**
   * Fingers whose samples come from their pointer events. A finger the
   * browser reports on both channels is sampled from ONE: the pointer
   * channel, where its pointerdown paired with its touchstart; touch events
   * sample only a finger no pointer event reported (no Pointer Events). The
   * other channel keeps its control duties (cancelling, claiming, the
   * browser's takeover) but never feeds a sample, so the two copies of one
   * move cannot both reach a velocity, however far apart they arrive.
   */
  protected readonly pointerFed = new Set<number>()
  /** When a finger was last down or lifted, and where it landed. */
  protected lastTouch: { readonly target: Node, readonly time: number } | null
    = null

  /** Scrollers a recognizer is scrolling itself this frame (ownScroll). */
  protected readonly ownedScrolls = new Map<Node, number>()
  /** Numbers each ownScroll call: only the newest one's timer clears it. */
  protected ownScrollCalls = 0
  /** Cancels each scroller's pending ownScroll frames. */
  protected readonly ownScrollFrames = new Map<Node, () => void>()
  /** The last scroll a finger drove, and when. */
  protected lastScroll: { readonly scroller: Node, readonly time: number } | null
    = null

  /** Predicates that hold a touch's target away from every participant. */
  protected readonly touchGates = new Set<(target: Node) => boolean>()
  /** Who keeps the listeners installed without a registration (retain). */
  protected retainers = 0
  /** Told after every touch event that changed the fingers on the screen. */
  protected readonly fingerListeners = new Set<() => void>()
  /**
   * Where each finger now on the screen landed, from the last touch event's
   * `touches` (every finger, whether or not a recognizer tracks it).
   */
  protected fingerTargets: ReadonlyArray<Node> = []
  protected nextId = 1
  /** The wheel gesture in progress. */
  protected wheel: WheelGesture | null = null
  /** The wheel latch's input-stream subscription, while a gesture is latched. */
  protected stopWheelLatch: (() => void) | null = null
  /** Splits the wheel stream into gestures and reads a trackpad's lift. */
  protected readonly segmenter = new WheelSegmenter()
  /** The latest wheel's segment. */
  protected wheelSegment: WheelSegment | null = null
  /** Wheels already taken: each element on the path with a listener hears one. */
  protected readonly wheelsSeen = new WeakSet<Event>()
  protected isInstalled = false
  /**
   * Whether the primary pointer is coarse (`spec:AST-094` FR19), read when
   * something first attaches and kept current while anything is attached.
   */
  protected isCoarse = false
  protected stopWatchingPointer: (() => void) | null = null
  /** The input stream subscriptions while installed. */
  protected unsubscribers: (() => void)[] = []
  /**
   * Where the primary pointer is fine, each element that uses a gesture
   * listens for a press itself; the page's listeners last that press (FR24).
   */
  protected readonly armedElements = new Map<Element, () => void>()
  protected isArmedPress = false
  /**
   * Whether the installed listeners include the cancelable ones (the
   * document's touchend, contextmenu and the window's click): only while a
   * participant that can claim is attached (`spec:AST-094` FR20).
   */
  protected isClaimingInstalled = false
  /** The input stream subscriptions syncClaimingListeners keeps. */
  protected claimingUnsubscribers: (() => void)[] = []
  protected readonly inputMode: 'auto' | 'pointer-events'
  protected usesTouchEvents = true

  constructor(doc: Document, options: GestureHostOptions = {}) {
    this.doc = doc
    this.inputMode = options.inputMode ?? 'auto'
    this.presentedHitTesting = options.presentedHitTesting ?? 'auto'
    const environment: GestureEnvironment = {
      viewportSize: () => ({
        width: doc.defaultView?.innerWidth ?? 0,
        height: doc.defaultView?.innerHeight ?? 0,
      }),
      // The writing direction through core's one helper.
      isRtl: view => isElement(view) && isRtlElement(view as HTMLElement),
      // A screen-edge pan tells a view within its edge band from any other
      // by its box (spec:AST-094 FR18).
      viewRect: (view) => {
        if (!isElement(view)) {
          return null
        }
        const { left, top, width, height } = view.getBoundingClientRect()
        return { left, top, width, height }
      },
    }
    this.clock = options.clock ?? documentClock(doc)
    this.arena = new GestureArena({
      clock: this.clock,
      environment,
      onDeferredClick: (touch, allowed) => this.replayClick(touch, allowed),
      // A press whose decision waited on a timer (a tap waiting on a double
      // tap) ends here: an armed press stops listening (FR24).
      onIdle: () => this.releaseArmedPress(),
      onTransition: options.onTransition,
      onClaim: (ids, claimer) => this.lockClaimedDrags(ids, claimer),
      onRelease: ids => this.releaseClaimedDrags(ids),
      refusesClaim: touch =>
        this.selectingContacts.has(touch.id)
        && (touch.x !== touch.startX || touch.y !== touch.startY),
    })
    const view = doc.defaultView
    // A test may pass its own read; otherwise the one coarse-pointer gate,
    // followed as it changes.
    this.followsPointer = options.isPrimaryPointerCoarse == null
    this.isPrimaryPointerCoarse
      = options.isPrimaryPointerCoarse ?? (() => isCoarsePointer(view))
  }

  /**
   * Internal. The document this host serves.
   */
  get document(): Document {
    return this.doc
  }

  /**
   * Internal. Whether a recognizer owns the touch with this Touch Events
   * `identifier`, so the browser must not pan it (pageHold.ts asks).
   */
  isTouchClaimed(identifier: number): boolean {
    const id = this.touchIds.get(identifier)
    return id != null && this.arena.isClaimed(id)
  }

  /**
   * Re-derive an element's styles and the host's listeners after its
   * recognizers' options or its consumer's enabled state changed.
   */
  update(element: Element): void {
    if (!this.followsPointer) {
      // A read passed in (a test's) is not followed: an update reads it again.
      this.isCoarse = this.isPrimaryPointerCoarse()
    }
    const registration = this.registry.get(element)
    if (registration != null) {
      this.refresh(element, registration)
    }
    this.syncListeners()
  }

  /**
   * The Pointer Events `pointerId` of a contact the arena tracks: a mouse's
   * or a pen's own, and for a finger driven by touch events the pointer its
   * touch was paired with (null before the pairing, or without Pointer
   * Events). It hands a held finger to code that follows pointers, as a
   * menu does when a long press turns into a press-drag selection.
   */
  pointerIdOf(touch: GestureTouch | number): number | null {
    const id = typeof touch === 'number' ? touch : touch.id
    for (const [pointerId, arenaId] of this.fingerPointers) {
      if (arenaId === id) {
        return pointerId
      }
    }
    for (const [pointerId, arenaId] of this.pointerIds) {
      if (arenaId === id) {
        return pointerId
      }
    }
    return null
  }
}
