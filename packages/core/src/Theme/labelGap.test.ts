import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { compileComponentRules } from './componentStyles.js'

const stylesDir = join(process.cwd(), 'packages/core/styles')

// 复选框和开关的目标是外层字段，它自己的 gap 是状态消息上方的间距。
// 主题写的 gap 只改控件和标签之间的距离，不碰外层。
describe('主题设置复选框、开关和标签之间的间距', () => {
  it.each([
    ['checkbox-input', '--_checkbox-input-gap', 'checkbox-input.css', '.astryx-checkbox-row'],
    ['switch', '--_switch-gap', 'switch.css', '.astryx-switch-row'],
  ])('%s', (target, variable, stylesheet, row) => {
    const [rule] = compileComponentRules({ [target]: { base: { gap: '3px' } } }, '')
    expect(rule).toContain(`${variable}: 3px`)
    expect(rule).not.toMatch(/(?:^|\s)gap:/)

    const css = readFileSync(join(stylesDir, stylesheet), 'utf8')
    const rowRule = css.slice(css.indexOf(`${row} {`))
    expect(rowRule.slice(0, rowRule.indexOf('}'))).toContain(`gap: var(${variable}, var(--astryx-spacing-2, 8px))`)
  })
})
