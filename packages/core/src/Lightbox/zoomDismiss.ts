/**
 * @file zoomDismiss.ts
 * @input 缩放舞台的几何、下拉的位移和松手速度
 * @output 照片 App 「往下拖关闭」的纯几何：照片跟手缩小、背景和控件变淡、松手后关还是弹回、
 *   关闭时照片要走到哪
 * @position useZoomStage 和 Lightbox 用它；常量在 motion/uikit/zoomMedia.ts 的 `dismiss`。
 */

import type { ZoomGeometry, ZoomTransform } from './zoomStage'
import { resolveSnapPoint } from '../motion/resolveSnapPoint'
import { zoomMedia } from '../motion/uikit/zoomMedia'

/**
 * 下拉中的照片（从适应大小开始）。它的中心跟着指针 (dx, dy) 走，
 * 并以中心为原点缩小 `scalePerTravelSquared` × 向下位移²。往上拖不缩小。
 */
export function dismissTransform(geometry: ZoomGeometry, dx: number, dy: number): ZoomTransform {
  const travel = Math.max(0, dy)
  const scale = Math.max(0, 1 - zoomMedia.dismiss.scalePerTravelSquared * travel * travel)
  return {
    x: dx + ((1 - scale) * geometry.fit.width) / 2,
    y: dy + ((1 - scale) * geometry.fit.height) / 2,
    scale,
  }
}

/** 向下位移（pt）时背景的不透明度。 */
export function dismissBackdropAlpha(travel: number): number {
  const t = Math.max(0, travel)
  return Math.min(1, Math.max(0, 1 - zoomMedia.dismiss.backdropAlphaPerTravelSquared * t * t))
}

/** 向下位移（pt）时控件和相邻照片的不透明度，比背景淡得快。 */
export function dismissChromeAlpha(travel: number): number {
  const { chromeAlphaPerPoint, chromeFadeStart } = zoomMedia.dismiss
  return Math.min(1, Math.max(0, 1 - chromeAlphaPerPoint * (travel - chromeFadeStart)))
}

/**
 * 松手时关不关，抬手那一刻按通用的松手规则（`resolveSnapPoint`）定一次。两个落点是
 * 「回到适应位置」和「越过提交点后离开」，中点是 `cancelTravel`。判断用的是位移加上按速度
 * 还能滑出去的距离（`projectionRate`），往回（向上）走的松手一律弹回。
 * 所以往下轻轻一甩就关；拉一小段停住再抬手会弹回。
 */
export function dismissCommits(travel: number, velocityY: number): boolean {
  const { cancelTravel, projectionRate } = zoomMedia.dismiss
  const release = resolveSnapPoint({
    points: [0, 2 * cancelTravel],
    position: travel,
    velocity: velocityY,
    // 没有「轻扫」规则：只看投射。
    flickThreshold: Number.POSITIVE_INFINITY,
    // 按这个减速率滑行时的投射距离。
    projection: { seconds: projectionRate / (1 - projectionRate) / 1000 },
    start: 0,
  })
  return release.index === 1
}

/**
 * 没有缩略图可回去时，关闭的照片一直往下走，直到顶边越过 `bottom`（舞台坐标）。
 * 那是屏幕底边；只包住照片的舞台会在屏幕底边上方很远。默认是舞台自己的底边。
 */
export function dismissExitY(geometry: ZoomGeometry, shown: ZoomTransform, bottom: number = geometry.height): number {
  return Math.max(shown.y, Math.max(bottom, geometry.height) - geometry.fit.y) + 1
}
