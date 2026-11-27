import type { ComponentStyleMap } from './types.js'
import { isColorModeKey } from './colorModeBlocks.js'

/** A value a theme's component map can hold: a CSS value or a block. */
type StyleValue = string | number | boolean | null | undefined | object

/**
 * Reads each entry through `read` and drops an entry that reads as undefined.
 * An object that loses all its entries becomes undefined. A null, an array or a
 * non-object returns unchanged, and so does an object with no changes.
 */
function readEntries<T>(value: T, read: (entry: StyleValue, key: string) => StyleValue): T | undefined {
  if (value === null || typeof value !== 'object' || Array.isArray(value))
    return value
  const entries = Object.entries(value)
  let changed = false
  const kept: [string, unknown][] = []
  for (const [key, entry] of entries) {
    const set = entry === undefined ? undefined : read(entry as StyleValue, key)
    if (set === undefined) {
      changed = true
      continue
    }
    changed ||= set !== entry
    kept.push([key, set])
  }
  if (entries.length > 0 && kept.length === 0)
    return undefined
  return changed ? Object.fromEntries(kept) as T : value
}

/**
 * A style key's value without the properties it leaves undefined, at every
 * depth. A pseudo-class block that empties stays, empty: a restated
 * pseudo-class block still replaces the base's. A color-mode block that
 * empties is not set, as a property is not.
 */
function withoutUndefined(value: StyleValue, key: string): StyleValue {
  const set = readEntries(value, withoutUndefined)
  return set === undefined && !isColorModeKey(key) ? {} : set
}

/**
 * A component style map without what it leaves undefined: a component, a
 * style key, or a property at any depth is not set, and so is a component or
 * style key whose every value is. Every layer that reads a theme's component
 * map (the merge, each resolved layer, the stylesheet) reads it through this.
 */
export function withoutUnsetComponents(map: ComponentStyleMap | undefined): ComponentStyleMap | undefined {
  return readEntries(map, (rules: StyleValue): StyleValue =>
    readEntries(rules, (styles: StyleValue): StyleValue =>
      readEntries(styles, withoutUndefined)))
}

/** One style key's styles, `next` over `base`; a color-mode block merges per property. */
function mergeStyles(base: ComponentStyleMap[string][string] | undefined, next: ComponentStyleMap[string][string]): ComponentStyleMap[string][string] {
  const merged = { ...base, ...next }
  for (const key of Object.keys(next)) {
    const own = next[key]
    const inherited = base?.[key]
    if (isColorModeKey(key) && typeof own === 'object' && typeof inherited === 'object')
      merged[key] = { ...inherited, ...own }
  }
  return merged
}

/**
 * Merge component maps. `next` wins per style key and per property, so a
 * child that restates one property of `button.base` keeps the rest. A
 * color-mode block (`@light`, `@dark`) merges per property the same way; a
 * restated pseudo-class block replaces the base's whole.
 */
export function mergeComponentMaps(
  inheritedMap: ComponentStyleMap | undefined,
  ownMap: ComponentStyleMap | undefined,
): ComponentStyleMap | undefined {
  const base = withoutUnsetComponents(inheritedMap)
  const next = withoutUnsetComponents(ownMap)
  if (base == null)
    return next
  if (next == null)
    return base
  const merged: ComponentStyleMap = {}
  for (const [component, rules] of Object.entries(base))
    merged[component] = { ...rules }
  for (const [component, rules] of Object.entries(next)) {
    const target = merged[component] ?? {}
    for (const [key, styles] of Object.entries(rules))
      target[key] = mergeStyles(target[key], styles)
    merged[component] = target
  }
  return merged
}
