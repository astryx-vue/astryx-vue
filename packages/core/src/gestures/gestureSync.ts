/**
 * @file gestureSync.ts
 * @input Nothing: module state
 * @output syncingGestures and isSyncingGestures: the gesture-sync depth the
 *   gesture composables read
 * @position Internal helpers shared by useGestureRecognizer and
 *   usePressTracker, so each composable imports only what it uses
 *
 * SYNC: When modified, update __tests__/useGestureRecognizer.test.ts.
 */

import { sharedState } from '../utils/sharedRealm'

/**
 * How many composables are driving a recognizer from a watcher right now: an
 * `isEnabled` sync, or the detach of a replaced node that cancels a gesture
 * in flight. While one runs no composable's listener calls its caller's
 * callback: the recognizer it stops is cancelled silently, and what that
 * stop unblocks (a recognizer that required it to fail) resolves in the
 * arena's next pass, a microtask later, where its listener reports as usual
 * (`deferringResolution` in useGestureRecognizer). A press tracker's
 * callbacks wait for a microtask after it (usePressTracker).
 */
const sync = sharedState('gestures/gesture-sync/state', 1, () => ({
  syncingDepth: 0,
}))

/** Runs `body` as a gesture sync (see `syncingDepth`). */
export function syncingGestures<T>(body: () => T): T {
  sync.syncingDepth += 1
  try {
    return body()
  }
  finally {
    sync.syncingDepth -= 1
  }
}

/** True while any gesture composable's sync runs. */
export function isSyncingGestures(): boolean {
  return sync.syncingDepth > 0
}
