import type { MaybeRefOrGetter } from 'vue'
import type { TableColumn, TablePlugin } from '../types.js'
import { toValue } from 'vue'

export interface ColumnSettingsOption<TColumnKey extends string = string> {
  /** 列的 key，必须和 `TableColumn.key` 一致。 */
  key: TColumnKey
  /** 设置界面里显示的名字。 */
  label: string
  /** 为真时这一列不能被隐藏，开关是禁用状态。 */
  isAlwaysVisible?: boolean
  /** 分组名。同组的列在设置列表里排在一起。 */
  group?: string
}

export interface UseTableColumnSettingsConfig<TColumnKey extends string = string> {
  columns: readonly ColumnSettingsOption<TColumnKey>[]
  activeColumnKeys: readonly TColumnKey[]
  onChangeActiveColumnKeys?: (keys: TColumnKey[]) => void
  /** 「恢复默认」用的列 key。不传就是全部列。 */
  defaultColumnKeys?: readonly TColumnKey[]
}

/** 设置面板需要的一组读写方法。 */
export interface TableColumnSettingsState<TColumnKey extends string = string> {
  /** 当前打开的列 key，按显示顺序。 */
  readonly activeColumnKeys: readonly TColumnKey[]
  /** 切换一列。常显列不会被切掉。 */
  toggleColumn: (key: TColumnKey) => void
  /** 这一列现在是打开的吗。 */
  isColumnActive: (key: TColumnKey) => boolean
  /** 这一列允许被关掉吗。常显列不允许。 */
  isColumnToggleable: (key: TColumnKey) => boolean
  /** 打开全部列。 */
  showAllColumns: () => void
  /** 恢复到 `defaultColumnKeys`，没给就是全部列。 */
  resetToDefault: () => void
  /** 换一组打开的列。常显列会被补回去。 */
  setActiveColumnKeys: (keys: readonly TColumnKey[]) => void
  columnSettingsConfig: UseTableColumnSettingsConfig<TColumnKey>
}

export function useTableColumnSettingsState<TColumnKey extends string>(config: {
  columns: readonly ColumnSettingsOption<TColumnKey>[]
  activeColumnKeys: MaybeRefOrGetter<readonly TColumnKey[]>
  onChangeActiveColumnKeys: (keys: TColumnKey[]) => void
  defaultColumnKeys?: readonly TColumnKey[]
}): TableColumnSettingsState<TColumnKey> {
  function lockedKeys(): TColumnKey[] {
    return config.columns.filter(column => column.isAlwaysVisible).map(column => column.key)
  }
  function lockedSet(): Set<TColumnKey> {
    return new Set(lockedKeys())
  }
  function toggleColumn(key: TColumnKey): void {
    if (lockedSet().has(key))
      return
    const current = toValue(config.activeColumnKeys)
    if (current.includes(key))
      config.onChangeActiveColumnKeys(current.filter(item => item !== key))
    else
      config.onChangeActiveColumnKeys([...current, key])
  }
  function setActiveColumnKeys(keys: readonly TColumnKey[]): void {
    const next = new Set(keys)
    for (const key of lockedKeys())
      next.add(key)
    config.onChangeActiveColumnKeys([...next])
  }
  function showAllColumns(): void {
    config.onChangeActiveColumnKeys(config.columns.map(column => column.key))
  }
  function resetToDefault(): void {
    if (config.defaultColumnKeys != null) {
      config.onChangeActiveColumnKeys([...config.defaultColumnKeys])
      return
    }
    showAllColumns()
  }
  return {
    get activeColumnKeys() {
      return toValue(config.activeColumnKeys)
    },
    toggleColumn,
    isColumnActive: key => toValue(config.activeColumnKeys).includes(key),
    isColumnToggleable: key => !lockedSet().has(key),
    showAllColumns,
    resetToDefault,
    setActiveColumnKeys,
    columnSettingsConfig: {
      columns: config.columns,
      get activeColumnKeys() {
        return toValue(config.activeColumnKeys)
      },
      onChangeActiveColumnKeys: setActiveColumnKeys,
      get defaultColumnKeys() {
        return config.defaultColumnKeys
      },
    } satisfies UseTableColumnSettingsConfig<TColumnKey>,
  }
}

export function useTableColumnSettings<T extends Record<string, unknown>, TColumnKey extends string = string>(
  config: MaybeRefOrGetter<UseTableColumnSettingsConfig<TColumnKey>>,
): TablePlugin<T> {
  return {
    transformColumns(columns: TableColumn<T>[]) {
      const current = toValue(config)
      const order = new Map(current.activeColumnKeys.map((key, index) => [key, index]))
      return columns
        .filter(column => order.has(column.key as TColumnKey))
        .sort((a, b) => (order.get(a.key as TColumnKey) ?? 0) - (order.get(b.key as TColumnKey) ?? 0))
    },
  }
}
