import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { createStaticSource } from '../composables/useAsyncSource.js'
import { provideAstryxLocale } from '../locale/index.js'
import ChatComposer from './ChatComposer.vue'
import ChatComposerDrawer from './ChatComposerDrawer.vue'
import ChatComposerInput from './ChatComposerInput.vue'
import ChatDictationButton from './ChatDictationButton.vue'
import ChatSendButton from './ChatSendButton.vue'
import ChatTokenizedText from './ChatTokenizedText.vue'
import { useChatPasteAsToken } from './useChatPasteAsToken.js'
import { useSpeechRecognition } from './useSpeechRecognition.js'

function asHtml(node: Element): HTMLElement {
  return node as HTMLElement
}

function typeInto(node: Element, text: string): void {
  const editable = asHtml(node)
  editable.textContent = text
  editable.dispatchEvent(new InputEvent('input', { bubbles: true }))
}

describe('chat composer', () => {
  it('submits a trimmed draft and clears it', async () => {
    const wrapper = mount(ChatComposer)
    const editable = wrapper.get('.astryx-chat-composer-input__editable')
    expect(wrapper.get('.astryx-chat-composer-input__placeholder').text()).toBe('Type a message…')
    expect(editable.attributes('role')).toBe('textbox')
    expect(editable.attributes('aria-label')).toBe('Message input')
    expect(wrapper.get('button.astryx-chat-send').attributes('disabled')).toBe('')

    typeInto(editable.element, '  hello  ')
    await nextTick()
    expect(wrapper.get('button.astryx-chat-send').attributes('disabled')).toBeUndefined()

    await editable.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('submit')).toEqual([['hello']])
    await nextTick()
    expect(editable.element.textContent).toBe('')
    expect(wrapper.emitted('submit')).toHaveLength(1)
  })

  it('keeps Shift+Enter and an IME commit from sending', async () => {
    const wrapper = mount(ChatComposer)
    const editable = wrapper.get('.astryx-chat-composer-input__editable')
    typeInto(editable.element, 'hello')
    await nextTick()

    await editable.trigger('keydown', { key: 'Enter', shiftKey: true })
    expect(wrapper.emitted('submit')).toBeUndefined()

    const composing = new KeyboardEvent('keydown', { key: 'Enter', cancelable: true })
    Object.defineProperty(composing, 'isComposing', { value: true })
    editable.element.dispatchEvent(composing)
    const processing = new KeyboardEvent('keydown', { key: 'Enter', cancelable: true })
    Object.defineProperty(processing, 'keyCode', { value: 229 })
    editable.element.dispatchEvent(processing)
    expect(wrapper.emitted('submit')).toBeUndefined()
  })

  it('ignores an empty or disabled submit and keeps stop reachable', async () => {
    const wrapper = mount(ChatComposer, { props: { isDisabled: true, isStopShown: true, modelValue: 'draft' } })
    const button = wrapper.get('button.astryx-chat-send')
    expect(button.attributes('aria-label')).toBe('Stop')
    expect(button.attributes('disabled')).toBeUndefined()
    expect(wrapper.get('.astryx-chat-composer').attributes('data-disabled')).toBe('')
    expect(wrapper.get('.astryx-chat-composer__footer-end').attributes('data-interruptible')).toBe('')

    await button.trigger('click')
    expect(wrapper.emitted('stop')).toHaveLength(1)
    expect(wrapper.emitted('submit')).toBeUndefined()
  })

  it('places the status, the drawer, and the header only when they are provided', () => {
    const wrapper = mount(ChatComposer, {
      props: {
        elevation: 'none',
        density: 'compact',
        status: { type: 'error', message: 'Could not send' },
        statusPosition: 'top',
      },
      slots: {
        drawer: '<div class="drawer-slot" />',
        headerActions: '<button type="button">Add</button>',
      },
    })

    const root = wrapper.get('.astryx-chat-composer')
    const children = [...root.element.children].map(node => node.className)
    expect(children[0]).toContain('astryx-chat-composer__status')
    expect(children[1]).toBe('drawer-slot')
    expect(wrapper.get('[role="alert"]').text()).toContain('Could not send')
    expect(wrapper.get('.astryx-chat-composer__body').attributes('data-elevation')).toBe('none')
    expect(wrapper.get('.astryx-chat-composer__body').attributes('data-density')).toBe('compact')
    expect(wrapper.get('.astryx-chat-composer__header').text()).toContain('Add')

    const warning = mount(ChatComposer, {
      props: { status: { type: 'warning', message: 'Slow connection' } },
    })
    expect(warning.get('.astryx-chat-composer__status').text()).toContain('Slow connection')
    expect(warning.get('.astryx-chat-composer__status').attributes('role')).toBe('status')
    expect(warning.find('.astryx-chat-composer__header').exists()).toBe(false)
  })

  it('collapses the drawer and names the disclosure', async () => {
    const wrapper = mount(ChatComposerDrawer, {
      props: { count: 2, label: 'Attachments' },
      slots: { default: '<span class="file">notes.md</span>' },
    })
    const toggle = wrapper.get('[role="button"]')
    expect(toggle.attributes('aria-expanded')).toBe('true')
    expect(toggle.attributes('aria-label')).toBe('Collapse Attachments')
    expect(wrapper.get('.file').text()).toBe('notes.md')

    await toggle.trigger('click')
    expect(wrapper.emitted('collapsedChange')).toEqual([[true]])
    expect(toggle.attributes('aria-expanded')).toBe('false')
    expect(toggle.attributes('aria-label')).toBe('Expand Attachments')
    expect(wrapper.get('.astryx-chat-drawer__grid').attributes('data-collapsed')).toBe('')
  })

  it('inserts a chip value, turns a long paste into a chip, and recalls history', async () => {
    const wrapper = mount(ChatComposerInput, { attachTo: document.body })
    const editable = asHtml(wrapper.get('.astryx-chat-composer-input__editable').element)
    editable.focus()
    const handle = wrapper.vm as unknown as {
      insertToken: (token: { value: string, label: string }) => string | undefined
      getValue: () => string
    }
    const id = handle.insertToken({ value: '@ada', label: '@Ada' })
    expect(id).toBeTruthy()
    expect(handle.getValue()).toContain('@ada')
    expect(editable.querySelector('[data-astryx-token-value="@ada"]')).not.toBeNull()

    const inserted: string[] = []
    const pasteInput = ref({
      insertToken: (token: { value: string }) => {
        inserted.push(token.value)
        return 'pasted'
      },
      expandToken: () => {},
      insertText: () => {},
      focus: () => {},
      getValue: () => '',
    })
    const paste = useChatPasteAsToken({ input: pasteInput })
    expect(paste.onPaste('x'.repeat(201))).toBe(true)
    expect(inserted[0]).toHaveLength(201)
    expect(paste.onPaste('short')).toBe(false)

    editable.textContent = ''
    editable.dispatchEvent(new InputEvent('input', { bubbles: true }))
    await editable.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }))
    wrapper.unmount()

    const history = mount(ChatComposer)
    const editor = history.get('.astryx-chat-composer-input__editable')
    typeInto(editor.element, 'first note')
    await editor.trigger('keydown', { key: 'Enter' })
    await nextTick()
    asHtml(editor.element).focus()
    await editor.trigger('keydown', { key: 'ArrowUp' })
    await nextTick()
    expect(editor.element.textContent).toBe('first note')
  })

  it('opens a combobox for a trigger and replaces token values in a message', async () => {
    const wrapper = mount(ChatComposerInput, {
      attachTo: document.body,
      props: {
        triggers: [{
          character: '@',
          menuLabel: 'People',
          searchSource: createStaticSource([
            { id: 'ada', label: 'Ada' },
            { id: 'lin', label: 'Lin', auxiliaryData: { group: 'Team' } },
          ]),
          onSelect: item => ({ value: `@${item.id}`, label: `@${item.label}` }),
        }],
      },
    })
    const editable = wrapper.get('.astryx-chat-composer-input__editable')
    expect(editable.attributes('role')).toBe('combobox')
    expect(editable.attributes('aria-haspopup')).toBe('listbox')

    const field = asHtml(editable.element)
    field.focus()
    field.textContent = '@'
    const textNode = field.firstChild
    const selection = window.getSelection()
    const range = document.createRange()
    if (textNode)
      range.setStart(textNode, textNode.textContent?.length ?? 0)
    else
      range.selectNodeContents(field)
    range.collapse(true)
    selection?.removeAllRanges()
    selection?.addRange(range)
    field.dispatchEvent(new InputEvent('input', { bubbles: true }))
    await nextTick()
    expect(editable.attributes('aria-expanded')).toBe('true')
    expect(document.body.textContent).toContain('Ada')

    const text = mount(ChatTokenizedText, {
      props: {
        text: 'Ask @ada about the empty token.',
        tokens: [
          { value: '', label: 'ignored' },
          { value: '@ada', label: '@Ada', variant: 'blue' },
        ],
      },
    })
    expect(text.text()).toContain('@Ada')
    expect(text.text()).not.toContain('@ada')
    expect(text.text()).toContain('empty token')
    wrapper.unmount()
  })

  it('hides dictation without speech recognition and localizes send and stop', () => {
    const hidden = mount(ChatDictationButton, {
      props: {
        dictation: { isSupported: false, isListening: false, bands: [0, 0, 0, 0, 0], volume: 0, toggle: () => {} },
      },
    })
    expect(hidden.find('button').exists()).toBe(false)

    const shown = mount(ChatDictationButton, {
      props: {
        dictation: { isSupported: true, isListening: false, bands: [0, 0, 0, 0, 0], volume: 0, toggle: () => {} },
        isHiddenWhenUnsupported: false,
      },
    })
    expect(shown.get('button').attributes('aria-label')).toBe('Start dictation')
    expect(shown.find('.astryx-icon--microphone').exists()).toBe(true)

    const Probe = defineComponent({
      setup() {
        const speech = useSpeechRecognition()
        return () => h('span', { 'data-supported': String(speech.isSupported.value) })
      },
    })
    expect(mount(Probe).attributes('data-supported')).toBe('false')

    const Chinese = defineComponent({
      setup() {
        provideAstryxLocale('zh-CN')
        return () => h('div', [h(ChatSendButton, { isStopShown: false }), h(ChatSendButton, { isStopShown: true })])
      },
    })
    const labels = mount(Chinese).findAll('button').map(button => button.attributes('aria-label'))
    expect(labels).toEqual(['发送', '停止'])
  })

  it('keeps a controlled draft on the parent and reports dropped files', async () => {
    const value = ref('')
    const Host = defineComponent({
      setup() {
        return () => h(ChatComposer, {
          'modelValue': value.value,
          'onUpdate:modelValue': (next: string) => {
            value.value = next
          },
        })
      },
    })
    const wrapper = mount(Host)
    const editable = wrapper.get('.astryx-chat-composer-input__editable').element
    typeInto(editable, 'kept')
    await nextTick()
    expect(value.value).toBe('kept')

    const dropped: File[] = []
    const input = mount(ChatComposerInput, {
      props: {
        onFiles: (next: File[]) => {
          dropped.push(...next)
        },
      },
    })
    const file = new File(['a'], 'notes.txt', { type: 'text/plain' })
    const drop = new Event('drop', { bubbles: true, cancelable: true })
    Object.defineProperty(drop, 'dataTransfer', { value: { files: [file], types: ['Files'] } })
    input.get('.astryx-chat-composer-input__editable').element.dispatchEvent(drop)
    expect(drop.defaultPrevented).toBe(true)
    expect(dropped.map(item => item.name)).toEqual(['notes.txt'])
    expect(input.emitted('files')?.[0]?.[0]).toEqual([file])
  })
})
