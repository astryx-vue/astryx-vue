// @vitest-environment node
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const TOP_NAV_CSS = resolve(dirname(fileURLToPath(import.meta.url)), '../../styles/top-nav.css')

describe('top-nav 窄屏布局', () => {
  it('右侧操作区不随长标题收缩，菜单按钮才能留在视口里', () => {
    const css = readFileSync(TOP_NAV_CSS, 'utf8')
    const endRule = /\.astryx-top-nav__end\s*\{([^}]*)\}/.exec(css)?.[1] ?? ''

    expect(endRule).toContain('flex-shrink: 0')
  })

  it('标题带 NavIcon 时去掉起始内边距，标志与上游一样贴齐左边', () => {
    const css = readFileSync(TOP_NAV_CSS, 'utf8')
    const rule = /\.astryx-top-nav-heading:has\(\.astryx-nav-icon\)\s*\{([^}]*)\}/.exec(css)?.[1] ?? ''

    expect(rule).toContain('padding-inline-start: 0')
  })
})
