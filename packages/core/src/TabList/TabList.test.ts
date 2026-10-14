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
      props: { value: 'b' },
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
      props: { value: 'a' },
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
      props: { value: 'a' },
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
      props: { value: 'a' },
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
      props: { value: 'a' },
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
    expect(wrapper.find('.astryx-tab--selected').text()).toBe('Tab B')
  })

  it('applies size and layout classes', () => {
    const wrapper = mount(TabList, {
      props: { value: 'a', size: 'sm', layout: 'fill', hasDivider: true },
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

    const plain = mount(TabList, { props: { value: 'a' }, slots })
    expect(plain.classes()).not.toContain('astryx-tab-list--full-bleed')
  })
})
