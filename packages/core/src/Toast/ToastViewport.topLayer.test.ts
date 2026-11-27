import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { notifyTopLayerEntry } from '../layer/modalOutlet.js'
import ToastViewport from './ToastViewport.vue'

enableAutoUnmount(afterEach)

const proto = HTMLElement.prototype as unknown as Record<string, unknown>
let hidden: Element[] = []

beforeEach(() => {
  hidden = []
  proto.showPopover = function () {}
  proto.hidePopover = function (this: HTMLElement) {
    hidden.push(this)
  }
})

afterEach(() => {
  delete proto.showPopover
  delete proto.hidePopover
  vi.restoreAllMocks()
  document.body.innerHTML = ''
})

describe('toast viewport and a non-modal top-layer surface', () => {
  it('re-enters the top layer after a scrimless drawer enters it, so toasts stay above', async () => {
    mount(ToastViewport, { attachTo: document.body })
    await nextTick()
    const viewport = document.querySelector('.astryx-toast-viewport')
    expect(hidden).toHaveLength(0)

    notifyTopLayerEntry()
    await nextTick()
    expect(hidden).toEqual([viewport])
  })
})
