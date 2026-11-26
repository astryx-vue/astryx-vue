/**
 * @file themeMotionLayers.test.ts
 * @input vitest, defineTheme, expandThemeMotion and expandMotionScale
 * @output Checks how motion layers stack: the pre-tempo copies and the tempo
 *   a layer writes, an explicit `--ease-standard` at `'standard'`, and a
 *   child that inherits its base's motion field by field
 * @position Testing; validates motionLayerTokens.ts and rootMotion.ts
 */

import { describe, expect, it } from 'vitest'
import { defineTheme } from './defineTheme.js'
import { expandMotionScale } from './expandMotionScale.js'
import { durationDefaults, easeDefaults } from './motionTokenDefaults.js'
import { CHARACTER_EASE, expandThemeMotion, resolveThemeMotion } from './themeMotion.js'

const FAST = 125
const MEDIUM = 300
const ms = (value: number): string => `${Math.round(value)}ms`

describe('a layer’s own durations reach the busy loops under an enclosing tempo', () => {
  it('a theme with a duration scale and no tempo writes the loops’ copies of its durations', () => {
    const theme = defineTheme({ name: 'ScaledNested', motion: { fast: 100, medium: 250, ratio: 0.75 } })
    for (const name of ['fast', 'medium-max'])
      expect(theme.tokens[`--_astryx-pre-tempo-duration-${name}`]).toBe(theme.tokens[`--astryx-duration-${name}`])
  })

  it('an explicit duration with no tempo writes its copy too', () => {
    const theme = defineTheme({ name: 'ExplicitNested', tokens: { '--duration-slow': '800ms' } })
    expect(theme.tokens['--_astryx-pre-tempo-duration-slow']).toBe('800ms')
  })

  it('an adaptation rule’s own durations write their copies', () => {
    const theme = defineTheme({
      name: 'AdaptiveDurations',
      adaptations: { rules: [{ when: { pointer: 'coarse' }, value: { tokens: { '--duration-medium': '300ms' } } }] },
    })
    expect(theme.css).toContain('--_astryx-pre-tempo-duration-medium: 300ms')
  })

  it('a theme whose durations come from a duration scale alone writes a tempo of 1', () => {
    const scaled = defineTheme({ name: 'ScaledPace', motion: { fast: 100, medium: 250, ratio: 0.75 } })
    expect(scaled.tokens['--_astryx-motion-tempo']).toBe('1')
    // A child keeps its base's tempo beside a scale of its own.
    const child = defineTheme({
      name: 'ScaledPaceChild',
      extends: defineTheme({ name: 'PacedBase', motion: { tempo: 1.5 } }),
      motion: { fast: 100, medium: 250, ratio: 0.75 },
    })
    expect(child.tokens['--_astryx-motion-tempo']).toBe('1.5')
    // A knob that writes no duration, and one explicit duration, leave the
    // enclosing tempo in place.
    for (const theme of [
      defineTheme({ name: 'CrispPace', motion: { character: 'crisp' } }),
      defineTheme({ name: 'ExplicitPace', tokens: { '--duration-slow': '800ms' } }),
    ]) {
      expect(theme.tokens['--_astryx-motion-tempo']).toBeUndefined()
    }
  })

  it('an adaptation rule whose durations come from a duration scale writes the tempo they play at', () => {
    const ruleTokens = (name: string, tempo?: number): Readonly<Record<string, string>> | undefined => defineTheme({
      name,
      ...(tempo == null ? {} : { motion: { tempo } }),
      adaptations: { rules: [{ when: { pointer: 'coarse' }, value: { motion: { fast: 100, medium: 250, ratio: 0.75 } } }] },
    }).adaptationRules?.[0]?.tokens
    expect(ruleTokens('AdaptiveScale')?.['--_astryx-motion-tempo']).toBe('1')
    // Over a theme with a tempo, the rule keeps the theme's tempo.
    expect(ruleTokens('AdaptiveScaleTempo', 1.5)?.['--_astryx-motion-tempo']).toBe('1.5')
  })

  it('writes the tempo beside the duration tokens, and nothing without one', () => {
    expect(expandThemeMotion({ tempo: 1.5 })['--_astryx-motion-tempo']).toBe('1.5')
    expect(expandThemeMotion({ character: 'crisp' })['--_astryx-motion-tempo']).toBeUndefined()
  })

  it.each([0.75, 1.5])('at tempo %s the pre-tempo durations stay declared while the tokens scale', (tempo) => {
    const tokens = expandThemeMotion({ tempo })
    expect(tokens['--_astryx-pre-tempo-duration-slow-min']).toBe('525ms')
    expect(tokens['--_astryx-pre-tempo-duration-medium-max']).toBe('400ms')
    expect(tokens['--duration-slow-min']).toBe(ms(525 * tempo))
  })

  it('a duration scale still times the loops, and an explicit token too', () => {
    const scale = { fast: 100, medium: 250, ratio: 0.75 }
    const tokens = expandThemeMotion({ ...scale, tempo: 1.5 })
    expect(tokens['--_astryx-pre-tempo-duration-medium-max']).toBe(expandMotionScale(scale)['--duration-medium-max'])
    const theme = defineTheme({ name: 'LoopTimed', motion: { tempo: 1.5 }, tokens: { '--duration-medium-max': '600ms' } })
    expect(theme.tokens['--_astryx-pre-tempo-duration-medium-max']).toBe('600ms')
  })

  it('names every property it writes beside the core tokens privately, with --_astryx-', () => {
    const core = new Set([...Object.keys(durationDefaults), ...Object.keys(easeDefaults)])
    const tokens = expandThemeMotion({ fast: 100, medium: 250, ratio: 0.75, tempo: 1.2, character: 'crisp' })
    const extra = Object.keys(tokens).filter(name => !core.has(name))
    expect(extra.length).toBeGreaterThan(0)
    for (const name of extra)
      expect(name).toMatch(/^--_astryx-/)
  })
})

describe('an explicit --ease-standard', () => {
  const curve = 'cubic-bezier(0.3, 0, 0.2, 1)'

  it('is what --ease-entrance and --ease-move equal at standard, in the tokens and resolveThemeMotion alike', () => {
    for (const motion of [undefined, { character: 'standard' as const }, { tempo: 1.2 }]) {
      const theme = defineTheme({ name: 'OwnStandard', motion, tokens: { '--ease-standard': curve } })
      expect(theme.tokens['--astryx-ease-entrance'], JSON.stringify(motion)).toBe(curve)
      expect(theme.tokens['--astryx-ease-move'], JSON.stringify(motion)).toBe(curve)
      expect(resolveThemeMotion(theme).easings['--ease-entrance']).toBe(curve)
    }
  })

  it('is what a child, and a rule, that set standard match', () => {
    const standard = { character: 'standard' as const }
    const base = defineTheme({ name: 'EaseBase', tokens: { '--ease-standard': curve } })
    const child = defineTheme({ name: 'EaseChild', extends: base, motion: standard })
    const ruled = defineTheme({
      name: 'EaseRule',
      tokens: { '--ease-standard': curve },
      adaptations: { rules: [{ when: { pointer: 'coarse' }, value: { motion: standard } }] },
    })
    for (const tokens of [child.tokens, ruled.adaptationRules?.[0]?.tokens]) {
      expect(tokens?.['--astryx-ease-entrance']).toBe(curve)
      expect(tokens?.['--astryx-ease-move']).toBe(curve)
    }
  })

  it('without motion of its own keeps an inherited character’s curves', () => {
    const other = 'cubic-bezier(0.4, 0, 0.6, 1)'
    const crisp = defineTheme({ name: 'Crisp', motion: { character: 'crisp' } })
    const child = defineTheme({ name: 'EaseChild', extends: crisp, tokens: { '--ease-standard': other } })
    expect(child.tokens['--astryx-ease-standard']).toBe(other)
    expect(child.tokens['--astryx-ease-entrance']).toBe(CHARACTER_EASE.crisp)
    expect(child.tokens['--astryx-ease-move']).toBe(CHARACTER_EASE.crisp)
    const adaptive = defineTheme({
      name: 'EaseRule',
      motion: { character: 'expressive' },
      adaptations: { rules: [{ when: { pointer: 'coarse' }, value: { tokens: { '--ease-standard': other } } }] },
    })
    const rule = adaptive.adaptationRules?.[0]
    expect(rule?.tokens['--astryx-ease-standard']).toBe(other)
    expect(rule?.tokens['--astryx-ease-entrance']).toBeUndefined()
    expect(rule?.tokens['--astryx-ease-move']).toBeUndefined()
  })
})

describe('an extending theme inherits motion field by field', () => {
  it('a child that sets no easing keeps its base’s --ease-standard, an explicit one included', () => {
    const base = defineTheme({
      name: 'EasingBase',
      motion: { fast: 150, medium: 300, ratio: 0.75, easing: 'ease-in' },
      tokens: { '--ease-standard': 'linear' },
    })
    expect(base.tokens['--astryx-ease-standard']).toBe('linear')
    const child = defineTheme({ name: 'EasingChild', extends: base, motion: { tempo: 1.2 } })
    expect(child.tokens['--astryx-ease-standard']).toBe('linear')
    const own = defineTheme({
      name: 'EasingOwn',
      extends: base,
      motion: { fast: 150, medium: 300, ratio: 0.75, easing: 'ease-out' },
    })
    expect(own.tokens['--astryx-ease-standard']).toBe('ease-out')
  })

  it('a grandchild that adds only a knob keeps the slow band its parent inherited', () => {
    const base = defineTheme({ name: 'SlowBase', motion: { fast: 100, medium: 250, slow: 700, ratio: 0.75 } })
    // The child's own ratio regenerates its fast and medium bands only.
    const child = defineTheme({
      name: 'RatioChild',
      extends: base,
      motion: { fast: 100, medium: 250, ratio: 0.8 },
      tokens: { '--radius-element': '6px' },
    })
    expect(child.tokens['--astryx-duration-slow-min']).toBe('525ms')
    for (const knob of [{ character: 'expressive' as const }, { tempo: 1.2 }]) {
      const grandchild = defineTheme({ name: 'KnobGrandchild', extends: child, motion: knob })
      for (const band of ['slow-min', 'slow', 'slow-max'])
        expect(grandchild.tokens[`--astryx-duration-${band}`]).toBe(child.tokens[`--astryx-duration-${band}`])
    }
  })

  it('a base duration scale keeps winning over a child’s tempo', () => {
    const base = defineTheme({ name: 'ScaledBase', motion: { fast: 100, medium: 250, slow: 800, ratio: 0.75 } })
    const child = defineTheme({ name: 'ScaledChild', extends: base, motion: { tempo: 1.2 } })
    for (const name of ['fast', 'medium', 'slow'])
      expect(child.tokens[`--astryx-duration-${name}`], name).toBe(base.tokens[`--astryx-duration-${name}`])
  })

  it('a child’s knobs regenerate over its base’s explicit durations: base first, then generated', () => {
    const base = defineTheme({ name: 'ExplicitBase', motion: { tempo: 0.8 }, tokens: { '--duration-medium': '333ms' } })
    const quicker = defineTheme({ name: 'ExplicitChild', extends: base, motion: { tempo: 1.2 } })
    expect(quicker.tokens['--astryx-duration-medium']).toBe(ms(MEDIUM * 1.2))
    expect(quicker.tokens['--astryx-duration-fast']).toBe(ms(FAST * 1.2))
    const crisper = defineTheme({ name: 'ExplicitCrisp', extends: base, motion: { character: 'crisp' } })
    // The inherited tempo regenerates it too.
    expect(crisper.tokens['--astryx-duration-medium']).toBe(ms(MEDIUM * 0.8))
    expect(crisper.tokens['--astryx-duration-fast']).toBe(ms(FAST * 0.8))
    expect(crisper.tokens['--astryx-ease-entrance']).toBe(CHARACTER_EASE.crisp)
  })

  it('a child with no entrance curve of its own keeps its base’s', () => {
    const base = defineTheme({ name: 'BuiltBase', motion: { tempo: 0.8 }, tokens: { '--ease-entrance': 'linear' } })
    const child = defineTheme({ name: 'BuiltChild', extends: base, motion: { tempo: 1.2 } })
    expect(child.tokens['--astryx-duration-fast']).toBe(ms(FAST * 1.2))
    expect(child.tokens['--astryx-ease-entrance']).toBe('linear')
  })
})
