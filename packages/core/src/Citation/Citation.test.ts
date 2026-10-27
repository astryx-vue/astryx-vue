import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import { provideAstryxLocale } from '../locale/index.js'
import Citation from './Citation.vue'

describe('citation', () => {
  it('renders a labelled link that opens in a new tab', () => {
    const wrapper = mount(Citation, {
      props: {
        number: 2,
        source: { title: 'Release notes', url: 'https://example.com/notes', src: '/favicon.png' },
      },
    })

    const link = wrapper.get('a.astryx-citation')
    expect(link.attributes('href')).toBe('https://example.com/notes')
    expect(link.attributes('target')).toBe('_blank')
    expect(link.attributes('rel')).toBe('noopener noreferrer')
    expect(link.attributes('role')).toBe('doc-noteref')
    expect(link.attributes('data-variant')).toBe('label')
    expect(link.attributes('aria-label')).toBe('Citation 2: Release notes')
    expect(link.text()).toContain('Release notes')
    expect(wrapper.get('img').attributes('src')).toBe('/favicon.png')
    expect(wrapper.get('img').attributes('alt')).toBe('')
  })

  it('renders a number without a link when the source has no url', () => {
    const wrapper = mount(Citation, {
      props: { number: 3, variant: 'number', source: { title: 'Notes' } },
    })

    expect(wrapper.find('a').exists()).toBe(false)
    const chip = wrapper.get('span.astryx-citation')
    expect(chip.attributes('role')).toBe('group')
    expect(chip.attributes('data-variant')).toBe('number')
    expect(chip.text()).toBe('3')
    expect(chip.attributes('aria-label')).toBe('Citation 3: Notes')
  })

  it('treats a css class icon differently from an image url', () => {
    const wrapper = mount(Citation, {
      props: {
        number: 1,
        source: { title: 'Docs', icon: 'i-lucide-book', src: '/ignored.png' },
      },
    })

    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.find('.astryx-icon').exists()).toBe(true)
  })

  it('localizes the accessible name and falls back to the number', () => {
    const wrapper = mount(defineComponent({
      setup() {
        provideAstryxLocale('zh-CN')
        return () => h(Citation, { number: 4, source: {} })
      },
    }))

    expect(wrapper.get('.astryx-citation').attributes('aria-label')).toBe('引用 4：4')
    expect(wrapper.get('.astryx-citation').attributes('role')).toBe('group')
    expect(wrapper.text()).toContain('4')
  })

  it('does not turn a script url into a link', () => {
    const wrapper = mount(Citation, {
      props: {
        number: 1,
        source: { title: 'Bad', url: 'javascript:alert(1)' },
      },
    })

    expect(wrapper.find('a').exists()).toBe(false)
    expect(wrapper.get('span.astryx-citation').attributes('role')).toBe('group')
  })
})
