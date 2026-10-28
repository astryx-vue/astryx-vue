import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'
import { describe, expect, it } from 'vitest'

function css(name: string): string {
  return readFileSync(resolve(process.cwd(), `packages/core/styles/${name}`), 'utf8')
}

/** 取 `selector {` 开头的那条规则的花括号内文本。 */
function rule(source: string, selector: string): string {
  const start = source.indexOf(`${selector} {`)
  expect(start, `rule ${selector}`).toBeGreaterThan(-1)
  return source.slice(start, source.indexOf('}', start))
}

describe('d19 单条声明和原版对齐', () => {
  it('icon: 自己声明了 fill 的 SVG 保持原样，只有没写 fill 的才跟随当前颜色', () => {
    const source = css('icon.css')
    expect(rule(source, '.astryx-icon > svg,\n  .astryx-icon__svg > svg')).not.toContain('fill')
    expect(rule(source, '.astryx-icon > svg:not([fill]),\n  .astryx-icon__svg > svg:not([fill])')).toContain('fill: currentcolor')
  })

  it('token: 不设 vertical-align（行内弹性盒按基线排，表格行高才和原版一样）', () => {
    expect(rule(css('token.css'), '.astryx-token')).not.toContain('vertical-align')
  })

  it('progress-bar: 根节点占满父级，最窄 48px，放进 flex 行也不会缩成 0', () => {
    const block = rule(css('progress-bar.css'), '.astryx-progress-bar')
    expect(block).toContain('width: 100%')
    expect(block).toContain('min-width: 48px')
  })

  it('text-input: 原生 input 只靠 flex:1 撑开，不写 width:100%（否则 flex 行里最小内容宽度算 0）', () => {
    const block = rule(css('text-input.css'), '.astryx-text-input-control')
    expect(block).toContain('flex: 1')
    expect(block).not.toMatch(/\swidth:/)
  })
})
