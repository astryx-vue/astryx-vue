import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, useAttrs } from 'vue'
import Avatar from '../Avatar/Avatar.vue'
import BreadcrumbItem from '../Breadcrumbs/BreadcrumbItem.vue'
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs.vue'
import Button from '../Button/Button.vue'
import Link from '../Link/Link.vue'
import NavItem from '../NavItem/NavItem.vue'
import Tab from '../TabList/Tab.vue'
import TabList from '../TabList/TabList.vue'
import { useLinkComponent } from './context.js'
import LinkProvider from './LinkProvider.vue'

/** 一个模仿框架路由链接的组件：保留地址，也不做整页跳转。 */
const RouterLink = defineComponent({
  name: 'RouterLink',
  inheritAttrs: false,
  props: {
    href: { type: String, default: undefined },
    to: { type: String, default: undefined },
  },
  setup(props, { slots }) {
    const attrs = useAttrs()
    return () => h('a', {
      ...attrs,
      'data-router-link': 'true',
      'href': props.href ?? props.to,
      'data-to': props.to,
    }, slots.default?.())
  },
})

const Probe = defineComponent({
  name: 'Probe',
  setup() {
    const linkComponent = useLinkComponent()
    return () => h('i', { 'data-custom': String(linkComponent.value != null) })
  },
})

describe('useLinkComponent', () => {
  it('is empty without a provider', () => {
    const wrapper = mount(Probe)

    expect(wrapper.get('i').attributes('data-custom')).toBe('false')
  })

  it('reads the component the provider supplies', () => {
    const wrapper = mount(LinkProvider, {
      props: { component: RouterLink },
      slots: { default: () => h(Probe) },
    })

    expect(wrapper.get('i').attributes('data-custom')).toBe('true')
  })
})

describe('linkProvider', () => {
  it('routes every link element through the supplied component', () => {
    const wrapper = mount(LinkProvider, {
      props: { component: RouterLink },
      slots: {
        default: () => h('div', [
          h(Link, { href: '/link' }, { default: () => 'Link' }),
          h(Button, { href: '/button', label: 'Button' }),
          h(NavItem, { label: 'Nav', href: '/nav' }),
          h(Avatar, { name: 'Ada', href: '/avatar' }),
          h(Breadcrumbs, null, {
            default: () => h(BreadcrumbItem, { href: '/crumb' }, { default: () => 'Crumb' }),
          }),
          h(TabList, null, {
            default: () => h(Tab, { value: 'one', label: 'Tab', href: '/tab' }),
          }),
        ]),
      },
    })

    const routers = wrapper.findAll('[data-router-link="true"]')
    expect(routers.length).toBe(6)
    expect(routers.map(link => link.attributes('data-to'))).toEqual([
      '/link',
      '/button',
      '/nav',
      '/avatar',
      '/crumb',
      '/tab',
    ])
  })

  it('keeps plain anchors without a provider', () => {
    const wrapper = mount(Link, { props: { href: '/plain' }, slots: { default: () => 'Plain' } })

    expect(wrapper.get('a').attributes('href')).toBe('/plain')
    expect(wrapper.find('[data-router-link]').exists()).toBe(false)
  })

  it('lets a component-level as win over the provider', () => {
    const OwnLink = defineComponent({
      name: 'OwnLink',
      props: { href: { type: String, default: undefined } },
      setup(props, { slots }) {
        return () => h('a', { 'data-own-link': 'true', 'href': props.href }, slots.default?.())
      },
    })

    const wrapper = mount(LinkProvider, {
      props: { component: RouterLink },
      slots: { default: () => h(Link, { href: '/own', as: OwnLink }, { default: () => 'Own' }) },
    })

    expect(wrapper.find('[data-own-link="true"]').exists()).toBe(true)
    expect(wrapper.find('[data-router-link]').exists()).toBe(false)
  })

  it('renders nothing around the subtree', () => {
    const wrapper = mount(LinkProvider, {
      props: { component: RouterLink },
      slots: { default: () => h('span', 'content') },
    })

    expect(wrapper.html()).toBe('<span>content</span>')
  })
})
