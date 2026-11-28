import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import RichTextEditor from './RichTextEditor.vue'
import RichTextEditorToolbar from './RichTextEditorToolbar.vue'

const mounted: Array<{ unmount: () => void }> = []

afterEach(() => {
  for (const wrapper of mounted.splice(0))
    wrapper.unmount()
})

function mountEditor(slots: Record<string, () => unknown>): ReturnType<typeof mount> {
  const wrapper = mount(RichTextEditor, { props: { label: 'Notes' }, slots, attachTo: document.body })
  mounted.push(wrapper)
  return wrapper
}

describe('slots that render nothing count as absent', () => {
  it('draws no toolbar frame for a toolbar slot that renders nothing', async () => {
    const wrapper = mountEditor({ toolbar: () => [null, false, ''] })
    await nextTick()
    expect(wrapper.get('.astryx-richtext-editor').attributes('data-with-toolbar')).toBeUndefined()
  })

  it('marks the editor as having a toolbar when the slot renders one', async () => {
    const wrapper = mountEditor({ toolbar: () => h(RichTextEditorToolbar) })
    await nextTick()
    expect(wrapper.get('.astryx-richtext-editor').attributes('data-with-toolbar')).toBeDefined()
  })

  it('draws no extra divider for an end slot that renders nothing, and one for a slot that renders something', async () => {
    const dividers = async (end?: () => unknown): Promise<number> => {
      const wrapper = mountEditor({ toolbar: () => h(RichTextEditorToolbar, null, end == null ? {} : { end }) })
      await nextTick()
      return wrapper.findAll('.astryx-richtext-toolbar__divider').length
    }
    const base = await dividers()
    expect(await dividers(() => [null, false])).toBe(base)
    expect(await dividers(() => h('span', { class: 'extra' }, 'Saved'))).toBe(base + 1)
  })
})

describe('样式', () => {
  const read = (file: string): string => readFileSync(resolve(process.cwd(), 'packages/richtext/styles', file), 'utf8')

  it('粗指针下，编辑器聚焦外观立刻显示，不做淡入', () => {
    expect(read('richtext-editor.css')).toMatch(/@media \(pointer: coarse\) \{\n\s+\.astryx-richtext-editor \{\n\s+transition-duration: 0s;/)
  })

  it('没写语言的代码块在右边留出复制按钮的一列，写了语言的不留', () => {
    const css = read('richtext-document.css')
    expect(css).toMatch(/\.astryx-richtext__code:not\(\[data-language\]\),\n\s+\.astryx-richtext__code\[data-language='plaintext'\] \{\n\s+padding-inline-end: calc\(/)
  })
})
