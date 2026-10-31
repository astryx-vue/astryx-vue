import type { LexicalEditor } from 'lexical'
import { mount } from '@vue/test-utils'
import { $createParagraphNode, $createTextNode, $getRoot, $getSelection, $isRangeSelection } from 'lexical'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { useLexicalEditor } from './context.js'
import RichTextEditor from './RichTextEditor.vue'

const mounted: Array<{ unmount: () => void }> = []
function mountEditor(props: Record<string, unknown> = {}, slots: Record<string, () => unknown> = {}) {
  const wrapper = mount(RichTextEditor, { props: { label: 'Notes', ...props }, slots, attachTo: document.body })
  mounted.push(wrapper)
  return wrapper
}

afterEach(() => {
  for (const wrapper of mounted.splice(0))
    wrapper.unmount()
})

function write(wrapper: ReturnType<typeof mountEditor>, text: string): Promise<void> {
  const editor = (wrapper.vm as unknown as { getEditor: () => LexicalEditor }).getEditor()
  return new Promise(resolve => editor.update(() => {
    $getRoot().clear().append($createParagraphNode().append($createTextNode(text)))
  }, { onUpdate: resolve }))
}

describe('richTextEditor accessible name and state', () => {
  it('is a labelled multiline textbox', async () => {
    const wrapper = mountEditor()
    await nextTick()
    const box = wrapper.get('[role="textbox"]')
    expect(box.attributes('aria-multiline')).toBe('true')
    expect(box.attributes('contenteditable')).toBe('true')
    const label = wrapper.get('label')
    expect(box.attributes('aria-labelledby')).toContain(label.attributes('id'))
  })

  it('names the textbox directly when the label is hidden', async () => {
    const wrapper = mountEditor({ isLabelHidden: true })
    await nextTick()
    const box = wrapper.get('[role="textbox"]')
    expect(box.attributes('aria-label')).toBe('Notes')
    expect(box.attributes('aria-labelledby')).toBeUndefined()
  })

  it('announces required and invalid state', async () => {
    const wrapper = mountEditor({ isRequired: true, status: { type: 'error', message: 'Too short' } })
    await nextTick()
    const box = wrapper.get('[role="textbox"]')
    expect(box.attributes('aria-required')).toBe('true')
    expect(box.attributes('aria-invalid')).toBe('true')
  })

  it('keeps a read-only editor focusable and announced read-only', async () => {
    const wrapper = mountEditor({ isReadOnly: true })
    await nextTick()
    const box = wrapper.get('[role="textbox"]')
    expect(box.attributes('contenteditable')).toBe('false')
    expect(box.attributes('aria-readonly')).toBe('true')
    expect(box.attributes('tabindex')).toBe('0')
    expect(box.attributes('aria-disabled')).toBeUndefined()
  })

  it('takes a disabled editor out of the tab order and announces it disabled', async () => {
    const wrapper = mountEditor({ isDisabled: true })
    await nextTick()
    const box = wrapper.get('[role="textbox"]')
    expect(box.attributes('contenteditable')).toBe('false')
    expect(box.attributes('aria-disabled')).toBe('true')
    expect(box.attributes('aria-readonly')).toBeUndefined()
    expect(box.attributes('tabindex')).toBeUndefined()
  })

  it('lets disabled win when both are set', async () => {
    const wrapper = mountEditor({ isReadOnly: true, isDisabled: true })
    await nextTick()
    const box = wrapper.get('[role="textbox"]')
    expect(box.attributes('aria-disabled')).toBe('true')
    expect(box.attributes('aria-readonly')).toBeUndefined()
  })

  it('follows isReadOnly and isDisabled changes after mount', async () => {
    const wrapper = mountEditor()
    await nextTick()
    expect(wrapper.get('[role="textbox"]').attributes('contenteditable')).toBe('true')
    await wrapper.setProps({ isReadOnly: true })
    await nextTick()
    expect(wrapper.get('[role="textbox"]').attributes('contenteditable')).toBe('false')
    expect(wrapper.get('[role="textbox"]').attributes('aria-readonly')).toBe('true')
    await wrapper.setProps({ isReadOnly: false })
    await nextTick()
    expect(wrapper.get('[role="textbox"]').attributes('contenteditable')).toBe('true')
    expect(wrapper.get('[role="textbox"]').attributes('aria-readonly')).toBeUndefined()
  })

  it('points aria-describedby at the Tab-escape hint, and omits it when read-only', async () => {
    const wrapper = mountEditor()
    await nextTick()
    const hint = wrapper.find('.astryx-visually-hidden')
    expect(hint.exists()).toBe(true)
    expect(wrapper.get('[role="textbox"]').attributes('aria-describedby')).toContain(hint.attributes('id'))
    await wrapper.setProps({ isReadOnly: true })
    await nextTick()
    expect(wrapper.text()).not.toContain('Escape then Tab')
  })

  it('omits the hint when given an empty string', async () => {
    const wrapper = mountEditor({ tabEscapeHint: '' })
    await nextTick()
    expect(wrapper.text()).not.toContain('Escape then Tab')
  })
})

describe('richTextEditor placeholder', () => {
  it('shows the placeholder only while the document is empty', async () => {
    const wrapper = mountEditor({ placeholder: 'Write something' })
    await nextTick()
    expect(wrapper.find('.astryx-richtext-editor__placeholder').exists()).toBe(true)
    expect(wrapper.get('[role="textbox"]').attributes('aria-placeholder')).toBe('Write something')
    await write(wrapper, 'hello')
    await nextTick()
    expect(wrapper.find('.astryx-richtext-editor__placeholder').exists()).toBe(false)
  })
})

describe('richTextEditor content', () => {
  it('seeds the document from defaultValue once', async () => {
    const seed = JSON.stringify({
      root: {
        type: 'root',
        version: 1,
        direction: null,
        format: '',
        indent: 0,
        children: [{ type: 'paragraph', version: 1, direction: null, format: '', indent: 0, children: [{ type: 'text', version: 1, text: 'seeded', detail: 0, format: 0, mode: 'normal', style: '' }] }],
      },
    })
    const wrapper = mountEditor({ defaultValue: seed })
    await nextTick()
    expect(wrapper.get('[role="textbox"]').text()).toBe('seeded')
    await wrapper.setProps({ defaultValue: JSON.stringify({ root: { type: 'root', version: 1, children: [] } }) })
    await nextTick()
    expect(wrapper.get('[role="textbox"]').text()).toBe('seeded')
  })

  it('emits change with the editor state when content changes', async () => {
    const wrapper = mountEditor()
    await nextTick()
    await write(wrapper, 'typed')
    await nextTick()
    const events = wrapper.emitted('change')
    expect(events?.length).toBeGreaterThan(0)
    const [state] = events![events!.length - 1] as [import('lexical').EditorState]
    expect(JSON.stringify(state.toJSON())).toContain('typed')
  })

  it('exports Markdown and HTML', async () => {
    const wrapper = mountEditor()
    await nextTick()
    await write(wrapper, 'plain words')
    const exposed = wrapper.vm as unknown as { getMarkdown: () => string, getHTML: () => string }
    expect(exposed.getMarkdown()).toBe('plain words')
    expect(exposed.getHTML()).toContain('plain words')
  })

  it('clear() resets to one empty paragraph and fires change', async () => {
    const wrapper = mountEditor()
    await nextTick()
    await write(wrapper, 'gone')
    const exposed = wrapper.vm as unknown as { clear: () => void, getMarkdown: () => string }
    exposed.clear()
    await nextTick()
    expect(exposed.getMarkdown()).toBe('')
    expect(wrapper.get('[role="textbox"]').text()).toBe('')
  })

  it('does not clear or focus a read-only editor through the exposed methods', async () => {
    const wrapper = mountEditor({ isReadOnly: true })
    await nextTick()
    const exposed = wrapper.vm as unknown as { clear: () => void, focus: () => void, getMarkdown: () => string }
    exposed.clear()
    exposed.focus()
    expect(document.activeElement).not.toBe(wrapper.get('[role="textbox"]').element)
  })
})

describe('richTextEditor markdown shortcuts', () => {
  async function type(wrapper: ReturnType<typeof mountEditor>, first: string, then: string): Promise<void> {
    const editor = (wrapper.vm as unknown as { getEditor: () => LexicalEditor }).getEditor()
    // 和用户打字的顺序一致：先有前面的字，光标在末尾，再插入最后一个字符。
    await new Promise<void>(resolve => editor.update(() => {
      const text = $createTextNode(first)
      $getRoot().clear().append($createParagraphNode().append(text))
      text.select(first.length, first.length)
    }, { onUpdate: resolve }))
    await new Promise<void>(resolve => editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection))
        selection.insertText(then)
    }, { onUpdate: resolve }))
    await new Promise(resolve => setTimeout(resolve, 20))
  }

  it('turns "# " into a heading when shortcuts are on', async () => {
    const wrapper = mountEditor()
    await nextTick()
    await type(wrapper, '#', ' ')
    expect(wrapper.find('h1').exists()).toBe(true)
  })

  it('turns "- " into a bulleted list', async () => {
    const wrapper = mountEditor()
    await nextTick()
    await type(wrapper, '-', ' ')
    expect(wrapper.find('ul > li').exists()).toBe(true)
  })

  it('leaves "# " as plain text when shortcuts are off', async () => {
    const wrapper = mountEditor({ hasMarkdownShortcuts: false })
    await nextTick()
    await type(wrapper, '#', ' ')
    expect(wrapper.find('h1').exists()).toBe(false)
    expect(wrapper.get('[role="textbox"]').text()).toContain('#')
  })
})

describe('richTextEditor character counter', () => {
  it('shows count/limit and marks it over the limit without truncating', async () => {
    const wrapper = mountEditor({ maxLength: 5 })
    await nextTick()
    await write(wrapper, 'abcdefg')
    await nextTick()
    const counter = wrapper.get('.astryx-richtext-editor__counter')
    expect(counter.text()).toContain('7/5')
    expect(counter.attributes('data-over')).toBe('true')
    expect(wrapper.get('[role="textbox"]').text()).toBe('abcdefg')
  })
})

describe('richTextEditor slots and context', () => {
  it('renders a toolbar slot above the editing surface', async () => {
    const wrapper = mountEditor({}, { toolbar: () => h('div', { 'class': 'my-toolbar', 'data-testid': 'tb' }, 'tools') })
    await nextTick()
    const toolbar = wrapper.get('.my-toolbar')
    const body = wrapper.get('.astryx-richtext-editor__body')
    expect(toolbar.element.compareDocumentPosition(body.element) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(wrapper.get('.astryx-richtext-editor').attributes('data-with-toolbar')).toBeDefined()
  })

  it('gives default-slot components the editor through useLexicalEditor()', async () => {
    let seen: unknown
    const Probe = defineComponent({
      setup() {
        return () => {
          seen = useLexicalEditor().isEditable()
          return null
        }
      },
    })
    mountEditor({}, { default: () => h(Probe) })
    await nextTick()
    await nextTick()
    expect(seen).toBe(true)
  })

  it('passes class and style to the field root, not the editing surface', async () => {
    const wrapper = mount(RichTextEditor, { props: { label: 'Notes' }, attrs: { class: 'mine', style: 'margin: 3px' }, attachTo: document.body })
    mounted.push(wrapper)
    await nextTick()
    expect(wrapper.get('.astryx-field').classes()).toContain('mine')
    expect(wrapper.get('[role="textbox"]').classes()).not.toContain('mine')
  })
})
