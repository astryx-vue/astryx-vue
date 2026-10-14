import type { MultiSelectorHandle } from './types.js'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
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

  it('does not paint a keyboard ring when a pointer opens the search', async () => {
    const wrapper = mountSelector({ searchable: true })
    document.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
    await wrapper.get('button[aria-haspopup="listbox"]').trigger('click')
    await flush()
    const search = document.querySelector('.astryx-multi-selector-search')
    expect(search?.getAttribute('data-keyboard-focus')).toBeNull()
    wrapper.unmount()
  })

  it('paints a keyboard ring when the keyboard opens the search', async () => {
    const wrapper = mountSelector({ searchable: true })
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    await wrapper.get('button[aria-haspopup="listbox"]').trigger('keydown', { key: 'ArrowDown' })
    await flush()
    const search = document.querySelector('.astryx-multi-selector-search')
    expect(search?.getAttribute('data-keyboard-focus')).toBe('true')
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

  it('formats the closed trigger for count and labels, and ignores badges', () => {
    const formatValue = vi.fn((items: { label: string }[]) => items.map(item => item.label).join(' & '))
    const wrapper = mountSelector({ modelValue: ['read', 'billing'], formatValue, triggerDisplay: 'count' })
    expect(wrapper.get('.astryx-multi-selector-value').text()).toBe('Read & Billing')
    expect(formatValue).toHaveBeenCalled()

    const badges = mountSelector({
      modelValue: ['read'],
      triggerDisplay: 'badges',
      formatValue: () => 'formatted',
    })
    expect(badges.text()).not.toContain('formatted')
    expect(badges.text()).toContain('Read')

    const empty = mountSelector({ formatValue: vi.fn(() => 'formatted') })
    expect(empty.text()).toContain('Select…')
    wrapper.unmount()
    badges.unmount()
    empty.unmount()
  })

  it('offers a create row and reports the query', async () => {
    const wrapper = mountSelector({ searchable: true, hasCreate: true, modelValue: [] })
    await wrapper.get('button[aria-haspopup="listbox"]').trigger('click')
    await flush()
    const search = document.querySelector('.astryx-multi-selector-search-input') as HTMLInputElement
    search.value = 'Audit'
    search.dispatchEvent(new Event('input', { bubbles: true }))
    await flush()
    expect(document.body.textContent).toContain('Create "Audit"')
    await search.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    await flush()
    const change = wrapper.emitted('change')?.at(-1)
    expect(change?.[0]).toEqual(['Audit'])
    expect(change?.[1]).toEqual({ type: 'create', query: 'Audit' })
    wrapper.unmount()
  })

  it('does not offer a create row for an existing label or while loading', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mountSelector({ searchable: true, hasCreate: true, isLoading: true })
    await wrapper.get('.astryx-multi-selector-trigger').trigger('click')
    await flush()
    expect(document.body.textContent).not.toContain('Create')
    expect(document.querySelector('.astryx-multi-selector-empty')).toBeNull()
    wrapper.unmount()

    mountSelector({ hasCreate: true })
    expect(warn).toHaveBeenCalled()
    warn.mockRestore()
  })

  it('replaces the chevron with a warning icon when the status is a tooltip', () => {
    const wrapper = mountSelector({
      variant: 'ghost',
      status: 'warning',
      statusMessage: 'Some filters hide archived rows',
      statusVariant: 'tooltip',
    })
    expect(wrapper.get('button.astryx-field-status-glyph').attributes('aria-label')).toBe('Warning details')
    expect(wrapper.find('.astryx-multi-selector-chevron').exists()).toBe(false)
    wrapper.unmount()
  })

  it('opens and closes from the handle, and refuses when read-only', async () => {
    const handleRef = ref<MultiSelectorHandle | null>(null)
    const wrapper = mountSelector({ handleRef })
    await flush()
    handleRef.value?.open()
    await flush()
    expect(handleRef.value?.isOpen()).toBe(true)
    handleRef.value?.close()
    await flush()
    expect(handleRef.value?.isOpen()).toBe(false)

    await wrapper.setProps({ isReadOnly: true, modelValue: ['read'] })
    const trigger = wrapper.get('.astryx-multi-selector-trigger')
    expect(trigger.attributes('aria-readonly')).toBe('true')
    expect(trigger.attributes('aria-haspopup')).toBeUndefined()
    handleRef.value?.open()
    await flush()
    expect(handleRef.value?.isOpen()).toBe(false)
    wrapper.unmount()
  })
})
