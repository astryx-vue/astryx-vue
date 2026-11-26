/**
 * @file themeMotion.test.ts
 * @input vitest, the theme motion knobs, defineTheme and expandMotionScale
 * @output Checks the motion knobs: the declared tokens at the defaults, each
 *   tempo bound and the clamp, each character's curves with exits unchanged,
 *   `reducedMotion` kept internal, a `MotionScaleConfig` that renders as
 *   before and wins over `tempo`, explicit tokens winning over both,
 *   adaptation rules setting the knobs, inheritance field by field, and
 *   `resolveThemeMotion`
 * @position Testing; validates themeMotion.ts and its use in defineTheme
 */

import type { ThemeMotionKnobs } from './themeMotion.js'
import { describe, expect, it } from 'vitest'
import { defineTheme } from './defineTheme.js'
import { expandMotionScale } from './expandMotionScale.js'
import { durationDefaults, easeDefaults } from './motionTokenDefaults.js'
import {
  CHARACTER_EASE,
  expandThemeMotion,
  resolveMotionKnobs,
  resolveThemeMotion,
} from './themeMotion.js'

/** The durations `@astryx-vue/themes` declares, fast-min to slow-max. */
const DECLARED_MS = [95, 125, 165, 225, 300, 400, 525, 700, 935]
const FAST = 125
const MEDIUM = 300
const SLOW = 700
const STANDARD = 'cubic-bezier(0.24, 1, 0.4, 1)'

/** The duration tokens whose default is a literal, not a reference. */
const BAND_DURATIONS = Object.entries(durationDefaults)
  .filter(([, value]) => !value.startsWith('var('))
  .map(([name]) => name)

function durationsMs(tokens: Readonly<Record<string, string>>, prefix = ''): number[] {
  return BAND_DURATIONS.map(name => Number.parseFloat(tokens[name.replace('--', `--${prefix}`)]!))
}

const ms = (value: number): string => `${Math.round(value)}ms`

describe('the motion knobs', () => {
  it('default to tempo 1, standard and system', () => {
    expect(resolveMotionKnobs(undefined)).toEqual({
      tempo: 1,
      character: 'standard',
      reducedMotion: 'system',
      tempoIsSet: false,
    })
  })

  it('clamp tempo to 0.75–1.5 and ignore a value that is no number', () => {
    expect(resolveMotionKnobs({ tempo: 0.5 }).tempo).toBe(0.75)
    expect(resolveMotionKnobs({ tempo: 2 }).tempo).toBe(1.5)
    expect(resolveMotionKnobs({ tempo: 1.2 }).tempo).toBe(1.2)
    expect(resolveMotionKnobs({ tempo: Number.NaN })).toMatchObject({ tempo: 1, tempoIsSet: false })
  })

  it('resolve reducedMotion to system, which no theme sets', () => {
    expect(resolveMotionKnobs({}).reducedMotion).toBe('system')
    // @ts-expect-error reducedMotion is not part of the public motion type.
    const knobs: ThemeMotionKnobs = { reducedMotion: 'system' }
    expect(resolveMotionKnobs(knobs).reducedMotion).toBe('system')
  })
})

describe('the CSS motion tokens', () => {
  it('are the declared ones at the defaults', () => {
    expect(expandThemeMotion({})).toEqual({})
    const explicit = expandThemeMotion({ tempo: 1, character: 'standard' })
    expect(durationsMs(explicit)).toEqual(DECLARED_MS)
    expect(explicit['--ease-entrance']).toBe(STANDARD)
    expect(explicit['--ease-move']).toBe(STANDARD)
    const motion = resolveThemeMotion({})
    expect(durationsMs(motion.durations)).toEqual(DECLARED_MS)
    expect(motion.easings).toEqual({
      '--ease-standard': STANDARD,
      '--ease-entrance': STANDARD,
      '--ease-move': STANDARD,
    })
    expect(easeDefaults['--ease-entrance']).toBe(STANDARD)
    expect(easeDefaults['--ease-move']).toBe(STANDARD)
  })

  it.each([0.75, 1.2, 1.5])('scale every duration by tempo %s, to the ms', (tempo) => {
    expect(durationsMs(expandThemeMotion({ tempo }))).toEqual(DECLARED_MS.map(value => Math.round(value * tempo)))
  })

  it('clamp the scale: a tempo of 3 is 1.5', () => {
    expect(durationsMs(expandThemeMotion({ tempo: 3 }))).toEqual(DECLARED_MS.map(value => Math.round(value * 1.5)))
  })

  it.each(['crisp', 'expressive'] as const)('set the entrance and move curves at %s, and leave the standard and exit curves alone', (character) => {
    const tokens = expandThemeMotion({ character })
    expect(tokens['--ease-entrance']).toBe(CHARACTER_EASE[character])
    expect(tokens['--ease-move']).toBe(CHARACTER_EASE[character])
    expect(tokens).not.toHaveProperty('--ease-standard')
    expect(tokens).not.toHaveProperty('--ease-exit')
    expect(Object.keys(tokens).some(name => name.startsWith('--duration'))).toBe(false)
  })

  it('keep entrances and moves on a theme’s own standard curve at standard', () => {
    const easing = 'cubic-bezier(0.2, 0, 0, 1)'
    const tokens = expandThemeMotion({ fast: 175, medium: 410, ratio: 0.75, easing })
    expect(tokens['--ease-standard']).toBe(easing)
    expect(tokens['--ease-entrance']).toBe(easing)
    expect(tokens['--ease-move']).toBe(easing)
  })
})

describe('a defined theme’s motion tokens', () => {
  const scale = { fast: 100, medium: 250, ratio: 0.75 }

  it('a MotionScaleConfig generates what expandMotionScale does', () => {
    expect(expandThemeMotion(scale)).toEqual(expandMotionScale(scale))
  })

  it('a MotionScaleConfig implies no tempo for the animator', () => {
    expect(resolveMotionKnobs(scale).tempoIsSet).toBe(false)
  })

  it('a scale’s durations win over tempo; tempo scales the durations it leaves out', () => {
    const tokens = expandThemeMotion({ ...scale, tempo: 1.5 })
    expect(tokens).toMatchObject(expandMotionScale(scale))
    expect(tokens['--duration-slow']).toBe(ms(SLOW * 1.5))
  })

  it('writes prefixed tokens, and explicit tokens win over the knobs', () => {
    const theme = defineTheme({
      name: 'Knobbed',
      motion: { tempo: 1.5, character: 'crisp' },
      tokens: { '--duration-medium': '300ms', '--ease-entrance': 'linear' },
    })
    expect(theme.tokens['--astryx-duration-medium']).toBe('300ms')
    expect(theme.tokens['--astryx-ease-entrance']).toBe('linear')
    expect(theme.tokens['--astryx-duration-fast']).toBe(ms(FAST * 1.5))
    expect(theme.tokens['--astryx-ease-move']).toBe(CHARACTER_EASE.crisp)
    expect(theme.tokens).not.toHaveProperty('--duration-fast')
  })

  it('a child theme keeps each knob it leaves out and can set one back to its default', () => {
    const base = defineTheme({ name: 'SlowCrisp', motion: { tempo: 0.8, character: 'crisp' } })
    const quicker = defineTheme({ name: 'SlowCrispChild', extends: base, motion: { tempo: 1.2 } })
    expect(quicker.tokens['--astryx-duration-medium']).toBe(ms(MEDIUM * 1.2))
    expect(quicker.tokens['--astryx-ease-entrance']).toBe(CHARACTER_EASE.crisp)
    const reset = defineTheme({ name: 'SlowCrispReset', extends: base, motion: { tempo: 1, character: 'standard' } })
    expect(reset.tokens['--astryx-duration-medium']).toBe(ms(MEDIUM))
    expect(reset.tokens['--astryx-ease-entrance']).toBe(STANDARD)
  })

  it('refuses a partial duration scale beside a knob instead of dropping it', () => {
    for (const motion of [
      { fast: 100, tempo: 1.2 },
      { fast: 100, medium: 250, slow: 700, tempo: 1 },
      { easing: 'linear', character: 'standard' as const },
    ]) {
      expect(() => defineTheme({ name: 'Partial', motion: motion as never })).toThrow(/must supply `fast`, `medium`, and `ratio`/)
    }
    // A field the child leaves out may come from its base.
    const base = defineTheme({ name: 'ScaleBase', motion: { fast: 175, medium: 410, ratio: 0.75 } })
    const child = defineTheme({ name: 'ScaleChild', extends: base, motion: { fast: 100, tempo: 1.2 } as never })
    expect(child.tokens['--astryx-duration-fast']).toBe('100ms')
  })

  it('a theme with no motion writes no motion token, so it renders as before', () => {
    const plain = defineTheme({ name: 'Plain' })
    expect(Object.keys(plain.tokens).filter(name => /duration|ease|motion/.test(name))).toEqual([])
    expect(plain.css ?? '').not.toContain('duration')
  })

  it('an adaptation rule sets tempo and character like any motion value', () => {
    const theme = defineTheme({
      name: 'Adaptive',
      adaptations: { rules: [{ when: { pointer: 'coarse' }, value: { motion: { tempo: 0.8, character: 'expressive' } } }] },
    })
    const rule = theme.adaptationRules?.[0]
    expect(rule?.tokens['--astryx-duration-medium']).toBe(ms(MEDIUM * 0.8))
    expect(rule?.tokens['--astryx-ease-entrance']).toBe(CHARACTER_EASE.expressive)
    expect(theme.css).toContain(`--astryx-duration-medium: ${ms(MEDIUM * 0.8)}`)
  })

  it('an adaptation rule cannot set reducedMotion, a theme-wide setting', () => {
    expect(() => defineTheme({
      name: 'Bad',
      adaptations: { rules: [{ when: { pointer: 'coarse' }, value: { motion: { reducedMotion: 'system' } as never } }] },
    })).toThrow(/reducedMotion is a theme-wide setting/)
  })
})

describe('--duration-exit', () => {
  it('defaults to --duration-fast', () => {
    expect(durationDefaults['--duration-exit']).toBe('var(--duration-fast)')
    expect(resolveThemeMotion({}).durations['--duration-exit']).toBe(ms(FAST))
  })

  it('follows tempo through --duration-fast, and tempo writes no value for it', () => {
    const tokens = expandThemeMotion({ tempo: 1.2 })
    expect(tokens).not.toHaveProperty('--duration-exit')
    expect(tokens).not.toHaveProperty('--_astryx-pre-tempo-duration-exit')
    expect(Object.values(tokens).some(value => value.includes('NaN'))).toBe(false)
    expect(resolveThemeMotion({ motion: { tempo: 1.2 } }).durations['--duration-exit']).toBe(ms(FAST * 1.2))
  })

  it.each([
    ['a tempo', { name: 'ExitTempo', motion: { tempo: 1.2 } }],
    ['a duration scale', { name: 'ExitScale', motion: { fast: 100, medium: 250, ratio: 0.75 } }],
    ['an explicit --duration-fast', { name: 'ExitFast', tokens: { '--duration-fast': '120ms' } }],
  ] as const)('is declared again in a theme scope that sets --duration-fast through %s', (_label, config) => {
    expect(defineTheme(config).css).toContain('--astryx-duration-exit: var(--astryx-duration-fast);')
  })

  it('is declared again in an adaptation rule that sets --duration-fast', () => {
    const theme = defineTheme({
      name: 'ExitRule',
      adaptations: { rules: [{ when: { pointer: 'coarse' }, value: { motion: { tempo: 1.2 } } }] },
    })
    const ruleCss = theme.css!.slice(theme.css!.indexOf('@media'))
    expect(ruleCss).toContain('--astryx-duration-exit: var(--astryx-duration-fast);')
  })

  it('is not declared again where the theme sets it, or sets no --duration-fast', () => {
    const own = defineTheme({
      name: 'ExitOwn',
      motion: { tempo: 1.2 },
      tokens: { '--duration-exit': '90ms' },
      adaptations: { rules: [{ when: { pointer: 'coarse' }, value: { motion: { tempo: 0.8 } } }] },
    }).css
    expect(own).not.toContain('--astryx-duration-exit: var(--astryx-duration-fast);')
    expect(own).toContain('--astryx-duration-exit: 90ms;')
    expect(defineTheme({ name: 'ExitPlain' }).css ?? '').not.toContain('--astryx-duration-exit')
  })

  it('takes a theme override', () => {
    expect(resolveThemeMotion({ tokens: { '--duration-exit': '90ms' } }).durations['--duration-exit']).toBe('90ms')
    const theme = defineTheme({ name: 'ExitOverride', tokens: { '--duration-exit': '90ms' } })
    expect(theme.tokens['--astryx-duration-exit']).toBe('90ms')
  })
})

describe('resolveThemeMotion', () => {
  it('returns the knobs, durations and easings with explicit tokens applied', () => {
    const motion = resolveThemeMotion({
      motion: { tempo: 1.2, character: 'expressive' },
      tokens: { '--duration-fast': '200ms' },
    })
    expect(motion.knobs).toEqual({ tempo: 1.2, character: 'expressive', reducedMotion: 'system', tempoIsSet: true })
    expect(motion.durations['--duration-fast']).toBe('200ms')
    expect(motion.durations['--duration-medium']).toBe(ms(MEDIUM * 1.2))
    expect(motion.easings['--ease-entrance']).toBe(CHARACTER_EASE.expressive)
    expect(motion.easings['--ease-standard']).toBe(STANDARD)
  })

  it('resolves tokens written as references through the theme’s tokens', () => {
    const motion = resolveThemeMotion({
      tokens: {
        '--duration-fast': '90ms',
        '--duration-medium': 'var(--duration-fast)',
        '--duration-slow': 'var(--duration-unknown, 700ms)',
        '--ease-standard': 'linear',
        '--ease-entrance': 'var(--ease-standard)',
      },
    })
    expect(motion.durations['--duration-medium']).toBe('90ms')
    expect(motion.durations['--duration-slow']).toBe('700ms')
    expect(motion.easings['--ease-entrance']).toBe('linear')
    expect(motion.easings['--ease-move']).toBe('linear')
    expect(JSON.stringify(motion)).not.toContain('var(')
  })

  it('resolves a reference to the theme’s own local token', () => {
    const motion = resolveThemeMotion({
      tokens: { '--duration-medium': 'var(--brand-beat)' },
      localTokens: { '--brand-beat': '333ms' },
    })
    expect(motion.durations['--duration-medium']).toBe('333ms')
  })

  it('reads a defined theme, prefixed tokens and the knobs a child inherits included', () => {
    const base = defineTheme({ name: 'KnobBase', motion: { tempo: 1.2 }, tokens: { '--duration-fast': '150ms' } })
    const child = defineTheme({ name: 'KnobChild', extends: base })
    const motion = resolveThemeMotion(child)
    expect(motion.knobs.tempo).toBe(1.2)
    expect(motion.durations['--duration-fast']).toBe('150ms')
    expect(motion.durations['--duration-medium']).toBe(ms(MEDIUM * 1.2))
  })
})
