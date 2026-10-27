import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import Banner from '../Banner/Banner.vue'
import FieldInfoTip from '../Field/FieldInfoTip.vue'
import TextArea from '../TextArea/TextArea.vue'
import { addIcon, resetIcons } from './registry.js'

describe('status icons go through Icon', () => {
  beforeEach(() => resetIcons())

  it('banner draws core\'s filled artwork when no icon table is registered', () => {
    const wrapper = mount(Banner, { props: { status: 'warning', title: 'T' } })
    const icon = wrapper.get('.astryx-banner-icon .astryx-icon')
    expect(icon.attributes('data-size')).toBe('md')
    expect(icon.attributes('data-color')).toBe('warning')
    expect(icon.get('.astryx-icon__glyph').classes()).toContain('astryx-icon--warning')
  })

  it('banner uses accent colour for info', () => {
    const wrapper = mount(Banner, { props: { status: 'info', title: 'T' } })
    expect(wrapper.get('.astryx-banner-icon .astryx-icon').attributes('data-color')).toBe('accent')
  })

  it('banner draws the registered lucide drawing when the table is there', () => {
    addIcon('lucide:triangle-alert', { body: '<path d="M1"/>', width: 24, height: 24 })
    const wrapper = mount(Banner, { props: { status: 'warning', title: 'T' } })
    expect(wrapper.find('.astryx-banner-icon .astryx-icon__svg').exists()).toBe(true)
    expect(wrapper.find('.astryx-banner-icon .astryx-icon__glyph').exists()).toBe(false)
  })

  it('info tip draws its glyph through Icon', () => {
    const wrapper = mount(FieldInfoTip, { props: { text: 'Hint', type: 'error' } })
    expect(wrapper.get('.astryx-icon__glyph').classes()).toContain('astryx-icon--error')
  })

  it('text area shows a warning glyph only when over the limit', async () => {
    const wrapper = mount(TextArea, { props: { label: 'L', maxlength: 2, modelValue: 'ab' } })
    expect(wrapper.find('.astryx-text-area-count .astryx-icon').exists()).toBe(false)
    await wrapper.setProps({ modelValue: 'abc' })
    expect(wrapper.get('.astryx-text-area-count .astryx-icon__glyph').classes()).toContain('astryx-icon--warning')
  })
})
