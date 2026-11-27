/**
 * @file segmentedTracking.ts
 * @input The radiogroup and its selection motion (segmentedSelectionMotion.ts)
 * @output attachSegmentedTracking: tracks a press of any pointer on
 *   SegmentedControl, from landing to lift, and commits the segment the
 *   lift picks; and the click wait the control's focus handling reads
 * @position Internal to SegmentedControl, on the gesture host's press
 *   tracking and pan recognizer (../gestures). Wired by useSegmentedSelection.ts
 *
 * As UIKit's segmented control:
 * - The press tracker reports the press from landing to lift and never
 *   claims the pointer, so a vertical drag still scrolls the page. A
 *   horizontal pan carries the lens; it claims the pointer only past its
 *   slop.
 * - The lift decides the segment, wherever the press began. The pointer
 *   counts along the control's axis, so a drag that drifted off above or
 *   below keeps choosing by its horizontal position. Only a cancel commits
 *   nothing: the browser takes the pointer, or Escape.
 * - A tap gets the browser's own click. A drag gets none, so the segment is
 *   clicked at the lift, and the browser's late click is swallowed. Either
 *   way the item's click handler runs once and can cancel the selection.
 * - Once a press from another segment drags, the segment the lift would
 *   commit shows the press paint.
 */

import type { ControlEvent } from '../gestures/PressTracker'
import type { GestureTouch } from '../gestures/types'
import type { SegmentSpan } from './segmentedGeometry'
import type { SegmentedSelectionMotion } from './segmentedSelectionMotion'
import { PRESSED_ATTRIBUTE, pressFadeMs } from '../composables/internal/pressFeedback.js'
import { getGestureHost } from '../gestures/GestureHost'
import { PanGestureRecognizer } from '../gestures/PanGestureRecognizer'
import { createPressTracker } from '../gestures/PressTracker'
import { awaitBrowserClick, clickForLift } from '../utils/browserClickWait'
import { armClickGuard } from '../utils/clickGuard'
import { lockSelection } from '../utils/selectionLock'
import { hasNoLayout, isEnabledSegment, liftTargetAt, measureSegments, SEGMENT_SELECTOR } from './segmentedGeometry'

/**
 * A press, or a tap's click still to come. Until it runs, a focus move the
 * press causes selects nothing: the press commits through that click.
 */
export interface SegmentedPressState {
  readonly isPressing: () => boolean
  /** A key went down: a focus move it causes is the keyboard's, and selects. */
  readonly keyPressed: () => void
}

export interface SegmentedTracking extends SegmentedPressState {
  readonly detach: () => void
}

/** The enabled segment a press landed on, from the element under it. */
function segmentUnder(track: HTMLElement, target: unknown): HTMLElement | null {
  const segment = target instanceof Element ? target.closest<HTMLElement>(SEGMENT_SELECTOR) : null
  return segment != null && track.contains(segment) && isEnabledSegment(segment) ? segment : null
}

export function attachSegmentedTracking(
  track: HTMLElement,
  motion: SegmentedSelectionMotion,
  isEnabled: () => boolean,
): SegmentedTracking {
  const doc = track.ownerDocument
  const host = getGestureHost(doc)
  let segments: SegmentSpan[] = []
  let beganOn: HTMLElement | null = null
  /** The horizontal pan began: a drag, not a tap. */
  let isDragging = false
  /** The press began on the selected segment, so the lens shows it. */
  let isLensPress = false
  /** Escape or the browser took this press back: the rest changes nothing. */
  let isCancelled = false
  let isTracking = false
  /** A tap lifted and its click has not run yet. */
  let isClickToCome = false
  let endClickWait: (() => void) | null = null
  /** The segment painted as the one a drag would commit. */
  let painted: HTMLElement | null = null
  const fades = new Map<HTMLElement, ReturnType<typeof setTimeout>>()

  function endWait(): void {
    isClickToCome = false
    endClickWait?.()
    endClickWait = null
  }

  function paint(next: HTMLElement | null): void {
    if (next === painted)
      return
    painted?.removeAttribute(PRESSED_ATTRIBUTE)
    painted = next
    if (next != null) {
      clearTimeout(fades.get(next))
      fades.delete(next)
      next.setAttribute(PRESSED_ATTRIBUTE, 'on')
    }
  }

  /** The painted segment fades out with the shared press fade. */
  function fadePaint(): void {
    const element = painted
    painted = null
    if (element == null)
      return
    element.setAttribute(PRESSED_ATTRIBUTE, 'fading')
    fades.set(element, setTimeout(() => {
      fades.delete(element)
      if (element.getAttribute(PRESSED_ATTRIBUTE) === 'fading')
        element.removeAttribute(PRESSED_ATTRIBUTE)
    }, pressFadeMs(element)))
  }

  function stopTracking(): void {
    isTracking = false
    doc.removeEventListener('keydown', onKeydown, true)
  }

  /** Escape or the browser took the press back: the highlight returns at once. */
  function cancelPress(): void {
    isCancelled = true
    endWait()
    paint(null)
    for (const { element } of segments) {
      if (element.getAttribute(PRESSED_ATTRIBUTE) === 'on')
        element.removeAttribute(PRESSED_ATTRIBUTE)
    }
    motion.cancel()
  }

  function onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && isTracking && !isCancelled)
      cancelPress()
  }

  function commit(lifted: HTMLElement, value: string, isTap: boolean): void {
    if (!isTap) {
      // A drag gets no click from the browser: the segment's own click, now.
      motion.clicked(value, clickForLift(lifted))
      return
    }
    // A tap: the browser's own click commits it. A held finger gets none.
    isClickToCome = true
    endClickWait = awaitBrowserClick(lifted, {
      onClicked: (cancelled) => {
        endClickWait = null
        isClickToCome = false
        motion.clicked(value, cancelled)
      },
      onNoClick: () => {
        endClickWait = null
        isClickToCome = false
        motion.clicked(value, clickForLift(lifted))
      },
    })
  }

  function lift(event: ControlEvent, touch: GestureTouch): void {
    stopTracking()
    if (isCancelled) {
      // The browser's own click for this lift still comes; the guard takes it.
      armClickGuard(doc)
      return
    }
    if (hasNoLayout(segments)) {
      // Without layout the lift names no segment: the browser's click decides.
      paint(null)
      motion.cancel()
      return
    }
    const lifted = liftTargetAt(touch.x, touch.y, segments)
    if (isDragging && !isLensPress)
      paint(lifted != null && lifted.getAttribute('aria-checked') !== 'true' ? lifted : null)
    fadePaint()
    const isTap = event === 'touchUpInside' && !isDragging && lifted != null && lifted === beganOn
    const value = motion.release(lifted)
    if (value != null && lifted != null)
      commit(lifted, value, isTap)
  }

  function land(touch: GestureTouch): void {
    endWait()
    isDragging = false
    isCancelled = false
    isTracking = true
    segments = measureSegments(track)
    beganOn = segmentUnder(track, touch.target)
    isLensPress = beganOn?.getAttribute('aria-checked') === 'true'
    motion.begin(beganOn, touch.pointerType === 'touch')
    doc.addEventListener('keydown', onKeydown, true)
  }

  /** The press from landing to lift; the horizontal pan follows the drag in between. */
  function onControlEvent(event: ControlEvent, touch: GestureTouch): void {
    if (event === 'touchDown') {
      land(touch)
    }
    else if (event === 'touchUpInside' || event === 'touchUpOutside') {
      lift(event, touch)
    }
    else if (event === 'touchCancel') {
      stopTracking()
      if (!isCancelled)
        cancelPress()
    }
  }

  const tracker = createPressTracker({
    view: track,
    getBounds: () => track.getBoundingClientRect(),
    isEnabled,
    onControlEvent,
    onHighlightChange: (isHighlighted) => {
      if (isHighlighted && !isCancelled)
        motion.highlighted()
    },
  })
  const pan = new PanGestureRecognizer({
    name: 'segmented-control-drag',
    direction: 'horizontal',
    cancelsTouchesInView: false,
    // A held press does something here (a drag carries the lens and commits
    // where it lifts), so a held finger selects no title text.
    selectionLock: lockSelection,
  })
  const detachers = [
    host.attachConsumer(track, tracker),
    host.attach(track, pan),
    pan.addListener((current) => {
      if (isCancelled || !isTracking || (current.state !== 'began' && current.state !== 'changed'))
        return
      isDragging = true
      const { x, y } = current.location()
      motion.drag(x)
      if (!isLensPress && !hasNoLayout(segments)) {
        const target = liftTargetAt(x, y, segments)
        paint(target != null && target.getAttribute('aria-checked') !== 'true' ? target : null)
      }
    }),
    () => tracker.dispose(),
  ]

  return {
    isPressing: () => isTracking || isClickToCome,
    keyPressed: endWait,
    detach: () => {
      stopTracking()
      endWait()
      paint(null)
      for (const [element, timer] of fades) {
        clearTimeout(timer)
        if (element.getAttribute(PRESSED_ATTRIBUTE) === 'fading')
          element.removeAttribute(PRESSED_ATTRIBUTE)
      }
      fades.clear()
      for (const detach of detachers)
        detach()
    },
  }
}
