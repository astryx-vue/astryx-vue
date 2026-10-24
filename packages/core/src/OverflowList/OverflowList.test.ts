import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import OverflowList from './OverflowList.vue'

const items = [
  { id: 'home', label: 'Home' },
  { id: 'files', label: 'Files' },
  { id: 'settings', label: 'Settings' },
]

describe('overflow-list', () => {
  it('keeps the requested count and puts the rest behind More', async () => {
    const wrapper = mount(OverflowList, {
      attachTo: document.body,
      props: { items, visibleCount: 1 },
    })
    expect(wrapper.findAll('.astryx-overflow-list__row .astryx-overflow-list__chip')).toHaveLength(1)
    expect(wrapper.get('.astryx-overflow-list__row .astryx-overflow-list__chip').text()).toBe('Home')

    await wrapper.get('[aria-label="2 more"]').trigger('click')
    await nextTick()
    const menu = document.body.querySelector('[role="menu"]')
    expect(menu?.textContent).toContain('Files')
    expect(menu?.textContent).toContain('Settings')
    expect(menu?.textContent).not.toContain('Home')
    wrapper.unmount()
  })

  it('collapses the opposite end when asked', () => {
    const wrapper = mount(OverflowList, {
      props: { collapseFrom: 'start', items, visibleCount: 1 },
    })
    expect(wrapper.get('.astryx-overflow-list__row .astryx-overflow-list__chip').text()).toBe('Settings')
    expect(wrapper.find('[aria-label="2 more"]').exists()).toBe(true)
  })

  it('reports the collapsed set only after something is actually hidden', async () => {
    const onOverflowChange = vi.fn()
    const rows = [
      { id: 'a', label: 'Alpha' },
      { id: 'b', label: 'Beta' },
      { id: 'c', label: 'Gamma' },
    ]
    const wrapper = mount(OverflowList, {
      props: { items: rows, visibleCount: 3, onOverflowChange },
    })
    await nextTick()
    expect(onOverflowChange).not.toHaveBeenCalled()

    await wrapper.setProps({ visibleCount: 1 })
    expect(onOverflowChange).toHaveBeenCalledTimes(1)
    expect(onOverflowChange.mock.calls[0]?.[0]).toEqual([
      { item: rows[1], index: 1 },
      { item: rows[2], index: 2 },
    ])

    await wrapper.setProps({ visibleCount: 1 })
    expect(onOverflowChange).toHaveBeenCalledTimes(1)

    await wrapper.setProps({ visibleCount: 3 })
    expect(onOverflowChange).toHaveBeenCalledTimes(2)
    expect(onOverflowChange.mock.calls[1]?.[0]).toEqual([])
  })

  it('reports the leading items when collapsing from the start', () => {
    const onOverflowChange = vi.fn()
    const rows = [
      { id: 'a', label: 'Alpha' },
      { id: 'b', label: 'Beta' },
    ]
    mount(OverflowList, {
      props: { collapseFrom: 'start', items: rows, visibleCount: 1, onOverflowChange },
    })
    expect(onOverflowChange).toHaveBeenCalledTimes(1)
    expect(onOverflowChange.mock.calls[0]?.[0]).toEqual([{ item: rows[0], index: 0 }])
  })
})
