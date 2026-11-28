import type { Component } from 'vue'
import type { SemanticIconMap } from '../Icon/semantic.js'
import type { StoredIconEntry } from '../Icon/themeIcons.js'
import type { IndicatorRegistry } from '../Indicator/types.js'
import type { ThemeGenerativeAxes } from './adaptationTypes.js'
import type { ComponentStyleMap, DefineThemeInput, ThemeDefinition, ThemeIconVariant } from './types.js'
import { markRaw } from 'vue'
import { mergeComponentIcons, staticComponentIcons } from '../Icon/componentIcons.js'
import { readThemeIconIds, resolveIconEntryVariants } from '../Icon/themeIcons.js'
import { normalizeThemeAdaptations, resolveThemeAdaptationRules } from './adaptations.js'
import { assertTargetName } from './componentStyles.js'
import { deriveChatRadius } from './expandRadiusScale.js'
import { resolveLocalTokens } from './localTokens.js'
import { mergeComponentMaps } from './mergeComponents.js'
import { paletteTokens, readPalette, withPaletteComponents } from './paletteTheme.js'
import { resolveThemeValues, resolveTokenMap } from './resolveThemeValues.js'
import { resolveRootMotion } from './rootMotion.js'
import { deriveStatusRoleTokens } from './statusRoleDerivation.js'
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

/** The base's tokens without the ones it derived, so this theme derives its own. */
function authoredBaseTokens(base: ThemeDefinition | undefined): Record<string, string> {
  const tokens = { ...base?.tokens }
  for (const name of base?.derivedTokens ?? [])
    delete tokens[name]
  return tokens
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
 *
 * Status roles the theme does not set but whose colors it changes (a status
 * fill, a pale fill, a surface, or the light and dark content colors) are
 * computed against its own colors: content on each fill, status text, and
 * content on each pale fill. See `statusRoleDerivation.ts`.
 */
export function defineTheme<
  const IconVariants extends readonly string[] | undefined = undefined,
  Base extends ThemeDefinition | undefined = undefined,
>(input: DefineThemeInput<IconVariants, Base>): ThemeDefinition<ThemeIconVariant<IconVariants, Base>> {
  if (!THEME_NAME.test(input.name))
    throw new Error(`Theme name "${input.name}" must use letters, numbers, and hyphens.`)
  // A present but undefined `extends` is what an import of the wrong name
  // hands over. It is refused, not ignored, so the theme cannot quietly
  // build without everything it meant to inherit.
  if ('extends' in input && !isDefinedTheme(input.extends))
    throw new Error(`defineTheme("${input.name}"): \`extends\` must be a theme from defineTheme(), got ${describeBadBase(input.extends)}. Check that the import naming the base theme resolves to it.`)
  // A root `localTokens` left undefined is usually a failed import. It is
  // refused by name, not read as no local tokens.
  if ('localTokens' in input && input.localTokens === undefined)
    throw new Error(`defineTheme("${input.name}"): localTokens is undefined: omit the field or pass an object.`)
  assertTargets(input.components)
  assertTargets(input.onDark?.components)
  assertTargets(input.onLight?.components)

  const base: ThemeDefinition | undefined = input.extends
  const palette = readPalette(input.name, input.palette)
  const { motion, inheritedTokens } = resolveRootMotion(input.name, input.motion, base)
  // A palette's colors sit between the generated values and the explicit tokens.
  const ownTokens = { ...inheritedTokens, ...paletteTokens(palette), ...input.tokens }
  const ownInput = { ...input, motion, tokens: ownTokens, components: withPaletteComponents(palette, input.components) }
  const own = resolveThemeValues(ownInput, '', {
    inheritedCharacter: base?.axes?.motion?.character,
    standardBeneath: base?.tokens['--astryx-ease-standard'],
  })
  const authoredTokens = { ...authoredBaseTokens(base), ...own.tokens }
  // Status roles this theme leaves unset are computed from its own colors.
  // Chat surfaces default to the container radius.
  const derivedRoles = { ...deriveStatusRoleTokens(authoredTokens), ...deriveChatRadius(authoredTokens) }
  const tokens = { ...authoredTokens, ...derivedRoles }
  const derivedTokens = Object.keys(derivedRoles)
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

  // The base's id view drops its functions, so merge from its entries.
  const ownIcons = input.icons as Readonly<Record<string, StoredIconEntry>> | undefined
  const iconEntries = mergeMaps<StoredIconEntry>(base?.iconEntries ?? base?.icons, ownIcons)
  const icons = readThemeIconIds(iconEntries) as SemanticIconMap | undefined
  // The variant list belongs to the whole theme: a list set here replaces the
  // inherited one, an omitted list is inherited.
  const iconVariants = input.iconVariants !== undefined ? [...input.iconVariants] : base?.iconVariants
  const iconEntryVariants = resolveIconEntryVariants(iconEntries, ownIcons, base, iconVariants)
  const componentIconValues = mergeComponentIcons(base?.componentIconValues, input.componentIcons)
  const indicators = sealIndicators(mergeMaps(base?.indicators, input.indicators))
  const css = compileThemeCss({
    name: input.name,
    tokens,
    localTokens: local?.localTokens,
    components,
    adaptationRules,
    onDarkComponents,
    onLightComponents,
    syntax: input.syntax ?? base?.syntax,
  })

  return {
    __astryxTheme: true,
    name: input.name,
    tokens,
    ...(derivedTokens.length > 0 ? { derivedTokens } : {}),
    ...(local ? { localTokens: local.localTokens, localTokenOwners: local.owners } : {}),
    onDark,
    onLight,
    ...(onDarkComponents ? { onDarkComponents } : {}),
    ...(onLightComponents ? { onLightComponents } : {}),
    syntax: input.syntax ?? base?.syntax,
    ...(icons ? { icons } : {}),
    ...(iconEntries ? { iconEntries } : {}),
    ...(iconVariants !== undefined ? { iconVariants } : {}),
    ...(iconEntryVariants ? { iconEntryVariants } : {}),
    ...(componentIconValues ? { componentIcons: staticComponentIcons(componentIconValues), componentIconValues } : {}),
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
