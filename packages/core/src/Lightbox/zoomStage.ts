/**
 * @file zoomStage.ts
 * @input 舞台尺寸、照片适应大小时的盒子和像素尺寸、一个变换（相对适应位置的偏移和缩放）、指针位置
 * @output 缩放舞台的纯几何：缩放上下限、停靠位置、拖动的橡皮筋、捏合越界的回弹量，
 *   以及「保持某一点不动」的变换和键盘缩放
 * @position useZoomCore、useZoomStage 下面的纯数学，不碰 DOM。下拉关闭的几何在 zoomDismiss.ts。
 *
 * 模型是一个能缩放的 UIScrollView，常量来自 motion/uikit/zoomMedia.ts。
 */

import { rubberBandClamp, rubberBandUnclamp } from '../motion/rubberBand'
import { zoomMedia } from '../motion/uikit/zoomMedia'

export interface StagePoint {
  readonly x: number
  readonly y: number
}

/**
 * 以适应盒子的左上角为原点缩放，再平移 (x, y)。适应盒子里的照片点 (u, v)
 * 显示在 (fit.x + x + u·scale, fit.y + y + v·scale)。
 */
export interface ZoomTransform {
  /** 照片盒子相对适应位置的偏移，px。 */
  readonly x: number
  readonly y: number
  /** 相对适应大小的缩放倍数。 */
  readonly scale: number
}

export interface ZoomGeometry {
  /** 舞台尺寸，px。 */
  readonly width: number
  readonly height: number
  /** 照片在适应大小时的盒子，舞台坐标。 */
  readonly fit: {
    readonly x: number
    readonly y: number
    readonly width: number
    readonly height: number
  }
  readonly minScale: number
  readonly maxScale: number
  /** 从适应大小双击（手指）放大到的倍数。 */
  readonly doubleTapScale: number
}

export const IDENTITY: ZoomTransform = { x: 0, y: 0, scale: 1 }

/** 离适应大小不到这么多，算没放大。 */
export const ZOOMED_EPSILON = 0.001

/** 灯箱的缩放步长：手指双击至少放大这么多，鼠标双击和键盘放大正好这么多。 */
export const ZOOM_STEP = 2

/**
 * 手指双击从适应大小放大到的倍数：「铺满舞台」和 `ZOOM_STEP` 中较大的那个。
 * iOS 照片只按铺满算，所以铺满不到 2 倍的照片，灯箱会比照片 App 放得更大一点。
 */
export function doubleTapScaleFor(
  width: number,
  height: number,
  fitWidth: number,
  fitHeight: number,
): number {
  if (!(fitWidth > 0) || !(fitHeight > 0))
    return ZOOM_STEP
  return Math.max(ZOOM_STEP, width / fitWidth, height / fitHeight)
}

/**
 * 最大缩放：照片 App 的做法，是「一个图像像素对一个设备像素」那个倍数的若干倍。
 * 永远不小于 `doubleTapScale`，保证双击落在上下限以内。
 */
export function maxScaleFor(
  naturalWidth: number,
  fitWidth: number,
  devicePixelRatio: number,
  doubleTapScale: number,
): number {
  const { maxPixelZoomMultiple } = zoomMedia.viewer
  if (!(fitWidth > 0) || !(naturalWidth > 0) || !(devicePixelRatio > 0))
    return doubleTapScale
  const pixelScale = naturalWidth / (fitWidth * devicePixelRatio)
  return Math.max(doubleTapScale, maxPixelZoomMultiple * pixelScale)
}

/** 照片是不是比适应大小更大。 */
export function isZoomed(geometry: ZoomGeometry, transform: ZoomTransform): boolean {
  return transform.scale > geometry.minScale + ZOOMED_EPSILON
}

export interface AxisRange {
  readonly min: number
  readonly max: number
}

function axisRange(stageSize: number, fitStart: number, fitSize: number, scale: number): AxisRange {
  const size = fitSize * scale
  if (size <= stageSize) {
    const centred = (stageSize - size) / 2 - fitStart
    return { min: centred, max: centred }
  }
  // 写成 `0 - fitStart` 而不是 `-fitStart`：样式里不要出现负零。
  return { min: stageSize - size - fitStart, max: 0 - fitStart }
}

/**
 * 照片在 `scale` 下能停的偏移范围。某个方向上照片比舞台小，就居中停（UIKit 照片查看器都这样）；
 * 比舞台大，就停在两边都不露缝的范围里。
 */
export function restRange(geometry: ZoomGeometry, scale: number): { readonly x: AxisRange, readonly y: AxisRange } {
  const { fit } = geometry
  return {
    x: axisRange(geometry.width, fit.x, fit.width, scale),
    y: axisRange(geometry.height, fit.y, fit.height, scale),
  }
}

/** 同一缩放下离 `transform` 最近的停靠位置。 */
export function restingTransform(geometry: ZoomGeometry, transform: ZoomTransform): ZoomTransform {
  const range = restRange(geometry, transform.scale)
  return {
    x: Math.min(range.x.max, Math.max(range.x.min, transform.x)),
    y: Math.min(range.y.max, Math.max(range.y.min, transform.y)),
    scale: transform.scale,
  }
}

/** 捏合自身的倍数 `scale` 实际显示成多大：上下限以内 1:1，超出后越来越拉不动。 */
export function overshootScale(geometry: ZoomGeometry, scale: number): number {
  const f = zoomMedia.overshoot.limitFactor
  const { minScale: m, maxScale: M } = geometry
  if (scale > M)
    return M * (f - ((f - 1) * M) / scale)
  if (scale < m)
    return m / (f - ((f - 1) * scale) / m)
  return scale
}

/** `overshootScale` 的反函数：照片已经越界时，新的捏合从这里接着算，不跳。 */
export function pinchScaleFor(geometry: ZoomGeometry, shown: number): number {
  const f = zoomMedia.overshoot.limitFactor
  const { minScale: m, maxScale: M } = geometry
  if (shown > M) {
    // shown = M·(f − (f − 1)·M ÷ s)  ⇒  s = (f − 1)·M² ÷ (f·M − shown)
    const gap = f * M - shown
    return gap > 0 ? ((f - 1) * M * M) / gap : Number.POSITIVE_INFINITY
  }
  if (shown < m) {
    // shown = m ÷ (f − (f − 1)·s ÷ m)  ⇒  s = (f − m ÷ shown)·m ÷ (f − 1)
    return Math.max(0, ((f - m / shown) * m) / (f - 1))
  }
  return shown
}

/**
 * 缩放到 `scale` 时，让 `from` 下 `anchor` 处的照片点出现在 `point`。
 * 捏合让起手质心下的点跟着当前质心走；双击和越界回弹让这个点原地不动（`point` = `anchor`）。
 */
export function transformKeepingPoint(
  geometry: ZoomGeometry,
  from: ZoomTransform,
  anchor: StagePoint,
  point: StagePoint,
  scale: number,
): ZoomTransform {
  const { fit } = geometry
  const u = (anchor.x - fit.x - from.x) / from.scale
  const v = (anchor.y - fit.y - from.y) / from.scale
  return {
    x: point.x - fit.x - u * scale,
    y: point.y - fit.y - v * scale,
    scale,
  }
}

/**
 * 拖动时照片显示在哪：`raw` 是没有边界时指针位移会把它带到的位置。越过边缘后按 UIScrollView 的
 * 橡皮筋让步，尺度是舞台在这个方向上的尺寸。照片比舞台小的方向保持居中，内容装得下的滚动视图不回弹。
 */
export function draggedTransform(geometry: ZoomGeometry, raw: ZoomTransform): ZoomTransform {
  const range = restRange(geometry, raw.scale)
  return {
    x: range.x.min === range.x.max ? range.x.min : rubberBandClamp(raw.x, range.x.min, range.x.max, geometry.width),
    y: range.y.min === range.y.max ? range.y.min : rubberBandClamp(raw.y, range.y.min, range.y.max, geometry.height),
    scale: raw.scale,
  }
}

/** 显示位置背后的指针位移位置：`draggedTransform` 的反算。 */
export function rawForDragged(geometry: ZoomGeometry, shown: ZoomTransform): ZoomTransform {
  const range = restRange(geometry, shown.scale)
  return {
    x: range.x.min === range.x.max ? shown.x : rubberBandUnclamp(shown.x, range.x.min, range.x.max, geometry.width),
    y: range.y.min === range.y.max ? shown.y : rubberBandUnclamp(shown.y, range.y.min, range.y.max, geometry.height),
    scale: shown.scale,
  }
}

/**
 * 手指在 `point` 双击后的停靠位置。适应大小时按点放大到 `doubleTapScale`，并保持在舞台里
 * （照片 App 是把点到的地方移到中间）；已放大时回到适应大小。
 */
export function doubleTapTarget(geometry: ZoomGeometry, from: ZoomTransform, point: StagePoint): ZoomTransform {
  if (isZoomed(geometry, from))
    return restingTransform(geometry, { ...IDENTITY, scale: geometry.minScale })
  const scale = Math.min(geometry.maxScale, Math.max(geometry.minScale, geometry.doubleTapScale))
  return restingTransform(geometry, transformKeepingPoint(geometry, from, point, point, scale))
}

/**
 * 松手后的停靠位置。上下限以内就是 `shown` 本身（拖动的惯性会处理边缘）；越过上下限就回到
 * 那个极限，最后质心下的点原地不动，照片留在舞台里。
 */
export function releaseTarget(geometry: ZoomGeometry, shown: ZoomTransform, centroid: StagePoint): ZoomTransform {
  const limit = Math.min(geometry.maxScale, Math.max(geometry.minScale, shown.scale))
  if (limit === shown.scale)
    return shown
  return restingTransform(geometry, transformKeepingPoint(geometry, shown, centroid, centroid, limit))
}

/** 鼠标或触控笔在 `point` 双击：按点放大 `ZOOM_STEP` 倍并留在舞台里；已放大时回到适应大小。 */
export function doubleClickTarget(geometry: ZoomGeometry, from: ZoomTransform, point: StagePoint): ZoomTransform {
  return doubleTapTarget({ ...geometry, doubleTapScale: ZOOM_STEP }, from, point)
}

/** 缩放键（Enter、空格、`+`）：以舞台中心放大 `ZOOM_STEP` 倍，已放大时回到适应大小。 */
export function releasedZoomTarget(geometry: ZoomGeometry, from: ZoomTransform): ZoomTransform {
  return doubleClickTarget(geometry, from, { x: geometry.width / 2, y: geometry.height / 2 })
}

/** 平移 (dx, dy) 后的停靠位置：键盘的一步。 */
export function pannedBy(geometry: ZoomGeometry, from: ZoomTransform, dx: number, dy: number): ZoomTransform {
  return restingTransform(geometry, { x: from.x + dx, y: from.y + dy, scale: from.scale })
}

/**
 * 舞台尺寸变了（比如旋转屏幕）以后，显示同一张照片的变换：舞台中心的照片点还在中心，
 * 照片在屏幕上的大小不变，所以相对适应大小的倍数跟着适应大小变。结果在新的上下限以内、停靠好。
 */
export function transformForResize(before: ZoomGeometry, after: ZoomGeometry, transform: ZoomTransform): ZoomTransform {
  if (!isZoomed(before, transform))
    return { ...IDENTITY, scale: after.minScale }
  const ratio = after.fit.width > 0 ? before.fit.width / after.fit.width : 1
  const scale = Math.min(after.maxScale, Math.max(after.minScale, transform.scale * ratio))
  // 旧中心下的照片点（按旧适应盒子的比例），换到新的适应盒子里。
  const u = (before.width / 2 - before.fit.x - transform.x) / transform.scale / before.fit.width
  const v = (before.height / 2 - before.fit.y - transform.y) / transform.scale / before.fit.height
  return restingTransform(after, {
    x: after.width / 2 - after.fit.x - u * after.fit.width * scale,
    y: after.height / 2 - after.fit.y - v * after.fit.height * scale,
    scale,
  })
}
