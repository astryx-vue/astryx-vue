/**
 * @file useFingerScroll.ts
 * @input A scroller (a template ref or getter naming an element, or the
 *   document for the page) and the document's gesture host
 * @output useFingerScroll: whether the scroller's scroll is a finger's, read
 *   now or at a past time, and an optional call when one ends
 * @position Gesture composable of packages/core/src/gestures, over the
 *   finger-scroll watch (fingerScroll.ts), kept on the scroller's node by
 *   the gesture composables' shared attachment (useAttachment.ts). An
 *   internal piece of the touch module with no public API, not exported
 *   from the package: a scroll-driven component (a tab bar that minimizes, a
 *   header that collapses, a picker that commits at rest) imports it from
 *   here, so it ships only where used
 *
 * A scroll is a finger's from a scroll event while a finger that landed
 * inside the scroller is down, until the scroller's `scrollend` (the lift
 * starts the momentum, which is still the finger's), or, where the browser
 * sends no `scrollend`, until a 150 ms fallback after the last scroll event.
 * A scroll with no finger down, or a recognizer's own scroll, is the
 * program's, even right after a tap. A component that reacts to the
 * person's scrolling only reads this instead of listening to touches itself.
 *
 * SYNC: When modified, update __tests__/useFingerScroll.test.ts.
 */

import type { MaybeRefOrGetter } from 'vue'
import { isDocument } from '../utils/nodeType'
import { isFingerScroll, watchFingerScrolls } from './fingerScroll'
import { getGestureHost } from './GestureHost'
import { useAttachment } from './useAttachment'

/** The document a scroller is in: itself, for the page's own scroll. */
function documentOf(node: Element | Document): Document {
  return isDocument(node) ? node : node.ownerDocument
}

export interface UseFingerScrollOptions {
  /**
   * Runs each time a finger's scroll on the scroller ends, once the reader
   * says `false`: at its `scrollend` after the lift (the momentum is still
   * the finger's), at the lift when the scroll ended under a resting finger,
   * after the quiet fallback where the browser fires no `scrollend`, or when
   * the primary pointer stops being coarse. The scope ending, or the
   * scroller changing, does not call it.
   */
  onEnd?: () => void
}

/**
 * Watch a scroller's finger scrolls. Pass a ref or getter naming a
 * scrolling element, or the document for the page's own scroll. Returns a
 * reader: `true` while the scroller's scroll is a finger's. Given a time on
 * the page's clock (`performance.now()`, as an IntersectionObserver entry's
 * `time` is), it reads whether the scroll at that time was a finger's.
 * Internal: not exported from the package.
 */
export function useFingerScroll(
  scroller: MaybeRefOrGetter<Element | Document | null | undefined>,
  { onEnd }: UseFingerScrollOptions = {},
): (at?: number) => boolean {
  /** The node the watch is on now, for the reader. */
  let watched: Element | Document | null = null
  useAttachment<Element | Document>(scroller, (node) => {
    watched = node
    const stop = watchFingerScrolls(getGestureHost(documentOf(node)), node, () => onEnd?.())
    return () => {
      stop()
      watched = null
    }
  })
  return (at?: number) => {
    const node = watched
    return node != null && isFingerScroll(getGestureHost(documentOf(node)), node, at)
  }
}
