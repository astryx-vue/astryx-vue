import type { ColorScaleConfig } from './expandColorScale.js'
import type { MotionScaleConfig } from './expandMotionScale.js'
import type { RadiusScaleConfig } from './expandRadiusScale.js'
import type { TypeScaleConfig } from './expandTypeScale.js'
import type { ComponentStyleMap, ThemeTokens, ThemeTokenValue, TypographyConfig } from './types.js'

/** Fixed names for viewport-width tier start points. */
export const WIDTH_BREAKPOINT_NAMES = ['sm', 'md', 'lg', 'xl', '2xl'] as const

/** One fixed viewport-width breakpoint name. */
export type WidthBreakpointName = (typeof WIDTH_BREAKPOINT_NAMES)[number]

/** A complete map of viewport-width tier start points, in CSS px. */
export type WidthBreakpoints = Record<WidthBreakpointName, number>

/** Default width tier start points, in CSS px. */
export const DEFAULT_WIDTH_BREAKPOINTS: Readonly<WidthBreakpoints> = Object.freeze({
  'sm': 640,
  'md': 768,
  'lg': 1024,
  'xl': 1280,
  '2xl': 1536,
})

/** `from` is inclusive, `below` is exclusive. */
export interface ThemeAdaptationWidthCondition {
  from?: WidthBreakpointName
  below?: WidthBreakpointName
}

/** Environment fields. Every field present must match. */
export interface ThemeAdaptationCondition {
  /** Viewport width range, by named breakpoint. */
  width?: ThemeAdaptationWidthCondition
  /** Primary pointer precision. */
  pointer?: 'coarse' | 'fine'
  /** `prefers-contrast`. */
  contrast?: 'more' | 'less' | 'no-preference'
  /** `prefers-reduced-motion`. */
  motion?: 'reduce' | 'no-preference'
}

/** Typography inside a rule. A partial scale is completed from the root theme. */
export interface ThemeAdaptationTypographyConfig extends Omit<TypographyConfig, 'scale'> {
  scale?: Partial<Pick<TypeScaleConfig, 'base' | 'ratio'>>
}

/** Theme values one rule writes while its condition matches. */
export interface ThemeAdaptationValue {
  /** Partial values are completed from the root theme's typography. */
  typography?: ThemeAdaptationTypographyConfig
  /** Merged over the root theme's color config. */
  color?: Partial<ColorScaleConfig>
  /** Completed from the root theme's radius config. */
  radius?: Partial<RadiusScaleConfig>
  /** Completed from the root theme's motion config. */
  motion?: Partial<MotionScaleConfig>
  /** Shared token writes. */
  tokens?: ThemeTokens
  /** New values for theme-local tokens the root theme already declares. */
  localTokens?: Record<string, ThemeTokenValue>
  /** Component style writes. */
  components?: ComponentStyleMap
}

/** One ordered condition-to-value rule. */
export interface ThemeAdaptationRule {
  when: ThemeAdaptationCondition
  value: ThemeAdaptationValue
}

/**
 * Environment adaptations for `defineTheme({ adaptations })`.
 *
 * Rules are written in order after the root theme. When several match, the
 * later rule wins, the same way later CSS wins.
 */
export interface ThemeAdaptations {
  /** Overrides for the five width points. On its own this writes no CSS. */
  widthBreakpoints?: Partial<WidthBreakpoints>
  rules?: ThemeAdaptationRule[]
}

/** Validated adaptations kept on a theme, so a child theme can re-resolve them. */
export interface NormalizedThemeAdaptations {
  widthBreakpoints: WidthBreakpoints
  rules: ThemeAdaptationRule[]
}

/** The root theme's generator configs. Rules complete their partial values from these. */
export interface ThemeGenerativeAxes {
  typography?: TypographyConfig
  color?: ColorScaleConfig
  radius?: RadiusScaleConfig
  motion?: MotionScaleConfig
}

/** One rule lowered to concrete writes, ready to compile. */
export interface ResolvedThemeAdaptationRule {
  when: ThemeAdaptationCondition
  /** Media query text without the `@media` keyword. */
  query: string
  /** Prefixed token writes. */
  tokens: Record<string, string>
  /** Theme-local token writes, by exact name. */
  localTokens?: Record<string, string>
  components?: ComponentStyleMap
}
