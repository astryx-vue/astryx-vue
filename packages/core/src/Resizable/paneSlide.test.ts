/**
 * @file paneSlide.test.ts
 * @input vitest (jsdom)、替换掉的边缘揭示和动画器、真实的 useResizable、LayoutPanel、ResizeHandle
 * @output 区域收起、展开时 LayoutPanel 从朝分隔条的边滑开滑合；指针拖开收起的面板跟手不滑；
 *   拉过限位只画出分隔条的橡皮筋并弹回；松手才决定收不收起
 */
import type { UseResizableSingleOptions } from '../composables/useResizable.js'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, reactive } from 'vue'
import { useResizable } from '../composables/useResizable.js'
import LayoutPanel from '../Layout/LayoutPanel.vue'
import ResizeHandle from './ResizeHandle.vue'

const reveal = vi.hoisted(() => ({
  log: [] as { step: string, width: string, edge?: string }[],
  glides: [] as { durationMs: number }[],
}))

vi.mock('../motion/layout/index.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../motion/layout/index.js')>()
  return {
    ...actual,
    reportLayoutEdge: (_layout: unknown, element: () => HTMLElement, options: { edge: string }) => ({
      measureBefore: () => reveal.log.push({ step: 'measure', width: element().style.width, edge: options.edge }),
      animate: () => reveal.log.push({ step: 'animate', width: element().style.width }),
      cancel: () => reveal.log.push({ step: 'cancel', width: element().style.width }),
    }),
    glideNextChange: (_row: Element, progress: { durationMs: number }) => reveal.glides.push(progress),
  }
})

const drawn = vi.hoisted(() => ({
  sets: [] as { x?: number }[],
  springs: [] as { to: { x?: number }, velocity?: { x?: number } }[],
}))

vi.mock('../motion/animator.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../motion/animator.js')>()
  return {
    ...actual,
    animatorFor: () => ({
      set: (values: { x?: number }) => drawn.sets.push(values),
      get: () => 0,
      animate: (to: { x?: number }, transition: { velocity?: { x?: number } }) => {
        drawn.springs.push({ to, velocity: transition.velocity })
        return { finished: new Promise(() => {}) }
      },
    }),
  }
})

beforeEach(() => {
  reveal.log = []
  reveal.glides = []
  drawn.sets = []
  drawn.springs = []
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
    callback(0)
    return 0
  })
})

afterEach(() => {
  vi.restoreAllMocks()
  document.body.innerHTML = ''
})

type Panel = 'region' | 'hand-built' | 'size-only'

function mountRow(options: UseResizableSingleOptions = {}, panel: Panel = 'region') {
  const state = reactive<{ region: ReturnType<typeof useResizable> | null }>({ region: null })
  const Host = defineComponent({
    setup() {
      const region = useResizable({ defaultSize: 200, minSize: 100, maxSize: 400, collapsible: true, ...options })
      state.region = region
      return () => h('div', { class: 'row' }, [
        panel === 'region'
          ? h(LayoutPanel, { resizable: region })
          : panel === 'hand-built'
            ? h(LayoutPanel, { resizable: { ...region.props } })
            : h(LayoutPanel, { width: region.size }),
        h(ResizeHandle, { resizable: region, label: 'Resize' }),
        h('div', { class: 'content' }),
      ])
    },
  })
  const wrapper = mount(Host, { attachTo: document.body })
  return { wrapper, region: () => state.region! }
}

function pointer(target: Element, type: string, clientX: number, timeStamp: number): void {
  const event = new Event(type, { bubbles: true, cancelable: true })
  Object.defineProperties(event, {
    pointerId: { value: 1 },
    clientX: { value: clientX },
    clientY: { value: 0 },
    timeStamp: { value: timeStamp },
  })
  target.dispatchEvent(event)
}

async function drag(wrapper: ReturnType<typeof mount>, moves: [number, number][], end = true): Promise<void> {
  const hit = wrapper.get('.astryx-resize-handle__hit').element
  pointer(hit, 'pointerdown', 0, 0)
  for (const [x, t] of moves)
    pointer(hit, 'pointermove', x, t)
  await nextTick()
  if (end) {
    const [x, t] = moves.at(-1) ?? [0, 0]
    pointer(hit, 'pointerup', x, t)
  }
  await nextTick()
}

const steps = () => reveal.log.map(entry => `${entry.step}@${entry.width}`)

describe('a LayoutPanel given the hook\'s value slides closed and open', () => {
  it('measures before the width changes and plays once the pane renders its new size', async () => {
    const { region } = mountRow()
    region().collapse()
    await nextTick()
    expect(steps()).toEqual(['measure@200px', 'animate@0px'])
    expect(reveal.log[0]?.edge).toBe('inline-end')

    reveal.log = []
    region().expand()
    await nextTick()
    expect(steps()).toEqual(['measure@0px', 'animate@200px'])

    // 手写的对象、只用 size 撑开的面板没有区域可借，不滑动。
    for (const panel of ['hand-built', 'size-only'] as const) {
      reveal.log = []
      const other = mountRow({}, panel)
      other.region().collapse()
      await nextTick()
      other.region().expand()
      await nextTick()
      expect(reveal.log).toEqual([])
      other.wrapper.unmount()
    }
  })

  it('slides on Enter and on a controlled isCollapsed', async () => {
    const { wrapper } = mountRow()
    await wrapper.get('[role="separator"]').trigger('keydown', { key: 'Enter' })
    await nextTick()
    expect(steps()).toEqual(['measure@200px', 'animate@0px'])

    const state = reactive({ isCollapsed: false })
    reveal.log = []
    document.body.innerHTML = ''
    const Controlled = defineComponent({
      setup() {
        const region = useResizable({
          defaultSize: 200,
          collapsible: true,
          get isCollapsed() { return state.isCollapsed },
        })
        return () => h('div', [h(LayoutPanel, { resizable: region }), h(ResizeHandle, { resizable: region })])
      },
    })
    mount(Controlled, { attachTo: document.body })
    state.isCollapsed = true
    await nextTick()
    expect(steps()).toEqual(['measure@200px', 'animate@0px'])
  })

  it('follows the pointer, with no slide, when a drag reopens a collapsed pane', async () => {
    const { region, wrapper } = mountRow({ defaultIsCollapsed: true })
    expect(region().isCollapsed).toBe(true)
    await drag(wrapper, [[60, 16], [150, 32]])
    expect(region().isCollapsed).toBe(false)
    expect(reveal.log.filter(entry => entry.step === 'measure')).toEqual([])
  })

  it('opens with a slide when an arrow key steps a collapsed pane open', async () => {
    const { region, wrapper } = mountRow({ defaultIsCollapsed: true })
    await wrapper.get('[role="separator"]').trigger('keydown', { key: 'ArrowRight' })
    await nextTick()
    expect(region().isCollapsed).toBe(false)
    expect(steps()).toEqual(['measure@0px', 'animate@110px'])
  })
})

describe('the lift decides a close', () => {
  it('keeps an open pane at its minimum mid-drag and closes it on a slow lift past the threshold', async () => {
    const onCollapseChange = vi.fn()
    const { region, wrapper } = mountRow({ onCollapseChange })
    await drag(wrapper, [[-100, 400], [-180, 800]], false)
    expect(region().isCollapsed).toBe(false)
    expect(region().size).toBe(100)
    expect(onCollapseChange).not.toHaveBeenCalled()

    pointer(wrapper.get('.astryx-resize-handle__hit').element, 'pointerup', -180, 1600)
    await nextTick()
    expect(region().isCollapsed).toBe(true)
    expect(onCollapseChange).toHaveBeenCalledWith(true)
    // 收起的滑动按 settle 弹簧走，而不是主题曲线。
    expect(reveal.glides).toHaveLength(1)
    expect(steps()).toEqual(['measure@100px', 'animate@0px'])
  })

  it('closes on a flick toward closing from above the threshold, and springs back on a slow lift', async () => {
    const flicked = mountRow()
    await drag(flicked.wrapper, [[-40, 10], [-90, 20]])
    expect(flicked.region().isCollapsed).toBe(true)
    flicked.wrapper.unmount()

    const slow = mountRow()
    await drag(slow.wrapper, [[-50, 400], [-90, 1600]])
    expect(slow.region().isCollapsed).toBe(false)
    expect(slow.region().size).toBe(110)
  })

  it('restores the size the drag started from when the closed pane opens', async () => {
    const { region, wrapper } = mountRow()
    await drag(wrapper, [[-100, 400], [-180, 1600]])
    expect(region().isCollapsed).toBe(true)
    region().expand()
    expect(region().size).toBe(200)
  })
})

describe('a controlled isCollapsed', () => {
  it('reports a drag that reopens the region and leaves the state to the owner', async () => {
    const onCollapseChange = vi.fn()
    const { region, wrapper } = mountRow({ isCollapsed: true, onCollapseChange })
    await drag(wrapper, [[60, 16], [150, 32]])
    expect(onCollapseChange).toHaveBeenCalledWith(false)
    expect(region().isCollapsed).toBe(true)
  })
})

describe('a pull past a limit rubber-bands', () => {
  it('keeps the size at the maximum, draws the handle at most 8 px past it, and springs back after the lift', async () => {
    const { region, wrapper } = mountRow()
    await drag(wrapper, [[150, 200], [400, 400], [800, 1600]])
    expect(region().size).toBe(400)
    const xs = drawn.sets.map(entry => entry.x ?? 0)
    expect(Math.max(...xs)).toBeGreaterThan(0)
    expect(Math.max(...xs)).toBeLessThanOrEqual(8)
    expect(drawn.springs).toHaveLength(1)
    expect(drawn.springs[0]?.to).toEqual({ x: 0 })
    expect(region().isCollapsed).toBe(false)

    // 只用 size 撑开的面板停在限位上，什么都不画。
    drawn.sets = []
    drawn.springs = []
    const sizeOnly = mountRow({}, 'size-only')
    await drag(sizeOnly.wrapper, [[400, 400], [800, 1600]])
    expect(sizeOnly.region().size).toBe(400)
    expect(drawn.sets).toEqual([])
    expect(drawn.springs).toEqual([])
  })
})

describe('the separator value', () => {
  it('keeps aria-valuenow within its bounds', () => {
    const wrapper = mount(ResizeHandle, {
      props: {
        resizable: {
          _size: 520,
          _isCollapsed: false,
          _onResizeStart: () => {},
          _onResizeMove: () => {},
          _onResizeEnd: () => {},
          _minSizePx: 100,
          _maxSizePx: 400,
          _snaps: [],
          _collapsedSize: 40,
          _collapsible: false,
          _isResizableProps: true,
        },
      },
      attachTo: document.body,
    })
    expect(wrapper.get('[role="separator"]').attributes('aria-valuenow')).toBe('400')
  })
})

describe('the handle above the gliding content', () => {
  it('stacks the handle above the content beside it, which a slide translates', () => {
    const css = readFileSync(resolve(process.cwd(), 'packages/core/styles/resize-handle.css'), 'utf8')
    const start = css.indexOf('.astryx-resize-handle {')
    expect(css.slice(start, css.indexOf('}', start))).toMatch(/z-index:\s*2/)
  })
})
