import type { PlaygroundColorMode, PlaygroundLocale } from './protocol'
import baseCss from '../../../../packages/themes/neutral/base.css?raw'
import { parseCustomProperties, splitLightDark } from '../theme-tokens/parseTokens'

export interface ThemeColors {
  accent: string
  neutral: string
  card: string
  surface: string
  body: string
  muted: string
  textPrimary: string
}

export type ThemeColorKey = keyof ThemeColors

export interface ThemeState {
  colors: {
    light: ThemeColors
    dark: ThemeColors
  }
  dark: boolean
  headingFont: string
  bodyFont: string
  customHeadingFont: string
  customBodyFont: string
  typeScale: string
  typeSize: number
  radius: number
  spacing: number
  elementSize: number
  duration: number
}

export interface PlaygroundFont {
  id: string
  zh: string
  en: string
  stack: string
  google: string | null
}

export interface TypeScaleOption {
  id: string
  ratio: number
  zh: string
  en: string
}

export interface DensityPreset {
  id: 'compact' | 'default' | 'comfortable' | 'gigantic'
  zh: string
  en: string
  typeSize: number
  typeScale: string
  spacing: number
  elementSize: number
  radius: number
}

export interface ColorField {
  key: ThemeColorKey
  variable: string
  zh: string
  en: string
}

const FIGTREE_STACK = 'Figtree, -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif'
const SYSTEM_STACK = '-apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif'
const SERIF_STACK = 'Georgia, \'Times New Roman\', serif'

const COLOR_VARIABLES: Record<ThemeColorKey, string> = {
  accent: '--astryx-color-accent',
  neutral: '--astryx-color-neutral',
  card: '--astryx-color-background-card',
  surface: '--astryx-color-background-surface',
  body: '--astryx-color-background-body',
  muted: '--astryx-color-background-muted',
  textPrimary: '--astryx-color-text-primary',
}

/**
 * Neutral motion scale from packages/themes/neutral/base.css:
 * fast 125, medium 300, slow 700, adjacent ratio 0.75, rounded to 5ms.
 */
const MOTION_BASE = [
  ['fast', 125],
  ['medium', 300],
  ['slow', 700],
] as const

const MOTION_RATIO = 0.75

const TYPE_STEPS = [
  ['4xs', -5],
  ['3xs', -4],
  ['2xs', -3],
  ['xs', -2],
  ['sm', -1],
  ['base', 0],
  ['lg', 1],
  ['xl', 2],
  ['2xl', 3],
  ['3xl', 4],
  ['4xl', 5],
  ['5xl', 6],
] as const

const SPACING_STEPS = [0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

/**
 * Component tokens in neutral/*.css repeat the semantic colors as literals.
 * Point the visible ones at the semantic variables the editor actually changes.
 */
const COMPONENT_ALIASES: Array<[string, string]> = [
  ['--astryx-color-text-accent', 'var(--astryx-color-accent)'],
  ['--astryx-color-icon-accent', 'var(--astryx-color-accent)'],
  ['--astryx-color-icon-primary', 'var(--astryx-color-text-primary)'],
  ['--astryx-button-primary-background', 'var(--astryx-color-accent)'],
  ['--astryx-button-primary-foreground', 'var(--astryx-color-on-accent)'],
  ['--astryx-button-secondary-background', 'var(--astryx-color-neutral)'],
  ['--astryx-button-secondary-foreground', 'var(--astryx-color-text-primary)'],
  ['--astryx-button-ghost-foreground', 'var(--astryx-color-text-primary)'],
  ['--astryx-button-focus', 'var(--astryx-color-accent)'],
  ['--astryx-card-background', 'var(--astryx-color-background-card)'],
  ['--astryx-text-foreground', 'var(--astryx-color-text-primary)'],
  ['--astryx-heading-foreground', 'var(--astryx-color-text-primary)'],
  ['--astryx-link-primary-foreground', 'var(--astryx-color-text-primary)'],
  ['--astryx-icon-primary-foreground', 'var(--astryx-color-text-primary)'],
  ['--astryx-input-background', 'var(--astryx-color-background-surface)'],
  ['--astryx-input-focus', 'var(--astryx-color-accent)'],
  ['--astryx-input-height-sm', 'var(--astryx-size-element-sm)'],
  ['--astryx-input-height-md', 'var(--astryx-size-element-md)'],
  ['--astryx-input-height-lg', 'var(--astryx-size-element-lg)'],
  ['--astryx-checkbox-accent', 'var(--astryx-color-accent)'],
  ['--astryx-checkbox-on-accent', 'var(--astryx-color-on-accent)'],
  ['--astryx-checkbox-focus', 'var(--astryx-color-accent)'],
  ['--astryx-checkbox-background', 'var(--astryx-color-background-surface)'],
]

export const COLOR_FIELDS: ColorField[] = [
  { key: 'accent', variable: COLOR_VARIABLES.accent, zh: '强调色', en: 'Accent' },
  { key: 'neutral', variable: COLOR_VARIABLES.neutral, zh: '中性色', en: 'Neutral' },
  { key: 'card', variable: COLOR_VARIABLES.card, zh: '卡片', en: 'Card' },
  { key: 'surface', variable: COLOR_VARIABLES.surface, zh: '表面', en: 'Surface' },
  { key: 'body', variable: COLOR_VARIABLES.body, zh: '页面底色', en: 'Body' },
  { key: 'muted', variable: COLOR_VARIABLES.muted, zh: '弱化底色', en: 'Muted' },
  { key: 'textPrimary', variable: COLOR_VARIABLES.textPrimary, zh: '主要文字', en: 'Text primary' },
]

export const TYPE_SCALES: TypeScaleOption[] = [
  { id: 'minor-second', ratio: 1.067, zh: '小二度', en: 'Minor second' },
  { id: 'major-second', ratio: 1.125, zh: '大二度', en: 'Major second' },
  { id: 'minor-third', ratio: 1.2, zh: '小三度', en: 'Minor third' },
  { id: 'major-third', ratio: 1.25, zh: '大三度', en: 'Major third' },
  { id: 'perfect-fourth', ratio: 1.333, zh: '纯四度', en: 'Perfect fourth' },
  { id: 'augmented-fourth', ratio: 1.414, zh: '增四度', en: 'Augmented fourth' },
  { id: 'perfect-fifth', ratio: 1.5, zh: '纯五度', en: 'Perfect fifth' },
  { id: 'golden', ratio: 1.618, zh: '黄金比例', en: 'Golden ratio' },
]

/**
 * Same numbers as upstream UNIFIED_PRESETS. `radius` here is the value stored
 * on ThemeState (the element radius our scale expands from), not upstream's
 * inner-radius base.
 */
export const DENSITY_PRESETS: DensityPreset[] = [
  { id: 'compact', zh: '紧凑', en: 'Compact', typeSize: 12, typeScale: 'major-second', spacing: 2, elementSize: 28, radius: 2 },
  { id: 'default', zh: '默认', en: 'Default', typeSize: 14, typeScale: 'minor-third', spacing: 4, elementSize: 32, radius: 4 },
  { id: 'comfortable', zh: '宽松', en: 'Comfortable', typeSize: 16, typeScale: 'major-third', spacing: 6, elementSize: 40, radius: 6 },
  { id: 'gigantic', zh: '超大', en: 'Gigantic', typeSize: 18, typeScale: 'augmented-fourth', spacing: 8, elementSize: 48, radius: 8 },
]

export const PLAYGROUND_FONTS: PlaygroundFont[] = [
  { id: 'figtree', zh: 'Figtree', en: 'Figtree', stack: FIGTREE_STACK, google: null },
  { id: 'system', zh: '系统字体', en: 'System', stack: SYSTEM_STACK, google: null },
  { id: 'inter', zh: 'Inter', en: 'Inter', stack: `Inter, ${SYSTEM_STACK}`, google: 'Inter' },
  { id: 'roboto', zh: 'Roboto', en: 'Roboto', stack: `Roboto, ${SYSTEM_STACK}`, google: 'Roboto' },
  { id: 'dm-sans', zh: 'DM Sans', en: 'DM Sans', stack: `'DM Sans', ${SYSTEM_STACK}`, google: 'DM+Sans' },
  { id: 'poppins', zh: 'Poppins', en: 'Poppins', stack: `Poppins, ${SYSTEM_STACK}`, google: 'Poppins' },
  { id: 'ibm-plex-sans', zh: 'IBM Plex Sans', en: 'IBM Plex Sans', stack: `'IBM Plex Sans', ${SYSTEM_STACK}`, google: 'IBM+Plex+Sans' },
  { id: 'source-sans', zh: 'Source Sans 3', en: 'Source Sans 3', stack: `'Source Sans 3', ${SYSTEM_STACK}`, google: 'Source+Sans+3' },
  { id: 'noto-sans', zh: 'Noto Sans', en: 'Noto Sans', stack: `'Noto Sans', ${SYSTEM_STACK}`, google: 'Noto+Sans' },
  { id: 'georgia', zh: 'Georgia', en: 'Georgia', stack: SERIF_STACK, google: null },
  { id: 'custom', zh: '自定义', en: 'Custom', stack: '', google: null },
]

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

/** Upstream `getTokenLabel`, with this package's `--astryx-` prefix removed. */
export function colorTokenLabel(variable: string): string {
  return variable
    .replace(/^--astryx-/, '')
    .replace(/-/g, ' ')
    .replace(/\bbackground /gi, '')
    .replace(/\b\w/g, char => char.toUpperCase())
}

/** `#ffffff  10%`, matching upstream ColorSwatch's readout (two spaces). */
export function formatColorReadout(value: string): string {
  const normalized = normalizeHex(value)
  if (!normalized)
    return value
  const hex = normalized.slice(0, 7)
  const alpha = normalized.length === 9
    ? Math.round(Number.parseInt(normalized.slice(7), 16) / 255 * 100)
    : 100
  return `${hex}  ${alpha}%`
}

/** Inverse of formatColorReadout. Returns null when the text is not a color. */
export function parseColorReadout(raw: string): string | null {
  const parts = raw.trim().split(/\s+/)
  const head = parts[0] ?? ''
  const pct = parts.find(part => part.endsWith('%'))
  const alpha = pct
    ? Math.min(100, Math.max(0, Number(pct.slice(0, -1)))) / 100
    : 1
  const normalized = normalizeHex(head)
  if (!normalized || !Number.isFinite(alpha))
    return null
  if (alpha >= 1)
    return normalized.slice(0, 7)
  const byte = Math.round(alpha * 255).toString(16).padStart(2, '0')
  return `${normalized.slice(0, 7)}${byte}`
}

export function activeColors(theme: ThemeState): ThemeColors {
  return theme.dark ? theme.colors.dark : theme.colors.light
}

export function setThemeColor(theme: ThemeState, key: ThemeColorKey, value: string): void {
  const next = normalizeHex(value)
  if (!next)
    return
  activeColors(theme)[key] = next
}

export function colorInputValue(value: string): string {
  const normalized = normalizeHex(value)
  if (!normalized)
    return '#000000'
  return normalized.slice(0, 7)
}

export function applyColorPicker(current: string, picked: string): string {
  const next = normalizeHex(picked)
  const previous = normalizeHex(current)
  if (!next)
    return previous ?? '#000000'
  if (previous && previous.length === 9)
    return `${next}${previous.slice(7)}`
  return next
}

export function contrastingInk(color: string): string {
  const channels = hexChannels(color)
  if (!channels)
    return '#ffffff'
  const [red, green, blue] = channels.map(channelToLinear)
  const luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue
  return luminance > 0.45 ? '#171717' : '#ffffff'
}

export function fontStylesheetHref(theme: ThemeState): string | null {
  const families = new Set<string>()
  for (const id of [theme.headingFont, theme.bodyFont]) {
    const font = PLAYGROUND_FONTS.find(item => item.id === id)
    if (font?.google)
      families.add(font.google)
  }
  if (families.size === 0)
    return null
  const query = [...families].map(family => `family=${family}:wght@400;500;600;700`).join('&')
  return `https://fonts.googleapis.com/css2?${query}&display=swap`
}

export function themeVariables(theme: ThemeState): Record<string, string> {
  const variables: Record<string, string> = {}
  const light = theme.colors.light
  const dark = theme.colors.dark
  for (const field of COLOR_FIELDS) {
    variables[field.variable] = lightDark(light[field.key], dark[field.key])
  }
  variables['--astryx-color-on-accent'] = lightDark(contrastingInk(light.accent), contrastingInk(dark.accent))

  const ratio = typeScaleRatio(theme.typeScale)
  for (const [name, step] of TYPE_STEPS) {
    variables[`--astryx-font-size-${name}`] = `${geometricPx(theme.typeSize, ratio, step)}px`
  }

  for (const step of SPACING_STEPS) {
    const name = String(step).replace('.', '-')
    const value = theme.spacing * step
    variables[`--astryx-spacing-${name}`] = value === 0 ? '0' : `${value}px`
  }

  const element = clamp(theme.elementSize, 24, 48)
  variables['--astryx-size-element-sm'] = `${Math.max(20, element - 4)}px`
  variables['--astryx-size-element-md'] = `${element}px`
  variables['--astryx-size-element-lg'] = `${element + 4}px`

  const radius = clamp(theme.radius, 0, 28)
  const inner = Math.max(0, Math.round(radius * 6 / 10))
  const container = Math.round(radius * 12 / 10)
  const page = Math.round(radius * 28 / 10)
  variables['--astryx-radius-none'] = '0'
  variables['--astryx-radius-inner'] = `${inner}px`
  variables['--astryx-radius-element'] = `${radius}px`
  variables['--astryx-radius-container'] = `${container}px`
  variables['--astryx-radius-page'] = `${page}px`
  variables['--astryx-radius-chat'] = `${page}px`

  const multiplier = clamp(theme.duration, 0.5, 2)
  for (const [name, base] of MOTION_BASE) {
    const value = base * multiplier
    variables[`--astryx-duration-${name}`] = `${roundToFive(value)}ms`
    variables[`--astryx-duration-${name}-min`] = `${roundToFive(value * MOTION_RATIO)}ms`
    variables[`--astryx-duration-${name}-max`] = `${roundToFive(value / MOTION_RATIO)}ms`
  }

  variables['--astryx-font-family-heading'] = fontStack(theme.headingFont, theme.customHeadingFont)
  variables['--astryx-font-family-body'] = fontStack(theme.bodyFont, theme.customBodyFont)

  for (const [name, value] of COMPONENT_ALIASES)
    variables[name] = value

  return variables
}

export function previewCss(theme: ThemeState): string {
  const mode: PlaygroundColorMode = theme.dark ? 'dark' : 'light'
  return `html[data-playground-frame]{color-scheme:${mode} !important;${declarationBlock(theme)}}`
}

export function exportThemeCss(theme: ThemeState): string {
  const lines = Object.entries(themeVariables(theme)).map(([name, value]) => `    ${name}: ${value};`)
  return `/* Playground theme. Load this after @astryx-vue/themes/neutral.css. */\n@layer astryx.overrides {\n  :root {\n${lines.join('\n')}\n  }\n}\n`
}

export function exportThemeJson(theme: ThemeState): string {
  return `${JSON.stringify({
    name: themesEqual(theme, createNeutralTheme()) ? 'neutral' : 'custom',
    colorMode: theme.dark ? 'dark' : 'light',
    variables: themeVariables(theme),
  }, null, 2)}\n`
}

export function typeScaleRatio(id: string): number {
  return TYPE_SCALES.find(item => item.id === id)?.ratio ?? 1.2
}

export function describeType(theme: ThemeState, locale: PlaygroundLocale): string {
  const ratio = typeScaleRatio(theme.typeScale).toFixed(3)
  return locale === 'zh'
    ? `基准 ${clamp(theme.typeSize, 12, 22)}px，比例 ${ratio}`
    : `base ${clamp(theme.typeSize, 12, 22)}px, ratio ${ratio}`
}

export function describeRadius(theme: ThemeState, locale: PlaygroundLocale): string {
  const radius = clamp(theme.radius, 0, 28)
  const inner = Math.max(0, Math.round(radius * 6 / 10))
  const container = Math.round(radius * 12 / 10)
  const page = Math.round(radius * 28 / 10)
  return locale === 'zh'
    ? `内 ${inner}px，控件 ${radius}px，容器 ${container}px，页面 ${page}px`
    : `inner ${inner}px, element ${radius}px, container ${container}px, page ${page}px`
}

export function describeSpacing(theme: ThemeState, locale: PlaygroundLocale): string {
  const unit = clamp(theme.spacing, 2, 8)
  return locale === 'zh' ? `1 步 = ${unit}px` : `step 1 = ${unit}px`
}

export function describeElementSize(theme: ThemeState): string {
  const element = clamp(theme.elementSize, 24, 48)
  return `sm ${Math.max(20, element - 4)}px, md ${element}px, lg ${element + 4}px`
}

export function describeDuration(theme: ThemeState): string {
  const multiplier = clamp(theme.duration, 0.5, 2)
  const medium = roundToFive(300 * multiplier)
  const label = Number.isInteger(multiplier) ? String(multiplier) : multiplier.toFixed(1)
  return `${label}× (medium = ${medium}ms)`
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
  return {
    colors: {
      light: { ...theme.colors.light },
      dark: { ...theme.colors.dark },
    },
    headingFont: theme.headingFont,
    bodyFont: theme.bodyFont,
    customHeadingFont: theme.customHeadingFont,
    customBodyFont: theme.customBodyFont,
    typeScale: theme.typeScale,
    typeSize: theme.typeSize,
    radius: theme.radius,
    spacing: theme.spacing,
    elementSize: theme.elementSize,
    duration: theme.duration,
  }
}

function declarationBlock(theme: ThemeState): string {
  return Object.entries(themeVariables(theme)).map(([name, value]) => `${name}:${value};`).join('')
}

function lightDark(light: string, dark: string): string {
  return `light-dark(${light}, ${dark})`
}

function geometricPx(base: number, ratio: number, step: number): number {
  return Math.max(1, Math.round(base * ratio ** step))
}

function roundToFive(value: number): number {
  return Math.round(value / 5) * 5
}

function fontStack(id: string, custom: string): string {
  if (id === 'custom')
    return sanitizeFontStack(custom) || FIGTREE_STACK
  return PLAYGROUND_FONTS.find(font => font.id === id)?.stack || FIGTREE_STACK
}

function sanitizeFontStack(value: string): string {
  return value.replace(/[^\w\s,'"()-]/g, '').trim()
}

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value))
    return min
  return Math.min(max, Math.max(min, value))
}

function normalizeHex(value: string): string | null {
  const trimmed = value.trim().toLowerCase()
  const match = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/.exec(trimmed)
  if (!match?.[1])
    return null
  const hex = match[1]
  if (hex.length === 3 || hex.length === 4)
    return `#${[...hex].map(channel => channel + channel).join('')}`
  return `#${hex}`
}

function hexChannels(value: string): [number, number, number] | null {
  const normalized = normalizeHex(value)
  if (!normalized)
    return null
  return [
    Number.parseInt(normalized.slice(1, 3), 16),
    Number.parseInt(normalized.slice(3, 5), 16),
    Number.parseInt(normalized.slice(5, 7), 16),
  ]
}

function channelToLinear(channel: number): number {
  const value = channel / 255
  return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
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
