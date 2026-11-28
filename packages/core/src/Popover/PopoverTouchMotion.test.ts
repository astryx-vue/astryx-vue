/**
 * @file PopoverTouchMotion.test.ts
 * @input vitest (happy-dom)、一个记录动画的 `Element.animate` 替身、假的 matchMedia
 * @output 组件层面：手指下打开的 Popover 从触发器长出（关掉 CSS 进场、从相接处
 *   缩放），关闭时在退场副本上缩回；鼠标下保留 CSS 进场，什么都不播。
 */
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { installMatchMedia } from '../composables/testing/fakeMatchMedia.js'
import Popover from './Popover.vue'
import { findPopoverExitCopy } from './popoverExitCopy.js'

enableAutoUnmount(afterEach)

interface Recorded {
  target: Element
  keyframes: Keyframe[]
}

let recorded: Recorded[] = []

beforeEach(() => {
  recorded = []
  HTMLElement.prototype.animate = function (this: HTMLElement, keyframes) {
    const animation = {
      target: this,
      keyframes: keyframes as Keyframe[],
      startTime: performance.now() as number | null,
      finished: new Promise(() => {}),
      addEventListener() {},
      cancel() {},
    }
    recorded.push(animation)
    return animation as unknown as Animation
  }
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
    if (this.classList.contains('astryx-popover'))
      return DOMRect.fromRect({ x: 41, y: 204, width: 320, height: 253 })
    if (this.classList.contains('astryx-popover-trigger'))
      return DOMRect.fromRect({ x: 141, y: 160, width: 120, height: 44 })
    return DOMRect.fromRect({ x: 0, y: 0, width: 0, height: 0 })
  })
})

afterEach(() => {
  Reflect.deleteProperty(HTMLElement.prototype, 'animate')
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  document.body.innerHTML = ''
})

function render() {
  mount(Popover, {
    attachTo: document.body,
    props: { label: 'Filters' },
    slots: { default: '<button type="button">Filters</button>', content: '<button type="button">Apply</button>' },
  })
  const trigger = document.querySelector('.astryx-popover-trigger > button') as HTMLButtonElement
  const surface = document.querySelector('.astryx-popover') as HTMLElement
  return { trigger, surface }
}

function scaled(target: Element): Recorded[] {
  return recorded.filter(animation => animation.target === target && animation.keyframes.some(frame => 'scale' in frame))
}

describe('popover touch motion', () => {
  it('grows out of the trigger under a finger and shrinks back into it on a copy as it closes', async () => {
    installMatchMedia(query => query.includes('pointer: coarse'))
    const { trigger, surface } = render()
    trigger.click()
    await flushPromises()
    await vi.waitFor(() => expect(scaled(surface)).toHaveLength(1))

    expect(surface.style.getPropertyValue('animation-name')).toBe('none')
    // 起点在浮层和触发器相接处：浮层上边、正对触发器中心。
    expect(surface.style.getPropertyValue('transform-origin')).toBe('160px 0px')
    const [sx] = String(scaled(surface)[0].keyframes[0].scale).split(' ').map(Number)
    expect(sx).toBeLessThan(0.05)

    trigger.click()
    await flushPromises()
    const copy = findPopoverExitCopy(document.body)
    expect(copy).not.toBeNull()
    expect(scaled(copy!)).toHaveLength(1)
    expect(surface.style.display).toBe('none')
  })

  it('keeps the layer’s own CSS entrance under a mouse', async () => {
    installMatchMedia(() => false)
    const { trigger, surface } = render()
    trigger.click()
    await flushPromises()
    await new Promise(resolve => requestAnimationFrame(resolve))
    expect(scaled(surface)).toHaveLength(0)
    expect(surface.style.getPropertyValue('animation-name')).toBe('')

    trigger.click()
    await flushPromises()
    expect(findPopoverExitCopy(document.body)).toBeNull()
  })
})
