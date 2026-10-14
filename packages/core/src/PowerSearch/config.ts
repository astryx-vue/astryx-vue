import type { PowerSearchConfig, PowerSearchField, PowerSearchOperator } from './types.js'

export interface PowerSearchLookup {
  readonly config: PowerSearchConfig
  getField: (key: string) => PowerSearchField | undefined
  getOperator: (fieldKey: string, operatorKey: string) => PowerSearchOperator | undefined
  getDefaultOperator: (fieldKey: string) => PowerSearchOperator | undefined
  getVisibleFields: () => readonly PowerSearchField[]
  getVisibleOperators: (fieldKey: string) => readonly PowerSearchOperator[]
}

export function createPowerSearchLookup(config: PowerSearchConfig): PowerSearchLookup {
  const fieldMap = new Map<string, PowerSearchField>()
  const operatorMap = new Map<string, Map<string, PowerSearchOperator>>()
  for (const field of config.fields) {
    fieldMap.set(field.key, field)
    const operators = new Map<string, PowerSearchOperator>()
    for (const operator of field.operators)
      operators.set(operator.key, operator)
    operatorMap.set(field.key, operators)
  }

  return {
    config,
    getField(key) {
      return fieldMap.get(key)
    },
    getOperator(fieldKey, operatorKey) {
      return operatorMap.get(fieldKey)?.get(operatorKey)
    },
    getDefaultOperator(fieldKey) {
      const field = fieldMap.get(fieldKey)
      if (field == null)
        return undefined
      if (field.defaultOperator)
        return operatorMap.get(fieldKey)?.get(field.defaultOperator) ?? field.operators[0]
      return field.operators[0]
    },
    getVisibleFields() {
      return config.fields
    },
    getVisibleOperators(fieldKey) {
      return fieldMap.get(fieldKey)?.operators ?? []
    },
  }
}
