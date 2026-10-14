import type { PowerSearchMessages } from '../locale/messages/power-search.js'
import type { PowerSearchLookup } from './config.js'
import type { FilterValue, PowerSearchItem, PowerSearchOperator } from './types.js'
import { resolveOperatorLabel } from './operators.js'

const MAX_BROWSE_ITEMS = 1000

interface ValueMatch {
  displayValue: string
  filterValue: FilterValue
  quoted: boolean
}

function resolveValueMatches(operator: PowerSearchOperator, rawValue: string): ValueMatch[] {
  const kind = operator.value.type
  if (kind === 'string') {
    return [{ displayValue: rawValue, filterValue: { type: 'string', value: rawValue }, quoted: true }]
  }
  if (kind === 'string_list') {
    return [{ displayValue: rawValue, filterValue: { type: 'string_list', value: [rawValue] }, quoted: true }]
  }
  if (kind === 'enum' || kind === 'enum_list') {
    const lower = rawValue.toLowerCase()
    return operator.value.values
      .filter(item => item.label.toLowerCase().includes(lower))
      .map(item => ({
        displayValue: item.label,
        filterValue: kind === 'enum'
          ? { type: 'enum' as const, value: item.value }
          : { type: 'enum_list' as const, value: [item.value] },
        quoted: false,
      }))
  }
  return []
}

function browseItems(lookup: PowerSearchLookup): PowerSearchItem[] {
  const grouped = new Map<string, PowerSearchItem[]>()
  const ungrouped: PowerSearchItem[] = []
  for (const field of lookup.getVisibleFields()) {
    const operator = lookup.getDefaultOperator(field.key)
    const item: PowerSearchItem = {
      id: field.key,
      label: field.label,
      description: field.description,
      auxiliaryData: {
        fieldKey: field.key,
        operatorKey: operator?.key,
        group: field.group,
      },
    }
    if (field.group) {
      const bucket = grouped.get(field.group) ?? []
      bucket.push(item)
      grouped.set(field.group, bucket)
    }
    else {
      ungrouped.push(item)
    }
  }
  const ordered = [...ungrouped]
  for (const items of grouped.values())
    ordered.push(...items)
  return ordered.slice(0, MAX_BROWSE_ITEMS)
}

export function searchPowerSearchFields(
  lookup: PowerSearchLookup,
  query: string,
  messages: PowerSearchMessages,
  maxTypedResults: number,
): PowerSearchItem[] {
  const trimmed = query.trim()
  if (trimmed === '')
    return browseItems(lookup)

  const lower = trimmed.toLowerCase()
  const results: PowerSearchItem[] = []
  const seen = new Set<string>()
  const labelOf = (operator: PowerSearchOperator): string => resolveOperatorLabel(operator, messages)

  for (const field of lookup.getVisibleFields()) {
    if (field.typeaheadMinQueryLength != null && lower.length < field.typeaheadMinQueryLength)
      continue
    const fieldMatches = field.label.toLowerCase().includes(lower)
      || field.typeaheadAliases?.some(alias => alias.toLowerCase().includes(lower)) === true
    if (fieldMatches && !seen.has(field.key)) {
      seen.add(field.key)
      const operator = lookup.getDefaultOperator(field.key)
      results.push({
        id: field.key,
        label: field.label,
        description: field.description,
        auxiliaryData: { fieldKey: field.key, operatorKey: operator?.key, group: field.group },
      })
    }
    for (const operator of field.operators) {
      const combined = `${field.label} ${labelOf(operator)}`.toLowerCase()
      const id = `${field.key}:${operator.key}`
      if (combined.includes(lower) && !seen.has(id)) {
        seen.add(id)
        results.push({
          id,
          label: `${field.label} ${labelOf(operator)}`,
          description: field.description,
          auxiliaryData: { fieldKey: field.key, operatorKey: operator.key, group: field.group },
        })
      }
    }
  }

  for (const field of lookup.getVisibleFields()) {
    if (field.isValueMatchAllowed === false)
      continue
    const fieldLabel = field.label.toLowerCase()
    let exactOperator = false
    for (const operator of field.operators) {
      const prefix = `${fieldLabel} ${labelOf(operator).toLowerCase()} `
      if (!lower.startsWith(prefix) || lower.length <= prefix.length)
        continue
      const rawValue = trimmed.slice(prefix.length)
      const matches = resolveValueMatches(operator, rawValue)
      if (matches.length > 0)
        exactOperator = true
      for (const match of matches) {
        const id = `${field.key}:${operator.key}:value:${match.displayValue}`
        if (seen.has(id))
          continue
        seen.add(id)
        const shown = match.quoted ? `"${match.displayValue}"` : match.displayValue
        results.push({
          id,
          label: `${field.label} ${labelOf(operator)} ${shown}`,
          auxiliaryData: { fieldKey: field.key, operatorKey: operator.key, filterValue: match.filterValue },
        })
      }
    }
    const fieldPrefix = `${fieldLabel} `
    if (!exactOperator && lower.startsWith(fieldPrefix) && lower.length > fieldPrefix.length) {
      const remainder = lower.slice(fieldPrefix.length)
      const operatorPrefix = field.operators.some(operator => labelOf(operator).toLowerCase().startsWith(remainder))
      if (!operatorPrefix) {
        const rawValue = trimmed.slice(fieldPrefix.length)
        for (const operator of field.operators) {
          for (const match of resolveValueMatches(operator, rawValue)) {
            const id = `${field.key}:${operator.key}:value:${match.displayValue}`
            if (seen.has(id))
              continue
            seen.add(id)
            const shown = match.quoted ? `"${match.displayValue}"` : match.displayValue
            results.push({
              id,
              label: `${field.label} ${labelOf(operator)} ${shown}`,
              auxiliaryData: { fieldKey: field.key, operatorKey: operator.key, filterValue: match.filterValue },
            })
          }
        }
      }
    }
  }

  const contentKey = lookup.config.contentSearchFieldKey
  const exact = lookup.getVisibleFields().some(field =>
    field.label.toLowerCase() === lower
    || field.operators.some(operator => `${field.label} ${labelOf(operator)}`.toLowerCase() === lower),
  )
  if (contentKey && !exact) {
    const field = lookup.getField(contentKey)
    const operator = lookup.getDefaultOperator(contentKey)
    if (field && operator) {
      results.unshift({
        id: `__content_search__:${trimmed}`,
        label: `"${trimmed}"`,
        auxiliaryData: {
          fieldKey: contentKey,
          operatorKey: operator.key,
          filterValue: { type: 'string', value: trimmed },
        },
      })
    }
  }

  return results.slice(0, maxTypedResults)
}
