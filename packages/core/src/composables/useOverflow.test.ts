import { afterEach, describe, expect, it } from 'vitest'
import { nextTick, ref } from 'vue'
import { useMenuOverflow } from '../ContextMenu/useMenuOverflow.js'
import { mountComposable } from './mountComposable.js'
import { computeOverflow, useOverflow } from './useOverflow.js'

function setBox(element: HTMLElement, fields: Record<string, number>): void {
  for (const [key, value] of Object.entries(fields)) {
    Object.defineProperty(element, key, { configurable: true, value })
  }
}

describe('computeOverflow', () => {
  const base = {
    collapseFrom: 'end' as const,
    gap: 0,
    indicatorWidth: 0,
    minVisibleItems: 0,
  }

  it('没有项时是 0', () => {
    expect(computeOverflow({ ...base, availableWidth: 100, widths: [] })).toEqual({ visibleCount: 0, rows: 0 })
  })

  it('单行放得下就全留，放不下就给指示器留位置', () => {
    expect(computeOverflow({
      ...base,
      availableWidth: 70,
      indicatorWidth: 20,
      widths: [30, 30],
    })).toEqual({ visibleCount: 2, rows: 1 })

    expect(computeOverflow({
      ...base,
      availableWidth: 70,
      indicatorWidth: 20,
      widths: [30, 30, 30],
    })).toEqual({ visibleCount: 1, rows: 1 })
  })

  it('下限会压过放不下，上限会截断；下限比上限大时下限胜出', () => {
    expect(computeOverflow({
      ...base,
      availableWidth: 10,
      minVisibleItems: 2,
      widths: [30, 30, 30],
    })).toEqual({ visibleCount: 2, rows: 1 })

    expect(computeOverflow({
      ...base,
      availableWidth: 200,
      maxVisibleItems: 1,
      widths: [10, 10],
    })).toEqual({ visibleCount: 1, rows: 1 })

    expect(computeOverflow({
      ...base,
      availableWidth: 10,
      maxVisibleItems: 1,
      minVisibleItems: 2,
      widths: [30, 30, 30],
    }).visibleCount).toBe(2)
  })

  it('从开头收起时，先保留列表尾部的窄项', () => {
    const end = computeOverflow({
      ...base,
      availableWidth: 50,
      collapseFrom: 'end',
      widths: [100, 20],
    })
    const start = computeOverflow({
      ...base,
      availableWidth: 50,
      collapseFrom: 'start',
      widths: [100, 20],
    })
    expect(end.visibleCount).toBe(0)
    expect(start.visibleCount).toBe(1)
  })

  it('多行时先尽量排满，排不下再给最后一行留指示器', () => {
    expect(computeOverflow({
      ...base,
      availableWidth: 90,
      indicatorWidth: 20,
      maxRows: 2,
      widths: [40, 40, 40, 40],
    })).toEqual({ visibleCount: 4, rows: 2 })

    expect(computeOverflow({
      ...base,
      availableWidth: 90,
      indicatorWidth: 20,
      maxRows: 2,
      widths: [40, 40, 40, 40, 40],
    })).toEqual({ visibleCount: 3, rows: 2 })
  })
})

describe('useOverflow 元素是否溢出', () => {
  afterEach(() => {
    document.body.replaceChildren()
  })

  it('打开且内容更高时为 true，关上回到 false', async () => {
    const element = document.createElement('div')
    setBox(element, { clientHeight: 100, scrollHeight: 240 })
    document.body.append(element)
    const panel = ref<HTMLElement | null>(element)
    const isOpen = ref(false)
    const { result } = mountComposable(() => useOverflow(panel, isOpen))

    expect(result.value).toBe(false)
    isOpen.value = true
    await nextTick()
    expect(result.value).toBe(true)

    setBox(element, { clientHeight: 240, scrollHeight: 240 })
    isOpen.value = false
    isOpen.value = true
    await nextTick()
    expect(result.value).toBe(false)
  })

  it('元素晚一点才出现时也会量', async () => {
    const panel = ref<HTMLElement | null>(null)
    const isOpen = ref(true)
    const { result } = mountComposable(() => useOverflow(panel, isOpen))
    await nextTick()
    expect(result.value).toBe(false)

    const element = document.createElement('div')
    setBox(element, { clientHeight: 40, scrollHeight: 80 })
    panel.value = element
    await nextTick()
    expect(result.value).toBe(true)
  })

  it('旧的 useMenuOverflow 仍然是同一套判断', async () => {
    const element = document.createElement('div')
    setBox(element, { clientHeight: 10, scrollHeight: 30 })
    const panel = ref(element)
    const isOpen = ref(true)
    const { result } = mountComposable(() => useMenuOverflow(panel, isOpen))
    await nextTick()
    expect(result.value).toBe(true)
  })
})

describe('useOverflow 横向收起', () => {
  afterEach(() => {
    document.body.replaceChildren()
  })

  it('按测量宽度算出看得见的项数，并标出有没有溢出', async () => {
    const count = ref(3)
    const { result } = mountComposable(() => useOverflow(count, { gap: 0 }))
    const container = document.createElement('div')
    const measure = document.createElement('div')
    setBox(container, { offsetWidth: 70 })
    const widths = [30, 30, 30, 20]
    for (const width of widths) {
      const child = document.createElement('span')
      if (width === 20)
        child.dataset.overflowIndicator = ''
      setBox(child, { offsetHeight: 16, offsetWidth: width })
      measure.append(child)
    }
    document.body.append(container, measure)
    result.containerRef.value = container
    result.measureRef.value = measure
    await nextTick()

    expect(result.visibleCount.value).toBe(1)
    expect(result.hasOverflow.value).toBe(true)
    expect(result.rows.value).toBe(1)
    expect(result.rowHeight.value).toBe(16)
  })

  it('父元素模式用父级的内容宽度', async () => {
    const { result } = mountComposable(() => useOverflow(2, {
      behavior: 'observeParent',
      gap: 0,
    }))
    const parent = document.createElement('div')
    const container = document.createElement('div')
    const measure = document.createElement('div')
    parent.append(container)
    setBox(parent, { clientWidth: 100 })
    parent.style.paddingLeft = '10px'
    parent.style.paddingRight = '10px'
    for (const width of [40, 40]) {
      const child = document.createElement('span')
      setBox(child, { offsetHeight: 8, offsetWidth: width })
      measure.append(child)
    }
    document.body.append(parent, measure)
    result.containerRef.value = container
    result.measureRef.value = measure
    await nextTick()

    expect(result.visibleCount.value).toBe(2)
    expect(result.hasOverflow.value).toBe(false)
  })
})
