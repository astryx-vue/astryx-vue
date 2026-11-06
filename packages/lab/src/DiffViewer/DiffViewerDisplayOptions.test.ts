import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import DiffViewer from './DiffViewer.vue'
import { parseUnifiedDiff } from './parseUnifiedDiff.js'

const [file] = parseUnifiedDiff(`--- a/src/value.ts
+++ b/src/value.ts
@@ -1 +1 @@
-const value = 1
+const value = 2
`)

describe('diffViewer 显示选项', () => {
  it.each(['classic', 'bars', 'none'] as const)('changeIndicator=%s 保留读屏标签并切换可见标记', (mode) => {
    const wrapper = mount(DiffViewer, { props: { file, changeIndicator: mode } })
    const table = wrapper.get('table')
    const markers = wrapper.findAll('.astryx-diff-viewer__marker')

    expect(table.attributes('data-change-indicator')).toBe(mode)
    expect(markers.map(marker => marker.text()).join('')).toContain('Removed')
    expect(markers.map(marker => marker.text()).join('')).toContain('Added')
    if (mode === 'classic')
      expect(markers.map(marker => marker.text()).join('')).toContain('-')
    else
      expect(markers.map(marker => marker.text()).join('')).not.toContain('-')
  })

  it('hasChangeBackground=false 只关闭行底色，不关闭其他标记', () => {
    const wrapper = mount(DiffViewer, {
      props: { file, hasChangeBackground: false, inlineHighlight: 'char' },
    })
    const table = wrapper.get('table')

    expect(table.attributes('data-change-background')).toBe('false')
    expect(table.findAll('[data-diff-change]').length).toBeGreaterThan(0)
    expect(table.text()).toContain('Added')
    expect(table.text()).toContain('Removed')
  })

  it('样式支持 bars 和关闭行底色', () => {
    const css = readFileSync(join(process.cwd(), 'packages/lab/styles/diff-viewer.css'), 'utf8')
    expect(css).toContain('data-change-indicator=\'bars\'')
    expect(css).toContain('border-inline-start-style: dashed')
    expect(css).toContain('data-change-background=\'false\'')
  })
})
