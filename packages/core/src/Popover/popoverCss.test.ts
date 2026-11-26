import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const css = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '../../styles/popover.css'), 'utf8')

describe('popover.css 的高度上限', () => {
  it('按动态视口减去带安全区的上下间距，旧的 vh 写法留作后备', () => {
    const body = css.slice(css.indexOf('.astryx-popover__body {'))
    expect(body).toContain('max-block-size: calc(100vh - 16px)')
    expect(body).toMatch(/max-block-size: calc\(100dvh - max\(16px, env\(safe-area-inset-top, 0px\)\) - max\(16px, env\(safe-area-inset-bottom, 0px\)\)\)/)
  })
})
