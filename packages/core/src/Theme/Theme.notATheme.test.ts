import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { defineTheme } from './defineTheme.js'
import Theme from './Theme.vue'
import { useTheme } from './useTheme.js'

const known = defineTheme({ name: 'known-theme' })

const Probe = defineComponent({
  setup() {
    const theme = useTheme()
    return () => h('span', { 'data-testid': 'probe' }, `${theme.name.value} ${theme.mode.value}`)
  },
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('a Theme given a value that is not a defined theme', () => {
  it('names the mode prop when the value is a mode, and applies no theme', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mount(Theme, { props: { theme: 'dark' as never }, slots: { default: 'x' } })
    const ours = warn.mock.calls.map(args => String(args[0])).filter(message => message.includes('takes a theme from defineTheme()'))
    expect(ours).toHaveLength(1)
    expect(ours[0]).toBe(
      'Theme: `theme` takes a theme from defineTheme(), but got the string "dark". To set the color mode, use mode="dark". Until then, this Theme applies no theme of its own.',
    )
    expect(wrapper.attributes('data-astryx-theme')).toBeUndefined()
    expect(wrapper.find('[data-astryx-theme-style]').exists()).toBe(false)
    expect(document.documentElement.hasAttribute('data-astryx-theme')).toBe(false)
    wrapper.unmount()
  })

  it('keeps the theme around it and its own mode when nested', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mount(Theme, {
      props: { theme: known, mode: 'light' },
      slots: {
        default: () => h(Theme, { theme: 'light' as never, mode: 'dark' }, () => h(Probe)),
      },
    })
    expect(wrapper.get('[data-testid="probe"]').text()).toBe('known-theme dark')
    expect(wrapper.get('[data-testid="probe"]').element.parentElement?.getAttribute('data-astryx-theme')).toBe('known-theme')
    expect(document.documentElement.getAttribute('data-astryx-theme')).toBe('known-theme')
    wrapper.unmount()
  })

  it('keeps its mode for the readers below it when no theme surrounds it', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mount(Theme, {
      props: { theme: {} as never, mode: 'dark' },
      slots: { default: () => h(Probe) },
    })
    expect(wrapper.get('[data-testid="probe"]').text()).toBe('neutral dark')
    wrapper.unmount()
  })

  it('warns for null and for a plain object separately', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    mount(Theme, { props: { theme: null as never }, slots: { default: 'x' } }).unmount()
    mount(Theme, { props: { theme: {} as never }, slots: { default: 'y' } }).unmount()
    const messages = warn.mock.calls.map(args => String(args[0])).filter(message => message.includes('takes a theme from defineTheme()'))
    expect(messages).toHaveLength(2)
    expect(messages[0]).toContain('got null')
    expect(messages[1]).toContain('an object that defineTheme() did not make')
  })

  it('applies a defined theme once the value becomes one', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mount(Theme, { props: { theme: {} as never }, slots: { default: '<input />' } })
    const input = wrapper.get('input').element
    await wrapper.setProps({ theme: known })
    expect(wrapper.get('input').element).toBe(input)
    expect(wrapper.attributes('data-astryx-theme')).toBe('known-theme')
    wrapper.unmount()
  })
})
