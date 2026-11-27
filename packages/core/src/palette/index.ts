/**
 * `@astryx-vue/core/palette`：`themePalette()`、色阶生成器和它们的类型。
 * 它是单独的入口，不用调色板的应用不会带上生成器的代码。
 */
export {
  COMPACT_11_STOPS,
  DEFAULT_21_STOPS,
  generateTonalPalette,
  PALETTE_BLACK,
  PALETTE_RECIPE,
  PALETTE_RECIPE_V2,
  PALETTE_RECIPES,
  PALETTE_WHITE,
} from './generator'
export { themePalette } from './themePalette'
export type {
  PaletteLift,
  ThemePalette,
  ThemePaletteInput,
  TonalPaletteAnchor,
  TonalPaletteCandidate,
  TonalPaletteCoordinationDiagnostics,
  TonalPaletteDarkChromaTaper,
  TonalPaletteFamilyInput,
  TonalPaletteGenerationInput,
  TonalPaletteNormalizedRequest,
  TonalPaletteRampDiagnostics,
} from './types'
