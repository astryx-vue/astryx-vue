// @vitest-environment node
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const css = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '../../styles/table.css'), 'utf8')

describe('table 块方向贴边', () => {
  it('只有容器的直接首个 / 末个子元素才抵消上下内边距', () => {
    expect(css).not.toMatch(/^\s*\.astryx-table-scroll:(first|last)-child\s*\{/m)
    expect(css).toMatch(/\.astryx-card,[\s\S]*?\)\s*>\s*\.astryx-table-scroll:first-child\s*\{\s*margin-top:/)
    expect(css).toMatch(/\.astryx-layout-content,[\s\S]*?\)\s*>\s*\.astryx-table-scroll:last-child\s*\{\s*margin-bottom:/)
  })
})
