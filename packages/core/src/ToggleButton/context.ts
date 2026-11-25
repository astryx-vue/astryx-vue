import type { ComputedRef } from 'vue'
import type { ButtonSize } from '../Button/types.js'
import { defineLayerScopedKey } from '../layer/scopedProvide.js'

/**
 * What a ToggleButton reads from its group.
 *
 * `selectedValues`, `size`, and `isDisabled` are handed over as refs so a
 * member keeps following the group after the group's own props change; a
 * snapshot would freeze every member at the values present at provide time.
 */
export interface ToggleButtonGroupContextValue {
  /** The values currently pressed. */
  selectedValues: ComputedRef<Set<string>>
  /** Flips one value on or off. */
  toggle: (value: string) => void
  /** The size members inherit. */
  size: ComputedRef<ButtonSize>
  /** Whether the group disables every member. */
  isDisabled: ComputedRef<boolean>
  /** 组在跟踪手指和笔的滑动。只有带 value 的成员归组跟踪，没 value 的保留自己的按压。 */
  tracksPress?: ComputedRef<boolean>
}

export const toggleButtonGroupContextKey = defineLayerScopedKey<ToggleButtonGroupContextValue | null>(
  'astryx-toggle-button-group',
  null,
)
