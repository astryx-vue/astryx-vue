/**
 * @file SideNavRailMotion.test.ts
 * @input vitest (jsdom)、一个记录动画的 `Element.animate` 替身、手写的布局矩形
 * @output 侧栏收起、展开的轨道动效：布局一步落到最终宽度，旧轨道留一份副本，
 *   行内结束边被裁剪；不管谁引起的变化都播；初始状态不播；没有 Web Animations 或
 *   「减少动态效果」配精确指针时一步到位。真实几何由浏览器里的动效规格验证。
 */
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick, ref } from 'vue'
import SideNav from './SideNav.vue'
import SideNavItem from './SideNavItem.vue'

interface Played {
  element: Element
  keyframes: Keyframe[]
}

let played: Played[] = []
let media: Record<string, boolean> = {}
const originalAnimate = Element.prototype.animate
const originalMatchMedia = window.matchMedia

function setTimeline(currentTime: number): void {
  Object.defineProperty(document, 'timeline', { configurable: true, value: { currentTime } })
}

beforeEach(() => {
  played = []
  media = {}
  setTimeline(1000)
  vi.spyOn(performance, 'now').mockImplementation(() => Number(document.timeline?.currentTime ?? 0))
  Element.prototype.animate = function (this: Element, keyframes: Keyframe[] | PropertyIndexedKeyframes | null) {
    const entry: Played = { element: this, keyframes: keyframes as Keyframe[] }
    played.push(entry)
    return {
      cancel: vi.fn(),
      addEventListener() {},
      startTime: null,
      currentTime: 0,
      effect: { setKeyframes() {}, updateTiming() {} },
    } as unknown as Animation
  }
  window.matchMedia = (query: string) => ({
    matches: media[query] === true,
    media: query,
    addEventListener() {},
    removeEventListener() {},
  }) as unknown as MediaQueryList
  // jsdom 不排版：轨道宽度按收起状态给，其余元素没有尺寸。
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
    if (this.matches('nav.astryx-side-nav')) {
      const width = this.hasAttribute('data-collapsed') ? 48 : 260
      return DOMRect.fromRect({ x: 0, y: 0, width, height: 600 })
    }
    if (this.id === 'row')
      return DOMRect.fromRect({ x: 0, y: 0, width: 800, height: 600 })
    return DOMRect.fromRect({ x: 0, y: 0, width: 0, height: 0 })
  })
})

afterEach(() => {
  Element.prototype.animate = originalAnimate
  window.matchMedia = originalMatchMedia
  vi.restoreAllMocks()
  document.body.innerHTML = ''
})

function mountRail(initial = false) {
  const collapsed = ref(initial)
  const row = document.createElement('div')
  row.id = 'row'
  document.body.append(row)
  const wrapper = mount({
    setup: () => () => h(SideNav, {
      'collapsible': true,
      'isCollapsed': collapsed.value,
      'onUpdate:isCollapsed': (value: boolean) => {
        collapsed.value = value
      },
    }, () => h(SideNavItem, { href: '/home', iconClass: 'i-carbon-home', label: 'Home' })),
  }, { attachTo: row })
  return { collapsed, row, wrapper }
}

/** 轨道自己的 nav：动效期间旧轨道的副本排在它前面。 */
function realNav(wrapper: { findAll: (selector: string) => Array<{ element: Element, attributes: (name: string) => string | undefined }> }) {
  return wrapper.findAll('nav').at(-1)!
}

async function settle(): Promise<void> {
  await nextTick()
  await nextTick()
  await Promise.resolve()
  await Promise.resolve()
  await Promise.resolve()
}

describe('side-nav rail motion', () => {
  it('collapses by holding the old rail as a copy and clipping its inline-end edge', async () => {
    const { wrapper, row } = mountRail()
    await settle()
    setTimeline(1100)

    await wrapper.get('[aria-label="Collapse sidebar"]').trigger('click')
    await settle()

    const nav = realNav(wrapper).element
    expect(nav.getAttribute('data-collapsed')).toBe('true')
    // 旧的展开态轨道留成一份副本，放在轨道所在的那一行里。
    const copy = Array.from(row.querySelectorAll('.astryx-side-nav')).find(element => element !== nav)
    expect(copy).toBeDefined()
    expect(copy?.textContent).toContain('Home')
    // 副本被裁到新宽度：从 260px 一路裁掉 212px。
    const clipped = played.find(entry => entry.element === copy && entry.keyframes.some(frame => frame.clipPath != null))
    expect(clipped).toBeDefined()
    const last = String(clipped?.keyframes.at(-1)?.clipPath)
    expect(last).toContain('212px')
    // 真正的收起态轨道（图标）淡入。
    const fadeIn = played.find(entry => entry.element === nav && entry.keyframes.some(frame => frame.opacity != null))
    expect(fadeIn).toBeDefined()
  })

  it('expands by clipping the real rail open from the width it showed', async () => {
    const { wrapper } = mountRail(true)
    await settle()
    setTimeline(1100)

    await wrapper.get('[aria-label="Expand sidebar"]').trigger('click')
    await settle()

    const nav = wrapper.get('nav').element
    const reveal = played.find(entry => entry.element === nav && entry.keyframes.some(frame => frame.clipPath != null))
    expect(reveal).toBeDefined()
    expect(String(reveal?.keyframes[0]?.clipPath)).toContain('212px')
  })

  it('plays for a change the owner makes through the prop, not only the toggle', async () => {
    const { collapsed, wrapper } = mountRail()
    await settle()
    setTimeline(1100)

    collapsed.value = true
    await settle()

    expect(realNav(wrapper).attributes('data-collapsed')).toBe('true')
    expect(played.some(entry => entry.keyframes.some(frame => frame.clipPath != null))).toBe(true)
  })

  it('lands at once when the state changes before the first frame after mount', async () => {
    const { collapsed, wrapper } = mountRail()
    // 时间线没有走过任何一帧：还是初始状态。
    collapsed.value = true
    await settle()

    expect(wrapper.get('nav').attributes('data-collapsed')).toBe('true')
    expect(played).toHaveLength(0)
  })

  it('lands at once without Web Animations', async () => {
    const { wrapper } = mountRail()
    await settle()
    setTimeline(1100)
    // @ts-expect-error 模拟没有 Web Animations 的环境
    Element.prototype.animate = undefined

    await wrapper.get('[aria-label="Collapse sidebar"]').trigger('click')
    await settle()

    expect(wrapper.get('nav').attributes('data-collapsed')).toBe('true')
    expect(played).toHaveLength(0)
  })

  it('lands at once under Reduce Motion with a fine pointer', async () => {
    media['(prefers-reduced-motion: reduce)'] = true
    const { wrapper } = mountRail()
    await settle()
    setTimeline(1100)

    await wrapper.get('[aria-label="Collapse sidebar"]').trigger('click')
    await settle()

    expect(wrapper.get('nav').attributes('data-collapsed')).toBe('true')
    expect(played.some(entry => entry.keyframes.some(frame => frame.clipPath != null))).toBe(false)
  })
})
