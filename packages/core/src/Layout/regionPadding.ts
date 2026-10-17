import type { CSSProperties } from 'vue'
import type { SpacingStep } from '../Stack/types.js'
import { spacingVariable } from './size.js'

export function regionPaddingStyle(
  prefix: string,
  padding: SpacingStep | undefined,
  paddingBlockEnd?: SpacingStep,
): CSSProperties {
  if (padding == null && paddingBlockEnd == null)
    return {}
  const style: CSSProperties = {}
  const set = (edge: string, step: SpacingStep | undefined): void => {
    const value = spacingVariable(step)
    if (value != null)
      style[`${prefix}-${edge}` as keyof CSSProperties] = value as never
  }
  if (padding != null) {
    set('inline', padding)
    set('inline-start', padding)
    set('inline-end', padding)
    set('block-start', padding)
    set('block-end', padding)
  }
  set('block-end', paddingBlockEnd)
  return style
}
