/**
 * @file usePressTracker.ts
 * @input An element target and press tracker options
 * @output usePressTracker: a press tracker on the element, with UIControl
 *   semantics
 * @position Vue face of the press tracker (PressTracker.ts); a gesture-only
 *   component imports useGestureRecognizer.ts and never this
 *
 * SYNC: When modified, update __tests__/usePressTracker.test.ts.
 */

import type { MaybeRefOrGetter } from 'vue'
import type { PressTracker, PressTrackerOptions } from './PressTracker'
import { getCurrentScope, onScopeDispose, toValue, watch } from 'vue'
import { UIKIT_CONTROL } from '../motion/uikit/gestures'
import { getGestureHost } from './GestureHost'
import { isSyncingGestures, syncingGestures } from './gestureSync'
import { createPressTracker, vetoesSingleTap } from './PressTracker'
import { useAttachment } from './useAttachment'

/**
 * The tracker's options. Each is read when the tracker needs it, so a caller
 * may pass getters over its state; `keepsTouch` is read once, when the
 * tracker is created: it decides whether the host gives the element a
 * blocking touchmove.
 */
export type UsePressTrackerOptions = Omit<PressTrackerOptions, 'getBounds' | 'view' | 'trackingExpansion'> & {
  trackingExpansion?: MaybeRefOrGetter<number | undefined>
}

/**
 * Track presses on the element `target` names with UIControl semantics.
 * Releasing the element (the scope ends, or the target names another node)
 * ends any press without calling the callbacks.
 */
export function usePressTracker(
  target: MaybeRefOrGetter<Element | null | undefined>,
  options: UsePressTrackerOptions = {},
): PressTracker {
  const element = (): Element | null => toValue(target) ?? null
  // True while a release ends the press, so it reaches no caller callback.
  let isReleasing = false
  let isDisposed = false
  // Calls a caller callback: never during a release or after the scope
  // ends. While any gesture composable's isEnabled sync runs (turning off a
  // recognizer the press waits on resolves the press in that arena pass),
  // the call waits for a microtask after it, in order, so the press still
  // ends, un-highlighted, outside the sync.
  const deliver = (call: () => void): void => {
    if (isReleasing || isDisposed) {
      return
    }
    if (!isSyncingGestures()) {
      call()
      return
    }
    queueMicrotask(() => {
      if (!isDisposed) {
        call()
      }
    })
  }
  const isEnabled = (): boolean => options.isEnabled?.() ?? true
  // One tracker for the scope's life, reading its options as it goes: a
  // profile change never rebuilds it, so a press in progress survives it.
  const tracker = createPressTracker({
    getBounds: () => {
      const node = element()
      return node == null ? null : getGestureHost(node.ownerDocument).presentedRect(node)
    },
    get view() {
      return element()
    },
    onControlEvent: (event, touch) => deliver(() => options.onControlEvent?.(event, touch)),
    onHighlightChange: isHighlighted => deliver(() => options.onHighlightChange?.(isHighlighted)),
    trackingExpansion: toValue(options.trackingExpansion),
    get highlightDelay() {
      return options.highlightDelay
    },
    get cancelTravel() {
      return options.cancelTravel
    },
    get quickTapFlash() {
      return options.quickTapFlash
    },
    keepsTouch: options.keepsTouch,
    get selectionLock() {
      return options.selectionLock
    },
    // The caller's veto, read on every touch, else the tracker's own.
    vetoesAncestorRecognizer: recognizer => (options.vetoesAncestorRecognizer ?? vetoesSingleTap)(recognizer),
    isEnabled,
    holdsContextMenu: id => options.holdsContextMenu?.(id) === true,
    // The caller's brake, or the host's: a touch that stops a flick presses
    // nothing, as a UIKit control in a decelerating scroll view.
    isBraking: (touch) => {
      if (options.isBraking != null) {
        return options.isBraking(touch)
      }
      const node = element()
      return node != null && getGestureHost(node.ownerDocument).isScrollBraking(node)
    },
  })

  const release = (body: () => void): void => {
    isReleasing = true
    try {
      body()
    }
    finally {
      isReleasing = false
    }
  }

  watch(
    () => toValue(options.trackingExpansion),
    (expansion) => {
      tracker.trackingExpansion = expansion ?? UIKIT_CONTROL.trackingExpansion.value
    },
    { immediate: true, flush: 'sync' },
  )

  // Releasing the element disposes the press, which un-highlights a control
  // it was holding.
  useAttachment(target, (node) => {
    const detach = getGestureHost(node.ownerDocument).attachConsumer(node, tracker)
    return () => release(() => {
      detach()
      tracker.dispose()
    })
  })

  // The host listens only while an enabled control is attached
  // (spec:AST-094 FR24). A control disabled under a finger ends that press
  // inside the release guard: a disabled control tracks no touch, and this
  // sync calls back no caller.
  watch(
    isEnabled,
    () => {
      const node = element()
      release(() => {
        if (tracker.isTracking && !isEnabled()) {
          tracker.dispose()
        }
        if (node != null) {
          syncingGestures(() => getGestureHost(node.ownerDocument).update(node))
        }
      })
    },
    { flush: 'sync' },
  )

  if (getCurrentScope()) {
    onScopeDispose(() => {
      isDisposed = true
    }, true)
  }
  return tracker
}
