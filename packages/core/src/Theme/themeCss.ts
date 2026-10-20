import type { ResolvedThemeAdaptationRule } from './adaptationTypes.js'
import type { MediaSurface } from './componentStyles.js'
import type { ComponentStyleMap } from './types.js'
import { compileComponentRules, tokenRule } from './componentStyles.js'
import { propGuardRules, touchesGuardedTargets } from './propGuards.js'
import { bridgeComponentTokens } from './themeStyle.js'

/** Everything that compiles into one theme's stylesheet. */
export interface ThemeCssSource {
  name: string
  tokens: Readonly<Record<string, string>>
  localTokens?: Readonly<Record<string, string>>
  components?: ComponentStyleMap
  adaptationRules?: readonly ResolvedThemeAdaptationRule[]
  onDark?: Readonly<Record<string, string>>
  onLight?: Readonly<Record<string, string>>
  onDarkComponents?: ComponentStyleMap
  onLightComponents?: ComponentStyleMap
}

/** Wrap rules in this theme's subtree, stopping at a nested theme. */
function scoped(themeName: string, rules: readonly string[]): string {
  const root = `[data-astryx-theme="${themeName}"]`
  return `@scope (${root}) to ([data-astryx-theme]) {\n${rules.join('\n')}\n}`
}

/**
 * Adapted tokens target the `Theme` wrapper only. `<html>` also carries the
 * outermost theme's name, so content teleported to `<body>` picks up the
 * component rules; tokens stay on the wrapper, where `Theme` writes the root
 * values inline, so a `Theme` that wraps one part of a page does not
 * recolor the rest of it.
 */
const TOKEN_TARGET = ':scope.astryx-theme'

function rootRules(source: ThemeCssSource): string[] {
  const rules: string[] = []
  rules.push(...compileComponentRules(source.components, ''))
  rules.push(...propGuardRules(source.components))
  return rules
}

function adaptationBlocks(source: ThemeCssSource): string[] {
  const rules = source.adaptationRules ?? []
  const blocks: string[] = []
  for (const [index, rule] of rules.entries()) {
    const location = `adaptations[${index}].`
    const inner = [
      ...tokenRule(TOKEN_TARGET, { ...bridgeComponentTokens(rule.tokens), ...rule.localTokens }, `${location}tokens`, true),
      ...compileComponentRules(rule.components, location),
    ]
    if (inner.length > 0)
      blocks.push(`@media ${rule.query} {\n${scoped(source.name, inner)}\n}`)
  }
  if (!rules.some(rule => touchesGuardedTargets(rule.components)))
    return blocks

  // One unconditional guard puts every explicit prop back above the adapted
  // type defaults. A guard inside each block would carry one rule's prop
  // value into environments only a later, broader rule matches. Each rule's
  // own prop writes then follow in rule order.
  blocks.push(scoped(source.name, propGuardRules(source.components, { force: true })))
  for (const rule of rules) {
    const authored = propGuardRules(rule.components, { authoredOnly: true })
    if (authored.length > 0)
      blocks.push(`@media ${rule.query} {\n${scoped(source.name, authored)}\n}`)
  }
  return blocks
}

function surfaceRules(source: ThemeCssSource, surface: MediaSurface): string[] {
  const components = surface === 'dark' ? source.onDarkComponents : source.onLightComponents
  if (!components)
    return []
  return [
    ...compileComponentRules(components, surface === 'dark' ? 'onDark.' : 'onLight.', surface),
    ...propGuardRules(components, { surface, inherited: source.components }),
  ]
}

/**
 * Compile one theme's stylesheet into the `astryx.overrides` layer.
 *
 * Order is the cascade order: root rules, then each adaptation in authored
 * order, then media-surface rules, so a later section wins at equal
 * specificity. Every block is scoped to this theme and stops at a nested
 * theme, so an inner theme's components keep their own styling.
 *
 * Root tokens are not in the sheet: `Theme` writes them inline on its
 * wrapper, so two `Theme`s that share a name still keep their own values. An
 * adaptation's token writes are `!important`, which is what lets them beat
 * those inline values while their media query matches. A nested theme
 * inherits every token it does not set, adapted or not.
 */
export function compileThemeCss(source: ThemeCssSource): string | undefined {
  const blocks: string[] = []
  const root = rootRules(source)
  if (root.length > 0)
    blocks.push(scoped(source.name, root))
  blocks.push(...adaptationBlocks(source))
  const surfaces = [...surfaceRules(source, 'dark'), ...surfaceRules(source, 'light')]
  if (surfaces.length > 0)
    blocks.push(scoped(source.name, surfaces))
  if (blocks.length === 0)
    return undefined
  // The sheet is written into a <style> element as raw text, so `</style`
  // must not appear in it. `<\/` reads as `</` inside a CSS string, and the
  // sequence has no other valid place in a declaration.
  const sheet = `@layer astryx.overrides {\n${blocks.join('\n')}\n}\n`
  return sheet.replace(/<\/(style)/gi, '<\\/$1')
}
