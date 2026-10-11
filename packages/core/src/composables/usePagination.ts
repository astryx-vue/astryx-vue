import type { Ref } from 'vue'
import { computed } from 'vue'

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
  /** 修改每页条目数 */
  setPageSize: (size: number) => void
}

/**
 * 分页逻辑：页码计算、页码范围生成。
 */
export function usePagination(options: UsePaginationOptions): PaginationState {
  const { page, pageSize, total, onPageChange, onPageSizeChange } = options

  const totalPages = computed(() => {
    return Math.max(1, Math.ceil(total.value / pageSize.value))
  })

  const canPrevious = computed(() => page.value > 1)
  const canNext = computed(() => page.value < totalPages.value)

  const pageNumbers = computed(() => {
    const current = page.value
    const total = totalPages.value
    const maxVisible = 7

    if (total <= maxVisible) {
      return Array.from({ length: total }, (_, i) => i + 1)
    }

    // 显示: 1 ... 4 5 [6] 7 8 ... 10
    const result: number[] = []

    if (current <= 4) {
      // 靠近开头
      for (let i = 1; i <= 5; i++)
        result.push(i)
      result.push(-1) // 省略号标记
      result.push(total)
    }
    else if (current >= total - 3) {
      // 靠近结尾
      result.push(1)
      result.push(-1)
      for (let i = total - 4; i <= total; i++)
        result.push(i)
    }
    else {
      // 中间
      result.push(1)
      result.push(-1)
      for (let i = current - 1; i <= current + 1; i++)
        result.push(i)
      result.push(-1)
      result.push(total)
    }

    return result
  })

  function previous(): void {
    if (canPrevious.value) {
      onPageChange(page.value - 1)
    }
  }

  function next(): void {
    if (canNext.value) {
      onPageChange(page.value + 1)
    }
  }

  function goto(targetPage: number): void {
    const clamped = Math.max(1, Math.min(targetPage, totalPages.value))
    if (clamped !== page.value) {
      onPageChange(clamped)
    }
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
    setPageSize,
  }
}
