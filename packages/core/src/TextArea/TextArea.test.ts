import type { VueWrapper } from '@vue/test-utils'
import type { TextAreaProps } from './types.js'
import { renderToString } from '@vue/server-renderer'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createSSRApp, h, nextTick } from 'vue'
import TextArea from './TextArea.vue'

enableAutoUnmount(afterEach)
afterEach(() => {
  vi.useRealTimers()
  document.body.innerHTML = ''
})

function renderArea(props: Partial<TextAreaProps> = {}, attrs: Record<string, unknown> = {}): VueWrapper<InstanceType<typeof TextArea>> {
  const wrapper: VueWrapper<InstanceType<typeof TextArea>> = mount(TextArea, {
    attachTo: document.body,
    attrs,
    props: {
      'label': 'Message',
      'modelValue': '',
      'onUpdate:modelValue': (value) => { void wrapper.setProps({ modelValue: value }) },
      ...props,
    },
  })
  return wrapper
}

describe('textArea', () => {
  it('connects the native textarea to its label, description and status', () => {
    const wrapper = renderArea({ id: 'bio', label: 'Bio', description: 'Short biography', status: { type: 'error', message: 'Too long' } }, { 'aria-describedby': 'external-help' })
    const textarea = wrapper.get('textarea')
    expect(textarea.attributes('id')).toBe('bio')
    expect(wrapper.get('label').attributes('for')).toBe('bio')
    expect(textarea.attributes('aria-labelledby')).toBe('bio-label')
    expect(textarea.attributes('aria-describedby')).toBe('external-help bio-description bio-status')
    expect(textarea.attributes('aria-invalid')).toBe('true')
    expect(wrapper.get('#bio-status').text()).toContain('Too long')
  })

  it('keeps a hidden label available and generates distinct IDs', () => {
    const first = renderArea({ isLabelHidden: true })
    const siblings = mount({ render: () => h('div', [h(TextArea, { label: 'First', modelValue: '' }), h(TextArea, { label: 'Second', modelValue: '' })]) })
    expect(first.get('label').text()).toBe('Message')
    expect(first.get('.astryx-field-label-group').attributes('data-hidden')).toBe('true')
    expect(siblings.findAll('textarea')[0]?.attributes('id')).not.toBe(siblings.findAll('textarea')[1]?.attributes('id'))
  })

  it('updates v-model, emits change and reacts to parent changes', async () => {
    const wrapper = renderArea()
    await wrapper.get('textarea').setValue('Hello')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Hello'])
    expect(wrapper.emitted('change')?.[0]?.[0]).toBe('Hello')
    await wrapper.setProps({ modelValue: 'World' })
    expect(wrapper.get('textarea').element.value).toBe('World')
  })

  it('preserves Chinese composition and commits only once after composition ends', async () => {
    const changeAction = vi.fn()
    const wrapper = renderArea({ changeAction })
    const textarea = wrapper.get('textarea')
    await textarea.trigger('compositionstart')
    textarea.element.value = '中文'
    await textarea.trigger('input', { isComposing: true })
    await textarea.trigger('keydown', { key: 'Enter', isComposing: true })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.emitted('enter')).toBeUndefined()
    await textarea.trigger('compositionend')
    await textarea.trigger('input')
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    expect(changeAction).toHaveBeenCalledTimes(1)
    expect(changeAction.mock.calls[0]?.[0]).toBe('中文')
  })

  it('emits enter and guards legacy IME keyCode 229', async () => {
    const wrapper = renderArea()
    const textarea = wrapper.get('textarea')
    await textarea.trigger('keydown', { key: 'Enter', keyCode: 229 })
    expect(wrapper.emitted('enter')).toBeUndefined()
    await textarea.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('enter')).toHaveLength(1)
    await wrapper.setProps({ onKeydown: event => event.preventDefault() })
    await textarea.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('enter')).toHaveLength(1)
  })

  it('clears through the same action pipeline and restores focus', async () => {
    const changeAction = vi.fn()
    const wrapper = renderArea({ modelValue: 'Ada', hasClear: true, clearLabel: '清除内容', changeAction })
    await wrapper.get('button[aria-label="清除内容"]').trigger('click')
    await nextTick()
    expect(wrapper.get('textarea').element.value).toBe('')
    expect(wrapper.emitted('clear')).toHaveLength(1)
    expect(changeAction.mock.calls[0]?.[0]).toBe('')
    expect(document.activeElement).toBe(wrapper.get('textarea').element)
    expect(wrapper.find('.astryx-text-area-clear-button').exists()).toBe(false)
  })

  it.each([{ isDisabled: true }, { isReadOnly: true }])('blocks editing and clearing for %j', async (state) => {
    const action = vi.fn()
    const wrapper = renderArea({ ...state, modelValue: 'Locked', hasClear: true, changeAction: action })
    const textarea = wrapper.get('textarea')
    textarea.element.value = 'Changed'
    textarea.element.dispatchEvent(new Event('input', { bubbles: true }))
    await nextTick()
    expect(textarea.element.value).toBe('Locked')
    expect(wrapper.emitted('change')).toBeUndefined()
    expect(action).not.toHaveBeenCalled()
    expect(wrapper.find('.astryx-text-area-clear-button').exists()).toBe(false)
  })

  it('keeps read-only values in form submission and removes disabled values', async () => {
    const wrapper = renderArea({ htmlName: 'bio', modelValue: 'Ada', isReadOnly: true })
    const form = document.createElement('form')
    document.body.append(form)
    form.append(wrapper.get('.astryx-field').element)
    expect(new FormData(form).get('bio')).toBe('Ada')
    await wrapper.setProps({ isDisabled: true })
    expect(new FormData(form).has('bio')).toBe(false)
    expect(wrapper.get('textarea').attributes('disabled')).toBe('')
  })

  it('makes a disabled reason discoverable without permitting editing or submitting', async () => {
    const wrapper = renderArea({ modelValue: 'Ada', isDisabled: true, disabledMessage: 'Editors only', htmlName: 'owner' })
    const textarea = wrapper.get('textarea')
    expect(textarea.attributes('disabled')).toBeUndefined()
    expect(textarea.attributes('readonly')).toBe('')
    expect(textarea.attributes('aria-disabled')).toBe('true')
    expect(textarea.attributes('name')).toBeUndefined()
    textarea.element.focus()
    await nextTick()
    expect(document.querySelector('[role="tooltip"]')?.textContent).toBe('Editors only')
    expect(document.querySelector<HTMLElement>('[role="tooltip"]')?.style.display).not.toBe('none')
    await textarea.trigger('keydown', { key: 'Escape' })
    expect(document.querySelector<HTMLElement>('[role="tooltip"]')?.style.display).toBe('none')
    expect(wrapper.emitted('enter')).toBeUndefined()
  })

  it('treats a blank disabledMessage as absent', () => {
    const wrapper = renderArea({ isDisabled: true, disabledMessage: '  ' })
    expect(wrapper.get('textarea').attributes('disabled')).toBe('')
    expect(wrapper.get('textarea').attributes('aria-disabled')).toBeUndefined()
  })

  it('forwards textarea attributes and respects rows and maxlength', async () => {
    const wrapper = renderArea({ rows: 4, maxlength: 200, minlength: 10, wrap: 'hard' as const, cols: 60 }, { 'class': 'custom-area', 'data-testid': 'bio-control' })
    const textarea = wrapper.get('textarea')
    expect(textarea.attributes('rows')).toBe('4')
    expect(textarea.attributes('maxlength')).toBeUndefined()
    expect(wrapper.get('.astryx-text-area-count').text()).toBe('0 / 200')
    expect(wrapper.get('.astryx-text-area-count').attributes('data-over')).toBeUndefined()
    expect(textarea.attributes('minlength')).toBe('10')
    expect(textarea.attributes('wrap')).toBe('hard')
    expect(textarea.attributes('cols')).toBe('60')
    expect(wrapper.get('.astryx-text-area').classes()).toContain('custom-area')
  })

  it('turns spell checking on by default and lets autoComplete and hasSpellCheck through to the textarea', () => {
    const wrapper = renderArea()
    expect(wrapper.get('textarea').attributes('spellcheck')).toBe('true')

    const configured = renderArea({ autoComplete: 'off', hasSpellCheck: false })
    expect(configured.get('textarea').attributes('autocomplete')).toBe('off')
    expect(configured.get('textarea').attributes('spellcheck')).toBe('false')

    const nativeAttr = renderArea({}, { autocomplete: 'email' })
    expect(nativeAttr.get('textarea').attributes('autocomplete')).toBe('email')
  })

  it('forwards focus, blur and paste listeners to the textarea', async () => {
    const onFocus = vi.fn()
    const onBlur = vi.fn()
    const onPaste = vi.fn()
    const wrapper = renderArea({}, { onFocus, onBlur, onPaste })
    const textarea = wrapper.get('textarea')
    await textarea.trigger('focus')
    await textarea.trigger('blur')
    await textarea.trigger('paste')
    expect(onFocus).toHaveBeenCalledTimes(1)
    expect(onBlur).toHaveBeenCalledTimes(1)
    expect(onPaste).toHaveBeenCalledTimes(1)
  })

  it('counts visible characters, allows typing past the limit, and announces the zone', async () => {
    const over = renderArea({ maxlength: 10, modelValue: 'This sentence is already too long.' })
    const count = over.get('.astryx-text-area-count')
    expect(count.attributes('data-over')).toBe('true')
    expect(count.text()).toContain('/ 10')
    expect(over.get('textarea').attributes('aria-invalid')).toBe('true')

    const family = renderArea({ maxlength: 2, modelValue: '👍👍' })
    expect(family.get('.astryx-text-area-count').text()).toBe('2 / 2')
    expect(family.get('.astryx-text-area-count').attributes('data-over')).toBeUndefined()

    const wrapper = renderArea({ maxlength: 10 })
    const textarea = wrapper.get('textarea')
    ;(textarea.element as HTMLTextAreaElement).value = '12345678'
    await textarea.trigger('input')
    await new Promise(resolve => requestAnimationFrame(resolve))
    expect(document.querySelector('[data-astryx-live-region="polite"]')?.textContent).toBe('2 characters remaining')

    ;(textarea.element as HTMLTextAreaElement).value = '12345678901'
    await textarea.trigger('input')
    await new Promise(resolve => requestAnimationFrame(resolve))
    expect(document.querySelector('[data-astryx-live-region="assertive"]')?.textContent).toBe('1 character over the limit')
    expect(wrapper.get('textarea').attributes('maxlength')).toBeUndefined()
    expect(wrapper.get('.astryx-text-area-count').attributes('data-over')).toBe('true')
  })

  it('renders all slots and a component startIcon', () => {
    const wrapper = mount(TextArea, { props: { label: 'Body', modelValue: '' }, slots: { icon: '<svg data-icon />', end: '<span>optional</span>', labelIcon: '<svg data-label-icon />' } })
    expect(wrapper.find('.astryx-text-area-icon [data-icon]').exists()).toBe(true)
    expect(wrapper.get('.astryx-text-area-end').text()).toBe('optional')
    expect(wrapper.find('.astryx-field-label-icon [data-label-icon]').exists()).toBe(true)
    expect(wrapper.find('.astryx-text-area-icon').attributes('aria-hidden')).toBe('true')
    const icon = { render: () => h('svg', { 'data-component-icon': '' }) }
    const withIcon = renderArea({ startIcon: icon, labelIcon: icon })
    expect(withIcon.find('.astryx-text-area-icon [data-component-icon]').exists()).toBe(true)
    expect(withIcon.find('.astryx-field-label-icon [data-component-icon]').exists()).toBe(true)
  })

  it('shows a status tooltip on focus or tap and closes with Escape', async () => {
    const wrapper = renderArea({ status: { type: 'warning', message: 'Publicly visible' }, statusVariant: 'tooltip' })
    const tip = wrapper.get('button')
    expect(wrapper.get('.astryx-field-status').attributes('data-hidden')).toBe('true')
    await tip.trigger('click')
    await nextTick()
    expect(tip.attributes('aria-expanded')).toBe('true')
    expect(document.querySelector('[role="tooltip"]')?.textContent).toBe('Publicly visible')
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await nextTick()
    expect(tip.attributes('aria-expanded')).toBe('false')
  })

  it('sizes the field and supports all three sizes', async () => {
    const wrapper = renderArea({ width: 240, size: 'sm' })
    expect(wrapper.get('.astryx-field').attributes('style')).toContain('width: 240px')
    expect(wrapper.get('.astryx-text-area').attributes('data-size')).toBe('sm')
    await wrapper.setProps({ width: 'min(100%, 32rem)', size: 'lg' })
    expect(wrapper.get('.astryx-field').attributes('style')).toContain('min(100%, 32rem)')
    expect(wrapper.get('.astryx-text-area').attributes('data-size')).toBe('lg')
  })

  it('exposes native ref methods and autofocus', async () => {
    const wrapper = renderArea({ hasAutoFocus: true, modelValue: 'Ada' })
    expect(document.activeElement).toBe(wrapper.vm.element)
    wrapper.vm.blur()
    expect(document.activeElement).not.toBe(wrapper.vm.element)
    wrapper.vm.focus()
    wrapper.vm.select()
    expect(wrapper.get('textarea').element.selectionStart).toBe(0)
    expect(wrapper.get('textarea').element.selectionEnd).toBe(3)
  })

  it('renders server-side with linked IDs and no browser-only dependency', async () => {
    const html = await renderToString(createSSRApp({ render: () => h(TextArea, { label: 'Bio', modelValue: 'ada@example.com', description: 'Work bio', status: { type: 'error', message: 'Invalid domain' } }) }))
    expect(html).toContain('ada@example.com')
    expect(html).toContain('aria-invalid="true"')
    expect(html).toContain('Invalid domain')
    const id = html.match(/<textarea[^>]*?\sid="([^"]+)"/)?.[1]
    expect(id).toBeTruthy()
    expect(html).toContain(`for="${id}"`)
    expect(html).toContain(`aria-labelledby="${id}-label"`)
  })
})
