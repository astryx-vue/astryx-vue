/**
 * Semantic token coverage for packages/themes/neutral/base.css.
 *
 * Every custom property in upstream theme/tokens.stylex.ts is required here,
 * prefixed with --astryx-. The following upstream material is intentionally
 * absent because it is not part of that token file:
 * - Syntax colors from domainTokens / defineSyntaxTheme. Component syntax
 *   colors stay in neutral/code.css.
 * - neutralTheme.components overrides (button, badge, banner, switch,
 *   progressbar, card, section) and the generated heading-weight overrides.
 *   Those belong to the later theme migration.
 * - neutralIconRegistry. It is not a CSS variable.
 * - The BottomSheet exit curve cubic-bezier(0.3, 0, 0.6, 0.6). Upstream
 *   hardcodes it on the component; easeDefaults only defines --ease-standard.
 *
 * --astryx-font-weight-regular is a Vue alias of --font-weight-normal.
 * Components already reference that name.
 *
 * Chart colors come from upstream theme/dataTokens.stylex.ts, not
 * tokens.stylex.ts. Every theme declares the same stops. The other themes
 * do not recolor them.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { parseCustomProperties, sectionId } from '../../apps/docs/components/theme-tokens/parseTokens'

const root = process.cwd()
const baseCss = readFileSync(join(root, 'packages/themes/neutral/base.css'), 'utf8')
const motionCss = readFileSync(join(root, 'packages/core/styles/motion.css'), 'utf8')
const aggregateCss = readFileSync(join(root, 'packages/core/styles.css'), 'utf8')

const upstreamTokens = [
  '--color-accent',
  '--color-accent-muted',
  '--color-on-accent',
  '--color-neutral',
  '--color-background-surface',
  '--color-background-body',
  '--color-overlay',
  '--color-overlay-hover',
  '--color-overlay-pressed',
  '--color-background-muted',
  '--color-text-primary',
  '--color-text-secondary',
  '--color-text-disabled',
  '--color-text-accent',
  '--color-on-dark',
  '--color-on-light',
  '--color-icon-accent',
  '--color-icon-primary',
  '--color-icon-secondary',
  '--color-icon-disabled',
  '--color-background-card',
  '--color-background-popover',
  '--color-background-inverted',
  '--color-background-error-inverted',
  '--color-success',
  '--color-success-muted',
  '--color-on-success',
  '--color-error',
  '--color-error-muted',
  '--color-on-error',
  '--color-warning',
  '--color-warning-muted',
  '--color-on-warning',
  '--color-border',
  '--color-border-emphasized',
  '--color-skeleton',
  '--color-track',
  '--color-shadow',
  '--color-tint-hover',
  '--color-background-blue',
  '--color-border-blue',
  '--color-icon-blue',
  '--color-text-blue',
  '--color-background-cyan',
  '--color-border-cyan',
  '--color-icon-cyan',
  '--color-text-cyan',
  '--color-background-gray',
  '--color-border-gray',
  '--color-icon-gray',
  '--color-text-gray',
  '--color-background-green',
  '--color-border-green',
  '--color-icon-green',
  '--color-text-green',
  '--color-background-orange',
  '--color-border-orange',
  '--color-icon-orange',
  '--color-text-orange',
  '--color-background-pink',
  '--color-border-pink',
  '--color-icon-pink',
  '--color-text-pink',
  '--color-background-purple',
  '--color-border-purple',
  '--color-icon-purple',
  '--color-text-purple',
  '--color-background-red',
  '--color-border-red',
  '--color-icon-red',
  '--color-text-red',
  '--color-background-teal',
  '--color-border-teal',
  '--color-icon-teal',
  '--color-text-teal',
  '--color-background-yellow',
  '--color-border-yellow',
  '--color-icon-yellow',
  '--color-text-yellow',
  '--spacing-0',
  '--spacing-0-5',
  '--spacing-1',
  '--spacing-1-5',
  '--spacing-2',
  '--spacing-3',
  '--spacing-4',
  '--spacing-5',
  '--spacing-6',
  '--spacing-7',
  '--spacing-8',
  '--spacing-9',
  '--spacing-10',
  '--spacing-11',
  '--spacing-12',
  '--size-element-sm',
  '--size-element-md',
  '--size-element-lg',
  '--border-width',
  '--focus-outline-width',
  '--focus-outline-style',
  '--focus-outline-color',
  '--focus-outline-offset',
  '--radius-none',
  '--radius-inner',
  '--radius-element',
  '--radius-container',
  '--radius-page',
  '--radius-chat',
  '--radius-full',
  '--shadow-low',
  '--shadow-med',
  '--shadow-high',
  '--shadow-inset-hover',
  '--shadow-inset-selected',
  '--shadow-inset-success',
  '--shadow-inset-warning',
  '--shadow-inset-error',
  '--duration-fast-min',
  '--duration-fast',
  '--duration-fast-max',
  '--duration-medium-min',
  '--duration-medium',
  '--duration-medium-max',
  '--duration-slow-min',
  '--duration-slow',
  '--duration-slow-max',
  '--ease-standard',
  '--font-family-body',
  '--font-family-code',
  '--font-family-heading',
  '--font-size-4xs',
  '--font-size-3xs',
  '--font-size-2xs',
  '--font-size-xs',
  '--font-size-sm',
  '--font-size-base',
  '--font-size-lg',
  '--font-size-xl',
  '--font-size-2xl',
  '--font-size-3xl',
  '--font-size-4xl',
  '--font-size-5xl',
  '--font-weight-normal',
  '--font-weight-medium',
  '--font-weight-semibold',
  '--font-weight-bold',
  '--text-heading-1-size',
  '--text-heading-1-weight',
  '--text-heading-1-leading',
  '--text-heading-2-size',
  '--text-heading-2-weight',
  '--text-heading-2-leading',
  '--text-heading-3-size',
  '--text-heading-3-weight',
  '--text-heading-3-leading',
  '--text-heading-4-size',
  '--text-heading-4-weight',
  '--text-heading-4-leading',
  '--text-heading-5-size',
  '--text-heading-5-weight',
  '--text-heading-5-leading',
  '--text-heading-6-size',
  '--text-heading-6-weight',
  '--text-heading-6-leading',
  '--text-body-size',
  '--text-body-weight',
  '--text-body-leading',
  '--text-large-size',
  '--text-large-weight',
  '--text-large-leading',
  '--text-label-size',
  '--text-label-weight',
  '--text-label-leading',
  '--text-code-size',
  '--text-code-weight',
  '--text-code-leading',
  '--text-supporting-size',
  '--text-supporting-weight',
  '--text-supporting-leading',
  '--text-display-1-size',
  '--text-display-1-weight',
  '--text-display-1-leading',
  '--text-display-2-size',
  '--text-display-2-weight',
  '--text-display-2-leading',
  '--text-display-3-size',
  '--text-display-3-weight',
  '--text-display-3-leading',
]

const dataColorNames = [
  ...['blue', 'orange', 'purple', 'green', 'pink', 'cyan', 'red', 'teal', 'brown', 'indigo'].map(name => `--color-data-categorical-${name}`),
  '--color-data-neutral',
  ...['blue', 'shamrock', 'orange', 'pink', 'purple', 'red', 'teal', 'yellow', 'gray'].flatMap(hue =>
    [5, 4, 3, 2, 1].map(step => `--color-data-${hue}-${step}`),
  ),
]

const motionKeyframes = [
  'astryx-fade-in',
  'astryx-fade-out',
  'astryx-scale-in',
  'astryx-scale-out',
  'astryx-slide-in-above',
  'astryx-slide-out-above',
  'astryx-slide-in-below',
  'astryx-slide-out-below',
  'astryx-slide-in-start',
  'astryx-slide-out-start',
  'astryx-slide-in-end',
  'astryx-slide-out-end',
]

function vueName(token: string) {
  return `--astryx-${token.slice(2)}`
}

function walkCss(directory: string): string[] {
  const files: string[] = []
  for (const entry of readdirSync(directory)) {
    const path = join(directory, entry)
    if (statSync(path).isDirectory())
      files.push(...walkCss(path))
    else if (entry.endsWith('.css'))
      files.push(path)
  }
  return files
}

describe('neutral base.css semantic tokens', () => {
  const properties = parseCustomProperties(baseCss)
  const declared = new Map(properties.map(property => [property.name, property.value]))

  it('does not define the same variable twice', () => {
    const names = properties.map(property => property.name)
    const duplicates = names.filter((name, index) => names.indexOf(name) !== index)
    expect(duplicates).toEqual([])
  })

  it('maps every upstream token, the chart data colors, and the regular weight alias', () => {
    const expected = new Set([
      ...upstreamTokens.map(vueName),
      ...dataColorNames.map(vueName),
      '--astryx-font-weight-regular',
    ])
    expect(new Set(declared.keys())).toEqual(expected)
    expect(dataColorNames).toHaveLength(56)
    expect(declared.get('--astryx-color-data-categorical-blue')).toBe('light-dark(#0171E3, #0171E3)')
    expect(declared.get('--astryx-color-data-neutral')).toBe('light-dark(#8494A3, #8C939B)')
    expect(declared.get('--astryx-color-data-gray-5')).toBe('light-dark(#25363F, #333338)')
    expect(upstreamTokens.filter(token => token.startsWith('--color-'))).toHaveLength(79)
    expect(upstreamTokens.filter(token => token.startsWith('--duration-'))).toHaveLength(9)
    expect(upstreamTokens.filter(token => token.startsWith('--shadow-'))).toHaveLength(8)
  })

  it('gives every token a section on the theme reference page', () => {
    for (const property of properties)
      expect(sectionId(property.name), property.name).not.toBeNull()
  })

  it('keeps values that existing components already read', () => {
    expect(declared.get('--astryx-color-text-primary')).toBe('light-dark(#171717, #fafafa)')
    expect(declared.get('--astryx-color-text-secondary')).toBe('light-dark(#525252, #a3a3a3)')
    expect(declared.get('--astryx-color-border-emphasized')).toBe('light-dark(#d4d4d4, #525252)')
    expect(declared.get('--astryx-radius-none')).toBe('0')
    expect(declared.get('--astryx-radius-inner')).toBe('0.375rem')
    expect(declared.get('--astryx-radius-element')).toBe('0.625rem')
    expect(declared.get('--astryx-radius-container')).toBe('0.75rem')
    expect(declared.get('--astryx-radius-full')).toBe('9999px')
    expect(declared.get('--astryx-spacing-0')).toBe('0')
    expect(declared.get('--astryx-spacing-2')).toBe('8px')
    expect(declared.get('--astryx-font-family-body')).toBe('Figtree, -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif')
    expect(declared.get('--astryx-font-family-code')).toBe('\'JetBrains Mono\', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace')
    expect(declared.get('--astryx-font-weight-medium')).toBe('500')
    expect(declared.get('--astryx-font-weight-bold')).toBe('700')
    expect(declared.get('--astryx-font-weight-semibold')).toBe('600')
    expect(declared.get('--astryx-font-weight-regular')).toBe('var(--astryx-font-weight-normal)')
    expect(declared.get('--astryx-border-width')).toBe('1px')
    expect(declared.get('--astryx-ease-standard')).toBe('cubic-bezier(0.24, 1, 0.4, 1)')
    expect(declared.get('--astryx-duration-fast-max')).toBe('165ms')
    expect(declared.get('--astryx-duration-medium-max')).toBe('400ms')
    expect(declared.get('--astryx-duration-slow-min')).toBe('525ms')
    expect(declared.get('--astryx-size-element-md')).toBe('32px')
    expect(declared.get('--astryx-text-body-leading')).toBe('1.4286')
    expect(declared.get('--astryx-text-supporting-leading')).toBe('1.6667')
    expect(declared.get('--astryx-text-heading-2-size')).toBe('var(--astryx-font-size-xl)')
    expect(declared.get('--astryx-text-heading-2-weight')).toBe('var(--astryx-font-weight-semibold)')
    expect(declared.get('--astryx-text-heading-2-leading')).toBe('1.4')
    expect(declared.get('--astryx-text-body-size')).toBe('var(--astryx-font-size-base)')
    expect(declared.get('--astryx-font-size-base')).toBe('0.875rem')
  })

  it('uses the neutral motion scale for the rest of the duration ramp', () => {
    expect(declared.get('--astryx-duration-fast-min')).toBe('95ms')
    expect(declared.get('--astryx-duration-fast')).toBe('125ms')
    expect(declared.get('--astryx-duration-medium-min')).toBe('225ms')
    expect(declared.get('--astryx-duration-medium')).toBe('300ms')
    expect(declared.get('--astryx-duration-slow')).toBe('700ms')
    expect(declared.get('--astryx-duration-slow-max')).toBe('935ms')
  })

  it('resolves every duration and ease reference in package styles', () => {
    const referenced = new Set<string>()
    const pattern = /var\(\s*(--astryx-(?:duration|ease)-[a-z0-9-]+)/g
    for (const file of [...walkCss(join(root, 'packages/core')), ...walkCss(join(root, 'packages/themes'))]) {
      const css = readFileSync(file, 'utf8')
      for (const match of css.matchAll(pattern)) {
        const name = match[1]
        if (name)
          referenced.add(name)
      }
    }

    expect([...referenced].sort()).toEqual([
      '--astryx-duration-fast',
      '--astryx-duration-fast-max',
      '--astryx-duration-fast-min',
      '--astryx-duration-medium',
      '--astryx-duration-medium-max',
      '--astryx-duration-slow-max',
      '--astryx-duration-slow-min',
      '--astryx-ease-standard',
    ])

    for (const name of referenced)
      expect(declared.has(name), name).toBe(true)
  })
})

describe('shared faces in the neutral theme', () => {
  it('loads Figtree and JetBrains Mono through the theme entry', () => {
    const fonts = readFileSync(join(root, 'packages/themes/fonts.css'), 'utf8')
    const neutral = readFileSync(join(root, 'packages/themes/neutral.css'), 'utf8')
    for (const face of ['400', '400-italic', '500', '600', '600-italic', '700'])
      expect(fonts).toContain(`@import '@fontsource/figtree/${face}.css';`)
    for (const face of ['400', '400-italic', '500', '600', '700'])
      expect(fonts).toContain(`@import '@fontsource/jetbrains-mono/${face}.css';`)
    expect(neutral).toContain('@import \'./fonts.css\';')
    expect(neutral).not.toContain('@fontsource/figtree')
    expect(neutral).not.toContain('@fontsource/jetbrains-mono')
    expect(readFileSync(join(root, 'packages/themes/neutral/code.css'), 'utf8')).not.toContain('--astryx-font-family-code')
    expect(readFileSync(join(root, 'apps/docs/styles/global.css'), 'utf8')).not.toContain('@fontsource/figtree')
  })

  it('does not tell apps to load Figtree themselves', () => {
    const docs = [
      'apps/docs/docs/en/guide/getting-started.md',
      'apps/docs/docs/zh/guide/getting-started.md',
      'apps/docs/docs/en/themes/typography.md',
      'apps/docs/docs/zh/themes/typography.md',
    ]
    for (const file of docs) {
      const text = readFileSync(join(root, file), 'utf8')
      expect(text, file).not.toMatch(/does not load Figtree|load the face|自己引入/)
    }
  })
})

const firstPartyThemes = ['butter', 'chocolate', 'gothic', 'matcha', 'stone', 'y2k'] as const

describe('first-party themes', () => {
  const neutralNames = new Set(parseCustomProperties(baseCss).map(property => property.name))

  it('ships a stylesheet entry for every theme', () => {
    for (const name of firstPartyThemes) {
      const entry = readFileSync(join(root, `packages/themes/${name}.css`), 'utf8')
      expect(entry).toContain('@import \'./fonts.css\';')
      expect(entry).toContain(`@import './${name}/base.css';`)
      expect(entry).not.toContain('@fontsource/figtree')
      expect(entry).not.toContain('@fontsource/jetbrains-mono')
      expect(entry).not.toContain('neutral')
    }
  })

  it('declares the same semantic tokens as Neutral, scoped to the theme', () => {
    for (const name of firstPartyThemes) {
      const css = readFileSync(join(root, `packages/themes/${name}/base.css`), 'utf8')
      const properties = parseCustomProperties(css)
      const names = properties.map(property => property.name)
      expect(names.filter((token, index) => names.indexOf(token) !== index), name).toEqual([])
      expect(new Set(names), name).toEqual(neutralNames)
      expect(css).toContain(`[data-astryx-theme='${name}']`)
      expect(css).not.toContain(':root')
      expect(css).toContain('\'JetBrains Mono\', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace')
      for (const token of ['--astryx-duration-fast', '--astryx-ease-standard', '--astryx-font-weight-regular'])
        expect(new Set(names).has(token), `${name} ${token}`).toBe(true)
    }
  })

  it('keeps the upstream palette, type, and gothic dark-only behavior', () => {
    const read = (name: string) => readFileSync(join(root, `packages/themes/${name}/base.css`), 'utf8')
    expect(read('butter')).toContain('--astryx-color-accent: light-dark(#225BFF, #FDEE8C);')
    expect(read('butter')).toContain('--astryx-font-family-body: Outfit,')
    expect(readFileSync(join(root, 'packages/themes/butter/text.css'), 'utf8')).toContain('Sarina')
    expect(read('chocolate')).toContain('--astryx-font-family-body: \'Albert Sans\'')
    expect(read('chocolate')).toContain('--astryx-font-family-heading: Fraunces,')
    expect(read('gothic')).toContain('color-scheme: dark;')
    expect(read('gothic')).toContain('--astryx-color-accent: #E8F1F6;')
    expect(read('gothic')).not.toContain('--astryx-color-accent: light-dark(')
    expect(read('gothic')).toContain('--astryx-font-family-body: Fustat,')
    expect(readFileSync(join(root, 'packages/themes/gothic/text.css'), 'utf8')).toContain('Manufacturing Consent')
    expect(read('matcha')).toContain('\'DM Sans\'')
    expect(read('matcha')).toContain('Playwrite US Trad')
    expect(read('stone')).toContain('--astryx-font-family-body: Figtree,')
    expect(read('stone')).toContain('--astryx-font-family-heading: Montserrat,')
    expect(read('stone')).toContain('family=Montserrat')
    expect(read('stone')).not.toContain('family=Figtree')
    expect(read('y2k')).toContain('--astryx-font-family-body: Poppins,')
    expect(read('y2k')).toContain('--astryx-radius-full: 0px;')
    expect(readFileSync(join(root, 'packages/themes/y2k/text.css'), 'utf8')).toContain('Crimson Text')
  })
})

describe('shared motion stylesheet', () => {
  it('defines fade, scale, and four-direction enter and exit keyframes', () => {
    for (const name of motionKeyframes)
      expect(motionCss).toContain(`@keyframes ${name}`)
  })

  it('collapses motion when the user prefers reduced motion', () => {
    expect(motionCss).toContain('@media (prefers-reduced-motion: reduce)')
    expect(motionCss).toContain('--astryx-motion-offset: 0px')
    expect(motionCss).toContain('--astryx-motion-scale-from: 1')
    expect(motionCss).toContain('--astryx-motion-enter-opacity: 1')
    expect(motionCss).toContain('--astryx-motion-exit-opacity: 0')
    expect(motionCss).toContain('animation-duration: 0.01ms')
  })

  it('is imported by the core style aggregate', () => {
    expect(aggregateCss).toContain('@import \'./styles/motion.css\';')
  })
})
