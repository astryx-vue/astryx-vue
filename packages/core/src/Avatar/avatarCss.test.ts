// @vitest-environment node
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const css = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '../../styles/avatar.css'), 'utf8')

describe('avatar 首字母样式', () => {
  it('首字母从私有自定义属性画出，支持时带空的替代文字', () => {
    expect(css).not.toContain('attr(data-initials)')
    expect(css).toMatch(/\.astryx-avatar__fallback--initials::before\s*\{\s*content: var\(--_avatar-initials\);/)
    expect(css).toMatch(/@supports \(content: "a" \/ ""\)\s*\{\s*\.astryx-avatar__fallback--initials::before\s*\{\s*content: var\(--_avatar-initials\) \/ "";/)
  })

  it('强制配色下，单独的头像让首字母和默认图标跟随周围的颜色，组内头像不跟', () => {
    const forced = /@media \(forced-colors: active\)\s*\{([\s\S]*?)\n {2}\}/.exec(css)?.[1] ?? ''
    expect(forced).toMatch(/\.astryx-avatar:not\(\.astryx-avatar--group-item\) \.astryx-avatar__fallback\s*\{\s*color: currentColor;/)
  })
})
