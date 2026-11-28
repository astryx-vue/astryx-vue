/**
 * @file boxHold.ts
 * @input A finger's or a pen's contact that the shared press controller
 *   (composables/internal/pressFeedback.ts) follows, and the marked box it
 *   starts on. A long press that fires claims the contact (pressClaim.ts). A
 *   contextmenu that a handler cancels stops its stand-in click.
 * @output registerBoxHold, which installs the box hold into the controller
 * @position CheckboxInput and Radio call registerBoxHold and mark their boxes
 *   with pressBoxProps. Builds on selectionLock.ts, browserClickWait.ts and
 *   clickGuard.ts.
 *
 * iOS answers a finger held on a checkbox's or a radio's box with a text
 * selection and no click, so the hold toggled nothing. Here a held box
 * selects no text, and its lift activates the control as a tap does:
 * - For each finger or pen contact on a marked box, braking ones included,
 *   the box and the row it presses refuse a selection until the contact
 *   lifts. A lock on the box alone let iOS select a word beside it.
 * - A tap keeps its native click, focus and events. After a still long
 *   press the lift waits for the browser's own click, and the control clicks
 *   its input only when none comes (Chromium's long press sends none). Each
 *   box keeps its own wait.
 * - Travel, a scroll, a cancel or a second finger activates nothing, and
 *   neither does a lift whose touchend a handler cancelled, nor a hold whose
 *   contextmenu a handler cancelled to open a menu.
 * - A hold whose long press acted (a context menu's, a row's own) gets no
 *   click at all: the shared click guard cancels the touchend and eats any
 *   click.
 */

import { boxInput, pressBoxAt } from '../composables/internal/pressBox.js'
import { installBoxHold } from '../composables/internal/pressFeedback.js'
import { LONG_PRESS_DURATION_MS } from '../motion/uikit/longPress'
import { awaitBrowserClick, clickForLift } from './browserClickWait'
import { armClickGuard } from './clickGuard'
import { subscribeInput } from './inputStream'
import { watchPressClaims } from './pressClaim'
import { lockSelection } from './selectionLock'

/** The wait for the browser's click after a box's still lift, per box. */
const waits = new Map<HTMLElement, () => void>()

function now(): number {
  return typeof performance === 'undefined' ? Date.now() : performance.now()
}

/**
 * Starts the hold of a contact on a marked box in `surface`. The box and the
 * surface refuse a selection until the contact ends. Returns the call for the
 * contact's end, or null when the contact is not on a box.
 */
function holdBox(surface: HTMLElement, target: EventTarget | null): ((isStillLift: boolean) => void) | null {
  const box = pressBoxAt(target, surface)
  if (box == null)
    return null
  const release = lockSelection([surface, box], target)
  const startedAt = now()
  const view = box.ownerDocument.defaultView
  let isClaimed = false
  const stopWatching = watchPressClaims(() => {
    isClaimed = true
  })
  // Chromium sends a long press as a contextmenu, and no click follows. One
  // that a handler cancelled opened a menu, which is what the hold did.
  const menus: Event[] = []
  const stopMenus = view == null
    ? () => {}
    : subscribeInput(view, 'contextmenu', (event) => {
        menus.push(event)
      })
  const openedMenu = (): boolean => menus.some(event => event.defaultPrevented)
  return (isStillLift) => {
    release()
    stopWatching()
    if (isClaimed) {
      // The long press that acted is what the hold did. iOS clicks after a
      // long hold that selects nothing, so the guard cancels the lift's
      // touchend and eats any click.
      if (isStillLift)
        armClickGuard(box.ownerDocument, { cancelsTouchEnd: true })
      stopMenus()
      return
    }
    // A tap's activation stays the browser's own: only a long press may need
    // a stand-in for the click.
    if (!isStillLift || now() - startedAt < LONG_PRESS_DURATION_MS || openedMenu()) {
      stopMenus()
      return
    }
    waitForClick(box, openedMenu, stopMenus)
  }
}

/**
 * A still lift waits for the browser's own click, and the control clicks its
 * input only if none comes. Nothing clicks for a lift that another element
 * took (its handler cancelled the touchend), nor once a handler cancels the
 * hold's contextmenu.
 */
function waitForClick(box: HTMLElement, openedMenu: () => boolean, stopMenus: () => void): void {
  waits.get(box)?.()
  const view = box.ownerDocument.defaultView
  if (view == null) {
    stopMenus()
    return
  }
  // The lift's own touchend. A new press's touchend and contextmenu are not
  // this hold's.
  let lift: Event | null = null
  const stopLift = subscribeInput(view, 'touchend', (event) => {
    lift ??= event
  })
  const stopListening = [
    stopLift,
    subscribeInput(view, 'pointerdown', () => {
      stopLift()
      stopMenus()
    }),
    stopMenus,
  ]
  let stopWaiting: (() => void) | null = null
  const end = (): void => {
    for (const stop of stopListening)
      stop()
    stopWaiting?.()
    stopWaiting = null
    if (waits.get(box) === end)
      waits.delete(box)
  }
  waits.set(box, end)
  stopWaiting = awaitBrowserClick(box, {
    onClicked: () => {
      stopWaiting = null
      end()
    },
    onNoClick: () => {
      stopWaiting = null
      end()
      // Read once every handler has run.
      if ((lift as Event | null)?.defaultPrevented === true || openedMenu())
        return
      const input = boxInput(box)
      if (input != null && input.isConnected)
        clickForLift(input)
    },
  })
}

/** Ends every wait still running: the controller is going away. */
function endBoxWaits(): void {
  for (const end of [...waits.values()])
    end()
}

/**
 * Installs the box hold into the shared press controller. A box component
 * calls it as it sets up, so a page with no box carries none of it.
 */
export function registerBoxHold(): void {
  installBoxHold({ start: holdBox, endWaits: endBoxWaits })
}
