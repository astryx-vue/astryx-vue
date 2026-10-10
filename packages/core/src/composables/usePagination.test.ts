import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { usePagination } from './usePagination.js'

describe('usePagination', () => {
  it('应该计算正确的总页数', () => {
    const totalItems = ref(100)
    const itemsPerPage = ref(10)
    const pagination = usePagination({ totalItems, itemsPerPage })

    expect(pagination.totalPages.value).toBe(10)
  })

  it('当没有项目时应该返回 1 页', () => {
    const totalItems = ref(0)
    const itemsPerPage = ref(10)
    const pagination = usePagination({ totalItems, itemsPerPage })

    expect(pagination.totalPages.value).toBe(1)
  })

  it('不完整的页面应该向上取整', () => {
    const totalItems = ref(95)
    const itemsPerPage = ref(10)
    const pagination = usePagination({ totalItems, itemsPerPage })

    expect(pagination.totalPages.value).toBe(10)
  })

  it('应该生成正确的页码数组（少于 7 页）', () => {
    const totalItems = ref(50)
    const itemsPerPage = ref(10)
    const currentPage = ref(1)
    const pagination = usePagination({ totalItems, itemsPerPage, currentPage })

    expect(pagination.pages.value).toEqual([1, 2, 3, 4, 5])
  })

  it('应该生成带省略号的页码数组（多于 7 页）', () => {
    const totalItems = ref(200)
    const itemsPerPage = ref(10)
    const currentPage = ref(1)
    const pagination = usePagination({ totalItems, itemsPerPage, currentPage })

    expect(pagination.pages.value).toEqual([1, 2, 3, -1, 20])
  })

  it('当前页在中间时应该显示两侧', () => {
    const totalItems = ref(200)
    const itemsPerPage = ref(10)
    const currentPage = ref(10)
    const pagination = usePagination({ totalItems, itemsPerPage, currentPage })

    expect(pagination.pages.value).toEqual([1, -1, 9, 10, 11, -1, 20])
  })

  it('当前页接近末尾时应该显示更多尾部页码', () => {
    const totalItems = ref(200)
    const itemsPerPage = ref(10)
    const currentPage = ref(19)
    const pagination = usePagination({ totalItems, itemsPerPage, currentPage })

    expect(pagination.pages.value).toEqual([1, -1, 18, 19, 20])
  })

  it('跳转到指定页应该生效', () => {
    const totalItems = ref(100)
    const itemsPerPage = ref(10)
    const currentPage = ref(1)
    const pagination = usePagination({ totalItems, itemsPerPage, currentPage })

    pagination.goToPage(5)
    expect(currentPage.value).toBe(5)
  })

  it('跳转超出范围应该被限制', () => {
    const totalItems = ref(100)
    const itemsPerPage = ref(10)
    const currentPage = ref(1)
    const pagination = usePagination({ totalItems, itemsPerPage, currentPage })

    pagination.goToPage(15)
    expect(currentPage.value).toBe(10)

    pagination.goToPage(0)
    expect(currentPage.value).toBe(1)
  })

  it('下一页应该递增当前页', () => {
    const totalItems = ref(100)
    const itemsPerPage = ref(10)
    const currentPage = ref(5)
    const pagination = usePagination({ totalItems, itemsPerPage, currentPage })

    pagination.nextPage()
    expect(currentPage.value).toBe(6)
  })

  it('上一页应该递减当前页', () => {
    const totalItems = ref(100)
    const itemsPerPage = ref(10)
    const currentPage = ref(5)
    const pagination = usePagination({ totalItems, itemsPerPage, currentPage })

    pagination.previousPage()
    expect(currentPage.value).toBe(4)
  })

  it('在首页时上一页不应该生效', () => {
    const totalItems = ref(100)
    const itemsPerPage = ref(10)
    const currentPage = ref(1)
    const pagination = usePagination({ totalItems, itemsPerPage, currentPage })

    pagination.previousPage()
    expect(currentPage.value).toBe(1)
  })

  it('在最后一页时下一页不应该生效', () => {
    const totalItems = ref(100)
    const itemsPerPage = ref(10)
    const currentPage = ref(10)
    const pagination = usePagination({ totalItems, itemsPerPage, currentPage })

    pagination.nextPage()
    expect(currentPage.value).toBe(10)
  })

  it('canGoPrevious 应该正确反映状态', () => {
    const totalItems = ref(100)
    const itemsPerPage = ref(10)
    const currentPage = ref(1)
    const pagination = usePagination({ totalItems, itemsPerPage, currentPage })

    expect(pagination.canGoPrevious.value).toBe(false)

    currentPage.value = 2
    expect(pagination.canGoPrevious.value).toBe(true)
  })

  it('canGoNext 应该正确反映状态', () => {
    const totalItems = ref(100)
    const itemsPerPage = ref(10)
    const currentPage = ref(10)
    const pagination = usePagination({ totalItems, itemsPerPage, currentPage })

    expect(pagination.canGoNext.value).toBe(false)

    currentPage.value = 9
    expect(pagination.canGoNext.value).toBe(true)
  })
})
