/**
 * @file tabBarModel.ts
 * @input TabBar 的 UIKit 实测值（uikitTabBar.ts）；core 的橡皮筋函数
 * @output TabBar 的纯几何：每项的宽度和中心、离手指最近的项、透镜的目标和放大倍数
 * @position lab TabBar 的数学部分，不碰 DOM。坐标是胶囊自己的，单位 px，按压的
 *   弹性缩放之前；x 从胶囊左沿量起，项按逻辑顺序排列。
 */

import { rubberBand } from '@astryx-vue/core/internal/touch'
import { tabBar } from './uikitTabBar'

/** 没有搜索标签时，`count` 个标签的胶囊最宽多少 px。 */
export function naturalWidth(count: number): number {
  return tabBar.naturalWidth.base + tabBar.naturalWidth.perTab * count
}

/** 胶囊 `width` px 宽时每一项（以及静止的透镜）的宽度，不超过胶囊内侧。 */
export function itemWidth(width: number, count: number): number {
  const { perSlot, perBar, offset } = tabBar.itemWidth
  return Math.min(
    (perSlot * width) / Math.max(count, 1) + perBar * width + offset,
    width - 2 * tabBar.itemInset,
  )
}

/** 同一个宽度写成胶囊宽度 `100cqw` 的 CSS 表达式（胶囊是尺寸容器），放进 `calc()` 里用。 */
export function itemWidthCss(count: number): string {
  const { perSlot, perBar, offset } = tabBar.itemWidth
  const sign = offset < 0 ? '-' : '+'
  const inside = `100cqw - ${2 * tabBar.itemInset}px`
  return `min(${perSlot} * 100cqw / ${Math.max(count, 1)} + ${perBar} * 100cqw ${sign} ${Math.abs(offset)}px, ${inside})`
}

/**
 * 胶囊 `width` px 宽时 `count` 个项的中心，按逻辑顺序。首尾两项离边 `itemInset`，
 * 其余在它们之间均匀铺开。从右往左的胶囊里第一项在右边。
 */
export function itemCenters(width: number, count: number, isRtl = false): number[] {
  if (count <= 0)
    return []
  const size = itemWidth(width, count)
  const first = tabBar.itemInset + size / 2
  const centers = count === 1
    ? [width / 2]
    : Array.from({ length: count }, (_, i) => first + ((width - 2 * first) * i) / (count - 1))
  return isRtl ? centers.map(center => width - center) : centers
}

/** 离手指 `x` 最近的项：中心最近的那个，一样近时取靠前的。 */
export function nearestIndex(x: number, centers: readonly number[]): number {
  let best = 0
  let bestDistance = Infinity
  centers.forEach((center, index) => {
    const distance = Math.abs(x - center)
    // 浮点中心可能差一点舍入误差，差不到 1e-9 px 算一样近。
    if (distance < bestDistance - 1e-9) {
      best = index
      bestDistance = distance
    }
  })
  return best
}

/** 手指在 `x` 时透镜去哪：首尾中心之间就是手指本身，越过两端按橡皮筋收住。 */
export function lensTarget(x: number, centers: readonly number[]): number {
  if (centers.length === 0)
    return x
  const min = Math.min(...centers)
  const max = Math.max(...centers)
  if (x < min)
    return min + rubberBand(x - min, tabBar.lensEdgeDimension)
  if (x > max)
    return max + rubberBand(x - max, tabBar.lensEdgeDimension)
  return x
}

/** 项 `width` px 宽时，抬起的透镜在两个方向上的放大倍数：四周各长出 `liftOutset`。 */
export function liftScale(width: number): { x: number, y: number } {
  return {
    x: (width + 2 * tabBar.liftOutset) / width,
    y: (tabBar.itemHeight + 2 * tabBar.liftOutset) / tabBar.itemHeight,
  }
}

/**
 * 透镜里那份选中样子的项副本。透镜平移 `x`、绕中心缩放 (`scaleX`, `scaleY`)，副本绕同一点
 * 做这个反变换就回到项本来的位置，于是透镜下面是谁，就显示谁的选中样子。
 */
export function copyTransform(x: number, scaleX: number, scaleY: number): { x: number, scaleX: number, scaleY: number } {
  return { x: -x / scaleX, scaleX: 1 / scaleX, scaleY: 1 / scaleY }
}
