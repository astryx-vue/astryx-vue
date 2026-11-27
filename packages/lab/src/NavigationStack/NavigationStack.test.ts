import type { VueWrapper } from '@vue/test-utils'
import type { Component, VNodeChild } from 'vue'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { mount } from '@vue/test-utils'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { useNavigationStack } from './context'
import { navigation, springs } from './navigationMotion'
import { NavigationScreen } from './NavigationScreen'
import NavigationStackComponent from './NavigationStack.vue'

const resolveMotionCalls = vi.hoisted(() => [] as unknown[][])
vi.mock('@astryx-vue/core/internal/touch', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@astryx-vue/core/internal/touch')>()
  return {
    ...actual,
    resolveMotion: ((...args: Parameters<typeof actual.resolveMotion>) => {
      resolveMotionCalls.push(args)
      return (actual.resolveMotion as (...a: unknown[]) => unknown)(...args)
    }) as typeof actual.resolveMotion,
  }
})

const NavigationStack = NavigationStackComponent as unknown as Component
const css = readFileSync(resolve(__dirname, '../../styles/navigation-stack.css'), 'utf8')

const Root = defineComponent(() => {
  const nav = useNavigationStack<string>()
  return () => [
    h('button', { type: 'button', onClick: () => nav.push('General') }, 'General'),
    h('button', { type: 'button', onClick: () => nav.push('Privacy') }, 'Privacy'),
  ]
})

const Detail = defineComponent({
  props: { entry: { type: String, required: true } },
  setup(props) {
    const nav = useNavigationStack<string>()
    return () => [
      h('p', `${props.entry} content`),
      h('button', { type: 'button', onClick: () => nav.push(`${props.entry} › About`) }, 'About'),
      h('button', { type: 'button', onClick: () => nav.popToRoot() }, 'Done'),
      h('span', { 'data-testid': 'depth' }, String(nav.depth)),
    ]
  },
})

interface HarnessOptions {
  initial?: string[]
  backTitle?: string
  rootTitle?: string
  rootEndContent?: () => VNodeChild
  titleDisplayMode?: 'large' | 'inline'
  rootContent?: (setPath: (path: string[]) => void) => VNodeChild
  screenContent?: (entry: string) => VNodeChild
}

const mounted = new Set<VueWrapper>()

function mountHarness(options: HarnessOptions = {}) {
  const path = ref<string[]>(options.initial ?? [])
  const setPath = (next: string[]): void => {
    path.value = next
  }
  const Harness = defineComponent(() => () => h(NavigationStack, {
    'label': 'Settings',
    'path': path.value,
    'onUpdate:path': setPath,
    'getKey': (entry: string) => entry,
  }, {
    root: () => h(NavigationScreen, {
      title: options.rootTitle ?? 'Settings',
      backTitle: options.backTitle,
      titleDisplayMode: options.titleDisplayMode,
    }, {
      default: () => options.rootContent?.(setPath) ?? h(Root),
      ...(options.rootEndContent ? { endContent: options.rootEndContent } : {}),
    }),
    screen: ({ entry }: { entry: string }) => h(NavigationScreen, {
      title: entry,
      titleDisplayMode: options.titleDisplayMode,
    }, {
      default: () => options.screenContent?.(entry) ?? h(Detail, { entry }),
    }),
  }))
  const wrapper = mount(Harness, { attachTo: document.body })
  // 测试中途失败时 afterEach 替它卸载，不让还在跑的动效和焦点逻辑留到下一个测试。
  mounted.add(wrapper)
  const unmount = wrapper.unmount.bind(wrapper)
  wrapper.unmount = () => {
    mounted.delete(wrapper)
    unmount()
  }
  return { wrapper, path }
}

/** 按标题找一屏的卡片（根屏幕是 "Settings"）。 */
function screenCard(title: string): HTMLElement | null {
  const key = title === 'Settings' ? 'root' : `screen-${title}`
  return document.querySelector<HTMLElement>(`[data-navigation-screen="${key}"]`)
}

function button(name: string): HTMLButtonElement | undefined {
  return [...document.querySelectorAll<HTMLButtonElement>('button')]
    .find(element => (element.getAttribute('aria-label') ?? element.textContent?.trim()) === name)
}

function backButton(): HTMLButtonElement | null {
  return document.querySelector<HTMLButtonElement>('[data-navigation-back]')
}

function heading(name: string, level?: number): HTMLElement | undefined {
  return [...document.querySelectorAll<HTMLElement>(level == null ? 'h1, h2' : `h${level}`)]
    .find(element => element.textContent?.trim() === name && !element.closest('[aria-hidden="true"]') && element.getAttribute('aria-hidden') !== 'true')
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

// 和没有 Web Animations 的环境一样：动效引擎直接写终值，按计时器停下。
beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'animate', { value: undefined, configurable: true })
})

afterEach(() => {
  for (const wrapper of mounted)
    wrapper.unmount()
  mounted.clear()
  vi.unstubAllGlobals()
  document.body.innerHTML = ''
  resolveMotionCalls.length = 0
})

afterAll(() => {
  delete (HTMLElement.prototype as Partial<HTMLElement>).animate
})

describe('navigationStack', () => {
  it('renders the root screen with its title and no back button', () => {
    const { wrapper } = mountHarness()
    const region = document.querySelector('[role="region"]')
    expect(region?.getAttribute('aria-label')).toBe('Settings')
    expect(heading('Settings', 2)).toBeDefined()
    expect(backButton()).toBeNull()
    expect(button('General')).toBeDefined()
    wrapper.unmount()
  })

  // 静止时卡片也是层叠上下文，和转场时 transform 造成的一样：屏幕内容的 z-index 再大也在 z-index 为 1 的栏下面。
  it('gives every card isolation: isolate at rest', () => {
    const rule = css.match(/\.astryx-navigation-stack__card \{[^}]*\}/)?.[0] ?? ''
    expect(rule).toContain('isolation: isolate')
    expect(css).toMatch(/\.astryx-navigation-stack__bar \{[^}]*z-index: 1;/)
  })

  it('pushes a screen: its title shows, Back reads the previous title, the root is covered', async () => {
    const { wrapper } = mountHarness()
    button('General')?.click()
    await nextTick()
    await nextTick()
    expect(document.body.textContent).toContain('General content')
    expect(backButton()?.getAttribute('aria-label')).toBe('Settings')
    // 被盖住的根屏幕不接输入，读屏也跳过它。
    expect(screenCard('Settings')?.hasAttribute('inert')).toBe(true)
    expect(screenCard('General')?.hasAttribute('inert')).toBe(false)
    expect(document.querySelector('[data-testid="depth"]')?.textContent).toBe('1')
    wrapper.unmount()
  })

  it('pops with the back button; the popped screen leaves once its slide-out ends', async () => {
    const { wrapper } = mountHarness({ initial: ['General'] })
    backButton()?.click()
    await nextTick()
    await nextTick()
    // 滑出期间还在，并且是 inert……
    expect(document.body.textContent).toContain('General content')
    expect(screenCard('General')?.hasAttribute('inert')).toBe(true)
    // ……滑出后就没了。
    await vi.waitFor(() => expect(document.body.textContent).not.toContain('General content'), { timeout: 3000 })
    expect(screenCard('Settings')?.hasAttribute('inert')).toBe(false)
    wrapper.unmount()
  })

  it('moves focus to the new title after a push, and back to the pushing control after the pop', async () => {
    const { wrapper } = mountHarness()
    const general = button('General')!
    general.focus()
    general.click()
    await vi.waitFor(() => expect(document.activeElement).toBe(heading('General', 2)), { timeout: 3000 })
    backButton()?.click()
    await vi.waitFor(() => expect(document.activeElement).toBe(general), { timeout: 3000 })
    wrapper.unmount()
  })

  it('keeps focus a person moved into the new screen before the push settles', async () => {
    const { wrapper } = mountHarness({
      rootContent: setPath => h('button', { type: 'button', onClick: () => setPath(['Compose']) }, 'Compose'),
      screenContent: () => h('input', { 'aria-label': 'Message' }),
    })
    const compose = button('Compose')!
    compose.focus()
    compose.click()
    await nextTick()
    await nextTick()
    // 推入途中，用户把焦点移进新屏幕，就像点了它的输入框。
    const field = document.querySelector<HTMLInputElement>('input[aria-label="Message"]')!
    field.focus()
    expect(document.activeElement).toBe(field)
    // 等推入停下；栏标题这时不能把焦点抢走。
    await new Promise(resolve => setTimeout(resolve, 1200))
    expect(document.activeElement).toBe(field)
    wrapper.unmount()
  })

  it('labels Back with the previous screen’s backTitle when it has one', () => {
    const { wrapper } = mountHarness({ initial: ['General'], backTitle: 'All settings' })
    expect(backButton()?.getAttribute('aria-label')).toBe('All settings')
    wrapper.unmount()
  })

  it('names Back with the built-in “Back” when the previous screen’s title is empty', () => {
    const { wrapper } = mountHarness({ initial: ['General'], rootTitle: '' })
    expect(backButton()?.getAttribute('aria-label')).toBe('Back')
    wrapper.unmount()
  })

  it('pops several screens back to the root at once', async () => {
    const { wrapper } = mountHarness({ initial: ['General', 'General › About'] })
    expect(backButton()?.getAttribute('aria-label')).toBe('General')
    const done = [...document.querySelectorAll<HTMLButtonElement>('button')].filter(element => element.textContent === 'Done').at(-1)
    done?.click()
    await vi.waitFor(() => expect(document.body.textContent).not.toContain('General › About content'), { timeout: 3000 })
    expect(document.body.textContent).not.toContain('General content')
    expect(button('Privacy')).toBeDefined()
    wrapper.unmount()
  })

  describe('a large title', () => {
    it('shows the title above the content and hides the bar title from assistive technology', () => {
      const { wrapper } = mountHarness({ titleDisplayMode: 'large' })
      const large = heading('Settings', 1)
      // 滚动内容里的第一个元素。
      expect(screenCard('Settings')?.firstElementChild?.firstElementChild?.firstElementChild).toBe(large)
      // 大标题显示时栏里那份标题对读屏隐藏。
      const barTitle = document.querySelector('[data-navigation-bar="root"] h2')
      expect(barTitle?.getAttribute('aria-hidden')).toBe('true')
      wrapper.unmount()
    })

    it('puts the scroll edge sentinel right after the large title', () => {
      const { wrapper } = mountHarness({ titleDisplayMode: 'large' })
      const scroller = screenCard('Settings')?.firstElementChild
      const content = scroller?.firstElementChild
      const [title, sentinel] = [...(content?.children ?? [])]
      expect(title).toBe(heading('Settings', 1))
      // 它和大标题同时结束：栏标题接手时遮罩打开。滚动区里没有别的哨兵。
      expect(sentinel?.hasAttribute('data-navigation-scroll-edge-sentinel')).toBe(true)
      expect(sentinel?.getAttribute('aria-hidden')).toBe('true')
      expect(scroller?.querySelectorAll('[data-navigation-scroll-edge-sentinel]')).toHaveLength(1)
      wrapper.unmount()
    })

    it('moves focus to the pushed screen’s large title', async () => {
      const { wrapper } = mountHarness({ titleDisplayMode: 'large' })
      const general = button('General')!
      general.focus()
      general.click()
      await vi.waitFor(() => expect(document.activeElement).toBe(heading('General', 1)), { timeout: 3000 })
      wrapper.unmount()
    })
  })

  it('marks the top of an inline screen’s content with the scroll edge sentinel, under its veil', () => {
    const { wrapper } = mountHarness()
    const card = screenCard('Settings')
    const [sentinel, content] = [...(card?.firstElementChild?.children ?? [])]
    // 哨兵在滚动区里内容的正上方；屏幕的第一个元素仍是内容的第一个元素。
    expect(sentinel?.hasAttribute('data-navigation-scroll-edge-sentinel')).toBe(true)
    expect(content?.querySelector('[data-navigation-scroll-edge-sentinel]')).toBeNull()
    // 遮罩是卡片自己的子元素，盖在滚动区上面，对读屏隐藏。
    const veil = card?.querySelector(':scope > [data-navigation-scroll-edge]')
    expect(veil?.getAttribute('aria-hidden')).toBe('true')
    wrapper.unmount()
  })

  it('shows a screen’s end content in its bar, out of reach once a screen covers it', async () => {
    const { wrapper } = mountHarness({ rootEndContent: () => h('button', { type: 'button' }, 'Edit') })
    const edit = button('Edit')!
    const bar = edit.closest('[data-navigation-bar]')
    expect(bar?.getAttribute('data-navigation-bar')).toBe('root')
    expect(bar?.hasAttribute('inert')).toBe(false)
    button('General')?.click()
    await vi.waitFor(() => expect(heading('General', 2)).toBeDefined())
    expect(bar?.hasAttribute('inert')).toBe(true)
    wrapper.unmount()
  })

  it('keeps covered screens beyond the one underneath out of rendering', () => {
    const { wrapper } = mountHarness({ initial: ['General', 'General › About'] })
    // 根屏幕在最上面两层以下：保住状态，但不渲染。
    expect(screenCard('Settings')?.classList.contains('astryx-navigation-stack__card--hidden')).toBe(true)
    expect(screenCard('General')?.classList.contains('astryx-navigation-stack__card--hidden')).toBe(false)
    wrapper.unmount()
  })

  it('returns focus to the end control that pushed, not the row around it', async () => {
    const { wrapper } = mountHarness({
      rootContent: setPath => h('div', { role: 'button', tabindex: 0, onClick: () => setPath(['General']) }, [
        h('span', 'General'),
        h('button', {
          type: 'button',
          onClick: (event: MouseEvent) => {
            event.stopPropagation()
            setPath(['General info'])
          },
        }, 'Info'),
      ]),
      screenContent: entry => h('p', `${entry} content`),
    })
    const info = button('Info')!
    info.focus()
    info.click()
    await vi.waitFor(() => expect(heading('General info', 2)).toBeDefined())
    backButton()?.click()
    await vi.waitFor(() => expect(document.body.textContent).not.toContain('General info content'), { timeout: 3000 })
    await vi.waitFor(() => expect(document.activeElement).toBe(button('Info')))
    wrapper.unmount()
  })

  it('throws when useNavigationStack is used outside a stack', () => {
    const Orphan = defineComponent(() => {
      useNavigationStack()
      return () => null
    })
    expect(() => mount(Orphan)).toThrow(/inside a NavigationStack/)
  })

  it('emits the shorter path from pop and an empty one from popToRoot', async () => {
    const { wrapper, path } = mountHarness({ initial: ['General', 'General › About'] })
    backButton()?.click()
    expect(path.value).toEqual(['General'])
    await vi.waitFor(() => expect(document.body.textContent).not.toContain('General › About content'), { timeout: 3000 })
    const done = [...document.querySelectorAll<HTMLButtonElement>('button')].find(element => element.textContent === 'Done')
    done?.click()
    expect(path.value).toEqual([])
    wrapper.unmount()
  })

  describe('motion', () => {
    it('reads the back chevron’s delay and spring through the theme on a push from the root', async () => {
      const { wrapper } = mountHarness()
      resolveMotionCalls.length = 0
      button('General')?.click()
      await nextTick()
      await nextTick()
      const container = document.querySelector('.astryx-navigation-stack')
      expect(resolveMotionCalls).toContainEqual([container, navigation, 'backChevronPushDelayMs'])
      expect(resolveMotionCalls).toContainEqual([container, springs.navigationBackButton])
      wrapper.unmount()
    })

    it('dims the covered screen at rest after a push', async () => {
      // 遮暗层的样式表不透明度是 0：停在 1 时引擎得把它留在行内。
      const sheet = document.head.appendChild(document.createElement('style'))
      sheet.textContent = '.astryx-navigation-stack__dim { opacity: 0 }'
      const { wrapper } = mountHarness()
      button('General')?.click()
      await vi.waitFor(() => expect(document.activeElement).toBe(heading('General', 2)), { timeout: 3000 })
      const dim = screenCard('Settings')?.querySelector<HTMLElement>('.astryx-navigation-stack__dim')
      expect(Number(dim?.style.opacity)).toBe(1)
      wrapper.unmount()
      sheet.remove()
    })

    it('drops the dimming under Reduce Motion: the change is a fade with no shade', async () => {
      stubMatchMedia(query => query.includes('prefers-reduced-motion: reduce'))
      const { wrapper } = mountHarness()
      button('General')?.click()
      await vi.waitFor(() => expect(document.activeElement).toBe(heading('General', 2)), { timeout: 3000 })
      const dim = screenCard('Settings')?.querySelector<HTMLElement>('.astryx-navigation-stack__dim')
      expect(Number(dim?.style.opacity ?? 0)).toBe(0)
      const barDim = document.querySelector<HTMLElement>('[data-navigation-bar="root"] [data-navigation-bar-dim]')
      expect(Number(barDim?.style.opacity ?? 0)).toBe(0)
      wrapper.unmount()
    })

    it('leaves both screens at rest once a push ends: the top card in place, the covered one at the parallax', async () => {
      const { wrapper } = mountHarness()
      button('General')?.click()
      await vi.waitFor(() => expect(document.activeElement).toBe(heading('General', 2)), { timeout: 3000 })
      const top = screenCard('General')!
      // 卡片宽度在 happy-dom 里是 0：视差位置也是 0，停下后没有残留的位移。
      expect(top.style.transform === '' || /translate(?:X|3d)?\(0(?:px)?/.test(top.style.transform) || top.style.transform === 'none').toBe(true)
      wrapper.unmount()
    })
  })
})
