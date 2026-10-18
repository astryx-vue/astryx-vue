import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, ref } from 'vue'
import { mountComposable } from './testing/mountComposable.js'
import { resetMenuPress, useMenuPress } from './useMenuPress.js'

function press(target: EventTarget, init: { pointerId?: number, pointerType?: string } = {}): PointerEvent {
  return {
    altKey: false,
    button: 0,
    clientX: 0,
    clientY: 0,
    ctrlKey: false,
    metaKey: false,
    pointerId: init.pointerId ?? 1,
    pointerType: init.pointerType ?? 'touch',
    shiftKey: false,
    target,
  } as unknown as PointerEvent
}

function dispatchPointer(type: 'pointermove' | 'pointerup' | 'pointercancel', target: EventTarget, pointerId = 1): void {
  const event = new MouseEvent(type, { bubbles: true, cancelable: true })
  Object.defineProperty(event, 'pointerId', { value: pointerId })
  Object.defineProperty(event, 'pointerType', { value: 'touch' })
  target.dispatchEvent(event)
}

describe('useMenuPress', () => {
  let menu: HTMLDivElement
  let trigger: HTMLButtonElement
  let rowOne: HTMLDivElement
  let rowTwo: HTMLDivElement

  beforeEach(() => {
    menu = document.createElement('div')
    menu.setAttribute('role', 'menu')
    rowOne = document.createElement('div')
    rowOne.setAttribute('role', 'menuitem')
    rowOne.dataset.row = 'one'
    rowOne.textContent = 'One'
    rowTwo = document.createElement('div')
    rowTwo.setAttribute('role', 'menuitem')
    rowTwo.dataset.row = 'two'
    rowTwo.textContent = 'Two'
    menu.append(rowOne, rowTwo)

    trigger = document.createElement('button')
    document.body.append(trigger, menu)
  })

  afterEach(() => {
    resetMenuPress()
    trigger.remove()
    menu.remove()
  })

  it('is available from the public composables entry', () => {
    const Host = defineComponent({
      setup() {
        const menuRef = ref<HTMLElement | null>(null)
        const press = useMenuPress({
          menuRef,
          isEnabled: () => true,
          onDismiss: () => {},
        })
        return { menuRef, onPointerDown: press.onPointerDown }
      },
      template: '<div ref="menuRef" role="menu" @pointerdown="onPointerDown" />',
    })
    const wrapper = mount(Host)
    expect(typeof wrapper.vm.onPointerDown).toBe('function')
    resetMenuPress()
    wrapper.unmount()
  })

  it('menuProps 摊到菜单根上，onPointerDown 也还在', () => {
    const { result } = mountComposable(() => useMenuPress({
      menuRef: ref(menu),
      isEnabled: () => true,
      onDismiss: () => {},
    }))

    expect(result.menuProps['data-astryx-menu-press']).toBe('')
    expect(result.menuProps.onPointerDown).toBe(result.onPointerDown)
    expect(typeof result.triggerProps.onPointerDown).toBe('function')
    expect(typeof result.triggerProps.onContextMenu).toBe('function')
  })

  it('松开时执行指针下面那一行，默认派发一次 click', () => {
    const onClick = vi.fn()
    rowTwo.addEventListener('click', onClick)
    const { result } = mountComposable(() => useMenuPress({
      menuRef: ref(menu),
      isEnabled: () => true,
      onDismiss: () => {},
    }))

    result.onPointerDown(press(rowOne))
    dispatchPointer('pointerup', rowTwo)

    expect(onClick).toHaveBeenCalledOnce()
    const event = onClick.mock.calls[0]?.[0] as MouseEvent
    expect(event.detail).toBe(0)
  })

  it('itemSelector、onHighlight 和 onActivate 可以接管行与高亮', () => {
    const onHighlight = vi.fn()
    const onActivate = vi.fn()
    const { result } = mountComposable(() => useMenuPress({
      menuRef: ref(menu),
      itemSelector: '[data-row]',
      isEnabled: () => true,
      onActivate,
      onDismiss: () => {},
      onHighlight,
    }))

    result.onPointerDown(press(rowOne))
    dispatchPointer('pointermove', rowTwo)
    expect(onHighlight).toHaveBeenLastCalledWith(rowTwo)

    dispatchPointer('pointerup', rowTwo)
    expect(onActivate).toHaveBeenCalledOnce()
    expect(onActivate.mock.calls[0]?.[0]).toBe(rowTwo)
  })

  it('鼠标按下触发器就打开，然后可以把按压滑进菜单里挑行', () => {
    const onTriggerPress = vi.fn(() => true)
    const onActivate = vi.fn()
    const { result } = mountComposable(() => useMenuPress({
      menuRef: ref(menu),
      triggerRef: ref(trigger as HTMLElement),
      isEnabled: () => true,
      onActivate,
      onDismiss: () => {},
      onTriggerPress,
    }))

    result.triggerProps.onPointerDown(press(trigger, { pointerType: 'mouse' }))
    expect(onTriggerPress).toHaveBeenCalledWith('mouse')
    expect(result.isTriggerClickFromPress()).toBe(true)

    dispatchPointer('pointermove', rowTwo)
    dispatchPointer('pointerup', rowTwo)
    expect(onActivate).toHaveBeenCalledOnce()
    expect(onActivate.mock.calls[0]?.[0]).toBe(rowTwo)
  })

  it('手指按住触发器到延时之后才打开', () => {
    vi.useFakeTimers()
    const onTriggerPress = vi.fn(() => true)
    const { result } = mountComposable(() => useMenuPress({
      menuRef: ref(menu),
      triggerRef: ref(trigger as HTMLElement),
      isEnabled: () => true,
      longPressDelayMs: 300,
      onDismiss: () => {},
      onTriggerPress,
    }))

    result.triggerProps.onPointerDown(press(trigger))
    vi.advanceTimersByTime(299)
    expect(onTriggerPress).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1)
    expect(onTriggerPress).toHaveBeenCalledWith('touch')
    vi.useRealTimers()
  })

  it('手指只是轻点触发器时不算按压，click 照常到触发器', () => {
    const onTriggerPress = vi.fn(() => true)
    const { result } = mountComposable(() => useMenuPress({
      menuRef: ref(menu),
      triggerRef: ref(trigger as HTMLElement),
      isEnabled: () => true,
      onDismiss: () => {},
      onTriggerPress,
    }))

    result.triggerProps.onPointerDown(press(trigger))
    dispatchPointer('pointerup', trigger)

    expect(onTriggerPress).not.toHaveBeenCalled()
    expect(result.isTriggerClickFromPress()).toBe(false)
  })

  it('cancel 结束这次按压，什么都不执行', () => {
    const onActivate = vi.fn()
    const { result } = mountComposable(() => useMenuPress({
      menuRef: ref(menu),
      isEnabled: () => true,
      onActivate,
      onDismiss: () => {},
    }))

    result.onPointerDown(press(rowOne))
    result.cancel()
    dispatchPointer('pointerup', rowOne)

    expect(onActivate).not.toHaveBeenCalled()
  })

  it('鼠标在菜单外松开时关闭菜单', () => {
    const onDismiss = vi.fn()
    const { result } = mountComposable(() => useMenuPress({
      menuRef: ref(menu),
      isEnabled: () => true,
      onDismiss,
    }))

    result.onPointerDown(press(rowOne, { pointerType: 'mouse' }))
    document.body.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))

    expect(onDismiss).toHaveBeenCalledOnce()
  })
})
