import type { MaybeRefOrGetter } from 'vue'
import type { TableColumn, TablePlugin } from '../types.js'
import { toValue } from 'vue'

export interface ColumnSettingsOption<TColumnKey extends string = string> {
  key: TColumnKey
  label: string
  isAlwaysVisible?: boolean
}

export interface UseTableColumnSettingsConfig<TColumnKey extends string = string> {
  columns: readonly ColumnSettingsOption<TColumnKey>[]
  activeColumnKeys: readonly TColumnKey[]
  onChangeActiveColumnKeys?: (keys: TColumnKey[]) => void
}

export function useTableColumnSettingsState<TColumnKey extends string>(config: {
  columns: readonly ColumnSettingsOption<TColumnKey>[]
  activeColumnKeys: MaybeRefOrGetter<readonly TColumnKey[]>
  onChangeActiveColumnKeys: (keys: TColumnKey[]) => void
}) {
  function setActiveColumnKeys(keys: readonly TColumnKey[]) {
    const locked = config.columns.filter(column => column.isAlwaysVisible).map(column => column.key)
    const next = [...keys]
    for (const key of locked) {
      if (!next.includes(key))
        next.unshift(key)
    }
    config.onChangeActiveColumnKeys(next)
  }
  return {
    get activeColumnKeys() {
      return toValue(config.activeColumnKeys)
    },
    setActiveColumnKeys,
    columnSettingsConfig: {
      columns: config.columns,
      get activeColumnKeys() {
        return toValue(config.activeColumnKeys)
      },
      onChangeActiveColumnKeys: setActiveColumnKeys,
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
