import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const styles = resolve(dirname(fileURLToPath(import.meta.url)), '../../styles')

describe('模态遮罩', () => {
  it.each(['dialog.css', 'drawer.css', 'mobile-nav.css'])('%s 的遮罩只有主题的暗色，没有模糊', (file) => {
    expect(readFileSync(resolve(styles, file), 'utf8')).not.toContain('backdrop-filter')
  })
})

describe('贴边子元素的圆角', () => {
  const css = readFileSync(resolve(styles, 'dialog.css'), 'utf8')

  it('内容区把对话框的圆角发布给贴边的表格和列表行', () => {
    expect(css).toMatch(/\.astryx-dialog__inner \{[^}]*--_container-corner-block-start: var\(--_dialog-radius\);[^}]*--_container-corner-block-end: var\(--_dialog-radius\)/)
  })

  it('全屏对话框没有圆角可以发布', () => {
    expect(css).toMatch(/\.astryx-dialog--fullscreen \{[^}]*--_dialog-radius: 0px/)
  })
})
