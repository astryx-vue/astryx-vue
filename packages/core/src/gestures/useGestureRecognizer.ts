/**
 * @file useGestureRecognizer.ts
 * @input An element target, a recognizer factory and a gesture listener
 * @output useGestureRecognizer (usePressTracker lives in usePressTracker.ts,
 *   so a gesture-only component never imports the press tracker)
 * @position Vue face of packages/core/src/gestures
 *
 * The recognizer is created once and keeps its identity for the life of the
 * scope, so relationships set up at creation (`requireToFail`,
 * `recognizeSimultaneouslyWith`) hold. A gesture costs no render at all: the
 * listener runs inside the input event and writes to the DOM itself. The
 * recognizer attaches after the DOM updates, so its `touch-action` is in
 * place before the browser can see a finger, and re-attaches whenever the
 * target names another element. Once the scope ends the composable calls
 * the consumer back no more.
 *
 * SYNC: When modified, update __tests__/useGestureRecognizer.test.ts.
 */

import type { MaybeRefOrGetter } from 'vue'
import type { GestureRecognizer } from './GestureRecognizer'
import { getCurrentScope, onScopeDispose, toValue, watch } from 'vue'
import { getGestureHost } from './GestureHost'
import { isSyncingGestures, syncingGestures } from './gestureSync'
import { internals } from './recognizerInternals'
import { useAttachment } from './useAttachment'

export interface UseGestureRecognizerOptions {
  /**
   * Live toggle; turning it off mid-gesture cancels the gesture. That cancel
   * does not call `onGesture`: the code that turned it off already knows. A
   * recognizer that required this one to fail resolves just after and
   * reports as usual.
   * @default true
   */
  isEnabled?: MaybeRefOrGetter<boolean>
  /** Let the host set touch-action (and long-press callout) styles. @default true */
  manageStyle?: MaybeRefOrGetter<boolean>
  /**
   * The element is an action group, sibling actions a held pointer slides
   * across (`family:action-groups` FR5): the host serves it where the
   * primary pointer is fine too (`AttachOptions.actionGroup`).
   * @default false
   */
  actionGroup?: MaybeRefOrGetter<boolean>
}

/**
 * Runs `body` with the recognizer's arena leaving what it unblocks to the
 * next pass (GestureArena.deferResolution). A recognizer that has met no
 * touch has no arena, and nothing waits on it.
 */
function deferringResolution(
  recognizer: GestureRecognizer,
  body: () => void,
): void {
  const { arena } = internals(recognizer)
  if (arena == null) {
    body()
    return
  }
  arena.deferResolution(body)
}

/**
 * Attach a recognizer to the element `target` names.
 *
 * @example
 * ```ts
 * const sheet = ref<HTMLElement | null>(null)
 * useGestureRecognizer(
 *   sheet,
 *   () => new PanGestureRecognizer({ direction: 'vertical' }),
 *   (recognizer) => {
 *     sheet.value!.style.transform = `translateY(${recognizer.translation().y}px)`
 *   },
 * )
 * ```
 */
export function useGestureRecognizer<R extends GestureRecognizer>(
  target: MaybeRefOrGetter<Element | null | undefined>,
  create: () => R,
  onGesture?: (recognizer: R) => void,
  options: UseGestureRecognizerOptions = {},
): R {
  const recognizer = create()
  const isEnabled = (): boolean => toValue(options.isEnabled) ?? true
  const manageStyle = (): boolean => toValue(options.manageStyle) ?? true
  const actionGroup = (): boolean => toValue(options.actionGroup) ?? false
  let isDisposed = false

  // The target-action listener runs inside input events and goes quiet once
  // the scope ends.
  const removeListener = recognizer.addListener((current) => {
    if (!isDisposed && !isSyncingGestures()) {
      onGesture?.(current as R)
    }
  })
  // Quiet before the attachment's release runs, so its cancel reports
  // nothing.
  if (getCurrentScope()) {
    onScopeDispose(() => {
      isDisposed = true
      removeListener()
    })
  }

  // Syncs `isEnabled` before the attachment, under the guard, so disabling
  // cancels a gesture in flight before its attachment goes.
  watch(
    isEnabled,
    (enabled) => {
      syncingGestures(() => {
        deferringResolution(recognizer, () => {
          recognizer.setEnabled(enabled)
        })
      })
    },
    { immediate: true, flush: 'sync' },
  )

  // A disabled gesture is not attached at all: no listener and no
  // `touch-action` of its own on the element (spec:AST-094 FR24). Detaching
  // cancels a gesture in progress, and that cancel reaches no caller
  // callback.
  useAttachment(
    target,
    (element) => {
      if (!isEnabled()) {
        return () => {}
      }
      const detach = getGestureHost(element.ownerDocument).attach(
        element,
        recognizer,
        { manageStyle: manageStyle(), actionGroup: actionGroup() },
      )
      return () => {
        syncingGestures(() => deferringResolution(recognizer, detach))
      }
    },
    () => `${manageStyle()}:${isEnabled()}:${actionGroup()}`,
  )
  return recognizer
}
