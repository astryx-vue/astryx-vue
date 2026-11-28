/**
 * @file useSegmentedSelection.ts
 * @input SegmentedControl's radiogroup, its lens and leaving layers, the
 *   selected value and whether the control takes a press
 * @output useSegmentedSelection: the selection motion and press tracking of
 *   one SegmentedControl, and the press state its focus handling reads
 * @position Vue face of segmentedSelectionMotion.ts and segmentedTracking.ts,
 *   used by SegmentedControl.vue
 */

import type { Ref } from 'vue'
import type { SegmentedPressState, SegmentedTracking } from './segmentedTracking'
import { onBeforeUnmount, onMounted, onUpdated, watch } from 'vue'
import { useCoarsePointer } from '../composables/useCoarsePointer'
import { observeResize } from '../utils/sharedResizeObserver'
import { SEGMENT_SELECTOR } from './segmentedGeometry'
import { SegmentedSelectionMotion } from './segmentedSelectionMotion'
import { attachSegmentedTracking } from './segmentedTracking'

export interface SegmentedSelectionParts {
  readonly track: Readonly<Ref<HTMLElement | null>>
  /** The selection surface. */
  readonly lens: Readonly<Ref<HTMLElement | null>>
  /** The old surface, fading out in place under Reduce Motion. */
  readonly leaving: Readonly<Ref<HTMLElement | null>>
}

export interface SegmentedSelectionOptions {
  readonly value: () => string | undefined
  /** False while the control is disabled: no press is tracked. */
  readonly isEnabled: () => boolean
}

export interface SegmentedSelection extends SegmentedPressState {
  /** The touch presentation applies (a coarse primary pointer). */
  readonly isTouch: Readonly<Ref<boolean>>
}

/**
 * Lays the lens on the selected segment once there is layout (before that,
 * and on the server, the selected segment paints its own surface), moves it
 * on every change, and tracks presses of every pointer.
 */
export function useSegmentedSelection(parts: SegmentedSelectionParts, options: SegmentedSelectionOptions): SegmentedSelection {
  const isTouch = useCoarsePointer()
  const motion = new SegmentedSelectionMotion()
  let tracking: SegmentedTracking | null = null
  const observed = new Map<Element, () => void>()

  function onResize(): void {
    motion.resized()
  }

  /** Every segment and the track: a segment that grows, wraps or loads a font moves the lens's box. */
  function syncObserved(): void {
    const track = parts.track.value
    const elements = new Set<Element>(track == null ? [] : [track, ...track.querySelectorAll(SEGMENT_SELECTOR)])
    for (const [element, unobserve] of observed) {
      if (!elements.has(element)) {
        unobserve()
        observed.delete(element)
      }
    }
    for (const element of elements) {
      if (!observed.has(element))
        observed.set(element, observeResize(element, onResize))
    }
  }

  // The value: after the DOM shows it, so the segments' boxes are the new ones.
  watch(options.value, (to, from) => motion.select(from ?? '', to ?? ''), { flush: 'post' })
  watch(isTouch, touch => motion.present(touch), { flush: 'post' })

  onMounted(() => {
    const track = parts.track.value
    const lens = parts.lens.value
    const leaving = parts.leaving.value
    if (track == null || lens == null || leaving == null)
      return
    motion.present(isTouch.value)
    motion.attach(track, lens, leaving)
    tracking = attachSegmentedTracking(track, motion, options.isEnabled)
    syncObserved()
  })
  onUpdated(syncObserved)
  onBeforeUnmount(() => {
    for (const unobserve of observed.values())
      unobserve()
    observed.clear()
    tracking?.detach()
    tracking = null
    motion.detach()
  })

  return {
    isTouch,
    isPressing: () => tracking?.isPressing() ?? false,
    keyPressed: () => tracking?.keyPressed(),
  }
}
