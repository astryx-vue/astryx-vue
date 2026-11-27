import type { LexicalEditor } from 'lexical'
import { mount } from '@vue/test-utils'
import { $createParagraphNode, $createTextNode, $getRoot, $getSelection } from 'lexical'
import { afterEach, describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import RichTextEditor from './RichTextEditor.vue'
import RichTextEditorToolbar from './RichTextEditorToolbar.vue'

const mounted: Array<{ unmount: () => void }> = []
function mountEditor(toolbarProps: Record<string, unknown> = {}) {
  const wrapper = mount(RichTextEditor, {
    props: { label: 'Notes' },
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

type Wrapper = ReturnType<typeof mountEditor>

const editorOf = (wrapper: Wrapper): LexicalEditor => (wrapper.vm as unknown as { getEditor: () => LexicalEditor }).getEditor()

function seed(wrapper: Wrapper, text: string, select?: [number, number]): Promise<void> {
  const editor = editorOf(wrapper)
  return new Promise(resolve => editor.update(() => {
    const node = $createTextNode(text)
    $getRoot().clear().append($createParagraphNode().append(node))
    if (select)
      node.select(select[0], select[1])
  }, { onUpdate: resolve }))
}

async function ready(wrapper: Wrapper, text: string, select?: [number, number]): Promise<void> {
  await nextTick()
  await seed(wrapper, text, select)
  await nextTick()
}

const linkButton = (wrapper: Wrapper) => wrapper.get('button[aria-label="Link"]')
const popover = () => document.body.querySelector<HTMLElement>('.astryx-popover')
const isPopoverOpen = () => popover()?.style.display !== 'none' && popover() !== null && popover()!.querySelector('input') !== null
const urlInput = () => document.body.querySelector<HTMLInputElement>('.astryx-popover input')!
const popoverButton = (name: string) => document.body.querySelector<HTMLButtonElement>(`.astryx-popover button[aria-label="${name}"]`)

async function settle(): Promise<void> {
  for (let i = 0; i < 3; i++)
    await nextTick()
}

async function openFromButton(wrapper: Wrapper): Promise<void> {
  await linkButton(wrapper).trigger('click')
  await settle()
}

async function type(value: string): Promise<void> {
  urlInput().value = value
  urlInput().dispatchEvent(new Event('input', { bubbles: true }))
  await nextTick()
}

function press(target: Element, key: string): KeyboardEvent {
  const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })
  target.dispatchEvent(event)
  return event
}

async function apply(value: string): Promise<void> {
  await type(value)
  press(urlInput(), 'Enter')
  await settle()
}

function selectedText(wrapper: Wrapper): string {
  return editorOf(wrapper).getEditorState().read(() => $getSelection()?.getTextContent() ?? '')
}

async function putCaretInside(wrapper: Wrapper): Promise<void> {
  await new Promise<void>(resolve => editorOf(wrapper).update(() => {
    $getRoot().getAllTextNodes()[0]?.select(2, 2)
  }, { onUpdate: resolve }))
  await nextTick()
}

describe('richTextEditorToolbar link popover', () => {
  it('opens a non-modal popover anchored to a wrapper around the Link button', async () => {
    const wrapper = mountEditor()
    await ready(wrapper, 'site', [0, 4])
    expect(linkButton(wrapper).attributes('aria-expanded')).toBe('false')
    await openFromButton(wrapper)

    const surface = popover()!
    expect(isPopoverOpen()).toBe(true)
    expect(surface.getAttribute('role')).toBe('dialog')
    expect(surface.getAttribute('aria-label')).toBe('Insert link')
    expect(surface.getAttribute('aria-modal')).toBeNull()
    expect(document.body.querySelector('dialog[open]')).toBeNull()
    expect(linkButton(wrapper).attributes('aria-haspopup')).toBe('dialog')
    expect(linkButton(wrapper).attributes('aria-expanded')).toBe('true')
    // 在工具栏外面：工具栏只有一个 Tab 停靠点，表单放进去 Tab 够不着。
    expect(wrapper.get('[role="toolbar"]').element.contains(surface)).toBe(false)
    expect(linkButton(wrapper).element.parentElement?.classList.contains('astryx-richtext-toolbar__link-anchor')).toBe(true)
  })

  it('holds one plain-text URL field with a placeholder, and Apply and Cancel icon buttons', async () => {
    const wrapper = mountEditor()
    await ready(wrapper, 'site', [0, 4])
    await openFromButton(wrapper)

    const field = urlInput()
    expect(field.getAttribute('type')).toBe('text')
    expect(field.getAttribute('inputmode')).toBe('url')
    expect(field.getAttribute('autocomplete')).toBe('url')
    expect(field.getAttribute('spellcheck')).toBe('false')
    expect(field.getAttribute('placeholder')).toBe('example.com')
    expect(field.value).toBe('')
    const labels = [...popover()!.querySelectorAll('button')].map(node => node.getAttribute('aria-label'))
    expect(labels).toEqual(['Add link', 'Cancel'])
    for (const node of popover()!.querySelectorAll('button')) {
      expect(node.textContent?.trim()).toBe('')
      expect(node.querySelector('svg, .astryx-icon')).not.toBeNull()
    }
  })

  it('moves focus into the URL field', async () => {
    const wrapper = mountEditor()
    await ready(wrapper, 'site', [0, 4])
    await openFromButton(wrapper)
    expect(document.activeElement).toBe(urlInput())
  })

  it('links the selected text with a new-tab link on Enter, and claims the Enter', async () => {
    const wrapper = mountEditor()
    await ready(wrapper, 'site', [0, 4])
    await openFromButton(wrapper)
    await type('example.com')
    const event = press(urlInput(), 'Enter')
    await settle()

    expect(event.defaultPrevented).toBe(true)
    const anchor = wrapper.get('[role="textbox"] a')
    expect(anchor.attributes('href')).toBe('https://example.com/')
    expect(anchor.attributes('target')).toBe('_blank')
    expect(anchor.attributes('rel')).toBe('noopener noreferrer')
    expect(linkButton(wrapper).attributes('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(wrapper.get('[role="textbox"]').element)
  })

  it('applies from the Add link button', async () => {
    const wrapper = mountEditor()
    await ready(wrapper, 'site', [0, 4])
    await openFromButton(wrapper)
    await type('https://example.com')
    popoverButton('Add link')!.click()
    await settle()
    expect(wrapper.get('[role="textbox"] a').attributes('href')).toBe('https://example.com/')
  })

  it('inserts the URL as link text at a caret in an empty paragraph', async () => {
    const wrapper = mountEditor()
    await ready(wrapper, '', [0, 0])
    await openFromButton(wrapper)
    await apply('https://example.com')
    const anchor = wrapper.get('[role="textbox"] a')
    expect(anchor.attributes('href')).toBe('https://example.com/')
    expect(anchor.text()).toBe('https://example.com')
  })

  it('inserts a link at a caret inside text without linking the whole text', async () => {
    const wrapper = mountEditor()
    await ready(wrapper, 'hello world', [5, 5])
    await openFromButton(wrapper)
    await apply('https://example.com')
    expect(wrapper.get('[role="textbox"] a').text()).toBe('https://example.com')
    expect(wrapper.get('[role="textbox"]').text()).toContain('hello')
    expect(wrapper.get('[role="textbox"]').text()).toContain('world')
  })

  it('omits target and rel when hasNewTabLinks is false', async () => {
    const wrapper = mountEditor({ hasNewTabLinks: false })
    await ready(wrapper, 'site', [0, 4])
    await openFromButton(wrapper)
    await apply('https://example.com')
    expect(wrapper.get('[role="textbox"] a').attributes('target')).toBeUndefined()
  })

  it('refuses an unsafe URL, shows the error, keeps the popover open and the focus in the field', async () => {
    const wrapper = mountEditor()
    await ready(wrapper, 'site', [0, 4])
    await openFromButton(wrapper)
    await apply('javascript:alert(1)')

    expect(wrapper.find('[role="textbox"] a').exists()).toBe(false)
    expect(popover()!.textContent).toContain('Enter a valid http, https, mailto, or tel URL.')
    expect(urlInput().getAttribute('aria-invalid')).toBe('true')
    expect(document.activeElement).toBe(urlInput())
    expect(linkButton(wrapper).attributes('aria-expanded')).toBe('true')

    // 再敲字，错误就清掉。
    await type('example.com')
    expect(popover()!.textContent).not.toContain('Enter a valid http')
    expect(urlInput().getAttribute('aria-invalid')).toBeNull()
  })

  it.each([
    ['Escape', () => press(urlInput(), 'Escape')],
    ['Cancel', () => popoverButton('Cancel')!.click()],
  ])('%s closes it and returns focus and the selection to the editor', async (_name, dismiss) => {
    const wrapper = mountEditor()
    await ready(wrapper, 'site', [0, 4])
    await openFromButton(wrapper)
    await type('example.com')

    dismiss()
    await settle()

    expect(linkButton(wrapper).attributes('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(wrapper.get('[role="textbox"]').element)
    expect(selectedText(wrapper)).toBe('site')
    expect(wrapper.find('[role="textbox"] a').exists()).toBe(false)
  })

  it('closes when the Link button is pressed again', async () => {
    const wrapper = mountEditor()
    await ready(wrapper, 'site', [0, 4])
    await openFromButton(wrapper)
    await openFromButton(wrapper)
    expect(linkButton(wrapper).attributes('aria-expanded')).toBe('false')
    expect(isPopoverOpen()).toBe(false)
    expect(selectedText(wrapper)).toBe('site')
  })

  it('closes on a press outside the popover', async () => {
    const wrapper = mountEditor()
    await ready(wrapper, 'site', [0, 4])
    await openFromButton(wrapper)
    document.body.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }))
    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await settle()
    expect(linkButton(wrapper).attributes('aria-expanded')).toBe('false')
  })

  it('edits a link the caret is in, and Remove unlinks it keeping the text', async () => {
    const wrapper = mountEditor()
    await ready(wrapper, 'site', [0, 4])
    await openFromButton(wrapper)
    await apply('https://example.com')
    await putCaretInside(wrapper)
    await openFromButton(wrapper)

    expect(popover()!.getAttribute('aria-label')).toBe('Edit link')
    expect(urlInput().value).toBe('https://example.com/')
    expect(popoverButton('Update link')).not.toBeNull()
    expect(popoverButton('Remove link')).not.toBeNull()

    popoverButton('Remove link')!.click()
    await settle()
    expect(wrapper.find('[role="textbox"] a').exists()).toBe(false)
    expect(wrapper.get('[role="textbox"]').text()).toBe('site')
  })

  it('updates the link when the caret is inside one', async () => {
    const wrapper = mountEditor()
    await ready(wrapper, 'site', [0, 4])
    await openFromButton(wrapper)
    await apply('https://example.com')
    await putCaretInside(wrapper)
    await openFromButton(wrapper)
    await apply('https://example.org')
    const anchors = wrapper.findAll('[role="textbox"] a')
    expect(anchors).toHaveLength(1)
    expect(anchors[0]!.attributes('href')).toBe('https://example.org/')
    expect(anchors[0]!.text()).toBe('site')
  })

  it('uses promptForUrl instead of the popover when given', async () => {
    let hint = ''
    const wrapper = mountEditor({
      promptForUrl: (text: string) => {
        hint = text
        return 'https://prompted.example'
      },
    })
    await ready(wrapper, 'site', [0, 4])
    await openFromButton(wrapper)
    expect(isPopoverOpen()).toBe(false)
    expect(linkButton(wrapper).attributes('aria-expanded')).toBe('false')
    expect(hint).toBe('site')
    expect(wrapper.get('[role="textbox"] a').attributes('href')).toBe('https://prompted.example/')
  })

  it('opens on Cmd/Ctrl+K but not on Cmd/Ctrl+Shift+K', async () => {
    const wrapper = mountEditor()
    await ready(wrapper, 'site', [0, 4])
    const box = wrapper.get('[role="textbox"]').element
    const isApple = /Mac|iPhone|iPad/.test(navigator.platform) || /Mac/.test(navigator.userAgent)
    const mod = isApple ? { metaKey: true } : { ctrlKey: true }
    box.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ...mod, shiftKey: true, bubbles: true, cancelable: true }))
    await settle()
    expect(isPopoverOpen()).toBe(false)
    box.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ...mod, bubbles: true, cancelable: true }))
    await settle()
    expect(isPopoverOpen()).toBe(true)
    expect(linkButton(wrapper).attributes('aria-expanded')).toBe('true')
    expect(document.activeElement).toBe(urlInput())
  })
})
