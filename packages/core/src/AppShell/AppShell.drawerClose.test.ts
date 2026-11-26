import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import BreadcrumbItem from '../Breadcrumbs/BreadcrumbItem.vue'
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs.vue'
import MobileNav from '../MobileNav/MobileNav.vue'
import SideNav from '../SideNav/SideNav.vue'
import SideNavItem from '../SideNav/SideNavItem.vue'
import TopNav from '../TopNav/TopNav.vue'
import TopNavItem from '../TopNav/TopNavItem.vue'
import AppShell from './AppShell.vue'

function stubPhone(): void {
  vi.stubGlobal('matchMedia', vi.fn(() => ({
    addEventListener: () => {},
    matches: true,
    media: '',
    removeEventListener: () => {},
  })))
}

function stubDesktop(): void {
  vi.stubGlobal('matchMedia', vi.fn(() => ({
    addEventListener: () => {},
    matches: false,
    media: '',
    removeEventListener: () => {},
  })))
}

describe('外壳的移动抽屉里的行被激活后关掉抽屉', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    document.body.innerHTML = ''
  })

  it('sideNavItem 的点击先交给调用方，再关掉抽屉', async () => {
    stubPhone()
    const onClick = vi.fn((event: MouseEvent) => event.preventDefault())
    const wrapper = mount(AppShell, {
      attachTo: document.body,
      props: { mobileNavOpen: true },
      slots: {
        default: () => 'Page',
        sideNav: () => h(SideNav, null, () => h(SideNavItem, { href: '/home', label: 'Home', onClick })),
      },
    })
    await nextTick()
    await nextTick()
    const dialog = document.body.querySelector('dialog')!
    expect(dialog.hasAttribute('open')).toBe(true)

    dialog.querySelector<HTMLElement>('.astryx-nav-item')!.click()
    await nextTick()
    expect(onClick).toHaveBeenCalledOnce()
    expect(wrapper.emitted('update:mobileNavOpen')?.at(-1)).toEqual([false])
    wrapper.unmount()
  })

  it('带下级的 SideNavItem 只展开收起，不关抽屉', async () => {
    stubPhone()
    const wrapper = mount(AppShell, {
      attachTo: document.body,
      props: { mobileNavOpen: true },
      slots: {
        default: () => 'Page',
        sideNav: () => h(SideNav, null, () => h(SideNavItem, { label: 'Library' }, () => h(SideNavItem, { href: '/a', label: 'Albums' }))),
      },
    })
    await nextTick()
    await nextTick()
    document.body.querySelector<HTMLElement>('dialog .astryx-nav-item')!.click()
    await nextTick()
    expect(wrapper.emitted('update:mobileNavOpen')).toBeUndefined()
    wrapper.unmount()
  })

  it('外壳顶栏的 TopNavItem 被搬进抽屉后也能关掉它', async () => {
    stubPhone()
    const wrapper = mount(AppShell, {
      attachTo: document.body,
      props: { mobileNavOpen: true },
      slots: {
        default: () => 'Page',
        topNav: () => h(TopNav, null, { default: () => h(TopNavItem, { href: '/home', label: 'Home' }) }),
      },
    })
    await nextTick()
    await nextTick()
    const item = document.body.querySelector<HTMLElement>('dialog .astryx-top-nav-item')
    expect(item?.getAttribute('data-mode')).toBe('drawer')
    item!.addEventListener('click', event => event.preventDefault())
    item!.click()
    await nextTick()
    expect(wrapper.emitted('update:mobileNavOpen')?.at(-1)).toEqual([false])
    wrapper.unmount()
  })

  it('抽屉里的面包屑被点击后关掉抽屉，抽屉外的不受影响', async () => {
    const onOpenChange = vi.fn()
    const crumbs = () => h(Breadcrumbs, null, () => [
      h(BreadcrumbItem, { href: '/docs', onClick: (event: MouseEvent) => event.preventDefault() }, () => 'Docs'),
      h(BreadcrumbItem, { isCurrent: true }, () => 'Page'),
    ])
    const wrapper = mount(MobileNav, {
      attachTo: document.body,
      props: { 'isOpen': true, 'label': 'Navigation', 'onUpdate:isOpen': onOpenChange },
      slots: { default: crumbs },
    })
    await nextTick()
    document.body.querySelector<HTMLElement>('dialog a')!.click()
    await nextTick()
    expect(onOpenChange).toHaveBeenCalledWith(false)
    wrapper.unmount()

    stubDesktop()
    const outside = mount(crumbs(), { attachTo: document.body })
    expect(() => outside.get('a').element.click()).not.toThrow()
    outside.unmount()
  })
})

describe('外壳读到窗口之前的顶栏', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('带顶栏且开着移动导航时，服务端渲染的页面带断点标记，读到窗口后去掉', async () => {
    stubDesktop()
    const wrapper = mount(AppShell, {
      slots: { default: () => 'Page', topNav: () => h(TopNav) },
    })
    // 挂载后标记已经撤掉。
    await nextTick()
    expect(wrapper.attributes('data-mobile-unread')).toBeUndefined()
    wrapper.unmount()
  })

  it('服务端渲染的页面里带着当前断点', async () => {
    const { renderToString } = await import('vue/server-renderer')
    const { createSSRApp } = await import('vue')
    const html = await renderToString(createSSRApp({
      render: () => h(AppShell, { mobileNav: { breakpoint: 'lg' } }, { default: () => 'Page', topNav: () => h(TopNav) }),
    }))
    expect(html).toContain('data-mobile-unread="lg"')

    const off = await renderToString(createSSRApp({
      render: () => h(AppShell, { mobileNav: false }, { default: () => 'Page', topNav: () => h(TopNav) }),
    }))
    expect(off).not.toContain('data-mobile-unread')
  })

  it('defaultIsMobile 让服务端渲染出手机布局，侧栏换成顶部的菜单开关', async () => {
    const { renderToString } = await import('vue/server-renderer')
    const { createSSRApp } = await import('vue')
    const render = (mobileNav: { defaultIsMobile?: boolean }) => renderToString(createSSRApp({
      render: () => h(AppShell, { mobileNav }, { default: () => 'Page', sideNav: () => h(SideNav) }),
    }))
    // 真正的服务端没有 window。
    vi.stubGlobal('window', undefined)
    const phone = await render({ defaultIsMobile: true })
    const wide = await render({})
    vi.unstubAllGlobals()
    expect(phone).toContain('astryx-app-shell__mobile-bar')
    expect(wide).not.toContain('astryx-app-shell__mobile-bar')
  })

  it('只有侧栏时服务端页面也带断点标记，让 CSS 在手机上先藏起内联侧栏', async () => {
    const { renderToString } = await import('vue/server-renderer')
    const { createSSRApp } = await import('vue')
    const html = await renderToString(createSSRApp({
      render: () => h(AppShell, null, { default: () => 'Page', sideNav: () => h(SideNav) }),
    }))
    expect(html).toContain('data-mobile-unread="md"')
  })
})
