/**
 * 逻辑轴滚动的几何小工具。`inline` 是文字排列的方向，`block` 是行堆叠的方向；
 * 横排时它们是 x 和 y，竖排时反过来，RTL 和某些竖排模式下起点还会反向。
 */

export const SCROLL_OVERFLOW_TOLERANCE = 1

export type LogicalScrollAxis = 'inline' | 'block'
export type PhysicalScrollAxis = 'x' | 'y'

export interface LogicalAxisMapping {
  inline: PhysicalScrollAxis
  block: PhysicalScrollAxis
  inlineReversed: boolean
  blockReversed: boolean
}

export interface MeasuredScrollAxisState {
  isScrollable: boolean
  atStart: boolean
  atEnd: boolean
}

export const INACTIVE_AXIS_STATE: MeasuredScrollAxisState = Object.freeze({
  isScrollable: false,
  atStart: true,
  atEnd: true,
})

export const DEFAULT_AXIS_MAPPING: LogicalAxisMapping = Object.freeze({
  inline: 'x',
  block: 'y',
  inlineReversed: false,
  blockReversed: false,
})

export function getLogicalAxisMapping(writingMode: string, direction: string): LogicalAxisMapping {
  const mode = writingMode.toLowerCase()
  const isVertical = mode.startsWith('vertical') || mode.startsWith('sideways')
  const isRtl = direction === 'rtl'
  if (!isVertical)
    return { inline: 'x', block: 'y', inlineReversed: isRtl, blockReversed: false }
  // sideways-lr 的自然行内方向是从下到上，其余竖排模式是从上到下；direction 再各自反一次。
  return {
    inline: 'y',
    block: 'x',
    inlineReversed: mode === 'sideways-lr' ? !isRtl : isRtl,
    blockReversed: mode.endsWith('-rl'),
  }
}

export function mappingsEqual(a: LogicalAxisMapping, b: LogicalAxisMapping): boolean {
  return a.inline === b.inline
    && a.block === b.block
    && a.inlineReversed === b.inlineReversed
    && a.blockReversed === b.blockReversed
}

export function axisStatesEqual(a: MeasuredScrollAxisState, b: MeasuredScrollAxisState): boolean {
  return a.isScrollable === b.isScrollable && a.atStart === b.atStart && a.atEnd === b.atEnd
}

/**
 * 能不能量。没连在文档上、`display: none`、或者宽高为 0 的视口答「不知道」，
 * 不是「放得下」：调用方要保留上一次的结果，等下一次有效的信号再量。
 */
export function isMeasurable(element: HTMLElement, style: CSSStyleDeclaration): boolean {
  return element.isConnected
    && style.display !== 'none'
    && element.clientWidth > 0
    && element.clientHeight > 0
}

/** 这个 overflow 值能不能滚。`hidden`、`clip`、`visible` 都不能。 */
export function isScrollCapableOverflow(value: string): boolean {
  return value === 'auto' || value === 'scroll' || value === 'overlay'
}

function extent(element: HTMLElement, axis: PhysicalScrollAxis): { client: number, content: number, offset: number } {
  if (axis === 'x')
    return { client: element.clientWidth, content: element.scrollWidth, offset: element.scrollLeft }
  return { client: element.clientHeight, content: element.scrollHeight, offset: element.scrollTop }
}

/** 这条逻辑轴上内容是不是比盒子大。 */
export function measureOverflow(element: HTMLElement, axis: LogicalScrollAxis, mapping: LogicalAxisMapping): boolean {
  const box = extent(element, mapping[axis])
  return box.content > box.client + SCROLL_OVERFLOW_TOLERANCE
}

/**
 * 这条逻辑轴的滚动状态。没被请求、计算出来的 overflow 不能滚、或者多出来的不到 1px，都算不可滚动。
 */
export function measureScrollAxis(
  element: HTMLElement,
  axis: LogicalScrollAxis,
  mapping: LogicalAxisMapping,
  isRequested: boolean,
  style: CSSStyleDeclaration,
): MeasuredScrollAxisState {
  const physical = mapping[axis]
  const box = extent(element, physical)
  const max = Math.max(0, box.content - box.client)
  const overflow = physical === 'x' ? style.overflowX : style.overflowY
  if (!isRequested || !isScrollCapableOverflow(overflow) || max <= SCROLL_OVERFLOW_TOLERANCE)
    return INACTIVE_AXIS_STATE
  const reversed = axis === 'inline' ? mapping.inlineReversed : mapping.blockReversed
  const raw = Math.abs(box.offset)
  const offset = Math.min(max, Math.max(0, reversed ? max - raw : raw))
  return {
    isScrollable: true,
    atStart: offset <= SCROLL_OVERFLOW_TOLERANCE,
    atEnd: offset >= max - SCROLL_OVERFLOW_TOLERANCE,
  }
}
