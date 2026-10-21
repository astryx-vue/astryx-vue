import type { Component, VNodeChild } from 'vue'
import type { DropdownMenuSubMenuPresentation } from '../DropdownMenu/types.js'

/**
 * Density of the menu rows, from the tightest to the most spacious.
 *
 * The size only changes the rows' block padding; the panel, the radius, and
 * the type stay the same in every size.
 */
export type ContextMenuSize = 'sm' | 'md' | 'lg'

/**
 * The element the trigger area renders as.
 *
 * `div` is a block that hugs its content; `span` is an inline wrapper, so a
 * reference inside running prose can own a context menu without breaking the
 * text flow.
 */
export type ContextMenuTriggerElement = 'div' | 'span'

/**
 * How the actions are presented.
 *
 * `popover` anchors a menu to the pointer, `bottom-sheet` presents a
 * thumb-reachable sheet, and `adaptive` uses the sheet at 768px and below
 * when the primary pointer is coarse.
 */
export type ContextMenuPresentation = 'popover' | 'bottom-sheet' | 'adaptive'

/** A menu width as a number of pixels or any CSS length. */
export type ContextMenuWidth = number | string

/**
 * Visual variant of a row. `destructive` paints the label, the description,
 * and the icon in the error color for an action that cannot be undone.
 */
export type ContextMenuVariant = 'default' | 'destructive'

/** Where a link row navigates. */
export type ContextMenuItemTarget = '_blank' | '_self'

/**
 * The artwork of a row: a CSS icon class, or a Vue component that draws the
 * SVG. astryx-vue ships no icons of its own.
 */
export type ContextMenuItemIcon = string | Component

/**
 * One action row in the `items` data API.
 *
 * Every field is also a `ContextMenuItem` prop, so the data API and the
 * compound API describe the same row and cannot drift.
 */
export interface ContextMenuItemData {
  /**
   * Discriminant of the data API. An action row leaves it unset; a divider or
   * a section sets it.
   */
  type?: undefined
  /**
   * Stable identity for the row. Rows are keyed by position when it is
   * omitted, which is correct for a fixed menu; set it when `items` can
   * reorder or filter so a row keeps its DOM node, and its focus, as the
   * array changes around it.
   */
  id?: string
  /** Primary label of the row. */
  label: string
  /** Icon rendered before the label. */
  icon?: ContextMenuItemIcon
  /** Secondary text rendered below the label. */
  description?: string
  /**
   * Plain text rendered after the label area. Rich trailing content needs the
   * compound `ContextMenuItem` and its `endContent` slot.
   */
  endContent?: string | number
  /** Called when the row is activated, with the click that activated it. */
  onClick?: (event: MouseEvent) => void
  /** Whether the row is disabled. @default false */
  isDisabled?: boolean
  /** Visual variant of the row. @default 'default' */
  variant?: ContextMenuVariant
  /**
   * Whether activating the row closes the menu. Set it to `false` for an
   * action that reports its result on the row itself.
   * @default true
   */
  hasCloseOnSelect?: boolean
  /** Address the row navigates to; the row then renders as an anchor. */
  href?: string
  /** Link target of a link row. */
  target?: ContextMenuItemTarget
  /** Link relationship of a link row. */
  rel?: string
  /**
   * Nested entries. When present, the row becomes a submenu that reveals
   * these entries in a flyout beside it instead of acting itself.
   */
  items?: ContextMenuOption[]
}

/** A checkbox row of the `items` data API. The checked state is controlled. */
export interface ContextMenuCheckboxData {
  type: 'checkbox'
  id?: string
  label: string
  icon?: ContextMenuItemIcon
  description?: string
  /** Whether the row is checked. */
  checked: boolean
  /** @default false */
  isDisabled?: boolean
  /**
   * Whether toggling closes the menu. Checkbox rows stay open.
   * @default false
   */
  hasCloseOnSelect?: boolean
  /** Called with the next checked state. */
  onChange?: (checked: boolean) => void
}

/** One option inside a radio group of the `items` data API. */
export interface ContextMenuRadioOptionData {
  id?: string
  value: string
  label: string
  icon?: ContextMenuItemIcon
  description?: string
  /** @default false */
  isDisabled?: boolean
}

/**
 * A single-select radio group of the `items` data API.
 * Choosing a value closes the menu unless `hasCloseOnSelect` is false.
 */
export interface ContextMenuRadioData {
  type: 'radio'
  id?: string
  /** Accessible name of the group. */
  label: string
  /** Selected value. Unset when nothing is selected. */
  value?: string
  /** @default true */
  hasCloseOnSelect?: boolean
  items: ContextMenuRadioOptionData[]
  onChange?: (value: string) => void
}

/** A row the data API can place inside a section or at the top level. */
export type ContextMenuEntry = ContextMenuItemData | ContextMenuCheckboxData | ContextMenuRadioData

/** A horizontal rule between groups of rows. */
export interface ContextMenuDividerData {
  type: 'divider'
}

/** A titled group of rows. */
export interface ContextMenuSection {
  type: 'section'
  /** Stable identity for the group. */
  id?: string
  /** Heading shown above the group's rows and used as the group's name. */
  title?: string
  /** The actions of the group. */
  items: ContextMenuEntry[]
}

/** One entry of the `items` data API. */
export type ContextMenuOption = ContextMenuEntry | ContextMenuDividerData | ContextMenuSection

export interface ContextMenuProps {
  /**
   * The menu entries. Each entry is an action row, a divider, or a section;
   * a row with nested `items` becomes a submenu. Omit it and use the
   * `content` slot for a menu the caller composes itself.
   */
  items?: ContextMenuOption[]
  /**
   * Width of the menu panel. Numbers are interpreted as pixels. The panel is
   * still capped to the viewport, so a width wider than the screen shrinks
   * instead of overflowing.
   * @default undefined (the panel is at least 160px wide and sizes to its rows)
   */
  menuWidth?: ContextMenuWidth
  /**
   * Density of the menu rows.
   * @default 'md'
   */
  size?: ContextMenuSize
  /**
   * Accessible name of the menu panel, announced when it opens.
   * @default the active locale (`Context menu` in English)
   */
  label?: string
  /**
   * When true, the native browser context menu is left untouched and the
   * menu never opens.
   * @default false
   */
  isDisabled?: boolean
  /**
   * The element the trigger area renders as.
   * @default 'div'
   */
  triggerAs?: ContextMenuTriggerElement
  /**
   * How the menu is presented.
   * @default 'popover'
   */
  presentation?: ContextMenuPresentation
  /**
   * Open state of the menu. Bind it with `v-model:is-open` to control the
   * menu from the outside; leave it unbound and the menu manages its own
   * state, opening on right-click, the context-menu key, or a long press.
   * @default undefined
   */
  isOpen?: boolean
}

export interface ContextMenuEmits {
  /** Fired when the menu opens or closes. */
  'openChange': [isOpen: boolean]
  /** Fired when a row of the `items` data API is activated. */
  'select': [item: ContextMenuItemData, event: MouseEvent]
  /** Fired by `v-model:isOpen`. */
  'update:isOpen': [isOpen: boolean]
}

export interface ContextMenuSlots {
  /** The trigger area: right-click on this content to open the menu. */
  default?: () => VNodeChild
  /**
   * Custom panel in place of `items`. Compose it from the menu rows, including
   * checkbox and radio rows, when the menu has to stay open across several
   * toggles or the rows depend on state. Keyboard handling still belongs to
   * the menu.
   */
  content?: () => VNodeChild
}

export interface ContextMenuItemProps {
  /** Icon rendered before the label. */
  icon?: ContextMenuItemIcon
  /** Primary label of the row. */
  label?: string | number
  /** Secondary text rendered below the label. */
  description?: string
  /**
   * Plain text rendered after the label area. Use the `endContent` slot for
   * rich trailing content such as a badge.
   */
  endContent?: string | number
  /** Address the row navigates to; the row then renders as an anchor. */
  href?: string
  /** Link target, only used with `href`. */
  target?: ContextMenuItemTarget
  /** Link relationship, only used with `href`. */
  rel?: string
  /**
   * Whether the row is disabled. A disabled row is dimmed, skipped by arrow
   * keys and typeahead, and cannot be activated.
   * @default false
   */
  isDisabled?: boolean
  /**
   * Whether activating the row closes the menu.
   * @default true
   */
  hasCloseOnSelect?: boolean
  /**
   * Visual variant of the row.
   * @default 'default'
   */
  variant?: ContextMenuVariant
}

export interface ContextMenuItemEmits {
  /** Fired when the row is activated, with the click that activated it. */
  click: [event: MouseEvent]
}

export interface ContextMenuItemSlots {
  /** Rich content replacing the `label` prop. */
  label?: () => VNodeChild
  /** Leading content replacing the `icon` prop. */
  icon?: () => VNodeChild
  /** Rich content replacing the `description` prop. */
  description?: () => VNodeChild
  /** Trailing content after the label area. */
  endContent?: () => VNodeChild
}

export interface ContextMenuDividerProps {
  /**
   * The divider's weight. `subtle` is the hairline drawn between menu rows.
   * @default 'subtle'
   */
  variant?: 'subtle' | 'strong'
}

export interface ContextMenuGroupProps {
  /**
   * Heading shown above the group's rows and used as the group's accessible
   * name. Omit it for an unnamed group.
   */
  title?: string
}

export interface ContextMenuGroupSlots {
  /** The group's rows: menu items, dividers, submenus. */
  default?: () => VNodeChild
}

export interface ContextMenuSubMenuProps {
  /** Icon rendered before the label. */
  icon?: ContextMenuItemIcon
  /** Primary label of the row. */
  label?: string | number
  /** Secondary text rendered below the label. */
  description?: string
  /**
   * Whether the row is disabled and can neither be opened nor activated.
   * @default false
   */
  isDisabled?: boolean
  /** The entries revealed in the flyout. */
  items?: ContextMenuOption[]
  /**
   * Show a spinner in place of the caret while the flyout's rows are loading.
   * @default false
   */
  hasSpinner?: boolean
  /**
   * Minimum width of the flyout. Capped to the viewport. Defaults to the
   * flyout's content, at least 160px.
   */
  menuWidth?: number | string
  /**
   * `flyout` opens beside the row. `drill-in` replaces the menu's rows and
   * adds a Back row. `adaptive` drills in on a compact touch surface.
   * @default 'adaptive'
   */
  presentation?: DropdownMenuSubMenuPresentation
}

export interface ContextMenuSubMenuEmits {
  /** Fired when the flyout opens or closes. */
  openChange: [isOpen: boolean]
  /** Fired when a row inside the flyout is activated, re-emitted upward. */
  select: [item: ContextMenuItemData, event: MouseEvent]
}

export interface ContextMenuSubMenuSlots {
  /** Rich content replacing the `label` prop. */
  label?: () => VNodeChild
  /** Leading content replacing the `icon` prop. */
  icon?: () => VNodeChild
  /** Rich content replacing the `description` prop. */
  description?: () => VNodeChild
  /** Trailing content replacing the chevron. */
  endContent?: () => VNodeChild
  /** The flyout's rows, replacing the `items` prop. */
  default?: () => VNodeChild
}

export interface ContextMenuItemsProps {
  /** The entries to render. */
  items: ContextMenuOption[]
}
