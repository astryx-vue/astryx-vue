/**
 * @file revealPan.ts
 * @input The visual viewport, the document's scroll and the input stream's
 *   touches
 * @output watchRevealPan, which notices the browser's own reveal pan and puts
 *   it back, and panVisualViewportTo, the one way Core pans the visual
 *   viewport
 * @position Keyboard module, internal to core. Every watch in a document
 *   shares one touch subscription.
 */

import { subscribeInput } from '../utils/inputStream'
import { layoutViewportHeight } from '../utils/layoutViewport'
import { sharedWeakMap } from '../utils/sharedRealm'
import { isFingerOnScreen, isTextEntryControl } from './keyboardHeight'

/** The caller's rules for watchRevealPan. */
export interface WatchRevealPanOptions {
  /** Whether the focused field is the caller's to keep in view. */
  owns: (focused: HTMLElement) => boolean
  /** Called on every touch start, which ends the watch for the report. */
  onTouch?: () => void
  /**
   * Whether a document scroll can be part of the browser's reveal, which
   * `putBack` then scrolls back too. Set it for a fixed field in Chrome on
   * Android. Its reveal centres the field's document position, then pans as far
   * as the keyboard's room allows. Only a match counts. Keep it false where
   * Safari runs: it carries out an app's document scroll as an offset.
   */
  documentScrollIsReveal?: boolean
}

/** A watch for the browser's own reveal pan (see watchRevealPan). */
export interface RevealPanWatch {
  /** A report changed the keyboard's height: remember where everything sat. */
  report: () => void
  /** Whether the visual viewport has since moved down as a reveal pan. */
  isRevealPan: (height: number) => boolean
  /**
   * Pans the visual viewport back to where it sat at the report, without
   * scrolling the document. It scrolls `anchor` into view, an element fixed at
   * the layout viewport's top, or else a probe fixed where the viewport sat.
   * With `documentScrollIsReveal`, it first scrolls the document back too.
   */
  putBack: (anchor?: Element | null) => void
  /** Ends the watch; the shared touch subscription goes with the last watch. */
  stop: () => void
}

// One shared touch subscription per document serves every reveal-pan watch
// in it, so no instance adds a listener. The first watch adds it, and the
// last removes it.
const touchStartWatches = sharedWeakMap<
  Document,
  { stop: () => void, watches: Set<() => void> }
>('keyboard/keyboard-height/touch-start-watches', 1)

function watchTouchStarts(doc: Document, onTouchStart: () => void): () => void {
  let shared = touchStartWatches.get(doc)
  if (shared == null) {
    const view = doc.defaultView
    if (view == null) {
      return () => {}
    }
    const watches = new Set<() => void>()
    const stopStarts = subscribeInput(view, 'touchstart', () => {
      for (const watch of [...watches]) {
        watch()
      }
    })
    // Heard so the stream counts the fingers on the screen (isFingerOnScreen).
    const stopEnds = subscribeInput(view, 'touchend', () => {})
    const stopCancels = subscribeInput(view, 'touchcancel', () => {})
    shared = {
      stop: () => {
        stopStarts()
        stopEnds()
        stopCancels()
      },
      watches,
    }
    touchStartWatches.set(doc, shared)
  }
  shared.watches.add(onTouchStart)
  return () => {
    const current = touchStartWatches.get(doc)
    if (current == null || !current.watches.delete(onTouchStart)) {
      return
    }
    if (current.watches.size === 0) {
      current.stop()
      touchStartWatches.delete(doc)
    }
  }
}

/**
 * Some browsers reveal a focused field themselves, after the keyboard's
 * report, by panning the visual viewport to it while the keyboard still
 * covers it. Firefox for Android pans 54 to 143 ms after the report. Chrome
 * on Android animates a pan of the keyboard's whole height from about 100 to
 * 170 ms after it. The page gets no frame until that pan ends. Such a pan
 * moves the visual viewport down within the
 * layout viewport. Since the report there is no touch, document scroll or
 * zoom, and a text field the caller owns has focus. In Chrome, a reveal of a
 * field in a fixed container also scrolls the document first. The watch reads
 * the behavior, never the user agent. The caller lands its field itself and
 * puts the pan back. Every keyboard-aware surface can use it.
 *
 * @example
 * ```
 * const watch = watchRevealPan(window, {owns: field => region.contains(field)});
 * // On a report that changes the height: watch.report();
 * // On any later report: if (watch.isRevealPan(height)) watch.putBack();
 * ```
 */
export function watchRevealPan(
  win: Window,
  { owns, onTouch, documentScrollIsReveal = false }: WatchRevealPanOptions,
): RevealPanWatch {
  const doc = win.document
  let atReport: { x: number, y: number, top: number, scale: number } | null
    = null
  let touchedSinceReport = false
  // Whether a scroll is Chrome's reveal. It is decided once per report and
  // after each put-back, so later scrolls read no layout.
  let isChromeReveal: boolean | null = null
  const stopTouchStarts = watchTouchStarts(doc, () => {
    touchedSinceReport = true
    onTouch?.()
  })
  return {
    report: () => {
      const viewport = win.visualViewport
      atReport
        = viewport == null
          ? null
          : {
              x: win.scrollX,
              y: win.scrollY,
              top: viewport.offsetTop,
              scale: viewport.scale,
            }
      // A report while a finger is down, as when Firefox's toolbar hides in
      // a drag, leaves that drag's pan to the person.
      touchedSinceReport = isFingerOnScreen(win)
      isChromeReveal = null
    },
    isRevealPan: (height) => {
      const viewport = win.visualViewport
      const focused = doc.activeElement
      return (
        viewport != null
        && atReport != null
        && !touchedSinceReport
        && height > 0
        && viewport.offsetTop > atReport.top
        && viewport.scale === atReport.scale
        && focused instanceof HTMLElement
        && isTextEntryControl(focused)
        && owns(focused)
        && ((win.scrollX === atReport.x && win.scrollY === atReport.y)
          || (documentScrollIsReveal
            && (isChromeReveal ??= isCentringReveal(
              win,
              viewport,
              focused,
              atReport,
            ))))
      )
    },
    putBack: (anchor) => {
      isChromeReveal = null
      const options: ScrollIntoViewOptions = {
        block: 'start',
        inline: 'nearest',
        behavior: 'instant',
      }
      if (
        documentScrollIsReveal
        && atReport != null
        && (win.scrollX !== atReport.x || win.scrollY !== atReport.y)
      ) {
        win.scrollTo({
          left: atReport.x,
          top: atReport.y,
          behavior: 'instant',
        })
      }
      if (anchor != null) {
        anchor.scrollIntoView(options)
        return
      }
      panVisualViewportTo(win, atReport?.top ?? 0)
    },
    stop: stopTouchStarts,
  }
}

// How far a scroll or a pan may sit from Chrome's reveal: rounding.
const CENTRING_SLACK_PX = 2

// Whether the scroll and the pan since the report match Chrome's reveal of a
// fixed `field` (documentScrollIsReveal), not an app's scroll elsewhere.
function isCentringReveal(
  win: Window,
  viewport: VisualViewport,
  field: HTMLElement,
  atReport: { x: number, y: number },
): boolean {
  const box = field.getBoundingClientRect()
  const centring = (box.top + box.bottom) / 2 - viewport.height / 2
  const root = win.document.scrollingElement ?? win.document.documentElement
  const range = root.scrollHeight - root.clientHeight
  const room = layoutViewportHeight(win) - viewport.height
  const scroll = Math.min(range, Math.max(0, atReport.y + centring))
  const pan = Math.min(room, Math.max(0, centring))
  return (
    win.scrollX === atReport.x
    && Math.abs(win.scrollY - scroll) <= CENTRING_SLACK_PX
    && Math.abs(viewport.offsetTop - pan) <= CENTRING_SLACK_PX
  )
}

/**
 * Pans the visual viewport so its top sits `top` CSS px down the layout
 * viewport, without scrolling the document. A probe fixed there is scrolled
 * into view. In Chrome for Android this pans the visual viewport. In Firefox
 * for Android it pans nothing where the page has no scroll range. The pan
 * reaches the room the keyboard takes, which a document scroll cannot.
 *
 * @example
 * ```
 * panVisualViewportTo(window, window.visualViewport.offsetTop + 120);
 * ```
 */
export function panVisualViewportTo(win: Window, top: number): void {
  const doc = win.document
  const probe = doc.createElement('div')
  probe.style.position = 'fixed'
  probe.style.left = '0'
  probe.style.top = `${top}px`
  probe.style.width = '1px'
  probe.style.height = '1px'
  probe.style.visibility = 'hidden'
  probe.style.pointerEvents = 'none';
  (doc.body ?? doc.documentElement).append(probe)
  probe.scrollIntoView({
    block: 'start',
    inline: 'nearest',
    behavior: 'instant',
  })
  probe.remove()
}
