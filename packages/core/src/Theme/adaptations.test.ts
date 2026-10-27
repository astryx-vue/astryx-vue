import type { ThemeAdaptationRule } from './adaptationTypes.js'
import { describe, expect, it } from 'vitest'
import { DEFAULT_WIDTH_BREAKPOINTS, WIDTH_BREAKPOINT_NAMES } from './adaptationTypes.js'
import { defineTheme } from './defineTheme.js'

function themeWith(rules: ThemeAdaptationRule[], extra: Parameters<typeof defineTheme>[0] = { name: 'adaptive' }) {
  return defineTheme({ ...extra, adaptations: { rules } })
}

function mediaPreludes(css: string | undefined): string[] {
  return [...(css ?? '').matchAll(/@media ([^{]+) \{/g)].map(match => match[1] ?? '')
}

describe('width breakpoints', () => {
  it('use the fixed names and upstream defaults', () => {
    expect(WIDTH_BREAKPOINT_NAMES).toEqual(['sm', 'md', 'lg', 'xl', '2xl'])
    expect(DEFAULT_WIDTH_BREAKPOINTS).toEqual({ 'sm': 640, 'md': 768, 'lg': 1024, 'xl': 1280, '2xl': 1536 })
  })

  it('accept overrides without writing CSS on their own', () => {
    const theme = defineTheme({ name: 'points', adaptations: { widthBreakpoints: { lg: 960 } } })
    expect(theme.adaptations?.widthBreakpoints.lg).toBe(960)
    expect(theme.css).toBeUndefined()
  })

  it('must strictly increase', () => {
    expect(() => defineTheme({ name: 'bad', adaptations: { widthBreakpoints: { md: 2000 } } })).toThrow(/strictly increasing/)
  })
})

describe('conditions', () => {
  it('lower inclusive from and exclusive below edges', () => {
    const theme = themeWith([
      { when: { width: { below: 'sm' } }, value: { tokens: { '--spacing-4': '12px' } } },
      { when: { width: { from: 'lg', below: 'xl' } }, value: { tokens: { '--spacing-4': '20px' } } },
      { when: { width: { from: '2xl' } }, value: { tokens: { '--spacing-4': '24px' } } },
    ])
    expect(mediaPreludes(theme.css)).toEqual([
      '(width < 640px)',
      '(width >= 1024px) and (width < 1280px)',
      '(width >= 1536px)',
    ])
  })

  it('aND width, pointer, contrast, and motion in a fixed order', () => {
    const theme = themeWith([{
      when: { motion: 'reduce', contrast: 'more', pointer: 'coarse', width: { below: 'lg' } },
      value: { tokens: { '--duration-fast': '0ms' } },
    }])
    expect(mediaPreludes(theme.css)).toEqual([
      '(width < 1024px) and (pointer: coarse) and (prefers-contrast: more) and (prefers-reduced-motion: reduce)',
    ])
  })

  it('reject an empty condition, an unknown field, and a bad value', () => {
    expect(() => themeWith([{ when: {}, value: {} }])).toThrow(/at least one condition/)
    expect(() => themeWith([{ when: { hover: 'none' } as never, value: {} }])).toThrow(/hover is not supported/)
    expect(() => themeWith([{ when: { pointer: 'any' } as never, value: {} }])).toThrow(/pointer must be/)
    expect(() => themeWith([{ when: { width: { from: 'xl', below: 'lg' } }, value: {} }])).toThrow(/from < below/)
  })
})

describe('rule writes', () => {
  it('keep declaration order, so a later matching rule wins', () => {
    const theme = themeWith([
      { when: { pointer: 'coarse' }, value: { tokens: { '--spacing-4': '12px' } } },
      { when: { pointer: 'coarse' }, value: { tokens: { '--spacing-4': '16px' } } },
    ], { name: 'ordered', tokens: { '--spacing-4': '16px' } })
    const css = theme.css ?? ''
    const blocks = css.split('@media (pointer: coarse)')
    expect(blocks).toHaveLength(3)
    expect(blocks[1]).toContain('--astryx-spacing-4: 12px;')
    expect(blocks[2]).toContain('--astryx-spacing-4: 16px;')
  })

  it('win over the root token by source order, not by !important', () => {
    const theme = themeWith([{ when: { pointer: 'coarse' }, value: { tokens: { '--color-accent': 'red' } } }], {
      name: 'pinned',
      tokens: { '--color-accent': 'blue' },
    })
    expect(theme.tokens['--astryx-color-accent']).toBe('blue')
    expect(theme.adaptationRules?.[0]?.tokens['--astryx-color-accent']).toBe('red')
    const css = theme.css ?? ''
    expect(css).toContain(':scope.astryx-theme {\n  --astryx-color-accent: blue;')
    expect(css).toContain(':scope.astryx-theme {\n  --astryx-color-accent: red;')
    expect(css).toContain('--astryx-button-primary-background: red;')
    expect(css.indexOf('--astryx-color-accent: blue;')).toBeLessThan(css.indexOf('--astryx-color-accent: red;'))
    expect(css).not.toContain('!important')
  })

  it('complete a partial type scale from the root theme', () => {
    const theme = themeWith([{ when: { pointer: 'coarse', width: { below: 'lg' } }, value: { typography: { scale: { base: 16 } } } }], {
      name: 'partial',
      typography: { scale: { base: 14, ratio: 1.2 } },
    })
    expect(theme.adaptationRules?.[0]?.tokens['--astryx-font-size-base']).toBe('1rem')
    expect(() => themeWith([{ when: { pointer: 'coarse' }, value: { typography: { scale: { base: 16 } } } }])).toThrow(/ratio is missing/)
  })

  it('pin the type scale on touch and narrow screens the way upstream Neutral does', () => {
    const theme = themeWith([{ when: { pointer: 'coarse', width: { below: 'lg' } }, value: { typography: { scale: { base: 16, ratio: 1.1736 } } } }], {
      name: 'pinned-type',
      typography: { scale: { base: 14, ratio: 1.2 } },
    })
    const rule = theme.adaptationRules?.[0]
    expect(rule?.query).toBe('(width < 1024px) and (pointer: coarse)')
    expect(rule?.tokens['--astryx-font-size-base']).toBe('1rem')
    expect(rule?.tokens['--astryx-font-size-lg']).toBe('1.1875rem')
    expect(rule?.tokens['--astryx-font-size-5xl']).toBe('2.625rem')
    expect(theme.tokens['--astryx-font-size-base']).toBe('0.875rem')
    expect(theme.tokens['--astryx-font-size-5xl']).toBe('2.625rem')
  })

  it('keep the root component pins when a rule only rescales the type', () => {
    const theme = themeWith([{ when: { pointer: 'coarse' }, value: { typography: { scale: { base: 16, ratio: 1.2 } } } }], {
      name: 'pins',
      typography: { scale: { base: 14, ratio: 1.2 } },
      components: { heading: { 'level:2': { fontFamily: 'serif' } } },
    })
    expect(theme.adaptationRules?.[0]?.components).toBeUndefined()
  })

  it('put an explicit Heading weight back above the adapted defaults', () => {
    const theme = themeWith([{ when: { pointer: 'coarse' }, value: { components: { heading: { 'level:2': { fontWeight: '300' } } } } }])
    const css = theme.css ?? ''
    const ruleAt = css.indexOf('font-weight: 300')
    const guardAt = css.lastIndexOf('.astryx-heading[data-weight="bold"]')
    expect(ruleAt).toBeGreaterThan(-1)
    expect(guardAt).toBeGreaterThan(ruleAt)
  })

  it('reject a reference cycle that only overlapping rules form', () => {
    expect(() => themeWith([
      { when: { pointer: 'coarse' }, value: { tokens: { '--color-accent': 'var(--color-border)' } } },
      { when: { width: { below: 'lg' } }, value: { tokens: { '--color-border': 'var(--color-accent)' } } },
    ])).toThrow(/overlapping rules \[0, 1\]/)
  })

  it('allow writes that can never match together', () => {
    expect(() => themeWith([
      { when: { pointer: 'coarse' }, value: { tokens: { '--color-accent': 'var(--color-border)' } } },
      { when: { pointer: 'fine' }, value: { tokens: { '--color-border': 'var(--color-accent)' } } },
    ])).not.toThrow()
  })
})

describe('extends', () => {
  it('inherits breakpoints and appends the child rules after the base rules', () => {
    const base = defineTheme({
      name: 'a-base',
      adaptations: {
        widthBreakpoints: { lg: 960 },
        rules: [{ when: { pointer: 'coarse' }, value: { tokens: { '--spacing-4': '12px' } } }],
      },
    })
    const child = defineTheme({
      name: 'a-child',
      extends: base,
      adaptations: { rules: [{ when: { width: { below: 'lg' } }, value: { tokens: { '--spacing-4': '14px' } } }] },
    })
    expect(child.adaptations?.widthBreakpoints.lg).toBe(960)
    expect(mediaPreludes(child.css)).toEqual(['(pointer: coarse)', '(width < 960px)'])
  })

  it('re-resolves an inherited rule against the child root scale', () => {
    const base = themeWith([{ when: { pointer: 'coarse' }, value: { typography: { scale: { base: 16 } } } }], {
      name: 'r-base',
      typography: { scale: { base: 14, ratio: 1.2 } },
    })
    const child = defineTheme({ name: 'r-child', extends: base, typography: { scale: { base: 14, ratio: 1.5 } } })
    const baseLarge = base.adaptationRules?.[0]?.tokens['--astryx-font-size-lg']
    const childLarge = child.adaptationRules?.[0]?.tokens['--astryx-font-size-lg']
    expect(childLarge).not.toBe(baseLarge)
  })
})
