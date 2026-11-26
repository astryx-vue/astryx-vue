import type { LayerBox } from './position.js'

/**
 * 浮层定位用的视口：窗口的布局视口，被屏幕键盘盖住的那一截要扣掉。
 *
 * iOS 等系统里键盘弹出时 `innerHeight` 不变，只有可视视口（`visualViewport`）缩短。
 * 没有缩放时，可视视口底边以下就是键盘，浮层要落在它上面。双指放大时可视视口也会变小，
 * 那不是键盘，不处理。
 */
export function getLayerViewport(): LayerBox {
  const width = window.innerWidth
  const height = window.innerHeight
  const visual = window.visualViewport
  if (visual == null || visual.scale > 1.01)
    return { width, height }
  return { width, height: Math.min(height, visual.offsetTop + visual.height) }
}
