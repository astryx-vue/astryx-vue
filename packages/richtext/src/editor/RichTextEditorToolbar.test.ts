import type { LexicalEditor } from 'lexical'
import { mount } from '@vue/test-utils'
import { $createParagraphNode, $createTextNode, $getRoot } from 'lexical'
import { afterEach, describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import RichTextEditor from './RichTextEditor.vue'
import RichTextEditorToolbar from './RichTextEditorToolbar.vue'

const mounted: Array<{ unmount: () => void }> = []
function mountEditor(toolbarProps: Record<string, unknown> = {}, editorProps: Record<string, unknown> = {}) {
  const wrapper = mount(RichTextEditor, {
    props: { label: 'Notes', ...editorProps },
    slots: { toolbar: () => h(RichTextEditorToolbar, toolbarProps) },
    attachTo: document.body,
  })
  mounted.push(wrapper)
  return wrapper
}
afterEach(() => {
  for (const wrapper of mounted.splice(0))
    wrapper.unmount()
  document.body.innerHTML = ''
})

const editorOf = (wrapper: ReturnType<typeof mountEditor>): LexicalEditor => (wrapper.vm as unknown as { getEditor: () => LexicalEditor }).getEditor()

function seed(wrapper: ReturnType<typeof mountEditor>, text: string, select?: [number, number]): Promise<void> {
  const editor = editorOf(wrapper)
  return new Promise(resolve => editor.update(() => {
    const node = $createTextNode(text)
    $getRoot().clear().append($createParagraphNode().append(node))
    if (select)
      node.select(select[0], select[1])
  }, { onUpdate: resolve }))
}

const button = (wrapper: ReturnType<typeof mountEditor>, name: string) => wrapper.get(`[aria-label="${name}"], button[aria-label="${name}"]`)
/** core 的按钮禁用时写 `aria-disabled="true"`，不写原生 disabled（这样仍能聚焦、读出禁用原因）。 */
const isDisabled = (wrapper: ReturnType<typeof mountEditor>, name: string) => button(wrapper, name).attributes('aria-disabled') === 'true'
const pressed = (wrapper: ReturnType<typeof mountEditor>, name: string) => button(wrapper, name).attributes('aria-pressed')

describe('richTextEditorToolbar structure', () => {
  it('is a named toolbar with a named action group', async () => {
    const wrapper = mountEditor()
    await nextTick()
    expect(wrapper.get('[role="toolbar"]').attributes('aria-label')).toBe('Text formatting')
    expect(wrapper.get('[role="group"]').attributes('aria-label')).toBe('Formatting actions')
    expect(wrapper.get('.astryx-richtext-toolbar__actions').attributes('data-cross-align')).toBe('center')
  })

  it('takes a custom label', async () => {
    const wrapper = mountEditor({ label: 'Formatting' })
    await nextTick()
    expect(wrapper.get('[role="toolbar"]').attributes('aria-label')).toBe('Formatting')
  })

  it('has undo, redo, block format, five inline toggles and a link toggle', async () => {
    const wrapper = mountEditor()
    await nextTick()
    for (const name of ['Undo', 'Redo', 'Bold', 'Italic', 'Underline', 'Strikethrough', 'Inline code', 'Link'])
      expect(wrapper.find(`[aria-label="${name}"]`).exists(), name).toBe(true)
    expect(wrapper.find('[aria-label="Block format"]').exists()).toBe(true)
  })

  it('omits the link button when hasLink is false', async () => {
    const wrapper = mountEditor({ hasLink: false })
    await nextTick()
    expect(wrapper.find('[aria-label="Link"]').exists()).toBe(false)
  })

  it('renders the end slot after a divider', async () => {
    const wrapper = mount(RichTextEditor, {
      props: { label: 'Notes' },
      slots: { toolbar: () => h(RichTextEditorToolbar, null, { end: () => h('button', { id: 'mine' }, 'AI') }) },
      attachTo: document.body,
    })
    mounted.push(wrapper)
    await nextTick()
    expect(wrapper.find('#mine').exists()).toBe(true)
  })

  it('translates labels into Chinese from the package fallback', async () => {
    const { InternationalizationProvider } = await import('@astryx-vue/core')
    const wrapper = mount({
      render: () => h(InternationalizationProvider as never, { locale: 'zh-CN' }, {
        default: () => h(RichTextEditor, { label: '笔记' }, { toolbar: () => h(RichTextEditorToolbar) }),
      }),
    }, { attachTo: document.body })
    mounted.push(wrapper)
    await nextTick()
    expect(wrapper.get('[role="toolbar"]').attributes('aria-label')).toBe('文字格式')
    expect(wrapper.find('[aria-label="加粗"]').exists()).toBe(true)
  })
})

describe('richTextEditorToolbar inline formats', () => {
  it('formats the selection and reflects it as pressed', async () => {
    const wrapper = mountEditor()
    await nextTick()
    await seed(wrapper, 'hello', [0, 5])
    await nextTick()
    expect(pressed(wrapper, 'Bold')).toBe('false')
    await button(wrapper, 'Bold').trigger('click')
    await nextTick()
    expect(wrapper.get('[role="textbox"]').html()).toContain('<strong')
    expect(pressed(wrapper, 'Bold')).toBe('true')
    expect(pressed(wrapper, 'Italic')).toBe('false')
  })

  it('toggles a format off again', async () => {
    const wrapper = mountEditor()
    await nextTick()
    await seed(wrapper, 'hello', [0, 5])
    await button(wrapper, 'Italic').trigger('click')
    await nextTick()
    await button(wrapper, 'Italic').trigger('click')
    await nextTick()
    expect(wrapper.get('[role="textbox"]').html()).not.toContain('<em')
    expect(pressed(wrapper, 'Italic')).toBe('false')
  })

  it('does not take focus from the editor on mousedown', async () => {
    const wrapper = mountEditor()
    await nextTick()
    const event = new MouseEvent('mousedown', { bubbles: true, cancelable: true })
    button(wrapper, 'Bold').element.dispatchEvent(event)
    expect(event.defaultPrevented).toBe(true)
  })

  it('disables every control when the editor is read-only, and re-enables them', async () => {
    const wrapper = mountEditor({}, { isReadOnly: true })
    await nextTick()
    for (const name of ['Bold', 'Italic', 'Link'])
      expect(isDisabled(wrapper, name), name).toBe(true)
    await wrapper.setProps({ isReadOnly: false })
    await nextTick()
    await nextTick()
    expect(isDisabled(wrapper, 'Bold')).toBe(false)
  })
})

describe('richTextEditorToolbar history', () => {
  it('enables undo only after an edit, and undoes it', async () => {
    const wrapper = mountEditor()
    await nextTick()
    expect(isDisabled(wrapper, 'Undo')).toBe(true)
    expect(isDisabled(wrapper, 'Redo')).toBe(true)
    await seed(wrapper, 'one', [3, 3])
    await new Promise(resolve => setTimeout(resolve, 5))
    await nextTick()
    expect(isDisabled(wrapper, 'Undo')).toBe(false)
    await button(wrapper, 'Undo').trigger('click')
    await nextTick()
    await nextTick()
    expect(wrapper.get('[role="textbox"]').text()).toBe('')
    expect(isDisabled(wrapper, 'Redo')).toBe(false)
  })
})

describe('richTextEditorToolbar block format', () => {
  async function choose(wrapper: ReturnType<typeof mountEditor>, optionLabel: string): Promise<void> {
    await wrapper.get('[aria-label="Block format"]').trigger('click')
    await nextTick()
    const option = [...document.body.querySelectorAll('[role="option"]')].find(node => node.textContent?.includes(optionLabel)) as HTMLElement | undefined
    expect(option, optionLabel).toBeDefined()
    option!.click()
    await nextTick()
    await nextTick()
  }

  it('offers paragraph, the heading levels, both lists and quote', async () => {
    const wrapper = mountEditor({ headingLevels: ['h1', 'h2'] })
    await nextTick()
    await wrapper.get('[aria-label="Block format"]').trigger('click')
    await nextTick()
    // 每一项前面带图标：段落和标题是一小段文字，列表和引用是图形。
    const labels = [...document.body.querySelectorAll('[role="option"] .astryx-selector-option-copy')].map(node => node.textContent?.trim())
    expect(labels).toEqual(['Paragraph', 'Heading 1', 'Heading 2', 'Bulleted list', 'Numbered list', 'Block quote'])
    const glyphs = [...document.body.querySelectorAll('[role="option"] .astryx-richtext-toolbar__text-glyph')].map(node => node.textContent)
    expect(glyphs).toEqual(['¶', 'H1', 'H2'])
  })

  it('turns the current block into a heading, a quote, and a list', async () => {
    const wrapper = mountEditor()
    await nextTick()
    await seed(wrapper, 'title', [0, 0])
    await nextTick()
    await choose(wrapper, 'Heading 2')
    expect(wrapper.find('h2').exists()).toBe(true)
    await choose(wrapper, 'Block quote')
    expect(wrapper.find('blockquote').exists()).toBe(true)
    await choose(wrapper, 'Paragraph')
    expect(wrapper.find('blockquote').exists()).toBe(false)
    await choose(wrapper, 'Bulleted list')
    expect(wrapper.find('ul > li').exists()).toBe(true)
  })

  it('choosing the block it already is leaves it alone, instead of toggling back', async () => {
    const wrapper = mountEditor()
    await nextTick()
    await seed(wrapper, 'title', [0, 0])
    await nextTick()
    await choose(wrapper, 'Heading 1')
    await choose(wrapper, 'Heading 1')
    expect(wrapper.find('h1').exists()).toBe(true)
  })
})

describe('richTextEditorToolbar link dialog', () => {
  /** `<dialog>` 元素一直在文档里，打开与否看 `open` 属性。 */
  const dialog = () => {
    const node = document.body.querySelector('dialog')
    return node?.hasAttribute('open') ? node : null
  }
  const urlInput = () => document.body.querySelector('dialog input') as HTMLInputElement

  async function openLinkDialog(wrapper: ReturnType<typeof mountEditor>): Promise<void> {
    await button(wrapper, 'Link').trigger('click')
    await nextTick()
    await nextTick()
  }

  async function submit(value: string): Promise<void> {
    urlInput().value = value
    urlInput().dispatchEvent(new Event('input', { bubbles: true }))
    await nextTick()
    document.body.querySelector<HTMLButtonElement>('dialog button[type="submit"]')!.click()
    await nextTick()
    await nextTick()
  }

  it('opens a form dialog prefilled with https://', async () => {
    const wrapper = mountEditor()
    await nextTick()
    await seed(wrapper, 'site', [0, 4])
    await nextTick()
    await openLinkDialog(wrapper)
    expect(dialog()).not.toBeNull()
    expect(document.body.textContent).toContain('Insert link')
    expect(urlInput().value).toBe('https://')
  })

  it('links the selected text with a new-tab link', async () => {
    const wrapper = mountEditor()
    await nextTick()
    await seed(wrapper, 'site', [0, 4])
    await nextTick()
    await openLinkDialog(wrapper)
    await submit('https://example.com')
    const anchor = wrapper.get('[role="textbox"] a')
    expect(anchor.attributes('href')).toBe('https://example.com/')
    expect(anchor.attributes('target')).toBe('_blank')
    expect(anchor.attributes('rel')).toBe('noopener noreferrer')
  })

  it('omits target and rel when hasNewTabLinks is false', async () => {
    const wrapper = mountEditor({ hasNewTabLinks: false })
    await nextTick()
    await seed(wrapper, 'site', [0, 4])
    await nextTick()
    await openLinkDialog(wrapper)
    await submit('https://example.com')
    const anchor = wrapper.get('[role="textbox"] a')
    expect(anchor.attributes('target')).toBeUndefined()
  })

  it('refuses an unsafe URL and shows the error, keeping the dialog open', async () => {
    const wrapper = mountEditor()
    await nextTick()
    await seed(wrapper, 'site', [0, 4])
    await nextTick()
    await openLinkDialog(wrapper)
    await submit('javascript:alert(1)')
    expect(wrapper.find('[role="textbox"] a').exists()).toBe(false)
    expect(document.body.textContent).toContain('Enter a valid http, https, mailto, or tel URL.')
    expect(dialog()).not.toBeNull()
  })

  it('edits and removes an existing link', async () => {
    const wrapper = mountEditor()
    await nextTick()
    await seed(wrapper, 'site', [0, 4])
    await nextTick()
    await openLinkDialog(wrapper)
    await submit('https://example.com')
    await nextTick()
    // 光标放进链接文字里，再开对话框：应该是「编辑」，并带出原网址。
    const editor = editorOf(wrapper)
    await new Promise<void>(resolve => editor.update(() => {
      $getRoot().getAllTextNodes()[0]?.select(2, 2)
    }, { onUpdate: resolve }))
    await nextTick()
    await openLinkDialog(wrapper)
    expect(document.body.textContent).toContain('Edit link')
    expect(urlInput().value).toBe('https://example.com/')
    const remove = [...document.body.querySelectorAll('dialog button')].find(b => b.textContent?.includes('Remove link')) as HTMLButtonElement
    expect(remove).toBeDefined()
    remove.click()
    await nextTick()
    await nextTick()
    expect(wrapper.find('[role="textbox"] a').exists()).toBe(false)
    expect(wrapper.get('[role="textbox"]').text()).toBe('site')
  })

  it('uses promptForUrl instead of the dialog when given', async () => {
    let hint = ''
    const wrapper = mountEditor({
      promptForUrl: (text: string) => {
        hint = text
        return 'https://prompted.example'
      },
    })
    await nextTick()
    await seed(wrapper, 'site', [0, 4])
    await nextTick()
    await button(wrapper, 'Link').trigger('click')
    await nextTick()
    await nextTick()
    expect(dialog()).toBeNull()
    expect(hint).toBe('site')
    expect(wrapper.get('[role="textbox"] a').attributes('href')).toBe('https://prompted.example/')
  })

  it('opens the dialog with Cmd/Ctrl+K and ignores Shift+K', async () => {
    const wrapper = mountEditor()
    await nextTick()
    await seed(wrapper, 'site', [0, 4])
    await nextTick()
    const box = wrapper.get('[role="textbox"]').element
    const isApple = /Mac|iPhone|iPad/.test(navigator.platform) || /Mac/.test(navigator.userAgent)
    const mod = isApple ? { metaKey: true } : { ctrlKey: true }
    box.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ...mod, shiftKey: true, bubbles: true, cancelable: true }))
    await nextTick()
    expect(dialog()).toBeNull()
    box.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ...mod, bubbles: true, cancelable: true }))
    await nextTick()
    await nextTick()
    expect(document.body.textContent).toContain('Insert link')
  })
})

describe('richTextEditorToolbar theme icons', () => {
  it('draws a built-in svg for each control by default', async () => {
    const wrapper = mountEditor()
    await nextTick()
    expect(button(wrapper, 'Bold').find('svg').exists()).toBe(true)
  })

  it('shows the current block as a glyph on the selector, and follows the block', async () => {
    const wrapper = mountEditor()
    await nextTick()
    await seed(wrapper, 'x', [0, 0])
    await nextTick()
    expect(wrapper.get('[aria-label="Block format"]').text()).toContain('¶')
    await wrapper.get('[aria-label="Block format"]').trigger('click')
    await nextTick()
    ;(([...document.body.querySelectorAll('[role="option"]')].find(node => node.textContent?.includes('Heading 3'))) as HTMLElement).click()
    await nextTick()
    await nextTick()
    expect(wrapper.get('[aria-label="Block format"]').text()).toContain('H3')
  })
})
