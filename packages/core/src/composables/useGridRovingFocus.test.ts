import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { useGridRovingFocus } from './useGridRovingFocus.js'

describe('useGridRovingFocus', () => {
  it('应该向右移动', () => {
    const activeRow = ref(0)
    const activeCol = ref(0)
    const grid = useGridRovingFocus({
      activeRow,
      activeCol,
      totalRows: ref(6),
      totalCols: ref(7),
    })

    grid.moveRight()
    expect(activeCol.value).toBe(1)
    expect(activeRow.value).toBe(0)
  })

  it('应该向左移动', () => {
    const activeRow = ref(0)
    const activeCol = ref(3)
    const grid = useGridRovingFocus({
      activeRow,
      activeCol,
      totalRows: ref(6),
      totalCols: ref(7),
    })

    grid.moveLeft()
    expect(activeCol.value).toBe(2)
    expect(activeRow.value).toBe(0)
  })

  it('应该向下移动', () => {
    const activeRow = ref(0)
    const activeCol = ref(0)
    const grid = useGridRovingFocus({
      activeRow,
      activeCol,
      totalRows: ref(6),
      totalCols: ref(7),
    })

    grid.moveDown()
    expect(activeRow.value).toBe(1)
    expect(activeCol.value).toBe(0)
  })

  it('应该向上移动', () => {
    const activeRow = ref(2)
    const activeCol = ref(0)
    const grid = useGridRovingFocus({
      activeRow,
      activeCol,
      totalRows: ref(6),
      totalCols: ref(7),
    })

    grid.moveUp()
    expect(activeRow.value).toBe(1)
    expect(activeCol.value).toBe(0)
  })

  it('在边界处向右应该换行', () => {
    const activeRow = ref(0)
    const activeCol = ref(6)
    const grid = useGridRovingFocus({
      activeRow,
      activeCol,
      totalRows: ref(6),
      totalCols: ref(7),
    })

    grid.moveRight()
    expect(activeRow.value).toBe(1)
    expect(activeCol.value).toBe(0)
  })

  it('在边界处向左应该换行到上一行末尾', () => {
    const activeRow = ref(1)
    const activeCol = ref(0)
    const grid = useGridRovingFocus({
      activeRow,
      activeCol,
      totalRows: ref(6),
      totalCols: ref(7),
    })

    grid.moveLeft()
    expect(activeRow.value).toBe(0)
    expect(activeCol.value).toBe(6)
  })

  it('应该跳到第一个单元格', () => {
    const activeRow = ref(3)
    const activeCol = ref(4)
    const grid = useGridRovingFocus({
      activeRow,
      activeCol,
      totalRows: ref(6),
      totalCols: ref(7),
    })

    grid.moveToStart()
    expect(activeRow.value).toBe(0)
    expect(activeCol.value).toBe(0)
  })

  it('应该跳到最后一个单元格', () => {
    const activeRow = ref(0)
    const activeCol = ref(0)
    const grid = useGridRovingFocus({
      activeRow,
      activeCol,
      totalRows: ref(6),
      totalCols: ref(7),
    })

    grid.moveToEnd()
    expect(activeRow.value).toBe(5)
    expect(activeCol.value).toBe(6)
  })

  it('PageDown 应该向下移动一页（4 周）', () => {
    const activeRow = ref(0)
    const activeCol = ref(0)
    const grid = useGridRovingFocus({
      activeRow,
      activeCol,
      totalRows: ref(6),
      totalCols: ref(7),
    })

    grid.pageDown()
    expect(activeRow.value).toBe(4)
    expect(activeCol.value).toBe(0)
  })

  it('PageUp 应该向上移动一页（4 周）', () => {
    const activeRow = ref(5)
    const activeCol = ref(0)
    const grid = useGridRovingFocus({
      activeRow,
      activeCol,
      totalRows: ref(6),
      totalCols: ref(7),
    })

    grid.pageUp()
    expect(activeRow.value).toBe(1)
    expect(activeCol.value).toBe(0)
  })

  it('键盘处理应该触发正确的移动', () => {
    const activeRow = ref(1)
    const activeCol = ref(1)
    const grid = useGridRovingFocus({
      activeRow,
      activeCol,
      totalRows: ref(6),
      totalCols: ref(7),
    })

    const rightEvent = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true })
    const handled = grid.handleKeyDown(rightEvent)
    expect(handled).toBe(true)
    expect(activeCol.value).toBe(2)

    const downEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' })
    grid.handleKeyDown(downEvent)
    expect(activeRow.value).toBe(2)
  })
})
