import type { Component, VNodeChild } from 'vue'
import type { ItemTarget } from '../List/types.js'

/** Visual variant of one menu row. */
export type DropdownMenuItemVariant = 'default' | 'destructive'

export interface DropdownMenuItemProps {
  /**
   * Primary label content. Use the `label` slot for rich content.
   */
  label?: string | number
  /**
   * Secondary line below the label. Use the `description` slot for rich
   * content.
   */
  description?: string | number
  /**
   * Icon shown before the label.
   *
   * Pass a CSS icon class — for example an UnoCSS class such as
   * `'i-carbon-copy'` — or a Vue component that draws the SVG. astryx-vue ships
   * no icons of its own. Use the `icon` slot for arbitrary content.
   */
  icon?: string | Component
  /**
   * Whether the row is disabled. A disabled row is skipped by the arrow keys
   * and by typeahead.
   * @default false
   */
  isDisabled?: boolean
  /**
   * Visual variant. `destructive` renders the label, description, and icon in
   * the error color for dangerous actions.
   * @default 'default'
   */
  variant?: DropdownMenuItemVariant
  /**
   * Whether activating the row closes the menu. Set `false` for an action that
   * reports its result on the row itself.
   * @default true
   */
  hasCloseOnSelect?: boolean
  /**
   * Address the row navigates to. The row then renders as one anchor carrying
   * `role="menuitem"`, so a modified click and a middle click keep the
   * browser's meaning.
   */
  href?: string
  /**
   * Link target. Only used with `href`.
   */
  target?: ItemTarget
  /**
   * Link relationship. `noopener` and `noreferrer` are merged in for
   * `target="_blank"`. Only used with `href`.
   */
  rel?: string
  /**
   * Called when the row is activated. On a link row it runs before the browser
   * navigates, and is skipped for a modified click, which the browser owns.
   */
  onClick?: (event: MouseEvent) => void
}

export interface DropdownMenuItemEmits {
  /** Fired when the row is activated. */
  click: [event: MouseEvent]
}

export interface DropdownMenuItemSlots {
  /** Rich content replacing the `icon` prop. */
  icon?: () => VNodeChild
  /** Rich content replacing the `label` prop. */
  label?: () => VNodeChild
  /** Rich content replacing the `description` prop. */
  description?: () => VNodeChild
  /** Trailing content, such as a keyboard-shortcut hint. */
  endContent?: () => VNodeChild
}

export interface DropdownMenuGroupProps {
  /**
   * Heading shown above the group's rows and used as the group's accessible
   * name. Omit it for an unnamed group.
   */
  title?: string | number
}

export interface DropdownMenuGroupSlots {
  /** The rows of the group. */
  default?: () => VNodeChild
  /** Rich content replacing the `title` prop, still used as the group's name. */
  title?: () => VNodeChild
}

/**
 * How a submenu shows its rows.
 *
 * `flyout` opens them beside the row. `drill-in` replaces the menu's rows
 * with them and a Back row, in the same box. `adaptive` drills in when the
 * menu opened on a compact touch surface and flies out otherwise.
 */
export type DropdownMenuSubMenuPresentation = 'flyout' | 'drill-in' | 'adaptive'

export interface DropdownMenuSubMenuProps {
  /** Row label. */
  label?: string | number
  /** Icon before the label. A CSS class or a component. */
  icon?: string | Component
  /** Secondary line under the label. */
  description?: string | number
  /**
   * Whether the row can open its flyout.
   * @default false
   */
  isDisabled?: boolean
  /**
   * Show a spinner in place of the caret, for a submenu whose rows are still
   * loading. Opening still works; the spinner only replaces the caret.
   * @default false
   */
  hasSpinner?: boolean
  /**
   * Minimum width of the flyout. A length may grow for its content and is
   * capped to the viewport. Defaults to the flyout's content, at least 160px.
   */
  menuWidth?: number | string
  /**
   * How the submenu shows its rows.
   * @default 'adaptive'
   */
  presentation?: DropdownMenuSubMenuPresentation
}

export interface DropdownMenuSubMenuEmits {
  /** Fired when the flyout or the drilled view opens or closes. */
  openChange: [isOpen: boolean]
}

export interface DropdownMenuSubMenuSlots {
  /** The rows of the nested menu. */
  default?: () => VNodeChild
  icon?: () => VNodeChild
  label?: () => VNodeChild
  description?: () => VNodeChild
}

export interface DropdownMenuCheckboxItemProps {
  /**
   * Primary label content. Use the `label` slot for rich content.
   */
  label?: string | number
  /**
   * Secondary line below the label.
   */
  description?: string | number
  /**
   * Icon shown before the label. A CSS class or a component.
   */
  icon?: string | Component
  /**
   * Whether the row is checked. Pair it with `v-model`.
   */
  modelValue: boolean
  /**
   * Whether the row is disabled. A disabled row stays in the accessibility
   * tree and is skipped by the arrow keys; activation is blocked.
   * @default false
   */
  isDisabled?: boolean
  /**
   * Whether toggling the row closes the menu. Checkbox rows stay open so
   * several can be toggled without reopening the menu.
   * @default false
   */
  hasCloseOnSelect?: boolean
}

export interface DropdownMenuCheckboxItemEmits {
  /** Fired with the next checked state. */
  change: [checked: boolean]
}

export interface DropdownMenuCheckboxItemSlots {
  icon?: () => VNodeChild
  label?: () => VNodeChild
  description?: () => VNodeChild
  endContent?: () => VNodeChild
}

export interface DropdownMenuRadioGroupProps {
  /**
   * The selected value. Leave it unset when nothing is selected yet. Pair it
   * with `v-model`.
   */
  modelValue?: string
  /**
   * Accessible name of the group. Required, so the options are announced as
   * one named set. Pass `aria-labelledby` on the group when a visible element
   * already names it.
   */
  label: string
  /**
   * Whether choosing a value closes the menu. A radio group is a single
   * choice, so it closes.
   * @default true
   */
  hasCloseOnSelect?: boolean
}

export interface DropdownMenuRadioGroupEmits {
  /** Fired with the next selected value. */
  change: [value: string]
}

export interface DropdownMenuRadioGroupSlots {
  /** The `DropdownMenuRadioItem` options. */
  default?: () => VNodeChild
}

export interface DropdownMenuRadioItemProps {
  /**
   * The value this option represents. The group's model matches it to decide
   * the checked state.
   */
  value: string
  /** Primary label content. */
  label?: string | number
  /** Secondary line below the label. */
  description?: string | number
  /** Icon shown before the label. A CSS class or a component. */
  icon?: string | Component
  /**
   * Whether this option is disabled. It stays in the tree and cannot be
   * selected.
   * @default false
   */
  isDisabled?: boolean
}

export interface DropdownMenuRadioItemSlots {
  icon?: () => VNodeChild
  label?: () => VNodeChild
  description?: () => VNodeChild
  endContent?: () => VNodeChild
}
