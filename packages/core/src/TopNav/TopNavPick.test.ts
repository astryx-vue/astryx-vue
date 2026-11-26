import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import NavHeadingMenu from '../NavMenu/NavHeadingMenu.vue'
import NavHeadingMenuItem from '../NavMenu/NavHeadingMenuItem.vue'
import TopNav from './TopNav.vue'
import TopNavHeading from './TopNavHeading.vue'
import TopNavMegaMenu from './TopNavMegaMenu.vue'
import TopNavMegaMenuFeaturedCard from './TopNavMegaMenuFeaturedCard.vue'
import TopNavMegaMenuItem from './TopNavMegaMenuItem.vue'
import TopNavMenu from './TopNavMenu.vue'

describe('top-nav 菜单项选中后是否关闭', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('topNavMenu 的数据项默认选中后关闭，hasCloseOnSelect 为 false 时保持打开', async () => {
    const wrapper = mount(TopNav, {
      attachTo: document.body,
      slots: {
        default: () => h(TopNavMenu, {
          items: [
            { label: 'Copy link', hasCloseOnSelect: false },
            { label: 'Open', href: undefined },
          ],
          label: 'Share',
        }),
      },
    })
    await wrapper.get('.astryx-top-nav-menu__trigger').trigger('click')
    await nextTick()
    const [copy, open] = [...document.body.querySelectorAll<HTMLElement>('[role="menu"] [role="menuitem"]')]

    copy!.click()
    await nextTick()
    expect(document.body.querySelector('[role="menu"]')).not.toBeNull()

    open!.click()
    await nextTick()
    expect(document.body.querySelector('[role="menu"]')).toBeNull()
    wrapper.unmount()
  })

  it('topNavMegaMenuItem 默认选中后关闭面板，hasCloseOnSelect 为 false 时保持打开', async () => {
    const wrapper = mount(TopNav, {
      attachTo: document.body,
      slots: {
        default: () => h(TopNavMegaMenu, { label: 'Solutions' }, () => [
          h(TopNavMegaMenuItem, { hasCloseOnSelect: false, title: 'Pin' }),
          h(TopNavMegaMenuItem, { title: 'Teams' }),
        ]),
      },
    })
    await wrapper.get('.astryx-top-nav-menu__trigger').trigger('click')
    await nextTick()
    const [pin, teams] = [...document.body.querySelectorAll<HTMLElement>('.astryx-top-nav-mega-item')]

    pin!.click()
    await nextTick()
    expect(document.body.querySelector('.astryx-top-nav-mega__panel')).not.toBeNull()

    teams!.click()
    await nextTick()
    expect(document.body.querySelector('.astryx-top-nav-mega__panel')).toBeNull()
    wrapper.unmount()
  })

  it('键盘选中项后面板关闭，焦点回到触发按钮', async () => {
    const wrapper = mount(TopNav, {
      attachTo: document.body,
      slots: {
        default: () => h(TopNavMegaMenu, { label: 'Solutions' }, () => h(TopNavMegaMenuItem, { title: 'Teams' })),
      },
    })
    const trigger = wrapper.get<HTMLButtonElement>('.astryx-top-nav-menu__trigger')
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    await nextTick()
    const item = document.body.querySelector<HTMLElement>('.astryx-top-nav-mega-item')!
    item.focus()
    item.click()
    await nextTick()
    await nextTick()
    expect(document.body.querySelector('.astryx-top-nav-mega__panel')).toBeNull()
    expect(document.activeElement).toBe(trigger.element)
    wrapper.unmount()
  })
})

describe('top-nav 精选卡片', () => {
  it('链接末尾的箭头是单独的元素，从右到左的文字里由样式镜像', () => {
    const wrapper = mount(TopNavMegaMenuFeaturedCard, {
      props: { linkHref: '/new', linkLabel: 'Read more', title: 'What is new' },
    })
    const link = wrapper.get('.astryx-top-nav-mega-card__link')
    expect(link.text()).toBe('Read more →')
    expect(link.get('.astryx-top-nav-mega-card__link-arrow').text()).toBe('→')
  })
})

describe('标题弹出层里的菜单', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('菜单没有自己的名字时用标题当名字，只有这一个具名菜单', async () => {
    const wrapper = mount(TopNavHeading, {
      attachTo: document.body,
      props: { heading: 'My App' },
      slots: {
        menu: () => h(NavHeadingMenu, null, () => [
          h(NavHeadingMenuItem, { href: '/docs', label: 'Docs' }),
          h(NavHeadingMenuItem, { href: '/status', label: 'Status' }),
        ]),
      },
    })
    await wrapper.get('.astryx-top-nav-heading__chevron').trigger('click')
    await nextTick()
    const menus = document.body.querySelectorAll('[role="menu"]')
    expect(menus).toHaveLength(1)
    expect(menus[0]!.getAttribute('aria-label')).toBe('My App')
    wrapper.unmount()
  })

  it('菜单自己写了 label 时以它为准', async () => {
    const wrapper = mount(TopNavHeading, {
      attachTo: document.body,
      props: { heading: 'My App' },
      slots: { menu: () => h(NavHeadingMenu, { label: 'Products' }, () => h(NavHeadingMenuItem, { label: 'Docs' })) },
    })
    await wrapper.get('.astryx-top-nav-heading__chevron').trigger('click')
    await nextTick()
    expect(document.body.querySelector('[role="menu"]')?.getAttribute('aria-label')).toBe('Products')
    wrapper.unmount()
  })
})
