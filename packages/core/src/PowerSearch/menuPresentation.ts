import type { PowerSearchLookup } from './config.js'
import type { PowerSearchItem } from './types.js'

export function powerSearchGroupLabel(
  entries: readonly { item: PowerSearchItem }[],
  index: number,
): string | undefined {
  const group = entries[index]?.item.auxiliaryData?.group
  if (group == null || group === '')
    return undefined
  const previous = index > 0 ? entries[index - 1]?.item.auxiliaryData?.group : undefined
  return group !== previous ? group : undefined
}

export function powerSearchItemIcon(
  item: PowerSearchItem,
  lookup: PowerSearchLookup,
): 'calendar' | 'clock' | 'funnel' | 'search' {
  const data = item.auxiliaryData
  const operator = data?.operatorKey ? lookup.getOperator(data.fieldKey, data.operatorKey) : undefined
  const type = operator?.value.type
  if (type === 'date_absolute' || type === 'date_range' || type === 'date_relative')
    return 'calendar'
  if (type === 'time')
    return 'clock'
  if (type === 'enum' || type === 'enum_list')
    return 'funnel'
  return 'search'
}
