import type { PowerSearchField, PowerSearchFilter } from './types.js'

/** 字段名或别名里含有搜索词（已转小写）就算匹配；空搜索词匹配所有字段。 */
export function fieldMatchesQuery(field: PowerSearchField, normalizedQuery: string): boolean {
  if (normalizedQuery === '')
    return true
  if (field.label.toLowerCase().includes(normalizedQuery))
    return true
  return field.typeaheadAliases?.some(alias => alias.toLowerCase().includes(normalizedQuery)) ?? false
}

function stableSerialize(value: unknown): string {
  if (Array.isArray(value))
    return `[${value.map(stableSerialize).join(',')}]`
  if (value != null && typeof value === 'object') {
    return `{${Object.entries(value)
      .sort(([left], [right]) => (left < right ? -1 : left > right ? 1 : 0))
      .map(([key, entry]) => `${JSON.stringify(key)}:${stableSerialize(entry)}`)
      .join(',')}}`
  }
  return JSON.stringify(value) ?? 'undefined'
}

/** 条件的结构快照，和键的顺序无关；父组件每次改动都克隆一份值时，靠它认出是同一个条件。 */
export function filterSignature(filter: PowerSearchFilter): string {
  return stableSerialize({
    field: filter.field,
    operator: filter.operator,
    value: filter.value,
    isReadOnly: filter.isReadOnly ?? false,
  })
}

/**
 * 给「筛选条件」列表的每一行一个稳定编号，父组件重新排序、删掉上面一行或克隆值时，
 * 行还是那一行（焦点也不丢）。见过的对象沿用编号；新对象认领上一轮签名相同、
 * 还没人认领的编号；都不是就发新号。两个一样的条件按先后区分。每次渲染用当前列表调一次 `next`。
 */
export function createFilterIdentities(): { next: (filters: readonly PowerSearchFilter[]) => number[] } {
  const byObject = new WeakMap<PowerSearchFilter, number>()
  let previousBySignature = new Map<string, number[]>()
  let nextId = 0
  return {
    next(filters) {
      const used = new Set<number>()
      const ids: (number | null)[] = filters.map((filter) => {
        const known = byObject.get(filter)
        if (known == null || used.has(known))
          return null
        used.add(known)
        return known
      })
      const bySignature = new Map<string, number[]>()
      filters.forEach((filter, index) => {
        const signature = filterSignature(filter)
        let id = ids[index]
        if (id == null) {
          id = previousBySignature.get(signature)?.find(candidate => !used.has(candidate)) ?? nextId++
          used.add(id)
          byObject.set(filter, id)
          ids[index] = id
        }
        bySignature.set(signature, [...(bySignature.get(signature) ?? []), id])
      })
      previousBySignature = bySignature
      return ids as number[]
    },
  }
}

/**
 * 父组件可能已经重排、克隆或删掉了打开时的那个条件，找回它现在的位置：先按对象，
 * 再看原来的位置是否还是结构相同的条件，最后在全表里找唯一的结构匹配。
 * 找不到或有歧义时返回 null，免得改到别的条件上。
 */
export function resolveFilterIdentityIndex(
  filters: readonly PowerSearchFilter[],
  sourceFilter: PowerSearchFilter,
  sourceSignature: string,
  preferredIndex: number,
): number | null {
  const identityIndex = filters.indexOf(sourceFilter)
  if (identityIndex >= 0)
    return identityIndex
  const preferred = filters[preferredIndex]
  if (preferred != null && filterSignature(preferred) === sourceSignature)
    return preferredIndex
  const matching = filters.flatMap((filter, index) => filterSignature(filter) === sourceSignature ? [index] : [])
  return matching.length === 1 ? matching[0]! : null
}

/** 删掉 `removedIndex` 那一行后，焦点落到最近的、还能点的一行上，距离相同时选后面那行。 */
export function nearestEditableIndex(
  nextFilters: readonly PowerSearchFilter[],
  removedIndex: number,
  isRowButton: (filter: PowerSearchFilter) => boolean = filter => !filter.isReadOnly,
): number | undefined {
  let nearest: number | undefined
  nextFilters.forEach((filter, candidate) => {
    if (!isRowButton(filter))
      return
    if (nearest == null) {
      nearest = candidate
      return
    }
    const candidateDistance = Math.abs(candidate - removedIndex)
    const nearestDistance = Math.abs(nearest - removedIndex)
    if (candidateDistance < nearestDistance || (candidateDistance === nearestDistance && candidate >= removedIndex && nearest < removedIndex))
      nearest = candidate
  })
  return nearest
}
