import type { UsePaginationOptions } from './usePagination.js'
import { describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { usePagination } from './usePagination.js'

describe('usePagination', () => {
  it('calculates total pages', () => {
    const page = ref(1)
    const pageSize = ref(10)
    const total = ref(95)
    const onPageChange = vi.fn()

    const { totalPages } = usePagination({
      page,
      pageSize,
      total,
      onPageChange,
    } as UsePaginationOptions)

    expect(totalPages.value).toBe(10) // 95 / 10 = 9.5, rounded up to 10
  })

  it('shows canPrevious and canNext correctly', () => {
    const page = ref(5)
    const pageSize = ref(10)
    const total = ref(100)
    const onPageChange = vi.fn()

    const { canPrevious, canNext } = usePagination({
      page,
      pageSize,
      total,
      onPageChange,
    } as UsePaginationOptions)

    expect(canPrevious.value).toBe(true)
    expect(canNext.value).toBe(true)
  })

  it('disables previous on first page', () => {
    const page = ref(1)
    const pageSize = ref(10)
    const total = ref(100)
    const onPageChange = vi.fn()

    const { canPrevious } = usePagination({
      page,
      pageSize,
      total,
      onPageChange,
    } as UsePaginationOptions)

    expect(canPrevious.value).toBe(false)
  })

  it('disables next on last page', () => {
    const page = ref(10)
    const pageSize = ref(10)
    const total = ref(100)
    const onPageChange = vi.fn()

    const { canNext } = usePagination({
      page,
      pageSize,
      total,
      onPageChange,
    } as UsePaginationOptions)

    expect(canNext.value).toBe(false)
  })

  it('generates simple page numbers for small total', () => {
    const page = ref(3)
    const pageSize = ref(10)
    const total = ref(50) // 5 pages
    const onPageChange = vi.fn()

    const { pageNumbers } = usePagination({
      page,
      pageSize,
      total,
      onPageChange,
    } as UsePaginationOptions)

    expect(pageNumbers.value).toEqual([1, 2, 3, 4, 5])
  })

  it('shows ellipsis for large page count near start', () => {
    const page = ref(2)
    const pageSize = ref(10)
    const total = ref(100) // 10 pages
    const onPageChange = vi.fn()

    const { pageNumbers } = usePagination({
      page,
      pageSize,
      total,
      onPageChange,
    } as UsePaginationOptions)

    // Should show: 1 2 3 4 5 ... 10
    expect(pageNumbers.value).toEqual([1, 2, 3, 4, 5, -1, 10])
  })

  it('shows ellipsis for large page count in middle', () => {
    const page = ref(6)
    const pageSize = ref(10)
    const total = ref(100) // 10 pages
    const onPageChange = vi.fn()

    const { pageNumbers } = usePagination({
      page,
      pageSize,
      total,
      onPageChange,
    } as UsePaginationOptions)

    // Should show: 1 ... 5 6 7 ... 10
    expect(pageNumbers.value).toEqual([1, -1, 5, 6, 7, -1, 10])
  })

  it('shows ellipsis for large page count near end', () => {
    const page = ref(9)
    const pageSize = ref(10)
    const total = ref(100) // 10 pages
    const onPageChange = vi.fn()

    const { pageNumbers } = usePagination({
      page,
      pageSize,
      total,
      onPageChange,
    } as UsePaginationOptions)

    // Should show: 1 ... 6 7 8 9 10
    expect(pageNumbers.value).toEqual([1, -1, 6, 7, 8, 9, 10])
  })

  it('goes to previous page', () => {
    const page = ref(5)
    const pageSize = ref(10)
    const total = ref(100)
    const onPageChange = vi.fn()

    const { previous } = usePagination({
      page,
      pageSize,
      total,
      onPageChange,
    } as UsePaginationOptions)

    previous()
    expect(onPageChange).toHaveBeenCalledWith(4)
  })

  it('goes to next page', () => {
    const page = ref(5)
    const pageSize = ref(10)
    const total = ref(100)
    const onPageChange = vi.fn()

    const { next } = usePagination({
      page,
      pageSize,
      total,
      onPageChange,
    } as UsePaginationOptions)

    next()
    expect(onPageChange).toHaveBeenCalledWith(6)
  })

  it('does not go before page 1', () => {
    const page = ref(1)
    const pageSize = ref(10)
    const total = ref(100)
    const onPageChange = vi.fn()

    const { previous } = usePagination({
      page,
      pageSize,
      total,
      onPageChange,
    } as UsePaginationOptions)

    previous()
    expect(onPageChange).not.toHaveBeenCalled()
  })

  it('does not go beyond last page', () => {
    const page = ref(10)
    const pageSize = ref(10)
    const total = ref(100)
    const onPageChange = vi.fn()

    const { next } = usePagination({
      page,
      pageSize,
      total,
      onPageChange,
    } as UsePaginationOptions)

    next()
    expect(onPageChange).not.toHaveBeenCalled()
  })

  it('jumps to specific page', () => {
    const page = ref(1)
    const pageSize = ref(10)
    const total = ref(100)
    const onPageChange = vi.fn()

    const { goto } = usePagination({
      page,
      pageSize,
      total,
      onPageChange,
    } as UsePaginationOptions)

    goto(7)
    expect(onPageChange).toHaveBeenCalledWith(7)
  })

  it('clamps goto to valid range', () => {
    const page = ref(5)
    const pageSize = ref(10)
    const total = ref(100) // 10 pages
    const onPageChange = vi.fn()

    const { goto } = usePagination({
      page,
      pageSize,
      total,
      onPageChange,
    } as UsePaginationOptions)

    goto(15) // Beyond last page
    expect(onPageChange).toHaveBeenCalledWith(10)

    onPageChange.mockClear()
    page.value = 5

    goto(0) // Before first page
    expect(onPageChange).toHaveBeenCalledWith(1)
  })

  it('changes page size', () => {
    const page = ref(5)
    const pageSize = ref(10)
    const total = ref(100)
    const onPageChange = vi.fn()
    const onPageSizeChange = vi.fn()

    const { setPageSize } = usePagination({
      page,
      pageSize,
      total,
      onPageChange,
      onPageSizeChange,
    } as UsePaginationOptions)

    setPageSize(20)
    expect(onPageSizeChange).toHaveBeenCalledWith(20)
  })

  it('adjusts page when changing page size makes current page invalid', () => {
    const page = ref(8)
    const pageSize = ref(10)
    const total = ref(100) // 10 pages with size 10
    const onPageChange = vi.fn()
    const onPageSizeChange = vi.fn()

    const { setPageSize } = usePagination({
      page,
      pageSize,
      total,
      onPageChange,
      onPageSizeChange,
    } as UsePaginationOptions)

    setPageSize(50) // Now only 2 pages (100/50)
    expect(onPageChange).toHaveBeenCalledWith(2) // Adjust to last valid page
  })

  it('handles empty data', () => {
    const page = ref(1)
    const pageSize = ref(10)
    const total = ref(0)
    const onPageChange = vi.fn()

    const { totalPages, pageNumbers } = usePagination({
      page,
      pageSize,
      total,
      onPageChange,
    } as UsePaginationOptions)

    expect(totalPages.value).toBe(1) // At least 1 page
    expect(pageNumbers.value).toEqual([1])
  })
})
