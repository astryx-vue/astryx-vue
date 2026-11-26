import type { ComplexSelectorTriggerProps } from './types.js'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import LayerProvider from '../LayerProvider/LayerProvider.vue'
import ComplexSelector from './ComplexSelector.vue'

afterEach(() => {
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

type Commit = (value: unknown) => void

function mountSelector(props: Record<string, unknown> = {}, attrs: Record<string, unknown> = {}) {
  let commitFromSlot: Commit | undefined
  const wrapper = mount(ComplexSelector, {
    attachTo: document.body,
    props: { label: 'Fruit', modelValue: 'apple', triggerLabel: 'Apple', ...props },
    attrs,
    slots: {
      default: ({ commit }: { commit: Commit }) => {
        commitFromSlot = commit
        return h('button', { 'type': 'button', 'data-testid': 'pear' }, 'Pear')
      },
    },
  })
  return { wrapper, commit: (value: string) => commitFromSlot?.(value) }
}

function trigger(wrapper: ReturnType<typeof mountSelector>['wrapper']) {
  return wrapper.get('button.astryx-complex-selector')
}

describe('complex selector field semantics', () => {
  it('blocks a commit from a popup that opened before the field became disabled', async () => {
    const changeAction = vi.fn()
    const { wrapper, commit } = mountSelector({ changeAction })
    await trigger(wrapper).trigger('click')
    await nextTick()
    await wrapper.setProps({ isDisabled: true })
    await commit('pear')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.emitted('change')).toBeUndefined()
    expect(changeAction).not.toHaveBeenCalled()
  })

  it('lets a caller aria-label or aria-labelledby name the built-in trigger', () => {
    const labelled = mountSelector({}, { 'aria-labelledby': 'billing' })
    expect(trigger(labelled.wrapper).attributes('aria-labelledby')).toBe('billing')
    const named = mountSelector({}, { 'aria-label': 'Pick a fruit' })
    expect(trigger(named.wrapper).attributes('aria-label')).toBe('Pick a fruit')
    expect(trigger(named.wrapper).attributes('aria-labelledby')).toBeUndefined()
    const plain = mountSelector()
    expect(trigger(plain.wrapper).attributes('aria-labelledby')).toBe(plain.wrapper.get('label').attributes('id'))
  })

  it('describes the trigger with its description and status', () => {
    const { wrapper } = mountSelector({ description: 'Seasonal', status: { type: 'error', message: 'Pick one' } })
    const ids = trigger(wrapper).attributes('aria-describedby')?.split(' ') ?? []
    expect(ids.map(id => document.getElementById(id)?.textContent)).toEqual(['Seasonal', 'Pick one'])
  })

  it('an attached status puts its icon in the chevron\'s place', () => {
    const { wrapper } = mountSelector({ status: { type: 'error', message: 'Pick one' } })
    expect(trigger(wrapper).find('.astryx-field-status-glyph[data-status="error"]').exists()).toBe(true)
    expect(trigger(wrapper).find('.astryx-complex-selector-chevron').exists()).toBe(false)
    const detached = mountSelector({ status: { type: 'error', message: 'Pick one' }, statusVariant: 'detached' })
    expect(trigger(detached.wrapper).find('.astryx-complex-selector-chevron').exists()).toBe(true)
  })

  it('a tooltip status keeps its message in a focusable status button that does not open the popup', async () => {
    const { wrapper } = mountSelector({ status: { type: 'warning', message: 'Check stock' }, statusVariant: 'tooltip' })
    const tip = wrapper.get('button.astryx-field-status-glyph')
    expect(trigger(wrapper).element.contains(tip.element)).toBe(false)
    await tip.trigger('click')
    await nextTick()
    expect(trigger(wrapper).attributes('aria-expanded')).toBe('false')
  })

  it('a disabledMessage describes the disabled trigger and shows on focus', async () => {
    const { wrapper } = mountSelector({ isDisabled: true, disabledMessage: 'Locked by admin' })
    const button = trigger(wrapper)
    const ids = button.attributes('aria-describedby')?.split(' ') ?? []
    expect(ids.map(id => document.getElementById(id)?.textContent)).toContain('Locked by admin')
    ;(button.element as HTMLElement).focus()
    await button.trigger('focus')
    await nextTick()
    expect(document.body.textContent).toContain('Locked by admin')
    await button.trigger('click')
    expect(button.attributes('aria-expanded')).toBe('false')
  })

  it('warns in development without a default slot', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    mount(ComplexSelector, { props: { label: 'Fruit', modelValue: 'apple' } })
    expect(warn.mock.calls.some(call => String(call[0]).includes('default slot'))).toBe(true)
  })
})

describe('complex selector custom trigger and popup cap', () => {
  it('a tooltip status button carries the positioning class', () => {
    const { wrapper } = mountSelector({ status: { type: 'warning', message: 'Check stock' }, statusVariant: 'tooltip' })
    expect(wrapper.get('button.astryx-field-status-glyph').classes()).toContain('astryx-complex-selector-status-tip')
  })

  it('a disabledMessage reaches a caller-rendered trigger: description and focus tooltip', async () => {
    const wrapper = mount(ComplexSelector, {
      attachTo: document.body,
      props: {
        label: 'Fruit',
        modelValue: 'apple',
        isDisabled: true,
        disabledMessage: 'Locked by admin',
        renderTrigger: (props: ComplexSelectorTriggerProps) => h('button', { ...props, type: 'button' }, 'Pick'),
      },
      slots: { default: () => h('div', 'picker') },
    })
    const button = wrapper.get('button')
    const ids = button.attributes('aria-describedby')?.split(' ') ?? []
    expect(ids.map(id => document.getElementById(id)?.textContent)).toContain('Locked by admin')
    ;(button.element as HTMLElement).focus()
    await button.trigger('focus')
    await nextTick()
    expect(document.body.textContent).toContain('Locked by admin')
  })

  it('caps the popup content by the viewport minus the layer gutters, including a LayerProvider inset', async () => {
    const wrapper = mount(() => h(LayerProvider, { inset: { blockEnd: 60 } }, () => h(ComplexSelector, { label: 'Fruit', modelValue: 'apple', triggerLabel: 'Apple' }, { default: () => h('div', 'picker') })), { attachTo: document.body })
    await wrapper.get('button.astryx-complex-selector').trigger('click')
    await nextTick()
    const style = document.querySelector<HTMLElement>('.astryx-complex-selector-content')?.getAttribute('style') ?? ''
    // 基础空隙 16 + 16，再加底栏的 60。
    expect(style).toContain('calc(100dvh - 92px)')
    wrapper.unmount()
  })
})
