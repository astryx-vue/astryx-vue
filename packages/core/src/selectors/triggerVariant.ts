/** 三个选择器共用的触发器层级。`default` 和 `input` 是同一个带边框的表单框。 */
export type TriggerVariantName = 'input' | 'secondary' | 'ghost' | 'default'

export type NormalizedTriggerVariant = 'input' | 'secondary' | 'ghost'

export function normalizeTriggerVariant(value: string | undefined): NormalizedTriggerVariant {
  if (value === 'secondary' || value === 'ghost')
    return value
  return 'input'
}
