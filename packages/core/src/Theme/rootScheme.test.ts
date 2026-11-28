import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { neutralTheme } from './defineTheme.js'
import { readRootScheme } from './rootScheme.js'
import Theme from './Theme.vue'
import { useTheme } from './useTheme.js'

/** 让页面根读到某个 `color-scheme`（jsdom 不算样式表，只能替它回答）。 */
const real = window.getComputedStyle.bind(window)

function rootDeclares(colorScheme: string | undefined): void {
  vi.spyOn(window, 'getComputedStyle').mockImplementation((element, pseudo) => {
    const style = real(element, pseudo)
    if (element !== document.documentElement)
      return style
    return new Proxy(style, {
      get: (target, key) => key === 'colorScheme' ? colorScheme : Reflect.get(target, key) as unknown,
    })
  })
}

function preferDark(dark: boolean): void {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: dark && query.includes('dark'),
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }))
}

const Reader = defineComponent({
  setup() {
    const { mode } = useTheme()
    return () => h('span', { class: 'mode' }, mode.value)
  },
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  document.head.innerHTML = ''
  document.documentElement.removeAttribute('data-astryx-scheme')
})

describe('page root scheme', () => {
  it('reads the root color-scheme, else the meta, else light', () => {
    rootDeclares('dark')
    expect(readRootScheme()).toBe('dark')
    rootDeclares('light dark')
    expect(readRootScheme()).toBeNull()
    rootDeclares('normal')
    expect(readRootScheme()).toBe('light')
    document.head.innerHTML = '<meta name="color-scheme" content="dark">'
    expect(readRootScheme()).toBe('dark')
    document.head.innerHTML = '<meta name="color-scheme" content="light dark">'
    expect(readRootScheme()).toBeNull()
    rootDeclares(undefined)
    expect(readRootScheme()).toBeNull()
  })
})

describe('a system Theme takes the page scheme', () => {
  it('declares no color scheme of its own, so a host\'s scheme reaches it', () => {
    const wrapper = mount(Theme, { props: { theme: neutralTheme, mode: 'system' }, slots: { default: 'x' } })
    expect(wrapper.element.style.colorScheme).toBe('')
    wrapper.unmount()
  })

  it('declares `light dark` under a Theme that forces a mode, so it follows the reader again', () => {
    const wrapper = mount(Theme, {
      props: { theme: neutralTheme, mode: 'dark' },
      slots: { default: () => h(Theme, { theme: neutralTheme, mode: 'system' }, () => h(Theme, { theme: neutralTheme, mode: 'system' }, () => 'x')) },
    })
    const [forced, system, deeper] = wrapper.findAll('.astryx-theme')
    expect((forced.element as HTMLElement).style.colorScheme).toBe('dark')
    expect((system.element as HTMLElement).style.colorScheme).toBe('light dark')
    // A system Theme below that one inherits it, and declares nothing.
    expect((deeper.element as HTMLElement).style.colorScheme).toBe('')
    wrapper.unmount()
  })

  it('reports the dark scheme a host\'s root names, even for a light reader', async () => {
    preferDark(false)
    rootDeclares('dark')
    const wrapper = mount(Theme, { props: { theme: neutralTheme, mode: 'system' }, slots: { default: () => h(Reader) }, attachTo: document.body })
    await nextTick()
    expect(wrapper.get('.mode').text()).toBe('dark')
    wrapper.unmount()
  })

  it('reports light for a page that names no scheme, even for a dark reader', async () => {
    preferDark(true)
    rootDeclares('normal')
    const wrapper = mount(Theme, { props: { theme: neutralTheme, mode: 'system' }, slots: { default: () => h(Reader) }, attachTo: document.body })
    await nextTick()
    expect(wrapper.get('.mode').text()).toBe('light')
    wrapper.unmount()
  })

  it('follows the reader when the root names both schemes', async () => {
    preferDark(true)
    rootDeclares('light dark')
    const wrapper = mount(Theme, { props: { theme: neutralTheme, mode: 'system' }, slots: { default: () => h(Reader) }, attachTo: document.body })
    await nextTick()
    expect(wrapper.get('.mode').text()).toBe('dark')
    wrapper.unmount()
  })

  it('follows the reader under a Theme that forces light', async () => {
    preferDark(true)
    rootDeclares('light')
    const wrapper = mount(Theme, {
      props: { theme: neutralTheme, mode: 'light' },
      slots: { default: () => h(Theme, { theme: neutralTheme, mode: 'system' }, () => h(Reader)) },
      attachTo: document.body,
    })
    await nextTick()
    expect(wrapper.get('.mode').text()).toBe('dark')
    wrapper.unmount()
  })
})

describe('the root Theme names its scheme on <html>', () => {
  it('writes the forced mode, else the one scheme the page draws in, and removes it on unmount', async () => {
    preferDark(false)
    rootDeclares('dark')
    const system = mount(Theme, { props: { theme: neutralTheme, mode: 'system' }, slots: { default: 'x' } })
    await nextTick()
    expect(document.documentElement.getAttribute('data-astryx-scheme')).toBe('dark')
    system.unmount()
    expect(document.documentElement.hasAttribute('data-astryx-scheme')).toBe(false)

    const forced = mount(Theme, { props: { theme: neutralTheme, mode: 'light' }, slots: { default: 'x' } })
    expect(document.documentElement.getAttribute('data-astryx-scheme')).toBe('light')
    forced.unmount()
  })

  it('names none while the page follows the reader', async () => {
    preferDark(true)
    rootDeclares('light dark')
    const wrapper = mount(Theme, { props: { theme: neutralTheme, mode: 'system' }, slots: { default: 'x' } })
    await nextTick()
    expect(document.documentElement.hasAttribute('data-astryx-scheme')).toBe(false)
    wrapper.unmount()
  })
})
