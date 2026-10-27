export { DEFAULT_WIDTH_BREAKPOINTS, WIDTH_BREAKPOINT_NAMES } from './adaptationTypes.js'
export type {
  ThemeAdaptationCondition,
  ThemeAdaptationRule,
  ThemeAdaptations,
  ThemeAdaptationTypographyConfig,
  ThemeAdaptationValue,
  ThemeAdaptationWidthCondition,
  WidthBreakpointName,
  WidthBreakpoints,
} from './adaptationTypes.js'
export { DATA_TOKEN_DEFAULTS } from './dataTokens.js'
export type { DataTokenName } from './dataTokens.js'
export { defineTheme, isDefinedTheme, neutralTheme, normalizeTokenName } from './defineTheme.js'
export { expandColorScale } from './expandColorScale.js'
export { expandMotionScale } from './expandMotionScale.js'
export { expandRadiusScale } from './expandRadiusScale.js'
export { expandTypeScale } from './expandTypeScale.js'
export { default as MediaTheme } from './MediaTheme.vue'
export { default as Theme } from './Theme.vue'
export type {
  ColorScaleConfig,
  ComponentStyleMap,
  DefineThemeInput,
  MediaThemeMode,
  MediaThemeProps,
  MotionScaleConfig,
  RadiusScaleConfig,
  StyleOverrides,
  ThemeDefinition,
  ThemeMode,
  ThemeProps,
  ThemeSurfaceInput,
  ThemeTokens,
  ThemeTokenValue,
  TypeScaleConfig,
  TypographyConfig,
  TypographyRole,
} from './types.js'
export type { UseMediaThemeReturn } from './useMediaTheme.js'
export { useMediaTheme } from './useMediaTheme.js'
export type { UseThemeReturn } from './useTheme.js'
export { useTheme } from './useTheme.js'
