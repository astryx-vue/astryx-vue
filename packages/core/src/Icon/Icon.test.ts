import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, markRaw, nextTick, ref } from 'vue'
import { ICON_DEFAULT_SIZE_KEY, provideIconSize } from './context.js'
import { ICON_GLYPHS, iconGlyphSlug } from './glyphs.js'
import Icon from './Icon.vue'

describe('icon', () => {
  it('renders the built-in artwork for a semantic name', () => {
    const wrapper = mount(Icon, { props: { icon: 'chevronDown' } })

    const icon = wrapper.find('.astryx-icon')
    expect(icon.exists()).toBe(true)
    expect(icon.element.tagName).toBe('SPAN')

    const glyph = icon.find('.astryx-icon__glyph')
    expect(glyph.classes()).toContain('astryx-icon--chevron-down')
    expect(icon.find('svg').exists()).toBe(false)
  })

  it('maps every built-in name to the class the stylesheet declares', () => {
    const slugs = ICON_GLYPHS.map(iconGlyphSlug)

    expect(slugs).toEqual([
      'chevron-down',
      'chevron-left',
      'chevron-right',
      'check',
      'more-horizontal',
      'copy',
      'calendar',
      'clock',
      'upload',
      'close',
    ])
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('falls back to md when no size is given, and lets an explicit size win', async () => {
    const wrapper = mount(Icon, { props: { icon: 'check' } })
    expect(wrapper.find('.astryx-icon').attributes('data-size')).toBe('md')

    await wrapper.setProps({ size: 'xsm' })
    expect(wrapper.find('.astryx-icon').attributes('data-size')).toBe('xsm')
  })

  it('inherits the size an owning component provides, and follows it when it changes', async () => {
    const size = ref<'lg' | 'sm'>('lg')
    const Owner = defineComponent({
      setup() {
        provideIconSize(size)
        return () => h(Icon, { icon: 'check' })
      },
    })

    const wrapper = mount(Owner)
    expect(wrapper.find('.astryx-icon').attributes('data-size')).toBe('lg')

    size.value = 'sm'
    await nextTick()
    expect(wrapper.find('.astryx-icon').attributes('data-size')).toBe('sm')
  })

  it('prefers an explicit size over the inherited one', () => {
    const wrapper = mount(Icon, {
      props: { icon: 'check', size: 'sm' },
      global: { provide: { [ICON_DEFAULT_SIZE_KEY]: ref('lg') } },
    })

    expect(wrapper.find('.astryx-icon').attributes('data-size')).toBe('sm')
  })

  it('inherits the surrounding color by default', () => {
    const wrapper = mount(Icon, { props: { icon: 'copy' } })
    expect(wrapper.find('.astryx-icon').attributes('data-color')).toBe('inherit')
  })

  it('exposes the color variant it was given', () => {
    const wrapper = mount(Icon, { props: { icon: 'copy', color: 'warning' } })
    expect(wrapper.find('.astryx-icon').attributes('data-color')).toBe('warning')
  })

  it('hides a decorative icon from assistive technology', () => {
    const wrapper = mount(Icon, { props: { icon: 'moreHorizontal' } })

    const icon = wrapper.find('.astryx-icon')
    expect(icon.attributes('aria-hidden')).toBe('true')
    expect(icon.attributes('role')).toBeUndefined()
    expect(icon.attributes('aria-label')).toBeUndefined()
  })

  it('names a meaningful icon and drops the decorative hiding', () => {
    const wrapper = mount(Icon, { props: { icon: 'check', label: 'Completed' } })

    const icon = wrapper.find('.astryx-icon')
    expect(icon.attributes('role')).toBe('img')
    expect(icon.attributes('aria-label')).toBe('Completed')
    expect(icon.attributes('aria-hidden')).toBeUndefined()
  })

  it('treats an empty label as decorative', () => {
    const wrapper = mount(Icon, { props: { icon: 'check', label: '' } })

    const icon = wrapper.find('.astryx-icon')
    expect(icon.attributes('aria-hidden')).toBe('true')
    expect(icon.attributes('role')).toBeUndefined()
  })

  it('takes a string it does not ship as the CSS icon class to apply', () => {
    const wrapper = mount(Icon, { props: { icon: 'i-carbon-search' } })

    const icon = wrapper.find('.astryx-icon')
    expect(icon.exists()).toBe(true)
    expect(icon.classes()).toContain('i-carbon-search')
    expect(icon.find('.astryx-icon__glyph').exists()).toBe(false)
    expect(icon.attributes('data-size')).toBe('md')
  })

  it('renders an icon component passed through the prop', () => {
    const Custom = defineComponent({
      name: 'CustomIcon',
      setup() {
        return () => h('svg', { class: 'custom-icon', viewBox: '0 0 24 24' })
      },
    })

    const wrapper = mount(Icon, { props: { icon: markRaw(Custom) as never } })
    expect(wrapper.find('svg.custom-icon').exists()).toBe(true)
    expect(wrapper.find('.astryx-icon__glyph').exists()).toBe(false)
  })

  it('renders artwork from the default slot', () => {
    const wrapper = mount(Icon, {
      slots: { default: '<svg class="slot-icon" viewBox="0 0 24 24" />' },
    })

    expect(wrapper.find('.astryx-icon').exists()).toBe(true)
    expect(wrapper.find('svg.slot-icon').exists()).toBe(true)
  })

  it('renders the box when it is given no artwork, so a class can paint it', () => {
    const wrapper = mount(Icon)

    const icon = wrapper.find('.astryx-icon')
    expect(icon.exists()).toBe(true)
    expect(icon.attributes('aria-hidden')).toBe('true')
    expect(icon.element.textContent).toBe('')
  })
})
