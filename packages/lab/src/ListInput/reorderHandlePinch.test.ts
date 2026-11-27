import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const stylesDir = join(dirname(fileURLToPath(import.meta.url)), '../../styles')

function touchActionOf(file: string, selector: string): string | undefined {
  const css = readFileSync(join(stylesDir, file), 'utf8')
  const start = css.indexOf(`${selector} {`)
  if (start < 0)
    return undefined
  const body = css.slice(start, css.indexOf('}', start))
  return /touch-action:([^;]+);/.exec(body)?.[1]?.trim()
}

describe('reorder handles', () => {
  it.each([
    ['list-input.css', '.astryx-list-input__reorder-handle'],
    ['transfer-list.css', '.astryx-transfer-list-reorder-handle'],
  ])('%s keeps one-finger drags but lets a pinch zoom the page', (file, selector) => {
    expect(touchActionOf(file, selector)).toBe('pinch-zoom')
  })
})
