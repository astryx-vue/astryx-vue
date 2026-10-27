import type { Component, Ref, VNode } from 'vue'
import type { ButtonSize } from '../Button/types.js'
import type { FieldPartStylingProps } from '../Field/fieldParts.js'
import type { FieldStatusInput, FieldStatusVariant } from '../Field/types.js'
import type { ExtendedIconName } from '../Icon/types.js'
import type { PopoverAlignment, PopoverPlacement } from '../Popover/types.js'

export interface ComplexSelectorState {
  isOpen: boolean
  isBusy: boolean
  triggerId: string
  contentId: string
}

export type ComplexSelectorVariant = 'input' | 'secondary' | 'ghost'

export interface ComplexSelectorHandle {
  /** Open the popup. */
  open: () => void
  /** Close the popup. */
  close: () => void
  /** Open when closed, and close when open. */
  toggle: () => void
  /** Whether the popup is open. */
  isOpen: () => boolean
}

/**
 * A Vue ref or a callback. In a template, pass a callback: template refs are
 * unwrapped, so `:handle-ref="someRef"` would hand over `null`.
 */
export type ComplexSelectorHandleRef
  = | Ref<ComplexSelectorHandle | null>
    | ((handle: ComplexSelectorHandle | null) => void)

export interface ComplexSelectorTriggerProps {
  'id': string
  'onClick': (event: MouseEvent) => void
  'onKeydown': (event: KeyboardEvent) => void
  'aria-haspopup': 'dialog'
  'aria-expanded': boolean
  'aria-controls': string | undefined
  'aria-busy': true | undefined
  'aria-label': string
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

export interface ComplexSelectorProps<Value = unknown> extends FieldPartStylingProps {
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
   * Popup alignment along the placement axis.
   * @default 'start'
   */
  alignment?: PopoverAlignment
  /**
   * Icon at the start of the built-in trigger. A CSS icon class, a chrome
   * name, or a component.
   */
  startIcon?: ExtendedIconName | Component
  /**
   * `input` is the bordered field. `secondary` matches a secondary button. `ghost` matches a toolbar button.
   * @default 'input'
   */
  variant?: ComplexSelectorVariant
  /**
   * Replaces the field and the built-in trigger. Spread the argument onto the
   * control the popup should hang off. `label` still names the popup.
   */
  renderTrigger?: (props: ComplexSelectorTriggerProps) => VNode
  /**
   * Imperative open, close, toggle, and isOpen. A template `ref` on the
   * component exposes the same methods.
   */
  handleRef?: ComplexSelectorHandleRef
  /**
   * Runs after the value changes. While it is pending the trigger shows a
   * spinner and the slot sees the value that was just committed.
   */
  changeAction?: (value: Value) => void | Promise<void>
}

export interface ComplexSelectorEmits<Value> {
  change: [value: Value]
  /**
   * 触发器上的点击。打开之前先执行，event.preventDefault() 可以让弹层不打开。
   * 用 trigger 插槽或 renderTrigger 自己画触发器时，它在开关之后执行，取消不了。
   */
  click: [event: MouseEvent]
  /** 触发器上的按键。内置处理（包括 ArrowDown 打开）之后执行，每个键都会收到。 */
  keydown: [event: KeyboardEvent]
  /** 弹层每次开或关都会触发：触发器、键盘、点外面、Escape、close() 或命令式 handle。 */
  openChange: [isOpen: boolean]
}

export interface ComplexSelectorSlots<Value> {
  default?: (props: ComplexSelectorSlotProps<Value>) => VNode[]
  /**
   * Replaces the field and the built-in trigger, the same job as
   * `renderTrigger`. Spread the bindings onto the control.
   */
  trigger?: (props: ComplexSelectorTriggerProps) => VNode[]
}
