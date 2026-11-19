import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  dynamicTypeScale,
  dynamicTypeScaleProperty,
  dynamicTypeScaleRule,
  FONT_SIZE_STEP_STYLES,
  readerTextSizeEntries,
  readerTextSizeTokens,
  scaledFontSizeEntries,
  textSizeCategoryForBodySize,
  textSizeDefaults,
} from './dynamicType.js'
import { syncReaderTextSize } from './textSizeSync.js'
import { typography } from './uikitTypography.js'

describe('dynamic type', () => {
  it('names the category from the Body size and is 1 at Large', () => {
    for (const [index, px] of typography.body.entries())
      expect(textSizeCategoryForBodySize(px)).toBe(['xs', 's', 'm', 'l', 'xl', 'xxl', 'xxxl', 'ax1', 'ax2', 'ax3', 'ax4', 'ax5'][index])
    expect(textSizeCategoryForBodySize(13)).toBeNull()
    expect(dynamicTypeScale('body', 'l')).toBe(1)
    expect(dynamicTypeScaleRule('l')).toBe('')
    expect(dynamicTypeScaleRule(null)).toBe('')
  })

  it('writes each fixed step as its scaled size capped at the next step', () => {
    const entries = Object.fromEntries(scaledFontSizeEntries({ '--font-size-sm': '0.6875rem', '--font-size-base': '0.875rem', '--font-size-lg': '1.125rem' }))
    expect(entries['--_scaled-font-size-sm']).toBe(
      'min(calc(0.6875rem * var(--_dynamic-type-footnote, 1)), var(--_scaled-font-size-base))',
    )
    expect(entries['--font-size-sm']).toBe('var(--_scaled-font-size-sm)')
    expect(entries['--_scaled-font-size-base']).toContain('var(--_dynamic-type-body, 1)')
  })

  it('leaves a step that reads a variable alone and scales a fixed semantic size', () => {
    const out = Object.fromEntries(readerTextSizeEntries([
      ['--font-size-base', 'var(--x)'],
      ['--text-supporting-size', '0.75rem'],
      ['--text-body-size', 'var(--font-size-base)'],
    ]))
    expect(out['--font-size-base']).toBe('var(--x)')
    expect(out['--text-supporting-size']).toBe('calc(0.75rem * var(--_dynamic-type-footnote, 1))')
    expect(out['--text-body-size']).toBe('var(--font-size-base)')
  })

  it('keeps the --astryx- prefix on compiled token records', () => {
    const out = readerTextSizeTokens({ '--astryx-font-size-base': '1rem', '--astryx-color-accent': 'red' })
    expect(out['--astryx-font-size-base']).toBe('var(--_scaled-font-size-base)')
    expect(out['--_scaled-font-size-base']).toContain('calc(1rem * var(--_dynamic-type-body, 1))')
    expect(out['--astryx-color-accent']).toBe('red')
  })

  it('has a curve for every step and the default steps', () => {
    for (const name of Object.keys(textSizeDefaults))
      expect(FONT_SIZE_STEP_STYLES).toHaveProperty(name)
    expect(dynamicTypeScaleProperty('largeTitle')).toBe('--_dynamic-type-large-title')
  })

  it('adopts a stylesheet where the engine knows the keyword and releases it', () => {
    const adopted: unknown[] = []
    const doc = {
      defaultView: { CSSStyleSheet: class { replaceSync(): void {} }, CSS: { supports: () => false } },
      adoptedStyleSheets: adopted,
      querySelector: () => null,
    } as unknown as Document
    const stop = syncReaderTextSize(doc)
    expect(doc.adoptedStyleSheets).toHaveLength(1)
    stop?.()
    expect(doc.adoptedStyleSheets).toHaveLength(0)
  })
})

describe('theme stylesheets follow the reader text size', () => {
  const themes = join(__dirname, '../../../themes')
  const names = readdirSync(themes, { withFileTypes: true }).filter(d => d.isDirectory() && d.name !== 'node_modules').map(d => d.name)

  it.each(names)('%s writes its font-size steps through the scaled form', (name) => {
    const css = readFileSync(join(themes, name, 'base.css'), 'utf8')
    const steps = [...css.matchAll(/^\s*--astryx-(font-size-\w+): (\S[^;]*);$/gm)]
    expect(steps.length).toBeGreaterThan(0)
    for (const [, step, value] of steps)
      expect(value, step).toBe(`var(--_scaled-${step})`)
    // The scaled value is the step's own size times its curve, capped at the next step.
    for (const [, step, own, style] of css.matchAll(/--_scaled-(font-size-\w+):\s*(?:min\()?calc\(([\d.]+rem) \* var\(--_dynamic-type-([\w-]+), 1\)\)/g))
      expect(FONT_SIZE_STEP_STYLES[`--${step}` as keyof typeof FONT_SIZE_STEP_STYLES].replace(/[A-Z]/g, m => `-${m.toLowerCase()}`), `${step} ${own}`).toBe(style)
  })
})
