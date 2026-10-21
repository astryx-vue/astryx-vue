import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { isTopLayer, pushLayer, resetDismissStackForTests } from './dismissStack.js'

function makeLayer(name: string): { el: HTMLDivElement, trigger: HTMLButtonElement } {
  const el = document.createElement('div')
  el.setAttribute('data-layer', name)
  const trigger = document.createElement('button')
  trigger.type = 'button'
  trigger.textContent = `${name} trigger`
  document.body.append(trigger, el)
  return { el, trigger }
}

function pressEscape(init: KeyboardEventInit = {}): KeyboardEvent {
  const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true, ...init })
  document.dispatchEvent(event)
  return event
}

function pressDown(target: EventTarget): PointerEvent {
  const event = new PointerEvent('pointerdown', { bubbles: true, cancelable: true })
  target.dispatchEvent(event)
  return event
}

interface LayerHandle {
  el: HTMLDivElement
  trigger: HTMLButtonElement
  onDismiss: () => void
  remove: () => void
  token: object
}

let created: HTMLDivElement[] = []

function openLayer(name: string, extra: Partial<Parameters<typeof pushLayer>[0]> = {}): LayerHandle {
  const { el, trigger } = makeLayer(name)
  created.push(el)
  const onDismiss = vi.fn()
  const token = {}
  const remove = pushLayer({
    token,
    getContainer: () => el,
    getTrigger: () => trigger,
    dismissOnPointerOutside: true,
    dismissOnEscape: true,
    onDismiss,
    ...extra,
  })
  return { el, trigger, onDismiss, remove, token }
}

beforeEach(() => {
  resetDismissStackForTests()
})

afterEach(() => {
  resetDismissStackForTests()
  for (const el of created)
    el.remove()
  created = []
  document.querySelectorAll('button').forEach(button => button.remove())
})

describe('关闭栈：一次只关最上面那一层', () => {
  it('两层叠着，按 Escape 只关上层', () => {
    const lower = openLayer('lower')
    const upper = openLayer('upper')

    pressEscape()

    expect(upper.onDismiss).toHaveBeenCalledOnce()
    expect(lower.onDismiss).not.toHaveBeenCalled()
  })

  it('三层叠着，按一次 Escape 只掉一层，顺序从最上面往下', () => {
    const lowest = openLayer('lowest')
    const middle = openLayer('middle')
    const top = openLayer('top')

    pressEscape()
    expect(top.onDismiss).toHaveBeenCalledOnce()
    expect(middle.onDismiss).not.toHaveBeenCalled()

    top.remove()
    pressEscape()
    expect(middle.onDismiss).toHaveBeenCalledOnce()
    expect(lowest.onDismiss).not.toHaveBeenCalled()

    middle.remove()
    pressEscape()
    expect(lowest.onDismiss).toHaveBeenCalledOnce()
  })

  it('点上层里面，什么都不关', () => {
    const lower = openLayer('lower')
    const upper = openLayer('upper')

    pressDown(upper.el)

    expect(upper.onDismiss).not.toHaveBeenCalled()
    expect(lower.onDismiss).not.toHaveBeenCalled()
  })

  it('点下层里面，只关上层', () => {
    const lower = openLayer('lower')
    const upper = openLayer('upper')

    pressDown(lower.el)

    expect(upper.onDismiss).toHaveBeenCalledOnce()
    expect(lower.onDismiss).not.toHaveBeenCalled()
  })

  it('点外面，只关栈顶那一层', () => {
    const lower = openLayer('lower')
    const upper = openLayer('upper')

    pressDown(document.body)

    expect(upper.onDismiss).toHaveBeenCalledOnce()
    expect(lower.onDismiss).not.toHaveBeenCalled()
  })

  it('点栈顶自己的触发器，不关（交给触发器自己开关）', () => {
    const layer = openLayer('solo')

    pressDown(layer.trigger)

    expect(layer.onDismiss).not.toHaveBeenCalled()
  })

  it('卸载以后从栈里摘掉，监听也一起摘掉', () => {
    const layer = openLayer('solo')

    const first = pressEscape()
    expect(layer.onDismiss).toHaveBeenCalledOnce()
    expect(first.defaultPrevented).toBe(true)

    layer.remove()

    const second = pressEscape()
    expect(layer.onDismiss).toHaveBeenCalledOnce()
    // 栈空了以后不再认领 Escape，页面能正常用这个键。
    expect(second.defaultPrevented).toBe(false)
  })
})

describe('关闭栈：登记顺序', () => {
  it('同一层重新登记不会插到后开的层上面', () => {
    const host = openLayer('host')
    const later = openLayer('later')

    // 宿主因为选项变化重新登记一次：它会先摘掉自己再登记回去。
    host.remove()
    const again = pushLayer({
      token: host.token,
      getContainer: () => host.el,
      getTrigger: () => host.trigger,
      dismissOnPointerOutside: true,
      dismissOnEscape: true,
      onDismiss: host.onDismiss,
    })
    created.push(host.el)

    pressEscape()

    expect(later.onDismiss).toHaveBeenCalledOnce()
    expect(host.onDismiss).not.toHaveBeenCalled()

    again()
  })

  it('包里层的那一层算在上面，哪怕它登记得更早', () => {
    const { el: outerEl, trigger: outerTrigger } = makeLayer('outer')
    created.push(outerEl)
    const outerDismiss = vi.fn()
    pushLayer({
      token: {},
      getContainer: () => outerEl,
      getTrigger: () => outerTrigger,
      dismissOnPointerOutside: true,
      dismissOnEscape: true,
      onDismiss: outerDismiss,
    })

    const inner = document.createElement('div')
    outerEl.append(inner)
    const innerDismiss = vi.fn()
    pushLayer({
      token: {},
      getContainer: () => inner,
      dismissOnPointerOutside: true,
      dismissOnEscape: true,
      onDismiss: innerDismiss,
    })

    pressEscape()

    expect(innerDismiss).toHaveBeenCalledOnce()
    expect(outerDismiss).not.toHaveBeenCalled()
  })
})

describe('关闭栈：登记了但不在屏幕上', () => {
  it('跳过不在屏幕上的层，把按键交给下面那层', () => {
    const host = openLayer('host')
    const idleTip = openLayer('tip', { getTrigger: undefined, isPresent: () => false })

    pressEscape()

    expect(idleTip.onDismiss).not.toHaveBeenCalled()
    expect(host.onDismiss).toHaveBeenCalledOnce()
  })

  it('同一个登记变成在屏幕上以后就能认领按键', () => {
    let isShowing = false
    const host = openLayer('host', { getContainer: undefined, getTrigger: undefined })
    const tip = openLayer('tip', { isPresent: () => isShowing })

    pressEscape()
    expect(host.onDismiss).toHaveBeenCalledOnce()
    expect(tip.onDismiss).not.toHaveBeenCalled()

    isShowing = true
    pressEscape()
    expect(tip.onDismiss).toHaveBeenCalledOnce()
  })
})

describe('关闭栈：边界情况', () => {
  it('输入法拼字中的 Escape 什么都不关，但仍然吃掉按键', () => {
    const layer = openLayer('solo')

    const composing = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })
    Object.defineProperty(composing, 'isComposing', { value: true })
    document.dispatchEvent(composing)

    expect(layer.onDismiss).not.toHaveBeenCalled()
    expect(composing.defaultPrevented).toBe(true)
  })

  it('层里已经有内容处理过的 Escape 不再重复关闭', () => {
    const layer = openLayer('solo')

    const claimed = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })
    claimed.preventDefault()
    document.dispatchEvent(claimed)

    expect(layer.onDismiss).not.toHaveBeenCalled()
  })

  it('按下才打开的层不会被这次按压自己关掉', () => {
    const trigger = document.createElement('button')
    document.body.append(trigger)
    const onDismiss = vi.fn()

    // 模拟「按下就打开」：在 pointerdown 的处理里登记。
    trigger.addEventListener('pointerdown', () => {
      pushLayer({
        token: {},
        getContainer: () => trigger,
        dismissOnPointerOutside: true,
        dismissOnEscape: true,
        onDismiss,
      })
    })

    pressDown(trigger)

    expect(onDismiss).not.toHaveBeenCalled()
    // 下一次按在外面的按压照常关闭它。
    pressDown(document.body)
    expect(onDismiss).toHaveBeenCalledOnce()
  })

  it('dismissOnEscape 为假的层把按键让给下面那层', () => {
    const lower = openLayer('lower')
    const upper = openLayer('upper', { dismissOnEscape: false })

    pressEscape()

    expect(upper.onDismiss).not.toHaveBeenCalled()
    expect(lower.onDismiss).toHaveBeenCalledOnce()
  })

  it('dismissOnPointerOutside 为假的层不会被点外面关掉', () => {
    const layer = openLayer('solo', { dismissOnPointerOutside: false })

    pressDown(document.body)

    expect(layer.onDismiss).not.toHaveBeenCalled()
  })

  it('isTopLayer 只认最上面那一层', () => {
    const lower = openLayer('lower')
    const upper = openLayer('upper')

    expect(isTopLayer(upper.token)).toBe(true)
    expect(isTopLayer(lower.token)).toBe(false)

    upper.remove()

    expect(isTopLayer(lower.token)).toBe(true)
  })

  it('按 Escape 走 onEscape，点外面走 onDismiss', () => {
    const { el, trigger } = makeLayer('menu')
    created.push(el)
    const onDismiss = vi.fn()
    const onEscape = vi.fn()
    pushLayer({
      token: {},
      getContainer: () => el,
      getTrigger: () => trigger,
      dismissOnPointerOutside: true,
      dismissOnEscape: true,
      onDismiss,
      onEscape,
    })

    pressEscape()
    expect(onEscape).toHaveBeenCalledOnce()
    expect(onDismiss).not.toHaveBeenCalled()

    pressDown(document.body)
    expect(onDismiss).toHaveBeenCalledOnce()
  })
})
