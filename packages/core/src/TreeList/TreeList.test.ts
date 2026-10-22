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

  it('names a row by its label and describes it with its description', () => {
    const wrapper = mount(TreeList, {
      props: {
        items: [{ id: 'budget', label: 'Budget', description: 'Updated yesterday', onClick: () => {} }],
      },
    })
    const row = wrapper.get('[data-tree-id="budget"]')
    const label = wrapper.get('.astryx-tree-list__label')
    expect(row.attributes('aria-labelledby')).toBe(label.attributes('id'))
    expect(label.text()).toBe('Budget')
    const description = wrapper.get('.astryx-tree-list__description')
    expect(row.attributes('aria-describedby')).toBe(description.attributes('id'))
    expect(description.text()).toBe('Updated yesterday')
    expect(wrapper.get('button.astryx-tree-list__action').attributes('aria-labelledby')).toBe(label.attributes('id'))
  })

  it('names a parent by its label, not the chevron', () => {
    const wrapper = mount(TreeList, {
      props: { items: [{ id: 'docs', label: 'Documents', children: [{ id: 'a', label: 'Annual' }] }] },
    })
    const row = wrapper.get('[data-tree-id="docs"]')
    const label = row.get('.astryx-tree-list__label')
    expect(row.attributes('aria-labelledby')).toBe(label.attributes('id'))
    expect(label.text()).toBe('Documents')
    expect(row.get('[data-tree-toggle]').attributes('aria-label')).not.toBe('Documents')
  })

  it('matches typeahead against the label, not the description', async () => {
    const wrapper = mount(TreeList, {
      attachTo: document.body,
      props: {
        items: [
          { id: 'a', label: 'Apple', description: 'Cherry-red fruit' },
          { id: 'b', label: 'Banana', description: 'Curved fruit' },
          { id: 'c', label: 'Cherry' },
        ],
      },
    })
    const apple = wrapper.get('[data-tree-id="a"]')
    ;(apple.element as HTMLElement).focus()
    await apple.trigger('keydown', { key: 'c' })
    expect(document.activeElement).toBe(wrapper.get('[data-tree-id="c"]').element)
    wrapper.unmount()
  })

  it('puts class and style on the treeitem row', () => {
    const wrapper = mount(TreeList, {
      props: {
        items: [{ id: 'a', label: 'A', className: 'custom-row', style: { color: 'rgb(1, 2, 3)' } }],
      },
    })
    const row = wrapper.get('[data-tree-id="a"]')
    expect(row.classes()).toContain('custom-row')
    expect((row.element as HTMLElement).style.color).toBe('rgb(1, 2, 3)')
  })

  it('forwards id to the root and aria-label to the tree', () => {
    const wrapper = mount(TreeList, {
      props: { items: [{ id: 'a', label: 'A' }] },
      attrs: { 'id': 'file-tree', 'aria-label': 'File tree', 'data-testid': 'tree' },
    })
    const root = wrapper.get('.astryx-tree-list')
    expect(root.attributes('id')).toBe('file-tree')
    expect(root.attributes('data-testid')).toBe('tree')
    expect(wrapper.get('[role="tree"]').attributes('aria-label')).toBe('File tree')
  })

  it('prefers the visible header over a caller aria-label', () => {
    const wrapper = mount(TreeList, {
      props: { items: [{ id: 'a', label: 'A' }], header: 'File Tree' },
      attrs: { 'aria-label': 'External name', 'aria-labelledby': 'external-label' },
    })
    const tree = wrapper.get('[role="tree"]')
    expect(tree.attributes('aria-label')).toBeUndefined()
    const headerId = tree.attributes('aria-labelledby')
    expect(headerId).toBeTruthy()
    expect(headerId).not.toBe('external-label')
    expect(wrapper.get(`#${headerId}`).text()).toBe('File Tree')
  })

  it('lets a consumer preventDefault cancel built-in navigation', async () => {
    const wrapper = mount(TreeList, {
      attachTo: document.body,
      props: { items: [{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }] },
      attrs: {
        onKeydown: (event: KeyboardEvent) => {
          event.preventDefault()
        },
      },
    })
    const first = wrapper.get('[data-tree-id="a"]')
    ;(first.element as HTMLElement).focus()
    await first.trigger('keydown', { key: 'ArrowDown' })
    expect(document.activeElement).toBe(first.element)
    wrapper.unmount()
  })

  it('adds noopener and noreferrer when a tree link opens in a new tab', () => {
    const wrapper = mount(TreeList, {
      props: { items: [{ id: 'a', label: 'Docs', href: 'https://example.com', target: '_blank' }] },
    })
    const anchor = wrapper.get('a')
    expect(anchor.attributes('target')).toBe('_blank')
    expect(anchor.attributes('rel')?.split(' ').sort()).toEqual(['noopener', 'noreferrer'])
  })

  it('leaves rel unset when a tree link stays in the same tab', () => {
    const wrapper = mount(TreeList, {
      props: { items: [{ id: 'a', label: 'Docs', href: '/docs' }] },
    })
    expect(wrapper.get('a').attributes('rel')).toBeUndefined()
    expect(wrapper.get('a').attributes('target')).toBeUndefined()
  })

  it('does not render a link for a blocked destination', () => {
    const wrapper = mount(TreeList, {
      props: { items: [{ id: 'a', label: 'A', href: 'javascript:alert(1)' }] },
    })
    expect(wrapper.find('a').exists()).toBe(false)
  })
})
