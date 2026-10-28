import type { MaybeRefOrGetter } from 'vue'
import type { TableCellPatch, TableColumn, TablePlugin } from '../types.js'
import { onScopeDispose, toValue } from 'vue'
import { pixel, resolveColumnFloorWidths } from '../columnUtils.js'

export const SELECT_COLUMN_KEY = '__select'
/** 原版 useTableSelection 的选择列宽是 36px。 */
export const SELECT_COLUMN_WIDTH = 36

export interface UseTableStickyColumnsConfig {
  startKeys?: readonly string[]
  endKeys?: readonly string[]
}

export interface StickySide {
  edge: 'start' | 'end'
  offset: number
}

export function stickyOffsets<T extends Record<string, unknown>>(
  columns: readonly TableColumn<T>[],
  keys: readonly string[],
  edge: 'start' | 'end',
): Map<string, number> | null {
  if (columns.length === 0 || keys.length === 0)
    return null
  const widths = resolveColumnFloorWidths(columns)
  const offsets = new Map<string, number>()
  if (edge === 'start') {
    let last = -1
    columns.forEach((column, index) => {
      if (keys.includes(column.key))
        last = index
    })
    if (last === -1)
      return null
    let cumulative = 0
    for (let index = 0; index <= last; index += 1) {
      const column = columns[index]
      if (column == null)
        continue
      offsets.set(column.key, cumulative)
      cumulative += widths.get(column.key) ?? 0
    }
    return offsets
  }
  let first = -1
  for (let index = 0; index < columns.length; index += 1) {
    const column = columns[index]
    if (column != null && keys.includes(column.key)) {
      first = index
      break
    }
  }
  if (first === -1)
    return null
  let cumulative = 0
  for (let index = columns.length - 1; index >= first; index -= 1) {
    const column = columns[index]
    if (column == null)
      continue
    offsets.set(column.key, cumulative)
    cumulative += widths.get(column.key) ?? 0
  }
  return offsets
}

export function resolveStickySide<T extends Record<string, unknown>>(
  columns: readonly TableColumn<T>[],
  columnKey: string,
  startKeys: readonly string[],
  endKeys: readonly string[],
): StickySide | null {
  const start = stickyOffsets(columns, startKeys, 'start')
  if (start?.has(columnKey))
    return { edge: 'start', offset: start.get(columnKey) ?? 0 }
  const end = stickyOffsets(columns, endKeys, 'end')
  if (end?.has(columnKey))
    return { edge: 'end', offset: end.get(columnKey) ?? 0 }
  return null
}

function patchFor(side: StickySide, kind: 'header' | 'body'): TableCellPatch {
  const style = side.edge === 'start'
    ? { position: 'sticky' as const, insetInlineStart: `${side.offset}px`, zIndex: kind === 'header' ? 3 : 1 }
    : { position: 'sticky' as const, insetInlineEnd: `${side.offset}px`, zIndex: kind === 'header' ? 3 : 1 }
  return {
    class: `astryx-table__sticky astryx-table__sticky--${side.edge}`,
    style,
  }
}

export function useTableStickyColumns<T extends Record<string, unknown>>(
  config: MaybeRefOrGetter<UseTableStickyColumnsConfig>,
): TablePlugin<T> {
  let detach: (() => void) | null = null

  function bindScrollRoot(element: HTMLElement | null): void {
    detach?.()
    detach = null
    if (element == null)
      return
    const update = (): void => {
      const current = toValue(config)
      const maxScroll = element.scrollWidth - element.clientWidth
      const hasOverflow = maxScroll > 1
      const position = Math.abs(element.scrollLeft)
      if ((current.startKeys?.length ?? 0) > 0)
        element.style.setProperty('--table-sticky-shadow-start', hasOverflow && position > 1 ? '1' : '0')
      if ((current.endKeys?.length ?? 0) > 0)
        element.style.setProperty('--table-sticky-shadow-end', hasOverflow && position < maxScroll - 1 ? '1' : '0')
    }
    element.addEventListener('scroll', update, { passive: true })
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update)
    observer?.observe(element)
    update()
    detach = () => {
      element.removeEventListener('scroll', update)
      observer?.disconnect()
    }
  }

  onScopeDispose(() => {
    detach?.()
    detach = null
  })

  return {
    bindScrollRoot,
    cellPatch({ column, columns, kind }) {
      const current = toValue(config)
      const start = current.startKeys ?? []
      const end = current.endKeys ?? []
      if (start.length === 0 && end.length === 0)
        return null
      const side = resolveStickySide(columns, column.key, start, end)
      return side == null ? null : patchFor(side, kind)
    },
  }
}

export function selectColumn<T extends Record<string, unknown>>(): TableColumn<T> {
  return { key: SELECT_COLUMN_KEY, width: pixel(SELECT_COLUMN_WIDTH), headerHidden: true, resizable: false }
}
