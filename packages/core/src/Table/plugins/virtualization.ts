import type { MaybeRefOrGetter } from 'vue'
import type { TablePlugin } from '../types.js'
import { toValue } from 'vue'

export interface UseTableRowsVirtualizationConfig {
  /**
   * 一行数据的总高度（CSS 像素），含密度内边距和分隔线。行不会比它矮；
   * 所有挂载的行一起变高时（例如放大字号），按量到的行高继续窗口化。
   */
  rowHeight: number
  /**
   * 首帧（服务端渲染、量到视口之前）规划窗口用的视口高度（CSS 像素）。
   * 它不决定表格多高：表格在父元素给的高度里滚动，挂载之后按量到的视口算窗口。
   */
  initialViewportHeight: number
}

/**
 * 定高扁平行的行窗口化：只挂载看得见的行，前后各多挂几行，其余用占位撑开滚动高度。
 * 数据、列、`idKey` 和别的插件照旧交给表格；内容或结构不支持时退回全部渲染。
 *
 * 表格在父元素给的高度里滚动并占满它：给父元素一个高度（固定、百分比，或者 flex 子项），
 * 没有高度时每一行都会渲染。
 *
 * @example
 * ```ts
 * const rows = useTableRowsVirtualization({ rowHeight: 41, initialViewportHeight: 480 })
 * // <Table :data="data" :columns="columns" id-key="id" :plugins="{ rows }" />
 * ```
 */
export function useTableRowsVirtualization<T extends Record<string, unknown>>(
  config: MaybeRefOrGetter<UseTableRowsVirtualizationConfig>,
): TablePlugin<T> {
  return {
    rowModel: 'flat',
    virtualization: {
      rows: () => {
        const { rowHeight, initialViewportHeight } = toValue(config)
        return { rowHeight, initialViewportHeight }
      },
    },
  }
}

export interface UseTableColumnsVirtualizationConfig {
  /**
   * 首帧（服务端渲染、量到视口之前）规划列窗口用的视口宽度（CSS 像素）。
   * 它不决定表格多宽：挂载之后按量到的滚动区宽度算窗口。
   */
  initialViewportWidth: number
}

/**
 * 列窗口化：只挂载行内方向上看得见的列，两侧各多挂几列。固定列（`useTableStickyColumns`）一直挂着，
 * 有焦点的格子所在的列滚出视口也继续挂着。滚动区放得下表格最小宽度时，所有列都挂载。
 * 和行窗口化一起用时，两个插件都放进 `plugins`。
 *
 * @example
 * ```ts
 * const columns = useTableColumnsVirtualization({ initialViewportWidth: 960 })
 * // <Table :data="data" :columns="cols" id-key="id" :plugins="{ columns }" />
 * ```
 */
export function useTableColumnsVirtualization<T extends Record<string, unknown>>(
  config: MaybeRefOrGetter<UseTableColumnsVirtualizationConfig>,
): TablePlugin<T> {
  return {
    rowModel: 'flat',
    virtualization: {
      columns: () => ({ initialViewportWidth: toValue(config).initialViewportWidth }),
    },
  }
}
