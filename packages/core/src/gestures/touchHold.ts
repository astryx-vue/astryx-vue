/**
 * @file touchHold.ts
 * @input The holds a layer places on input while it animates or shields
 *   what is beneath it
 * @output registerTouchHold, which adds a hold's read, and holdsTouch, the
 *   gesture host's one question: whether a touch on a target is held
 * @position The seam between the gesture host and a layer's input hold
 *   (upstream Layer/inputHold `holdsTouch`): a layer registers its read, and
 *   the host asks before it gives a touch to any recognizer
 *
 * A held touch reaches no recognizer: the host drops it as it lands. With
 * no hold registered, every touch passes, at once.
 */

import { sharedState } from '../utils/sharedRealm'

/** Whether a hold takes a touch that lands on `target`. */
export type TouchHoldQuery = (target: Node) => boolean

const holds = sharedState('gestures/touch-hold', 1, () => new Set<TouchHoldQuery>())

/** Add a hold's read; returns the removal. */
export function registerTouchHold(query: TouchHoldQuery): () => void {
  holds.add(query)
  return () => {
    holds.delete(query)
  }
}

/** Whether any registered hold takes a touch on `target`. */
export function holdsTouch(target: Node): boolean {
  for (const query of holds) {
    if (query(target)) {
      return true
    }
  }
  return false
}
