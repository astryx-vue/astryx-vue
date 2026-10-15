import type { SyntaxThemeDefinition } from '../Code/syntaxTheme.js'
import type { SemanticIconMap } from '../Icon/semantic.js'
import type { IndicatorRegistry } from '../Indicator/types.js'

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

/** Token overrides for one inverted surface. */
export interface ThemeSurfaceInput {
  tokens?: ThemeTokens
}

export interface DefineThemeInput {
  /** Theme name. Used as `data-astryx-theme`. */
  name: string
  /** Semantic token overrides for this theme. */
  tokens?: ThemeTokens
  /** Another theme to start from. This theme's own values win. */
  extends?: ThemeDefinition
  /** Syntax colors for code in this subtree, unless a SyntaxTheme is closer. */
  syntax?: SyntaxThemeDefinition
  /** Extra tokens for content on a dark surface. */
  onDark?: ThemeSurfaceInput
  /** Extra tokens for content on a light surface. */
  onLight?: ThemeSurfaceInput
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
  /** Token values already written as CSS. */
  tokens: Readonly<Record<string, string>>
  /** Extra tokens applied by MediaTheme when the surface is dark. */
  onDark: Readonly<Record<string, string>>
  /** Extra tokens applied by MediaTheme when the surface is light. */
  onLight: Readonly<Record<string, string>>
  syntax?: SyntaxThemeDefinition
  /** Semantic icon overrides. Absent when this theme does not set any. */
  icons?: SemanticIconMap
  /** Indicator overrides. Absent when this theme does not set any. */
  indicators?: IndicatorRegistry
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
