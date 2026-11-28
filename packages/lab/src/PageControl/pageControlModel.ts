/**
 * @file pageControlModel.ts
 * @input PageControl 的实测表（pageControlTable.ts）
 * @output 页码指示的纯数学：控件尺寸、指示点窗口、点按往哪翻、拖动停在哪页、越界连翻的间隔
 * @position lab PageControl 的数学部分，不碰 DOM。坐标沿着行，单位 px，从窗口第一个槽位的
 *   中心量起；从右往左时由调用方先镜像。
 */

import { pageControl } from './pageControlTable'

const PC = pageControl

/**
 * 每个指示点是一个整像素的盒子，按 `scale` 缩到它的尺寸（9.67px，或窗口两端缩小的尺寸）。
 * Chromium 把盒子的边画在整 CSS 像素上，9.67px 的盒子会画成 9 或 10px 宽，隔几个就有一个椭圆。
 * 10px 的盒子落在哪都是圆的，再用 `scale` 绕中心缩到尺寸。
 */
export const BOX = Math.ceil(PC.indicatorSize)

/** 按 `curve` 的控制点、时长 `ms` 的不透明度过渡。 */
export function fadeOf(ms: number, curve: ReadonlyArray<number>): string {
  return `opacity ${ms / 1000}s cubic-bezier(${curve.join(', ')})`
}

/** 手指下每次指示点变化的不透明度切换。 */
export const SWITCH = fadeOf(PC.switchMs, PC.switchCurve)

/** `page` 取整并夹到 0 到 `count - 1`。 */
export function clampPage(page: number, count: number): number {
  return Math.max(0, Math.min(count - 1, Math.round(page)))
}

/** 是什么要的这一页：点按让旧的指示点淡出得更快。 */
export type ChangeKind = 'tap' | 'other'

/** 相邻指示点中心之间的距离，px。 */
export const PITCH = PC.indicatorSize + PC.indicatorSpacing

export interface PageControlLayout {
  /** 控件宽度，px。 */
  width: number
  /** 显示几个指示点槽位。 */
  slots: number
  /** 显示的那排槽位的宽度，px；可能比 `width` 宽。 */
  rowWidth: number
  /** 页数比槽位多，这排是一个窗口。 */
  isWindowed: boolean
}

/** `count` 页时控件的尺寸（UIPageControl 实测）。 */
export function pageControlLayout(count: number): PageControlLayout {
  const n = Math.max(0, Math.floor(count))
  const slots = Math.min(n, PC.visibleSlots)
  const rowWidth = slots === 0 ? 0 : slots * PITCH - PC.indicatorSpacing
  const natural = (n === 0 ? 0 : n * PITCH - PC.indicatorSpacing) + 2 * PC.horizontalPadding
  const hundredths = (value: number): number => Math.round(value * 100) / 100
  return {
    width: hundredths(Math.min(natural, PC.maxWidth)),
    slots,
    rowWidth: hundredths(rowWidth),
    isWindowed: n > PC.visibleSlots,
  }
}

/** 窗口两侧各多渲染几个槽位，滑动时有点可滑。 */
export const RENDER_MARGIN = 3

/** 带窗口的一排渲染哪些页，`[first, last)`：窗口的槽位加两侧各 RENDER_MARGIN 个。 */
export function renderedPages(count: number, windowStart: number): [first: number, last: number] {
  const { slots } = pageControlLayout(count)
  return [
    Math.max(0, windowStart - RENDER_MARGIN),
    Math.min(count, windowStart + slots + RENDER_MARGIN),
  ]
}

/**
 * 细指针下这排显示每一页、都是原尺寸，比控件宽时由控件裁掉。这是这排朝起点挪了多少 px：
 * 当前点留在视野里，能居中就居中，到两头就贴边。
 */
export function croppedRowOffset(count: number, current: number): number {
  const n = Math.max(0, Math.floor(count))
  const row = n === 0 ? 0 : n * PITCH - PC.indicatorSpacing
  const visible = pageControlLayout(n).width - 2 * PC.horizontalPadding
  if (row <= visible)
    return 0
  const center = current * PITCH + PC.indicatorSize / 2
  return Math.max(0, Math.min(row - visible, center - visible / 2))
}

/**
 * 窗口从 `windowStart` 开始时第 `page` 页指示点的直径。窗口里是原尺寸，窗口外是 0。
 * 哪一侧还有页，那一侧最后两个槽位取两档边缘尺寸。
 */
export function indicatorSize(count: number, windowStart: number, page: number): number {
  if (count <= PC.visibleSlots)
    return page >= 0 && page < count ? PC.indicatorSize : 0
  const slot = page - windowStart
  if (slot < 0 || slot >= PC.visibleSlots)
    return 0
  const [near, far] = PC.edgeIndicatorSizes
  if (windowStart > 0) {
    if (slot === 0)
      return far
    if (slot === 1)
      return near
  }
  if (windowStart + PC.visibleSlots < count) {
    if (slot === PC.visibleSlots - 1)
      return far
    if (slot === PC.visibleSlots - 2)
      return near
  }
  return PC.indicatorSize
}

/** 原尺寸显示的第一页和最后一页。 */
export function fullPages(count: number, windowStart: number): [first: number, last: number] {
  if (count <= PC.visibleSlots)
    return [0, count - 1]
  const first = windowStart + (windowStart > 0 ? 2 : 0)
  const last = windowStart + PC.visibleSlots - 1 - (windowStart + PC.visibleSlots < count ? 2 : 0)
  return [first, last]
}

/** 当前页变化后的窗口：当前页还是原尺寸就不动，否则挪最少的格数让它变成原尺寸。 */
export function windowFor(count: number, windowStart: number, current: number): number {
  if (count <= PC.visibleSlots)
    return 0
  const maxStart = count - PC.visibleSlots
  let start = Math.max(0, Math.min(maxStart, windowStart))
  for (let guard = 0; guard <= count; guard++) {
    const [first, last] = fullPages(count, start)
    if (current > last && start < maxStart)
      start += 1
    else if (current < first && start > 0)
      start -= 1
    else
      break
  }
  return start
}

/**
 * 点按翻到哪页：朝点按落在当前点哪一侧翻一页（后沿往前翻），夹在页数之内。
 * `x` 和 `currentCenter` 用同一套横坐标。
 */
export function tapTarget(x: number, currentCenter: number, current: number, count: number, isRtl: boolean): number {
  const trailing = isRtl ? x < currentCenter : x > currentCenter
  const next = current + (trailing ? PC.tapStep : -PC.tapStep)
  return Math.max(0, Math.min(count - 1, next))
}

/**
 * 拖动的手指下是哪页，`x` 是沿着行离窗口第一个槽位中心多少 px。在两点中间换页，
 * 只停在原尺寸显示的页上。
 */
export function scrubTarget(x: number, count: number, windowStart: number): number {
  const slot = Math.floor(x / PITCH + PC.scrubSwitchPoint)
  const start = count <= PC.visibleSlots ? 0 : windowStart
  const [first, last] = fullPages(count, start)
  return Math.max(first, Math.min(last, start + slot))
}

/**
 * 拖动的手指越过内容边缘 `distance` px 时，隔多少秒翻下一页；没越过时是 Infinity。
 * `direction` 朝最后一页是 1，朝第一页是 -1；UIKit 朝第一页翻得慢一些。
 */
export function jogInterval(distance: number, direction = 1): number {
  if (!(distance > 0))
    return Infinity
  const perPoint = direction < 0 ? PC.jogRatePerPointBackward : PC.jogRatePerPoint
  return 1 / Math.min(PC.jogMaxRate, perPoint * distance)
}
