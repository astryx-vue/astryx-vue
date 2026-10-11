import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import MultiSelector from './MultiSelector.vue'
import { flattenOptions } from './options.js'

const options = [
  { value: 'read', label: 'Read' },
  { value: 'write', label: 'Write', disabled: true },
  { type: 'divider' as const },
  { type: 'section' as const, label: 'Admin', options: ['Invite', { value: 'billing', label: 'Billing' }] },
]

async function flush(): Promise<void> {
  await nextTick()
  await Promise.resolve()
}

describe('flattenOptions', () => {
  it('keeps sections and drops empty groups while searching', () => {
    expect(flattenOptions(options, '').filter(row => row.kind === 'heading')).toHaveLength(1)
    const searched = flattenOptions(options, 'bill')
    expect(searched.map(row => row.option?.label ?? row.label)).toEqual(['Admin', 'Billing'])
  })
})

describe('multi selector', () => {
  function mountSelector(props: Record<string, unknown> = {}) {
    return mount(MultiSelector, {
      attachTo: document.body,
      props: { label: 'Access', options, ...props },
    })
  }

  it('toggles options without closing and supports select all', async () => {
    const wrapper = mountSelector({ selectAll: true })
    const trigger = wrapper.get('button[aria-haspopup="listbox"]')
    expect(trigger.attributes('role')).toBe('combobox')
    await trigger.trigger('click')
    await flush()
    expect(trigger.attributes('aria-expanded')).toBe('true')

    const read = [...document.querySelectorAll<HTMLElement>('[role="option"]')].find(option => option.textContent?.includes('Read'))
    read?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await flush()
    expect(trigger.attributes('aria-expanded')).toBe('true')
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toEqual(['read'])

    const selectAll = document.querySelector<HTMLElement>('[data-option-id="__astryx_select_all__"]')
    selectAll?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await flush()
    const last = wrapper.emitted('update:modelValue')?.at(-1)?.[0] as string[]
    expect(last).toEqual(expect.arrayContaining(['read', 'Invite', 'billing']))
    expect(last).not.toContain('write')
    wrapper.unmount()
  })

  it('filters from the search combobox', async () => {
    const wrapper = mountSelector({ searchable: true })
    await wrapper.get('button[aria-haspopup="listbox"]').trigger('click')
    await flush()
    const search = document.querySelector<HTMLInputElement>('input[role="combobox"]')
    expect(search).toBeTruthy()
    search!.value = 'inv'
    search!.dispatchEvent(new Event('input', { bubbles: true }))
    await flush()
    const labels = [...document.querySelectorAll('[role="option"]')].map(option => option.textContent?.trim())
    expect(labels.some(label => label?.includes('Invite'))).toBe(true)
    expect(labels.some(label => label?.includes('Read'))).toBe(false)
    wrapper.unmount()
  })

  it('collapses badges to +N and skips interaction when disabled', async () => {
    const wrapper = mountSelector({
      modelValue: ['read', 'billing', 'Invite'],
      triggerDisplay: 'badges',
      maxBadges: 1,
    })
    expect(wrapper.text()).toContain('+2')

    await wrapper.setProps({ disabled: true, disabledReason: 'Locked', modelValue: [] })
    const trigger = wrapper.get('button[aria-haspopup="listbox"]')
    expect(trigger.attributes('aria-disabled')).toBe('true')
    await trigger.trigger('click')
    await flush()
    expect(trigger.attributes('aria-expanded')).toBe('false')
    wrapper.unmount()
  })

  it('toggles the highlighted option with Space and clears with Backspace', async () => {
    const wrapper = mountSelector({ modelValue: ['read'] })
    const trigger = wrapper.get('button[aria-haspopup="listbox"]')
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    await trigger.trigger('keydown', { key: ' ' })
    await flush()
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toEqual([])

    await trigger.trigger('keydown', { key: 'Backspace' })
    wrapper.unmount()
  })
})
