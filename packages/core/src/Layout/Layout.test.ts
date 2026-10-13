import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import Layout from './Layout.vue'
import LayoutContent from './LayoutContent.vue'
import LayoutFooter from './LayoutFooter.vue'
import LayoutHeader from './LayoutHeader.vue'
import LayoutPanel from './LayoutPanel.vue'

describe('layout', () => {
  it('places header, start, content, and footer and keeps the divider off until asked', () => {
    const wrapper = mount(Layout, {
      slots: {
        header: () => h(LayoutHeader, null, () => 'Title'),
        start: () => h(LayoutPanel, { width: 140, hasDivider: true, role: 'navigation' }, () => 'Nav'),
        default: () => h(LayoutContent, { role: 'main' }, () => 'Body'),
        footer: () => h(LayoutFooter, { hasDivider: true }, () => 'Save'),
      },
    })

    expect(wrapper.attributes('data-height')).toBe('fill')
    expect(wrapper.get('.astryx-layout-header').attributes('data-divider')).toBeUndefined()
    expect(wrapper.get('.astryx-layout-footer').attributes('data-divider')).toBe('true')
    const panel = wrapper.get('.astryx-layout-panel')
    expect(panel.attributes('data-area')).toBe('start')
    expect(panel.attributes('data-divider')).toBe('true')
    expect((panel.element as HTMLElement).style.width).toBe('140px')
    expect(wrapper.get('.astryx-layout-content').attributes('role')).toBe('main')
  })

  it('uses the layout default for a header that does not set its own divider', () => {
    const wrapper = mount(Layout, {
      props: { defaultHasDividers: true, contentWidth: 360, height: 'auto' },
      slots: {
        header: () => h(LayoutHeader, null, () => 'Centered'),
        default: () => h(LayoutContent, null, () => 'Form'),
      },
    })

    expect(wrapper.attributes('data-height')).toBe('auto')
    expect(wrapper.get('.astryx-layout-header').attributes('data-divider')).toBe('true')
    const inner = wrapper.get('.astryx-layout__inner')
    expect(inner.attributes('data-width-mode')).toBe('internal')
    expect((inner.element as HTMLElement).style.getPropertyValue('--layout-content-width')).toBe('360px')
    expect(wrapper.get('.astryx-layout-content').attributes('data-panels')).toBe('none')
  })

  it('treats a percentage content width as constrained', () => {
    const wrapper = mount(Layout, {
      props: { contentWidth: '50%' },
      slots: { default: () => h(LayoutContent, null, () => 'Half') },
    })

    const inner = wrapper.get('.astryx-layout__inner')
    expect(inner.attributes('data-width-mode')).toBe('constrained')
    expect((inner.element as HTMLElement).style.getPropertyValue('--layout-alignment-width')).toBe('')
  })

  it('does not collapse a full-bleed panel', () => {
    const wrapper = mount(Layout, {
      slots: {
        end: () => h(LayoutPanel, { padding: 0 }, () => 'Details'),
        default: () => h(LayoutContent, { padding: 0 }, () => 'Bleed'),
      },
    })

    const panel = wrapper.get('.astryx-layout-panel')
    expect(panel.attributes('data-area')).toBe('end')
    expect(panel.attributes('data-collapse')).toBeUndefined()
    expect(panel.attributes('data-bleed')).toBe('true')
    expect(wrapper.get('.astryx-layout-content').attributes('data-bleed')).toBe('true')
  })
})
