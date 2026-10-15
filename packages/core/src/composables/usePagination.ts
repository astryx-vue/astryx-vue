import type { MaybeRef, Ref } from 'vue'
import { computed, toValue } from 'vue'

/**
 * 窄于这个宽度时收起两侧页码，只留当前页附近的按钮。
 * 再窄于 {@link PAGINATION_MINIMAL_MAX_WIDTH} 时改为「当前页 / 总页数」。
 */
export const PAGINATION_COMPACT_MAX_WIDTH = 576

/** 比手机上单列卡片更窄时，才改成「当前页 / 总页数」。 */
export const PAGINATION_MINIMAL_MAX_WIDTH = 260

export type PaginationDensity = 'full' | 'compact' | 'minimal'

/**
 * 按容器宽度决定分页怎么排。
 * 宽度未知（还没量到，或测试环境里是 0）时保持完整页码，避免默认行为乱跳。
 */
export function paginationDensityForWidth(width: number): PaginationDensity {
  if (!Number.isFinite(width) || width <= 0)
    return 'full'
  if (width < PAGINATION_MINIMAL_MAX_WIDTH)
    return 'minimal'
  if (width < PAGINATION_COMPACT_MAX_WIDTH)
    return 'compact'
  return 'full'
}

/** `full` 两侧各 1 页；更窄时两侧为 0，只保留当前页和首尾。 */
export function siblingCountForDensity(density: PaginationDensity): number {
  return density === 'full' ? 1 : 0
}

/**
 * 生成要显示的页码。`-1` 表示省略号。
 * 算法与上游 Astryx 的 `generatePageRange` 一致，`siblingCount` 是当前页两侧各留几页。
 */
export function generatePageRange(currentPage: number, totalPages: number, siblingCount: number): number[] {
  const siblings = Number.isFinite(siblingCount) ? Math.max(0, Math.floor(siblingCount)) : 1
  const totalSlots = 5 + 2 * siblings

  if (totalPages <= totalSlots)
    return Array.from({ length: totalPages }, (_, index) => index + 1)

  const leftSiblingIndex = Math.max(currentPage - siblings, 1)
  const rightSiblingIndex = Math.min(currentPage + siblings, totalPages)
  const showLeftEllipsis = leftSiblingIndex > 2
  const showRightEllipsis = rightSiblingIndex < totalPages - 1

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftRange = 3 + 2 * siblings
    const pages = Array.from({ length: leftRange }, (_, index) => index + 1)
    pages.push(-1, totalPages)
    return pages
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightRange = 3 + 2 * siblings
    const pages = [1, -1]
    for (let page = totalPages - rightRange + 1; page <= totalPages; page++)
      pages.push(page)
    return pages
  }

  const pages = [1, -1]
  for (let page = leftSiblingIndex; page <= rightSiblingIndex; page++)
    pages.push(page)
  pages.push(-1, totalPages)
  return pages
}

export interface UsePaginationOptions {
  /** 当前页码（1-based） */
  page: Ref<number>
  /** 每页条目数 */
  pageSize: Ref<number>
  /** 总条目数 */
  total: Ref<number>
  /** 页码变化回调 */
  onPageChange: (page: number) => void
  /** 每页条目数变化回调 */
  onPageSizeChange?: (pageSize: number) => void
  /**
   * 当前页两侧各显示几个页码。不传时按 1 处理，和原来的 7 个槽位一致。
   * 窄容器传 0，收成「首页、当前页、末页」。
   */
  siblingCount?: MaybeRef<number>
  /**
   * 上一页 / 下一页每次跳几页。不是正整数时按 1 处理。
   */
  step?: MaybeRef<number | undefined>
  /**
   * 总数未知时，是否还有下一页。只有 `total <= 0` 且这里传入了布尔值，才进入游标模式。
   */
  hasMore?: MaybeRef<boolean | undefined>
}

export interface PaginationState {
  /** 总页数 */
  totalPages: Ref<number>
  /** 是否可以上一页 */
  canPrevious: Ref<boolean>
  /** 是否可以下一页 */
  canNext: Ref<boolean>
  /** 显示的页码列表 */
  pageNumbers: Ref<number[]>
  /** 上一页 */
  previous: () => void
  /** 下一页 */
  next: () => void
  /** 跳转到指定页 */
  goto: (page: number) => void
  /** 跳到第一页 */
  first: () => void
  /** 跳到最后一页。总数未知时没有目标。 */
  last: () => void
  /** 总数未知、靠 `hasMore` 决定能不能往后翻。 */
  isCursor: Ref<boolean>
  /** 修改每页条目数 */
  setPageSize: (size: number) => void
}

/**
 * 分页逻辑：页码计算、页码范围生成。
 */
function pageStride(step: number | undefined): number {
  return Number.isInteger(step) && step != null && step >= 1 ? step : 1
}

export function usePagination(options: UsePaginationOptions): PaginationState {
  const { page, pageSize, total, onPageChange, onPageSizeChange, siblingCount, step, hasMore } = options

  const totalPages = computed(() => {
    return Math.max(1, Math.ceil(total.value / pageSize.value))
  })

  const isCursor = computed(() => toValue(hasMore) !== undefined && total.value <= 0)
  const canPrevious = computed(() => page.value > 1)
  const canNext = computed(() => isCursor.value ? toValue(hasMore) === true : page.value < totalPages.value)

  const pageNumbers = computed(() => {
    if (isCursor.value)
      return []
    const count = toValue(siblingCount) ?? 1
    return generatePageRange(page.value, totalPages.value, count)
  })

  function previous(): void {
    if (!canPrevious.value)
      return
    onPageChange(Math.max(1, page.value - pageStride(toValue(step))))
  }

  function next(): void {
    if (!canNext.value)
      return
    const target = page.value + pageStride(toValue(step))
    onPageChange(isCursor.value ? target : Math.min(target, totalPages.value))
  }

  function goto(targetPage: number): void {
    const lower = Math.max(1, targetPage)
    const clamped = isCursor.value ? lower : Math.min(lower, totalPages.value)
    if (clamped !== page.value)
      onPageChange(clamped)
  }

  function first(): void {
    if (canPrevious.value)
      onPageChange(1)
  }

  function last(): void {
    if (!isCursor.value && canNext.value)
      onPageChange(totalPages.value)
  }

  function setPageSize(size: number): void {
    onPageSizeChange?.(size)
    // 调整页码，确保当前页在新的总页数范围内
    const newTotalPages = Math.max(1, Math.ceil(total.value / size))
    if (page.value > newTotalPages) {
      onPageChange(newTotalPages)
    }
  }

  return {
    totalPages,
    canPrevious,
    canNext,
    pageNumbers,
    previous,
    next,
    goto,
    first,
    last,
    isCursor,
    setPageSize,
  }
}
