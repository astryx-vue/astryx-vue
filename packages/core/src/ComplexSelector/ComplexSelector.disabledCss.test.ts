// @vitest-environment node
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const css = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '../../styles/complex-selector.css'), 'utf8')

describe('complexSelector 禁用外观', () => {
  it.each(['ghost', 'secondary'])('%s 的 hover 排除 aria-disabled', (variant) => {
    const hover = css.split('\n').find(line => line.includes(`[data-variant='${variant}']`) && line.includes(':hover'))
    expect(hover).toContain('[aria-disabled=\'true\']')
  })

  it('禁用透明度和指针同时支持原生与 aria 两种形式', () => {
    const start = css.indexOf('.astryx-complex-selector:disabled')
    const disabled = css.slice(start, css.indexOf('}', start))
    expect(disabled).toContain('[aria-disabled=\'true\']')
  })
})
