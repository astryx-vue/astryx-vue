/** Per-level heading weights. Values are CSS font-weight values. */
export type HeadingWeightOverrides = Partial<Record<1 | 2 | 3 | 4 | 5 | 6, string>>

/** Per-role text weights. Extra keys are kept for a theme's own roles. */
export type TextWeightOverrides = Partial<Record<string, string>>

/**
 * Geometric type scale. `base` is the body size in px. `ratio` is the step.
 * Size at a step is `round(base × ratio^step)`.
 */
export interface TypeScaleConfig {
  base: number
  ratio: number
  weights?: {
    heading?: HeadingWeightOverrides
    text?: TextWeightOverrides
  }
}

export type TypeScaleTokens = Record<string, string>

const STEP_TO_SIZE_TOKEN: Record<number, string> = {
  [-5]: '--font-size-4xs',
  [-4]: '--font-size-3xs',
  [-3]: '--font-size-2xs',
  [-2]: '--font-size-xs',
  [-1]: '--font-size-sm',
  0: '--font-size-base',
  1: '--font-size-lg',
  2: '--font-size-xl',
  3: '--font-size-2xl',
  4: '--font-size-3xl',
  5: '--font-size-4xl',
  6: '--font-size-5xl',
}

const HEADING_STEPS: Record<number, number> = {
  1: 3,
  2: 2,
  3: 1,
  4: 0,
  5: -1,
  6: -2,
}

const TEXT_STEPS: Record<string, number> = {
  'body': 0,
  'large': 1,
  'label': 0,
  'code': 0,
  'supporting': -1,
  'display-1': 6,
  'display-2': 5,
  'display-3': 4,
}

const DEFAULT_HEADING_WEIGHTS: Record<number, string> = {
  1: 'var(--font-weight-semibold)',
  2: 'var(--font-weight-semibold)',
  3: 'var(--font-weight-semibold)',
  4: 'var(--font-weight-semibold)',
  5: 'var(--font-weight-semibold)',
  6: 'var(--font-weight-semibold)',
}

const DEFAULT_TEXT_WEIGHTS: Record<string, string> = {
  'body': 'var(--font-weight-normal)',
  'large': 'var(--font-weight-semibold)',
  'label': 'var(--font-weight-medium)',
  'code': 'var(--font-weight-normal)',
  'supporting': 'var(--font-weight-normal)',
  'display-1': 'var(--font-weight-normal)',
  'display-2': 'var(--font-weight-normal)',
  'display-3': 'var(--font-weight-normal)',
}

const TEXT_FONT_FAMILIES: Record<string, string> = {
  'body': 'var(--font-family-body)',
  'large': 'var(--font-family-body)',
  'label': 'var(--font-family-body)',
  'code': 'var(--font-family-code)',
  'supporting': 'var(--font-family-body)',
  'display-1': 'var(--font-family-heading)',
  'display-2': 'var(--font-family-heading)',
  'display-3': 'var(--font-family-heading)',
}

function assertScale(config: TypeScaleConfig): void {
  if (!Number.isFinite(config.base) || config.base <= 0)
    throw new Error('Theme type scale base must be a positive number of pixels.')
  if (!Number.isFinite(config.ratio) || config.ratio <= 0)
    throw new Error('Theme type scale ratio must be a positive number.')
}

function computeSize(base: number, ratio: number, step: number): number {
  return Math.round(base * ratio ** step)
}

function pxToRem(px: number): string {
  const rem = Math.round((px / 16) * 10000) / 10000
  return `${rem}rem`
}

/** Under 20px uses 1.5, under 32px uses 1.4, and the rest uses 1.25. */
function targetLeadingRatio(fontSize: number): number {
  if (fontSize < 20)
    return 1.5
  if (fontSize < 32)
    return 1.4
  return 1.25
}

function computeLeading(fontSize: number): number {
  const raw = fontSize * targetLeadingRatio(fontSize)
  const snapped = Math.max(
    Math.round(raw / 4) * 4,
    Math.ceil((fontSize + 4) / 4) * 4,
  )
  return Math.round((snapped / fontSize) * 10000) / 10000
}

/**
 * Raw `--font-size-*` steps, then heading and text roles.
 *
 * Sizes on the roles point at the raw steps with `var()`. Line heights are
 * unitless ratios snapped onto a 4px grid. Weights point at `--font-weight-*`.
 */
export function expandTypeScale(config: TypeScaleConfig): TypeScaleTokens {
  assertScale(config)
  const { base, ratio, weights } = config
  const tokens: TypeScaleTokens = {}
  const headingWeights = {
    ...DEFAULT_HEADING_WEIGHTS,
    ...weights?.heading,
  }
  const textWeights = {
    ...DEFAULT_TEXT_WEIGHTS,
    ...weights?.text,
  }

  for (let step = -5; step <= 6; step += 1) {
    const name = STEP_TO_SIZE_TOKEN[step]
    if (name)
      tokens[name] = pxToRem(computeSize(base, ratio, step))
  }

  for (const level of [1, 2, 3, 4, 5, 6] as const) {
    const step = HEADING_STEPS[level] ?? 0
    const size = computeSize(base, ratio, step)
    const sizeToken = STEP_TO_SIZE_TOKEN[step]
    tokens[`--text-heading-${level}-size`] = `var(${sizeToken})`
    tokens[`--text-heading-${level}-weight`] = headingWeights[level] ?? 'var(--font-weight-semibold)'
    tokens[`--text-heading-${level}-leading`] = `${computeLeading(size)}`
  }

  for (const [type, step] of Object.entries(TEXT_STEPS)) {
    const size = computeSize(base, ratio, step)
    tokens[`--text-${type}-size`] = `var(${STEP_TO_SIZE_TOKEN[step]})`
    tokens[`--text-${type}-weight`] = textWeights[type] ?? DEFAULT_TEXT_WEIGHTS[type] ?? 'var(--font-weight-normal)'
    tokens[`--text-${type}-leading`] = `${computeLeading(size)}`
  }

  return tokens
}

/**
 * Heading and text rules that read the generated tokens.
 *
 * `type:display-*` is emitted after `level:*` so display sizing wins when a
 * heading carries both classes.
 */
export function generateTypeScaleComponents(): Record<string, Record<string, Record<string, string>>> {
  const heading: Record<string, Record<string, string>> = {}
  for (const level of [1, 2, 3, 4, 5, 6]) {
    heading[`level:${level}`] = {
      fontFamily: 'var(--font-family-heading)',
      fontSize: `var(--text-heading-${level}-size)`,
      fontWeight: `var(--text-heading-${level}-weight)`,
      lineHeight: `var(--text-heading-${level}-leading)`,
    }
  }
  for (const type of ['display-1', 'display-2', 'display-3']) {
    heading[`type:${type}`] = {
      fontFamily: 'var(--font-family-heading)',
      fontSize: `var(--text-${type}-size)`,
      lineHeight: `var(--text-${type}-leading)`,
    }
  }

  const text: Record<string, Record<string, string>> = {}
  for (const type of ['body', 'large', 'label', 'code', 'supporting', 'display-1', 'display-2', 'display-3']) {
    text[`type:${type}`] = {
      fontFamily: TEXT_FONT_FAMILIES[type] ?? 'var(--font-family-body)',
      fontSize: `var(--text-${type}-size)`,
      lineHeight: `var(--text-${type}-leading)`,
    }
  }

  return { heading, text }
}
