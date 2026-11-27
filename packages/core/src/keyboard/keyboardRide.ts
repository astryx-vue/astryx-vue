/**
 * @file keyboardRide.ts
 * @input The keyboard module's reports, the layout guide, rideKeyboard and
 *   the shared animator
 * @output rideWithKeyboard, which moves a docked target with the keyboard:
 *   on the guide's slide where one is published, at each report elsewhere
 * @position Keyboard module, internal to core. keyboardTarget.ts starts a
 *   ride for a Core host's element or an app's docked bar.
 */

import type { Animator } from '../motion/animator'
import type { KeyboardTransition } from './keyboardModel'
import { animatorFor } from '../motion/animator'
import { subscribeInput } from '../utils/inputStream'
import { layoutViewportHeight } from '../utils/layoutViewport'
import { scrollingAncestor } from '../utils/scrollingAncestor'
import { sharedWeakMap } from '../utils/sharedRealm'
import {
  coveredBy,
  FIELD_CLEARANCE_AT_REPORT,
  focusedFieldIn,
  isDockedContainer,
  isMovedByApp,
  restingBottom,
  riddenAnimators,
} from './keyboardGeometry'
import {
  getKeyboardHeight,
  isTextEntryControl,
  KEYBOARD_EPSILON,
  subscribeKeyboardHeight,
} from './keyboardHeight'
import { getKeyboardLayoutGuide, keyboardProfileOf } from './keyboardLayoutGuide'
import { revealDistance, scrollBy, watchPans } from './keyboardReveal'
import { rideKeyboard } from './rideKeyboard'

// The lift of a ridden target. A Core host (`isHostOwned`) clears the keyboard
// with a focused field inside, the field `offset` above it. An app's docked
// container moves only by the part of it the keyboard still covers. That part
// is measured after any lift the app gives it. So a bar the app already moves
// with the keyboard is not moved again. It is not moved at all once its layout
// leaves the bottom edge. Nor is it moved while the app runs its own CSS
// transition or animation on its position. When a field outside has focus, the
// target rests under the keyboard, so it never covers that field. When focus
// left for nothing, a lifted target rides down with the keyboard, and one at
// rest stays there.
function liftFor(
  target: HTMLElement,
  animator: Animator,
  height: number,
  offset: number,
  win: Window,
  isHostOwned: boolean,
): number {
  // An app's bar it is moving itself is left to the app, never lifted twice.
  if (!isHostOwned && (!isDockedContainer(target) || isMovedByApp(target))) {
    return 0
  }
  const targetCovered = coveredBy(
    restingBottom(target, animator),
    height,
    0,
    win,
  )
  const field = focusedFieldIn(target)
  if (field != null) {
    if (!isHostOwned) {
      return targetCovered
    }
    const fieldCovered = coveredBy(
      restingBottom(field, animator),
      height,
      offset,
      win,
    )
    return Math.max(targetCovered, fieldCovered)
  }
  if (isTextEntryControl(target.ownerDocument.activeElement)) {
    return 0
  }
  return animator.get('y') < 0 ? targetCovered : 0
}

// Whether `container`'s drawn box is taller than the room above a keyboard
// `height` px tall. A move to the keyboard's top would then push it off the
// top.
function exceedsRoom(
  container: HTMLElement,
  height: number,
  win: Window,
): boolean {
  return (
    height > KEYBOARD_EPSILON
    && container.getBoundingClientRect().height
    > layoutViewportHeight(win) - height + KEYBOARD_EPSILON
  )
}

// The focused text field in `container` and its scroller there, or null
// when no field inside has focus or no scroller sits between them.
function focusedScrollerIn(
  container: HTMLElement,
): { field: Element, scroller: Element } | null {
  const field = focusedFieldIn(container)
  const scroller = field == null ? null : scrollingAncestor(field, container)
  return field == null || scroller == null ? null : { field, scroller }
}

// The lift of a container taller than the room above the keyboard with no
// scroller around its focused field. It lifts only as far as that field needs
// to sit `offset` above the keyboard. It never lifts past the container's own
// overlap, so a field near its top stays on screen. It keeps liftFor's guards:
// a container that left the bottom edge or that the app is moving gets none.
// When focus left for nothing it never rises and rides down as the keyboard
// goes.
function fieldLift(
  target: HTMLElement,
  animator: Animator,
  height: number,
  offset: number,
  win: Window,
): number {
  if (!isDockedContainer(target) || isMovedByApp(target)) {
    return 0
  }
  const overlap = coveredBy(restingBottom(target, animator), height, 0, win)
  const field = focusedFieldIn(target)
  if (field == null) {
    // A text field outside has focus: the container rests under the keyboard.
    return isTextEntryControl(target.ownerDocument.activeElement)
      ? 0
      : Math.min(Math.max(0, -animator.get('y')), overlap)
  }
  const need = coveredBy(restingBottom(field, animator), height, offset, win)
  return Math.min(need, overlap)
}

// The move that sets the focused field in `target` FIELD_CLEARANCE_AT_REPORT
// px above a keyboard `height` px tall, or null with no field to clear.
function clearanceAtReport(
  target: HTMLElement,
  animator: Animator,
  height: number,
  win: Window,
): number | null {
  const field = focusedFieldIn(target)
  if (field == null) {
    return null
  }
  const need = coveredBy(
    restingBottom(field, animator),
    height,
    FIELD_CLEARANCE_AT_REPORT,
    win,
  )
  return need > 0 ? -need : null
}

// The ride that moves each target. A new ride on the same target takes over,
// whether the old one still rides or waits for the keyboard to go. So two never
// move one target, and the one taken over never moves it again.
const currentRides = sharedWeakMap<HTMLElement, () => void>(
  'keyboard/keyboard-target/current-rides',
  1,
)

// Rides `target` with the keyboard until the returned call (see liftFor).
// `isHostOwned` is true for a Core host's own element, and false for an app's
// docked container. Where the guide publishes the keyboard's slide, the
// target moves on it; elsewhere it takes each report's place. A blur's stop
// waits for the keyboard to go, so the target never drops under a keyboard
// still showing. A final stop, on detach, returns it at once.
export function rideWithKeyboard(
  target: HTMLElement,
  offset: number,
  win: Window,
  isHostOwned: boolean,
): (isFinal?: boolean) => void {
  currentRides.get(target)?.()
  const animator = animatorFor(target)
  riddenAnimators.set(target, animator)
  const guide
    = keyboardProfileOf(win) === 'chromium' ? getKeyboardLayoutGuide(win) : null
  // A ride moves the target while it rides or waits for the keyboard to go.
  // Once it ends, by itself or by a takeover, it never moves the target.
  let state: 'riding' | 'waiting' | 'ended' = 'riding'
  let stopReports: (() => void) | null = null
  let stopGuide: (() => void) | null = null
  // The guide runs only in Chrome, whose own reveal of a field in the target
  // also scrolls the page behind it.
  const pans = watchPans(
    win,
    focused => target.contains(focused),
    guide != null,
  )
  let frame = 0
  let pendingSlide: KeyboardTransition | null = null
  let stopFocusIns: () => void = () => {}
  const end = (): void => {
    state = 'ended'
    stopReports?.()
    stopGuide?.()
    stopReports = null
    stopGuide = null
    pans.stop()
    stopFocusIns()
    if (frame !== 0) {
      win.cancelAnimationFrame(frame)
      frame = 0
    }
    if (currentRides.get(target) === end) {
      currentRides.delete(target)
    }
  }
  currentRides.set(target, end)
  const place = (height: number, transition: KeyboardTransition | null): void => {
    if (state === 'ended') {
      return
    }
    // An app's container taller than the room above the keyboard never rides
    // the whole overlap. A scroller in it reveals the focused field instead.
    // With none, it rides only as far as that field needs.
    const isTooTall = !isHostOwned && exceedsRoom(target, height, win)
    const inside = isTooTall ? focusedScrollerIn(target) : null
    const lift = !isTooTall
      ? liftFor(target, animator, height, offset, win, isHostOwned)
      : inside == null
        ? fieldLift(target, animator, height, offset, win)
        : 0
    // Rest is y 0, never -0, so the animator releases its translate there.
    const y = lift > 0 ? -lift : 0
    // Every box is read before anything is written. The scroller moves with
    // the container, so the reveal measures the field where the move leaves
    // it.
    const revealBy
      = inside == null
        ? 0
        : revealDistance(
            inside.field,
            inside.scroller,
            height,
            offset,
            win,
            y - animator.get('y'),
          )
    if (inside != null && Math.abs(revealBy) > KEYBOARD_EPSILON) {
      scrollBy(inside.scroller, revealBy, win)
    }
    if (y !== 0 || animator.get('y') !== 0) {
      if (transition == null) {
        animator.set({ y })
      }
      else {
        // On a show, the field is set just above the keyboard's top at once,
        // so Chrome's own pan finds it clear. Only the rest rides.
        const atReport
          = transition.kind === 'show'
            ? clearanceAtReport(target, animator, height, win)
            : null
        if (atReport != null && y < atReport && atReport < animator.get('y')) {
          animator.set({ y: atReport })
        }
        rideKeyboard(animator, { y }, transition)
      }
    }
    // The target is now at rest, or rides there on the keyboard's slide, so
    // a stopped ride only stops listening. A set here would cut the slide.
    if (state === 'waiting' && height <= KEYBOARD_EPSILON) {
      end()
    }
  }
  // A report, a slide or a focus move places the target on the next frame, once
  // every listener of that event has run. An app that moves its own bar in its
  // listener has moved it by then. So the lift measures only what the keyboard
  // still covers, and never stacks on the app's.
  const placeOnNextFrame = (slide: KeyboardTransition | null): void => {
    if (slide != null) {
      pendingSlide = slide
    }
    if (frame !== 0) {
      return
    }
    frame = win.requestAnimationFrame(() => {
      frame = 0
      const next = pendingSlide
      pendingSlide = null
      place(next?.to ?? guide?.inset ?? getKeyboardHeight(win), next)
    })
  }
  // Every viewport report feeds the pan watch, so a pan the browser still
  // makes is put back. Without the guide, the report also places the target.
  stopReports = subscribeKeyboardHeight(win, (event) => {
    if (event.type === 'viewport') {
      if (guide == null) {
        placeOnNextFrame(null)
      }
      pans.report(event.height)
    }
  })
  if (guide != null) {
    stopGuide = guide.subscribe(placeOnNextFrame)
  }
  // A field gaining focus with the keyboard up places the target. A blur to
  // nothing waits for the keyboard's own report or slide, so the target rides
  // down from where it is.
  stopFocusIns = subscribeInput(win, 'focusin', () =>
    placeOnNextFrame(null))
  placeOnNextFrame(null)
  return (isFinal = false) => {
    if (state === 'ended') {
      return
    }
    if (isFinal || getKeyboardHeight(win) <= KEYBOARD_EPSILON) {
      end()
      if (animator.get('y') !== 0) {
        animator.set({ y: 0 })
      }
    }
    else {
      state = 'waiting'
    }
  }
}
