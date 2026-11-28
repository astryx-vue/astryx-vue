import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const here = dirname(fileURLToPath(import.meta.url))
const labStyles = join(here, '../../styles')
const coreReorderCss = join(here, '../../../core/styles/list-reorder.css')

/** `selector { ... }` 里的 touch-action，在 `media` 块里找（不给就在整个文件里找）。 */
function touchActionOf(css: string, selector: string, media?: string): string | undefined {
  let scope = css
  if (media != null) {
    const start = css.indexOf(`@media ${media} {`)
    if (start < 0)
      return undefined
    scope = css.slice(start)
  }
  const start = scope.indexOf(`${selector} {`)
  if (start < 0)
    return undefined
  const body = scope.slice(start, scope.indexOf('}', start))
  return /touch-action:([^;]+);/.exec(body)?.[1]?.trim()
}

describe('reorder handles', () => {
  it('core 的手柄在粗指针下只关掉双击缩放：单指按住再拖，双指捏合照样缩放页面', () => {
    const css = readFileSync(coreReorderCss, 'utf8')
    expect(touchActionOf(css, '.astryx-list-reorder-handle', '(pointer: coarse)')).toBe('manipulation')
  })

  it.each(['list-input.css', 'transfer-list.css'])('%s 不再给手柄另设 touch-action，交给 core', (file) => {
    const css = readFileSync(join(labStyles, file), 'utf8')
    expect(css).not.toContain('reorder-handle')
    expect(css).not.toMatch(/touch-action/)
  })
})
