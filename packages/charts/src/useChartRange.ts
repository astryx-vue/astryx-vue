import type { Ref } from 'vue'
import { shallowReadonly, shallowRef } from 'vue'

export interface UseChartRangeOptions {
  /** x 轴滑动窗口的宽度。 */
  xWindow: number
  /** 固定 y 轴范围；提供后不再根据数据自动更新。 */
  yDomain?: [number, number]
  /** 自动 y 轴范围在数据上下两侧保留的比例，默认 0.1。 */
  yPadding?: number
  /** 是否让 y 轴以 0 为中心对称展开，默认 false。 */
  yCenter?: boolean
}

export interface UseChartRangeReturn {
  /** 传给 Chart 的受控 x 轴范围；模板中会自动解包。 */
  readonly xDomain: Readonly<Ref<[number, number]>>
  /** 传给 Chart 的受控 y 轴范围；模板中会自动解包。 */
  readonly yDomain: Readonly<Ref<[number, number]>>
  /** 同步接收一个新点并更新范围。WebGL stream 转发不属于当前包的范围。 */
  push: (x: number, y: number) => void
  /** 清除已记录的范围，回到调用组合式函数时的初始 domain。 */
  reset: () => void
}

/**
 * 管理流式图表的受控 x/y 范围。x 轴在预热阶段从 0 扩展到当前值，窗口填满后随新点滑动；
 * y 轴默认跟踪历史最小值和最大值。每次 push 都同步更新 ref，不等待下一次渲染。
 */
export function useChartRange({
  xWindow,
  yDomain: fixedYDomain,
  yPadding = 0.1,
  yCenter = false,
}: UseChartRangeOptions): UseChartRangeReturn {
  const xDomain = shallowRef<[number, number]>([0, 0])
  const yDomain = shallowRef<[number, number]>(fixedYDomain ?? [0, 1])
  const range = {
    yMin: fixedYDomain ? fixedYDomain[0] : Number.POSITIVE_INFINITY,
    yMax: fixedYDomain ? fixedYDomain[1] : Number.NEGATIVE_INFINITY,
  }

  function push(x: number, y: number): void {
    const xMin = x >= xWindow ? x - xWindow : 0
    const xMax = x >= xWindow ? x : Math.max(x, 1)
    xDomain.value = [xMin, xMax]

    if (fixedYDomain)
      return

    let changed = false
    if (y < range.yMin) {
      range.yMin = y
      changed = true
    }
    if (y > range.yMax) {
      range.yMax = y
      changed = true
    }
    if (!changed)
      return

    const size = range.yMax - range.yMin || 1
    const padding = size * yPadding
    let min = range.yMin - padding
    let max = range.yMax + padding
    if (yCenter) {
      const absolute = Math.max(Math.abs(min), Math.abs(max))
      min = -absolute
      max = absolute
    }
    yDomain.value = [min, max]
  }

  function reset(): void {
    range.yMin = fixedYDomain ? fixedYDomain[0] : Number.POSITIVE_INFINITY
    range.yMax = fixedYDomain ? fixedYDomain[1] : Number.NEGATIVE_INFINITY
    xDomain.value = [0, 0]
    yDomain.value = fixedYDomain ?? [0, 1]
  }

  return {
    xDomain: shallowReadonly(xDomain),
    yDomain: shallowReadonly(yDomain),
    push,
    reset,
  }
}
