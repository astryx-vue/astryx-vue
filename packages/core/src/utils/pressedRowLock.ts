/**
 * @file pressedRowLock.ts
 * @input The elements a press tracker holds and the touch's target
 * @output lockPressedRow: the selection lock for a control's press, over the
 *   control and the pressable row around it
 * @position A press tracker's `selectionLock` for a control whose hold acts
 *   (Switch), over utils/selectionLock.ts
 */

import { PRESSABLE_ATTRIBUTE } from '../composables/internal/pressSurface.js'
import { lockSelection } from './selectionLock'

/**
 * Locks the selection on `elements` and on the pressable row each sits in,
 * so a held finger selects no label text beside the control.
 */
export function lockPressedRow(elements: Iterable<Element>, target: EventTarget | null): () => void {
  const held = new Set<Element>()
  for (const element of elements) {
    held.add(element)
    held.add(element.closest(`[${PRESSABLE_ATTRIBUTE}]`) ?? element)
  }
  return lockSelection(held, target)
}
