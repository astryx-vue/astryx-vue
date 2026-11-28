import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import SelectableCardGroup from './SelectableCardGroup.vue'
import SelectableCardGroupItem from './SelectableCardGroupItem.vue'

enableAutoUnmount(afterEach)

const PLANS = ['Basic', 'Pro', 'Team']

function items(disabled?: string) {
  return () => PLANS.map(plan => h(SelectableCardGroupItem, { key: plan, value: plan, label: plan, isDisabled: plan === disabled }, () => plan))
}

function single(options: { initial?: string | null, isDisabled?: boolean, onChange?: (value: unknown) => void, disabledCard?: string, htmlName?: string } = {}) {
  return mount(defineComponent({
    setup() {
      const value = ref<string | null>(options.initial ?? null)
      return () => h(SelectableCardGroup, {
        'label': 'Plan',
        'description': 'Billed monthly',
        'htmlName': options.htmlName,
        'isDisabled': options.isDisabled,
        'modelValue': value.value,
        'onUpdate:modelValue': (next: string | string[]) => {
          value.value = next as string
          options.onChange?.(next)
        },
      }, items(options.disabledCard))
    },
  }), { attachTo: document.body })
}

function multiple(onChange: (value: unknown) => void) {
  return mount(defineComponent({
    setup() {
      const value = ref<string[]>(['Basic'])
      return () => h(SelectableCardGroup, {
        'label': 'Add-ons',
        'selectionMode': 'multiple',
        'modelValue': value.value,
        'onUpdate:modelValue': (next: string | string[]) => {
          value.value = next as string[]
          onChange(next)
        },
      }, items())
    },
  }), { attachTo: document.body })
}

function radio(wrapper: ReturnType<typeof single>, name: string) {
  const input = wrapper.findAll<HTMLInputElement>('input[type="radio"]').find(node => node.attributes('aria-label') === name)
  if (input == null)
    throw new Error(`no radio ${name}`)
  return input
}

describe('selectableCardGroup', () => {
  it('a single choice is a named radiogroup of radios sharing one name', () => {
    const wrapper = single({ initial: 'Pro' })
    const group = wrapper.get('[role="radiogroup"]')
    const labelledBy = group.attributes('aria-labelledby')!
    expect(document.getElementById(labelledBy)?.textContent).toContain('Plan')
    expect(document.getElementById(group.attributes('aria-describedby')!)?.textContent).toContain('Billed monthly')
    const radios = wrapper.findAll<HTMLInputElement>('input[type="radio"]')
    expect(radios).toHaveLength(3)
    const names = new Set(radios.map(node => node.attributes('name')))
    expect(names.size).toBe(1)
    expect([...names][0]).toBeTruthy()
    expect(radio(wrapper, 'Pro').element.checked).toBe(true)
    expect(wrapper.find('input[type="checkbox"]').exists()).toBe(false)
  })

  it('choosing a card moves the selection and reports its value', async () => {
    const onChange = vi.fn()
    const wrapper = single({ initial: 'Basic', onChange })
    await wrapper.findAll('.astryx-card').find(card => card.text() === 'Team')!.trigger('click')
    expect(onChange).toHaveBeenCalledWith('Team')
    expect(radio(wrapper, 'Team').element.checked).toBe(true)
    expect(radio(wrapper, 'Basic').element.checked).toBe(false)
  })

  it('choosing the chosen card again changes nothing', async () => {
    const onChange = vi.fn()
    const wrapper = single({ initial: 'Basic', onChange })
    await wrapper.findAll('.astryx-card').find(card => card.text() === 'Basic')!.trigger('click')
    expect(onChange).not.toHaveBeenCalled()
    expect(radio(wrapper, 'Basic').element.checked).toBe(true)
  })

  it('a disabled group selects nothing and keeps its cards focusable', async () => {
    const onChange = vi.fn()
    const wrapper = single({ isDisabled: true, onChange })
    expect(wrapper.get('[role="radiogroup"]').attributes('aria-disabled')).toBe('true')
    await wrapper.findAll('.astryx-card').find(card => card.text() === 'Pro')!.trigger('click')
    expect(onChange).not.toHaveBeenCalled()
    for (const input of wrapper.findAll('input[type="radio"]')) {
      expect(input.attributes('aria-disabled')).toBe('true')
      expect(input.attributes('disabled')).toBeUndefined()
    }
  })

  it('several choices are a named group of checkboxes that toggle', async () => {
    const onChange = vi.fn()
    const wrapper = multiple(onChange)
    expect(wrapper.get('[role="group"]').attributes('aria-labelledby')).toBeTruthy()
    expect(wrapper.findAll('input[type="checkbox"]')).toHaveLength(3)
    expect(wrapper.find('input[type="radio"]').exists()).toBe(false)
    const card = (name: string) => wrapper.findAll('.astryx-card').find(node => node.text() === name)!
    await card('Team').trigger('click')
    expect(onChange).toHaveBeenLastCalledWith(['Basic', 'Team'])
    await card('Basic').trigger('click')
    expect(onChange).toHaveBeenLastCalledWith(['Team'])
  })

  it('an item outside a group throws', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(() => mount(SelectableCardGroupItem, { props: { value: 'x', label: 'X' } })).toThrow(/inside a SelectableCardGroup/)
    spy.mockRestore()
  })

  // happy-dom 的 FormData 不认 `form=""` 这种改归属，所以这里查属性和隐藏输入，不查 FormData。
  function submitted(wrapper: ReturnType<typeof mount>): Array<[string, string]> {
    return wrapper.findAll<HTMLInputElement>('input')
      .filter(node => node.attributes('form') !== '' && !node.element.disabled && node.attributes('name') != null)
      .filter(node => node.attributes('type') === 'hidden' || (node.element as HTMLInputElement).checked)
      .map(node => [node.attributes('name')!, node.element.value])
  }

  it('a disabled group submits nothing with its form, and keeps its grouping', () => {
    const wrapper = mount(defineComponent({ render: () => h(SelectableCardGroup, { label: 'Plan', modelValue: 'Pro', isDisabled: true, htmlName: 'plan' }, items()) }), { attachTo: document.body })
    expect(submitted(wrapper)).toEqual([])
    expect(wrapper.find('input[type="hidden"]').exists()).toBe(false)
    const names = new Set(wrapper.findAll('input[type="radio"]').map(node => node.attributes('name')))
    expect(names.size).toBe(1)
  })

  it('an enabled group submits the chosen card\'s value under htmlName', () => {
    const wrapper = mount(defineComponent({ render: () => h(SelectableCardGroup, { label: 'Plan', modelValue: 'Pro', htmlName: 'plan' }, items()) }), { attachTo: document.body })
    expect(submitted(wrapper)).toEqual([['plan', 'Pro']])
    expect(new Set(wrapper.findAll('input[type="radio"]').map(node => node.attributes('name'))).has('plan')).toBe(false)
  })

  it('a chosen card disabled on its own submits nothing, and the group keeps one form owner', () => {
    const wrapper = mount(defineComponent({ render: () => h(SelectableCardGroup, { label: 'Plan', modelValue: 'Team', htmlName: 'plan' }, items('Team')) }), { attachTo: document.body })
    expect(submitted(wrapper)).toEqual([])
    const owners = new Set(wrapper.findAll('input[type="radio"]').map(node => node.attributes('form')))
    expect([...owners]).toEqual([''])
  })

  it('checkbox cards submit their value under htmlName when selected, and a disabled card leaves the form', () => {
    const wrapper = mount(defineComponent({
      render: () => h(SelectableCardGroup, { label: 'Add-ons', selectionMode: 'multiple', modelValue: ['Basic', 'Team'], htmlName: 'addons' }, items('Team')),
    }), { attachTo: document.body })
    expect(submitted(wrapper)).toEqual([['addons', 'Basic']])
  })

  it('keeps the caller\'s aria-labelledby and aria-describedby beside its own', () => {
    const wrapper = mount(defineComponent({
      render: () => h('div', [
        h('span', { id: 'extra-label' }, 'Billing'),
        h('span', { id: 'extra-help' }, 'Change any time'),
        h(SelectableCardGroup, {
          'label': 'Plan',
          'description': 'Billed monthly',
          'modelValue': null,
          'aria-labelledby': 'extra-label',
          'aria-describedby': 'extra-help',
        }, items()),
      ]),
    }), { attachTo: document.body })
    const group = wrapper.get('[role="radiogroup"]')
    const labels = group.attributes('aria-labelledby')!.split(' ')
    expect(labels).toHaveLength(2)
    expect(labels[1]).toBe('extra-label')
    const described = group.attributes('aria-describedby')!.split(' ')
    expect(described[1]).toBe('extra-help')
    expect(document.getElementById(described[0]!)?.textContent).toContain('Billed monthly')
  })

  it('puts class and style on the field box, not the group', () => {
    const wrapper = mount(defineComponent({
      render: () => h(SelectableCardGroup, { label: 'Plan', modelValue: null, class: 'field-box', style: { marginTop: '7px' } }, items()),
    }), { attachTo: document.body })
    const group = wrapper.get('[role="radiogroup"]')
    expect(group.classes()).not.toContain('field-box')
    const box = group.element.closest<HTMLElement>('.field-box')
    expect(box).not.toBeNull()
    expect(box!.style.marginTop).toBe('7px')
  })
})
