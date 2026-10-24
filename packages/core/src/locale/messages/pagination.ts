import type { AstryxLocale } from '../types.js'
import { englishPlural, formatCount } from './shared.js'

export interface PaginationMessages {
  nav: string
  /** 上一页按钮上看得见的短文字。 */
  previous: string
  /** 下一页按钮上看得见的短文字。 */
  next: string
  /** 上一页按钮的无障碍名和提示。 */
  previousPage: string
  /** 下一页按钮的无障碍名和提示。 */
  nextPage: string
  /** 翻页后播报的「第几页」。 */
  page: (page: number) => string
  more: string
  /** 每页条数选择器旁边看得见的短文字。 */
  perPage: string
  /** 每页条数选择器的无障碍名。 */
  itemsPerPage: string
  pageSize: (count: number) => string
  total: (total: number, from: number, to: number) => string
  /** 窄容器里代替页码按钮的「当前页 / 总页数」。 */
  compact: (page: number, totalPages: number) => string
  /** compact 变体的「Page X of Y」。 */
  pageOf: (page: number, totalPages: number) => string
  /** 跳到第一页按钮的无障碍名。 */
  first: string
  /** 跳到最后一页按钮的无障碍名。 */
  last: string
  /** 一次后退多页时，上一页按钮上看得见的短文字。 */
  previousBy: (step: number) => string
  /** 一次前进多页时，下一页按钮上看得见的短文字。 */
  nextBy: (step: number) => string
  /** 一次后退多页时，上一页按钮的无障碍名。 */
  previousPages: (step: number) => string
  /** 一次前进多页时，下一页按钮的无障碍名。 */
  nextPages: (step: number) => string
  /** `input` 变体输入框前面的名词，例如 Page。 */
  pageLabel: string
  /** 输入框自己的无障碍名。 */
  goToPage: string
  /** 单个页码按钮的无障碍名。 */
  goToPageNumber: (page: number) => string
  /** `dots` 变体那一组圆点的无障碍名。 */
  pageIndicators: string
  /** 输入框后面的「/ 总页数」。 */
  ofTotal: (totalPages: number) => string
}

export const paginationMessages: Record<AstryxLocale, PaginationMessages> = {
  'en': {
    nav: 'Pagination',
    previous: 'Previous',
    next: 'Next',
    previousPage: 'Go to previous page',
    nextPage: 'Go to next page',
    page: page => `Page ${formatCount(page, 'en')}`,
    more: 'More pages',
    perPage: 'Per page',
    itemsPerPage: 'Items per page',
    pageSize: count => `${count} / page`,
    total: (total, from, to) => `${formatCount(from, 'en')}–${formatCount(to, 'en')} of ${formatCount(total, 'en')}`,
    compact: (page, totalPages) => `${page} / ${totalPages}`,
    pageOf: (page, totalPages) => `Page ${formatCount(page, 'en')} of ${formatCount(totalPages, 'en')}`,
    first: 'Go to first page',
    last: 'Go to last page',
    previousBy: step => `Back ${step} pages`,
    nextBy: step => `Forward ${step} pages`,
    previousPages: step => `Go back ${formatCount(step, 'en')} ${englishPlural(step, 'page', 'pages')}`,
    nextPages: step => `Go forward ${formatCount(step, 'en')} ${englishPlural(step, 'page', 'pages')}`,
    pageLabel: 'Page',
    goToPage: 'Go to page',
    goToPageNumber: page => `Go to page ${formatCount(page, 'en')}`,
    pageIndicators: 'Page indicators',
    ofTotal: totalPages => `/ ${formatCount(totalPages, 'en')}`,
  },
  'zh-CN': {
    nav: '分页导航',
    previous: '上一页',
    next: '下一页',
    previousPage: '转到上一页',
    nextPage: '转到下一页',
    page: page => `第 ${formatCount(page, 'zh-CN')} 页`,
    more: '更多页码',
    perPage: '每页',
    itemsPerPage: '每页条数',
    pageSize: count => `${count} 条/页`,
    total: (total, from, to) => `共 ${formatCount(total, 'zh-CN')} 条，显示 ${formatCount(from, 'zh-CN')}-${formatCount(to, 'zh-CN')}`,
    compact: (page, totalPages) => `${page} / ${totalPages}`,
    pageOf: (page, totalPages) => `第 ${formatCount(page, 'zh-CN')} 页，共 ${formatCount(totalPages, 'zh-CN')} 页`,
    first: '转到第一页',
    last: '转到最后一页',
    previousBy: step => `后退 ${step} 页`,
    nextBy: step => `前进 ${step} 页`,
    previousPages: step => `向前翻 ${formatCount(step, 'zh-CN')} 页`,
    nextPages: step => `向后翻 ${formatCount(step, 'zh-CN')} 页`,
    pageLabel: '页',
    goToPage: '跳转到指定页',
    goToPageNumber: page => `转到第 ${formatCount(page, 'zh-CN')} 页`,
    pageIndicators: '页码指示',
    ofTotal: totalPages => `/ ${formatCount(totalPages, 'zh-CN')}`,
  },
}
