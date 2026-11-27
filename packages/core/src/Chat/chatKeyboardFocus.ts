/**
 * @file chatKeyboardFocus.ts
 * @input The keyboard module's text-entry test and touch gate, the temporary
 *   focus helper
 * @output editableToClaim (the composer text a tap claims), parkFocus (Done's
 *   park on the composer region) and focusInKeyboardSurface (a composer's
 *   focus inside ChatLayout's composer region)
 * @position Internal to Chat: useChatKeyboard, ChatComposer and
 *   ChatComposerInput read it
 */

import type { InteractionModality } from '../composables/internal/interactionModality.js'
import { focusForLastInputTemporarily } from '../composables/internal/focusReturn.js'
import { followsKeyboard } from '../keyboard/keyboardGeometry.js'
import { isTextEntryControl } from '../keyboard/keyboardHeight.js'

/** Marks ChatLayout's composer region, the keyboard surface. */
export const KEYBOARD_SURFACE_ATTRIBUTE = 'data-astryx-keyboard-surface'

// Controls inside the composer's text (a token's button or link, an island
// that is not editable) keep their own taps, as ChatComposer's click-to-focus
// leaves them.
const OWN_TAPS
  = '[contenteditable="false"], button, a, [role="button"], [data-astryx-token]'

/**
 * The composer's text a touch landed in, when that tap would bring up the
 * keyboard and the text has no focus yet. It is contenteditable text, or a
 * text control passed as the composer's input. The browser would reveal
 * either by scrolling the page.
 */
export function editableToClaim(target: unknown): HTMLElement | null {
  let node = target as Node | null
  if (node != null && node.nodeType !== 1) {
    node = node.parentNode
  }
  const element = node as Element | null
  if (element == null || typeof element.closest !== 'function') {
    return null
  }
  const editable = isTextEntryControl(element)
    ? element
    : element.closest<HTMLElement>(
        '[contenteditable]:not([contenteditable="false"])',
      )
  if (editable == null || !isTextEntryControl(editable)) {
    return null
  }
  const own = element.closest(OWN_TAPS)
  if (own != null && editable.contains(own)) {
    return null
  }
  const active = editable.ownerDocument.activeElement
  return active === editable || editable.contains(active) ? null : editable
}

/**
 * Done's park: focus rests on the composer region. It is focusable for the
 * park alone, so a click or a tap beside the composer never focuses it. The
 * region gives the focus stop up as soon as focus leaves it. It shows the
 * focus ring only after keyboard input, as other script focus does.
 */
export function parkFocus(region: HTMLElement, modality: InteractionModality): void {
  // WebKit ignores `focusVisible: false`, so a park after touch input also
  // hides the ring inline until focus leaves.
  if (modality !== 'keyboard') {
    region.style.setProperty('outline', 'none')
    region.addEventListener(
      'blur',
      () => region.style.removeProperty('outline'),
      { once: true },
    )
  }
  focusForLastInputTemporarily(region, { preventScroll: true }, modality)
}

/**
 * Focuses `element` the way its surface wants. Inside ChatLayout's composer
 * region, under a finger in a top-level page, focus skips the browser's
 * reveal, which on iOS scrolls the whole page. Elsewhere the browser's own
 * focus applies.
 */
export function focusInKeyboardSurface(element: HTMLElement): void {
  const isKeyboardSurface = element.closest(`[${KEYBOARD_SURFACE_ATTRIBUTE}]`) != null
  if (isKeyboardSurface && followsKeyboard(element.ownerDocument.defaultView)) {
    element.focus({ preventScroll: true })
  }
  else {
    element.focus()
  }
}
