/**
 * @file SideNavRailFocus.test.ts
 * @input vitest (jsdom)、SideNav 收起轨道时的焦点接力（railFocus.ts）
 * @output 焦点在轨道丢掉的行上，收起后交给收起按钮；没有按钮就交给最近的保留行；
 *   在保留行上，留在这一行的控件上；页脚的控件按名字找回；焦点没丢就不动
 */
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { h, nextTick, ref } from 'vue'
import SideNav from './SideNav.vue'
import SideNavItem from './SideNavItem.vue'

const mounted: Array<{ unmount: () => void }> = []
afterEach(() => {
  mounted.splice(0).forEach(wrapper => wrapper.unmount())
  document.body.innerHTML = ''
})

function mountRail(options: { hasButton?: boolean, withFooter?: boolean } = {}) {
  const collapsed = ref(false)
  const host = document.createElement('div')
  document.body.append(host)
  const wrapper = mount({
    setup: () => () => h(SideNav, {
      'collapsible': { hasButton: options.hasButton ?? true },
      'isCollapsed': collapsed.value,
      'onUpdate:isCollapsed': (value: boolean) => {
        collapsed.value = value
      },
    }, {
      default: () => [
        h(SideNavItem, { href: '/home', iconClass: 'i-carbon-home', label: 'Home' }),
        h(SideNavItem, { href: '/docs', label: 'Docs' }),
        h(SideNavItem, { href: '/files', iconClass: 'i-carbon-folder', label: 'Files' }, () => [
          h(SideNavItem, { href: '/files/recent', label: 'Recent' }),
        ]),
      ],
      footerIcons: options.withFooter
        ? () => h('button', { 'type': 'button', 'aria-label': 'Help' }, '?')
        : undefined,
    }),
  }, { attachTo: host })
  mounted.push(wrapper)
  return { collapsed, wrapper }
}

async function collapse(collapsed: { value: boolean }): Promise<void> {
  collapsed.value = true
  await nextTick()
  await nextTick()
}

describe('side-nav rail focus', () => {
  it('moves focus from a row the rail drops to the collapse toggle', async () => {
    const { collapsed, wrapper } = mountRail()
    wrapper.get<HTMLElement>('a[href="/docs"]').element.focus()
    expect(document.activeElement?.getAttribute('href')).toBe('/docs')

    await collapse(collapsed)

    expect(document.activeElement).toBe(wrapper.get('[aria-label="Expand sidebar"]').element)
  })

  it('moves focus from a nested row to the toggle as well', async () => {
    const { collapsed, wrapper } = mountRail()
    wrapper.get<HTMLElement>('a[href="/files/recent"]').element.focus()

    await collapse(collapsed)

    expect(document.activeElement).toBe(wrapper.get('[aria-label="Expand sidebar"]').element)
  })

  it('without a toggle, moves focus to the nearest row the rail keeps', async () => {
    const { collapsed, wrapper } = mountRail({ hasButton: false })
    wrapper.get<HTMLElement>('a[href="/docs"]').element.focus()

    await collapse(collapsed)

    const home = wrapper.get('a[aria-label="Home"]').element
    expect(document.activeElement).toBe(home)
  })

  it('keeps focus on a row the rail keeps, even though its control is replaced', async () => {
    const { collapsed, wrapper } = mountRail()
    wrapper.get<HTMLElement>('a[href="/home"]').element.focus()

    await collapse(collapsed)

    expect(document.activeElement).toBe(wrapper.get('a[aria-label="Home"]').element)
  })

  it('leaves focus alone when the collapse did not take it', async () => {
    const { collapsed } = mountRail()
    const outside = document.createElement('button')
    document.body.append(outside)
    outside.focus()

    await collapse(collapsed)

    expect(document.activeElement).toBe(outside)
  })

  it('finds a footer control again by its name after the collapse', async () => {
    const { collapsed, wrapper } = mountRail({ withFooter: true })
    wrapper.get<HTMLElement>('[aria-label="Help"]').element.focus()

    await collapse(collapsed)

    expect(document.activeElement).toBe(wrapper.get('[aria-label="Help"]').element)
  })
})
