import type { BannerStatus } from './types.js'
import { renderToString } from '@vue/server-renderer'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { createSSRApp, defineComponent, h, nextTick, ref } from 'vue'
import { provideAstryxLocale } from '../locale/index.js'
import Banner from './Banner.vue'

enableAutoUnmount(afterEach)
afterEach(() => {
  document.body.innerHTML = ''
})

describe('banner', () => {
  it.each<BannerStatus>(['info', 'success', 'error', 'warning'])('does not invent a live role for %s', (status) => {
    const wrapper = mount(Banner, { props: { status, title: 'Update', description: 'Please review the details.' } })
    expect(wrapper.attributes('role')).toBeUndefined()
    expect(wrapper.attributes('aria-live')).toBeUndefined()
    expect(wrapper.classes()).toContain('astryx-banner-frame')
    expect(wrapper.get('.astryx-banner').attributes('data-status')).toBe(status)
    expect(wrapper.text()).toContain('Please review the details.')
    expect(wrapper.get('.astryx-banner-icon').attributes('aria-hidden')).toBe('true')
  })

  it('keeps an explicit role the caller asked for', () => {
    const wrapper = mount(Banner, { props: { status: 'error', title: 'Failed' }, attrs: { role: 'alert' } })
    expect(wrapper.attributes('role')).toBe('alert')
  })

  it('names the dismiss control after the banner, and localizes both surfaces', () => {
    const english = mount(Banner, { props: { status: 'success', title: 'Saved', isDismissable: true } })
    const button = english.get('button')
    expect(button.attributes('aria-label')).toBe('Dismiss Saved')
    expect(button.attributes('aria-describedby')).toBeTruthy()

    const Host = defineComponent({
      components: { Banner },
      setup() {
        provideAstryxLocale('zh-CN')
        return () => h(Banner, { status: 'info', title: '维护', isDismissable: true })
      },
    })
    const chinese = mount(Host)
    expect(chinese.get('button').attributes('aria-label')).toBe('关闭“维护”')
  })

  it('leaves an unknown status without a status fill or a default glyph', () => {
    const wrapper = mount(Banner, { props: { status: 'neutral' as BannerStatus, title: 'Note' } })
    expect(wrapper.get('.astryx-banner').attributes('data-status')).toBeUndefined()
    expect(wrapper.find('.astryx-field-icon').exists()).toBe(false)
  })

  it('starts closed and connects the disclosure to its content when expanded', async () => {
    const wrapper = mount(Banner, { props: { status: 'info', title: 'Update' }, slots: { default: '<p>Details</p>' } })
    expect(wrapper.find('.astryx-banner-content').exists()).toBe(false)
    expect(wrapper.get('button').attributes('aria-expanded')).toBe('false')
    expect(wrapper.get('button').attributes('aria-controls')).toBeUndefined()
    await wrapper.get('button').trigger('click')
    expect(wrapper.get('.astryx-banner-content').text()).toBe('Details')
    expect(wrapper.get('button').attributes('aria-controls')).toBe(wrapper.get('.astryx-banner-content').attributes('id'))
    expect(wrapper.emitted('update:isOpen')).toEqual([[true]])
    await wrapper.get('button').trigger('click')
    expect(wrapper.find('.astryx-banner-content').exists()).toBe(false)
  })

  it('supports default-open and permanently-visible content without an unnecessary toggle', () => {
    const opened = mount(Banner, { props: { status: 'info', title: 'Update', defaultIsOpen: true }, slots: { default: '<p>Open</p>' } })
    expect(opened.get('.astryx-banner-content').text()).toBe('Open')
    const fixed = mount(Banner, { props: { status: 'error', title: 'Errors', collapsible: false }, slots: { default: '<p>Required details</p>' } })
    expect(fixed.find('button').exists()).toBe(false)
    expect(fixed.get('.astryx-banner-content').text()).toBe('Required details')
  })

  it('respects a controlled isOpen value and emits requests without overriding the parent', async () => {
    const wrapper = mount(Banner, { props: { 'status': 'info', 'title': 'Update', 'isOpen': false, 'onUpdate:isOpen': () => {} }, slots: { default: '<p>Details</p>' } })
    await wrapper.get('button').trigger('click')
    expect(wrapper.emitted('update:isOpen')).toEqual([[true]])
    expect(wrapper.find('.astryx-banner-content').exists()).toBe(false)
    await wrapper.setProps({ isOpen: true })
    expect(wrapper.get('.astryx-banner-content').text()).toBe('Details')
  })

  it('dismisses itself and reports dismissal even without an external handler', async () => {
    const wrapper = mount(Banner, { props: { status: 'success', title: 'Saved', isDismissable: true } })
    expect(wrapper.get('button').attributes('aria-label')).toBe('Dismiss Saved')
    await wrapper.get('button').trigger('click')
    expect(wrapper.find('.astryx-banner').exists()).toBe(false)
    expect(wrapper.emitted('dismiss')).toHaveLength(1)
  })

  it('restores the previous focus target on dismissal', async () => {
    const opener = document.createElement('button')
    document.body.append(opener)
    opener.focus()
    const wrapper = mount(Banner, { attachTo: document.body, props: { status: 'info', title: 'Update', isDismissable: true } })
    wrapper.get('button').element.focus()
    await nextTick()
    expect(document.activeElement).toBe(wrapper.get('button').element)
    await wrapper.get('button').trigger('click')
    expect(document.activeElement).toBe(opener)
  })

  it('returns focus to the disclosure when a parent closes focused content', async () => {
    const wrapper = mount(Banner, { attachTo: document.body, props: { status: 'info', title: 'Update', isOpen: true }, slots: { default: '<a href="#details">Details</a>' } })
    wrapper.get('a').element.focus()
    await wrapper.setProps({ isOpen: false })
    expect(document.activeElement).toBe(wrapper.get('button').element)
  })

  it('supports rich slots, translated controls and section styling', async () => {
    const wrapper = mount(Banner, {
      props: { status: 'warning', title: 'Settings', container: 'section', elevation: 'low', isDismissable: true, expandLabel: '展开', collapseLabel: '收起', dismissLabel: '关闭设置提示' },
      slots: { title: '<strong>Settings changed</strong>', description: '<div>Review changes</div>', icon: '<svg class="custom-icon" />', end: '<button>Review</button>', default: '<ul><li>Details</li></ul>' },
    })
    expect(wrapper.get('.astryx-banner-title strong').text()).toBe('Settings changed')
    expect(wrapper.find('.custom-icon').exists()).toBe(true)
    expect(wrapper.attributes('data-container')).toBe('section')
    await wrapper.get('button[aria-label="展开"]').trigger('click')
    expect(wrapper.find('button[aria-label="收起"]').exists()).toBe(true)
    expect(wrapper.find('button[aria-label="关闭设置提示"]').exists()).toBe(true)
  })

  describe('empty slots', () => {
    it.each([
      ['null', () => null],
      ['false', () => false],
      ['empty string', () => ''],
      ['empty array', () => []],
    ])('does not offer expand or a content region when the default slot returns %s', (_label, slot) => {
      const wrapper = mount(Banner, { props: { status: 'info', title: 'Heads up' }, slots: { default: slot } })
      expect(wrapper.find('button').exists()).toBe(false)
      expect(wrapper.find('.astryx-banner-content').exists()).toBe(false)
    })

    it.each([
      ['null', () => null],
      ['false', () => false],
      ['empty string', () => ''],
      ['empty array', () => []],
    ])('leaves the header alone when collapsible is off and the slot returns %s', (_label, slot) => {
      const wrapper = mount(Banner, { props: { status: 'info', title: 'Heads up', collapsible: false }, slots: { default: slot } })
      expect(wrapper.find('button').exists()).toBe(false)
      expect(wrapper.find('.astryx-banner-content').exists()).toBe(false)
      expect(wrapper.element.children).toHaveLength(1)
    })

    it('still offers expand for a slot that renders a node', () => {
      const wrapper = mount(Banner, { props: { status: 'info', title: 'Heads up' }, slots: { default: '<p>Detail</p>' } })
      expect(wrapper.get('button').attributes('aria-label')).toBe('Expand')
      expect(wrapper.find('.astryx-banner-content').exists()).toBe(false)
    })

    it('does not render a description for an empty string', () => {
      const wrapper = mount(Banner, { props: { status: 'info', title: 'Heads up', description: '' } })
      expect(wrapper.find('.astryx-banner-description').exists()).toBe(false)
    })

    it('treats a v-if that is false as empty, then shows expand once it renders', async () => {
      const Host = defineComponent({
        components: { Banner },
        setup() {
          const show = ref(false)
          return { show }
        },
        template: `
          <button type="button" class="reveal" @click="show = true">Reveal</button>
          <Banner status="info" title="Heads up">
            <span v-if="false">Hidden</span>
            <p v-if="show">Detail</p>
          </Banner>
        `,
      })
      const wrapper = mount(Host)
      expect(wrapper.find('.astryx-banner-content').exists()).toBe(false)
      expect(wrapper.find('button[aria-expanded]').exists()).toBe(false)
      await wrapper.get('.reveal').trigger('click')
      expect(wrapper.get('button[aria-expanded]').attributes('aria-expanded')).toBe('false')
      expect(wrapper.find('.astryx-banner-content').exists()).toBe(false)
    })

    it('does not leave an empty content region when a false v-if is pinned open', () => {
      const Host = defineComponent({
        components: { Banner },
        template: `
          <Banner status="info" title="Heads up" :collapsible="false">
            <span v-if="false">Hidden</span>
          </Banner>
        `,
      })
      const wrapper = mount(Host)
      expect(wrapper.find('button').exists()).toBe(false)
      expect(wrapper.find('.astryx-banner-content').exists()).toBe(false)
      expect(wrapper.get('.astryx-banner-frame').element.children).toHaveLength(1)
    })
  })

  it('renders open content and stable disclosure associations during SSR', async () => {
    const html = await renderToString(createSSRApp({ render: () => h(Banner, { status: 'info', title: 'Details', defaultIsOpen: true }, () => h('p', 'Server-rendered details')) }))
    expect(html).toContain('Server-rendered details')
    expect(html).toContain('aria-expanded="true"')
    const id = html.match(/aria-controls="([^"]+)"/)?.[1]
    expect(html).toContain(`id="${id}"`)
  })
})
