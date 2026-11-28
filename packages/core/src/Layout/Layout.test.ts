import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { useResizable } from '../composables/useResizable.js'
import ResizeHandle from '../Resizable/ResizeHandle.vue'
import { provideLayoutContainer } from './context.js'
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

  it('takes its width from the resizable props and ignores width', () => {
    const panel = mount(LayoutPanel, {
      props: {
        width: 320,
        resizable: {
          _size: 248,
          _direction: 'horizontal',
          _isCollapsed: false,
          _minSizePx: 180,
          _maxSizePx: 420,
        },
      },
    })

    expect((panel.element as HTMLElement).style.width).toBe('248px')
    panel.unmount()
  })

  it('collapses to zero width when the hook reports a collapsed region', () => {
    const panel = mount(LayoutPanel, {
      props: {
        resizable: { _size: 0, _direction: 'horizontal', _isCollapsed: true },
      },
    })

    expect((panel.element as HTMLElement).style.width).toBe('0px')
    panel.unmount()
  })

  it('takes the whole useResizable() result and hides a panel that has no width', async () => {
    const Host = defineComponent({
      setup() {
        const region = useResizable({ defaultSize: 200, collapsible: true })
        return { region }
      },
      render() {
        return h(Layout, null, {
          start: () => [
            h(LayoutPanel, { resizable: this.region }, () => h('button', { id: 'inside' }, 'Inside')),
            h(ResizeHandle, { resizable: this.region }),
          ],
          default: () => h(LayoutContent, null, () => 'Body'),
        })
      },
    })
    const wrapper = mount(Host, { attachTo: document.body })
    const panel = wrapper.get('.astryx-layout-panel')
    expect((panel.element as HTMLElement).style.width).toBe('200px')
    expect(panel.attributes('inert')).toBeUndefined()
    ;(wrapper.get('#inside').element as HTMLElement).focus()
    wrapper.vm.region.collapse()
    await nextTick()
    await nextTick()
    expect((panel.element as HTMLElement).style.width).toBe('0px')
    expect(panel.attributes('data-zero-width')).toBe('true')
    expect(panel.attributes('data-scrollable')).toBeUndefined()
    expect(panel.attributes('inert')).toBeDefined()
    expect(panel.attributes('aria-hidden')).toBe('true')
    expect(document.activeElement).toBe(wrapper.get('[role="separator"]').element)
    wrapper.vm.region.expand()
    await nextTick()
    expect(panel.attributes('inert')).toBeUndefined()
    wrapper.unmount()
  })

  it('treats width 0 as no space and no scrolling, with or without a hook', () => {
    const panel = mount(LayoutPanel, { props: { width: 0, hasDivider: false } })
    expect(panel.attributes('data-zero-width')).toBe('true')
    expect(panel.attributes('data-collapse')).toBeUndefined()
    expect(panel.attributes('data-scrollable')).toBeUndefined()
    panel.unmount()
  })

  it('透传属性落在根元素上，组件自己管的 data-height 优先', async () => {
    const onClick = vi.fn()
    const wrapper = mount(Layout, {
      attrs: { 'aria-label': 'Records workspace', 'id': 'records-layout', 'data-testid': 'layout-root', 'data-zone': 'admin', 'data-height': 'auto', 'onClick': onClick },
      slots: { default: () => h('div', 'c') },
    })
    expect(wrapper.attributes('aria-label')).toBe('Records workspace')
    expect(wrapper.attributes('id')).toBe('records-layout')
    expect(wrapper.attributes('data-testid')).toBe('layout-root')
    expect(wrapper.attributes('data-zone')).toBe('admin')
    expect(wrapper.attributes('data-height')).toBe('fill')
    await wrapper.trigger('click')
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('reflects the container a card or dialog names on its header, content and footer', () => {
    const Host = defineComponent({
      setup(_, { slots }) {
        provideLayoutContainer('dialog')
        return () => h('div', slots.default?.())
      },
    })
    const wrapper = mount(Host, {
      slots: {
        default: () => h(Layout, null, {
          header: () => h(LayoutHeader, null, () => 'Title'),
          default: () => h(LayoutContent, null, () => 'Body'),
          footer: () => h(LayoutFooter, null, () => 'Save'),
        }),
      },
    })

    for (const part of ['header', 'content', 'footer'])
      expect(wrapper.get(`.astryx-layout-${part}`).attributes('data-container')).toBe('dialog')
  })

  it('lays out a region that renders nothing like an omitted one', () => {
    const empty = mount(Layout, {
      slots: {
        header: () => [],
        start: () => h(LayoutPanel, { width: 100 }, () => 'Nav'),
        end: () => null,
        footer: () => '  ',
        default: () => h(LayoutContent, null, () => 'Body'),
      },
    })
    const omitted = mount(Layout, {
      slots: {
        start: () => h(LayoutPanel, { width: 100 }, () => 'Nav'),
        default: () => h(LayoutContent, null, () => 'Body'),
      },
    })
    const attrsOf = (wrapper: typeof empty) => wrapper.get('.astryx-layout-content').attributes()
    expect(attrsOf(empty)).toEqual(attrsOf(omitted))
    expect(empty.get('.astryx-layout__inner').attributes('data-panels')).toBe('start')
    expect(empty.find('.astryx-layout-header').exists()).toBe(false)
  })

  it('treats a header whose component is removed by v-if as omitted', () => {
    const Host = defineComponent({
      components: { Layout, LayoutContent, LayoutHeader },
      template: '<Layout><template #header><LayoutHeader v-if="false">T</LayoutHeader></template><LayoutContent>Body</LayoutContent></Layout>',
    })
    const wrapper = mount(Host)
    expect(wrapper.get('.astryx-layout-content').attributes('data-edge-header')).toBe('true')
  })
})
