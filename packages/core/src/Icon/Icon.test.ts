import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, markRaw, nextTick, ref } from 'vue'
import { ICON_DEFAULT_SIZE_KEY, provideIconSize } from './context.js'
import { ICON_GLYPHS, iconGlyphSlug } from './glyphs.js'
import Icon from './Icon.vue'
import { addIcon, resetIcons } from './registry.js'

describe('icon', () => {
  beforeEach(() => {
    resetIcons()
  })

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
      'arrow-up',
      'arrow-down',
      'close',
      'funnel',
      'image',
      'stop',
      'microphone',
      'warning',
      'error',
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
    expect(icon.classes()).not.toContain('i-carbon-search')
    const external = icon.find('.astryx-icon__external')
    expect(external.exists()).toBe(true)
    expect(external.classes()).toContain('i-carbon-search')
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

  it('draws a registered collection icon from its name and hides it', () => {
    addIcon('carbon:settings', { body: '<path d="M1 2"/>', width: 32, height: 32 })
    const wrapper = mount(Icon, { props: { name: 'carbon:settings' } })
    const icon = wrapper.find('.astryx-icon')
    const svg = icon.find('svg')

    expect(svg.exists()).toBe(true)
    expect(svg.attributes('viewBox')).toBe('0 0 32 32')
    expect(svg.html()).toContain('d="M1 2"')
    expect(icon.attributes('data-size')).toBeUndefined()
    expect(icon.attributes('aria-hidden')).toBe('true')
    expect(icon.attributes('data-color')).toBe('inherit')
  })

  it('accepts collection-icon when that collection is registered', () => {
    addIcon('carbon:settings', { body: '<path d="M1 2"/>', width: 16, height: 16 })
    const wrapper = mount(Icon, { props: { name: 'carbon-settings', size: 'sm', color: 'accent' } })
    const icon = wrapper.find('.astryx-icon')

    expect(icon.find('svg').exists()).toBe(true)
    expect(icon.attributes('data-size')).toBe('sm')
    expect(icon.attributes('data-color')).toBe('accent')
  })

  it('names a standalone collection icon', () => {
    addIcon('carbon:checkmark', { body: '<path d="M0 0"/>' })
    const wrapper = mount(Icon, { props: { name: 'carbon:checkmark', label: 'Saved' } })
    const icon = wrapper.find('.astryx-icon')

    expect(icon.attributes('role')).toBe('img')
    expect(icon.attributes('aria-label')).toBe('Saved')
    expect(icon.find('svg').attributes('aria-hidden')).toBe('true')
  })

  it('leaves the box empty and warns when the name is not registered', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mount(Icon, { props: { name: 'carbon:missing', icon: 'check' } })

    expect(wrapper.find('svg').exists()).toBe(false)
    expect(wrapper.find('.astryx-icon__glyph').exists()).toBe(false)
    expect(wrapper.find('.astryx-icon').attributes('data-size')).toBeUndefined()
    expect(warn).toHaveBeenCalled()
    warn.mockRestore()
  })

  it('gives each copy of an icon its own id prefix', () => {
    addIcon('carbon:logo', { body: '<path id="mark" d="M0 0"/>' })
    const Pair = defineComponent({
      setup() {
        return () => h('div', [
          h(Icon, { name: 'carbon:logo' }),
          h(Icon, { name: 'carbon:logo' }),
        ])
      },
    })
    const wrapper = mount(Pair)
    const ids = wrapper.findAll('path').map(path => path.attributes('id'))

    expect(ids).toHaveLength(2)
    expect(ids[0]).toMatch(/mark$/)
    expect(ids[1]).toMatch(/mark$/)
    expect(ids[0]).not.toBe(ids[1])
  })

  it('renders the box when it is given no artwork, so a class can paint it', () => {
    const wrapper = mount(Icon)

    const icon = wrapper.find('.astryx-icon')
    expect(icon.exists()).toBe(true)
    expect(icon.attributes('aria-hidden')).toBe('true')
    expect(icon.element.textContent).toBe('')
  })
})
