import type { PowerSearchConfig, PowerSearchFilter } from './types.js'
import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import PowerSearch from './PowerSearch.vue'
import PowerSearchEditor from './PowerSearchEditor.vue'

const config: PowerSearchConfig = {
  name: 'editor',
  fields: [
    {
      key: 'title',
      label: 'Title',
      operators: [
        { key: 'contains', label: 'contains', value: { type: 'string' } },
        { key: 'is_empty', label: 'is empty', value: { type: 'empty' } },
      ],
    },
    {
      key: 'flag',
      label: 'Flag',
      operators: [
        { key: 'is_empty', label: 'is empty', value: { type: 'empty' } },
      ],
    },
    {
      key: 'age',
      label: 'Age',
      operators: [
        { key: 'eq', label: 'equals', value: { type: 'integer' } },
      ],
    },
  ],
}

describe('empty-operator save', () => {
  it('saves once when an empty operator is chosen, and not when it is chosen again', async () => {
    const saved: Array<PowerSearchFilter | null> = []
    const wrapper = mount(PowerSearchEditor, {
      props: {
        config,
        filter: { field: 'title', operator: 'contains' },
        mode: 'create',
        onSave: filter => saved.push(filter),
        onCancel: () => {},
      },
    })
    const selectors = wrapper.findAllComponents({ name: 'AstryxSelector' })
    selectors[1]?.vm.$emit('update:modelValue', 'is_empty')
    await flushPromises()
    selectors[1]?.vm.$emit('update:modelValue', 'is_empty')
    await flushPromises()
    expect(saved).toEqual([{ field: 'title', operator: 'is_empty', value: { type: 'empty' } }])
    wrapper.unmount()
  })

  it('saves once when the field switches to one whose default operator is empty', async () => {
    const saved: Array<PowerSearchFilter | null> = []
    const wrapper = mount(PowerSearchEditor, {
      props: {
        config,
        filter: { field: 'title', operator: 'contains' },
        mode: 'create',
        onSave: filter => saved.push(filter),
        onCancel: () => {},
      },
    })
    wrapper.findAllComponents({ name: 'AstryxSelector' })[0]?.vm.$emit('update:modelValue', 'flag')
    await flushPromises()
    expect(saved).toEqual([{ field: 'flag', operator: 'is_empty', value: { type: 'empty' } }])
    wrapper.unmount()
  })

  it('does not save just because it opens on a complete empty-operator filter', async () => {
    const saved: Array<PowerSearchFilter | null> = []
    const wrapper = mount(PowerSearchEditor, {
      props: {
        config,
        filter: { field: 'title', operator: 'is_empty', value: { type: 'empty' } },
        mode: 'edit',
        onSave: filter => saved.push(filter),
        onCancel: () => {},
      },
    })
    await flushPromises()
    expect(saved).toEqual([])
    wrapper.unmount()
  })

  it('cancels instead of saving when Enter is pressed on Cancel', async () => {
    const saved: Array<PowerSearchFilter | null> = []
    let cancelled = 0
    const wrapper = mount(PowerSearchEditor, {
      props: {
        config,
        filter: { field: 'title', operator: 'contains', value: { type: 'string', value: 'ada' } },
        mode: 'edit',
        onSave: filter => saved.push(filter),
        onCancel: () => {
          cancelled += 1
        },
      },
      attachTo: document.body,
    })
    const cancel = wrapper.findAll('button').find(button => button.text() === 'Cancel')
    expect(cancel).toBeTruthy()
    await cancel!.trigger('keydown', { key: 'Enter' })
    expect(saved).toEqual([])
    await cancel!.trigger('click')
    expect(cancelled).toBe(1)
    expect(saved).toEqual([])
    wrapper.unmount()
  })
})

describe('numeric draft', () => {
  it('does not save an invalid number on Enter, and saves a finished number once', async () => {
    const filters = { current: [] as PowerSearchFilter[] }
    const Host = defineComponent({
      components: { PowerSearch },
      setup() {
        return { config, filters }
      },
      template: '<PowerSearch :config="config" :filters="filters.current" @update:filters="filters.current = $event" />',
    })
    const wrapper = mount(Host, { attachTo: document.body })
    await wrapper.get('input').trigger('focus')
    await flushPromises()
    const option = [...document.body.querySelectorAll('[role="option"]')].find(node => node.textContent?.includes('Age'))
    option?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    const field = document.querySelector<HTMLInputElement>('.astryx-number-input-field')
    expect(field).toBeTruthy()
    field!.value = '12abc'
    field!.dispatchEvent(new Event('input', { bubbles: true }))
    field!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    await flushPromises()
    expect(filters.current).toEqual([])
    expect(document.querySelector('.astryx-power-search-editor')).not.toBeNull()

    field!.value = '32'
    field!.dispatchEvent(new Event('input', { bubbles: true }))
    field!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    await flushPromises()
    expect(filters.current).toEqual([
      { field: 'age', operator: 'eq', value: { type: 'integer', value: 32 } },
    ])
    wrapper.unmount()
  })
})
