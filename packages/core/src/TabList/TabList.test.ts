import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import Tab from './Tab.vue'
import TabList from './TabList.vue'

function mountBound(initial: string) {
  const Host = defineComponent({
    setup() {
      const value = ref(initial)
      return () => h(
        TabList,
        {
          'role': 'tablist',
          'value': value.value,
          'onUpdate:value': (next: string) => {
            value.value = next
          },
        },
        {
          default: () => [
            h(Tab, { value: 'a' }, () => 'Tab A'),
            h(Tab, { value: 'b' }, () => 'Tab B'),
          ],
        },
      )
    },
  })

  return mount(Host)
}

describe('tab-list', () => {
  it('renders tabs with role and aria-selected', () => {
    const wrapper = mount(TabList, {
      props: { role: 'tablist', value: 'b' },
      slots: {
        default: () => [
          h(Tab, { value: 'a' }, () => 'Tab A'),
          h(Tab, { value: 'b' }, () => 'Tab B'),
        ],
      },
    })

    const tabs = wrapper.findAll('[role="tab"]')
    expect(tabs.length).toBe(2)
    expect(tabs[0].attributes('aria-selected')).toBe('false')
    expect(tabs[1].attributes('aria-selected')).toBe('true')
    expect(tabs[1].attributes('tabindex')).toBe('0')
    expect(tabs[0].attributes('tabindex')).toBe('-1')
  })

  it('emits change when a tab is clicked', async () => {
    const wrapper = mount(TabList, {
      props: { role: 'tablist', value: 'a' },
      slots: {
        default: () => [
          h(Tab, { value: 'a' }, () => 'Tab A'),
          h(Tab, { value: 'b' }, () => 'Tab B'),
        ],
      },
    })

    await wrapper.findAll('[role="tab"]')[1].trigger('click')
    expect(wrapper.emitted('update:value')).toBeTruthy()
    expect(wrapper.emitted('update:value')![0]).toEqual(['b'])
    expect(wrapper.emitted('change')![0]).toEqual(['b'])
  })

  it('does not select disabled tabs', async () => {
    const wrapper = mount(TabList, {
      props: { role: 'tablist', value: 'a' },
      slots: {
        default: () => [
          h(Tab, { value: 'a' }, () => 'Tab A'),
          h(Tab, { value: 'b', disabled: true }, () => 'Tab B'),
        ],
      },
    })

    const disabled = wrapper.findAll('[role="tab"]')[1]
    expect(disabled.attributes('disabled')).toBeDefined()
    await disabled.trigger('click')
    expect(wrapper.emitted('update:value')).toBeFalsy()
  })

  it('moves selection with arrow keys', async () => {
    const wrapper = mount(TabList, {
      props: { role: 'tablist', value: 'a' },
      slots: {
        default: () => [
          h(Tab, { value: 'a' }, () => 'Tab A'),
          h(Tab, { value: 'b' }, () => 'Tab B'),
          h(Tab, { value: 'c' }, () => 'Tab C'),
        ],
      },
    })

    const tabs = wrapper.findAll('[role="tab"]')
    await tabs[0].trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:value')![0]).toEqual(['b'])

    await tabs[1].trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:value')![1]).toEqual(['c'])

    await tabs[2].trigger('keydown', { key: 'ArrowLeft' })
    expect(wrapper.emitted('update:value')![2]).toEqual(['b'])
  })

  it('moves the selection when the value prop changes', async () => {
    const wrapper = mount(TabList, {
      props: { role: 'tablist', value: 'a' },
      slots: {
        default: () => [
          h(Tab, { value: 'a' }, () => 'Tab A'),
          h(Tab, { value: 'b' }, () => 'Tab B'),
        ],
      },
    })

    await wrapper.setProps({ value: 'b' })

    const tabs = wrapper.findAll('[role="tab"]')
    expect(tabs[0].attributes('aria-selected')).toBe('false')
    expect(tabs[1].attributes('aria-selected')).toBe('true')
    expect(tabs[1].attributes('tabindex')).toBe('0')
  })

  it('selects the clicked tab when the value is bound', async () => {
    const wrapper = mountBound('a')

    await wrapper.findAll('[role="tab"]')[1].trigger('click')

    const tabs = wrapper.findAll('[role="tab"]')
    expect(tabs[0].attributes('aria-selected')).toBe('false')
    expect(tabs[1].attributes('aria-selected')).toBe('true')
    expect(wrapper.find('.astryx-tab--selected .astryx-tab__label-text').text()).toBe('Tab B')
  })

  it('applies size and layout classes', () => {
    const wrapper = mount(TabList, {
      props: { role: 'tablist', value: 'a', size: 'sm', layout: 'fill', hasDivider: true },
      slots: {
        default: () => h(Tab, { value: 'a' }, () => 'Tab A'),
      },
    })

    expect(wrapper.classes()).toContain('astryx-tab-list--size-sm')
    expect(wrapper.classes()).toContain('astryx-tab-list--layout-fill')
    expect(wrapper.classes()).toContain('astryx-tab-list--has-divider')
    expect(wrapper.find('.astryx-tab--size-sm').exists()).toBe(true)
  })

  it('bleeds inline from isFullBleed or edgeCompensation', () => {
    const slots = { default: () => h(Tab, { value: 'a' }, () => 'Tab A') }

    const bleed = mount(TabList, { props: { value: 'a', isFullBleed: true }, slots })
    expect(bleed.classes()).toContain('astryx-tab-list--full-bleed')

    const canonical = mount(TabList, { props: { value: 'a', edgeCompensation: 'inline' }, slots })
    expect(canonical.classes()).toContain('astryx-tab-list--full-bleed')

    const plain = mount(TabList, { props: { role: 'tablist', value: 'a' }, slots })
    expect(plain.classes()).not.toContain('astryx-tab-list--full-bleed')
  })
})

describe('tab strip role', () => {
  const tabs = () => [
    h(Tab, { value: 'a' }, () => 'Tab A'),
    h(Tab, { value: 'b' }, () => 'Tab B'),
  ]

  it('is a nav landmark with aria-current while role is unset', () => {
    const wrapper = mount(TabList, {
      props: { value: 'b' },
      slots: { default: tabs },
    })

    expect(wrapper.element.tagName).toBe('NAV')
    expect(wrapper.attributes('role')).toBeUndefined()
    const buttons = wrapper.findAll('button')
    expect(buttons[0].attributes('aria-current')).toBeUndefined()
    expect(buttons[1].attributes('aria-current')).toBe('true')
    expect(buttons[1].attributes('aria-selected')).toBeUndefined()
    expect(wrapper.find('[role="tab"]').exists()).toBe(false)
  })

  it('passes any other role through to a plain element', () => {
    const wrapper = mount(TabList, {
      props: { role: 'group', value: 'a' },
      slots: { default: tabs },
    })

    expect(wrapper.element.tagName).toBe('DIV')
    expect(wrapper.attributes('role')).toBe('group')
  })

  it('renders an href tab as a link outside the tabs pattern only', () => {
    const linkTab = [h(Tab, { href: '/home', value: 'home' }, () => 'Home')]

    const nav = mount(TabList, {
      props: { value: 'home' },
      slots: { default: () => linkTab },
    })
    expect(nav.get('a').attributes('href')).toBe('/home')
    expect(nav.get('a').attributes('aria-current')).toBe('true')

    const pattern = mount(TabList, {
      props: { role: 'tablist', value: 'home' },
      slots: { default: () => linkTab },
    })
    expect(pattern.find('a').exists()).toBe(false)
    expect(pattern.get('[role="tab"]').attributes('aria-selected')).toBe('true')
  })

  it('renders the passed link component for a tab with href', () => {
    const RouterLink = defineComponent({
      props: { to: { type: String, default: '' } },
      setup(_props, { slots }) {
        return () => h('a', { 'data-router-link': 'true' }, slots.default?.())
      },
    })
    const wrapper = mount(TabList, {
      props: { value: 'home' },
      slots: {
        default: () => [h(Tab, { as: RouterLink, href: '/home', value: 'home' }, () => 'Home')],
      },
    })

    expect(wrapper.get('[data-router-link="true"]').attributes('href')).toBe('/home')
  })
})

describe('tab content', () => {
  it('shows the icon, the selected icon, and the end content', () => {
    const wrapper = mount(TabList, {
      props: { role: 'tablist', value: 'a' },
      slots: {
        default: () => [
          h(Tab, { value: 'a' }, {
            default: () => 'Tab A',
            endContent: () => h('span', { class: 'count' }, '5'),
            icon: () => h('span', { class: 'plain-icon' }),
            selectedIcon: () => h('span', { class: 'selected-icon' }),
          }),
        ],
      },
    })

    expect(wrapper.find('.astryx-tab__icon .selected-icon').exists()).toBe(true)
    expect(wrapper.find('.astryx-tab__icon .plain-icon').exists()).toBe(false)
    expect(wrapper.get('.astryx-tab__end .count').text()).toBe('5')
  })

  it('falls back to the icon when no selected icon is given', () => {
    const wrapper = mount(Tab, {
      props: { value: 'a' },
      slots: { default: () => 'Tab A', icon: () => h('span', { class: 'plain-icon' }) },
    })

    expect(wrapper.get('.astryx-tab__icon .plain-icon').attributes('class')).toBe('plain-icon')
  })

  it('uses the label prop as text, and the slot wins when both are given', () => {
    const fromProp = mount(Tab, { props: { label: 'From prop', value: 'a' } })
    expect(fromProp.get('.astryx-tab__label-text').text()).toBe('From prop')

    const fromSlot = mount(Tab, {
      props: { label: 'From prop', value: 'a' },
      slots: { default: () => 'From slot' },
    })
    expect(fromSlot.get('.astryx-tab__label-text').text()).toBe('From slot')
  })

  it('hides the label visually and names the tab with it', () => {
    const wrapper = mount(TabList, {
      props: { role: 'tablist', value: 'a' },
      slots: {
        default: () => [
          h(Tab, { isLabelHidden: true, label: 'Home', value: 'a' }, {
            icon: () => h('span', { class: 'box-icon' }),
          }),
        ],
      },
    })

    const tab = wrapper.get('[role="tab"]')
    expect(tab.attributes('aria-label')).toBe('Home')
    expect(tab.classes()).toContain('astryx-tab--label-hidden')
    expect(wrapper.get('.astryx-tab__label').classes()).toContain('astryx-visually-hidden')
    expect(wrapper.find('.astryx-tab__icon .box-icon').exists()).toBe(true)
  })

  it('names the nav landmark "Tabs" unless the caller supplies a label', () => {
    const plain = mount(TabList, { props: { value: 'a' } })
    expect(plain.get('nav').attributes('aria-label')).toBe('Tabs')
    const named = mount(TabList, { props: { value: 'a' }, attrs: { 'aria-label': 'Sections' } })
    expect(named.get('nav').attributes('aria-label')).toBe('Sections')
    const tabs = mount(TabList, { props: { value: 'a', role: 'tablist' } })
    expect(tabs.get('[role="tablist"]').attributes('aria-label')).toBeUndefined()
  })
})
