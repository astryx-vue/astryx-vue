/**
 * @file SideNavRegion.test.ts
 * @input vitest (jsdom)、`useResizable()` 的返回值作为 SideNav 的 `resizable`
 * @output 区域拥有宽度和收起状态：轨道按它的宽度画，跟着它收起和展开，收起按钮调它的
 *   `collapse` 和 `expand`；能不能收起由区域自己的 `collapsible` 决定；
 *   `collapsible` 与区域不一致时以区域为准并在开发环境警告
 */
import type { ResizableRegion } from '../composables/useResizable.js'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { useResizable } from '../composables/useResizable.js'
import SideNav from './SideNav.vue'
import SideNavItem from './SideNavItem.vue'

afterEach(() => {
  vi.restoreAllMocks()
})

function mountWithRegion(
  options: { regionCollapsible: boolean, collapsible?: boolean | Record<string, unknown> },
) {
  const captured: { region?: ResizableRegion } = {}
  const Host = defineComponent({
    setup() {
      const region = useResizable({ collapsible: options.regionCollapsible, defaultSize: 300, direction: 'horizontal' })
      captured.region = region
      return () => h(SideNav, { collapsible: options.collapsible, resizable: region }, () => h(SideNavItem, { href: '/home', iconClass: 'i-carbon-home', label: 'Home' }))
    },
  })
  const wrapper = mount(Host, { attachTo: document.body })
  return { region: captured.region!, wrapper }
}

describe('side-nav resizable region', () => {
  it('sizes the rail from the region and shows the resize handle', () => {
    const { region, wrapper } = mountWithRegion({ regionCollapsible: true })
    expect(wrapper.get('nav').attributes('style')).toContain(`${region.size}px`)
    expect(wrapper.find('[role="separator"]').exists()).toBe(true)
    wrapper.unmount()
  })

  it('follows the region collapse state, and the toggle drives the region', async () => {
    const { region, wrapper } = mountWithRegion({ regionCollapsible: true })
    const nav = wrapper.get('nav')

    await wrapper.get('[aria-label="Collapse sidebar"]').trigger('click')
    expect(region.isCollapsed).toBe(true)
    expect(nav.attributes('data-collapsed')).toBe('true')
    expect(wrapper.find('[role="separator"]').exists()).toBe(false)

    region.expand()
    await nextTick()
    expect(nav.attributes('data-collapsed')).toBeUndefined()
    wrapper.unmount()
  })

  it('lets the region decide whether the rail collapses', () => {
    const { wrapper } = mountWithRegion({ regionCollapsible: false })
    expect(wrapper.find('[aria-label="Collapse sidebar"]').exists()).toBe(false)
    wrapper.unmount()
  })

  it('warns when collapsible disagrees with the region, and stays quiet when they agree', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    mountWithRegion({ collapsible: true, regionCollapsible: true }).wrapper.unmount()
    expect(warn).not.toHaveBeenCalled()

    const disagreeing = mountWithRegion({ collapsible: true, regionCollapsible: false })
    expect(warn).toHaveBeenCalledTimes(1)
    expect(String(warn.mock.calls[0]?.[0])).toContain('useResizable')
    disagreeing.wrapper.unmount()
  })

  it('ignores a collapsed state set through collapsible and warns', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { wrapper } = mountWithRegion({ collapsible: { defaultIsCollapsed: true }, regionCollapsible: true })
    await nextTick()
    expect(wrapper.get('nav').attributes('data-collapsed')).toBeUndefined()
    expect(warn).toHaveBeenCalledTimes(1)
    wrapper.unmount()
  })
})
