import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
/**
 * @file SideNavItem.test.ts
 * @input vitest (jsdom)、SideNav 里的行、标题和区块
 * @output 禁用的行保留 Tab 停靠点且不触发行为；空插槽不画包裹元素（0 算内容）；
 *   整个标题是链接时末端内容放在链接旁边；下级组只在收起时裁剪
 */
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import SideNav from './SideNav.vue'
import SideNavHeading from './SideNavHeading.vue'
import SideNavItem from './SideNavItem.vue'
import SideNavSection from './SideNavSection.vue'

describe('side-nav item disabled', () => {
  it('stays a focusable button with aria-disabled instead of a native disabled one', () => {
    const wrapper = mount(SideNavItem, { props: { isDisabled: true, label: 'Billing' } })
    const button = wrapper.get('button')
    expect(button.attributes('disabled')).toBeUndefined()
    expect(button.attributes('aria-disabled')).toBe('true')
    expect(button.attributes('tabindex')).toBeUndefined()
  })

  it('keeps the tab stop of a disabled link row, as a button without an address', () => {
    const wrapper = mount(SideNavItem, { props: { href: '/billing', isDisabled: true, label: 'Billing' } })
    expect(wrapper.find('a').exists()).toBe(false)
    expect(wrapper.get('button').attributes('aria-disabled')).toBe('true')
  })

  it('runs no click handler and no caller handler except focus and blur', async () => {
    const onClick = vi.fn()
    const onKeydown = vi.fn()
    const onFocus = vi.fn()
    const wrapper = mount(SideNavItem, {
      attrs: { onKeydown, onFocus },
      props: { isDisabled: true, label: 'Billing', onClick },
    })
    const button = wrapper.get('button')
    await button.trigger('click')
    await button.trigger('keydown', { key: 'Enter' })
    await button.trigger('focus')
    expect(onClick).not.toHaveBeenCalled()
    expect(onKeydown).not.toHaveBeenCalled()
    expect(onFocus).toHaveBeenCalledTimes(1)
  })

  it('keeps an enabled row native and runs its handlers', async () => {
    const onClick = vi.fn()
    const wrapper = mount(SideNavItem, { props: { label: 'Billing', onClick } })
    await wrapper.get('button').trigger('click')
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(wrapper.get('button').attributes('aria-disabled')).toBeUndefined()
  })

  it('keeps a disabled collapsed leaf focusable and inert', async () => {
    const onClick = vi.fn()
    const wrapper = mount(SideNav, {
      props: { collapsible: true, isCollapsed: true },
      slots: {
        default: () => h(SideNavItem, { iconClass: 'i-carbon-home', isDisabled: true, label: 'Home', onClick }),
      },
    })
    const button = wrapper.get('button[aria-label="Home"]')
    expect(button.attributes('disabled')).toBeUndefined()
    expect(button.attributes('aria-disabled')).toBe('true')
    await button.trigger('click')
    expect(onClick).not.toHaveBeenCalled()
  })
})

describe('side-nav slot presence', () => {
  it('draws no wrapper for slots that render nothing, and keeps a rendered 0', () => {
    const wrapper = mount(SideNav, {
      slots: {
        default: () => h(SideNavItem, { label: 'Home' }, { actions: () => [], end: () => '' }),
        footerIcons: () => [null, false],
        header: () => '',
        top: () => [],
      },
    })
    expect(wrapper.find('.astryx-side-nav__top').exists()).toBe(false)
    expect(wrapper.find('.astryx-side-nav__bottom').exists()).toBe(false)
    expect(wrapper.find('.astryx-side-nav-item__actions').exists()).toBe(false)
    expect(wrapper.find('.astryx-nav-item__end').exists()).toBe(false)

    const counted = mount(SideNav, { slots: { footerIcons: () => '0', top: () => '0' } })
    expect(counted.get('.astryx-side-nav__top-content').text()).toBe('0')
    expect(counted.get('.astryx-side-nav__footer-icons, .astryx-side-nav__footer-row').text()).toBe('0')
  })

  it('draws no section end wrapper for an empty end slot', () => {
    const wrapper = mount(SideNavSection, { props: { title: 'Library' }, slots: { end: () => [] } })
    expect(wrapper.find('.astryx-side-nav-section__end').exists()).toBe(false)
  })
})

describe('side-nav heading', () => {
  it('puts end content beside a whole-heading link, not inside the link', () => {
    const wrapper = mount(SideNavHeading, {
      props: { heading: 'Acme', headingHref: '/' },
      slots: { end: () => h('button', { type: 'button' }, 'Switch') },
    })
    const link = wrapper.get('a')
    expect(link.text()).toBe('Acme')
    expect(link.find('button').exists()).toBe(false)
    expect(wrapper.get('button').text()).toBe('Switch')
    expect(wrapper.get('.astryx-side-nav-heading').element.contains(link.element)).toBe(true)
    expect(wrapper.get('.astryx-side-nav-heading').element.contains(wrapper.get('button').element)).toBe(true)
  })

  it('keeps a whole-heading link without end content as one link', () => {
    const wrapper = mount(SideNavHeading, { props: { heading: 'Acme', headingHref: '/' } })
    expect(wrapper.get('a').classes()).toContain('astryx-side-nav-heading')
  })
})

describe('side-nav nested group styles', () => {
  const css = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '../../styles/side-nav.css'), 'utf8')

  it('clips the group only while it is collapsed', () => {
    const expanded = /\.astryx-side-nav-item__children \{[^}]*\}/.exec(css)?.[0] ?? ''
    expect(expanded).toContain('overflow: visible')
    expect(expanded).toContain('allow-discrete')
    const collapsed = /\.astryx-side-nav-item__children--collapsed \{[^}]*\}/.exec(css)?.[0] ?? ''
    expect(collapsed).toContain('overflow: hidden')
    const inner = /\.astryx-side-nav-item__children-inner \{[^}]*\}/.exec(css)?.[0] ?? ''
    expect(inner).not.toContain('overflow')
  })
})
