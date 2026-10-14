import type { AstryxLocale } from '../types.js'

export interface PaginationMessages {
  nav: string
  previous: string
  next: string
  page: (page: number) => string
  more: string
  perPage: string
  pageSize: (count: number) => string
  total: (total: number, from: number, to: number) => string
  /** 窄容器里代替页码按钮的「当前页 / 总页数」。 */
  compact: (page: number, totalPages: number) => string
  /** compact 变体的「Page X of Y」。 */
  pageOf: (page: number, totalPages: number) => string
}

export const paginationMessages: Record<AstryxLocale, PaginationMessages> = {
  'en': {
    nav: 'Pagination',
    previous: 'Previous',
    next: 'Next',
    page: page => `Page ${page}`,
    more: 'More pages',
    perPage: 'Per page',
    pageSize: count => `${count} / page`,
    total: (total, from, to) => `${from}–${to} of ${total}`,
    compact: (page, totalPages) => `${page} / ${totalPages}`,
    pageOf: (page, totalPages) => `Page ${page} of ${totalPages}`,
  },
  'zh-CN': {
    nav: '分页导航',
    previous: '上一页',
    next: '下一页',
    page: page => `第 ${page} 页`,
    more: '更多页码',
    perPage: '每页',
    pageSize: count => `${count} 条/页`,
    total: (total, from, to) => `共 ${total} 条，显示 ${from}-${to}`,
    compact: (page, totalPages) => `${page} / ${totalPages}`,
    pageOf: (page, totalPages) => `第 ${page} 页，共 ${totalPages} 页`,
  },
}
