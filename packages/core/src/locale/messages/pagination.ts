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
  /** 跳到第一页。 */
  first: string
  /** 跳到最后一页。 */
  last: string
  /** 一次后退多页时，上一页按钮的无障碍名。 */
  previousBy: (step: number) => string
  /** 一次前进多页时，下一页按钮的无障碍名。 */
  nextBy: (step: number) => string
  /** `input` 变体输入框前面的名词，例如 Page。 */
  pageLabel: string
  /** 输入框自己的无障碍名。 */
  goToPage: string
  /** 输入框后面的「/ 总页数」。 */
  ofTotal: (totalPages: number) => string
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
    first: 'First page',
    last: 'Last page',
    previousBy: step => `Back ${step} pages`,
    nextBy: step => `Forward ${step} pages`,
    pageLabel: 'Page',
    goToPage: 'Go to page',
    ofTotal: totalPages => `/ ${totalPages}`,
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
    first: '第一页',
    last: '最后一页',
    previousBy: step => `后退 ${step} 页`,
    nextBy: step => `前进 ${step} 页`,
    pageLabel: '页',
    goToPage: '跳转到页',
    ofTotal: totalPages => `/ ${totalPages}`,
  },
}
