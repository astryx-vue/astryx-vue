import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import TopNavMegaMenuItem from './TopNavMegaMenuItem.vue'

describe('topNavMegaMenuItem 透传属性', () => {
  it('id、aria-*、data-*、事件监听、class、style 落在菜单项元素上', async () => {
    const onMouseenter = vi.fn()
    const wrapper = mount(TopNavMegaMenuItem, {
      props: { title: 'Analytics' },
      attrs: { 'aria-label': 'Open analytics', 'id': 'mega-analytics', 'data-tracking': 'mega-item', 'data-testid': 'item', 'onMouseenter': onMouseenter, 'class': 'consumer-item', 'style': 'outline-color: red' },
    })
    expect(wrapper.attributes('aria-label')).toBe('Open analytics')
    expect(wrapper.attributes('id')).toBe('mega-analytics')
    expect(wrapper.attributes('data-tracking')).toBe('mega-item')
    expect(wrapper.attributes('data-testid')).toBe('item')
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['astryx-top-nav-mega-item', 'consumer-item']))
    expect((wrapper.element as HTMLElement).style.outlineColor).toBe('red')
    await wrapper.trigger('mouseenter')
    expect(onMouseenter).toHaveBeenCalledOnce()
  })

  it('链接形态下同样透传，tabindex 也能传', () => {
    const wrapper = mount(TopNavMegaMenuItem, {
      props: { title: 'Analytics', href: '/analytics' },
      attrs: { 'data-tracking': 'mega-item', 'tabindex': -1 },
    })
    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.attributes('data-tracking')).toBe('mega-item')
    expect(wrapper.attributes('tabindex')).toBe('-1')
  })
})
