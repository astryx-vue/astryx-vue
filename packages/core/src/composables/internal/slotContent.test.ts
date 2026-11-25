import type { Component } from 'vue'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { createCommentVNode, createTextVNode, h } from 'vue'
import Avatar from '../../Avatar/Avatar.vue'
import BreadcrumbItem from '../../Breadcrumbs/BreadcrumbItem.vue'
import Breadcrumbs from '../../Breadcrumbs/Breadcrumbs.vue'
import Button from '../../Button/Button.vue'
import DropdownMenuGroup from '../../DropdownMenu/DropdownMenuGroup.vue'
import SegmentedControl from '../../SegmentedControl/SegmentedControl.vue'
import SegmentedControlItem from '../../SegmentedControl/SegmentedControlItem.vue'
import Tab from '../../TabList/Tab.vue'
import TabList from '../../TabList/TabList.vue'
import { hasSlotContent } from './slotContent.js'

enableAutoUnmount(afterEach)

// 插槽只剩 `v-if` 留下的注释：什么都没画。
const nothing = () => [createCommentVNode('v-if', true)]
// 文字 `0` 是内容。
const zero = () => '0'

function wrapperOf(component: Component, props: Record<string, unknown>, slots: Record<string, () => unknown>, selector: string) {
  return mount(component, { props, slots }).find(selector)
}

describe('hasSlotContent', () => {
  it('把没传、只有注释、只有空白和空数组的插槽当作没内容，文字 0 和元素算内容', () => {
    expect(hasSlotContent(undefined)).toBe(false)
    expect(hasSlotContent(nothing)).toBe(false)
    expect(hasSlotContent(() => [createTextVNode('  ')])).toBe(false)
    expect(hasSlotContent(() => [])).toBe(false)
    expect(hasSlotContent(zero)).toBe(true)
    expect(hasSlotContent(() => [h('span')])).toBe(true)
  })
})

describe('插槽什么都没画时不留空壳', () => {
  it('button 的 icon 和 end', () => {
    for (const name of ['icon', 'end'] as const) {
      const selector = name === 'icon' ? '.astryx-button__icon' : '.astryx-button__end'
      expect(wrapperOf(Button, { label: 'Save' }, { [name]: nothing }, selector).exists(), name).toBe(false)
      expect(wrapperOf(Button, { label: 'Save' }, { [name]: zero }, selector).text(), name).toBe('0')
    }
  })

  it('avatar 的 status', () => {
    expect(wrapperOf(Avatar, { name: 'Ada' }, { status: nothing }, '.astryx-avatar__status').exists()).toBe(false)
    expect(wrapperOf(Avatar, { name: 'Ada' }, { status: zero }, '.astryx-avatar__status').text()).toBe('0')
  })

  it('breadcrumbItem 的 startIcon', () => {
    const render = (startIcon: () => unknown) => mount(Breadcrumbs, {
      slots: { default: () => h(BreadcrumbItem, { href: '/' }, { default: () => 'Home', startIcon }) },
    }).find('.astryx-breadcrumb-item__icon')
    expect(render(nothing).exists()).toBe(false)
    expect(render(zero).text()).toBe('0')
  })

  it('segmentedControlItem 的 icon', () => {
    const render = (icon: () => unknown) => mount(SegmentedControl, {
      props: { 'label': 'Range', 'modelValue': 'day', 'onUpdate:modelValue': () => {} },
      slots: { default: () => h(SegmentedControlItem, { value: 'day', label: 'Day' }, { icon }) },
    }).find('.astryx-segmented-control-item__icon')
    expect(render(nothing).exists()).toBe(false)
    expect(render(zero).text()).toBe('0')
  })

  it('tab 的 icon、selectedIcon 和 endContent', () => {
    const render = (slots: Record<string, () => unknown>) => mount(TabList, {
      props: { 'value': 'a', 'onUpdate:value': () => {} },
      slots: { default: () => h(Tab, { value: 'a', label: 'Overview' }, slots) },
    })
    expect(render({ icon: nothing }).find('.astryx-tab__icon').exists()).toBe(false)
    expect(render({ icon: zero }).find('.astryx-tab__icon').text()).toBe('0')
    // 选中时 selectedIcon 没画出东西，退回 icon。
    expect(render({ icon: () => 'i', selectedIcon: nothing }).find('.astryx-tab__icon').text()).toBe('i')
    expect(render({ icon: () => 'i', selectedIcon: zero }).find('.astryx-tab__icon').text()).toBe('0')
    expect(render({ endContent: nothing }).find('.astryx-tab__end').exists()).toBe(false)
    expect(render({ endContent: zero }).find('.astryx-tab__end').text()).toBe('0')
  })

  it('dropdownMenuGroup 的标题：没内容就不画标题，也不拿它命名这一组', () => {
    const empty = mount(DropdownMenuGroup, { slots: { title: nothing, default: () => 'Row' } })
    expect(empty.find('.astryx-dropdown-menu-section-heading').exists()).toBe(false)
    expect(empty.attributes('aria-labelledby')).toBeUndefined()

    const titled = mount(DropdownMenuGroup, { slots: { title: zero, default: () => 'Row' } })
    const heading = titled.find('.astryx-dropdown-menu-section-heading')
    expect(heading.text()).toBe('0')
    expect(titled.attributes('aria-labelledby')).toBe(heading.attributes('id'))
  })
})
