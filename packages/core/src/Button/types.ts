import type { Component, VNodeChild } from 'vue'
import type { ExtendedIconName } from '../Icon/types.js'

export interface ButtonVariantMap {
  destructive: true
  ghost: true
  primary: true
  secondary: true
}

export type ButtonVariant = Extract<keyof ButtonVariantMap, string>
export type ButtonSize = 'sm' | 'md' | 'lg'
export type ButtonElevation = 'none' | 'low' | 'med' | 'high'
export type ButtonSizeValue = number | string
export type ButtonLinkElement = string | Component
export type ButtonRootElement = HTMLAnchorElement | HTMLButtonElement | HTMLElement
export type ButtonClickAction = (event: MouseEvent) => void | Promise<void>

export interface ButtonProps {
  /** Custom link component used when href is present. */
  as?: ButtonLinkElement
  /** Async-aware action that controls the pending state. */
  clickAction?: ButtonClickAction
  /** Resting shadow depth for a standalone button. @default 'none' */
  elevation?: ButtonElevation
  /** Associates the button with a form by ID. */
  form?: string
  /** Renders an anchor or custom link when the button is enabled. */
  href?: string
  /** Disables interaction. @default false */
  isDisabled?: boolean
  /**
   * Icon drawn before the label. A semantic icon name (like `search`), a CSS
   * icon class, a component, or a render function. The `#icon` slot wins when
   * both are set.
   */
  icon?: ExtendedIconName | Component | (() => VNodeChild)
  /** Renders only the icon slot and uses label as the accessible name. @default false */
  isIconOnly?: boolean
  /** Keeps the control interactive while clickAction is pending. @default false */
  isInterruptible?: boolean
  /** Shows the loading state. @default false */
  isLoading?: boolean
  /** Required action label and default visible content. */
  label: string
  /** Live-region and spinner label. @default 'Loading' */
  loadingLabel?: string
  /** HTML name used for form submission. */
  name?: string
  /** Relationship attribute used by link roots. */
  rel?: string
  /** Button size. @default 'md' */
  size?: ButtonSize
  /** Browsing context used by link roots. */
  target?: string
  /** Tooltip text shown on hover and keyboard focus. */
  tooltip?: string
  /** Native button type. @default 'button' */
  type?: 'button' | 'reset' | 'submit'
  /** Form value. */
  value?: number | readonly string[] | string
  /** Button visual style. @default 'secondary' */
  variant?: ButtonVariant
  /** Number values are converted to pixels; strings are used as-is. */
  width?: ButtonSizeValue
}

export interface ButtonSlots {
  default?: () => unknown
  end?: () => unknown
  icon?: () => unknown
}

export interface ButtonEmits {
  click: [event: MouseEvent]
}
