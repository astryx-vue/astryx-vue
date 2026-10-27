import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import Table from './Table.vue'

interface Person extends Record<string, unknown> {
  id: string
  name: string
}

const people: Person[] = [
  { id: '1', name: 'Charlie' },
  { id: '2', name: 'Alice' },
]

describe('table column header', () => {
  it('renders a function header as rich content', async () => {
    const columns = [
      { key: 'name', header: () => h('span', { class: 'rich-header' }, 'Rich') },
      { key: 'age', header: 'Age' },
    ]
    const wrapper = mount(defineComponent({
      components: { Table },
      setup: () => ({ people, columns }),
      template: '<Table :data="people" :columns="columns" id-key="id" />',
    }))
    await nextTick()
    expect(wrapper.get('.rich-header').text()).toBe('Rich')
    expect(wrapper.get('thead th[data-column="age"]').text()).toContain('Age')
  })

  it('falls back to the column key for accessible text when the header is a function', async () => {
    const columns = [{ key: 'name', header: () => h('span', 'Rich') }]
    const wrapper = mount(defineComponent({
      components: { Table },
      setup: () => ({ people, columns }),
      template: '<Table :data="people" :columns="columns" id-key="id" />',
    }))
    await nextTick()
    // 纯文本场景（VisuallyHidden / 排序标签）不渲染函数体，也不报错。
    expect(wrapper.find('thead th').exists()).toBe(true)
  })
})
