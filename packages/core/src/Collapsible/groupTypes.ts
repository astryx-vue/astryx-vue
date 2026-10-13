import type { VNode } from 'vue'
import type { CollapsibleGroupDensity, CollapsibleGroupType, CollapsibleGroupValue } from './context.js'
import type { CollapsibleChevronPosition } from './types.js'

export interface CollapsibleGroupProps {
  /**
   * `single` keeps one section open and lets a second click close it.
   * `multiple` toggles each section on its own.
   * @default 'single'
   */
  type?: CollapsibleGroupType
  /**
   * Open section when the group owns its state. A string in single mode, a
   * list in multiple mode.
   */
  defaultValue?: CollapsibleGroupValue
  /**
   * Controlled open section, bound with `v-model:value`.
   */
  value?: CollapsibleGroupValue
  /**
   * Draw a hairline between sections and give them accordion padding.
   * @default false
   */
  hasDividers?: boolean
  /**
   * Trigger and content padding. With `hasDividers` and no density, the group
   * uses `balanced`.
   */
  density?: CollapsibleGroupDensity
  /**
   * Chevron side for the group's sections. A section can still set its own
   * `chevronPosition`.
   * @default 'end'
   */
  chevronPosition?: CollapsibleChevronPosition
}

export interface CollapsibleGroupEmits {
  /**
   * The next open value: a string in single mode (`''` when everything is
   * closed) or a list in multiple mode.
   */
  change: [value: CollapsibleGroupValue]
}

export interface CollapsibleGroupSlots {
  /** `Collapsible` sections. Give each one a `value` so the group can coordinate it. */
  default?: () => VNode[]
}
