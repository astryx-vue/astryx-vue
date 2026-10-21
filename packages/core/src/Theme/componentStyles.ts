import type { ComponentStyleMap, StyleOverrides } from './types.js'
import { checkDeclarationName, checkDeclarationValue, warnDroppedDeclaration } from './declarationBoundary.js'
import { applyDerivedVars } from './derivedVars.js'
import { normalizeTokenName, prefixTokenReferences } from './tokenName.js'

/** A theme target: `<component-kebab>` or `<component-kebab>-<part>`. */
const TARGET_NAME = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/
const PROP_NAME = /^[a-z][a-z0-9-]*$/i
const PSEUDO = new Set([
  ':hover',
  ':focus',
  ':focus-visible',
  ':focus-within',
  ':active',
  ':checked',
  ':disabled',
  ':invalid',
  ':valid',
  ':placeholder-shown',
  ':read-only',
  ':required',
])

/**
 * Keeps a themed `:hover` off disabled controls. `:where()` adds no
 * specificity, so the hover rule still weighs what it would without it.
 */
const HOVER_GUARD = ':where(:not(:disabled, [aria-disabled="true"]))'

/** Media surface a rule is limited to, or none for the theme root. */
export type MediaSurface = 'dark' | 'light'

/**
 * Check a theme target name.
 *
 * Only `<component-kebab>-<part>` names reach the selector. A camelCase or
 * run-together name such as `buttonIcon`, `progressbar`, or `codeblock` is not
 * rewritten; it is refused so the author sees the canonical name instead of a
 * rule that silently matches nothing.
 */
export function assertTargetName(name: string): string {
  if (!TARGET_NAME.test(name))
    throw new Error(`Theme component target "${name}" must be written as <component-kebab>-<part>, for example "button" or "card-header".`)
  return name
}

function escapeAttributeValue(value: string): string {
  return value.replace(/["\\]/g, char => `\\${char}`)
}

interface StyleKeyPart {
  /** kebab-case axis name, such as `variant` or `list-style`. */
  axis: string
  value: string
}

function parseStyleKey(key: string): StyleKeyPart[] {
  return key.split('+').map((part) => {
    const separator = part.indexOf(':')
    const prop = separator === -1 ? part : part.slice(0, separator)
    const value = separator === -1 ? part : part.slice(separator + 1)
    if (!PROP_NAME.test(prop) || value === '')
      throw new Error(`Theme component style "${key}" must be base, a state, or prop:value.`)
    return { axis: prop.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase(), value }
  })
}

/**
 * Selectors for one target and style key.
 *
 * `variant:secondary` matches the reflected attribute
 * `.astryx-button[data-variant="secondary"]`, and also this package's
 * modifier class `.astryx-button--variant-secondary`. The modifier is how
 * components that do not reflect that axis as `data-*` yet still receive the
 * rule. Both are scoped to the target, so neither is a bare value class.
 */
export function targetSelectors(target: string, key: string, surface?: MediaSurface): string[] {
  const root = `.astryx-${assertTargetName(target)}`
  const selectors = key === 'base'
    ? [root]
    : (() => {
        const parts = parseStyleKey(key)
        const attributes = parts.map(part => `[data-${part.axis}="${escapeAttributeValue(part.value)}"]`).join('')
        const modifiers = parts.map(part => `${root}--${part.axis}-${part.value}`).join('')
        const modifierSafe = parts.every(part => /^[\w-]+$/.test(part.value))
        return modifierSafe ? [`${root}${attributes}`, `${root}${modifiers}`] : [`${root}${attributes}`]
      })()
  return surface
    ? selectors.map(selector => `[data-astryx-media="${surface}"] ${selector}`)
    : selectors
}

function withPseudo(selectors: readonly string[], pseudo: string): string {
  const suffix = pseudo === ':hover' ? `:hover${HOVER_GUARD}` : pseudo
  return selectors.map(selector => `${selector}${suffix}`).join(', ')
}

/**
 * A component style property as CSS. camelCase becomes kebab-case. A custom
 * property gets the `--astryx-` prefix, so `--button-radius` and
 * `--astryx-button-radius` name the same variable; a component-internal
 * `--_name` is kept as written.
 */
function cssProperty(name: string): string {
  if (name.startsWith('--'))
    return name.startsWith('--_') ? name : normalizeTokenName(name)
  return name.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
}

interface DeclarationOptions {
  toProperty?: (name: string) => string
}

function declarationBlock(
  entries: readonly (readonly [string, string])[],
  location: string,
  { toProperty = cssProperty }: DeclarationOptions = {},
): string {
  const lines: string[] = []
  for (const [raw, rawValue] of entries) {
    const property = toProperty(raw)
    const value = prefixTokenReferences(rawValue)
    const reason = checkDeclarationName(property) ?? checkDeclarationValue(value)
    if (reason != null) {
      warnDroppedDeclaration(property, value, location, reason)
      continue
    }
    lines.push(`  ${property}: ${value};`)
  }
  return lines.join('\n')
}

function splitOverrides(overrides: StyleOverrides, location: string): {
  base: [string, string][]
  pseudos: [string, Record<string, string>][]
} {
  const base: [string, string][] = []
  const pseudos: [string, Record<string, string>][] = []
  for (const [key, value] of Object.entries(overrides)) {
    if (key.startsWith(':')) {
      if (!PSEUDO.has(key) || typeof value === 'string')
        throw new Error(`${location}: theme style pseudo "${key}" is not supported.`)
      pseudos.push([key, value])
      continue
    }
    if (typeof value !== 'string')
      throw new Error(`${location}: theme style property "${key}" must be a CSS value.`)
    base.push([key, value])
  }
  return { base, pseudos }
}

/**
 * Compile a component style map into rule text, without scope or layer.
 *
 * Each rule targets the stable `.astryx-<target>` class plus the reflected
 * `data-*` attributes for the style key. Derived variables come along, so
 * a themed `borderRadius` or `padding` reaches the component's internals.
 */
export function compileComponentRules(
  components: ComponentStyleMap | undefined,
  location: string,
  surface?: MediaSurface,
): string[] {
  const rules: string[] = []
  for (const [target, styles] of Object.entries(components ?? {})) {
    for (const [key, overrides] of Object.entries(styles)) {
      const where = `${location}components.${target}["${key}"]`
      const selectors = targetSelectors(target, key, surface)
      const { base, pseudos } = splitOverrides(overrides, where)
      const body = declarationBlock(applyDerivedVars(target, base), where)
      if (body)
        rules.push(`${selectors.join(', ')} {\n${body}\n}`)
      for (const [pseudo, block] of pseudos) {
        const pseudoBody = declarationBlock(applyDerivedVars(target, Object.entries(block)), `${where}["${pseudo}"]`)
        if (pseudoBody)
          rules.push(`${withPseudo(selectors, pseudo)} {\n${pseudoBody}\n}`)
      }
    }
  }
  return rules
}

/**
 * One `selector { name: value; }` block from a resolved token map, or nothing
 * when empty. Names are written exactly as given: shared tokens already carry
 * the `--astryx-` prefix and theme-local tokens keep their own names.
 */
export function tokenRule(
  selector: string,
  tokens: Readonly<Record<string, string>> | undefined,
  location: string,
): string[] {
  const entries = Object.entries(tokens ?? {})
  if (entries.length === 0)
    return []
  const body = declarationBlock(entries, location, { toProperty: name => name })
  return body ? [`${selector} {\n${body}\n}`] : []
}
