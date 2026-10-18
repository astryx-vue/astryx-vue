import type { ComplexSelectorHandle, ComplexSelectorTriggerProps } from './types.js'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref, shallowRef } from 'vue'
import ComplexSelector from './ComplexSelector.vue'

const Harness = defineComponent({
  components: { ComplexSelector },
  setup() {
    const value = ref('apple')
    const pending = ref(false)
    async function changeAction(): Promise<void> {
      pending.value = true
      await Promise.resolve()
      pending.value = false
    }
    return { changeAction, pending, value }
  },
  template: `
    <ComplexSelector
      v-model="value"
      label="Fruit"
      :trigger-label="value"
      :change-action="changeAction"
    >
      <template #default="{ commit, close }">
        <button type="button" data-testid="pear" @click="commit('pear'); close()">Pear</button>
      </template>
    </ComplexSelector>
  `,
})

describe('complex selector', () => {
  it('opens with arrow down and commits from the slot', async () => {
    const wrapper = mount(Harness, { attachTo: document.body })
    const trigger = wrapper.get('button.astryx-complex-selector')
    expect(trigger.attributes('aria-expanded')).toBe('false')
    expect(trigger.text()).toContain('apple')

    await trigger.trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    expect(trigger.attributes('aria-expanded')).toBe('true')
    expect(trigger.attributes('aria-haspopup')).toBe('dialog')

    const pear = document.body.querySelector('[data-testid="pear"]') as HTMLElement
    expect(pear).toBeTruthy()
    pear.click()
    await nextTick()
    expect(wrapper.vm.value).toBe('pear')
    expect(trigger.attributes('aria-expanded')).toBe('false')
    wrapper.unmount()
  })

  it('does not open while disabled', async () => {
    const wrapper = mount(ComplexSelector, {
      props: { label: 'Fruit', modelValue: 'apple', isDisabled: true },
      slots: { default: 'Body' },
    })
    const trigger = wrapper.get('button.astryx-complex-selector')
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    expect(trigger.attributes('aria-expanded')).toBe('false')
    expect(trigger.attributes('disabled')).toBeDefined()
  })

  it('opens from handleRef and aligns the popup', async () => {
    const handle = shallowRef<ComplexSelectorHandle | null>(null)
    const wrapper = mount(ComplexSelector, {
      props: {
        label: 'Fruit',
        modelValue: 'apple',
        alignment: 'end',
        handleRef: handle,
      },
      slots: { default: 'Body' },
    })
    expect(wrapper.findComponent({ name: 'AstryxPopover' }).props('alignment')).toBe('end')
    expect(handle.value?.isOpen()).toBe(false)
    handle.value?.open()
    await nextTick()
    expect(wrapper.get('button.astryx-complex-selector').attributes('aria-expanded')).toBe('true')
    handle.value?.close()
    await nextTick()
    expect(handle.value?.isOpen()).toBe(false)
  })

  it('replaces the field with renderTrigger and keeps one toggle', async () => {
    const Triggered = defineComponent({
      components: { ComplexSelector },
      setup() {
        const value = ref('apple')
        function renderTrigger(props: ComplexSelectorTriggerProps) {
          return h('button', { ...props, 'type': 'button', 'data-testid': 'custom' }, 'Pick')
        }
        return { renderTrigger, value }
      },
      template: `
        <ComplexSelector v-model="value" label="Fruit" :render-trigger="renderTrigger">
          Body
        </ComplexSelector>
      `,
    })
    const wrapper = mount(Triggered, { attachTo: document.body })
    expect(wrapper.find('button.astryx-complex-selector').exists()).toBe(false)
    expect(wrapper.find('.astryx-field').exists()).toBe(false)
    const custom = wrapper.get('[data-testid="custom"]')
    expect(custom.attributes('aria-haspopup')).toBe('dialog')
    await custom.trigger('click')
    expect(custom.attributes('aria-expanded')).toBe('true')
    await custom.trigger('click')
    expect(custom.attributes('aria-expanded')).toBe('false')
    wrapper.unmount()
  })

  it('draws a start icon and the ghost trigger', () => {
    const wrapper = mount(ComplexSelector, {
      props: {
        label: 'Fruit',
        modelValue: 'apple',
        triggerLabel: 'Apple',
        startIcon: 'check',
        variant: 'ghost',
      },
      slots: { default: 'Body' },
    })
    const trigger = wrapper.get('button.astryx-complex-selector')
    expect(trigger.attributes('data-variant')).toBe('ghost')
    expect(trigger.find('.astryx-complex-selector-start').exists()).toBe(true)
  })

  it('emits click before opening and lets preventDefault keep it closed', async () => {
    const states: (string | null)[] = []
    const wrapper = mount(ComplexSelector, {
      props: {
        label: 'Fruit',
        modelValue: 'apple',
        onClick: (event: MouseEvent) => {
          states.push((event.currentTarget as HTMLElement).getAttribute('aria-expanded'))
          event.preventDefault()
        },
      },
      slots: { default: 'Body' },
    })
    const trigger = wrapper.get('button.astryx-complex-selector')
    await trigger.trigger('click')
    await nextTick()
    expect(states).toEqual(['false'])
    expect(trigger.attributes('aria-expanded')).toBe('false')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('opens on a click the handler leaves alone', async () => {
    const wrapper = mount(ComplexSelector, {
      props: { label: 'Fruit', modelValue: 'apple', onClick: () => {} },
      slots: { default: 'Body' },
    })
    const trigger = wrapper.get('button.astryx-complex-selector')
    await trigger.trigger('click')
    await nextTick()
    expect(trigger.attributes('aria-expanded')).toBe('true')
  })

  it('emits keydown for every key, including the arrow that opens', async () => {
    const keys: string[] = []
    const wrapper = mount(ComplexSelector, {
      props: { label: 'Fruit', modelValue: 'apple', onKeydown: (event: KeyboardEvent) => keys.push(event.key) },
      slots: { default: 'Body' },
    })
    const trigger = wrapper.get('button.astryx-complex-selector')
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    expect(keys).toEqual(['ArrowDown'])
    expect(trigger.attributes('aria-expanded')).toBe('true')
    await trigger.trigger('keydown', { key: 'a' })
    expect(keys).toEqual(['ArrowDown', 'a'])
  })

  it('reports every open and close', async () => {
    const states: boolean[] = []
    const handle = shallowRef<ComplexSelectorHandle | null>(null)
    const wrapper = mount(ComplexSelector, {
      props: { label: 'Fruit', modelValue: 'apple', handleRef: handle, onOpenChange: (isOpen: boolean) => states.push(isOpen) },
      slots: { default: 'Body' },
    })
    handle.value?.open()
    await nextTick()
    handle.value?.close()
    await nextTick()
    await wrapper.get('button.astryx-complex-selector').trigger('click')
    await nextTick()
    expect(states).toEqual([true, false, true])
  })

  it('runs a custom trigger click after the toggle and cannot cancel it', async () => {
    const states: (string | null)[] = []
    const Triggered = defineComponent({
      components: { ComplexSelector },
      setup() {
        const value = ref('apple')
        function renderTrigger(props: ComplexSelectorTriggerProps) {
          return h('button', {
            ...props,
            'type': 'button',
            'data-testid': 'custom',
            'onClick': (event: MouseEvent) => {
              props.onClick(event)
              states.push((event.currentTarget as HTMLElement).getAttribute('aria-expanded'))
              event.preventDefault()
            },
          }, 'Pick')
        }
        return { renderTrigger, value }
      },
      template: `
        <ComplexSelector v-model="value" label="Fruit" :render-trigger="renderTrigger">
          Body
        </ComplexSelector>
      `,
    })
    const wrapper = mount(Triggered, { attachTo: document.body })
    const custom = wrapper.get('[data-testid="custom"]')
    await custom.trigger('click')
    await nextTick()
    expect(custom.attributes('aria-expanded')).toBe('true')
    wrapper.unmount()
  })
})
