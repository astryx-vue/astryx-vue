/** 主题编辑器里可选的固定选项：颜色字段、字号比例、密度预设和字体。 */
import type { ColorField, DensityPreset, PlaygroundFont, ThemeColorKey, TypeScaleOption } from './themeTypes'

export const FIGTREE_STACK = 'Figtree, -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif'
const SYSTEM_STACK = '-apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif'
const SERIF_STACK = 'Georgia, \'Times New Roman\', serif'

/** 编辑器能改的每个颜色字段，对应 neutral/base.css 里的哪个 CSS 变量。 */
export const COLOR_VARIABLES: Record<ThemeColorKey, string> = {
  accent: '--astryx-color-accent',
  neutral: '--astryx-color-neutral',
  card: '--astryx-color-background-card',
  surface: '--astryx-color-background-surface',
  body: '--astryx-color-background-body',
  muted: '--astryx-color-background-muted',
  textPrimary: '--astryx-color-text-primary',
}

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
