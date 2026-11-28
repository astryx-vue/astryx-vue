/**
 * @file DropdownMenuEntranceHold.test.ts
 * @input vitest (happy-dom)、一个能控制结束时间的进场动画替身、假的 matchMedia
 * @output 手机和平板上，菜单进场期间输入暂挡盖住视口，进场播完就放开；鼠标下不挡；
 *   按压模型的命中测试看穿挡板，打开菜单的那根手指照样落在行上
 */
import type { DropdownMenuOption } from './types.js'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { resolvePoint } from '../composables/internal/menuPressDom.js'
import { installMatchMedia } from '../composables/testing/fakeMatchMedia.js'
import { resetMenuPress } from '../composables/useMenuPress.js'
import { holdInput, isInHeldLayer, isInputShield } from '../layer/inputHold.js'
import DropdownMenu from './DropdownMenu.vue'

enableAutoUnmount(afterEach)

let endEntrance: () => void = () => {}

beforeEach(() => {
  // 菜单浮层的 CSS 进场：显示出来时正在播，结束时间由测试决定。
  const finished = new Promise<void>((resolve) => {
    endEntrance = resolve
  })
  HTMLElement.prototype.getAnimations = function (this: HTMLElement) {
    if (!this.matches('.astryx-dropdown-menu[data-placement]') || this.style.display === 'none')
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
  resetMenuPress()
  vi.unstubAllGlobals()
})

function items(): DropdownMenuOption[] {
  return [
    { label: 'Edit project', onClick: vi.fn() },
    { label: 'Duplicate project', onClick: vi.fn() },
  ]
}

async function open(): Promise<HTMLElement> {
  mount(DropdownMenu, { attachTo: document.body, props: { items: items() } })
  const trigger = document.querySelector<HTMLButtonElement>('.astryx-dropdown-menu-trigger > .astryx-button')!
  trigger.click()
  await flushPromises()
  return document.querySelector<HTMLElement>('.astryx-dropdown-menu')!
}

describe('dropdown menu entrance hold', () => {
  it('holds a finger’s input away while the menu enters on a touch screen, and lets it through once it has entered', async () => {
    installMatchMedia(query => query.includes('pointer: coarse'))
    const surface = await open()
    expect(surface.style.display).not.toBe('none')
    expect(isInHeldLayer(surface)).toBe(true)
    expect([...surface.children].some(child => isInputShield(child))).toBe(true)

    endEntrance()
    await flushPromises()
    expect(isInHeldLayer(surface)).toBe(false)
  })

  it('holds nothing under a mouse', async () => {
    installMatchMedia(() => false)
    const surface = await open()
    expect(surface.style.display).not.toBe('none')
    expect(isInHeldLayer(surface)).toBe(false)
  })

  it('lets the press in flight see through the hold’s shield to the row under it', () => {
    const menu = document.createElement('div')
    const row = document.createElement('div')
    row.setAttribute('role', 'menuitem')
    menu.append(row)
    document.body.append(menu)
    const release = holdInput(menu, { until: new Promise(() => {}), scope: 'viewport' })
    const shield = [...menu.children].find(child => isInputShield(child))!
    Object.defineProperty(document, 'elementFromPoint', { configurable: true, value: () => shield })
    Object.defineProperty(document, 'elementsFromPoint', { configurable: true, value: () => [shield, row, menu] })
    try {
      const event = new PointerEvent('pointermove', { clientX: 10, clientY: 10, pointerType: 'touch' })
      const point = resolvePoint(event, document, { menu, trigger: null, itemSelector: '[role="menuitem"]' })
      expect(point.row).toBe(row)
      expect(point.isInMenu).toBe(true)
    }
    finally {
      release()
      Reflect.deleteProperty(document, 'elementFromPoint')
      Reflect.deleteProperty(document, 'elementsFromPoint')
    }
  })
})
