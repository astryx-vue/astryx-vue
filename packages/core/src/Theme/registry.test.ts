/**
 * Drift guards between the theme compiler's tables and the stylesheets they
 * describe. A table entry naming a variable no stylesheet reads, or a
 * default that no longer matches the shipped CSS, fails here.
 */
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { parseCustomProperties } from '../../../../apps/docs/components/theme-tokens/parseTokens'
import { DATA_TOKEN_DEFAULTS } from './dataTokens.js'
import { DERIVED_VARS } from './derivedVars.js'
import { normalizeTokenName } from './tokenName.js'

const root = process.cwd()
const stylesDir = join(root, 'packages/core/styles')
const componentCss = readdirSync(stylesDir)
  .filter(name => name.endsWith('.css'))
  .map(name => readFileSync(join(stylesDir, name), 'utf8'))
  .join('\n')

describe('derived variables', () => {
  it('name only variables a component stylesheet reads', () => {
    for (const [component, entries] of Object.entries(DERIVED_VARS)) {
      for (const entry of entries) {
        for (const name of entry.vars ?? [])
          expect(componentCss, `${component} ${name}`).toContain(`var(${name}`)
        if (entry.expand === 'container')
          expect(componentCss, `${component} container padding`).toContain(`var(--astryx-${component}-padding`)
      }
    }
  })

  it('target components the stylesheets define', () => {
    for (const component of Object.keys(DERIVED_VARS))
      expect(componentCss, component).toContain(`.astryx-${component}`)
  })
})

describe('data token defaults', () => {
  it('match packages/themes/data.css name for name and value for value', () => {
    const css = readFileSync(join(root, 'packages/themes/data.css'), 'utf8')
    const declared = parseCustomProperties(css).map(property => [property.name, property.value])
    const fromTable = Object.entries(DATA_TOKEN_DEFAULTS).map(([name, value]) => [normalizeTokenName(name), value])
    expect(fromTable).toEqual(declared)
  })
})
