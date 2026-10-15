import type { Component } from 'vue'
import type { SemanticIconMap } from '../Icon/semantic.js'
import type { IndicatorRegistry } from '../Indicator/types.js'
import type { DefineThemeInput, ThemeDefinition, ThemeTokens, ThemeTokenValue } from './types.js'
import { markRaw } from 'vue'
import { compileComponentStyles, mergeComponentMaps } from './componentStyles.js'
import { expandColorScale } from './expandColorScale.js'
import { expandMotionScale } from './expandMotionScale.js'
import { expandRadiusScale } from './expandRadiusScale.js'
import { normalizeTokenName, prefixTokenReferences } from './tokenName.js'
import { resolveTypography } from './typography.js'

export { normalizeTokenName } from './tokenName.js'

const THEME_NAME = /^[a-z0-9][a-z0-9-]*$/i
const UNSAFE_TOKEN = /[;{}<>\n\r]/

export function isDefinedTheme(value: unknown): value is ThemeDefinition {
  return !!value
    && typeof value === 'object'
    && (value as ThemeDefinition).__astryxTheme === true
}

function assertTokenValue(value: string, name: string): void {
  if (UNSAFE_TOKEN.test(value))
    throw new Error(`Theme token ${name} has an unsupported value.`)
}

function isTokenPair(value: ThemeTokenValue): value is readonly [string, string] {
  return Array.isArray(value)
}

function resolveTokenMap(tokens: ThemeTokens | undefined): Record<string, string> {
  const resolved: Record<string, string> = {}
  if (!tokens)
    return resolved

  for (const [name, value] of Object.entries(tokens)) {
    if (value == null)
      continue
    const key = normalizeTokenName(name)
    if (isTokenPair(value)) {
      const [light, dark] = value
      assertTokenValue(light, key)
      assertTokenValue(dark, key)
      resolved[key] = prefixTokenReferences(`light-dark(${light}, ${dark})`)
      continue
    }
    assertTokenValue(value, key)
    resolved[key] = prefixTokenReferences(value)
  }

  return resolved
}

function mergeMaps<T>(base: Readonly<Record<string, T>> | undefined, next: Readonly<Record<string, T>> | undefined): Record<string, T> | undefined {
  if (base == null && next == null)
    return undefined
  return { ...base, ...next }
}

function sealIndicators(indicators: IndicatorRegistry | undefined): IndicatorRegistry | undefined {
  if (indicators == null)
    return undefined
  const sealed: IndicatorRegistry = {}
  for (const [name, component] of Object.entries(indicators)) {
    if (component)
      sealed[name] = markRaw(component as Component)
  }
  return sealed
}

/**
 * Create a theme object that `Theme` can apply to a subtree.
 *
 * Token names are the upstream names (`--color-accent`) or this package's
 * prefixed names (`--astryx-color-accent`). A `[light, dark]` tuple becomes
 * `light-dark()`. `color`, `typography`, `radius`, and `motion` generate
 * tokens; an explicit `tokens` entry wins for that name.
 *
 * `var(--color-accent)` inside a value is rewritten to the prefixed name.
 */
export function defineTheme(input: DefineThemeInput): ThemeDefinition {
  if (!THEME_NAME.test(input.name))
    throw new Error(`Theme name "${input.name}" must use letters, numbers, and hyphens.`)
  if (input.extends != null && !isDefinedTheme(input.extends))
    throw new Error('defineTheme extends must be a theme returned by defineTheme().')

  const base = input.extends
  const typography = resolveTypography(input.typography)
  const generated: ThemeTokens = {
    ...(input.color ? expandColorScale(input.color) : {}),
    ...typography.tokens,
    ...(input.radius ? expandRadiusScale(input.radius) : {}),
    ...(input.motion ? expandMotionScale(input.motion) : {}),
  }
  const icons = mergeMaps<string>(base?.icons, input.icons) as SemanticIconMap | undefined
  const indicators = sealIndicators(mergeMaps(base?.indicators, input.indicators))
  const components = mergeComponentMaps(mergeComponentMaps(base?.components, typography.components), input.components)
  const css = compileComponentStyles(input.name, components)
  return {
    __astryxTheme: true,
    name: input.name,
    tokens: { ...base?.tokens, ...resolveTokenMap({ ...generated, ...input.tokens }) },
    onDark: { ...base?.onDark, ...resolveTokenMap(input.onDark?.tokens) },
    onLight: { ...base?.onLight, ...resolveTokenMap(input.onLight?.tokens) },
    syntax: input.syntax ?? base?.syntax,
    ...(icons ? { icons } : {}),
    ...(indicators ? { indicators } : {}),
    ...(components ? { components } : {}),
    ...(css ? { css } : {}),
  }
}

/** Neutral, with no token overrides. Colors come from `@astryx-vue/themes/neutral.css`. */
export const neutralTheme: ThemeDefinition = defineTheme({ name: 'neutral' })
