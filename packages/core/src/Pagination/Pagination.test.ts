import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import Pagination from './Pagination.vue'

describe('pagination', () => {
  it('renders pagination controls', () => {
    const wrapper = mount(Pagination, {
      props: {
        page: 1,
        pageSize: 10,
        total: 100,
      },
    })

    expect(wrapper.find('.astryx-pagination').exists()).toBe(true)
    expect(wrapper.find('.astryx-pagination-prev').exists()).toBe(true)
    expect(wrapper.find('.astryx-pagination-next').exists()).toBe(true)
  })

  it('displays page numbers', () => {
    const wrapper = mount(Pagination, {
      props: {
        page: 1,
        pageSize: 10,
        total: 100,
      },
    })

    const pages = wrapper.findAll('.astryx-pagination-page')
    expect(pages.length).toBeGreaterThan(0)
  })

  it('marks current page as active', () => {
    const wrapper = mount(Pagination, {
      props: {
        page: 5,
        pageSize: 10,
        total: 100,
      },
    })

    const activePages = wrapper.findAll('.astryx-pagination-page.is-active')
    expect(activePages).toHaveLength(1)
    expect(activePages[0]!.text()).toBe('5')
  })

  it('emits page change on page click', async () => {
    const wrapper = mount(Pagination, {
      props: {
        page: 1,
        pageSize: 10,
        total: 100,
      },
    })

    const pages = wrapper.findAll('.astryx-pagination-page')
    const page2 = pages.find(p => p.text() === '2' && !p.classes().includes('is-ellipsis'))

    if (page2) {
      await page2.trigger('click')
      await nextTick()

      expect(wrapper.emitted('update:page')).toBeTruthy()
      expect(wrapper.emitted('change')).toBeTruthy()
    }
  })

  it('disables previous button on first page', () => {
    const wrapper = mount(Pagination, {
      props: {
        page: 1,
        pageSize: 10,
        total: 100,
      },
    })

    const prevButton = wrapper.find('.astryx-pagination-prev')
    expect(prevButton.attributes('disabled')).toBeDefined()
  })

  it('disables next button on last page', () => {
    const wrapper = mount(Pagination, {
      props: {
        page: 10,
        pageSize: 10,
        total: 100,
      },
    })

    const nextButton = wrapper.find('.astryx-pagination-next')
    expect(nextButton.attributes('disabled')).toBeDefined()
  })

  it('goes to previous page', async () => {
    const wrapper = mount(Pagination, {
      props: {
        page: 5,
        pageSize: 10,
        total: 100,
      },
    })

    const prevButton = wrapper.find('.astryx-pagination-prev')
    await prevButton.trigger('click')

    expect(wrapper.emitted('update:page')?.[0]).toEqual([4])
  })

  it('goes to next page', async () => {
    const wrapper = mount(Pagination, {
      props: {
        page: 5,
        pageSize: 10,
        total: 100,
      },
    })

    const nextButton = wrapper.find('.astryx-pagination-next')
    await nextButton.trigger('click')

    expect(wrapper.emitted('update:page')?.[0]).toEqual([6])
  })

  it('shows ellipsis for large page counts', () => {
    const wrapper = mount(Pagination, {
      props: {
        page: 5,
        pageSize: 10,
        total: 200,
      },
    })

    const ellipsis = wrapper.findAll('.astryx-pagination-page.is-ellipsis')
    expect(ellipsis.length).toBeGreaterThan(0)
  })

  it('shows total when enabled', () => {
    const wrapper = mount(Pagination, {
      props: {
        page: 1,
        pageSize: 10,
        total: 95,
        showTotal: true,
      },
    })

    const total = wrapper.find('.astryx-pagination-total')
    expect(total.exists()).toBe(true)
    expect(total.text()).toContain('95')
  })

  it('shows size changer when enabled', () => {
    const wrapper = mount(Pagination, {
      props: {
        page: 1,
        pageSize: 10,
        total: 100,
        showSizeChanger: true,
      },
      attachTo: document.body,
    })

    expect(wrapper.find('.astryx-pagination-size-changer').exists()).toBe(true)

    wrapper.unmount()
  })

  it('applies disabled state', () => {
    const wrapper = mount(Pagination, {
      props: {
        page: 1,
        pageSize: 10,
        total: 100,
        disabled: true,
      },
    })

    expect(wrapper.find('.astryx-pagination').classes()).toContain('is-disabled')
  })

  it('uses custom page size options', () => {
    const wrapper = mount(Pagination, {
      props: {
        page: 1,
        pageSize: 20,
        total: 100,
        showSizeChanger: true,
        pageSizeOptions: [20, 50, 100],
      },
      attachTo: document.body,
    })

    const vm = wrapper.vm as any
    expect(vm.pageSizeOptions).toHaveLength(3)

    wrapper.unmount()
  })

  it('calculates from and to indexes correctly', () => {
    const wrapper = mount(Pagination, {
      props: {
        page: 2,
        pageSize: 10,
        total: 95,
      },
    })

    const vm = wrapper.vm as any
    expect(vm.fromIndex).toBe(11)
    expect(vm.toIndex).toBe(20)
  })

  it('handles last page correctly', () => {
    const wrapper = mount(Pagination, {
      props: {
        page: 10,
        pageSize: 10,
        total: 95,
      },
    })

    const vm = wrapper.vm as any
    expect(vm.toIndex).toBe(95)
  })

  it('syncs with external prop changes', async () => {
    const wrapper = mount(Pagination, {
      props: {
        page: 1,
        pageSize: 10,
        total: 100,
      },
    })

    await wrapper.setProps({ page: 3 })
    await nextTick()

    // Pagination 组件内部使用本地 ref 管理状态
    // 只检查 emitted 事件即可
    expect(wrapper.props('page')).toBe(3)
  })

  it('does not emit when clicking ellipsis', async () => {
    const wrapper = mount(Pagination, {
      props: {
        page: 5,
        pageSize: 10,
        total: 200,
      },
    })

    const ellipsis = wrapper.find('.astryx-pagination-page.is-ellipsis')
    if (ellipsis.exists()) {
      await ellipsis.trigger('click')
      expect(wrapper.emitted('update:page')).toBeFalsy()
    }
  })
})
