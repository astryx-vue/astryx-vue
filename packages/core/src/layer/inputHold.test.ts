/**
 * @file inputHold.test.ts
 * @output 输入暂挡：满屏挡板挡住手指、放开后照常；只挡自己时周围页面照常；
 *   静止的鼠标从挡板穿过去；挡板升起前按下的手指抬起时穿过挡板；手势宿主问得到；
 *   退场保留焦点的暂挡只放行 Tab、焦点离开才变 inert、放开后不再变 inert
 * @position packages/core/src/layer/inputHold.ts 的单元测试
 */

import { afterEach, describe, expect, it, vi } from 'vitest'
import { holdsTouch } from '../gestures/touchHold'
import { subscribeInput } from '../utils/inputStream'
import { holdInput, holdKeptInside, isInHeldLayer, isInputShield } from './inputHold'
import { CLICK_WINDOW_MS } from './inputHoldPress'
import { openings } from './inputHoldShield'

const stops: (() => void)[] = []

afterEach(() => {
  for (const stop of stops.splice(0))
    stop()
  document.body.innerHTML = ''
  vi.useRealTimers()
})

/** 页面上的按压反馈：让输入流记下指针（真实页面上总有订阅者）。 */
function listenLikePressFeedback(): void {
  for (const type of ['pointerdown', 'pointermove', 'pointerup', 'pointercancel'] as const)
    stops.push(subscribeInput(window, type, () => {}))
}

function pointer(target: EventTarget, type: string, pointerType: string, init: PointerEventInit = {}): boolean {
  return target.dispatchEvent(new PointerEvent(type, { bubbles: true, cancelable: true, pointerType, ...init }))
}

function deferred(): { promise: Promise<void>, resolve: () => void } {
  let resolve!: () => void
  const promise = new Promise<void>((done) => {
    resolve = done
  })
  return { promise, resolve }
}

function setUp(): { layer: HTMLElement, inside: HTMLButtonElement, page: HTMLButtonElement } {
  const page = document.createElement('button')
  const layer = document.createElement('div')
  const inside = document.createElement('button')
  layer.append(inside)
  document.body.append(page, layer)
  return { layer, inside, page }
}

function shieldOf(layer: Element): HTMLElement | null {
  return [...layer.children].find(child => isInputShield(child)) as HTMLElement | undefined ?? null
}

describe('holdInput', () => {
  it('holds a finger anywhere while a modal layer enters, and lets it through once the entrance ends', async () => {
    listenLikePressFeedback()
    const { layer, page } = setUp()
    const heard = vi.fn()
    page.addEventListener('pointerdown', heard)
    page.addEventListener('click', heard)
    pointer(page, 'pointermove', 'touch')
    const entrance = deferred()
    holdInput(layer, { until: entrance.promise, scope: 'viewport' })

    const shield = shieldOf(layer)!
    expect(shield.getAttribute('popover')).toBe('manual')
    expect(shield.style.position).toBe('fixed')
    expect(isInHeldLayer(layer)).toBe(true)
    pointer(page, 'pointerdown', 'touch', { pointerId: 3 })
    pointer(page, 'pointerup', 'touch', { pointerId: 3 })
    page.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 }))
    expect(heard).not.toHaveBeenCalled()

    entrance.resolve()
    await entrance.promise
    await Promise.resolve()
    expect(shieldOf(layer)).toBeNull()
    expect(isInHeldLayer(layer)).toBe(false)
    vi.useFakeTimers()
    vi.advanceTimersByTime(CLICK_WINDOW_MS + 1)
    pointer(page, 'pointerdown', 'touch', { pointerId: 4 })
    expect(heard).toHaveBeenCalledOnce()
  })

  it('holds only what lands on a non-modal layer, and the page around it stays live', () => {
    listenLikePressFeedback()
    const { layer, inside, page } = setUp()
    pointer(page, 'pointermove', 'touch')
    const release = holdInput(layer, { until: new Promise(() => {}), scope: 'surface' })
    const onPage = vi.fn()
    const onLayer = vi.fn()
    page.addEventListener('pointerdown', onPage)
    inside.addEventListener('pointerdown', onLayer)

    expect(shieldOf(layer)!.style.position).toBe('absolute')
    pointer(page, 'pointerdown', 'touch', { pointerId: 5 })
    pointer(inside, 'pointerdown', 'touch', { pointerId: 6 })
    expect(onPage).toHaveBeenCalledOnce()
    expect(onLayer).not.toHaveBeenCalled()
    release()
    expect(shieldOf(layer)).toBeNull()
  })

  it('lets a still mouse press through: no hits at all when the mouse was last, an opening where it rests otherwise', () => {
    listenLikePressFeedback()
    const first = setUp()
    pointer(document.body, 'pointermove', 'mouse', { clientX: 40, clientY: 50 })
    const releaseFirst = holdInput(first.layer, { until: new Promise(() => {}), scope: 'viewport' })
    expect(shieldOf(first.layer)!.style.pointerEvents).toBe('none')
    releaseFirst()

    // 一根手指后来点过：挡板接点击，只在鼠标停着的那一点留个 4px 见方的口子。
    pointer(document.body, 'pointerdown', 'touch', { pointerId: 8, clientX: 300, clientY: 300 })
    pointer(document.body, 'pointerup', 'touch', { pointerId: 8, clientX: 300, clientY: 300 })
    const second = setUp()
    holdInput(second.layer, { until: new Promise(() => {}), scope: 'viewport' })
    const shield = shieldOf(second.layer)!
    expect(shield.style.pointerEvents).toBe('auto')
    expect(shield.style.clipPath).toContain('38px 48px')
    expect(shield.style.clipPath).toContain('42px 52px')

    // 鼠标一动，挡板就让开。
    pointer(document.body, 'pointermove', 'mouse', { clientX: 60, clientY: 70, buttons: 0 })
    expect(shield.style.pointerEvents).toBe('none')
  })

  it('leaves an opening at a finger that went down before the shield, so its lift lands on what is beneath', () => {
    listenLikePressFeedback()
    const { layer } = setUp()
    pointer(document.body, 'pointerdown', 'touch', { pointerId: 11, clientX: 100, clientY: 120 })
    holdInput(layer, { until: new Promise(() => {}), scope: 'viewport' })
    const shield = shieldOf(layer)!
    expect(shield.style.clipPath).toContain('98px 118px')
    expect(shield.style.clipPath).toContain('102px 122px')

    const lifted = vi.fn()
    document.body.addEventListener('pointerup', lifted)
    pointer(document.body, 'pointerup', 'touch', { pointerId: 11, clientX: 100, clientY: 120 })
    // 这一下不是暂挡拦下的：它的抬起照常送到页面，口子随之合上。
    expect(lifted).toHaveBeenCalledOnce()
    expect(shield.style.clipPath).not.toContain('98px 118px')
  })

  it('merges overlapping openings into one box', () => {
    expect(openings([{ x: 10, y: 10 }, { x: 12, y: 11 }])).toEqual([{ left: 8, right: 14, top: 8, bottom: 13 }])
    expect(openings([{ x: 10, y: 10 }, { x: 30, y: 30 }])).toHaveLength(2)
  })

  it('tells the gesture host to drop a finger on a held layer, and nothing once released', () => {
    listenLikePressFeedback()
    const { layer, inside, page } = setUp()
    pointer(page, 'pointerdown', 'touch', { pointerId: 20 })
    pointer(page, 'pointerup', 'touch', { pointerId: 20 })
    const release = holdInput(layer, { until: new Promise(() => {}), scope: 'viewport' })
    expect(holdsTouch(inside)).toBe(true)
    expect(holdsTouch(shieldOf(layer)!)).toBe(true)
    release()
    expect(holdsTouch(inside)).toBe(false)
  })
})

describe('holdKeptInside', () => {
  it('makes the layer inert and hidden at once when focus is not inside, and restores it on release', () => {
    const { layer } = setUp()
    layer.setAttribute('aria-hidden', 'false')
    const release = holdKeptInside(layer, new Promise(() => {}))
    expect(layer.hasAttribute('inert')).toBe(true)
    expect(layer.getAttribute('aria-hidden')).toBe('true')
    expect(layer.style.pointerEvents).toBe('none')
    release()
    expect(layer.hasAttribute('inert')).toBe(false)
    expect(layer.getAttribute('aria-hidden')).toBe('false')
    expect(layer.style.pointerEvents).toBe('')
  })

  it('keeps focus visible inside, lets only Tab reach it, and goes inert once focus leaves', async () => {
    const { layer, inside, page } = setUp()
    inside.focus()
    holdKeptInside(layer, new Promise(() => {}))
    expect(layer.hasAttribute('inert')).toBe(false)
    expect(layer.hasAttribute('aria-hidden')).toBe(false)

    const keys: string[] = []
    const clicked = vi.fn()
    inside.addEventListener('keydown', event => keys.push(event.key))
    inside.addEventListener('click', clicked)
    inside.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }))
    inside.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }))
    inside.click()
    expect(keys).toEqual(['Tab'])
    expect(clicked).not.toHaveBeenCalled()

    page.focus()
    await Promise.resolve()
    expect(layer.hasAttribute('inert')).toBe(true)
    expect(layer.getAttribute('aria-hidden')).toBe('true')
  })

  it('never makes the layer inert after its release, even from a focus check queued before it', async () => {
    const { layer, inside, page } = setUp()
    inside.focus()
    const release = holdKeptInside(layer, new Promise(() => {}))
    page.focus()
    release()
    await Promise.resolve()
    expect(layer.hasAttribute('inert')).toBe(false)
    expect(layer.hasAttribute('aria-hidden')).toBe(false)
  })
})
