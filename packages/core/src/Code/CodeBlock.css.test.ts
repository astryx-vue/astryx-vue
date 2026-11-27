import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'
import { describe, expect, it } from 'vitest'

const css = readFileSync(resolve(process.cwd(), 'packages/core/styles/code.css'), 'utf8')

describe('codeBlock 样式', () => {
  it('没有标题栏时，控件排在代码右边自己的一列，不再浮在代码上', () => {
    expect(css).toMatch(/\.astryx-code-block\[data-corner\] \{[^}]*display: grid;[^}]*grid-template-columns: minmax\(0, 1fr\) auto;/)
    expect(css).not.toContain('copy-button--floating')
    expect(css).not.toMatch(/\.astryx-code-block__corner \{[^}]*position: absolute/)
  })

  it('角落控件簇和第一行代码等高，控件在里面居中', () => {
    expect(css).toMatch(/\.astryx-code-block__corner \{[^}]*align-items: center;[^}]*align-self: start;[^}]*block-size: calc\(2 \* var\(--astryx-spacing-3, 12px\) \+ var\(--astryx-text-code-size, 0\.875rem\) \* var\(--astryx-text-code-leading, 1\.4286\)\)/)
    expect(css).toMatch(/\.astryx-code-block__corner\[data-size='sm'\] \{[^}]*var\(--astryx-text-supporting-size, 0\.75rem\)/)
  })

  it('折叠时的箭头在 RTL 下镜像，镜像放在外层盒子上', () => {
    expect(css).toMatch(/\.astryx-code-block__chevron:dir\(rtl\) \{\n\s+transform: scaleX\(-1\);/)
  })

  it('页面方向交给变量，代码区按它排行号栏', () => {
    expect(css).toMatch(/\.astryx-code-block:dir\(rtl\) \{\n\s+--_codeblock-direction: rtl;/)
    expect(css).toMatch(/\.astryx-code-block__code \{[^}]*direction: var\(--_codeblock-direction, ltr\);/)
  })

  it('长标题在标题栏里换行，不压到右边的控件底下', () => {
    expect(css).toMatch(/\.astryx-code-block__title \{[^}]*overflow-wrap: anywhere;[^}]*white-space: pre-wrap;/)
  })

  it('手机上横向能滚时，藏着内容的一侧淡出；有键盘焦点和强制配色时不淡出', () => {
    expect(css).toContain('.astryx-code-block__scroll[data-scrollable-inline=\'true\']:not([data-scroll-inline-start=\'true\']) {')
    expect(css).toMatch(/@media \(pointer: coarse\) \{\n\s+\.astryx-code-block__scroll\[data-scrollable-inline='true'\]:not\(:focus-visible\) \{\n\s+mask-image: linear-gradient\(to right,/)
    expect(css).toMatch(/@media \(forced-colors: active\) \{\n\s+\.astryx-code-block__scroll \{\n\s+mask-image: none;/)
  })
})
