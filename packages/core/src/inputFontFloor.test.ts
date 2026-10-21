import { readdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

// 文本控件在触屏上把字号兜底到 16px：iOS Safari 聚焦字号小于 16px 的控件时会放大页面，
// 别的触屏浏览器不会。-webkit-touch-callout 只有 iOS WebKit 实现，
// 所以兜底必须同时嵌在 `@media (pointer: coarse)` 和
// `@supports (-webkit-touch-callout: none)` 里，安卓和触屏笔记本继续用主题自己的字号。
// happy-dom 的 CSSOM 会丢掉 @supports 里的声明，只能读样式源码。

const stylesDir = resolve(__dirname, '../styles')
const FLOOR = /max\(\s*1rem\b/

/** 下标处的声明外面，从内到外的 at-rule 前导文字。 */
function enclosingPreludes(source: string, index: number): string[] {
  const preludes: string[] = []
  let depth = 0
  for (let cursor = index; cursor >= 0; cursor--) {
    const char = source[cursor]
    if (char === '}') {
      depth++
    }
    else if (char === '{') {
      if (depth > 0) {
        depth--
        continue
      }
      const start = Math.max(source.lastIndexOf('}', cursor), source.lastIndexOf(';', cursor), source.lastIndexOf('{', cursor - 1))
      preludes.push(source.slice(start + 1, cursor).trim())
    }
  }
  return preludes
}

function floors(): { file: string, preludes: string[] }[] {
  return readdirSync(stylesDir)
    .filter(name => name.endsWith('.css'))
    .flatMap((name) => {
      const source = readFileSync(join(stylesDir, name), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')
      return [...source.matchAll(new RegExp(`font-size:\\s*${FLOOR.source}`, 'g'))]
        .map(match => ({ file: name, preludes: enclosingPreludes(source, match.index) }))
    })
}

describe('the 16px input floor', () => {
  const found = floors()

  it('finds the floors of the text controls', () => {
    // 防止解析失败后下面的断言空转。
    const files = new Set(found.map(({ file }) => file))
    for (const name of ['text-input.css', 'text-area.css', 'command-palette.css', 'complex-selector.css', 'chat.css'])
      expect(files, name).toContain(name)
  })

  it('applies every floor to iOS alone', () => {
    for (const { file, preludes } of found) {
      expect(preludes, file).toContain('@media (pointer: coarse)')
      expect(preludes, file).toContain('@supports (-webkit-touch-callout: none)')
    }
  })
})
