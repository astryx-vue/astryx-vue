import type { PowerSearchMessages, PowerSearchOperatorMessages } from '../locale/messages/power-search.js'
import type { PowerSearchOperator } from './types.js'

const OPERATOR_MESSAGE_KEYS: Record<string, keyof PowerSearchOperatorMessages> = {
  contains: 'contains',
  notContains: 'notContains',
  not_contains: 'notContains',
  startsWith: 'startsWith',
  starts_with: 'startsWith',
  notStartsWith: 'notStartsWith',
  not_starts_with: 'notStartsWith',
  endsWith: 'endsWith',
  ends_with: 'endsWith',
  notEndsWith: 'notEndsWith',
  not_ends_with: 'notEndsWith',
  is: 'is',
  isNot: 'isNot',
  is_not: 'isNot',
  equals: 'equals',
  notEquals: 'notEquals',
  not_equals: 'notEquals',
  greaterThan: 'greaterThan',
  greater_than: 'greaterThan',
  lessThan: 'lessThan',
  less_than: 'lessThan',
  greaterThanOrEqual: 'greaterThanOrEqual',
  greater_than_or_equal: 'greaterThanOrEqual',
  lessThanOrEqual: 'lessThanOrEqual',
  less_than_or_equal: 'lessThanOrEqual',
  before: 'before',
  after: 'after',
  between: 'between',
  isTrue: 'isTrue',
  is_true: 'isTrue',
  isFalse: 'isFalse',
  is_false: 'isFalse',
  isAnyOf: 'isAnyOf',
  is_any_of: 'isAnyOf',
  isNoneOf: 'isNoneOf',
  is_none_of: 'isNoneOf',
}

export function resolveOperatorLabel(operator: PowerSearchOperator, messages: PowerSearchMessages): string {
  if ('label' in operator && operator.label != null)
    return operator.label
  const raw = operator.i18nKey ?? ''
  const leaf = raw.split('.').pop() ?? raw
  const key = OPERATOR_MESSAGE_KEYS[leaf] ?? OPERATOR_MESSAGE_KEYS[raw]
  return key ? messages.operators[key] : leaf
}
