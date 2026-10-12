import type { VNode } from 'vue'
import type { FieldStatusInput, FieldStatusVariant } from '../Field/types.js'
import type { PopoverPlacement } from '../Popover/types.js'
import type { ButtonSize } from '../Button/types.js'

export interface ComplexSelectorState {
  isOpen: boolean
  isBusy: boolean
  triggerId: string
  contentId: string
}

export interface ComplexSelectorSlotProps<Value> {
  /** The value shown in the field, including a pending optimistic value. */
  value: Value
  /** Commit the next value and run `changeAction` when one was provided. */
  commit: (value: Value) => void
  /** Close the popup. */
  close: () => void
  state: ComplexSelectorState
}

export interface ComplexSelectorProps<Value = unknown> {
  /** Field label. It also names the popup. */
  label: string
  /** Current value. Bind with `v-model`. */
  modelValue: Value
  /** Text shown on the trigger. Falls back to `placeholder`. */
  triggerLabel?: string
  /** Shown when `triggerLabel` is empty. */
  placeholder?: string
  /** Hide the visible label. The accessible name stays. */
  isLabelHidden?: boolean
  /** Supporting text under the label. */
  description?: string
  /** @default false */
  isOptional?: boolean
  /** @default false */
  isRequired?: boolean
  /** @default false */
  isDisabled?: boolean
  /** @default false */
  isLoading?: boolean
  status?: FieldStatusInput
  /** @default 'attached' */
  statusVariant?: FieldStatusVariant | 'tooltip'
  labelTooltip?: string
  /** @default 'md' */
  size?: ButtonSize
  width?: number | string
  /** @default 'below' */
  placement?: PopoverPlacement
  /**
   * Runs after the value changes. While it is pending the trigger shows a
   * spinner and the slot sees the value that was just committed.
   */
  changeAction?: (value: Value) => void | Promise<void>
}

export interface ComplexSelectorEmits<Value> {
  change: [value: Value]
}

export interface ComplexSelectorSlots<Value> {
  default?: (props: ComplexSelectorSlotProps<Value>) => VNode[]
}
