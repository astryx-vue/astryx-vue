import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { computed, defineComponent, h } from 'vue'
import { defineSyntaxTheme } from '../Code/syntaxTheme.js'
import { useSyntaxTheme } from '../Code/useSyntaxTheme.js'
import { defineTheme } from './defineTheme.js'
import Theme from './Theme.vue'
import { useTheme } from './useTheme.js'

const forest = defineTheme({
  name: 'forest',
  tokens: {
    '--color-accent': ['#15803D', '#86EFAC'],
    '--color-text-primary': ['#052E16', '#DCFCE7'],
    '--color-background-card': ['#FFFFFF', '#0F3D24'],
  },
})

const warm = defineTheme({
  name: 'warm',
  tokens: {
    '--color-text-primary': '#3B2F15',
  },
})

const Reader = defineComponent({
  setup() {
    const theme = useTheme()
    const syntax = useSyntaxTheme()
    return {
      name: theme.name,
      mode: theme.mode,
      accent: computed(() => theme.token('--color-accent')),
      keyword: computed(() => syntax?.token('keyword') ?? ''),
    }
  },
  template: '<span class="name">{{ name }}</span><span class="mode">{{ mode }}</span><span class="accent">{{ accent }}</span><span class="syntax">{{ keyword }}</span>',
})

describe('theme', () => {
  it('applies token variables, the card bridge, and the mode attribute', () => {
    const wrapper = mount(Theme, {
      props: { theme: forest, mode: 'dark' },
      slots: { default: 'Forest' },
    })

    expect(wrapper.attributes('data-astryx-theme')).toBe('forest')
    expect(wrapper.attributes('data-astryx-color-mode')).toBe('dark')
    expect(wrapper.element.style.getPropertyValue('--astryx-color-accent')).toBe('light-dark(#15803D, #86EFAC)')
    expect(wrapper.element.style.getPropertyValue('--astryx-color-text-primary')).toBe('light-dark(#052E16, #DCFCE7)')
    expect(wrapper.element.style.getPropertyValue('--astryx-text-foreground')).toBe('light-dark(#052E16, #DCFCE7)')
    expect(wrapper.element.style.getPropertyValue('--astryx-heading-foreground')).toBe('light-dark(#052E16, #DCFCE7)')
    expect(wrapper.element.style.getPropertyValue('--astryx-button-primary-background')).toBe('light-dark(#15803D, #86EFAC)')
    expect(wrapper.element.style.getPropertyValue('--astryx-button-ghost-foreground')).toBe('light-dark(#052E16, #DCFCE7)')
    expect(wrapper.element.style.getPropertyValue('--astryx-card-background')).toBe('light-dark(#FFFFFF, #0F3D24)')
    expect(wrapper.element.style.colorScheme).toBe('dark')
    expect(wrapper.find('style').exists()).toBe(false)
    expect(document.documentElement.getAttribute('data-astryx-theme')).toBe('forest')
    expect(document.documentElement.getAttribute('data-astryx-color-mode')).toBe('dark')

    wrapper.unmount()
    expect(document.documentElement.hasAttribute('data-astryx-theme')).toBe(false)
    expect(document.documentElement.hasAttribute('data-astryx-color-mode')).toBe(false)
  })

  it('lets a nested theme override tokens without replacing the root attribute', () => {
    const wrapper = mount(Theme, {
      props: { theme: warm, mode: 'light' },
      slots: {
        default: () => h(Theme, { theme: forest, mode: 'light' }, () => 'Inner'),
      },
    })

    const nested = wrapper.get('[data-astryx-theme="forest"]')
    expect(document.documentElement.getAttribute('data-astryx-theme')).toBe('warm')
    expect((nested.element as HTMLElement).style.getPropertyValue('--astryx-color-text-primary')).toBe('light-dark(#052E16, #DCFCE7)')
    wrapper.unmount()
  })

  it('injects component style rules for the theme name', () => {
    const theme = defineTheme({
      name: 'ruled',
      components: {
        button: { base: { fontWeight: '600' } },
      },
    })
    const wrapper = mount(Theme, {
      props: { theme, mode: 'light' },
      slots: { default: 'Ruled' },
    })
    const style = wrapper.get('[data-astryx-theme-style]')
    expect(style.text()).toContain('[data-astryx-theme="ruled"] .astryx-button')
    expect(style.text()).toContain('font-weight: 600;')
    wrapper.unmount()
  })

  it('resolves useTheme to the active mode and syntax colors', () => {
    const syntax = defineSyntaxTheme({
      name: 'pair',
      tokens: {
        keyword: ['#111111', '#eeeeee'],
        string: '#aaaaaa',
        comment: '#bbbbbb',
        number: '#cccccc',
        function: '#dddddd',
        type: '#111111',
        variable: '#222222',
        operator: '#333333',
        constant: '#444444',
        tag: '#555555',
        attribute: '#666666',
        property: '#777777',
        punctuation: '#888888',
        background: '#000000',
      },
    })
    const themed = defineTheme({
      name: 'forest',
      tokens: { '--color-accent': ['#15803D', '#86EFAC'] },
      syntax,
    })
    const wrapper = mount(Theme, {
      props: { theme: themed, mode: 'dark' },
      slots: { default: () => h(Reader) },
    })

    expect(wrapper.get('.name').text()).toBe('forest')
    expect(wrapper.get('.mode').text()).toBe('dark')
    expect(wrapper.get('.accent').text()).toBe('#86EFAC')
    expect(wrapper.get('.syntax').text()).toBe('#eeeeee')
    wrapper.unmount()
  })
})
