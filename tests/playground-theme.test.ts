import { describe, expect, it } from 'vitest'
import baseCss from '../apps/docs/../../packages/themes/neutral/base.css?raw'
import { decodeShare, encodeShare } from '../apps/docs/components/playground/share'
import {
  applyDensity,
  contrastingInk,
  createNeutralTheme,
  describeDuration,
  matchingDensity,
  sanitizeTheme,
  themesEqual,
  themeVariables,
} from '../apps/docs/components/playground/theme'
import { parseCustomProperties, splitLightDark } from '../apps/docs/components/theme-tokens/parseTokens'

const properties = new Map(parseCustomProperties(baseCss).map(item => [item.name, item.value]))

describe('playground theme', () => {
  it('reads Neutral color stops from the theme package', () => {
    const variables = themeVariables(createNeutralTheme())
    const accent = splitLightDark(properties.get('--astryx-color-accent') ?? '')
    expect(accent).not.toBeNull()
    expect(variables['--astryx-color-accent']).toBe(`light-dark(${accent?.light}, ${accent?.dark})`)
    expect(variables['--astryx-color-text-primary']).toContain('light-dark(')
    expect(variables['--astryx-button-primary-background']).toBe('var(--astryx-color-accent)')
    expect(variables['--astryx-card-background']).toBe('var(--astryx-color-background-card)')
  })

  it('reproduces the Neutral spacing, size, and motion scales at the defaults', () => {
    const variables = themeVariables(createNeutralTheme())
    expect(variables['--astryx-spacing-0']).toBe('0')
    expect(variables['--astryx-spacing-1']).toBe(properties.get('--astryx-spacing-1'))
    expect(variables['--astryx-spacing-0-5']).toBe(properties.get('--astryx-spacing-0-5'))
    expect(variables['--astryx-size-element-sm']).toBe('28px')
    expect(variables['--astryx-size-element-md']).toBe('32px')
    expect(variables['--astryx-size-element-lg']).toBe('36px')
    expect(variables['--astryx-duration-fast']).toBe(properties.get('--astryx-duration-fast'))
    expect(variables['--astryx-duration-fast-min']).toBe(properties.get('--astryx-duration-fast-min'))
    expect(variables['--astryx-duration-fast-max']).toBe(properties.get('--astryx-duration-fast-max'))
    expect(variables['--astryx-duration-medium']).toBe('300ms')
    expect(variables['--astryx-duration-slow-max']).toBe('935ms')
  })

  it('builds the geometric type scale and linear radius from the Neutral defaults', () => {
    const variables = themeVariables(createNeutralTheme())
    expect(variables['--astryx-font-size-base']).toBe('14px')
    expect(variables['--astryx-font-size-sm']).toBe('12px')
    expect(variables['--astryx-font-size-lg']).toBe('17px')
    expect(variables['--astryx-font-size-5xl']).toBe('42px')
    expect(variables['--astryx-radius-inner']).toBe('6px')
    expect(variables['--astryx-radius-element']).toBe('10px')
    expect(variables['--astryx-radius-container']).toBe('12px')
    expect(variables['--astryx-radius-page']).toBe('28px')
    expect(variables['--astryx-radius-chat']).toBe('28px')
  })

  it('scales motion and density without inventing a second palette', () => {
    const theme = createNeutralTheme()
    theme.duration = 2
    expect(describeDuration(theme)).toBe('2× (medium = 600ms)')
    expect(themeVariables(theme)['--astryx-duration-fast']).toBe('250ms')
    applyDensity(theme, 'compact')
    expect(matchingDensity(theme)).toBe('compact')
    expect(themeVariables(theme)['--astryx-spacing-1']).toBe('3px')
    expect(themesEqual(theme, createNeutralTheme())).toBe(false)
  })

  it('picks readable ink for the Neutral accent stops', () => {
    const theme = createNeutralTheme()
    expect(contrastingInk(theme.colors.light.accent)).toBe('#ffffff')
    expect(contrastingInk(theme.colors.dark.accent)).toBe('#171717')
  })

  it('drops invalid shared colors back to Neutral', () => {
    const theme = sanitizeTheme({
      colors: { light: { accent: 'red; }' }, dark: { accent: '#112233' } },
      typeSize: 99,
    })
    expect(theme?.colors.light.accent).toBe(createNeutralTheme().colors.light.accent)
    expect(theme?.colors.dark.accent).toBe('#112233')
    expect(theme?.typeSize).toBe(22)
  })
})

describe('playground share', () => {
  it('round-trips code and theme through the URL hash', async () => {
    const theme = createNeutralTheme()
    theme.colors.light.accent = '#2255aa'
    theme.dark = true
    const encoded = await encodeShare({
      v: 1,
      templateId: 'chat',
      code: '<template><p>Hi</p></template>',
      theme,
    })
    const decoded = await decodeShare(`#pg=${encoded}`)
    expect(decoded?.code).toBe('<template><p>Hi</p></template>')
    expect(decoded?.theme.dark).toBe(true)
    expect(decoded?.theme.colors.light.accent).toBe('#2255aa')
  })

  it('ignores a hash that is not a playground payload', async () => {
    expect(await decodeShare('#heading')).toBeNull()
    expect(await decodeShare('#pg=not-valid')).toBeNull()
  })
})
