import type { MoreMenuOption } from './types.js'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { resetMenuPress } from '../composables/useMenuPress.js'
import MoreMenu from './MoreMenu.vue'

enableAutoUnmount(afterEach)

afterEach(() => {
  document.body.innerHTML = ''
  resetMenuPress()
  Reflect.deleteProperty(document, 'elementFromPoint')
  vi.useRealTimers()
})

function pointer(type: string, init: PointerEventInit & { pointerType: string }): PointerEvent {
  return new PointerEvent(type, { bubbles: true, cancelable: true, pointerId: 1, button: 0, ...init })
}

function hitTest(target: () => Element | null): void {
  Object.defineProperty(document, 'elementFromPoint', { configurable: true, value: () => target() })
}

describe('moreMenu 按压选行', () => {
  it('鼠标按下触发器就打开，滑到行上松开执行那一行，随后菜单关闭', async () => {
    const onClick = vi.fn()
    const items: MoreMenuOption[] = [{ label: 'Edit', onClick }, { label: 'Delete' }]
    mount(MoreMenu, { attachTo: document.body, props: { items } })
    const trigger = document.querySelector<HTMLElement>('.astryx-more-menu button')!

    trigger.dispatchEvent(pointer('pointerdown', { pointerType: 'mouse' }))
    await flushPromises()
    expect(trigger.getAttribute('aria-expanded')).toBe('true')

    const edit = [...document.querySelectorAll<HTMLElement>('[role="menuitem"]')].find(row => row.textContent?.includes('Edit'))!
    hitTest(() => edit)
    document.dispatchEvent(pointer('pointermove', { pointerType: 'mouse', clientX: 5, clientY: 5 }))
    document.dispatchEvent(pointer('pointerup', { pointerType: 'mouse', clientX: 5, clientY: 5 }))
    await flushPromises()

    expect(onClick).toHaveBeenCalledTimes(1)
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    // 同一次手势里触发器收到的 click 不再切换菜单。
    trigger.click()
    await flushPromises()
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
  })

  it('手指按住触发器满长按时间才打开', async () => {
    vi.useFakeTimers()
    mount(MoreMenu, { attachTo: document.body, props: { items: [{ label: 'Edit' }] } })
    const trigger = document.querySelector<HTMLElement>('.astryx-more-menu button')!

    // Vue 按时间戳丢掉比监听器挂载更早的事件：假时钟走一步，事件才算在挂载之后。
    await vi.advanceTimersByTimeAsync(1)
    trigger.dispatchEvent(pointer('pointerdown', { pointerType: 'touch' }))
    await vi.advanceTimersByTimeAsync(300)
    expect(trigger.getAttribute('aria-expanded')).toBe('false')

    await vi.advanceTimersByTimeAsync(250)
    await nextTick()
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
  })
})
