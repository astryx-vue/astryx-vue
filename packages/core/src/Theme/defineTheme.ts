import type { Component } from 'vue'
import type { SemanticIconMap } from '../Icon/semantic.js'
import type { IndicatorRegistry } from '../Indicator/types.js'
import type { ThemeGenerativeAxes } from './adaptationTypes.js'
import type { ComponentStyleMap, DefineThemeInput, ThemeDefinition } from './types.js'
import { markRaw } from 'vue'
import { normalizeThemeAdaptations, resolveThemeAdaptationRules } from './adaptations.js'
import { assertTargetName } from './componentStyles.js'
import { resolveLocalTokens } from './localTokens.js'
import { mergeComponentMaps, resolveThemeValues, resolveTokenMap } from './resolveThemeValues.js'
import { resolveGenerativeAxes } from './themeAxes.js'
import { compileThemeCss } from './themeCss.js'

export { normalizeTokenName } from './tokenName.js'

const THEME_NAME = /^[a-z0-9][a-z0-9-]*$/i

export function isDefinedTheme(value: unknown): value is ThemeDefinition {
  return !!value
    && typeof value === 'object'
    && (value as ThemeDefinition).__astryxTheme === true
}

function describeBadBase(value: unknown): string {
  if (value === undefined || value === null)
    return String(value)
  if (typeof value !== 'object')
    return typeof value
  const keys = Object.keys(value)
  return `an object with keys [${keys.slice(0, 4).join(', ')}${keys.length > 4 ? ', …' : ''}]`
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

function assertTargets(components: ComponentStyleMap | undefined): void {
  for (const target of Object.keys(components ?? {}))
    assertTargetName(target)
}

/**
 * Create a theme object that `Theme` can apply to a subtree.
 *
 * Token names are the upstream names (`--color-accent`) or this package's
 * prefixed names (`--astryx-color-accent`). A `[light, dark]` tuple becomes
 * `light-dark()`. `color`, `typography`, `radius`, and `motion` generate
 * tokens; an explicit `tokens` entry wins for that name.
 *
 * `extends` starts from everything the base theme resolved to: tokens,
 * local tokens, component styles, surfaces, adaptations, icons, indicators.
 * This theme's own values win, and the result is self-contained.
 */
export function defineTheme(input: DefineThemeInput): ThemeDefinition {
  if (!THEME_NAME.test(input.name))
    throw new Error(`Theme name "${input.name}" must use letters, numbers, and hyphens.`)
  // A present but undefined `extends` is what an import of the wrong name
  // hands over. It is refused, not ignored, so the theme cannot quietly
  // build without everything it meant to inherit.
  if ('extends' in input && !isDefinedTheme(input.extends))
    throw new Error(`defineTheme("${input.name}"): \`extends\` must be a theme from defineTheme(), got ${describeBadBase(input.extends)}. Check that the import naming the base theme resolves to it.`)
  assertTargets(input.components)
  assertTargets(input.onDark?.components)
  assertTargets(input.onLight?.components)

  const base = input.extends
  const own = resolveThemeValues(input, '')
  const tokens = { ...base?.tokens, ...own.tokens }
  const components = mergeComponentMaps(base?.components, own.components)
  const local = resolveLocalTokens(input.name, input.localTokens, base, tokens)

  const ownAxes: ThemeGenerativeAxes = {
    typography: input.typography,
    color: input.color,
    radius: input.radius,
    motion: input.motion,
  }
  const axes = resolveGenerativeAxes(base?.axes, ownAxes)
  const adaptations = normalizeThemeAdaptations(input.name, base?.adaptations, input.adaptations)
  const adaptationRules = resolveThemeAdaptationRules(input.name, adaptations, axes, {
    tokens,
    localTokens: local?.localTokens,
    components,
  })

  const onDark = { ...base?.onDark, ...resolveTokenMap(input.onDark?.tokens, 'onDark.tokens') }
  const onLight = { ...base?.onLight, ...resolveTokenMap(input.onLight?.tokens, 'onLight.tokens') }
  const onDarkComponents = mergeComponentMaps(base?.onDarkComponents, input.onDark?.components)
  const onLightComponents = mergeComponentMaps(base?.onLightComponents, input.onLight?.components)

  const icons = mergeMaps<string>(base?.icons, input.icons) as SemanticIconMap | undefined
  const indicators = sealIndicators(mergeMaps(base?.indicators, input.indicators))
  const css = compileThemeCss({
    name: input.name,
    tokens,
    localTokens: local?.localTokens,
    components,
    adaptationRules,
    onDarkComponents,
    onLightComponents,
  })

  return {
    __astryxTheme: true,
    name: input.name,
    tokens,
    ...(local ? { localTokens: local.localTokens, localTokenOwners: local.owners } : {}),
    onDark,
    onLight,
    ...(onDarkComponents ? { onDarkComponents } : {}),
    ...(onLightComponents ? { onLightComponents } : {}),
    syntax: input.syntax ?? base?.syntax,
    ...(icons ? { icons } : {}),
    ...(indicators ? { indicators } : {}),
    ...(components ? { components } : {}),
    ...(css ? { css } : {}),
    adaptations,
    ...(adaptationRules ? { adaptationRules } : {}),
    axes,
  }
}

/** Neutral, with no token overrides. Colors come from `@astryx-vue/themes/neutral.css`. */
export const neutralTheme: ThemeDefinition = defineTheme({ name: 'neutral' })
