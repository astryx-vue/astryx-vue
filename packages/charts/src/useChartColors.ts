import type { ChartColorsAPI } from './getChartColors.js'
import { getChartColorsFromResolver } from './getChartColors.js'

/**
 * 图表配色。上游从当前主题对象里读出变量的具体值，我们在变量名前面加一层
 * `--astryx-` 之后直接返回 `var(...)` 字符串：SVG 的 `fill` / `stroke` 认 CSS 变量，
 * 浏览器解析出来的颜色和上游一模一样，而且换主题（或者深浅色切换）时不用重新渲染 ——
 * 变量跟着所在元素重新求值。服务端没有 DOM，这条路同样走得通。
 * `alpha()` 收到 `var(...)` 时改用 `color-mix()` 混透明，效果和上游拼出来的 `rgba()` 相同。
 */

/** 变量名映射：上游读 `--color-data-*`，我们的主题里叫 `--astryx-color-data-*`。 */
function cssVariable(name: string): string {
  return `var(--astryx-${name.replace(/^--/, '')})`
}

const BASE_COLORS = getChartColorsFromResolver(cssVariable)

/** 颜色是 `var(...)` 时按比例混透明；其余照旧交给按 hex 解析的实现。 */
function alpha(color: string, opacity: number): string {
  if (!color.trimStart().startsWith('var('))
    return BASE_COLORS.alpha(color, opacity)
  const ratio = Number.isFinite(opacity) ? Math.max(0, Math.min(1, opacity)) : 1
  return `color-mix(in srgb, ${color} ${Math.round(ratio * 1000) / 10}%, transparent)`
}

const CHART_COLORS: ChartColorsAPI = { ...BASE_COLORS, alpha }

/**
 * 当前主题下的图表配色。
 *
 * ```ts
 * const colors = useChartColors()
 * colors.categorical(5)
 * colors.semantic.positive
 * ```
 *
 * 返回的对象整个包共用一份，身份不变，可以直接放进 `watch` / `computed` 的依赖里。
 */
export function useChartColors(): ChartColorsAPI {
  return CHART_COLORS
}
