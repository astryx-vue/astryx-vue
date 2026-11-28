/**
 * @file ItemSwipe.test.ts
 * @input vitest（happy-dom、假时钟）；Item 和 ListItem 的 `swipe` 与已弃用的 `swipeActions`；
 *   共享拖动的 pan（gestures/createPanGesture.ts）换成把 pan 事件交给测试的替身
 * @output 行的横滑：一甩只停开、不触发；确认的全滑等行离开才触发；两个操作的一侧只从停开的行
 *   确认；commit 不停开；Escape、指针落在外面合上；`hasRemoval` 停在外面；操作 id 变了合上；
 *   禁用的操作不触发也不确认；ListItem 把 key 交给处理函数；开着的行按住根的按压；主题目标类名；
 *   旧写法照常工作；开发期警告
 * @position Item（Item.vue）、itemSwipe.ts 和 Swipe 模块（SwipeActionsLayer、useSwipeAction）
 *   一起的行为测试
 */

import type { PanEvent, PanOptions } from '../gestures/createPanGesture'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'

let onPan: ((event: PanEvent) => void) | null = null

vi.mock('../gestures/createPanGesture', () => ({
  createPan: (_element: Element, options: PanOptions) => {
    onPan = options.onPan
    return { destroy: () => {} }
  },
}))

const { createSwipe } = await import('../Swipe/createSwipe')
const { default: Item } = await import('./Item.vue')
const { default: List } = await import('./List.vue')
const { default: ListItem } = await import('./ListItem.vue')

const ROW_WIDTH = 400
const ENTRY_WIDTH = 75

beforeEach(() => {
  vi.useFakeTimers({
    toFake: ['setTimeout', 'clearTimeout', 'performance', 'requestAnimationFrame', 'cancelAnimationFrame'],
  })
  // happy-dom 的 Animation 取消时留下没人接的 rejection；浏览器会把它标成已处理。
  HTMLElement.prototype.animate = function () {
    return {
      startTime: null,
      playState: 'running',
      ready: new Promise(() => {}),
      finish() {},
      cancel() {},
    } as unknown as Animation
  }
})

afterEach(() => {
  Reflect.deleteProperty(HTMLElement.prototype, 'animate')
  vi.useRealTimers()
  vi.restoreAllMocks()
  onPan = null
  document.body.innerHTML = ''
})

/** 一次手指 pan 事件。`x` 是从按下算起的位移（物理 px）。 */
function pan(state: PanEvent['state'], x: number, velocity = 0): void {
  onPan?.({
    state,
    translation: { x, y: 0 },
    totalTranslation: { x, y: 0 },
    velocity: { x: velocity, y: 0 },
    input: 'touch',
  })
}

/** 一整次朝 trailing（物理左）的手指横滑：拖到 `to`，以 `velocity` 抬起。 */
async function swipeTo(to: number, velocity = 0): Promise<void> {
  pan('began', 0)
  for (const x of [to / 4, to / 2, to])
    pan('changed', x)
  pan('ended', to, velocity)
  await vi.advanceTimersByTimeAsync(1500)
}

/** 给行和操作量好尺寸：happy-dom 不排版。 */
function measure(root: Element): void {
  Object.defineProperty(root, 'clientWidth', { configurable: true, value: ROW_WIDTH })
  for (const entry of root.querySelectorAll('.astryx-item__swipe-entry'))
    Object.defineProperty(entry, 'offsetWidth', { configurable: true, value: ENTRY_WIDTH })
}

function mountRow(props: Record<string, unknown>) {
  const wrapper = mount(Item, { attachTo: document.body, props: { label: 'Invoice 1042', ...props } })
  measure(wrapper.element)
  return wrapper
}

function isOpen(root: Element): boolean {
  return root.hasAttribute('data-astryx-press-held')
}

describe('item swipe', () => {
  it('opens on a flick without firing anything, and lets the open panel be pressed', async () => {
    const onActivate = vi.fn()
    const wrapper = mountRow({ swipe: createSwipe({ trailing: [{ id: 'archive', label: 'Archive', onActivate }] }) })
    expect(wrapper.get('[data-swipe-panel="trailing"]').attributes('inert')).toBeDefined()

    await swipeTo(-60, -600)

    expect(onActivate).not.toHaveBeenCalled()
    expect(isOpen(wrapper.element)).toBe(true)
    const panel = wrapper.get('[data-swipe-panel="trailing"]')
    expect(panel.attributes('inert')).toBeUndefined()
    await wrapper.get('button.astryx-item__swipe-entry').trigger('click')
    expect(onActivate).toHaveBeenCalledWith({ id: 'archive', itemKey: undefined })
    await vi.advanceTimersByTimeAsync(1500)
    expect(isOpen(wrapper.element)).toBe(false)
  })

  it('closes a slow release short of half the panel', async () => {
    const wrapper = mountRow({ swipe: createSwipe({ trailing: [{ id: 'archive', label: 'Archive', onActivate: vi.fn() }] }) })
    await swipeTo(-20)
    expect(isOpen(wrapper.element)).toBe(false)
  })

  it('fires the outer entry on a confirmed full swipe, once the row has left, then brings the row back', async () => {
    const onActivate = vi.fn()
    const wrapper = mountRow({ swipe: createSwipe({ trailing: [{ id: 'archive', label: 'Archive', onActivate }] }) })

    pan('began', 0)
    for (const x of [-10, -30, -200, -380])
      pan('changed', x)
    await nextTick()
    expect(wrapper.get('.astryx-item-swipe-panel').attributes('data-covered')).toBe('true')
    pan('ended', -380, 0)
    expect(onActivate).not.toHaveBeenCalled()
    await vi.advanceTimersByTimeAsync(1500)

    expect(onActivate).toHaveBeenCalledTimes(1)
    expect(isOpen(wrapper.element)).toBe(false)
  })

  it('confirms the outer entry of a two-entry side only from a row resting open', async () => {
    const onArchive = vi.fn()
    const wrapper = mountRow({
      swipe: createSwipe({
        trailing: [
          { id: 'flag', label: 'Flag', onActivate: vi.fn() },
          { id: 'archive', label: 'Archive', onActivate: onArchive },
        ],
      }),
    })

    await swipeTo(-380)
    expect(onArchive).not.toHaveBeenCalled()
    expect(isOpen(wrapper.element)).toBe(true)

    await swipeTo(-380)
    expect(onArchive).toHaveBeenCalledTimes(1)
  })

  it('never rests under commit: a flick closes and fires nothing, a full swipe fires', async () => {
    const onActivate = vi.fn()
    const wrapper = mountRow({
      swipe: createSwipe({ swipeBehavior: 'commit', trailing: [{ id: 'delete', label: 'Delete', onActivate }] }),
    })
    expect(wrapper.find('button.astryx-item__swipe-entry').exists()).toBe(false)
    expect(wrapper.get('[data-swipe-panel="trailing"]').attributes('aria-hidden')).toBe('true')

    await swipeTo(-60, -900)
    expect(onActivate).not.toHaveBeenCalled()
    expect(isOpen(wrapper.element)).toBe(false)

    await swipeTo(-380)
    expect(onActivate).toHaveBeenCalledTimes(1)
  })

  it('holds a removed row out past its edge', async () => {
    const onActivate = vi.fn()
    const wrapper = mountRow({
      swipe: createSwipe({ trailing: [{ id: 'delete', label: 'Delete', onActivate, hasRemoval: true }] }),
    })
    await swipeTo(-380)
    expect(onActivate).toHaveBeenCalledTimes(1)
    expect(Number.parseFloat(wrapper.element.style.getPropertyValue('--_item-swipe-travel'))).toBeLessThan(-ROW_WIDTH)
  })

  it('closes an open row on Escape and on a pointer down outside it', async () => {
    const wrapper = mountRow({ swipe: createSwipe({ trailing: [{ id: 'archive', label: 'Archive', onActivate: vi.fn() }] }) })

    await swipeTo(-60, -600)
    await wrapper.trigger('keydown', { key: 'Escape' })
    await vi.advanceTimersByTimeAsync(1500)
    expect(isOpen(wrapper.element)).toBe(false)

    await swipeTo(-60, -600)
    expect(isOpen(wrapper.element)).toBe(true)
    document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: 0, clientY: 0 }))
    await vi.advanceTimersByTimeAsync(1500)
    expect(isOpen(wrapper.element)).toBe(false)
  })

  it('keeps an open row open for a new value with the same ids, and closes it when the ids change', async () => {
    const entry = { id: 'archive', label: 'Archive', onActivate: vi.fn() }
    const wrapper = mountRow({ swipe: createSwipe({ trailing: [entry] }) })
    await swipeTo(-60, -600)

    await wrapper.setProps({ swipe: createSwipe({ trailing: [{ ...entry, label: 'Archive now' }] }) })
    await vi.advanceTimersByTimeAsync(1500)
    expect(isOpen(wrapper.element)).toBe(true)

    await wrapper.setProps({ swipe: createSwipe({ trailing: [{ ...entry, id: 'flag' }] }) })
    await vi.advanceTimersByTimeAsync(1500)
    expect(isOpen(wrapper.element)).toBe(false)
  })

  it('keeps a disabled entry focusable but inert, and never confirms toward it', async () => {
    const onActivate = vi.fn()
    const wrapper = mountRow({
      swipe: createSwipe({ trailing: [{ id: 'archive', label: 'Archive', onActivate, isDisabled: true }] }),
    })
    await swipeTo(-380)
    expect(onActivate).not.toHaveBeenCalled()
    expect(isOpen(wrapper.element)).toBe(true)

    const action = wrapper.get('button.astryx-item__swipe-entry')
    expect(action.attributes('disabled')).toBeUndefined()
    expect(action.attributes('aria-disabled')).toBe('true')
    await action.trigger('click')
    expect(onActivate).not.toHaveBeenCalled()
  })

  it('hands the row key of a ListItem to the handler', async () => {
    const onActivate = vi.fn()
    const swipe = createSwipe({ trailing: [{ id: 'archive', label: 'Archive', onActivate }] })
    const wrapper = mount(defineComponent({
      render: () => h(List, null, () => [h(ListItem, { label: 'Inbox', itemKey: 'inbox-1', swipe })]),
    }), { attachTo: document.body })
    const row = wrapper.get('.astryx-item').element
    measure(row)

    await swipeTo(-60, -600)
    await wrapper.get('button.astryx-item__swipe-entry').trigger('click')
    expect(onActivate).toHaveBeenCalledWith({ id: 'archive', itemKey: 'inbox-1' })
  })

  it('paints the theme targets, accent by default, and the row root carries the swipe style', () => {
    const wrapper = mountRow({
      swipe: createSwipe({
        leading: [{ id: 'pin', label: 'Pin', onActivate: vi.fn() }],
        trailing: [{ id: 'delete', label: 'Delete', onActivate: vi.fn(), variant: 'destructive' }],
      }),
    })
    expect(wrapper.classes()).toContain('astryx-item--swipe')
    const panels = wrapper.findAll('.astryx-item-swipe-panel')
    expect(panels.map(panel => panel.attributes('data-side'))).toEqual(['leading', 'trailing'])
    const actions = wrapper.findAll('.astryx-item-swipe-action')
    expect(actions.map(action => action.attributes('data-variant'))).toEqual(['accent', 'destructive'])
  })

  it('serves no disabled row and no row whose role forbids buttons inside it', () => {
    const swipe = createSwipe({ trailing: [{ id: 'archive', label: 'Archive', onActivate: vi.fn() }] })
    expect(mountRow({ swipe, isDisabled: true }).find('[data-swipe-panel]').exists()).toBe(false)
    expect(mountRow({ swipe, role: 'option' }).find('[data-swipe-panel]').exists()).toBe(false)
    expect(mountRow({ swipe, role: 'listitem' }).find('[data-swipe-panel]').exists()).toBe(true)
  })
})

describe('item swipeActions (deprecated)', () => {
  it('still reveals its entries and runs them on the same gesture', async () => {
    const onActivate = vi.fn()
    const wrapper = mountRow({ swipeActions: { trailing: [{ label: 'Archive', onActivate }] } })
    await swipeTo(-60, -600)
    expect(isOpen(wrapper.element)).toBe(true)
    await wrapper.get('button.astryx-item__swipe-entry').trigger('click')
    expect(onActivate).toHaveBeenCalledTimes(1)
  })

  it('fires nothing for a committing side with two entries, and warns', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const onActivate = vi.fn()
    mountRow({
      swipeBehavior: 'commit',
      swipeActions: { trailing: [{ label: 'Keep', onActivate: vi.fn() }, { label: 'Delete', onActivate }] },
    })
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('swipeBehavior="commit"'))
    await swipeTo(-380)
    expect(onActivate).not.toHaveBeenCalled()
  })

  it('gives way to swipe, and warns that it is ignored', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mountRow({
      swipe: createSwipe({ trailing: [{ id: 'archive', label: 'Archive', onActivate: vi.fn() }] }),
      swipeActions: { leading: [{ label: 'Pin', onActivate: vi.fn() }] },
    })
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('`swipe` is set'))
    expect(wrapper.find('[data-swipe-panel="leading"]').exists()).toBe(false)
    expect(wrapper.find('[data-swipe-panel="trailing"]').exists()).toBe(true)
  })
})
