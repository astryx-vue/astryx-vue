import type { Component, VNodeChild } from 'vue'
import type { ButtonProps } from '../Button/types.js'
import type { LayerAlignment, LayerPlacement } from '../layer/position.js'
import type { ItemTarget } from '../List/types.js'
import type { DropdownMenuItemVariant } from './rowTypes.js'

/** Size of the menu, derived from the trigger button's size. */
export type DropdownMenuSize = 'sm' | 'md' | 'lg'

/**
 * Where the menu opens.
 *
 * `popover` hangs off the trigger. `bottom-sheet` rises from the bottom edge.
 * `adaptive` uses the sheet only on a compact touch surface.
 */
export type DropdownMenuPresentation = 'adaptive' | 'bottom-sheet' | 'popover'

/**
 * The trigger button's properties.
 *
 * Every `Button` prop is accepted except `clickAction`, which would compete
 * with the menu for the trigger's click. Hover and pressed paint stay the
 * Button's own; the open state is exposed to CSS as `[data-open='true']` on the
 * trigger wrapper.
 */
export type DropdownMenuButtonProps = Omit<ButtonProps, 'clickAction'>

/**
 * The wiring a custom trigger spreads onto the control that opens the menu.
 *
 * These keys are already written in the attribute form the DOM wants, so
 * `v-bind` them wholesale onto the control. The menu is then named by that
 * control through `aria-labelledby`.
 */
export interface DropdownMenuTriggerProps {
  /** The control's id; the menu points at it with `aria-labelledby`. */
  'id': string
  'aria-haspopup': 'menu' | 'dialog'
  'aria-expanded': boolean
  'aria-controls': string
  /** Toggles the menu. */
  'onClick': (event: MouseEvent) => void
  /** Opens on Enter, Space, ArrowDown and ArrowUp; while open, ArrowDown walks into the menu. */
  'onKeyDown': (event: KeyboardEvent) => void
  /** Pointer dismissal suppresses the ring; a later keyboard focus clears it. */
  'onFocus': () => void
  /** `'off'` while a pointer dismissal is hiding the trigger's focus ring. */
  'data-astryx-focus-ring'?: 'off'
}

/** One action row of the `items` data API. */
export interface DropdownMenuItemData {
  /**
   * Stable identity for the row. Omit it and the row is keyed by position,
   * which is correct for a fixed menu; set it when `items` can reorder,
   * filter, or grow, so a row keeps its DOM node — and therefore keyboard
   * focus — as the array changes around it.
   */
  id?: string
  /** Primary label content. */
  label: string | number
  /**
   * Icon shown before the label.
   *
   * Pass a CSS icon class — for example an UnoCSS class such as
   * `'i-carbon-copy'` — or a Vue component that draws the SVG. astryx-vue ships
   * no icons of its own.
   */
  icon?: string | Component
  /** Secondary line below the label. */
  description?: string | number
  /**
   * Whether the row is disabled.
   * @default false
   */
  isDisabled?: boolean
  /**
   * Visual variant. `destructive` renders the label, description, and icon in
   * the error color for dangerous actions.
   * @default 'default'
   */
  variant?: DropdownMenuItemVariant
  /** Trailing content, such as a keyboard-shortcut hint. */
  endContent?: VNodeChild
  /**
   * Whether activating the row closes the menu. Set `false` for an action that
   * reports its result on the row itself.
   * @default true
   */
  hasCloseOnSelect?: boolean
  /** Address the row navigates to; the row then renders as a link. */
  href?: string
  /** Link target. Only used with `href`. */
  target?: ItemTarget
  /** Link relationship. Only used with `href`. */
  rel?: string
  /** Called when the row is activated. */
  onClick?: (event: MouseEvent) => void
}

/**
 * A checkbox row of the `items` data API.
 *
 * The checked state is controlled: the row renders `checked` and reports the
 * next value through `onChange`. Toggling leaves the menu open unless
 * `hasCloseOnSelect` is set.
 */
export interface DropdownMenuCheckboxData {
  type: 'checkbox'
  /** Stable identity for the row. */
  id?: string
  /** Primary label content. */
  label: string | number
  /** Icon shown before the label. A CSS class or a component. */
  icon?: string | Component
  /** Secondary line below the label. */
  description?: string | number
  /**
   * Whether the row is checked.
   */
  checked: boolean
  /**
   * Whether the row is disabled.
   * @default false
   */
  isDisabled?: boolean
  /**
   * Whether toggling the row closes the menu. Checkbox rows stay open so
   * several can be toggled in one session.
   * @default false
   */
  hasCloseOnSelect?: boolean
  /** Trailing content, such as a keyboard-shortcut hint. */
  endContent?: VNodeChild
  /** Called with the next checked state. */
  onChange?: (checked: boolean) => void
}

/** One option inside a radio group of the `items` data API. */
export interface DropdownMenuRadioOptionData {
  /** Stable identity for the option. */
  id?: string
  /** Value this option represents. The group's `value` matches it. */
  value: string
  /** Primary label content. */
  label: string | number
  /** Icon shown before the label. A CSS class or a component. */
  icon?: string | Component
  /** Secondary line below the label. */
  description?: string | number
  /**
   * Whether this option is disabled.
   * @default false
   */
  isDisabled?: boolean
  /** Trailing content. */
  endContent?: VNodeChild
}

/**
 * A single-select radio group of the `items` data API.
 *
 * The selected value is controlled. Choosing an option closes the menu unless
 * `hasCloseOnSelect` is `false`.
 */
export interface DropdownMenuRadioData {
  type: 'radio'
  /** Stable identity for the group. */
  id?: string
  /**
   * Accessible name of the group, announced with the options as one set.
   */
  label: string
  /**
   * The selected value. Leave it unset when nothing is selected yet.
   */
  value?: string
  /**
   * Whether choosing a value closes the menu.
   * @default true
   */
  hasCloseOnSelect?: boolean
  /** The options. Exactly one can be selected. */
  items: DropdownMenuRadioOptionData[]
  /** Called with the next selected value. */
  onChange?: (value: string) => void
}

/** A row the data API can place inside a section or at the top level. */
export type DropdownMenuEntry = DropdownMenuItemData | DropdownMenuCheckboxData | DropdownMenuRadioData

/** A divider row of the `items` data API. */
export interface DropdownMenuDividerData {
  type: 'divider'
}

/** A titled group of rows of the `items` data API. */
export interface DropdownMenuSection {
  type: 'section'
  /** Stable identity for the group. */
  id?: string
  /** Heading shown above the group's rows and used as its accessible name. */
  title?: string
  items: DropdownMenuEntry[]
}

/** One entry of the `items` data API. */
export type DropdownMenuOption = DropdownMenuEntry | DropdownMenuDividerData | DropdownMenuSection

export interface DropdownMenuProps {
  /**
   * The design system's own button as the trigger. Ignored when the `trigger`
   * slot renders a control instead.
   * @default the active locale (`{ label: 'Menu' }` in English)
   */
  button?: DropdownMenuButtonProps
  /**
   * Data-mode menu entries: action items, `{ type: 'divider' }`, and
   * `{ type: 'section', title, items }`. Provide either `items` or the default
   * slot; `items` wins when both are present.
   */
  items?: DropdownMenuOption[]
  /**
   * Controlled open state. Pair it with `v-model:is-menu-open`. Left out, the
   * menu manages its own open state.
   */
  isMenuOpen?: boolean
  /**
   * Minimum width of the menu. A length grows for its content; an intrinsic
   * keyword such as `max-content` becomes the preferred width instead. Every
   * form is capped to the viewport. Defaults to the trigger's width, capped.
   */
  menuWidth?: number | string
  /**
   * Maximum height of the menu in pixels, for a menu that must fit its rows.
   * Lifts the default 300px cap; the viewport still bounds it.
   */
  menuMaxHeight?: number
  /**
   * Where the menu opens relative to the trigger. Flips when there is no room.
   * @default 'below'
   */
  placement?: LayerPlacement
  /**
   * `popover` anchors to the trigger. `bottom-sheet` uses a bottom sheet.
   * `adaptive` chooses the sheet on a compact touch surface and a popover
   * otherwise.
   * @default 'popover'
   */
  presentation?: DropdownMenuPresentation
  /**
   * How the menu aligns with the trigger along the placement axis.
   * @default 'start'
   */
  alignment?: LayerAlignment
  /**
   * Whether the trigger button shows a trailing chevron. Hidden by default on
   * an icon-only trigger.
   * @default true
   */
  hasChevron?: boolean
}

export interface DropdownMenuEmits {
  'update:isMenuOpen': [isOpen: boolean]
  /** Fired when the open state changes. */
  'openChange': [isOpen: boolean]
  /** Fired when the trigger is activated. */
  'click': []
}

export interface DropdownMenuSlots {
  /**
   * Compound menu content: items, checkbox rows, radio groups, dividers and
   * groups. Mutually exclusive with `items`.
   */
  default?: () => VNodeChild
  /**
   * The control the menu hangs off — an icon button, a chip, an avatar, a list
   * row. Spread the given props onto it.
   */
  trigger?: (props: DropdownMenuTriggerProps) => VNodeChild
  /**
   * Content above the rows and outside the menu: a filter field, a switch.
   * It keeps its own keys. Tab moves from it into the menu.
   */
  header?: () => VNodeChild
  /**
   * Content below the rows and outside the menu: a creation button, a note.
   * With a header or footer, Tab cycles inside the dialog and does not close it.
   */
  footer?: () => VNodeChild
}

export type {
  DropdownMenuCheckboxItemEmits,
  DropdownMenuCheckboxItemProps,
  DropdownMenuCheckboxItemSlots,
  DropdownMenuGroupProps,
  DropdownMenuGroupSlots,
  DropdownMenuItemEmits,
  DropdownMenuItemProps,
  DropdownMenuItemSlots,
  DropdownMenuItemVariant,
  DropdownMenuRadioGroupEmits,
  DropdownMenuRadioGroupProps,
  DropdownMenuRadioGroupSlots,
  DropdownMenuRadioItemProps,
  DropdownMenuRadioItemSlots,
  DropdownMenuSubMenuEmits,
  DropdownMenuSubMenuPresentation,
  DropdownMenuSubMenuProps,
  DropdownMenuSubMenuSlots,
} from './rowTypes.js'
