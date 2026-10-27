import type { SearchableItem } from '../composables/useAsyncSource.js'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import { createStaticSource } from '../composables/useAsyncSource.js'
import Typeahead from './Typeahead.vue'

const clicks: string[] = []
const source = createStaticSource<SearchableItem>([
  { id: 'a', label: 'Apple', action: h('button', { type: 'button', onClick: () => clicks.push('edit') }, 'Edit') },
  { id: 'b', label: 'Banana' },
])

describe('typeahead 样式分层', () => {
  it('container 落在外壳，根 class 落在外框，不落到 input', () => {
    const wrapper = mount(Typeahead, {
      props: { label: 'Fruit', searchSource: createStaticSource([{ id: 'a', label: 'Apple' }]), containerClass: 'box-a', controlClass: 'ctl-a' },
      attrs: { class: 'root-a' },
    })
    expect(wrapper.get('.astryx-field').classes()).toContain('box-a')
    const control = wrapper.get('.astryx-typeahead-control')
    expect(control.classes()).toEqual(expect.arrayContaining(['root-a', 'ctl-a']))
    expect(wrapper.get('input').classes()).not.toContain('root-a')
  })

  it('带操作的结果变成网格，点操作不选中', async () => {
    clicks.length = 0
    const wrapper = mount(Typeahead, {
      attachTo: document.body,
      props: { label: 'Fruit', searchSource: source, showOnFocus: true, debounceMs: 0 },
    })
    await wrapper.get('input').trigger('focus')
    await nextTick()
    await Promise.resolve()
    await nextTick()
    const grid = document.querySelector('[role="grid"]')
    expect(grid).not.toBeNull()
    const edit = grid?.querySelector('button')
    edit?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(clicks).toEqual(['edit'])
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })
})
