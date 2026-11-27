import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { clearHeaderSize, HEADER_BLOCK_SIZE, HEADER_INLINE_SIZE, writeHeaderSize } from './codeHeaderSize.js'

const css = readFileSync(resolve(process.cwd(), 'packages/richtext/styles/richtext-document.css'), 'utf8')

function size(element: HTMLElement, sizes: { offsetHeight?: number, offsetWidth?: number, clientWidth?: number }): void {
  for (const [name, value] of Object.entries(sizes))
    Object.defineProperty(element, name, { configurable: true, value })
}

function parts(label = 'a very long label that wraps') {
  const header = document.createElement('div')
  const title = document.createElement('span')
  const copy = document.createElement('button')
  title.textContent = label
  header.append(title, copy)
  document.body.append(header)
  header.style.paddingInlineStart = '16px'
  header.style.paddingInlineEnd = '16px'
  header.style.columnGap = '4px'
  size(header, { offsetHeight: 64 })
  size(copy, { offsetWidth: 24 })
  title.style.fontSize = '12px'
  title.style.fontFamily = 'monospace'
  return { header, title }
}

function stubCanvas(width: number): void {
  vi.stubGlobal('HTMLCanvasElement', class extends HTMLElement {})
  vi.spyOn(document, 'createElement').mockImplementation(((tag: string) => {
    if (tag === 'canvas')
      return { getContext: () => ({ font: '', measureText: (text: string) => ({ width: width * text.length }) }) } as unknown as HTMLElement
    return Document.prototype.createElement.call(document, tag)
  }) as typeof document.createElement)
}

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  document.body.innerHTML = ''
})

describe('writeHeaderSize', () => {
  it('writes the header\'s drawn height on the code block, which a wrapped label makes taller than one row', () => {
    const block = document.createElement('pre')
    writeHeaderSize(block, parts(), { current: null })
    expect(block.style.getPropertyValue(HEADER_BLOCK_SIZE)).toBe('64px')
    // 没有画布能量文字：不写宽度。
    expect(block.style.getPropertyValue(HEADER_INLINE_SIZE)).toBe('')
  })

  it('writes the width the header takes with its label on one line, border included', () => {
    const block = document.createElement('pre')
    size(block, { offsetWidth: 402, clientWidth: 400 })
    const { header, title } = parts('abcd')
    stubCanvas(10)
    writeHeaderSize(block, { header, title }, { current: undefined })
    // 两侧内边距 32 + 复制按钮 24 + 间隙 4 + 标签 4 个字符 × 10 + 边框 2。
    expect(block.style.getPropertyValue(HEADER_INLINE_SIZE)).toBe('102px')
  })

  it('removes both sizes when the header goes away', () => {
    const block = document.createElement('pre')
    writeHeaderSize(block, parts(), { current: null })
    clearHeaderSize(block)
    expect(block.style.getPropertyValue(HEADER_BLOCK_SIZE)).toBe('')
    expect(block.style.getPropertyValue(HEADER_INLINE_SIZE)).toBe('')
  })
})

describe('code block header styles', () => {
  it('reserves the measured header height above the code, with one row as the fallback', () => {
    expect(css).toMatch(/padding-block-start: calc\(var\(--_richtext-code-header-block-size, calc\(2 \* var\(--astryx-spacing-2, 8px\) \+ var\(--astryx-size-element-sm, 24px\)\)\) \+ var\(--astryx-spacing-3, 12px\)\);/)
  })

  it('lets the block grow to the header\'s own width, never past the editor', () => {
    expect(css).toContain('min(var(--_richtext-code-header-inline-size, 0px), 100%)')
  })

  it('wraps a long label instead of cutting it off', () => {
    const title = css.match(/\.astryx-richtext-code-header__title \{[^}]*\}/)![0]
    expect(title).toContain('white-space: pre-wrap')
    expect(title).toContain('overflow-wrap: anywhere')
    expect(title).not.toContain('text-overflow')
  })
})
