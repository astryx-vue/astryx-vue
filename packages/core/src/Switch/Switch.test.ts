import type { VueWrapper } from '@vue/test-utils'
import type { SwitchProps } from './types.js'
import { renderToString } from '@vue/server-renderer'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createSSRApp, h, nextTick } from 'vue'
import Switch from './Switch.vue'

enableAutoUnmount(afterEach)
afterEach(() => {
  vi.useRealTimers()
  document.body.innerHTML = ''
})

function renderSwitch(props: Partial<SwitchProps> = {}): VueWrapper<InstanceType<typeof Switch>> {
  const wrapper: VueWrapper<InstanceType<typeof Switch>> = mount(Switch, {
    attachTo: document.body,
    props: {
      'label': 'Notify',
      'modelValue': false,
      'onUpdate:modelValue': (value) => { void wrapper.setProps({ modelValue: value }) },
      ...props,
    },
  })
  return wrapper
}

describe('switch', () => {
  it('toggles v-model and emits change', async () => {
    const wrapper = renderSwitch()
    const input = wrapper.get<HTMLInputElement>('input[type="checkbox"]')
    await input.setValue(true)
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
    expect(wrapper.emitted('change')?.[0]?.[0]).toBe(true)
    await wrapper.setProps({ modelValue: false })
    expect(input.element.checked).toBe(false)
  })

  it('uses role switch and links to label', () => {
    const wrapper = renderSwitch({ id: 'notify' })
    const input = wrapper.get('input')
    expect(input.attributes('role')).toBe('switch')
    expect(input.attributes('aria-checked')).toBe('false')
    expect(input.attributes('aria-labelledby')).toBe('notify-label')
    expect(wrapper.get('label').attributes('for')).toBe('notify')
  })

  it('blocks toggling when disabled or read-only', async () => {
    const action = vi.fn()
    const wrapper = renderSwitch({ isDisabled: true, changeAction: action })
    const input = wrapper.get('input')
    input.element.click()
    await nextTick()
    expect(action).not.toHaveBeenCalled()
    await wrapper.setProps({ isDisabled: false, isReadOnly: true })
    input.element.click()
    await nextTick()
    expect(action).not.toHaveBeenCalled()
  })

  it('shows a disabled reason tooltip and keeps focusable', async () => {
    const wrapper = renderSwitch({ isDisabled: true, disabledMessage: 'Admin only' })
    const input = wrapper.get('input')
    expect(input.attributes('disabled')).toBeUndefined()
    expect(input.attributes('readonly')).toBe('')
    expect(input.attributes('aria-disabled')).toBe('true')
    input.element.focus()
    await nextTick()
    expect(document.querySelector('[role="tooltip"]')?.textContent).toBe('Admin only')
  })

  it('renders server-side with linked IDs', async () => {
    const html = await renderToString(createSSRApp({ render: () => h(Switch, { label: 'Notify', modelValue: true }) }))
    expect(html).toContain('role="switch"')
    expect(html).toContain('aria-checked="true"')
    const id = html.match(/<input[^>]*?\sid="([^"]+)"/)?.[1]
    expect(id).toBeTruthy()
    expect(html).toContain(`for="${id}"`)
  })
})
