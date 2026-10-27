import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import MetadataList from './MetadataList.vue'
import MetadataListItem from './MetadataListItem.vue'

describe('metadata list', () => {
  it('renders a single-column definition list with the label beside the value', () => {
    const wrapper = mount(MetadataList, {
      slots: {
        default: `
          <metadata-list-item label="Name">MetadataList</metadata-list-item>
          <metadata-list-item label="Status">Active</metadata-list-item>
        `,
      },
      global: {
        components: { MetadataListItem },
      },
    })

    const list = wrapper.get('dl')
    expect(list.attributes('data-layout')).toBe('single')
    expect(wrapper.findAll('dt').map(node => node.text())).toEqual(['Name', 'Status'])
    expect(wrapper.findAll('dd').map(node => node.text())).toEqual(['MetadataList', 'Active'])
    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('collapses items past the limit and expands them again', async () => {
    const wrapper = mount(MetadataList, {
      props: { maxNumOfItems: 1 },
      slots: {
        default: `
          <metadata-list-item label="Name">MetadataList</metadata-list-item>
          <metadata-list-item label="Owner">Joey</metadata-list-item>
        `,
      },
      global: { components: { MetadataListItem } },
    })

    expect(wrapper.findAll('dt')).toHaveLength(1)
    const button = wrapper.get('button')
    expect(button.text()).toBe('Show more')
    expect(button.attributes('aria-expanded')).toBe('false')
    await button.trigger('click')
    expect(wrapper.findAll('dt')).toHaveLength(2)
    expect(wrapper.get('button').text()).toBe('Show less')
  })

  it('stacks a horizontal list and ignores the item limit', () => {
    const wrapper = mount(MetadataList, {
      props: { orientation: 'horizontal', maxNumOfItems: 1 },
      slots: {
        default: `
          <metadata-list-item label="Status">Active</metadata-list-item>
          <metadata-list-item label="Owner">Joey</metadata-list-item>
        `,
      },
      global: { components: { MetadataListItem } },
    })

    expect(wrapper.get('dl').attributes('data-layout')).toBe('horizontal')
    expect(wrapper.findAll('.astryx-metadata-list__item')).toHaveLength(2)
    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('透传属性落在根元素上，组件自己管的 data-columns 优先', async () => {
    const onClick = vi.fn()
    const wrapper = mount(MetadataList, {
      attrs: { 'aria-label': 'Details', 'id': 'details', 'data-testid': 'metadata', 'data-columns': 'x', 'onClick': onClick },
    })
    expect(wrapper.attributes('aria-label')).toBe('Details')
    expect(wrapper.attributes('id')).toBe('details')
    expect(wrapper.attributes('data-testid')).toBe('metadata')
    expect(wrapper.attributes('data-columns')).toBe('single')
    await wrapper.trigger('click')
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('lands item pass-through props on the dt beside the value', () => {
    const wrapper = mount(MetadataListItem, {
      props: { label: 'Name' },
      attrs: { 'id': 'name', 'data-testid': 'field' },
      slots: { default: 'Ada' },
    })
    const label = wrapper.get('dt')
    expect(label.attributes('id')).toBe('name')
    expect(label.attributes('data-testid')).toBe('field')
    expect(wrapper.get('dd').attributes('id')).toBeUndefined()
  })

  it('lands item pass-through props on the stacked wrapper', () => {
    const wrapper = mount(MetadataList, {
      props: { label: { position: 'top' } },
      slots: {
        default: '<metadata-list-item id="name" data-testid="field" label="Name">Ada</metadata-list-item>',
      },
      global: { components: { MetadataListItem } },
    })
    const item = wrapper.get('.astryx-metadata-list__item')
    expect(item.attributes('id')).toBe('name')
    expect(item.attributes('data-testid')).toBe('field')
    expect(item.get('dt').attributes('id')).toBeUndefined()
  })
})
