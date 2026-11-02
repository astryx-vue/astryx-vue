import type { DOMWrapper, VueWrapper } from '@vue/test-utils'
import type { VNodeChild } from 'vue'
import type { DiffViewerLineRef } from './diffTypes.js'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import DiffViewer from './DiffViewer.vue'
import { parseUnifiedDiff } from './parseUnifiedDiff.js'

enableAutoUnmount(afterEach)
afterEach(() => {
  document.body.innerHTML = ''
})

const PATCH = `diff --git a/src/greet.ts b/src/greet.ts
--- a/src/greet.ts
+++ b/src/greet.ts
@@ -1,4 +1,5 @@
 export function greet(name: string) {
-  return 'Hello ' + name;
+  const greeting = 'Hello';
+  return \`\${greeting}, \${name}\`;
 }
 
`

const [FILE] = parseUnifiedDiff(PATCH)

function mountViewer(
  props: Record<string, unknown> = {},
  options: { attrs?: Record<string, unknown>, slots?: Record<string, () => VNodeChild> } = {},
): VueWrapper {
  return mount(DiffViewer, {
    attachTo: document.body,
    props: { file: FILE, ...props },
    attrs: options.attrs,
    slots: options.slots,
  })
}

function codeRows(wrapper: VueWrapper): DOMWrapper<Element>[] {
  return wrapper.findAll('tbody tr')
}

function changedText(wrapper: VueWrapper, kind: 'added' | 'removed'): string[] {
  return Array.from((wrapper.element as HTMLElement).querySelectorAll<HTMLElement>(`[data-diff="${kind}"] [data-diff-change]`))
    .map(span => span.textContent ?? '')
}

describe('diffViewer', () => {
  it('renders the path, the change counts, and every line', () => {
    const wrapper = mountViewer()
    expect(wrapper.get('.astryx-diff-viewer__path').text()).toBe('src/greet.ts')
    expect(wrapper.get('.astryx-diff-viewer__stat-added').text()).toBe('+2')
    expect(wrapper.get('.astryx-diff-viewer__stat-removed').text()).toBe('−1')
    expect(wrapper.text()).toContain('2 lines added, 1 line removed')
    expect(wrapper.text()).toContain('@@ -1,4 +1,5 @@')
    expect(wrapper.text()).toContain('const')
  })

  it('keeps code text intact through syntax highlighting', () => {
    const wrapper = mountViewer()
    const removed = wrapper.get('td[data-diff="removed"]')
    expect(removed.element.textContent).toBe('  return \'Hello \' + name;')
    expect(wrapper.find('.astryx-token-keyword').exists()).toBe(true)
  })

  it('marks changed lines for assistive technology', () => {
    const wrapper = mountViewer()
    expect(wrapper.findAll('td[data-diff="added"]')).toHaveLength(2)
    expect(wrapper.text().match(/Added/g)).toHaveLength(2)
    expect(wrapper.text().match(/Removed/g)).toHaveLength(1)
  })

  it('renders one row per line plus the hunk header in unified view', () => {
    expect(codeRows(mountViewer())).toHaveLength(7)
  })

  it('pairs removed and added lines side by side in split view', () => {
    const rows = codeRows(mountViewer({ viewMode: 'split' }))
    expect(rows).toHaveLength(6)
    expect(rows[2].find('td[data-diff="removed"]').exists()).toBe(true)
    expect(rows[2].find('td[data-diff="added"]').exists()).toBe(true)
    expect(rows[3].find('td[data-diff="removed"]').exists()).toBe(false)
    expect(rows[3].find('td[data-diff="added"]').exists()).toBe(true)
  })

  it('hides the line-number gutters when hasLineNumbers is false', () => {
    const firstLine = codeRows(mountViewer({ hasLineNumbers: false }))[1]
    expect(firstLine.findAll('td')).toHaveLength(2)
  })

  it('collapses and expands from the header', async () => {
    const onCollapsedChange = vi.fn()
    const wrapper = mountViewer({}, { attrs: { onCollapsedChange } })
    const toggle = wrapper.get('button')
    expect(toggle.attributes('aria-expanded')).toBe('true')
    expect(toggle.attributes('aria-controls')).toBeTruthy()

    await toggle.trigger('click')
    expect(onCollapsedChange).toHaveBeenLastCalledWith(true)
    expect(toggle.attributes('aria-expanded')).toBe('false')
    expect(wrapper.find('table').exists()).toBe(false)

    await toggle.trigger('click')
    expect(onCollapsedChange).toHaveBeenLastCalledWith(false)
    expect(wrapper.find('table').exists()).toBe(true)
  })

  it('follows a controlled collapsed state', async () => {
    const onCollapsedChange = vi.fn()
    const wrapper = mountViewer({ isCollapsed: true }, { attrs: { onCollapsedChange } })
    await wrapper.get('button').trigger('click')
    expect(onCollapsedChange).toHaveBeenCalledWith(false)
    expect(wrapper.find('table').exists()).toBe(false)
  })

  it('renders the path as plain text when not collapsible', () => {
    const wrapper = mountViewer({ isCollapsible: false })
    expect(wrapper.find('button').exists()).toBe(false)
    expect(wrapper.get('.astryx-diff-viewer__path').text()).toBe('src/greet.ts')
  })

  it('renders annotation rows under the lines they belong to', () => {
    const seen: DiffViewerLineRef[] = []
    const wrapper = mountViewer({
      renderLineAnnotation: (ref: DiffViewerLineRef) => {
        seen.push(ref)
        return ref.side === 'new' && ref.lineNumber === 2 ? h('p', 'Nice rename') : null
      },
    })
    expect(wrapper.text()).toContain('Nice rename')
    expect([...new Set(seen.map(ref => `${ref.side}${ref.lineNumber}`))]).toEqual(['new1', 'old2', 'new2', 'new3', 'new4', 'new5'])
    const rows = codeRows(wrapper)
    const noteRow = rows.findIndex(row => row.text() === 'Nice rename')
    expect(rows[noteRow - 1].find('td[data-diff="added"]').element.textContent).toBe('  const greeting = \'Hello\';')
  })

  it('draws one annotation row on top of the lines in both views', () => {
    for (const viewMode of ['unified', 'split'] as const) {
      const wrapper = mountViewer({
        viewMode,
        renderLineAnnotation: (ref: DiffViewerLineRef) =>
          ref.side === 'new' && ref.lineNumber === 2 ? h('p', 'Only note') : null,
      })
      expect(wrapper.text()).toContain('Only note')
      expect(wrapper.findAll('tbody tr')).toHaveLength(viewMode === 'unified' ? 8 : 7)
      wrapper.unmount()
    }
  })

  it('places split-view annotations on their own side', () => {
    const wrapper = mountViewer({
      viewMode: 'split',
      renderLineAnnotation: (ref: DiffViewerLineRef) =>
        ref.side === 'old' && ref.lineNumber === 2 ? h('p', 'Old note') : null,
    })
    const note = wrapper.get('p')
    const row = note.element.closest('tr') as HTMLElement
    expect(row.children).toHaveLength(2)
    expect(row.children[0].contains(note.element)).toBe(true)
    expect(wrapper.findAll('tbody tr')).toHaveLength(7)
  })

  it('makes line numbers buttons that report their line', async () => {
    const onLineNumberClick = vi.fn()
    const wrapper = mountViewer({}, { attrs: { onLineNumberClick } })
    const buttons = wrapper.findAll('button[data-diff-line-button]')
    expect(buttons).toHaveLength(6)
    await buttons[0].trigger('click')
    expect(onLineNumberClick).toHaveBeenCalledTimes(1)
    expect(onLineNumberClick.mock.calls[0][0]).toMatchObject({ side: 'new', lineNumber: 1, hunkIndex: 0 })
  })

  it('makes only the anchor side of each line a button, labelled with the line it reports', async () => {
    for (const viewMode of ['unified', 'split'] as const) {
      const onLineNumberClick = vi.fn()
      const wrapper = mountViewer({ viewMode }, { attrs: { onLineNumberClick } })
      const buttons = wrapper.findAll('button[data-diff-line-button]')
      expect(buttons).toHaveLength(6)

      for (const button of buttons) {
        await button.trigger('click')
        const ref = onLineNumberClick.mock.calls.at(-1)?.[0] as DiffViewerLineRef
        const side = ref.side === 'old' ? 'Original' : 'Changed'
        expect(button.attributes('aria-label')).toBe(`${side} line ${ref.lineNumber}`)
      }

      expect(wrapper.findAll('button[data-diff-line-button][aria-label="Original line 1"]')).toHaveLength(0)
      wrapper.unmount()
    }
  })

  it('names every column for assistive technology', () => {
    const unified = mountViewer()
    expect(unified.findAll('th').map(th => th.text())).toEqual([
      'Original line number',
      'Changed line number',
      'Change',
      'Code',
    ])
    unified.unmount()

    const split = mountViewer({ viewMode: 'split', hasLineNumbers: false })
    expect(split.findAll('th').map(th => th.text())).toEqual([
      'Change',
      'Original code',
      'Change',
      'Changed code',
    ])
  })

  it('shows the file status and the rename path', () => {
    const [renamed] = parseUnifiedDiff('diff --git a/a.ts b/b.ts\nrename from a.ts\nrename to b.ts\n')
    const wrapper = mountViewer({ file: renamed })
    expect(wrapper.text()).toContain('Renamed')
    expect(wrapper.text()).toContain('a.ts → b.ts')
    expect(wrapper.text()).toContain('No content changes')
  })

  it('shows a message for binary files', () => {
    const [binary] = parseUnifiedDiff('diff --git a/x.png b/x.png\nBinary files a/x.png and b/x.png differ\n')
    const wrapper = mountViewer({ file: binary })
    expect(wrapper.text()).toContain('Binary file not shown')
  })

  it('renders the headerEnd slot', () => {
    const wrapper = mountViewer({}, { slots: { headerEnd: () => h('button', 'Viewed') } })
    const header = wrapper.get('.astryx-diff-viewer__header')
    expect(header.findAll('button').at(-1)?.text()).toBe('Viewed')
  })

  it('forwards class and DOM attributes to the root', () => {
    const wrapper = mountViewer(
      { viewMode: 'split' },
      { attrs: { 'class': 'custom', 'data-testid': 'viewer' } },
    )
    const root = wrapper.get('[data-testid="viewer"]')
    expect(root.classes()).toContain('astryx-diff-viewer')
    expect(root.classes()).toContain('custom')
    expect(root.attributes('data-view-mode')).toBe('split')
  })

  it('highlights changed words by default and can turn the highlight off', () => {
    const [file] = parseUnifiedDiff('@@ -1 +1 @@\n-const total = price * qty;\n+const total = price * quantity;\n')
    const wrapper = mountViewer({ file })
    expect(changedText(wrapper, 'removed')).toEqual(['qty'])
    expect(changedText(wrapper, 'added')).toEqual(['quantity'])

    wrapper.unmount()
    const plain = mountViewer({ file, inlineHighlight: 'none' })
    expect(changedText(plain, 'removed')).toEqual([])
    expect(changedText(plain, 'added')).toEqual([])
  })

  it('compares characters when inlineHighlight is char', () => {
    const [file] = parseUnifiedDiff('@@ -1 +1 @@\n-color\n+colour\n')
    const wrapper = mountViewer({ file, inlineHighlight: 'char' })
    expect(changedText(wrapper, 'added')).toEqual(['u'])
  })

  it('wraps lines and applies a maximum height', () => {
    const wrapper = mountViewer({ isWrapped: true, maxHeight: 200 })
    expect(wrapper.get('table').classes()).toContain('astryx-diff-viewer__table--wrapped')
    expect((wrapper.get('.astryx-diff-viewer__viewport').element as HTMLElement).style.maxHeight).toBe('200px')
  })
})
