import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import CodeEditor from './CodeEditor.vue'
import { caretTextOffset, setCaretAtTextOffset } from './keyboard.js'

afterEach(() => {
  document.body.innerHTML = ''
})

function mountEditor(value = '', props: Record<string, unknown> = {}) {
  const onChange = vi.fn()
  const wrapper = mount(CodeEditor, {
    attachTo: document.body,
    props: { value, label: 'Edit snippet', language: 'typescript', onChange, ...props },
  })
  const editor = wrapper.get<HTMLElement>('code[role="textbox"]')
  setCaretAtTextOffset(editor.element, value.length)
  return { wrapper, editor, onChange }
}

describe('codeEditor', () => {
  it('uses the label, hint, placeholder, line numbers and size', () => {
    const { wrapper, editor } = mountEditor('', {
      placeholder: 'Write code',
      hasLineNumbers: true,
      escapeHint: 'Escape then Tab',
      size: 'sm',
      maxHeight: 200,
    })
    expect(editor.attributes('aria-label')).toBe('Edit snippet')
    expect(editor.attributes('aria-describedby')).toContain('escape')
    expect(wrapper.text()).toContain('Write code')
    expect(wrapper.findAll('.astryx-code-editor__gutter > div')).toHaveLength(1)
    expect(wrapper.get('.astryx-code-editor__container').attributes('style')).toContain('max-height: 200px')
    expect(wrapper.get('.astryx-code-editor').attributes('data-size')).toBe('sm')
    wrapper.unmount()
  })

  it('emits controlled text changes and syncs an external value', async () => {
    const { wrapper, editor } = mountEditor('const x = 1;')
    editor.element.textContent = 'const x = 2;'
    await editor.trigger('input')
    expect(wrapper.emitted('change')?.at(-1)).toEqual(['const x = 2;'])
    await wrapper.setProps({ value: 'const y = 3;' })
    await nextTick()
    expect(editor.element.textContent).toBe('const y = 3;')
    wrapper.unmount()
  })

  it('inserts two spaces with Tab and keeps the editor active', async () => {
    const { wrapper, editor } = mountEditor()
    editor.element.focus()
    await editor.trigger('keydown', { key: 'Tab' })
    expect(wrapper.emitted('change')?.at(-1)).toEqual(['  '])
    expect(document.activeElement).toBe(editor.element)
    wrapper.unmount()
  })

  it('lets Escape then Tab leave without indenting, and makes the next Tab indent again', async () => {
    const { wrapper, editor } = mountEditor()
    await editor.trigger('keydown', { key: 'Escape' })
    const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true })
    editor.element.dispatchEvent(event)
    expect(event.defaultPrevented).toBe(false)
    expect(wrapper.emitted('change')).toBeUndefined()
    await editor.trigger('blur')
    await editor.trigger('focus')
    await editor.trigger('keydown', { key: 'Tab' })
    expect(wrapper.emitted('change')?.at(-1)).toEqual(['  '])
    wrapper.unmount()
  })

  it('outdents only the current line with Shift+Tab', async () => {
    const { wrapper, editor } = mountEditor('  a;\n  b;')
    setCaretAtTextOffset(editor.element, 7)
    await editor.trigger('keydown', { key: 'Tab', shiftKey: true })
    expect(wrapper.emitted('change')?.at(-1)).toEqual(['  a;\nb;'])
    wrapper.unmount()
  })

  it('keeps the current indentation after Enter', async () => {
    const { wrapper, editor } = mountEditor('  const x = 1;')
    await editor.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('change')?.at(-1)).toEqual(['  const x = 1;\n  '])
    wrapper.unmount()
  })

  it('auto-closes a bracket and leaves the caret between the pair', async () => {
    const { wrapper, editor } = mountEditor()
    await editor.trigger('keydown', { key: '(' })
    expect(wrapper.emitted('change')?.at(-1)).toEqual(['()'])
    expect(caretTextOffset(editor.element)).toBe(1)
    wrapper.unmount()
  })

  it('keeps a read-only editor focusable and inert', async () => {
    const { wrapper, editor } = mountEditor('const x = 1;', { isReadOnly: true })
    expect(editor.attributes('tabindex')).toBe('0')
    expect(editor.attributes('aria-readonly')).toBe('true')
    expect(editor.attributes('aria-describedby')).toBeUndefined()
    await editor.trigger('keydown', { key: 'Tab' })
    expect(wrapper.emitted('change')).toBeUndefined()
    wrapper.unmount()
  })

  it('does not commit during IME composition, but commits on composition end', async () => {
    const { wrapper, editor } = mountEditor()
    editor.element.textContent = '你'
    await editor.trigger('compositionstart')
    await editor.trigger('input')
    expect(wrapper.emitted('change')).toBeUndefined()
    await editor.trigger('compositionend')
    expect(wrapper.emitted('change')?.at(-1)).toEqual(['你'])
    wrapper.unmount()
  })
})
