import type { ThemeDefinition, ThemeTokenValue } from './types.js'
import { checkDeclarationValue } from './declarationBoundary.js'
import { tokenValueToCss } from './resolveThemeValues.js'
import { isPortableTokenName } from './tokenName.js'

const CUSTOM_PROPERTY_NAME = /^--[\w-]+$/
const VAR_REFERENCE = /var\(\s*(--[\w-]+)/g

export interface ResolvedLocalTokens {
  /** Exact name to CSS value, including inherited entries. */
  localTokens: Record<string, string>
  /** Exact name to the theme in the lineage that first declared it. */
  owners: Record<string, string>
}

function references(value: string): string[] {
  return [...value.matchAll(VAR_REFERENCE)].map(match => match[1] ?? '')
}

/** A readable loop inside one strongly connected group, starting at `start`. */
function cyclePath(start: string, group: ReadonlySet<string>, edges: ReadonlyMap<string, string[]>): string[] {
  const path = [start]
  const seen = new Set(path)
  const search = (name: string): boolean => {
    for (const next of edges.get(name) ?? []) {
      if (!group.has(next))
        continue
      if (next === start) {
        path.push(start)
        return true
      }
      if (seen.has(next))
        continue
      path.push(next)
      seen.add(next)
      if (search(next))
        return true
      path.pop()
    }
    return false
  }
  search(start)
  return path
}

/**
 * Throw when values in `tokens` reference each other in a loop.
 *
 * A loop makes every token on it invalid at computed-value time, so the
 * theme would silently lose those values. `relevant` limits the report to
 * loops whose strongly connected group holds at least one of those names,
 * so a loop that was already in the root theme is not blamed on a rule.
 */
export function assertNoTokenCycles(
  tokens: Readonly<Record<string, string>>,
  context: string,
  relevant?: ReadonlySet<string>,
): void {
  const edges = new Map<string, string[]>()
  for (const [name, value] of Object.entries(tokens))
    edges.set(name, references(value).filter(next => Object.hasOwn(tokens, next)))

  let counter = 0
  const index = new Map<string, number>()
  const low = new Map<string, number>()
  const stack: string[] = []
  const onStack = new Set<string>()

  const visit = (name: string): void => {
    const own = counter++
    index.set(name, own)
    low.set(name, own)
    stack.push(name)
    onStack.add(name)
    for (const next of edges.get(name) ?? []) {
      if (!index.has(next)) {
        visit(next)
        low.set(name, Math.min(low.get(name) ?? own, low.get(next) ?? own))
      }
      else if (onStack.has(next)) {
        low.set(name, Math.min(low.get(name) ?? own, index.get(next) ?? own))
      }
    }
    if (low.get(name) !== own)
      return
    const group: string[] = []
    let member: string | undefined
    do {
      member = stack.pop()
      if (member === undefined)
        break
      onStack.delete(member)
      group.push(member)
    } while (member !== name)
    const looped = group.length > 1 || (edges.get(name) ?? []).includes(name)
    if (!looped || (relevant && !group.some(item => relevant.has(item))))
      return
    const start = group.find(item => relevant?.has(item)) ?? name
    throw new Error(`${context}: theme token cycle detected: ${cyclePath(start, new Set(group), edges).join(' -> ')}.`)
  }

  for (const name of Object.keys(tokens)) {
    if (!index.has(name))
      visit(name)
  }
}

/**
 * Resolve `localTokens` for one theme.
 *
 * Names are kept exactly as written: a theme-local token is the theme
 * family's own vocabulary, not a shared token, so no prefix is added.
 * A child theme inherits its base's local tokens and may replace their
 * values; the first theme to declare a name stays its owner.
 *
 * Refused:
 * - a name that is not a custom property;
 * - a shared token name such as `--color-accent` or `--astryx-spacing-4`,
 *   because components already read that name with a fixed meaning;
 * - a name the theme also sets through `tokens`;
 * - a reference cycle among the local tokens.
 */
export function resolveLocalTokens(
  themeName: string,
  declarations: Record<string, ThemeTokenValue> | undefined,
  base: ThemeDefinition | undefined,
  portableTokens: Readonly<Record<string, string>>,
): ResolvedLocalTokens | undefined {
  if (declarations === undefined && base?.localTokens === undefined)
    return undefined
  if (declarations !== undefined && (declarations === null || typeof declarations !== 'object' || Array.isArray(declarations)))
    throw new Error(`defineTheme("${themeName}"): localTokens must be a token map.`)

  const localTokens: Record<string, string> = { ...base?.localTokens }
  const owners: Record<string, string> = { ...base?.localTokenOwners }
  for (const [name, value] of Object.entries(declarations ?? {})) {
    const path = `defineTheme("${themeName}").localTokens["${name}"]`
    if (!CUSTOM_PROPERTY_NAME.test(name))
      throw new Error(`${path}: a local token name must be a CSS custom property such as --brand-ink.`)
    if (isPortableTokenName(name))
      throw new Error(`${path}: "${name}" is a shared theme token. Set it through tokens, or pick a name outside the shared vocabulary.`)
    const css = tokenValueToCss(value, path)
    const reason = checkDeclarationValue(css)
    if (reason != null)
      throw new Error(`${path}: ${reason}.`)
    localTokens[name] = css
    owners[name] ??= themeName
  }

  for (const name of Object.keys(localTokens)) {
    if (Object.hasOwn(portableTokens, name))
      throw new Error(`defineTheme("${themeName}"): token "${name}" cannot be declared in both tokens and localTokens.`)
  }
  assertNoTokenCycles(localTokens, `defineTheme("${themeName}").localTokens`)
  return { localTokens, owners }
}

/**
 * Resolve the local-token writes of one adaptation rule.
 *
 * A rule may give a new value to a name the root theme lineage declared. It
 * cannot introduce a name of its own.
 */
export function resolveAdaptationLocalTokens(
  path: string,
  declarations: Record<string, ThemeTokenValue> | undefined,
  rootLocalTokens: Readonly<Record<string, string>> | undefined,
): Record<string, string> | undefined {
  if (declarations === undefined)
    return undefined
  const resolved: Record<string, string> = {}
  for (const [name, value] of Object.entries(declarations)) {
    if (!rootLocalTokens || !Object.hasOwn(rootLocalTokens, name))
      throw new Error(`${path}["${name}"] cannot add a theme-local token. Declare it in the root theme or a theme it extends first.`)
    const css = tokenValueToCss(value, `${path}["${name}"]`)
    const reason = checkDeclarationValue(css)
    if (reason != null)
      throw new Error(`${path}["${name}"]: ${reason}.`)
    resolved[name] = css
  }
  return Object.keys(resolved).length > 0 ? resolved : undefined
}
