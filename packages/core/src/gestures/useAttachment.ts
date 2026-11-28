/**
 * @file useAttachment.ts
 * @input A target (a template ref, a getter, or a node) and an attach
 *   function that returns its release
 * @output useAttachment: keeps the attachment on the node the target names
 *   after each render, released when the node changes or the scope ends
 * @position The gesture composables' shared attachment
 *   (useGestureRecognizer, usePressTracker, useFingerScroll)
 *
 * The watcher runs synchronously (`flush: 'sync'`): Vue sets a template ref
 * once its element is in the document, so a recognizer's `touch-action` is
 * in place before the browser can see a finger on a freshly mounted
 * element, as soon as the mount returns. A target that names another node
 * releases the old attachment and attaches to the new one; a change of
 * `key` re-attaches to the same node. On the server nothing attaches.
 */

import type { MaybeRefOrGetter } from 'vue'
import { getCurrentScope, onScopeDispose, toValue, watch } from 'vue'

export function useAttachment<T extends Element | Document>(
  target: MaybeRefOrGetter<T | null | undefined>,
  attach: (node: T) => () => void,
  key: () => unknown = () => null,
): void {
  if (typeof document === 'undefined') {
    return
  }
  let release: (() => void) | null = null
  const releaseNow = (): void => {
    const current = release
    release = null
    current?.()
  }
  const stop = watch(
    [() => toValue(target), key],
    ([node]) => {
      releaseNow()
      if (node != null) {
        release = attach(node)
      }
    },
    { immediate: true, flush: 'sync' },
  )
  if (getCurrentScope()) {
    onScopeDispose(() => {
      stop()
      releaseNow()
    })
  }
}
