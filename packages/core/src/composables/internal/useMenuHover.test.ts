import type { UseMenuHoverOptions, UseMenuHoverReturn } from './useMenuHover.js'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { MENU_HOVER_CLICK_GUARD_MS, MENU_HOVER_REOPEN_SUPPRESS_MS, useMenuHover } from './useMenuHover.js'

function stubHover(matches: boolean): void {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: query === '(hover: hover)' ? matches : false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }))
}

function mountMenu(overrides: Partial<UseMenuHoverOptions> = {}) {
  const isOpen = ref(false)
  const isEnabled = ref(true)
  let hover!: UseMenuHoverReturn
  const wrapper = mount(defineComponent({
    setup() {
      hover = useMenuHover({
        show: () => {
          isOpen.value = true
        },
        hide: () => {
          isOpen.value = false
        },
        isOpen,
        isEnabled,
        ...overrides,
      })
      return () => [
        h('button', { ref: (el: unknown) => hover.setTriggerEl(el as Element | null), type: 'button', ...hover.triggerProps }, 'Menu'),
        h('div', { ref: hover.menuRef, role: 'menu', tabindex: -1, ...hover.contentProps }, [
          h('div', { role: 'menuitem', tabindex: -1 }, 'One'),
          h('div', { role: 'menuitem', tabindex: -1 }, 'Two'),
        ]),
      ]
    },
  }), { attachTo: document.body })
  const trigger = wrapper.find('button').element as HTMLButtonElement
  const items = (): HTMLElement[] => Array.from(document.querySelectorAll<HTMLElement>('[role="menuitem"]'))
  const click = (detail = 1): void => {
    trigger.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail }))
  }
  return { click, hover: () => hover, isEnabled, isOpen, items, trigger, wrapper }
}

let current: ReturnType<typeof mountMenu> | null = null

beforeEach(() => {
  vi.useFakeTimers()
  stubHover(true)
})

afterEach(() => {
  current?.wrapper.unmount()
  current = null
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('useMenuHover：悬停和点击的保护', () => {
  it('悬停满延时后打开，焦点留在触发器上', async () => {
    current = mountMenu()
    current.trigger.focus()
    current.trigger.dispatchEvent(new MouseEvent('mouseenter'))
    vi.advanceTimersByTime(149)
    expect(current.isOpen.value).toBe(false)
    vi.advanceTimersByTime(1)
    expect(current.isOpen.value).toBe(true)
    expect(document.activeElement).toBe(current.trigger)
  })

  it('悬停打开后马上点一下：不关，钉住并把焦点移进菜单；之后离开也不关', async () => {
    current = mountMenu()
    current.trigger.dispatchEvent(new MouseEvent('mouseenter'))
    vi.advanceTimersByTime(150)
    current.click()
    expect(current.isOpen.value).toBe(true)
    expect(document.activeElement).toBe(current.items()[0])
    current.trigger.dispatchEvent(new MouseEvent('mouseleave'))
    vi.advanceTimersByTime(1000)
    expect(current.isOpen.value).toBe(true)
  })

  it('保护期过了再点就关', () => {
    current = mountMenu()
    current.trigger.dispatchEvent(new MouseEvent('mouseenter'))
    vi.advanceTimersByTime(150 + MENU_HOVER_CLICK_GUARD_MS)
    current.click()
    expect(current.isOpen.value).toBe(false)
  })

  it('点击打开的菜单没有保护期，下一次点击就关', () => {
    current = mountMenu()
    current.click()
    expect(current.isOpen.value).toBe(true)
    current.click()
    expect(current.isOpen.value).toBe(false)
  })

  it('悬停打开的菜单在指针离开后延时关掉', () => {
    current = mountMenu()
    current.trigger.dispatchEvent(new MouseEvent('mouseenter'))
    vi.advanceTimersByTime(150)
    current.trigger.dispatchEvent(new MouseEvent('mouseleave'))
    vi.advanceTimersByTime(199)
    expect(current.isOpen.value).toBe(true)
    vi.advanceTimersByTime(1)
    expect(current.isOpen.value).toBe(false)
  })

  it('重新进入已开菜单的触发器不会重启保护期', () => {
    current = mountMenu()
    current.trigger.dispatchEvent(new MouseEvent('mouseenter'))
    vi.advanceTimersByTime(150 + MENU_HOVER_CLICK_GUARD_MS)
    current.trigger.dispatchEvent(new MouseEvent('mouseenter'))
    current.click()
    expect(current.isOpen.value).toBe(false)
  })

  it('面板消失后触发器又回到静止的指针下面：保持关闭；抑制期过了再悬停照常打开', async () => {
    current = mountMenu({ showDelay: 0 })
    current.click()
    current.click()
    await nextTick()
    current.trigger.dispatchEvent(new MouseEvent('mouseenter'))
    expect(current.isOpen.value).toBe(false)
    vi.advanceTimersByTime(MENU_HOVER_REOPEN_SUPPRESS_MS)
    current.trigger.dispatchEvent(new MouseEvent('mouseenter'))
    expect(current.isOpen.value).toBe(true)
  })
})

describe('useMenuHover：焦点和键盘', () => {
  it('点击打开时焦点同步移到第一项；点击关闭时还给触发器', () => {
    current = mountMenu()
    current.click()
    expect(document.activeElement).toBe(current.items()[0])
    current.click()
    expect(document.activeElement).toBe(current.trigger)
  })

  it('escape 关闭并把焦点还给触发器', () => {
    current = mountMenu()
    current.click()
    current.items()[0]!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    expect(current.isOpen.value).toBe(false)
    expect(document.activeElement).toBe(current.trigger)
  })

  it('enter/Space（detail 为 0 的 click）打开；菜单开着时不关，把焦点移进去', () => {
    current = mountMenu()
    current.click(0)
    expect(current.isOpen.value).toBe(true)
    current.trigger.focus()
    current.click(0)
    expect(current.isOpen.value).toBe(true)
    expect(document.activeElement).toBe(current.items()[0])
  })

  it('方向键在菜单项之间走', () => {
    current = mountMenu()
    current.click()
    current.items()[0]!.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    expect(document.activeElement).toBe(current.items()[1])
  })
})

describe('useMenuHover：没有悬停能力的设备', () => {
  it('轻点合成的 mouseenter 不会打开，点击照常开关', () => {
    stubHover(false)
    current = mountMenu()
    current.trigger.dispatchEvent(new MouseEvent('mouseenter'))
    vi.advanceTimersByTime(500)
    expect(current.isOpen.value).toBe(false)
    current.click()
    expect(current.isOpen.value).toBe(true)
  })
})

describe('useMenuHover：原生调用者和安全三角', () => {
  it('传了 popoverId 时触发器带上 popovertarget', () => {
    current = mountMenu({ popoverId: 'panel-1' })
    expect(current.trigger.getAttribute('popovertarget')).toBe('panel-1')
  })

  it('指针在安全三角里停住时飞出层保持打开；移出三角后延时照常跑完', () => {
    const flyout = document.createElement('div')
    flyout.getBoundingClientRect = () => ({ left: 200, right: 300, top: 0, bottom: 200, width: 100, height: 200 }) as DOMRect
    document.body.appendChild(flyout)
    current = mountMenu({ flyoutRef: ref(flyout) })
    current.trigger.dispatchEvent(new MouseEvent('mouseenter'))
    vi.advanceTimersByTime(150)
    current.trigger.dispatchEvent(new MouseEvent('mouseleave', { clientX: 100, clientY: 100 }))
    document.dispatchEvent(new PointerEvent('pointermove', { clientX: 150, clientY: 100 }))
    vi.advanceTimersByTime(1000)
    expect(current.isOpen.value).toBe(true)
    document.dispatchEvent(new PointerEvent('pointermove', { clientX: 150, clientY: 400 }))
    vi.advanceTimersByTime(200)
    expect(current.isOpen.value).toBe(false)
    flyout.remove()
  })

  it('关闭之后不留文档上的 pointermove 监听', () => {
    const flyout = document.createElement('div')
    flyout.getBoundingClientRect = () => ({ left: 200, right: 300, top: 0, bottom: 200, width: 100, height: 200 }) as DOMRect
    const removed = vi.spyOn(document, 'removeEventListener')
    current = mountMenu({ flyoutRef: ref(flyout) })
    current.trigger.dispatchEvent(new MouseEvent('mouseenter'))
    vi.advanceTimersByTime(150)
    current.trigger.dispatchEvent(new MouseEvent('mouseleave', { clientX: 100, clientY: 100 }))
    current.click()
    expect(removed.mock.calls.some(([type]) => type === 'pointermove')).toBe(true)
  })
})

describe('useMenuHover：悬停等待期间被禁用', () => {
  it('排好的打开作废，菜单保持关闭', async () => {
    current = mountMenu()
    current.trigger.dispatchEvent(new MouseEvent('mouseenter'))
    vi.advanceTimersByTime(100)
    current.isEnabled.value = false
    vi.advanceTimersByTime(500)
    expect(current.isOpen.value).toBe(false)
  })
})
