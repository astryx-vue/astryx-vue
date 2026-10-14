import type { VNodeChild } from 'vue'
import { useSlots } from 'vue'
import { isRenderable } from './isRenderable.js'

/**
 * Whether the default slot should take the place of the state mark.
 *
 * Called during render. The slot function runs once to inspect, and the
 * template renders it again when the answer is yes.
 */
export function useReplacementSlot(): () => boolean {
  const slots = useSlots()
  return () => isRenderable(slots.default?.() as VNodeChild)
}
