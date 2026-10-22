import type { ColumnResizeSnapshot } from './plugins/columnResize.js'
import type { TableColumn, TableColumnResizeContribution, TablePlugin } from './types.js'
import { columnResizeDirectionSign, columnResizeStep, resizeColumnWidths } from './plugins/columnResize.js'

interface ResizeState {
  snapshots: ColumnResizeSnapshot[]
  resizeIndex: number
  neighborIndex: number | null
  tableWidth: number
  /** 横向位移的符号。RTL 下拖右边等于变小。 */
  direction: 1 | -1
  elements: Map<string, HTMLElement>
}

export interface TableColumnResizeSession {
  startResize: (event: PointerEvent, column: TableColumn) => void
  onResizeKeydown: (event: KeyboardEvent, column: TableColumn) => void
  resizeLabel: (column: TableColumn) => string
  resizeMax: (contribution: TableColumnResizeContribution | null | undefined) => number | undefined
}

/**
 * 表头列宽把手的指针拖动和键盘步进。
 * 宽度怎么分给相邻列由 `resizeColumnWidths` 决定，这里只负责会话和预览。
 */
export function useTableColumnResizeSession(options: {
  plugins: () => readonly TablePlugin[]
  contributions: () => ReadonlyMap<string, TableColumnResizeContribution | null>
  resizeColumnLabel: (header: string) => string
}): TableColumnResizeSession {
  function buildResizeState(cell: HTMLElement, column: TableColumn): ResizeState | null {
    const row = cell.parentElement
    if (row == null)
      return null
    const table = cell.closest('table')
    const contributions = options.contributions()
    const dragged = contributions.get(column.key)
    const snapshots: ColumnResizeSnapshot[] = []
    const elements = new Map<string, HTMLElement>()
    for (const child of Array.from(row.children)) {
      if (!(child instanceof HTMLElement))
        continue
      const key = child.dataset.column
      if (key == null)
        continue
      const contribution = contributions.get(key)
      if (contribution == null)
        continue
      const measured = child.getBoundingClientRect().width
      snapshots.push({
        key,
        initialWidth: contribution.currentWidth ?? (measured > 0 ? measured : 0),
        minWidth: contribution.minWidth,
        maxWidth: contribution.maxWidth,
      })
      elements.set(key, child)
    }
    const resizeIndex = snapshots.findIndex(item => item.key === column.key)
    if (resizeIndex < 0)
      return null
    return {
      snapshots,
      resizeIndex,
      neighborIndex: dragged?.neighborKey == null
        ? null
        : snapshots.findIndex(item => item.key === dragged.neighborKey),
      tableWidth: table?.getBoundingClientRect().width ?? 0,
      direction: columnResizeDirectionSign(getComputedStyle(cell).direction),
      elements,
    }
  }

  function applyResize(widths: number[], state: ResizeState): void {
    state.snapshots.forEach((snapshot, index) => {
      const element = state.elements.get(snapshot.key)
      const width = widths[index]
      if (element == null || width == null)
        return
      const pixels = `${width}px`
      element.style.width = pixels
      element.style.minWidth = pixels
      element.style.maxWidth = pixels
    })
  }

  function resetResizeStyles(state: ResizeState): void {
    for (const element of state.elements.values()) {
      element.style.width = ''
      element.style.minWidth = ''
      element.style.maxWidth = ''
    }
  }

  /** 算一次拖动结果：先把预览写到表头，再把变了的列交给插件。 */
  function commitResize(state: ResizeState, delta: number): void {
    const widths = resizeColumnWidths(state, delta)
    applyResize(widths, state)
    const last = state.snapshots.length - 1
    const updates: Record<string, number> = {}
    state.snapshots.forEach((snapshot, index) => {
      // 最后一列的宽度是算出来的（表格剩余空间），不归用户管。
      const width = widths[index]
      if (index !== last && width != null)
        updates[snapshot.key] = width
    })
    if (Object.keys(updates).length === 0)
      return
    for (const plugin of options.plugins())
      plugin.onColumnResizeEnd?.(updates)
  }

  function resizeLabel(column: TableColumn): string {
    const header = typeof column.header === 'string' && column.header.length > 0 ? column.header : column.key
    return options.resizeColumnLabel(header)
  }

  function resizeMax(contribution: TableColumnResizeContribution | null | undefined): number | undefined {
    const max = contribution?.maxWidth
    return max == null || !Number.isFinite(max) ? undefined : max
  }

  function startResize(event: PointerEvent, column: TableColumn): void {
    const target = event.currentTarget
    if (!(target instanceof HTMLElement) || event.button !== 0)
      return
    const cell = target.closest('th')
    const state = cell == null ? null : buildResizeState(cell, column)
    if (state == null || cell == null)
      return
    event.preventDefault()
    const pointerId = event.pointerId
    const startX = event.clientX
    const table = cell.closest('table')
    const previousUserSelect = table?.style.userSelect ?? ''
    if (table != null)
      table.style.userSelect = 'none'
    target.setAttribute('data-resizing', 'true')
    target.setPointerCapture(pointerId)

    const listeners = new AbortController()
    const move = (moveEvent: PointerEvent): void => {
      if (moveEvent.pointerId !== pointerId)
        return
      applyResize(resizeColumnWidths(state, (moveEvent.clientX - startX) * state.direction), state)
    }
    const finish = (): void => {
      listeners.abort()
      target.removeAttribute('data-resizing')
      if (target.hasPointerCapture(pointerId))
        target.releasePointerCapture(pointerId)
      if (table != null)
        table.style.userSelect = previousUserSelect
    }
    const stop = (upEvent: PointerEvent): void => {
      if (upEvent.pointerId !== pointerId)
        return
      finish()
      commitResize(state, (upEvent.clientX - startX) * state.direction)
    }
    const cancel = (cancelEvent: PointerEvent): void => {
      if (cancelEvent.pointerId !== pointerId)
        return
      finish()
      resetResizeStyles(state)
    }
    const listenerOptions = { signal: listeners.signal }
    target.addEventListener('pointermove', move, listenerOptions)
    target.addEventListener('pointerup', stop, listenerOptions)
    target.addEventListener('pointercancel', cancel, listenerOptions)
  }

  function onResizeKeydown(event: KeyboardEvent, column: TableColumn): void {
    const handle = event.currentTarget
    if (!(handle instanceof HTMLElement))
      return
    const cell = handle.closest('th')
    const state = cell == null ? null : buildResizeState(cell, column)
    if (state == null)
      return
    const self = state.snapshots[state.resizeIndex]
    if (self == null)
      return
    const step = columnResizeStep(event.shiftKey)
    let delta: number | null = null
    switch (event.key) {
      case 'ArrowRight':
        delta = step * state.direction
        break
      case 'ArrowLeft':
        delta = -step * state.direction
        break
      case 'Home':
        delta = self.minWidth - self.initialWidth
        break
      case 'End':
        if (Number.isFinite(self.maxWidth))
          delta = self.maxWidth - self.initialWidth
        break
    }
    if (delta == null)
      return
    event.preventDefault()
    commitResize(state, delta)
  }

  return { startResize, onResizeKeydown, resizeLabel, resizeMax }
}
