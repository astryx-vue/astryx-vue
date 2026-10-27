import type { MediaSurface } from './componentStyles.js'
import type { ComponentStyleMap } from './types.js'
import { targetSelectors } from './componentStyles.js'
import { checkDeclarationValue } from './declarationBoundary.js'
import { prefixTokenReferences } from './tokenName.js'

/** An authored value as CSS, or undefined when it cannot stay one declaration. */
function safeValue(value: unknown): string | undefined {
  if (typeof value !== 'string')
    return undefined
  const css = prefixTokenReferences(value)
  return checkDeclarationValue(css) === null ? css : undefined
}

/**
 * Explicit props that must keep winning over a theme's own type rules.
 *
 * Theme rules sit in `astryx.overrides`, above the component layer. A theme
 * that styles `heading level:2` or `text type:body` would otherwise beat an
 * explicit `weight`, `color`, or `size` prop on that element. Restating the
 * prop classes after the theme rules puts the prop back on top.
 *
 * Values mirror the component stylesheets in `packages/core/styles`, so a
 * restated prop looks exactly as it does without a theme.
 */
const GUARDS: Readonly<Record<string, Readonly<Record<string, Readonly<Record<string, string>>>>>> = {
  heading: {
    'weight:regular': { fontWeight: 'var(--astryx-font-weight-regular, 400)' },
    'weight:medium': { fontWeight: 'var(--astryx-font-weight-medium, 500)' },
    'weight:semibold': { fontWeight: 'var(--astryx-font-weight-semibold, 600)' },
    'weight:bold': { fontWeight: 'var(--astryx-font-weight-bold, 700)' },
    'color:primary': { color: 'var(--astryx-color-text-primary, light-dark(#171717, #fafafa))' },
    'color:secondary': { color: 'var(--astryx-color-text-secondary, light-dark(#525252, #a3a3a3))' },
    'color:accent': { color: 'var(--astryx-color-text-accent, #0074e2)' },
  },
  text: {
    'weight:regular': { fontWeight: 'var(--astryx-font-weight-regular, 400)' },
    'weight:medium': { fontWeight: 'var(--astryx-font-weight-medium, 500)' },
    'weight:semibold': { fontWeight: 'var(--astryx-font-weight-semibold, 600)' },
    'weight:bold': { fontWeight: 'var(--astryx-font-weight-bold, 700)' },
    'size:sm': { fontSize: 'var(--astryx-text-sm-size, 0.75rem)' },
    'size:md': { fontSize: 'var(--astryx-text-md-size, 0.875rem)' },
    'size:lg': { fontSize: 'var(--astryx-text-lg-size, 1rem)' },
    'size:xl': { fontSize: 'var(--astryx-text-xl-size, 1.25rem)' },
    'color:primary': { color: 'var(--astryx-color-text-primary, light-dark(#171717, #fafafa))' },
    'color:secondary': { color: 'var(--astryx-color-text-secondary, light-dark(#525252, #a3a3a3))' },
    'color:accent': { color: 'var(--astryx-color-text-accent, #0074e2)' },
    'color:disabled': { color: 'var(--astryx-color-text-disabled, light-dark(#a3a3a3, #525252))' },
    'color:placeholder': { color: 'var(--astryx-color-text-placeholder, #737373)' },
  },
  link: {
    'color:primary': { color: 'var(--astryx-link-primary-foreground, var(--astryx-color-text-primary, #171717))' },
    'color:secondary': { color: 'var(--astryx-link-secondary-foreground, var(--astryx-color-text-secondary, #525252))' },
    'color:accent': { color: 'var(--astryx-link-accent-foreground, #0074e2)' },
  },
}

const PROPERTY_CSS: Record<string, string> = { fontWeight: 'font-weight', fontSize: 'font-size', color: 'color' }

export interface PropGuardOptions {
  /** Limit the rules to one media surface. */
  surface?: MediaSurface
  /** Emit for every guarded target, even when `components` does not touch it. */
  force?: boolean
  /** Emit only the prop keys `components` writes itself, with its own values. */
  authoredOnly?: boolean
  /** A surface falls back to the root theme's authored prop value. */
  inherited?: ComponentStyleMap
}

/**
 * Prop rules for every guarded target this component map touches.
 *
 * A theme may restyle a prop on purpose, for example
 * `heading: { 'weight:medium': { fontWeight: '450' } }`; that authored value
 * is what gets restated. A value that cannot stay one declaration was
 * already reported where the component rule was compiled, so the default
 * is restated instead.
 */
export function propGuardRules(components: ComponentStyleMap | undefined, options: PropGuardOptions = {}): string[] {
  const rules: string[] = []
  for (const [target, keys] of Object.entries(GUARDS)) {
    const own = components?.[target]
    if (own === undefined && !options.force)
      continue
    for (const [key, declarations] of Object.entries(keys)) {
      const authored = own?.[key]
      if (options.authoredOnly && authored === undefined)
        continue
      const fallback = options.inherited?.[target]?.[key]
      const body = Object.entries(declarations).map(([property, value]) => {
        const written = safeValue(authored?.[property]) ?? safeValue(fallback?.[property])
        return `${PROPERTY_CSS[property]}: ${written ?? value};`
      }).join(' ')
      rules.push(`${targetSelectors(target, key, options.surface).join(', ')} { ${body} }`)
    }
  }
  return rules
}

/** Whether a component map touches any guarded target. */
export function touchesGuardedTargets(components: ComponentStyleMap | undefined): boolean {
  return Object.keys(GUARDS).some(target => components?.[target] !== undefined)
}
