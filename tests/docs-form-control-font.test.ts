import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const css = readFileSync(resolve(__dirname, '../apps/docs/styles/global.css'), 'utf8')

/** 顶层（不在 @layer / @media 里）的规则块，只看「选择器 { 声明 }」。 */
function topLevelRules(source: string) {
  const rules: Array<{ selector: string, body: string }> = []
  let depth = 0
  let start = 0
  let bodyStart = 0
  const stripped = source.replace(/\/\*[\s\S]*?\*\//g, '')
  for (let i = 0; i < stripped.length; i++) {
    const ch = stripped[i]
    if (ch === '{') {
      if (depth === 0) {
        bodyStart = i + 1
      }
      depth += 1
    }
    else if (ch === '}') {
      depth -= 1
      if (depth === 0) {
        rules.push({ selector: stripped.slice(start, bodyStart - 1).trim(), body: stripped.slice(bodyStart, i) })
        start = i + 1
      }
    }
    else if (ch === ';' && depth === 0) {
      start = i + 1
    }
  }
  return rules
}

describe('docs shell does not pin form-control font weight', () => {
  it('has no unlayered rule that pins a font-weight value on button or input', () => {
    const offenders = topLevelRules(css)
      .filter(rule => !rule.selector.startsWith('@'))
      .filter(rule => /(?:^|[\s,>+~(])(?:button|input|select|textarea)\b/.test(rule.selector))
      .filter(rule => /(?:^|[;\s])font-weight\s*:\s*(?!\s|revert-layer)/.test(rule.body))
      .map(rule => rule.selector)
    expect(offenders).toEqual([])
  })
})
