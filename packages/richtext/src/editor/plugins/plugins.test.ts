import type { LexicalEditor } from 'lexical'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import { markdownToEditorStateJSON } from '../../markdownSerializers.js'
import RichTextEditor from '../RichTextEditor.vue'
import { RichTextEditorAutoLinkPlugin } from './RichTextEditorAutoLinkPlugin.js'

const mounted: Array<{ unmount: () => void }> = []
function mountEditor(markdown: string, props: Record<string, unknown> = {}, slots: Record<string, () => unknown> = {}) {
  const wrapper = mount(RichTextEditor, {
    props: { label: 'Notes', defaultValue: markdownToEditorStateJSON(markdown), ...props },
    slots,
    attachTo: document.body,
  })
  mounted.push(wrapper)
  return wrapper
}

/**
 * 叠加层靠 requestAnimationFrame 量位置，量完再让 Vue 刷新。
 * 用真的 rAF 等一小会儿：换成同步的假实现，会在根元素挂上之前就量，量到的是空的。
 */
async function settle(): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 40))
  await nextTick()
  await nextTick()
}

afterEach(() => {
  for (const wrapper of mounted.splice(0))
    wrapper.unmount()
  document.body.innerHTML = ''
  vi.unstubAllGlobals()
})

const editorOf = (wrapper: ReturnType<typeof mountEditor>): LexicalEditor => (wrapper.vm as unknown as { getEditor: () => LexicalEditor }).getEditor()
const markdownOf = (wrapper: ReturnType<typeof mountEditor>): string => (wrapper.vm as unknown as { getMarkdown: () => string }).getMarkdown()

describe('task checkboxes', () => {
  it('draws one real checkbox beside each task item and none beside plain items', async () => {
    const wrapper = mountEditor('- [ ] open\n- [x] done\n- plain\n')
    await settle()
    const boxes = wrapper.findAll('[data-richtext-task-checkbox] input[type="checkbox"]')
    expect(boxes).toHaveLength(2)
    expect((boxes[0]!.element as HTMLInputElement).checked).toBe(false)
    expect((boxes[1]!.element as HTMLInputElement).checked).toBe(true)
  })

  it('names each checkbox from its item text', async () => {
    const wrapper = mountEditor('- [ ] buy milk\n')
    await settle()
    const box = wrapper.get('[data-richtext-task-checkbox] input')
    expect(box.attributes('aria-labelledby')).toBeDefined()
    const name = box.attributes('aria-labelledby')!.split(' ').map(id => document.getElementById(id)?.textContent ?? '').join(' ')
    expect(name).toContain('buy milk')
  })

  it('marks task items for the theme and lets each item own its checkbox', async () => {
    const wrapper = mountEditor('- [ ] one\n- plain\n')
    await settle()
    const items = wrapper.findAll('[role="textbox"] li')
    expect(items[0]!.element.hasAttribute('data-richtext-task')).toBe(true)
    expect(items[0]!.attributes('aria-owns')).toBe(wrapper.get('[data-richtext-task-checkbox]').attributes('id'))
    expect(items[1]!.element.hasAttribute('data-richtext-task')).toBe(false)
    expect(items[1]!.attributes('aria-owns')).toBeUndefined()
  })

  it('writes the change back to the document when a checkbox is clicked', async () => {
    const wrapper = mountEditor('- [ ] open\n')
    await settle()
    await wrapper.get('[data-richtext-task-checkbox] input').trigger('click')
    await settle()
    expect(markdownOf(wrapper).trim()).toBe('- [x] open')
  })

  it('takes the checkboxes out of the tab order', async () => {
    const wrapper = mountEditor('- [ ] open\n')
    await settle()
    expect(wrapper.get('[data-richtext-task-checkbox] input').attributes('tabindex')).toBe('-1')
  })

  it('does not change in a read-only editor', async () => {
    const wrapper = mountEditor('- [ ] open\n', { isReadOnly: true })
    await settle()
    await wrapper.get('[data-richtext-task-checkbox] input').trigger('click')
    await settle()
    expect(markdownOf(wrapper).trim()).toBe('- [ ] open')
  })

  it('follows edits: a new task item gets a checkbox, a removed one loses it', async () => {
    const wrapper = mountEditor('- [ ] one\n')
    await settle()
    expect(wrapper.findAll('[data-richtext-task-checkbox]')).toHaveLength(1)
    const editor = editorOf(wrapper)
    editor.setEditorState(editor.parseEditorState(markdownToEditorStateJSON('- [ ] one\n- [x] two\n')))
    await settle()
    expect(wrapper.findAll('[data-richtext-task-checkbox]')).toHaveLength(2)
    editor.setEditorState(editor.parseEditorState(markdownToEditorStateJSON('just text\n')))
    await settle()
    expect(wrapper.findAll('[data-richtext-task-checkbox]')).toHaveLength(0)
  })
})

describe('code block header', () => {
  it('names the language and offers a copy button', async () => {
    const wrapper = mountEditor('```js\nconst a = 1\n```\n')
    await settle()
    const header = wrapper.get('[data-richtext-code-header]')
    expect(header.text()).toContain('js')
    expect(header.find('button[aria-label="Copy code"]').exists()).toBe(true)
  })

  it('shows only the copy button, in the corner, for a block with no language', async () => {
    const wrapper = mountEditor('```\nplain\n```\n')
    await settle()
    const header = wrapper.get('[data-richtext-code-header]')
    expect(header.classes()).toContain('astryx-richtext-code-header--corner')
    expect(header.find('.astryx-richtext-code-header__title').exists()).toBe(false)
  })

  it('writes the block text to the clipboard when copy is pressed', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', { ...navigator, clipboard: { writeText } })
    const wrapper = mountEditor('```js\nconst a = 1\n```\n')
    await settle()
    await wrapper.get('[data-richtext-code-header] button').trigger('click')
    await settle()
    expect(writeText).toHaveBeenCalledWith('const a = 1')
  })

  it('draws one header per code block', async () => {
    const wrapper = mountEditor('```js\none\n```\n\ntext\n\n```py\ntwo\n```\n')
    await settle()
    expect(wrapper.findAll('[data-richtext-code-header]')).toHaveLength(2)
  })
})

describe('auto link', () => {
  async function typeInto(wrapper: ReturnType<typeof mountEditor>, text: string): Promise<void> {
    const { $createParagraphNode, $createTextNode, $getRoot, $getSelection, $isRangeSelection } = await import('lexical')
    const editor = editorOf(wrapper)
    await new Promise<void>(resolve => editor.update(() => {
      const node = $createTextNode('')
      $getRoot().clear().append($createParagraphNode().append(node))
      node.select(0, 0)
    }, { onUpdate: resolve }))
    for (const character of text) {
      await new Promise<void>(resolve => editor.update(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection))
          selection.insertText(character)
      }, { onUpdate: resolve }))
    }
    await new Promise(resolve => setTimeout(resolve, 10))
  }

  it('links a typed URL and opens it in a new tab', async () => {
    const wrapper = mountEditor('', {}, { default: () => h(RichTextEditorAutoLinkPlugin) })
    await settle()
    await typeInto(wrapper, 'see https://example.com now')
    const anchor = wrapper.get('[role="textbox"] a')
    expect(anchor.attributes('href')).toBe('https://example.com/')
    expect(anchor.attributes('target')).toBe('_blank')
    expect(anchor.attributes('rel')).toBe('noopener noreferrer')
  })

  it('links an email address as mailto', async () => {
    const wrapper = mountEditor('', {}, { default: () => h(RichTextEditorAutoLinkPlugin) })
    await settle()
    await typeInto(wrapper, 'mail me@example.com now')
    expect(wrapper.get('[role="textbox"] a').attributes('href')).toBe('mailto:me@example.com')
  })

  it('does nothing without the plugin', async () => {
    const wrapper = mountEditor('')
    await settle()
    await typeInto(wrapper, 'see https://example.com now')
    expect(wrapper.find('[role="textbox"] a').exists()).toBe(false)
  })

  it('reports a created link through the change event', async () => {
    const seen: Array<[string | null, string | null]> = []
    const wrapper = mountEditor('', {}, { default: () => h(RichTextEditorAutoLinkPlugin, { onChange: (url: string | null, prev: string | null) => seen.push([url, prev]) }) })
    await settle()
    await typeInto(wrapper, 'see https://example.com now')
    expect(seen.some(([url]) => url === 'https://example.com/')).toBe(true)
  })
})
