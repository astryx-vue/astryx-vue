/**
 * 两个面板里显示的 token 当前值。
 * 基础面板没动过的 token 显示 Neutral 原本的写法（如 `0.625rem`、`#111111`），
 * 动过的显示编辑器算出来的值，手改的 token 优先。
 */
import type { ThemeState } from './themeTypes'
import { NEUTRAL_TOKENS } from './themeDefaults'
import { themeVariables } from './themeExport'
import { createNeutralTheme } from './themeState'

const NEUTRAL_GENERATED = themeVariables(createNeutralTheme())
const NEUTRAL_MAP = new Map(Object.entries(NEUTRAL_TOKENS))

export function shownTokens(theme: ThemeState): Record<string, string> {
  const generated = themeVariables(theme)
  const shown: Record<string, string> = { ...NEUTRAL_TOKENS }
  for (const [name, value] of Object.entries(generated)) {
    if (value !== NEUTRAL_GENERATED[name] || !(name in NEUTRAL_TOKENS))
      shown[name] = value
  }
  return shown
}

export function shownToken(theme: ThemeState, name: string): string {
  const value = shownTokens(theme)[name] ?? ''
  return theme.tokens[name] === undefined && value === NEUTRAL_TOKENS[name] ? resolveReferenceDeep(value) : value
}

/** 引用链上的每一层都换成最终值；`light-dark()` 两半分别换。 */
function resolveReferenceDeep(value: string): string {
  const pair = /^light-dark\((.+)\)$/.exec(value)
  if (pair) {
    const parts = splitTop(pair[1]!)
    return parts.length === 2 ? `light-dark(${resolveReferenceDeep(parts[0]!)}, ${resolveReferenceDeep(parts[1]!)})` : value
  }
  if (!value.startsWith('var('))
    return value
  const target = NEUTRAL_MAP.get(/^var\((--astryx-[a-z0-9-]+)\)$/.exec(value)?.[1] ?? '')
  return target ? resolveReferenceDeep(target) : value
}

function splitTop(text: string): string[] {
  const parts: string[] = []
  let depth = 0
  let start = 0
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index]
    if (char === '(') {
      depth += 1
    }
    else if (char === ')') {
      depth -= 1
    }
    else if (char === ',' && depth === 0) {
      parts.push(text.slice(start, index).trim())
      start = index + 1
    }
  }
  parts.push(text.slice(start).trim())
  return parts
}
