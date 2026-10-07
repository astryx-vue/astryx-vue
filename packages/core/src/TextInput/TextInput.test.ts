import type { VueWrapper } from '@vue/test-utils'
import type { TextInputProps } from './types.js'
import { renderToString } from '@vue/server-renderer'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createSSRApp, h, nextTick } from 'vue'
import TextInput from './TextInput.vue'

enableAutoUnmount(afterEach)
afterEach(() => {
  vi.useRealTimers()
  document.body.innerHTML = ''
})

function renderInput(props: Partial<TextInputProps> = {}, attrs: Record<string, unknown> = {}): VueWrapper<InstanceType<typeof TextInput>> {
  const wrapper: VueWrapper<InstanceType<typeof TextInput>> = mount(TextInput, {
    attachTo: document.body,
    attrs,
    props: {
      'label': 'Name',
      'modelValue': '',
      'onUpdate:modelValue': (value) => { void wrapper.setProps({ modelValue: value }) },
      ...props,
    },
  })
  return wrapper
}

function deferred(): { promise: Promise<void>, resolve: () => void, reject: (error: unknown) => void } {
  let resolve!: () => void
  let reject!: (error: unknown) => void
  const promise = new Promise<void>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise
    reject = rejectPromise
  })
  return { promise, resolve, reject }
}

describe('textInput', () => {
  it('connects the native input to its label, description and status', () => {
    const wrapper = renderInput({ id: 'email', label: 'Email', description: 'Work address', status: { type: 'error', message: 'Include an @ sign' } }, { 'aria-describedby': 'external-help' })
    const input = wrapper.get('input')
    expect(input.attributes('id')).toBe('email')
    expect(wrapper.get('label').attributes('for')).toBe('email')
    expect(input.attributes('aria-labelledby')).toBe('email-label')
    expect(input.attributes('aria-describedby')).toBe('external-help email-description email-status')
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(wrapper.get('#email-status').text()).toContain('Include an @ sign')
  })

  it('keeps a hidden label available and generates distinct IDs', () => {
    const first = renderInput({ isLabelHidden: true })
    const siblings = mount({ render: () => h('div', [h(TextInput, { label: 'First', modelValue: '' }), h(TextInput, { label: 'Second', modelValue: '' })]) })
    expect(first.get('label').text()).toBe('Name')
    expect(first.get('.astryx-field-label-group').attributes('data-hidden')).toBe('true')
    expect(siblings.findAll('input')[0]?.attributes('id')).not.toBe(siblings.findAll('input')[1]?.attributes('id'))
  })

  it('updates v-model, emits change and reacts to parent changes', async () => {
    const wrapper = renderInput()
    await wrapper.get('input').setValue('Ada')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Ada'])
    expect(wrapper.emitted('change')?.[0]?.[0]).toBe('Ada')
    await wrapper.setProps({ modelValue: 'Grace' })
    expect(wrapper.get('input').element.value).toBe('Grace')
  })

  it('preserves Chinese composition and commits only once after composition ends', async () => {
    const changeAction = vi.fn()
    const wrapper = renderInput({ changeAction })
    const input = wrapper.get('input')
    await input.trigger('compositionstart')
    input.element.value = '中文'
    await input.trigger('input', { isComposing: true })
    await input.trigger('keydown', { key: 'Enter', isComposing: true })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.emitted('enter')).toBeUndefined()
    await input.trigger('compositionend')
    await input.trigger('input')
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    expect(changeAction).toHaveBeenCalledTimes(1)
    expect(changeAction.mock.calls[0]?.[0]).toBe('中文')
  })

  it('guards legacy IME keyCode 229 and allows a keydown listener to cancel enter', async () => {
    const wrapper = renderInput()
    const input = wrapper.get('input')
    await input.trigger('keydown', { key: 'Enter', keyCode: 229 })
    expect(wrapper.emitted('enter')).toBeUndefined()
    await input.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('enter')).toHaveLength(1)
    await wrapper.setProps({ onKeydown: event => event.preventDefault() })
    await input.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('enter')).toHaveLength(1)
  })

  it('clears through the same action pipeline and restores input focus', async () => {
    const changeAction = vi.fn()
    const wrapper = renderInput({ modelValue: 'Ada', hasClear: true, clearLabel: '清除姓名', changeAction })
    await wrapper.get('button[aria-label="清除姓名"]').trigger('click')
    await nextTick()
    expect(wrapper.get('input').element.value).toBe('')
    expect(wrapper.emitted('clear')).toHaveLength(1)
    expect(changeAction.mock.calls[0]?.[0]).toBe('')
    expect(document.activeElement).toBe(wrapper.get('input').element)
    expect(wrapper.find('.astryx-input-clear-button').exists()).toBe(false)
  })

  it.each([{ isDisabled: true }, { isReadOnly: true }])('blocks editing and clearing for %j', async (state) => {
    const action = vi.fn()
    const wrapper = renderInput({ ...state, modelValue: 'Locked', hasClear: true, changeAction: action })
    const input = wrapper.get('input')
    input.element.value = 'Changed'
    input.element.dispatchEvent(new Event('input', { bubbles: true }))
    await nextTick()
    expect(input.element.value).toBe('Locked')
    expect(wrapper.emitted('change')).toBeUndefined()
    expect(action).not.toHaveBeenCalled()
    expect(wrapper.find('.astryx-input-clear-button').exists()).toBe(false)
  })

  it('keeps read-only values in form submission and removes disabled values', async () => {
    const wrapper = renderInput({ htmlName: 'name', modelValue: 'Ada', isReadOnly: true })
    const form = document.createElement('form')
    document.body.append(form)
    form.append(wrapper.get('.astryx-field').element)
    expect(new FormData(form).get('name')).toBe('Ada')
    await wrapper.setProps({ isDisabled: true })
    expect(new FormData(form).has('name')).toBe(false)
    expect(wrapper.get('input').attributes('disabled')).toBe('')
  })

  it('makes a disabled reason discoverable without permitting editing or submitting', async () => {
    const wrapper = renderInput({ modelValue: 'Ada', isDisabled: true, disabledMessage: 'Editors only', htmlName: 'owner' })
    const input = wrapper.get('input')
    expect(input.attributes('disabled')).toBeUndefined()
    expect(input.attributes('readonly')).toBe('')
    expect(input.attributes('aria-disabled')).toBe('true')
    expect(input.attributes('name')).toBeUndefined()
    input.element.focus()
    await nextTick()
    expect(document.querySelector('[role="tooltip"]')?.textContent).toBe('Editors only')
    expect(document.querySelector<HTMLElement>('[role="tooltip"]')?.style.display).not.toBe('none')
    await input.trigger('keydown', { key: 'Escape' })
    expect(document.querySelector<HTMLElement>('[role="tooltip"]')?.style.display).toBe('none')
    expect(wrapper.emitted('enter')).toBeUndefined()
  })

  it('treats a blank disabledMessage as absent', () => {
    const wrapper = renderInput({ isDisabled: true, disabledMessage: '  ' })
    expect(wrapper.get('input').attributes('disabled')).toBe('')
    expect(wrapper.get('input').attributes('aria-disabled')).toBeUndefined()
  })

  it('runs model update and change before changeAction and permits cancellation', async () => {
    const order: string[] = []
    const wrapper = renderInput({
      changeAction: () => { order.push('action') },
    })
    await wrapper.setProps({
      'onUpdate:modelValue': (value) => {
        order.push('model')
        void wrapper.setProps({ modelValue: value })
      },
      'onChange': () => { order.push('change') },
    })
    await wrapper.get('input').setValue('Ada')
    expect(order).toEqual(['model', 'change', 'action'])
    await wrapper.setProps({ onChange: (_value, event) => event.preventDefault() })
    await wrapper.get('input').setValue('Grace')
    expect(order.filter(entry => entry === 'action')).toHaveLength(1)
  })

  it('shows optimistic text and pending state even if the parent delays accepting it', async () => {
    const pending = deferred()
    const wrapper = renderInput({ changeAction: () => pending.promise })
    await wrapper.setProps({ 'onUpdate:modelValue': () => {} })
    await wrapper.get('input').setValue('Pending')
    expect(wrapper.get('input').element.value).toBe('Pending')
    expect(wrapper.get('input').attributes('aria-busy')).toBe('true')
    expect(wrapper.find('[role="status"]').exists()).toBe(true)
    pending.resolve()
    await flushPromises()
    expect(wrapper.get('input').attributes('aria-busy')).toBeUndefined()
    expect(wrapper.get('input').element.value).toBe('')
  })

  it('tracks concurrent actions without restoring an older value', async () => {
    const first = deferred()
    const second = deferred()
    const action = vi.fn().mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise)
    const wrapper = renderInput({ changeAction: action })
    await wrapper.get('input').setValue('First')
    await wrapper.get('input').setValue('Second')
    second.resolve()
    await flushPromises()
    expect(wrapper.get('input').attributes('aria-busy')).toBe('true')
    expect(wrapper.get('input').element.value).toBe('Second')
    first.reject(new Error('Old request failed'))
    await flushPromises()
    expect(wrapper.get('input').attributes('aria-busy')).toBeUndefined()
    expect(wrapper.get('input').element.value).toBe('Second')
    expect(wrapper.emitted('actionError')?.[0]?.[1]).toBe('First')
  })

  it.each(['sync', 'async'])('cleans pending state after a %s failure and allows retry', async (mode) => {
    const error = new Error('Unavailable')
    const wrapper = renderInput({ changeAction: () => {
      if (mode === 'sync')
        throw error
      return Promise.reject(error)
    } })
    await wrapper.get('input').setValue('Ada')
    await flushPromises()
    expect(wrapper.get('input').attributes('aria-busy')).toBeUndefined()
    expect(wrapper.emitted('actionError')?.[0]?.[0]).toBe(error)
    await wrapper.setProps({ changeAction: vi.fn() })
    await wrapper.get('input').setValue('Grace')
    expect(wrapper.get('input').element.value).toBe('Grace')
  })

  it('combines explicit loading with pending actions and uses localized loading text', async () => {
    const wrapper = renderInput({ isLoading: true, loadingLabel: '正在保存' })
    expect(wrapper.get('[role="status"]').attributes('aria-label')).toBe('正在保存')
    expect(wrapper.get('input').attributes('disabled')).toBeUndefined()
    await wrapper.setProps({ isLoading: false })
    expect(wrapper.find('[role="status"]').exists()).toBe(false)
  })

  it('exposes native ref methods and autofocus', async () => {
    const wrapper = renderInput({ hasAutoFocus: true, modelValue: 'Ada' })
    expect(document.activeElement).toBe(wrapper.vm.element)
    wrapper.vm.blur()
    expect(document.activeElement).not.toBe(wrapper.vm.element)
    wrapper.vm.focus()
    wrapper.vm.select()
    expect(wrapper.get('input').element.selectionStart).toBe(0)
    expect(wrapper.get('input').element.selectionEnd).toBe(3)
  })

  it('forwards native attributes and listeners, including updates to attrs', async () => {
    const onFocus = vi.fn()
    const wrapper = renderInput({ type: 'email', autoComplete: 'email' }, { 'maxlength': 40, 'data-testid': 'email-control', 'onFocus': onFocus, 'class': 'custom-input', 'style': 'background: red' })
    expect(wrapper.get('input').attributes('autocomplete')).toBe('email')
    expect(wrapper.get('input').attributes('maxlength')).toBe('40')
    expect(wrapper.get('.astryx-text-input').classes()).toContain('custom-input')
    wrapper.vm.focus()
    expect(onFocus).toHaveBeenCalledTimes(1)
    await wrapper.setProps({ autoComplete: 'off', id: 'new-id' })
    expect(wrapper.get('input').attributes('autocomplete')).toBe('off')
    expect(wrapper.get('label').attributes('for')).toBe('new-id')
  })

  it('renders all slots and a component startIcon', async () => {
    const wrapper = mount(TextInput, { props: { label: 'Search', modelValue: '' }, slots: { icon: '<svg data-icon />', end: '<span>⌘K</span>', labelIcon: '<svg data-label-icon />' } })
    expect(wrapper.find('.astryx-text-input-icon [data-icon]').exists()).toBe(true)
    expect(wrapper.get('.astryx-text-input-end').text()).toBe('⌘K')
    expect(wrapper.find('.astryx-field-label-icon [data-label-icon]').exists()).toBe(true)
    expect(wrapper.find('.astryx-text-input-icon').attributes('aria-hidden')).toBe('true')
    const icon = { render: () => h('svg', { 'data-component-icon': '' }) }
    const withIcon = renderInput({ startIcon: icon, labelIcon: icon })
    expect(withIcon.find('.astryx-text-input-icon [data-component-icon]').exists()).toBe(true)
    expect(withIcon.find('.astryx-field-label-icon [data-component-icon]').exists()).toBe(true)
  })

  it('shows a status tooltip on focus or tap and closes with Escape', async () => {
    const wrapper = renderInput({ status: { type: 'warning', message: 'Publicly visible' }, statusVariant: 'tooltip' })
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

  it('supports status without message and optional takes precedence over required', () => {
    const wrapper = renderInput({ isRequired: true, isOptional: true, optionalLabel: '可选', status: { type: 'success' } })
    expect(wrapper.get('input').attributes('aria-required')).toBeUndefined()
    expect(wrapper.get('input').attributes('aria-describedby')).toBeUndefined()
    expect(wrapper.get('.astryx-field-optionality').text()).toBe('可选')
    expect(wrapper.get('.astryx-text-input').attributes('data-status')).toBe('success')
  })

  it('sizes the entire field and supports all three sizes', async () => {
    const wrapper = renderInput({ width: 240, size: 'sm' })
    expect(wrapper.get('.astryx-field').attributes('style')).toContain('width: 240px')
    expect(wrapper.get('.astryx-text-input').attributes('data-size')).toBe('sm')
    await wrapper.setProps({ width: 'min(100%, 32rem)', size: 'lg' })
    expect(wrapper.get('.astryx-field').attributes('style')).toContain('min(100%, 32rem)')
    expect(wrapper.get('.astryx-text-input').attributes('data-size')).toBe('lg')
  })

  it('renders server-side with linked IDs and no browser-only dependency', async () => {
    const html = await renderToString(createSSRApp({ render: () => h(TextInput, { label: 'Email', modelValue: 'ada@example.com', description: 'Work address', status: { type: 'error', message: 'Invalid domain' } }) }))
    expect(html).toContain('value="ada@example.com"')
    expect(html).toContain('aria-invalid="true"')
    expect(html).toContain('Invalid domain')
    const id = html.match(/<input[^>]*?\sid="([^"]+)"/)?.[1]
    expect(id).toBeTruthy()
    expect(html).toContain(`for="${id}"`)
    expect(html).toContain(`aria-labelledby="${id}-label"`)
  })
})
