import type { ComputedRef, VNode } from 'vue'

export type SegmentedControlSize = 'sm' | 'md' | 'lg'

/**
 * How the segments spend the width available to the control.
 *
 * - `hug`: the control and each segment hug their content, capped at the
 *   container. Segment labels truncate when the container is too narrow.
 * - `fill`: the segments stretch equally to fill the container width.
 */
export type SegmentedControlLayout = 'hug' | 'fill'

export interface SegmentedControlProps {
  /**
   * The selected segment's value.
   *
   * Bind it with `v-model`. A segment whose `value` matches is the selected
   * one, so exactly one option is always selected.
   */
  modelValue: string
  /**
   * Accessible name for the radio group, applied as `aria-label`. It is never
   * rendered visually, so the visible selection is the only thing on screen.
   */
  label: string
  /**
   * Size of the control, which sets the height of every segment.
   * @default 'md'
   */
  size?: SegmentedControlSize
  /**
   * Whether the segments hug their labels or share the container width.
   * @default 'hug'
   */
  layout?: SegmentedControlLayout
  /**
   * Whether the entire control is disabled. Every segment blocks selection,
   * and the control leaves the tab order.
   * @default false
   */
  isDisabled?: boolean
  /**
   * Why the control is disabled, shown in a tooltip on hover and on keyboard
   * focus. Use it instead of wrapping a disabled control in a `Tooltip`:
   * the disabled control swallows the pointer events an external wrapper
   * needs. With a message the control stays focusable through
   * `aria-disabled` so the reason is discoverable, while selection stays
   * blocked. It explains the whole-control disabled state, not one segment.
   */
  disabledMessage?: string
}

export interface SegmentedControlEmits {
  'update:modelValue': [value: string]
  'change': [value: string]
}

export interface SegmentedControlSlots {
  /**
   * The `SegmentedControlItem` children, in visual order.
   */
  default?: () => VNode[]
}

export interface SegmentedControlItemProps {
  /**
   * Unique value for this segment, matched against the control's `v-model`.
   */
  value: string
  /**
   * The segment's name. Rendered as its visible text, and used as the
   * accessible name when the label is hidden.
   */
  label: string
  /**
   * Whether the label is visually hidden, leaving only the icon. The label
   * still names the segment through `aria-label`.
   * @default false
   */
  isLabelHidden?: boolean
  /**
   * Whether this single segment is disabled. It keeps its place in the row but
   * can no longer be selected or reached with the arrow keys.
   * @default false
   */
  isDisabled?: boolean
}

export interface SegmentedControlItemSlots {
  /**
   * The artwork shown before the label. An `Icon` in this slot follows the
   * control's size.
   */
  icon?: () => VNode[]
}

/**
 * What a segment reads from its control.
 *
 * Every value is a ref so a segment follows the control: a snapshot would
 * leave the segment frozen on the selection, size, and state that were current
 * when the control first provided the context.
 */
export interface SegmentedControlContextValue {
  value: ComputedRef<string>
  size: ComputedRef<SegmentedControlSize>
  layout: ComputedRef<SegmentedControlLayout>
  isDisabled: ComputedRef<boolean>
  /**
   * True when the whole control is disabled and has a `disabledMessage`, the
   * one case where the selected segment stays in the tab order so the reason
   * is reachable by keyboard.
   */
  hasDisabledMessage: ComputedRef<boolean>
  select: (value: string) => void
}
