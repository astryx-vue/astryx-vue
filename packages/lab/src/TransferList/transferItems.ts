import type { TransferListOption } from './types.js'

/** 把值 `key` 挪到下标 `to`，返回新数组。找不到 `key` 或 `to` 越界时原样返回一份拷贝。 */
export function moveValue<T>(value: readonly T[], key: T, to: number): T[] {
  const nextValue = [...value]
  const fromIndex = nextValue.indexOf(key)
  if (fromIndex < 0 || to < 0 || to >= nextValue.length)
    return nextValue
  nextValue.splice(fromIndex, 1)
  nextValue.splice(to, 0, key)
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
