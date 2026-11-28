/**
 * @file hostHelpers.ts
 * @input Recognizers, events and documents the gesture host reads
 * @output The gesture host's small pure helpers and constants: style
 *   properties, frames, claim and contact predicates, event times and the
 *   document clock
 * @position Shared by the layers of GestureHost.ts
 */

import type { EventClock } from '../utils/inputAge'
import type { ClickDisposition, GestureClock } from './GestureArena'
import type { GestureRecognizer } from './GestureRecognizer'
import type { PanGestureRecognizer } from './PanGestureRecognizer'
import type { ScreenEdgePanGestureRecognizer } from './ScreenEdgePanGestureRecognizer'
import type { GestureHostStyle } from './touchAction'

import type {
  PointerKind,
  TouchSample,
} from './types'

import { clockOf } from '../utils/inputAge'
import {
  browserClock,

} from './GestureArena'

import { internals } from './recognizerInternals'

export const STYLE_PROPERTIES: Record<keyof GestureHostStyle, string> = {
  touchAction: 'touch-action',
  WebkitTouchCallout: '-webkit-touch-callout',
  WebkitUserSelect: '-webkit-user-select',
  userSelect: 'user-select',
}

export const CSS_WIDE_KEYWORDS: ReadonlySet<string> = new Set([
  'initial',
  'inherit',
  'unset',
  'revert',
  'revert-layer',
])

/**
 * A CSS-wide keyword, which names no touch-action of its own: the value in
 * force resolves it (`initial` and `unset` to `auto`, `inherit` to the
 * parent's).
 */
export function isCssWideKeyword(value: string): boolean {
  return CSS_WIDE_KEYWORDS.has(value.trim().toLowerCase())
}

/**
 * Run `task` in the next frame, before it paints: a read there styles what
 * the frame must style anyway, and its writes are what the frame shows.
 */
export function inNextFrame(view: Window | null, task: () => void): () => void {
  if (view != null && typeof view.requestAnimationFrame === 'function') {
    const frame = view.requestAnimationFrame(task)
    return () => view.cancelAnimationFrame(frame)
  }
  const timeout = setTimeout(task, 0)
  return () => clearTimeout(timeout)
}

/** An armed press tracker's own element listeners: they never cancel. */
export const PASSIVE_CAPTURE = { capture: true, passive: true } as const

/**
 * Whether a recognizer can take a touch while it moves, and so needs the
 * blocking `touchmove` listener that stops the browser's pan. A tap claims
 * only at the lift (it fails once the finger travels), so it needs none.
 */
export function claimsWhileMoving(recognizer: GestureRecognizer): boolean {
  return (
    recognizer.claimsTouches
    && internals(recognizer).acceptsTouchInput
    && internals(recognizer).family !== 'tap'
  )
}

/**
 * Whether a recognizer takes a contact that comes with Touch Events and a
 * long press's contextmenu: a finger's or a pen's. A scroll-only recognizer
 * (`allowedPointerTypes: []`) and a mouse-only one take neither.
 */
export function takesTouchContacts(recognizer: GestureRecognizer): boolean {
  const types = recognizer.allowedPointerTypes
  return types == null || types.has('touch') || types.has('pen')
}

/**
 * A pan (or a pan subclass), told apart by its family rather than its class,
 * so a page that constructs no pan never ships PanGestureRecognizer.
 */
export function isPanRecognizer(
  recognizer: GestureRecognizer,
): recognizer is PanGestureRecognizer {
  return internals(recognizer).family === 'pan'
}

/**
 * A screen-edge pan, told apart by its kind (architecture:react-component-runtime
 * INV13), so the host can report its layout changes without importing it.
 */
export function asScreenEdgePan(
  recognizer: GestureRecognizer,
): ScreenEdgePanGestureRecognizer | null {
  return recognizer.kind === 'screenEdgePan'
    ? (recognizer as ScreenEdgePanGestureRecognizer)
    : null
}

export type StylusTouch = Touch & { touchType?: string }

export function hasStylusTouch(event: TouchEvent): boolean {
  return touchesOf(event.changedTouches).some(
    touch => (touch as StylusTouch).touchType === 'stylus',
  )
}

export interface PlacedContact {
  readonly x: number
  readonly y: number
  readonly target: unknown
}

/**
 * How long a claimed finger's lift waits for its `touchend`, ms. The touchend
 * follows its pointerup in the same frame; a browser that sends pointer events
 * alone for a finger never sends it, and the record goes.
 */
export const CLAIMED_LIFT_MS = 500

/** At most this many claimed lifts wait for their `touchend` at once (FR24). */
export const CLAIMED_LIFT_LIMIT = 8

/** A touchstart and a pointerdown describe one finger: same target, same spot. */
export function isSamePlace(a: PlacedContact, b: PlacedContact): boolean {
  return (
    a.target === b.target
    && Math.abs(a.x - b.x) <= 1
    && Math.abs(a.y - b.y) <= 1
  )
}

export function isPointerKind(type: string): type is PointerKind {
  return type === 'touch' || type === 'mouse' || type === 'pen'
}

/**
 * What an event, or one of its touches, landed on. Inside an open shadow root
 * the document's listeners see the shadow host, in `event.target` and in a
 * touch's `target` alike, while the composed path starts at the element
 * itself. A touch whose target is not the event's (another finger) keeps its
 * own.
 */
export function landedOn(
  event: Event,
  retargeted: EventTarget | null = event.target,
): EventTarget | null {
  if (retargeted !== event.target) {
    return retargeted
  }
  return event.composedPath()[0] ?? retargeted
}

/** Read without the pan class, which a page with no pan never ships. */
export function isScrollEdgePan(recognizer: GestureRecognizer): boolean {
  return (recognizer as { scrollEdge?: boolean }).scrollEdge === true
}

/**
 * Whether a pan takes a contact moving by (cx, cy), by its own direction
 * rule, `axisRatio` included. A move its rule leaves undecided stays the
 * page's.
 */
export function panTakesMove(
  recognizer: GestureRecognizer,
  cx: number,
  cy: number,
): boolean {
  return (
    (internals(recognizer).classify?.({ x: cx, y: cy }) ?? 'begin') === 'begin'
  )
}

/**
 * An event's time on the arena's clock: `timing.now()`, with `timing` the
 * clock of the event's own window. Some engines and DOM emulators stamp
 * events in epoch milliseconds instead.
 */
export function eventTime(event: Event, timing: EventClock | null): number {
  const time = event.timeStamp
  if (time > 1e12 && timing != null && timing.timeOrigin > 0) {
    return time - timing.timeOrigin
  }
  return time
}

/**
 * The arena clock for `doc`. The page's own document keeps the page's clock.
 * A same-origin iframe or a Picture-in-Picture window stamps its events from
 * its own start, so its clock reads that window's `performance`. A page can
 * replace that object after the host exists, so each reading looks it up.
 */
export function documentClock(doc: Document): GestureClock {
  const view = doc.defaultView
  if (view == null || view === globalThis) {
    return browserClock
  }
  return {
    ...browserClock,
    now: () => clockOf(doc)?.now() ?? browserClock.now(),
  }
}

/** A touch list as an array; a synthetic event may carry none. */
export function touchesOf(list: TouchList | null | undefined): Touch[] {
  return list == null ? [] : Array.from(list)
}

export function needsSuppression(
  dispositions: Map<number, ClickDisposition>,
): boolean {
  for (const disposition of dispositions.values()) {
    if (disposition !== 'allow') {
      return true
    }
  }
  return false
}

export function coalescedHistory(
  event: PointerEvent,
  timing: EventClock | null,
): TouchSample[] {
  if (typeof event.getCoalescedEvents !== 'function') {
    return []
  }
  const coalesced = event.getCoalescedEvents()
  return coalesced.slice(0, -1).map(sample => ({
    x: sample.clientX,
    y: sample.clientY,
    time: eventTime(sample, timing),
  }))
}
