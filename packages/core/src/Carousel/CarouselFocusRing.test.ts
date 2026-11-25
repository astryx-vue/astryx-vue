// @vitest-environment node
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const css = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '../../styles/carousel.css'), 'utf8')

function rule(selector: string): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`${escaped}\\s*\\{([^}]*)\\}`).exec(css)?.[1] ?? ''
}

describe('carousel focus ring', () => {
  it('draws the shared ring above the scroller, so the edge-fade mask cannot fade it', () => {
    expect(rule('.astryx-carousel__scroller:focus-visible')).toContain('outline: none')
    expect(rule('.astryx-carousel::after')).toContain('position: absolute')
    const ring = rule('.astryx-carousel:has(> .astryx-carousel__scroller:focus-visible)::after')
    expect(ring).toContain('var(--astryx-focus-outline-width')
    expect(ring).toContain('var(--astryx-focus-outline-color')
    expect(ring).toContain('outline-offset: calc(-1 * var(--astryx-focus-outline-width')
  })

  it('keeps each scroll button inside the ring instead of straddling the edge', () => {
    const inset = 'calc(var(--astryx-focus-outline-offset, 3px) + var(--astryx-focus-outline-width, 2px))'
    expect(rule('.astryx-carousel__pill--start')).toContain(`margin-inline-start: ${inset}`)
    expect(rule('.astryx-carousel__pill--end')).toContain(`margin-inline-end: ${inset}`)
    expect(css).not.toMatch(/\.astryx-carousel__pill--(?:start|end)\s*\{[^}]*transform/)
  })
})
