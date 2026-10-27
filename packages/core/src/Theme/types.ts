import type { SyntaxThemeDefinition } from '../Code/syntaxTheme.js'
import type { SemanticIconMap } from '../Icon/semantic.js'
import type { IndicatorRegistry } from '../Indicator/types.js'
import type { NormalizedThemeAdaptations, ResolvedThemeAdaptationRule, ThemeAdaptations, ThemeGenerativeAxes } from './adaptationTypes.js'
import type { ColorScaleConfig } from './expandColorScale.js'
import type { MotionScaleConfig } from './expandMotionScale.js'
import type { RadiusScaleConfig } from './expandRadiusScale.js'
import type { TypeScaleConfig } from './expandTypeScale.js'

/** Color mode for a theme subtree. `system` follows the page and the OS. */
export type ThemeMode = 'light' | 'dark' | 'system'

/**
 * A token value.
 *
 * A string is used as written. A two-item tuple is the light stop, then the
 * dark stop, and becomes `light-dark()`.
 */
export type ThemeTokenValue = string | readonly [string, string]

/** CSS custom properties for a theme. Keys may omit the `--astryx-` prefix. */
export type ThemeTokens = Record<string, ThemeTokenValue>

/** Overrides for one inverted surface. Same shape as the theme's own. */
export interface ThemeSurfaceInput {
  tokens?: ThemeTokens
  /** Component styles for content on this surface. */
  components?: ComponentStyleMap
}

/**
 * CSS declarations for one component state.
 *
 * A key that starts with `:` is a pseudo-class, for example `:hover`.
 * `:hover` is the enabled control: disabled and `aria-disabled` elements skip it.
 */
export type StyleOverrides = Record<string, string | Record<string, string>>

/**
 * Per-component style overrides.
 *
 * Keys are theme targets named `<component-kebab>-<part>`, such as `button`,
 * `card-header`, or `radio-indicator`. Under each target, `base` matches the
 * target itself, `variant:secondary` matches `[data-variant="secondary"]`, a
 * bare state such as `checked` matches `[data-checked="checked"]`, and
 * `variant:destructive+size:sm` matches both at once.
 */
export type ComponentStyleMap = Record<string, Record<string, StyleOverrides>>

/** One font role. Heading inherits body family and fallbacks when it omits them. */
export interface TypographyRole {
  /** Primary family name. A name with spaces is quoted. */
  family?: string
  /** Fallback stack, already written as CSS. */
  fallbacks?: string
  /** Default weight name (`semibold`) or a CSS font-weight value. */
  weight?: string
  /** Heading levels 1–6. Ignored on body and code. */
  weights?: Partial<Record<1 | 2 | 3 | 4 | 5 | 6, string>>
}

/**
 * Fonts and the type scale.
 *
 * Loading the family is the caller's job. This only writes the tokens.
 */
export interface TypographyConfig {
  scale?: TypeScaleConfig
  body?: TypographyRole
  /** Family and fallbacks fall back to `body` when omitted. */
  heading?: TypographyRole
  code?: TypographyRole
}

export interface DefineThemeInput {
  /** Theme name. Used as `data-astryx-theme`. */
  name: string
  /** Semantic token overrides. These win over generated values, token by token. */
  tokens?: ThemeTokens
  /**
   * Values only this theme family uses, keyed by their exact custom-property
   * name, such as `--brand-ink`. No prefix is added or required.
   *
   * A shared token name (`--color-accent`) is refused here, so the two maps
   * never hold the same name. A theme that extends this one inherits these
   * and may replace their values. A reference cycle between them is an error.
   */
  localTokens?: Record<string, ThemeTokenValue>
  /**
   * Accent palette. Neutrals, surfaces, text, icons, and borders come from the
   * seed. Explicit `tokens` still win.
   */
  color?: ColorScaleConfig
  /** Fonts and a type scale from `base` and `ratio`. */
  typography?: TypographyConfig
  /** Radius steps from a base pixel size and a multiplier. */
  radius?: RadiusScaleConfig
  /** Duration steps from fast, medium, slow, and a ratio. */
  motion?: MotionScaleConfig
  /**
   * Component style overrides, scoped to this theme name.
   * `Theme` injects the compiled sheet. `css` on the result is that sheet.
   */
  components?: ComponentStyleMap
  /** Another theme to start from. This theme's own values win. */
  extends?: ThemeDefinition
  /** Syntax colors for code in this subtree, unless a SyntaxTheme is closer. */
  syntax?: SyntaxThemeDefinition
  /** Extra tokens and component styles for content on a dark surface. */
  onDark?: ThemeSurfaceInput
  /** Extra tokens and component styles for content on a light surface. */
  onLight?: ThemeSurfaceInput
  /**
   * Values that apply only in some environments: a width range, a coarse
   * pointer, a contrast or reduced-motion preference.
   *
   * Width points are named `sm`, `md`, `lg`, `xl`, `2xl` and default to 640,
   * 768, 1024, 1280, 1536 CSS px. Fields inside one `when` must all match.
   * Rules apply in order after the root theme; a later match wins.
   *
   * @example
   * ```ts
   * adaptations: {
   *   rules: [{
   *     when: { pointer: 'coarse', width: { below: 'lg' } },
   *     value: { typography: { scale: { base: 16, ratio: 1.1736 } } },
   *   }],
   * }
   * ```
   */
  adaptations?: ThemeAdaptations
  /**
   * Semantic icon name to Iconify id.
   *
   * Entries replace the built-in map by name and merge with the theme this
   * one extends. A name that is not listed keeps the built-in id.
   */
  icons?: SemanticIconMap
  /**
   * Indicator graphics, replaced by name.
   *
   * One entry reaches every control that draws that indicator. Entries merge
   * with the theme this one extends.
   */
  indicators?: IndicatorRegistry
}

export interface ThemeDefinition {
  name: string
  /** Token values already written as CSS, with the `--astryx-` prefix. */
  tokens: Readonly<Record<string, string>>
  /** Theme-local values by exact name. Absent when the theme family declares none. */
  localTokens?: Readonly<Record<string, string>>
  /** Extra tokens applied by MediaTheme when the surface is dark. */
  onDark: Readonly<Record<string, string>>
  /** Extra tokens applied by MediaTheme when the surface is light. */
  onLight: Readonly<Record<string, string>>
  /** Component styles on a dark MediaTheme surface. */
  onDarkComponents?: ComponentStyleMap
  /** Component styles on a light MediaTheme surface. */
  onLightComponents?: ComponentStyleMap
  syntax?: SyntaxThemeDefinition
  /** Semantic icon overrides. Absent when this theme does not set any. */
  icons?: SemanticIconMap
  /** Indicator overrides. Absent when this theme does not set any. */
  indicators?: IndicatorRegistry
  /**
   * Merged component style map. Present when this theme or its base sets one.
   * A child theme starts from this map.
   */
  components?: ComponentStyleMap
  /**
   * Compiled rules, scoped to `[data-astryx-theme="<name>"]` and placed in
   * the `astryx.overrides` layer: the body font, component styles,
   * adaptations, then media-surface styles, in that cascade order.
   */
  css?: string
  /** Validated adaptations, kept so a child theme can re-resolve them. */
  adaptations?: NormalizedThemeAdaptations
  /** Adaptation rules lowered to concrete writes. */
  adaptationRules?: readonly ResolvedThemeAdaptationRule[]
  /** The generator configs adaptation rules complete themselves from. */
  axes?: ThemeGenerativeAxes
  /** Which theme in the lineage declared each local token. */
  localTokenOwners?: Readonly<Record<string, string>>
  readonly __astryxTheme: true
}

export interface ThemeProps {
  /** Theme from `defineTheme()`. */
  theme: ThemeDefinition
  /**
   * Color mode for this subtree.
   * @default 'system'
   */
  mode?: ThemeMode
}

/** Surface luminance, `auto` to measure it, or `off` to leave the page theme. */
export type MediaThemeMode = 'dark' | 'light' | 'auto' | 'off'

export interface MediaThemeProps {
  /**
   * Which surface the children sit on.
   * `auto` measures the parent. `off` keeps the surrounding theme.
   */
  mode: MediaThemeMode
  /**
   * Side used by `auto` before the surface can be measured, and when it cannot.
   * @default 'dark'
   */
  fallback?: 'dark' | 'light'
}

export type {
  ColorScaleConfig,
  MotionScaleConfig,
  RadiusScaleConfig,
  TypeScaleConfig,
}
