/**
 * @file pageControlGeometry.ts
 * @input 控件根元素和指示点条
 * @output 拖动开始时读一次的屏幕几何：沿行的坐标、越过内容边缘多少，以及鼠标下整排每个点的中心
 * @position PageControl 输入层（usePageControlInput.ts）的布局读取，拖动过程中不再读布局
 */

import { isRtlElement } from '@astryx-vue/core/internal/touch'
import { pageControlLayout } from './pageControlModel'
import { pageControl as PC } from './pageControlTable'

/** 手指下的窗口几何。 */
export interface WindowGeometry {
  /** 屏幕横坐标 `x` 沿着行（从右往左时镜像）离窗口第一个槽位中心多少 px。 */
  along: (x: number) => number
  /** `x` 越过内容边缘多少 px：越过末尾为正，越过开头为负，没越过是 0。 */
  past: (x: number) => number
}

/** `pages` 页时控件 `root` 的窗口几何。 */
export function windowGeometry(root: HTMLElement, pages: number): WindowGeometry {
  const rect = root.getBoundingClientRect()
  const isRtl = isRtlElement(root)
  const rowStart = (rect.width - pageControlLayout(pages).rowWidth) / 2
  const firstCenter = rowStart + PC.indicatorSize / 2
  return {
    along: x => isRtl ? rect.right - firstCenter - x : x - rect.left - firstCenter,
    past: (x) => {
      const start = rect.left + PC.horizontalPadding
      const end = rect.right - PC.horizontalPadding
      const beyond = x > end ? x - end : x < start ? x - start : 0
      return isRtl ? -beyond : beyond
    },
  }
}

/** 一个点的页码和它中心的屏幕横坐标。 */
export interface DotCenter {
  page: number
  x: number
}

/** 鼠标下整排每个点的中心：拖动开始时读一次，按点实际画在哪里换页。 */
export function dotCenters(strip: HTMLElement | null): DotCenter[] {
  if (strip == null)
    return []
  return Array.from(strip.querySelectorAll<HTMLElement>('[data-page]'), (dot) => {
    const box = dot.getBoundingClientRect()
    return { page: Number(dot.dataset.page), x: box.left + box.width / 2 }
  })
}

/** 离 `x` 最近的点。 */
export function nearestDot(centers: ReadonlyArray<DotCenter>, x: number): DotCenter | null {
  let nearest: DotCenter | null = null
  for (const center of centers) {
    if (nearest == null || Math.abs(center.x - x) < Math.abs(nearest.x - x))
      nearest = center
  }
  return nearest
}
