import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import Selector from './Selector.vue'

const fruits = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
]

let reports: Array<(entries: unknown[]) => void> = []
const targets: Element[] = []

beforeEach(() => {
  reports = []
  class FakeResizeObserver {
    constructor(callback: (entries: unknown[]) => void) {
      reports.push(callback)
    }

    observe(element: Element): void {
      targets.push(element)
    }

    unobserve(): void {}
    disconnect(): void {}
  }
  vi.stubGlobal('ResizeObserver', FakeResizeObserver)
})

afterEach(() => {
  vi.unstubAllGlobals()
  document.body.innerHTML = ''
})

async function flush(): Promise<void> {
  await nextTick()
  await nextTick()
}

describe('selector 选中项盖在触发器上时跟着列表的尺寸走', () => {
  it('列表自己的尺寸变了（选项增减）就重新量，选中行仍然对着触发器', async () => {
    const wrapper = mount(Selector, {
      attachTo: document.body,
      props: { label: 'Fruit', options: fruits, modelValue: 'banana' },
    })
    const field = wrapper.get('.astryx-selector-field').element
    vi.spyOn(field, 'getBoundingClientRect').mockReturnValue({ top: 300, bottom: 336, left: 0, right: 200, width: 200, height: 36, x: 0, y: 300, toJSON: () => ({}) })
    const listbox = document.querySelector<HTMLElement>('.astryx-selector-listbox')!
    const selected = listbox.querySelector<HTMLElement>('.astryx-selector-option.is-selected')!
    Object.defineProperty(selected, 'offsetTop', { configurable: true, value: 40 })
    await wrapper.get('button.astryx-selector-trigger').trigger('click')
    await flush()
    expect(listbox.style.top).toBe('260px')

    // 选中项上面又长出一行：它的偏移变大，列表要更往上提。
    Object.defineProperty(selected, 'offsetTop', { configurable: true, value: 76 })
    expect(targets).toContain(listbox)
    for (const report of reports)
      report([{ target: listbox }])
    await flush()
    expect(listbox.style.top).toBe('224px')
    wrapper.unmount()
  })
})
