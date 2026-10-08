import type { Component } from 'vue'
import type { ButtonSize, ButtonVariant } from '../Button/types.js'
import type { LayerAlignment, LayerPlacement } from '../layer/position.js'

/**
 * How the actions are presented.
 *
 * `popover` anchors the menu to the trigger, `bottom-sheet` presents it as a
 * thumb-reachable sheet, and `adaptive` keeps the anchored menu on
 * pointer-driven layouts while using the sheet at 768px and below when the
 * primary pointer is coarse.
 */
export type MoreMenuPresentation = 'popover' | 'bottom-sheet' | 'adaptive'

/** Resolved presentation, after `adaptive` has been decided. */
export type MoreMenuResolvedPresentation = 'popover' | 'bottom-sheet'

/**
 * An item icon: a CSS icon class — for example an UnoCSS class such as
 * `'i-carbon-copy'` — or a Vue component that draws the SVG. astryx-vue ships
 * no icons of its own.
 */
export type MoreMenuIcon = string | Component

/**
 * Visual treatment of a row. `destructive` paints the label, description, and
 * icon in the error color for actions that destroy something.
 */
export type MoreMenuItemVariant = 'default' | 'destructive'

/**
 * One action row.
 *
 * The row renders as an anchor when it carries an `href` and as a plain row
 * container otherwise.
 */
export interface MoreMenuItem {
  /**
   * Stable identity for the row within its level. Omit it and the row is keyed
   * by position, which is right for a fixed menu; set it when the items can
   * reorder, filter, or grow so a row keeps its DOM node — and therefore
   * keyboard focus — as the array changes around it.
   */
  id?: string
  /** Primary label of the row. */
  label: string
  /** Icon shown before the label. */
  icon?: MoreMenuIcon
  /** Secondary line shown below the label. */
  description?: string
  /** Whether the row is inert and announces itself as disabled. @default false */
  isDisabled?: boolean
  /** Visual treatment of the row. @default 'default' */
  variant?: MoreMenuItemVariant
  /**
   * Address the row navigates to. The row then renders as a real anchor, so a
   * modified click and a middle click keep their browser meaning.
   */
  href?: string
  /** Link target, only used with `href`. */
  target?: '_blank' | '_self'
  /** Link relationship tokens, only used with `href`. */
  rel?: string
  /** Trailing content shown at the end of the row, such as a shortcut hint. */
  endContent?: string
  /**
   * Whether activating the row closes the menu. Set `false` for an action that
   * reports its result on the row itself.
   * @default true
   */
  hasCloseOnSelect?: boolean
  /**
   * Nested entries. When present, the row becomes a submenu trigger: it opens a
   * flyout on a pointer layout and drills into the item's own view on a sheet.
   */
  items?: MoreMenuOption[]
  /**
   * Action of the row. It runs before a link row navigates, and is skipped for
   * a modified click, which the browser owns.
   */
  onClick?: (event: MouseEvent) => void
}

/** A hairline between groups of rows. */
export interface MoreMenuDivider {
  type: 'divider'
}

/** A titled group of rows. */
export interface MoreMenuSection {
  type: 'section'
  /** Stable identity for the group; see {@link MoreMenuItem.id}. */
  id?: string
  /** Heading of the group. Omit it for a group that only groups. */
  title?: string
  /** Rows of the group. */
  items: MoreMenuItem[]
}

/** One entry of the `items` array. */
export type MoreMenuOption = MoreMenuItem | MoreMenuDivider | MoreMenuSection

export interface MoreMenuProps {
  /** The actions, dividers, and groups the menu presents. */
  items: MoreMenuOption[]
  /**
   * Accessible name of the trigger button and of the menu itself, and the text
   * of the trigger's tooltip.
   * @default 'More options'
   */
  label?: string
  /**
   * Visual style of the trigger button.
   * @default 'ghost'
   */
  variant?: ButtonVariant
  /**
   * Size of the trigger button.
   * @default 'md'
   */
  size?: ButtonSize
  /**
   * Whether the trigger is disabled.
   * @default false
   */
  isDisabled?: boolean
  /**
   * Position of the anchored menu relative to the trigger. Logical: `start` and
   * `end` resolve against the menu's own direction, so RTL mirrors them.
   * @default 'below'
   */
  placement?: LayerPlacement
  /**
   * Alignment of the anchored menu along the placement axis. Use `end` to line
   * the menu up with the trigger's trailing edge, which is usually what an
   * overflow menu wants.
   * @default 'start'
   */
  alignment?: LayerAlignment
  /**
   * Surface used to present the actions.
   * @default 'popover'
   */
  presentation?: MoreMenuPresentation
  /**
   * Controlled open state, bound with `v-model:isMenuOpen`. Leave it unbound to
   * let the component own its state.
   */
  isMenuOpen?: boolean
  /**
   * Renders the menu surface in place instead of moving it to the top of the
   * document. The anchored presentation is then laid out where the component
   * sits, without viewport positioning. Intended for documentation previews and
   * for surfaces that must not escape their container.
   * @default false
   */
  isInline?: boolean
}

export interface MoreMenuEmits {
  /**
   * Emitted with the open state the trigger asks for. In uncontrolled usage it
   * reports the change; in controlled usage it is the request to update the
   * bound state.
   */
  openChange: [isOpen: boolean]
}

export interface MoreMenuSlots {
  /**
   * Artwork of the trigger. Replaces the default three-dot icon; the trigger
   * stays icon-only and keeps `label` as its accessible name.
   */
  icon?: () => unknown
}

/**
 * What one rendered row needs. Internal to the menu: consumers describe rows
 * with {@link MoreMenuItem} data.
 */
export interface MoreMenuRowProps {
  /** The row's data. */
  item: MoreMenuItem
  /** Identity of the row within its level, as rendered. */
  rowKey: string
  /** Id of the row element, which names a flyout it opens. */
  rowId: string
}

export interface MoreMenuPanelProps {
  /** The rows to render. */
  items: MoreMenuOption[]
  /** Whether the surface is shown. */
  isOpen: boolean
  /**
   * Element the surface is positioned against. A nested flyout is anchored to
   * its submenu row instead, and an inline surface is not positioned at all.
   */
  anchor?: HTMLElement | null
  /** Position relative to the anchor. @default 'below' */
  placement?: LayerPlacement
  /** Alignment along the placement axis. @default 'start' */
  alignment?: LayerAlignment
  /** Accessible name of the menu, used when no `ariaLabelledby` is given. */
  label?: string
  /** Id of the element that names the menu, used by submenu flyouts. */
  ariaLabelledby?: string
  /** Id of the menu element, so the trigger can point `aria-controls` at it. */
  id?: string
  /** Whether this panel is a flyout opened by a row of another level. @default false */
  isNested?: boolean
  /** Nesting depth, which raises the layer above its parent menu. @default 0 */
  level?: number
  /** Renders the surface in place instead of positioning it against the anchor. @default false */
  isInline?: boolean
  /**
   * Where focus lands when the surface opens. A keyboard open lands on the
   * first `first` row, an arrow-up open on the `last`, and a pointer open on
   * the `container` so no row reads as pre-selected.
   * @default 'none'
   */
  initialFocus?: MoreMenuInitialFocus
}

/**
 * Where focus lands when a surface opens: nowhere, on its first row, on its
 * last row, or on the surface container itself.
 */
export type MoreMenuInitialFocus = 'none' | 'first' | 'last' | 'container'

export interface MoreMenuPanelEmits {
  /** A row asked to close the whole menu. */
  close: []
  /** A nested flyout asked to close itself and return focus to its row. */
  closeLevel: []
  /** The surface finished its leave animation and can be unmounted. */
  settled: []
}

export interface MoreMenuSheetProps {
  /** The rows of the sheet's root view. */
  items: MoreMenuOption[]
  /** Whether the sheet is shown. */
  isOpen: boolean
  /** Accessible name of the dialog. */
  label: string
  /** Label of the row that returns from a drilled-in view. @default 'Back' */
  backLabel?: string
  /** Id of the dialog element, so the trigger can point `aria-controls` at it. */
  id?: string
  /** Where focus lands when the sheet opens. @default 'none' */
  initialFocus?: MoreMenuInitialFocus
}

export interface MoreMenuSheetEmits {
  /** The sheet asked to close, for example on Escape or a press on the scrim. */
  close: []
}

/**
 * What one sheet row needs. Internal to the sheet: consumers describe rows with
 * {@link MoreMenuItem} data.
 */
export interface MoreMenuSheetRowProps {
  /** The row's data. */
  item: MoreMenuItem
  /** Identity of the row within the view it is rendered in. */
  rowId: string
}

export interface MoreMenuSheetRowEmits {
  /** The row acted. */
  select: [item: MoreMenuItem, event: MouseEvent]
  /** The row opens a view of its own, named by the identity of the row. */
  drillIn: [item: MoreMenuItem, rowId: string]
}
