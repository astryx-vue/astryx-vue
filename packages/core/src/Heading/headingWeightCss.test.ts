// @vitest-environment node
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const here = dirname(fileURLToPath(import.meta.url))
const heading = readFileSync(resolve(here, '../../styles/heading.css'), 'utf8')
const text = readFileSync(resolve(here, '../../styles/text.css'), 'utf8')

function rule(css: string, selector: string): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`${escaped}\\s*\\{([^}]+)\\}`).exec(css)?.[1] ?? ''
}

describe('标题和文字的默认字重', () => {
  it('display 型标题的字重跟着层级走，同上游渲染', () => {
    expect(rule(heading, '.astryx-heading--level-1')).toContain('--_heading-level-weight: var(--astryx-text-heading-1-weight, 600)')
    for (const n of [1, 2, 3])
      expect(rule(heading, `.astryx-heading--type-display-${n}`)).toContain('font-weight: var(--_heading-level-weight)')
  })

  it('text 的每种 type 都写明字重，不从父元素继承', () => {
    for (const type of ['body', 'large', 'label', 'supporting', 'code'])
      expect(rule(text, `.astryx-text--type-${type}`)).toMatch(/font-weight: var\(--astryx-text-/)
    expect(rule(text, '.astryx-text--type-inherit')).toContain('font-weight: inherit')
  })
})
