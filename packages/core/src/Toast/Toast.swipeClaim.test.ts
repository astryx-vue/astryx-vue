import { mount } from '@vue/test-utils'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { coarsePrimaryPointer } from '../gestures/__tests__/pointerQuery'
import { exposeTouchEvents, touch } from '../gestures/__tests__/touchEvents'
import Toast from './Toast.vue'

// A phone: the document's gesture host reads fingers from Touch Events and
// listens only where the primary pointer is coarse. Set before any toast
// mounts, since the host outlives a test.
let restoreTouchEvents: () => void = () => {}
let restorePointer: () => void = () => {}
beforeAll(() => {
  restoreTouchEvents = exposeTouchEvents()
  restorePointer = coarsePrimaryPointer()
})
afterAll(() => {
  restorePointer()
  restoreTouchEvents()
})

function finger(type: string, target: Element, y: number, time: number): void {
  touch(type, target, { id: 1, x: 0, y }, time, type === 'touchend')
}

describe('toast swipe claim', () => {
  it('leaves the touch to the page when its first move goes away from the edge', async () => {
    const wrapper = mount(Toast, { attachTo: document.body, props: { body: 'Saved', isAutoHide: false } })
    await nextTick()
    const root = wrapper.get('.astryx-toast').element as HTMLElement

    finger('touchstart', root, 100, 1000)
    finger('touchmove', root, 97, 1010)
    finger('touchmove', root, 140, 1030)
    finger('touchmove', root, 200, 1050)
    finger('touchend', root, 200, 1300)
    await nextTick()

    expect(wrapper.emitted('dismiss')).toBeUndefined()
    expect(root.style.getPropertyValue('--_toast-swipe-y')).toBe('')
    wrapper.unmount()
  })

  it('claims a touch whose first move heads for the edge', async () => {
    const wrapper = mount(Toast, { attachTo: document.body, props: { body: 'Saved', isAutoHide: false } })
    await nextTick()
    const root = wrapper.get('.astryx-toast').element as HTMLElement

    finger('touchstart', root, 100, 2000)
    finger('touchmove', root, 103, 2010)
    const move = new Event('touchmove', { bubbles: true, cancelable: true })
    const entry = { identifier: 1, clientX: 0, clientY: 140, target: root }
    Object.defineProperty(move, 'changedTouches', { value: [entry] })
    Object.defineProperty(move, 'touches', { value: [entry] })
    Object.defineProperty(move, 'timeStamp', { value: 2030 })
    root.dispatchEvent(move)

    expect(move.defaultPrevented).toBe(true)
    finger('touchend', root, 200, 2050)
    await nextTick()
    expect(wrapper.emitted('dismiss')?.[0]).toEqual(['manual'])
    wrapper.unmount()
  })
})
