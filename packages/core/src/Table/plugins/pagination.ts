import type { MaybeRefOrGetter, VNodeChild } from 'vue'
import type { TablePlugin } from '../types.js'
import { h, toValue } from 'vue'
import Pagination from '../../Pagination/Pagination.vue'
import { paginateData } from '../columnUtils.js'

export { paginateData }

export interface UseTablePaginationConfig {
  page: number
  onPageChange: (page: number) => void
  totalItems?: number
  pageSize?: number
  pageSizeOptions?: number[]
  onPageSizeChange?: (pageSize: number) => void
  position?: 'below' | 'above' | 'both' | 'none'
  align?: 'start' | 'center' | 'end'
  label?: string
}

export function useTablePagination<T extends Record<string, unknown>>(
  config: MaybeRefOrGetter<UseTablePaginationConfig>,
): TablePlugin<T> {
  function controls(): VNodeChild {
    const current = toValue(config)
    if ((current.position ?? 'below') === 'none')
      return null
    const pageSize = current.pageSize ?? 10
    return h('div', {
      'class': 'astryx-table__pagination',
      'data-align': current.align ?? 'center',
    }, [
      h(Pagination, {
        'page': current.page,
        pageSize,
        'total': current.totalItems ?? 0,
        'showSizeChanger': current.pageSizeOptions != null && current.onPageSizeChange != null,
        'pageSizeOptions': current.pageSizeOptions,
        'aria-label': current.label,
        'onUpdate:page': (page: number) => toValue(config).onPageChange(page),
        'onUpdate:pageSize': (size: number) => toValue(config).onPageSizeChange?.(size),
      }),
    ])
  }
  return {
    below() {
      const position = toValue(config).position ?? 'below'
      if (position === 'above' || position === 'none')
        return null
      return controls()
    },
  }
}
