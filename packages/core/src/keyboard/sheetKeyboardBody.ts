/**
 * @file sheetKeyboardBody.ts
 * @input A sheet's scroll body and its content box, the keyboard module's
 *   height and the layout guide's slide
 * @output createSheetKeyboardBody: the body's side of a sheet that reserves
 *   the keyboard's inset. It writes the inset, scrolls the body, brings a
 *   field into the band above the keyboard and finds where the scroll rests
 *   once the keyboard is gone. Also the keyboard's top and the checks the
 *   sheet's reveal reads (overlapOf, isVisualViewportRecovered,
 *   mayKeepKeyboard) and KEYBOARD_INSET_PROPERTY
 * @position Keyboard module, internal to core. sheetKeyboard.ts builds one
 *   per attached sheet.
 */

import type { Animator } from '../motion/animator'
import type { KeyboardLayoutGuide } from './keyboardLayoutGuide'
import type { KeyboardTransition } from './keyboardModel'
import { animatorFor } from '../motion/animator'
import { deepActiveElement } from '../utils/flatTree'
import { layoutViewportHeight } from '../utils/layoutViewport'
import { drawnOffsetOf, FIELD_CLEARANCE_AT_REPORT } from './keyboardGeometry'
import { getKeyboardHeight, isTextEntryControl, KEYBOARD_EPSILON } from './keyboardHeight'
import { bringsUpKeyboard, hidesField } from './keyboardLayoutGuide'
import { distanceIntoBand } from './revealBand'
import { rideKeyboard } from './rideKeyboard'

/**
 * The custom property on the body's content box that holds the keyboard's
 * inset, CSS px. The sheet's stylesheet lays it out as the content box's
 * `::after` block size, after the content's own children.
 */
export const KEYBOARD_INSET_PROPERTY = '--_keyboard-inset'

/** The keyboard's top in the layout viewport, CSS px. */
export function getObstructionTop(): number {
  return layoutViewportHeight(window) - getKeyboardHeight(window)
}

// How far the body runs under the keyboard's top, CSS px. The keyboard's top
// comes from `innerHeight`, a whole number of CSS px, but the visual viewport
// and element rects are fractional. On the Android emulator, Chrome's visual
// viewport is 754.3 px over a 754 px layout viewport. A sheet sized to it
// then ends 0.3 px below `innerHeight` with no keyboard up. So an overlap
// under one CSS px is `innerHeight`'s precision, not an obstruction.
export function overlapOf(bodyBottom: number, obstructionTop: number): number {
  const overlap = bodyBottom - obstructionTop
  return overlap > KEYBOARD_EPSILON ? overlap : 0
}

// Under half a pixel is rounding, not a keyboard.
export function isVisualViewportRecovered(): boolean {
  return getKeyboardHeight(window) <= 0.5
}

// Whether the focused control may keep the keyboard up, read inside open
// shadow roots. A frame or a custom element can hold a field the page cannot
// see. An open shadow host that has focus itself also counts.
export function mayKeepKeyboard(): boolean {
  const target = deepActiveElement(document)
  return target != null && (bringsUpKeyboard(target) || hidesField(target))
}

/** The focused text-entry control inside `body`, if any. */
export function focusedControlIn(body: HTMLElement): HTMLElement | null {
  const active = document.activeElement
  return active instanceof HTMLElement
    && body.contains(active)
    && isTextEntryControl(active)
    ? active
    : null
}

interface KeyboardGeometry {
  bodyBottom: number
}

/** Whether the body lays out the keyboard, shared with the sheet's dismiss. */
export interface SheetKeyboardLayout {
  /** The body lays out the keyboard's inset and scroll now. */
  hasLayout: boolean
  /** That layout stays while the keyboard goes. */
  retainLayout: boolean
}

export interface SheetKeyboardBodyOptions {
  body: HTMLElement
  /** The gap kept between the focused field and the keyboard, CSS px. */
  offset: number
  isExpanded: () => boolean
  layout: SheetKeyboardLayout
  /** The layout guide the content rides, or null where nothing rides it. */
  guide: KeyboardLayoutGuide | null
  /** Whether the sheet takes focus moves over, as on a touch screen. */
  ownsFocusTransitions: boolean
  /** Reports the inset laid out, CSS px. */
  onInset: (inset: number) => void
}

export interface SheetKeyboardBody {
  /** The body's bottom while the keyboard covers it. */
  keyboardGeometry: KeyboardGeometry | null
  /** Where a smooth reveal under way is taking the body's scrollTop. */
  smoothTarget: number | null
  /** The document's scroll with the keyboard up, on a locked page. */
  documentScrollAtKeyboard: { x: number, y: number } | null
  /** The keyboard's top when the keyboard came up. */
  keyboardObstructionTop: number | null
  /** The body's scroll when the keyboard came up. */
  bodyScrollTopAtKeyboard: number | null
  writeInset: (inset: number) => void
  clearKeyboardLayout: () => void
  scrollControlIntoSafeArea: (
    control: HTMLElement,
    smoothly: boolean,
    ride?: KeyboardTransition | null,
  ) => void
  smoothDistanceLeft: () => number
  applyKeyboardGeometry: (geometry: KeyboardGeometry) => void
  restingScrollTop: () => number
  contentAnimator: () => Animator | null
  unguidedAnimator: () => Animator | null
  rideOffset: () => number
  showOnSlide: (atReport: boolean) => KeyboardTransition | null
}

/** Creates the body's side of a sheet that reserves the keyboard's inset. */
export function createSheetKeyboardBody({
  body,
  offset,
  isExpanded,
  layout,
  guide,
  ownsFocusTransitions,
  onInset,
}: SheetKeyboardBodyOptions): SheetKeyboardBody {
  // The inset laid out at the end of the body's content, CSS px, and the
  // scroll range it adds there. The inset's drop takes that range back. The
  // two can differ: Chrome 124 added 344 px of range for a 360 px inset.
  let laidOutInset = 0
  let insetRange = 0

  const content = (): HTMLElement | null => {
    const first = body.firstElementChild
    return first instanceof HTMLElement ? first : null
  }

  // Lays the inset out before anything measures or scrolls the body: the
  // reveal scrolls into the inset it adds in the same frame. An unchanged
  // inset writes nothing, so the body's mutation observer hears no write of
  // its own and the reveal settles.
  const writeInset = (inset: number): void => {
    const changes = inset !== laidOutInset
    const rangeBefore = changes ? body.scrollHeight : 0
    laidOutInset = inset
    const box = content()
    const value = inset > 0 ? `${inset}px` : ''
    if (box != null && box.style.getPropertyValue(KEYBOARD_INSET_PROPERTY) !== value) {
      if (inset > 0) {
        box.style.setProperty(KEYBOARD_INSET_PROPERTY, value)
      }
      else {
        box.style.removeProperty(KEYBOARD_INSET_PROPERTY)
      }
    }
    onInset(inset)
    if (changes) {
      insetRange
        = inset === 0
          ? 0
          : Math.max(0, insetRange + body.scrollHeight - rangeBefore)
    }
  }

  const self: SheetKeyboardBody = {
    keyboardGeometry: null,
    smoothTarget: null,
    documentScrollAtKeyboard: null,
    keyboardObstructionTop: null,
    bodyScrollTopAtKeyboard: null,
    writeInset,
    clearKeyboardLayout: () => {
      writeInset(0)
      if (self.bodyScrollTopAtKeyboard != null) {
        self.smoothTarget = null
        body.scrollTop = self.bodyScrollTopAtKeyboard
      }
      self.keyboardGeometry = null
      self.keyboardObstructionTop = null
      self.bodyScrollTopAtKeyboard = null
      self.documentScrollAtKeyboard = null
      layout.hasLayout = false
      layout.retainLayout = false
    },
    scrollControlIntoSafeArea: (control, smoothly, ride = null) => {
      const measuredBodyRect = body.getBoundingClientRect()
      const measuredControlRect = control.getBoundingClientRect()
      const obstructionTop = getObstructionTop()
      // Under a pixel of overhang is `innerHeight`'s precision, not a
      // keyboard: no suggestion clearance then (overlapOf).
      const overlap = overlapOf(measuredBodyRect.bottom, obstructionTop)
      const clearance = overlap > 0 ? offset : 0
      const safeTop = measuredBodyRect.top
      const safeBottom = Math.min(
        measuredBodyRect.bottom,
        obstructionTop - clearance,
      )

      // Where the control will be once a smooth reveal under way lands. If
      // that lands the control, a second scroll would overshoot in Firefox.
      // Firefox keeps adding a smooth scrollBy's distance after another
      // scroll. A ride's translate is not where the layout puts the control
      // either.
      const pending = self.smoothDistanceLeft() + self.rideOffset()
      const controlBottom = measuredControlRect.bottom - pending
      const controlTop = measuredControlRect.top - pending
      const distance = distanceIntoBand(
        controlTop,
        controlBottom,
        safeTop,
        safeBottom,
      )
      if (distance > 0) {
        scrollBodyBy(
          distance,
          smoothly,
          ride,
          Math.max(0, obstructionTop - safeBottom - FIELD_CLEARANCE_AT_REPORT),
        )
      }
      else if (distance < 0) {
        scrollBodyBy(distance, smoothly, ride)
      }
    },
    // The distance a smooth reveal under way has still to scroll, as far as
    // the body can scroll. It is 0 once it has landed, or with none under way.
    smoothDistanceLeft: () => {
      if (self.smoothTarget == null) {
        return 0
      }
      const maxScroll = Math.max(
        body.scrollTop,
        body.scrollHeight - body.clientHeight,
      )
      const target = Math.min(self.smoothTarget, maxScroll)
      const left = target - body.scrollTop
      return Math.abs(left) < 1 ? 0 : left
    },
    applyKeyboardGeometry: (geometry) => {
      const obstructionTop = getObstructionTop()
      // A collapsed detent can extend the body below the layout viewport even
      // after the keyboard closes, so body overlap alone cannot identify
      // recovery. Once the visual viewport is full height again, release the
      // retained keyboard layout unconditionally.
      if (isVisualViewportRecovered()) {
        self.clearKeyboardLayout()
        return
      }
      const overlap = overlapOf(geometry.bodyBottom, obstructionTop)
      if (overlap === 0) {
        self.clearKeyboardLayout()
        return
      }
      writeInset(Math.max(0, geometry.bodyBottom - (obstructionTop - offset)))
    },
    // Where the body's scroll rests once the keyboard is gone, as the reveal
    // leaves it. The clear puts back the scroll from before the keyboard,
    // within the range left once the inset drops. The reveal then brings a
    // field that keeps focus into the body's view.
    restingScrollTop: () => {
      const scrollTop = body.scrollTop
      const maxAtRest = Math.max(
        0,
        body.scrollHeight - insetRange - body.clientHeight,
      )
      let resting = Math.min(
        maxAtRest,
        self.bodyScrollTopAtKeyboard ?? scrollTop,
      )
      const active = focusedControlIn(body)
      if (isExpanded() && active != null) {
        const bodyRect = body.getBoundingClientRect()
        const rect = active.getBoundingClientRect()
        // Where the layout puts the control at the resting scroll.
        const shift = scrollTop - resting - self.rideOffset()
        if (rect.bottom + shift > bodyRect.bottom) {
          resting += rect.bottom + shift - bodyRect.bottom
        }
        else if (rect.top + shift < bodyRect.top) {
          resting += rect.top + shift - bodyRect.top
        }
        resting = Math.min(maxAtRest, Math.max(0, resting))
      }
      return resting
    },
    contentAnimator: () => {
      const box = content()
      return guide != null && box != null ? animatorFor(box) : null
    },
    // Without the guide, as in iOS Safari and Firefox for Android, nothing
    // publishes the keyboard's slide down. iOS Safari sends one report once
    // the keyboard is gone, about half a second after a blur. Under a coarse
    // primary pointer, the content then moves on UIKit's keyboard spring,
    // never at once.
    unguidedAnimator: () => {
      const box = content()
      return ownsFocusTransitions && guide == null && box != null
        ? animatorFor(box)
        : null
    },
    // How far a ride has moved the content from where its layout puts it, as
    // the page draws it now. The reveal reads a control's rect in the same
    // frame.
    rideOffset: () => {
      const box = content()
      return box != null ? drawnOffsetOf(box) : 0
    },
    // The keyboard's show the guide plays on its slide right now, if any. At
    // a report, a show whose slide has ended counts too. A busy page can read
    // the report that late, and the ride then lands at once.
    showOnSlide: (atReport) => {
      const transition = guide?.transition
      return transition != null
        && transition.kind === 'show'
        && transition.animated
        && transition.curve != null
        && (atReport
          || performance.now() < transition.start + transition.curve.durationMs)
        ? transition
        : null
    },
  }

  // `within` is how far below its resting place the control can sit and
  // still clear the keyboard.
  function scrollBodyBy(
    distance: number,
    smoothly: boolean,
    ride: KeyboardTransition | null = null,
    within: number | null = null,
  ): void {
    self.smoothTarget = null
    const animator = ride == null ? null : self.contentAnimator()
    if (ride != null && animator != null) {
      // The body lands at once, and its content rides the keyboard's slide
      // up from the slide's start. The content starts no lower than
      // `within`, so the control clears the keyboard in this commit. Content
      // that joins the slide late is where the keyboard is (rideKeyboard). A
      // further scroll during the slide adds to the same ride.
      const before = body.scrollTop
      body.scrollTop = before + distance
      const moved = body.scrollTop - before
      // Only what the body actually scrolled rides. A remainder under the
      // scroll position's precision moves nothing, so the ride under way
      // stays on its curve.
      if (moved !== 0) {
        const from = animator.get('y', ride.start) + moved
        animator.set({ y: within == null ? from : Math.min(from, within) })
        rideKeyboard(animator, { y: 0 }, ride, { entrance: within != null })
      }
      return
    }
    if (typeof body.scrollBy !== 'function') {
      body.scrollTop += distance
      return
    }
    // Reduce Motion applies on any pointer.
    const reduceMotion
      = typeof window.matchMedia === 'function'
        && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const behavior = smoothly && !reduceMotion ? 'smooth' : 'instant'
    if (behavior === 'smooth') {
      self.smoothTarget = body.scrollTop + distance
    }
    body.scrollBy({
      top: distance,
      // Not 'auto', which defers to the element's computed
      // `scroll-behavior`. A consumer's `scroll-behavior: smooth` would then
      // animate a scroll this sheet needs to land in the same frame.
      behavior,
    })
  }

  return self
}
