import { readFileSync } from 'node:fs'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { createDiffFile } from './createDiffFile.js'
import DiffViewer from './DiffViewer.vue'

afterEach(() => {
  document.body.innerHTML = ''
})

describe('diffViewer 分栏滚动', () => {
  it('左右代码区同步横向滚动，行号不参与滚动', async () => {
    const file = createDiffFile({
      oldValue: 'const aVeryLongName = "before value that stays on its own side"',
      newValue: 'const aVeryLongName = "after value that is also long enough to scroll"',
      path: 'src/long.ts',
    })
    const wrapper = mount(DiffViewer, {
      attachTo: document.body,
      props: { file, viewMode: 'split', isWrapped: false },
    })
    const table = wrapper.get('table')
    const panes = wrapper.findAll<HTMLElement>('[data-pane]')
    expect(panes).toHaveLength(2)

    ;(panes[0]!.element as HTMLElement).scrollLeft = 40
    await panes[0]!.trigger('scroll')
    await nextTick()
    expect(panes.map(pane => (pane.element as HTMLElement).scrollLeft)).toEqual([40, 40])
    expect(table.attributes('data-view-mode')).toBe('split')
    expect(table.find('.astryx-diff-viewer__gutter').exists()).toBe(true)
  })

  it('使用固定分栏、独立代码滚动区和禁止横向回弹', () => {
    const css = readFileSync('packages/lab/styles/diff-viewer.css', 'utf8')
    expect(css).toContain('data-view-mode=\'split\'')
    expect(css).toContain('table-layout: fixed')
    expect(css).toContain('overscroll-behavior-inline: contain')
    expect(css).toContain('position: sticky')
  })
})
