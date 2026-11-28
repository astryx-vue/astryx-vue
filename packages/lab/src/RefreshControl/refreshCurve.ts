/**
 * @file refreshCurve.ts
 * @input core 的三次贝塞尔
 * @output bezierCurve：在三次贝塞尔上从一个值走到另一个值的动效曲线，给动效引擎的 `play`
 * @position 下拉刷新结束时的滑动用它，按主题时长播 UIKit 的曲线
 */

import type { MotionCurve } from '@astryx-vue/core/internal/touch'
import { cubicBezier } from '@astryx-vue/core/internal/touch'

function derivative(at: (t: number) => number, duration: number): (t: number) => number {
  const step = 1 / 1000
  return (t) => {
    const a = Math.max(0, t - step)
    const b = Math.min(duration, t + step)
    return b > a ? (at(b) - at(a)) / (b - a) : 0
  }
}

/** 在 `points` 这条三次贝塞尔上，`ms` 毫秒里从 `from` 走到 `to`。 */
export function bezierCurve(
  from: number,
  to: number,
  ms: number,
  points: readonly [number, number, number, number],
): MotionCurve {
  const ease = cubicBezier(points)
  const duration = ms / 1000
  const at = (t: number): number => from + (to - from) * ease(Math.min(1, Math.max(0, t / duration)))
  return { duration, at, velocity: derivative(at, duration) }
}
