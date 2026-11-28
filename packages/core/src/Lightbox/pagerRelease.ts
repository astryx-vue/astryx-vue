/**
 * @file pagerRelease.ts
 * @input 松手时内容的位置和速度、页距、页数、起拖那一页
 * @output pageForRelease（UIKit 分页滚动视图实测的选页规则）、dragTrackPosition（拖动中轨道显示在哪）
 * @position 纯函数，不碰 DOM；灯箱的翻页器（lightboxPager.ts）用它。常量在 motion/uikit/paging.ts。
 */

import { resolveSnapPoint } from '../motion/resolveSnapPoint'
import { rubberBandClamp } from '../motion/rubberBand'
import { paging } from '../motion/uikit/paging'

/** 一次松手：内容在哪、多快、从哪一页起拖。 */
export interface PageRelease {
  /** 抬手时的内容偏移，px（可以越过两端）。 */
  readonly position: number
  /** 抬手时的内容速度，px/s（共用的松手速度）。 */
  readonly velocity: number
  /** 相邻两页的距离：页宽加间距，px。 */
  readonly stride: number
  /** 页数（至少 1）。 */
  readonly count: number
  /** 起拖的那一页（手指落下时它停着的位置）。 */
  readonly startIndex: number
}

/**
 * 松手停在哪一页，照 UIKit 实测的分页规则（uikit/paging.ts 的 `release`），走通用的松手策略：
 * - 速度到 `advanceSpeed` 就算轻扫，不论内容在哪，都朝速度方向翻到下一页；
 * - 慢一点的松手停在离内容最近的一页（过半页就是下一页）；
 * - 速度指回起拖那一页时，不论拖了多远都回到那一页；
 * - 离起拖那一页最多 `maxPagesFromStart` 页，并收在页数之内。
 */
export function pageForRelease({ position, velocity, stride, count, startIndex }: PageRelease): number {
  if (!(stride > 0) || count < 1)
    return 0
  const reach = paging.release.maxPagesFromStart
  // 越过两端的起拖页（页数变少了）从最近的真实页算起。
  const from = Math.min(Math.max(startIndex, 0), count - 1)
  const first = Math.max(0, from - reach)
  const last = Math.min(count - 1, from + reach)
  const points = Array.from({ length: last - first + 1 }, (_, i) => (first + i) * stride)
  const { index } = resolveSnapPoint({
    points,
    position,
    velocity,
    flickThreshold: paging.release.advanceSpeed,
    // 一点点容差，正好停在页上的松手算在页上。
    tolerance: 1e-6 * stride,
    start: from * stride,
    fromIndex: from - first,
    maxSteps: reach,
  })
  return first + index
}

/** 拖动中轨道的一步：起拖位置、手指位移（已按书写方向换成内容方向）。 */
export interface TrackDrag {
  readonly start: number
  readonly delta: number
  readonly stride: number
  readonly count: number
  /** 页宽：越过两端时橡皮筋的 d。 */
  readonly pageWidth: number
  /** 触控板横扫：最多离起拖页一页。 */
  readonly startIndex?: number
}

/**
 * 拖动中内容显示在哪：1:1 跟手，越过第一页或最后一页时按 UIKit 的橡皮筋让步（d = 页宽）。
 * 触控板横扫（给了 `startIndex`）最多离起拖页一页，这个窗口也包含起拖的位置。
 */
export function dragTrackPosition({ start, delta, stride, count, pageWidth, startIndex }: TrackDrag): number {
  let raw = start + delta
  if (startIndex != null && stride > 0) {
    const before = startIndex > 0 ? (startIndex - 1) * stride : Number.NEGATIVE_INFINITY
    const after = startIndex < count - 1 ? (startIndex + 1) * stride : Number.POSITIVE_INFINITY
    raw = Math.min(Math.max(raw, Math.min(before, after, start)), Math.max(before, after, start))
  }
  return rubberBandClamp(raw, 0, Math.max(0, count - 1) * stride, pageWidth > 0 ? pageWidth : 1)
}
