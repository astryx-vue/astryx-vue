import type { ComponentStyleMap, StyleOverrides } from './types.js'
import { normalizeTokenName, prefixTokenReferences } from './tokenName.js'

const COMPONENT_NAME = /^[a-z][a-z0-9-]*$/i
const STYLE_PART = /^([a-z][a-z0-9-]*):([a-z0-9][a-z0-9-]*)$/
const UNSAFE_VALUE = /[;{}<>\n\r\\]|\/\*|\*\//
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

function componentClass(name: string): string {
  const kebab = name
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
  if (!COMPONENT_NAME.test(kebab))
    throw new Error(`Theme component name "${name}" is not a component name.`)
  return `astryx-${kebab}`
}

function styleTargets(className: string, key: string): string {
  if (key === 'base')
    return `.${className}`

  const parts = key.split('+')
  if (parts.length === 0 || parts.some(part => !STYLE_PART.test(part)))
    throw new Error(`Theme component style "${key}" must be base or prop:value.`)

  const attributes = parts.map((part) => {
    const match = STYLE_PART.exec(part)
    return `[data-${match?.[1]}="${match?.[2]}"]`
  }).join('')
  const modifiers = parts.map((part) => {
    const match = STYLE_PART.exec(part)
    return `.${className}--${match?.[1]}-${match?.[2]}`
  }).join('')
  return `.${className}${attributes}, .${className}${modifiers}`
}

function scope(themeName: string, targets: string): string {
  return targets
    .split(', ')
    .map(target => `[data-astryx-theme="${themeName}"] ${target}`)
    .join(', ')
}

function cssProperty(name: string): string {
  if (name.startsWith('--')) {
    const normalized = normalizeTokenName(name)
    if (!/^--astryx-[a-z0-9-]+$/.test(normalized))
      throw new Error(`Theme style property "${name}" is not a custom property.`)
    return normalized
  }
  const kebab = name.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
  if (!/^-?[a-z][a-z0-9-]*$/.test(kebab))
    throw new Error(`Theme style property "${name}" is not a CSS property.`)
  return kebab
}

function declarationValue(value: string, property: string): string {
  if (UNSAFE_VALUE.test(value))
    throw new Error(`Theme style ${property} has an unsupported value.`)
  return prefixTokenReferences(value)
}

function declarations(body: Record<string, string>): string {
  return Object.entries(body).map(([property, value]) => {
    const name = cssProperty(property)
    return `  ${name}: ${declarationValue(value, name)};`
  }).join('\n')
}

function splitOverrides(overrides: StyleOverrides): {
  base: Record<string, string>
  pseudos: Record<string, Record<string, string>>
} {
  const base: Record<string, string> = {}
  const pseudos: Record<string, Record<string, string>> = {}
  for (const [key, value] of Object.entries(overrides)) {
    if (key.startsWith(':')) {
      if (!PSEUDO.has(key) || typeof value === 'string')
        throw new Error(`Theme style pseudo "${key}" is not supported.`)
      pseudos[key] = value
      continue
    }
    if (typeof value !== 'string')
      throw new Error(`Theme style property "${key}" must be a CSS value.`)
    base[key] = value
  }
  return { base, pseudos }
}

function withPseudo(selectorList: string, pseudo: string): string {
  return selectorList
    .split(', ')
    .map(selector => `${selector}${pseudo}`)
    .join(', ')
}

/**
 * Compile component style overrides into one scoped sheet.
 *
 * `base` matches `.astryx-<component>`. `variant:secondary` matches both
 * `[data-variant="secondary"]` and `.astryx-<component>--variant-secondary`.
 * Join props with `+`. A `:hover` block skips disabled controls.
 * The sheet lives in the `astryx.overrides` layer.
 */
export function compileComponentStyles(
  themeName: string,
  components: ComponentStyleMap | undefined,
): string | undefined {
  if (!components || Object.keys(components).length === 0)
    return undefined

  const rules: string[] = []
  for (const [component, styles] of Object.entries(components)) {
    const className = componentClass(component)
    for (const [key, overrides] of Object.entries(styles)) {
      const selector = scope(themeName, styleTargets(className, key))
      const { base, pseudos } = splitOverrides(overrides)
      if (Object.keys(base).length > 0)
        rules.push(`${selector} {\n${declarations(base)}\n}`)
      for (const [pseudo, body] of Object.entries(pseudos)) {
        const suffix = pseudo === ':hover'
          ? ':hover:not(:disabled):not([aria-disabled="true"])'
          : pseudo
        if (Object.keys(body).length === 0)
          continue
        rules.push(`${withPseudo(selector, suffix)} {\n${declarations(body)}\n}`)
      }
    }
  }

  if (rules.length === 0)
    return undefined
  return `@layer astryx.overrides {\n${rules.join('\n')}\n}\n`
}

export function mergeComponentMaps(
  base: ComponentStyleMap | undefined,
  next: ComponentStyleMap | undefined,
): ComponentStyleMap | undefined {
  if (base == null && next == null)
    return undefined
  const names = new Set([...Object.keys(base ?? {}), ...Object.keys(next ?? {})])
  const merged: ComponentStyleMap = {}
  for (const name of names)
    merged[name] = { ...base?.[name], ...next?.[name] }
  return merged
}
