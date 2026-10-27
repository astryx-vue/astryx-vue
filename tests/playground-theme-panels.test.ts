import { describe, expect, it } from 'vitest'
import { decodeShare, encodeShare } from '../apps/docs/components/playground/share'
import {
  addCustomOverride,
  buildComponentStyles,
  clearScaleTokens,
  createNeutralTheme,
  exportThemeCss,
  exportThemeJson,
  previewCss,
  removeCustomOverride,
  sanitizeTheme,
  setComponentToken,
  setToken,
  themesEqual,
  themeVariables,
} from '../apps/docs/components/playground/theme'
import { NEUTRAL_TOKENS } from '../apps/docs/components/playground/themeDefaults'
import { parseColor, rewriteColor, shownColor } from '../apps/docs/components/playground/themeTokenColor'
import { COMPONENT_VAR_TO_OVERRIDE, COMPONENT_VARS, resolveOptionLabel } from '../apps/docs/components/playground/themeTokensComponents'
import { groupSections, spacingToPx, tokenLabel } from '../apps/docs/components/playground/themeTokensRaw'

describe('playground component variables', () => {
  it('maps every listed variable to an override', () => {
    for (const group of Object.values(COMPONENT_VARS)) {
      for (const item of group.vars)
        expect(COMPONENT_VAR_TO_OVERRIDE[item.name]?.length).toBeGreaterThan(0)
    }
  })

  it('turns a card radius into a components override, then CSS', () => {
    const theme = createNeutralTheme()
    setComponentToken(theme, '--card-radius', 'var(--radius-full)')
    expect(buildComponentStyles(theme)).toEqual({ card: { base: { borderRadius: 'var(--radius-full)' } } })
    expect(previewCss(theme)).toContain('border-radius: var(--astryx-radius-full)')
    expect(exportThemeCss(theme)).toContain('.astryx-card')
    expect(JSON.parse(exportThemeJson(theme)).components.card.base.borderRadius).toBe('var(--radius-full)')
  })

  it('lets custom overrides win and rejects unsafe input', () => {
    const theme = createNeutralTheme()
    setComponentToken(theme, '--card-radius', 'var(--radius-full)')
    expect(addCustomOverride(theme, { component: 'card', property: 'borderRadius', value: '3px' })).toBe(true)
    expect(buildComponentStyles(theme).card?.base?.borderRadius).toBe('3px')
    expect(addCustomOverride(theme, { component: 'card', property: 'color', value: 'red; }' })).toBe(false)
    expect(addCustomOverride(theme, { component: 'nope', property: 'color', value: 'red' })).toBe(false)
    removeCustomOverride(theme, theme.customOverrides[0]!.id)
    expect(theme.customOverrides).toHaveLength(0)
  })

  it('clears a component variable when its value is emptied', () => {
    const theme = createNeutralTheme()
    setComponentToken(theme, '--card-padding', 'var(--spacing-6)')
    setComponentToken(theme, '--card-padding', '')
    expect(theme.componentTokens).toEqual({})
  })

  it('shows the live value next to a token option', () => {
    const option = { value: 'x', label: 'Element', token: '--astryx-radius-element' }
    expect(resolveOptionLabel(option, { '--astryx-radius-element': '10px' })).toBe('Element — 10px')
    expect(resolveOptionLabel(option, {})).toBe('Element')
  })
})

describe('playground raw tokens', () => {
  it('reads defaults from neutral base.css and lists only tokens that exist', () => {
    expect(NEUTRAL_TOKENS['--astryx-color-accent']).toContain('light-dark(')
    for (const key of ['colors', 'typography', 'spacing', 'radius', 'size', 'shadow', 'duration', 'easing'] as const) {
      const tokens = groupSections(key).flatMap(section => section.tokens)
      expect(tokens.length).toBeGreaterThan(0)
      for (const name of tokens)
        expect(NEUTRAL_TOKENS[name]).toBeDefined()
    }
  })

  it('applies a raw token to the output and wins over generated values', () => {
    const theme = createNeutralTheme()
    setToken(theme, '--astryx-color-accent', 'light-dark(#ff0000, #00ff00)')
    expect(themeVariables(theme)['--astryx-color-accent']).toBe('light-dark(#ff0000, #00ff00)')
    expect(exportThemeCss(theme)).toContain('--astryx-color-accent: light-dark(#ff0000, #00ff00);')
    setToken(theme, 'not-a-token', 'x')
    setToken(theme, '--astryx-color-accent', 'a; b')
    expect(Object.keys(theme.tokens)).toEqual(['--astryx-color-accent'])
  })

  it('drops hand-edited scale tokens when the scale changes', () => {
    const theme = createNeutralTheme()
    setToken(theme, '--astryx-radius-element', '2px')
    setToken(theme, '--astryx-color-accent', '#fff')
    clearScaleTokens(theme, 'radius')
    expect(Object.keys(theme.tokens)).toEqual(['--astryx-color-accent'])
  })

  it('labels tokens like upstream and converts spacing', () => {
    expect(tokenLabel('--astryx-color-background-card')).toBe('Color Card')
    expect(spacingToPx('0.5rem')).toBe(8)
    expect(spacingToPx('12px')).toBe(12)
    expect(spacingToPx('var(--x)')).toBeNaN()
  })

  it('edits only the active half of a light-dark color', () => {
    const value = 'light-dark(#112233, #445566)'
    expect(rewriteColor(value, 'dark', '#abcdef  50%')).toBe('light-dark(#112233, #abcdef80)')
    expect(rewriteColor(value, 'light', 'red')).toBe('light-dark(red, #445566)')
    expect(rewriteColor('#112233', 'light', '#ffffff')).toBe('#ffffff')
    expect(shownColor(value, 'dark').readout).toBe('#445566  100%')
    expect(parseColor('rgba(0, 0, 0, 0.5)')).toEqual({ hex: '#000000', alpha: 0.5 })
    expect(parseColor('oklch(0 0 0)')).toBeNull()
  })
})

describe('playground share round trip', () => {
  it('restores tokens, component variables and overrides', async () => {
    const theme = createNeutralTheme()
    setToken(theme, '--astryx-color-accent', '#ff0000')
    setComponentToken(theme, '--card-radius', 'var(--radius-none)')
    addCustomOverride(theme, { component: 'button', property: 'borderRadius', value: '9999px' })
    const encoded = await encodeShare({ v: 1, templateId: '', code: '', theme })
    const decoded = await decodeShare(`#pg=${encoded}`)
    expect(decoded?.theme.tokens).toEqual(theme.tokens)
    expect(decoded?.theme.componentTokens).toEqual(theme.componentTokens)
    expect(decoded?.theme.customOverrides).toEqual(theme.customOverrides)
    expect(themesEqual(decoded!.theme, theme)).toBe(true)
    expect(themesEqual(theme, createNeutralTheme())).toBe(false)
  })

  it('sanitizes hostile payloads', () => {
    const theme = sanitizeTheme({
      tokens: { '--astryx-x': 'a;b', 'evil': 'red', '--astryx-ok': '1px' },
      componentTokens: { '--card-radius': 'url(x)}', '--nope': '1px', '--card-padding': '2px' },
      customOverrides: [{ component: 'card', property: 'x y', value: '1' }, { component: 'card', property: 'padding', value: '1px' }, 5],
    })
    expect(theme?.tokens).toEqual({ '--astryx-ok': '1px' })
    expect(theme?.componentTokens).toEqual({ '--card-padding': '2px' })
    expect(theme?.customOverrides).toEqual([{ id: 'custom-0', component: 'card', property: 'padding', value: '1px' }])
  })
})
