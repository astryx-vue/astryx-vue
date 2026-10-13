import type { VNode } from 'vue'

/**
 * Logical side of the trigger label that carries the disclosure chevron.
 *
 * `end` is a trailing status indicator: it follows the label, points down while
 * the content is collapsed, and flips up when it expands. `start` is a leading
 * disclosure arrow: it sits before the label, points inward toward the content
 * while collapsed — mirrored under RTL — and turns down when it expands.
 */
export type CollapsibleChevronPosition = 'start' | 'end'

export interface CollapsibleProps {
  /**
   * Plain-text trigger label.
   *
   * Use the `trigger` slot when the label needs markup, a heading, or
   * additional controls; the slot replaces this prop entirely.
   */
  trigger?: string
  /**
   * Open state the component starts in while `isOpen` stays unbound.
   * @default true
   */
  defaultIsOpen?: boolean
  /**
   * Whether the trigger can be operated.
   *
   * A disabled trigger is dimmed, announces itself as disabled, and leaves the
   * tab order. Disabling never collapses content that is already open.
   * @default false
   */
  isDisabled?: boolean
  /**
   * Logical side of the trigger label that carries the disclosure chevron.
   * @default 'end'
   */
  chevronPosition?: CollapsibleChevronPosition
  /**
   * Controlled open state, bound with `v-model:isOpen`. Leave it unbound to let
   * the component own its state, starting from `defaultIsOpen`.
   *
   * Inside a `CollapsibleGroup`, the group owns the open state and this prop
   * is ignored.
   */
  isOpen?: boolean
  /**
   * Identifier used by a parent `CollapsibleGroup`. A collapsible without a
   * `value` keeps its own open state even when it sits inside a group.
   */
  value?: string
}

export interface CollapsibleEmits {
  /**
   * Emitted with the open state the trigger asks for. In uncontrolled usage it
   * reports the change; in controlled usage it is the request to update the
   * bound state.
   */
  openChange: [isOpen: boolean]
}

export interface CollapsibleSlots {
  /** The content hidden while collapsed and revealed while expanded. */
  default?: () => VNode[]
  /** The trigger label. Replaces the `trigger` prop. */
  trigger?: () => VNode[]
}
