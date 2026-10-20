import type { VueWrapper } from '@vue/test-utils'
import type { CheckboxInputProps } from './types.js'
import { renderToString } from '@vue/server-renderer'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createSSRApp, h, nextTick } from 'vue'
import CheckboxInput from './CheckboxInput.vue'

enableAutoUnmount(afterEach)
afterEach(() => {
  vi.useRealTimers()
  document.body.innerHTML = ''
})

function renderInput(props: Partial<CheckboxInputProps> = {}, attrs: Record<string, unknown> = {}): VueWrapper<InstanceType<typeof CheckboxInput>> {
  const wrapper: VueWrapper<InstanceType<typeof CheckboxInput>> = mount(CheckboxInput, {
    attachTo: document.body,
    attrs,
    props: {
      'label': 'Email updates',
      'modelValue': false,
      'onUpdate:modelValue': (value) => { void wrapper.setProps({ modelValue: value }) },
      ...props,
    },
  })
  return wrapper
}

async function activate(wrapper: VueWrapper<InstanceType<typeof CheckboxInput>>): Promise<void> {
  wrapper.get('input').element.click()
  await nextTick()
}

describe('checkboxInput', () => {
  it('associates the native control, label, description, status and external ARIA', () => {
    const wrapper = renderInput({ id: 'updates', description: 'Once a month', status: { type: 'error', message: 'Please choose' } }, { 'aria-describedby': 'external' })
    expect(wrapper.get('label').attributes('for')).toBe('updates')
    expect(wrapper.get('input').attributes()).toMatchObject({ 'type': 'checkbox', 'aria-labelledby': 'updates-label', 'aria-describedby': 'external updates-description updates-status', 'aria-invalid': 'true' })
    expect(wrapper.get('#updates-status').text()).toContain('Please choose')
  })

  it('toggles from indeterminate to checked, emits booleans, and follows parent changes', async () => {
    const wrapper = renderInput({ modelValue: 'indeterminate' })
    const input = wrapper.get('input').element
    expect(input.indeterminate).toBe(true)
    expect(input.checked).toBe(false)
    expect(input.hasAttribute('aria-checked')).toBe(false)
    await activate(wrapper)
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
    expect(input.checked).toBe(true)
    expect(input.indeterminate).toBe(false)
    expect(wrapper.find('.astryx-checkbox-indicator-check').exists()).toBe(true)
    await activate(wrapper)
    expect(input.checked).toBe(false)
    await wrapper.setProps({ modelValue: 'indeterminate' })
    expect(input.indeterminate).toBe(true)
  })

  it('activates from both label and description', async () => {
    const wrapper = renderInput({ description: 'Once a month' })
    wrapper.get('label').element.click()
    await nextTick()
    expect(wrapper.get('input').element.checked).toBe(true)
    await wrapper.get('.astryx-field-description').trigger('click')
    expect(wrapper.get('input').element.checked).toBe(false)
  })

  it.each([{ isDisabled: true }, { isReadOnly: true }, { isLoading: true }, { isDisabled: true, disabledMessage: 'Ask an administrator' }])('blocks native activation and synthetic changes for %j', async (state) => {
    const action = vi.fn()
    const wrapper = renderInput({ ...state, changeAction: action, modelValue: 'indeterminate' })
    await activate(wrapper)
    const input = wrapper.get('input')
    expect(input.element.indeterminate).toBe(true)
    input.element.checked = true
    input.element.dispatchEvent(new Event('change', { bubbles: true }))
    await nextTick()
    expect(input.element.checked).toBe(false)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(action).not.toHaveBeenCalled()
  })

  it('keeps disabled reasons focusable, described and excluded from form ownership', async () => {
    const wrapper = renderInput({ isDisabled: true, disabledMessage: 'Ask an administrator', htmlName: 'updates', isRequired: true })
    const input = wrapper.get('input')
    expect(input.element.disabled).toBe(false)
    expect(input.attributes('aria-disabled')).toBe('true')
    expect(input.attributes('name')).toBeUndefined()
    expect(input.attributes('form')).toBe('')
    expect(document.getElementById(input.attributes('aria-describedby')!)?.textContent).toBe('Ask an administrator')
    wrapper.vm.focus()
    expect(document.activeElement).toBe(input.element)
    await input.trigger('focus')
    await nextTick()
    expect(document.querySelector('[role="tooltip"]')?.textContent).toContain('Ask an administrator')
    await input.trigger('keydown', { key: 'Escape' })
    expect((document.querySelector('[role="tooltip"]') as HTMLElement).style.display).toBe('none')
    wrapper.vm.blur()
    expect(document.activeElement).not.toBe(input.element)
  })

  it('submits the native value only when checked and enabled, including read-only controls', async () => {
    const form = document.createElement('form')
    form.id = 'preferences'
    document.body.append(form)
    const wrapper = renderInput({ htmlName: 'updates' }, { value: 'weekly', form: form.id })
    expect(new FormData(form).has('updates')).toBe(false)
    await activate(wrapper)
    expect(new FormData(form).get('updates')).toBe('weekly')
    await wrapper.setProps({ isReadOnly: true })
    expect(new FormData(form).get('updates')).toBe('weekly')
    await wrapper.setProps({ isDisabled: true })
    expect(new FormData(form).has('updates')).toBe(false)
    await wrapper.setProps({ disabledMessage: 'Not available' })
    expect(wrapper.get('input').element.form).toBeNull()
    expect(new FormData(form).has('updates')).toBe(false)
  })

  it('restores the controlled state after form reset and rejected model updates', async () => {
    const form = document.createElement('form')
    form.id = 'controlled'
    document.body.append(form)
    const wrapper = renderInput({ 'modelValue': 'indeterminate', 'onUpdate:modelValue': () => {} } as Partial<CheckboxInputProps>, { form: form.id })
    await activate(wrapper)
    expect(wrapper.get('input').element.indeterminate).toBe(true)
    expect(wrapper.get('input').element.checked).toBe(false)
    await wrapper.setProps({ modelValue: true })
    form.reset()
    await nextTick()
    expect(wrapper.get('input').element.checked).toBe(true)
  })

  it('supports required validation and gives isOptional precedence over isRequired', async () => {
    const wrapper = renderInput({ isRequired: true })
    expect(wrapper.get('input').element.required).toBe(true)
    expect(wrapper.get('input').element.checkValidity()).toBe(false)
    await activate(wrapper)
    expect(wrapper.get('input').element.checkValidity()).toBe(true)
    await wrapper.setProps({ isOptional: true })
    expect(wrapper.get('input').element.required).toBe(false)
    expect(wrapper.get('input').attributes('aria-required')).toBeUndefined()
    expect(wrapper.get('.astryx-field-optionality').text()).toBe('∙ Optional')
  })

  it('blocks repeat activation while saving and accepts explicit parent updates', async () => {
    let resolve!: () => void
    const action = vi.fn(() => new Promise<void>((done) => {
      resolve = done
    }))
    const wrapper = renderInput({ changeAction: action })
    await activate(wrapper)
    expect(wrapper.get('input').attributes('aria-busy')).toBe('true')
    expect(wrapper.find('.astryx-checkbox-spinner').exists()).toBe(true)
    await activate(wrapper)
    expect(action).toHaveBeenCalledTimes(1)
    expect(wrapper.get('input').element.checked).toBe(true)
    await wrapper.setProps({ modelValue: 'indeterminate' })
    expect(wrapper.get('input').element.indeterminate).toBe(true)
    resolve()
    await flushPromises()
    expect(wrapper.get('input').attributes('aria-busy')).toBeUndefined()
    expect(wrapper.get('input').element.indeterminate).toBe(true)
  })

  it.each(['throw', 'reject'])('reports %s failures without rolling back v-model and allows retry', async (mode) => {
    const error = new Error('Offline')
    const action = vi.fn(() => {
      if (mode === 'throw')
        throw error
      return Promise.reject(error)
    })
    const wrapper = renderInput({ changeAction: action })
    await activate(wrapper)
    await flushPromises()
    expect(wrapper.emitted('actionError')?.[0]?.slice(0, 2)).toEqual([error, true])
    expect(wrapper.get('input').element.checked).toBe(true)
    expect(wrapper.get('input').attributes('aria-busy')).toBeUndefined()
    await activate(wrapper)
    expect(action).toHaveBeenCalledTimes(2)
  })

  it('allows change listeners to cancel the action without canceling the model update', async () => {
    const action = vi.fn()
    const wrapper = renderInput({ changeAction: action }, { onChange: (_value: boolean, event: Event) => event.preventDefault() })
    await activate(wrapper)
    expect(action).not.toHaveBeenCalled()
    expect(wrapper.get('input').element.checked).toBe(true)
  })

  it('forwards native attributes and events, applies wrapper styles, and protects owned semantics', async () => {
    const onFocus = vi.fn()
    const wrapper = renderInput({ isLabelHidden: true, width: 240 }, { 'data-test': 'native', 'class': 'custom', 'style': { margin: '4px' }, 'aria-checked': 'false', 'type': 'radio', 'role': 'switch', onFocus })
    expect(wrapper.get('input').attributes('data-test')).toBe('native')
    expect(wrapper.get('input').attributes('type')).toBe('checkbox')
    expect(wrapper.get('input').attributes('role')).toBeUndefined()
    expect(wrapper.get('input').attributes('aria-checked')).toBeUndefined()
    expect(wrapper.get('.astryx-checkbox-input').attributes('style')).toContain('width: 240px')
    expect(wrapper.get('.astryx-checkbox-input').classes()).toContain('custom')
    expect(wrapper.get('label').text()).toBe('Email updates')
    wrapper.vm.focus()
    expect(onFocus).toHaveBeenCalled()
    expect(wrapper.vm.element).toBe(wrapper.get('input').element)
    await wrapper.setProps({ size: 'sm', id: 'new-id' })
    expect(wrapper.get('label').attributes('for')).toBe('new-id')
    expect(wrapper.get('input').attributes('aria-labelledby')).toBe('new-id-label')
  })

  it('renders checked state and distinct label IDs during SSR', async () => {
    const html = await renderToString(createSSRApp({ render: () => h('div', [h(CheckboxInput, { label: 'First', modelValue: true }), h(CheckboxInput, { label: 'Second', modelValue: 'indeterminate' })]) }))
    expect(html).toContain(' checked')
    const ids = [...html.matchAll(/<input[^>]+id="([^"]+)"/g)].map(match => match[1])
    expect(ids).toHaveLength(2)
    expect(ids[0]).not.toBe(ids[1])
    expect(html).toContain('data-state="indeterminate"')
  })
})
