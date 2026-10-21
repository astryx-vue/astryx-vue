import type { VueWrapper } from '@vue/test-utils'
import type { ResizableProps, UseResizableSingleOptions } from '../composables/useResizable.js'
import type { ResizeHandleProps } from './types.js'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { renderToString } from '@vue/server-renderer'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createSSRApp, defineComponent, h, nextTick, ref } from 'vue'
import { useResizable } from '../composables/useResizable.js'
import ResizeHandle from './ResizeHandle.vue'

const KEYBOARD_STEP = 10
const KEYBOARD_LARGE_STEP = 50

/** 真实的 useResizable 区域，键盘调整后 aria-valuenow 会跟着变。 */
function mountWithRegion(handleProps: Partial<ResizeHandleProps> = {}) {
  const Host = defineComponent({
    setup() {
      const region = useResizable({ defaultSize: 200, minSize: 100, maxSize: 400 })
      return () => h(ResizeHandle, { resizable: region.props, label: 'Resize', ...handleProps })
    },
  })
  return mount(Host, { attachTo: document.body })
}

/** 回调都是 spy 的假区域，拖动相关的断言直接读调用记录。 */
function makeResizable(overrides: Partial<ResizableProps> = {}): ResizableProps {
  return {
    _size: 200,
    _isCollapsed: false,
    _onResizeStart: vi.fn(),
    _onResizeMove: vi.fn(),
    _onResizeEnd: vi.fn(),
    _minSizePx: 100,
    _maxSizePx: 400,
    _snaps: [],
    _collapsedSize: 40,
    _collapsible: false,
    _isResizableProps: true,
    ...overrides,
  }
}

function mountStub(resizable: ResizableProps, props: Partial<ResizeHandleProps> = {}) {
  return mount(ResizeHandle, { props: { resizable, label: 'Resize', ...props }, attachTo: document.body })
}

/**
 * 拿到 separator 元素本身。开发模式下 Vue 保留模板注释，组件根节点是 Fragment，
 * 所以断言和事件都要落在这个元素上，不能直接用 wrapper 的根节点。
 */
function separatorOf(wrapper: VueWrapper) {
  return wrapper.get('[role="separator"]')
}

function nextFrame() {
  return new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
}

let warn: ReturnType<typeof vi.spyOn>

beforeEach(() => {
  warn = vi.spyOn(console, 'warn')
})

afterEach(() => {
  expect(warn).not.toHaveBeenCalled()
  warn.mockRestore()
  document.body.innerHTML = ''
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
})

describe('resizeHandle structure and ARIA', () => {
  it('exposes the region size and bounds on a focusable separator', () => {
    const wrapper = mountWithRegion()
    const separator = wrapper.get('[role="separator"]')
    expect(separator.attributes('aria-valuenow')).toBe('200')
    expect(separator.attributes('aria-valuemin')).toBe('100')
    expect(separator.attributes('aria-valuemax')).toBe('400')
    expect(separator.attributes('aria-label')).toBe('Resize')
    expect(separator.attributes('tabindex')).toBe('0')
    expect(separator.attributes('aria-valuetext')).toBeUndefined()
    expect(separator.attributes('aria-disabled')).toBeUndefined()
    expect(separator.classes()).toContain('astryx-resize-handle')
    expect(separator.find('.astryx-resize-handle__hit').exists()).toBe(true)
    expect(separator.find('.astryx-resize-handle-pill').exists()).toBe(true)
  })

  it('splits along the cross axis: a horizontal handle is a vertical separator', () => {
    const horizontal = mountStub(makeResizable())
    expect(separatorOf(horizontal).attributes('aria-orientation')).toBe('vertical')
    expect(separatorOf(horizontal).attributes('data-direction')).toBe('horizontal')
    const vertical = mountStub(makeResizable(), { direction: 'vertical' })
    expect(separatorOf(vertical).attributes('aria-orientation')).toBe('horizontal')
    expect(separatorOf(vertical).attributes('data-direction')).toBe('vertical')
  })

  it('falls back to the localized default name', () => {
    const wrapper = mount(ResizeHandle, { props: { resizable: makeResizable() } })
    expect(separatorOf(wrapper).attributes('aria-label')).toBe('Resize handle')
  })

  it('leaves out the value attributes when no region is wired', () => {
    const wrapper = mount(ResizeHandle)
    expect(separatorOf(wrapper).attributes('role')).toBe('separator')
    expect(separatorOf(wrapper).attributes('aria-valuenow')).toBeUndefined()
    expect(separatorOf(wrapper).attributes('aria-valuemin')).toBeUndefined()
    expect(separatorOf(wrapper).attributes('aria-valuemax')).toBeUndefined()
  })

  it('omits aria-valuemax for an unbounded region', () => {
    const wrapper = mountStub(makeResizable({ _maxSizePx: Number.POSITIVE_INFINITY }))
    expect(separatorOf(wrapper).attributes('aria-valuemax')).toBeUndefined()
  })

  it('keeps aria-valuenow at or above the minimum and announces "Collapsed" while collapsed', () => {
    const wrapper = mountStub(makeResizable({ _size: 40, _isCollapsed: true, _collapsible: true }))
    expect(separatorOf(wrapper).attributes('aria-valuenow')).toBe('100')
    expect(separatorOf(wrapper).attributes('aria-valuetext')).toBe('Collapsed')
  })

  it('reflects position, divider and pill visibility as data attributes', () => {
    const wrapper = mountStub(makeResizable(), { position: 'overlay', hasDivider: true, isAlwaysVisible: false })
    expect(separatorOf(wrapper).attributes('data-position')).toBe('overlay')
    expect(separatorOf(wrapper).attributes('data-divider')).toBe('true')
    expect(wrapper.get('.astryx-resize-handle-pill').attributes('data-hidden')).toBe('true')
  })

  it('replaces the pill with the default slot', () => {
    const wrapper = mount(ResizeHandle, {
      props: { resizable: makeResizable() },
      slots: { default: () => h('span', { class: 'custom-grip' }) },
    })
    expect(wrapper.find('.custom-grip').exists()).toBe(true)
    expect(wrapper.find('.astryx-resize-handle-pill').exists()).toBe(false)
  })

  it('places a centered pill on the divider and an auto pill on the panel side', () => {
    const centered = mountStub(makeResizable(), { pillPlacement: 'center' })
    expect(centered.get('.astryx-resize-handle-pill').attributes('style')).toContain('translateX(-50%)')
    const auto = mountStub(makeResizable())
    expect(auto.get('.astryx-resize-handle-pill').attributes('style')).toContain('calc(-1 * (100% + var(--astryx-spacing-1, 4px)))')
    const collapsed = mountStub(makeResizable({ _isCollapsed: true }))
    expect(collapsed.get('.astryx-resize-handle-pill').attributes('style')).toContain('calc(1 * (100% + var(--astryx-spacing-1, 4px)))')
  })

  it('forwards attributes and keeps class and style on the root', () => {
    const wrapper = mount(ResizeHandle, {
      props: { resizable: makeResizable() },
      attrs: { 'class': 'extra', 'style': 'color: red;', 'data-testid': 'handle' },
    })
    expect(separatorOf(wrapper).classes()).toEqual(expect.arrayContaining(['astryx-resize-handle', 'extra']))
    expect(separatorOf(wrapper).attributes('style')).toContain('color: red')
    expect(separatorOf(wrapper).attributes('data-testid')).toBe('handle')
  })

  it('marks the handle active while focused', async () => {
    const wrapper = mountStub(makeResizable())
    expect(separatorOf(wrapper).attributes('data-active')).toBeUndefined()
    await separatorOf(wrapper).trigger('focus')
    expect(separatorOf(wrapper).attributes('data-active')).toBe('true')
    await separatorOf(wrapper).trigger('blur')
    expect(separatorOf(wrapper).attributes('data-active')).toBeUndefined()
  })
})

describe('resizeHandle keyboard', () => {
  it.each([
    ['ArrowRight', false, 200 + KEYBOARD_STEP],
    ['ArrowDown', false, 200 + KEYBOARD_STEP],
    ['ArrowLeft', false, 200 - KEYBOARD_STEP],
    ['ArrowUp', false, 200 - KEYBOARD_STEP],
    ['ArrowRight', true, 200 + KEYBOARD_LARGE_STEP],
    ['ArrowLeft', true, 200 - KEYBOARD_LARGE_STEP],
    ['Home', false, 100],
    ['End', false, 400],
  ])('%s (shift: %s) moves the region to %i', async (key, shiftKey, expected) => {
    const wrapper = mountWithRegion()
    const separator = wrapper.get('[role="separator"]')
    await separator.trigger('keydown', { key, shiftKey })
    expect(separator.attributes('aria-valuenow')).toBe(String(expected))
  })

  it('reverses the arrows when the panel sits at the end edge', async () => {
    const resizable = makeResizable()
    const wrapper = mountStub(resizable, { isReversed: true })
    await separatorOf(wrapper).trigger('keydown', { key: 'ArrowRight' })
    expect(resizable._onResizeMove).toHaveBeenLastCalledWith(-KEYBOARD_STEP)
  })

  it('wraps every key move in a start, move and end', async () => {
    const resizable = makeResizable()
    const wrapper = mountStub(resizable)
    await separatorOf(wrapper).trigger('keydown', { key: 'ArrowRight' })
    expect(resizable._onResizeStart).toHaveBeenCalledTimes(1)
    expect(resizable._onResizeMove).toHaveBeenCalledWith(KEYBOARD_STEP)
    expect(resizable._onResizeEnd).toHaveBeenCalledTimes(1)
  })

  it('leaves an unbounded region alone on End', async () => {
    const resizable = makeResizable({ _maxSizePx: Number.POSITIVE_INFINITY })
    const wrapper = mountStub(resizable)
    await separatorOf(wrapper).trigger('keydown', { key: 'End' })
    expect(resizable._onResizeMove).not.toHaveBeenCalled()
  })

  it('collapses and reopens a collapsible region on Enter', async () => {
    const open = makeResizable({ _collapsible: true })
    await separatorOf(mountStub(open)).trigger('keydown', { key: 'Enter' })
    expect(open._onResizeMove).toHaveBeenLastCalledWith(-200)

    const closed = makeResizable({ _collapsible: true, _isCollapsed: true, _size: 40 })
    await separatorOf(mountStub(closed)).trigger('keydown', { key: 'Enter' })
    expect(closed._onResizeMove).toHaveBeenLastCalledWith(100)
  })

  it('ignores Enter when the region is not collapsible', async () => {
    const resizable = makeResizable()
    await separatorOf(mountStub(resizable)).trigger('keydown', { key: 'Enter' })
    expect(resizable._onResizeMove).not.toHaveBeenCalled()
  })

  it('toggles a collapsible region on double-click', async () => {
    const resizable = makeResizable({ _collapsible: true })
    await separatorOf(mountStub(resizable)).trigger('dblclick')
    expect(resizable._onResizeMove).toHaveBeenLastCalledWith(-200)
  })
})

describe('resizeHandle pointer drag', () => {
  it('takes pointer capture on the grab zone when a drag starts', async () => {
    const wrapper = mountStub(makeResizable())
    const hit = wrapper.get('.astryx-resize-handle__hit')
    const setPointerCapture = vi.fn()
    Object.defineProperty(hit.element, 'setPointerCapture', { value: setPointerCapture, configurable: true })
    await hit.trigger('pointerdown', { pointerId: 7, clientX: 0, clientY: 0 })
    expect(setPointerCapture).toHaveBeenCalledWith(7)
  })

  it('drives and ends the drag, and restores body styles', async () => {
    const resizable = makeResizable()
    const wrapper = mountStub(resizable)
    const hit = wrapper.get('.astryx-resize-handle__hit')

    await hit.trigger('pointerdown', { pointerId: 1, clientX: 0, clientY: 0 })
    expect(resizable._onResizeStart).toHaveBeenCalledTimes(1)
    expect(separatorOf(wrapper).attributes('data-resizing')).toBe('true')
    expect(document.body.style.cursor).toBe('col-resize')
    expect(document.body.style.userSelect).toBe('none')

    await hit.trigger('pointermove', { pointerId: 1, clientX: 30, clientY: 0 })
    await nextFrame()
    expect(resizable._onResizeMove).toHaveBeenLastCalledWith(30)

    await hit.trigger('pointerup', { pointerId: 1, clientX: 30, clientY: 0 })
    expect(resizable._onResizeEnd).toHaveBeenCalledTimes(1)
    expect(separatorOf(wrapper).attributes('data-resizing')).toBeUndefined()
    expect(document.body.style.cursor).toBe('')
    expect(document.body.style.userSelect).toBe('')

    const moves = vi.mocked(resizable._onResizeMove).mock.calls.length
    await hit.trigger('pointermove', { pointerId: 1, clientX: 90, clientY: 0 })
    await nextFrame()
    expect(resizable._onResizeMove).toHaveBeenCalledTimes(moves)
  })

  it('uses the block axis and row-resize cursor for a vertical handle', async () => {
    const resizable = makeResizable()
    const hit = mountStub(resizable, { direction: 'vertical' }).get('.astryx-resize-handle__hit')
    await hit.trigger('pointerdown', { pointerId: 1, clientX: 0, clientY: 0 })
    expect(document.body.style.cursor).toBe('row-resize')
    await hit.trigger('pointermove', { pointerId: 1, clientX: 99, clientY: 25 })
    await hit.trigger('pointerup', { pointerId: 1, clientX: 99, clientY: 25 })
    expect(resizable._onResizeMove).toHaveBeenLastCalledWith(25)
  })

  it('ignores moves from a pointer that does not own the drag', async () => {
    const resizable = makeResizable()
    const hit = mountStub(resizable).get('.astryx-resize-handle__hit')
    await hit.trigger('pointerdown', { pointerId: 1, clientX: 0, clientY: 0 })
    await hit.trigger('pointermove', { pointerId: 2, clientX: 30, clientY: 0 })
    await nextFrame()
    expect(resizable._onResizeMove).not.toHaveBeenCalled()
  })

  it.each(['pointercancel', 'lostpointercapture'])('ends the drag on %s with a cancel, not an end', async (event) => {
    const resizable = makeResizable({ _onResizeCancel: vi.fn() })
    const hit = mountStub(resizable).get('.astryx-resize-handle__hit')
    await hit.trigger('pointerdown', { pointerId: 1, clientX: 0, clientY: 0 })
    await hit.trigger(event, { pointerId: 1 })
    expect(resizable._onResizeCancel).toHaveBeenCalledTimes(1)
    expect(resizable._onResizeEnd).not.toHaveBeenCalled()
    expect(document.body.style.cursor).toBe('')
    await hit.trigger('pointermove', { pointerId: 1, clientX: 30, clientY: 0 })
    await nextFrame()
    expect(resizable._onResizeMove).not.toHaveBeenCalled()
  })

  it('does not report a cancel for a drag that ended normally', async () => {
    const resizable = makeResizable({ _onResizeCancel: vi.fn() })
    const hit = mountStub(resizable).get('.astryx-resize-handle__hit')
    await hit.trigger('pointerdown', { pointerId: 1, clientX: 0, clientY: 0 })
    await hit.trigger('pointerup', { pointerId: 1, clientX: 30, clientY: 0 })
    await hit.trigger('lostpointercapture', { pointerId: 1 })
    expect(resizable._onResizeCancel).not.toHaveBeenCalled()
  })

  it('reverses the pointer delta when the panel sits at the end edge', async () => {
    const resizable = makeResizable()
    const hit = mountStub(resizable, { isReversed: true }).get('.astryx-resize-handle__hit')
    await hit.trigger('pointerdown', { pointerId: 1, clientX: 0, clientY: 0 })
    await hit.trigger('pointermove', { pointerId: 1, clientX: 40, clientY: 0 })
    await hit.trigger('pointerup', { pointerId: 1, clientX: 40, clientY: 0 })
    expect(resizable._onResizeMove).toHaveBeenLastCalledWith(-40)
  })

  it('inverts the pointer delta under RTL', async () => {
    const resizable = makeResizable()
    const wrapper = mountStub(resizable)
    const separator = separatorOf(wrapper).element
    const real = window.getComputedStyle
    const spy = vi.spyOn(window, 'getComputedStyle').mockImplementation((el: Element, pseudo?: string | null) =>
      el === separator ? ({ direction: 'rtl' } as CSSStyleDeclaration) : real(el, pseudo ?? undefined))
    const hit = wrapper.get('.astryx-resize-handle__hit')
    await hit.trigger('pointerdown', { pointerId: 1, clientX: 0, clientY: 0 })
    await hit.trigger('pointermove', { pointerId: 1, clientX: 40, clientY: 0 })
    await hit.trigger('pointerup', { pointerId: 1, clientX: 40, clientY: 0 })
    expect(resizable._onResizeMove).toHaveBeenLastCalledWith(-40)
    spy.mockRestore()
  })

  it('releases body styles when unmounted mid-drag', async () => {
    const resizable = makeResizable()
    const wrapper = mountStub(resizable)
    await wrapper.get('.astryx-resize-handle__hit').trigger('pointerdown', { pointerId: 1, clientX: 0, clientY: 0 })
    expect(document.body.style.cursor).toBe('col-resize')
    wrapper.unmount()
    expect(document.body.style.cursor).toBe('')
    expect(document.body.style.userSelect).toBe('')
  })
})

describe('resizeHandle disabled', () => {
  it('drops out of the tab order and marks itself disabled', () => {
    const wrapper = mountStub(makeResizable(), { isDisabled: true })
    expect(separatorOf(wrapper).attributes('tabindex')).toBe('-1')
    expect(separatorOf(wrapper).attributes('aria-disabled')).toBe('true')
    expect(separatorOf(wrapper).attributes('data-disabled')).toBe('true')
  })

  it('ignores keyboard, double-click and drag', async () => {
    const resizable = makeResizable({ _collapsible: true })
    const wrapper = mountStub(resizable, { isDisabled: true })
    await separatorOf(wrapper).trigger('keydown', { key: 'ArrowRight' })
    await separatorOf(wrapper).trigger('keydown', { key: 'Enter' })
    await separatorOf(wrapper).trigger('dblclick')
    await wrapper.get('.astryx-resize-handle__hit').trigger('pointerdown', { pointerId: 1, clientX: 0, clientY: 0 })
    expect(resizable._onResizeStart).not.toHaveBeenCalled()
    expect(resizable._onResizeMove).not.toHaveBeenCalled()
    expect(document.body.style.cursor).toBe('')
  })
})

function setWindowSize(width: number, height = window.innerHeight): () => void {
  const previousWidth = window.innerWidth
  const previousHeight = window.innerHeight
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: width })
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: height })
  return () => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: previousWidth })
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: previousHeight })
  }
}

function mountUnbounded(options: UseResizableSingleOptions = {}, handleProps: Partial<ResizeHandleProps> = {}) {
  const Host = defineComponent({
    setup() {
      const region = useResizable({ defaultSize: 200, minSize: 100, ...options })
      return () => h(ResizeHandle, {
        resizable: region.props,
        label: 'Resize',
        direction: options.direction,
        ...handleProps,
      })
    },
  })
  return mount(Host, { attachTo: document.body })
}

describe('resizeHandle reported maximum', () => {
  it('reports the window width when no maximum is configured, and End stays put', async () => {
    const restore = setWindowSize(1000, 700)
    const wrapper = mountUnbounded()
    await nextTick()
    const separator = wrapper.get('[role="separator"]')
    expect(separator.attributes('aria-valuemax')).toBe('1000')
    await separator.trigger('keydown', { key: 'End' })
    expect(separator.attributes('aria-valuenow')).toBe('200')
    restore()
  })

  it('reports the window height for an unbounded vertical region', async () => {
    const restore = setWindowSize(1000, 700)
    const wrapper = mountUnbounded({ direction: 'vertical' })
    await nextTick()
    expect(wrapper.get('[role="separator"]').attributes('aria-valuemax')).toBe('700')
    restore()
  })

  it('never reports a maximum below the current size', async () => {
    const restore = setWindowSize(500)
    const wrapper = mountUnbounded({ defaultSize: 800, minSize: 100 })
    await nextTick()
    const separator = wrapper.get('[role="separator"]')
    expect(separator.attributes('aria-valuenow')).toBe('800')
    expect(separator.attributes('aria-valuemax')).toBe('800')
    await separator.trigger('keydown', { key: 'End' })
    expect(separator.attributes('aria-valuenow')).toBe('800')
    restore()
  })

  it('never reports a maximum below the minimum while collapsed in a small window', async () => {
    const restore = setWindowSize(375)
    const wrapper = mountUnbounded({ defaultSize: 500, minSize: 400, collapsible: true })
    const separator = wrapper.get('[role="separator"]')
    await separator.trigger('keydown', { key: 'Enter' })
    expect(separator.attributes('aria-valuetext')).toBe('Collapsed')
    expect(separator.attributes('aria-valuemin')).toBe('400')
    expect(Number(separator.attributes('aria-valuemax'))).toBeGreaterThanOrEqual(400)
    restore()
  })

  it('omits aria-valuemax on the server and reports the window after hydration', async () => {
    const restore = setWindowSize(1000)
    const Host = defineComponent({
      setup() {
        const region = useResizable({ defaultSize: 200, minSize: 100 })
        return () => h(ResizeHandle, { resizable: region.props, label: 'Resize' })
      },
    })
    const html = await renderToString(createSSRApp(Host))
    expect(html).not.toContain('aria-valuemax')
    // Vue 3.5 没有具名导出 hydrate。服务端渲染发生在 onMounted 之前，
    // 客户端挂载后才会读窗口尺寸，两边分开断言同一份契约。
    const wrapper = mount(Host, { attachTo: document.body })
    await nextTick()
    expect(wrapper.get('[role="separator"]').attributes('aria-valuemax')).toBe('1000')
    wrapper.unmount()
    restore()
  })

  it('reports the container content box while a percentage bound observes it', async () => {
    const width = vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(640)
    const style = vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      paddingTop: '0px',
      paddingBottom: '0px',
      paddingLeft: '0px',
      paddingRight: '0px',
      direction: 'ltr',
    } as CSSStyleDeclaration)
    const Host = defineComponent({
      components: { ResizeHandle },
      setup() {
        const container = ref<HTMLElement | null>(null)
        const region = useResizable({ defaultSize: 200, minSize: '10%', containerRef: container })
        return { container, region }
      },
      template: '<div ref="container"><ResizeHandle :resizable="region.props" label="Resize" /></div>',
    })
    const wrapper = mount(Host, { attachTo: document.body })
    await nextTick()
    expect(wrapper.get('[role="separator"]').attributes('aria-valuemax')).toBe('640')
    width.mockRestore()
    style.mockRestore()
  })

  it('reports no maximum for an unbounded pixel region inside a container', () => {
    const Host = defineComponent({
      components: { ResizeHandle },
      setup() {
        const container = ref<HTMLElement | null>(null)
        const region = useResizable({ defaultSize: 200, minSize: 100, containerRef: container })
        return { container, region }
      },
      template: '<div ref="container"><ResizeHandle :resizable="region.props" label="Resize" /></div>',
    })
    const wrapper = mount(Host, { attachTo: document.body })
    expect(wrapper.get('[role="separator"]').attributes('aria-valuemax')).toBeUndefined()
  })
})

describe('resizeHandle collapse and snaps', () => {
  it('warns when the handle axis disagrees with the region', () => {
    mountStub(makeResizable({ _direction: 'vertical' }), { direction: 'horizontal' })
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('direction="horizontal" but its useResizable region is "vertical"'))
    warn.mockClear()
  })

  it('calls a consumer keydown and still resizes', async () => {
    const onKeydown = vi.fn()
    const resizable = makeResizable()
    const wrapper = mount(ResizeHandle, {
      attrs: { onKeydown },
      props: { label: 'Resize', resizable },
    })
    await separatorOf(wrapper).trigger('keydown', { key: 'ArrowRight' })
    expect(onKeydown).toHaveBeenCalledTimes(1)
    expect(resizable._onResizeMove).toHaveBeenCalledWith(KEYBOARD_STEP)
  })

  it('restores the previous size when Enter or a double-click reopens a collapsed pane', async () => {
    const wrapper = mountUnbounded({ collapsible: true, maxSize: 400 })
    const separator = wrapper.get('[role="separator"]')
    await separator.trigger('keydown', { key: 'Enter' })
    expect(separator.attributes('aria-valuetext')).toBe('Collapsed')
    await separator.trigger('keydown', { key: 'Enter' })
    expect(separator.attributes('aria-valuetext')).toBeUndefined()
    expect(separator.attributes('aria-valuenow')).toBe('200')

    const again = mountUnbounded({ collapsible: true, maxSize: 400 })
    const second = again.get('[role="separator"]')
    await second.trigger('dblclick')
    await second.trigger('dblclick')
    expect(second.attributes('aria-valuenow')).toBe('200')
  })

  it('opens a collapsed pane from the grow arrow only', async () => {
    const closed = makeResizable({ _collapsible: true, _collapsedSize: 40, _isCollapsed: true, _size: 0 })
    const wrapper = mountStub(closed)
    await separatorOf(wrapper).trigger('keydown', { key: 'ArrowLeft' })
    expect(closed._onResizeMove).not.toHaveBeenCalled()
    await separatorOf(wrapper).trigger('keydown', { key: 'ArrowRight' })
    expect(closed._onResizeMove).toHaveBeenLastCalledWith(closed._minSizePx + KEYBOARD_STEP)

    const region = mountUnbounded({ collapsedSize: 50, collapsible: true, maxSize: 400, minSize: 20 })
    const separator = region.get('[role="separator"]')
    await separator.trigger('keydown', { key: 'Enter' })
    await separator.trigger('keydown', { key: 'ArrowRight' })
    expect(separator.attributes('aria-valuenow')).toBe('50')
  })

  it('moves between snap points, and clamps points that sit outside the bounds', async () => {
    const snapped = mountUnbounded({ maxSize: 400, snaps: [100, 200, 300, 400] })
    const separator = snapped.get('[role="separator"]')
    await separator.trigger('keydown', { key: 'ArrowRight' })
    expect(separator.attributes('aria-valuenow')).toBe('300')
    await separator.trigger('keydown', { key: 'ArrowLeft', shiftKey: true })
    expect(separator.attributes('aria-valuenow')).toBe('100')

    const bounded = mountUnbounded({ maxSize: 400, snaps: [50, 100, 200, 300, 450] })
    const handle = bounded.get('[role="separator"]')
    await handle.trigger('keydown', { key: 'ArrowRight' })
    expect(handle.attributes('aria-valuenow')).toBe('300')
    await handle.trigger('keydown', { key: 'ArrowRight' })
    expect(handle.attributes('aria-valuenow')).toBe('400')
  })

  it('follows a reversed layout when jumping between snap points', async () => {
    const wrapper = mountUnbounded({ maxSize: 400, snaps: [100, 200, 300, 400] }, { isReversed: true })
    const separator = wrapper.get('[role="separator"]')
    await separator.trigger('keydown', { key: 'ArrowLeft' })
    expect(separator.attributes('aria-valuenow')).toBe('300')
    await separator.trigger('keydown', { key: 'ArrowRight' })
    expect(separator.attributes('aria-valuenow')).toBe('200')
  })

  it('flips the grab-zone centering shift under RTL', () => {
    const css = readFileSync(resolve(process.cwd(), 'packages/core/styles/resize-handle.css'), 'utf8')
    expect(css).toContain('- 6.5px')
    expect(css).toMatch(/\[dir='rtl'\][\s\S]*\+ 6\.5px/)
    const wrapper = mountStub(makeResizable(), { pillPlacement: 'start' })
    expect(wrapper.get('.astryx-resize-handle__hit').attributes('data-bias')).toBe('start')
    const centered = mountStub(makeResizable(), { pillPlacement: 'center' })
    expect(centered.get('.astryx-resize-handle__hit').attributes('data-bias')).toBe('center')
  })
})
