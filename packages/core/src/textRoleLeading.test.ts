import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

// 设了某个文字角色字号的部位，也要设这个角色的行高，不靠继承来的行高。
// 继承来的行高可能是 reset 的 1.5，也可能是外层别的角色的行高，和这个字号对不上。

const stylesDir = join(__dirname, '../styles')
const ROLE_SIZE = /font-size:\s*var\(--astryx-text-(?:body|label|supporting|large|code|heading-\d|display-\d)-size/

// 字号只用来定图标大小，没有文字行。
const ICON_ONLY = new Set([
  '.astryx-collapsible-trigger > .astryx-collapsible-chevron.astryx-icon',
])

interface Rule { file: string, selector: string, body: string }

function rules(): Rule[] {
  return readdirSync(stylesDir).filter(name => name.endsWith('.css')).flatMap((file) => {
    const css = readFileSync(join(stylesDir, file), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')
    return [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(([, selector, body]) => ({
      file,
      selector: selector!.trim().replace(/\s+/g, ' '),
      body: body!,
    }))
  })
}

describe('文字角色的行高', () => {
  it('设了角色字号的规则也设了行高', () => {
    const missing = rules()
      .filter(rule => ROLE_SIZE.test(rule.body) && !/line-height:/.test(rule.body) && !ICON_ONLY.has(rule.selector))
      .map(rule => `${rule.file} ${rule.selector}`)
    expect(missing).toEqual([])
  })

  it('theme 里只继承的文字取主题的正文行高', () => {
    const theme = rules().find(rule => rule.file === 'theme.css' && rule.selector === '.astryx-theme')
    expect(theme?.body).toContain('line-height: var(--astryx-text-body-leading')
  })
})
