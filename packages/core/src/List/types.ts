import type { Component, MaybeRefOrGetter, VNodeChild } from 'vue'
import type { AnimatedLayout } from '../composables/useAnimatedLayout.js'
import type { Reorderable } from '../reorderable/createReorderable.js'
import type { ItemSwipeActionVariant, ItemSwipeBehavior, Swipe } from '../Swipe/swipeHost.js'

export type { ItemSwipeBehavior }

/** 滑动露出的一侧。`leading` 是往行内末尾拖，`trailing` 是往行内开头拖。 */
export type ItemSwipeSide = 'leading' | 'trailing'

/**
 * 横滑露出的一个操作。数组里越靠后越靠外。
 * @deprecated 改用 `SwipeAction`：它的 `id` 必填，`onActivate` 会收到操作的 `id` 和行的 `itemKey`。
 */
export interface ItemSwipeAction {
  id?: string
  label: string
  icon?: Component
  onActivate: () => void | Promise<void>
  isDisabled?: boolean
  /** @default 'accent' */
  variant?: ItemSwipeActionVariant
  /**
   * 触发后行停在滑出的位置，不再弹回。行本身不会被删掉。
   * @default false
   */
  hasRemoval?: boolean
}

/** @deprecated 改用 `CreateSwipeOptions`。 */
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
 * Where each row's text, dividers, and hover and selection backgrounds sit,
 * relative to the list's edges and the padding of the container around it.
 */
export type ListEdge = 'padded' | 'flush' | 'outset' | 'bleed'

/**
 * Compensates for each row's built-in inline inset, so row content lines up
 * with sibling content such as a section heading.
 * @deprecated Use `edge="outset"`, which selects the same geometry.
 */
export type ListEdgeCompensation = 'inline'

/**
 * Vertical alignment of the start/end content slots. `center` centers each
 * slot on the whole text block; `start` lines up slot tops with the text's
 * top; `first-line` centers each slot on the label's first line.
 */
export type ItemAlign = 'center' | 'start' | 'first-line'

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
   * The handle from `useAnimatedLayout({ containerRef })`. With it, the list
   * animates its row changes on one shared motion, under every pointer. An
   * inserted row enters, and a removed row collapses in place. A row that
   * crosses rows moving the other way rides above them. The rows after a
   * change, and the content after the list up to that container, glide to
   * their new places. A row's identity is its `itemKey`, so a row without one
   * changes at once. Without a handle the list changes at once.
   */
  animatedLayout?: AnimatedLayout
  /**
   * Makes the rows reorderable, with the object `createReorderable` makes.
   * Each ListItem with an `itemKey` gets a reorder handle at its end. One the
   * object's `isReorderable` rejects keeps its place. Each committed move
   * calls its `onReorder` once with the row's key and its index after the
   * move. Apply it by rendering the rows in their new order. A drop on the
   * starting place, a cancel, or a move the order does not take changes
   * nothing.
   *
   * On a touch screen, a finger held still on a handle for a moment picks up
   * its row. A flick on it still scrolls. The row stays in its place, dimmed,
   * while a copy of it follows the finger. An accent line marks where it
   * would land. The other rows stay still, the list scrolls near the edges,
   * and on release the rows rearrange. A mouse drags a handle at once, the
   * same way.
   *
   * Without a drag, activating a handle (a click, Space or Enter) turns on
   * reorder mode for its row. Each arrow key moves it a place at once,
   * reported and announced with its place and neighbours. Escape or another
   * activation ends the mode, keeping the moves. While it is on, a hint
   * anchored to the handle shows the moves and Done as buttons, so taps alone
   * can reorder.
   */
  reorderable?: Reorderable
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
   * Where each row's text, dividers, and hover and selection backgrounds sit,
   * relative to the list's edges and the padding of the container around it.
   *
   * `padded` keeps the row's own inline padding. `flush` removes it, so text
   * starts on the line of a heading above the list and lines and backgrounds
   * stop at the text. `outset` puts text on that line and lets lines and
   * backgrounds reach into the container's padding. `bleed` puts text on the
   * container's padding line and runs lines and backgrounds to its edges with
   * square corners, like table rows.
   *
   * A row's first content — its marker, icon, or avatar, otherwise its label —
   * is what lines up with the heading. `outset` and `bleed` read the padding
   * published by the nearest container that shares it: a Card, Section,
   * BottomSheet, padded ScrollableArea, or a Layout region. Place the list directly in that container's padding;
   * padding added in between by Stack, Center, or your own styles is not
   * counted. With no such container they look like `padded`.
   * @default 'padded'
   */
  edge?: ListEdge
  /**
   * @deprecated Use `edge="outset"`, which this sets. `edge` wins when both
   * are set.
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
   * Vertical alignment of the start and end content slots. `center` centers
   * each slot on the whole text block; `start` lines up slot tops with the
   * text's top; `first-line` centers each slot on the label's first line, so a
   * small mark stays level with the first line of a wrapped label. A slot
   * taller than that line moves the text down.
   * @default 'center'
   */
  align?: ItemAlign
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
   * The row's item key, a string or a number from the data. It is the row's
   * identity for the list's `animatedLayout`, so a row without one changes at
   * once. It is separate from Vue's `key`, which stays Vue's own.
   */
  itemKey?: string | number
  /**
   * 行的横滑操作，由一次 `createSwipe` 调用配好：横向拖动在每一侧露出的动词，声明成数据，
   * 行据此画出面板。手指、笔或触控板的双指横滑把行拖到一边、露出这一侧的面板；鼠标拖动和鼠标
   * 滚轮不会，偏竖直的拖动仍归滚动。手势只是触屏的快捷方式，永远不是行通往某个动词的唯一入口：
   * 每个操作都要在行自己的内容里也能点到（菜单或 `endContent` 里的按钮），否则键盘和鼠标用户够不着。
   * 开着的行在点它自己的内容（不激活任何东西）、按在别处、焦点在行外时列表或页面滚动、按 Escape 时合上。
   *
   * 只在 role 允许可交互后代的行上生效：`listitem` 或没有 role 的行；`option`、`menuitem*`、
   * 作为内部控件放大点击区的行和禁用的行不生效。装着行的元素要在行内方向裁剪
   * （`overflow-inline: clip`）：`List` 已经这样做了，别的容器自己加一次。
   */
  swipe?: Swipe
  /**
   * @deprecated 改传 `swipe`，写成 `createSwipe({ leading, trailing })`。仍可用，行为和 `swipe` 一致；
   * 设置了 `swipe` 时忽略。
   */
  swipeActions?: ItemSwipeActions
  /**
   * @deprecated 改在 `createSwipe` 的选项里传 `swipeBehavior`。设置了 `swipe` 时忽略。
   * @default 'reveal'
   */
  swipeBehavior?: ItemSwipeBehavior
}

export interface ListItemSlots {
  /** Content before the label, inside the row: an icon, an avatar, a checkbox. */
  startContent?: () => VNodeChild
  /** Rich content replacing the `label` prop. */
  label?: () => VNodeChild
  /** Rich content replacing the `description` prop. */
  description?: () => VNodeChild
  /** Content after the label and description, inside the row: a badge, a timestamp, a chevron. */
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
