/**
 * @file sheetKeyboard.ts
 * @input A sheet and its scroll body, the keyboard module's reports, focus
 *   claim and reveal-pan watch, and the layout guide
 * @output attachSheetKeyboard, which keeps a focused field in a sheet's body
 *   above the on-screen keyboard: it lays out the keyboard's inset at the
 *   end of the body's content, reveals the field in the keyboard report's
 *   own event and puts back a browser's own reveal pan
 * @position Keyboard module, internal to core. useMobileKeyboard attaches it
 *   to a target that reserves the inset, as a Tall BottomSheet's panel.
 */

import type { SheetKeyboardLayout } from './sheetKeyboardBody'
import { subscribeInput } from '../utils/inputStream'
import { isDocument, isNode } from '../utils/nodeType'
import { sharedState } from '../utils/sharedRealm'
import { observeResize } from '../utils/sharedResizeObserver'
import { refuseFocusReveal } from './focusReveal'
import { registerKeyboardTarget } from './keyboardGeometry'
import {
  findTextEntryControl,
  getKeyboardHeight,
  isKeyboardMeasurable,
  subscribeKeyboardHeight,
} from './keyboardHeight'
import { getKeyboardLayoutGuide, keyboardProfileOf } from './keyboardLayoutGuide'
import { watchRevealPan } from './revealPan'
import {
  createSheetKeyboardBody,
  focusedControlIn,
  getObstructionTop,
  isVisualViewportRecovered,
  mayKeepKeyboard,
  overlapOf,
} from './sheetKeyboardBody'
import { createSheetKeyboardHolds } from './sheetKeyboardHold'

export interface SheetKeyboardOptions {
  /** The gap kept between the focused field and the keyboard, CSS px. */
  offset: number
  /** Whether the sheet is at its full height, where it reveals fields. */
  isExpanded: () => boolean
  /** Whether the sheet is open. Focus that leaves for nothing parks on it. */
  isOpen: () => boolean
  /** Whether the page's own scroll is locked under the sheet. */
  isPageScrollLocked: boolean
  /** Whether the primary pointer is coarse (the touch query). */
  isTouch: boolean
  layout: SheetKeyboardLayout
  /** Reports the inset laid out, CSS px. */
  onInset: (inset: number) => void
}

// Windows whose browser revealed a focused field itself right after the
// keyboard's report, by panning the visual viewport to it. Firefox for
// Android does so 54 to 143 ms after the report while the field is under the
// keyboard. The module learns this from the behavior, never from the user
// agent.
// From then on, a sheet there reveals its field at once, in the report's own
// frame.
const reveals = sharedState(
  'keyboard/use-mobile-keyboard/reveals-at-report',
  1,
  () => ({
    atReport: new WeakSet<Window>(),
  }),
)

/** Forgets every window's recorded reveal, for tests. */
export function __resetRevealsAtReportForTest(): void {
  reveals.atReport = new WeakSet<Window>()
}

/**
 * Keeps a focused field in `sheet`'s `body` above the on-screen keyboard.
 * Returns the release.
 */
export function attachSheetKeyboard(
  sheet: HTMLElement,
  body: HTMLElement,
  {
    offset,
    isExpanded,
    isOpen,
    isPageScrollLocked,
    isTouch,
    layout,
    onInset,
  }: SheetKeyboardOptions,
): () => void {
  // A field inside the sheet moves nothing itself.
  const unregister = registerKeyboardTarget(sheet)

  // Where the keyboard layout guide publishes the keyboard's own slide, as
  // Gboard's in Chrome on Android, the sheet's content rides it. This needs
  // a coarse primary pointer and Chrome's schedule. Under a fine pointer
  // nothing of the ride attaches. In a browser without the VirtualKeyboard
  // API, such as iOS Safari or Firefox for Android, the guide never starts.
  // There the inset follows the reports. The sheet subscribes to the guide
  // before the keyboard module below, so the guide publishes a report's
  // transition before the reveal reads it.
  const guide
    = isTouch && keyboardProfileOf(window) === 'chromium'
      ? getKeyboardLayoutGuide(window)
      : null
  // The sheet takes focus moves over where this window measures the
  // keyboard, never by user agent, and only under a coarse primary pointer.
  // Under a fine one, it registers no touch-only listener.
  // Desktop Safari and Firefox measure too, but show no on-screen keyboard
  // and keep the browser's own focus. The attachment runs again when the
  // pointer changes, so a tablet that docks a mouse drops the claim.
  const ownsFocusTransitions = isTouch && isKeyboardMeasurable(window)
  const keyboard = createSheetKeyboardBody({
    body,
    offset,
    isExpanded,
    layout,
    guide,
    ownsFocusTransitions,
    onInset,
  })
  const holds = createSheetKeyboardHolds({
    body,
    keyboard,
    layout,
    guide,
    reveal: () => revealFocusedControl(),
  })

  // Take every focus move into a field over before the browser performs it
  // (refuseFocusReveal). That handler does not reveal the field. Focusing
  // it raises focusin, and the viewport report that follows the keyboard
  // raises another. Both schedule the reveal below, which knows the safe
  // area and scrolls only the sheet's own body.
  //
  // The keyboard's Done button parks focus on the body. The handler parks
  // focus that leaves for nothing on the sheet instead. Then a second tap on
  // the same field is still a move the handler sees. Left on the body, the
  // field is already `document.activeElement` on the next tap. Then no blur
  // fires, and the browser reveals the field its own way. This applies only
  // while the sheet is open. Closing blurs the field too, and no next tap
  // needs a claim. The host restores focus to whatever opened the sheet.
  const claimFocusTransitions = (): (() => void) =>
    refuseFocusReveal(document, {
      isActive: isExpanded,
      claim: destination => findTextEntryControl(destination, body),
      park: (origin) => {
        if (isOpen() && findTextEntryControl(origin, body)) {
          sheet.focus({ preventScroll: true })
        }
      },
    })

  function revealFocusedControl(atReport = false): void {
    // Through a hide the sheet rides, its layout holds until the end.
    if (holds.blocksReveal()) {
      return
    }
    const obstructionTop = getObstructionTop()
    const focusedControl = focusedControlIn(body)
    // The keyboard can close while its field keeps focus, as a downward
    // dismissal does on iOS. The full clear puts back the inset and the
    // body's scroll. The sheet then reveals the field still focused in the
    // restored body, because it may not be the field that opened the
    // keyboard.
    if (layout.hasLayout && isVisualViewportRecovered()) {
      const settle = holds.keepDrawnPlace()
      keyboard.clearKeyboardLayout()
      if (isExpanded() && focusedControl != null) {
        keyboard.scrollControlIntoSafeArea(focusedControl, false)
      }
      settle()
      return
    }
    if (!isExpanded() || focusedControl == null) {
      if (layout.retainLayout && keyboard.keyboardGeometry) {
        const settle = holds.keepDrawnPlace()
        keyboard.applyKeyboardGeometry(keyboard.keyboardGeometry)
        settle()
        // Focus left for a control that brings up no keyboard, inside an
        // open shadow root too, so the keyboard goes down now. A select's
        // picker takes the keyboard's place instead. A frame or a custom
        // element can hold a field the page cannot see, which keeps it up.
        if (isExpanded() && layout.hasLayout && !mayKeepKeyboard()) {
          holds.holdThroughUnguidedHide()
        }
        return
      }
      keyboard.clearKeyboardLayout()
      return
    }

    // An iOS keyboard dismissed by a drag can leave its accessory bar, so
    // the visual viewport grows short of full height. The body goes back
    // to its scroll from before the keyboard as soon as that starts. The
    // reveal below still clears what covers a low field. The new top is
    // kept, so a later content change does not repeat this.
    if (
      layout.hasLayout
      && keyboard.keyboardObstructionTop != null
      && obstructionTop > keyboard.keyboardObstructionTop + 0.5
      && keyboard.bodyScrollTopAtKeyboard != null
    ) {
      keyboard.smoothTarget = null
      body.scrollTop = keyboard.bodyScrollTopAtKeyboard
      keyboard.keyboardObstructionTop = obstructionTop
    }

    layout.retainLayout = false

    const measuredBodyRect = body.getBoundingClientRect()
    const overlap = overlapOf(measuredBodyRect.bottom, obstructionTop)
    // The extra clearance leaves space for mobile suggestion UI, but only
    // while the visual viewport actually overlaps the sheet. With no
    // obstruction, ordinary desktop and hardware-keyboard focus must not
    // shift an already visible control.
    const clearance = overlap > 0 ? offset : 0
    keyboard.keyboardGeometry
      = overlap > 0 ? { bodyBottom: measuredBodyRect.bottom } : null
    // Where the document sits with the keyboard up and nothing yet shifted:
    // the position handleDocumentScroll returns to. Captured on the
    // transition only: a reveal that runs after the browser has already
    // scrolled would otherwise record the shifted position as correct.
    if (overlap > 0 && !layout.hasLayout) {
      keyboard.keyboardObstructionTop = obstructionTop
      keyboard.bodyScrollTopAtKeyboard = body.scrollTop
      if (isPageScrollLocked) {
        keyboard.documentScrollAtKeyboard = {
          x: window.scrollX,
          y: window.scrollY,
        }
      }
    }
    layout.hasLayout = overlap > 0

    keyboard.writeInset(
      overlap > 0
        ? Math.max(0, measuredBodyRect.bottom - (obstructionTop - clearance))
        : 0,
    )

    keyboard.scrollControlIntoSafeArea(
      focusedControl,
      overlap > 0 && !reveals.atReport.has(window),
      overlap > 0 ? keyboard.showOnSlide(atReport) : null,
    )
  }

  const unsubscribeGuide = holds.followGuide()

  let animationFrame = 0
  const scheduleReveal = (): void => {
    cancelAnimationFrame(animationFrame)
    animationFrame = requestAnimationFrame(() => revealFocusedControl())
  }

  // Resuming the app re-reveals the focused field with no focus event to
  // claim. The reveal above never runs, and the document scrolls with the
  // fixed sheet. Put that scroll back on the event that reports it, and
  // reveal again inside the sheet.
  //
  // This applies only while the page is locked. Only then can a document
  // scroll not be the user's own. Behind a non-modal sheet the page stays
  // scrollable, and a revert there would fight the user.
  const handleDocumentScroll = (): void => {
    const expected = keyboard.documentScrollAtKeyboard
    if (
      expected == null
      || (window.scrollX === expected.x && window.scrollY === expected.y)
    ) {
      return
    }
    window.scrollTo(expected.x, expected.y)
    const focused = focusedControlIn(body)
    if (focused != null) {
      keyboard.scrollControlIntoSafeArea(focused, false)
    }
  }

  let stopObserving: (() => void)[] = []
  const refreshObservedLayout = (): void => {
    if (typeof ResizeObserver === 'undefined') {
      return
    }
    for (const stop of stopObserving) {
      stop()
    }
    stopObserving = []

    // Body and sheet box changes include the height props and the caller's
    // styles. The inset pseudo-element is the content box's last box. Where
    // the content grows with it, the observation runs the reveal again. The
    // reveal computes the same inset from the body's unchanged box, so
    // nothing feeds back into the sheet's geometry.
    const targets = new Set<Element>([body, sheet])
    for (const child of body.children) {
      targets.add(child)
    }
    const activeElement = document.activeElement
    if (activeElement instanceof HTMLElement && body.contains(activeElement)) {
      for (
        let element: HTMLElement | null = activeElement;
        element && element !== body;
        element = element.parentElement
      ) {
        targets.add(element)
      }
    }
    for (const target of targets) {
      stopObserving.push(observeResize(target, scheduleReveal))
    }
  }
  const mutationObserver
    = typeof MutationObserver === 'undefined'
      ? null
      : new MutationObserver((records) => {
        // Skip the sheet's own attribute writes on the body. Consumer DOM,
        // text, class, style, or visibility changes can all move the
        // focused control without a viewport event. The inset's write on
        // the content box schedules one more reveal, which finds the same
        // inset and settles.
          if (
            records.every(
              record => record.type === 'attributes' && record.target === body,
            )
          ) {
            return
          }
          refreshObservedLayout()
          scheduleReveal()
        })
  const handleFocusIn = (): void => {
    refreshObservedLayout()
    scheduleReveal()
  }
  const handleFocusOut = (): void => {
    // Keep the added scroll range while the keyboard animates away. A focus
    // transition to another text-entry control cancels this in focusin.
    layout.retainLayout = layout.hasLayout
    scheduleReveal()
  }
  const handleSheetTransitionEnd = (event: TransitionEvent): void => {
    if (event.target === sheet && event.propertyName === 'transform') {
      scheduleReveal()
    }
  }

  const stopClaiming = ownsFocusTransitions ? claimFocusTransitions() : null
  // The sheet reveals a keyboard report in its own frame, not the next. A
  // browser that reveals a focused field itself pans the visual viewport to
  // it a few frames after the report. It does so if the keyboard still
  // covers the field. Such a pan moves the visual viewport down within the
  // layout viewport, with no touch, document scroll or zoom since the
  // report. Once the sheet lands the field itself, it puts the pan back: it
  // scrolls the full-viewport dialog's top into view. On every later report,
  // the field lands at once.
  let lastHeight = getKeyboardHeight(window)
  // Under a coarse primary pointer only: the watch reads touches, and an
  // on-screen keyboard's pan comes with a touch screen.
  const revealPan = isTouch
    ? watchRevealPan(window, {
        owns: focused => layout.hasLayout && body.contains(focused),
        // The reader's own scroll may stop a smooth reveal short: forget
        // where it was going.
        onTouch: () => {
          keyboard.smoothTarget = null
        },
      })
    : null
  // Every keyboard report reaches the reveal through the keyboard module's
  // one set of listeners.
  const unsubscribe = subscribeKeyboardHeight(window, (event) => {
    if (event.type !== 'viewport') {
      return
    }
    if (event.height !== lastHeight) {
      lastHeight = event.height
      revealPan?.report()
      cancelAnimationFrame(animationFrame)
      revealFocusedControl(true)
      return
    }
    if (revealPan?.isRevealPan(event.height) === true) {
      reveals.atReport.add(window)
      cancelAnimationFrame(animationFrame)
      // A smooth reveal still under way lands the field where it is going.
      // Another scroll on top of it would overshoot in Firefox, which keeps
      // adding a smooth scrollBy's distance after an instant scroll. The
      // field ended 244 px too high there. With none under way, the field
      // lands at once.
      const distanceLeft = keyboard.smoothDistanceLeft()
      if (distanceLeft === 0) {
        revealFocusedControl()
      }
      // The sheet puts the pan back only if it holds the field above the
      // keyboard with its own scroller. Rects are in layout-viewport
      // coordinates, which the pan does not move. A ride still draws the
      // field lower than its layout, so its offset does not count. A field
      // the sheet cannot bring up keeps the browser's reveal.
      const activeElement = document.activeElement
      const dialog = sheet.closest('dialog')
      if (
        dialog != null
        && activeElement instanceof HTMLElement
        && activeElement.getBoundingClientRect().bottom
        - keyboard.rideOffset()
        - distanceLeft
        <= getObstructionTop()
      ) {
        // The full-viewport dialog is fixed at the layout viewport's top.
        revealPan?.putBack(dialog)
      }
      return
    }
    scheduleReveal()
  })
  body.addEventListener('focusin', handleFocusIn)
  body.addEventListener('focusout', handleFocusOut)
  sheet.addEventListener('transitionend', handleSheetTransitionEnd)
  // The window's capture phase hears every element's scroll too, and only
  // the page's own scroll moves the document.
  const stopDocumentScroll = subscribeInput(window, 'scroll', (event) => {
    const target = event.target
    if (!isNode(target) || isDocument(target)) {
      handleDocumentScroll()
    }
  })
  mutationObserver?.observe(body, {
    attributes: true,
    characterData: true,
    childList: true,
    subtree: true,
  })
  refreshObservedLayout()
  // The dialog enters the top layer after this attachment. Wait until the
  // next frame so flex geometry is final before measuring the body.
  scheduleReveal()

  return () => {
    unregister()
    cancelAnimationFrame(animationFrame)
    stopClaiming?.()
    unsubscribe()
    unsubscribeGuide()
    holds.stop()
    revealPan?.stop()
    body.removeEventListener('focusin', handleFocusIn)
    body.removeEventListener('focusout', handleFocusOut)
    sheet.removeEventListener('transitionend', handleSheetTransitionEnd)
    stopDocumentScroll()
    for (const stop of stopObserving) {
      stop()
    }
    mutationObserver?.disconnect()
    keyboard.writeInset(0)
    layout.hasLayout = false
    layout.retainLayout = false
  }
}
