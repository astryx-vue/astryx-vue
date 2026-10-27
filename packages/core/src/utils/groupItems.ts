/**
 * 能按组摆放的条目。分组标题写在 `auxiliaryData.group`。
 */
export interface GroupableItem {
  auxiliaryData?: unknown
  [extra: string]: unknown
}

/** 一组条目。`heading` 为 null 表示这组没有标题。 */
export interface ItemGroup<T> {
  heading: string | null
  items: T[]
}

export interface GroupItemsOptions {
  /** 没有组名的条目放在有名字的组前面。默认放在最后。 */
  ungroupedFirst?: boolean
}

/** 读出条目上的组名。不是字符串就不算分组。空字符串仍算一个组名。 */
export function getItemGroup(item: GroupableItem): string | undefined {
  const aux = item.auxiliaryData
  if (aux == null || typeof aux !== 'object')
    return undefined
  const group = (aux as { group?: unknown }).group
  return typeof group === 'string' ? group : undefined
}

/**
 * 按 `auxiliaryData.group` 分组，组的先后跟它们第一次出现的顺序。
 * 没有任何组名时，返回一组 `heading: null`。
 */
export function groupItems<T extends GroupableItem>(
  items: readonly T[],
  { ungroupedFirst = false }: GroupItemsOptions = {},
): ItemGroup<T>[] {
  const hasGroups = items.some(item => getItemGroup(item) != null)
  if (!hasGroups)
    return [{ heading: null, items: [...items] }]

  const groupOrder: string[] = []
  const groups = new Map<string, T[]>()
  const ungrouped: T[] = []

  for (const item of items) {
    const group = getItemGroup(item)
    if (group != null) {
      const list = groups.get(group)
      if (list) {
        list.push(item)
      }
      else {
        groupOrder.push(group)
        groups.set(group, [item])
      }
    }
    else {
      ungrouped.push(item)
    }
  }

  const namedGroups: ItemGroup<T>[] = groupOrder.map(heading => ({
    heading,
    items: groups.get(heading) ?? [],
  }))
  const ungroupedGroup: ItemGroup<T>[] = ungrouped.length > 0
    ? [{ heading: null, items: ungrouped }]
    : []

  return ungroupedFirst
    ? [...ungroupedGroup, ...namedGroups]
    : [...namedGroups, ...ungroupedGroup]
}
