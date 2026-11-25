import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { STATUS_COLOR_DEFAULTS } from './statusColorDefaults.js'
import { normalizeTokenName } from './tokenName.js'

const root = process.cwd()

/** Root declarations of the default theme, by name. */
function neutralDeclarations(): Map<string, string> {
  const css = readFileSync(join(root, 'packages/themes/neutral/base.css'), 'utf8')
  const declared = new Map<string, string>()
  for (const match of css.matchAll(/^\s*(--astryx-[\w-]+):([^;]+);/gm))
    declared.set(match[1]!, match[2]!.trim())
  return declared
}

describe('status color defaults', () => {
  it('match packages/themes/neutral/base.css name for name and value for value', () => {
    const declared = neutralDeclarations()
    for (const [name, value] of Object.entries(STATUS_COLOR_DEFAULTS))
      expect(declared.get(normalizeTokenName(name)), name).toBe(value)
  })

  it('cover every status fill, pale fill, and role the derivation reads or writes', () => {
    const names = Object.keys(STATUS_COLOR_DEFAULTS)
    for (const status of ['info', 'success', 'warning', 'error']) {
      for (const role of [`--color-${status}`, `--color-${status}-muted`, `--color-on-${status}`, `--color-text-${status}`, `--color-on-${status}-muted`])
        expect(names).toContain(role)
    }
  })
})
