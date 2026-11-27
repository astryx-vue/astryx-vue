import type { PowerSearchSheetMessages } from '../locale/messages/power-search-sheet.js'
import type { PowerSearchMessages } from '../locale/messages/power-search.js'
import type { CalendarSystem } from '../utils/calendarSystem.js'
import type { PowerSearchLookup } from './config.js'
import type { PowerSearchFilter } from './types.js'
import { formatFilterValue } from './format.js'
import { resolveOperatorLabel } from './operators.js'
import { buildRelativeDateOptions } from './relativeDates.js'

export interface SheetFilterTextContext {
  lookup: PowerSearchLookup
  messages: PowerSearchMessages
  sheet: PowerSearchSheetMessages
  locale: string
  timeZone?: string
  calendar: CalendarSystem
}

export interface SheetFilterParts {
  /** 「字段 运算符」。 */
  label: string
  /** 值，和标签上显示的一样（不截断）；没有值或配置里已经没有这个运算符时为 null。 */
  value: string | null
}

/**
 * 「筛选条件」一行的两部分文字。配置里已经没有的字段或运算符按原始键显示，和触发器上的标签一致。
 * 相对日期存的是键（`3d_ago`），这里读成值那一步选项上的文字（「3 天前」）。
 */
export function describeSheetFilterParts(filter: PowerSearchFilter, context: SheetFilterTextContext): SheetFilterParts {
  const field = context.lookup.getField(filter.field)
  const operator = context.lookup.getOperator(filter.field, filter.operator)
  const fieldLabel = field?.label ?? filter.field
  const operatorLabel = operator == null ? filter.operator : resolveOperatorLabel(operator, context.messages)
  const label = operatorLabel ? context.sheet.fieldOperator(fieldLabel, operatorLabel) : fieldLabel
  if (operator == null)
    return { label, value: null }
  if (operator.value.type === 'date_relative' && filter.value.type === 'date_relative') {
    const relative = filter.value.value
    return { label, value: buildRelativeDateOptions(operator.value, context.sheet).find(option => option.value === relative)?.label ?? relative }
  }
  const value = formatFilterValue(operator.value, filter.value, Number.MAX_SAFE_INTEGER, context.messages, context.locale, context.timeZone, context.calendar)
  return { label, value: value || null }
}

/** 整行读出来的文字：删除时播报用，和行上显示的一致。 */
export function describeSheetFilter(filter: PowerSearchFilter, context: SheetFilterTextContext): string {
  const parts = describeSheetFilterParts(filter, context)
  return parts.value ? context.sheet.labelValue(parts.label, parts.value) : parts.label
}

/** 私用区码位：不会出现在标签或值里。 */
const VALUE_SLOT = '\uE000'

/** 按语言的 `labelValue` 顺序拆出值前后的文字，值单独加粗显示。 */
export function splitLabelValue(sheet: PowerSearchSheetMessages, label: string): { before: string, after: string } {
  const [before = '', after = ''] = sheet.labelValue(label, VALUE_SLOT).split(VALUE_SLOT)
  return { before, after }
}

/**
 * 值那一步的标题：字段名；运算符不在单选组里出现时（只有一个运算符）写成「字段 运算符」；
 * 字段或运算符在配置里已经没有时按原始键写。
 */
export function sheetEditorTitle(
  draft: { field: string, operator?: string } | null,
  context: Pick<SheetFilterTextContext, 'lookup' | 'messages' | 'sheet'>,
): string {
  if (draft == null)
    return context.sheet.addFilter
  const field = context.lookup.getField(draft.field)
  const operator = draft.operator == null ? undefined : context.lookup.getOperator(draft.field, draft.operator)
  const operatorLabel = operator == null ? '' : resolveOperatorLabel(operator, context.messages)
  if (field == null || (operator == null && draft.operator != null))
    return context.sheet.fieldOperator(field?.label ?? draft.field, operatorLabel || (draft.operator ?? '')).trim()
  const operators = context.lookup.getVisibleOperators(draft.field)
  const showsOperatorGroup = operators.length > 1 && operator != null && operators.includes(operator)
  return !showsOperatorGroup && operatorLabel !== '' ? context.sheet.fieldOperator(field.label, operatorLabel) : field.label
}
