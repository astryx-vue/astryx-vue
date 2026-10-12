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

  it('insets a nested branch fill so it starts past the guide', () => {
    const wrapper = mount(TreeList, {
      props: {
        items: [{
          id: 'src',
          label: 'src',
          isExpanded: true,
          children: [{
            id: 'components',
            label: 'components',
            isExpanded: true,
            children: [{ id: 'button', label: 'Button.tsx', onClick: () => {} }],
          }],
        }],
      },
    })
    expect(wrapper.get('[data-tree-id="components"] .astryx-tree-list__content').attributes('data-guide-inset')).toBe('true')
    expect(wrapper.get('[data-tree-id="src"] .astryx-tree-list__content').attributes('data-guide-inset')).toBeUndefined()
    expect(wrapper.get('[data-tree-id="button"] .astryx-tree-list__content').attributes('data-guide-inset')).toBeUndefined()

    const plain = mount(TreeList, {
      props: {
        items: [{
          id: 'src',
          label: 'src',
          isExpanded: true,
          children: [{ id: 'components', label: 'components', children: [{ id: 'button', label: 'Button.tsx' }] }],
        }],
        variant: 'noGuides',
      },
    })
    expect(plain.get('[data-tree-id="components"] .astryx-tree-list__content').attributes('data-guide-inset')).toBeUndefined()
  })

  it('puts an external icon class in a sized box', () => {
    const wrapper = mount(TreeList, {
      props: {
        items: [{ id: 'src', label: 'src', icon: 'i-heroicons-folder', endIcon: 'i-heroicons-chevron-right' }],
      },
    })
    const icons = wrapper.findAll('.astryx-tree-list__icon')
    expect(icons).toHaveLength(2)
    expect(icons[0]?.get('i').classes()).toContain('i-heroicons-folder')
    expect(icons[1]?.get('i').classes()).toContain('i-heroicons-chevron-right')
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
