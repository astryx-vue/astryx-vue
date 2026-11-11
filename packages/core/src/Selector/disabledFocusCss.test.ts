// @vitest-environment node
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('disabled selector focus', () => {
  it.each(['selector', 'multi-selector'])('%s keeps the focus paint when its field is disabled', (name) => {
    const css = readFileSync(`packages/core/styles/${name}.css`, 'utf8')
    const rule = new RegExp(`\\.astryx-${name}-(field|control)\\.is-disabled:focus-within\\s*\\{([^}]+)\\}`).exec(css)
    expect(rule?.[2]).toContain('box-shadow: inset 0 0 0 2px')
  })
})
