/** Advanced 面板的数据：token 分类、每类列哪些 token，以及行内预览要用的换算。 */
import { NEUTRAL_TOKENS } from './themeDefaults'

export type TokenGroupKey = 'colors' | 'spacing' | 'radius' | 'typography' | 'size' | 'shadow' | 'duration' | 'easing'

export const TOKEN_GROUPS: Array<{ key: TokenGroupKey, label: string, icon: string }> = [
  { key: 'colors', label: 'Colors', icon: 'i-carbon-color-palette' },
  { key: 'spacing', label: 'Spacing', icon: 'i-carbon-grid' },
  { key: 'radius', label: 'Radius', icon: 'i-carbon-copy' },
  { key: 'typography', label: 'Typography', icon: 'i-carbon-text-font' },
  { key: 'size', label: 'Size', icon: 'i-carbon-fit-to-screen' },
  { key: 'shadow', label: 'Elevation', icon: 'i-carbon-shadow' },
  { key: 'duration', label: 'Duration', icon: 'i-carbon-timer' },
  { key: 'easing', label: 'Easing', icon: 'i-carbon-lightning' },
]

export interface TokenSection {
  title: string
  tokens: string[]
}

/** 原版的写法是不带前缀的名字；这里补上 `--astryx-`，并去掉 base.css 里没有的。 */
function prefixed(names: readonly string[]): string[] {
  return names.map(name => `--astryx-${name.slice(2)}`).filter(name => name in NEUTRAL_TOKENS)
}

const COLOR_SECTIONS: Array<[string, string[]]> = [
  ['Core Semantic', ['--color-accent', '--color-accent-muted', '--color-on-accent', '--color-neutral', '--color-overlay', '--color-overlay-hover', '--color-overlay-pressed']],
  ['Text', ['--color-text-primary', '--color-text-secondary', '--color-text-disabled', '--color-text-accent', '--color-on-dark', '--color-on-light']],
  ['Icon', ['--color-icon-primary', '--color-icon-secondary', '--color-icon-disabled']],
  ['Surface Variants', ['--color-background-surface', '--color-background-body', '--color-background-muted', '--color-background-card', '--color-background-popover', '--color-background-inverted', '--color-background-error-inverted']],
  ['Category Colors', ['blue', 'cyan', 'gray', 'green', 'orange', 'pink', 'purple', 'red', 'teal', 'yellow'].map(hue => `--color-background-${hue}`)],
  ['Status/Sentiment', ['--color-success', '--color-success-muted', '--color-error', '--color-error-muted', '--color-warning', '--color-warning-muted']],
  ['Divider', ['--color-border', '--color-border-emphasized']],
  ['Effects', ['--color-skeleton', '--color-shadow', '--color-tint-hover']],
]

function textStyle(name: string, leading = true): string[] {
  return ['size', 'weight', ...(leading ? ['leading'] : [])].map(part => `--text-${name}-${part}`)
}

const TYPOGRAPHY_SECTIONS: Array<[string, string[]]> = [
  ['Font Families', ['--font-family-body', '--font-family-heading', '--font-family-code']],
  ['Heading 1', textStyle('heading-1')],
  ['Heading 2', textStyle('heading-2')],
  ['Heading 3', textStyle('heading-3')],
  ['Body Text', textStyle('body')],
  ['Label Text', textStyle('label')],
  ['Supporting Text', textStyle('supporting')],
]

function sectionsOf(list: Array<[string, string[]]>): TokenSection[] {
  return list.map(([title, names]) => ({ title, tokens: [...new Set(prefixed(names))] })).filter(item => item.tokens.length > 0)
}

function byPrefix(prefix: string): string[] {
  return Object.keys(NEUTRAL_TOKENS).filter(name => name.startsWith(prefix))
}

/** 某个分类下的小节。只有颜色和字体分小节，其余各一节且没有标题。 */
export function groupSections(group: TokenGroupKey): TokenSection[] {
  if (group === 'colors')
    return sectionsOf(COLOR_SECTIONS)
  if (group === 'typography')
    return sectionsOf(TYPOGRAPHY_SECTIONS)
  const prefixes: Record<string, string[]> = {
    spacing: ['--astryx-spacing-'],
    radius: ['--astryx-radius-'],
    size: ['--astryx-size-'],
    shadow: ['--astryx-shadow-'],
    duration: ['--astryx-duration-'],
    easing: ['--astryx-ease-'],
  }
  const tokens = (prefixes[group] ?? []).flatMap(byPrefix)
  return [{ title: '', tokens }]
}

/** 和原版 `getTokenLabel` 一样：去掉前缀，连字符变空格，首字母大写。 */
export function tokenLabel(name: string): string {
  return name
    .replace(/^--astryx-/, '')
    .replace(/-/g, ' ')
    .replace(/\bbackground /gi, '')
    .replace(/\b\w/g, char => char.toUpperCase())
}

/** 间距值换成 px：`0.5rem` 按 16px 根字号算成 8，`12px` 原样。其他写法给 NaN。 */
export function spacingToPx(value: string | undefined): number {
  const match = /^(\d+(?:\.\d+)?|\.\d+)(px|rem)$/.exec((value ?? '').trim())
  if (!match?.[1])
    return Number.NaN
  const length = Number.parseFloat(match[1])
  return match[2] === 'rem' ? length * 16 : length
}

export type TokenEditorKind = 'color' | 'spacing' | 'radius' | 'type' | 'plain'

/** 一行用哪种预览：颜色分类的色块，间距和尺寸的条，圆角的方块，字体的 Aa，其余只有输入框。 */
export function editorKind(group: TokenGroupKey): TokenEditorKind {
  if (group === 'colors')
    return 'color'
  if (group === 'spacing' || group === 'size')
    return 'spacing'
  if (group === 'radius')
    return 'radius'
  return group === 'typography' ? 'type' : 'plain'
}

/** 字体行的预览样式：只改和这一行有关的那一项。 */
export function typePreviewStyle(name: string, value: string): Record<string, string> {
  const isFont = name.includes('font-family')
  const isSize = name.includes('text-') && name.endsWith('size')
  const isWeight = name.includes('weight')
  return {
    fontSize: isSize ? value : '14px',
    fontWeight: isWeight ? value : '400',
    fontFamily: isFont ? value : 'inherit',
  }
}
