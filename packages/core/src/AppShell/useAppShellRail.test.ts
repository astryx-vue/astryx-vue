/**
 * @file useAppShellRail.test.ts
 * @input vitest (jsdom)、记录动画的 `Element.animate` 替身、手写的布局矩形
 * @output 侧栏收起、展开时内容区跟着动：内容把旧的一层留成副本、新的一层淡入，
 *   内容列从旧位置滑过来；没有动画能力或没有量过时什么都不播
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { useAppShellRail } from './useAppShellRail.js'

interface Played {
  element: Element
  keyframes: Keyframe[]
}

let played: Played[] = []
const originalAnimate = Element.prototype.animate
const originalMatchMedia = window.matchMedia
let mainLeft = 260

beforeEach(() => {
  played = []
  mainLeft = 260
  Object.defineProperty(document, 'timeline', { configurable: true, value: { currentTime: 1000 } })
  vi.spyOn(performance, 'now').mockImplementation(() => 1000)
  Element.prototype.animate = function (this: Element, keyframes: Keyframe[] | PropertyIndexedKeyframes | null) {
    played.push({ element: this, keyframes: keyframes as Keyframe[] })
    return {
      cancel: vi.fn(),
      addEventListener() {},
      startTime: null,
      currentTime: 0,
      effect: { setKeyframes() {}, updateTiming() {} },
    } as unknown as Animation
  }
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    addEventListener() {},
    removeEventListener() {},
  }) as unknown as MediaQueryList
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
    if (this.id === 'main')
      return DOMRect.fromRect({ x: mainLeft, y: 0, width: 800 - mainLeft, height: 600 })
    if (this.id === 'column')
      return DOMRect.fromRect({ x: mainLeft, y: 0, width: 800 - mainLeft, height: 600 })
    if (this.id === 'root' || this.id === 'row')
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

function setup() {
  document.body.innerHTML = `
    <div id="root"><div id="row">
      <div id="rail"></div>
      <div id="column"><div id="main"><p id="content">Dashboard</p></div></div>
    </div></div>`
  const element = (id: string) => ref(document.getElementById(id))
  return useAppShellRail({
    root: element('root'),
    rail: element('rail'),
    main: element('main'),
    backdrop: ref(null),
  })
}

describe('app-shell rail', () => {
  it('reports the rail, and the column beside it that holds main', () => {
    const shell = setup()
    expect(shell.rail()?.id).toBe('rail')
    expect(shell.column()?.id).toBe('column')
  })

  it('holds the old content as a copy and fades the new content in', async () => {
    const shell = setup()
    shell.beforeRailChange()
    mainLeft = 48
    const end = shell.afterRailChange()
    // 骑在滑动上的部分在下一个微任务里开始播。
    await Promise.resolve()
    await Promise.resolve()
    await Promise.resolve()

    const content = document.getElementById('content')!
    const fadeIn = played.find(entry => entry.element === content && entry.keyframes.some(frame => frame.opacity != null))
    expect(fadeIn).toBeDefined()
    // 旧内容的副本和轨道旁边的内容列并排放在同一行里。
    const row = document.getElementById('row')!
    expect(row.querySelector('[inert]')?.textContent).toContain('Dashboard')
    end()
    expect(row.querySelector('[inert]')).toBeNull()
  })

  it('plays nothing for a change that was not measured first', () => {
    const shell = setup()
    const end = shell.afterRailChange()
    expect(played).toHaveLength(0)
    end()
  })
})
