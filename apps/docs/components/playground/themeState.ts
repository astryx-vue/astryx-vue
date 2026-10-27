/**
 * 主题状态的生命周期：从 neutral/base.css 建默认主题、整体替换、比较、套用密度预设，
 * 以及把分享链接里不可信的数据清洗成合法主题。
 */
import type { DensityPreset, ThemeColorKey, ThemeColors, ThemeState } from './themeTypes'
import baseCss from '../../../../packages/themes/neutral/base.css?raw'
import { parseCustomProperties, splitLightDark } from '../theme-tokens/parseTokens'
import { normalizeHex } from './themeColor'
import { COLOR_FIELDS, COLOR_VARIABLES, DENSITY_PRESETS, PLAYGROUND_FONTS, TYPE_SCALES } from './themeOptions'
import { sanitizeComponentTokens, sanitizeCustomOverrides, sanitizeTokens } from './themeOverrides'
import { clamp } from './themeScale'

const NEUTRAL_COLORS = readNeutralColors()

export function createNeutralTheme(): ThemeState {
  return {
    colors: {
      light: { ...NEUTRAL_COLORS.light },
      dark: { ...NEUTRAL_COLORS.dark },
    },
    dark: false,
    headingFont: 'figtree',
    bodyFont: 'figtree',
    customHeadingFont: '',
    customBodyFont: '',
    typeScale: 'minor-third',
    typeSize: 14,
    radius: 10,
    spacing: 4,
    elementSize: 32,
    duration: 1,
    tokens: {},
    componentTokens: {},
    customOverrides: [],
  }
}

/** 深拷贝一份主题，分享链接和重置都用它，避免响应式对象被共用。 */
export function cloneTheme(theme: ThemeState): ThemeState {
  return {
    ...theme,
    colors: { light: { ...theme.colors.light }, dark: { ...theme.colors.dark } },
    tokens: { ...theme.tokens },
    componentTokens: { ...theme.componentTokens },
    customOverrides: theme.customOverrides.map(item => ({ ...item })),
  }
}

export function applyTheme(target: ThemeState, next: ThemeState): void {
  target.colors.light = { ...next.colors.light }
  target.colors.dark = { ...next.colors.dark }
  target.dark = next.dark
  target.headingFont = next.headingFont
  target.bodyFont = next.bodyFont
  target.customHeadingFont = next.customHeadingFont
  target.customBodyFont = next.customBodyFont
  target.typeScale = next.typeScale
  target.typeSize = next.typeSize
  target.radius = next.radius
  target.spacing = next.spacing
  target.elementSize = next.elementSize
  target.duration = next.duration
  target.tokens = { ...next.tokens }
  target.componentTokens = { ...next.componentTokens }
  target.customOverrides = next.customOverrides.map(item => ({ ...item }))
}

export function themesEqual(left: ThemeState, right: ThemeState): boolean {
  return JSON.stringify(themeSnapshot(left)) === JSON.stringify(themeSnapshot(right))
}

export function applyDensity(theme: ThemeState, id: DensityPreset['id']): void {
  const preset = DENSITY_PRESETS.find(item => item.id === id)
  if (!preset)
    return
  theme.typeSize = preset.typeSize
  theme.typeScale = preset.typeScale
  theme.spacing = preset.spacing
  theme.elementSize = preset.elementSize
  theme.radius = preset.radius
}

export function matchingDensity(theme: ThemeState): DensityPreset['id'] | null {
  const match = DENSITY_PRESETS.find(preset =>
    preset.typeSize === theme.typeSize
    && preset.typeScale === theme.typeScale
    && preset.spacing === theme.spacing
    && preset.elementSize === theme.elementSize
    && preset.radius === theme.radius,
  )
  return match?.id ?? null
}

export function sanitizeTheme(value: unknown): ThemeState | null {
  if (!isRecord(value))
    return null
  const next = createNeutralTheme()
  const colors = isRecord(value.colors) ? value.colors : {}
  mergeColors(next.colors.light, colors.light)
  mergeColors(next.colors.dark, colors.dark)
  if (typeof value.dark === 'boolean')
    next.dark = value.dark
  if (typeof value.headingFont === 'string' && PLAYGROUND_FONTS.some(font => font.id === value.headingFont))
    next.headingFont = value.headingFont
  if (typeof value.bodyFont === 'string' && PLAYGROUND_FONTS.some(font => font.id === value.bodyFont))
    next.bodyFont = value.bodyFont
  if (typeof value.customHeadingFont === 'string')
    next.customHeadingFont = value.customHeadingFont.slice(0, 120)
  if (typeof value.customBodyFont === 'string')
    next.customBodyFont = value.customBodyFont.slice(0, 120)
  if (typeof value.typeScale === 'string' && TYPE_SCALES.some(scale => scale.id === value.typeScale))
    next.typeScale = value.typeScale
  next.typeSize = readNumber(value.typeSize, next.typeSize, 12, 22)
  next.radius = readNumber(value.radius, next.radius, 0, 28)
  next.spacing = readNumber(value.spacing, next.spacing, 2, 8)
  next.elementSize = readNumber(value.elementSize, next.elementSize, 24, 48)
  next.duration = readNumber(value.duration, next.duration, 0.5, 2)
  next.tokens = sanitizeTokens(value.tokens)
  next.componentTokens = sanitizeComponentTokens(value.componentTokens)
  next.customOverrides = sanitizeCustomOverrides(value.customOverrides)
  return next
}

function readNeutralColors(): { light: ThemeColors, dark: ThemeColors } {
  const byName = new Map(parseCustomProperties(baseCss).map(item => [item.name, item.value]))
  const light = {} as ThemeColors
  const dark = {} as ThemeColors
  for (const [key, name] of Object.entries(COLOR_VARIABLES) as Array<[ThemeColorKey, string]>) {
    const stops = splitLightDark(byName.get(name) ?? '')
    if (!stops)
      throw new Error(`Playground could not read ${name} from neutral/base.css`)
    light[key] = stops.light
    dark[key] = stops.dark
  }
  return { light, dark }
}

/**
 * Palette snapshot. Preview light/dark is not part of the palette: the toolbar
 * owns it separately from the token values, same as upstream `mode`.
 */
function themeSnapshot(theme: ThemeState): Omit<ThemeState, 'dark'> {
  const { dark: _dark, ...palette } = cloneTheme(theme)
  return palette
}

function mergeColors(target: ThemeColors, value: unknown): void {
  if (!isRecord(value))
    return
  for (const field of COLOR_FIELDS) {
    const next = value[field.key]
    if (typeof next !== 'string')
      continue
    const normalized = normalizeHex(next)
    if (normalized)
      target[field.key] = normalized
  }
}

function readNumber(value: unknown, fallback: number, min: number, max: number): number {
  return typeof value === 'number' ? clamp(value, min, max) : fallback
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object'
}
