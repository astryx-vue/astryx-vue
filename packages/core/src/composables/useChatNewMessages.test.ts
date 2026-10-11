import type { UseChatNewMessagesReturn } from './useChatNewMessages.js'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'
import { CHAT_MESSAGE_CLASS, useChatNewMessages } from './useChatNewMessages.js'

interface Observed {
  el: Element
  callback: ResizeObserverCallback
}

const observed: Observed[] = []

class FakeResizeObserver {
  constructor(private readonly callback: ResizeObserverCallback) {}

  observe(el: Element): void {
    observed.push({ el, callback: this.callback })
    this.callback([{ target: el } as ResizeObserverEntry], this as unknown as ResizeObserver)
  }

  unobserve(): void {}

  disconnect(): void {}
}

vi.stubGlobal('ResizeObserver', FakeResizeObserver)

function message(text: string): HTMLElement {
  const el = document.createElement('article')
  el.className = CHAT_MESSAGE_CLASS
  el.textContent = text
  return el
}

describe('useChatNewMessages', () => {
  it('flags a new row only while the transcript is unlocked, and follows every resize', async () => {
    observed.length = 0
    const content = document.createElement('div')
    content.append(message('Hello'))
    const locked = ref(true)
    const resized = vi.fn()
    let api: UseChatNewMessagesReturn | undefined
    const Host = defineComponent({
      setup() {
        api = useChatNewMessages({ isLocked: locked, onResize: resized })
        api.contentRef(content)
        return () => null
      },
    })
    mount(Host)
    await nextTick()

    expect(resized).toHaveBeenCalledOnce()
    expect(api?.hasNewMessages.value).toBe(false)

    locked.value = false
    content.append(message('A reply'))
    observed[0]?.callback([{ target: content } as unknown as ResizeObserverEntry], {} as ResizeObserver)
    await nextTick()

    expect(api?.hasNewMessages.value).toBe(true)
    api?.dismiss()
    expect(api?.hasNewMessages.value).toBe(false)
  })
})
