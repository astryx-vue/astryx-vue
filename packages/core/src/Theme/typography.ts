import type { HeadingWeightOverrides, TextWeightOverrides, TypeScaleConfig } from './expandTypeScale.js'
import type { ComponentStyleMap, TypographyConfig } from './types.js'
import { expandTypeScale, generateTypeScaleComponents } from './expandTypeScale.js'

const NAMED_WEIGHTS: Record<string, string> = {
  normal: 'var(--font-weight-normal)',
  regular: 'var(--font-weight-normal)',
  medium: 'var(--font-weight-medium)',
  semibold: 'var(--font-weight-semibold)',
  bold: 'var(--font-weight-bold)',
}

function weightToken(value: string): string {
  return NAMED_WEIGHTS[value.trim()] ?? value
}

function quoteFamily(family: string): string {
  const trimmed = family.trim()
  if (trimmed.startsWith('"') || trimmed.startsWith('\''))
    return trimmed
  if (/[^a-z0-9-]/i.test(trimmed))
    return `"${trimmed.replace(/"/g, '')}"`
  return trimmed
}

function fontStack(role: TypographyConfig['body']): string | undefined {
  if (!role?.family && !role?.fallbacks)
    return undefined
  const family = role.family ? quoteFamily(role.family) : undefined
  if (family && role.fallbacks)
    return `${family}, ${role.fallbacks}`
  return family ?? role.fallbacks
}

function headingSizeAliases(tokens: Record<string, string>): Record<string, string> {
  const aliases: Record<string, string> = {}
  for (let level = 1; level <= 6; level += 1) {
    const size = `--text-heading-${level}-size`
    if (tokens[size])
      aliases[`--heading-level-${level}-size`] = `var(${size})`
  }
  for (const step of [1, 2, 3]) {
    const size = `--text-display-${step}-size`
    if (tokens[size])
      aliases[`--heading-display-${step}-size`] = `var(${size})`
  }
  return aliases
}

function assignHeadingWeight(heading: HeadingWeightOverrides, level: number, weight: string): void {
  if (level >= 1 && level <= 6)
    heading[level as 1 | 2 | 3 | 4 | 5 | 6] = weightToken(weight)
}

function scaleConfig(config: TypographyConfig): TypeScaleConfig {
  const scale = config.scale
  if (!scale)
    throw new Error('Theme typography scale is missing.')

  const heading: HeadingWeightOverrides = {}
  if (config.heading?.weight) {
    const weight = weightToken(config.heading.weight)
    for (const level of [1, 2, 3, 4, 5, 6] as const)
      heading[level] = weight
  }
  for (const [level, weight] of Object.entries(config.heading?.weights ?? {})) {
    if (weight)
      assignHeadingWeight(heading, Number(level), weight)
  }
  for (const [level, weight] of Object.entries(scale.weights?.heading ?? {})) {
    if (weight)
      assignHeadingWeight(heading, Number(level), weight)
  }

  const text: TextWeightOverrides = {}
  if (config.body?.weight)
    text.body = weightToken(config.body.weight)
  if (config.code?.weight)
    text.code = weightToken(config.code.weight)
  for (const [name, weight] of Object.entries(scale.weights?.text ?? {})) {
    if (weight)
      text[name] = weightToken(weight)
  }

  return {
    base: scale.base,
    ratio: scale.ratio,
    weights: { heading, text },
  }
}

/**
 * Font stacks, the type scale, and the heading size aliases Heading reads.
 * Heading inherits the body stack when it does not name its own.
 */
export function resolveTypography(config: TypographyConfig | undefined): {
  tokens: Record<string, string>
  components?: ComponentStyleMap
} {
  if (!config)
    return { tokens: {} }

  const tokens: Record<string, string> = {}
  const bodyStack = fontStack(config.body)
  const headingStack = fontStack(config.heading) ?? bodyStack
  const codeStack = fontStack(config.code)
  if (bodyStack)
    tokens['--font-family-body'] = bodyStack
  if (headingStack)
    tokens['--font-family-heading'] = headingStack
  if (codeStack)
    tokens['--font-family-code'] = codeStack

  const components: ComponentStyleMap = {}
  if (config.scale) {
    Object.assign(tokens, expandTypeScale(scaleConfig(config)))
    Object.assign(tokens, headingSizeAliases(tokens))
    Object.assign(components, generateTypeScaleComponents())
  }

  if (fontStack(config.heading)) {
    components.heading = {
      ...components.heading,
      base: {
        fontFamily: 'var(--font-family-heading)',
        ...components.heading?.base,
      },
    }
  }
  if (codeStack) {
    components.text = {
      ...components.text,
      'type:code': {
        fontFamily: 'var(--font-family-code)',
        ...components.text?.['type:code'],
      },
    }
  }

  return {
    tokens,
    ...(Object.keys(components).length > 0 ? { components } : {}),
  }
}
