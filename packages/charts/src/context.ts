import type { InjectionKey } from 'vue'
import type { ChartContext } from './types.js'
import { inject } from 'vue'

/** 图表根把上下文挂在这个键上，子组件（坐标轴、网格、提示框）从它读比例尺和尺寸。 */
export const chartContextKey: InjectionKey<ChartContext> = Symbol('astryx-chart')

/**
 * 读当前图表的上下文。只能在 `<Chart>` 里用。
 *
 * 返回的对象身份不变，字段是活的：图表重新量到宽度、重新布局之后，
 * 同样的对象读出来的比例尺和尺寸就是新的。所以取值要写在 `computed` 或渲染里，
 * 不要在 `setup` 里一次性解构出来。
 */
export function useChart(): ChartContext {
  const ctx = inject(chartContextKey, null)
  if (ctx === null)
    throw new Error('useChart() 必须在 <Chart> 里调用')
  return ctx
}
