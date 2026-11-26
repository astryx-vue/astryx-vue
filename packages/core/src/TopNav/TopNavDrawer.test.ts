import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createCommentVNode, h, nextTick } from 'vue'
import TopNav from './TopNav.vue'
import TopNavHeading from './TopNavHeading.vue'
import TopNavItem from './TopNavItem.vue'
import TopNavMegaMenu from './TopNavMegaMenu.vue'
import TopNavMegaMenuItem from './TopNavMegaMenuItem.vue'
import TopNavMenu from './TopNavMenu.vue'

function stubPhone(): void {
  vi.stubGlobal('matchMedia', () => ({
    addEventListener: () => {},
    matches: true,
    removeEventListener: () => {},
  }))
}

async function openDrawer(wrapper: ReturnType<typeof mount>): Promise<HTMLDialogElement> {
  await wrapper.get('[aria-label="Open menu"]').trigger('click')
  await nextTick()
  const dialog = document.body.querySelector('dialog')
  expect(dialog?.hasAttribute('open')).toBe(true)
  return dialog as HTMLDialogElement
}

describe('top-nav 抽屉里的分组', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    document.body.innerHTML = ''
  })

  it('topNavMenu 收起时里面的链接 inert 且对读屏隐藏，展开后恢复', async () => {
    stubPhone()
    const wrapper = mount(TopNav, {
      attachTo: document.body,
      props: { mobileQuery: '(max-width: 600px)' },
      slots: { default: () => h(TopNavMenu, { items: [{ href: '/a', label: 'Analytics' }], label: 'Product' }) },
    })
    await nextTick()
    await openDrawer(wrapper)

    const trigger = document.body.querySelector<HTMLElement>('.astryx-top-nav-menu__drawer-trigger')!
    const section = document.getElementById(trigger.getAttribute('aria-controls') ?? '')!
    expect(section.classList.contains('astryx-top-nav-drawer-section--collapsed')).toBe(true)
    expect(section.hasAttribute('inert')).toBe(true)
    expect(section.getAttribute('aria-hidden')).toBe('true')

    trigger.click()
    await nextTick()
    expect(section.classList.contains('astryx-top-nav-drawer-section--collapsed')).toBe(false)
    expect(section.hasAttribute('inert')).toBe(false)
    expect(section.hasAttribute('aria-hidden')).toBe(false)
    wrapper.unmount()
  })

  it('topNavMegaMenu 收起时同样 inert 且读屏隐藏', async () => {
    stubPhone()
    const wrapper = mount(TopNav, {
      attachTo: document.body,
      props: { mobileQuery: '(max-width: 600px)' },
      slots: { default: () => h(TopNavMegaMenu, { label: 'Solutions' }, () => h(TopNavMegaMenuItem, { href: '/teams', title: 'Teams' })) },
    })
    await nextTick()
    await openDrawer(wrapper)

    const trigger = document.body.querySelector<HTMLElement>('.astryx-top-nav-menu__drawer-trigger')!
    const section = document.getElementById(trigger.getAttribute('aria-controls') ?? '')!
    expect(section.hasAttribute('inert')).toBe(true)
    expect(section.getAttribute('aria-hidden')).toBe('true')
    trigger.click()
    await nextTick()
    expect(section.hasAttribute('inert')).toBe(false)
    wrapper.unmount()
  })

  it('抽屉里的 TopNavItem、TopNavMenu 项、TopNavMegaMenuItem 被激活后关掉抽屉', async () => {
    stubPhone()
    const wrapper = mount(TopNav, {
      attachTo: document.body,
      props: { mobileQuery: '(max-width: 600px)' },
      slots: {
        default: () => [
          h(TopNavItem, { label: 'Home', onClick: (event: MouseEvent) => event.preventDefault(), href: '/home' }),
          h(TopNavMenu, { items: [{ href: '/a', label: 'Analytics' }], label: 'Product' }),
          h(TopNavMegaMenu, { label: 'Solutions' }, () => h(TopNavMegaMenuItem, { href: '/teams', title: 'Teams' })),
        ],
      },
    })
    await nextTick()

    for (const selector of [
      '.astryx-top-nav-item',
      '.astryx-top-nav-menu--drawer .astryx-nav-menu-item',
      '.astryx-top-nav-mega-item',
    ]) {
      const dialog = await openDrawer(wrapper)
      const target = dialog.querySelector<HTMLElement>(selector)!
      target.addEventListener('click', event => event.preventDefault())
      target.click()
      await nextTick()
      await vi.waitFor(() => expect(document.body.querySelector('dialog')?.hasAttribute('open')).toBe(false), { timeout: 1000 })
    }
    wrapper.unmount()
  })

  it('禁用的 TopNavItem 保留 Tab 停靠点，也不运行调用方的处理函数', async () => {
    const onClick = vi.fn()
    const onKeydown = vi.fn()
    const wrapper = mount(TopNavItem, {
      attrs: { onKeydown },
      props: { isDisabled: true, label: 'Billing', onClick },
    })
    const item = wrapper.get('.astryx-top-nav-item')
    expect(item.attributes('aria-disabled')).toBe('true')
    expect(item.attributes('tabindex')).not.toBe('-1')
    // 原生 disabled 会让它掉出 Tab 顺序，所以靠 aria-disabled，不用原生 disabled。
    expect(item.attributes('disabled')).toBeUndefined()
    await item.trigger('click')
    await item.trigger('keydown', { key: 'Enter' })
    expect(onClick).not.toHaveBeenCalled()
    expect(onKeydown).not.toHaveBeenCalled()
  })
})

describe('top-nav 插槽判空和手机条', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    document.body.innerHTML = ''
  })

  it('空的插槽不画包裹元素', () => {
    const wrapper = mount(TopNav, {
      slots: {
        center: () => [],
        default: () => [],
        end: () => '',
        heading: () => createCommentVNode('v-if'),
      },
    })
    expect(wrapper.find('.astryx-top-nav__heading').exists()).toBe(false)
    expect(wrapper.find('.astryx-top-nav__items').exists()).toBe(false)
    expect(wrapper.find('.astryx-top-nav__center').exists()).toBe(false)
    expect(wrapper.find('.astryx-top-nav__end').exists()).toBe(false)
    expect(wrapper.classes()).not.toContain('astryx-top-nav--centered')
  })

  it('手机条带 mobile-bar 主题状态，纯文字标题包一层收在一行内', async () => {
    stubPhone()
    const wrapper = mount(TopNav, {
      attachTo: document.body,
      props: { mobileQuery: '(max-width: 600px)' },
      slots: {
        default: () => h(TopNavItem, { label: 'Home' }),
        heading: () => 'A very long product name that cannot fit',
      },
    })
    await nextTick()
    expect(wrapper.get('nav').attributes('data-mode')).toBe('mobile-bar')
    expect(wrapper.get('.astryx-top-nav__heading-text').text()).toContain('A very long product name')
    wrapper.unmount()
  })

  it('标题是元素时不另包文字层', async () => {
    stubPhone()
    const wrapper = mount(TopNav, {
      attachTo: document.body,
      props: { mobileQuery: '(max-width: 600px)' },
      slots: { heading: () => h(TopNavHeading, { heading: 'Acme' }) },
    })
    await nextTick()
    expect(wrapper.find('.astryx-top-nav__heading-text').exists()).toBe(false)
    wrapper.unmount()
  })

  it('整条顶栏不带 data-mode，抽屉里的 TopNavItem 带 drawer', async () => {
    stubPhone()
    const wrapper = mount(TopNav, {
      attachTo: document.body,
      props: { mobileQuery: '(max-width: 600px)' },
      slots: { default: () => h(TopNavItem, { label: 'Home', href: '/home' }) },
    })
    await nextTick()
    const dialog = await openDrawer(wrapper)
    expect(dialog.querySelector('.astryx-top-nav-item')?.getAttribute('data-mode')).toBe('drawer')
    wrapper.unmount()

    const full = mount(TopNav, { slots: { default: () => h(TopNavItem, { label: 'Home' }) } })
    expect(full.get('nav').attributes('data-mode')).toBeUndefined()
    expect(full.get('.astryx-top-nav-item').attributes('data-mode')).toBeUndefined()
  })
})
