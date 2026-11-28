import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import { linkComponentKey } from '../LinkProvider/context.js'
import TreeList from '../TreeList/TreeList.vue'
import Item from './Item.vue'

const RouterLinkStub = defineComponent({
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    return () => h('a', { 'data-router-link': '', ...attrs }, slots.default?.())
  },
})
const global = { provide: { [linkComponentKey as symbol]: RouterLinkStub } }

describe('item 禁用的链接行', () => {
  it('没有 href、target、rel，也不走路由链接组件，保留链接角色', () => {
    const wrapper = mount(Item, {
      props: { label: 'Billing', href: '/billing', target: '_blank', isDisabled: true },
      global,
    })
    const link = wrapper.get('.astryx-item__content')
    expect(link.attributes('role')).toBe('link')
    expect(link.attributes('aria-disabled')).toBe('true')
    for (const name of ['href', 'target', 'rel', 'data-router-link'])
      expect(link.attributes(name)).toBeUndefined()

    const enabled = mount(Item, { props: { label: 'Profile', href: '/profile' }, global })
    const enabledLink = enabled.get('.astryx-item__content')
    expect(enabledLink.attributes('href')).toBe('/profile')
    expect(enabledLink.attributes('data-router-link')).toBeDefined()
    expect(enabledLink.attributes('aria-disabled')).toBeUndefined()
  })

  it('链接行聚焦时被禁用，焦点交给换出来的元素', async () => {
    const wrapper = mount(Item, {
      attachTo: document.body,
      props: { label: 'Billing', href: '/billing' },
      global,
    })
    wrapper.get<HTMLElement>('.astryx-item__content').element.focus()
    await wrapper.setProps({ isDisabled: true })
    await flushPromises()
    const disabled = wrapper.get<HTMLElement>('.astryx-item__content')
    expect(disabled.attributes('href')).toBeUndefined()
    expect(document.activeElement).toBe(disabled.element)
    wrapper.unmount()
  })

  it('焦点在别处时，行被禁用不去抢焦点', async () => {
    const other = document.createElement('button')
    document.body.append(other)
    const wrapper = mount(Item, {
      attachTo: document.body,
      props: { label: 'Billing', href: '/billing' },
      global,
    })
    other.focus()
    await wrapper.setProps({ isDisabled: true })
    await flushPromises()
    expect(document.activeElement).toBe(other)
    wrapper.unmount()
    other.remove()
  })
})

describe('tree list 禁用的链接行', () => {
  it('链接没有 href、target，也不走路由链接组件', () => {
    const wrapper = mount(TreeList, {
      props: {
        items: [
          { id: 'a', label: 'Report', href: '/report', target: '_blank', isDisabled: true },
          { id: 'b', label: 'Live', href: '/live' },
        ],
      },
      global,
    })
    const links = wrapper.findAll('a.astryx-tree-list__action')
    const [disabled, live] = links
    expect(disabled!.attributes('role')).toBe('link')
    expect(disabled!.attributes('aria-disabled')).toBe('true')
    for (const name of ['href', 'target', 'rel', 'data-router-link'])
      expect(disabled!.attributes(name)).toBeUndefined()
    expect(live!.attributes('href')).toBe('/live')
    expect(live!.attributes('data-router-link')).toBeDefined()
  })

  it('焦点在内部链接上，行被禁用，焦点跟到换出来的链接', async () => {
    const wrapper = mount(TreeList, {
      attachTo: document.body,
      props: { items: [{ id: 'a', label: 'Report', href: '/report' }] },
      global,
    })
    wrapper.get<HTMLElement>('a.astryx-tree-list__action').element.focus()
    await wrapper.setProps({ items: [{ id: 'a', label: 'Report', href: '/report', isDisabled: true }] })
    await flushPromises()
    const disabled = wrapper.get<HTMLElement>('a.astryx-tree-list__action')
    expect(disabled.attributes('href')).toBeUndefined()
    expect(document.activeElement).toBe(disabled.element)
    wrapper.unmount()
  })
})
