import type { ColorScaleConfig } from './expandColorScale.js'
import type { RadiusScaleConfig } from './expandRadiusScale.js'
import type { MotionLayerContext } from './motionLayerTokens.js'
import type { ThemeMotionConfig } from './themeMotion.js'
import type { ComponentStyleMap, ThemeTokens, ThemeTokenValue, TypographyConfig } from './types.js'
import { checkDeclarationName, checkDeclarationValue, warnDroppedDeclaration } from './declarationBoundary.js'
import { expandColorScale } from './expandColorScale.js'
import { expandRadiusScale } from './expandRadiusScale.js'
import { mergeComponentMaps, withoutUnsetComponents } from './mergeComponents.js'
import { motionLayerTokens, settleMotionTokens } from './motionLayerTokens.js'
import { normalizeTokenName, prefixTokenReferences } from './tokenName.js'
import { resolveTypography } from './typography.js'

/** Value axes that a root theme and an adaptation rule can both write. */
export interface ThemeValuesInput {
  color?: ColorScaleConfig
  typography?: TypographyConfig
  radius?: RadiusScaleConfig
  motion?: ThemeMotionConfig
  tokens?: ThemeTokens
  components?: ComponentStyleMap
}

export interface ResolvedThemeValues {
  /** `--astryx-` prefixed token values, written as CSS. */
  tokens: Record<string, string>
  /** Generated type-scale rules under the authored component map. */
  components?: ComponentStyleMap
}

function isTokenPair(value: unknown): value is readonly [string, string] {
  return Array.isArray(value)
    && value.length === 2
    && typeof value[0] === 'string'
    && typeof value[1] === 'string'
}

/**
 * One token value as CSS. A string is used as written and a `[light, dark]`
 * tuple becomes `light-dark()`. Anything else is not a token value.
 */
export function tokenValueToCss(value: ThemeTokenValue, path: string): string {
  if (typeof value === 'string')
    return prefixTokenReferences(value)
  if (isTokenPair(value))
    return prefixTokenReferences(`light-dark(${value[0]}, ${value[1]})`)
  throw new Error(`${path} must be a CSS string or a [light, dark] string tuple.`)
}

/**
 * Write a token map with the `--astryx-` prefix.
 *
 * A name or value that cannot stay one CSS declaration is dropped with a
 * warning, and the rest of the theme still applies.
 */
export function resolveTokenMap(tokens: ThemeTokens | undefined, location: string): Record<string, string> {
  const resolved: Record<string, string> = {}
  for (const [name, value] of Object.entries(tokens ?? {})) {
    if (value == null)
      continue
    const key = normalizeTokenName(name)
    const css = tokenValueToCss(value, `${location}["${name}"]`)
    const reason = checkDeclarationName(key) ?? checkDeclarationValue(css)
    if (reason != null) {
      warnDroppedDeclaration(key, css, location, reason)
      continue
    }
    resolved[key] = css
  }
  return resolved
}

/**
 * Expand the generator axes, then lay explicit `tokens` over the result.
 * Explicit tokens win token by token. Authored component styles win over
 * the generated type-scale rules property by property. `motion` reads what
 * lies beneath the layer from `context` (motionLayerTokens.ts).
 */
export function resolveThemeValues(
  input: ThemeValuesInput,
  location: string,
  context?: MotionLayerContext,
): ResolvedThemeValues {
  const typography = resolveTypography(input.typography)
  const motion = motionLayerTokens(input.motion)
  const generated: ThemeTokens = {
    ...(input.color ? expandColorScale(input.color) : {}),
    ...typography.tokens,
    ...(input.radius ? expandRadiusScale(input.radius) : {}),
    ...motion.shared,
  }
  const tokens = {
    ...resolveTokenMap(generated, `${location}generated`),
    ...motion.private,
    ...resolveTokenMap(input.tokens, `${location}tokens`),
  }
  settleMotionTokens(tokens, input, context)
  return {
    tokens,
    components: mergeComponentMaps(typography.components, withoutUnsetComponents(input.components)),
  }
}
