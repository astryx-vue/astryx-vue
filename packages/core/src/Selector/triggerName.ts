export interface SelectorTriggerNameInput {
  /** 字段标签元素的 id。 */
  fieldLabelId: string
  /** 所选值（或占位文字）元素的 id。 */
  valueId: string
  /** 在 InputGroup 里时，组标签元素的 id。 */
  groupLabelId?: string
  /** 调用方给的 aria-labelledby。 */
  callerLabelledBy?: unknown
  /** 触发器是不带角色的按钮（可搜索），读屏不会念它的值，名字里要带上值。 */
  includesValue: boolean
}

function ids(...parts: readonly (string | undefined)[]): string[] {
  return parts.flatMap(part => part?.split(' ') ?? []).filter(Boolean)
}

/**
 * 触发器的 aria-labelledby。调用方的 id 接在字段标签（组内先是组标签）后面，
 * 不取代它；可搜索的触发器再在最后接上所选的值。
 * 返回 undefined 时触发器由 aria-label 命名。
 */
export function selectorTriggerLabelledBy(input: SelectorTriggerNameInput): string | undefined {
  const caller = typeof input.callerLabelledBy === 'string' && input.callerLabelledBy !== '' ? input.callerLabelledBy : undefined
  if (caller === undefined && !input.includesValue)
    return undefined
  const base = ids(input.groupLabelId, input.fieldLabelId, caller)
  return (input.includesValue ? [...base, input.valueId] : base).join(' ')
}
