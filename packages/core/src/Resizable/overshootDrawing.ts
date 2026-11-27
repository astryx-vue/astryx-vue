/**
 * @file overshootDrawing.ts
 * @input LayoutPanel 借给区域的面板、它旁边的 ResizeHandle、motion 的共享动画器
 * @output `createOvershootDrawing`：拉过上下限时只在合成器上把分隔条画过界，松手后弹回
 * @position Resizable 内部，供 useResizable 的拖动逻辑使用
 *
 * 拉过限位时面板的尺寸不变、什么都不重新排版：只有分隔条越过限位，盖在旁边的内容上。
 * 几何关系在一次越界开始时量一次。
 */
import type { SpringDescription } from '../motion/spring.js'
import type { ResizablePane } from './resizablePane.js'
import { animatorFor } from '../motion/animator.js'
import { edgeAxis } from './resizablePane.js'

export interface OvershootDrawing {
  /** 把分隔条画到限位外 `amount` px：正数在上限外。 */
  draw: (amount: number) => void
  /**
   * 在分隔条自己的动画器上按 `spring` 从松手速度弹回限位。速度是越界量自己的变化率（px/s，
   * 上限外为正）。什么都没画时返回 false。
   */
  springBack: (spring: SpringDescription, velocity: number) => boolean
  /** 分隔条此刻在限位外显示多远，弹回途中也算。 */
  shown: () => number
  /** 立刻去掉画出来的越界。 */
  clear: () => void
}

export function createOvershootDrawing(pane: ResizablePane, handleOf: () => HTMLElement | null): OvershootDrawing {
  let geometry: { sign: number, axis: 'x' | 'y', handle: HTMLElement | null } | null = null
  let drawn = 0
  let springing: object | null = null

  const measure = (): { sign: number, axis: 'x' | 'y', handle: HTMLElement | null } => {
    geometry ??= { ...edgeAxis(pane), handle: handleOf() }
    return geometry
  }
  const animator = (): ReturnType<typeof animatorFor> | null => {
    const handle = geometry?.handle
    return handle == null ? null : animatorFor(handle)
  }

  return {
    draw(amount) {
      const isAtRest = drawn === 0 && springing == null
      if (isAtRest && amount === 0)
        return
      // 新的一次越界重新量：两次拉动之间排版可能变了。
      if (isAtRest)
        geometry = null
      springing = null
      drawn = amount
      const { sign, axis } = measure()
      animator()?.set({ [axis]: sign * amount })
    },
    springBack(spring, velocity) {
      const motion = animator()
      if (drawn === 0 || motion == null || geometry == null)
        return false
      const { sign, axis } = geometry
      drawn = 0
      const played = motion.animate({ [axis]: 0 }, { spring, velocity: { [axis]: sign * velocity } })
      springing = played
      void played.finished.then(() => {
        if (springing === played)
          springing = null
      })
      return true
    },
    shown() {
      const motion = animator()
      if (springing == null || motion == null || geometry == null)
        return drawn
      return geometry.sign * motion.get(geometry.axis)
    },
    clear() {
      // 只写回数值：这次绘制不给分隔条留合成层。
      if (geometry != null && (drawn !== 0 || springing != null))
        animator()?.set({ [geometry.axis]: 0 }, { promote: false })
      springing = null
      drawn = 0
      geometry = null
    },
  }
}
