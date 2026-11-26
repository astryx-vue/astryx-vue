/**
 * @file recognizerCore.ts
 * @input A recognizer's options
 * @output RecognizerCore: a recognizer's switches, relationships
 *   (require-to-fail, simultaneous recognition), delegates and listeners
 * @position The base layer of GestureRecognizer.ts
 */

import type { GestureArena } from './GestureArena'
import type { GestureRecognizer } from './GestureRecognizer'
import type {
  GestureListener,
  GestureRecognizerOptions,
  GestureTransitionListener,
  NativeTouchBehavior,
  RecognizerKind,
  SelectionLock,
} from './recognizerOptions'
import type {
  GestureEnvironment,
  GestureState,
  GestureTouch,
  Point,
  PointerKind,
  ScrollType,
} from './types'
import { ALL_NATIVE_TOUCH } from './recognizerOptions'
import { DEFAULT_ENVIRONMENT } from './types'

let nextRecognizerId = 1

/** A recognizer's configuration and relationships; GestureRecognizer is the class to extend. */
export abstract class RecognizerCore {
  /** What this recognizer is (see RecognizerKind). */
  abstract get kind(): RecognizerKind

  /** Stable id, for ordering and debugging. */
  readonly id = nextRecognizerId++
  name: string
  isEnabled: boolean
  cancelsTouchesInView: boolean
  /** See GestureRecognizerOptions.selectionLock. */
  readonly selectionLock: SelectionLock | null
  delaysTouchesBegan: boolean
  delaysTouchesEnded: boolean
  allowedPointerTypes: ReadonlySet<PointerKind> | null
  /** See GestureRecognizerOptions.allowedScrollTypes. */
  readonly allowedScrollTypes: ReadonlySet<ScrollType>
  requiresExclusiveTouchType: boolean
  /**
   * The element (or any object) the recognizer is attached to. The DOM host
   * sets it; the arena treats it as opaque.
   */
  view: unknown = null

  /** Internal. The arena delivering touches to this recognizer, if any. */
  protected arena: GestureArena | null = null
  /** Internal. A recognition waiting for a failure requirement. */
  protected pending: 'began' | 'ended' | null = null

  /**
   * The delegate functions. Typed against the base so a subclass stays
   * assignable to GestureRecognizer; each is only ever called with `this`.
   */
  protected readonly options: GestureRecognizerOptions<GestureRecognizer>
  protected stateValue: GestureState = 'possible'
  // Typed against the base so a subclass stays assignable to
  // GestureRecognizer; every listener is only ever called with `this`.
  protected readonly listeners = new Set<GestureListener<GestureRecognizer>>()
  protected readonly transitionListeners = new Set<
    GestureTransitionListener<GestureRecognizer>
  >()

  protected readonly failureRequirements = new Set<GestureRecognizer>()
  protected readonly simultaneousWith = new Set<GestureRecognizer>()
  /** Touches currently tracked, by id. */
  protected readonly touches = new Map<number, GestureTouch>()
  /** Internal. Every touch id received since the last reset. */
  protected readonly seenTouchIds = new Set<number>()
  protected lastLocation: Point = { x: 0, y: 0 }

  constructor(options: GestureRecognizerOptions<never> = {}) {
    this.options
      = options as unknown as GestureRecognizerOptions<GestureRecognizer>
    this.name = options.name ?? this.constructor.name
    this.isEnabled = options.isEnabled ?? true
    this.cancelsTouchesInView = options.cancelsTouchesInView ?? true
    this.selectionLock = options.selectionLock ?? null
    this.delaysTouchesBegan = options.delaysTouchesBegan ?? false
    this.delaysTouchesEnded = options.delaysTouchesEnded ?? true
    this.allowedPointerTypes
      = options.allowedPointerTypes == null
        ? null
        : new Set(options.allowedPointerTypes)
    this.allowedScrollTypes = new Set(
      options.allowedScrollTypes ?? this.defaultScrollTypes,
    )
    this.requiresExclusiveTouchType
      = options.requiresExclusiveTouchType ?? true
  }

  /** This recognizer, as the GestureRecognizer every recognizer is. */
  protected get self(): GestureRecognizer {
    return this as unknown as GestureRecognizer
  }

  /** Discrete recognizers go from `possible` straight to `ended`. */
  get isDiscrete(): boolean {
    return false
  }

  /**
   * Whether recognizing takes the touches from the browser: while a claiming
   * recognizer owns a touch, the host cancels the browser's pan and zoom for
   * it. Every touch recognizer claims; hover has no touches to claim.
   */
  get claimsTouches(): boolean {
    return this.options.claimsTouches ?? true
  }

  get state(): GestureState {
    return this.stateValue
  }

  /**
   * What the browser may still do natively on this recognizer's view: the
   * host intersects these across a view's recognizers into its
   * `touch-action`. A recognizer that takes no touches constrains nothing.
   */
  get nativeTouchBehavior(): NativeTouchBehavior {
    return ALL_NATIVE_TOUCH
  }

  /** Internal. Whether this recognizer listens to touch at all. */
  protected get acceptsTouchInput(): boolean {
    return (
      this.allowedPointerTypes == null || this.allowedPointerTypes.has('touch')
    )
  }

  /** How many touches the recognizer is tracking right now. */
  get numberOfTouches(): number {
    return this.touches.size
  }

  /** The touches being tracked, in the order they began. */
  get trackedTouches(): ReadonlyArray<GestureTouch> {
    return [...this.touches.values()]
  }

  /**
   * The centroid of the tracked touches in client coordinates; after they
   * end, where they were last.
   */
  location(): Point {
    if (this.touches.size === 0) {
      return this.lastLocation
    }
    let x = 0
    let y = 0
    for (const touch of this.touches.values()) {
      x += touch.x
      y += touch.y
    }
    this.lastLocation = { x: x / this.touches.size, y: y / this.touches.size }
    return this.lastLocation
  }

  /** Facts about the page (viewport, writing direction). */
  protected get environment(): GestureEnvironment {
    return this.arena?.environment ?? DEFAULT_ENVIRONMENT
  }

  // --- Relationships -------------------------------------------------------

  /** UIKit's `require(toFail:)`: recognize only once `other` has failed. */
  requireToFail(other: GestureRecognizer): this {
    this.failureRequirements.add(other)
    return this
  }

  /** Let this and `others` be recognized at the same time (both directions). */
  recognizeSimultaneouslyWith(...others: GestureRecognizer[]): this {
    for (const other of others) {
      this.simultaneousWith.add(other)
      other.simultaneousWith.add(this.self)
    }
    return this
  }

  /** Internal. Whether this recognizer must wait for `other` to fail. */
  protected requiresFailureOf(other: GestureRecognizer): boolean {
    return (
      this.failureRequirements.has(other)
      || this.options.shouldRequireFailureOf?.(this.self, other) === true
      || other.options.shouldBeRequiredToFailBy?.(other, this.self) === true
    )
  }

  /**
   * Internal. Whether this and `other` may be active together: both allow it
   * (`recognizeSimultaneouslyWith` sets both sides; each delegate answers for
   * its own recognizer), so one delegate alone keeps them exclusive (FR15).
   */
  protected allowsSimultaneous(other: GestureRecognizer): boolean {
    return (
      this.simultaneousWith.has(other)
      || (this.options.shouldRecognizeSimultaneously?.(this.self, other) === true
        && other.options.shouldRecognizeSimultaneously?.(other, this.self) === true)
    )
  }

  /** Internal. The delegate's should-begin answer. */
  protected shouldBegin(): boolean {
    return this.options.shouldBegin?.(this.self) ?? true
  }

  /**
   * Internal. Whether this recognizer holds `touchId` before it begins: the
   * host then cancels that finger's moves as for a touch a recognizer owns.
   * None does by default (`spec:AST-094` FR19); a scroll-edge pan holds a
   * finger pulling away from an edge every scroller under it is at.
   */
  protected keepsTouch(_touchId: number): boolean {
    return false
  }

  /** UIKit's `canPrevent(_:)`: whether recognizing fails `other`. */
  canPrevent(_other: GestureRecognizer): boolean {
    return true
  }

  /** UIKit's `canBePrevented(by:)`. */
  canBePrevented(_other: GestureRecognizer): boolean {
    return true
  }

  /**
   * Whether this recognizer is still part of the current interaction: it
   * tracks touches, is waiting on a requirement, or (a multi-tap between
   * taps) expects more input. An idle `possible` recognizer cannot recognize
   * and so does not hold up anything that requires it to fail.
   */
  isInvolved(): boolean {
    return this.touches.size > 0 || this.pending != null
  }

  // --- Listeners -----------------------------------------------------------

  /** Called on began, changed, ended (recognized) and cancelled. */
  addListener(listener: GestureListener<this>): () => void {
    const stored = listener as unknown as GestureListener<GestureRecognizer>
    this.listeners.add(stored)
    return () => {
      this.listeners.delete(stored)
    }
  }

  /** Called on every transition, including failed and the reset to possible. */
  addTransitionListener(listener: GestureTransitionListener<this>): () => void {
    const stored = listener as unknown as GestureTransitionListener<GestureRecognizer>
    this.transitionListeners.add(stored)
    return () => {
      this.transitionListeners.delete(stored)
    }
  }

  /** The scroll types taken when the options name none (UIKit's: none). */
  protected get defaultScrollTypes(): ReadonlyArray<ScrollType> {
    return []
  }
}
