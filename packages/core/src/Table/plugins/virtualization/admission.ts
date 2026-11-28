import type { ListWindowKey } from '../../../composables/internal/listWindow/listWindow.js'
import type { TableColumn, TablePlugin, TableRowModel } from '../../types.js'

type Row = Record<string, unknown>

/** 自带 renderCell、但内容保证单行定高的内置列（例如行号列）。 */
const fixedHeightColumns = new WeakSet<object>()

/** 把一个内置列登记为单行定高，窗口化时不因为它自带 renderCell 就退回全部渲染。 */
export function registerFixedHeightColumn<T extends Row>(column: TableColumn<T>): TableColumn<T> {
  fixedHeightColumns.add(column)
  return column
}

export function isFixedHeightColumn(column: TableColumn): boolean {
  return column.renderCell == null || fixedHeightColumns.has(column)
}

/**
 * 插件合起来的行结构。声明了 `flat` 以外的结构，或者改行、改单元格却没声明 `flat` 的插件，
 * 决定了整张表的结构。
 */
export function resolveRowModel(plugins: readonly TablePlugin[]): TableRowModel {
  for (const plugin of plugins) {
    if (plugin.rowModel != null && plugin.rowModel !== 'flat')
      return plugin.rowModel
    if (plugin.rowModel == null && (plugin.rowPatch != null || plugin.cellPatch != null))
      return 'custom'
  }
  return 'flat'
}

export interface TableIdentity {
  keys: readonly ListWindowKey[]
  /** 每一行都有键，键的类型合法，并且互不相同。 */
  isValid: boolean
}

function canonicalKey(value: unknown): ListWindowKey | undefined {
  if (typeof value === 'string')
    return value.length > 0 ? value : undefined
  if (typeof value === 'number')
    return Number.isFinite(value) ? String(value) : undefined
  return undefined
}

/** 全部数据的行键。窗口化要求每一行都有唯一、合法的键。 */
export function resolveTableIdentity(rows: readonly Row[], idKey: string | ((row: Row) => string)): TableIdentity {
  const keys: ListWindowKey[] = []
  const seen = new Set<ListWindowKey>()
  let isValid = true
  for (const row of rows) {
    const key = canonicalKey(typeof idKey === 'function' ? idKey(row) : row[idKey])
    if (key === undefined || seen.has(key)) {
      isValid = false
      keys.push(String(keys.length))
      continue
    }
    seen.add(key)
    keys.push(key)
  }
  return { keys, isValid }
}

export interface SharedAdmissionInput {
  plugins: readonly TablePlugin[]
  identity: TableIdentity
  textOverflow: string | undefined
}

/** 行、列两个方向都要满足的条件。返回退回全部渲染的原因，能窗口化时为 `undefined`。 */
export function sharedFallbackReason({ plugins, identity, textOverflow }: SharedAdmissionInput): string | undefined {
  const rowModel = resolveRowModel(plugins)
  if (rowModel !== 'flat')
    return `plugins that change row structure (${rowModel}) must declare rowModel: 'flat' to admit windowing`
  if (!identity.isValid)
    return 'every row needs a unique, valid idKey'
  if (textOverflow === 'wrap')
    return 'explicitly wrapped content does not keep a fixed height'
  return undefined
}
