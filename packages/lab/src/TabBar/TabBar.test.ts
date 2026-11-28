import type { Component, VNodeChild } from 'vue'
import type { TabBarItemProps } from './types'
import { provideAstryxLocale } from '@astryx-vue/core'
import { mount } from '@vue/test-utils'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import TabBarMoreListComponent from '../TabBarMoreList/TabBarMoreList.vue'
import TabBarComponent from './TabBar.vue'
import { TabBarItem } from './TabBarItem'

const TabBar = TabBarComponent as unknown as Component
const TabBarMoreList = TabBarMoreListComponent as unknown as Component

const Glyph = (name: string) => () => h('svg', { 'data-testid': `icon-${name}` })

interface BarOptions {
  initial?: string
  label?: string
  attrs?: Record<string, unknown>
  badges?: Record<string, string | number | undefined>
  /** 每个标签都指向面板 `panel-<value>`。 */
  hasPanels?: boolean
  onChange?: (value: string) => void
  onReselect?: (value: string) => void
}

function mountBar(options: BarOptions = {}) {
  const value = ref(options.initial ?? 'home')
  const badges = ref(options.badges ?? {})
  const panelOf = (tab: string): string | undefined => options.hasPanels === true ? `panel-${tab}` : undefined
  const Harness = defineComponent(() => () => h(TabBar, {
    'modelValue': value.value,
    'onUpdate:modelValue': (next: string) => {
      value.value = next
    },
    'onChange': options.onChange,
    'onReselect': options.onReselect,
    'label': 'label' in options ? options.label : 'Sections',
    'data-testid': 'bar',
    ...options.attrs,
  }, () => [
    h(TabBarItem, { value: 'home', label: 'Home', icon: Glyph('home'), panelId: panelOf('home') }),
    h(TabBarItem, { value: 'library', label: 'Library', icon: Glyph('library'), badge: badges.value.library, panelId: panelOf('library') }),
    h(TabBarItem, { value: 'browse', label: 'Browse', icon: Glyph('browse'), badge: badges.value.browse, badgeLabel: 'New items' }),
    h(TabBarItem, { value: 'profile', label: 'Profile', icon: Glyph('profile') }),
  ]))
  const wrapper = mount(Harness, { attachTo: document.body })
  return { wrapper, value, badges }
}

function mountSimple(render: () => VNodeChild) {
  return mount(defineComponent(() => render), { attachTo: document.body })
}

function tabs(): HTMLElement[] {
  return [...document.querySelectorAll<HTMLElement>('[role="tab"]')]
}

function tab(name: string): HTMLElement | undefined {
  return tabs().find(element => (element.getAttribute('aria-label') ?? element.textContent?.trim()) === name)
}

function stubMatchMedia(matches: (query: string) => boolean): void {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: matches(query),
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }))
}

/** 滚到 `top` 的滚动区，记下它的 `scrollTo`。happy-dom 不排版，偏移和尺寸手动给。 */
function scrolledArea(element: HTMLElement, top: number, content = 2000, box = 600) {
  const scrollTo = vi.fn()
  Object.defineProperty(element, 'scrollTop', { value: top, configurable: true })
  Object.defineProperty(element, 'clientHeight', { value: box, configurable: true })
  Object.defineProperty(element, 'clientWidth', { value: 400, configurable: true })
  Object.defineProperty(element, 'scrollHeight', { value: content, configurable: true })
  element.scrollTo = scrollTo as unknown as typeof element.scrollTo
  return scrollTo
}

function addPanel(html: string): void {
  const host = document.createElement('div')
  host.innerHTML = html
  document.body.append(host)
}

const byTestId = (id: string): HTMLElement => document.querySelector<HTMLElement>(`[data-testid="${id}"]`)!

// 和没有 Web Animations 的环境一样：动效引擎直接写终值，按计时器停下。
beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'animate', { value: undefined, configurable: true })
})

afterEach(() => {
  vi.unstubAllGlobals()
  document.body.innerHTML = ''
})

afterAll(() => {
  delete (HTMLElement.prototype as Partial<HTMLElement>).animate
})

describe('tabBar', () => {
  it('names its tab list "Tabs" when it is given no name', () => {
    const { wrapper } = mountBar({ label: undefined })
    expect(document.querySelector('[role="tablist"]')?.getAttribute('aria-label')).toBe('Tabs')
    wrapper.unmount()
  })

  it('wires a tab to the panel it controls through panelId (aria-controls)', () => {
    const wrapper = mountSimple(() => h(TabBar, { modelValue: 'home' }, () => [
      h(TabBarItem, { value: 'home', label: 'Home', panelId: 'home-panel' }),
      h(TabBarItem, { value: 'library', label: 'Library' }),
    ]))
    const [home, library] = tabs()
    expect(home?.getAttribute('aria-controls')).toBe('home-panel')
    expect(library?.hasAttribute('aria-controls')).toBe(false)
    wrapper.unmount()
  })

  it('gives aria-label and aria-labelledby to the tab list, not the root', () => {
    const { wrapper } = mountBar({ label: undefined, attrs: { ariaLabel: 'Main sections' } })
    expect(document.querySelector('[role="tablist"]')?.getAttribute('aria-label')).toBe('Main sections')
    expect(byTestId('bar').hasAttribute('aria-label')).toBe(false)
    wrapper.unmount()
    const labelled = mountBar({ label: 'Ignored', attrs: { ariaLabelledby: 'sections-heading' } })
    const list = document.querySelector('[role="tablist"]')
    expect(list?.getAttribute('aria-labelledby')).toBe('sections-heading')
    expect(list?.hasAttribute('aria-label')).toBe(false)
    expect(byTestId('bar').hasAttribute('aria-labelledby')).toBe(false)
    labelled.wrapper.unmount()
  })

  it('is a named tablist of tabs with the selected one marked', () => {
    const { wrapper } = mountBar({ initial: 'library' })
    expect(document.querySelector('[role="tablist"]')?.getAttribute('aria-label')).toBe('Sections')
    expect(tabs().map(element => element.textContent?.trim())).toEqual(['Home', 'Library', 'Browse', 'Profile'])
    expect(tab('Library')?.getAttribute('aria-selected')).toBe('true')
    expect(tab('Home')?.getAttribute('aria-selected')).toBe('false')
    wrapper.unmount()
  })

  it('chooses another tab with change and moves the selection', async () => {
    const onChange = vi.fn()
    const onReselect = vi.fn()
    const { wrapper } = mountBar({ onChange, onReselect })
    tab('Browse')?.click()
    await nextTick()
    expect(onChange).toHaveBeenCalledWith('browse')
    expect(onReselect).not.toHaveBeenCalled()
    expect(tab('Browse')?.getAttribute('aria-selected')).toBe('true')
    wrapper.unmount()
  })

  it('reports choosing the selected tab again as a reselect, not a change', () => {
    const onChange = vi.fn()
    const onReselect = vi.fn()
    const { wrapper } = mountBar({ onChange, onReselect })
    tab('Home')?.click()
    expect(onReselect).toHaveBeenCalledWith('home')
    expect(onChange).not.toHaveBeenCalled()
    wrapper.unmount()
  })

  it('scrolls the selected tab’s panel to its top when it is chosen again, gliding there', () => {
    addPanel('<div id="panel-home"><div data-testid="area" style="overflow-y: auto"></div></div>')
    const { wrapper } = mountBar({ hasPanels: true })
    const scrollTo = scrolledArea(byTestId('area'), 120)
    tab('Home')?.click()
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
    wrapper.unmount()
  })

  it('skips a row that scrolls only sideways, or overflows by a pixel or less, and scrolls the list below it', () => {
    addPanel('<div id="panel-home"><div data-testid="chips" style="overflow-y: auto"></div><div data-testid="tight" style="overflow-y: auto"></div><div data-testid="list" style="overflow-y: auto"></div></div>')
    const { wrapper } = mountBar({ hasPanels: true })
    const chips = scrolledArea(byTestId('chips'), 0, 600)
    const tight = scrolledArea(byTestId('tight'), 0, 48, 47)
    const list = scrolledArea(byTestId('list'), 120)
    tab('Home')?.click()
    expect(chips).not.toHaveBeenCalled()
    expect(tight).not.toHaveBeenCalled()
    expect(list).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
    wrapper.unmount()
  })

  it('scrolls the panel itself when it is the scroll area, and jumps under Reduce Motion', () => {
    stubMatchMedia(query => query.includes('prefers-reduced-motion: reduce'))
    addPanel('<div id="panel-home" data-testid="panel" style="overflow-y: scroll"><div style="overflow-y: auto"></div></div>')
    const { wrapper } = mountBar({ hasPanels: true })
    const scrollTo = scrolledArea(byTestId('panel'), 40)
    tab('Home')?.click()
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'instant' })
    wrapper.unmount()
  })

  it('scrolls nothing when the panel is at its top or has no scroll area, and still reports the reselect', () => {
    const onReselect = vi.fn()
    addPanel('<div id="panel-home"><div data-testid="area" style="overflow-y: auto"></div></div>')
    const first = mountBar({ hasPanels: true, onReselect })
    const atTop = scrolledArea(byTestId('area'), 0)
    tab('Home')?.click()
    expect(atTop).not.toHaveBeenCalled()
    first.wrapper.unmount()
    document.body.innerHTML = ''
    addPanel('<div id="panel-home" data-testid="panel"><p>Not a scroll area</p></div>')
    const second = mountBar({ hasPanels: true, onReselect })
    const panel = scrolledArea(byTestId('panel'), 80)
    tab('Home')?.click()
    expect(panel).not.toHaveBeenCalled()
    expect(onReselect).toHaveBeenCalledTimes(2)
    second.wrapper.unmount()
  })

  it('scrolls nothing when another tab is chosen', () => {
    addPanel('<div id="panel-home"><div data-testid="home" style="overflow-y: auto"></div></div><div id="panel-library"><div data-testid="library" style="overflow-y: auto"></div></div>')
    const { wrapper } = mountBar({ hasPanels: true })
    const home = scrolledArea(byTestId('home'), 120)
    const library = scrolledArea(byTestId('library'), 60)
    tab('Library')?.click()
    expect(home).not.toHaveBeenCalled()
    expect(library).not.toHaveBeenCalled()
    wrapper.unmount()
  })

  it('has one tab stop, on the selected tab, and arrow keys move between tabs', () => {
    const { wrapper } = mountBar({ initial: 'library' })
    const all = tabs()
    expect(all.map(element => element.tabIndex)).toEqual([-1, 0, -1, -1])
    all[1]!.focus()
    all[1]!.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    expect(document.activeElement).toBe(all[2])
    all[2]!.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }))
    expect(document.activeElement).toBe(all[3])
    all[3]!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }))
    expect(document.activeElement).toBe(all[0])
    // 移动焦点不选标签：Enter 或空格才选。
    expect(all[1]!.getAttribute('aria-selected')).toBe('true')
    wrapper.unmount()
  })

  it('names a badged tab with one catalog message, so a translation can reorder it', () => {
    const Provider = defineComponent((_, { slots }) => {
      provideAstryxLocale('en', { tabBar: { more: 'More', badgedItem: '{badge} · {label}' } } as never)
      return () => slots.default?.()
    })
    const wrapper = mountSimple(() => h(Provider, null, () => h(TabBar, { modelValue: 'home' }, () => [
      h(TabBarItem, { value: 'home', label: 'Home' }),
      h(TabBarItem, { value: 'library', label: 'Library', badge: 3 }),
    ])))
    expect(tab('3 · Library')).toBeDefined()
    wrapper.unmount()
  })

  it('puts a badge in its tab’s name and draws it at once', async () => {
    const { wrapper, badges } = mountBar({ badges: { library: 3 } })
    const badge = (): Element | null => document.querySelector('[data-tab-bar-badge="library"]')
    expect(tab('Library, 3')).toBeDefined()
    expect(badge()?.textContent).toBe('3')
    badges.value = { library: '12' }
    await nextTick()
    expect(badge()?.textContent).toBe('12')
    expect(tab('Library, 12')).toBeDefined()
    badges.value = { library: '' }
    await nextTick()
    expect(badge()).toBeNull()
    expect(tab('Library')).toBeDefined()
    wrapper.unmount()
  })

  it('reads a badge’s label instead of the badge when given one', () => {
    const { wrapper } = mountBar({ badges: { browse: '!' } })
    expect(tab('Browse, New items')).toBeDefined()
    wrapper.unmount()
  })

  it('keeps the badges and the lens out of the accessibility tree, and draws each item once at rest', () => {
    const { wrapper } = mountBar({ badges: { library: 3 } })
    const lens = document.querySelector('[data-tab-bar-lens]')
    expect(lens?.getAttribute('aria-hidden')).toBe('true')
    expect(document.querySelector('[data-tab-bar-badge="library"]')?.closest('[aria-hidden="true"]')).not.toBeNull()
    // 静止时透镜里没有项的副本：每个图标只画一次。
    expect(document.querySelector('[data-tab-bar-copy]')).toBeNull()
    expect(lens?.querySelectorAll('[data-testid^="icon-"]')).toHaveLength(0)
    expect(document.querySelectorAll('[data-testid^="icon-"]')).toHaveLength(4)
    wrapper.unmount()
  })

  it('draws the lens only while a tab is selected', async () => {
    const value = ref('none')
    const wrapper = mountSimple(() => h(TabBar, { modelValue: value.value }, () => [
      h(TabBarItem, { value: 'a', label: 'A' }),
      h(TabBarItem, { value: 'b', label: 'B' }),
    ]))
    expect(document.querySelector('[data-tab-bar-lens]')).toBeNull()
    // 什么都没选时第一个标签留着 tab 停靠点。
    expect(tabs().map(element => element.tabIndex)).toEqual([0, -1])
    value.value = 'b'
    await nextTick()
    expect(document.querySelector('[data-tab-bar-lens]')).not.toBeNull()
    wrapper.unmount()
  })

  it('draws the selected icon on the selected tab itself when one is given', () => {
    const wrapper = mountSimple(() => h(TabBar, { modelValue: 'a' }, () => [
      h(TabBarItem, { value: 'a', label: 'A', icon: Glyph('outline'), selectedIcon: Glyph('filled') }),
    ]))
    expect(tab('A')?.querySelector('[data-testid="icon-filled"]')).not.toBeNull()
    expect(tab('A')?.querySelector('[data-testid="icon-outline"]')).toBeNull()
    wrapper.unmount()
  })

  it('under a mouse never mounts a copy', async () => {
    const { wrapper } = mountBar()
    tab('Browse')?.click()
    await nextTick()
    expect(tab('Browse')?.getAttribute('aria-selected')).toBe('true')
    expect(document.querySelector('[data-tab-bar-copy]')).toBeNull()
    wrapper.unmount()
  })

  it('under a finger a slide mounts the copy only until the lens rests', async () => {
    stubMatchMedia(query => query.includes('pointer: coarse'))
    const { wrapper } = mountBar()
    await nextTick()
    expect(document.querySelector('[data-tab-bar-copy]')).toBeNull()
    tab('Browse')?.click()
    await nextTick()
    // 滑动开始的那次渲染在透镜里画出选中样子……
    expect(document.querySelector('[data-tab-bar-copy]')).not.toBeNull()
    // ……停稳后标签自己再画它，副本拿掉。
    await vi.waitFor(() => expect(document.querySelector('[data-tab-bar-copy]')).toBeNull(), { timeout: 3000 })
    expect(tab('Browse')?.querySelector('[data-testid="icon-browse"]')).not.toBeNull()
    wrapper.unmount()
  })

  it('carries the stable theme classes and the selected state', () => {
    const { wrapper } = mountBar({ initial: 'browse' })
    expect(byTestId('bar').classList.contains('astryx-tab-bar')).toBe(true)
    expect(tab('Browse')?.classList.contains('astryx-tab-bar-item')).toBe(true)
    expect(tab('Browse')?.getAttribute('data-selected')).toBe('selected')
    expect(tab('Home')?.hasAttribute('data-selected')).toBe(false)
    wrapper.unmount()
  })

  it('ignores children that are not TabBarItem', () => {
    const wrapper = mountSimple(() => h(TabBar, { modelValue: 'a' }, () => [
      h(TabBarItem, { value: 'a', label: 'A' }),
      null,
      h('span', 'stray'),
    ]))
    expect(tabs()).toHaveLength(1)
    expect(document.body.textContent).not.toContain('stray')
    wrapper.unmount()
  })
})

describe('tabBar disabled tab', () => {
  function mountDisabled(onChange?: (value: string) => void) {
    const value = ref('home')
    return mountSimple(() => h(TabBar, {
      'modelValue': value.value,
      'onUpdate:modelValue': (next: string) => {
        value.value = next
      },
      onChange,
      'label': 'Sections',
    }, () => [
      h(TabBarItem, { value: 'home', label: 'Home' }),
      h(TabBarItem, { value: 'browse', label: 'Browse', disabled: true }),
      h(TabBarItem, { value: 'profile', label: 'Profile' }),
    ]))
  }

  it('is marked disabled and ignores a click', () => {
    const onChange = vi.fn()
    const wrapper = mountDisabled(onChange)
    expect(tab('Browse')?.getAttribute('aria-disabled')).toBe('true')
    tab('Browse')?.click()
    expect(onChange).not.toHaveBeenCalled()
    expect(tab('Browse')?.getAttribute('aria-selected')).toBe('false')
    wrapper.unmount()
  })

  it('is skipped by the arrow keys, and keeps the other tabs choosable', () => {
    const onChange = vi.fn()
    const wrapper = mountDisabled(onChange)
    tab('Home')!.focus()
    tab('Home')!.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    expect(document.activeElement).toBe(tab('Profile'))
    tab('Profile')?.click()
    expect(onChange).toHaveBeenCalledWith('profile')
    wrapper.unmount()
  })
})

describe('tabBar More tab', () => {
  const SIX = ['home', 'library', 'browse', 'profile', 'settings', 'help']
  const label = (value: string): string => value[0]!.toUpperCase() + value.slice(1)
  const items = (overrides: Partial<Record<string, Partial<TabBarItemProps>>> = {}) =>
    SIX.map(value => h(TabBarItem, { value, label: label(value), icon: Glyph(value), ...overrides[value] }))

  it('shows the first four tabs and More when there are more than five', () => {
    const wrapper = mountSimple(() => h(TabBar, { modelValue: 'home', label: 'Sections' }, () => items()))
    expect(tabs().map(element => element.textContent?.trim())).toEqual(['Home', 'Library', 'Browse', 'Profile', 'More'])
    wrapper.unmount()
  })

  it('names the More tab and its list with one catalog message, so a translation can change it', () => {
    const Provider = defineComponent((_, { slots }) => {
      provideAstryxLocale('en', { tabBar: { more: 'Others', badgedItem: '{label}, {badge}' } } as never)
      return () => slots.default?.()
    })
    const wrapper = mountSimple(() => h(Provider, null, () => [
      h(TabBar, { modelValue: 'more', label: 'Sections' }, () => items()),
      h(TabBarMoreList, null, () => items()),
    ]))
    expect(tab('Others')).toBeDefined()
    expect(document.querySelector('[role="list"]')?.getAttribute('aria-label')).toBe('Others')
    wrapper.unmount()
  })

  it('selects More for a tab it holds, and chooses More with its value', async () => {
    const onChange = vi.fn()
    const value = ref('settings')
    const wrapper = mountSimple(() => h(TabBar, { modelValue: value.value, onChange, label: 'Sections' }, () => items()))
    expect(tab('More')?.getAttribute('aria-selected')).toBe('true')
    value.value = 'home'
    await nextTick()
    tab('More')?.click()
    expect(onChange).toHaveBeenCalledWith('more')
    wrapper.unmount()
  })

  it('more again while it holds a tab is a reselect, back to its list', () => {
    const onChange = vi.fn()
    const onReselect = vi.fn()
    const wrapper = mountSimple(() => h(TabBar, { modelValue: 'help', onChange, onReselect, label: 'Sections' }, () => items()))
    tab('More')?.click()
    expect(onReselect).toHaveBeenCalledWith('more')
    expect(onChange).not.toHaveBeenCalled()
    wrapper.unmount()
  })

  function rowButton(name: RegExp): HTMLElement | undefined {
    return [...document.querySelectorAll<HTMLElement>('[role="list"] button')].find(button => name.test(button.textContent ?? ''))
  }

  it('shows a tab’s badge in its More row, spoken with the row', () => {
    const wrapper = mountSimple(() => h(TabBarMoreList, null, () => items({ help: { badge: 2 } })))
    const help = rowButton(/Help/)
    expect(help?.textContent).toContain('Help, 2')
    expect(help?.closest('li, [role="listitem"]')?.textContent).toContain('2')
    wrapper.unmount()
  })

  it('lists the tabs past the fourth, and a row chooses its tab', () => {
    const onChange = vi.fn()
    const wrapper = mountSimple(() => h(TabBarMoreList, { modelValue: 'help', onChange }, () => items()))
    const list = document.querySelector('[role="list"]')
    expect(list?.getAttribute('aria-label')).toBe('More')
    expect(list?.textContent).toContain('Settings')
    expect(list?.textContent).toContain('Help')
    expect(list?.textContent).not.toContain('Profile')
    rowButton(/Settings/)?.click()
    expect(onChange).toHaveBeenCalledWith('settings')
    wrapper.unmount()
  })

  it('reads the selected tab’s More row as selected, and no other row', () => {
    const wrapper = mountSimple(() => h(TabBarMoreList, { modelValue: 'help' }, () => items()))
    expect(document.querySelector('[aria-current]')?.textContent).toContain('Help')
    expect(rowButton(/Settings/)?.hasAttribute('aria-current')).toBe(false)
    wrapper.unmount()
  })

  it('keeps a disabled tab past the fourth disabled in its More row, which a tap never chooses', () => {
    const onChange = vi.fn()
    const wrapper = mountSimple(() => h(TabBarMoreList, { onChange }, () => items({ help: { disabled: true } })))
    const help = rowButton(/Help/)
    expect(help?.closest('.astryx-item')?.getAttribute('aria-disabled')).toBe('true')
    help?.click()
    expect(onChange).not.toHaveBeenCalled()
    rowButton(/Settings/)?.click()
    expect(onChange).toHaveBeenCalledWith('settings')
    wrapper.unmount()
  })
})
