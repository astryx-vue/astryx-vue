import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import TreeList from './TreeList.vue'

const items = [
  {
    id: 'src',
    label: 'src',
    isExpanded: true,
    children: [
      { id: 'app', label: 'App.tsx', onClick: () => {} },
    ],
  },
  { id: 'readme', label: 'README.md', onClick: () => {} },
]

describe('tree list', () => {
  it('exposes a tree and expands a seeded parent', () => {
    const wrapper = mount(TreeList, { props: { items, label: 'Files' } })
    expect(wrapper.get('[role="tree"]').attributes('aria-label')).toBe('Files')
    expect(wrapper.get('[data-tree-id="src"]').attributes('aria-expanded')).toBe('true')
    expect(wrapper.get('[data-tree-id="app"]').attributes('aria-level')).toBe('2')
    expect(wrapper.find('.astryx-tree-list__guide').exists()).toBe(true)
  })

  it('collapses a parent from the chevron and from ArrowLeft', async () => {
    const wrapper = mount(TreeList, { props: { items }, attachTo: document.body })
    await wrapper.get('[data-tree-toggle]').trigger('click')
    expect(wrapper.get('[data-tree-id="src"]').attributes('aria-expanded')).toBe('false')
    expect(wrapper.find('[data-tree-id="app"]').exists()).toBe(false)

    await wrapper.get('[data-tree-toggle]').trigger('click')
    const item = wrapper.get('[data-tree-id="src"]')
    ;(item.element as HTMLElement).focus()
    await wrapper.get('[role="tree"]').trigger('keydown', { key: 'ArrowLeft' })
    expect(wrapper.get('[data-tree-id="src"]').attributes('aria-expanded')).toBe('false')
    wrapper.unmount()
  })
})
