// @vitest-environment node
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const css = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '../../styles/link.css'), 'utf8')

function rule(selector: string): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`${escaped}\\s*\\{([^}]*)\\}`).exec(css)?.[1] ?? ''
}

describe('link 样式', () => {
  it('根元素到容器为止，长网址在行内换行', () => {
    expect(rule('.astryx-link.astryx-link')).toContain('max-width: 100%')
    expect(rule('.astryx-link__label')).toContain('min-width: 0')
  })

  it('按钮形态换行后和锚点一样跟随外面的对齐', () => {
    expect(rule('.astryx-link.astryx-link')).toContain('text-align: inherit')
  })

  it('截断的链接在弹性行里能收窄到比标签短', () => {
    expect(rule('.astryx-link.astryx-link--lines')).toContain('min-width: 0')
  })

  it('在会截断的 Text 里是行内元素，焦点框往里收', () => {
    const inClamp = rule('.astryx-link.astryx-link--in-clamp')
    expect(inClamp).toContain('display: inline')
    expect(inClamp).toContain('outline-offset: calc(-1 * var(--astryx-focus-outline-width, 2px))')
  })
})
