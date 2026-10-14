import type { PowerSearchLookup } from './config.js'
import type { FilterValue, PartialFilter, PowerSearchFilter } from './types.js'

/** 编辑器里的半成品条件。嵌套子条件放在 children，填完才写进 value。 */
export interface EditableFilter {
  readonly field: string
  readonly operator?: string
  readonly value?: FilterValue
  readonly children?: readonly EditableFilter[]
  readonly isReadOnly?: boolean
}

function nestedChildren(partial: EditableFilter): readonly EditableFilter[] {
  if (partial.children != null)
    return partial.children
  if (partial.value?.type === 'nested')
    return partial.value.value
  return []
}

function isFilled(value: FilterValue): boolean {
  switch (value.type) {
    case 'empty':
      return true
    case 'string':
    case 'date_relative':
    case 'time':
    case 'enum':
    case 'custom':
      return value.value.trim() !== ''
    case 'string_list':
    case 'enum_list':
    case 'entity_list':
      return value.value.length > 0
    case 'integer':
    case 'float':
      return Number.isFinite(value.value)
    case 'date_absolute':
      return Number.isFinite(value.unixSeconds)
    case 'date_range':
      return value.value.start != null && value.value.end != null
    case 'nested':
      return value.value.length > 0
  }
}

/** 条件齐全才返回可保存的筛选。嵌套里有没填完的子条件时返回空。 */
export function completePowerSearchFilter(partial: EditableFilter | PartialFilter, lookup: PowerSearchLookup): PowerSearchFilter | null {
  if (partial.field === '' || partial.operator == null || partial.operator === '')
    return null
  const operator = lookup.getOperator(partial.field, partial.operator)
  if (operator == null)
    return null
  if (operator.value.type === 'empty') {
    return {
      field: partial.field,
      operator: partial.operator,
      value: { type: 'empty' },
      isReadOnly: partial.isReadOnly,
    }
  }
  if (operator.value.type === 'nested') {
    const children = nestedChildren(partial)
    if (children.length === 0)
      return null
    const complete = children.map(child => completePowerSearchFilter(child, lookup))
    if (complete.some(child => child == null))
      return null
    return {
      field: partial.field,
      operator: partial.operator,
      value: { type: 'nested', value: complete.filter((child): child is PowerSearchFilter => child != null) },
      isReadOnly: partial.isReadOnly,
    }
  }
  if (partial.value == null || partial.value.type !== operator.value.type || !isFilled(partial.value))
    return null
  return {
    field: partial.field,
    operator: partial.operator,
    value: partial.value,
    isReadOnly: partial.isReadOnly,
  }
}
