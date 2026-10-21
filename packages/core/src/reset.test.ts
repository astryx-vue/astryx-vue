import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { beforeAll, describe, expect, it } from 'vitest'

// reset.css 是纯样式表，这里直接断言它的源码文本。
// happy-dom 的 CSSOM 会丢掉嵌套在 @layer / @supports 里的声明，不能拿来验证。

const resetPath = resolve(__dirname, '../reset.css')
const rawCss = readFileSync(resetPath, 'utf8')
const css = rawCss.replace(/\/\*[\s\S]*?\*\//g, '')

interface RuleBlock { selector: string, body: string }

/** 每个最内层的 `选择器 { 声明 }`。`[^{}]` 把 @layer 之类的前导排除在选择器之外。 */
function parseRuleBlocks(source: string): RuleBlock[] {
  return [...source.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
    .map(([, selector, body]) => ({ selector: selector.trim(), body }))
}

/** 每个 :where() / :is() 的参数，嵌套的也算。 */
function forgivingListArguments(selector: string): string[] {
  return [...selector.matchAll(/:(?:where|is)\(/g)].map((match) => {
    const start = match.index + match[0].length
    let depth = 1
    let end = start
    for (; end < selector.length && depth > 0; end++) {
      if (selector[end] === '(')
        depth++
      else if (selector[end] === ')')
        depth--
    }
    return selector.slice(start, end - 1)
  })
}

/** 按顶层逗号切开的选择器列表。 */
function topLevelSelectors(list: string): string[] {
  const selectors: string[] = []
  let depth = 0
  let start = 0
  for (let index = 0; index < list.length; index++) {
    if (list[index] === '(') {
      depth++
    }
    else if (list[index] === ')') {
      depth--
    }
    else if (list[index] === ',' && depth === 0) {
      selectors.push(list.slice(start, index).trim())
      start = index + 1
    }
  }
  selectors.push(list.slice(start).trim())
  return selectors
}

describe('reset.css structure', () => {
  let blocks: RuleBlock[]

  beforeAll(() => {
    blocks = parseRuleBlocks(css)
  })

  it('parses rule blocks out of the file', () => {
    // 防止下面的断言因为解析失败而空转。
    expect(blocks.length).toBeGreaterThan(20)
    expect(blocks.some(({ body }) => body.includes('box-sizing: border-box'))).toBe(true)
  })

  it('registers the layer order on its first statement', () => {
    const firstStatement = css.trim().split(';')[0]
    expect(firstStatement).toBe('@layer astryx.reset, astryx.tokens, astryx.base, astryx.components, astryx.overrides')
  })

  it('puts every rule inside @layer astryx.reset', () => {
    const afterOrder = css.slice(css.indexOf(';') + 1).trim()
    expect(afterOrder.startsWith('@layer astryx.reset {')).toBe(true)
    // 层块之外不该再有规则：去掉这个块以后什么都不剩。
    const layerStart = afterOrder.indexOf('{')
    let depth = 0
    let layerEnd = -1
    for (let index = layerStart; index < afterOrder.length; index++) {
      if (afterOrder[index] === '{') {
        depth++
      }
      else if (afterOrder[index] === '}' && --depth === 0) {
        layerEnd = index
        break
      }
    }
    expect(layerEnd).toBeGreaterThan(layerStart)
    expect(afterOrder.slice(layerEnd + 1).trim()).toBe('')
  })

  it('has no !important', () => {
    expect(rawCss).not.toMatch(/!\s*important/i)
  })

  it('keeps every selector at zero specificity', () => {
    // 每个顶层选择器都由 :where() 打头，伪元素写在 :where() 之后。
    for (const { selector } of blocks) {
      for (const single of topLevelSelectors(selector)) {
        if (single.startsWith('@'))
          continue
        expect(single, `selector "${single}"`).toMatch(/^:where\(/)
      }
    }
  })

  it('does not suppress :focus-visible outlines (WCAG 2.4.7)', () => {
    for (const { selector, body } of blocks.filter(({ selector }) => selector.includes(':focus-visible')))
      expect.soft(body, `rule "${selector}" must keep the outline`).not.toMatch(/outline(?:-style|-width)?\s*:\s*(?:none|0)/)
  })
})

describe('reset.css disabled cursor', () => {
  it('gives disabled and aria-disabled elements the default cursor', () => {
    const blocks = parseRuleBlocks(css)
    const disabledBlocks = blocks.filter(({ selector }) =>
      selector.includes(':disabled') && !selector.includes(':not('))
    expect(disabledBlocks.length).toBeGreaterThan(0)
    for (const { selector, body } of disabledBlocks)
      expect(body, `disabled rule "${selector}"`).toMatch(/cursor:\s*default/)
    expect(disabledBlocks.some(({ selector }) => selector.includes('aria-disabled'))).toBe(true)
  })

  it('never uses not-allowed', () => {
    expect(css).not.toContain('not-allowed')
  })
})

describe('reset.css pseudo-element rules', () => {
  const blocks = parseRuleBlocks(css)

  it('keeps every pseudo-element outside :where() and :is()', () => {
    // 伪元素放进 :where() 会被宽容选择器列表静默丢掉，声明就到不了伪元素。
    for (const { selector } of blocks) {
      for (const argument of forgivingListArguments(selector)) {
        expect
          .soft(argument, `"${selector}" puts a pseudo-element in a list`)
          .not
          .toMatch(/::|:(?:before|after|first-line|first-letter)\b/)
      }
    }
  })

  it('targets ::before, ::after, ::placeholder and the search field parts', () => {
    const endsWith = (declaration: string, pseudoElement: string) =>
      blocks
        .filter(({ body }) => body.includes(declaration))
        .flatMap(({ selector }) => topLevelSelectors(selector))
        .some(selector => selector.endsWith(pseudoElement))

    for (const declaration of ['box-sizing: border-box', 'border-style: solid']) {
      expect(endsWith(declaration, '::before'), declaration).toBe(true)
      expect(endsWith(declaration, '::after'), declaration).toBe(true)
    }
    expect(endsWith('opacity: 1', '::placeholder')).toBe(true)
    expect(endsWith('-webkit-appearance: none', '::-webkit-search-decoration')).toBe(true)
    expect(endsWith('-webkit-appearance: none', '::-webkit-search-cancel-button')).toBe(true)
  })

  it('falls back to the neutral --astryx-color-text-secondary for placeholders', () => {
    // 只引入 reset 的页面没有这个变量，兜底值和中性主题的默认值保持一致。
    const neutral = readFileSync(resolve(__dirname, '../../themes/neutral/base.css'), 'utf8')
    const tokenDefault = neutral.match(/--astryx-color-text-secondary:\s*([^;\s][^;]*);/)?.[1]
    expect(tokenDefault).toMatch(/^light-dark\(/)
    const placeholder = blocks.find(({ selector }) => selector.endsWith('::placeholder'))
    expect(placeholder?.body).toContain(`color: var(--astryx-color-text-secondary, ${tokenDefault});`)
  })
})

describe('reset.css and hidden="until-found"', () => {
  it('sets display: none only on hidden elements that are not until-found', () => {
    // 浏览器用 content-visibility: hidden 藏起 until-found 的内容，页内查找和
    // 文本片段链接能搜到并展开它。同时命中它的 display: none 会让内容脱离两者。
    const hiddenRules = parseRuleBlocks(css).filter(({ selector }) => selector.includes('[hidden'))
    expect(hiddenRules.length).toBeGreaterThan(0)
    for (const { selector, body } of hiddenRules) {
      if (/display:\s*none/.test(body))
        expect(selector).toContain(':not([hidden=\'until-found\' i])')
    }
  })
})

describe('reset.css and AspectRatio fit', () => {
  it('sizes fit children after the media height: auto rule, so load order does not matter', () => {
    // 两条规则同在 reset 层、特异性都是 0，后出现的赢。fit 子元素的规则排在
    // `:where(img, video) { height: auto }` 后面，图片才能填满 AspectRatio。
    const blocks = parseRuleBlocks(css)
    const media = blocks.findIndex(({ selector, body }) => selector === ':where(img, video)' && /height:\s*auto/.test(body))
    const fit = blocks.findIndex(({ selector, body }) => selector.includes('data-astryx-aspect-ratio-override') && /height:\s*100%/.test(body))
    expect(media).toBeGreaterThanOrEqual(0)
    expect(fit).toBeGreaterThan(media)
  })
})
