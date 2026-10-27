import type {
  NormalizedThemeAdaptations,
  ResolvedThemeAdaptationRule,
  ThemeAdaptationCondition,
  ThemeAdaptationRule,
  ThemeAdaptations,
  ThemeAdaptationValue,
  ThemeGenerativeAxes,
  WidthBreakpoints,
} from './adaptationTypes.js'
import type { ThemeValuesInput } from './resolveThemeValues.js'
import type { ComponentStyleMap, TypographyConfig, TypographyRole } from './types.js'
import { DEFAULT_WIDTH_BREAKPOINTS, WIDTH_BREAKPOINT_NAMES } from './adaptationTypes.js'
import { assertNoTokenCycles, resolveAdaptationLocalTokens } from './localTokens.js'
import { resolveThemeValues } from './resolveThemeValues.js'

const BREAKPOINT_NAMES = new Set<string>(WIDTH_BREAKPOINT_NAMES)
const CONDITION_KEYS = new Set(['width', 'pointer', 'contrast', 'motion'])
const VALUE_KEYS = new Set(['typography', 'color', 'radius', 'motion', 'tokens', 'localTokens', 'components'])
const CONDITION_VALUES: Record<string, readonly string[]> = {
  pointer: ['coarse', 'fine'],
  contrast: ['more', 'less', 'no-preference'],
  motion: ['reduce', 'no-preference'],
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function assertRecord(value: unknown, path: string, allowed?: ReadonlySet<string>): asserts value is Record<string, unknown> {
  if (!isRecord(value))
    throw new Error(`${path} must be an object.`)
  for (const key of Object.keys(value)) {
    if (allowed && !allowed.has(key))
      throw new Error(`${path}.${key} is not supported.`)
  }
}

function normalizeBreakpoints(value: unknown, path: string): Partial<WidthBreakpoints> {
  assertRecord(value, path, BREAKPOINT_NAMES)
  const points: Partial<WidthBreakpoints> = {}
  for (const name of WIDTH_BREAKPOINT_NAMES) {
    const point = value[name]
    if (point === undefined)
      continue
    if (typeof point !== 'number' || !Number.isFinite(point) || point <= 0)
      throw new Error(`${path}.${name} must be a finite positive number of CSS pixels.`)
    points[name] = point
  }
  return points
}

function normalizeCondition(value: unknown, path: string): ThemeAdaptationCondition {
  assertRecord(value, path, CONDITION_KEYS)
  const defined = Object.fromEntries(Object.entries(value).filter(([, nested]) => nested !== undefined))
  if (Object.keys(defined).length === 0)
    throw new Error(`${path} must contain at least one condition.`)
  if (defined.width !== undefined) {
    assertRecord(defined.width, `${path}.width`, new Set(['from', 'below']))
    const { from, below } = defined.width
    if (from === undefined && below === undefined)
      throw new Error(`${path}.width must contain \`from\`, \`below\`, or both.`)
    for (const [edge, name] of [['from', from], ['below', below]] as const) {
      if (name !== undefined && (typeof name !== 'string' || !BREAKPOINT_NAMES.has(name)))
        throw new Error(`${path}.width.${edge} must be one of ${WIDTH_BREAKPOINT_NAMES.join(', ')}.`)
    }
  }
  for (const [key, allowed] of Object.entries(CONDITION_VALUES)) {
    const field = defined[key]
    if (field !== undefined && !allowed.includes(field as string))
      throw new Error(`${path}.${key} must be ${allowed.map(item => `'${item}'`).join(' or ')}.`)
  }
  return structuredClone(defined) as ThemeAdaptationCondition
}

function normalizeRule(value: unknown, path: string): ThemeAdaptationRule {
  assertRecord(value, path, new Set(['when', 'value']))
  if (!Object.hasOwn(value, 'when'))
    throw new Error(`${path}.when is required.`)
  if (!Object.hasOwn(value, 'value'))
    throw new Error(`${path}.value is required.`)
  assertRecord(value.value, `${path}.value`, VALUE_KEYS)
  for (const key of VALUE_KEYS) {
    const nested = value.value[key]
    if (nested !== undefined && !isRecord(nested))
      throw new Error(`${path}.value.${key} must be an object.`)
  }
  return {
    when: normalizeCondition(value.when, `${path}.when`),
    value: structuredClone(value.value) as ThemeAdaptationValue,
  }
}

/**
 * Validate adaptations and append them to the inherited ones.
 *
 * Width points merge over the inherited map and must strictly increase.
 * Inherited rules come first, so a child's rules win when both match.
 */
export function normalizeThemeAdaptations(
  themeName: string,
  inherited: NormalizedThemeAdaptations | undefined,
  input: ThemeAdaptations | undefined,
): NormalizedThemeAdaptations {
  const path = `defineTheme("${themeName}").adaptations`
  let points: Partial<WidthBreakpoints> = {}
  let rules: ThemeAdaptationRule[] = []
  if (input !== undefined) {
    assertRecord(input, path, new Set(['widthBreakpoints', 'rules']))
    if (input.widthBreakpoints !== undefined)
      points = normalizeBreakpoints(input.widthBreakpoints, `${path}.widthBreakpoints`)
    if (input.rules !== undefined) {
      if (!Array.isArray(input.rules))
        throw new Error(`${path}.rules must be an array of {when, value} objects.`)
      rules = Array.from(input.rules, (rule, index) => normalizeRule(rule, `${path}.rules[${index}]`))
    }
  }
  const widthBreakpoints = { ...DEFAULT_WIDTH_BREAKPOINTS, ...inherited?.widthBreakpoints, ...points }
  WIDTH_BREAKPOINT_NAMES.reduce((previous, name) => {
    if (widthBreakpoints[name] <= widthBreakpoints[previous])
      throw new Error(`${path}.widthBreakpoints must be strictly increasing: ${name} (${widthBreakpoints[name]}) is not above ${previous} (${widthBreakpoints[previous]}).`)
    return name
  })
  return { widthBreakpoints, rules: [...(inherited?.rules ?? []), ...rules] }
}

/** Media query text for one condition, in a fixed field order. */
export function mediaQuery(condition: ThemeAdaptationCondition, points: WidthBreakpoints, path: string): string {
  const parts: string[] = []
  const { from, below } = condition.width ?? {}
  if (from !== undefined && below !== undefined && points[from] >= points[below])
    throw new Error(`${path}.width must resolve to \`from < below\`; ${from} is ${points[from]}px and ${below} is ${points[below]}px.`)
  if (from !== undefined)
    parts.push(`(width >= ${points[from]}px)`)
  if (below !== undefined)
    parts.push(`(width < ${points[below]}px)`)
  if (condition.pointer !== undefined)
    parts.push(`(pointer: ${condition.pointer})`)
  if (condition.contrast !== undefined)
    parts.push(`(prefers-contrast: ${condition.contrast})`)
  if (condition.motion !== undefined)
    parts.push(`(prefers-reduced-motion: ${condition.motion})`)
  return parts.join(' and ')
}

function mergeRole(root: TypographyRole | undefined, rule: TypographyRole | undefined): TypographyRole | undefined {
  if (!root || !rule)
    return rule ?? root
  return { ...root, ...rule, weights: root.weights || rule.weights ? { ...root.weights, ...rule.weights } : undefined }
}

function completeNumbers<T extends object>(root: Partial<T> | undefined, rule: Partial<T>, required: readonly (keyof T)[], path: string): T {
  const merged = { ...root, ...rule } as T
  for (const key of required) {
    const value = merged[key]
    if (typeof value !== 'number' || !Number.isFinite(value))
      throw new Error(`${path}.${String(key)} is missing; supply it in the rule or on the root theme.`)
  }
  return merged
}

function ruleInput(value: ThemeAdaptationValue, axes: ThemeGenerativeAxes, path: string): ThemeValuesInput {
  let typography: TypographyConfig | undefined
  if (value.typography) {
    const scale = value.typography.scale || axes.typography?.scale
      ? completeNumbers(axes.typography?.scale, value.typography.scale ?? {}, ['base', 'ratio'], `${path}.typography.scale`)
      : undefined
    typography = {
      ...(scale ? { scale: { base: scale.base, ratio: scale.ratio } } : {}),
      body: mergeRole(axes.typography?.body, value.typography.body),
      heading: mergeRole(axes.typography?.heading, value.typography.heading),
      code: mergeRole(axes.typography?.code, value.typography.code),
    }
  }
  return {
    typography,
    color: value.color ? { ...axes.color, ...value.color } : undefined,
    radius: value.radius ? completeNumbers(axes.radius, value.radius, ['base', 'multiplier'], `${path}.radius`) : undefined,
    motion: value.motion ? completeNumbers(axes.motion, value.motion, ['fast', 'medium', 'ratio'], `${path}.motion`) : undefined,
    tokens: value.tokens,
    components: value.components,
  }
}

/**
 * Type-scale rules a rule regenerates that the root already declares with the
 * same value only repeat root CSS. Dropping them keeps the root's authored
 * component pins in force. Authored rule writes are always kept.
 */
function omitRootDuplicates(
  resolved: ComponentStyleMap | undefined,
  root: ComponentStyleMap | undefined,
  authored: ComponentStyleMap | undefined,
): ComponentStyleMap | undefined {
  if (!resolved || !root)
    return resolved
  const kept: ComponentStyleMap = {}
  for (const [target, rules] of Object.entries(resolved)) {
    for (const [key, styles] of Object.entries(rules)) {
      const writes = Object.fromEntries(Object.entries(styles).filter(([property]) =>
        root[target]?.[key]?.[property] === undefined || Object.hasOwn(authored?.[target]?.[key] ?? {}, property)))
      if (Object.keys(writes).length > 0)
        (kept[target] ??= {})[key] = writes
    }
  }
  return Object.keys(kept).length > 0 ? kept : undefined
}

function conditionMatches(condition: ThemeAdaptationCondition, points: WidthBreakpoints, env: Record<string, string | number>): boolean {
  const { from, below } = condition.width ?? {}
  if (from !== undefined && (env.width as number) < points[from])
    return false
  if (below !== undefined && (env.width as number) >= points[below])
    return false
  return (['pointer', 'contrast', 'motion'] as const).every(key => condition[key] === undefined || condition[key] === env[key])
}

/**
 * Check every environment the rules can meet together. In each one the
 * matching rules write in order over the root, like the CSS cascade, and the
 * result must hold no reference cycle through a name a rule wrote. A later
 * matching rule may repair a cycle an earlier one made.
 */
function assertNoReachableCycles(
  themeName: string,
  points: WidthBreakpoints,
  root: { tokens: Record<string, string>, localTokens?: Record<string, string> },
  rules: readonly ResolvedThemeAdaptationRule[],
): void {
  const writers = rules.flatMap((rule, index) =>
    Object.keys(rule.tokens).length > 0 || rule.localTokens ? [index] : [])
  if (writers.length === 0)
    return
  const checked = new Set<string>()
  for (const width of [0, ...WIDTH_BREAKPOINT_NAMES.map(name => points[name])]) {
    for (const pointer of ['coarse', 'fine', 'none']) {
      for (const contrast of ['more', 'less', 'no-preference', 'custom']) {
        for (const motion of ['reduce', 'no-preference']) {
          const matching = writers.filter(index => conditionMatches(rules[index]!.when, points, { width, pointer, contrast, motion }))
          const signature = matching.join(',')
          if (matching.length === 0 || checked.has(signature))
            continue
          checked.add(signature)
          const effective = { ...root.tokens, ...root.localTokens }
          const written = new Set<string>()
          for (const index of matching) {
            const rule = rules[index]!
            Object.assign(effective, rule.tokens, rule.localTokens)
            for (const name of [...Object.keys(rule.tokens), ...Object.keys(rule.localTokens ?? {})])
              written.add(name)
          }
          const label = matching.length === 1 ? 'rule' : 'overlapping rules'
          const queries = matching.map(index => rules[index]!.query).join('; ')
          assertNoTokenCycles(effective, `defineTheme("${themeName}").adaptations ${label} [${matching.join(', ')}] (${queries})`, written)
        }
      }
    }
  }
}

/** Lower every rule to concrete writes and reject reference cycles they create. */
export function resolveThemeAdaptationRules(
  themeName: string,
  adaptations: NormalizedThemeAdaptations,
  axes: ThemeGenerativeAxes,
  root: { tokens: Record<string, string>, localTokens?: Record<string, string>, components?: ComponentStyleMap },
): ResolvedThemeAdaptationRule[] | undefined {
  if (adaptations.rules.length === 0)
    return undefined
  const resolved = adaptations.rules.map((rule, index): ResolvedThemeAdaptationRule => {
    const path = `defineTheme("${themeName}").adaptations.rules[${index}]`
    const input = ruleInput(rule.value, axes, `${path}.value`)
    const values = resolveThemeValues(input, `${path}.value.`)
    for (const name of Object.keys(rule.value.tokens ?? {})) {
      if (root.localTokens && Object.hasOwn(root.localTokens, name))
        throw new Error(`${path}.value.tokens["${name}"] is a theme-local token; write it through value.localTokens.`)
    }
    const localTokens = resolveAdaptationLocalTokens(`${path}.value.localTokens`, rule.value.localTokens, root.localTokens)
    return {
      when: rule.when,
      query: mediaQuery(rule.when, adaptations.widthBreakpoints, `${path}.when`),
      tokens: values.tokens,
      ...(localTokens ? { localTokens } : {}),
      components: input.typography?.scale
        ? omitRootDuplicates(values.components, root.components, rule.value.components)
        : values.components,
    }
  })
  assertNoReachableCycles(themeName, adaptations.widthBreakpoints, root, resolved)
  return resolved
}
