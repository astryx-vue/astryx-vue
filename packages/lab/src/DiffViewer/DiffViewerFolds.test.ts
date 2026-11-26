import type { VueWrapper } from '@vue/test-utils'
import type { VNodeChild } from 'vue'
import type { DiffViewerFile, DiffViewerLineRef } from './diffTypes.js'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import DiffViewer from './DiffViewer.vue'

enableAutoUnmount(afterEach)
afterEach(() => {
  document.body.innerHTML = ''
})

// createDiffFile 给「太大、没法逐行比较」的改动的形状：上下文、所有旧行删掉、所有新行加上。
const LINE_COUNT = 3
const numbers = Array.from({ length: LINE_COUNT }, (_, i) => i)
const REPLACED: DiffViewerFile = {
  oldPath: 'big.txt',
  newPath: 'big.txt',
  status: 'modified',
  isBinary: false,
  hunks: [{
    header: `@@ -1,${LINE_COUNT + 2} +1,${LINE_COUNT + 2} @@`,
    oldStart: 1,
    oldLines: LINE_COUNT + 2,
    newStart: 1,
    newLines: LINE_COUNT + 2,
    isReplacedBlock: true,
    lines: [
      { kind: 'context', content: 'head', oldLineNumber: 1, newLineNumber: 1 },
      ...numbers.map(i => ({ kind: 'removed' as const, content: `old ${i}`, oldLineNumber: i + 2, newLineNumber: null })),
      ...numbers.map(i => ({ kind: 'added' as const, content: `new ${i}`, oldLineNumber: null, newLineNumber: i + 2 })),
      { kind: 'context', content: 'tail', oldLineNumber: LINE_COUNT + 2, newLineNumber: LINE_COUNT + 2 },
    ],
  }],
}

function addedFile(count: number): DiffViewerFile {
  return {
    oldPath: null,
    newPath: 'generated.txt',
    status: 'added',
    isBinary: false,
    hunks: [{
      header: `@@ -0,0 +1,${count} @@`,
      oldStart: 0,
      oldLines: 0,
      newStart: 1,
      newLines: count,
      lines: Array.from({ length: count }, (_, i) => ({
        kind: 'added' as const,
        content: `line ${i}`,
        oldLineNumber: null,
        newLineNumber: i + 1,
      })),
    }],
  }
}

function mountViewer(props: { file: DiffViewerFile, viewMode?: 'unified' | 'split', renderLineAnnotation?: (ref: DiffViewerLineRef) => VNodeChild }): VueWrapper {
  return mount(DiffViewer, { attachTo: document.body, props })
}

function foldButton(wrapper: VueWrapper, name: 'Show full diff' | 'Hide full diff'): HTMLButtonElement | undefined {
  return wrapper.findAll('button')
    .map(button => button.element as HTMLButtonElement)
    .find(button => button.textContent?.trim() === name)
}

function bodyRows(wrapper: VueWrapper): number {
  return wrapper.findAll('tbody > tr').length
}

describe('diffViewer replaced blocks', () => {
  it('folds the changed lines behind a labeled control', () => {
    const wrapper = mountViewer({ file: REPLACED })
    expect(wrapper.text()).toContain('Large change: 6 lines')
    expect(foldButton(wrapper, 'Show full diff')?.getAttribute('aria-expanded')).toBe('false')
    // 片段头、前面的上下文、折叠行、后面的上下文。
    expect(bodyRows(wrapper)).toBe(4)
    expect(wrapper.find('[data-diff="removed"]').exists()).toBe(false)
    expect(wrapper.text()).toContain('head')
    expect(wrapper.text()).toContain('tail')
    // 文件头仍然统计整个改动。
    expect(wrapper.text()).toContain('3 lines added, 3 lines removed')
  })

  it('shows and hides the full diff, keeping focus on the control', async () => {
    const wrapper = mountViewer({ file: REPLACED })
    const show = foldButton(wrapper, 'Show full diff')!
    show.focus()
    show.click()
    await nextTick()
    const hide = foldButton(wrapper, 'Hide full diff')!
    expect(hide.getAttribute('aria-expanded')).toBe('true')
    expect(document.activeElement).toBe(hide)
    expect(wrapper.findAll('[data-diff="removed"]')).toHaveLength(LINE_COUNT)
    expect(wrapper.findAll('[data-diff="added"]')).toHaveLength(LINE_COUNT)
    // 整块替换的两边不是互相的改写，不做行内高亮。
    expect(wrapper.find('[data-diff-change]').exists()).toBe(false)
    hide.click()
    await nextTick()
    expect(foldButton(wrapper, 'Show full diff')?.getAttribute('aria-expanded')).toBe('false')
    expect(wrapper.find('[data-diff="added"]').exists()).toBe(false)
  })

  it('puts one control in split view', async () => {
    const wrapper = mountViewer({ file: REPLACED, viewMode: 'split' })
    expect(wrapper.findAll('button').filter(button => button.text() === 'Show full diff')).toHaveLength(1)
    expect(bodyRows(wrapper)).toBe(4)
    foldButton(wrapper, 'Show full diff')!.click()
    await nextTick()
    expect(bodyRows(wrapper)).toBe(4 + LINE_COUNT)
  })

  it('folds the block again for a new file', async () => {
    const wrapper = mountViewer({ file: REPLACED })
    foldButton(wrapper, 'Show full diff')!.click()
    await nextTick()
    await wrapper.setProps({ file: { ...REPLACED } })
    expect(foldButton(wrapper, 'Show full diff')).toBeDefined()
  })

  it('opens a block that holds an annotated line, and can still fold it', async () => {
    const wrapper = mountViewer({
      file: REPLACED,
      renderLineAnnotation: (ref: DiffViewerLineRef) =>
        ref.side === 'old' && ref.lineNumber === 3 ? h('span', 'Why was this removed?') : null,
    })
    expect(wrapper.text()).toContain('Why was this removed?')
    const hide = foldButton(wrapper, 'Hide full diff')!
    expect(hide.getAttribute('aria-expanded')).toBe('true')
    hide.click()
    await nextTick()
    expect(wrapper.text()).not.toContain('Why was this removed?')
    expect(wrapper.find('[data-diff="removed"]').exists()).toBe(false)
  })

  it('keeps a block folded when its annotations render nothing', () => {
    const wrapper = mountViewer({
      file: REPLACED,
      renderLineAnnotation: (ref: DiffViewerLineRef) => (ref.side === 'old' ? '' : false),
    })
    expect(foldButton(wrapper, 'Show full diff')?.getAttribute('aria-expanded')).toBe('false')
  })
})

describe('diffViewer large files', () => {
  it('folds a file with more than 2,000 changed lines until the reader opens it', async () => {
    const wrapper = mountViewer({ file: addedFile(2001) })
    expect(wrapper.text()).toContain('Large change: 2,001 lines')
    expect(wrapper.find('table').exists()).toBe(false)
    const show = foldButton(wrapper, 'Show full diff')!
    show.focus()
    show.click()
    await nextTick()
    const hide = foldButton(wrapper, 'Hide full diff')!
    expect(hide.getAttribute('aria-expanded')).toBe('true')
    expect(document.activeElement).toBe(hide)
    expect(wrapper.findAll('[data-diff="added"]')).toHaveLength(2001)
    hide.click()
    await nextTick()
    expect(wrapper.find('table').exists()).toBe(false)
  }, 60_000)

  it('shows a file with 2,000 changed lines without a fold', () => {
    const wrapper = mountViewer({ file: addedFile(2000) })
    expect(foldButton(wrapper, 'Show full diff')).toBeUndefined()
    expect(wrapper.findAll('[data-diff="added"]')).toHaveLength(2000)
  }, 60_000)

  it('opens a large file that has an annotated line', () => {
    const wrapper = mountViewer({
      file: addedFile(2001),
      renderLineAnnotation: (ref: DiffViewerLineRef) => (ref.lineNumber === 1500 ? h('span', 'Generated?') : null),
    })
    expect(wrapper.text()).toContain('Generated?')
    expect(foldButton(wrapper, 'Hide full diff')?.getAttribute('aria-expanded')).toBe('true')
  }, 60_000)
})
