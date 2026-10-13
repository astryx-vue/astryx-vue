import type { SearchableItem } from '../composables/useAsyncSource.js'

export function enabledIndexes(items: readonly SearchableItem[]): number[] {
  const indexes: number[] = []
  items.forEach((item, index) => {
    if (!item.disabled)
      indexes.push(index)
  })
  return indexes
}

/**
 * 命令面板的高亮移动。输入框已经在过滤，这里不再做首字母跳转，也不绕回。
 * 当前没有高亮时，向下到第一项，向上到最后一项。
 */
export function moveHighlight(
  items: readonly SearchableItem[],
  current: number,
  direction: 'next' | 'previous' | 'first' | 'last',
): number {
  const enabled = enabledIndexes(items)
  if (enabled.length === 0)
    return -1

  if (direction === 'first')
    return enabled[0] ?? -1
  if (direction === 'last')
    return enabled[enabled.length - 1] ?? -1

  if (current < 0)
    return direction === 'next' ? (enabled[0] ?? -1) : (enabled[enabled.length - 1] ?? -1)

  if (direction === 'next')
    return enabled.find(index => index > current) ?? current
  return [...enabled].reverse().find(index => index < current) ?? current
}
