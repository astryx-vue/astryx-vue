/**
 * 把主题状态变成可用的输出：完整的 CSS 变量表、注入预览 iframe 的样式、
 * 导出给用户的 CSS 和 JSON，以及需要加载的 Google Fonts 样式表地址。
 */
import type { PlaygroundColorMode } from './protocol'
import type { ThemeState } from './themeTypes'
import { contrastingInk } from './themeColor'
import { COLOR_FIELDS, FIGTREE_STACK, PLAYGROUND_FONTS } from './themeOptions'
import { scaleVariables } from './themeScale'
import { createNeutralTheme, themesEqual } from './themeState'

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

/** 主题对应的全部 CSS 变量，顺序固定：颜色、阶梯、字体族、组件别名。 */
export function themeVariables(theme: ThemeState): Record<string, string> {
  const variables: Record<string, string> = {}
  const light = theme.colors.light
  const dark = theme.colors.dark
  for (const field of COLOR_FIELDS) {
    variables[field.variable] = lightDark(light[field.key], dark[field.key])
  }
  variables['--astryx-color-on-accent'] = lightDark(contrastingInk(light.accent), contrastingInk(dark.accent))

  Object.assign(variables, scaleVariables(theme))

  variables['--astryx-font-family-heading'] = fontStack(theme.headingFont, theme.customHeadingFont)
  variables['--astryx-font-family-body'] = fontStack(theme.bodyFont, theme.customBodyFont)

  for (const [name, value] of COMPONENT_ALIASES)
    variables[name] = value

  return variables
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

function declarationBlock(theme: ThemeState): string {
  return Object.entries(themeVariables(theme)).map(([name, value]) => `${name}:${value};`).join('')
}

function lightDark(light: string, dark: string): string {
  return `light-dark(${light}, ${dark})`
}

function fontStack(id: string, custom: string): string {
  if (id === 'custom')
    return sanitizeFontStack(custom) || FIGTREE_STACK
  return PLAYGROUND_FONTS.find(font => font.id === id)?.stack || FIGTREE_STACK
}

function sanitizeFontStack(value: string): string {
  return value.replace(/[^\w\s,'"()-]/g, '').trim()
}
