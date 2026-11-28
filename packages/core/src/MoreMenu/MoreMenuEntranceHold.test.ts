/**
 * @file MoreMenuEntranceHold.test.ts
 * @input vitest (happy-dom)、一个能控制结束时间的进场动画替身、假的 matchMedia
 * @output 手机和平板上，顶层菜单进场期间输入暂挡盖住视口，进场播完就放开；鼠标下不挡；
 *   子菜单的飞出面板不挡
 */
import type { MoreMenuOption } from './types.js'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { installMatchMedia } from '../composables/testing/fakeMatchMedia.js'
import { isInHeldLayer, isInputShield } from '../layer/inputHold.js'
import MoreMenu from './MoreMenu.vue'

enableAutoUnmount(afterEach)

const LAYER = '.astryx-more-menu__layer'

let endEntrance: () => void = () => {}

beforeEach(() => {
  // 菜单浮层的 CSS 进场：显示出来时正在播，结束时间由测试决定。
  const finished = new Promise<void>((resolve) => {
    endEntrance = resolve
  })
  HTMLElement.prototype.getAnimations = function (this: HTMLElement) {
    if (!this.matches(`${LAYER}[data-placement]`))
      return []
    return [{
      playState: 'running',
      finished,
      effect: { getComputedTiming: () => ({ endTime: 165 }) },
    }] as unknown as Animation[]
  }
})

afterEach(() => {
  Reflect.deleteProperty(HTMLElement.prototype, 'getAnimations')
  document.body.innerHTML = ''
  vi.unstubAllGlobals()
})

const ITEMS: MoreMenuOption[] = [
  { label: 'Edit' },
  { label: 'Move to', items: [{ label: 'Inbox' }, { label: 'Archive' }] },
]

async function open(): Promise<HTMLElement> {
  mount(MoreMenu, { attachTo: document.body, props: { items: ITEMS } })
  document.querySelector<HTMLButtonElement>('.astryx-more-menu button')!.click()
  await flushPromises()
  return document.querySelector<HTMLElement>(LAYER)!
}

const hasShield = (layer: Element): boolean => [...layer.children].some(child => isInputShield(child))

describe('more menu entrance hold', () => {
  it('holds a finger’s input away while the menu enters on a touch screen, and lets it through once it has entered', async () => {
    installMatchMedia(query => query.includes('pointer: coarse'))
    const layer = await open()
    expect(layer.dataset.placement).toBeDefined()
    expect(isInHeldLayer(layer)).toBe(true)
    expect(hasShield(layer)).toBe(true)

    endEntrance()
    await flushPromises()
    expect(isInHeldLayer(layer)).toBe(false)
    expect(hasShield(layer)).toBe(false)
  })

  it('holds nothing under a mouse', async () => {
    installMatchMedia(() => false)
    const layer = await open()
    expect(isInHeldLayer(layer)).toBe(false)
    expect(hasShield(layer)).toBe(false)
  })

  it('holds nothing while a submenu flies out', async () => {
    installMatchMedia(query => query.includes('pointer: coarse'))
    // 顶层菜单还在进场（键盘不受挡），飞出面板的进场也一直在播：挡了就看得出来。
    await open()

    const row = [...document.querySelectorAll<HTMLElement>('[role="menuitem"]')].find(item => item.textContent?.includes('Move to'))!
    row.focus()
    row.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'ArrowRight' }))
    await flushPromises()

    const flyout = document.querySelector<HTMLElement>(`${LAYER}[data-level="1"]`)!
    expect(flyout).not.toBeNull()
    expect(isInHeldLayer(flyout)).toBe(false)
    expect(hasShield(flyout)).toBe(false)
  })
})
