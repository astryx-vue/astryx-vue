// @vitest-environment node
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const css = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '../../styles/command-palette.css'), 'utf8')

describe('commandPaletteInput 焦点环', () => {
  it('只在键盘来源的可见焦点上画统一焦点环', () => {
    const rule = /\.astryx-command-palette-field:focus-visible\[data-keyboard-focus\]\s*\{([^}]*)\}/.exec(css)?.[1] ?? ''
    expect(rule).toContain('--astryx-focus-outline-width')
    expect(rule).toContain('outline-offset')
  })
})
