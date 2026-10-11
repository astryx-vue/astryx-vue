import { afterEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { mountComposable } from './mountComposable.js'
import { useHotkeys } from './useHotkeys.js'

function setPlatform(platform: string): void {
  Object.defineProperty(navigator, 'platform', { configurable: true, value: platform })
  Object.defineProperty(navigator, 'userAgentData', { configurable: true, value: undefined })
}

function press(key: string, extra: KeyboardEventInit = {}, target: EventTarget = window): KeyboardEvent {
  const event = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key, ...extra })
  target.dispatchEvent(event)
  return event
}

describe('useHotkeys', () => {
  afterEach(() => {
    document.body.replaceChildren()
    setPlatform('Linux')
  })

  it('非 Apple 平台上 mod 是 Ctrl，Apple 上是 Meta', () => {
    setPlatform('Linux')
    const onLinux = vi.fn()
    const linux = mountComposable(() => useHotkeys([{ keys: 'mod+k', onPress: onLinux }]))

    press('k', { metaKey: true })
    expect(onLinux).not.toHaveBeenCalled()
    const linuxEvent = press('k', { ctrlKey: true })
    expect(linuxEvent.defaultPrevented).toBe(true)
    expect(onLinux).toHaveBeenCalledOnce()
    linux.wrapper.unmount()

    setPlatform('MacIntel')
    const onMac = vi.fn()
    const mac = mountComposable(() => useHotkeys([{ keys: 'mod+k', onPress: onMac }]))
    press('k', { ctrlKey: true })
    expect(onMac).not.toHaveBeenCalled()
    press('k', { metaKey: true })
    expect(onMac).toHaveBeenCalledOnce()
    mac.wrapper.unmount()
  })

  it('输入框里默认不触发，allowInInputs 可以放开', () => {
    const onPress = vi.fn()
    const input = document.createElement('input')
    document.body.append(input)
    input.focus()
    const { wrapper } = mountComposable(() => useHotkeys([
      { keys: 'mod+k', onPress },
      { allowInInputs: true, keys: 'escape', onPress },
    ]))

    press('k', { ctrlKey: true }, input)
    expect(onPress).not.toHaveBeenCalled()
    press('Escape', {}, input)
    expect(onPress).toHaveBeenCalledOnce()
    wrapper.unmount()
  })

  it('禁用、已经处理过、输入法组合、以及第一条命中后都不再继续', () => {
    const first = vi.fn()
    const second = vi.fn()
    const enabled = ref(false)
    const { wrapper } = mountComposable(() => useHotkeys([
      { isDisabled: !enabled.value, keys: 'mod+k', onPress: first },
      { keys: 'mod+k', onPress: second },
    ]))

    press('k', { ctrlKey: true })
    expect(first).not.toHaveBeenCalled()
    expect(second).toHaveBeenCalledOnce()

    const handled = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ctrlKey: true, key: 'k' })
    handled.preventDefault()
    window.dispatchEvent(handled)
    expect(second).toHaveBeenCalledOnce()

    press('k', { ctrlKey: true, isComposing: true })
    expect(second).toHaveBeenCalledOnce()
    wrapper.unmount()
    press('k', { ctrlKey: true })
    expect(second).toHaveBeenCalledOnce()
  })

  it('识别 escape、方向键别名，以及字面量加号', () => {
    const onPress = vi.fn()
    const { wrapper } = mountComposable(() => useHotkeys([
      { keys: 'esc', onPress },
      { keys: 'shift+plus', onPress },
    ]))

    press('Escape')
    press('+', { shiftKey: true })
    expect(onPress).toHaveBeenCalledTimes(2)
    press('+', { shiftKey: false })
    expect(onPress).toHaveBeenCalledTimes(2)
    wrapper.unmount()
  })
})
