// @vitest-environment node
import { describe, expect, it } from 'vitest'
import {
  calculateListWindow,
  calculateVariableListRange,
  createListWindowSegments,
  LIST_WINDOW_OVERSCAN,
  reconcileListAnchor,
} from './listWindow.js'

describe('calculateListWindow', () => {
  const base = { rowCount: 1000, rowHeight: 40, viewportHeight: 400, scrollTop: 0, startOffset: 40, isMeasured: true }

  it('量到视口之前从第一行挂满视口再加缓冲区', () => {
    const plan = calculateListWindow({ ...base, isMeasured: false, scrollTop: 5000 })!
    expect(plan.start).toBe(0)
    expect(plan.end).toBe(10 + LIST_WINDOW_OVERSCAN)
    expect(plan.segments).toEqual([
      { type: 'rows', start: 0, end: 14 },
      { type: 'gap', start: 14, end: 1000, height: 986 * 40 },
    ])
  })

  it('滚动之后只挂可见的行和两侧的缓冲区，表头高度算在滚动位置里', () => {
    const plan = calculateListWindow({ ...base, scrollTop: 40 + 100 * 40 + 10 })!
    expect(plan.firstVisibleIndex).toBe(100)
    expect(plan.offset).toBe(10)
    expect(plan.start).toBe(96)
    expect(plan.end).toBe(111 + LIST_WINDOW_OVERSCAN)
    expect(plan.segments[0]).toEqual({ type: 'gap', start: 0, end: 96, height: 96 * 40 })
    expect(plan.segments.at(-1)).toEqual({ type: 'gap', start: 115, end: 1000, height: 885 * 40 })
  })

  it('滚过头时夹在最后一屏', () => {
    const plan = calculateListWindow({ ...base, scrollTop: 1e9 })!
    expect(plan.end).toBe(1000)
    expect(plan.segments.at(-1)).toEqual({ type: 'rows', start: plan.start, end: 1000 })
  })

  it('算不出有限窗口时返回 null', () => {
    expect(calculateListWindow({ ...base, rowHeight: 0 })).toBeNull()
    expect(calculateListWindow({ ...base, viewportHeight: Number.NaN })).toBeNull()
    expect(calculateListWindow({ ...base, startOffset: -1 })).toBeNull()
  })
})

describe('createListWindowSegments', () => {
  it('窗口外有焦点的那一行单独挂着，两边是占位段', () => {
    expect(createListWindowSegments(100, 10, 50, 60, 3)).toEqual([
      { type: 'gap', start: 0, end: 3, height: 30 },
      { type: 'rows', start: 3, end: 4 },
      { type: 'gap', start: 4, end: 50, height: 460 },
      { type: 'rows', start: 50, end: 60 },
      { type: 'gap', start: 60, end: 100, height: 400 },
    ])
  })

  it('焦点行挨着窗口时并进同一段', () => {
    expect(createListWindowSegments(20, 10, 0, 5, 5)).toEqual([
      { type: 'rows', start: 0, end: 6 },
      { type: 'gap', start: 6, end: 20, height: 140 },
    ])
  })
})

describe('calculateVariableListRange', () => {
  // 五列：100、200、50、150、100。
  const offsets = [0, 100, 300, 350, 500, 600]

  it('量到之前从第一项挂到视口末尾再加缓冲区', () => {
    expect(calculateVariableListRange({ offsets, viewportSize: 250, scrollOffset: 0, isMeasured: false, overscan: 1 }))
      .toEqual({ start: 0, end: 3, firstVisibleIndex: 0, offset: 0 })
  })

  it('按起点找到第一项可见项和露出的距离', () => {
    expect(calculateVariableListRange({ offsets, viewportSize: 100, scrollOffset: 320, isMeasured: true, overscan: 1 }))
      .toEqual({ start: 1, end: 5, firstVisibleIndex: 2, offset: 20 })
  })
})

describe('reconcileListAnchor', () => {
  it('第一行可见行换了位置，滚动位置跟着它走', () => {
    const to = reconcileListAnchor({
      previousKeys: ['a', 'b', 'c', 'd'],
      keys: ['x', 'y', 'a', 'b', 'c', 'd'],
      firstVisibleIndex: 1,
      offset: 5,
      rowHeight: 10,
      viewportHeight: 20,
      startOffset: 0,
    })
    expect(to).toBe(35)
  })

  it('锚点行没了就找后面第一个还在的行', () => {
    const to = reconcileListAnchor({
      previousKeys: ['a', 'b', 'c', 'd'],
      keys: ['a', 'c', 'd'],
      firstVisibleIndex: 1,
      offset: 0,
      rowHeight: 10,
      viewportHeight: 10,
      startOffset: 0,
    })
    expect(to).toBe(10)
  })

  it('不等宽项按锚点项露出的比例换算', () => {
    const to = reconcileListAnchor({
      previousKeys: ['a', 'b'],
      keys: ['b', 'a'],
      firstVisibleIndex: 1,
      offset: 0.5,
      rowHeight: 0,
      viewportHeight: 50,
      startOffset: 0,
      offsets: [0, 200, 300],
    })
    expect(to).toBe(100)
  })
})
