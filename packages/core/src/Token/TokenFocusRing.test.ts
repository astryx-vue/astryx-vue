// @vitest-environment node
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const css = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '../../styles/token.css'), 'utf8')

function ruleFor(selector: string): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`${escaped}\\s*(?:,[^{]*)?\\{([^}]*)\\}`).exec(css)?.[1] ?? ''
}

describe('token 焦点环', () => {
  it('只在 token 自己的按钮或链接获得焦点时给整颗 token 画环', () => {
    expect(css).not.toContain(':focus-within')
    expect(ruleFor('.astryx-token.is-interactive:has(> .astryx-token-action:focus-visible)')).toContain('outline:')
  })

  it('删除按钮自己画环', () => {
    expect(ruleFor('.astryx-token-remove:focus-visible')).toMatch(/outline:\s*var\(/)
  })
})
