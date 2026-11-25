// @vitest-environment node
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'
import { describe, expect, it } from 'vitest'

function rule(file: string, selector: string): string {
  const css = readFileSync(resolve(process.cwd(), `packages/core/styles/${file}`), 'utf8')
  const at = css.indexOf(`${selector} {`)
  expect(at, selector).toBeGreaterThan(-1)
  return css.slice(at, css.indexOf('}', at))
}

describe('neutral badge on a solid button', () => {
  it.each(['primary', 'destructive'])('a %s Button passes its fill pair to its content', (variant) => {
    const body = rule('button.css', `.astryx-button[data-variant='${variant}']`)
    expect(body).toContain(`--_button-fill: var(--astryx-button-${variant}-background`)
    expect(body).toContain(`--_button-on-fill: var(--astryx-button-${variant}-foreground`)
    expect(body).toContain('color: var(--_button-on-fill)')
    expect(body).toContain('background-color: var(--_button-fill)')
  })

  it.each(['secondary', 'ghost'])('a %s Button passes no fill pair', (variant) => {
    expect(rule('button.css', `.astryx-button[data-variant='${variant}']`)).not.toContain('--_button-fill')
  })

  it('paints a neutral Badge with the pair inverted, and its own colours elsewhere', () => {
    const body = rule('badge.css', `.astryx-badge[data-variant='neutral']`)
    expect(body).toContain('color: var(--_button-fill, var(--astryx-badge-neutral-foreground))')
    expect(body).toContain('background-color: var(--_button-on-fill, var(--astryx-badge-neutral-background))')
  })
})

describe('indicator marks keep their share of the box', () => {
  const share = (ratio: string): string => `calc((100% + 2 * var(--astryx-border-width, 1px)) * ${ratio})`

  it.each([
    ['.astryx-checkbox-indicator-check', '14 / 24'],
    ['.astryx-checkbox-indicator[data-size=\'sm\'] > .astryx-checkbox-indicator-check', '12 / 20'],
  ])('sizes the check %s as %s of the box', (selector, ratio) => {
    const body = rule('checkbox-indicator.css', selector)
    expect(body).toContain(`width: ${share(ratio)}`)
    expect(body).toContain(`height: ${share(ratio)}`)
  })

  it('sizes the dash as half the box in both sizes', () => {
    expect(rule('checkbox-indicator.css', '.astryx-checkbox-indicator-dash')).toContain('width: calc((100% + 2 * var(--astryx-border-width, 1px)) / 2)')
    expect(readFileSync(resolve(process.cwd(), 'packages/core/styles/checkbox-indicator.css'), 'utf8'))
      .not
      .toContain('.astryx-checkbox-indicator[data-size=\'sm\'] > .astryx-checkbox-indicator-dash')
  })

  it.each([
    ['.astryx-radio-indicator-dot', '10 / 24'],
    ['.astryx-radio-indicator[data-size=\'sm\'] > .astryx-radio-indicator-dot', '8 / 20'],
  ])('sizes the dot %s as %s of the circle, rounded where round() exists', (selector, ratio) => {
    const css = readFileSync(resolve(process.cwd(), 'packages/core/styles/radio-indicator.css'), 'utf8')
    expect(rule('radio-indicator.css', selector)).toContain(`width: ${share(ratio)}`)
    const supports = css.slice(css.indexOf('@supports (width: round(1px, 1px))'))
    expect(supports).toContain(`width: round(${share(ratio)}, 1px)`)
    expect(supports).toContain(`height: round(${share(ratio)}, 1px)`)
  })
})
