import type { ComputedRef, MaybeRefOrGetter, VNodeChild } from 'vue'
import type { TablePlugin, TableRowPatch } from '../types.js'
import { computed, toValue } from 'vue'

export const TABLE_GROUP_HEADER = '__astryxGroupHeader'

const GROUP_MARKER = Symbol('tableGroupHeader')

export interface UseTableGroupedRowsConfig<T extends Record<string, unknown>> {
  data: readonly T[]
  groupBy: (item: T) => string
  collapsedGroups: ReadonlySet<string>
  onToggleGroup: (groupKey: string) => void
  renderGroupHeader?: (groupKey: string, count: number, collapsed: boolean) => VNodeChild
  getRowKey?: (item: T) => string
  groupOrder?: readonly string[]
}

export function isTableGroupHeader(item: unknown): item is Record<string, unknown> & { groupKey: string, count: number } {
  return typeof item === 'object' && item != null && (item as Record<string, unknown>)[TABLE_GROUP_HEADER] === true
}

function makeHeader<T extends Record<string, unknown>>(groupKey: string, count: number): T {
  const target: Record<string | symbol, unknown> = {
    id: `__group_${groupKey}`,
    groupKey,
    count,
    [TABLE_GROUP_HEADER]: true,
    [GROUP_MARKER]: true,
  }
  return new Proxy(target, {
    get(source, prop) {
      if (prop === GROUP_MARKER || prop === TABLE_GROUP_HEADER || prop === 'groupKey' || prop === 'count' || prop === 'id')
        return source[prop]
      return prop in source ? source[prop] : ''
    },
  }) as T
}

export function buildGroupedRows<T extends Record<string, unknown>>(
  data: readonly T[],
  groupBy: (item: T) => string,
  collapsedGroups: ReadonlySet<string>,
  groupOrder?: readonly string[],
): T[] {
  if (data.length === 0)
    return []
  const groups = new Map<string, T[]>()
  for (const item of data) {
    const key = groupBy(item)
    const bucket = groups.get(key)
    if (bucket)
      bucket.push(item)
    else
      groups.set(key, [item])
  }
  let keys = [...groups.keys()]
  if (groupOrder != null && groupOrder.length > 0) {
    const ordered = groupOrder.filter(key => groups.has(key))
    const rest = keys.filter(key => !groupOrder.includes(key))
    keys = [...ordered, ...rest]
  }
  const out: T[] = []
  for (const key of keys) {
    const rows = groups.get(key) ?? []
    out.push(makeHeader<T>(key, rows.length))
    if (!collapsedGroups.has(key))
      out.push(...rows)
  }
  return out
}

export function useTableGroupedRows<T extends Record<string, unknown>>(
  config: MaybeRefOrGetter<UseTableGroupedRowsConfig<T>>,
): {
  data: ComputedRef<T[]>
  plugin: TablePlugin<T>
  idKey: (item: T) => string
} {
  const data = computed(() => {
    const current = toValue(config)
    return buildGroupedRows(current.data, current.groupBy, current.collapsedGroups, current.groupOrder)
  })
  const positions = computed(() => {
    const map = new Map<T, number>()
    data.value.forEach((item, index) => map.set(item, index))
    return map
  })

  function idKey(item: T): string {
    if (isTableGroupHeader(item))
      return `__group_${String(item.groupKey)}`
    const current = toValue(config)
    if (current.getRowKey)
      return current.getRowKey(item)
    return String(positions.value.get(item) ?? -1)
  }

  const plugin: TablePlugin<T> = {
    rowPatch(row): TableRowPatch | null {
      if (!isTableGroupHeader(row))
        return null
      const current = toValue(config)
      const groupKey = String(row.groupKey)
      const count = Number(row.count)
      const collapsed = current.collapsedGroups.has(groupKey)
      const render = current.renderGroupHeader
      return {
        attrs: { 'data-group-header': '' },
        suppressSelection: true,
        skipRowIndex: true,
        onClick: () => current.onToggleGroup(groupKey),
        group: {
          groupKey,
          count,
          collapsed,
          onToggle: () => current.onToggleGroup(groupKey),
          render: render ? () => render(groupKey, count, collapsed) : undefined,
        },
      }
    },
  }

  return { data, plugin, idKey }
}
