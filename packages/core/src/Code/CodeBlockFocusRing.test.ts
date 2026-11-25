// @vitest-environment node
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const css = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '../../styles/code.css'), 'utf8')

describe('code block viewport focus ring', () => {
  it('draws the shared ring inset by its own width, inside the clipped block', () => {
    const ring = /\.astryx-code-block__scroll:focus-visible\s*\{([^}]*)\}/.exec(css)?.[1] ?? ''
    expect(ring).toContain('var(--astryx-focus-outline-width')
    expect(ring).toContain('var(--astryx-focus-outline-style')
    expect(ring).toContain('var(--astryx-focus-outline-color')
    expect(ring).toContain('outline-offset: calc(-1 * var(--astryx-focus-outline-width')
  })
})
