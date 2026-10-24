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

  it('re-measures an auto surface when the theme color mode switches', async () => {
    const mode = ref<'light' | 'dark'>('light')
    // Token values are per mode here, standing in for the `light-dark()` pairs
    // a real theme writes. They sit one level above the measured surface so the
    // surface's own style never changes: only the mode switch can move the
    // result.
    const tokensFor = (current: 'light' | 'dark') => ({
      '--astryx-color-text-primary': current === 'dark' ? '#fafafa' : '#171717',
      '--astryx-color-on-dark': '#ffffff',
      '--astryx-color-on-light': '#171717',
    })
    const wrapper = mount(defineComponent({
      render: () => h(Theme, { theme: ocean, mode: mode.value }, {
        default: () => h('div', { style: tokensFor(mode.value) }, [
          h('div', { style: { background: 'rgb(10, 19, 23)' } }, [
            h(MediaTheme, { mode: 'auto' } as never, () => h('span', { class: 'child' }, 'content')),
          ]),
        ]),
      }),
    }), { attachTo: document.body })

    expect(wrapper.get('.astryx-media-theme').attributes('data-astryx-media')).toBe('dark')
    mode.value = 'dark'
    await nextTick()
    await nextTick()
    expect(wrapper.get('.astryx-media-theme').attributes('data-astryx-media')).toBeUndefined()
    mode.value = 'light'
    await nextTick()
    await nextTick()
    expect(wrapper.get('.astryx-media-theme').attributes('data-astryx-media')).toBe('dark')
    wrapper.unmount()
  })

  it('re-measures on a color mode switch even when nothing re-renders', async () => {
    // The OS color scheme is the only input that moves. No component props or
    // slots change, so only the watcher on the effective mode can trigger a
    // new measurement.
    const original = window.matchMedia
    const heard: { listener: ((event: MediaQueryListEvent) => void) | null } = { listener: null }
    window.matchMedia = ((query: string) => ({
      matches: false,
      media: query,
      addEventListener: (_type: string, callback: (event: MediaQueryListEvent) => void) => {
        heard.listener = callback
      },
      removeEventListener: () => {
        heard.listener = null
      },
    })) as unknown as typeof window.matchMedia

    const wrapper = mount(defineComponent({
      render: () => h('div', {
        class: 'ambient',
        style: {
          '--astryx-color-text-primary': '#171717',
          '--astryx-color-on-dark': '#ffffff',
          '--astryx-color-on-light': '#171717',
        },
      }, [
        h('div', { style: { background: 'rgb(10, 19, 23)' } }, [
          h(MediaTheme, { mode: 'auto' } as never, () => h('span', { class: 'child' }, 'content')),
        ]),
      ]),
    }), { attachTo: document.body })

    try {
      expect(wrapper.get('.astryx-media-theme').attributes('data-astryx-media')).toBe('dark')
      // Stands in for `light-dark()` flipping the ambient text color.
      const ambient = wrapper.get('.ambient').element as HTMLElement
      ambient.style.setProperty('--astryx-color-text-primary', '#fafafa')
      heard.listener?.({ matches: true } as MediaQueryListEvent)
      await nextTick()
      await nextTick()
      expect(wrapper.get('.astryx-media-theme').attributes('data-astryx-media')).toBeUndefined()
    }
    finally {
      wrapper.unmount()
      window.matchMedia = original
    }
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
