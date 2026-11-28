/**
 * @file swipeRelease.ts
 * @input UIKit 的横滑常量表（motion/uikit/swipeActions.ts）
 * @output 横滑的纯规则：松手落在哪（resolveRelease）、确认点（confirmPoint、confirmedOffset）、
 *   一侧的几何和停靠点、确认进度（confirmOf），以及状态类型和面板读的 CSS 自定义属性名
 * @position 横滑模块的纯函数层，不碰 DOM。swipeDragModel.ts 和 useSwipeAction.ts 用它，
 *   swipeRelease.test.ts 直接测它。
 */

import { swipeActions as SWIPE } from '../motion/uikit/swipeActions'

// UIKit 的列表行只在确认过的全滑后触发最外侧操作：手指拖过了确认点，抬起时仍在点外，
// 速度不论。确认后又退回来的横滑合上行。其他松手先看速度：达到 `releaseVelocity` 的
// 顺着动的方向走（往开的方向就停开，往合的方向就合上）；更慢的看位置，和开宽的
// `openFraction` 比。所以一甩即使拖得很短也会停开、从哪儿都能甩合，而且永远不触发。
// 这里的位移和速度都是逻辑方向：朝正在露出的那一侧为正，不管书写方向。

/** 横滑怎么收场（`createSwipe` 的 `swipeBehavior`）。 */
export type SwipeReleaseBehavior = 'reveal' | 'commit'

/** 松手落在哪。 */
export type SwipeRelease = 'closed' | 'open' | 'perform'

/**
 * 松手落在哪。`travel`（px，≥ 0）和 `velocity`（px/s）是逻辑方向，朝正在露出的一侧为正。
 * `isConfirmed`：抬起时手指在确认点外；`wasConfirmed`：这次横滑中曾经越过确认点。
 * 确认的松手触发最外侧操作，速度不论；`commit` 下别的都不触发、也不停开；确认后退回的
 * 横滑两种方式下都合上。其余 `reveal` 的松手：达到 `releaseVelocity` 的，往开就开、往合就合；
 * 更慢的过开宽的 `openFraction` 就开，不到就合。
 */
export function resolveRelease({
  travel,
  velocity,
  openWidth,
  isConfirmed,
  wasConfirmed,
  behavior,
}: {
  travel: number
  velocity: number
  openWidth: number
  isConfirmed: boolean
  wasConfirmed: boolean
  behavior: SwipeReleaseBehavior
}): SwipeRelease {
  if (isConfirmed)
    return 'perform'
  if (behavior === 'commit' || wasConfirmed)
    return 'closed'
  if (velocity >= SWIPE.releaseVelocity)
    return 'open'
  if (velocity <= -SWIPE.releaseVelocity)
    return 'closed'
  return travel >= SWIPE.openFraction * openWidth ? 'open' : 'closed'
}

/**
 * 全滑确认的位置：从开宽往确认偏移走 `confirmFraction` 的路，且不短于开宽。
 * 确认偏移是行宽减 `confirmInset`。
 */
export function confirmPoint(openWidth: number, rowWidth: number): number {
  const confirmAt = rowWidth - SWIPE.confirmInset
  return Math.max(openWidth, openWidth + (confirmAt - openWidth) * SWIPE.confirmFraction)
}

/** 全滑确认后行的偏移（UIKit 的 `confirmationThreshold`）。 */
export function confirmedOffset(rowWidth: number): number {
  return rowWidth - SWIPE.confirmInset
}

export type SwipeSide = 'leading' | 'trailing'

export type SwipePhase
  /** 静止，合着。 */
  = | 'idle'
  /** 拖动在带着行走。 */
    | 'dragging'
  /** 正往松手、点按或合上送去的地方落。 */
    | 'settling'
  /** 停开，这一侧的面板可以点（只有 `reveal`）。 */
    | 'resting'
  /** 带 `hasRemoval` 的操作触发后停在滑出的位置。 */
    | 'held'

export interface SwipeState {
  phase: SwipePhase
  /** 面板已露出或将要露出的一侧。 */
  side: SwipeSide
  /** 全滑已确认：现在松手就触发最外侧操作。 */
  isArmed: boolean
  /**
   * 盖满这一侧面板的操作，按它在这一侧的序号。全滑确认后是最外侧那个，直到行回到原位或
   * 停在外面；被点的操作在行回来或停在外面的过程中盖满面板。
   */
  cover: number | null
  /** 正在进行的落位落在哪（只在 `settling` 时有）。 */
  landing?: 'idle' | 'resting' | 'held'
}

export const IDLE_STATE: SwipeState = Object.freeze({
  cover: null,
  isArmed: false,
  phase: 'idle',
  side: 'leading',
})

/**
 * 行是开着的：停开，或正在落向停开。UIKit 从让行停开的那次松手起就算开着，不等它停稳。
 * 开着的行在点它的内容、指针落在外面、滚动或按 Escape 时合上；它的根不接按压。
 */
export function isSwipeOpen(state: SwipeState): boolean {
  return state.phase === 'resting' || (state.phase === 'settling' && state.landing === 'resting')
}

/** 行的位移（物理 px），写在根上，每个部件都读它。 */
export const SWIPE_TRAVEL_PROPERTY = '--_item-swipe-travel'
/** 全滑确认了多少（0 到 1），写在根上。 */
export const SWIPE_CONFIRM_PROPERTY = '--_item-swipe-confirm'
/**
 * 一侧的几何，拖动开始时写在这一侧的窗口上：操作贴着轨道的位置（物理 px，让它们停在外缘）、
 * 这一侧的物理符号（在左边是 +1）、开宽（px），以及确认的全滑里最外侧操作的滑动量（物理 px）。
 */
export const SWIPE_PIN_PROPERTY = '--_item-swipe-pin'
export const SWIPE_SIGN_PROPERTY = '--_item-swipe-sign'
export const SWIPE_OPEN_PROPERTY = '--_item-swipe-open'
export const SWIPE_SLIDE_PROPERTY = '--_item-swipe-slide'

/** 低于这个值，行就算静止合着（px）。 */
export const AT_REST_PX = 0.5

export interface SwipeLayout {
  side: SwipeSide
  /** 行内末尾在右边（LTR）是 +1，RTL 是 −1。 */
  inlineSign: 1 | -1
  /** 这一侧操作的自然宽度之和：行开多宽。 */
  openWidth: number
  /** 最外侧操作的宽度。 */
  outerWidth: number
  /** 行宽。 */
  rowWidth: number
}

/** 从合着的行开始的拖动露出哪一侧：朝行内末尾是 leading。 */
export function sideFor(dx: number, inlineSign: 1 | -1): SwipeSide {
  return dx * inlineSign > 0 ? 'leading' : 'trailing'
}

/** 这一侧的面板在物理左边是 +1，在右边是 −1。 */
export function physicalSign(side: SwipeSide, inlineSign: 1 | -1): 1 | -1 {
  return side === 'leading' ? inlineSign : inlineSign === 1 ? -1 : 1
}

/** 操作触发、行离开时行滑出多远（逻辑 px）。 */
export function outTravel(layout: SwipeLayout): number {
  return layout.rowWidth + SWIPE.slideOutOvershoot
}

/** 哪个停靠点：原位、停开、滑出。 */
export type Stop = 'rest' | 'open' | 'out'

function stopValue(layout: SwipeLayout, stop: Stop): number {
  const sign = physicalSign(layout.side, layout.inlineSign)
  if (stop === 'rest')
    return 0
  return stop === 'open' ? sign * layout.openWidth : sign * outTravel(layout)
}

/** 一侧的停靠点，物理 px，升序：原位、开宽、滑出行边之外（全滑）。 */
export function stopsOf(layout: SwipeLayout): number[] {
  return (['rest', 'open', 'out'] as const).map(stop => stopValue(layout, stop)).sort((a, b) => a - b)
}

export function stopIndex(layout: SwipeLayout, stop: Stop): number {
  return stopsOf(layout).indexOf(stopValue(layout, stop))
}

export function stopAt(layout: SwipeLayout, index: number): Stop {
  const value = stopsOf(layout)[index] ?? 0
  if (value === 0)
    return 'rest'
  return Math.abs(value) === layout.openWidth ? 'open' : 'out'
}

/**
 * 某个位移（物理 px）下全滑的确认进度：确认点之前是 0，到确认偏移是 1，中间和行同步。
 * 所以行跑到前面时最外侧操作盖满空出来的地方，行退回时又让出来。
 */
export function confirmProgress(layout: SwipeLayout, x: number): number {
  const travel = x * physicalSign(layout.side, layout.inlineSign)
  const from = confirmPoint(layout.openWidth, layout.rowWidth)
  const to = confirmedOffset(layout.rowWidth)
  if (to <= from)
    return travel >= to ? 1 : 0
  return Math.min(1, Math.max(0, (travel - from) / (to - from)))
}
