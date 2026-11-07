// @vitest-environment node
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const stylesDir = resolve(dirname(fileURLToPath(import.meta.url)), '../../styles')

describe('日期字段的禁用焦点环', () => {
  it.each(['date-range-input.css', 'date-time-input.css'])('%s 为禁用字段保留 focus-within 焦点环', (filename) => {
    const css = readFileSync(resolve(stylesDir, filename), 'utf8')
    const focused = css.indexOf('[data-disabled=\'true\']:focus-within')

    expect(focused).toBeGreaterThanOrEqual(0)
    expect(css.slice(focused)).toContain('box-shadow: inset 0 0 0 2px')
  })
})
