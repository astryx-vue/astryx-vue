import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
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

describe('media theme', () => {
  it('marks a dark surface and leaves off unmarked', () => {
    const dark = mount(MediaTheme, {
      props: { mode: 'dark' },
      slots: { default: 'Overlay' },
    })
    expect(dark.attributes('data-astryx-media')).toBe('dark')
    expect(dark.classes()).toContain('astryx-media-theme')
    dark.unmount()

    const off = mount(MediaTheme, {
      props: { mode: 'off' },
      slots: { default: 'Plain' },
    })
    expect(off.attributes('data-astryx-media')).toBeUndefined()
    off.unmount()
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
