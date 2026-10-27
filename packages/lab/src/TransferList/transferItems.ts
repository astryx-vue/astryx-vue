import type { TransferListOption } from './types.js'

/** 把 `fromIndex` 那一项挪到 `toIndex`，返回新数组。 */
export function moveItem<T>(value: readonly T[], fromIndex: number, toIndex: number): T[] {
  const nextValue = [...value]
  const [item] = nextValue.splice(fromIndex, 1)
  nextValue.splice(toIndex, 0, item as T)
  return nextValue
}

/**
 * 一行是否匹配搜索词。大小写折叠不跟语言走，和 Selector、MultiSelector、
 * CommandPalette 保持一致。`description` 只有是纯文字时才参与匹配。
 */
export function matchesQuery<T extends string>(option: TransferListOption<T>, query: string): boolean {
  if (query === '')
    return true
  const description = typeof option.description === 'string' ? option.description : ''
  return [option.label, description, option.group ?? ''].some(part => part.toLowerCase().includes(query))
}

/** 按 `group` 把可选条目分段，保持出现顺序；没分组的归到空字符串那一段。 */
export function groupOptions<T extends string>(options: readonly TransferListOption<T>[]): [string, TransferListOption<T>[]][] {
  const groups = new Map<string, TransferListOption<T>[]>()
  for (const option of options) {
    const group = option.group ?? ''
    const items = groups.get(group)
    if (items)
      items.push(option)
    else
      groups.set(group, [option])
  }
  return [...groups.entries()]
}

/**
 * 这一项能挪到的范围。遇到 `isReorderDisabled` 的邻居就停，
 * 所以被锁住的条目位置不动，别人也跨不过去。
 */
export function movableRange<T extends string>(
  optionByValue: Map<T, TransferListOption<T>>,
  optionValue: T,
  orderedValue: readonly T[],
): { index: number, start: number, end: number } {
  const index = orderedValue.indexOf(optionValue)
  let start = 0
  let end = orderedValue.length - 1
  for (let cursor = index - 1; cursor >= 0; cursor -= 1) {
    const option = optionByValue.get(orderedValue[cursor] as T)
    if (option == null || option.isReorderDisabled) {
      start = cursor + 1
      break
    }
  }
  for (let cursor = index + 1; cursor < orderedValue.length; cursor += 1) {
    const option = optionByValue.get(orderedValue[cursor] as T)
    if (option == null || option.isReorderDisabled) {
      end = cursor - 1
      break
    }
  }
  return { index, start, end }
}
