/**
 * @file useSwitchTouch.ts
 * @input Switch's parts (gesture surface, input, thumb and track), its value,
 *   whether it takes a press, whether it is disabled and its size
 * @output useSwitchTouch: Switch's gestures for every pointer, with the touch
 *   presentation under a coarse primary pointer
 * @position Vue face of switchTouchController.ts, used by Switch.vue
 */

import type { Ref } from 'vue'
import type { SwitchThumbSizes } from './switchTouchController'
import { onScopeDispose, shallowRef, watch } from 'vue'
import { watchCoarsePointer } from '../utils/coarsePointer'
import { TOUCH_QUERY } from '../utils/touchQueries'
import { switchTouchGeometry } from './switchTouch'
import { SwitchTouchController } from './switchTouchController'

export interface SwitchTouchParts {
  /** Receives the touches: the control around the input and the track. */
  readonly surface: Ref<HTMLElement | null>
  readonly input: Ref<HTMLInputElement | null>
  /** Moves and lifts. */
  readonly thumb: Ref<HTMLElement | null>
  /** Its `::after` is the colour fade layer. */
  readonly track: Ref<HTMLElement | null>
}

export interface SwitchTouchOptions {
  readonly isOn: () => boolean
  /** False while disabled, read-only or busy: no touch is tracked. */
  readonly isInteractive: () => boolean
  /**
   * Disabled: nothing attaches. A busy switch stays attached, so a change
   * that starts a busy state still plays its release motion.
   */
  readonly isDisabled: () => boolean
  /** The track's box, px (width × height): the thumb geometry's scale. */
  readonly trackSize: () => readonly [number, number]
  /** The thumb's diameter in each state, px, for a change before any press. */
  readonly thumbSizes: () => SwitchThumbSizes
}

/** Whether the primary pointer is coarse now, following changes. */
function useIsTouch(): Ref<boolean> {
  const isTouch = shallowRef(false)
  if (typeof window === 'undefined')
    return isTouch
  isTouch.value = typeof window.matchMedia === 'function' && window.matchMedia(TOUCH_QUERY).matches
  onScopeDispose(watchCoarsePointer(window, (isCoarse) => {
    isTouch.value = isCoarse
  }))
  return isTouch
}

/**
 * Switch's gestures, attached for every pointer, with the touch
 * presentation under a coarse primary pointer. Its parts are rendered and
 * styled for it whether or not it is active; it only animates and listens.
 */
export function useSwitchTouch(parts: SwitchTouchParts, options: SwitchTouchOptions): void {
  const isTouch = useIsTouch()
  const [width, height] = options.trackSize()
  const controller = new SwitchTouchController(options.isOn(), switchTouchGeometry(width, height))

  // The value: after the DOM shows it, so the thumb's CSS rest has moved.
  watch(options.isOn, isOn => controller.setValue(isOn), { flush: 'post' })
  watch(options.trackSize, ([trackWidth, trackHeight]) => controller.setGeometry(switchTouchGeometry(trackWidth, trackHeight)))
  watch(options.thumbSizes, sizes => controller.setThumbSizes(sizes), { immediate: true })
  watch(options.isInteractive, isInteractive => controller.setInteractive(isInteractive), { immediate: true, flush: 'sync' })

  watch(
    () => [parts.surface.value, parts.input.value, parts.thumb.value, parts.track.value, isTouch.value, options.isDisabled()] as const,
    ([surface, input, thumb, track, touch, isDisabled], _previous, onCleanup) => {
      if (isDisabled || surface == null || input == null || thumb == null || track == null)
        return
      controller.attach({ surface, input, thumb, track }, touch ? 'touch' : 'pointer')
      onCleanup(() => controller.detach())
    },
    { immediate: true, flush: 'post' },
  )
}
