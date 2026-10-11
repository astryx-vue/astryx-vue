import type { MultiSelectorOption, MultiSelectorOptionData } from './types.js'

export const SELECT_ALL_VALUE = '__astryx_select_all__'

export interface MultiSelectorRow {
  kind: 'option' | 'divider' | 'heading'
  key: string
  option?: MultiSelectorOptionData
  label?: string
}

export function isDivider(option: MultiSelectorOption): option is { type: 'divider' } {
  return typeof option === 'object' && option !== null && 'type' in option && option.type === 'divider'
}

export function isSection(option: MultiSelectorOption): option is { type: 'section', label: string, options: readonly (string | MultiSelectorOptionData)[] } {
  return typeof option === 'object' && option !== null && 'type' in option && option.type === 'section'
}

export function normalizeOption(option: string | MultiSelectorOptionData): MultiSelectorOptionData {
  if (typeof option === 'string')
    return { value: option, label: option }
  return option
}

function matches(option: MultiSelectorOptionData, query: string): boolean {
  if (query === '')
    return true
  return option.label.toLowerCase().includes(query) || (option.description?.toLowerCase().includes(query) ?? false)
}

/**
 * 把字符串、对象、分隔线和分组收成渲染行。搜索时丢掉对不上的选项和因此变空的分组。
 */
export function flattenOptions(options: readonly MultiSelectorOption[], query: string): MultiSelectorRow[] {
  const normalizedQuery = query.trim().toLowerCase()
  const rows: MultiSelectorRow[] = []
  let pendingDivider = false

  function pushDivider(): void {
    if (!pendingDivider || rows.length === 0)
      return
    rows.push({ kind: 'divider', key: `divider-${rows.length}` })
    pendingDivider = false
  }

  function pushOption(option: MultiSelectorOptionData, key: string): void {
    if (!matches(option, normalizedQuery))
      return
    pushDivider()
    rows.push({ kind: 'option', key, option })
  }

  options.forEach((option, index) => {
    if (typeof option === 'string') {
      pushOption(normalizeOption(option), `option-${option}`)
      return
    }
    if (isDivider(option)) {
      pendingDivider = true
      return
    }
    if (isSection(option)) {
      const children = option.options.map(normalizeOption).filter(item => matches(item, normalizedQuery))
      if (children.length === 0)
        return
      pendingDivider = rows.length > 0
      pushDivider()
      rows.push({ kind: 'heading', key: `heading-${option.label}-${index}`, label: option.label })
      for (const child of children)
        rows.push({ kind: 'option', key: `${option.label}-${String(child.value)}`, option: child })
      return
    }
    pushOption(option, `option-${String(option.value)}`)
  })

  return rows
}
