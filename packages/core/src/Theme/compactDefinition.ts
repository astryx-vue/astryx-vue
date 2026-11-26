/**
 * 主题的「紧凑屏」定义（上游 spec:AST-012 FR9）：视口宽度小于主题的 `md`
 * 宽度点，或者高度小于 500px。按屏幕大小选呈现方式的组件（手机上换成底部
 * 弹层的菜单、Selector、Popover）都读这一份，主题改了 `md`，边界跟着动。
 */
import type { ComputedRef } from 'vue'
import type { WidthBreakpoints } from './adaptationTypes.js'
import { computed, inject } from 'vue'
import { DEFAULT_WIDTH_BREAKPOINTS } from './adaptationTypes.js'
import { themeContextKey } from './context.js'

export interface CompactDefinition {
  /** 视口宽度小于这个值就算紧凑：主题实际生效的 `md` 宽度点。 */
  readonly widthBelow: number
  /** 视口高度小于这个值就算紧凑。 */
  readonly heightBelow: number
  /** 写成媒体查询列表（不带 `@media`）。 */
  readonly query: string
  /** 紧凑并且主指针是粗指针（手指），不带 `@media`。 */
  readonly coarsePointerQuery: string
}

/** 高度低于它算紧凑：横过来的手机。 */
const COMPACT_HEIGHT_BELOW = 500

/** 按主题的宽度点算出紧凑定义；不传就用标准宽度点。 */
export function compactDefinition(
  points: Readonly<Pick<WidthBreakpoints, 'md'>> = DEFAULT_WIDTH_BREAKPOINTS,
): CompactDefinition {
  const width = `(width < ${points.md}px)`
  const height = `(height < ${COMPACT_HEIGHT_BELOW}px)`
  return Object.freeze({
    widthBelow: points.md,
    heightBelow: COMPACT_HEIGHT_BELOW,
    query: `${width}, ${height}`,
    coarsePointerQuery: `${width} and (pointer: coarse), ${height} and (pointer: coarse)`,
  })
}

/** 标准宽度点下的紧凑定义。 */
export const DEFAULT_COMPACT_DEFINITION: CompactDefinition = compactDefinition()

/** 最近一层主题的紧凑定义。主题没改宽度点时就是标准定义。 */
export function useCompactDefinition(): ComputedRef<CompactDefinition> {
  const theme = inject(themeContextKey, null)
  return computed(() => {
    const points = theme?.value.theme.adaptations?.widthBreakpoints
    return points == null || points.md === DEFAULT_WIDTH_BREAKPOINTS.md
      ? DEFAULT_COMPACT_DEFINITION
      : compactDefinition(points)
  })
}
