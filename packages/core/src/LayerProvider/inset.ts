import type { LayerInset } from './types.js'
import { measureLength } from '../layer/gutter.js'

const EDGES = ['blockStart', 'blockEnd', 'inlineStart', 'inlineEnd'] as const

type ResolvedInset = Partial<Record<(typeof EDGES)[number], number>>

/** 把写出来的偏移换成 px。数字原样用，字符串按 CSS 长度量。 */
export function resolveInset(inset?: LayerInset): ResolvedInset | undefined {
  if (inset == null)
    return undefined

  const resolved: ResolvedInset = {}
  for (const edge of EDGES) {
    const raw = inset[edge]
    if (raw == null)
      continue
    resolved[edge] = typeof raw === 'number' ? raw : measureLength(raw)
  }
  return resolved
}

/** 逐边合并：`primary` 写了的边用它，没写的边用 `fallback`。 */
export function mergeInset(
  primary?: LayerInset,
  fallback?: LayerInset,
): ResolvedInset {
  const above = resolveInset(primary)
  const below = resolveInset(fallback)
  const merged: ResolvedInset = {}
  for (const edge of EDGES) {
    const value = above?.[edge] ?? below?.[edge]
    if (value != null)
      merged[edge] = value
  }
  return merged
}
