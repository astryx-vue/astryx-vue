import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import type { TableColumn, TablePlugin, TableRowPatch } from '../types.js'
import { computed, h, ref, toValue } from 'vue'
import Icon from '../../Icon/Icon.vue'
import { useAstryxMessages } from '../../locale/context.js'
import { cellText } from '../columnUtils.js'
import TableTreeCell from '../TableTreeCell.vue'
import { isInteractiveRowClick } from './interaction.js'

export interface TableTreeRowMeta {
  id: string
  level: number
  hasChildren: boolean
  isExpanded: boolean
}

export interface UseTableTreeDataConfig<T extends Record<string, unknown>> {
  getRowMeta: (item: T) => TableTreeRowMeta | undefined
  onToggleItem: (item: T) => void
  hasExpandableRows: boolean
  isAllExpanded?: boolean | 'indeterminate'
  onExpandAll?: () => void
  onCollapseAll?: () => void
  hasExpandAllControl?: boolean
  indent?: 'sm' | 'md' | 'lg'
  treeColumnKey?: string
  hasRowClickExpansion?: boolean
}

export interface UseTableTreeStateConfig<T extends Record<string, unknown>> {
  data: MaybeRefOrGetter<readonly T[]>
  idKey: (keyof T & string) | ((item: T) => string | number)
  childrenKey?: string
  defaultExpandedIds?: MaybeRefOrGetter<Iterable<string>>
  expandedIds?: MaybeRefOrGetter<ReadonlySet<string>>
  onExpandedIdsChange?: (ids: ReadonlySet<string>) => void
  isItemExpandable?: (item: T) => boolean
  sortSiblings?: (siblings: T[]) => T[]
  indent?: 'sm' | 'md' | 'lg'
  treeColumnKey?: string
  hasExpandAllControl?: boolean
  hasRowClickExpansion?: boolean
}

interface FlatTree<T> {
  rows: T[]
  meta: Map<string, TableTreeRowMeta>
  expandableIds: string[]
}

/**
 * config 本身和里面的字段都可能是 ref 或 getter，两层都要解开。
 * 只解数据类字段：`idKey` 这类回调字段是函数，`toValue` 会把它当 getter 调用掉。
 */
function fieldValue<T>(value: MaybeRefOrGetter<T> | undefined): T | undefined {
  return value === undefined ? undefined : toValue(value)
}

function itemId<T extends Record<string, unknown>>(item: T, idKey: UseTableTreeStateConfig<T>['idKey']): string {
  return typeof idKey === 'function' ? String(idKey(item)) : String(item[idKey])
}

function childRows<T extends Record<string, unknown>>(item: T, childrenKey: string): T[] {
  const children = item[childrenKey]
  return Array.isArray(children) ? children as T[] : []
}

export function flattenTree<T extends Record<string, unknown>>(config: UseTableTreeStateConfig<T>, expandedIds: ReadonlySet<string>): FlatTree<T> {
  const childrenKey = config.childrenKey ?? 'children'
  const rows: T[] = []
  const meta = new Map<string, TableTreeRowMeta>()
  const expandableIds: string[] = []
  const expandablePath = new Set<string>()

  const walkAll = (items: readonly T[]): void => {
    for (const item of items) {
      const id = itemId(item, config.idKey)
      if (expandablePath.has(id))
        continue
      const expandable = config.isItemExpandable ? config.isItemExpandable(item) : childRows(item, childrenKey).length > 0
      if (expandable)
        expandableIds.push(id)
      expandablePath.add(id)
      walkAll(childRows(item, childrenKey))
      expandablePath.delete(id)
    }
  }
  walkAll(fieldValue(config.data) ?? [])

  const path = new Set<string>()
  const walk = (items: readonly T[], level: number): void => {
    const siblings = config.sortSiblings ? config.sortSiblings([...items]) : items
    for (const item of siblings) {
      const id = itemId(item, config.idKey)
      if (path.has(id))
        continue
      const hasChildren = config.isItemExpandable ? config.isItemExpandable(item) : childRows(item, childrenKey).length > 0
      const isExpanded = hasChildren && expandedIds.has(id)
      rows.push(item)
      meta.set(id, { id, level, hasChildren, isExpanded })
      if (isExpanded) {
        path.add(id)
        walk(childRows(item, childrenKey), level + 1)
        path.delete(id)
      }
    }
  }
  walk(fieldValue(config.data) ?? [], 0)
  return { rows, meta, expandableIds }
}

function expansionState(expandableIds: readonly string[], expandedIds: ReadonlySet<string>): boolean | 'indeterminate' {
  if (expandableIds.length === 0)
    return false
  const expandedCount = expandableIds.filter(id => expandedIds.has(id)).length
  if (expandedCount === 0)
    return false
  if (expandedCount === expandableIds.length)
    return true
  return 'indeterminate'
}

function treeColumnKey<T extends Record<string, unknown>>(columns: readonly TableColumn<T>[], preferred?: string): string | undefined {
  if (preferred != null && columns.some(column => column.key === preferred))
    return preferred
  return columns.find(column => !column.key.startsWith('__'))?.key ?? columns[0]?.key
}

export function useTableTreeData<T extends Record<string, unknown>>(
  config: MaybeRefOrGetter<UseTableTreeDataConfig<T>>,
): TablePlugin<T> {
  const messages = useAstryxMessages()
  const resolvedKey = ref<string | undefined>()
  return {
    transformColumns(columns) {
      const current = toValue(config)
      const key = treeColumnKey(columns, current.treeColumnKey)
      resolvedKey.value = key
      if (!current.hasExpandableRows || key == null)
        return columns
      return columns.map((column) => {
        if (column.key !== key)
          return column
        const original = column.renderCell
        return {
          ...column,
          renderCell(item: T, index: number) {
            const live = toValue(config)
            const meta = live.getRowMeta(item)
            const body = original?.(item, index) ?? cellText(item[column.key])
            if (meta == null)
              return body
            return h(TableTreeCell, {
              level: meta.level,
              hasChildren: meta.hasChildren,
              expanded: meta.isExpanded,
              indent: live.indent ?? 'md',
              onToggle: () => live.onToggleItem(item),
            }, { default: () => body })
          },
        }
      })
    },
    headerPatch(column) {
      const current = toValue(config)
      if (!current.hasExpandAllControl || !current.hasExpandableRows || column.key !== resolvedKey.value)
        return null
      if (current.isAllExpanded == null || current.onExpandAll == null || current.onCollapseAll == null)
        return null
      const allExpanded = current.isAllExpanded === true
      return {
        before: () => h('button', {
          'type': 'button',
          'class': 'astryx-table__expander',
          'aria-label': allExpanded ? messages.value.table.collapseAllRows : messages.value.table.expandAllRows,
          'aria-expanded': String(allExpanded),
          'onClick': (event: MouseEvent) => {
            event.stopPropagation()
            if (allExpanded)
              current.onCollapseAll?.()
            else
              current.onExpandAll?.()
          },
        }, [
          h('span', { class: ['astryx-table__chevron-icon', allExpanded ? 'is-expanded' : undefined] }, [
            h(Icon, { icon: 'chevronRight', size: 'xsm' }),
          ]),
        ]),
      }
    },
    rowPatch(row): TableRowPatch | null {
      const current = toValue(config)
      const meta = current.hasExpandableRows ? current.getRowMeta(row) : undefined
      if (meta == null && !current.hasExpandableRows)
        return null
      const attrs: Record<string, string | undefined> = {}
      if (meta != null) {
        attrs['aria-level'] = String(meta.level + 1)
        if (meta.hasChildren)
          attrs['aria-expanded'] = String(meta.isExpanded)
      }
      const clickable = current.hasRowClickExpansion === true && meta?.hasChildren === true
      return {
        attrs,
        class: clickable ? 'astryx-table__clickable' : undefined,
        onClick: clickable
          ? (event) => {
              if (!isInteractiveRowClick(event))
                current.onToggleItem(row)
            }
          : undefined,
      }
    },
  }
}

export function useTableTreeState<T extends Record<string, unknown>>(
  config: MaybeRefOrGetter<UseTableTreeStateConfig<T>>,
): {
  visibleData: ComputedRef<T[]>
  plugin: TablePlugin<T>
  expandedIds: ComputedRef<ReadonlySet<string>>
  isAllExpanded: ComputedRef<boolean | 'indeterminate'>
  expandAll: () => void
  collapseAll: () => void
} {
  const initial = toValue(config)
  const internal = ref<ReadonlySet<string>>(new Set(fieldValue(initial.defaultExpandedIds) ?? []))
  const expandedIds = computed(() => fieldValue(toValue(config).expandedIds) ?? internal.value)
  const flat = computed(() => flattenTree(toValue(config), expandedIds.value))
  const isAllExpanded = computed(() => expansionState(flat.value.expandableIds, expandedIds.value))

  function commit(next: ReadonlySet<string>): void {
    const current = toValue(config)
    if (current.expandedIds === undefined)
      internal.value = next
    current.onExpandedIdsChange?.(next)
  }

  function expandAll(): void {
    commit(new Set(flat.value.expandableIds))
  }

  function collapseAll(): void {
    commit(new Set())
  }

  const plugin = useTableTreeData<T>(() => {
    const current = toValue(config)
    return {
      getRowMeta: item => flat.value.meta.get(itemId(item, current.idKey)),
      onToggleItem(item) {
        const id = itemId(item, toValue(config).idKey)
        const next = new Set(expandedIds.value)
        if (next.has(id))
          next.delete(id)
        else
          next.add(id)
        commit(next)
      },
      hasExpandableRows: flat.value.expandableIds.length > 0,
      isAllExpanded: isAllExpanded.value,
      onExpandAll: expandAll,
      onCollapseAll: collapseAll,
      hasExpandAllControl: current.hasExpandAllControl,
      hasRowClickExpansion: current.hasRowClickExpansion,
      indent: current.indent,
      treeColumnKey: current.treeColumnKey,
    }
  })

  return { visibleData: computed(() => flat.value.rows), plugin, expandedIds, isAllExpanded, expandAll, collapseAll }
}
