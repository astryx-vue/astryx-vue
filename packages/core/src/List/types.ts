import type { Component, MaybeRefOrGetter, VNodeChild } from 'vue'

/** 滑动露出的一侧。`leading` 是往行内末尾拖，`trailing` 是往行内开头拖。 */
export type ItemSwipeSide = 'leading' | 'trailing'

/** `reveal` 松手后停开；`commit` 越过阈值就滑出并触发最外侧，一侧只适合一个操作。 */
export type ItemSwipeBehavior = 'reveal' | 'commit'

/** 横滑露出的一个操作。数组里越靠后越靠外。 */
export interface ItemSwipeAction {
  id?: string
  label: string
  icon?: Component
  onActivate: () => void
  isDisabled?: boolean
  variant?: 'neutral' | 'accent' | 'destructive'
  /** 触发后行停在滑出的位置，不再弹回。行本身不会被删掉。 */
  hasRemoval?: boolean
}

export interface ItemSwipeActions {
  leading?: ItemSwipeAction[]
  trailing?: ItemSwipeAction[]
}

/**
 * Spacing density for list rows.
 *
 * `compact` uses 4px block padding, `balanced` uses 8px, and `spacious` uses
 * 12px block and inline padding.
 */
export type ListDensity = 'compact' | 'balanced' | 'spacious'

/**
 * The marker each row draws: `none`, a bullet (`disc` or `circle`), or a
 * number. `decimal` renders the list as an ordered `<ol>`.
 */
export type ListMarkerStyle = 'none' | 'disc' | 'decimal' | 'circle'

/**
 * Compensates for each row's built-in inline inset, so row content lines up
 * with sibling content such as a section heading.
 */
export type ListEdgeCompensation = 'inline'

/** Vertical alignment of the start/end content slots. */
export type ItemAlign = 'center' | 'start'

/** Spacing density of one row. */
export type ItemDensity = ListDensity

/** How the label and description sit together. */
export type ItemLayout = 'stacked' | 'inline'

/** The root element or component a row renders as. */
export type ItemElement = string | Component

/** A row's link target. */
export type ItemTarget = '_blank' | '_self'

/** Text accepted by the `label` and `description` props. */
export type ItemText = string | number

/** Primary text of a row. */
export type ItemLabel = ItemText

export interface ListProps {
  /**
   * Spacing density for the rows. Each `ListItem` inherits it unless the item
   * sets its own.
   * @default 'balanced'
   */
  density?: ListDensity
  /**
   * Whether to rule a divider between rows. The last row never draws one.
   * @default false
   */
  hasDividers?: boolean
  /**
   * Cancels each row's inline inset, up to the container padding published on
   * each edge, so row content moves toward a sibling heading's text.
   * @default undefined
   */
  edgeCompensation?: ListEdgeCompensation
  /**
   * Marker each row draws. `decimal` renders an `<ol>` instead of a `<ul>`.
   * @default 'none'
   */
  listStyle?: ListMarkerStyle
  /**
   * First number of an ordered list. Only used when `listStyle` is `decimal`.
   * @default 1
   */
  start?: number
  /**
   * Plain-text header rendered above the list and associated with it through
   * `aria-labelledby`. Use the `header` slot for rich content.
   */
  header?: string
}

export interface ListSlots {
  /** The `ListItem` rows. */
  default?: () => VNodeChild
  /** Content rendered above the list, associated with it through `aria-labelledby`. */
  header?: () => VNodeChild
}

export interface ListItemProps {
  /**
   * Primary text identifying the row. Use the `label` slot for rich content.
   */
  label?: ItemText
  /**
   * Secondary text below the label, such as a subtitle or supporting detail.
   * Use the `description` slot for rich content.
   */
  description?: ItemText
  /**
   * Spacing density. Defaults to the density of the surrounding `List`.
   */
  density?: ItemDensity
  /**
   * Click handler. Gives the row button semantics, so it becomes interactive
   * and gains hover and pressed states.
   */
  onClick?: (event: MouseEvent) => void
  /**
   * Ref to a nested control, such as a checkbox in the `startContent` slot,
   * that already carries the row's keyboard access and action. The row then
   * becomes an enlarged click and tap target that forwards surface clicks to
   * that control, and renders no button of its own, so the row adds no second
   * tab stop. Mutually exclusive with `onClick` and `href`, which are ignored
   * while it is set.
   */
  interactiveRef?: MaybeRefOrGetter<HTMLElement | null | undefined>
  /**
   * Link URL. Gives the row link semantics through an element inside the row.
   */
  href?: string
  /**
   * Link target, only used with `href`.
   */
  target?: ItemTarget
  /**
   * Link relationship tokens. `noopener` and `noreferrer` are merged in
   * automatically for `target="_blank"`.
   */
  rel?: string
  /**
   * Whether the row is disabled. A disabled row is inert and its content is
   * dimmed.
   * @default false
   */
  isDisabled?: boolean
  /**
   * Whether the row is currently selected. Exposed as `aria-selected` when the
   * row's role permits it, and as `aria-current` otherwise.
   * @default false
   */
  isSelected?: boolean
  /**
   * 触摸横滑露出的操作。鼠标不会开始这次拖动。
   * 每个操作还要在行自己的内容里能点到，否则键盘和鼠标够不着。
   */
  swipeActions?: ItemSwipeActions
  /**
   * 松手之后怎么收场。
   * @default 'reveal'
   */
  swipeBehavior?: ItemSwipeBehavior
}

export interface ListItemSlots {
  /** Leading content before the label: an icon, an avatar, a checkbox. */
  startContent?: () => VNodeChild
  /** Rich content replacing the `label` prop. */
  label?: () => VNodeChild
  /** Rich content replacing the `description` prop. */
  description?: () => VNodeChild
  /** Trailing content after the label area: a badge, a timestamp, a chevron. */
  endContent?: () => VNodeChild
}

export interface ItemProps extends ListItemProps {
  /**
   * The element or component the row renders as. Give a component only when
   * the row carries a `role`, so the parent owns keyboard access and the row
   * adds no second tab stop, and only when no control sits in `startContent`
   * or `endContent`.
   * @default 'div'
   */
  as?: ItemElement
  /**
   * Vertical alignment of the start and end content slots.
   * @default 'center'
   */
  align?: ItemAlign
  /**
   * How the label and description sit together. `stacked` puts the description
   * on its own line; `inline` keeps both on one line, with the description
   * ellipsizing first, so the row fits a fixed-height host.
   * @default 'stacked'
   */
  layout?: ItemLayout
  /**
   * Maximum lines before the label truncates with an ellipsis.
   * A string label truncates to one line when this is omitted.
   */
  labelLines?: number
  /**
   * Maximum lines before the description truncates with an ellipsis.
   * A string description truncates to one line when this is omitted.
   */
  descriptionLines?: number
  /**
   * Whether the row paints its highlighted state, which is the appearance
   * keyboard focus and hover use.
   * @default false
   */
  isHighlighted?: boolean
}

export interface ItemSlots extends ListItemSlots {
  /** Content rendered before `startContent`, such as a list bullet or counter. */
  marker?: () => VNodeChild
}
