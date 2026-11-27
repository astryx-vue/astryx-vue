import { afterEach, describe, expect, it } from 'vitest'
import { readAccessibleName } from './accessibleName.js'

afterEach(() => {
  document.body.innerHTML = ''
})

function html(markup: string): HTMLElement {
  document.body.innerHTML = markup
  return document.body.firstElementChild as HTMLElement
}

describe('readAccessibleName', () => {
  it('aria-labelledby 指向的文字最优先，aria-hidden 的部分不算', () => {
    const button = html('<div><button aria-labelledby="a b" aria-label="no">x</button><span id="a">First<i aria-hidden="true">!</i></span><span id="b">Second</span></div>').querySelector('button')!
    expect(readAccessibleName(button)).toBe('First Second')
  })

  it('依次是 aria-label、自己的文字、title', () => {
    expect(readAccessibleName(html('<button aria-label="Close">x</button>'))).toBe('Close')
    expect(readAccessibleName(html('<button>  Open   menu </button>'))).toBe('Open menu')
    expect(readAccessibleName(html('<button title="Tip"></button>'))).toBe('Tip')
    expect(readAccessibleName(html('<button></button>'))).toBeUndefined()
  })

  it('只有图标的按钮靠图片 alt、里面的 aria-label 或 svg 的 title 命名', () => {
    expect(readAccessibleName(html('<button><img alt="Settings" src="x.png"></button>'))).toBe('Settings')
    expect(readAccessibleName(html('<button><span aria-label="Profile"></span></button>'))).toBe('Profile')
    expect(readAccessibleName(html('<button><svg><title>Share</title></svg></button>'))).toBe('Share')
  })

  it('表单控件用自己的 label，input 按钮用 value', () => {
    const input = html('<div><label for="q">Search</label><input id="q"></div>').querySelector('input')!
    expect(readAccessibleName(input)).toBe('Search')
    expect(readAccessibleName(html('<input type="submit" value="Send">'))).toBe('Send')
  })

  it('没有元素时返回 undefined', () => {
    expect(readAccessibleName(null)).toBeUndefined()
  })
})
