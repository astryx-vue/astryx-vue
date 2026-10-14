import type { EnumItem, PowerSearchField, PowerSearchFieldDefinition, PowerSearchOperator } from './types.js'

function i18n(key: string, message: string, value: PowerSearchOperator['value']): PowerSearchOperator {
  return { key, i18nKey: `@astryx.powersearch.operator.${message}`, value }
}

function stringField(key: string, label: string): PowerSearchField {
  return {
    key,
    label,
    defaultOperator: 'contains',
    operators: [
      i18n('contains', 'contains', { type: 'string' }),
      i18n('not_contains', 'notContains', { type: 'string' }),
      i18n('starts_with', 'startsWith', { type: 'string' }),
      i18n('not_starts_with', 'notStartsWith', { type: 'string' }),
      i18n('ends_with', 'endsWith', { type: 'string' }),
      i18n('not_ends_with', 'notEndsWith', { type: 'string' }),
      i18n('is', 'is', { type: 'string' }),
      i18n('is_not', 'isNot', { type: 'string' }),
    ],
  }
}

function numberField(key: string, label: string): PowerSearchField {
  const value = { type: 'float' as const }
  return {
    key,
    label,
    defaultOperator: 'equals',
    operators: [
      i18n('equals', 'equals', value),
      i18n('not_equals', 'notEquals', value),
      i18n('greater_than', 'greaterThan', value),
      i18n('less_than', 'lessThan', value),
      i18n('greater_than_or_equal', 'greaterThanOrEqual', value),
      i18n('less_than_or_equal', 'lessThanOrEqual', value),
    ],
  }
}

function dateField(key: string, label: string): PowerSearchField {
  return {
    key,
    label,
    defaultOperator: 'after',
    operators: [
      i18n('before', 'before', { type: 'date_absolute' }),
      i18n('after', 'after', { type: 'date_absolute' }),
      i18n('between', 'between', { type: 'date_range' }),
    ],
  }
}

function booleanField(key: string, label: string): PowerSearchField {
  return {
    key,
    label,
    defaultOperator: 'is_true',
    operators: [
      i18n('is_true', 'isTrue', { type: 'empty' }),
      i18n('is_false', 'isFalse', { type: 'empty' }),
    ],
  }
}

function enumField(key: string, label: string, values: readonly EnumItem[]): PowerSearchField {
  return {
    key,
    label,
    defaultOperator: 'is',
    operators: [
      i18n('is', 'is', { type: 'enum', values }),
      i18n('is_not', 'isNot', { type: 'enum', values }),
      i18n('is_any_of', 'isAnyOf', { type: 'enum_list', values }),
      i18n('is_none_of', 'isNoneOf', { type: 'enum_list', values }),
    ],
  }
}

function enumListField(key: string, label: string, values: readonly EnumItem[]): PowerSearchField {
  return {
    key,
    label,
    defaultOperator: 'is_any_of',
    operators: [
      i18n('is_any_of', 'isAnyOf', { type: 'enum_list', values }),
      i18n('is_none_of', 'isNoneOf', { type: 'enum_list', values }),
    ],
  }
}

function stringListField(key: string, label: string): PowerSearchField {
  return {
    key,
    label,
    defaultOperator: 'is_any_of',
    operators: [
      i18n('is_any_of', 'isAnyOf', { type: 'string_list' }),
      i18n('is_none_of', 'isNoneOf', { type: 'string_list' }),
    ],
  }
}

export function buildPowerSearchField(definition: PowerSearchFieldDefinition): PowerSearchField {
  const label = definition.label ?? definition.key
  switch (definition.type) {
    case 'string':
      return stringField(definition.key, label)
    case 'number':
      return numberField(definition.key, label)
    case 'date':
      return dateField(definition.key, label)
    case 'boolean':
      return booleanField(definition.key, label)
    case 'enum':
      return enumField(definition.key, label, definition.enumValues ?? [])
    case 'enum_list':
      return enumListField(definition.key, label, definition.enumValues ?? [])
    case 'string_list':
      return stringListField(definition.key, label)
  }
}
