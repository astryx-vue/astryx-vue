import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import Pagination from './Pagination.vue'

const href = (page: number, pageSize?: number) => `/items?page=${page}${pageSize == null ? '' : `&size=${pageSize}`}`

function render(props: Record<string, unknown> = {}) {
  return mount(Pagination, {
    attachTo: document.body,
    props: { page: 5, totalPages: 9, variant: 'compact', hasFirstLast: true, getPageHref: href, ...props },
  })
}

describe('pagination 的页面链接 getPageHref', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('页码、上一页、下一页、首页、末页都是指向各自地址的链接', () => {
    const wrapper = render()
    const hrefOf = (selector: string) => wrapper.get(selector).attributes('href')
    expect(hrefOf('.astryx-pagination-first')).toBe('/items?page=1')
    expect(hrefOf('.astryx-pagination-prev')).toBe('/items?page=4')
    expect(hrefOf('.astryx-pagination-next')).toBe('/items?page=6')
    expect(hrefOf('.astryx-pagination-last')).toBe('/items?page=9')
    expect(wrapper.get('.astryx-pagination-next').element.tagName).toBe('A')
    wrapper.unmount()

    const pages = render({ variant: 'pages', hasFirstLast: null })
    const links = pages.findAll('.astryx-pagination-page:not(.is-ellipsis)')
    expect(links.map(link => link.attributes('href'))).toEqual(links.map(link => `/items?page=${link.text()}`))
    expect(pages.findAll('.astryx-pagination-page.is-ellipsis').every(cell => cell.element.tagName === 'BUTTON')).toBe(true)
    pages.unmount()
  })

  it('上一页、下一页按 step 取地址，游标分页下一页是当前页加一', () => {
    const stepped = render({ step: 2 })
    expect(stepped.get('.astryx-pagination-prev').attributes('href')).toBe('/items?page=3')
    expect(stepped.get('.astryx-pagination-next').attributes('href')).toBe('/items?page=7')
    stepped.unmount()

    const cursor = render({ hasFirstLast: null, hasMore: true, page: 2, totalPages: undefined, variant: 'pages' })
    expect(cursor.get('.astryx-pagination-next').attributes('href')).toBe('/items?page=3')
    cursor.unmount()
  })

  it('设过 pageSize 才把它交给 getPageHref', () => {
    const without = vi.fn(href)
    render({ getPageHref: without }).unmount()
    expect(without.mock.calls.every(([, size]) => size === undefined)).toBe(true)

    const given = vi.fn(href)
    render({ getPageHref: given, pageSize: 25, total: 225, totalPages: undefined }).unmount()
    expect(given.mock.calls.every(([, size]) => size === 25)).toBe(true)
  })

  it('到了边界的控件和禁用时没有地址，仍是按钮', () => {
    const first = render({ page: 1 })
    expect(first.get('.astryx-pagination-prev').element.tagName).toBe('BUTTON')
    expect(first.get('.astryx-pagination-prev').attributes('disabled')).toBeDefined()
    expect(first.get('.astryx-pagination-first').element.tagName).toBe('BUTTON')
    expect(first.get('.astryx-pagination-next').element.tagName).toBe('A')
    first.unmount()

    const disabled = render({ isDisabled: true })
    expect(disabled.findAll('a')).toHaveLength(0)
    disabled.unmount()
  })

  it('普通点击照按钮那样换页，链接同时导航；带修饰键和在别处打开的点击不换页', async () => {
    const wrapper = render()
    const next = wrapper.get('.astryx-pagination-next')
    next.element.addEventListener('click', event => event.preventDefault())
    await next.trigger('click')
    expect(wrapper.emitted('update:page')).toEqual([[6]])

    await next.trigger('click', { ctrlKey: true })
    await next.trigger('click', { metaKey: true })
    await next.trigger('click', { shiftKey: true })
    await next.trigger('click', { button: 1 })
    expect(wrapper.emitted('update:page')).toHaveLength(1)

    next.element.setAttribute('target', '_blank')
    await next.trigger('click')
    expect(wrapper.emitted('update:page')).toHaveLength(1)
    next.element.setAttribute('target', '_SELF')
    await next.trigger('click')
    expect(wrapper.emitted('update:page')).toHaveLength(2)
    wrapper.unmount()
  })

  it('浏览器跟随链接之前，下一页的地址不会先跳到再下一页', async () => {
    vi.useFakeTimers()
    const wrapper = render()
    const next = wrapper.get('.astryx-pagination-next')
    next.element.addEventListener('click', event => event.preventDefault())
    await next.trigger('click')
    await wrapper.setProps({ page: 6 })
    // 点击结束之前，上一页、下一页仍按点击时的页码算。
    expect(wrapper.get('.astryx-pagination-next').attributes('href')).toBe('/items?page=6')
    vi.runAllTimers()
    await wrapper.vm.$nextTick()
    expect(wrapper.get('.astryx-pagination-next').attributes('href')).toBe('/items?page=7')
    vi.useRealTimers()
    wrapper.unmount()
  })

  it('被导航规则拒绝的地址不写进 href，点击也不换页', async () => {
    const wrapper = render({ getPageHref: (page: number) => page === 6 ? 'javascript:alert(1)' : href(page) })
    const next = wrapper.get('.astryx-pagination-next')
    expect(next.element.tagName).toBe('BUTTON')
    expect(next.attributes('href')).toBeUndefined()
    await next.trigger('click')
    expect(wrapper.emitted('update:page')).toBeUndefined()
    wrapper.unmount()
  })

  it('as 指定的链接组件拿到 href 和 to', () => {
    const Route = defineComponent({
      props: { href: String, to: String },
      setup: (props, { slots }) => () => h('a', { 'data-route': props.to, 'href': props.href }, slots.default?.()),
    })
    const wrapper = render({ as: Route })
    expect(wrapper.get('.astryx-pagination-next').attributes('data-route')).toBe('/items?page=6')
    expect(wrapper.get('.astryx-pagination-next').attributes('href')).toBe('/items?page=6')
    wrapper.unmount()
  })

  it('不设 getPageHref 时仍是按钮，行为不变', async () => {
    const wrapper = render({ getPageHref: undefined })
    expect(wrapper.findAll('a')).toHaveLength(0)
    await wrapper.get('.astryx-pagination-next').trigger('click')
    expect(wrapper.emitted('update:page')).toEqual([[6]])
    wrapper.unmount()
  })

  it('点在圆点上不受 getPageHref 影响，圆点不是链接', () => {
    const wrapper = render({ variant: 'dots', hasFirstLast: null })
    expect(wrapper.findAll('.astryx-pagination-dot').every(dot => dot.element.tagName === 'BUTTON')).toBe(true)
    wrapper.unmount()
  })
})

describe('pagination 的主题部位', () => {
  it('控制行、每个单元格、当前页单元格和省略号带各自的部位', () => {
    const wrapper = mount(Pagination, { props: { page: 5, totalPages: 20, variant: 'pages', size: 'sm' } })
    const list = wrapper.get('.astryx-pagination-list')
    expect(list.attributes('data-variant')).toBe('pages')
    expect(list.attributes('data-size')).toBe('sm')

    const items = wrapper.findAll('.astryx-pagination-item')
    // 上一页、显示出来的页码、下一页：这一行里每个按钮。
    expect(items).toHaveLength(list.findAll('button').length - wrapper.findAll('.astryx-pagination-ellipsis').length)
    const current = items.filter(item => item.attributes('data-selected') === 'selected')
    expect(current).toHaveLength(1)
    expect(current[0]!.attributes('aria-current')).toBe('page')
    expect(wrapper.findAll('.astryx-pagination-ellipsis').length).toBeGreaterThan(0)
    expect(wrapper.findAll('.astryx-pagination-ellipsis').some(cell => cell.classes().includes('astryx-pagination-item'))).toBe(false)
  })

  it('首页和末页也是单元格，没有当前页标记', () => {
    const wrapper = mount(Pagination, { props: { page: 3, totalPages: 9, variant: 'compact', hasFirstLast: true } })
    expect(wrapper.findAll('.astryx-pagination-item')).toHaveLength(4)
    expect(wrapper.find('[data-selected]').exists()).toBe(false)
  })
})

describe('pagination 圆点是单选组', () => {
  it('点击圆点聚焦它并换页，按下时不聚焦', async () => {
    const wrapper = mount(Pagination, { attachTo: document.body, props: { page: 1, totalPages: 4, variant: 'dots' } })
    const dots = wrapper.findAll<HTMLButtonElement>('.astryx-pagination-dot')
    const press = new MouseEvent('mousedown', { bubbles: true, cancelable: true })
    dots[2]!.element.dispatchEvent(press)
    expect(press.defaultPrevented).toBe(true)
    expect(document.activeElement).not.toBe(dots[2]!.element)
    await dots[2]!.trigger('click')
    expect(document.activeElement).toBe(dots[2]!.element)
    expect(wrapper.emitted('update:page')?.at(-1)).toEqual([3])
    wrapper.unmount()
  })
})
