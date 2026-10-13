import type { Component, VNodeChild } from 'vue'
import type { ButtonProps } from '../Button/types.js'
import type { LayerAlignment, LayerPlacement } from '../layer/position.js'
import type { ItemTarget } from '../List/types.js'

/** Size of the menu, derived from the trigger button's size. */
export type DropdownMenuSize = 'sm' | 'md' | 'lg'

/**
 * Where the menu opens.
 *
 * `popover` hangs off the trigger. `bottom-sheet` rises from the bottom edge.
 * `adaptive` uses the sheet only on a compact touch surface.
 */
export type DropdownMenuPresentation = 'adaptive' | 'bottom-sheet' | 'popover'

/** Visual variant of one menu row. */
export type DropdownMenuItemVariant = 'default' | 'destructive'

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
  'aria-haspopup': 'menu'
  'aria-expanded': boolean
  'aria-controls': string
  /** Toggles the menu. */
  'onClick': (event: MouseEvent) => void
  /** Opens on Enter, Space, ArrowDown and ArrowUp; while open, ArrowDown walks into the menu. */
  'onKeyDown': (event: KeyboardEvent) => void
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
  items: DropdownMenuItemData[]
}

/** One entry of the `items` data API. */
export type DropdownMenuOption = DropdownMenuItemData | DropdownMenuDividerData | DropdownMenuSection

export interface DropdownMenuProps {
  /**
   * The design system's own button as the trigger. Ignored when the `trigger`
   * slot renders a control instead.
   * @default { label: 'Menu' }
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
   * Compound menu content: `DropdownMenuItem`, `DropdownMenuDivider` and
   * `DropdownMenuGroup`. Mutually exclusive with `items`.
   */
  default?: () => VNodeChild
  /**
   * The control the menu hangs off — an icon button, a chip, an avatar, a list
   * row. Spread the given props onto it.
   */
  trigger?: (props: DropdownMenuTriggerProps) => VNodeChild
}

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
