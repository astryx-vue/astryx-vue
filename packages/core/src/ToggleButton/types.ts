import type { VNode } from 'vue'
import type { ButtonElevation, ButtonSize } from '../Button/types.js'

export type ToggleButtonSize = ButtonSize
export type ToggleButtonElevation = ButtonElevation

/**
 * The next pressed state, together with the click that asked for it.
 *
 * Call `event.preventDefault()` to handle the toggle entirely in this callback
 * and skip `pressedChangeAction`.
 */
export type ToggleButtonPressedChangeHandler = (isPressed: boolean, event: MouseEvent) => void

/**
 * An action for a toggle backed by a request or a navigation.
 *
 * The button shows the next pressed state while the returned promise is
 * pending, and re-clicks stay live so they can reverse a pending toggle.
 */
export type ToggleButtonChangeAction = (isPressed: boolean) => void | Promise<void>

export interface ToggleButtonProps {
  /**
   * Accessible label for the button. It is the visible text, or the
   * `aria-label` when the button is icon-only.
   */
  label: string
  /**
   * Whether the button is currently pressed, bound with `v-model:isPressed`.
   *
   * Leave it unbound to let the button own its pressed state, starting
   * unpressed. Inside a ToggleButtonGroup the group owns this and the prop is
   * ignored.
   * @default false
   */
  isPressed?: boolean
  /**
   * The size of the toggle button.
   *
   * Falls back to the size of the enclosing ToggleButtonGroup, then to `md`.
   * @default 'md'
   */
  size?: ButtonSize
  /**
   * Resting shadow depth, mirroring Button, for floating (FAB-style) toggles.
   * A grouped button keeps its own elevation.
   * @default 'none'
   */
  elevation?: ButtonElevation
  /**
   * Whether the button is disabled. A disabled group also disables every
   * member, and an enabled group never re-enables a member that disabled
   * itself.
   * @default false
   */
  isDisabled?: boolean
  /**
   * Whether the button is in a loading state.
   * @default false
   */
  isLoading?: boolean
  /**
   * Renders a square, icon-only button that uses `label` as its accessible
   * name and `tooltip` for its hover hint.
   * @default false
   */
  isIconOnly?: boolean
  /**
   * Action for an API- or navigation-backed toggle.
   *
   * It runs after `pressedChange` unless that handler prevents the click
   * default. While it is pending the button shows the next pressed state and a
   * spinner, and it stays interruptible by another click. It is ignored for a
   * group member with a `value`.
   */
  pressedChangeAction?: ToggleButtonChangeAction
  /**
   * Tooltip text shown on hover and keyboard focus.
   */
  tooltip?: string
  /**
   * Value identifier used inside a ToggleButtonGroup. Required for a member,
   * ignored by a standalone button.
   */
  value?: string
}

export interface ToggleButtonEmits {
  /**
   * Emitted with the pressed state the click asks for and the originating
   * click event. Emitting `update:isPressed` for `v-model:isPressed` happens
   * alongside it.
   */
  pressedChange: [isPressed: boolean, event: MouseEvent]
  /**
   * The originating click event, forwarded after the toggle has been
   * requested. It is not emitted while the button is disabled.
   */
  click: [event: MouseEvent]
}

export interface ToggleButtonSlots {
  /**
   * Visible content. It replaces `label` as the visible text; `label` stays
   * the accessible name.
   */
  default?: () => VNode[]
  /**
   * Decorative icon before the label, or the only content of an icon-only
   * button.
   */
  icon?: () => VNode[]
  /**
   * Icon shown while pressed, typically a filled version of `icon`.
   *
   * Falls back to `icon` when it is not provided. The artwork owns its own
   * color, so pass an element that already carries the color you want.
   */
  pressedIcon?: () => VNode[]
}

export type ToggleButtonGroupType = 'single' | 'multiple'
export type ToggleButtonGroupOrientation = 'horizontal' | 'vertical'

/** The selected value(s) of a group: a single value, `null` for none, or a list. */
export type ToggleButtonGroupValue = string | null | string[]

export interface ToggleButtonGroupBaseProps {
  /**
   * Accessible label for the group, rendered as `aria-label`.
   */
  label: string
  /**
   * Selection mode. `single` keeps one member pressed and lets a click on the
   * pressed member clear the selection; `multiple` presses members
   * independently.
   * @default 'single'
   */
  type?: ToggleButtonGroupType
  /**
   * Built-in layout direction for the members.
   * @default 'horizontal'
   */
  orientation?: ToggleButtonGroupOrientation
  /**
   * Size the members inherit. A member with its own `size` wins.
   * @default 'md'
   */
  size?: ButtonSize
  /**
   * Whether every member is disabled. A member can still disable itself while
   * the group stays enabled.
   * @default false
   */
  isDisabled?: boolean
}

/**
 * A group in single-select mode: `value` is a string or `null`.
 *
 * `ToggleButtonGroup` declares the value model once for both modes, so this is
 * the shape to use when writing a typed wrapper or a prop table.
 */
export interface ToggleButtonGroupSingleProps extends ToggleButtonGroupBaseProps {
  /** @default 'single' */
  type?: 'single'
  /**
   * The pressed member, or `null` when none is pressed.
   * @default null
   */
  value?: string | null
}

/**
 * A group in multi-select mode: `value` is a list of the pressed members.
 */
export interface ToggleButtonGroupMultipleProps extends ToggleButtonGroupBaseProps {
  /** @default 'multiple' */
  type: 'multiple'
  /**
   * The pressed members.
   * @default []
   */
  value?: string[]
}

export type ToggleButtonGroupProps = ToggleButtonGroupSingleProps | ToggleButtonGroupMultipleProps

export interface ToggleButtonGroupEmits {
  /**
   * Emitted with the next selection: the value or `null` in single mode, the
   * list of values in multiple mode. Emitting `update:value` for `v-model:value`
   * happens alongside it.
   */
  change: [value: ToggleButtonGroupValue]
}

export interface ToggleButtonGroupSlots {
  /** The ToggleButton members. Give each one a `value`. */
  default?: () => VNode[]
}
