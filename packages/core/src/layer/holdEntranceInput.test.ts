/**
 * @file holdEntranceInput.test.ts
 * @output 进场暂挡：手指下有进场在播才挡，播完或到上限放开；精细指针、没有进场、
 *   无限循环的动画都不挡；非模态只挡浮层自己。Dialog、Drawer、MobileNav 打开时
 *   在手指下挡住进场，关闭时放开；关闭中的 BottomSheet 焦点留在里面时不藏内容
 * @position packages/core/src/layer/holdEntranceInput.ts 及其调用方的测试
 */

import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import BottomSheet from '../BottomSheet/BottomSheet.vue'
import { resetScrollLockForTest } from '../composables/internal/scrollLock.js'
import Dialog from '../Dialog/Dialog.vue'
import { ensureDialogModalApi } from '../Dialog/testUtils.js'
import Drawer from '../Drawer/Drawer.vue'
import { pointerQuery } from '../gestures/__tests__/pointerQuery'
import MobileNav from '../MobileNav/MobileNav.vue'
import { resetDismissStackForTests } from './dismissStack.js'
import { holdEntranceInput } from './holdEntranceInput'
import { isInputShield } from './inputHold'

beforeAll(ensureDialogModalApi)

const restores: (() => void)[] = []

afterEach(() => {
  for (const restore of restores.splice(0))
    restore()
  resetScrollLockForTest()
  resetDismissStackForTests()
  document.body.innerHTML = ''
  vi.useRealTimers()
})

interface FakeAnimation {
  playState: string
  effect: { getComputedTiming: () => { endTime: number } }
  finished: Promise<void>
}

/** jsdom 不跑 CSS 动画：给带 `selector` 的元素一个正在播的进场，返回让它播完的函数。 */
function stubEntrance(selector: string, endTime = 400): () => void {
  let finish!: () => void
  const finished = new Promise<void>((resolve) => {
    finish = resolve
  })
  const animation: FakeAnimation = { playState: 'running', effect: { getComputedTiming: () => ({ endTime }) }, finished }
  const proto = Element.prototype as unknown as { getAnimations?: (this: Element) => FakeAnimation[] }
  const original = proto.getAnimations
  proto.getAnimations = function (this: Element) {
    return this.matches(selector) ? [animation] : []
  }
  restores.push(() => {
    if (original == null)
      delete proto.getAnimations
    else
      proto.getAnimations = original
  })
  return finish
}

function coarse(isCoarse = true): void {
  const query = pointerQuery(isCoarse)
  restores.push(query.restore)
}

const shieldIn = (layer: Element | null) => [...(layer?.children ?? [])].find(child => isInputShield(child)) as HTMLElement | undefined

describe('holdEntranceInput', () => {
  it('holds a finger until the entrance ends, over the viewport for a modal layer', async () => {
    coarse()
    const finish = stubEntrance('.layer')
    const layer = document.createElement('div')
    layer.className = 'layer'
    document.body.append(layer)
    const release = holdEntranceInput(layer)
    expect(release).toBeTypeOf('function')
    expect(shieldIn(layer)?.style.position).toBe('fixed')
    finish()
    await flushPromises()
    expect(shieldIn(layer)).toBeUndefined()
  })

  it('holds only the layer\'s own box for a non-modal layer, and lets go at the cap', async () => {
    coarse()
    stubEntrance('.layer')
    const layer = document.createElement('div')
    layer.className = 'layer'
    document.body.append(layer)
    vi.useFakeTimers()
    holdEntranceInput(layer, { isModal: false, capMs: 300 })
    expect(shieldIn(layer)?.style.position).toBe('absolute')
    await vi.advanceTimersByTimeAsync(300)
    expect(shieldIn(layer)).toBeUndefined()
  })

  it('holds nothing under a fine pointer, without an entrance, or for an animation that never ends', () => {
    const layer = document.createElement('div')
    layer.className = 'layer'
    document.body.append(layer)
    coarse(false)
    stubEntrance('.layer')
    expect(holdEntranceInput(layer)).toBeNull()
    restores.splice(0).forEach(restore => restore())

    coarse()
    stubEntrance('.other')
    expect(holdEntranceInput(layer)).toBeNull()
    stubEntrance('.layer', Infinity)
    expect(holdEntranceInput(layer)).toBeNull()
  })
})

describe('the entrance hold in components', () => {
  it('a dialog opened under a finger takes no input until it has entered, and lets go when it closes', async () => {
    coarse()
    stubEntrance('dialog')
    const wrapper = mount(Dialog, { props: { isOpen: false }, slots: { default: () => 'Body' }, attachTo: document.body })
    await wrapper.setProps({ isOpen: true })
    const dialog = wrapper.get('dialog').element
    expect(shieldIn(dialog)).toBeDefined()
    await wrapper.setProps({ isOpen: false })
    expect(shieldIn(dialog)).toBeUndefined()
    wrapper.unmount()
  })

  it('a dialog opened with a mouse as the primary pointer holds nothing', async () => {
    coarse(false)
    stubEntrance('dialog')
    const wrapper = mount(Dialog, { props: { isOpen: false }, slots: { default: () => 'Body' }, attachTo: document.body })
    await wrapper.setProps({ isOpen: true })
    expect(shieldIn(wrapper.get('dialog').element)).toBeUndefined()
    wrapper.unmount()
  })

  it('a drawer opened under a finger holds input while it slides in', async () => {
    coarse()
    const finish = stubEntrance('.astryx-drawer')
    const wrapper = mount(Drawer, { props: { isOpen: false, label: 'Filters' }, slots: { default: () => 'Body' }, attachTo: document.body })
    await wrapper.setProps({ isOpen: true })
    const dialog = document.querySelector('dialog')
    expect(shieldIn(dialog)).toBeDefined()
    finish()
    await flushPromises()
    expect(shieldIn(dialog)).toBeUndefined()
    wrapper.unmount()
  })

  it('a mobile nav opened under a finger holds input while its panel slides in', async () => {
    coarse()
    stubEntrance('.astryx-mobile-nav__drawer')
    const wrapper = mount(MobileNav, { props: { isOpen: false, header: 'Menu' }, slots: { default: () => 'Inbox' }, attachTo: document.body })
    await wrapper.setProps({ isOpen: true })
    await nextTick()
    const dialog = wrapper.get('dialog').element
    expect(shieldIn(dialog)).toBeDefined()
    await wrapper.setProps({ isOpen: false })
    await nextTick()
    expect(shieldIn(dialog)).toBeUndefined()
    wrapper.unmount()
  })
})

describe('the closing bottom sheet', () => {
  it('keeps focus that stays inside visible and lets only Tab reach it, then goes inert once focus leaves', async () => {
    // 抽屉滑出要 300ms，退场期间才看得到暂挡。
    const style = document.createElement('style')
    style.textContent = '.astryx-bottom-sheet { transition-property: transform; transition-duration: 300ms; }'
    document.head.append(style)
    restores.push(() => style.remove())
    const outside = document.createElement('button')
    document.body.append(outside)
    const wrapper = mount(BottomSheet, {
      props: { isOpen: true, label: 'Share' },
      slots: { default: () => h('button', { class: 'inside' }, 'Copy') },
      attachTo: document.body,
    })
    await flushPromises()
    const dialog = wrapper.get('dialog').element
    const inside = dialog.querySelector<HTMLButtonElement>('.inside')!
    inside.focus()
    const keys: string[] = []
    inside.addEventListener('keydown', event => keys.push(event.key))

    // 打开前没有焦点可还：关闭时焦点还留在抽屉里。
    await wrapper.setProps({ isOpen: false })
    await nextTick()
    expect(dialog.classList).toContain('astryx-bottom-sheet-dialog--closing')
    expect(document.activeElement).toBe(inside)
    expect(dialog.hasAttribute('inert')).toBe(false)
    expect(dialog.hasAttribute('aria-hidden')).toBe(false)
    expect(dialog.style.pointerEvents).toBe('none')
    inside.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }))
    inside.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }))
    expect(keys).toEqual(['Tab'])

    outside.focus()
    await Promise.resolve()
    expect(dialog.hasAttribute('inert')).toBe(true)
    expect(dialog.getAttribute('aria-hidden')).toBe('true')
    wrapper.unmount()
  })
})
