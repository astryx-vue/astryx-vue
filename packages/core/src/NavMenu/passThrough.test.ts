import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import NavHeadingMenu from './NavHeadingMenu.vue'
import NavHeadingMenuItem from './NavHeadingMenuItem.vue'

describe('navHeadingMenuItem 透传属性', () => {
  it('id、aria-*、data-*、事件监听落在菜单项元素上', async () => {
    const onMouseenter = vi.fn()
    const wrapper = mount(NavHeadingMenuItem, {
      props: { label: 'Dashboard' },
      attrs: { 'aria-label': 'Open dashboard', 'id': 'nav-dashboard', 'data-tracking': 'nav-item', 'data-testid': 'item', 'onMouseenter': onMouseenter },
    })
    const item = wrapper.get('[data-testid="item"]')
    expect(item.element).toBe(wrapper.element)
    expect(item.attributes('aria-label')).toBe('Open dashboard')
    expect(item.attributes('id')).toBe('nav-dashboard')
    expect(item.attributes('data-tracking')).toBe('nav-item')
    await item.trigger('mouseenter')
    expect(onMouseenter).toHaveBeenCalledOnce()
  })

  it('同名时，组件自己管的 role 和 aria-disabled 优先', () => {
    const wrapper = mount(NavHeadingMenuItem, {
      props: { label: 'Dashboard', isDisabled: true },
      attrs: { 'role': 'button', 'aria-disabled': 'false' },
    })
    expect(wrapper.attributes('role')).toBe('menuitem')
    expect(wrapper.attributes('aria-disabled')).toBe('true')
  })
})

describe('navHeadingMenu 键盘导航', () => {
  it('菜单项自己的 keydown 处理函数调用了 preventDefault，方向键导航仍然正常', async () => {
    const onKeydown = vi.fn((event: KeyboardEvent) => event.preventDefault())
    const wrapper = mount(NavHeadingMenu, {
      attachTo: document.body,
      slots: {
        default: () => [
          h(NavHeadingMenuItem, { label: 'First', onKeydown }),
          h(NavHeadingMenuItem, { label: 'Second' }),
        ],
      },
    })
    const [first, second] = wrapper.findAll('[role="menuitem"]')
    ;(first.element as HTMLElement).focus()
    await first.trigger('keydown', { key: 'ArrowDown' })
    expect(onKeydown).toHaveBeenCalledOnce()
    expect(document.activeElement).toBe(second.element)
    wrapper.unmount()
  })

  it.each(['onKeydown', 'onKeydownCapture'])('在菜单上用 %s 取消按键，菜单不再导航', async (handler) => {
    const cancel = vi.fn((event: KeyboardEvent) => event.preventDefault())
    const wrapper = mount(NavHeadingMenu, {
      attachTo: document.body,
      attrs: { [handler]: cancel },
      slots: {
        default: () => [
          h(NavHeadingMenuItem, { label: 'First' }),
          h(NavHeadingMenuItem, { label: 'Second' }),
        ],
      },
    })
    const first = wrapper.findAll('[role="menuitem"]')[0]
    ;(first.element as HTMLElement).focus()
    await first.trigger('keydown', { key: 'ArrowDown' })
    expect(cancel).toHaveBeenCalledOnce()
    expect(document.activeElement).toBe(first.element)
    wrapper.unmount()
  })

  it('菜单上的 id、aria-*、data-* 透传到菜单根元素', () => {
    const wrapper = mount(NavHeadingMenu, { attrs: { 'id': 'menu', 'data-testid': 'menu', 'class': 'mine' } })
    expect(wrapper.attributes('id')).toBe('menu')
    expect(wrapper.attributes('data-testid')).toBe('menu')
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['astryx-nav-heading-menu', 'mine']))
  })
})
