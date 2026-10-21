import type { SearchableItem } from '../composables/useAsyncSource.js'

export interface SearchItemGroup<T extends SearchableItem = SearchableItem> {
  heading: string | null
  items: T[]
}

function itemGroup(item: SearchableItem): string | undefined {
  const aux = item.auxiliaryData
  if (aux == null || typeof aux !== 'object')
    return undefined
  const group = (aux as { group?: unknown }).group
  return typeof group === 'string' ? group : undefined
}

/** Keep the order groups first appear in. Ungrouped items come last. */
export function groupSearchItems<T extends SearchableItem>(items: readonly T[]): SearchItemGroup<T>[] {
  if (!items.some(item => itemGroup(item) != null))
    return [{ heading: null, items: [...items] }]

  const order: string[] = []
  const groups = new Map<string, T[]>()
  const ungrouped: T[] = []
  for (const item of items) {
    const group = itemGroup(item)
    if (group == null) {
      ungrouped.push(item)
      continue
    }
    const list = groups.get(group)
    if (list) {
      list.push(item)
    }
    else {
      order.push(group)
      groups.set(group, [item])
    }
  }
  const named = order.map(heading => ({ heading, items: groups.get(heading) ?? [] }))
  return ungrouped.length > 0 ? [...named, { heading: null, items: ungrouped }] : named
}

/** Same order as the rendered options: named groups first, ungrouped last. */
export function flattenSearchItems<T extends SearchableItem>(items: readonly T[]): T[] {
  return groupSearchItems(items).flatMap(group => group.items)
}
