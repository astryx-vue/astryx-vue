import type { Ref } from 'vue'
import { ref, watch } from 'vue'

export interface UseGridRovingFocusOptions {
  /** 网格行数 */
  rows: Ref<number>
  /** 网格列数 */
  columns: Ref<number>
  /** 当前激活的单元格索引（行 * 列数 + 列） */
  activeIndex: Ref<number>
  /** 是否启用 */
  isEnabled?: Ref<boolean>
  /** 禁用单元格判断函数 */
  isDisabled?: (row: number, col: number) => boolean
  /** 索引变化回调 */
  onChange: (index: number) => void
}

export interface GridRovingFocus {
  /** 当前行 */
  row: Ref<number>
  /** 当前列 */
  column: Ref<number>
  /** 处理键盘按键 */
  onKeyDown: (event: KeyboardEvent) => void
  /** 移动到指定单元格 */
  moveTo: (row: number, col: number) => void
}

/**
 * 网格式导航（roving tabindex）：用方向键在二维网格中移动焦点。
 * 供 Calendar、Pagination（如果需要）等组件复用。
 */
export function useGridRovingFocus(
  options: UseGridRovingFocusOptions,
): GridRovingFocus {
  const {
    rows,
    columns,
    activeIndex,
    isEnabled = ref(true),
    isDisabled,
    onChange,
  } = options

  const row = ref(0)
  const column = ref(0)

  // 同步 row/column 与 activeIndex
  watch(activeIndex, (index) => {
    const cols = columns.value
    if (cols > 0) {
      row.value = Math.floor(index / cols)
      column.value = index % cols
    }
  }, { immediate: true })

  function indexFromRowCol(r: number, c: number): number {
    return r * columns.value + c
  }

  function moveTo(targetRow: number, targetCol: number): void {
    if (!isEnabled.value)
      return

    // 边界检查
    const r = Math.max(0, Math.min(targetRow, rows.value - 1))
    const c = Math.max(0, Math.min(targetCol, columns.value - 1))

    // 检查是否禁用
    if (isDisabled?.(r, c)) {
      return
    }

    const index = indexFromRowCol(r, c)
    onChange(index)
  }

  function moveUp(): void {
    moveTo(row.value - 1, column.value)
  }

  function moveDown(): void {
    moveTo(row.value + 1, column.value)
  }

  function moveLeft(): void {
    moveTo(row.value, column.value - 1)
  }

  function moveRight(): void {
    moveTo(row.value, column.value + 1)
  }

  function moveToFirstInRow(): void {
    moveTo(row.value, 0)
  }

  function moveToLastInRow(): void {
    moveTo(row.value, columns.value - 1)
  }

  function moveToFirstInColumn(): void {
    moveTo(0, column.value)
  }

  function moveToLastInColumn(): void {
    moveTo(rows.value - 1, column.value)
  }

  function onKeyDown(event: KeyboardEvent): void {
    if (!isEnabled.value)
      return

    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault()
        moveUp()
        break
      case 'ArrowDown':
        event.preventDefault()
        moveDown()
        break
      case 'ArrowLeft':
        event.preventDefault()
        moveLeft()
        break
      case 'ArrowRight':
        event.preventDefault()
        moveRight()
        break
      case 'Home':
        event.preventDefault()
        if (event.ctrlKey) {
          // Ctrl+Home: 第一行第一列
          moveTo(0, 0)
        }
        else {
          // Home: 当前行第一列
          moveToFirstInRow()
        }
        break
      case 'End':
        event.preventDefault()
        if (event.ctrlKey) {
          // Ctrl+End: 最后一行最后一列
          moveTo(rows.value - 1, columns.value - 1)
        }
        else {
          // End: 当前行最后一列
          moveToLastInRow()
        }
        break
      case 'PageUp':
        event.preventDefault()
        moveToFirstInColumn()
        break
      case 'PageDown':
        event.preventDefault()
        moveToLastInColumn()
        break
    }
  }

  return {
    row,
    column,
    onKeyDown,
    moveTo,
  }
}
