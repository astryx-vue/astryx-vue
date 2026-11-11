// @vitest-environment node
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const root = dirname(fileURLToPath(import.meta.url))
const markdown = readFileSync(resolve(root, '../../styles/markdown.css'), 'utf8')
const list = readFileSync(resolve(root, '../../styles/list.css'), 'utf8')

function block(css: string, selector: string): string {
  const start = css.indexOf(selector)
  if (start < 0)
    return ''
  return css.slice(start, css.indexOf('}', start))
}

describe('wide ordered-list markers', () => {
  it('aligns marker ends and keeps wide counters whole', () => {
    const markdownMarker = block(markdown, '.astryx-markdown__marker[data-marker=\'decimal\']')
    expect(markdownMarker).toContain('justify-content: flex-end')
    expect(markdownMarker).toContain('white-space: nowrap')

    const listMarker = block(list, '.astryx-list-marker__number {')
    expect(listMarker).toContain('justify-content: flex-end')
    expect(listMarker).toContain('white-space: nowrap')
  })
})
