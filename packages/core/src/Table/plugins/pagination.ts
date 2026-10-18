import type { MaybeRefOrGetter, VNodeChild } from 'vue'
import type { TablePlugin } from '../types.js'
import { h, toValue } from 'vue'
import { useAstryxMessages } from '../../locale/context.js'
import Pagination from '../../Pagination/Pagination.vue'
import { paginateData } from '../columnUtils.js'

export { paginateData }

/** 分页控件中间那块长什么样。 */
export type TablePaginationVariant = 'pages' | 'count' | 'compact' | 'dots' | 'none'

export interface UseTablePaginationConfig {
  /** 当前页，从 1 计。 */
  page: number
  onPageChange: (page: number) => void
  /** 全部条目数，用来算页数。没有 `totalPages` 时用它。 */
  totalItems?: number
  /** 总页数。只知道页数、不知道条目数时用它。 */
  totalPages?: number
  /** 后面还有没有下一页。游标分页用它，页数未知也能翻。 */
  hasMore?: boolean
  /** 每页条目数。 */
  pageSize?: number
  pageSizeOptions?: number[]
  onPageSizeChange?: (pageSize: number) => void
  /** 控件形态。 */
  variant?: TablePaginationVariant
  /** 控件放在表格的哪一侧。 */
  position?: 'below' | 'above' | 'both' | 'none'
  align?: 'start' | 'center' | 'end'
  /** 控件高度。 */
  size?: 'sm' | 'md'
  /** 导航区的无障碍名称。 */
  label?: string
}

export function useTablePagination<T extends Record<string, unknown>>(
  config: MaybeRefOrGetter<UseTablePaginationConfig>,
): TablePlugin<T> {
  const messages = useAstryxMessages()
  function pageCount(current: UseTablePaginationConfig): number | undefined {
    if (current.totalPages != null)
      return current.totalPages
    if (current.totalItems == null)
      return undefined
    const size = current.pageSize ?? 10
    const pageSize = Number.isFinite(size) ? Math.max(1, Math.floor(size)) : 10
    return Math.ceil(current.totalItems / pageSize)
  }

  /** 只有一页、也没有下一页时整个控件不出现，和原版一致。 */
  function isVisible(current: UseTablePaginationConfig): boolean {
    const position = current.position ?? 'below'
    if (position === 'none')
      return false
    return !(pageCount(current) === 1 && current.hasMore !== true)
  }

  function controls(place: 'above' | 'below'): VNodeChild {
    const current = toValue(config)
    if (!isVisible(current))
      return null
    const size = current.pageSize ?? 10
    const pageSize = Number.isFinite(size) ? Math.max(1, Math.floor(size)) : 10
    const label = current.label ?? messages.value.table.paginationLabel
    return h('div', {
      'class': 'astryx-table__pagination',
      'data-align': current.align ?? 'center',
      'data-place': place,
    }, [
      h(Pagination, {
        'page': current.page,
        pageSize,
        'total': current.totalItems ?? 0,
        'totalPages': pageCount(current),
        'hasMore': current.hasMore,
        'variant': current.variant ?? 'pages',
        'size': current.size ?? 'md',
        'showSizeChanger': current.pageSizeOptions != null && current.onPageSizeChange != null,
        'pageSizeOptions': current.pageSizeOptions,
        // 上下各有一组控件时名字要区分开，否则读屏会把两个导航区当成同一个。
        'label': (current.position ?? 'below') === 'both'
          ? (place === 'above' ? messages.value.table.paginationLabelAbove(label) : messages.value.table.paginationLabelBelow(label))
          : label,
        'onUpdate:page': (page: number) => toValue(config).onPageChange(page),
        'onUpdate:pageSize': (size: number) => toValue(config).onPageSizeChange?.(size),
      }),
    ])
  }

  return {
    above() {
      const position = toValue(config).position ?? 'below'
      if (position !== 'above' && position !== 'both')
        return null
      return controls('above')
    },
    below() {
      const position = toValue(config).position ?? 'below'
      if (position !== 'below' && position !== 'both')
        return null
      return controls('below')
    },
  }
}
