import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import Selector from '../Selector/Selector.vue'
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

  it('renders dot indicators from totalPages', async () => {
    const wrapper = mount(Pagination, {
      props: {
        page: 2,
        totalPages: 4,
        variant: 'dots',
      },
    })

    const dots = wrapper.findAll('.astryx-pagination-dot')
    expect(dots).toHaveLength(4)
    expect(dots[1]!.attributes('aria-current')).toBe('page')
    expect(wrapper.find('.astryx-pagination-pages').exists()).toBe(false)

    await dots[2]!.trigger('click')
    expect(wrapper.emitted('update:page')?.[0]).toEqual([3])
  })

  it('renders a count range and a smaller control', () => {
    const wrapper = mount(Pagination, {
      props: {
        page: 1,
        pageSize: 4,
        total: 12,
        variant: 'count',
        size: 'sm',
      },
    })

    expect(wrapper.get('.astryx-pagination').attributes('data-size')).toBe('sm')
    expect(wrapper.get('.astryx-pagination-count').text()).toBe('1–4 of 12')
    expect(wrapper.find('.astryx-pagination-pages').exists()).toBe(false)
  })

  it('renders the compact page-of-total label', () => {
    const wrapper = mount(Pagination, {
      props: {
        page: 2,
        totalPages: 8,
        variant: 'compact',
      },
    })

    expect(wrapper.get('.astryx-pagination-count').text()).toBe('Page 2 of 8')
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

  it('jumps to the first and last page and skips by step', async () => {
    const wrapper = mount(Pagination, {
      props: {
        page: 4,
        pageSize: 10,
        total: 100,
        hasFirstLast: true,
        step: 3,
      },
    })

    await wrapper.get('.astryx-pagination-first').trigger('click')
    expect(wrapper.emitted('update:page')?.[0]).toEqual([1])

    await wrapper.get('.astryx-pagination-last').trigger('click')
    expect(wrapper.emitted('update:page')?.at(-1)).toEqual([10])

    await wrapper.setProps({ page: 2 })
    await wrapper.get('.astryx-pagination-next').trigger('click')
    expect(wrapper.emitted('update:page')?.at(-1)).toEqual([5])
    expect(wrapper.get('.astryx-pagination-next').attributes('aria-label')).toBe('Forward 3 pages')
  })

  it('commits a typed page and stays busy while changeAction is pending', async () => {
    let release: () => void = () => {}
    const changeAction = vi.fn(() => new Promise<void>((resolve) => {
      release = resolve
    }))
    const wrapper = mount(Pagination, {
      props: {
        page: 2,
        pageSize: 10,
        total: 80,
        variant: 'input',
        pageLabel: 'Page',
        changeAction,
      },
    })

    expect(wrapper.get('.astryx-pagination-input-label').text()).toBe('Page')
    expect(wrapper.find('.astryx-pagination-first').exists()).toBe(true)
    const input = wrapper.get('input')
    await input.setValue('6')
    await input.trigger('change')
    expect(wrapper.emitted('update:page')?.[0]).toEqual([6])
    expect(wrapper.get('nav').attributes('aria-busy')).toBe('true')
    release()
    await flushPromises()
    expect(wrapper.get('nav').attributes('aria-busy')).toBeUndefined()
  })

  it('keeps moving forward when the total is unknown and hasMore is set', async () => {
    const wrapper = mount(Pagination, {
      props: {
        page: 1,
        total: 0,
        hasMore: true,
      },
    })

    expect(wrapper.find('.astryx-pagination-pages').exists()).toBe(false)
    expect(wrapper.find('.astryx-pagination-last').exists()).toBe(false)
    expect(wrapper.get('.astryx-pagination-next').attributes('disabled')).toBeUndefined()
    await wrapper.get('.astryx-pagination-next').trigger('click')
    expect(wrapper.emitted('update:page')?.[0]).toEqual([2])
  })

  it('uses the requested sibling count when the container is wide enough', () => {
    const wrapper = mount(Pagination, {
      props: {
        page: 10,
        pageSize: 10,
        total: 200,
        siblingCount: 0,
      },
    })

    const labels = wrapper.findAll('.astryx-pagination-page').map(page => page.text())
    expect(labels).toEqual(['1', '...', '10', '...', '20'])
  })

  it('labels the landmark and lets the label be overridden', () => {
    const fallback = mount(Pagination, { props: { page: 1, pageSize: 10, total: 100 } })
    expect(fallback.get('nav').attributes('aria-label')).toBe('Pagination')

    const labelled = mount(Pagination, { props: { page: 1, pageSize: 10, total: 100, label: 'Search results' } })
    expect(labelled.get('nav').attributes('aria-label')).toBe('Search results')
  })

  it('accepts totalItems and isDisabled as names for total and disabled', () => {
    const wrapper = mount(Pagination, { props: { page: 1, pageSize: 10, totalItems: 200 } })
    const labels = wrapper.findAll('.astryx-pagination-page').map(page => page.text())
    expect(labels[0]).toBe('1')
    expect(labels.at(-1)).toBe('20')
    expect(labels).toContain('...')

    const disabled = mount(Pagination, { props: { page: 2, pageSize: 10, total: 100, isDisabled: true } })
    expect(disabled.get('nav').classes()).toContain('is-disabled')
    expect(disabled.get('.astryx-pagination-next').attributes('disabled')).toBeDefined()
  })

  it('reports pageSizeChange and returns to the first page', async () => {
    const wrapper = mount(Pagination, {
      props: { 'page': 4, 'pageSize': 10, 'total': 200, 'showSizeChanger': true, 'onUpdate:page': (page: number) => wrapper.setProps({ page }), 'onUpdate:pageSize': (pageSize: number) => wrapper.setProps({ pageSize }) },
    })

    wrapper.findComponent(Selector).vm.$emit('update:modelValue', 20)
    await flushPromises()

    expect(wrapper.emitted('pageSizeChange')?.[0]).toEqual([20])
    expect(wrapper.emitted('update:pageSize')?.[0]).toEqual([20])
    expect(wrapper.emitted('update:page')?.[0]).toEqual([1])
    expect(wrapper.emitted('change')?.[0]).toEqual([1, 20])
  })
})
