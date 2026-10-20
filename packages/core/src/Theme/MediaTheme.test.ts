import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { defineTheme } from './defineTheme.js'
import MediaTheme from './MediaTheme.vue'
import Theme from './Theme.vue'
import { useMediaTheme } from './useMediaTheme.js'

const ocean = defineTheme({
  name: 'ocean',
  onDark: { tokens: { '--color-accent': '#90CAF9' } },
})

const Reader = defineComponent({
  setup() {
    const media = useMediaTheme()
    return { mode: media.mode }
  },
  template: '<span class="mode">{{ mode }}</span>',
})

function renderMode(mode: 'dark' | 'light' | 'auto' | 'off', fallback?: 'dark' | 'light') {
  return mount(defineComponent({
    render: () => h('div', { style: { background: 'rgb(10, 19, 23)' } }, [
      h(MediaTheme, { mode, fallback }, () => h('span', { class: 'child' }, 'content')),
    ]),
  }), { attachTo: document.body })
}

describe('media theme', () => {
  it.each(['dark', 'light'] as const)('applies mode=%s verbatim', (mode) => {
    const wrapper = renderMode(mode)
    expect(wrapper.get('.astryx-media-theme').attributes('data-astryx-media')).toBe(mode)
    wrapper.unmount()
  })

  it('keeps its element for mode="off" with no media attribute, so children never remount', () => {
    const wrapper = renderMode('off')
    const element = wrapper.get('.astryx-media-theme')
    expect(element.element.tagName).toBe('DIV')
    expect(element.attributes('data-astryx-media')).toBeUndefined()
    wrapper.unmount()
  })

  it('falls back to dark for an unmeasurable auto surface, and honors an explicit fallback', () => {
    const dark = renderMode('auto')
    expect(dark.get('.astryx-media-theme').attributes('data-astryx-media')).toBe('dark')
    dark.unmount()
    const light = renderMode('auto', 'light')
    expect(light.get('.astryx-media-theme').attributes('data-astryx-media')).toBe('light')
    light.unmount()
  })

  it('ignores fallback when the mode is explicit', () => {
    const wrapper = renderMode('dark', 'light')
    expect(wrapper.get('.astryx-media-theme').attributes('data-astryx-media')).toBe('dark')
    wrapper.unmount()
  })

  it('leaves no probe element behind', () => {
    const wrapper = renderMode('auto')
    expect(wrapper.findAll('span')).toHaveLength(1)
    wrapper.unmount()
  })

  it('keeps the same child element when the surface changes', async () => {
    const background = ref('rgb(10, 19, 23)')
    const wrapper = mount(defineComponent({
      render: () => h('div', { style: { background: background.value } }, [
        h(MediaTheme, { mode: 'auto' }, () => h('span', { class: 'child' }, 'content')),
      ]),
    }), { attachTo: document.body })
    const first = wrapper.get('.child').element
    background.value = 'rgb(255, 255, 255)'
    await nextTick()
    expect(wrapper.get('.child').element).toBe(first)
    wrapper.unmount()
  })

  it('applies the theme onDark tokens inside a dark media theme', () => {
    const wrapper = mount(Theme, {
      props: { theme: ocean },
      slots: {
        default: () => h(MediaTheme, { mode: 'dark' }, () => h(Reader)),
      },
    })

    const media = wrapper.get('[data-astryx-media="dark"]').element as HTMLElement
    expect(media.style.getPropertyValue('--astryx-color-accent')).toBe('#90CAF9')
    expect(wrapper.get('.mode').text()).toBe('dark')
    wrapper.unmount()
  })
})
