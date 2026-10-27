import type { MenuPressOptions } from './useMenuPress.js'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { MENU_PRESS_SETTLE_MS, resetMenuPress, useMenuPress } from './useMenuPress.js'

interface HarnessOptions extends Partial<MenuPressOptions> {
  onSelect?: (label: string) => void
}

function pointer(target: EventTarget, type: string, init: { pointerId?: number, pointerType?: string, x?: number, y?: number, button?: number, shiftKey?: boolean } = {}): void {
  const event = new PointerEvent(type, {
    bubbles: true,
    cancelable: true,
    button: init.button ?? 0,
    clientX: init.x ?? 0,
    clientY: init.y ?? 0,
    pointerId: init.pointerId ?? 1,
    pointerType: init.pointerType ?? 'touch',
    shiftKey: init.shiftKey ?? false,
  })
  target.dispatchEvent(event)
}

const isOpen = ref(false)

function mountHarness(options: HarnessOptions = {}) {
  isOpen.value = false
  const onSelect = options.onSelect ?? (() => {})
  const wrapper = mount(defineComponent({
    setup() {
      const menuRef = ref<HTMLElement | null>(null)
      const triggerRef = ref<HTMLElement | null>(null)
      const press = useMenuPress({
        menuRef,
        triggerRef,
        onTriggerPress: () => {
          isOpen.value = !isOpen.value
          return isOpen.value
        },
        ...options,
      })
      return () => [
        h('button', {
          ref: triggerRef,
          type: 'button',
          ...press.triggerProps,
          onClick: () => {
            if (!press.isTriggerClickFromPress())
              isOpen.value = !isOpen.value
          },
        }, 'Open'),
        h('div', { ref: menuRef, role: 'menu', tabindex: -1, ...press.menuProps }, [
          ...['A', 'B', 'C'].map(label => h('div', { 'role': 'menuitem', 'tabindex': -1, 'data-label': label, 'onClick': () => onSelect(label) }, label)),
          h('div', { 'role': 'menuitem', 'aria-disabled': 'true', 'data-label': 'D', 'onClick': () => onSelect('D') }, 'D'),
          h('div', { 'role': 'separator', 'data-label': 'divider' }),
        ]),
        h('button', { 'type': 'button', 'data-label': 'outside' }, 'Outside'),
      ]
    },
  }), { attachTo: document.body })
  const el = (label: string): HTMLElement => document.querySelector(`[data-label="${label}"]`)!
  const trigger = (): HTMLElement => wrapper.find('button').element as HTMLElement
  return { el, trigger, wrapper }
}

let mounted: ReturnType<typeof mountHarness> | null = null

beforeEach(() => {
  resetMenuPress()
})

afterEach(() => {
  mounted?.wrapper.unmount()
  mounted = null
  vi.useRealTimers()
})

describe('useMenuPress：菜单里的跟踪', () => {
  it('执行的是松开位置那一行，不是按下那一行', () => {
    const onSelect = vi.fn()
    mounted = mountHarness({ onSelect })
    pointer(mounted.el('A'), 'pointerdown')
    pointer(mounted.el('B'), 'pointermove')
    pointer(mounted.el('B'), 'pointerup')
    expect(onSelect).toHaveBeenCalledExactlyOnceWith('B')
  })

  it('按坐标找行，不看事件目标（手指的事件一直发给它落下的元素）', () => {
    const onSelect = vi.fn()
    let under: Element | null = null
    mounted = mountHarness({ onSelect, hitTest: () => under })
    under = mounted.el('A')
    pointer(mounted.el('A'), 'pointerdown')
    under = mounted.el('C')
    pointer(mounted.el('A'), 'pointermove')
    pointer(mounted.el('A'), 'pointerup')
    expect(onSelect).toHaveBeenCalledExactlyOnceWith('C')
  })

  it('高亮就是焦点，在禁用行或分割线上清掉并且不执行', () => {
    const onSelect = vi.fn()
    mounted = mountHarness({ onSelect })
    pointer(mounted.el('A'), 'pointerdown')
    pointer(mounted.el('B'), 'pointermove')
    expect(document.activeElement).toBe(mounted.el('B'))
    pointer(mounted.el('D'), 'pointermove')
    expect(document.activeElement?.getAttribute('role')).toBe('menu')
    pointer(mounted.el('divider'), 'pointerup')
    expect(onSelect).not.toHaveBeenCalled()
  })

  it('传了 onHighlight 就交给它，不动焦点', () => {
    const onHighlight = vi.fn()
    mounted = mountHarness({ onHighlight })
    pointer(mounted.el('A'), 'pointerdown')
    pointer(mounted.el('B'), 'pointermove')
    expect(onHighlight).toHaveBeenLastCalledWith(mounted.el('B'))
  })

  it('派发的激活带着松开时的按键和修饰键，detail 为 0', () => {
    const onClick = vi.fn()
    mounted = mountHarness()
    mounted.el('B').addEventListener('click', onClick)
    pointer(mounted.el('A'), 'pointerdown')
    pointer(mounted.el('B'), 'pointerup', { shiftKey: true })
    const event = onClick.mock.calls[0]![0] as MouseEvent
    expect(event.shiftKey).toBe(true)
    expect(event.detail).toBe(0)
  })
})

describe('useMenuPress：一次手势只执行一次', () => {
  it('浏览器补发的 click 在 window 捕获阶段就被吞掉，文档上的监听看不到', () => {
    const onSelect = vi.fn()
    const documentClick = vi.fn()
    document.addEventListener('click', documentClick, true)
    mounted = mountHarness({ onSelect })
    pointer(mounted.el('A'), 'pointerdown')
    pointer(mounted.el('A'), 'pointerup')
    documentClick.mockClear()
    mounted.el('A').dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }))
    expect(onSelect).toHaveBeenCalledTimes(1)
    expect(documentClick).not.toHaveBeenCalled()
    document.removeEventListener('click', documentClick, true)
  })

  it('detail 为 0 的 click（键盘、读屏）照常通过', () => {
    const onSelect = vi.fn()
    mounted = mountHarness({ onSelect })
    pointer(mounted.el('A'), 'pointerdown')
    pointer(mounted.el('A'), 'pointerup')
    mounted.el('B').dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 0 }))
    expect(onSelect).toHaveBeenLastCalledWith('B')
  })

  it('下一次按下或 400ms 后撤掉，之后的轻点不会被吞', () => {
    vi.useFakeTimers()
    const onSelect = vi.fn()
    mounted = mountHarness({ onSelect })
    pointer(mounted.el('A'), 'pointerup')
    pointer(mounted.el('A'), 'pointerdown')
    pointer(mounted.el('A'), 'pointerup')
    vi.advanceTimersByTime(400)
    mounted.el('B').dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }))
    expect(onSelect).toHaveBeenLastCalledWith('B')
  })
})

describe('useMenuPress：在外面松开和取消', () => {
  it('鼠标在外面松开：什么都不执行，关菜单；手指在外面松开：菜单留着', () => {
    const onDismiss = vi.fn()
    const onSelect = vi.fn()
    mounted = mountHarness({ onDismiss, onSelect })
    pointer(mounted.el('A'), 'pointerdown', { pointerType: 'mouse' })
    pointer(mounted.el('outside'), 'pointerup', { pointerType: 'mouse' })
    expect(onDismiss).toHaveBeenCalledTimes(1)
    pointer(mounted.el('A'), 'pointerdown', { pointerId: 2 })
    pointer(mounted.el('outside'), 'pointerup', { pointerId: 2 })
    expect(onDismiss).toHaveBeenCalledTimes(1)
    expect(onSelect).not.toHaveBeenCalled()
  })

  it('pointercancel、第二根手指都以什么都不执行结束，第二根手指也不会开始新的手势', () => {
    const onSelect = vi.fn()
    mounted = mountHarness({ onSelect })
    pointer(mounted.el('A'), 'pointerdown')
    pointer(mounted.el('A'), 'pointercancel')
    pointer(mounted.el('A'), 'pointerup')
    pointer(mounted.el('A'), 'pointerdown', { pointerId: 3 })
    pointer(mounted.el('B'), 'pointerdown', { pointerId: 4 })
    pointer(mounted.el('B'), 'pointerup', { pointerId: 4 })
    pointer(mounted.el('A'), 'pointerup', { pointerId: 3 })
    expect(onSelect).not.toHaveBeenCalled()
  })

  it('跟踪时其它 id 的指针不理', () => {
    const onSelect = vi.fn()
    mounted = mountHarness({ onSelect })
    pointer(mounted.el('A'), 'pointerdown')
    pointer(mounted.el('C'), 'pointerup', { pointerId: 9 })
    pointer(mounted.el('B'), 'pointerup')
    expect(onSelect).toHaveBeenCalledExactlyOnceWith('B')
  })

  it('cancel() 结束这次手势，什么都不执行', () => {
    const onSelect = vi.fn()
    let press!: ReturnType<typeof useMenuPress>
    const wrapper = mount(defineComponent({
      setup() {
        const menuRef = ref<HTMLElement | null>(null)
        press = useMenuPress({ menuRef })
        return () => h('div', { ref: menuRef, role: 'menu', ...press.menuProps }, [h('div', { role: 'menuitem', onClick: onSelect }, 'A')])
      },
    }), { attachTo: document.body })
    const row = wrapper.find('[role="menuitem"]').element
    pointer(row, 'pointerdown')
    press.cancel()
    pointer(row, 'pointerup')
    expect(onSelect).not.toHaveBeenCalled()
    wrapper.unmount()
  })
})

describe('useMenuPress：触发器', () => {
  it('鼠标按下就打开，这次手势的 click 不会再切换', () => {
    mounted = mountHarness()
    pointer(mounted.trigger(), 'pointerdown', { pointerType: 'mouse' })
    expect(isOpen.value).toBe(true)
    pointer(mounted.trigger(), 'pointerup', { pointerType: 'mouse' })
    mounted.trigger().click()
    expect(isOpen.value).toBe(true)
  })

  it('鼠标按下开着菜单的触发器：关掉，同一次手势里不会重开', () => {
    mounted = mountHarness()
    isOpen.value = true
    pointer(mounted.trigger(), 'pointerdown', { pointerType: 'mouse' })
    expect(isOpen.value).toBe(false)
    pointer(mounted.trigger(), 'pointerup', { pointerType: 'mouse' })
    mounted.trigger().click()
    expect(isOpen.value).toBe(false)
  })

  it('从触发器拖进菜单、在某一行上松开：执行它', () => {
    const onSelect = vi.fn()
    mounted = mountHarness({ onSelect })
    pointer(mounted.trigger(), 'pointerdown', { pointerType: 'mouse' })
    pointer(mounted.el('B'), 'pointermove', { pointerType: 'mouse' })
    pointer(mounted.el('B'), 'pointerup', { pointerType: 'mouse' })
    expect(onSelect).toHaveBeenCalledExactlyOnceWith('B')
  })

  it('打开那次按压，落定前松开不执行；按满落定时间后松开就执行', () => {
    vi.useFakeTimers()
    const onSelect = vi.fn()
    let under: Element | null = null
    mounted = mountHarness({ onSelect, hitTest: () => under })
    under = mounted.trigger()
    pointer(mounted.trigger(), 'pointerdown', { pointerType: 'mouse' })
    under = mounted.el('A')
    pointer(mounted.trigger(), 'pointerup', { pointerType: 'mouse' })
    expect(onSelect).not.toHaveBeenCalled()
    expect(isOpen.value).toBe(true)

    isOpen.value = false
    resetMenuPress()
    under = mounted.trigger()
    pointer(mounted.trigger(), 'pointerdown', { pointerType: 'mouse', pointerId: 2 })
    vi.advanceTimersByTime(MENU_PRESS_SETTLE_MS)
    under = mounted.el('A')
    pointer(mounted.trigger(), 'pointerup', { pointerType: 'mouse', pointerId: 2 })
    expect(onSelect).toHaveBeenCalledExactlyOnceWith('A')
  })

  it('手指按住触发器满延时才打开，然后跟着手指高亮、松开执行', () => {
    vi.useFakeTimers()
    const onSelect = vi.fn()
    mounted = mountHarness({ onSelect, longPressDelayMs: 300 })
    pointer(mounted.trigger(), 'pointerdown')
    vi.advanceTimersByTime(299)
    expect(isOpen.value).toBe(false)
    vi.advanceTimersByTime(1)
    expect(isOpen.value).toBe(true)
    pointer(mounted.trigger(), 'pointermove', { x: 0, y: 0 })
    pointer(mounted.el('C'), 'pointermove')
    expect(document.activeElement).toBe(mounted.el('C'))
    pointer(mounted.el('C'), 'pointerup')
    expect(onSelect).toHaveBeenCalledExactlyOnceWith('C')
  })

  it('手指在延时前抬起是轻点：触发器自己的 click 打开菜单', () => {
    mounted = mountHarness()
    pointer(mounted.trigger(), 'pointerdown')
    pointer(mounted.trigger(), 'pointerup')
    mounted.trigger().click()
    expect(isOpen.value).toBe(true)
  })

  it('手指在触发器上挪远了是滚动，不会打开', () => {
    vi.useFakeTimers()
    mounted = mountHarness()
    pointer(mounted.trigger(), 'pointerdown', { x: 0, y: 0 })
    pointer(mounted.trigger(), 'pointermove', { x: 0, y: 40 })
    vi.advanceTimersByTime(1000)
    expect(isOpen.value).toBe(false)
  })

  it('手指按住打开后挡住页面滚动，手势取消时还回去', () => {
    vi.useFakeTimers()
    mounted = mountHarness()
    pointer(mounted.trigger(), 'pointerdown')
    vi.advanceTimersByTime(500)
    const blocked = new Event('touchmove', { bubbles: true, cancelable: true })
    document.body.dispatchEvent(blocked)
    expect(blocked.defaultPrevented).toBe(true)
    pointer(mounted.trigger(), 'pointercancel')
    const free = new Event('touchmove', { bubbles: true, cancelable: true })
    document.body.dispatchEvent(free)
    expect(free.defaultPrevented).toBe(false)
  })

  it('菜单根带上按压模型的标记', () => {
    mounted = mountHarness()
    expect(document.querySelector('[role="menu"]')!.hasAttribute('data-astryx-menu-press')).toBe(true)
  })
})

describe('useMenuPress：边缘自动滚动', () => {
  it('按住的指针停在会滚动的菜单下边缘附近就往下滚，离开那一带就停', () => {
    vi.useFakeTimers()
    const scroller = document.createElement('div')
    let top = 0
    Object.defineProperty(scroller, 'scrollTop', {
      get: () => top,
      set: (value: number) => {
        top = Math.min(100, value)
      },
    })
    scroller.getBoundingClientRect = () => ({ top: 0, bottom: 200, height: 200 }) as DOMRect
    mounted = mountHarness({ getScroller: () => scroller })
    pointer(mounted.el('A'), 'pointerdown', { y: 100 })
    pointer(mounted.el('A'), 'pointermove', { y: 190 })
    vi.advanceTimersByTime(50)
    const scrolled = top
    expect(scrolled).toBeGreaterThan(0)
    pointer(mounted.el('A'), 'pointermove', { y: 100 })
    vi.advanceTimersByTime(50)
    expect(top).toBe(scrolled)
  })
})
