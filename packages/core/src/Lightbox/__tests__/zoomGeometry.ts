/**
 * @file zoomGeometry.ts
 * @input 缩放舞台的几何
 * @output 测试用的实验舞台 `landscape` 和照片点位置 `shown`
 * @position Lightbox 缩放测试的共用工具
 */

import type { StagePoint, ZoomGeometry, ZoomTransform } from '../zoomStage'
import { doubleTapScaleFor, maxScaleFor } from '../zoomStage'

/** 实验舞台：402 × 874 的屏幕上，一张 3000 × 2000 的照片按 402 × 268 垂直居中显示，3 倍屏。 */
export function landscape(overrides: Partial<ZoomGeometry> = {}): ZoomGeometry {
  const width = 402
  const height = 874
  const fit = { x: 0, y: (874 - 268) / 2, width: 402, height: 268 }
  const doubleTapScale = doubleTapScaleFor(width, height, 402, 268)
  return {
    width,
    height,
    fit,
    minScale: 1,
    maxScale: maxScaleFor(3000, 402, 3, doubleTapScale),
    doubleTapScale,
    ...overrides,
  }
}

/** 适应盒子里的照片点 (u, v) 显示在舞台的哪里。 */
export function shown(geometry: ZoomGeometry, transform: ZoomTransform, u: number, v: number): StagePoint {
  return {
    x: geometry.fit.x + transform.x + u * transform.scale,
    y: geometry.fit.y + transform.y + v * transform.scale,
  }
}
