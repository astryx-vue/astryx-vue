// @vitest-environment node
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const css = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '../../styles/token.css'), 'utf8')

describe('token 删除热区', () => {
  it('可见 X 外扩 4px，不覆盖旁边的值', () => {
    const rule = /\.astryx-token-remove::after\s*\{([^}]*)\}/.exec(css)?.[1] ?? ''
    expect(rule).toContain('position: absolute')
    expect(rule).toContain('inset: -4px')
  })
})
