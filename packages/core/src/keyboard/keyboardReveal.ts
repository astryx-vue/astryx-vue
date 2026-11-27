/**
 * @file keyboardReveal.ts
 * @input The keyboard module's reports, the reveal-pan watch, the input
 *   stream's touches and the scroll back's records
 * @output The reveal: a scroller brings the focused field into the band above
 *   the keyboard (revealWithKeyboard), the pan watch (watchPans) and the tap's
 *   delivery (deliverTap)
 * @position Keyboard module, internal to core. keyboardTarget.ts and
 *   keyboardRide.ts call it.
 */

import { reducedMotionFade } from '../motion/reducedMotion'
import { getTouches } from '../utils/inputStream'
import { layoutViewportHeight } from '../utils/layoutViewport'
import { isIosWebKit } from '../utils/touchQueries'
import {
  getKeyboardHeight,
  isFingerOnScreen,
  KEYBOARD_EPSILON,
  subscribeKeyboardHeight,
} from './keyboardHeight'
import {
  keyboardScrollTarget,
  noteKeyboardScroll,
  scrollTopOf,
  stopKeyboardScrollBack,
} from './keyboardScrollBack'
import { distanceIntoBand } from './revealBand'
import { panVisualViewportTo, watchRevealPan } from './revealPan'
import { focusAtPoint } from './tapFocus'

export function scrollBy(
  scroller: Element,
  distance: number,
  win: Window,
  behavior: ScrollBehavior = 'instant',
): void {
  // An explicit 'instant' also overrides a scroller's own smooth
  // `scroll-behavior`.
  const doc = scroller.ownerDocument
  if (scroller === (doc.scrollingElement ?? doc.documentElement)) {
    win.scrollBy({ top: distance, behavior })
  }
  else if (typeof scroller.scrollBy === 'function') {
    scroller.scrollBy({ top: distance, behavior })
  }
  else {
    scroller.scrollTop += distance
  }
}

function scrollRangeOf(scroller: Element, win: Window): number {
  const doc = scroller.ownerDocument
  const view
    = scroller === (doc.scrollingElement ?? doc.documentElement)
      ? layoutViewportHeight(win)
      : scroller.clientHeight
  return Math.max(0, scroller.scrollHeight - view)
}

// Whether a reveal for a keyboard rises on the browser's smooth scroll. On
// iOS, the browser runs no reveal after Core takes the focus. Its first report
// comes as the keyboard starts to slide, so the field rises beside it. Chrome
// on Android checks the field in the resize's own commit, where a smooth
// scroll would leave it covered. There, and under Reduce Motion, the field
// moves at once.
function risesSmoothly(field: Element): boolean {
  return (
    isIosWebKit(field.ownerDocument.defaultView)
    && reducedMotionFade(field) == null
  )
}

// The band a field must be in. It is inside its scroller's box and the
// viewport, and `offset` above the keyboard while one shows. A move not yet
// written shifts the scroller by `shift`.
export function bandOf(
  scroller: Element,
  height: number,
  offset: number,
  win: Window,
  shift = 0,
): { top: number, bottom: number } {
  const doc = scroller.ownerDocument
  const keyboardTop = layoutViewportHeight(win) - height
  let top = 0
  let bottom = height > KEYBOARD_EPSILON ? keyboardTop - offset : keyboardTop
  if (scroller !== (doc.scrollingElement ?? doc.documentElement)) {
    const box = scroller.getBoundingClientRect()
    top = Math.max(top, box.top + shift)
    bottom = Math.min(bottom, box.bottom + shift)
  }
  return { top, bottom }
}

// How far `field` sits outside its band (see bandOf). A move not yet written
// shifts the field and its scroller by `shift`.
export function revealDistance(
  field: Element,
  scroller: Element,
  height: number,
  offset: number,
  win: Window,
  shift = 0,
): number {
  const band = bandOf(scroller, height, offset, win, shift)
  const box = field.getBoundingClientRect()
  return distanceIntoBand(
    box.top + shift,
    box.bottom + shift,
    band.top,
    band.bottom,
  )
}

// Whether `field` lies wholly in its band. A band too short for the field
// holds none of it, as when a scroll area sits under the keyboard. A scroll of
// `scroller` not yet drawn moves the field by `fieldShift`.
function sitsInBand(
  field: Element,
  scroller: Element,
  height: number,
  offset: number,
  win: Window,
  fieldShift = 0,
): boolean {
  const band = bandOf(scroller, height, offset, win)
  const box = field.getBoundingClientRect()
  return (
    box.top + fieldShift >= band.top - KEYBOARD_EPSILON
    && box.bottom + fieldShift <= band.bottom + KEYBOARD_EPSILON
  )
}

// Scrolls `field` into its band with its nearest scroller, the document
// included. Nothing else moves: a scroller that cannot scroll far enough
// leaves the rest of the field covered. A scroll for a keyboard goes back
// when the keyboard goes. Only a scroll that places the field rises (see
// risesSmoothly), unless `canRise` is false. Returns the part of the scroll
// not yet drawn.
function reveal(
  field: Element,
  scroller: Element,
  height: number,
  offset: number,
  win: Window,
  canRise = true,
): number {
  const distance = revealDistance(field, scroller, height, offset, win)
  if (Math.abs(distance) <= KEYBOARD_EPSILON) {
    return 0
  }
  const now = scrollTopOf(scroller, win)
  const target = Math.min(
    Math.max(now + distance, 0),
    scrollRangeOf(scroller, win),
  )
  const rises
    = canRise
      && height > KEYBOARD_EPSILON
      && Math.abs(target - now - distance) <= KEYBOARD_EPSILON
      && sitsInBand(field, scroller, height, offset, win, -distance)
      && risesSmoothly(field)
  // A rise still on its way extends Core's own scroll.
  const before = keyboardScrollTarget(scroller, win) ?? now
  scrollBy(scroller, distance, win, rises ? 'smooth' : 'instant')
  if (height > KEYBOARD_EPSILON) {
    noteKeyboardScroll(scroller, before, win, rises ? target : undefined)
  }
  return rises ? target - scrollTopOf(scroller, win) : 0
}

// Focuses the tapped field without the browser's reveal, then raises the
// tap's click. The claimed tap's cancelled `touchend` raises none, and a
// caller's `onClick` still runs once. The click is synthetic: its `isTrusted`
// is false. Like a real tap's click in Chrome and Safari, it is a touch
// `PointerEvent`, or a `MouseEvent` where no `PointerEvent` exists.
export function deliverTap(
  control: HTMLElement,
  x: number,
  y: number,
  touch: { screenX: number, screenY: number, identifier: number },
): void {
  focusAtPoint(control, x, y)
  // The field's own window's constructors, as a click in a frame has.
  const view = control.ownerDocument.defaultView
  const init: MouseEventInit = {
    bubbles: true,
    cancelable: true,
    composed: true,
    detail: 1,
    clientX: x,
    clientY: y,
    screenX: touch.screenX,
    screenY: touch.screenY,
  }
  const PointerClick = view?.PointerEvent
  const click
    = typeof PointerClick === 'function'
      ? new PointerClick('click', {
          ...init,
          pointerType: 'touch',
          isPrimary: true,
          pointerId: touch.identifier,
        })
      : new (view?.MouseEvent ?? MouseEvent)('click', init)
  control.dispatchEvent(click)
}

/**
 * Puts back a pan the browser makes on its own after a keyboard report. This
 * happens, for example, after a focus no claim saw: a script's `focus()` while
 * nothing has focus. The field sits in place already, so the pan only displaces
 * the page. A pan made at the last height goes back at the next height's
 * report. The caller's own pan is the new rest once reported (`expectPan`):
 * its report comes after the call returns.
 * Feed `report` each keyboard height the module reports; `owns` says whether a
 * focused element is one this watch keeps in place. `documentScrollIsReveal`
 * is watchRevealPan's option of that name.
 */
export function watchPans(
  win: Window,
  owns: (focused: Element) => boolean,
  documentScrollIsReveal = false,
): {
  report: (height: number) => void
  expectPan: (top: number) => void
  stop: () => void
} {
  const watch = watchRevealPan(win, { owns, documentScrollIsReveal })
  let lastHeight = getKeyboardHeight(win)
  let ownPanTop: number | null = null
  return {
    report(height: number): void {
      const top = win.visualViewport?.offsetTop ?? 0
      if (height !== lastHeight) {
        if (
          ownPanTop == null
          && lastHeight > KEYBOARD_EPSILON
          && watch.isRevealPan(height)
        ) {
          watch.putBack()
        }
        lastHeight = height
        watch.report()
      }
      else if (
        ownPanTop != null
        && Math.abs(top - ownPanTop) <= KEYBOARD_EPSILON
      ) {
        ownPanTop = null
        watch.report()
      }
      else if (watch.isRevealPan(height)) {
        watch.putBack()
      }
    },
    expectPan(top: number): void {
      ownPanTop = top
    },
    stop: () => watch.stop(),
  }
}

type PanWatch = ReturnType<typeof watchPans>

// Pans the visual viewport until `field` sits `offset` above the keyboard,
// within the keyboard's room and never past the field's top. Returns whether
// the field is clear. In Safari a document scroll reaches that room first.
function panIntoView(
  field: Element,
  offset: number,
  win: Window,
  pans: PanWatch,
): boolean {
  const viewport = win.visualViewport
  if (viewport == null) {
    return false
  }
  const box = field.getBoundingClientRect()
  const need = box.bottom + offset - (viewport.offsetTop + viewport.height)
  if (need <= KEYBOARD_EPSILON) {
    return true
  }
  const room = layoutViewportHeight(win) - viewport.offsetTop - viewport.height
  const pan = Math.min(need, room, box.top - viewport.offsetTop)
  if (pan <= KEYBOARD_EPSILON) {
    return false
  }
  const top = viewport.offsetTop + pan
  pans.expectPan(top)
  panVisualViewportTo(win, top)
  return pan >= need - KEYBOARD_EPSILON
}

// Who reveals a field its scroller cannot place. 'document': the document,
// then a pan. 'fixed': the same, with a scroll that moves nothing undone.
// 'keep': nobody, since the scroller holds every field it reveals.
export type UnplacedField = 'document' | 'fixed' | 'keep'

// Reveals the focused field `field()` returns through `scroller` when the
// keyboard's height changes, now, and when focus moves into `region` with the
// keyboard already up. Returns the call that stops it.
export function revealWithKeyboard(
  region: Element,
  field: () => Element | null,
  scroller: Element,
  offset: number,
  win: Window,
  unplaced: UnplacedField = 'keep',
): () => void {
  // Unless `unplaced` is 'keep', a field its scroller leaves covered is
  // revealed by the document, then by a pan where the document cannot reach.
  const doc = scroller.ownerDocument
  const root = doc.scrollingElement ?? doc.documentElement
  let isPlaced = true
  // A long press focuses with the finger still down. The show's first reveal
  // runs all the same.
  let hasRevealed = false
  // The input stream's touch-start count at the last reveal. The press that
  // focused the field started before it, so it holds no report. Gboard can
  // report a 48 px keyboard first, then its full height, while that press is
  // still down.
  let startsAtReveal = 0
  const pans = watchPans(win, focused => focused === field() && isPlaced)
  const revealNow = (height: number): void => {
    const focused = field()
    if (focused == null) {
      return
    }
    hasRevealed = height > KEYBOARD_EPSILON
    startsAtReveal = getTouches(win).starts
    const rising = reveal(focused, scroller, height, offset, win)
    if (unplaced === 'keep') {
      return
    }
    isPlaced
      = rising !== 0 || sitsInBand(focused, scroller, height, offset, win)
    if (isPlaced || height <= KEYBOARD_EPSILON) {
      return
    }
    if (unplaced === 'document') {
      if (
        scroller !== root
        && reveal(focused, root, height, offset, win) !== 0
      ) {
        isPlaced = true
        return
      }
    }
    else {
      // Safari runs no reveal after Core takes the focus. Its document scroll
      // moves a fixed container too, as a visual-viewport offset while its
      // keyboard shows. Where the scroll moves nothing, Core scrolls back.
      const top = focused.getBoundingClientRect().top
      const scrollY = win.scrollY
      reveal(focused, root, height, offset, win, false)
      if (
        Math.abs(focused.getBoundingClientRect().top - top) <= KEYBOARD_EPSILON
      ) {
        const scrolled = win.scrollY - scrollY
        if (scrolled !== 0) {
          const before = win.scrollY
          win.scrollBy({ top: -scrolled, behavior: 'instant' })
          noteKeyboardScroll(root, before, win)
        }
      }
    }
    // Chrome scrolls the document only within its range. The pan takes the
    // rest at once, so Chrome's own pan finds the field clear.
    isPlaced = panIntoView(focused, offset, win, pans)
  }
  // A report within a pixel of the last height is a pan, a scroll or a
  // zoom's rounding, so the field stays. After the show's first reveal, a
  // report during a press that began after that reveal moves nothing, as
  // when Firefox's toolbar hides in a drag.
  let lastHeight = getKeyboardHeight(win)
  const isLaterPressDown = (): boolean =>
    isFingerOnScreen(win) && getTouches(win).starts !== startsAtReveal
  const stopReports = subscribeKeyboardHeight(win, (event) => {
    if (event.type === 'viewport') {
      if (Math.abs(event.height - lastHeight) > KEYBOARD_EPSILON) {
        lastHeight = event.height
        if (!hasRevealed || !isLaterPressDown()) {
          revealNow(event.height)
        }
      }
      pans.report(event.height)
    }
  })
  const onFocusIn = (): void => {
    stopKeyboardScrollBack(win)
    revealNow(getKeyboardHeight(win))
  }
  region.addEventListener('focusin', onFocusIn)
  revealNow(getKeyboardHeight(win))
  return () => {
    stopReports()
    pans.stop()
    region.removeEventListener('focusin', onFocusIn)
  }
}
