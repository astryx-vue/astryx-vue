import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
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
})
