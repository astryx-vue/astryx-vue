import type { ListInputColumnWidth } from './types.js'

/** 比例列没有指定最小宽度时的兜底值。 */
const DEFAULT_MIN_COLUMN_WIDTH_PX = 140

/** 把列宽配置翻成一条 CSS grid 轨道。 */
export function resolveColumnTrack(width?: ListInputColumnWidth): string {
  if (width?.type === 'pixel')
    return `${width.value}px`
  const proportion = width?.value ?? 1
  const minWidth = width?.minWidth ?? DEFAULT_MIN_COLUMN_WIDTH_PX
  return `minmax(${minWidth}px, ${proportion}fr)`
}

/** 所有列拼成 `grid-template-columns`。 */
export function resolveGridTemplate(columns: { width?: ListInputColumnWidth }[]): string {
  return columns.map(column => resolveColumnTrack(column.width)).join(' ')
}

/** 把 `fromIndex` 那一项挪到 `toIndex`，返回新数组。 */
export function moveItem<T>(value: readonly T[], fromIndex: number, toIndex: number): T[] {
  if (fromIndex === toIndex)
    return [...value]
  const nextValue = [...value]
  const [item] = nextValue.splice(fromIndex, 1)
  nextValue.splice(toIndex, 0, item as T)
  return nextValue
}
